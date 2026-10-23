export const CHAPTERS = [
  {
    slug: 'public-debt',
    number: 1,
    title: 'What public debt is',
    summary: 'Why governments borrow, how much the United States owes, and who it owes it to.',
    load: () => import('./PublicDebt.jsx'),
  },
  {
    slug: 'how-bonds-work',
    number: 2,
    title: 'How a bond works',
    summary: 'Face value, coupons and maturity: the life of a bond from issue to repayment.',
    load: () => import('./HowBondsWork.jsx'),
  },
  {
    slug: 'treasury-securities',
    number: 3,
    title: 'The Treasury family',
    summary: 'Bills, notes, bonds, TIPS, floating rate notes and savings bonds, and how each pays you.',
    load: () => import('./TreasurySecurities.jsx'),
  },
  {
    slug: 'yields-and-rates',
    number: 4,
    title: 'Yields and interest rates',
    summary: 'Why prices and yields move in opposite directions, and what the yield curve tells you.',
    load: () => import('./YieldsAndRates.jsx'),
  },
  {
    slug: 'borrowing-and-the-economy',
    number: 5,
    title: 'Borrowing and the economy',
    summary: 'What federal borrowing costs, why Treasuries anchor other rates, and how the debt limit works.',
    load: () => import('./BorrowingAndEconomy.jsx'),
  },
]

export function chapterBySlug(slug) {
  return CHAPTERS.find((c) => c.slug === slug) ?? null
}
