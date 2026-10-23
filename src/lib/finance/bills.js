export function billPriceFromDiscount(discountRate, days) {
  return 100 * (1 - (discountRate * days) / 360)
}

export function discountFromBillPrice(price, days) {
  return ((100 - price) / 100) * (360 / days)
}

export function billInvestmentRate(price, days, daysInYear = 365) {
  const halfYear = daysInYear / 2
  if (days <= halfYear) {
    return ((100 - price) / price) * (daysInYear / days)
  }
  const a = days / (2 * daysInYear) - 0.25
  const b = days / daysInYear
  const c = (price - 100) / price
  return (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a)
}

export function billSummary({ face, discountRate, days, daysInYear = 365 }) {
  const pricePer100 = billPriceFromDiscount(discountRate, days)
  const cost = (face * pricePer100) / 100
  return {
    pricePer100,
    cost,
    interest: face - cost,
    investmentRate: billInvestmentRate(pricePer100, days, daysInYear),
  }
}
