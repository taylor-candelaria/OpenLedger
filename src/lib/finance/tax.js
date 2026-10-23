export const TAX_TREATMENT = {
  hysa: { federal: true, state: true, label: 'High-yield savings account' },
  cd: { federal: true, state: true, label: 'Bank CD' },
  treasury: { federal: true, state: false, label: 'Treasury bill, note or bond' },
  savingsBond: { federal: true, state: false, label: 'I or EE savings bond' },
  muniInState: { federal: false, state: false, label: 'Municipal bond from the state you live in' },
  muniOutOfState: { federal: false, state: true, label: 'Municipal bond from a different state' },
}

export function applicableTaxRate(instrument, { federalRate, stateRate }) {
  const t = TAX_TREATMENT[instrument]
  return (t.federal ? federalRate : 0) + (t.state ? stateRate : 0)
}

export function afterTaxYield(yieldRate, instrument, rates) {
  return yieldRate * (1 - applicableTaxRate(instrument, rates))
}

export function fullyTaxableEquivalent(yieldRate, instrument, rates) {
  const kept = afterTaxYield(yieldRate, instrument, rates)
  const fullRate = applicableTaxRate('hysa', rates)
  if (fullRate >= 1) return Infinity
  return kept / (1 - fullRate)
}

export function taxEquivalentYield(taxFreeYield, taxRate) {
  if (taxRate >= 1) return Infinity
  return taxFreeYield / (1 - taxRate)
}
