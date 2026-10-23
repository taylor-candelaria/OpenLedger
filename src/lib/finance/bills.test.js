import { describe, expect, it } from 'vitest'
import bills from '../api/__fixtures__/bills.json'
import bills52 from '../api/__fixtures__/bills52.json'
import {
  billInvestmentRate,
  billPriceFromDiscount,
  billSummary,
  discountFromBillPrice,
} from './bills.js'

const DAY = 24 * 60 * 60 * 1000
const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / DAY)

const completed = [...bills.data, ...bills52.data].filter((a) => a.high_discnt_rate !== 'null')

describe('Treasury bill formulas against published auction results', () => {
  it('has fixtures covering short and longer-than-half-year bills', () => {
    const days = completed.map((a) => daysBetween(a.issue_date, a.maturity_date))
    expect(Math.min(...days)).toBeLessThan(60)
    expect(Math.max(...days)).toBeGreaterThan(183)
  })

  it.each(completed.map((a) => [a.security_term, a.auction_date, a]))(
    '%s bill auctioned %s: price and investment rate match Treasury',
    (_term, _date, a) => {
      const days = daysBetween(a.issue_date, a.maturity_date)
      const price = billPriceFromDiscount(Number(a.high_discnt_rate) / 100, days)
      expect(price).toBeCloseTo(Number(a.price_per100), 5)
      const investment = billInvestmentRate(Number(a.price_per100), days) * 100
      expect(Math.abs(investment - Number(a.high_investment_rate))).toBeLessThan(0.0006)
    },
  )
})

describe('bill helpers', () => {
  it('inverts the discount formula', () => {
    const price = billPriceFromDiscount(0.042, 91)
    expect(discountFromBillPrice(price, 91)).toBeCloseTo(0.042, 12)
  })

  it('summarizes what a buyer pays and earns', () => {
    const s = billSummary({ face: 10000, discountRate: 0.04, days: 182 })
    expect(s.cost).toBeCloseTo(9797.78, 2)
    expect(s.interest).toBeCloseTo(202.22, 2)
    expect(s.investmentRate).toBeGreaterThan(0.04)
  })
})
