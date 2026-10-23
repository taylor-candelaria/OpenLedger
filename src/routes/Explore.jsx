import { useState } from 'react'
import { PageHeader, Section } from '@/components/layout/Page.jsx'
import { CatalogExplorer } from '@/features/catalog/CatalogExplorer.jsx'
import { NotesPanel } from '@/features/catalog/NotesPanel.jsx'

export default function Explore() {
  const [attach, setAttach] = useState(null)

  return (
    <>
      <PageHeader
        eyebrow="Explore public data"
        title="Find what governments publish about their finances"
        lede="Federal agencies, states, counties and cities post budgets, debt schedules, bond programs and audited financial reports to data.gov. Search the catalog, filter by level of government, and keep notes on what you find."
      />
      <Section className="!pt-0">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-8">
          <CatalogExplorer onSaveToNotes={(d) => setAttach({ ...d })} />
          <div className="lg:self-start">
            <NotesPanel attach={attach} onAttachUsed={() => setAttach(null)} />
          </div>
        </div>
      </Section>
    </>
  )
}
