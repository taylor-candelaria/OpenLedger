import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { parseYieldCurveCSV } from '@/lib/api/yieldCurve.js'
import { interpolate, layoutPoints, normalizeCurve, rateRange, sampleKeyframes, smoothstep } from './ribbon.js'

const csv = readFileSync(new URL('../../lib/api/__fixtures__/yieldcurve.csv', import.meta.url), 'utf8')
const days = parseYieldCurveCSV(csv)

describe('sampleKeyframes', () => {
  it('orders oldest first and always ends on the latest day', () => {
    const frames = sampleKeyframes(days, 2)
    expect(frames[0].date).toBe('2026-01-02')
    expect(frames.at(-1).date).toBe('2026-10-19')
  })
})

describe('normalizeCurve', () => {
  const maturities = [
    { label: '3M', years: 0.25 },
    { label: '6M', years: 0.5 },
    { label: '10Y', years: 10 },
  ]
  it('keeps published rates and interpolates missing maturities', () => {
    const curve = { points: [{ label: '3M', years: 0.25, rate: 4 }, { label: '10Y', years: 10, rate: 5 }] }
    const [a, b, c] = normalizeCurve(curve, maturities)
    expect(a).toBe(4)
    expect(c).toBe(5)
    expect(b).toBeCloseTo(4 + 0.25 / 9.75, 10)
  })
})

describe('interpolation and layout', () => {
  it('eases between curves', () => {
    expect(smoothstep(0)).toBe(0)
    expect(smoothstep(1)).toBe(1)
    expect(interpolate([4, 5], [5, 6], 0.5)).toEqual([4.5, 5.5])
  })

  it('maps higher rates higher on screen, across a fixed range', () => {
    const { min, max } = rateRange([[4, 5], [3, 6]])
    expect(min).toBeLessThan(3)
    expect(max).toBeGreaterThan(6)
    const [p0, p1] = layoutPoints([4, 5], { x0: 0, x1: 100, top: 0, bottom: 100, min, max })
    expect(p0.x).toBe(0)
    expect(p1.x).toBe(100)
    expect(p1.y).toBeLessThan(p0.y)
  })
})
