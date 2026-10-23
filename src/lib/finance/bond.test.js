import { describe, expect, it } from 'vitest'
import coupons from '../api/__fixtures__/coupons.json'
import {
  couponCashFlows,
  currentYield,
  modifiedDuration,
  priceFromYield,
  priceRelation,
  yieldFromPrice,
} from './bond.js'

const face = 1000

describe('priceFromYield', () => {
  it('prices a bond at par when the yield equals the coupon', () => {
    expect(priceFromYield({ face, couponRate: 0.05, years: 10, ytm: 0.05 })).toBeCloseTo(1000, 8)
  })

  it('prices below par when yields rise above the coupon, and above par when they fall', () => {
    const discount = priceFromYield({ face, couponRate: 0.04, years: 10, ytm: 0.05 })
    const premium = priceFromYield({ face, couponRate: 0.04, years: 10, ytm: 0.03 })
    expect(discount).toBeLessThan(1000)
    expect(premium).toBeGreaterThan(1000)
    expect(discount).toBeCloseTo(922.05, 1)
    expect(premium).toBeCloseTo(1085.84, 1)
  })

  it('handles a zero yield as the plain sum of cash flows', () => {
    expect(priceFromYield({ face, couponRate: 0.04, years: 2, ytm: 0 })).toBeCloseTo(1080, 8)
  })

  const newNotes = coupons.data.filter(
    (a) => a.security_type === 'Note' && a.issue_date.slice(5) === a.maturity_date.slice(5),
  )

  it.each(newNotes.map((a) => [a.security_term, a.cusip, a]))(
    'matches Treasury’s auction price for the %s note %s',
    (_term, _cusip, auction) => {
      const years = Number(auction.maturity_date.slice(0, 4)) - Number(auction.issue_date.slice(0, 4))
      const price = priceFromYield({
        face: 100,
        couponRate: Number(auction.int_rate) / 100,
        years,
        ytm: Number(auction.high_yield) / 100,
      })
      expect(price).toBeCloseTo(Number(auction.price_per100), 4)
    },
  )
})

describe('yieldFromPrice', () => {
  it('round-trips price → yield → price', () => {
    for (const ytm of [-0.002, 0.001, 0.025, 0.05, 0.09, 0.15]) {
      const price = priceFromYield({ face, couponRate: 0.045, years: 7, ytm })
      const solved = yieldFromPrice({ face, couponRate: 0.045, years: 7, price })
      expect(solved).toBeCloseTo(ytm, 9)
    }
  })

  it('solves a zero-coupon price', () => {
    const price = priceFromYield({ face, couponRate: 0, years: 5, ytm: 0.04 })
    expect(yieldFromPrice({ face, couponRate: 0, years: 5, price })).toBeCloseTo(0.04, 9)
  })
})

describe('couponCashFlows', () => {
  it('pays semiannual coupons and returns principal with the last one', () => {
    const flows = couponCashFlows({ face, couponRate: 0.05, years: 3 })
    expect(flows).toHaveLength(6)
    expect(flows[0]).toMatchObject({ period: 1, time: 0.5, coupon: 25, principal: 0, total: 25 })
    expect(flows.at(-1)).toMatchObject({ period: 6, time: 3, coupon: 25, principal: 1000, total: 1025 })
    const total = flows.reduce((sum, f) => sum + f.total, 0)
    expect(total).toBe(1150)
  })
})

describe('currentYield and duration', () => {
  it('computes current yield on the price paid', () => {
    expect(currentYield({ face, couponRate: 0.04, price: 800 })).toBeCloseTo(0.05, 10)
  })

  it('gives a longer bond a larger price sensitivity', () => {
    const short = modifiedDuration({ face, couponRate: 0.045, years: 2, ytm: 0.045 })
    const long = modifiedDuration({ face, couponRate: 0.045, years: 30, ytm: 0.045 })
    expect(short).toBeGreaterThan(1.8)
    expect(short).toBeLessThan(2)
    expect(long).toBeGreaterThan(short * 5)
  })

  it('approximates the actual price change for a small yield move', () => {
    const terms = { face, couponRate: 0.045, years: 10 }
    const p0 = priceFromYield({ ...terms, ytm: 0.045 })
    const p1 = priceFromYield({ ...terms, ytm: 0.0451 })
    const predicted = -modifiedDuration({ ...terms, ytm: 0.045 }) * 0.0001
    expect((p1 - p0) / p0).toBeCloseTo(predicted, 5)
  })
})

describe('priceRelation', () => {
  it('labels premium, par and discount', () => {
    expect(priceRelation(1000, 1000)).toBe('par')
    expect(priceRelation(1012, 1000)).toBe('premium')
    expect(priceRelation(970, 1000)).toBe('discount')
  })
})
