import { PageHeader, Section } from '@/components/layout/Page.jsx'
import { CatalogExplorer } from '@/features/catalog/CatalogExplorer.jsx'

export default function Explore() {
  return (
    <>
      <PageHeader
        eyebrow="Explore public data"
        title="Find what governments publish about their finances"
        lede="Federal agencies, states, counties and cities post budgets, debt schedules, bond programs and audited financial reports to data.gov. Search the catalog and filter by level of government."
      />
      <Section className="!pt-0">
        <CatalogExplorer />
      </Section>
    </>
  )
}
