import { Link } from 'react-router-dom'
import { Term } from '@/components/ui/Term.jsx'
import { DebtHistoryChart, OwnershipChart } from '@/features/data-desk/DebtCharts.jsx'
import { DebtNow } from '@/features/debt/DebtNow.jsx'
import { Prose, Takeaways, Wide } from './ChapterLayout.jsx'

export default function PublicDebt() {
  return (
    <>
      <Prose>
        <p className="!text-lede text-muted">
          Every year the federal government collects money, mostly through taxes, and spends money on everything from Social
          Security to defense. When it spends more than it collects, it borrows the difference.
        </p>
        <p>
          The shortfall in a single year is the <Term id="deficit">deficit</Term>. The <Term id="public-debt">debt</Term> is
          the running total: everything borrowed over the years and not yet repaid. A deficit adds to the debt; a surplus, which
          the United States last ran in 2001, can shrink it.
        </p>
        <p>
          The government borrows by selling <Term id="treasury-security">Treasury securities</Term>. Each is a promise to repay a
          set amount on a set date, usually with interest along the way. When you buy one, you are lending to the United States.
        </p>
      </Prose>

      <Wide>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center lg:gap-14">
          <div className="lg:ml-[8.33%]">
            <h2 className="font-serif text-title text-fg">The debt today</h2>
            <p className="mt-3 text-[1rem] leading-relaxed text-muted">
              Treasury publishes the total every business day, to the penny. Two very different kinds of lender hold it.
            </p>
          </div>
          <DebtNow />
        </div>
      </Wide>

      <Prose>
        <h2>Two kinds of debt</h2>
        <p>
          <strong>Debt held by the public</strong> is owed to lenders outside the federal government: individuals, banks,
          pension and mutual funds, state and local governments, the Federal Reserve, and foreign investors and governments.
          This is the debt that competes for the world’s savings and whose interest leaves the government’s books.
        </p>
        <p>
          <strong>Intragovernmental holdings</strong> are what the government owes itself. Programs like Social Security and
          Medicare collect dedicated taxes, and when those exceed what a program pays out, the trust fund must invest the surplus
          in special nonmarketable Treasury securities. When the program later needs the money, Treasury redeems them, which it
          funds from other revenue or new borrowing.
        </p>
      </Prose>

      <Wide>
        <OwnershipChart />
      </Wide>

      <Prose>
        <h2>How the debt got here</h2>
        <p>
          The national debt is older than the Constitution. The United States won its independence on borrowed money: loans
          from France and the Netherlands, and IOUs handed to soldiers, farmers and merchants. By the late 1780s much of that
          paper was in default, and it traded for a fraction of its face value.
        </p>
        <p>
          Alexander Hamilton, the first Secretary of the Treasury, set out to fix that. His <em>Report on Public Credit</em>,
          sent to Congress in January 1790, made three proposals that still shape how the country borrows:
        </p>
        <ul>
          <li>
            <strong>Pay in full.</strong> The federal government would honor its old debts at face value, including to buyers
            who had picked them up cheaply, because a government that picked and chose whom to repay would struggle to borrow
            again.
          </li>
          <li>
            <strong>Take on the states’ debts.</strong> The federal government would assume the war debts of the states, so
            creditors would look to the nation rather than thirteen separate treasuries.
          </li>
          <li>
            <strong>Fund it with dedicated revenue.</strong> Old certificates would be exchanged for new federal securities, with
            interest paid on time out of import duties and, later, excise taxes.
          </li>
        </ul>
        <p>
          The plan was fiercely contested. States such as Virginia, which had already paid down much of their debt, objected to
          covering everyone else’s. The deadlock broke in the summer of 1790, in a bargain struck with Thomas Jefferson and James
          Madison: Hamilton got assumption, and the South got the nation’s permanent capital on the Potomac. Congress passed the
          Funding Act that August.
        </p>
        <p>
          The result was the first U.S. government debt as we would recognize it, and a reputation for paying on time that made
          later borrowing cheaper. Hamilton saw the debt as a tool as well as a burden: securities the public trusted could
          circulate like money and bind lenders’ interests to the new government’s success.
        </p>
        <p>
          Since then the debt has risen sharply in wartime and in recessions, when tax receipts fall and spending on programs
          like unemployment insurance rises, and has fallen or grown slowly in between.
        </p>
      </Prose>

      <Wide>
        <DebtHistoryChart />
      </Wide>

      <Prose>
        <p>
          A big number on its own says little. Economists usually compare debt with the size of the economy (gross domestic
          product), because a larger economy can carry more debt, much as a larger income can support a larger mortgage. They
          disagree, sometimes sharply, about how much is too much. What can be measured precisely is what the debt costs to carry,
          which is the subject of <Link to="/learn/borrowing-and-the-economy">chapter 5</Link>.
        </p>
        <h2>Not only Washington</h2>
        <p>
          States, cities, counties and school districts borrow too, mostly to build long-lived things like roads, schools and
          water systems. They issue <Term id="municipal-bond">municipal bonds</Term>, which differ from Treasuries in who backs
          them and how they’re taxed. Most states must balance their operating budgets, so their borrowing is mainly for capital
          projects. <Link to="/state-local">More on state and local debt</Link>.
        </p>
      </Prose>

      <Takeaways
        items={[
          'A deficit is one year’s shortfall; the debt is the accumulated total of borrowing not yet repaid.',
          'The government borrows by selling Treasury securities, which are loans you can make to the United States.',
          'About four-fifths of the debt is held by the public; the rest is owed to federal trust funds.',
          'States and localities borrow separately, mostly for infrastructure, through municipal bonds.',
        ]}
      />
    </>
  )
}
