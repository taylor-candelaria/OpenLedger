import { Link } from 'react-router-dom'
import { SourceNote } from '@/components/ui/Notes.jsx'
import { QueryState } from '@/components/ui/QueryState.jsx'
import { Term } from '@/components/ui/Term.jsx'
import { DATA_SOURCES } from '@/content/sources.js'
import { TreasuryCompare } from '@/features/treasuries/TreasuryCompare.jsx'
import { useIBondRates } from '@/lib/api/hooks.js'
import { billSummary } from '@/lib/finance/bills.js'
import { formatDate, formatPercent, formatUSD } from '@/lib/format.js'
import { Prose, Takeaways, Wide } from './ChapterLayout.jsx'

function BillExample() {
  const ex = billSummary({ face: 1000, discountRate: 0.04, days: 182 })
  return (
    <p>
      Here’s a hypothetical example. A 26-week bill with a $1,000 face value sold at a 4.00%{' '}
      <Term id="discount-rate">discount rate</Term> costs <strong className="num">{formatUSD(ex.cost, { cents: true })}</strong>. In 182
      days you receive $1,000, so you earn <strong className="num">{formatUSD(ex.interest, { cents: true })}</strong>. Measured
      on what you actually paid, over a 365-day year, that’s an <Term id="investment-rate">investment rate</Term> of{' '}
      <strong className="num">{formatPercent(ex.investmentRate * 100, 3)}</strong>, the figure to compare with a savings account’s
      APY.
    </p>
  )
}

function IBondRate() {
  const query = useIBondRates()
  return (
    <QueryState query={query} label="the I bond rate" skeleton={<span className="skeleton inline-block h-5 w-64" />}>
      {({ current }) =>
        current && (
          <>
            <p>
              For I bonds bought from {formatDate(current.start)} through {formatDate(current.end)}, the fixed rate is{' '}
              <strong className="num">{formatPercent(current.fixed)}</strong> and the six-month inflation rate is{' '}
              <strong className="num">{formatPercent(current.inflation)}</strong>, for a{' '}
              <Term id="composite-rate">composite rate</Term> of <strong className="num">{formatPercent(current.composite)}</strong> a
              year.
            </p>
            <SourceNote kind="live" source={DATA_SOURCES.iBondRates.name} href={DATA_SOURCES.iBondRates.href} asOf={current.start} asOfLabel="Rate period starting" />
          </>
        )
      }
    </QueryState>
  )
}

export default function TreasurySecurities() {
  return (
    <>
      <Prose>
        <p className="!text-lede text-muted">
          Treasury borrows for as little as four weeks and as long as thirty years, using a handful of security types. Each
          suits a different need, for the government and for investors.
        </p>
        <p>
          Most fall into one group: <Term id="marketable">marketable securities</Term>, sold at auction and then freely bought and
          sold by investors. These are bills, notes, bonds, TIPS and floating rate notes. Savings bonds are{' '}
          <Term id="nonmarketable">nonmarketable</Term>: they’re registered to you, and only Treasury can buy them back.
        </p>
      </Prose>

      <Wide>
        <TreasuryCompare />
      </Wide>

      <Prose>
        <h2>Bills: interest without coupons</h2>
        <p>
          <Term id="treasury-bill">Treasury bills</Term> don’t pay coupons. You buy them for less than face value and receive face
          value at maturity; the difference is your interest.
        </p>
        <BillExample />
        <p>
          Bills are the government’s short-term borrowing, and Treasury sells some every week. Because they mature quickly, their
          yields track the Federal Reserve’s policy rate closely, and they carry the least price risk of any Treasury.
        </p>

        <h2>Notes and bonds: coupons every six months</h2>
        <p>
          <Term id="treasury-note">Notes</Term> (2 to 10 years) and <Term id="treasury-bond">bonds</Term> (20 and 30 years) work
          exactly like the bond in <Link to="/learn/how-bonds-work">chapter 2</Link>: a fixed coupon every six months and face
          value at maturity. The 10-year note’s yield is one of the most closely watched interest rates in the world; mortgage rates, for one, tend to move
          with it.
        </p>

        <h2>TIPS: protection from inflation</h2>
        <p>
          <Term id="tips">TIPS</Term> adjust their principal with the Consumer Price Index. If prices rise 3% in a year, a $1,000
          TIPS becomes roughly $1,030 of principal, and the fixed coupon is paid on the larger amount. At maturity you get the
          inflation-adjusted principal or the original, whichever is greater. The trade-off is a lower starting coupon, and federal
          tax each year on the inflation adjustment even though you don’t receive it until maturity.
        </p>

        <h2>Floating rate notes</h2>
        <p>
          <Term id="frn">FRNs</Term> pay interest every three months at a rate that resets weekly to the latest 13-week bill rate,
          plus a small fixed spread. Their price barely moves when rates change, because their rate moves instead.
        </p>

        <h2>Savings bonds: built for individuals</h2>
        <p>
          Savings bonds are sold only to individuals and certain entities, only electronically through{' '}
          <Term id="treasurydirect">TreasuryDirect</Term>, from $25. Interest isn’t paid out; it’s added to the bond’s value and
          paid when you cash in, and federal tax on it waits until then.
        </p>
        <p>
          <Term id="i-bond">I bonds</Term> combine a fixed rate, set when you buy and kept for the bond’s 30-year life, with an
          inflation rate that resets every May and November.
        </p>
        <IBondRate />
        <p>
          <Term id="ee-bond">EE bonds</Term> pay a fixed rate, and Treasury guarantees they’ll double in value if held 20 years. You
          can buy up to $10,000 of each type per person per calendar year. Both must be held at least a year, and cashing in before
          five years costs the last three months of interest.
        </p>

        <h2>How they’re sold</h2>
        <p>
          Every marketable Treasury is sold at <Term id="auction">auction</Term>, where the price investors are willing to pay sets
          the yield. You can <Link to="/treasuries#how-auctions-work">follow a real auction step by step</Link> and see{' '}
          <Link to="/treasuries#latest">the latest real results</Link>.
        </p>
      </Prose>

      <Takeaways
        items={[
          'Bills (up to a year) pay interest as a discount; notes and bonds pay fixed coupons every six months.',
          'TIPS and I bonds adjust for inflation; FRNs adjust for short-term interest rates.',
          'Savings bonds are nonmarketable, sold only through TreasuryDirect, and defer federal tax until you cash in.',
          'Interest on all of them is exempt from state and local income tax.',
        ]}
      />
    </>
  )
}
