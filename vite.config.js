import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

function apiProxies(env) {
  const catalogKey = env.DATA_GOV_API_KEY || ''
  const censusKey = env.CENSUS_API_KEY || ''
  const notesToken = env.SIMPLYCODING_TOKEN || ''
  const notesUser = encodeURIComponent(env.SIMPLYCODING_USER || 'openledger-taylor')

  return {
    '/api/catalog': catalogKey
      ? {
          target: 'https://api.gsa.gov',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/catalog/, '/technology/datagov/v4'),
          headers: { 'X-Api-Key': catalogKey },
        }
      : {
          target: 'https://catalog.data.gov',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/catalog/, ''),
        },
    '/api/census': {
      target: 'https://api.census.gov',
      changeOrigin: true,
      rewrite: (path) => {
        const rewritten = path.replace(/^\/api\/census/, '/data')
        const sep = rewritten.includes('?') ? '&' : '?'
        return `${rewritten}${sep}key=${encodeURIComponent(censusKey)}`
      },
    },
    '/api/notes': {
      target: 'https://mongodb.simplycodingcourses.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/notes/, `/simply/todo/${notesUser}`),
      headers: { Authorization: `Bearer ${notesToken}` },
    },
  }
}

function apiStatusPlugin(env) {
  const status = {
    catalog: { configured: Boolean(env.DATA_GOV_API_KEY), usingDemoKey: false },
    census: { configured: Boolean(env.CENSUS_API_KEY) },
    notes: { configured: Boolean(env.SIMPLYCODING_TOKEN) },
  }
  const middleware = (req, res, next) => {
    if (req.url === '/api/status') {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(status))
      return
    }
    if (req.url?.startsWith('/api/census') && !status.census.configured) {
      res.statusCode = 503
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'missing_census_key' }))
      return
    }
    if (req.url?.startsWith('/api/notes') && !status.notes.configured) {
      res.statusCode = 503
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'missing_simplycoding_token' }))
      return
    }
    next()
  }
  return {
    name: 'openledger-api-status',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxy = apiProxies(env)

  return {
    plugins: [react(), tailwindcss(), apiStatusPlugin(env)],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: { proxy },
    preview: { proxy },
    test: {
      environment: 'node',
      include: ['src/**/*.test.js'],
    },
  }
})
