import { useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartFrame, ChartTooltip, DataTable } from '@/components/charts/ChartFrame.jsx'
import { HorizontalBars } from '@/components/charts/HorizontalBars.jsx'
import { Segmented } from '@/components/ui/Fields.jsx'
import { SourceNote } from '@/components/ui/Notes.jsx'
import { QueryState } from '@/components/ui/QueryState.jsx'
import { DATA_SOURCES } from '@/content/sources.js'
import {
  useAverageRates,
  useComposition,
  useDebtHistory,
  useDebtToPenny,
  useInterestByYear,
  useOwnership,
} from '@/lib/api/hooks.js'
import { formatAxisUSD, formatDate, formatLargeUSD, formatMonth, formatPercent } from '@/lib/format.js'
import { AXIS_TICK, COLORS, SERIES } from '@/lib/palette.js'

const skeleton = <div className="skeleton h-[380px] w-full" />

export function DebtTrendChart() {
  const query = useDebtToPenny()
  return (
    <QueryState query={query} label="Debt to the Penny" skeleton={skeleton}>
      {(rows) => {
        const latest = rows.at(-1)
        const first = rows[0]
        const growth = latest.total - first.total
        const days = (Date.parse(latest.date) - Date.parse(first.date)) / 86400000
        return (
          <ChartFrame
            title="Total public debt, daily"
            description="Debt held by the public and by federal accounts, in dollars, over roughly the past year."
            table={
              <DataTable
                caption="Total public debt by day"
                columns={[
                  { key: 'date', label: 'Date', format: formatDate },
                  { key: 'heldByPublic', label: 'Held by the public', numeric: true, format: (v) => formatLargeUSD(v, 3) },
                  { key: 'intragovernmental', label: 'Federal accounts', numeric: true, format: (v) => formatLargeUSD(v, 3) },
                  { key: 'total', label: 'Total', numeric: true, format: (v) => formatLargeUSD(v, 3) },
                ]}
                rows={[...rows].reverse()}
              />
            }
            interpretation={
              <p>
                Over these <span className="num">{Math.round(days)}</span> days the debt {growth >= 0 ? 'rose' : 'fell'} by{' '}
                <strong className="num">{formatLargeUSD(Math.abs(growth))}</strong>, about{' '}
                <strong className="num">{formatLargeUSD(Math.abs(growth) / days, 1)}</strong> a day on average. Day-to-day moves are
                lumpy: the debt jumps when new securities are issued and dips when maturing ones are paid off, which often
                happens after big tax deadlines bring in cash.
              </p>
            }
            source={<SourceNote kind="live" source={DATA_SOURCES.debtToPenny.name} href={DATA_SOURCES.debtToPenny.href} asOf={latest.date} />}
          >
            <div className="h-[300px] sm:h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rows} margin={{ top: 10, right: 12, bottom: 4, left: 4 }}>
                  <CartesianGrid stroke={COLORS.grid} vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatMonth}
                    tick={AXIS_TICK}
                    stroke={COLORS.axis}
                    minTickGap={48}
                  />
                  <YAxis tickFormatter={formatAxisUSD} tick={AXIS_TICK} stroke={COLORS.axis} width={56} domain={[0, 'auto']} />
                  <Tooltip
                    cursor={{ stroke: COLORS.axis }}
                    content={
                      <ChartTooltip
                        labelFormatter={(l) => formatDate(l)}
                        valueFormatter={(v) => formatLargeUSD(v, 3)}
                        extra={(p) => (
                          <span>
                            Total <span className="num text-fg">{formatLargeUSD(p[0].payload.total, 3)}</span>
                          </span>
                        )}
                      />
                    }
                  />
                  <Area
                    dataKey="heldByPublic"
                    name="Held by the public"
                    stackId="debt"
                    stroke={SERIES.treasury.color}
                    fill={SERIES.treasury.color}
                    fillOpacity={0.55}
                    strokeWidth={1.5}
                    isAnimationActive={false}
                  />
                  <Area
                    dataKey="intragovernmental"
                    name="Federal accounts"
                    stackId="debt"
                    stroke={COLORS.chart}
                    fill="#557696"
                    fillOpacity={0.75}
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[0.875rem] text-fg">
              <li className="inline-flex items-center gap-2">
                <span aria-hidden="true" className="size-2.5 rounded-sm bg-series-treasury" />
                Held by the public (lower band)
              </li>
              <li className="inline-flex items-center gap-2">
                <span aria-hidden="true" className="size-2.5 rounded-sm bg-ice-deep" />
                Federal accounts (upper band)
              </li>
            </ul>
          </ChartFrame>
        )
      }}
    </QueryState>
  )
}

const RANGES = [
  { value: '25', label: 'Last 25 years' },
  { value: '1940', label: 'Since 1940' },
  { value: 'all', label: 'Since 1790' },
]

export function DebtHistoryChart() {
  const query = useDebtHistory()
  const [range, setRange] = useState('1940')
  return (
    <QueryState query={query} label="historical debt" skeleton={skeleton}>
      {(rows) => {
        const lastYear = rows.at(-1).fiscalYear
        const from = range === 'all' ? rows[0].fiscalYear : range === '1940' ? 1940 : lastYear - 25
        const data = rows.filter((r) => r.fiscalYear >= from)
        const log = range === 'all'
        return (
          <ChartFrame
            title="Federal debt at the end of each fiscal year"
            description={
              log
                ? 'Total debt outstanding, in dollars, on a logarithmic scale: each gridline is ten times the one below.'
                : 'Total debt outstanding, in dollars, not adjusted for inflation or the size of the economy.'
            }
            controls={<Segmented legend="Time range" hideLegend size="sm" value={range} onChange={setRange} options={RANGES} />}
            table={
              <DataTable
                caption="Debt outstanding by fiscal year"
                columns={[
                  { key: 'fiscalYear', label: 'Fiscal year' },
                  { key: 'total', label: 'Debt outstanding', numeric: true, format: (v) => formatLargeUSD(v, 2) },
                ]}
                rows={[...data].reverse()}
              />
            }
            interpretation={
              <p>
                {log ? (
                  <>
                    A log scale shows growth rates: a straight stretch means steady percentage growth. The debt was{' '}
                    <strong className="num">{formatLargeUSD(rows[0].total, 1)}</strong> in {rows[0].fiscalYear}.
                  </>
                ) : (
                  <>
                    In fiscal {data[0].fiscalYear} the debt was <strong className="num">{formatLargeUSD(data[0].total, 2)}</strong>;
                    at the end of fiscal {lastYear} it was <strong className="num">{formatLargeUSD(rows.at(-1).total, 2)}</strong>.
                    These are nominal dollars; compared with the size of the economy the picture is less steep.
                  </>
                )}
              </p>
            }
            source={
              <SourceNote kind="live" source={DATA_SOURCES.debtHistory.name} href={DATA_SOURCES.debtHistory.href} asOf={rows.at(-1).date}>
                Fiscal years end September 30
              </SourceNote>
            }
          >
            <div className="h-[300px] sm:h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 12, bottom: 4, left: 4 }}>
                  <CartesianGrid stroke={COLORS.grid} vertical={false} />
                  <XAxis dataKey="fiscalYear" tick={AXIS_TICK} stroke={COLORS.axis} minTickGap={36} />
                  <YAxis
                    scale={log ? 'log' : 'linear'}
                    domain={log ? [1e5, 1e14] : [0, 'auto']}
                    ticks={log ? [1e6, 1e8, 1e10, 1e12, 1e14] : undefined}
                    allowDataOverflow={log}
                    tickFormatter={formatAxisUSD}
                    tick={AXIS_TICK}
                    stroke={COLORS.axis}
                    width={56}
                  />
                  <Tooltip
                    cursor={{ stroke: COLORS.axis }}
                    content={<ChartTooltip labelFormatter={(l) => `Fiscal year ${l}`} valueFormatter={(v) => formatLargeUSD(v, 2)} />}
                  />
                  <Line
                    dataKey="total"
                    name="Debt outstanding"
                    stroke={COLORS.ice}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, stroke: COLORS.chart, strokeWidth: 2 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartFrame>
        )
      }}
    </QueryState>
  )
}

const SECURITY_OPTIONS = [
  { value: 'Total Marketable', label: 'All marketable' },
  { value: 'Treasury Bills', label: 'Bills' },
  { value: 'Treasury Notes', label: 'Notes' },
  { value: 'Treasury Bonds', label: 'Bonds' },
  { value: 'Treasury Inflation-Protected Securities (TIPS)', label: 'TIPS' },
  { value: 'Treasury Floating Rate Notes (FRN)', label: 'FRNs' },
]

export function AverageRatesChart() {
  const query = useAverageRates()
  const [security, setSecurity] = useState('Total Marketable')
  return (
    <QueryState query={query} label="average interest rates" skeleton={skeleton}>
      {(rows) => {
        const data = rows.filter((r) => r.security === security).sort((a, b) => a.date.localeCompare(b.date))
        if (!data.length) return <p className="text-muted">No data for this security.</p>
        const latest = data.at(-1)
        const label = SECURITY_OPTIONS.find((o) => o.value === security).label
        const min = data.reduce((m, r) => (r.rate < m.rate ? r : m), data[0])
        return (
          <ChartFrame
            title="Average interest rate the government pays"
            description="The average rate on outstanding marketable Treasury debt, in percent per year, by month. It moves slowly because most debt was issued years ago."
            controls={<Segmented legend="Security" hideLegend size="sm" value={security} onChange={setSecurity} options={SECURITY_OPTIONS} />}
            table={
              <DataTable
                caption={`Average interest rate: ${label}`}
                columns={[
                  { key: 'date', label: 'Month', format: formatMonth },
                  { key: 'rate', label: 'Average rate', numeric: true, format: (v) => formatPercent(v, 3) },
                ]}
                rows={[...data].reverse()}
              />
            }
            interpretation={
              <p>
                {label === 'All marketable' ? 'Across all marketable debt' : `On ${label.toLowerCase()}`}, the average rate is{' '}
                <strong className="num">{formatPercent(latest.rate, 3)}</strong> as of {formatMonth(latest.date)}
                {min.date === latest.date ? (
                  <>, the lowest in this period. </>
                ) : (
                  <>
                    , compared with a low of <strong className="num">{formatPercent(min.rate, 3)}</strong> in{' '}
                    {formatMonth(min.date)}.{' '}
                  </>
                )}
                As older debt
                matures and is refinanced at today’s rates, the average drifts toward current market yields.
              </p>
            }
            source={<SourceNote kind="live" source={DATA_SOURCES.averageRates.name} href={DATA_SOURCES.averageRates.href} asOf={latest.date} />}
          >
            <div className="h-[280px] sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 12, bottom: 4, left: 0 }}>
                  <CartesianGrid stroke={COLORS.grid} vertical={false} />
                  <XAxis dataKey="date" tickFormatter={(d) => d.slice(0, 4)} tick={AXIS_TICK} stroke={COLORS.axis} minTickGap={40} />
                  <YAxis tickFormatter={(v) => `${v.toFixed(1)}%`} tick={AXIS_TICK} stroke={COLORS.axis} width={50} domain={[0, 'auto']} />
                  <Tooltip
                    cursor={{ stroke: COLORS.axis }}
                    content={<ChartTooltip labelFormatter={(l) => formatMonth(l)} valueFormatter={(v) => formatPercent(v, 3)} />}
                  />
                  <Line
                    dataKey="rate"
                    name={label}
                    stroke={SERIES.treasury.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, stroke: COLORS.chart, strokeWidth: 2 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartFrame>
        )
      }}
    </QueryState>
  )
}

export function InterestExpenseChart() {
  const query = useInterestByYear()
  return (
    <QueryState query={query} label="interest expense" skeleton={skeleton}>
      {(rows) => {
        const latest = rows.at(-1)
        const prior = rows.at(-2)
        return (
          <ChartFrame
            title="Interest paid on the debt, by fiscal year"
            description="Interest owed on publicly issued Treasury securities (bills, notes, bonds, TIPS, FRNs and savings bonds), in dollars. Interest credited to federal trust funds is reported separately and not included."
            table={
              <DataTable
                caption="Interest expense on public issues by fiscal year"
                columns={[
                  { key: 'fiscalYear', label: 'Fiscal year' },
                  { key: 'total', label: 'Interest expense', numeric: true, format: (v) => formatLargeUSD(v, 1) },
                ]}
                rows={[...rows].reverse()}
              />
            }
            interpretation={
              prior && (
                <p>
                  Fiscal {latest.fiscalYear} interest on public issues came to{' '}
                  <strong className="num">{formatLargeUSD(latest.total, 1)}</strong>, versus{' '}
                  <strong className="num">{formatLargeUSD(prior.total, 1)}</strong> the year before. The cost rises with both the
                  amount borrowed and the rates paid on it.
                </p>
              )
            }
            source={
              <SourceNote kind="live" source={DATA_SOURCES.interestExpense.name} href={DATA_SOURCES.interestExpense.href}>
                Completed fiscal years, accrual basis
              </SourceNote>
            }
          >
            <div className="h-[280px] sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rows} margin={{ top: 10, right: 8, bottom: 4, left: 4 }} barCategoryGap="22%">
                  <CartesianGrid stroke={COLORS.grid} vertical={false} />
                  <XAxis dataKey="fiscalYear" tick={AXIS_TICK} stroke={COLORS.axis} interval="preserveStartEnd" minTickGap={18} />
                  <YAxis tickFormatter={formatAxisUSD} tick={AXIS_TICK} stroke={COLORS.axis} width={56} />
                  <Tooltip
                    cursor={{ fill: 'rgba(190,215,245,0.06)' }}
                    content={<ChartTooltip labelFormatter={(l) => `Fiscal year ${l}`} valueFormatter={(v) => formatLargeUSD(v, 1)} />}
                  />
                  <Bar dataKey="total" name="Interest expense" fill={SERIES.treasury.color} radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartFrame>
        )
      }}
    </QueryState>
  )
}

const CLASS_LABELS = {
  Bills: 'Bills',
  Notes: 'Notes',
  Bonds: 'Bonds',
  'Treasury Inflation-Protected Securities': 'TIPS',
  'Floating Rate Notes': 'Floating rate notes',
  'Federal Financing Bank': 'Federal Financing Bank',
  'Government Account Series': 'Government Account Series (trust funds)',
  'United States Savings Securities': 'Savings bonds',
  'State and Local Government Series': 'State and Local Government Series',
  'Domestic Series': 'Domestic Series',
  Other: 'Other nonmarketable',
}

export function CompositionChart() {
  const query = useComposition()
  return (
    <QueryState query={query} label="debt composition" skeleton={skeleton}>
      {({ date, items }) => {
        const marketable = items.filter((i) => i.type === 'Marketable' && i.total > 0)
        const nonmarketable = items.filter((i) => i.type === 'Nonmarketable' && i.total > 0)
        const total = [...marketable, ...nonmarketable].reduce((s, i) => s + i.total, 0)
        const toItems = (list) =>
          list
            .map((i) => ({ label: CLASS_LABELS[i.security] ?? i.security, value: i.total, note: formatPercent((i.total / total) * 100, 1) + ' of all debt' }))
            .sort((a, b) => b.value - a.value)
        return (
          <ChartFrame
            title="What the debt is made of"
            description="Treasury securities outstanding by type, in dollars."
            table={
              <DataTable
                caption="Treasury securities outstanding by type"
                columns={[
                  { key: 'security', label: 'Security', format: (v) => CLASS_LABELS[v] ?? v },
                  { key: 'type', label: 'Type' },
                  { key: 'total', label: 'Outstanding', numeric: true, format: (v) => formatLargeUSD(v, 2) },
                ]}
                rows={[...marketable, ...nonmarketable]}
              />
            }
            interpretation={
              <p>
                The largest piece is <strong>{toItems(marketable)[0] && inSentence(toItems(marketable)[0].label)}</strong>. Bills are short-term, so that slice is refinanced constantly, which makes the
                government’s interest bill respond quickly to rate changes. Most nonmarketable debt is the Government Account Series
                held by trust funds such as Social Security.
              </p>
            }
            source={<SourceNote kind="live" source={DATA_SOURCES.mspd.name} href={DATA_SOURCES.mspd.href} asOf={date} />}
          >
            <h4 className="mb-3 text-[0.9375rem] font-semibold text-muted">Marketable: bought and sold by investors</h4>
            <HorizontalBars label="Marketable securities outstanding" items={toItems(marketable)} format={(v) => formatLargeUSD(v, 2)} />
            <h4 className="mt-7 mb-3 text-[0.9375rem] font-semibold text-muted">Nonmarketable: can’t be resold</h4>
            <HorizontalBars label="Nonmarketable securities outstanding" color="bg-ice-deep" items={toItems(nonmarketable)} format={(v) => formatLargeUSD(v, 2)} />
          </ChartFrame>
        )
      }}
    </QueryState>
  )
}

const OWNER_LABELS = {
  'Federal Reserve And Government Accounts': 'Federal Reserve and government accounts',
  'Foreign And International': 'Foreign and international',
  'Other Investors': 'Other investors (individuals, businesses, others)',
  'Mutual Funds': 'Mutual funds',
  'Depository Institutions': 'Banks and other depository institutions',
  'State And Local Governments': 'State and local governments',
  'Pension Funds - Private': 'Private pension funds',
  'Insurance Companies': 'Insurance companies',
  'Pension Funds - State And Local Governments': 'State and local pension funds',
  'U.S. Savings Bonds': 'U.S. savings bonds (individuals)',
}

function inSentence(label) {
  return /^(Federal Reserve|U\.S\.|[A-Z]{2})/.test(label) ? label : label.charAt(0).toLowerCase() + label.slice(1)
}

export function OwnershipChart() {
  const query = useOwnership()
  return (
    <QueryState query={query} label="ownership estimates" skeleton={skeleton}>
      {(own) => {
        if (!own) return <p className="text-muted">Ownership estimates aren’t available right now.</p>
        const items = own.holders.map((h) => ({
          label: OWNER_LABELS[h.owner] ?? h.owner,
          value: h.amount,
          note: own.total ? `${formatPercent((h.amount / own.total) * 100, 1)} of total` : undefined,
        }))
        return (
          <ChartFrame
            title="Who owns the debt"
            description={`Estimated holders of Treasury securities at the end of ${formatMonth(own.quarterEnd)}, in dollars.`}
            table={
              <DataTable
                caption="Estimated ownership of Treasury securities"
                columns={[
                  { key: 'label', label: 'Holder' },
                  { key: 'value', label: 'Amount', numeric: true, format: (v) => formatLargeUSD(v, 2) },
                  { key: 'note', label: 'Share' },
                ]}
                rows={items}
              />
            }
            interpretation={
              <p>
                The largest group is <strong>{inSentence(items[0].label)}</strong>
                {items[1] && (
                  <>
                    , followed by <strong>{inSentence(items[1].label)}</strong>
                  </>
                )}
                . In Treasury’s table, the Federal Reserve and federal trust funds
                are counted together, though the Fed is an independent central bank rather than part of the Treasury. Savings
                bonds owned by individuals are a small slice.
              </p>
            }
            source={
              <SourceNote kind="live" source={DATA_SOURCES.ownership.name} href={DATA_SOURCES.ownership.href} asOf={own.quarterEnd} asOfLabel="Quarter ending">
                Estimates; Treasury revises them as data arrives
              </SourceNote>
            }
          >
            <HorizontalBars label="Holders of Treasury securities" items={items} format={(v) => formatLargeUSD(v, 2)} />
          </ChartFrame>
        )
      }}
    </QueryState>
  )
}
