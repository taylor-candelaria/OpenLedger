import { Link } from 'react-router-dom'
import { PageHeader, Section } from '@/components/layout/Page.jsx'
import { Term } from '@/components/ui/Term.jsx'
import {
  AverageRatesChart,
  CompositionChart,
  DebtHistoryChart,
  DebtTrendChart,
  InterestExpenseChart,
  OwnershipChart,
} from '@/features/data-desk/DebtCharts.jsx'
import { YieldCurveChart } from '@/features/rates/YieldCurveChart.jsx'

const SECTIONS = [
  { id: 'debt', label: 'The debt' },
  { id: 'rates', label: 'Interest rates' },
  { id: 'cost', label: 'What it costs' },
  { id: 'structure', label: 'Who holds what' },
]

export default function DataDesk() {
  return (
    <>
      <PageHeader
        eyebrow="Data desk"
        title="Federal debt, rates and auctions, from the source"
        lede={
          <>
            Every chart here is drawn live from the U.S. Treasury’s public data. Each says where the numbers come from and how
            current they are, and each can be switched to a table.
          </>
        }
      >
        <nav aria-label="On this page" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="inline-flex h-9 items-center rounded-md border border-line px-3.5 text-sm font-semibold text-muted hover:border-line-strong hover:bg-glass-2 hover:text-fg">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <Section id="debt" eyebrow="The debt" title="How much, and how fast it’s growing" className="!pt-0">
        <div className="grid gap-8">
          <DebtTrendChart />
          <DebtHistoryChart />
        </div>
      </Section>

      <Section
        id="rates"
        eyebrow="Interest rates"
        title="What it costs the government to borrow"
        lede={
          <>
            The <Term id="yield-curve">yield curve</Term> shows today’s market rates; the average rate shows what the government
            pays on everything it has already borrowed.
          </>
        }
      >
        <div className="grid gap-8">
          <YieldCurveChart />
          <AverageRatesChart />
        </div>
        <p className="mt-6 text-[0.9375rem] text-muted">
          Results of individual auctions are on the <Link to="/treasuries#latest" className="link">Treasury securities page</Link>.
        </p>
      </Section>

      <Section id="cost" eyebrow="What it costs" title="The interest bill">
        <InterestExpenseChart />
      </Section>

      <Section id="structure" eyebrow="Who holds what" title="The shape of the debt">
        <div className="grid gap-8 xl:grid-cols-2">
          <CompositionChart />
          <OwnershipChart />
        </div>
      </Section>
    </>
  )
}
