import { Container } from '@/components/ui/Surfaces.jsx'
import { YieldBackdrop } from '@/features/backdrop/YieldBackdrop.jsx'
import { useTitle } from '@/lib/useTitle.js'

export function PageHeader({ eyebrow, title, lede, children }) {
  useTitle(title)
  return (
    <div className="relative overflow-hidden pt-32 pb-12 sm:pt-40 sm:pb-16">
      <div className="atmosphere" aria-hidden="true">
        <YieldBackdrop />
      </div>
      <Container className="relative">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-3 max-w-4xl text-headline text-fg">{title}</h1>
        {lede && <div className="mt-5 max-w-[62ch] text-lede text-muted">{lede}</div>}
        {children}
      </Container>
    </div>
  )
}

export function Section({ id, eyebrow, title, lede, className = '', children }) {
  return (
    <section id={id} aria-labelledby={id && title ? `${id}-title` : undefined} className={`py-12 sm:py-16 ${className}`}>
      <Container>
        {(eyebrow || title) && (
          <div className="mb-8 max-w-3xl sm:mb-10">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && (
              <h2 id={id ? `${id}-title` : undefined} className="mt-2.5 text-title text-fg sm:text-[2.2rem] sm:leading-[1.15]">
                {title}
              </h2>
            )}
            {lede && <div className="mt-4 max-w-[62ch] text-[1.0625rem] leading-relaxed text-muted">{lede}</div>}
          </div>
        )}
        {children}
      </Container>
    </section>
  )
}
