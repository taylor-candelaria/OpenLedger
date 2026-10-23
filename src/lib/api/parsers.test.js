import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import bills from './__fixtures__/bills.json'
import catalog from './__fixtures__/catalog.json'
import coupons from './__fixtures__/coupons.json'
import ibonds from './__fixtures__/ibonds.json'
import mspd from './__fixtures__/mspd.json'
import ofs2 from './__fixtures__/ofs2.json'
import interest from './__fixtures__/interest.json'
import dts from './__fixtures__/dts.json'
import auction10y from './__fixtures__/auction10y.json'
import { toNumber } from './client.js'
import { toCatalogDataset, plainText } from './catalog.js'
import { pickDebtAggregate, tableToObjects } from './census.js'
import {
  bidderShares,
  latestByTerm,
  parseAuction,
  parseComposition,
  parseDebtLimit,
  parseIBondRates,
  parseInterestByFiscalYear,
  parseOwnership,
} from './fiscalData.js'
import { curveOnOrBefore, parseYieldCurveCSV } from './yieldCurve.js'

describe('toNumber', () => {
  it('treats Fiscal Data’s "null" string as missing', () => {
    expect(toNumber('null')).toBeNull()
    expect(toNumber('')).toBeNull()
    expect(toNumber(null)).toBeNull()
    expect(toNumber('4.132000')).toBe(4.132)
    expect(toNumber('-1641107222.40')).toBeCloseTo(-1641107222.4, 2)
  })
})

describe('auctions', () => {
  const auctions = [...bills.data, ...coupons.data].map(parseAuction)

  it('marks announced auctions without results as not completed', () => {
    const announced = auctions.filter((a) => !a.completed)
    expect(announced.length).toBeGreaterThan(0)
    expect(announced.every((a) => a.investmentRate === null && a.highYield === null)).toBe(true)
  })

  it('counts a note reopening toward its original term', () => {
    const base = coupons.data.find((a) => a.security_term === '10-Year')
    const reopening = parseAuction({
      ...base,
      security_term: '9-Year 10-Month',
      original_security_term: '10-Year',
      reopening: 'Yes',
      auction_date: '2026-10-07',
    })
    expect(reopening.groupTerm).toBe('10-Year')
    const { nominal } = latestByTerm([reopening, ...coupons.data.map(parseAuction)])
    expect(nominal.find((a) => a.groupTerm === '10-Year').auctionDate).toBe('2026-10-07')
  })

  it('counts a bill auction toward the term being sold', () => {
    const bill = parseAuction({ ...bills.data[2], original_security_term: '26-Week' })
    expect(bill.groupTerm).toBe(bills.data[2].security_term)
  })

  it('picks the most recent completed auction per term, in maturity order', () => {
    const { nominal } = latestByTerm(auctions)
    const terms = nominal.map((a) => a.groupTerm)
    expect(terms.indexOf('4-Week')).toBeLessThan(terms.indexOf('2-Year'))
    const thirteen = nominal.find((a) => a.term === '13-Week')
    expect(thirteen.completed).toBe(true)
    expect(thirteen.auctionDate).toBe('2026-10-13')
  })
})

describe('I bond rates', () => {
  it('finds the rate for new purchases', () => {
    const { current } = parseIBondRates(ibonds.data)
    expect(current).toMatchObject({ period: '2026-05', fixed: 0.9, inflation: 1.67, composite: 4.26 })
  })
})

describe('debt composition and ownership', () => {
  it('drops subtotal rows and converts millions to dollars', () => {
    const items = parseComposition(mspd.data)
    expect(items.find((i) => i.security === '_')).toBeUndefined()
    const bills = items.find((i) => i.security === 'Bills')
    expect(bills.total).toBeCloseTo(7118145.3141e6, -3)
  })

  it('skips the newest quarter when its breakdown hasn’t been published yet', () => {
    const own = parseOwnership(ofs2.data)
    expect(own.quarterEnd).toBe('2026-03-31')
    expect(own.holders[0].owner).toBe('Federal Reserve And Government Accounts')
    expect(own.holders[1].owner).toBe('Foreign And International')
    expect(own.holders.every((h) => h.amount > 0)).toBe(true)
  })

  it('sums interest on public issues for the fiscal year', () => {
    const [fy] = parseInterestByFiscalYear(interest.data)
    expect(fy.fiscalYear).toBe(2026)
    expect(fy.total).toBeGreaterThan(1e12)
  })
})

describe('yield curve CSV', () => {
  const csv = readFileSync(new URL('./__fixtures__/yieldcurve.csv', import.meta.url), 'utf8')
  const days = parseYieldCurveCSV(csv)

  it('parses dates and maturities, newest first', () => {
    expect(days[0].date).toBe('2026-10-19')
    expect(days.at(-1).date).toBe('2026-01-02')
    const tenYear = days[0].points.find((p) => p.label === '10Y')
    expect(tenYear).toMatchObject({ years: 10, rate: 5.15 })
    expect(days[0].points.map((p) => p.years)).toEqual([...days[0].points.map((p) => p.years)].sort((a, b) => a - b))
  })

  it('handles years whose columns differ', () => {
    const old = parseYieldCurveCSV('Date,"1 Mo","3 Mo","10 Yr"\n01/03/2000,,5.48,6.58\n')
    expect(old[0].points.map((p) => p.label)).toEqual(['3M', '10Y'])
  })

  it('finds the curve on or before a date', () => {
    expect(curveOnOrBefore(days, '2026-10-18').date).toBe('2026-10-16')
  })
})

describe('data.gov catalog', () => {
  it('maps search results to display fields', () => {
    const d = toCatalogDataset(catalog.results[0])
    expect(d.title).toMatch(/Debt Outstanding/)
    expect(d.orgType).toBe('City Government')
    expect(d.url).toBe(`https://catalog.data.gov/dataset/${catalog.results[0].slug}`)
    expect(d.summary).not.toMatch(/</)
  })

  it('strips markup from descriptions', () => {
    expect(plainText('<p>Bonds&nbsp;&amp; notes</p>')).toBe('Bonds & notes')
  })
})

describe('Census helpers', () => {
  it('turns the header-row table into objects', () => {
    expect(tableToObjects([['NAME', 'AMOUNT'], ['Ohio', '1']])).toEqual([{ NAME: 'Ohio', AMOUNT: '1' }])
    expect(tableToObjects(null)).toEqual([])
  })

  it('prefers the total debt outstanding aggregate', () => {
    const picked = pickDebtAggregate([
      { code: 'SF0040', label: 'Long-term debt outstanding' },
      { code: 'SF0039', label: 'Total debt outstanding' },
      { code: 'SF0001', label: 'Total revenue' },
    ])
    expect(picked.code).toBe('SF0039')
  })
})

describe('debt subject to limit', () => {
  it('rebuilds the total from its published parts', () => {
    const d = parseDebtLimit(dts.data)
    expect(d.date).toBe('2026-10-16')
    expect(d.limit).toBe(41103996e6)
    expect(d.subjectToLimit).toBe(40188087e6)
    expect(d.headroom).toBe(915909e6)
  })
})

describe('a full auction record', () => {
  const a = parseAuction(auction10y.data[0])

  it('reads the dates, yields and allotment Treasury publishes', () => {
    expect(a).toMatchObject({
      groupTerm: '10-Year',
      announcementDate: '2026-10-01',
      auctionDate: '2026-10-07',
      issueDate: '2026-10-15',
      highYield: 5.3,
      lowYield: 4.3,
      medianYield: 5.255,
      allottedAtHigh: 57.6,
      interestRate: 4.625,
    })
  })

  it('splits the competitive award among bidder types', () => {
    const s = bidderShares(a)
    expect(s.primaryDealers + s.direct + s.indirect).toBeCloseTo(1, 10)
    expect(s.indirect).toBeGreaterThan(s.direct)
    expect(a.primaryDealerAccepted + a.directBidderAccepted + a.indirectBidderAccepted).toBe(a.compAccepted)
  })

  it('matches Treasury’s bid-to-cover, which leaves out the Fed’s add-on', () => {
    const tendered = a.totalTendered - a.somaAccepted
    const accepted = a.totalAccepted - a.somaAccepted
    expect(tendered / accepted).toBeCloseTo(a.bidToCover, 2)
  })
})
