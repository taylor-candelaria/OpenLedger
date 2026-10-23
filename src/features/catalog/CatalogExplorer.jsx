import { useId, useState } from 'react'
import { Button } from '@/components/ui/Button.jsx'
import { Segmented } from '@/components/ui/Fields.jsx'
import { Icon } from '@/components/ui/Icon.jsx'
import { SourceNote } from '@/components/ui/Notes.jsx'
import { ErrorState } from '@/components/ui/QueryState.jsx'
import { GlassPanel, Surface } from '@/components/ui/Surfaces.jsx'
import { DATA_SOURCES } from '@/content/sources.js'
import { ORG_TYPES } from '@/lib/api/catalog.js'
import { useCatalogSearch } from '@/lib/api/hooks.js'
import { formatDate } from '@/lib/format.js'

const PRESETS = [
  'municipal bonds',
  'debt service',
  'general obligation bonds',
  'annual comprehensive financial report',
  'treasury securities',
  'pension liabilities',
  'capital improvement budget',
]

const ORG_LABEL = {
  'Federal Government': 'Federal',
  'State Government': 'State',
  'County Government': 'County',
  'City Government': 'City',
}

export function CatalogExplorer({ onSaveToNotes }) {
  const inputId = useId()
  const [draft, setDraft] = useState('municipal bonds')
  const [query, setQuery] = useState({ q: 'municipal bonds', orgType: '' })
  const search = useCatalogSearch(query)

  const results = search.data?.pages.flatMap((p) => p.results) ?? []

  function submit(e) {
    e.preventDefault()
    if (draft.trim()) setQuery((q) => ({ ...q, q: draft.trim() }))
  }

  return (
    <div className="grid gap-8">
      <GlassPanel className="p-5 sm:p-7">
        <form onSubmit={submit} role="search" aria-label="Search data.gov datasets">
          <label htmlFor={inputId} className="mb-2 block text-[0.9375rem] font-semibold text-fg">
            Search public datasets
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Icon name="search" className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
              <input
                id={inputId}
                type="search"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="e.g. school district bonds"
                className="h-11 w-full rounded-md border border-control bg-night-2 pr-3 pl-11 text-fg placeholder:text-subtle hover:border-muted focus-visible:border-ice"
              />
            </div>
            <Button type="submit" disabled={!draft.trim()}>
              Search
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[0.8125rem] text-muted">Try:</span>
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setDraft(p)
                  setQuery((q) => ({ ...q, q: p }))
                }}
                aria-pressed={query.q === p}
                className={`rounded-sm border px-2.5 py-1 text-[0.8125rem] font-semibold transition-colors ${
                  query.q === p ? 'border-line-strong bg-surface-2 text-fg' : 'border-line text-muted hover:border-line-strong hover:text-fg'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="mt-5">
            <Segmented
              legend="Publisher"
              value={query.orgType}
              onChange={(v) => setQuery((q) => ({ ...q, orgType: v }))}
              size="sm"
              options={ORG_TYPES}
            />
          </div>
        </form>
      </GlassPanel>

      <section aria-labelledby="results-heading" aria-busy={search.isFetching}>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="results-heading" className="font-serif text-[1.4rem] text-fg">
            Results for “{query.q}”
            {query.orgType && <span className="text-muted"> · {ORG_LABEL[query.orgType]} publishers</span>}
          </h2>
          {results.length > 0 && (
            <p className="text-[0.875rem] text-muted" aria-live="polite">
              Showing <span className="num text-fg">{results.length}</span>, most relevant first
            </p>
          )}
        </div>

        {search.isPending && (
          <div role="status" className="grid gap-3">
            <span className="sr-only">Searching…</span>
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-36 w-full" />
            ))}
          </div>
        )}
        {search.isError && <ErrorState error={search.error} label="search results" onRetry={() => search.refetch()} />}
        {search.isSuccess && results.length === 0 && (
          <p className="text-muted">No datasets matched. Try a broader term or a different publisher type.</p>
        )}

        <ul className="grid gap-3">
          {results.map((d) => (
            <li key={d.slug}>
              <Surface as="article" className="p-5">
                <div className="flex flex-wrap items-center gap-2 text-[0.8125rem]">
                  {d.orgType && (
                    <span className="rounded-sm border border-line-strong px-2 py-0.5 font-semibold text-fg">{ORG_LABEL[d.orgType] ?? d.orgType}</span>
                  )}
                  <span className="text-muted">{d.orgName || d.publisher}</span>
                  {d.hasDownload && (
                    <span className="inline-flex items-center gap-1 text-muted">
                      <Icon name="check" size={14} className="text-teal" />
                      Downloadable data
                    </span>
                  )}
                </div>
                <h3 className="mt-2 font-serif text-[1.2rem] leading-snug">
                  <a href={d.url} target="_blank" rel="noreferrer" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-ice">
                    {d.title}
                    <span className="sr-only"> (opens data.gov in a new tab)</span>
                  </a>
                </h3>
                {d.summary && <p className="mt-2 max-w-[80ch] text-[0.9375rem] leading-relaxed text-muted">{d.summary}</p>}
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[0.8125rem] text-muted">
                  {d.modified && (
                    <span>
                      Updated by publisher <span className="num text-fg/90">{formatDate(d.modified)}</span>
                    </span>
                  )}
                  {d.landingPage && (
                    <a href={d.landingPage} target="_blank" rel="noreferrer" className="underline decoration-subtle/60 underline-offset-2 hover:text-fg">
                      Publisher’s page
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                </div>
                {d.keywords.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Keywords">
                    {d.keywords.map((k) => (
                      <li key={k} className="rounded-sm bg-night-2 px-2 py-0.5 text-[0.75rem] text-muted">
                        {k}
                      </li>
                    ))}
                  </ul>
                )}
                {onSaveToNotes && (
                  <div className="mt-4 border-t border-line pt-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onSaveToNotes({ title: d.title, publisher: d.orgName || d.publisher, url: d.url })}
                      aria-label={`Save to notes: ${d.title}`}
                    >
                      Save to notes
                    </Button>
                  </div>
                )}
              </Surface>
            </li>
          ))}
        </ul>

        {search.hasNextPage && (
          <div className="mt-6">
            <Button variant="secondary" onClick={() => search.fetchNextPage()} disabled={search.isFetchingNextPage}>
              {search.isFetchingNextPage ? 'Loading…' : 'Show more results'}
            </Button>
          </div>
        )}

        <SourceNote className="mt-6" kind="live" source={DATA_SOURCES.catalog.name} href={DATA_SOURCES.catalog.href}>
          Dataset descriptions are written by each publisher
        </SourceNote>
      </section>
    </div>
  )
}
