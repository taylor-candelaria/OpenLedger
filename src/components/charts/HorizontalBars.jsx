export function HorizontalBars({ items, format, color = 'bg-series-treasury', label }) {
  if (!items.length) return <p className="text-muted">No figures to show.</p>
  const max = Math.max(...items.map((i) => i.value)) || 1
  return (
    <ul className="space-y-3" aria-label={label}>
      {items.map((it) => (
        <li key={it.label} className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_6.5rem] sm:items-center sm:gap-4">
          <span className="text-[0.9375rem] text-fg">
            {it.label}
            {it.note && <span className="block text-[0.8125rem] text-muted">{it.note}</span>}
          </span>
          <span className="flex items-center gap-3">
            <span className="block h-3 flex-1 rounded-full bg-night-2" aria-hidden="true">
              <span className={`block h-full rounded-full ${color}`} style={{ width: `${Math.max(0.6, (it.value / max) * 100)}%` }} />
            </span>
            <span className="num w-24 shrink-0 text-right text-[0.875rem] text-fg sm:hidden">{format(it.value)}</span>
          </span>
          <span className="num hidden text-right text-[0.875rem] text-fg sm:block">{format(it.value)}</span>
        </li>
      ))}
    </ul>
  )
}
