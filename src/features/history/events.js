export const TRACKS = {
  britain: { label: 'Britain', dot: 'bg-series-savings', text: 'text-series-savings' },
  us: { label: 'United States', dot: 'bg-series-treasury', text: 'text-series-treasury' },
}

export const FIRST_YEAR = 1670
export const LAST_YEAR = 1800

export const EVENTS = [
  {
    year: 1672,
    track: 'britain',
    title: 'The Stop of the Exchequer',
    body: 'Charles II suspends repayment of loans from London’s goldsmith bankers, ruining several of them. Royal debt is the king’s personal promise, and he can break it.',
  },
  {
    year: 1688,
    track: 'britain',
    title: 'The Glorious Revolution',
    body: 'Parliament invites William of Orange and his wife Mary to take the throne on its terms, and it now controls taxation. Loans to the government become loans backed by Parliament, not by one monarch.',
  },
  {
    year: 1693,
    track: 'britain',
    title: 'Parliament borrows long-term',
    body: 'To pay for war with France, Parliament’s Million Act sets out to raise £1 million through a tontine, with interest secured on new excise duties. Long-term, tax-backed borrowing begins.',
  },
  {
    year: 1694,
    track: 'britain',
    title: 'The Bank of England is founded',
    body: 'Investors subscribe £1.2 million and lend it to the government at 8 percent, in return for a charter as a bank. It becomes the government’s banker.',
  },
  {
    year: 1717,
    track: 'britain',
    title: 'Walpole’s sinking fund',
    body: 'Parliament adopts Robert Walpole’s plan to set aside surplus tax revenue each year to pay down the debt, a device Hamilton would later copy.',
  },
  {
    year: 1720,
    track: 'britain',
    title: 'The South Sea Bubble',
    body: 'The South Sea Company swaps its shares for government debt, and the shares soar and then collapse. The debt itself survives, and Parliament keeps paying it.',
  },
  {
    year: 1751,
    track: 'britain',
    title: 'Consols are created',
    body: 'Henry Pelham’s government merges many separate loans into a single 3 percent stock with no maturity date: the consolidated annuities, or consols.',
  },
  {
    year: 1763,
    track: 'britain',
    title: 'The Seven Years’ War ends',
    body: 'Britain wins, and its national debt nearly doubles. Parliament looks to the American colonies to help pay for their defense.',
  },
  {
    year: 1765,
    track: 'britain',
    title: 'The Stamp Act',
    body: 'A tax on printed paper in the colonies sets off protests over taxation without representation. Britain repeals it the next year, but the quarrel over who may tax Americans continues.',
  },
  {
    year: 1775,
    track: 'us',
    title: 'Continental currency',
    body: 'The Continental Congress, which cannot tax, starts printing paper money to pay for the war. Repeated issues drive its value toward zero.',
  },
  {
    year: 1778,
    track: 'us',
    title: 'France joins the war',
    body: 'An alliance with France brings troops, ships and, over the following years, loans to the American government.',
  },
  {
    year: 1781,
    track: 'us',
    title: 'Robert Morris takes charge',
    body: 'Congress names the Philadelphia merchant Robert Morris Superintendent of Finance. He cuts costs, pays suppliers in notes backed by his own credit, and wins a charter for the Bank of North America.',
  },
  {
    year: 1782,
    track: 'us',
    title: 'A Dutch loan',
    body: 'John Adams, the American envoy in the Netherlands, arranges a 5 million guilder loan at 5 percent with Amsterdam bankers, giving the United States a foothold in Europe’s biggest market for government debt.',
  },
  {
    year: 1786,
    track: 'us',
    title: 'Shays’ Rebellion',
    body: 'Massachusetts farmers, squeezed by heavy taxes levied to pay the state’s war debt, close courts to stop foreclosures. The unrest helps push the states toward a new constitution.',
  },
  {
    year: 1787,
    track: 'us',
    title: 'The Constitution',
    body: 'The new framework lets Congress levy taxes and pay the debts, and Article VI declares the old Confederation debts valid against the new government.',
  },
  {
    year: 1786,
    track: 'britain',
    title: 'Pitt’s sinking fund',
    body: 'After losing the American war, with its debt near £240 million, Britain sets aside £1 million a year to buy back its debt.',
  },
  {
    year: 1789,
    track: 'us',
    title: 'Hamilton takes office',
    body: 'Congress creates the Treasury Department on September 2. Nine days later President Washington appoints Alexander Hamilton the first Secretary of the Treasury.',
  },
  {
    year: 1790,
    track: 'us',
    title: 'The Funding Act',
    body: 'Hamilton’s Report on Public Credit reaches Congress in January. In August, after the Compromise of 1790, the Funding Act exchanges the old debts, including the states’, for new federal securities.',
  },
  {
    year: 1791,
    track: 'us',
    title: 'A national bank and a whiskey tax',
    body: 'President Washington signs the bill creating the Bank of the United States, and Congress taxes distilled spirits to help pay interest on the debt.',
  },
  {
    year: 1792,
    track: 'us',
    title: 'The Panic of 1792',
    body: 'When speculator William Duer collapses, Hamilton buys federal securities with sinking-fund money and backs the Bank of New York’s lending. The panic passes within weeks.',
  },
  {
    year: 1794,
    track: 'us',
    title: 'The Whiskey Rebellion',
    body: 'Farmers in western Pennsylvania take up arms against the whiskey excise. President Washington sends about 13,000 militiamen west, riding with them part of the way, and the uprising collapses without a battle.',
  },
  {
    year: 1795,
    track: 'us',
    title: 'Hamilton resigns',
    body: 'Before leaving at the end of January, Hamilton sends Congress a plan for paying off the whole debt over the coming decades.',
  },
  {
    year: 1800,
    track: 'us',
    title: 'A creditworthy republic',
    body: 'Federal debt stands at about $83 million, but U.S. securities now trade in Amsterdam and London alongside European governments’ bonds. Thomas Jefferson wins the presidential election promising to pay the debt down.',
  },
].sort((a, b) => a.year - b.year || a.track.localeCompare(b.track))
