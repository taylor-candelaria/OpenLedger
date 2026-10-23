const paths = {
  arrowRight: <path d="M4 10h11M11 5.5 15.5 10 11 14.5" />,
  arrowLeft: <path d="M16 10H5M9 5.5 4.5 10 9 14.5" />,
  external: <path d="M8 5H5.5A1.5 1.5 0 0 0 4 6.5v8A1.5 1.5 0 0 0 5.5 16h8a1.5 1.5 0 0 0 1.5-1.5V12M11 4h5v5M16 4l-7 7" />,
  chevronDown: <path d="m5.5 8 4.5 4.5L14.5 8" />,
  menu: <path d="M3.5 6h13M3.5 10h13M3.5 14h13" />,
  close: <path d="m5 5 10 10M15 5 5 15" />,
  info: (
    <>
      <circle cx="10" cy="10" r="7" />
      <path d="M10 9v4.5M10 6.6v.1" />
    </>
  ),
  caution: (
    <>
      <path d="M10 3.5 17 16H3l7-12.5Z" />
      <path d="M10 8.5v3.5M10 14.2v.1" />
    </>
  ),
  check: <path d="m4.5 10.5 3.5 3.5 7.5-8" />,
  table: (
    <>
      <rect x="3.5" y="4.5" width="13" height="11" rx="1.5" />
      <path d="M3.5 8.5h13M3.5 12h13M8 8.5v7" />
    </>
  ),
  chart: <path d="M3.5 16.5h13M5.5 13l3.5-4 3 2.5 4-5.5" />,
  search: (
    <>
      <circle cx="9" cy="9" r="5" />
      <path d="m13 13 3.5 3.5" />
    </>
  ),
}

export function Icon({ name, size = 18, className = '', title }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      {paths[name]}
    </svg>
  )
}
