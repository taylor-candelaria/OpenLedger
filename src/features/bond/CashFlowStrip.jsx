import { useId, useMemo, useState } from 'react'
import { couponCashFlows } from '@/lib/finance/bond.js'
import { formatUSD } from '@/lib/format.js'
import { COLORS, SERIES } from '@/lib/palette.js'
import { useMeasure } from '@/lib/useMeasure.js'

export function CashFlowStrip({ face, couponRate, years, price, height = 190, compact = false }) {
  const flows = useMemo(() => couponCashFlows({ face, couponRate, years }), [face, couponRate, years])
  const [ref, width] = useMeasure(640)
  const [active, setActive] = useState(null)
  const id = useId()

  const padL = 8
  const padR = compact ? 56 : 76
  const top = 34
  const baseline = height - 34
  const plotW = Math.max(120, width - padL - padR)
  const x = (t) => padL + 18 + (t / years) * (plotW - 18)
  const couponH = Math.max(10, Math.min(46, (baseline - top) * 0.32))
  const barW = Math.max(2, Math.min(10, (plotW / flows.length) * 0.5))
  const n = flows.length
  const last = flows[n - 1]

  const totalCoupons = flows.reduce((s, f) => s + f.coupon, 0)
  const activeFlow = active === null ? null : flows[active]

  function onKeyDown(e) {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return
    e.preventDefault()
    setActive((cur) => {
      if (e.key === 'Home') return 0
      if (e.key === 'End') return n - 1
      if (cur === null) return 0
      return e.key === 'ArrowRight' ? Math.min(n - 1, cur + 1) : Math.max(0, cur - 1)
    })
  }

  const yearStep = years <= 5 ? 1 : years <= 10 ? (plotW < 420 ? 5 : 2) : plotW < 420 ? 10 : 5

  return (
    <div ref={ref} className="w-full">
      <svg
        width={width}
        height={height}
        role="group"
        tabIndex={0}
        aria-label={`Payment schedule: ${n} coupon payments of ${formatUSD(last.coupon, { cents: true })}, then ${formatUSD(face)} principal at year ${years}. Use the arrow keys to step through payments.`}
        aria-describedby={`${id}-live`}
        onKeyDown={onKeyDown}
        onBlur={() => setActive(null)}
        onMouseLeave={() => setActive(null)}
        className="block overflow-visible rounded-md"
      >
        <g>
          <line x1={padL + 4} x2={padL + 4} y1={baseline} y2={baseline + 10} stroke={COLORS.axis} />
          <text x={padL} y={height - 6} fill={COLORS.muted} fontSize="12" fontFamily="IBM Plex Mono, monospace">
            Today
          </text>
          {price !== undefined && (
            <g>
              <path
                d={`M${padL + 4} ${top + 6} v${baseline - top - 16}`}
                stroke={COLORS.muted}
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <path d={`M${padL} ${baseline - 14} l4 8 l4 -8`} fill="none" stroke={COLORS.muted} strokeWidth="1.5" />
              <text x={padL + 12} y={top + 4} fill={COLORS.fg} fontSize="12.5" fontFamily="IBM Plex Mono, monospace">
                You pay {formatUSD(price)}
              </text>
            </g>
          )}
        </g>

        <line x1={padL} x2={padL + plotW + 8} y1={baseline} y2={baseline} stroke={COLORS.axis} />

        {Array.from({ length: Math.floor(years / yearStep) }, (_, i) => (i + 1) * yearStep).map((yr) => (
          <g key={yr}>
            <line x1={x(yr)} x2={x(yr)} y1={baseline} y2={baseline + 5} stroke={COLORS.axis} />
            {yr !== years && (
              <text x={x(yr)} y={height - 6} textAnchor="middle" fill={COLORS.muted} fontSize="12" fontFamily="IBM Plex Mono, monospace">
                {yr}y
              </text>
            )}
          </g>
        ))}

        {flows.map((f, i) => {
          const isActive = active === i
          return (
            <g key={f.period} onMouseEnter={() => setActive(i)}>
              <rect
                x={x(f.time) - Math.max(barW, 10) / 2}
                y={top}
                width={Math.max(barW, 10)}
                height={baseline - top}
                fill="transparent"
              />
              {couponRate > 0 && (
                <rect
                  x={x(f.time) - barW / 2}
                  y={baseline - couponH}
                  width={barW}
                  height={couponH}
                  rx={Math.min(2, barW / 2)}
                  fill={isActive ? COLORS.ice : SERIES.treasury.color}
                />
              )}
            </g>
          )
        })}

        <g onMouseEnter={() => setActive(n - 1)}>
          {(() => {
            const px = x(years) + Math.max(barW, 6) / 2 + 6
            const pw = compact ? 16 : 20
            const breakY = top + (baseline - top) * 0.42
            return (
              <>
                <rect x={px} y={top + 6} width={pw} height={baseline - top - 6} rx="3" fill={active === n - 1 ? COLORS.ice : '#7fa6c9'} />
                <path
                  d={`M${px - 3} ${breakY + 4} l${pw + 6} -7 M${px - 3} ${breakY + 10} l${pw + 6} -7`}
                  stroke={COLORS.chart}
                  strokeWidth="3"
                />
                <text x={px + pw + 6} y={top + 16} fill={COLORS.fg} fontSize="12.5" fontFamily="IBM Plex Mono, monospace">
                  {formatUSD(face)}
                </text>
                <text x={px + pw + 6} y={top + 32} fill={COLORS.muted} fontSize="11.5">
                  face value
                </text>
                <text x={px + pw / 2} y={height - 6} textAnchor="middle" fill={COLORS.muted} fontSize="12" fontFamily="IBM Plex Mono, monospace">
                  {years}y
                </text>
              </>
            )
          })()}
        </g>

        {activeFlow && (
          <g pointerEvents="none">
            <line
              x1={x(activeFlow.time)}
              x2={x(activeFlow.time)}
              y1={top - 4}
              y2={baseline}
              stroke={COLORS.ice}
              strokeOpacity="0.5"
              strokeDasharray="2 3"
            />
          </g>
        )}
      </svg>

      <p id={`${id}-live`} aria-live="polite" className="mt-2 min-h-[1.5rem] text-[0.875rem] text-muted">
        {activeFlow ? (
          <>
            Payment <span className="num text-fg">{activeFlow.period}</span> of {n}, year{' '}
            <span className="num text-fg">{activeFlow.time}</span>:{' '}
            <span className="num text-fg">{formatUSD(activeFlow.coupon, { cents: true })}</span> coupon
            {activeFlow.principal > 0 && (
              <>
                {' '}+ <span className="num text-fg">{formatUSD(activeFlow.principal)}</span> principal
              </>
            )}
          </>
        ) : (
          <>
            <span className="num text-fg">{n}</span> coupons of{' '}
            <span className="num text-fg">{formatUSD(last.coupon, { cents: true })}</span> (
            <span className="num text-fg">{formatUSD(totalCoupons)}</span> in all), then{' '}
            <span className="num text-fg">{formatUSD(face)}</span> back at maturity.
          </>
        )}
      </p>
    </div>
  )
}
