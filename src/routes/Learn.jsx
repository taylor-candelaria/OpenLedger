import { Link } from 'react-router-dom'
import { PageHeader, Section } from '@/components/layout/Page.jsx'
import { Button } from '@/components/ui/Button.jsx'
import { CHAPTERS } from '@/content/chapters/index.js'

export default function Learn() {
  return (
    <>
      <PageHeader
        eyebrow="Learn"
        title="Public bonds, from the beginning"
        lede="Five short chapters that build on each other, from what the national debt is to why bond prices move. Each one has interactive examples and live data, and terms you can tap to define."
      >
        <div className="mt-8">
          <Button to={`/learn/${CHAPTERS[0].slug}`} icon="arrowRight">
            Begin with chapter 1
          </Button>
        </div>
      </PageHeader>
      <Section className="!pt-0">
        <ol className="border-t border-line">
          {CHAPTERS.map((c) => (
            <li key={c.slug} className="border-b border-line">
              <Link
                to={`/learn/${c.slug}`}
                className="group grid gap-2 py-8 transition-colors hover:bg-glass-1 sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8 sm:px-3"
              >
                <span className="num text-ice">Chapter {c.number}</span>
                <span>
                  <span className="block font-serif text-[1.75rem] leading-tight text-fg">{c.title}</span>
                  <span className="mt-2 block max-w-[60ch] text-[1rem] leading-relaxed text-muted">{c.summary}</span>
                </span>
                <span aria-hidden="true" className="hidden text-xl text-muted transition-transform group-hover:translate-x-1 group-hover:text-fg sm:block">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Section>
    </>
  )
}
