// Production stand-in for the dev/preview proxy in vite.config.js.
// Keys come from the site's environment variables in Netlify and never reach the browser.

function env(name) {
  return process.env[name] || ''
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function upstream(pathname, search) {
  const catalogKey = env('DATA_GOV_API_KEY')
  const censusKey = env('CENSUS_API_KEY')

  if (pathname.startsWith('/api/catalog')) {
    const rest = pathname.replace(/^\/api\/catalog/, '')
    return catalogKey
      ? { url: `https://api.gsa.gov/technology/datagov/v4${rest}${search}`, headers: { 'X-Api-Key': catalogKey } }
      : { url: `https://catalog.data.gov${rest}${search}`, headers: {} }
  }
  if (pathname.startsWith('/api/census')) {
    if (!censusKey) return { error: 'missing_census_key' }
    const rest = pathname.replace(/^\/api\/census/, '/data')
    const sep = search ? '&' : '?'
    return { url: `https://api.census.gov${rest}${search}${sep}key=${encodeURIComponent(censusKey)}`, headers: {} }
  }
  return null
}

export default async (req) => {
  const { pathname, search } = new URL(req.url)

  if (pathname === '/api/status') {
    return json({
      catalog: { configured: Boolean(env('DATA_GOV_API_KEY')), usingDemoKey: false },
      census: { configured: Boolean(env('CENSUS_API_KEY')) },
    })
  }

  const target = upstream(pathname, search)
  if (!target) return json({ error: 'not_found' }, 404)
  if (target.error) return json({ error: target.error }, 503)

  const headers = { ...target.headers }
  const contentType = req.headers.get('content-type')
  if (contentType) headers['Content-Type'] = contentType
  const hasBody = !['GET', 'HEAD'].includes(req.method)

  let res
  try {
    res = await fetch(target.url, {
      method: req.method,
      headers,
      body: hasBody ? await req.text() : undefined,
    })
  } catch {
    return json({ error: 'upstream_unreachable' }, 502)
  }

  return new Response(res.body, {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
  })
}

export const config = { path: '/api/*' }
