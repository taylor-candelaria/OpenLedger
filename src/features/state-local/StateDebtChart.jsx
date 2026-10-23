import { useState } from 'react'
import { ChartFrame, DataTable } from '@/components/charts/ChartFrame.jsx'
import { HorizontalBars } from '@/components/charts/HorizontalBars.jsx'
import { Segmented } from '@/components/ui/Fields.jsx'
import { Callout, SourceNote } from '@/components/ui/Notes.jsx'
import { ErrorState } from '@/components/ui/QueryState.jsx'
import { DATA_SOURCES } from '@/content/sources.js'
import { useApiStatus, useStateDebt } from '@/lib/api/hooks.js'
import { formatLargeUSD } from '@/lib/format.js'

export function StateDebtChart() {
  const status = useApiStatus()
  const configured = status.data?.census.configured ?? false
  const query = useStateDebt({ enabled: configured })
  const [govType, setGovType] = useState(null)
  const [showAll, setShowAll] = useState(false)

  if (status.isPending) return <div className="skeleton h-[420px] w-full" />
  if (status.isError) {
    return <ErrorState error={status.error} label="the local API status" onRetry={() => status.refetch()} />
  }
  if (!configured) {
    return (
      <Callout title="Add a Census API key to see debt by state">
        <p>
          This chart reads the Census Bureau’s State and Local Government Finances data, which needs a free key. Request one at{' '}
          <a href="https://api.census.gov/data/key_signup.html" target="_blank" rel="noreferrer">
            api.census.gov/data/key_signup.html
          </a>
          , add it to <code className="num">.env.local</code> as <code className="num">CENSUS_API_KEY</code>, and restart the dev
          server.
        </p>
      </Callout>
    )
  }
  if (query.isPending) return <div className="skeleton h-[420px] w-full" />
  if (query.isError) return <ErrorState error={query.error} label="Census debt data" onRetry={() => query.refetch()} />

  const { rows, year, debt, govTypes } = query.data
  const types = govTypes.filter((g) => rows.some((r) => r.govType === g.label))
  const combined = types.find((g) => /state.*local/i.test(g.label)) ?? types[0]
  const active = govType ?? combined?.label
  const shown = rows
    .filter((r) => r.govType === active && r.fips !== '00')
    .sort((a, b) => b.amount - a.amount)
  const visible = showAll ? shown : shown.slice(0, 15)
  const total = shown.reduce((s, r) => s + r.amount, 0)

  return (
    <ChartFrame
      title={`${debt.label}, by state`}
      description={`Fiscal year ${year}, in dollars. ${active}.`}
      controls={
        types.length > 1 && (
          <Segmented
            legend="Government"
            hideLegend
            size="sm"
            value={active}
            onChange={setGovType}
            options={types.map((t) => ({ value: t.label, label: t.label }))}
          />
        )
      }
      table={
        <DataTable
          caption={`${debt.label} by state, fiscal year ${year}`}
          columns={[
            { key: 'name', label: 'State' },
            { key: 'amount', label: 'Debt outstanding', numeric: true, format: (v) => formatLargeUSD(v, 2) },
          ]}
          rows={shown}
        />
      }
      interpretation={
        <p>
          Together these governments owed <strong className="num">{formatLargeUSD(total, 2)}</strong>. Big states lead in dollars
          because they have more people and more infrastructure; per-person debt tells a different story.
        </p>
      }
      source={
        <SourceNote kind="live" source={DATA_SOURCES.census.name} href={DATA_SOURCES.census.href}>
          Fiscal year {year}; survey estimates, published with a lag of about two years
        </SourceNote>
      }
    >
      <HorizontalBars label={`${debt.label} by state`} items={visible.map((r) => ({ label: r.name, value: r.amount }))} format={(v) => formatLargeUSD(v, 1)} color="bg-series-muni" />
      {shown.length > 15 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-5 text-sm font-semibold text-ice underline decoration-ice/40 underline-offset-4 hover:decoration-ice"
        >
          {showAll ? 'Show the top 15' : `Show all ${shown.length}`}
        </button>
      )}
    </ChartFrame>
  )
}
