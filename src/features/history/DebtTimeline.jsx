import { useState } from 'react'
import { Segmented } from '@/components/ui/Fields.jsx'
import { Icon } from '@/components/ui/Icon.jsx'
import { GlassPanel } from '@/components/ui/Surfaces.jsx'
import { EVENTS, FIRST_YEAR, LAST_YEAR, TRACKS } from './events.js'

// Events crowd together after 1770, so the axis gives those 30 years more room than the century before.
const BREAK_YEAR = 1770
const BREAK_AT = 40

function axisPosition(year) {
  if (year <= BREAK_YEAR) return ((year - FIRST_YEAR) / (BREAK_YEAR - FIRST_YEAR)) * BREAK_AT
  return BREAK_AT + ((year - BREAK_YEAR) / (LAST_YEAR - BREAK_YEAR)) * (100 - BREAK_AT)
}

// Neighboring years on the compressed part of the axis would draw on top of each other, so keep dots a minimum distance apart.
const MIN_GAP = 1.6

function trackPositions(track) {
  let last = -Infinity
  return EVENTS.filter((e) => e.track === track).map((e) => {
    last = Math.max(axisPosition(e.year), last + MIN_GAP)
    return { event: e, left: last }
  })
}

const TICKS = [1670, 1700, 1730, 1770, 1780, 1790, 1800]

const FILTERS = [
  { value: 'both', label: 'Both' },
  { value: 'britain', label: 'Britain' },
  { value: 'us', label: 'United States' },
]

export function DebtTimeline() {
  const [filter, setFilter] = useState('both')
  const [selected, setSelected] = useState(EVENTS[0])

  const visible = filter === 'both' ? EVENTS : EVENTS.filter((e) => e.track === filter)
  const event = visible.includes(selected) ? selected : visible[0]
  const index = visible.indexOf(event)
  const rows = filter === 'both' ? ['britain', 'us'] : [filter]

  return (
    <GlassPanel className="p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-serif text-[1.45rem] leading-snug text-fg">Two paths to public credit, 1670–1800</h2>
        <Segmented legend="Show events from" hideLegend size="sm" value={filter} onChange={setFilter} options={FILTERS} />
      </div>

      <div className="mt-6 hidden md:block">
        {rows.map((track) => (
          <div key={track} className="grid grid-cols-[8.5rem_minmax(0,1fr)] items-center">
            <span className="flex items-center gap-2 text-[0.875rem] font-semibold text-fg">
              <span aria-hidden="true" className={`size-2 rounded-full ${TRACKS[track].dot}`} />
              {TRACKS[track].label}
            </span>
            <ol className="relative h-12" aria-label={`${TRACKS[track].label} events`}>
              <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-line-strong" />
              <span aria-hidden="true" className="absolute inset-y-1 border-l border-dashed border-line-strong" style={{ left: `${BREAK_AT}%` }} />
              {trackPositions(track).map(({ event: e, left }) => {
                const isCurrent = e === event
                return (
                  <li key={`${e.year}-${e.title}`} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${left}%` }}>
                    <button
                      type="button"
                      onClick={() => setSelected(e)}
                      aria-current={isCurrent ? 'step' : undefined}
                      aria-label={`${e.year}: ${e.title}`}
                      title={`${e.year}: ${e.title}`}
                      className="group flex size-5 items-center justify-center rounded-full"
                    >
                      <span
                        aria-hidden="true"
                        className={`rounded-full transition-all duration-150 ${TRACKS[track].dot} ${
                          isCurrent ? 'size-4 outline-2 outline-offset-2 outline-ice' : 'size-2.5 opacity-80 group-hover:size-3.5 group-hover:opacity-100'
                        }`}
                      />
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        ))}
        <div className="grid grid-cols-[8.5rem_minmax(0,1fr)]">
          <span />
          <div aria-hidden="true" className="relative h-6 text-[0.75rem] text-muted">
            {TICKS.map((y) => (
              <span key={y} className="num absolute top-1 -translate-x-1/2" style={{ left: `${axisPosition(y)}%` }}>
                {y}
              </span>
            ))}
          </div>
        </div>
      </div>

      <label className="mt-5 block md:hidden">
        <span className="sr-only">Jump to an event</span>
        <select
          value={index}
          onChange={(e) => setSelected(visible[Number(e.target.value)])}
          className="w-full rounded-md border border-control bg-night-2 px-3 py-2 text-[0.9375rem] text-fg"
        >
          {visible.map((e, i) => (
            <option key={`${e.year}-${e.title}`} value={i}>
              {e.year} · {e.title}
            </option>
          ))}
        </select>
      </label>

      <div aria-live="polite" className="mt-6 min-h-[9.5rem] border-t border-line pt-5">
        <p className="eyebrow flex items-center gap-2">
          <span aria-hidden="true" className={`size-2 rounded-full ${TRACKS[event.track].dot}`} />
          <span className="num">{event.year}</span> · {TRACKS[event.track].label}
        </p>
        <h3 className="mt-2 font-serif text-[1.35rem] leading-snug text-fg">{event.title}</h3>
        <p className="mt-2 max-w-[68ch] text-[1rem] leading-relaxed text-muted">{event.body}</p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-line pt-4">
        <p className="text-[0.8125rem] leading-snug text-muted">
          Event <span className="num text-fg/90">{index + 1}</span> of <span className="num text-fg/90">{visible.length}</span>
          <span className="hidden md:inline"> · The axis widens after 1770, where events crowd together.</span>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelected(visible[index - 1])}
            disabled={index === 0}
            className="inline-flex size-10 items-center justify-center rounded-md border border-control text-fg hover:bg-glass-2 disabled:border-line disabled:text-subtle"
            aria-label="Previous event"
          >
            <Icon name="arrowLeft" />
          </button>
          <button
            type="button"
            onClick={() => setSelected(visible[index + 1])}
            disabled={index === visible.length - 1}
            className="inline-flex size-10 items-center justify-center rounded-md border border-control text-fg hover:bg-glass-2 disabled:border-line disabled:text-subtle"
            aria-label="Next event"
          >
            <Icon name="arrowRight" />
          </button>
        </div>
      </div>
    </GlassPanel>
  )
}
