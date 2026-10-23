import { SourceNote } from '@/components/ui/Notes.jsx'
import { QueryState } from '@/components/ui/QueryState.jsx'
import { Surface } from '@/components/ui/Surfaces.jsx'
import { Term } from '@/components/ui/Term.jsx'
import { DATA_SOURCES } from '@/content/sources.js'
import { useAuctions } from '@/lib/api/hooks.js'
import { bidderShares } from '@/lib/api/fiscalData.js'
import { formatDate, formatLargeUSD, formatPercent } from '@/lib/format.js'
import { UpcomingAuctions } from './LatestAuctions.jsx'

const pct = (share) => formatPercent(share * 100, 0)
const time = (t) => t.replace(/^0/, '')

export function AuctionStory() {
  const query = useAuctions()
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
      <div className="prose-ol">
        <h3 className="!mt-0">The calendar</h3>
        <p>
          Treasury borrows on a published schedule, so investors know what’s coming. Bills are auctioned every week (52-week
          bills every four weeks), and 2-, 3-, 5- and 7-year notes every month. The 10-year note and the 20- and 30-year bonds
          are also sold monthly: a brand-new security four times a year, and a{' '}
          <Term id="reopening">reopening</Term> of it in the months between. TIPS and floating rate notes follow their own
          cycles.
        </p>
        <p>Every auction moves through the same three dates:</p>
        <ol>
          <li>
            <strong>Announcement.</strong> Treasury publishes what it will sell, how much, and the rules, usually a few days to
            a week ahead.
          </li>
          <li>
            <strong>Auction day.</strong> Bids are due by set times in the late morning or early afternoon, Eastern time: noncompetitive bids
            first, then competitive bids. Results are posted within minutes of the close.
          </li>
          <li>
            <strong>Issue date.</strong> Buyers pay, and the securities appear in their accounts, usually a few days to a week
            later.
          </li>
        </ol>

        <h3>The latest 10-year note auction, step by step</h3>
        <QueryState query={query} label="the latest 10-year auction" skeleton={<div className="skeleton h-72 w-full" />}>
          {({ completed }) => {
            const a = completed.find((x) => x.groupTerm === '10-Year' && x.kind === 'Note')
            return a ? <TenYearSteps a={a} /> : <p>No recent 10-year note auction is available right now.</p>
          }}
        </QueryState>
      </div>

      <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
        <QueryState query={query} label="auction figures" skeleton={<div className="skeleton h-64 w-full" />}>
          {({ completed }) => {
            const a = completed.find((x) => x.groupTerm === '10-Year' && x.kind === 'Note')
            return a ? <AtAGlance a={a} /> : null
          }}
        </QueryState>
        <div>
          <h3 className="mb-4 font-serif text-[1.3rem] text-fg">Coming up next</h3>
          <UpcomingAuctions />
        </div>
      </aside>
    </div>
  )
}

function TenYearSteps({ a }) {
  const shares = bidderShares(a)
  const tendered = a.compTendered !== null && a.noncompAccepted !== null ? a.compTendered + a.noncompAccepted : null
  const belowPar = a.pricePer100 !== null && a.pricePer100 < 100
  return (
    <>
      <p>
        Here is how the auction on <strong>{formatDate(a.auctionDate)}</strong> played out, using Treasury’s published
        results.
      </p>
      <ol>
        <li>
          <strong>The offer.</strong>
          {a.announcementDate && <> On {formatDate(a.announcementDate)}, </>}
          Treasury announced it would sell <span className="num">{formatLargeUSD(a.offeringAmount, 1)}</span>{' '}
          {a.reopening ? (
            <>
              of an existing 10-year note, maturing {formatDate(a.maturityDate)}. Because this was a reopening, the note’s{' '}
              <span className="num">{formatPercent(a.interestRate, 3)}</span> coupon was already fixed from its first sale.
            </>
          ) : (
            <>of a new 10-year note maturing {formatDate(a.maturityDate)}.</>
          )}
        </li>
        {tendered !== null && (
          <li>
            <strong>The bids.</strong> Investors asked for <span className="num">{formatLargeUSD(tendered, 1)}</span>, about{' '}
            <span className="num">{a.bidToCover?.toFixed(2)}</span> times the amount on offer. That multiple is the{' '}
            <Term id="bid-to-cover">bid-to-cover ratio</Term>, a common gauge of demand.
          </li>
        )}
        {a.noncompAccepted !== null && (
          <li>
            <strong>Noncompetitive bids are filled first.</strong>{' '}
            <span className="num">{formatLargeUSD(a.noncompAccepted, 2)}</span> went to bidders who agreed to accept whatever
            yield the auction set
            {a.retailAccepted !== null && (
              <>
                , including <span className="num">{formatLargeUSD(a.retailAccepted, 2)}</span> bought by individuals through
                TreasuryDirect
              </>
            )}
            .
          </li>
        )}
        {a.lowYield !== null && (
          <li>
            <strong>Competitive bids are accepted from the lowest yield up.</strong> Accepted bids ranged from{' '}
            <span className="num">{formatPercent(a.lowYield, 3)}</span> to{' '}
            <span className="num">{formatPercent(a.highYield, 3)}</span>
            {a.medianYield !== null && (
              <>
                , and half the accepted amount was bid at or below{' '}
                <span className="num">{formatPercent(a.medianYield, 3)}</span>
              </>
            )}
            .
            {a.allottedAtHigh !== null && a.allottedAtHigh < 100 && (
              <>
                {' '}
                Bids at exactly the highest accepted yield couldn’t all be filled; each got{' '}
                <span className="num">{formatPercent(a.allottedAtHigh, 1)}</span> of what it asked for.
              </>
            )}
          </li>
        )}
        <li>
          <strong>Everyone gets the same yield.</strong> In a{' '}
          <Term id="single-price-auction">single-price auction</Term>, every winning bidder receives the{' '}
          <Term id="high-yield">high yield</Term>, here <span className="num">{formatPercent(a.highYield, 3)}</span>, even
          those who bid lower.{' '}
          {a.reopening ? (
            <>
              With the coupon fixed at <span className="num">{formatPercent(a.interestRate, 3)}</span>, the yield was delivered
              through the price: buyers paid <span className="num">${a.pricePer100?.toFixed(3)}</span> per $100 of face value
              {belowPar ? ' (less than face value, because the yield was above the coupon)' : ''}
              {a.accruedPer1000 ? (
                <>
                  , plus <span className="num">${a.accruedPer1000.toFixed(2)}</span> per $1,000 of interest that had built up
                  since the last coupon date
                </>
              ) : null}
              .
            </>
          ) : (
            <>
              Treasury then set the coupon at the high yield rounded down to the nearest ⅛ percent,{' '}
              <span className="num">{formatPercent(a.interestRate, 3)}</span>, so buyers paid{' '}
              <span className="num">${a.pricePer100?.toFixed(3)}</span> per $100 of face value.
            </>
          )}
        </li>
        {shares && (
          <li>
            <strong>Who bought.</strong> Of the competitive award, <Term id="indirect-bidder">indirect bidders</Term>, a group
            that includes foreign central banks, took <span className="num">{pct(shares.indirect)}</span>;{' '}
            <Term id="direct-bidder">direct bidders</Term> took <span className="num">{pct(shares.direct)}</span>; and{' '}
            <Term id="primary-dealer">primary dealers</Term>, who are expected to bid in every auction, ended up with <span className="num">{pct(shares.primaryDealers)}</span>.
          </li>
        )}
        {a.somaAccepted ? (
          <li>
            <strong>The Federal Reserve, on the side.</strong> Separately, the Fed rolled over{' '}
            <span className="num">{formatLargeUSD(a.somaAccepted, 2)}</span> of maturing Treasuries it already held into this
            note, at the same yield. That amount is added on top of the offering and isn’t counted in the bid-to-cover ratio.
          </li>
        ) : null}
        <li>
          <strong>Settlement.</strong> On {formatDate(a.issueDate)}, buyers paid and the notes were delivered. From then on,
          they trade freely on the <Term id="secondary-market">secondary market</Term>.
        </li>
      </ol>
      <SourceNote kind="live" source={DATA_SOURCES.auctions.name} href={DATA_SOURCES.auctions.href} asOf={a.auctionDate} asOfLabel="Auction" />
    </>
  )
}

function AtAGlance({ a }) {
  const rows = [
    ['Announced', a.announcementDate && formatDate(a.announcementDate)],
    ['Auctioned', formatDate(a.auctionDate)],
    ['Issued', formatDate(a.issueDate)],
    ['Bid deadlines (ET)', a.closingTimeNoncomp && a.closingTimeComp && `${time(a.closingTimeNoncomp)} noncompetitive, ${time(a.closingTimeComp)} competitive`],
    ['Offered', formatLargeUSD(a.offeringAmount, 1)],
    ['High yield', formatPercent(a.highYield, 3)],
    ['Coupon', formatPercent(a.interestRate, 3)],
    ['Bid-to-cover', a.bidToCover?.toFixed(2)],
  ].filter(([, v]) => v)
  return (
    <Surface className="p-5 sm:p-6">
      <p className="eyebrow">At a glance</p>
      <p className="mt-1.5 font-serif text-[1.2rem] text-fg">10-year note{a.reopening ? ', reopening' : ''}</p>
      <dl className="mt-4 divide-y divide-line">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4 py-2">
            <dt className="text-[0.875rem] text-muted">{label}</dt>
            <dd className="num text-right text-[0.875rem] text-fg">{value}</dd>
          </div>
        ))}
      </dl>
    </Surface>
  )
}
