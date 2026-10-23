import { Link } from 'react-router-dom'
import { PageHeader, Section } from '@/components/layout/Page.jsx'
import { ArrowLink, ExternalLink } from '@/components/ui/Button.jsx'
import { Callout } from '@/components/ui/Notes.jsx'
import { Surface } from '@/components/ui/Surfaces.jsx'
import { Term } from '@/components/ui/Term.jsx'
import { fullyTaxableEquivalent } from '@/lib/finance/tax.js'
import { formatPercent } from '@/lib/format.js'
import { StateDebtChart } from '@/features/state-local/StateDebtChart.jsx'

const DIFFERENCES = [
  ['Who borrows', 'The U.S. Treasury, for the federal government', 'States, cities, counties, school districts, utilities and public authorities'],
  ['What backs it', 'The full faith and credit of the United States', 'The issuer’s taxing power (general obligation) or a project’s revenue (revenue bonds)'],
  ['Default risk', 'Considered very low', 'Low for most, but real; it varies widely by issuer'],
  ['Federal income tax on interest', 'Yes', 'Usually no'],
  ['State income tax on interest', 'No', 'Usually no if the bond is from the state you live in; often yes for bonds from other states'],
  ['How you buy', 'TreasuryDirect, or a bank or broker', 'A bank or broker; some issuers sell directly to residents'],
  ['Where to research', 'TreasuryDirect and Fiscal Data', 'Official statements and prices on MSRB’s EMMA'],
]

function MuniExample() {
  const yieldRate = 0.03
  const high = { federalRate: 0.24, stateRate: 0.06 }
  const low = { federalRate: 0.12, stateRate: 0 }
  const homeState = fullyTaxableEquivalent(yieldRate, 'muniInState', high) * 100
  const otherState = fullyTaxableEquivalent(yieldRate, 'muniOutOfState', high) * 100
  const lowBracket = fullyTaxableEquivalent(yieldRate, 'muniInState', low) * 100
  return (
    <>
      <p>Take a muni yielding 3.00%, for example:</p>
      <ul>
        <li>
          For someone paying 24% federal and 6% state tax on interest who buys a muni issued by the state they live in, the
          interest is free of both. A taxable account would need to pay about{' '}
          <strong className="num">{formatPercent(homeState)}</strong> to match it.
        </li>
        <li>
          The same person buying a muni from a different state still avoids federal tax but pays their state’s 6%, so the
          equivalent falls to about <strong className="num">{formatPercent(otherState)}</strong>.
        </li>
        <li>
          Someone in the 12% bracket living in a state with no income tax gains less from the exemption: the equivalent is
          about <strong className="num">{formatPercent(lowBracket)}</strong>.
        </li>
      </ul>
      <p className="muted">
        These are hypothetical tax rates. The calculation uses marginal rates and ignores the SALT deduction and the
        alternative minimum tax.
      </p>
    </>
  )
}

export default function StateLocal() {
  return (
    <>
      <PageHeader
        eyebrow="State and local debt"
        title="Borrowing closer to home"
        lede={
          <>
            Roads, schools, water systems and transit are usually paid for with <Term id="municipal-bond">municipal bonds</Term>.
            They work like Treasuries in most ways, with two big differences: who stands behind them, and how they’re taxed.
          </>
        }
      />

      <Section className="!pt-0">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="prose-ol">
            <h2 className="!mt-0">Two kinds of promise</h2>
            <p>
              A <Term id="general-obligation">general obligation bond</Term> is backed by the issuer’s power to tax. Voters often
              have to approve them, and they’re repaid from the general budget.
            </p>
            <p>
              A <Term id="revenue-bond">revenue bond</Term> is repaid from a specific stream of money: tolls on a bridge, fees at an
              airport, charges on water bills. If the project earns less than expected, bondholders can be paid late or less.
            </p>
            <h2>Why munis aren’t Treasuries</h2>
            <p>
              The federal government can tax the whole country and borrows in its own currency. A city or state can’t do either, so
              its bonds carry more <Term id="credit-risk">credit risk</Term>. Most issuers repay without trouble, but defaults have
              happened. That’s why munis carry <Term id="credit-rating">credit ratings</Term>, and why weaker issuers have to pay
              higher yields than stronger ones. (High-quality munis often yield less than Treasuries before tax, because their
              interest is usually tax-exempt.)
            </p>
            <p>
              Each muni comes with an official statement describing the issuer, the project and the risks. The Municipal Securities
              Rulemaking Board publishes these, along with trade prices, on{' '}
              <ExternalLink href="https://emma.msrb.org/">EMMA</ExternalLink>.
            </p>
          </div>
          <Surface className="self-start overflow-x-auto">
            <table className="data-table min-w-[520px]">
              <caption className="!px-4 !pt-4 text-left">Treasuries and municipal bonds compared</caption>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr-only">Feature</span>
                  </th>
                  <th scope="col">Treasuries</th>
                  <th scope="col">Municipal bonds</th>
                </tr>
              </thead>
              <tbody>
                {DIFFERENCES.map(([label, t, m]) => (
                  <tr key={label}>
                    <th scope="row" className="!align-top !whitespace-normal !text-fg">
                      {label}
                    </th>
                    <td className="text-[0.9375rem] text-muted">{t}</td>
                    <td className="text-[0.9375rem] text-muted">{m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Surface>
        </div>
      </Section>

      <Section
        id="by-state"
        eyebrow="The numbers"
        title="How much state and local governments owe"
        lede="Census Bureau survey data on debt outstanding, for every state. Figures arrive with a lag of about two years."
      >
        <StateDebtChart />
      </Section>

      <Section
        id="taxes"
        eyebrow="The tax advantage"
        title="What a muni’s tax exemption is worth"
        lede="Because most muni interest is free of federal tax (and often state tax), a lower muni yield can beat a higher taxable one. The higher your bracket, the more it’s worth."
      >
        <div className="prose-ol">
          <h3 className="!mt-0">How the exemption works</h3>
          <p>
            Interest on most municipal bonds is exempt from federal income tax. States add a second layer: most states with an
            income tax don’t tax interest on bonds issued within their borders (by the state itself or its cities, counties,
            school districts and agencies) for people who live there, but do tax interest on munis from other states. A handful
            of states handle this differently, so the rules where you live are what count.
          </p>
          <h3>Comparing a muni with a taxable account</h3>
          <p>
            Because muni interest skips some or all income tax, its yield can’t be compared directly with a savings account or
            CD, whose interest is fully taxed. The usual yardstick is the{' '}
            <Term id="tax-equivalent-yield">tax-equivalent yield</Term>: the rate a fully taxable account would need to pay to
            leave you with the same amount after tax. You get it by dividing the muni’s yield by one minus the tax rate it
            avoids.
          </p>
          <MuniExample />
          <p>
            The pattern holds generally: the higher your tax bracket, and the higher the income tax where you live, the more a
            muni’s exemption is worth. For someone in a low bracket, a taxable account or a Treasury may simply pay more.
          </p>
        </div>
        <Callout tone="caution" title="Exceptions to the exemption" className="mt-6">
          <p>
            Interest on some <Term id="private-activity-bond">private activity bonds</Term> is subject to the alternative minimum tax.
            Muni interest counts when figuring how much of your Social Security benefit is taxable. Capital gains from selling a muni
            are taxable, and buying one well below face value can create taxable income. Some states tax their own munis or exempt
            others’. See <ExternalLink href="https://www.irs.gov/publications/p550">IRS Publication 550</ExternalLink> and your
            state’s rules.
          </p>
        </Callout>
      </Section>

      <Section id="find" eyebrow="Go further" title="Find your own government’s numbers">
        <div className="grid gap-6 md:grid-cols-2">
          <p className="text-[1rem] leading-relaxed text-muted">
            Many states, counties and cities publish budgets, debt schedules and bond program reports as open data.{' '}
            <Link to="/explore" className="link">Search them on data.gov</Link>, filtered by level of government.
          </p>
          <div>
            <ArrowLink to="/bonds-vs-hysa">How munis and Treasuries compare with a HYSA</ArrowLink>
          </div>
        </div>
      </Section>
    </>
  )
}
