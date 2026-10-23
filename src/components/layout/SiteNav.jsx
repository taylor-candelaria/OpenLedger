import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon.jsx'
import { Wordmark } from './Wordmark.jsx'

const NAV_ITEMS = [
  { to: '/learn', label: 'Learn' },
  { to: '/treasuries', label: 'Treasuries' },
  { to: '/bonds-vs-hysa', label: 'Bonds vs. HYSA' },
  { to: '/state-local', label: 'State & local' },
  { to: '/data', label: 'Data desk' },
  { to: '/explore', label: 'Explore data' },
]

function linkClass({ isActive }) {
  return `rounded-md px-3 py-2 text-[0.9375rem] font-semibold transition-colors duration-150 ${
    isActive
      ? 'bg-glass-3 text-fg shadow-[inset_0_0_0_1px_var(--color-line-strong)]'
      : 'text-muted hover:bg-glass-2 hover:text-fg'
  }`
}

export function SiteNav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const buttonRef = useRef(null)

  const [lastPath, setLastPath] = useState(location.pathname)
  if (location.pathname !== lastPath) {
    setLastPath(location.pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-4">
      <a
        href="#main"
        className="pointer-events-auto absolute top-3 left-3 z-50 -translate-y-24 rounded-md bg-ice px-4 py-2.5 font-semibold text-night focus:translate-y-0"
      >
        Skip to content
      </a>
      <nav
        aria-label="Main"
        className="glass-nav pointer-events-auto mx-auto max-w-[1200px] rounded-lg px-3 py-2 sm:px-4"
      >
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="rounded-md px-1 py-1 text-ice" aria-label="OpenLedger home">
            <Wordmark />
          </Link>
          <ul className="hidden items-center gap-0.5 lg:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={linkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <button
            ref={buttonRef}
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-md px-3 font-semibold text-fg hover:bg-glass-2 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} />
            <span>Menu</span>
          </button>
        </div>
        <ul id="mobile-nav" hidden={!open} className="mt-2 grid gap-1 border-t border-line pt-2 pb-1 lg:hidden">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={(s) => `block ${linkClass(s)} py-3`}>
                {item.label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/glossary" className={(s) => `block ${linkClass(s)} py-3`}>
              Glossary
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
