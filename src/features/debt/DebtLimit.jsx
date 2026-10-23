import { SourceNote } from '@/components/ui/Notes.jsx'
import { FigureSkeleton, QueryState } from '@/components/ui/QueryState.jsx'
import { Surface } from '@/components/ui/Surfaces.jsx'
import { Term } from '@/components/ui/Term.jsx'
import { useDebtLimit } from '@/lib/api/hooks.js'
import { formatLargeUSD, formatPercent } from '@/lib/format.js'

const SOURCE = {
  name: 'Daily Treasury Statement, table III-C',
  href: 'https://fiscaldata.treasury.gov/datasets/daily-treasury-statement/',
}

export function DebtLimit() {
  const query = useDebtLimit()
  return (
    <Surface className="p-5 sm:p-6">
      <QueryState query={query} label="the debt limit" skeleton={<FigureSkeleton />}>
        {(d) => {
          if (!d) return <p className="text-muted">Debt limit figures aren’t available right now.</p>
          const used = d.subjectToLimit / d.limit
          return (
            <>
              <p className="eyebrow">
                The <Term id="debt-limit">debt limit</Term>, today
              </p>
              <div className="mt-4 grid gap-5 sm:grid-cols-3">
                <Figure label="Statutory limit" value={formatLargeUSD(d.limit, 3)} />
                <Figure label="Debt subject to the limit" value={formatLargeUSD(d.subjectToLimit, 3)} />
                <Figure label="Room left" value={formatLargeUSD(d.headroom, 0)} />
              </div>
              <div className="mt-5">
                <div className="h-3 w-full overflow-hidden rounded-full bg-night-2" aria-hidden="true">
                  <div className="h-full rounded-full bg-series-treasury" style={{ width: `${Math.min(100, used * 100)}%` }} />
                </div>
                <p className="mt-2 text-[0.875rem] text-muted">
                  <span className="num text-fg">{formatPercent(used * 100, 1)}</span> of the limit is in use.
                </p>
              </div>
              <SourceNote className="mt-4" kind="live" source={SOURCE.name} href={SOURCE.href} asOf={d.date}>
                Excludes a small amount of debt that doesn’t count toward the limit
              </SourceNote>
            </>
          )
        }}
      </QueryState>
    </Surface>
  )
}

function Figure({ label, value }) {
  return (
    <div>
      <p className="text-[0.8125rem] font-semibold text-muted">{label}</p>
      <p className="num mt-1 text-[1.3rem] text-fg">{value}</p>
    </div>
  )
}
