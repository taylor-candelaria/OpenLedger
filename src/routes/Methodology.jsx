import { PageHeader, Section } from '@/components/layout/Page.jsx'
import { Callout } from '@/components/ui/Notes.jsx'
import { Surface } from '@/components/ui/Surfaces.jsx'
import { DATA_SOURCES, REFERENCES } from '@/content/sources.js'

const FORMULAS = [
  {
    name: 'Bond price from yield',
    formula: 'P = Σ (C/2) / (1 + y/2)ᵗ + F / (1 + y/2)ⁿ',
    note: 'C is the annual coupon in dollars, F face value, y the yield to maturity, n the number of half-years. Priced on a coupon date, so there is no accrued interest. Checked against Treasury’s published prices for new notes.',
  },
  {
    name: 'Yield from price',
    formula: 'Solve P(y) = price for y',
    note: 'Newton’s method with a bisection fallback. Price falls steadily as yield rises, so there is exactly one answer.',
  },
  {
    name: 'Treasury bill price and investment rate',
    formula: 'P = 100 × (1 − d × t / 360);  i = (100 − P) / P × 365 / t',
    note: 'd is the discount rate and t days to maturity. Bills longer than half a year use Treasury’s quadratic formula (31 CFR Part 356, Appendix B). Checked against every bill auction in the test fixtures.',
  },
  {
    name: 'I bond composite rate',
    formula: 'fixed + (2 × semiannual inflation) + (fixed × semiannual inflation)',
    note: 'Floored at zero. Interest compounds every six months. Redeeming before five years forfeits three months of interest.',
  },
  {
    name: 'After-tax yield',
    formula: 'y × (1 − federal rate − state rate)',
    note: 'Each instrument drops the taxes it is exempt from: Treasuries and savings bonds drop state tax; munis from the state you live in drop both. Federal and state marginal rates are added, ignoring the SALT deduction and the AMT.',
  },
  {
    name: 'Fully taxable equivalent',
    formula: 'after-tax yield ÷ (1 − federal rate − state rate)',
    note: 'The savings account or CD rate that would leave you with the same amount after tax.',
  },
]

export default function Methodology() {
  const datasets = Object.values(DATA_SOURCES)
  return (
    <>
      <PageHeader
        eyebrow="Methodology and sources"
        title="How the numbers on this site are made"
        lede="Every figure is either live government data, labeled with its source and date, or the result of a stated calculation on stated assumptions. Nothing is estimated behind the scenes."
      />

      <Section className="!pt-0" eyebrow="Live data" title="Where the data comes from">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="prose-ol">
            <p>
              Treasury data comes from the <strong>Fiscal Data API</strong> and Treasury’s daily yield curve files, which the browser
              reads directly. Dataset searches use the <strong>data.gov Catalog API</strong>: through GSA’s api.data.gov gateway
              when a key is set, and data.gov’s public catalog search otherwise. The <strong>Census Bureau API</strong> and the{' '}
              <strong>SimplyCoding Todo App API</strong> behind research notes need a key or token. This site’s local server
              forwards all of these requests and adds any keys itself, keeping them out of the page code.
            </p>
            <p>
              Data is cached in your browser for an hour (daily series) or half a day (monthly series). Each chart shows the date of
              its latest observation. Treasury revises some series, notably ownership estimates, after first publication.
            </p>
            <p>
              The faint moving lines behind page headers are real data too: Treasury’s daily par yield curves for the past year,
              sampled weekly and blended from one week to the next. They stay still if
              your system is set to reduce motion.
            </p>
          </div>
          <Surface className="p-5">
            <ul className="divide-y divide-line text-[0.9375rem]">
              {datasets.map((d) => (
                <li key={d.href} className="py-2.5 first:pt-0 last:pb-0">
                  <a href={d.href} target="_blank" rel="noreferrer" className="link">
                    {d.name}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </Surface>
        </div>
      </Section>

      <Section eyebrow="Calculations" title="Formulas and assumptions">
        <dl className="divide-y divide-line border-y border-line">
          {FORMULAS.map((f) => (
            <div key={f.name} className="grid gap-2 py-6 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-10">
              <dt className="font-serif text-[1.2rem] text-fg">{f.name}</dt>
              <dd>
                <p className="num text-[0.9375rem] text-ice">{f.formula}</p>
                <p className="mt-2 max-w-[70ch] text-[0.9375rem] leading-relaxed text-muted">{f.note}</p>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-[70ch] text-[0.9375rem] leading-relaxed text-muted">
          Worked examples use the example rates they state, and live rates where they say so. Real savings rates float, bills
          reprice at each rollover and I bond rates reset every six months, so actual results will differ.
        </p>
      </Section>

      <Section eyebrow="References" title="Further reading">
        <div className="grid gap-10 md:grid-cols-2">
          {REFERENCES.map((g) => (
            <div key={g.group}>
              <h3 className="font-sans text-[0.9375rem] font-semibold text-fg">{g.group}</h3>
              <ul className="mt-3 space-y-2 text-[0.9375rem]">
                {g.items.map((i) => (
                  <li key={i.href}>
                    <a href={i.href} target="_blank" rel="noreferrer" className="link">
                      {i.name}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <Callout tone="caution" title="Not advice">
          <p>
            OpenLedger is an educational project. Nothing here is a recommendation to buy or sell any security, or tax or legal
            advice. Tax rules have exceptions this site doesn’t model; check IRS publications or a tax professional for your
            situation. OpenLedger is not affiliated with the U.S. Treasury, GSA, the Census Bureau or any other agency.
          </p>
        </Callout>
      </Section>
    </>
  )
}
