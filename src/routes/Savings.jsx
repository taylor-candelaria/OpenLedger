import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, Section } from '@/components/layout/Page.jsx'
import { ExternalLink } from '@/components/ui/Button.jsx'
import { AdviceNote, Callout, SourceNote } from '@/components/ui/Notes.jsx'
import { QueryState } from '@/components/ui/QueryState.jsx'
import { Container, Surface } from '@/components/ui/Surfaces.jsx'
import { Term } from '@/components/ui/Term.jsx'
import { DATA_SOURCES, EE_BOND_RATE } from '@/content/sources.js'
import { useAuctions, useIBondRates } from '@/lib/api/hooks.js'
import { eeGuaranteeImpliedRate } from '@/lib/finance/savingsBonds.js'
import { afterTaxYield, fullyTaxableEquivalent } from '@/lib/finance/tax.js'
import { formatDate, formatPercent, formatUSD, toISODate } from '@/lib/format.js'

const CONTENTS = [
  ['basics', 'Two ways to earn interest'],
  ['taxes', 'The tax difference'],
  ['example', 'A worked example'],
  ['options', 'Your bond options'],
  ['tradeoffs', 'Trade-offs'],
  ['when', 'Which fits when'],
  ['buying', 'How to buy'],
]

const TRADEOFFS = [
  {
    aspect: 'Getting your money out',
    hysa: 'Any time, usually within a day or two.',
    treasury: 'At maturity, or sell early through a broker at the market price.',
    ibond: 'Not for 12 months; before 5 years you lose 3 months of interest.',
    muni: 'At maturity, or sell early; prices for individual munis can vary widely.',
  },
  {
    aspect: 'If interest rates change',
    hysa: 'Your rate floats with the market, up or down.',
    treasury: 'Locked until each bill matures, then it reprices.',
    ibond: 'Fixed part is locked for 30 years; inflation part resets every 6 months.',
    muni: 'Locked to maturity. The price moves if you sell before then.',
  },
  {
    aspect: 'What stands behind it',
    hysa: 'FDIC insurance up to $250,000 per depositor, per bank, per ownership category.',
    treasury: 'The full faith and credit of the U.S. government.',
    ibond: 'The full faith and credit of the U.S. government.',
    muni: 'The issuer’s taxes or project revenue. Defaults are rare but do happen.',
  },
  {
    aspect: 'Income tax on interest',
    hysa: 'Federal and state, every year.',
    treasury: 'Federal only.',
    ibond: 'Federal only, deferred until you cash in.',
    muni: 'Usually no federal tax; often no state tax if the bond is from the state you live in.',
  },
  {
    aspect: 'How much you can put in',
    hysa: 'No limit, though insurance stops at $250,000.',
    treasury: 'From $100, up to $10 million per auction for noncompetitive bids.',
    ibond: '$25 minimum, $10,000 per person per calendar year.',
    muni: 'Often sold in $5,000 amounts through brokers.',
  },
]

const COLUMNS = [
  { key: 'hysa', label: 'HYSA' },
  { key: 'treasury', label: 'Treasury bills' },
  { key: 'ibond', label: 'I bonds' },
  { key: 'muni', label: 'Municipal bonds' },
]

function Prose({ children }) {
  return (
    <Container>
      <div className="prose-ol lg:ml-[8.33%]">{children}</div>
    </Container>
  )
}

function SectionTitle({ id, eyebrow, children }) {
  return (
    <>
      <p className="eyebrow !mt-16 scroll-mt-28 first:!mt-0" id={id}>
        {eyebrow}
      </p>
      <h2 className="!mt-2">{children}</h2>
    </>
  )
}

function WorkedExample() {
  const query = useAuctions()
  return (
    <QueryState query={query} label="the latest bill auction" skeleton={<div className="skeleton h-40 w-full" />}>
      {({ latest }) => {
        const bill = latest.nominal.find((a) => a.term === '26-Week')
        if (!bill) return <p>No recent 26-week bill auction is available right now.</p>
        const hysaApy = 4.0
        const rates = { federalRate: 0.24, stateRate: 0.06 }
        const hysaKept = afterTaxYield(hysaApy / 100, 'hysa', rates) * 100
        const billKept = afterTaxYield(bill.investmentRate / 100, 'treasury', rates) * 100
        const needed = fullyTaxableEquivalent(bill.investmentRate / 100, 'treasury', rates) * 100
        const amount = 10000
        return (
          <>
            <p>
              Say you have <strong>{formatUSD(amount)}</strong>, pay a 24% federal and 6% state tax rate on interest, and are
              choosing between a savings account paying <strong className="num">{formatPercent(hysaApy)}</strong> and the
              26-week Treasury bill from the {formatDate(bill.auctionDate)} auction, which yielded{' '}
              <strong className="num">{formatPercent(bill.investmentRate, 3)}</strong>.
            </p>
            <ul>
              <li>
                The savings account’s interest is taxed by both governments (30% in all), so you keep about{' '}
                <strong className="num">{formatPercent(hysaKept)}</strong>, or roughly{' '}
                <span className="num">{formatUSD((amount * hysaKept) / 100)}</span> over a year.
              </li>
              <li>
                The bill’s interest is taxed only federally (24%), so you keep about{' '}
                <strong className="num">{formatPercent(billKept)}</strong>, or roughly{' '}
                <span className="num">{formatUSD((amount * billKept) / 100)}</span> over a year, if you roll it into a second
                26-week bill at the same rate.
              </li>
              <li>
                To match the bill after taxes, the savings account would have to pay about{' '}
                <strong className="num">{formatPercent(needed)}</strong>.
              </li>
            </ul>
            <p>
              Flip one assumption and the answer can change. In a state with no income tax, the two compare directly on their
              headline rates. And if the savings rate rises while your bill is locked in, the account catches up.
            </p>
            <SourceNote kind="live" source={DATA_SOURCES.auctions.name} href={DATA_SOURCES.auctions.href} asOf={bill.auctionDate} asOfLabel="Auction">
              The 4.00% savings rate and the tax rates are examples
            </SourceNote>
          </>
        )
      }}
    </QueryState>
  )
}

function IBondNow() {
  const query = useIBondRates()
  return (
    <QueryState query={query} label="the I bond rate" skeleton={<span className="skeleton inline-block h-5 w-64" />}>
      {({ current }) =>
        current && (
          <>
            <p>
              For I bonds bought {formatDate(current.start)} through {formatDate(current.end)}, the rate is{' '}
              <strong className="num">{formatPercent(current.composite)}</strong> a year: a{' '}
              <span className="num">{formatPercent(current.fixed)}</span> fixed rate plus an inflation adjustment.
            </p>
            <SourceNote kind="live" source={DATA_SOURCES.iBondRates.name} href={DATA_SOURCES.iBondRates.href} asOf={current.start} asOfLabel="Rate period starting" />
          </>
        )
      }
    </QueryState>
  )
}

export default function Savings() {
  const eeImplied = eeGuaranteeImpliedRate() * 100
  const [eeRateCurrent] = useState(() => toISODate(new Date()) <= EE_BOND_RATE.to)
  return (
    <>
      <PageHeader
        eyebrow="Bonds vs. HYSA"
        title="Public bonds or a high-yield savings account?"
        lede={
          <>
            Both pay you interest for parking cash. A <Term id="hysa">high-yield savings account</Term> is flexible and insured;
            public bonds can lock in a rate and skip some taxes entirely. Here’s how they differ, and when each makes sense.
          </>
        }
      >
        <nav aria-label="On this page" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {CONTENTS.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="inline-flex h-9 items-center rounded-md border border-line px-3.5 text-sm font-semibold text-muted hover:border-line-strong hover:bg-glass-2 hover:text-fg"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <Prose>
        <SectionTitle id="basics" eyebrow="The basics">
          Two ways to earn interest
        </SectionTitle>
        <p>
          A <strong>high-yield savings account</strong> (HYSA) is a bank deposit that pays more than a typical savings account.
          You can add or withdraw money whenever you like, deposits are protected by <Term id="fdic">FDIC insurance</Term>, and
          the rate, quoted as an <Term id="apy">APY</Term>, can change at any time. When the Federal Reserve cuts rates, banks
          often lower HYSA rates soon after.
        </p>
        <p>
          A <strong>public bond</strong> is a loan to a government. You lend a set amount for a set time and are paid a rate
          fixed in advance. U.S. Treasury securities are backed by the{' '}
          <Term id="full-faith-and-credit">full faith and credit</Term> of the United States; municipal bonds are backed by a
          state or local government. The trade is flexibility for certainty: your money is committed for a while, but your rate
          is too.
        </p>

        <SectionTitle id="taxes" eyebrow="The tax difference">
          Why the headline rate isn’t the whole story
        </SectionTitle>
        <p>
          The rate a bank or bond advertises is before tax. What you keep depends on which governments tax that interest, and
          that’s where public bonds have real advantages.
        </p>
        <h3>Treasuries skip state and local income tax</h3>
        <p>
          Interest on Treasury bills, notes, bonds and savings bonds is subject to federal income tax but, by federal law, exempt
          from state and local income tax. HYSA interest is taxed federally and, wherever there is a state or local income tax,
          there too. The higher the income tax where you live, the more a Treasury
          is worth compared with a savings account paying the same rate.
        </p>
        <h3>Savings bonds let federal tax wait</h3>
        <p>
          You don’t owe federal tax on I bond or EE bond interest until you cash the bond in, or it stops earning interest after
          30 years, unless you choose to report the interest each year instead. Until then, the untaxed interest keeps compounding. If the money goes to qualified college costs, the{' '}
          <Term id="education-exclusion">education exclusion</Term> can make that interest federally tax-free, subject to income
          limits (IRS Form 8815).
        </p>
        <h3>Municipal bonds skip federal tax</h3>
        <p>
          Interest on most <Term id="municipal-bond">municipal bonds</Term> is exempt from federal income tax, and states usually
          exempt their own issuers’ bonds for residents. That’s why muni yields look low: a 3% tax-free yield can be worth more
          than 4% in a savings account to someone in a high bracket. The{' '}
          <Term id="tax-equivalent-yield">tax-equivalent yield</Term> is the rate a taxable account would need to match it.
        </p>
        <p className="muted">
          Exceptions apply. Interest on some <Term id="private-activity-bond">private activity bonds</Term> counts for the
          alternative minimum tax, muni interest is counted when figuring how much of your Social Security is taxable, and buying a
          bond well below face value can create taxable income. See{' '}
          <ExternalLink href="https://www.irs.gov/publications/p550">IRS Publication 550</ExternalLink>.
        </p>

        <SectionTitle id="example" eyebrow="A worked example">
          The same $10,000, two places to keep it
        </SectionTitle>
        <WorkedExample />

        <SectionTitle id="options" eyebrow="Your bond options">
          Which public bonds compete with a HYSA
        </SectionTitle>
        <h3>Treasury bills</h3>
        <p>
          The closest substitute for a savings account. <Term id="treasury-bill">Bills</Term> mature in 4 to 52 weeks, start at
          $100, and pay their interest as a discount: you pay a little less than face value and get the full amount back at
          maturity. Many savers buy a series of them, rolling each one over as it matures, so some money comes due every few
          weeks.
        </p>
        <h3>Treasury notes</h3>
        <p>
          For money you won’t need for 2 to 10 years, <Term id="treasury-note">notes</Term> lock in a rate for the whole term and
          pay interest every six months. If you might need the money early, remember that selling before maturity means
          accepting the market price, which can be lower if rates have risen.
        </p>
        <h3>I bonds</h3>
        <p>
          <Term id="i-bond">I bonds</Term> protect against inflation: their rate rises when prices rise. They can’t be cashed in
          for 12 months, cost 3 months of interest if cashed before 5 years, and are limited to $10,000 per person per year.
        </p>
        <IBondNow />
        <h3>EE bonds</h3>
        <p>
          <Term id="ee-bond">EE bonds</Term> pay a modest fixed rate ({eeRateCurrent ? 'currently' : 'it was'}{' '}
          <strong className="num">{formatPercent(EE_BOND_RATE.rate)}</strong> for bonds issued {formatDate(EE_BOND_RATE.from)}{' '}
          through {formatDate(EE_BOND_RATE.to)}{eeRateCurrent ? '' : '; see TreasuryDirect for the current rate'}), but Treasury guarantees they’ll double in value after 20 years. Held that long,
          the guarantee works out to about <strong className="num">{formatPercent(eeImplied)}</strong> a year. Cash in sooner and
          you get only the fixed rate, so they suit money you truly won’t need for two decades.
        </p>
        <SourceNote kind="reference" source={EE_BOND_RATE.source} href={EE_BOND_RATE.href}>
          Treasury announces new rates each May 1 and November 1
        </SourceNote>
        <h3>Municipal bonds</h3>
        <p>
          Bonds from states, cities and school districts, usually most valuable to people in higher tax brackets who buy bonds
          from their own state. Unlike Treasuries, munis carry some <Term id="credit-risk">credit risk</Term>, so the issuer’s
          finances matter. <Link to="/state-local">More on state and local bonds</Link>.
        </p>
      </Prose>

      <Section id="tradeoffs" eyebrow="Trade-offs" title="Side by side">
        <Surface className="overflow-x-auto">
          <table className="data-table min-w-[760px]">
            <caption className="sr-only">Trade-offs between a HYSA, Treasury bills, I bonds and municipal bonds</caption>
            <thead>
              <tr>
                <th scope="col" className="w-[16%]">
                  <span className="sr-only">Aspect</span>
                </th>
                {COLUMNS.map((c) => (
                  <th key={c.key} scope="col">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRADEOFFS.map((row) => (
                <tr key={row.aspect}>
                  <th scope="row" className="!align-top !text-[0.9375rem] !whitespace-normal !text-fg">
                    {row.aspect}
                  </th>
                  {COLUMNS.map((c) => (
                    <td key={c.key} className="text-[0.9375rem] leading-relaxed text-muted">
                      {row[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Surface>
      </Section>

      <Prose>
        <SectionTitle id="when" eyebrow="Which fits when">
          Matching the tool to the money
        </SectionTitle>
        <h3>Your emergency fund: usually a HYSA</h3>
        <p>
          Money you might need tomorrow belongs where you can get it tomorrow, at a stable value. A HYSA does that. Short bills
          come close, but you have to sell them or wait for them to mature.
        </p>
        <h3>A goal one to three years away: consider bills or notes</h3>
        <p>
          Saving for a down payment or a car? A ladder of bills, or a note that matures when you need the money, locks in today’s
          rate and, in a state with an income tax, keeps more of the interest.
        </p>
        <h3>Protecting savings from inflation: I bonds</h3>
        <p>
          If you can leave money alone for at least a year, and ideally five, I bonds keep pace with inflation and defer federal
          tax. The annual purchase limit keeps them a supplement rather than a home for large sums.
        </p>
        <h3>Living in a high-tax state</h3>
        <p>
          The state tax exemption on Treasuries matters most here, and munis issued by the state you live in may beat both, especially in higher federal
          brackets.
        </p>
        <h3>When the HYSA wins outright</h3>
        <p>
          A savings account is often the better choice when its rate beats bills and you live in a state with no income tax, or
          when you expect rates to rise and want your savings to rise with them. Its flexibility costs you nothing then.
        </p>

        <SectionTitle id="buying" eyebrow="How to buy">
          Buying public bonds yourself
        </SectionTitle>
        <p>
          <Term id="treasurydirect">TreasuryDirect</Term> sells bills, notes, bonds, TIPS and floating rate notes at auction with no fees, and it is
          the only place to buy electronic savings bonds. Securities bought there are meant to be held; to sell one early you
          first transfer it to a bank or broker.
        </p>
        <p>
          Most brokerage accounts can also buy Treasuries at auction or on the{' '}
          <Term id="secondary-market">secondary market</Term>, and sell them before maturity. Municipal bonds are bought this way
          too; the MSRB’s free <ExternalLink href="https://emma.msrb.org/">EMMA</ExternalLink> site shows a bond’s documents and
          recent prices. You can see the latest Treasury auction results on the{' '}
          <Link to="/treasuries#latest">Treasury securities page</Link>.
        </p>
      </Prose>

      <Container className="mt-14">
        <div className="lg:ml-[8.33%] lg:max-w-[calc(68ch+4rem)]">
          <Callout tone="caution" title="Not risk-free, just low default risk">
            <p>
              Treasuries carry very little risk of not being repaid, but they still carry{' '}
              <Term id="inflation-risk">inflation risk</Term> (except TIPS and I bonds),{' '}
              <Term id="reinvestment-risk">reinvestment risk</Term> when bills roll over at lower rates, and price risk if sold
              early. A savings account carries the risk that the bank cuts your rate tomorrow.
            </p>
          </Callout>
          <AdviceNote className="mt-6" />
        </div>
      </Container>
    </>
  )
}
