import { ArrowLink } from '@/components/ui/Button.jsx'
import { SourceNote } from '@/components/ui/Notes.jsx'
import { QueryState } from '@/components/ui/QueryState.jsx'
import { GlassPanel } from '@/components/ui/Surfaces.jsx'
import { DATA_SOURCES } from '@/content/sources.js'
import { useAuctions } from '@/lib/api/hooks.js'
import { afterTaxYield } from '@/lib/finance/tax.js'
import { formatDate, formatPercent } from '@/lib/format.js'

const EXAMPLE = { apy: 4.0, federalRate: 0.22, stateRate: 0.05 }

export function SavingsTeaser() {
  const query = useAuctions()
  return (
    <GlassPanel className="p-5 sm:p-7">
      <QueryState query={query} label="the latest bill auction" skeleton={<div className="skeleton h-56 w-full" />}>
        {({ latest }) => {
          const bill = latest.nominal.find((a) => a.term === '26-Week')
          if (!bill) return <p className="text-muted">No recent 26-week bill auction found.</p>
          const rates = { federalRate: EXAMPLE.federalRate, stateRate: EXAMPLE.stateRate }
          const rows = [
            {
              id: 'hysa',
              label: 'High-yield savings',
              sub: 'Example APY',
              gross: EXAMPLE.apy,
              kept: afterTaxYield(EXAMPLE.apy / 100, 'hysa', rates) * 100,
              color: 'bg-series-hysa',
              taxNote: 'Federal + state tax',
            },
            {
              id: 'bill',
              label: '26-week Treasury bill',
              sub: `Auction of ${formatDate(bill.auctionDate)}`,
              gross: bill.investmentRate,
              kept: afterTaxYield(bill.investmentRate / 100, 'treasury', rates) * 100,
              color: 'bg-series-treasury',
              taxNote: 'Federal tax only',
            },
          ]
          const scaleMax = Math.max(...rows.map((r) => r.gross)) * 1.08
          return (
            <>
              <p className="eyebrow">After taxes, per year</p>
              <p className="mt-2 text-[0.9375rem] text-muted">
                Assuming a 22% federal and 5% state tax rate on interest.
              </p>
              <ul className="mt-6 space-y-6">
                {rows.map((r) => (
                  <li key={r.id}>
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-semibold text-fg">
                        {r.label} <span className="block text-[0.8125rem] font-normal text-muted sm:inline sm:pl-1.5">{r.sub}</span>
                      </p>
                      <p className="num shrink-0 text-[1.35rem] text-fg">{formatPercent(r.kept)}</p>
                    </div>
                    <div className="mt-2 h-2.5 w-full rounded-full bg-night-2" aria-hidden="true">
                      <div className={`h-full rounded-full ${r.color}`} style={{ width: `${(r.kept / scaleMax) * 100}%` }} />
                    </div>
                    <p className="mt-1.5 text-[0.8125rem] text-muted">
                      <span className="num">{formatPercent(r.gross)}</span> before tax · {r.taxNote}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-1.5 border-t border-line pt-4">
                <SourceNote kind="live" source={DATA_SOURCES.auctions.name} href={DATA_SOURCES.auctions.href} asOf={bill.auctionDate} asOfLabel="Auction">
                  Bill investment rate
                </SourceNote>
                <SourceNote kind="illustrative">Savings rate and tax rates are examples.</SourceNote>
              </div>
              <div className="mt-5">
                <ArrowLink to="/bonds-vs-hysa">Read the full comparison</ArrowLink>
              </div>
            </>
          )
        }}
      </QueryState>
    </GlassPanel>
  )
}
