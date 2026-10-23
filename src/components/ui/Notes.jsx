import { formatDate } from '@/lib/format.js'
import { Icon } from './Icon.jsx'

const KINDS = {
  live: { label: 'Live data', dot: 'bg-teal' },
  illustrative: { label: 'Illustrative example', dot: 'bg-series-savings' },
  hypothetical: { label: 'Hypothetical', dot: 'bg-series-savings' },
  reference: { label: 'Published figure', dot: 'bg-muted' },
}

export function SourceNote({ kind, source, href, asOf, asOfLabel = 'Data as of', children, className = '' }) {
  const k = KINDS[kind]
  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[0.8125rem] leading-snug text-muted ${className}`}>
      <span className="inline-flex items-center gap-1.5 font-semibold text-fg">
        <span aria-hidden="true" className={`inline-block size-1.5 translate-y-[-1px] rounded-full ${k.dot}`} />
        {k.label}
      </span>
      {source && (
        <span>
          <span aria-hidden="true">· </span>
          {href ? (
            <a href={href} target="_blank" rel="noreferrer" className="underline decoration-subtle/60 underline-offset-2 hover:text-fg hover:decoration-fg">
              {source}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            source
          )}
        </span>
      )}
      {asOf && (
        <span>
          <span aria-hidden="true">· </span>
          {asOfLabel} <span className="num text-fg/90">{formatDate(asOf)}</span>
        </span>
      )}
      {children && (
        <span>
          <span aria-hidden="true">· </span>
          {children}
        </span>
      )}
    </p>
  )
}

export function Callout({ tone = 'note', title, children, className = '' }) {
  const caution = tone === 'caution'
  return (
    <aside
      className={`surface flex gap-3 rounded-md p-4 sm:p-5 ${caution ? 'border-l-2 !border-l-caution' : 'border-l-2 !border-l-ice/70'} ${className}`}
    >
      <Icon name={caution ? 'caution' : 'info'} className={`mt-0.5 ${caution ? 'text-caution' : 'text-ice'}`} />
      <div className="min-w-0 text-[0.9375rem] leading-relaxed">
        <p className="font-semibold text-fg">{title}</p>
        <div className="mt-1 text-muted [&_a]:text-ice [&_a]:underline [&_p+p]:mt-2">{children}</div>
      </div>
    </aside>
  )
}

export function AdviceNote({ className = '' }) {
  return (
    <p className={`text-[0.8125rem] leading-relaxed text-muted ${className}`}>
      Educational illustration only, not investment, tax or legal advice. Results depend on the
      assumptions shown, and real rates change.
    </p>
  )
}
