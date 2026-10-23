import { lazy, Suspense } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/layout/Page.jsx'
import { Container } from '@/components/ui/Surfaces.jsx'
import { CHAPTERS, chapterBySlug } from '@/content/chapters/index.js'
import NotFound from './NotFound.jsx'

const CONTENT = Object.fromEntries(CHAPTERS.map((c) => [c.slug, lazy(c.load)]))

export default function Chapter() {
  const { slug } = useParams()
  const chapter = chapterBySlug(slug)
  if (!chapter) return <NotFound />
  const Content = CONTENT[chapter.slug]

  const index = CHAPTERS.indexOf(chapter)
  const prev = CHAPTERS[index - 1]
  const next = CHAPTERS[index + 1]

  return (
    <article>
      <PageHeader eyebrow={`Chapter ${chapter.number} of ${CHAPTERS.length}`} title={chapter.title} lede={chapter.summary} />
      <Suspense
        fallback={
          <Container>
            <div className="skeleton h-96 w-full max-w-3xl" />
          </Container>
        }
      >
        <Content />
      </Suspense>

      <Container as="nav" aria-label="Chapters" className="mt-16">
        <div className="grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
          {prev ? (
            <Link to={`/learn/${prev.slug}`} className="group rounded-md p-3 hover:bg-glass-1">
              <span className="text-[0.8125rem] font-semibold text-muted">← Previous: Chapter {prev.number}</span>
              <span className="mt-1 block font-serif text-[1.3rem] text-fg">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/learn/${next.slug}`} className="group rounded-md p-3 text-right hover:bg-glass-1">
              <span className="text-[0.8125rem] font-semibold text-muted">Next: Chapter {next.number} →</span>
              <span className="mt-1 block font-serif text-[1.3rem] text-fg">{next.title}</span>
            </Link>
          ) : (
            <Link to="/bonds-vs-hysa" className="group rounded-md p-3 text-right hover:bg-glass-1">
              <span className="text-[0.8125rem] font-semibold text-muted">Put it to use →</span>
              <span className="mt-1 block font-serif text-[1.3rem] text-fg">Bonds vs. HYSA</span>
            </Link>
          )}
        </div>
      </Container>
    </article>
  )
}
