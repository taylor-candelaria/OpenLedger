import { SourceNote } from '@/components/ui/Notes.jsx'
import { QueryState } from '@/components/ui/QueryState.jsx'
import { Surface } from '@/components/ui/Surfaces.jsx'
import { Term } from '@/components/ui/Term.jsx'
import { DATA_SOURCES } from '@/content/sources.js'
import { useAuctions } from '@/lib/api/hooks.js'
import { formatDate, formatLargeUSD, formatPercent } from '@/lib/format.js'

function rateCell(a) {
  if (a.kind === 'Bill') return { main: formatPercent(a.investmentRate, 3), sub: `${formatPercent(a.discountRate, 3)} discount` }
  if (a.kind === 'FRN') return { main: a.spread !== null ? `+${formatPercent(a.spread, 3)}` : '—', sub: 'spread over the 13-week bill rate' }
  if (a.kind === 'TIPS') {
    return {
      main: formatPercent(a.highYield, 3),
      sub: `real yield${a.interestRate !== null ? ` · ${formatPercent(a.interestRate, 3)} coupon` : ''}`,
    }
  }
  return {
    main: formatPercent(a.highYield, 3),
    sub: a.interestRate !== null ? `${formatPercent(a.interestRate, 3)} coupon` : null,
  }
}

export function LatestAuctions() {
  const query = useAuctions()
  return (
    <QueryState query={query} label="auction results" skeleton={<div className="skeleton h-96 w-full" />}>
      {({ latest }) => {
        const rows = [...latest.nominal, ...latest.other]
        const newest = rows.reduce((m, a) => (a.auctionDate > m ? a.auctionDate : m), '')
        return (
          <div>
            <Surface className="overflow-x-auto">
              <table className="data-table min-w-[760px]">
                <caption className="sr-only">Latest Treasury auction results by security</caption>
                <thead>
                  <tr>
                    <th scope="col">Security</th>
                    <th scope="col">Auctioned</th>
                    <th scope="col" className="!text-right">
                      Rate or <Term id="high-yield">high yield</Term>
                    </th>
                    <th scope="col" className="!text-right">Price per $100</th>
                    <th scope="col" className="!text-right">
                      <Term id="bid-to-cover">Bid-to-cover</Term>
                    </th>
                    <th scope="col" className="!text-right">Amount sold</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a) => {
                    const r = rateCell(a)
                    return (
                      <tr key={a.cusip + a.auctionDate}>
                        <th scope="row" className="!font-normal">
                          <span className="font-semibold text-fg">
                            {a.groupTerm} {a.kind === 'Bill' ? 'bill' : a.kind === 'Note' ? 'note' : a.kind === 'Bond' ? 'bond' : a.kind}
                          </span>
                          <span className="num block text-[0.8125rem] text-muted">
                            {a.cusip}
                            {a.reopening ? ` · reopening${a.term !== a.groupTerm ? `, ${a.term.toLowerCase()} left` : ''}` : ''}
                          </span>
                        </th>
                        <td className="num text-[0.875rem] whitespace-nowrap text-muted">{formatDate(a.auctionDate)}</td>
                        <td className="is-num">
                          <span className="text-fg">{r.main}</span>
                          {r.sub && <span className="block text-[0.8125rem] text-muted">{r.sub}</span>}
                        </td>
                        <td className="is-num">{a.pricePer100 !== null ? a.pricePer100.toFixed(4) : '—'}</td>
                        <td className="is-num">{a.bidToCover !== null ? a.bidToCover.toFixed(2) : '—'}</td>
                        <td className="is-num">{a.totalAccepted !== null ? formatLargeUSD(a.totalAccepted, 1) : '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Surface>
            <div className="mt-4 space-y-2">
              <SourceNote kind="live" source={DATA_SOURCES.auctions.name} href={DATA_SOURCES.auctions.href} asOf={newest} asOfLabel="Latest auction">
                Bill rates are investment rates (comparable to savings APYs); note and bond yields are yields to maturity;
                TIPS yields are real yields, earned on top of inflation.
              </SourceNote>
            </div>
          </div>
        )
      }}
    </QueryState>
  )
}

export function UpcomingAuctions() {
  const query = useAuctions()
  return (
    <QueryState query={query} label="upcoming auctions" skeleton={<div className="skeleton h-40 w-full" />}>
      {({ upcoming }) =>
        upcoming.length === 0 ? (
          <p className="text-muted">No auctions are announced right now. Treasury usually announces each one a few days ahead.</p>
        ) : (
          <div>
            <ul className="divide-y divide-line border-y border-line">
              {upcoming.map((a) => (
                <li key={a.cusip + a.auctionDate} className="flex items-baseline justify-between gap-4 py-3.5">
                  <span className="min-w-0">
                    <span className="num block text-[0.875rem] text-ice">{formatDate(a.auctionDate)}</span>
                    <span className="mt-0.5 block font-semibold text-fg">
                      {a.groupTerm} {a.kind === 'Bill' ? 'bill' : a.kind === 'Note' ? 'note' : a.kind === 'Bond' ? 'bond' : a.kind}
                      {a.reopening && <span className="ml-2 text-[0.8125rem] font-normal text-muted">reopening</span>}
                    </span>
                  </span>
                  <span className="num shrink-0 text-right text-[0.875rem] text-muted">
                    {a.offeringAmount !== null ? `${formatLargeUSD(a.offeringAmount, 0)} offered` : ''}
                  </span>
                </li>
              ))}
            </ul>
            <SourceNote className="mt-4" kind="live" source={DATA_SOURCES.auctions.name} href={DATA_SOURCES.auctions.href}>
              Announced auctions
            </SourceNote>
          </div>
        )
      }
    </QueryState>
  )
}
