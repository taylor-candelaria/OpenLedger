export function Wordmark({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" rx="7" fill="none" stroke="currentColor" strokeOpacity=".35" />
        <path d="M8 21 L13 15.5 L17 18.5 L24 10.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-serif text-[1.3rem] leading-none tracking-[-0.01em] text-fg">OpenLedger</span>
    </span>
  )
}
