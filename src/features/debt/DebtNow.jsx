import { SourceNote } from '@/components/ui/Notes.jsx'
import { FigureSkeleton, QueryState } from '@/components/ui/QueryState.jsx'
import { Term } from '@/components/ui/Term.jsx'
import { DATA_SOURCES } from '@/content/sources.js'
import { useDebtToPenny } from '@/lib/api/hooks.js'
import { formatLargeUSD, formatPercent } from '@/lib/format.js'

export function DebtNow() {
  const query = useDebtToPenny()
  return (
    <QueryState query={query} label="the debt figure" skeleton={<FigureSkeleton />}>
      {(rows) => {
        const latest = rows.at(-1)
        const yearAgo = rows.find((r) => r.date >= shiftYear(latest.date)) ?? rows[0]
        const change = latest.total - yearAgo.total
        const publicShare = latest.heldByPublic / latest.total
        return (
          <div>
            <p className="num text-[clamp(2.4rem,1.6rem+3.6vw,4.4rem)] leading-none tracking-[-0.03em] text-fg">
              {formatLargeUSD(latest.total, 2).replace(' trillion', '')}
              <span className="ml-2 font-serif text-[0.45em] tracking-normal text-muted">trillion</span>
            </p>
            <p className="mt-3 max-w-[52ch] text-[1rem] leading-relaxed text-muted">
              <Term id="public-debt">Total public debt outstanding</Term>, {change >= 0 ? 'up' : 'down'}{' '}
              <span className="num text-fg">{formatLargeUSD(Math.abs(change), 2)}</span> from a year earlier.
            </p>

            <div className="mt-6">
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-night-2" aria-hidden="true">
                <div className="h-full bg-series-treasury" style={{ width: `${publicShare * 100}%` }} />
                <div className="h-full w-[2px] bg-night" />
                <div className="h-full flex-1 bg-ice-deep" />
              </div>
              <dl className="mt-3 grid gap-4 text-[0.9375rem] sm:grid-cols-2">
                <div>
                  <dt className="flex items-center gap-2 text-muted">
                    <span aria-hidden="true" className="inline-block size-2.5 rounded-sm bg-series-treasury" />
                    <Term id="debt-held-by-public">Held by the public</Term>
                  </dt>
                  <dd className="num mt-0.5 text-fg">
                    {formatLargeUSD(latest.heldByPublic)} <span className="text-muted">({formatPercent(publicShare * 100, 0)})</span>
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-muted">
                    <span aria-hidden="true" className="inline-block size-2.5 rounded-sm bg-ice-deep" />
                    <Term id="intragovernmental">Held by federal accounts</Term>
                  </dt>
                  <dd className="num mt-0.5 text-fg">
                    {formatLargeUSD(latest.intragovernmental)}{' '}
                    <span className="text-muted">({formatPercent((1 - publicShare) * 100, 0)})</span>
                  </dd>
                </div>
              </dl>
            </div>
            <SourceNote
              className="mt-5"
              kind="live"
              source={DATA_SOURCES.debtToPenny.name}
              href={DATA_SOURCES.debtToPenny.href}
              asOf={latest.date}
            />
          </div>
        )
      }}
    </QueryState>
  )
}

function shiftYear(iso) {
  const [y, m, d] = iso.split('-')
  return `${Number(y) - 1}-${m}-${d}`
}
