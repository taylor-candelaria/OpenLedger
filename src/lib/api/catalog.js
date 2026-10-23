import { z } from 'zod'
import { fetchJSON } from './client.js'

const SOURCE = 'data.gov Catalog'

export const ORG_TYPES = [
  { value: '', label: 'All publishers' },
  { value: 'Federal Government', label: 'Federal' },
  { value: 'State Government', label: 'State' },
  { value: 'County Government', label: 'County' },
  { value: 'City Government', label: 'City' },
]

const organization = z
  .object({
    name: z.string().nullish(),
    organization_type: z.string().nullish(),
    slug: z.string().nullish(),
  })
  .passthrough()
  .nullish()

const dataset = z
  .object({
    slug: z.string(),
    description: z.string().nullish(),
    publisher: z.string().nullish(),
    keyword: z.array(z.string()).nullish(),
    last_harvested_date: z.string().nullish(),
    has_download: z.boolean().nullish(),
    organization,
    dcat: z
      .object({
        title: z.string().nullish(),
        modified: z.string().nullish(),
        landingPage: z.string().nullish(),
      })
      .passthrough()
      .nullish(),
  })
  .passthrough()

const searchResponse = z.object({
  results: z.array(dataset),
  after: z.string().nullish(),
})

export function toCatalogDataset(r) {
  return {
    slug: r.slug,
    title: r.dcat?.title ?? r.slug,
    summary: plainText(r.description ?? ''),
    publisher: r.publisher ?? r.organization?.name ?? 'Unknown publisher',
    orgName: r.organization?.name ?? '',
    orgType: r.organization?.organization_type ?? '',
    keywords: (r.keyword ?? []).slice(0, 6),
    modified: r.dcat?.modified ? String(r.dcat.modified).slice(0, 10) : null,
    harvested: r.last_harvested_date ? r.last_harvested_date.slice(0, 10) : null,
    hasDownload: Boolean(r.has_download),
    url: `https://catalog.data.gov/dataset/${r.slug}`,
    landingPage: r.dcat?.landingPage ?? null,
  }
}

export function plainText(html, max = 320) {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, '')}…` : text
}

export async function searchCatalog({ q, orgType, after, perPage = 12, signal }) {
  const params = new URLSearchParams({ q, per_page: String(perPage) })
  if (orgType) params.set('org_type', orgType)
  if (after) params.set('after', after)
  const body = await fetchJSON(`/api/catalog/search?${params}`, searchResponse, { signal, source: SOURCE })
  return { results: body.results.map(toCatalogDataset), after: body.after ?? null }
}

const statusResponse = z.object({
  catalog: z.object({ configured: z.boolean(), usingDemoKey: z.boolean() }),
  census: z.object({ configured: z.boolean() }),
  notes: z.object({ configured: z.boolean() }).optional(),
})

export async function fetchApiStatus({ signal } = {}) {
  return fetchJSON('/api/status', statusResponse, { signal, source: 'Local API proxy' })
}
