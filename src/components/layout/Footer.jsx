import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Surfaces.jsx'
import { CHAPTERS } from '@/content/chapters/index.js'
import { DATA_SOURCES } from '@/content/sources.js'
import { Wordmark } from './Wordmark.jsx'

const footerLink = 'text-muted underline-offset-4 hover:text-fg hover:underline'

export function Footer() {
  const sources = [
    DATA_SOURCES.debtToPenny,
    DATA_SOURCES.auctions,
    DATA_SOURCES.yieldCurve,
    DATA_SOURCES.catalog,
    DATA_SOURCES.census,
  ]
  return (
    <footer className="mt-24 border-t border-line bg-night-2">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <div className="text-ice">
            <Wordmark />
          </div>
          <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-muted">
            An independent guide to how the United States borrows, built on public data from Treasury,
            data.gov and the Census Bureau.
          </p>
          <p className="mt-4 max-w-sm text-[0.8125rem] leading-relaxed text-muted">
            Educational content only, not investment, tax or legal advice. Not affiliated with or endorsed by any
            government agency.
          </p>
          <p className="mt-4 text-[0.8125rem] text-muted">© 2026 Taylor C. Candelaria. All rights reserved.</p>
        </div>

        <nav aria-label="Learn">
          <h2 className="font-sans text-sm font-semibold text-fg">Learn</h2>
          <ul className="mt-3 space-y-2 text-[0.9375rem]">
            {CHAPTERS.map((c) => (
              <li key={c.slug}>
                <Link to={`/learn/${c.slug}`} className={footerLink}>
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Tools and reference">
          <h2 className="font-sans text-sm font-semibold text-fg">Tools and reference</h2>
          <ul className="mt-3 space-y-2 text-[0.9375rem]">
            <li><Link to="/treasuries" className={footerLink}>Treasury securities</Link></li>
            <li><Link to="/bonds-vs-hysa" className={footerLink}>Bonds vs. HYSA</Link></li>
            <li><Link to="/state-local" className={footerLink}>State &amp; local debt</Link></li>
            <li><Link to="/data" className={footerLink}>Data desk</Link></li>
            <li><Link to="/explore" className={footerLink}>Explore public data</Link></li>
            <li><Link to="/glossary" className={footerLink}>Glossary</Link></li>
            <li><Link to="/methodology" className={footerLink}>Methodology &amp; sources</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="font-sans text-sm font-semibold text-fg">Data sources</h2>
          <ul className="mt-3 space-y-2 text-[0.9375rem]">
            {sources.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noreferrer" className={footerLink}>
                  {s.name}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  )
}
