import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ExternalLink } from '@/components/ui/Button.jsx'
import { SourceNote } from '@/components/ui/Notes.jsx'
import { GlassPanel, Surface } from '@/components/ui/Surfaces.jsx'
import { Tabs } from '@/components/ui/Tabs.jsx'
import { Term } from '@/components/ui/Term.jsx'
import { PaymentPattern } from './PaymentPattern.jsx'
import { SECURITIES } from './securities.js'

const ROWS = [
  ['terms', 'Terms'],
  ['earns', 'How it earns'],
  ['paid', 'Interest paid'],
  ['minimum', 'Minimum'],
  ['buy', 'Where to buy'],
  ['sell', 'Sell before maturity?'],
  ['taxes', 'Taxes'],
]

export function TreasuryCompare() {
  const { hash } = useLocation()
  const fromHash = SECURITIES.find((s) => `#${s.id}` === hash)?.id
  const [selected, setSelected] = useState(fromHash ?? 'bills')
  const [lastHash, setLastHash] = useState(hash)
  if (hash !== lastHash) {
    setLastHash(hash)
    if (fromHash) setSelected(fromHash)
  }

  return (
    <div>
      {SECURITIES.map((s) => (
        <span key={s.id} id={s.id} className="block scroll-mt-28" aria-hidden="true" />
      ))}
      <Tabs
        label="Treasury securities"
        tabs={SECURITIES.map((s) => ({ id: s.id, label: s.short }))}
        value={selected}
        onChange={setSelected}
      >
        {(id) => {
          const s = SECURITIES.find((x) => x.id === id)
          return (
            <GlassPanel className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-12">
              <div>
                <h3 className="font-serif text-[1.6rem] leading-tight text-fg">
                  <Term id={s.glossary}>{s.name}</Term>
                </h3>
                <p className="num mt-2 text-ice">{s.terms}</p>
                <p className="mt-4 text-[1rem] leading-relaxed text-muted">{s.earns}</p>
                <div className="mt-6">
                  <PaymentPattern pattern={s.pattern} />
                </div>
              </div>
              <dl className="grid content-start gap-x-6 gap-y-4 sm:grid-cols-2">
                {ROWS.filter(([k]) => k !== 'terms' && k !== 'earns').map(([key, label]) => (
                  <div key={key} className={key === 'taxes' ? 'sm:col-span-2' : ''}>
                    <dt className="text-[0.8125rem] font-semibold text-muted">{label}</dt>
                    <dd className="mt-1 text-[0.9375rem] leading-relaxed text-fg">{s[key]}</dd>
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <ExternalLink href={s.href} className="text-[0.9375rem]">
                    TreasuryDirect: {s.name}
                  </ExternalLink>
                </div>
              </dl>
            </GlassPanel>
          )
        }}
      </Tabs>

      <details className="group mt-8">
        <summary className="cursor-pointer text-[0.9375rem] font-semibold text-ice">Compare all six in one table</summary>
        <Surface className="mt-4 overflow-x-auto">
          <table className="data-table min-w-[980px]">
            <caption className="sr-only">Comparison of Treasury securities</caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Feature</span>
                </th>
                {SECURITIES.map((s) => (
                  <th key={s.id} scope="col">
                    {s.short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([key, label]) => (
                <tr key={key}>
                  <th scope="row" className="!align-top !text-fg">
                    {label}
                  </th>
                  {SECURITIES.map((s) => (
                    <td key={s.id} className="text-[0.875rem] leading-relaxed text-muted">
                      {s[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Surface>
      </details>
      <SourceNote className="mt-4" kind="reference" source="TreasuryDirect" href="https://www.treasurydirect.gov/">
        Payment diagrams are schematic, not to scale.
      </SourceNote>
    </div>
  )
}
