import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Section } from '@/components/layout/Page.jsx'
import { useTitle } from '@/lib/useTitle.js'
import { ArrowLink, Button } from '@/components/ui/Button.jsx'
import { Segmented } from '@/components/ui/Fields.jsx'
import { SourceNote } from '@/components/ui/Notes.jsx'
import { Container, GlassPanel } from '@/components/ui/Surfaces.jsx'
import { Term } from '@/components/ui/Term.jsx'
import { CHAPTERS } from '@/content/chapters/index.js'
import { CashFlowStrip } from '@/features/bond/CashFlowStrip.jsx'
import { Lifecycle } from '@/features/bond/Lifecycle.jsx'
import { YieldBackdrop } from '@/features/backdrop/YieldBackdrop.jsx'
import { DebtNow } from '@/features/debt/DebtNow.jsx'
import { YieldCurveChart } from '@/features/rates/YieldCurveChart.jsx'
import { SavingsTeaser } from '@/features/savings/SavingsTeaser.jsx'

const HERO_TERMS = [
  { value: '2', label: '2-year' },
  { value: '10', label: '10-year' },
  { value: '30', label: '30-year' },
]

const FAMILY = [
  { name: 'Bills', term: '4 to 52 weeks', pays: 'Bought below face value; the difference is your interest', to: '/treasuries#bills' },
  { name: 'Notes', term: '2 to 10 years', pays: 'Fixed coupon every six months', to: '/treasuries#notes' },
  { name: 'Bonds', term: '20 and 30 years', pays: 'Fixed coupon every six months', to: '/treasuries#bonds' },
  { name: 'TIPS', term: '5, 10 and 30 years', pays: 'Principal adjusts with inflation', to: '/treasuries#tips' },
  { name: 'Floating rate notes', term: '2 years', pays: 'Rate resets weekly with bill yields', to: '/treasuries#frn' },
  { name: 'Savings bonds', term: 'Up to 30 years', pays: 'Interest builds until you cash in', to: '/treasuries#savings-bonds' },
]

export default function Home() {
  useTitle(null)
  const [term, setTerm] = useState('10')

  return (
    <>
      <div className="relative overflow-hidden">
        <div className="atmosphere" aria-hidden="true">
          <YieldBackdrop align="right" />
        </div>
        <Container className="relative grid items-center gap-12 pt-32 pb-16 sm:pt-40 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14 lg:pb-24">
          <div>
            <p className="eyebrow">Public bonds, Treasury securities and government debt</p>
            <h1 className="mt-4 text-display text-fg">Understand the debt that finances a nation.</h1>
            <p className="mt-6 max-w-[54ch] text-lede text-muted">
              See how governments borrow, how Treasury securities pay you, and what bond prices, yields and interest rates
              really mean, using live data from the U.S. Treasury.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/learn/public-debt" icon="arrowRight">
                Start learning
              </Button>
              <Button to="/bonds-vs-hysa" variant="secondary">
                Bonds vs. HYSA
              </Button>
            </div>
          </div>

          <GlassPanel className="glass-clear p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Anatomy of a Treasury</p>
                <p className="mt-1.5 font-serif text-[1.3rem] leading-snug text-fg">$1,000 at a 4.5% coupon</p>
              </div>
              <Segmented legend="Maturity" hideLegend size="sm" value={term} onChange={setTerm} options={HERO_TERMS} />
            </div>
            <div className="mt-5">
              <CashFlowStrip face={1000} couponRate={0.045} years={Number(term)} height={200} compact />
            </div>
            <div className="mt-3 border-t border-line pt-3">
              <SourceNote kind="illustrative">
                Bar heights aren’t to scale: each coupon is 2.25% of the face value. The last coupon and the face value are paid
                on the same day.
              </SourceNote>
            </div>
          </GlassPanel>
        </Container>
      </div>

      <Section className="!pt-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <p className="eyebrow">The federal debt today</p>
            <h2 className="mt-2.5 text-title text-fg sm:text-[2.2rem] sm:leading-[1.15]">What the United States owes, updated daily</h2>
            <div className="prose-ol mt-5 !text-[1.0625rem] text-muted">
              <p>
                When the government spends more than it collects in taxes, it covers the gap by selling{' '}
                <Term id="treasury-security">Treasury securities</Term>: IOUs that promise to pay back what was borrowed, plus
                interest. The total of those still outstanding is the federal debt.
              </p>
              <p>
                Most of it is owned by investors outside the government: people, banks, pension funds, the Federal Reserve and
                foreign governments. The rest is held by federal trust funds, such as Social Security, which lend their
                surpluses to the Treasury.
              </p>
            </div>
            <div className="mt-6">
              <ArrowLink to="/learn/public-debt">Chapter 1: What public debt is</ArrowLink>
            </div>
          </div>
          <div className="lg:pt-10">
            <DebtNow />
          </div>
        </div>
      </Section>

      <Section
        eyebrow="How a bond works"
        title="A bond is a loan with a schedule"
        lede={
          <>
            You lend money today. In return the borrower pays interest on set dates and repays the{' '}
            <Term id="face-value">face value</Term> at <Term id="maturity">maturity</Term>. Step through the life of a Treasury
            note.
          </>
        }
      >
        <Lifecycle />
        <div className="mt-6">
          <ArrowLink to="/learn/how-bonds-work">Chapter 2: How a bond works</ArrowLink>
        </div>
      </Section>

      <Section
        eyebrow="What borrowing costs today"
        title="One curve sets the price of money"
        lede={
          <>
            The <Term id="yield-curve">yield curve</Term> shows what investors demand to lend to the U.S. government for different
            lengths of time. Mortgage rates, corporate borrowing costs and savings rates all take their cue from it.
          </>
        }
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12">
          <YieldCurveChart compact />
          <div className="prose-ol !text-[1.0625rem] text-muted lg:pt-4">
            <p>
              Each point is a <Term id="yield">yield</Term>: the annual return for buying that security at today’s price. When
              yields rise, the prices of existing bonds fall, and the reverse. That seesaw is the single most important idea in
              bond investing.
            </p>
            <p>
              <ArrowLink to="/learn/yields-and-rates">Chapter 4: Yields and interest rates</ArrowLink>
            </p>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="The Treasury family"
        title="Six ways to lend to the government"
        lede="They differ in how long they last and how they pay you. All are backed by the full faith and credit of the United States."
      >
        <ul className="divide-y divide-line border-y border-line">
          {FAMILY.map((f) => (
            <li key={f.name}>
              <Link
                to={f.to}
                className="group grid gap-1 py-5 transition-colors hover:bg-glass-1 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,0.7fr)_minmax(0,1.4fr)_auto] sm:items-baseline sm:gap-6 sm:px-3"
              >
                <span className="font-serif text-[1.3rem] text-fg">{f.name}</span>
                <span className="num text-[0.9375rem] text-ice">{f.term}</span>
                <span className="text-[0.9375rem] text-muted">{f.pays}</span>
                <span aria-hidden="true" className="hidden text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-fg sm:block">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <ArrowLink to="/treasuries">Compare them, with the latest auction results</ArrowLink>
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="eyebrow">Bonds vs. high-yield savings</p>
            <h2 className="mt-2.5 text-title text-fg sm:text-[2.2rem] sm:leading-[1.15]">The same rate isn’t the same return</h2>
            <div className="prose-ol mt-5 !text-[1.0625rem] text-muted">
              <p>
                Savings account interest is taxed by the federal government <em>and</em>, in states with an income tax, by the
                state. Interest on Treasury bills, notes, bonds and savings bonds is taxed only federally. Where there is a state
                income tax, a Treasury can leave you with more even at a slightly lower headline rate.
              </p>
              <p>
                Bonds come with trade-offs, too: savings accounts are more flexible, and selling a bond before it matures can
                mean taking a loss. The comparison tool lays out both sides.
              </p>
            </div>
          </div>
          <SavingsTeaser />
        </div>
      </Section>

      <Section eyebrow="Start with the basics" title="Five chapters, in order">
        <ol className="grid gap-x-12 border-t border-line md:grid-cols-2">
          {CHAPTERS.map((c) => (
            <li key={c.slug} className="border-b border-line">
              <Link to={`/learn/${c.slug}`} className="group flex gap-5 py-6 hover:bg-glass-1 sm:px-2">
                <span className="num pt-1 text-[0.9375rem] text-ice">{String(c.number).padStart(2, '0')}</span>
                <span>
                  <span className="block font-serif text-[1.35rem] leading-snug text-fg group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">
                    {c.title}
                  </span>
                  <span className="mt-1 block text-[0.9375rem] leading-relaxed text-muted">{c.summary}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <p className="text-[1rem] leading-relaxed text-muted">
            Beyond Washington, states, cities and school districts borrow too, through{' '}
            <Term id="municipal-bond">municipal bonds</Term> with their own tax rules.{' '}
            <Link to="/state-local" className="link">Read about state and local debt</Link>.
          </p>
          <p className="text-[1rem] leading-relaxed text-muted">
            Want the raw numbers? The <Link to="/data" className="link">data desk</Link> charts live Treasury series, and{' '}
            <Link to="/explore" className="link">explore</Link> searches thousands of public finance datasets on data.gov.
          </p>
        </div>
      </Section>
    </>
  )
}
