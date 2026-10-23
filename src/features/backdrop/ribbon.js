export const RIBBON_ALPHA = { core: 0.2, glow: 0.04 }

export function sampleKeyframes(days, step = 5) {
  const ordered = [...days].sort((a, b) => a.date.localeCompare(b.date))
  if (ordered.length <= 1) return ordered
  const frames = ordered.filter((_, i) => i % step === 0)
  if (frames.at(-1) !== ordered.at(-1)) frames.push(ordered.at(-1))
  return frames
}

export function normalizeCurve(curve, maturities) {
  const pts = [...curve.points].sort((a, b) => a.years - b.years)
  return maturities.map(({ label, years }) => {
    const exact = pts.find((p) => p.label === label)
    if (exact) return exact.rate
    const after = pts.findIndex((p) => p.years > years)
    if (after === -1) return pts.at(-1).rate
    if (after === 0) return pts[0].rate
    const lo = pts[after - 1]
    const hi = pts[after]
    const t = (years - lo.years) / (hi.years - lo.years)
    return lo.rate + t * (hi.rate - lo.rate)
  })
}

export function smoothstep(t) {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

export function interpolate(a, b, t) {
  const e = smoothstep(t)
  return a.map((v, i) => v + (b[i] - v) * e)
}

export function layoutPoints(rates, { x0, x1, top, bottom, min, max }) {
  const n = rates.length
  const span = max - min || 1
  return rates.map((r, i) => ({
    x: x0 + (n === 1 ? 0 : (i / (n - 1)) * (x1 - x0)),
    y: bottom - ((r - min) / span) * (bottom - top),
  }))
}

export function rateRange(frames) {
  let min = Infinity
  let max = -Infinity
  for (const f of frames) for (const r of f) {
    if (r < min) min = r
    if (r > max) max = r
  }
  const pad = (max - min) * 0.1 || 0.25
  return { min: min - pad, max: max + pad }
}
