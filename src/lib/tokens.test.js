import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync(new URL('../styles/tokens.css', import.meta.url), 'utf8')

function token(name) {
  const m = new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, 'i').exec(css)
  if (!m) throw new Error(`token ${name} not found`)
  return m[1]
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const GLASS_PANEL = '#18202f'
const GLASS_POP = '#1a2436'

const grounds = ['night', 'night-2', 'chart', 'surface', 'surface-2']

describe('text contrast (WCAG AA, 4.5:1 for body text)', () => {
  for (const ink of ['fg', 'muted', 'subtle', 'ice', 'teal', 'caution']) {
    for (const ground of grounds) {
      it(`${ink} on ${ground}`, () => {
        expect(contrast(token(ink), token(ground))).toBeGreaterThanOrEqual(4.5)
      })
    }
    it(`${ink} on glass panel and popover`, () => {
      expect(contrast(token(ink), GLASS_PANEL)).toBeGreaterThanOrEqual(4.5)
      expect(contrast(token(ink), GLASS_POP)).toBeGreaterThanOrEqual(4.5)
    })
  }
})

describe('text stays readable over the yield-curve backdrop', () => {
  it('clears 4.5:1 where the brightest ribbon overlaps the darkest ground', async () => {
    const { RIBBON_ALPHA } = await import('../features/backdrop/ribbon.js')
    const alpha = RIBBON_ALPHA.core + RIBBON_ALPHA.glow
    const ice = token('ice')
    const night = token('night')
    const ch = (hex, i) => parseInt(hex.slice(i, i + 2), 16)
    const blend = '#' + [1, 3, 5].map((i) => Math.round(ch(night, i) + alpha * (ch(ice, i) - ch(night, i))).toString(16).padStart(2, '0')).join('')
    expect(contrast(token('fg'), blend)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(token('muted'), blend)).toBeGreaterThanOrEqual(4.5)
  })
})

describe('palette.js mirrors the tokens', () => {
  it('uses the same hex values', async () => {
    const { COLORS, SERIES } = await import('./palette.js')
    expect(COLORS.night).toBe(token('night'))
    expect(COLORS.chart).toBe(token('chart'))
    expect(COLORS.fg).toBe(token('fg'))
    expect(COLORS.muted).toBe(token('muted'))
    expect(COLORS.subtle).toBe(token('subtle'))
    expect(COLORS.ice).toBe(token('ice'))
    expect(COLORS.control).toBe(token('control'))
    expect(SERIES.treasury.color).toBe(token('series-treasury'))
    expect(SERIES.ibond.color).toBe(token('series-savings'))
    expect(SERIES.muni.color).toBe(token('series-muni'))
    expect(SERIES.hysa.color).toBe(token('series-hysa'))
  })

  it('keeps the ordinal ramp readable on the chart surface', async () => {
    const { ORDINAL_ICE } = await import('./palette.js')
    for (const c of ORDINAL_ICE) expect(contrast(c, token('chart'))).toBeGreaterThanOrEqual(3)
  })
})

describe('non-text contrast (3:1 for control boundaries and chart marks)', () => {
  for (const ground of ['night', 'night-2', 'chart', 'surface']) {
    it(`control border on ${ground}`, () => {
      expect(contrast(token('control'), token(ground))).toBeGreaterThanOrEqual(3)
    })
  }
  for (const series of ['series-treasury', 'series-savings', 'series-muni', 'series-hysa']) {
    it(`${series} on the chart surface`, () => {
      expect(contrast(token(series), token('chart'))).toBeGreaterThanOrEqual(3)
    })
  }
})
