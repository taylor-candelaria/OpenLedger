export function iBondCompositeRate(fixedRate, semiannualInflation) {
  const composite = fixedRate + 2 * semiannualInflation + fixedRate * semiannualInflation
  return Math.max(0, composite)
}

export const MIN_HOLD_MONTHS = 12
export const PENALTY_FREE_MONTHS = 60
export const PENALTY_MONTHS = 3
export const EE_DOUBLING_YEARS = 20

export function accrualValue(principal, annualRate, months) {
  const halfYears = Math.floor(months / 6)
  const extraMonths = months - halfYears * 6
  const afterHalfYears = principal * Math.pow(1 + annualRate / 2, halfYears)
  return afterHalfYears * Math.pow(1 + annualRate / 2, extraMonths / 6)
}

export function redemptionValue(principal, annualRate, months) {
  if (months < MIN_HOLD_MONTHS) {
    return { value: principal, redeemable: false, penaltyApplied: false }
  }
  if (months < PENALTY_FREE_MONTHS) {
    return {
      value: accrualValue(principal, annualRate, months - PENALTY_MONTHS),
      redeemable: true,
      penaltyApplied: true,
    }
  }
  return { value: accrualValue(principal, annualRate, months), redeemable: true, penaltyApplied: false }
}

export function eeBondValue(principal, fixedRate, months) {
  const accrued = accrualValue(principal, fixedRate, months)
  if (months >= EE_DOUBLING_YEARS * 12) {
    const extraMonths = months - EE_DOUBLING_YEARS * 12
    const atTwenty = Math.max(accrualValue(principal, fixedRate, EE_DOUBLING_YEARS * 12), principal * 2)
    return accrualValue(atTwenty, fixedRate, extraMonths)
  }
  return accrued
}

export function eeGuaranteeImpliedRate() {
  return 2 * (Math.pow(2, 1 / (EE_DOUBLING_YEARS * 2)) - 1)
}
