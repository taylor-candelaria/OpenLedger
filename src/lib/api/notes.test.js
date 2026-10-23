import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createNote, deleteNote, encodeTask, listNotes, parseTask, toggleNote, updateNote } from './notes.js'

const todo = (over = {}) => ({
  _id: 'abc123',
  task: encodeTask({ title: 'Check NYC debt data', body: 'Compare with ACFR', dataset: null }),
  dueDate: '2026-10-28T00:00:00.000Z',
  isCompleted: false,
  user: 'openledger-taylor',
  createdAt: '2026-10-21T15:00:00.000Z',
  updatedAt: '2026-10-21T15:00:00.000Z',
  ...over,
})

function reply(body, { status = 200, text = false } = {}) {
  return Promise.resolve(
    new Response(text ? body : JSON.stringify(body), {
      status,
      headers: { 'Content-Type': text ? 'text/plain' : 'application/json' },
    }),
  )
}

let fetchMock
beforeEach(() => {
  fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
})
afterEach(() => vi.unstubAllGlobals())

const lastCall = () => {
  const [url, init = {}] = fetchMock.mock.calls.at(-1)
  return { url, method: init.method ?? 'GET', body: init.body ? JSON.parse(init.body) : undefined }
}

describe('task encoding', () => {
  it('round-trips a note through the todo’s task string', () => {
    const dataset = { title: 'Debt Outstanding', publisher: 'City of New York', url: 'https://catalog.data.gov/dataset/x' }
    expect(parseTask(encodeTask({ title: '  Title ', body: 'Body', dataset }))).toEqual({ title: 'Title', body: 'Body', dataset })
  })

  it('shows a todo made elsewhere as plain text', () => {
    expect(parseTask('Finish the API lesson')).toEqual({ title: 'Finish the API lesson', body: '', dataset: null })
    expect(parseTask('{"not":"ours"}').title).toBe('{"not":"ours"}')
  })
})

describe('CRUD calls', () => {
  it('lists notes through the proxy, newest first', async () => {
    fetchMock.mockReturnValue(
      reply([todo({ _id: 'old', createdAt: '2026-10-01T00:00:00Z' }), todo({ _id: 'new', createdAt: '2026-10-20T00:00:00Z' })]),
    )
    const notes = await listNotes()
    expect(lastCall()).toMatchObject({ url: '/api/notes/get', method: 'GET' })
    expect(notes.map((n) => n.id)).toEqual(['new', 'old'])
    expect(notes[0]).toMatchObject({ title: 'Check NYC debt data', revisitBy: '2026-10-28', reviewed: false })
  })

  it('creates a note with task and dueDate, never user', async () => {
    fetchMock.mockImplementation(() => reply(todo(), { status: 201 }))
    const note = await createNote({ title: 'Check NYC debt data', body: 'Compare with ACFR', revisitBy: '2026-10-28' })
    const call = lastCall()
    expect(call).toMatchObject({ url: '/api/notes/post', method: 'POST' })
    expect(Object.keys(call.body).sort()).toEqual(['dueDate', 'task'])
    expect(parseTask(call.body.task).title).toBe('Check NYC debt data')
    expect(note.id).toBe('abc123')
  })

  it('sends only what changed on update', async () => {
    fetchMock.mockImplementation(() => reply(todo({ dueDate: '2026-11-01T00:00:00Z' })))
    const current = { id: 'abc123', title: 'A', body: 'B', dataset: null, revisitBy: '2026-10-28', reviewed: false }
    await updateNote(current, { revisitBy: '2026-11-01' })
    expect(lastCall()).toMatchObject({ url: '/api/notes/put/abc123', method: 'PUT', body: { dueDate: '2026-11-01' } })

    await updateNote(current, { title: 'New title' })
    const body = lastCall().body
    expect(Object.keys(body)).toEqual(['task'])
    expect(parseTask(body.task)).toMatchObject({ title: 'New title', body: 'B' })
  })

  it('skips the request when nothing changed', async () => {
    const current = { id: 'abc123', title: 'A', body: 'B', dataset: null, revisitBy: '2026-10-28', reviewed: false }
    expect(await updateNote(current, { revisitBy: '2026-10-28' })).toBe(current)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('toggles with PATCH and no body', async () => {
    fetchMock.mockImplementation(() => reply(todo({ isCompleted: true })))
    const note = await toggleNote('abc123')
    const [, init] = fetchMock.mock.calls.at(-1)
    expect(lastCall()).toMatchObject({ url: '/api/notes/toggle/abc123', method: 'PATCH' })
    expect(init.body).toBeUndefined()
    expect(note.reviewed).toBe(true)
  })

  it('reads the delete response as text', async () => {
    fetchMock.mockImplementation(() => reply('Deleted: {"_id":"abc123"}', { text: true }))
    await expect(deleteNote('abc123')).resolves.toMatch(/^Deleted/)
    expect(lastCall()).toMatchObject({ url: '/api/notes/delete/abc123', method: 'DELETE' })
  })

  it('surfaces validation and auth errors', async () => {
    fetchMock.mockImplementation(() => reply({ error: 'Validation failed', fields: { task: '...' } }, { status: 400 }))
    await expect(createNote({ title: '' })).rejects.toMatchObject({ status: 400 })
    fetchMock.mockImplementation(() => reply({ errMsg: 'No token provided...' }, { status: 401 }))
    await expect(listNotes()).rejects.toMatchObject({ status: 401 })
  })
})
