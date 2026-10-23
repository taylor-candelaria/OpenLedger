export const GLOSSARY = [
  {
    id: 'bond',
    term: 'Bond',
    group: 'Basics',
    short:
      'A loan you make to a borrower, such as a government, in exchange for interest and the return of your money on a set date.',
    long: 'The borrower is the issuer. In everyday use “bond” covers any debt security; the U.S. Treasury also uses “Bond” as the name of its 20- and 30-year securities.',
    related: ['face-value', 'coupon', 'maturity'],
  },
  {
    id: 'face-value',
    term: 'Face value (par)',
    group: 'Basics',
    short: 'The amount the borrower promises to repay at maturity. Coupon interest is figured on this amount.',
    long: 'Treasury securities are sold in multiples of $100 face value. A bond trading “at par” has a market price equal to its face value.',
    related: ['premium', 'discount'],
  },
  {
    id: 'principal',
    term: 'Principal',
    group: 'Basics',
    short: 'The amount borrowed and repaid at maturity. For most bonds it equals the face value.',
    related: ['face-value'],
  },
  {
    id: 'coupon',
    term: 'Coupon',
    group: 'Basics',
    short: 'A scheduled interest payment on a bond. Treasury notes and bonds pay a coupon every six months.',
    long: 'The name comes from paper bonds that had detachable coupons you clipped and redeemed for each payment.',
    related: ['coupon-rate'],
  },
  {
    id: 'coupon-rate',
    term: 'Coupon rate',
    group: 'Basics',
    short:
      'The fixed annual interest rate printed on a bond, applied to face value. A 4% coupon on $1,000 pays $40 a year, or $20 every six months.',
    long: 'The coupon rate never changes after issue, even when market interest rates do. That is why a bond’s price moves instead.',
    related: ['yield-to-maturity', 'current-yield'],
  },
  {
    id: 'maturity',
    term: 'Maturity',
    group: 'Basics',
    short: 'The date the borrower repays the face value and the bond stops paying interest.',
    related: ['face-value'],
  },
  {
    id: 'issuer',
    term: 'Issuer',
    group: 'Basics',
    short: 'The government or organization that borrows money by selling a bond and is responsible for paying it back.',
  },
  {
    id: 'secondary-market',
    term: 'Secondary market',
    group: 'Basics',
    short:
      'Where investors buy and sell bonds that have already been issued, through banks and brokers. Prices there change every day.',
    related: ['interest-rate-risk'],
  },
  {
    id: 'fixed-income',
    term: 'Fixed income',
    group: 'Basics',
    short: 'Investments that pay a set schedule of interest, such as bonds, bills and CDs.',
  },

  {
    id: 'yield',
    term: 'Yield',
    group: 'Yields and pricing',
    short:
      'The return you earn on a bond as an annual percentage of what you pay for it. When people say “rates are up,” they usually mean yields.',
    related: ['yield-to-maturity', 'current-yield', 'coupon-rate'],
  },
  {
    id: 'yield-to-maturity',
    term: 'Yield to maturity (YTM)',
    group: 'Yields and pricing',
    short:
      'The annual return you’d earn buying a bond at today’s price and holding it to maturity, counting every coupon and the final repayment.',
    long: 'It assumes coupons are reinvested at the same yield and that the issuer pays as promised. For Treasuries, the “high yield” at auction is a yield to maturity.',
    related: ['current-yield', 'reinvestment-risk'],
  },
  {
    id: 'current-yield',
    term: 'Current yield',
    group: 'Yields and pricing',
    short:
      'A bond’s annual coupon income divided by its current price. Simpler than yield to maturity, because it ignores any gain or loss at maturity.',
    related: ['yield-to-maturity'],
  },
  {
    id: 'premium',
    term: 'Premium',
    group: 'Yields and pricing',
    short: 'A bond priced above its face value, usually because its coupon rate is higher than current market yields.',
    related: ['discount', 'face-value'],
  },
  {
    id: 'discount',
    term: 'Discount',
    group: 'Yields and pricing',
    short:
      'A bond priced below its face value. Treasury bills are always sold at a discount, and the difference is your interest.',
    related: ['premium', 'treasury-bill'],
  },
  {
    id: 'basis-point',
    term: 'Basis point',
    group: 'Yields and pricing',
    short: 'One hundredth of a percentage point. A move from 4.25% to 4.50% is 25 basis points (bps).',
  },
  {
    id: 'yield-curve',
    term: 'Yield curve',
    group: 'Yields and pricing',
    short:
      'A line connecting Treasury yields from the shortest maturities to the longest on the same day. It shows what it costs the government to borrow for different lengths of time.',
    related: ['inverted-yield-curve', 'par-yield'],
  },
  {
    id: 'inverted-yield-curve',
    term: 'Inverted yield curve',
    group: 'Yields and pricing',
    short:
      'When short-term yields are higher than long-term yields. It is unusual, and many economists watch it as a possible warning sign for the economy.',
    related: ['yield-curve'],
  },
  {
    id: 'par-yield',
    term: 'Par yield',
    group: 'Yields and pricing',
    short:
      'The coupon rate a newly issued Treasury would need to trade exactly at par. Treasury’s daily yield curve is built from par yields.',
    related: ['yield-curve'],
  },
  {
    id: 'duration',
    term: 'Duration',
    group: 'Yields and pricing',
    short:
      'A measure of how sensitive a bond’s price is to interest rates. A duration of 8 means the price falls about 8% if yields rise one percentage point.',
    related: ['interest-rate-risk'],
  },
  {
    id: 'interest-rate-risk',
    term: 'Interest rate risk',
    group: 'Yields and pricing',
    short:
      'The chance that rising interest rates push down the market price of a bond you own. It matters if you sell before maturity; held to maturity, you still get face value back.',
    related: ['duration', 'secondary-market'],
  },
  {
    id: 'reinvestment-risk',
    term: 'Reinvestment risk',
    group: 'Yields and pricing',
    short:
      'The chance you’ll have to reinvest coupons or a maturing bond at a lower rate than before. Short-term bills carry the most of it.',
  },
  {
    id: 'inflation-risk',
    term: 'Inflation risk',
    group: 'Yields and pricing',
    short:
      'The chance that rising prices erode what your fixed payments can buy. TIPS and I bonds are designed to offset it.',
    related: ['tips', 'i-bond'],
  },
  {
    id: 'credit-risk',
    term: 'Credit (default) risk',
    group: 'Yields and pricing',
    short:
      'The chance a borrower doesn’t pay interest or principal on time. It is why lower-rated borrowers have to offer higher yields.',
    related: ['full-faith-and-credit', 'credit-rating'],
  },
  {
    id: 'accrued-interest',
    term: 'Accrued interest',
    group: 'Yields and pricing',
    short:
      'Interest earned since the last coupon date but not yet paid. A buyer between coupon dates pays it to the seller on top of the price.',
  },

  {
    id: 'treasury-security',
    term: 'Treasury security',
    group: 'Treasury securities',
    short:
      'Debt issued by the U.S. Department of the Treasury to finance the federal government: bills, notes, bonds, TIPS, FRNs and savings bonds.',
    related: ['marketable', 'nonmarketable'],
  },
  {
    id: 'treasury-bill',
    term: 'Treasury bill (T-bill)',
    group: 'Treasury securities',
    short:
      'Short-term Treasury debt maturing in 4 to 52 weeks. Bills pay no coupon; you buy below face value and receive the full face value at maturity.',
    related: ['discount', 'investment-rate'],
  },
  {
    id: 'treasury-note',
    term: 'Treasury note',
    group: 'Treasury securities',
    short: 'Treasury debt maturing in 2, 3, 5, 7 or 10 years, paying a fixed coupon every six months.',
  },
  {
    id: 'treasury-bond',
    term: 'Treasury bond',
    group: 'Treasury securities',
    short: 'Long-term Treasury debt maturing in 20 or 30 years, paying a fixed coupon every six months.',
  },
  {
    id: 'tips',
    term: 'TIPS',
    group: 'Treasury securities',
    short:
      'Treasury Inflation-Protected Securities. The principal rises and falls with the Consumer Price Index, and the fixed coupon rate is paid on the adjusted principal.',
    long: 'At maturity you receive the inflation-adjusted principal or the original principal, whichever is greater. Upward principal adjustments are taxable in the year they occur, even though you don’t receive them until maturity.',
    related: ['inflation-risk', 'cpi'],
  },
  {
    id: 'frn',
    term: 'Floating rate note (FRN)',
    group: 'Treasury securities',
    short:
      'A 2-year Treasury whose interest rate resets weekly, tied to the 13-week bill rate plus a fixed spread. Interest is paid every three months.',
  },
  {
    id: 'savings-bond',
    term: 'Savings bond',
    group: 'Treasury securities',
    short:
      'A nonmarketable Treasury security registered to you and bought through TreasuryDirect. You can’t sell it to anyone else; you cash it in with Treasury.',
    related: ['i-bond', 'ee-bond', 'treasurydirect'],
  },
  {
    id: 'i-bond',
    term: 'Series I savings bond',
    group: 'Treasury securities',
    short:
      'A savings bond whose rate combines a fixed rate with an inflation rate that resets every six months. It earns interest for up to 30 years.',
    long: 'You must hold it at least 12 months, and cashing in before 5 years costs the last 3 months of interest. Electronic purchases are limited to $10,000 per person per calendar year.',
    related: ['composite-rate', 'ee-bond'],
  },
  {
    id: 'ee-bond',
    term: 'Series EE savings bond',
    group: 'Treasury securities',
    short:
      'A savings bond with a fixed rate, which Treasury guarantees will be worth at least double its purchase price after 20 years.',
    related: ['i-bond'],
  },
  {
    id: 'composite-rate',
    term: 'Composite rate',
    group: 'Treasury securities',
    short:
      'The I bond’s overall rate: fixed rate + (2 × six-month inflation rate) + (fixed rate × six-month inflation rate). It can’t fall below zero.',
    related: ['i-bond'],
  },
  {
    id: 'cpi',
    term: 'Consumer Price Index (CPI)',
    group: 'Treasury securities',
    short:
      'The Bureau of Labor Statistics’ measure of changes in prices paid by urban consumers. TIPS and I bonds are tied to it (CPI-U).',
  },
  {
    id: 'marketable',
    term: 'Marketable securities',
    group: 'Treasury securities',
    short: 'Treasury securities that can be bought and sold after issue: bills, notes, bonds, TIPS and FRNs.',
    related: ['nonmarketable', 'secondary-market'],
  },
  {
    id: 'nonmarketable',
    term: 'Nonmarketable securities',
    group: 'Treasury securities',
    short:
      'Treasury debt that can’t be resold, such as savings bonds and the special securities held by federal trust funds.',
    related: ['marketable', 'intragovernmental'],
  },
  {
    id: 'cusip',
    term: 'CUSIP',
    group: 'Treasury securities',
    short: 'A nine-character code that identifies a specific security, like a serial number for a bond.',
  },
  {
    id: 'treasurydirect',
    term: 'TreasuryDirect',
    group: 'Treasury securities',
    short:
      'Treasury’s own website for buying securities directly from the government, with no fees. It’s the only place to buy electronic savings bonds.',
  },
  {
    id: 'full-faith-and-credit',
    term: 'Full faith and credit',
    group: 'Treasury securities',
    short:
      'The U.S. government’s pledge to repay its debt, backed by its power to tax and borrow. It is why Treasuries are considered to have very low default risk.',
    related: ['credit-risk'],
  },

  {
    id: 'auction',
    term: 'Treasury auction',
    group: 'Auctions',
    short:
      'How Treasury sells new marketable securities. Investors submit bids, and the auction sets the yield or rate for everyone.',
    related: ['single-price-auction', 'competitive-bid', 'noncompetitive-bid'],
  },
  {
    id: 'single-price-auction',
    term: 'Single-price auction',
    group: 'Auctions',
    short:
      'An auction where every winning bidder gets the same terms: the highest yield needed to sell the full amount offered.',
    related: ['high-yield'],
  },
  {
    id: 'competitive-bid',
    term: 'Competitive bid',
    group: 'Auctions',
    short:
      'A bid that names the yield or rate the bidder will accept. It may be filled in full, in part, or not at all, and is typically placed by large institutions.',
    related: ['noncompetitive-bid'],
  },
  {
    id: 'noncompetitive-bid',
    term: 'Noncompetitive bid',
    group: 'Auctions',
    short:
      'A bid that agrees to accept whatever yield the auction sets, and is guaranteed to be filled (up to $10 million). Individuals buying through TreasuryDirect bid this way.',
    related: ['competitive-bid'],
  },
  {
    id: 'high-yield',
    term: 'High yield (auction)',
    group: 'Auctions',
    short:
      'The highest yield Treasury accepted at an auction. Because auctions are single-price, all winning bidders receive it. For bills it’s quoted as the high rate.',
  },
  {
    id: 'bid-to-cover',
    term: 'Bid-to-cover ratio',
    group: 'Auctions',
    short:
      'Dollars bid divided by dollars sold. A ratio of 2.6 means investors asked for 2.6 times what Treasury offered.',
  },
  {
    id: 'primary-dealer',
    term: 'Primary dealer',
    group: 'Auctions',
    short:
      'One of a couple of dozen banks and securities firms that trade directly with the Federal Reserve Bank of New York and are expected to bid in every Treasury auction.',
  },
  {
    id: 'direct-bidder',
    term: 'Direct bidder',
    group: 'Auctions',
    short:
      'An investor, such as a fund or a company, that submits a competitive bid straight to Treasury for its own account instead of going through a dealer.',
  },
  {
    id: 'indirect-bidder',
    term: 'Indirect bidder',
    group: 'Auctions',
    short:
      'An investor whose competitive bid is placed through an intermediary, such as a primary dealer. Foreign central banks bidding through the Federal Reserve Bank of New York are counted here.',
  },
  {
    id: 'reopening',
    term: 'Reopening',
    group: 'Auctions',
    short:
      'An auction of more of an existing security, with the same CUSIP, maturity date and coupon, rather than a brand-new one.',
  },
  {
    id: 'discount-rate',
    term: 'Discount rate (bank discount)',
    group: 'Auctions',
    short:
      'How bill rates are traditionally quoted: the discount from face value as an annual percentage of face value, using a 360-day year.',
    related: ['investment-rate'],
  },
  {
    id: 'investment-rate',
    term: 'Investment rate',
    group: 'Auctions',
    short:
      'A bill’s yield expressed so it can be compared with notes, bonds and savings accounts: based on the price you pay and a 365-day year. Also called the coupon-equivalent yield.',
    related: ['discount-rate'],
  },

  {
    id: 'public-debt',
    term: 'Total public debt outstanding',
    group: 'Public debt',
    short:
      'All federal debt issued by Treasury and not yet repaid: debt held by the public plus intragovernmental holdings.',
    related: ['debt-held-by-public', 'intragovernmental'],
  },
  {
    id: 'debt-held-by-public',
    term: 'Debt held by the public',
    group: 'Public debt',
    short:
      'Federal debt owned by anyone other than federal government accounts: individuals, companies, state and local governments, the Federal Reserve and foreign investors.',
  },
  {
    id: 'intragovernmental',
    term: 'Intragovernmental holdings',
    group: 'Public debt',
    short:
      'Federal debt held by government trust funds and accounts, such as the Social Security trust funds, which invest their surpluses in special Treasury securities.',
  },
  {
    id: 'deficit',
    term: 'Deficit',
    group: 'Public debt',
    short:
      'The amount by which spending exceeds revenue in a single year. Borrowing to cover deficits is what adds to the debt over time.',
    related: ['public-debt'],
  },
  {
    id: 'debt-limit',
    term: 'Debt limit',
    group: 'Public debt',
    short:
      'The maximum amount of debt Congress allows Treasury to have outstanding. It doesn’t authorize new spending; it allows borrowing to pay for spending Congress already approved.',
  },

  {
    id: 'municipal-bond',
    term: 'Municipal bond (muni)',
    group: 'State and local',
    short:
      'A bond issued by a state, city, county, school district or public agency to pay for things like roads, schools and water systems.',
    related: ['general-obligation', 'revenue-bond'],
  },
  {
    id: 'general-obligation',
    term: 'General obligation bond',
    group: 'State and local',
    short: 'A municipal bond backed by the issuer’s general taxing power rather than a specific revenue source.',
    related: ['revenue-bond'],
  },
  {
    id: 'revenue-bond',
    term: 'Revenue bond',
    group: 'State and local',
    short:
      'A municipal bond repaid from a specific project’s income, such as tolls, water bills or airport fees, not from general taxes.',
  },
  {
    id: 'private-activity-bond',
    term: 'Private activity bond',
    group: 'State and local',
    short:
      'A municipal bond whose proceeds mainly benefit private businesses or projects. Interest on some of them counts toward the alternative minimum tax (AMT).',
  },
  {
    id: 'credit-rating',
    term: 'Credit rating',
    group: 'State and local',
    short:
      'A rating agency’s opinion of how likely a borrower is to repay, from AAA down. Ratings are opinions, not guarantees.',
  },
  {
    id: 'emma',
    term: 'EMMA',
    group: 'State and local',
    short:
      'The Municipal Securities Rulemaking Board’s free website for municipal bond documents, disclosures and trade prices.',
  },

  {
    id: 'hysa',
    term: 'High-yield savings account (HYSA)',
    group: 'Savings and taxes',
    short:
      'A bank savings account paying more than the typical rate. The rate is variable and can change at any time.',
    related: ['apy', 'fdic'],
  },
  {
    id: 'apy',
    term: 'APY',
    group: 'Savings and taxes',
    short:
      'Annual percentage yield: what a deposit earns in a year including compounding. Banks must quote it so accounts can be compared.',
  },
  {
    id: 'fdic',
    term: 'FDIC insurance',
    group: 'Savings and taxes',
    short:
      'Federal protection for bank deposits, up to $250,000 per depositor, per insured bank, for each account ownership category.',
  },
  {
    id: 'state-tax-exemption',
    term: 'State tax exemption',
    group: 'Savings and taxes',
    short:
      'Interest on Treasury securities and savings bonds is exempt from state and local income taxes, though it is subject to federal income tax.',
    related: ['tax-equivalent-yield'],
  },
  {
    id: 'tax-equivalent-yield',
    term: 'Tax-equivalent yield',
    group: 'Savings and taxes',
    short:
      'The fully taxable yield you’d need to match a tax-advantaged one after taxes. A tax-free 3% is worth 4.62% to someone paying 35% on interest.',
  },
  {
    id: 'tax-deferral',
    term: 'Tax deferral',
    group: 'Savings and taxes',
    short:
      'Postponing tax on income until later. Savings bond interest isn’t federally taxed until you cash the bond in or it stops earning interest, unless you choose to report it yearly.',
  },
  {
    id: 'education-exclusion',
    term: 'Education savings bond exclusion',
    group: 'Savings and taxes',
    short:
      'A federal rule that can make I and EE bond interest tax-free when used for qualified higher-education costs, subject to income limits and other conditions (IRS Form 8815).',
  },
  {
    id: 'salt-cap',
    term: 'SALT deduction',
    group: 'Savings and taxes',
    short:
      'The federal itemized deduction for state and local taxes, which is capped. This site’s examples ignore it, which slightly overstates the state-tax advantage for people who can deduct state tax.',
  },

  {
    id: 'funded-debt',
    term: 'Funded debt',
    group: 'History',
    short:
      'Debt backed by a specific tax that the law sets aside to pay its interest, so lenders know exactly where their payments will come from.',
    long: 'Britain’s Parliament funded its war loans this way from the 1690s. Hamilton’s 1790 plan did the same, pledging customs duties and, later, excise taxes to the new federal securities.',
    related: ['sinking-fund', 'excise'],
  },
  {
    id: 'sinking-fund',
    term: 'Sinking fund',
    group: 'History',
    short: 'Money set aside on a schedule to buy back or repay debt over time, so the debt “sinks” instead of piling up.',
    long: 'Britain created one in 1717 on a plan by Robert Walpole. Congress created the U.S. Sinking Fund Commission in August 1790, and Hamilton used its purchases to steady the market in 1791 and 1792.',
    related: ['funded-debt', 'lender-of-last-resort'],
  },
  {
    id: 'consol',
    term: 'Consol',
    group: 'History',
    short:
      'A British government bond with no maturity date. It paid interest indefinitely, and the government could buy it back whenever it chose.',
    long: 'Short for “consolidated annuities”: in the early 1750s many separate government loans were merged into a single stock paying 3 percent. Consols traded for more than two and a half centuries; the last were repaid in 2015.',
    related: ['funded-debt', 'maturity'],
  },
  {
    id: 'assumption',
    term: 'Assumption',
    group: 'History',
    short:
      'The federal government’s takeover of the states’ Revolutionary War debts in 1790, so creditors looked to the nation rather than to thirteen separate treasuries.',
    long: 'The Funding Act of 1790 authorized up to $21.5 million of state debt to be assumed. States that had already paid down their debts, such as Virginia, opposed it.',
    related: ['discrimination'],
  },
  {
    id: 'discrimination',
    term: 'Discrimination (1790)',
    group: 'History',
    short:
      'James Madison’s proposal to split payment on old war debt between its original holders, such as soldiers, and the buyers who had since bought it cheaply. Congress rejected it.',
    long: 'Hamilton argued that whoever held a security should be paid in full, because a government that rewrote its promises after the fact would struggle to borrow again.',
    related: ['assumption'],
  },
  {
    id: 'continental-currency',
    term: 'Continental currency',
    group: 'History',
    short:
      'Paper money printed by the Continental Congress to pay for the Revolutionary War. So much was issued that by 1780 it was nearly worthless.',
    long: 'The collapse gave rise to the phrase “not worth a Continental.” The Funding Act of 1790 exchanged the remaining bills for new securities at one dollar for every hundred.',
    related: ['specie'],
  },
  {
    id: 'specie',
    term: 'Specie',
    group: 'History',
    short: 'Gold and silver coin, as opposed to paper money or IOUs. In the 18th century, a promise to pay was only as good as the specie behind it.',
  },
  {
    id: 'excise',
    term: 'Excise tax',
    group: 'History',
    short:
      'A tax on a particular good produced at home, such as whiskey, as opposed to a customs duty on imports.',
    long: 'Hamilton’s 1791 excise on distilled spirits helped pay interest on the federal debt. Resistance to it in western Pennsylvania became the Whiskey Rebellion of 1794.',
    related: ['funded-debt'],
  },
  {
    id: 'lender-of-last-resort',
    term: 'Lender of last resort',
    group: 'History',
    short:
      'An institution that steps in during a financial panic to buy securities or lend freely, so that sound borrowers aren’t ruined by a sudden rush for cash.',
    long: 'Today central banks such as the Federal Reserve play this role. Hamilton did something similar in the Panic of 1792, using sinking-fund money to buy federal securities and backing the Bank of New York’s lending.',
    related: ['sinking-fund'],
  },
]

export const GLOSSARY_BY_ID = Object.fromEntries(GLOSSARY.map((g) => [g.id, g]))

export const GLOSSARY_GROUPS = [
  'Basics',
  'Yields and pricing',
  'Treasury securities',
  'Auctions',
  'Public debt',
  'State and local',
  'Savings and taxes',
  'History',
]
