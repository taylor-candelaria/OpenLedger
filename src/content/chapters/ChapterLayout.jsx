import { Container } from '@/components/ui/Surfaces.jsx'

export function Prose({ children }) {
  return (
    <Container>
      <div className="prose-ol lg:ml-[8.33%]">{children}</div>
    </Container>
  )
}

export function Wide({ children, className = '' }) {
  return <Container className={`my-12 sm:my-14 ${className}`}>{children}</Container>
}

export function Takeaways({ items }) {
  return (
    <Container className="mt-14">
      <aside aria-label="Key points" className="surface rounded-lg p-6 sm:p-8 lg:ml-[8.33%] lg:max-w-[calc(68ch+4rem)]">
        <p className="eyebrow">Key points</p>
        <ul className="mt-4 space-y-3 text-[1rem] leading-relaxed text-fg">
          {items.map((t, i) => (
            <li key={i} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-ice" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </aside>
    </Container>
  )
}
