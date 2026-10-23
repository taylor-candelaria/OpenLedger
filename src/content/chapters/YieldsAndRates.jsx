import { Link } from 'react-router-dom'
import { Term } from '@/components/ui/Term.jsx'
import { YieldCurveChart } from '@/features/rates/YieldCurveChart.jsx'
import { currentYield, priceFromYield, yieldFromPrice } from '@/lib/finance/bond.js'
import { formatPercent, formatUSD } from '@/lib/format.js'
import { Prose, Takeaways, Wide } from './ChapterLayout.jsx'

function ThreeRates() {
  const face = 1000
  const couponRate = 0.04
  const price = 950
  const years = 5
  const cy = currentYield({ face, couponRate, price })
  const ytm = yieldFromPrice({ face, couponRate, years, price })
  return (
    <div className="my-8 grid gap-4 sm:grid-cols-3">
      {[
        ['Coupon rate', formatPercent(couponRate * 100), '$40 a year on $1,000 face value'],
        ['Current yield', formatPercent(cy * 100), '$40 ÷ the $950 you paid'],
        ['Yield to maturity', formatPercent(ytm * 100), 'Coupons plus the $50 gain at maturity'],
      ].map(([label, value, note]) => (
        <div key={label} className="surface rounded-md p-4">
          <p className="text-[0.8125rem] font-semibold text-muted">{label}</p>
          <p className="num mt-1 text-[1.5rem] text-fg">{value}</p>
          <p className="mt-1 text-[0.875rem] leading-snug text-muted">{note}</p>
        </div>
      ))}
      <p className="text-[0.8125rem] text-muted sm:col-span-3">
        Hypothetical 5-year bond, 4% coupon, bought for {formatUSD(price)}.
      </p>
    </div>
  )
}

function MaturityExample() {
  const maturities = [
    { years: 2, label: '2-year note' },
    { years: 10, label: '10-year note' },
    { years: 30, label: '30-year bond' },
  ].map((m) => {
    const price = priceFromYield({ face: 1000, couponRate: 0.045, years: m.years, ytm: 0.055 })
    return { ...m, price, change: (price - 1000) / 1000 }
  })
  return (
    <>
      <p>
        Take three Treasuries, each with $1,000 face value and a 4.5% coupon, bought at par when market yields are also 4.5%.
        Then yields rise one point, to 5.5%:
      </p>
      <ul>
        {maturities.map((m) => (
          <li key={m.years}>
            The <strong>{m.label}</strong> falls to about <strong className="num">{formatUSD(m.price)}</strong>, a drop of{' '}
            <span className="num">{Math.abs(m.change * 100).toFixed(1)}%</span>.
          </li>
        ))}
      </ul>
      <p>
        Same coupon, same change in rates, very different results. Had yields fallen a point instead, each would have gained,
        and the 30-year bond the most.
      </p>
    </>
  )
}

export default function YieldsAndRates() {
  return (
    <>
      <Prose>
        <p className="!text-lede text-muted">
          Prices and yields are two ways of describing the same thing. Once a bond’s payments are fixed, paying more for it
          means earning less on it.
        </p>
        <p>
          A bond’s <Term id="yield">yield</Term> is the return you get for the price you pay. Because the coupon is fixed, the
          only way a bond’s yield can change is through its price. That’s the seesaw: when yields go up, prices go down, and when
          yields go down, prices go up.
        </p>
        <h2>Three rates, one bond</h2>
        <p>
          Buy a 5-year bond with a 4% coupon for $950 instead of $1,000 and there are three different rates you might quote:
        </p>
        <ThreeRates />
        <p>
          Yield to maturity is the one that answers “what will I earn if I hold this to the end?”, which is why it’s the standard.
          It does assume the issuer pays in full and that you could reinvest each coupon at the same yield.
        </p>
        <h2>Why longer bonds move more</h2>
        <p>
          A 30-year bond’s payments stretch decades into the future, and a change in yield compounds over every one of those
          years. A 2-year note will be repaid soon, so a change in yield has little time to matter. The measure of this
          sensitivity is <Term id="duration">duration</Term>: a bond with a duration of 8 loses about 8% of its value if yields
          rise one percentage point.
        </p>
        <MaturityExample />
        <p>
          That is <Term id="interest-rate-risk">interest rate risk</Term>, and it’s the main risk in Treasuries. It only turns
          into a loss if you sell before maturity. An investor who holds to the end gets every promised dollar; what they give up
          is the chance to have bought the higher-yielding bond instead.
        </p>

        <h2>The yield curve</h2>
        <p>
          Line up Treasury yields from the shortest maturity to the longest and you get the{' '}
          <Term id="yield-curve">yield curve</Term>. It’s the market’s price list for lending to the U.S. government, and it’s
          updated every business day.
        </p>
      </Prose>

      <Wide>
        <YieldCurveChart />
      </Wide>

      <Prose>
        <p>
          Usually the curve slopes upward: investors want more to tie their money up longer, partly because more can go wrong
          over a longer time. Sometimes it’s <Term id="inverted-yield-curve">inverted</Term>, with short-term yields above long-term
          ones. That tends to happen when investors expect the Federal Reserve to cut rates in the future, and inversions have
          often come before recessions, though not on a fixed timetable.
        </p>
        <h2>What moves yields</h2>
        <ul>
          <li>
            <strong>The Federal Reserve.</strong> Its policy rate anchors the shortest yields, and expectations about where it’s
            heading move the rest.
          </li>
          <li>
            <strong>Inflation.</strong> Lenders want to be paid back in money that still buys something, so higher expected
            inflation means higher yields. (TIPS strip this out.)
          </li>
          <li>
            <strong>Supply and demand.</strong> More borrowing means more bonds to sell; in uncertain times, demand for safe
            Treasuries can push yields down.
          </li>
          <li>
            <strong>The economy.</strong> Strong growth tends to raise yields; slowdowns tend to lower them.
          </li>
        </ul>
        <h2>Other risks to know</h2>
        <p>
          Besides price risk, bond investors face <Term id="inflation-risk">inflation risk</Term> (fixed payments buy less if
          prices rise faster than expected) and <Term id="reinvestment-risk">reinvestment risk</Term> (coupons or maturing bills
          may have to be reinvested at lower rates). For U.S. Treasuries, <Term id="credit-risk">default risk</Term> is considered
          very low; for other borrowers it can be significant.
        </p>
        <p>
          <Link to="/bonds-vs-hysa">See how these trade-offs play out against a high-yield savings account</Link>.
        </p>
      </Prose>

      <Takeaways
        items={[
          'Yield to maturity is the full return for buying at today’s price and holding to the end.',
          'Prices and yields move in opposite directions; longer bonds swing more.',
          'Price changes only become gains or losses if you sell before maturity.',
          'The yield curve shows today’s rates for every maturity; it usually slopes upward.',
        ]}
      />
    </>
  )
}
