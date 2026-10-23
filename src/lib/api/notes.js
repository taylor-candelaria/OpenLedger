import { z } from 'zod'
import { ApiError, fetchJSON } from './client.js'

const SOURCE = 'SimplyCoding Todo App API'
const BASE = '/api/notes'
const JSON_HEADERS = { 'Content-Type': 'application/json' }

const todo = z
  .object({
    _id: z.string(),
    task: z.string(),
    dueDate: z.string().nullish(),
    isCompleted: z.boolean().nullish(),
    createdAt: z.string().nullish(),
    updatedAt: z.string().nullish(),
  })
  .passthrough()

export function encodeTask({ title, body = '', dataset = null }) {
  return JSON.stringify({ v: 1, title: title.trim(), body: body.trim(), dataset: dataset ?? null })
}

export function parseTask(task) {
  try {
    const data = JSON.parse(task)
    if (data && typeof data === 'object' && data.v === 1 && typeof data.title === 'string') {
      return {
        title: data.title,
        body: typeof data.body === 'string' ? data.body : '',
        dataset: data.dataset && typeof data.dataset.url === 'string' ? data.dataset : null,
      }
    }
  } catch {
  }
  return { title: task, body: '', dataset: null }
}

export function toNote(t) {
  const { title, body, dataset } = parseTask(t.task)
  return {
    id: t._id,
    title,
    body,
    dataset,
    revisitBy: t.dueDate ? t.dueDate.slice(0, 10) : null,
    reviewed: Boolean(t.isCompleted),
    createdAt: t.createdAt ?? null,
    updatedAt: t.updatedAt ?? null,
  }
}

export async function listNotes({ signal } = {}) {
  const rows = await fetchJSON(`${BASE}/get`, z.array(todo), { signal, source: SOURCE })
  return rows.map(toNote).sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
}

export async function createNote({ title, body, dataset, revisitBy }) {
  const payload = { task: encodeTask({ title, body, dataset }) }
  if (revisitBy) payload.dueDate = revisitBy
  const t = await fetchJSON(`${BASE}/post`, todo, {
    source: SOURCE,
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  })
  return toNote(t)
}

export async function updateNote(current, changes) {
  const payload = {}
  if ('title' in changes || 'body' in changes) {
    payload.task = encodeTask({
      title: changes.title ?? current.title,
      body: changes.body ?? current.body,
      dataset: current.dataset,
    })
  }
  if (changes.revisitBy && changes.revisitBy !== current.revisitBy) payload.dueDate = changes.revisitBy
  if (!Object.keys(payload).length) return current
  const t = await fetchJSON(`${BASE}/put/${encodeURIComponent(current.id)}`, todo, {
    source: SOURCE,
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  })
  return toNote(t)
}

export async function toggleNote(id) {
  const t = await fetchJSON(`${BASE}/toggle/${encodeURIComponent(id)}`, todo, {
    source: SOURCE,
    method: 'PATCH',
  })
  return toNote(t)
}

export async function deleteNote(id) {
  let res
  try {
    res = await fetch(`${BASE}/delete/${encodeURIComponent(id)}`, { method: 'DELETE' })
  } catch {
    throw new ApiError(`Couldn’t reach ${SOURCE}. Check your connection and try again.`, { source: SOURCE })
  }
  const text = await res.text()
  if (!res.ok) throw new ApiError(`${SOURCE} responded with an error (${res.status}).`, { status: res.status, source: SOURCE })
  return text
}
