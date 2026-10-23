import { Link } from 'react-router-dom'
import { Term } from '@/components/ui/Term.jsx'
import { AverageRatesChart, CompositionChart, InterestExpenseChart } from '@/features/data-desk/DebtCharts.jsx'
import { DebtLimit } from '@/features/debt/DebtLimit.jsx'
import { Prose, Takeaways, Wide } from './ChapterLayout.jsx'

export default function BorrowingAndEconomy() {
  return (
    <>
      <Prose>
        <p className="!text-lede text-muted">
          Federal borrowing has a price, paid in interest every year, and it shapes interest rates across the economy. This
          chapter looks at both.
        </p>
        <h2>Why governments borrow</h2>
        <p>Governments borrow for three broad reasons:</p>
        <ul>
          <li>
            <strong>To cover deficits</strong>, when spending exceeds revenue for the year. This is most federal borrowing.
          </li>
          <li>
            <strong>To manage timing.</strong> Tax receipts arrive in lumps (around April 15, for example) while bills arrive
            every day. Treasury uses short-term bills, including occasional cash management bills, to smooth the gaps.
          </li>
          <li>
            <strong>To build things that last.</strong> States and cities borrow to spread the cost of a bridge or a school over
            the decades people will use it.
          </li>
        </ul>
        <p>
          Treasury rarely pays debt down in aggregate. As securities mature, it repays them, typically by issuing new ones. So
          the government is always refinancing, and what it pays depends on interest rates at the time.
        </p>

        <h2>The interest bill</h2>
        <p>
          Interest on the debt is spending like any other. It grows when the debt grows, and when rates rise as older, cheaper
          securities are replaced by new ones at higher yields.
        </p>
      </Prose>

      <Wide>
        <InterestExpenseChart />
      </Wide>

      <Prose>
        <p>
          The average rate the government pays across everything it owes changes slowly, because a 10-year note issued years ago
          still carries the coupon set back then. Bills are the exception: they’re refinanced within a year, so that part of the
          interest bill responds quickly to the Federal Reserve.
        </p>
      </Prose>

      <Wide>
        <div className="grid gap-8 xl:grid-cols-2">
          <AverageRatesChart />
          <CompositionChart />
        </div>
      </Wide>

      <Prose>
        <h2>Treasuries as the benchmark</h2>
        <p>
          Because Treasuries carry very little <Term id="credit-risk">default risk</Term> and trade in enormous volume, their
          yields serve as the baseline for other borrowing. A company or a city pays the Treasury yield for a similar maturity,
          plus extra for its own risk. Banks hold Treasuries as easy-to-sell reserves, and investors around the world use them as
          collateral and a place to park cash. When Treasury yields move, mortgage, car-loan and savings rates tend to follow.
        </p>
        <h2>The Federal Reserve’s role</h2>
        <p>
          The Federal Reserve, the central bank, holds a large amount of Treasury debt. By law it buys Treasuries in the open
          market, from investors, rather than lending to the Treasury directly (it does replace its own maturing holdings at
          auction). It buys and sells Treasuries, and sets the rates it pays banks, to steer short-term
          interest rates. That makes it one of the biggest influences on bill yields, and through them on what the government pays
          to borrow.
        </p>
        <h2>The debt limit</h2>
        <p>
          Congress sets a ceiling on how much debt Treasury may have outstanding, the <Term id="debt-limit">debt limit</Term>. It
          doesn’t control spending or taxes, which Congress sets separately; it limits Treasury’s ability to borrow to pay for
          what has already been approved. When debt nears the limit, Treasury uses accounting steps, often called extraordinary
          measures, to keep paying the government’s bills until Congress raises or suspends it.
        </p>
      </Prose>

      <Wide>
        <DebtLimit />
      </Wide>

      <Prose>
        <h2>Open questions</h2>
        <p>
          How much debt is sustainable, and what should be done about it, are political questions this site doesn’t try to settle.
          The numbers here (what’s owed, to whom, and at what cost) are where an informed answer starts. The{' '}
          <Link to="/data">data desk</Link> keeps them current, and <Link to="/explore">explore</Link> searches what state and
          local governments publish about their own budgets.
        </p>
      </Prose>

      <Takeaways
        items={[
          'Most federal borrowing covers deficits; states and cities mostly borrow to build infrastructure.',
          'The government continually refinances maturing debt, so its interest cost follows market rates over time.',
          'Treasury yields are the benchmark that other borrowing costs are priced from.',
          'The debt limit caps borrowing for spending Congress has already approved; it isn’t a budget.',
        ]}
      />
    </>
  )
}
