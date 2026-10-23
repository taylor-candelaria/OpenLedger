import { fetchText } from './client.js'

const SOURCE = 'U.S. Treasury yield curve data'

export function yieldCurveUrl(year) {
  return (
    'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/' +
    `${year}/all?type=daily_treasury_yield_curve&field_tdr_date_value=${year}&page&_format=csv`
  )
}

const MATURITY_YEARS = {
  '1 Mo': 1 / 12,
  '1.5 Month': 1.5 / 12,
  '2 Mo': 2 / 12,
  '3 Mo': 3 / 12,
  '4 Mo': 4 / 12,
  '6 Mo': 6 / 12,
  '1 Yr': 1,
  '2 Yr': 2,
  '3 Yr': 3,
  '5 Yr': 5,
  '7 Yr': 7,
  '10 Yr': 10,
  '20 Yr': 20,
  '30 Yr': 30,
}

export const MATURITY_LABELS = {
  '1 Mo': '1M',
  '1.5 Month': '6W',
  '2 Mo': '2M',
  '3 Mo': '3M',
  '4 Mo': '4M',
  '6 Mo': '6M',
  '1 Yr': '1Y',
  '2 Yr': '2Y',
  '3 Yr': '3Y',
  '5 Yr': '5Y',
  '7 Yr': '7Y',
  '10 Yr': '10Y',
  '20 Yr': '20Y',
  '30 Yr': '30Y',
}

export function parseYieldCurveCSV(csv) {
  const lines = csv.trim().split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []
  const headers = splitCSVLine(lines[0])
  const days = []
  for (const line of lines.slice(1)) {
    const cells = splitCSVLine(line)
    const date = toISO(cells[0])
    if (!date) continue
    const points = []
    headers.forEach((h, i) => {
      if (i === 0 || !(h in MATURITY_YEARS)) return
      const rate = Number(cells[i])
      if (cells[i] === undefined || cells[i] === '' || !Number.isFinite(rate)) return
      points.push({ column: h, label: MATURITY_LABELS[h], years: MATURITY_YEARS[h], rate })
    })
    points.sort((a, b) => a.years - b.years)
    if (points.length) days.push({ date, points })
  }
  return days.sort((a, b) => b.date.localeCompare(a.date))
}

function splitCSVLine(line) {
  const out = []
  let cur = ''
  let quoted = false
  for (const ch of line) {
    if (ch === '"') quoted = !quoted
    else if (ch === ',' && !quoted) {
      out.push(cur)
      cur = ''
    } else cur += ch
  }
  out.push(cur)
  return out.map((s) => s.trim())
}

function toISO(mdy) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(mdy ?? '')
  return m ? `${m[3]}-${m[1]}-${m[2]}` : null
}

export async function fetchYieldCurveYear(year, { signal } = {}) {
  const csv = await fetchText(yieldCurveUrl(year), { signal, source: SOURCE })
  return parseYieldCurveCSV(csv)
}

export function curveOnOrBefore(days, isoDate) {
  return days.find((d) => d.date <= isoDate) ?? null
}
