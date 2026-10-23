import { Link } from 'react-router-dom'
import { Term } from '@/components/ui/Term.jsx'
import { priceFromYield } from '@/lib/finance/bond.js'
import { formatUSD } from '@/lib/format.js'
import { Lifecycle } from '@/features/bond/Lifecycle.jsx'
import { Prose, Takeaways, Wide } from './ChapterLayout.jsx'

function PriceExample() {
  const terms = { face: 1000, couponRate: 0.04, years: 10 }
  const higher = priceFromYield({ ...terms, ytm: 0.05 })
  const lower = priceFromYield({ ...terms, ytm: 0.03 })
  return (
    <>
      <h3>A worked example</h3>
      <p>
        You buy a new 10-year Treasury note for its $1,000 face value. It pays a 4% coupon: $40 a year, as $20 every six
        months.
      </p>
      <ul>
        <li>
          <strong>Rates rise to 5%.</strong> New notes now pay $50 a year. To make your $40 note just as attractive, a buyer
          will pay only about <strong className="num">{formatUSD(higher)}</strong> for it. The roughly{' '}
          <span className="num">{formatUSD(1000 - higher)}</span> discount, collected when the note repays $1,000, makes up
          for the smaller coupons.
        </li>
        <li>
          <strong>Rates fall to 3%.</strong> New notes pay just $30 a year, so your $40 note is worth more: about{' '}
          <strong className="num">{formatUSD(lower)}</strong>. The buyer pays that premium up front and gets back only
          $1,000 at maturity.
        </li>
        <li>
          <strong>You keep it.</strong> Whatever rates do, you collect $20 every six months for ten years ($400 in all), then
          your $1,000. The price only matters if you sell.
        </li>
      </ul>
      <p className="muted">
        Prices assume the yield change happens right after you buy, with all ten years still to run.
      </p>
    </>
  )
}

export default function HowBondsWork() {
  return (
    <>
      <Prose>
        <p className="!text-lede text-muted">
          A bond is a loan with every term set up front: how much you lend, the interest you’ll earn and its schedule, and the
          date you’re repaid.
        </p>
        <p>Three numbers describe almost every bond:</p>
        <ul>
          <li>
            The <Term id="face-value">face value</Term>, also called par: the amount the borrower repays at the end. Treasury
            securities come in multiples of $100.
          </li>
          <li>
            The <Term id="coupon-rate">coupon rate</Term>: the fixed annual interest rate, applied to face value. A $1,000 bond
            with a 4% coupon pays $40 a year. Treasury notes and bonds split that into two payments, so $20 every six months.
          </li>
          <li>
            The <Term id="maturity">maturity</Term> date: when the last coupon and the face value are paid, and the bond ends.
          </li>
        </ul>
        <p>
          The borrower is the <Term id="issuer">issuer</Term>, and the person or institution holding the bond is the investor. For
          a Treasury, the issuer is the U.S. Department of the Treasury acting for the federal government.
        </p>
        <h2>The life of a bond</h2>
        <p>
          From the investor’s side, a bond’s life has a simple shape: money goes out once, then comes back in small, regular
          pieces and one large final piece.
        </p>
      </Prose>

      <Wide>
        <Lifecycle />
      </Wide>

      <Prose>
        <h2>Price is not the same as face value</h2>
        <p>
          A bond’s coupon is fixed when it’s issued, but interest rates in the economy keep moving. Suppose you own a bond paying
          4% and new bonds start paying 5%. Nobody will pay you full price for your 4% bond when they could buy a 5% one instead,
          so its price falls until its overall return matches what new bonds offer. It now trades at a{' '}
          <Term id="discount">discount</Term>.
        </p>
        <p>
          The reverse happens when rates fall: an older bond with a higher coupon becomes more valuable and trades at a{' '}
          <Term id="premium">premium</Term>. Either way, if you simply hold the bond to maturity, you receive every coupon and the
          full face value, exactly as promised. The price matters only if you sell.
        </p>
        <PriceExample />
        <h2>Measuring the return</h2>
        <p>
          Because price and coupon can differ, a bond has more than one “rate.” The coupon rate is fixed.{' '}
          <Term id="current-yield">Current yield</Term> divides the annual coupon by today’s price. And{' '}
          <Term id="yield-to-maturity">yield to maturity</Term> counts everything you’ll receive, coupons plus any gain or loss
          when the face value is repaid, as one annual rate. When people quote a bond’s yield, they almost always mean yield to
          maturity.
        </p>
        <p>
          <Link to="/learn/treasury-securities">Next, the different kinds of Treasury securities</Link>, which use these same
          building blocks in different ways.
        </p>
      </Prose>

      <Takeaways
        items={[
          'Face value is what’s repaid at maturity; the coupon rate sets the interest paid on it.',
          'Treasury notes and bonds pay half their annual coupon every six months.',
          'When market yields rise above a bond’s coupon, its price falls below face value, and vice versa.',
          'Held to maturity, a bond pays exactly what it promised, whatever happened to its price along the way.',
        ]}
      />
    </>
  )
}
