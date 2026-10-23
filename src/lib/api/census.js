import { z } from 'zod'
import { ApiError, fetchJSON, toNumber } from './client.js'

const SOURCE = 'Census Bureau API'
const DATASET = '/api/census/timeseries/govslocalfin'

const table = z.array(z.array(z.union([z.string(), z.null()]))).nullable()

export function tableToObjects(rows) {
  if (!rows || rows.length < 2) return []
  const [header, ...data] = rows
  return data.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])))
}

export function pickDebtAggregate(aggregates) {
  const debt = aggregates.filter((a) => /debt outstanding/i.test(a.label))
  return (
    debt.find((a) => /^total debt outstanding/i.test(a.label.trim())) ??
    debt.find((a) => !/long-term|short-term|public debt for private/i.test(a.label)) ??
    debt[0] ??
    null
  )
}

export async function discoverDebtSeries({ signal, years = [2024, 2023, 2022] } = {}) {
  for (const year of years) {
    const url = `${DATASET}?get=AGG_DESC,AGG_DESC_LABEL,GOVTYPE,GOVTYPE_LABEL&for=us:1&time=${year}`
    const rows = tableToObjects(await fetchJSON(url, table, { signal, source: SOURCE }))
    if (!rows.length) continue
    const aggregates = uniqueBy(
      rows.map((r) => ({ code: r.AGG_DESC, label: r.AGG_DESC_LABEL ?? '' })),
      (a) => a.code,
    )
    const debt = pickDebtAggregate(aggregates)
    if (!debt) continue
    const govTypes = uniqueBy(
      rows.map((r) => ({ code: r.GOVTYPE, label: r.GOVTYPE_LABEL ?? r.GOVTYPE })),
      (g) => g.code,
    )
    return { year, debt, govTypes }
  }
  throw new ApiError('The Census API returned no debt figures for recent years.', { source: SOURCE })
}

export async function fetchStateDebt({ year, aggregateCode, signal }) {
  const url =
    `${DATASET}?get=NAME,AMOUNT,GOVTYPE,GOVTYPE_LABEL&for=state:*&time=${year}` +
    `&AGG_DESC=${encodeURIComponent(aggregateCode)}`
  const rows = tableToObjects(await fetchJSON(url, table, { signal, source: SOURCE }))
  return rows
    .map((r) => ({
      name: r.NAME,
      fips: r.state,
      amount: (toNumber(r.AMOUNT) ?? NaN) * 1000,
      govType: r.GOVTYPE_LABEL ?? r.GOVTYPE,
    }))
    .filter((r) => Number.isFinite(r.amount))
}

function uniqueBy(items, key) {
  const seen = new Map()
  for (const item of items) if (!seen.has(key(item))) seen.set(key(item), item)
  return [...seen.values()]
}
