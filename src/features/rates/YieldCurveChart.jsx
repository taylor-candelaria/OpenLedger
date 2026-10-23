import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartFrame, ChartTooltip, DataTable, Legend } from '@/components/charts/ChartFrame.jsx'
import { SourceNote } from '@/components/ui/Notes.jsx'
import { QueryState } from '@/components/ui/QueryState.jsx'
import { Term } from '@/components/ui/Term.jsx'
import { DATA_SOURCES } from '@/content/sources.js'
import { formatDate, formatPercent } from '@/lib/format.js'
import { AXIS_TICK, COLORS, ORDINAL_ICE } from '@/lib/palette.js'
import { rateAt, useYieldCurves } from './useYieldCurves.js'

const SERIES_STYLE = [
  { key: 'latest', color: ORDINAL_ICE[0], dash: undefined, width: 2.5 },
  { key: 'monthAgo', color: ORDINAL_ICE[1], dash: '6 4', width: 2 },
  { key: 'yearAgo', color: ORDINAL_ICE[2], dash: '2 4', width: 2 },
]

export function YieldCurveChart({ title = 'The Treasury yield curve', compact = false, as = 'glass' }) {
  const query = useYieldCurves()
  return (
    <QueryState query={query} label="the yield curve" skeleton={<div className="skeleton h-[380px] w-full" />}>
      {(data) => <CurveView data={data} title={title} compact={compact} as={as} />}
    </QueryState>
  )
}

function CurveView({ data, title, compact, as }) {
  const { latest, monthAgo, yearAgo } = data

  const series = [
    { ...SERIES_STYLE[0], curve: latest, label: formatDate(latest.date) },
    monthAgo && { ...SERIES_STYLE[1], curve: monthAgo, label: `${formatDate(monthAgo.date)} (a month earlier)` },
    yearAgo && { ...SERIES_STYLE[2], curve: yearAgo, label: `${formatDate(yearAgo.date)} (a year earlier)` },
  ].filter(Boolean)

  const labels = new Map()
  for (const s of series) for (const p of s.curve.points) labels.set(p.label, p.years)
  const rows = [...labels.entries()]
    .sort((a, b) => a[1] - b[1])
    .map(([label, years]) => {
      const row = { label, years }
      for (const s of series) row[s.key] = rateAt(s.curve, label)
      return row
    })

  const short = rateAt(latest, '3M')
  const ten = rateAt(latest, '10Y')
  const two = rateAt(latest, '2Y')
  const spread = ten !== null && short !== null ? ten - short : null
  const shape =
    spread === null ? null : spread > 0.25 ? 'upward' : spread < -0.1 ? 'inverted' : 'flat'

  const values = rows.flatMap((r) => series.map((s) => r[s.key])).filter((v) => v !== null)
  const min = Math.max(0, Math.floor(Math.min(...values) * 2) / 2 - 0.5)
  const max = Math.ceil(Math.max(...values) * 2) / 2
  const step = max - min > 4 ? 1 : 0.5
  const ticks = []
  for (let t = min; t <= max + 1e-9; t += step) ticks.push(Number(t.toFixed(2)))

  return (
    <ChartFrame
      as={as}
      title={title}
      description={
        <>
          <Term id="par-yield">Par yields</Term> on Treasury securities by time to maturity, in percent per year.
        </>
      }
      legend={<Legend items={series.map((s) => ({ label: s.label, color: s.color, dash: s.dash }))} />}
      table={
        <DataTable
          caption="Treasury par yield curve"
          columns={[
            { key: 'label', label: 'Maturity' },
            ...series.map((s) => ({ key: s.key, label: formatDate(s.curve.date), numeric: true, format: (v) => (v === null ? '—' : formatPercent(v)) })),
          ]}
          rows={rows}
        />
      }
      interpretation={
        shape && (
          <p>
            {shape === 'upward' && (
              <>
                The curve slopes <strong>upward</strong>: lending to the government for 10 years pays{' '}
                <strong className="num">{formatPercent(ten)}</strong> versus{' '}
                <strong className="num">{formatPercent(short)}</strong> for 3 months. That’s the usual shape, since investors
                tying money up longer typically want to be paid more.
              </>
            )}
            {shape === 'inverted' && (
              <>
                The curve is <strong>inverted</strong>: 3-month bills yield{' '}
                <strong className="num">{formatPercent(short)}</strong>, more than the{' '}
                <strong className="num">{formatPercent(ten)}</strong> on 10-year notes. That’s unusual, and often reflects an
                expectation that short-term rates will fall.
              </>
            )}
            {shape === 'flat' && (
              <>
                The curve is roughly <strong>flat</strong>: 3-month bills (<strong className="num">{formatPercent(short)}</strong>) and
                10-year notes (<strong className="num">{formatPercent(ten)}</strong>) pay about the same.
              </>
            )}
            {!compact && two !== null && (
              <>
                {' '}
                The 2-year yield is <strong className="num">{formatPercent(two)}</strong>
                {yearAgo && rateAt(yearAgo, '10Y') !== null && (
                  <>
                    , and the 10-year has moved{' '}
                    <strong className="num">
                      {ten - rateAt(yearAgo, '10Y') >= 0 ? '+' : '−'}
                      {Math.abs(ten - rateAt(yearAgo, '10Y')).toFixed(2)} points
                    </strong>{' '}
                    in a year
                  </>
                )}
                .
              </>
            )}
          </p>
        )
      }
      source={
        <SourceNote kind="live" source={DATA_SOURCES.yieldCurve.name} href={DATA_SOURCES.yieldCurve.href} asOf={latest.date}>
          Maturities are evenly spaced, not to scale.
        </SourceNote>
      }
    >
      <div className={compact ? 'h-[260px] sm:h-[300px]' : 'h-[300px] sm:h-[360px]'}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 10, right: 14, bottom: 22, left: 0 }}>
            <CartesianGrid stroke={COLORS.grid} vertical={false} />
            <XAxis
              dataKey="label"
              tick={AXIS_TICK}
              stroke={COLORS.axis}
              interval="preserveStartEnd"
              minTickGap={6}
              label={{ value: 'Time to maturity', position: 'insideBottom', offset: -14, fill: COLORS.muted, fontSize: 12 }}
            />
            <YAxis
              domain={[min, max]}
              ticks={ticks}
              tickFormatter={(v) => `${v.toFixed(1)}%`}
              tick={AXIS_TICK}
              stroke={COLORS.axis}
              width={52}
            />
            <Tooltip
              cursor={{ stroke: COLORS.axis }}
              content={
                <ChartTooltip
                  labelFormatter={(l) => `${l} maturity`}
                  valueFormatter={(v) => formatPercent(v)}
                />
              }
            />
            {[...series].reverse().map((s) => (
              <Line
                key={s.key}
                dataKey={s.key}
                name={formatDate(s.curve.date)}
                type="monotone"
                stroke={s.color}
                strokeWidth={s.width}
                strokeDasharray={s.dash}
                dot={s.key === 'latest' ? { r: 2.5, fill: s.color, stroke: COLORS.chart, strokeWidth: 1.5 } : false}
                activeDot={{ r: 4.5, stroke: COLORS.chart, strokeWidth: 2 }}
                connectNulls
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  )
}
