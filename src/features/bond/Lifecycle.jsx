import { useState } from 'react'
import { Icon } from '@/components/ui/Icon.jsx'
import { SourceNote } from '@/components/ui/Notes.jsx'
import { GlassPanel } from '@/components/ui/Surfaces.jsx'
import { Term } from '@/components/ui/Term.jsx'

const STAGES = [
  {
    id: 'announce',
    label: 'Announcement',
    when: 'A few days before',
    flow: null,
    title: 'Treasury announces what it will sell',
    body: (
      <>
        Treasury publishes the security type, the amount and the auction date. A new 10-year note, for example, is announced
        about a week ahead, with a <Term id="cusip">CUSIP</Term> that identifies it from then on.
      </>
    ),
  },
  {
    id: 'auction',
    label: 'Auction',
    when: 'Auction day',
    flow: 'bids',
    title: 'Investors bid, and the auction sets the yield',
    body: (
      <>
        Banks, funds and individuals submit bids. In a <Term id="single-price-auction">single-price auction</Term>, Treasury
        accepts the lowest yields until the whole amount is sold, and everyone who wins gets the same yield. Treasury then sets
        the coupon just below that yield, in eighths of a percent.
      </>
    ),
  },
  {
    id: 'issue',
    label: 'Issue',
    when: 'Issue date',
    flow: 'toIssuer',
    title: 'You pay, and the government gets its money',
    body: (
      <>
        On the issue date you pay the price (close to <Term id="face-value">face value</Term> for a new note) and the security
        appears in your account. The government now has the cash it borrowed.
      </>
    ),
  },
  {
    id: 'coupons',
    label: 'Coupons',
    when: 'Every six months',
    flow: 'toInvestor',
    title: 'Interest arrives on schedule',
    body: (
      <>
        Every six months Treasury pays a <Term id="coupon">coupon</Term>: half the annual coupon rate times face value. In
        between, you can hold the note or sell it on the <Term id="secondary-market">secondary market</Term> at whatever price
        buyers will pay that day.
      </>
    ),
  },
  {
    id: 'maturity',
    label: 'Maturity',
    when: 'Final date',
    flow: 'toInvestor',
    title: 'The loan is repaid',
    body: (
      <>
        On the <Term id="maturity">maturity</Term> date you receive the last coupon plus the full face value, regardless of
        what you paid or how prices moved along the way. Treasury typically funds repayment by selling new securities.
      </>
    ),
  },
]

export function Lifecycle() {
  const [index, setIndex] = useState(0)
  const stage = STAGES[index]

  return (
    <GlassPanel className="p-5 sm:p-7">
      <ol className="grid grid-cols-5 gap-1.5" aria-label="Stages in the life of a Treasury note">
        {STAGES.map((s, i) => {
          const isCurrent = i === index
          const isPast = i < index
          return (
            <li key={s.id} className="min-w-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-current={isCurrent ? 'step' : undefined}
                className={`group flex w-full flex-col items-start gap-2 rounded-md px-1 py-2 text-left sm:px-2`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1 w-full rounded-full transition-colors duration-200 ${
                    isCurrent ? 'bg-ice' : isPast ? 'bg-ice/45' : 'bg-control/60 group-hover:bg-control'
                  }`}
                />
                <span className={`text-[0.8125rem] font-semibold sm:text-sm ${isCurrent ? 'text-fg' : 'text-muted group-hover:text-fg'}`}>
                  <span className="num mr-1 hidden sm:inline">{i + 1}.</span>
                  {s.label}
                </span>
                <span className="hidden text-[0.75rem] text-muted md:block">{s.when}</span>
              </button>
            </li>
          )
        })}
      </ol>

      <div className="mt-6 grid items-center gap-6 md:grid-cols-[1fr_minmax(0,1.15fr)]">
        <FlowDiagram flow={stage.flow} stageId={stage.id} />
        <div aria-live="polite">
          <p className="eyebrow">
            Step {index + 1} of {STAGES.length} · {stage.when}
          </p>
          <h3 className="mt-2 font-serif text-[1.45rem] leading-snug text-fg">{stage.title}</h3>
          <p className="mt-2.5 text-[1rem] leading-relaxed text-muted">{stage.body}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-4">
        <SourceNote kind="illustrative">A newly issued Treasury note.</SourceNote>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="inline-flex size-10 items-center justify-center rounded-md border border-control text-fg hover:bg-glass-2 disabled:border-line disabled:text-subtle"
            aria-label="Previous step"
          >
            <Icon name="arrowLeft" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(STAGES.length - 1, i + 1))}
            disabled={index === STAGES.length - 1}
            className="inline-flex size-10 items-center justify-center rounded-md border border-control text-fg hover:bg-glass-2 disabled:border-line disabled:text-subtle"
            aria-label="Next step"
          >
            <Icon name="arrowRight" />
          </button>
        </div>
      </div>
    </GlassPanel>
  )
}

function FlowDiagram({ flow, stageId }) {
  const label =
    flow === 'toIssuer'
      ? 'Money flows from the investor to the U.S. Treasury'
      : flow === 'toInvestor'
        ? 'Money flows from the U.S. Treasury to the investor'
        : flow === 'bids'
          ? 'Investors send bids to the U.S. Treasury'
          : 'No money has moved yet'
  const amount = {
    issue: ['Price paid'],
    coupons: ['Coupon'],
    maturity: ['Face value', '+ last coupon'],
    auction: ['Bids'],
  }[stageId]
  return (
    <svg viewBox="0 0 320 150" role="img" aria-label={label} className="mx-auto w-full max-w-[360px]">
      <Party x={10} label="U.S. Treasury" sub="Issuer" />
      <Party x={210} label="You" sub="Investor" />
      {flow && (
        <g key={stageId} className="motion-safe:animate-[flow-in_260ms_ease-out]">
          <line
            x1={flow === 'toInvestor' ? 116 : 204}
            x2={flow === 'toInvestor' ? 196 : 124}
            y1="75"
            y2="75"
            stroke="#b9d8f2"
            strokeWidth="2"
            strokeDasharray={flow === 'bids' ? '4 4' : undefined}
          />
          <path
            d={flow === 'toInvestor' ? 'M190 69 l8 6 l-8 6' : 'M130 69 l-8 6 l8 6'}
            fill="none"
            stroke="#b9d8f2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="160" y={amount.length > 1 ? 48 : 62} textAnchor="middle" fill="#f1f4fa" fontSize="12" fontFamily="Public Sans Variable, sans-serif">
            {amount.map((line, i) => (
              <tspan key={line} x="160" dy={i === 0 ? 0 : 15}>
                {line}
              </tspan>
            ))}
          </text>
        </g>
      )}
      {!flow && (
        <text x="160" y="80" textAnchor="middle" fill="#a6b2c5" fontSize="12" fontFamily="Public Sans Variable, sans-serif">
          Announcement
        </text>
      )}
    </svg>
  )
}

function Party({ x, label, sub }) {
  return (
    <g>
      <rect x={x} y="40" width="100" height="70" rx="10" fill="rgba(190,215,245,0.06)" stroke="rgba(190,215,245,0.22)" />
      <text x={x + 50} y="72" textAnchor="middle" fill="#f1f4fa" fontSize="13" fontWeight="600" fontFamily="Public Sans Variable, sans-serif">
        {label}
      </text>
      <text x={x + 50} y="90" textAnchor="middle" fill="#a6b2c5" fontSize="11.5" fontFamily="Public Sans Variable, sans-serif">
        {sub}
      </text>
    </g>
  )
}
