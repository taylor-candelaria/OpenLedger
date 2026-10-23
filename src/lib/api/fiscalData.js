import { z } from 'zod'
import { fetchJSON, toNumber } from './client.js'

export const FISCAL_DATA_BASE = 'https://api.fiscaldata.treasury.gov/services/api/fiscal_service'
const SOURCE = 'Treasury Fiscal Data'

const row = z.record(z.string(), z.union([z.string(), z.null()]))
const response = z.object({
  data: z.array(row),
  meta: z.object({ count: z.number(), 'total-count': z.number().optional() }).passthrough(),
})

export async function fiscalQuery(endpoint, { fields, filter, sort, pageSize = 100, signal } = {}) {
  const parts = []
  if (fields?.length) parts.push(`fields=${fields.join(',')}`)
  if (filter?.length) parts.push(`filter=${filter.join(',')}`)
  if (sort) parts.push(`sort=${sort}`)
  parts.push(`page[size]=${pageSize}`)
  const url = `${FISCAL_DATA_BASE}/${endpoint}?${parts.join('&')}`
  const body = await fetchJSON(url, response, { signal, source: SOURCE })
  return body.data
}

export function parseDebtToPenny(rows) {
  return rows
    .map((r) => ({
      date: r.record_date,
      total: toNumber(r.tot_pub_debt_out_amt),
      heldByPublic: toNumber(r.debt_held_public_amt),
      intragovernmental: toNumber(r.intragov_hold_amt),
    }))
    .filter((r) => r.total !== null)
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function parseDebtHistory(rows) {
  return rows
    .map((r) => ({
      date: r.record_date,
      fiscalYear: Number(r.record_fiscal_year),
      total: toNumber(r.debt_outstanding_amt),
    }))
    .filter((r) => r.total !== null)
    .sort((a, b) => a.fiscalYear - b.fiscalYear)
}

export function parseAuction(r) {
  const tips = r.inflation_index_security === 'Yes'
  const frn = r.floating_rate === 'Yes'
  const kind = tips ? 'TIPS' : frn ? 'FRN' : r.security_type === 'CMB' ? 'CMB' : r.security_type
  const discountRate = toNumber(r.high_discnt_rate)
  const highYield = toNumber(r.high_yield)
  const originalTerm = r.original_security_term && r.original_security_term !== 'null' ? r.original_security_term : r.security_term
  return {
    cusip: r.cusip,
    kind,
    securityType: r.security_type,
    term: r.security_term,
    originalTerm,
    groupTerm: kind === 'Bill' || kind === 'CMB' ? r.security_term : originalTerm,
    auctionDate: r.auction_date,
    issueDate: r.issue_date,
    maturityDate: r.maturity_date,
    reopening: r.reopening === 'Yes',
    highYield,
    interestRate: toNumber(r.int_rate),
    spread: toNumber(r.spread),
    discountRate,
    investmentRate: toNumber(r.high_investment_rate),
    pricePer100: toNumber(r.price_per100),
    bidToCover: toNumber(r.bid_to_cover_ratio),
    offeringAmount: toNumber(r.offering_amt),
    totalAccepted: toNumber(r.total_accepted),
    totalTendered: toNumber(r.total_tendered),
    completed: toNumber(r.price_per100) !== null || discountRate !== null || highYield !== null,
    announcementDate: r.announcemt_date && r.announcemt_date !== 'null' ? r.announcemt_date : null,
    closingTimeNoncomp: r.closing_time_noncomp && r.closing_time_noncomp !== 'null' ? r.closing_time_noncomp : null,
    closingTimeComp: r.closing_time_comp && r.closing_time_comp !== 'null' ? r.closing_time_comp : null,
    lowYield: toNumber(r.low_yield),
    medianYield: toNumber(r.avg_med_yield),
    allottedAtHigh: toNumber(r.allocation_pctage),
    compAccepted: toNumber(r.comp_accepted),
    compTendered: toNumber(r.comp_tendered),
    noncompAccepted: toNumber(r.noncomp_accepted),
    primaryDealerAccepted: toNumber(r.primary_dealer_accepted),
    directBidderAccepted: toNumber(r.direct_bidder_accepted),
    indirectBidderAccepted: toNumber(r.indirect_bidder_accepted),
    somaAccepted: toNumber(r.soma_accepted),
    retailAccepted: toNumber(r.treas_retail_accepted),
    accruedPer1000: toNumber(r.accrued_int_per1000),
  }
}

export const AUCTION_FIELDS = [
  'cusip',
  'security_type',
  'security_term',
  'auction_date',
  'issue_date',
  'maturity_date',
  'high_discnt_rate',
  'high_investment_rate',
  'high_yield',
  'int_rate',
  'price_per100',
  'reopening',
  'inflation_index_security',
  'floating_rate',
  'bid_to_cover_ratio',
  'offering_amt',
  'total_accepted',
  'total_tendered',
  'spread',
  'original_security_term',
  'announcemt_date',
  'closing_time_noncomp',
  'closing_time_comp',
  'comp_accepted',
  'comp_tendered',
  'noncomp_accepted',
  'low_yield',
  'avg_med_yield',
  'allocation_pctage',
  'primary_dealer_accepted',
  'direct_bidder_accepted',
  'indirect_bidder_accepted',
  'soma_accepted',
  'treas_retail_accepted',
  'accrued_int_per1000',
]

export function bidderShares(a) {
  const parts = [a.primaryDealerAccepted, a.directBidderAccepted, a.indirectBidderAccepted]
  if (parts.some((v) => v === null)) return null
  const total = parts.reduce((s, v) => s + v, 0)
  if (!total) return null
  return {
    primaryDealers: a.primaryDealerAccepted / total,
    direct: a.directBidderAccepted / total,
    indirect: a.indirectBidderAccepted / total,
  }
}

export const TERM_ORDER = [
  '4-Week',
  '6-Week',
  '8-Week',
  '13-Week',
  '17-Week',
  '26-Week',
  '52-Week',
  '2-Year',
  '3-Year',
  '5-Year',
  '7-Year',
  '10-Year',
  '20-Year',
  '30-Year',
]

export function latestByTerm(auctions) {
  const seen = new Map()
  for (const a of auctions) {
    if (!a.completed || a.kind === 'CMB') continue
    const key = `${a.kind}:${a.groupTerm}`
    if (!seen.has(key)) seen.set(key, a)
  }
  const nominal = TERM_ORDER.map((term) =>
    [...seen.values()].find((a) => a.groupTerm === term && ['Bill', 'Note', 'Bond'].includes(a.kind)),
  ).filter(Boolean)
  const other = [...seen.values()].filter((a) => a.kind === 'TIPS' || a.kind === 'FRN')
  return { nominal, other }
}

export function parseAverageRates(rows) {
  return rows
    .map((r) => ({
      date: r.record_date,
      type: r.security_type_desc,
      security: r.security_desc,
      rate: toNumber(r.avg_interest_rate_amt),
    }))
    .filter((r) => r.rate !== null)
}

export function parseComposition(rows) {
  return rows
    .filter((r) => r.security_class_desc && r.security_class_desc !== '_')
    .map((r) => ({
      date: r.record_date,
      type: r.security_type_desc,
      security: r.security_class_desc,
      heldByPublic: (toNumber(r.debt_held_public_mil_amt) ?? 0) * 1e6,
      total: (toNumber(r.total_mil_amt) ?? 0) * 1e6,
    }))
}

export function parseOwnership(rows) {
  const byQuarter = new Map()
  for (const r of rows) {
    const amount = toNumber(r.securities_bil_amt)
    if (!byQuarter.has(r.end_of_month)) byQuarter.set(r.end_of_month, [])
    byQuarter.get(r.end_of_month).push({ owner: r.securities_owner, amount: amount === null ? null : amount * 1e9 })
  }
  const quarters = [...byQuarter.keys()].sort().reverse()
  const totals = new Set(['Total Public Debt', 'Total Privately Held'])
  for (const q of quarters) {
    const items = byQuarter.get(q)
    const holders = items.filter((i) => !totals.has(i.owner))
    if (holders.length && holders.every((i) => i.amount !== null)) {
      return {
        quarterEnd: q,
        total: items.find((i) => i.owner === 'Total Public Debt')?.amount ?? null,
        holders: holders.sort((a, b) => b.amount - a.amount),
      }
    }
  }
  return null
}

export function parseIBondRates(rows) {
  const parsed = rows.map((r) => ({
    period: r.earning_period,
    start: r.earning_period_start,
    end: r.earning_period_end,
    issueMonth: r.issue_year_month,
    fixed: toNumber(r.fixed_rate),
    inflation: toNumber(r.semi_annual_inflation_rate),
    composite: toNumber(r.combined_rate),
  }))
  const newIssue = parsed
    .filter((r) => r.issueMonth === r.period)
    .sort((a, b) => b.start.localeCompare(a.start))
  return { current: newIssue[0] ?? null, history: newIssue }
}

export function parseInterestByFiscalYear(rows) {
  const totals = new Map()
  for (const r of rows) {
    if (r.expense_catg_desc !== 'INTEREST EXPENSE ON PUBLIC ISSUES') continue
    const fy = Number(r.record_fiscal_year)
    totals.set(fy, (totals.get(fy) ?? 0) + (toNumber(r.fytd_expense_amt) ?? 0))
  }
  return [...totals.entries()]
    .map(([fiscalYear, total]) => ({ fiscalYear, total }))
    .sort((a, b) => a.fiscalYear - b.fiscalYear)
}

export function parseDebtLimit(rows) {
  if (!rows.length) return null
  const date = rows.map((r) => r.record_date).sort().at(-1)
  const day = rows.filter((r) => r.record_date === date)
  const sum = (catg) =>
    day.filter((r) => r.debt_catg === catg).reduce((s, r) => s + (toNumber(r.close_today_bal) ?? 0), 0)
  const limit = sum('Statutory Debt Limit')
  const subject =
    sum('Debt Held by the Public') + sum('Intragovernmental Holdings') - sum('Debt Not Subject to Limit') + sum('Other Debt Subject to Limit')
  if (!limit) return null
  return { date, limit: limit * 1e6, subjectToLimit: subject * 1e6, headroom: (limit - subject) * 1e6 }
}
