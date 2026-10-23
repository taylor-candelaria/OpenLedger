import { Link } from 'react-router-dom'
import { Icon } from './Icon.jsx'

const variants = {
  primary:
    'bg-ice text-night hover:bg-fg active:bg-muted disabled:bg-control disabled:text-night-2',
  secondary:
    'border border-control text-fg bg-glass-1 hover:bg-glass-3 hover:border-muted disabled:text-subtle disabled:border-line',
  ghost: 'text-ice hover:bg-glass-2 disabled:text-subtle',
}

const sizes = {
  md: 'h-11 px-5 text-[0.9375rem] gap-2',
  sm: 'h-9 px-3.5 text-sm gap-1.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  icon,
  iconLeft,
  className = '',
  children,
  ...rest
}) {
  const classes = `inline-flex items-center justify-center rounded-md font-semibold whitespace-nowrap
    transition-colors duration-150 ease-[var(--ease-soft)] disabled:cursor-not-allowed
    ${variants[variant]} ${sizes[size]} ${className}`
  const content = (
    <>
      {iconLeft && <Icon name={iconLeft} size={size === 'sm' ? 16 : 18} />}
      <span>{children}</span>
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}
    </>
  )
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer" {...rest}>
        {content}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  )
}

export function ArrowLink({ to, href, children, className = '' }) {
  const classes = `group inline-flex items-center gap-1.5 font-semibold text-ice ${className}`
  const inner = (
    <>
      <span className="underline decoration-ice/40 underline-offset-4 group-hover:decoration-ice">{children}</span>
      <Icon name={href ? 'external' : 'arrowRight'} size={16} className="transition-transform duration-150 group-hover:translate-x-0.5" />
    </>
  )
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {inner}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  }
  return (
    <Link to={to} className={classes}>
      {inner}
    </Link>
  )
}
export function ExternalLink({ href, children, className = '' }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`link ${className}`}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
