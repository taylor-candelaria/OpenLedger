import { Link } from 'react-router-dom'
import { Surface } from '@/components/ui/Surfaces.jsx'
import { Term } from '@/components/ui/Term.jsx'
import { DebtTimeline } from '@/features/history/DebtTimeline.jsx'
import { Prose, Takeaways, Wide } from './ChapterLayout.jsx'

const TOOLKIT = [
  {
    tool: 'Debt backed by dedicated taxes',
    britain: 'From the 1690s Parliament earmarked specific excise and customs revenue to pay the interest on each loan.',
    us: 'The Funding Act of 1790 pledged customs duties to the new federal securities; the whiskey excise followed in 1791.',
  },
  {
    tool: 'A national bank',
    britain: 'The Bank of England (1694) lent to the government, kept its accounts and recorded who owned its debt.',
    us: 'The Bank of the United States (1791) lent to the government and held its money, and investors could pay for most of their shares with federal securities.',
  },
  {
    tool: 'A sinking fund',
    britain: 'Walpole set one up in 1717, and Pitt created a new one in 1786 after the American war.',
    us: 'Congress created the Sinking Fund Commission in 1790 to buy back debt, and Hamilton used it to calm the markets in 1791 and 1792.',
  },
  {
    tool: 'Securities anyone could trade',
    britain: 'Consols changed hands every day in London, so lenders knew they could sell if they needed their money back.',
    us: 'The new federal stock traded in New York, Philadelphia and Boston, and soon in Amsterdam and London too.',
  },
]

export default function HistoryOfPublicDebt() {
  return (
    <>
      <Prose>
        <p className="!text-lede text-muted">
          Governments have borrowed for as long as there have been governments. What is new, historically speaking, is borrowing
          that lenders trust: debt the state pays on time, decade after decade, so that it can borrow a great deal at low interest.
          That idea took shape in Britain in the 1690s, and a century later Alexander Hamilton rebuilt it for the United States.
        </p>

        <h2>Before national debt</h2>
        <p>
          For most of history, government borrowing was the ruler’s personal business. Kings borrowed from bankers and merchants
          against future taxes or the crown jewels, and repaid when they could, or when they chose. In the 1330s and 1340s Edward
          III of England borrowed heavily from the great Florentine banking houses of the Bardi and the Peruzzi to fight France;
          his failure to repay helped bring both firms down.
        </p>
        <p>
          Lenders priced that risk in. Loans to monarchs were short-term, expensive and often secured on something a creditor
          could seize, such as jewels or the right to collect a particular tax. England’s Charles II showed why lenders were
          wary: in 1672 his “Stop of the Exchequer” halted repayment of the Crown’s debts to London’s goldsmith bankers, and
          several of them were ruined.
        </p>
        <p>
          A different model was already working across the North Sea. The provinces of the Dutch Republic were run largely by
          the same wealthy merchant families who lent to them, and they sold long-term bonds backed by specific taxes and paid
          the interest reliably. By the mid-1600s the province of Holland could borrow at around 4 percent, far less than any
          king.
        </p>

        <h2>Britain’s financial revolution</h2>
        <p>
          In 1688 the Dutch model crossed to England with a Dutch prince. Parliament invited William of Orange, ruler of the Dutch
          Republic, and his wife Mary, daughter of the deposed King James II, to take the English throne on its terms. The Bill
          of Rights of 1689 confirmed that the Crown could not raise taxes without Parliament’s consent. From then on, a loan
          approved by Parliament was backed by taxes Parliament itself had voted: an obligation of the nation rather than a favor
          from the king. In 1989 the economists Douglass North and Barry Weingast argued that this was the turning point:
          lenders could finally believe the government’s promise to pay.
        </p>
        <p>
          William brought a war with him. The Nine Years’ War (1688–97) against Louis XIV’s France cost far more than England’s
          ordinary revenue could cover, and Parliament experimented to pay for it. The Million Act of 1693 set out to raise £1
          million through a tontine, a pool of annuities whose surviving members inherited the payments of those who died, with
          the interest secured on new excise duties. A state lottery followed in 1694. The same year a group of investors
          subscribed £1.2 million, lent it to the government at 8 percent, and in return received a charter to operate as a bank:
          the Bank of England.
        </p>
        <p>
          The pattern that emerged is called <Term id="funded-debt">funded debt</Term>. Each loan came with a specific tax set
          aside to pay its interest, so lenders knew where their money would come from. Britain paid, war after war, and the
          price of borrowing fell: a government that paid 8 percent or more in the 1690s was paying about 3 percent by the 1750s.
        </p>
        <p>
          It was not all smooth. In 1717 Parliament adopted a <Term id="sinking-fund">sinking fund</Term> devised by Robert
          Walpole, later Britain’s first prime minister: surplus tax revenue set aside each year to pay the debt down. Later
          governments often raided it for day-to-day spending, but the principle stuck. Then came a crisis. The South Sea Company,
          founded in 1711 to take over part of the government’s debt in exchange for trading privileges, persuaded holders of
          government annuities in 1720 to swap them for its shares. The shares soared and then collapsed, ruining many investors
          in the South Sea Bubble. Yet the government never walked away from the underlying debt, and Parliament kept paying it.
        </p>
        <p>
          Henry Pelham, prime minister from 1743 to 1754, tidied the debt up. In 1749 and 1750 he persuaded the holders of most
          of it to accept a lower rate, stepping down from 4 percent to 3 percent by 1757. In 1751 many separate loans were
          merged into a single 3 percent stock with no repayment date: the consolidated annuities, or{' '}
          <Term id="consol">consols</Term>. Ownership was recorded at the Bank of England, which made consols easy to buy and
          sell, and they became the standard investment of the age.
        </p>
        <p>
          Cheap, trusted credit was a weapon. France had roughly three times Britain’s population, but its kings paid higher
          interest and repeatedly failed to pay what they owed. Britain could outspend it in war after war. The historian John
          Brewer called the result a “fiscal-military state”: high taxes, a professional tax service, a huge debt and the
          confidence to keep carrying it.
        </p>
        <p>
          That confidence had a cost. The Seven Years’ War (1756–63) nearly doubled the debt, to about £130 million. Parliament
          decided the American colonies should help pay for their own defense, and in 1765 passed the Stamp Act, a tax on printed
          paper in the colonies. The colonists answered with the same principle Parliament had once asserted against its own
          kings: no taxation without representation. The American War of Independence (1775–83) added roughly another £100
          million to Britain’s debt, and in 1786 the prime minister, William Pitt the Younger, set up a new sinking fund that put
          aside £1 million a year to buy it back.
        </p>

        <h2>Paying for the Revolution</h2>
        <p>
          The Continental Congress went to war without the one power that had made British borrowing work: it could not tax.
          Neither at first nor under the Articles of Confederation, which took effect in 1781, could it collect money on its own.
          It could only ask the states for contributions, called requisitions, which they often ignored.
        </p>
        <p>
          So Congress printed money. It issued more than $200 million in paper bills between 1775 and 1779, and their value
          collapsed; by 1780 Congress itself valued them at 40 paper dollars to one silver dollar.{' '}
          <Term id="continental-currency">Continental currency</Term> gave the language the phrase “not worth a Continental.”
          Congress also borrowed from Americans through loan certificates, and paid farmers, suppliers and soldiers in IOUs of
          every kind. With no tax revenue behind them, those promises traded for a small fraction of their face value.
        </p>
        <p>
          Abroad, France supplied gifts and loans, especially after it entered the war as an American ally in 1778. In 1782 John
          Adams, then the American envoy in the Netherlands, persuaded three Amsterdam banking houses to raise a loan of 5 million
          guilders at 5 percent. It was the first of a series of Dutch loans, and gave the United States a foothold in Europe’s
          biggest market for government debt.
        </p>
        <p>
          In 1781 Congress named the Philadelphia merchant Robert Morris Superintendent of Finance. He cut costs, paid suppliers in
          notes backed by his own credit, and won a charter for the Bank of North America. He also pushed for a federal 5 percent
          duty on imports, which would have given Congress its first income of its own. Because it changed the Articles, every
          state had to agree; Rhode Island refused, and a second attempt was later blocked by New York. Interest on the debt went
          unpaid.
        </p>
        <p>
          The consequences were political. In 1783 unpaid Continental Army officers at Newburgh, New York, talked of defying
          Congress until their commander, General George Washington, persuaded them to stand down. In 1786 and 1787 farmers in
          central and western Massachusetts, crushed by the taxes the state levied to pay its own war debt, shut down courts to
          stop foreclosures in what became known as Shays’ Rebellion.
        </p>
        <p>
          The Constitution, written in 1787, fixed the underlying problem: a national government that owed money but had no
          reliable way to raise it. Article I gave Congress the power “to lay and collect Taxes, Duties, Imposts and Excises, to
          pay the Debts” of the United States. Article VI declared that debts contracted before the Constitution “shall be as
          valid against the United States under this Constitution, as under the Confederation.” What remained was to decide how,
          and how much, to pay.
        </p>
      </Prose>

      <Wide>
        <DebtTimeline />
      </Wide>

      <Prose>
        <h2>Hamilton at the Treasury</h2>
        <p>
          Alexander Hamilton had been thinking about public credit for years. Born in the West Indies, he had clerked for a
          trading house on St. Croix as a teenager, then served for four years as an aide to General Washington. In 1781 he
          wrote to Robert Morris that “a national debt if it is not excessive will be to us a national blessing,” one that would
          help bind the states together. He studied British finance closely, and co-wrote the <em>Federalist</em> essays that
          argued for the new Constitution.
        </p>
        <p>
          Congress created the Treasury Department on September 2, 1789, and President Washington appointed Hamilton its first
          Secretary nine days later. Ten days after that, the House of Representatives asked him for a plan to restore the
          government’s credit.
        </p>

        <h3>The Report on Public Credit</h3>
        <p>
          Hamilton’s answer, dated January 9, 1790 and delivered to Congress on January 14, began with an accounting. The federal
          government owed about $11.7 million abroad, mostly to the French government and Dutch lenders, and about $42.4 million
          at home, counting unpaid interest: some $54.1 million in all. The states owed roughly $25 million more.
        </p>
        <p>
          The debt, he wrote, “was the price of liberty,” and the nation had repeatedly pledged its good faith to repay it. He
          proposed to pay it in full, with interest, from duties on imports such as wine, spirits, tea and coffee, and a tax on
          spirits distilled at home. Creditors would trade in their old certificates for new federal securities. He also insisted
          on a principle he hoped would become “a fundamental maxim” of American finance: “that the creation of debt should always
          be accompanied with the means of extinguishment.” In other words, every time the government borrowed, it should also
          plan how to repay.
        </p>
        <p>
          Two proposals set off a fight. The first concerned who should be paid. Much of the domestic debt had changed hands:
          soldiers and farmers who needed cash had sold their certificates cheaply, often to speculators, some of whom had bought
          up certificates expecting the new government to honor them. James Madison, Hamilton’s co-author on the{' '}
          <em>Federalist</em> and now a leader in the House, proposed <Term id="discrimination">discrimination</Term>: current
          holders would receive only the highest price the certificates had traded at, and the original holders would get the
          rest. Hamilton rejected it. A security was a promise to whoever held it, he argued, and a government that rewrote its
          promises after the fact, however fair the motive, would find no one willing to buy the next ones. The House sided with
          Hamilton and voted Madison’s plan down by a wide margin.
        </p>
        <p>
          The second fight was over <Term id="assumption">assumption</Term>: the federal government taking over the states’ war
          debts. Hamilton wanted a single national system rather than thirteen competing ones, with creditors looking to the
          federal government, not their states, for payment. States that had already paid down much of their debt, Virginia
          above all, objected to helping pay everyone else’s. In April 1790 the House voted assumption down.
        </p>
        <p>
          The deadlock broke over dinner. In June 1790, by Thomas Jefferson’s account, Jefferson, then Secretary of State, hosted
          Hamilton and Madison, and they struck a bargain. Madison would stop blocking assumption, and the permanent national
          capital would go south, to a site on the Potomac River, with Philadelphia serving as the temporary capital for ten years.
          Congress passed the Residence Act, which fixed the capital’s location, in July. The Funding Act followed on August 4,
          1790, authorizing the federal government to take on up to $21.5 million of state debt.
        </p>
        <p>
          Under the Act, each $100 of old principal became about $66.67 of new 6 percent stock, which began paying interest
          almost at once, and $33.33 of “deferred” 6 percent stock, which would start paying interest only in 1801. Unpaid
          interest was converted into 3 percent stock, and the remaining Continental paper money was taken in at one new dollar
          for every hundred old ones. About a week later Congress created the Sinking Fund Commission, which could buy back debt
          in the market whenever it traded below <Term id="face-value">face value</Term>.
        </p>

        <h3>A bank, a mint and a tax on whiskey</h3>
        <p>
          In December 1790 Hamilton sent Congress two more reports. One proposed an <Term id="excise">excise tax</Term> on
          distilled spirits to pay the extra interest that came with assumption; Congress passed it in March 1791. The other
          proposed a national bank modeled on the Bank of England. The Bank of the United States would hold the government’s
          money, lend to it when needed and issue paper banknotes people could trust. It started with $10 million in capital, $2
          million of it from the government. Private investors could pay for three-quarters of their shares with federal
          securities, which tied the bank’s success to the debt’s.
        </p>
        <p>
          The bank set off the first great argument over what the Constitution allowed. Secretary of State Jefferson and Attorney
          General Edmund Randolph advised President Washington that it was unconstitutional, since nothing in the document gave
          Congress the power to create a corporation. Hamilton replied that the Constitution’s powers to tax, borrow and regulate
          trade implied the power to choose reasonable means of using them, under the clause allowing laws “necessary and proper”
          for carrying them out. President Washington sided with Hamilton and signed the bank bill in February 1791. The bank
          opened in Philadelphia that December, with a charter to run for 20 years.
        </p>
        <p>
          A report on a mint followed in January 1791, leading to the Coinage Act of 1792, which defined the dollar in terms of
          both silver and gold. In December 1791 came the <em>Report on Manufactures</em>, a program of tariffs and government
          bounties to build up American industry, most of which Congress set aside.
        </p>

        <h3>The first financial panic</h3>
        <p>
          The new securities were popular, perhaps too popular. Rights to buy Bank of the United States shares, called scrip,
          shot up in price in the summer of 1791 and then crashed. Hamilton steadied the market by having $150,000 of federal debt
          bought through the Bank of New York.
        </p>
        <p>
          A larger test came in March 1792. William Duer, a speculator who had briefly served as Hamilton’s assistant secretary at
          the Treasury, had borrowed heavily to try to corner the market in federal securities. When he stopped paying his
          creditors on March 9, prices fell sharply and credit dried up in New York. Hamilton had the Sinking Fund Commission buy
          federal securities in the open market. He also urged the Bank of New York to keep lending to anyone who could pledge
          federal securities as collateral, at 7 percent instead of the usual 6, and promised that the Treasury would back the
          bank if needed. By May the panic had passed without dragging down the wider economy. That same month, New York’s
          securities brokers signed the Buttonwood Agreement, the founding document of what became the New York Stock Exchange.
        </p>
        <p>
          Eighty years later Walter Bagehot, editor of <em>The Economist</em> in London, set out the rule that central banks
          still follow in a crisis: lend freely, at a high rate, against good collateral. Hamilton had done just that. He acted
          as a <Term id="lender-of-last-resort">lender of last resort</Term> before the term existed.
        </p>

        <h3>Rebellion and resignation</h3>
        <p>
          The whiskey excise was hated on the frontier, where farmers turned surplus grain into whiskey, which was easier to haul
          over the mountains to market, and often used it in place of cash. In 1794 resistance in western Pennsylvania turned
          violent. President Washington called up about 13,000 militiamen and rode with them part of the way west; Hamilton went
          with the army all the way to Pittsburgh. The Whiskey Rebellion collapsed without a battle, and the federal government
          had shown it could collect its taxes.
        </p>
        <p>
          Hamilton left the Treasury at the end of January 1795. The job paid $3,500 a year, and he had a growing family to
          support. Just before leaving he sent Congress a final report on public credit, a plan for paying off the whole debt over
          the coming decades.
        </p>
        <p>
          He had not made the debt smaller. Treasury’s records put it at about $71 million in 1790 and about $83 million in 1800,
          partly because the federal government had taken on the states’ debts. What he had changed was its reputation. Interest
          was paid on time, in <Term id="specie">specie</Term>. American IOUs that had sold for a small fraction of their face
          value in the 1780s traded close to face value by the early 1790s, and investors in Amsterdam and London bought them
          alongside European governments’ bonds. The United States had become a borrower that lenders trusted.
        </p>

        <h2>What Hamilton borrowed from Britain</h2>
        <p>
          Hamilton never hid his model. Almost every tool in his plan had a British precedent from the century before.
        </p>
      </Prose>

      <Wide>
        <ul className="grid gap-4 md:grid-cols-2 lg:ml-[8.33%] lg:max-w-[calc(100%-8.33%)]" aria-label="Britain’s financial tools and their American versions">
          {TOOLKIT.map((t) => (
            <li key={t.tool}>
              <Surface className="h-full p-5">
                <h3 className="font-serif text-[1.2rem] leading-snug text-fg">{t.tool}</h3>
                <dl className="mt-3 space-y-3 text-[0.9375rem] leading-relaxed">
                  <div>
                    <dt className="flex items-center gap-2 font-semibold text-fg">
                      <span aria-hidden="true" className="size-2 rounded-full bg-series-savings" />
                      Britain
                    </dt>
                    <dd className="mt-0.5 text-muted">{t.britain}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 font-semibold text-fg">
                      <span aria-hidden="true" className="size-2 rounded-full bg-series-treasury" />
                      United States
                    </dt>
                    <dd className="mt-0.5 text-muted">{t.us}</dd>
                  </div>
                </dl>
              </Surface>
            </li>
          ))}
        </ul>
      </Wide>

      <Prose>
        <p>
          The differences mattered as much. Britain had a single Parliament; the United States had a federal government and
          thirteen states with debts of their own, which is why assumption was so central and so bitterly fought. Britain’s
          financial system grew up through custom and acts of Parliament, while every American step could be challenged under a
          written constitution, as the bank was. And while Britain’s consols had no repayment date at all, Hamilton insisted that
          every debt come with a plan to pay it off, even if the paying took decades.
        </p>

        <h2>Epilogue: 1800</h2>
        <p>
          Hamilton’s opponents inherited his system. Thomas Jefferson won the presidential election of 1800 promising to cut
          spending and pay down the debt. His Treasury Secretary, Albert Gallatin, did it using the same tax revenues and sinking
          fund Hamilton had built. They disagreed with Hamilton about the bank, about whether debt could ever be a blessing and
          about much else, but they kept paying interest on time. The debt’s later history, through wars and recessions, is the
          line on the chart in <Link to="/learn/public-debt">chapter 1</Link>.
        </p>
      </Prose>

      <Takeaways
        items={[
          'Before the 1690s, government debt was a ruler’s personal promise, and rulers often broke it, so lenders charged high interest.',
          'After 1688 Britain backed its loans with taxes voted by Parliament and paid them reliably, and its borrowing costs fell from 8 percent or more to about 3 percent.',
          'The Continental Congress could not tax, so its paper money collapsed and its IOUs traded for a fraction of their value.',
          'Hamilton’s 1790 plan paid the debt in full, took over the states’ debts and backed the new federal securities with federal taxes.',
          'A national bank, a sinking fund and quick action in the Panic of 1792 made U.S. debt something investors at home and abroad trusted.',
        ]}
      />
    </>
  )
}
