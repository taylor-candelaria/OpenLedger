import { useMemo, useState } from 'react'
import { useYieldCurveYear } from '@/lib/api/hooks.js'
import { curveOnOrBefore } from '@/lib/api/yieldCurve.js'
import { toISODate, parseISODate } from '@/lib/format.js'

function shiftDate(iso, { months = 0, years = 0 }) {
  const d = parseISODate(iso)
  d.setFullYear(d.getFullYear() - years)
  d.setMonth(d.getMonth() - months)
  return toISODate(d)
}

export function useYieldCurves() {
  const [year] = useState(() => new Date().getFullYear())
  const thisYear = useYieldCurveYear(year)
  const lastYear = useYieldCurveYear(year - 1)

  const result = useMemo(() => {
    if (!thisYear.data || !lastYear.data) return null
    const days = [...thisYear.data, ...lastYear.data]
    if (!days.length) return null
    const latest = days[0]
    const monthAgo = curveOnOrBefore(days, shiftDate(latest.date, { months: 1 }))
    const yearAgo = curveOnOrBefore(days, shiftDate(latest.date, { years: 1 }))
    return { days, latest, monthAgo, yearAgo }
  }, [thisYear.data, lastYear.data])

  return {
    data: result,
    isPending: thisYear.isPending || lastYear.isPending,
    isError: thisYear.isError || lastYear.isError,
    error: thisYear.error ?? lastYear.error,
    refetch: () => {
      thisYear.refetch()
      lastYear.refetch()
    },
  }
}

export function rateAt(curve, label) {
  return curve?.points.find((p) => p.label === label)?.rate ?? null
}
