export class ApiError extends Error {
  constructor(message, { status, source, code } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.source = source
    this.code = code
  }
}

async function request(url, { signal, source, headers, method, body }) {
  let res
  try {
    res = await fetch(url, { signal, headers, method, body })
  } catch (err) {
    if (err?.name === 'AbortError') throw err
    throw new ApiError(`Couldn’t reach ${source}. Check your connection and try again.`, { source })
  }
  if (!res.ok) {
    let code
    try {
      code = (await res.clone().json())?.error
    } catch {
    }
    const message =
      res.status === 429
        ? `${source} is rate-limiting requests right now. Try again in a few minutes.`
        : res.status === 401 || res.status === 403
          ? `${source} didn’t accept the credentials (${res.status}). Check the key or token in .env.local.`
          : `${source} responded with an error (${res.status}).`
    throw new ApiError(message, { status: res.status, source, code })
  }
  return res
}

export async function fetchJSON(url, schema, options) {
  const res = await request(url, options)
  if (res.status === 204) return schema.parse(null)
  const body = await res.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    console.error(`Unexpected response shape from ${options.source}`, parsed.error)
    throw new ApiError(`${options.source} returned data in an unexpected format.`, {
      source: options.source,
    })
  }
  return parsed.data
}

export async function fetchText(url, options) {
  const res = await request(url, options)
  return res.text()
}

export function toNumber(value) {
  if (value === null || value === undefined) return null
  const s = String(value).trim()
  if (s === '' || s === 'null' || s === 'NaN') return null
  const n = Number(s.replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}

export function toNumberOrZero(value) {
  return toNumber(value) ?? 0
}
