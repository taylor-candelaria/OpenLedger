import { describe, expect, it } from 'vitest'
import {
  afterTaxYield,
  applicableTaxRate,
  fullyTaxableEquivalent,
  taxEquivalentYield,
} from './tax.js'

const rates = { federalRate: 0.24, stateRate: 0.093 }

describe('tax treatment', () => {
  it('taxes savings accounts federally and by the state', () => {
    expect(applicableTaxRate('hysa', rates)).toBeCloseTo(0.333, 10)
  })

  it('exempts Treasury and savings bond interest from state tax', () => {
    expect(applicableTaxRate('treasury', rates)).toBe(0.24)
    expect(applicableTaxRate('savingsBond', rates)).toBe(0.24)
  })

  it('exempts in-state munis from both, and taxes out-of-state munis at the state rate', () => {
    expect(applicableTaxRate('muniInState', rates)).toBe(0)
    expect(applicableTaxRate('muniOutOfState', rates)).toBe(0.093)
  })
})

describe('after-tax and equivalent yields', () => {
  it('keeps more of a Treasury yield than an equal HYSA yield when the state has an income tax', () => {
    const hysa = afterTaxYield(0.04, 'hysa', rates)
    const bill = afterTaxYield(0.04, 'treasury', rates)
    expect(hysa).toBeCloseTo(0.02668, 10)
    expect(bill).toBeCloseTo(0.0304, 10)
    expect(bill).toBeGreaterThan(hysa)
  })

  it('finds the HYSA rate needed to match a Treasury yield', () => {
    const needed = fullyTaxableEquivalent(0.04, 'treasury', rates)
    expect(needed).toBeCloseTo(0.04557721, 7)
    expect(afterTaxYield(needed, 'hysa', rates)).toBeCloseTo(afterTaxYield(0.04, 'treasury', rates), 10)
  })

  it('computes the classic muni tax-equivalent yield', () => {
    expect(taxEquivalentYield(0.03, 0.35)).toBeCloseTo(0.0461538, 6)
  })

  it('shows no Treasury advantage in a state with no income tax', () => {
    const noState = { federalRate: 0.22, stateRate: 0 }
    expect(afterTaxYield(0.04, 'treasury', noState)).toBe(afterTaxYield(0.04, 'hysa', noState))
  })
})
