import { useId, useMemo, useState } from 'react'
import { PageHeader, Section } from '@/components/layout/Page.jsx'
import { Icon } from '@/components/ui/Icon.jsx'
import { GLOSSARY, GLOSSARY_BY_ID, GLOSSARY_GROUPS } from '@/content/glossary.js'

export default function Glossary() {
  const inputId = useId()
  const [filter, setFilter] = useState('')
  const needle = filter.trim().toLowerCase()

  const groups = useMemo(
    () =>
      GLOSSARY_GROUPS.map((group) => ({
        group,
        entries: GLOSSARY.filter(
          (g) => g.group === group && (!needle || g.term.toLowerCase().includes(needle) || g.short.toLowerCase().includes(needle)),
        ),
      })).filter((g) => g.entries.length),
    [needle],
  )
  const count = groups.reduce((s, g) => s + g.entries.length, 0)

  return (
    <>
      <PageHeader
        eyebrow="Glossary"
        title="The words of public finance, in plain language"
        lede="Every term underlined with dots elsewhere on the site is defined here. Hover over or tap one in an article to see its definition without leaving the page."
      >
        <div className="mt-8 max-w-md">
          <label htmlFor={inputId} className="mb-2 block text-[0.9375rem] font-semibold text-fg">
            Filter terms
          </label>
          <div className="relative">
            <Icon name="search" className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
            <input
              id={inputId}
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-11 w-full rounded-md border border-control bg-night-2 pr-3 pl-11 text-fg hover:border-muted focus-visible:border-ice"
            />
          </div>
          <p className="mt-2 text-[0.8125rem] text-muted" aria-live="polite">
            {count} of {GLOSSARY.length} terms
          </p>
        </div>
      </PageHeader>

      <Section className="!pt-0">
        <div className="grid gap-14 lg:grid-cols-[13rem_minmax(0,1fr)]">
          <nav aria-label="Glossary sections" className="hidden lg:block">
            <ul className="sticky top-28 space-y-1.5 text-[0.9375rem]">
              {groups.map((g) => (
                <li key={g.group}>
                  <a href={`#group-${slug(g.group)}`} className="text-muted hover:text-fg">
                    {g.group}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-14">
            {groups.map((g) => (
              <section key={g.group} aria-labelledby={`group-${slug(g.group)}`}>
                <h2 id={`group-${slug(g.group)}`} className="scroll-mt-28 border-b border-line pb-3 font-serif text-[1.6rem] text-fg">
                  {g.group}
                </h2>
                <dl className="divide-y divide-line">
                  {g.entries.map((e) => (
                    <div key={e.id} id={e.id} className="grid scroll-mt-28 gap-2 py-5 outline-none target:bg-glass-1 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-8">
                      <dt className="font-serif text-[1.15rem] leading-snug text-fg">{e.term}</dt>
                      <dd className="max-w-[68ch] text-[1rem] leading-relaxed text-muted">
                        <p>{e.short}</p>
                        {e.long && <p className="mt-2">{e.long}</p>}
                        {e.related?.length > 0 && (
                          <p className="mt-2 text-[0.875rem]">
                            See also:{' '}
                            {e.related
                              .filter((r) => GLOSSARY_BY_ID[r])
                              .map((r, i) => (
                                <span key={r}>
                                  {i > 0 && ', '}
                                  <a href={`#${r}`} className="link">
                                    {GLOSSARY_BY_ID[r].term}
                                  </a>
                                </span>
                              ))}
                          </p>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z]+/g, '-')
}
