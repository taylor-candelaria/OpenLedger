import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toISODate } from '../format.js'
import { searchCatalog, fetchApiStatus } from './catalog.js'
import { discoverDebtSeries, fetchStateDebt } from './census.js'
import {
  AUCTION_FIELDS,
  fiscalQuery,
  latestByTerm,
  parseAuction,
  parseAverageRates,
  parseComposition,
  parseDebtLimit,
  parseDebtHistory,
  parseDebtToPenny,
  parseIBondRates,
  parseInterestByFiscalYear,
  parseOwnership,
} from './fiscalData.js'
import { createNote, deleteNote, listNotes, toggleNote, updateNote } from './notes.js'
import { fetchYieldCurveYear } from './yieldCurve.js'

const HOUR = 60 * 60 * 1000
const DAILY = { staleTime: HOUR, gcTime: 6 * HOUR }
const MONTHLY = { staleTime: 12 * HOUR, gcTime: 24 * HOUR }

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return toISODate(d)
}

export function useDebtToPenny() {
  return useQuery({
    queryKey: ['fiscal', 'debt_to_penny'],
    queryFn: ({ signal }) =>
      fiscalQuery('v2/accounting/od/debt_to_penny', {
        fields: ['record_date', 'tot_pub_debt_out_amt', 'debt_held_public_amt', 'intragov_hold_amt'],
        filter: [`record_date:gte:${daysAgo(400)}`],
        sort: '-record_date',
        pageSize: 400,
        signal,
      }).then(parseDebtToPenny),
    ...DAILY,
  })
}

export function useDebtHistory() {
  return useQuery({
    queryKey: ['fiscal', 'debt_outstanding'],
    queryFn: ({ signal }) =>
      fiscalQuery('v2/accounting/od/debt_outstanding', {
        fields: ['record_date', 'record_fiscal_year', 'debt_outstanding_amt'],
        sort: 'record_date',
        pageSize: 400,
        signal,
      }).then(parseDebtHistory),
    ...MONTHLY,
  })
}

export function useAuctions() {
  return useQuery({
    queryKey: ['fiscal', 'auctions'],
    queryFn: async ({ signal }) => {
      const rows = await fiscalQuery('v1/accounting/od/auctions_query', {
        fields: AUCTION_FIELDS,
        filter: [`auction_date:gte:${daysAgo(130)}`],
        sort: '-auction_date',
        pageSize: 500,
        signal,
      })
      const auctions = rows.map(parseAuction)
      const today = toISODate(new Date())
      const upcoming = auctions
        .filter((a) => !a.completed && a.auctionDate >= today)
        .sort((a, b) => a.auctionDate.localeCompare(b.auctionDate))
      const completed = auctions.filter((a) => a.completed)
      return { completed, upcoming, latest: latestByTerm(completed) }
    },
    ...DAILY,
  })
}

export function useAverageRates() {
  return useQuery({
    queryKey: ['fiscal', 'avg_interest_rates'],
    queryFn: ({ signal }) =>
      fiscalQuery('v2/accounting/od/avg_interest_rates', {
        fields: ['record_date', 'security_type_desc', 'security_desc', 'avg_interest_rate_amt'],
        filter: ['security_type_desc:eq:Marketable', `record_date:gte:${daysAgo(365 * 10 + 31)}`],
        sort: '-record_date',
        pageSize: 1000,
        signal,
      }).then(parseAverageRates),
    ...MONTHLY,
  })
}

export function useComposition() {
  return useQuery({
    queryKey: ['fiscal', 'mspd_table_1'],
    queryFn: async ({ signal }) => {
      const rows = await fiscalQuery('v1/debt/mspd/mspd_table_1', {
        sort: '-record_date',
        pageSize: 30,
        signal,
      })
      const latest = rows[0]?.record_date
      return { date: latest, items: parseComposition(rows.filter((r) => r.record_date === latest)) }
    },
    ...MONTHLY,
  })
}

export function useOwnership() {
  return useQuery({
    queryKey: ['fiscal', 'ofs2'],
    queryFn: ({ signal }) =>
      fiscalQuery('v1/accounting/tb/ofs2_estimated_ownership_treasury_securities', {
        sort: '-record_date',
        pageSize: 80,
        signal,
      }).then(parseOwnership),
    ...MONTHLY,
  })
}

export function useIBondRates() {
  return useQuery({
    queryKey: ['fiscal', 'i_bonds'],
    queryFn: ({ signal }) =>
      fiscalQuery('v1/accounting/od/i_bonds_interest_rates', {
        sort: '-earning_period_start,-issue_year_month',
        pageSize: 50,
        signal,
      }).then(parseIBondRates),
    ...MONTHLY,
  })
}

export function useInterestByYear() {
  return useQuery({
    queryKey: ['fiscal', 'interest_expense'],
    queryFn: ({ signal }) =>
      fiscalQuery('v2/accounting/od/interest_expense', {
        fields: ['record_date', 'record_fiscal_year', 'expense_catg_desc', 'fytd_expense_amt'],
        filter: ['record_calendar_month:eq:09', 'record_fiscal_year:gte:2010'],
        sort: '-record_date',
        pageSize: 1000,
        signal,
      }).then(parseInterestByFiscalYear),
    ...MONTHLY,
  })
}

export function useYieldCurveYear(year) {
  return useQuery({
    queryKey: ['treasury', 'yield_curve', year],
    queryFn: ({ signal }) => fetchYieldCurveYear(year, { signal }),
    ...DAILY,
  })
}

export function useApiStatus() {
  return useQuery({
    queryKey: ['local', 'status'],
    queryFn: ({ signal }) => fetchApiStatus({ signal }),
    staleTime: Infinity,
    retry: false,
  })
}

export function useCatalogSearch({ q, orgType }) {
  return useInfiniteQuery({
    queryKey: ['catalog', q, orgType],
    queryFn: ({ pageParam, signal }) => searchCatalog({ q, orgType, after: pageParam, signal }),
    initialPageParam: undefined,
    getNextPageParam: (last) => (last.results.length ? (last.after ?? undefined) : undefined),
    enabled: Boolean(q?.trim()),
    staleTime: HOUR,
    retry: (count, err) => err?.status !== 429 && count < 2,
  })
}

export function useStateDebt({ enabled }) {
  return useQuery({
    queryKey: ['census', 'state_debt'],
    queryFn: async ({ signal }) => {
      const series = await discoverDebtSeries({ signal })
      const rows = await fetchStateDebt({ year: series.year, aggregateCode: series.debt.code, signal })
      return { ...series, rows }
    },
    enabled,
    staleTime: 24 * HOUR,
    retry: 1,
  })
}

export function useDebtLimit() {
  return useQuery({
    queryKey: ['fiscal', 'debt_subject_to_limit'],
    queryFn: ({ signal }) =>
      fiscalQuery('v1/accounting/dts/debt_subject_to_limit', {
        fields: ['record_date', 'debt_catg', 'close_today_bal'],
        filter: [`record_date:gte:${daysAgo(10)}`],
        sort: '-record_date',
        pageSize: 100,
        signal,
      }).then(parseDebtLimit),
    ...DAILY,
  })
}

const NOTES_KEY = ['notes']

export function useNotes({ enabled }) {
  return useQuery({
    queryKey: NOTES_KEY,
    queryFn: ({ signal }) => listNotes({ signal }),
    enabled,
    staleTime: 30 * 1000,
    retry: (count, err) => ![400, 401, 403, 503].includes(err?.status) && count < 2,
  })
}

function useNotesMutation(mutationFn, applyLocally) {
  const client = useQueryClient()
  return useMutation({
    mutationFn,
    onMutate: async (vars) => {
      await client.cancelQueries({ queryKey: NOTES_KEY })
      const previous = client.getQueryData(NOTES_KEY)
      if (previous && applyLocally) client.setQueryData(NOTES_KEY, applyLocally(previous, vars))
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) client.setQueryData(NOTES_KEY, ctx.previous)
    },
    onSettled: () => client.invalidateQueries({ queryKey: NOTES_KEY }),
  })
}

export function useCreateNote() {
  return useNotesMutation(createNote)
}

export function useUpdateNote() {
  return useNotesMutation(
    ({ current, changes }) => updateNote(current, changes),
    (notes, { current, changes }) => notes.map((n) => (n.id === current.id ? { ...n, ...changes } : n)),
  )
}

export function useToggleNote() {
  return useNotesMutation(
    (id) => toggleNote(id),
    (notes, id) => notes.map((n) => (n.id === id ? { ...n, reviewed: !n.reviewed } : n)),
  )
}

export function useDeleteNote() {
  return useNotesMutation(
    (id) => deleteNote(id),
    (notes, id) => notes.filter((n) => n.id !== id),
  )
}
