function periods(years, frequency) {
  return Math.max(1, Math.round(years * frequency))
}

export function couponCashFlows({ face, couponRate, years, frequency = 2 }) {
  const n = periods(years, frequency)
  const coupon = (face * couponRate) / frequency
  return Array.from({ length: n }, (_, i) => {
    const period = i + 1
    const principal = period === n ? face : 0
    return { period, time: period / frequency, coupon, principal, total: coupon + principal }
  })
}

export function priceFromYield({ face, couponRate, years, ytm, frequency = 2 }) {
  const n = periods(years, frequency)
  const c = (face * couponRate) / frequency
  const r = ytm / frequency
  if (Math.abs(r) < 1e-12) return c * n + face
  const discount = Math.pow(1 + r, -n)
  return (c * (1 - discount)) / r + face * discount
}

function priceDerivative({ face, couponRate, years, ytm, frequency = 2 }) {
  const n = periods(years, frequency)
  const c = (face * couponRate) / frequency
  const r = ytm / frequency
  let d = 0
  for (let t = 1; t <= n; t++) {
    const cf = t === n ? c + face : c
    d += (-t * cf) / Math.pow(1 + r, t + 1)
  }
  return d / frequency
}

export function yieldFromPrice({ face, couponRate, years, price, frequency = 2 }) {
  const terms = { face, couponRate, years, frequency }
  const f = (y) => priceFromYield({ ...terms, ytm: y }) - price

  let y = couponRate > 0 ? couponRate : 0.03
  for (let i = 0; i < 50; i++) {
    const fy = f(y)
    if (Math.abs(fy) < 1e-10) return y
    const d = priceDerivative({ ...terms, ytm: y })
    if (!Number.isFinite(d) || d === 0) break
    const next = y - fy / d
    if (!Number.isFinite(next) || next <= -frequency * 0.99) break
    y = next
  }

  let lo = -0.5
  let hi = 2
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2
    if (f(mid) > 0) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

export function currentYield({ face, couponRate, price }) {
  return (face * couponRate) / price
}

export function modifiedDuration({ face, couponRate, years, ytm, frequency = 2 }) {
  const n = periods(years, frequency)
  const c = (face * couponRate) / frequency
  const r = ytm / frequency
  let pv = 0
  let weighted = 0
  for (let t = 1; t <= n; t++) {
    const cf = t === n ? c + face : c
    const v = cf / Math.pow(1 + r, t)
    pv += v
    weighted += (t / frequency) * v
  }
  const macaulay = weighted / pv
  return macaulay / (1 + r)
}

export function priceRelation(price, face, tolerance = 0.005) {
  const ratio = price / face
  if (Math.abs(ratio - 1) <= tolerance / 100) return 'par'
  return ratio > 1 ? 'premium' : 'discount'
}
