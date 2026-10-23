import { useId, useState } from 'react'
import { Icon } from '@/components/ui/Icon.jsx'

export function ChartFrame({
  title,
  description,
  controls,
  legend,
  table,
  source,
  interpretation,
  children,
  className = '',
  as = 'glass',
}) {
  const id = useId()
  const [view, setView] = useState('chart')
  const frame = as === 'glass' ? 'glass-panel rounded-lg p-4 sm:p-6' : ''
  return (
    <figure aria-labelledby={`${id}-title`} className={`${frame} ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 max-w-[62ch]">
          <h3 id={`${id}-title`} className="font-serif text-[1.3rem] leading-snug text-fg">
            {title}
          </h3>
          {description && <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">{description}</p>}
        </div>
        {table && (
          <div className="inline-flex shrink-0 rounded-md border border-line bg-night-2 p-1" role="group" aria-label="View as">
            {[
              ['chart', 'Chart', 'chart'],
              ['table', 'Table', 'table'],
            ].map(([value, label, icon]) => (
              <button
                key={value}
                type="button"
                aria-pressed={view === value}
                onClick={() => setView(value)}
                className={`inline-flex h-8 items-center gap-1.5 rounded-sm px-2.5 text-[0.8125rem] font-semibold transition-colors
                  ${view === value ? 'bg-surface-2 text-fg shadow-[inset_0_0_0_1px_var(--color-line-strong)]' : 'text-muted hover:text-fg'}`}
              >
                <Icon name={icon} size={15} />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {controls && <div className="mt-4 flex flex-wrap items-end gap-3">{controls}</div>}
      {legend && view === 'chart' && <div className="mt-4">{legend}</div>}

      <div className="mt-4">
        {view === 'chart' || !table ? children : <div className="max-h-[420px] overflow-auto rounded-md border border-line bg-night-2">{table}</div>}
      </div>

      {interpretation && (
        <div className="mt-4 border-t border-line pt-4 text-[0.9375rem] leading-relaxed text-muted [&_strong]:font-semibold [&_strong]:text-fg">
          {interpretation}
        </div>
      )}
      {source && <figcaption className="mt-4">{source}</figcaption>}
    </figure>
  )
}

export function Legend({ items }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[0.875rem] text-muted">
      {items.map((it) => (
        <li key={it.label} className="inline-flex items-center gap-2">
          <svg width="26" height="10" aria-hidden="true">
            <line x1="1" y1="5" x2="25" y2="5" stroke={it.color} strokeWidth="2.5" strokeDasharray={it.dash} strokeLinecap="round" />
          </svg>
          <span className="text-fg">{it.label}</span>
          {it.note && <span className="num text-muted">{it.note}</span>}
        </li>
      ))}
    </ul>
  )
}

export function ChartTooltip({ active, payload, label, labelFormatter, valueFormatter, extra }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-pop pointer-events-none min-w-44 rounded-md px-3.5 py-3 text-[0.8125rem]">
      <p className="mb-1.5 font-semibold text-fg">{labelFormatter ? labelFormatter(label, payload) : label}</p>
      <ul className="space-y-1">
        {payload
          .filter((p) => p.value !== undefined && p.value !== null)
          .map((p) => (
            <li key={p.dataKey ?? p.name} className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 text-muted">
                <span aria-hidden="true" className="inline-block h-0.5 w-3 rounded-full" style={{ background: p.color ?? p.stroke }} />
                {p.name}
              </span>
              <span className="num text-fg">{valueFormatter ? valueFormatter(p.value, p) : p.value}</span>
            </li>
          ))}
      </ul>
      {extra && <div className="mt-2 border-t border-line pt-2 text-muted">{extra(payload)}</div>}
    </div>
  )
}

export function DataTable({ caption, columns, rows }) {
  return (
    <table className="data-table">
      <caption className="sr-only">{caption}</caption>
      <thead className="sticky top-0 bg-night-2">
        <tr>
          {columns.map((c) => (
            <th key={c.key} scope="col" className={c.numeric ? '!text-right' : ''}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.id ?? i}>
            {columns.map((c, j) =>
              j === 0 ? (
                <th key={c.key} scope="row" className="!border-b-line !text-[0.9375rem] !font-normal !text-fg !whitespace-normal">
                  {c.format ? c.format(r[c.key], r) : r[c.key]}
                </th>
              ) : (
                <td key={c.key} className={c.numeric ? 'is-num' : ''}>
                  {c.format ? c.format(r[c.key], r) : r[c.key]}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
