export const DATA_SOURCES = {
  debtToPenny: {
    name: 'Treasury Fiscal Data: Debt to the Penny',
    href: 'https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/',
  },
  debtHistory: {
    name: 'Treasury Fiscal Data: Historical Debt Outstanding',
    href: 'https://fiscaldata.treasury.gov/datasets/historical-debt-outstanding/',
  },
  auctions: {
    name: 'Treasury Fiscal Data: Treasury Securities Auctions',
    href: 'https://fiscaldata.treasury.gov/datasets/treasury-securities-auctions-data/',
  },
  averageRates: {
    name: 'Treasury Fiscal Data: Average Interest Rates on U.S. Treasury Securities',
    href: 'https://fiscaldata.treasury.gov/datasets/average-interest-rates-treasury-securities/',
  },
  interestExpense: {
    name: 'Treasury Fiscal Data: Interest Expense on the Public Debt',
    href: 'https://fiscaldata.treasury.gov/datasets/interest-expense-debt-outstanding/',
  },
  mspd: {
    name: 'Treasury Fiscal Data: Monthly Statement of the Public Debt',
    href: 'https://fiscaldata.treasury.gov/datasets/monthly-statement-public-debt/',
  },
  ownership: {
    name: 'Treasury Bulletin, table OFS-2 (estimated ownership)',
    href: 'https://fiscaldata.treasury.gov/datasets/treasury-bulletin/',
  },
  iBondRates: {
    name: 'Treasury Fiscal Data: I Bonds Interest Rates',
    href: 'https://fiscaldata.treasury.gov/datasets/i-bonds-interest-rates/',
  },
  yieldCurve: {
    name: 'U.S. Treasury: Daily Par Yield Curve Rates',
    href: 'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve',
  },
  catalog: {
    name: 'data.gov Catalog API (GSA)',
    href: 'https://resources.data.gov/catalog-api/',
  },
  census: {
    name: 'U.S. Census Bureau: State and Local Government Finances',
    href: 'https://www.census.gov/programs-surveys/gov-finances.html',
  },
}

export const REFERENCES = [
  {
    group: 'Treasury securities',
    items: [
      { name: 'TreasuryDirect: Treasury bills', href: 'https://www.treasurydirect.gov/marketable-securities/treasury-bills/' },
      { name: 'TreasuryDirect: Treasury notes', href: 'https://www.treasurydirect.gov/marketable-securities/treasury-notes/' },
      { name: 'TreasuryDirect: Treasury bonds', href: 'https://www.treasurydirect.gov/marketable-securities/treasury-bonds/' },
      { name: 'TreasuryDirect: TIPS', href: 'https://www.treasurydirect.gov/marketable-securities/tips/' },
      { name: 'TreasuryDirect: Floating rate notes', href: 'https://www.treasurydirect.gov/marketable-securities/floating-rate-notes/' },
      { name: 'TreasuryDirect: How auctions work', href: 'https://www.treasurydirect.gov/auctions/how-auctions-work/' },
      { name: 'TreasuryDirect: Buying a marketable security', href: 'https://www.treasurydirect.gov/marketable-securities/buying-a-marketable-security/' },
    ],
  },
  {
    group: 'Savings bonds',
    items: [
      { name: 'TreasuryDirect: I bonds', href: 'https://www.treasurydirect.gov/savings-bonds/i-bonds/' },
      { name: 'TreasuryDirect: EE bonds', href: 'https://www.treasurydirect.gov/savings-bonds/ee-bonds/' },
    ],
  },
  {
    group: 'Taxes',
    items: [
      { name: 'IRS Publication 550: Investment Income and Expenses', href: 'https://www.irs.gov/publications/p550' },
      { name: 'IRS Publication 970: Tax Benefits for Education', href: 'https://www.irs.gov/publications/p970' },
      { name: 'IRS Form 8815: Exclusion of Interest from Series EE and I Bonds', href: 'https://www.irs.gov/forms-pubs/about-form-8815' },
    ],
  },
  {
    group: 'Municipal bonds, deposits and investor education',
    items: [
      { name: 'MSRB: Municipal bond basics', href: 'https://www.msrb.org/Municipal-Bond-Basics' },
      { name: 'MSRB EMMA: municipal disclosures and prices', href: 'https://emma.msrb.org/' },
      { name: 'Investor.gov (SEC): Bonds', href: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/bonds' },
      { name: 'FDIC: Deposit insurance', href: 'https://www.fdic.gov/resources/deposit-insurance/' },
    ],
  },
]

export const EE_BOND_RATE = {
  rate: 2.4,
  from: '2026-05-01',
  to: '2026-10-31',
  source: 'TreasuryDirect: EE bonds',
  href: 'https://www.treasurydirect.gov/savings-bonds/ee-bonds/',
}
