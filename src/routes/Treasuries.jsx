import { Link } from 'react-router-dom'
import { PageHeader, Section } from '@/components/layout/Page.jsx'
import { ArrowLink } from '@/components/ui/Button.jsx'
import { Term } from '@/components/ui/Term.jsx'
import { AuctionStory } from '@/features/treasuries/AuctionStory.jsx'
import { LatestAuctions } from '@/features/treasuries/LatestAuctions.jsx'
import { TreasuryCompare } from '@/features/treasuries/TreasuryCompare.jsx'

export default function Treasuries() {
  return (
    <>
      <PageHeader
        eyebrow="U.S. Treasury securities"
        title="The securities that fund the federal government"
        lede={
          <>
            The Treasury borrows by selling securities that range from four weeks to thirty years. All are backed by the{' '}
            <Term id="full-faith-and-credit">full faith and credit</Term> of the United States; they differ in how long they last
            and how they pay you.
          </>
        }
      />

      <Section className="!pt-0">
        <TreasuryCompare />
      </Section>

      <Section
        id="latest"
        eyebrow="Latest results"
        title="What Treasury paid at its most recent auctions"
        lede={
          <>
            Every marketable Treasury is first sold at <Term id="auction">auction</Term>. These are the latest completed results
            for each regularly issued security.
          </>
        }
      >
        <LatestAuctions />
      </Section>

      <Section
        id="how-auctions-work"
        eyebrow="How an auction works"
        title="How a Treasury auction works"
        lede={
          <>
            Treasury sells every marketable security at auction, using a{' '}
            <Term id="single-price-auction">single-price auction</Term>: investors bid, and the bids decide the yield the
            government pays. Here’s the schedule it follows, and a real auction, step by step.
          </>
        }
      >
        <AuctionStory />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <p className="text-[1rem] leading-relaxed text-muted">
            Individuals can bid through <Term id="treasurydirect">TreasuryDirect</Term> or a brokerage account. Bids placed
            through TreasuryDirect are noncompetitive: you accept the yield the auction sets, and your order is guaranteed to be
            filled.
          </p>
          <div className="space-y-3">
            <p>
              <Link to="/bonds-vs-hysa" className="link">
                How a bill’s after-tax return compares with a HYSA
              </Link>
            </p>
            <ArrowLink to="/learn/treasury-securities">Chapter 3: The Treasury family</ArrowLink>
          </div>
        </div>
      </Section>
    </>
  )
}
