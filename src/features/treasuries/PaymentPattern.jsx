import { COLORS, SERIES } from '@/lib/palette.js'

const W = 320
const H = 96
const BASE = 76
const LEFT = 14
const RIGHT = 286

export function PaymentPattern({ pattern }) {
  const description = {
    bill: 'You pay less than face value today and receive the full face value once, at maturity.',
    coupon: 'Equal coupon payments every six months, then face value at maturity.',
    tips: 'Coupons every six months that grow as inflation raises the principal, then the adjusted principal at maturity.',
    frn: 'Interest every three months, in amounts that change as the rate resets.',
    accrual: 'No payments along the way; interest builds up in the bond’s value until you cash it in.',
  }[pattern]

  const tick = (x, h, key, color = SERIES.treasury.color) => (
    <rect key={key} x={x - 3} y={BASE - h} width="6" height={h} rx="2" fill={color} />
  )

  let marks = null
  if (pattern === 'bill') {
    marks = (
      <>
        <rect x={RIGHT - 9} y={BASE - 52} width="18" height="52" rx="3" fill="#7fa6c9" />
        <text x={RIGHT - 16} y={BASE - 58} textAnchor="end" fill={COLORS.fg} fontSize="11.5" fontFamily="Public Sans Variable, sans-serif">
          Face value
        </text>
      </>
    )
  }
  if (pattern === 'coupon') {
    marks = (
      <>
        {Array.from({ length: 10 }, (_, i) => tick(LEFT + 24 + i * 24, 14, i))}
        <rect x={RIGHT - 9} y={BASE - 52} width="18" height="52" rx="3" fill="#7fa6c9" />
      </>
    )
  }
  if (pattern === 'tips') {
    marks = (
      <>
        {Array.from({ length: 10 }, (_, i) => tick(LEFT + 24 + i * 24, 11 + i * 0.9, i))}
        <rect x={RIGHT - 9} y={BASE - 60} width="18" height="60" rx="3" fill="#7fa6c9" />
        <path d={`M${LEFT + 24} ${BASE - 48} L${RIGHT - 16} ${BASE - 58}`} stroke={COLORS.muted} strokeDasharray="3 3" />
        <text x={LEFT + 24} y={BASE - 54} fill={COLORS.muted} fontSize="11" fontFamily="Public Sans Variable, sans-serif">
          Principal rises with CPI
        </text>
      </>
    )
  }
  if (pattern === 'frn') {
    const heights = [9, 10, 12, 11, 13, 14, 12, 11]
    marks = (
      <>
        {heights.map((h, i) => tick(LEFT + 30 + i * 30, h, i))}
        <rect x={RIGHT - 9} y={BASE - 52} width="18" height="52" rx="3" fill="#7fa6c9" />
      </>
    )
  }
  if (pattern === 'accrual') {
    const pts = Array.from({ length: 11 }, (_, i) => {
      const x = LEFT + 10 + i * 26
      const y = BASE - 10 - Math.pow(i / 10, 1.25) * 46
      return `${x},${y}`
    })
    marks = (
      <>
        <polyline points={pts.join(' ')} fill="none" stroke={SERIES.ibond.color} strokeWidth="2" strokeDasharray="6 4" />
        <text x={LEFT + 12} y={BASE - 22} fill={COLORS.muted} fontSize="11" fontFamily="Public Sans Variable, sans-serif">
          Value grows
        </text>
        <circle cx={RIGHT - 10} cy={BASE - 56} r="4.5" fill={SERIES.ibond.color} stroke={COLORS.chart} strokeWidth="2" />
        <text x={RIGHT - 18} y={BASE - 64} textAnchor="end" fill={COLORS.fg} fontSize="11.5" fontFamily="Public Sans Variable, sans-serif">
          Cash in
        </text>
      </>
    )
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={description} className="w-full max-w-[360px]">
      <line x1={LEFT} x2={W - 8} y1={BASE} y2={BASE} stroke={COLORS.axis} />
      <text x={LEFT} y={H - 4} fill={COLORS.muted} fontSize="11" fontFamily="IBM Plex Mono, monospace">
        Buy
      </text>
      <text x={RIGHT} y={H - 4} textAnchor="middle" fill={COLORS.muted} fontSize="11" fontFamily="IBM Plex Mono, monospace">
        {pattern === 'accrual' ? 'Later' : 'Maturity'}
      </text>
      {marks}
    </svg>
  )
}
