const usdWhole = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
const usdCents = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatUSD(value, { cents = false } = {}) {
  if (!Number.isFinite(value)) return '—'
  return (cents ? usdCents : usdWhole).format(value)
}

export function formatLargeUSD(value, digits = 2) {
  if (!Number.isFinite(value)) return '—'
  const abs = Math.abs(value)
  const units = [
    [1e12, 'trillion'],
    [1e9, 'billion'],
    [1e6, 'million'],
  ]
  for (const [size, word] of units) {
    if (abs >= size) return `$${(value / size).toFixed(digits)} ${word}`
  }
  return formatUSD(value)
}

export function formatAxisUSD(value) {
  if (!Number.isFinite(value)) return ''
  const abs = Math.abs(value)
  if (abs >= 1e12) return `$${trimZeros((value / 1e12).toFixed(1))}T`
  if (abs >= 1e9) return `$${trimZeros((value / 1e9).toFixed(0))}B`
  if (abs >= 1e6) return `$${trimZeros((value / 1e6).toFixed(0))}M`
  if (abs >= 1e3) return `$${trimZeros((value / 1e3).toFixed(0))}K`
  return `$${value}`
}

function trimZeros(s) {
  return s.replace(/\.0+$/, '')
}

export function formatPercent(percent, digits = 2) {
  if (!Number.isFinite(percent)) return '—'
  return `${percent.toFixed(digits)}%`
}

export function parseISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

const dateLong = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const dateMonth = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' })

export function formatDate(iso) {
  if (!iso) return '—'
  return dateLong.format(parseISODate(iso))
}

export function formatMonth(iso) {
  if (!iso) return '—'
  return dateMonth.format(parseISODate(iso))
}

export function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
