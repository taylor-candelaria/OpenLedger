import { describe, expect, it } from 'vitest'
import ibonds from '../api/__fixtures__/ibonds.json'
import {
  accrualValue,
  eeBondValue,
  eeGuaranteeImpliedRate,
  iBondCompositeRate,
  redemptionValue,
} from './savingsBonds.js'

describe('iBondCompositeRate', () => {
  it.each(ibonds.data.map((r) => [r.issue_year_month, r]))(
    'reproduces Treasury’s combined rate for bonds issued %s',
    (_month, row) => {
      const composite = iBondCompositeRate(
        Number(row.fixed_rate) / 100,
        Number(row.semi_annual_inflation_rate) / 100,
      )
      expect(Math.round(composite * 10000) / 100).toBeCloseTo(Number(row.combined_rate), 2)
    },
  )

  it('never goes below zero, even with deflation', () => {
    expect(iBondCompositeRate(0, -0.012)).toBe(0)
    expect(iBondCompositeRate(0.01, -0.012)).toBe(0)
  })
})

describe('accrual and redemption', () => {
  it('compounds every six months', () => {
    expect(accrualValue(1000, 0.04, 12)).toBeCloseTo(1000 * 1.02 * 1.02, 8)
    expect(accrualValue(1000, 0.04, 6)).toBeCloseTo(1020, 8)
  })

  it('cannot be redeemed in the first year', () => {
    expect(redemptionValue(1000, 0.04, 11)).toEqual({ value: 1000, redeemable: false, penaltyApplied: false })
  })

  it('forfeits the last three months of interest before five years', () => {
    const early = redemptionValue(1000, 0.04, 24)
    expect(early.penaltyApplied).toBe(true)
    expect(early.value).toBeCloseTo(accrualValue(1000, 0.04, 21), 8)
    const later = redemptionValue(1000, 0.04, 60)
    expect(later.penaltyApplied).toBe(false)
    expect(later.value).toBeCloseTo(accrualValue(1000, 0.04, 60), 8)
  })
})

describe('EE bonds', () => {
  it('are worth at least double after 20 years even at a low fixed rate', () => {
    expect(eeBondValue(1000, 0.025, 240)).toBeCloseTo(2000, 6)
    expect(eeBondValue(1000, 0.025, 239)).toBeLessThan(2000)
  })

  it('keep the higher value if the fixed rate alone would more than double', () => {
    expect(eeBondValue(1000, 0.05, 240)).toBeCloseTo(accrualValue(1000, 0.05, 240), 6)
  })

  it('implies about 3.5% a year when held for the full 20 years', () => {
    expect(eeGuaranteeImpliedRate()).toBeCloseTo(0.035, 3)
  })
})
