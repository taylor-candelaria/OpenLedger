import { useId, useState } from 'react'

const inputBase =
  'h-11 w-full rounded-md border border-control bg-night-2 px-3 text-fg num text-[0.9375rem] ' +
  'transition-colors duration-150 hover:border-muted focus-visible:border-ice'

function Hint({ id, children }) {
  if (!children) return null
  return (
    <p id={id} className="mt-1.5 text-sm leading-snug text-muted">
      {children}
    </p>
  )
}

function NumericInput({ value, onChange, min, max, step = 1, id, className = '', ...aria }) {
  const [draft, setDraft] = useState(String(value))
  const [lastValue, setLastValue] = useState(value)
  if (value !== lastValue) {
    setLastValue(value)
    if (Number(draft) !== value) setDraft(String(value))
  }

  function commit(raw) {
    const n = Number(String(raw).replace(/[,$%\s]/g, ''))
    if (!Number.isFinite(n)) {
      setDraft(String(value))
      return
    }
    const clamped = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n))
    onChange(clamped)
    setDraft(String(clamped))
  }

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={draft}
      onChange={(e) => {
        setDraft(e.target.value)
        const n = Number(e.target.value)
        if (e.target.value !== '' && Number.isFinite(n) && n >= (min ?? -Infinity) && n <= (max ?? Infinity)) {
          onChange(n)
        }
      }}
      onBlur={(e) => commit(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit(e.currentTarget.value)
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault()
          const dir = e.key === 'ArrowUp' ? 1 : -1
          commit(round(value + dir * step, step))
        }
      }}
      className={`${inputBase} ${className}`}
      {...aria}
    />
  )
}

function round(n, step) {
  const decimals = (String(step).split('.')[1] ?? '').length
  return Number(n.toFixed(decimals))
}

export function RangeField({ label, value, onChange, min, max, step = 1, unit, prefix, hint, format }) {
  const id = useId()
  const hintId = `${id}-hint`
  const fill = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <label htmlFor={`${id}-range`} className="text-[0.9375rem] font-semibold text-fg">
          {label}
        </label>
        <div className="flex items-center gap-1.5">
          {prefix && <span className="text-sm text-muted">{prefix}</span>}
          <NumericInput
            id={`${id}-num`}
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            aria-label={`${label}${unit ? ` (${unit})` : ''}, exact value`}
            className="!h-9 !w-[6.5rem] text-right"
          />
          {unit && <span className="w-7 text-sm text-muted">{unit}</span>}
        </div>
      </div>
      <input
        id={`${id}-range`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={format ? format(value) : `${prefix ?? ''}${value}${unit ? ` ${unit}` : ''}`}
        aria-describedby={hint ? hintId : undefined}
        className="range mt-1.5"
        style={{ '--fill': `${fill}%` }}
      />
      <Hint id={hintId}>{hint}</Hint>
    </div>
  )
}

export function Segmented({ legend, value, onChange, options, hideLegend = false, size = 'md' }) {
  const name = useId()
  return (
    <fieldset>
      <legend className={hideLegend ? 'sr-only' : 'mb-1.5 text-[0.9375rem] font-semibold text-fg'}>{legend}</legend>
      <div className="inline-flex max-w-full flex-wrap gap-1 rounded-md border border-line bg-night-2 p-1">
        {options.map((o) => {
          const checked = o.value === value
          return (
            <label
              key={o.value}
              className={`relative cursor-pointer rounded-sm font-semibold transition-colors duration-150
                ${size === 'sm' ? 'px-2.5 py-1 text-[0.8125rem]' : 'px-3.5 py-1.5 text-sm'}
                ${checked ? 'bg-surface-2 text-fg shadow-[inset_0_0_0_1px_var(--color-line-strong)]' : 'text-muted hover:text-fg'}
                has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ice`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {o.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
