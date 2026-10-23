import { useId, useRef } from 'react'

export function Tabs({ label, tabs, value, onChange, children, className = '' }) {
  const base = useId()
  const refs = useRef([])

  function onKeyDown(e, index) {
    const last = tabs.length - 1
    let next = null
    if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1
    if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = last
    if (next === null) return
    e.preventDefault()
    onChange(tabs[next].id)
    refs.current[next]?.focus()
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        className="flex gap-1 overflow-x-auto border-b border-line [scrollbar-width:none]"
      >
        {tabs.map((t, i) => {
          const selected = t.id === value
          return (
            <button
              key={t.id}
              ref={(el) => (refs.current[i] = el)}
              role="tab"
              type="button"
              id={`${base}-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`${base}-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`relative -mb-px shrink-0 border-b-2 px-3.5 py-2.5 text-[0.9375rem] font-semibold transition-colors duration-150
                ${selected ? 'border-ice text-fg' : 'border-transparent text-muted hover:text-fg'}`}
            >
              {t.label}
            </button>
          )
        })}
      </div>
      <div
        role="tabpanel"
        id={`${base}-panel-${value}`}
        aria-labelledby={`${base}-tab-${value}`}
        tabIndex={0}
        className="pt-6 focus-visible:outline-offset-4"
      >
        {children(value)}
      </div>
    </div>
  )
}
