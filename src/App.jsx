import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer.jsx'
import { SiteNav } from '@/components/layout/SiteNav.jsx'

function useHashScroll() {
  const { hash, pathname } = useLocation()
  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    let tries = 0
    const tick = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ block: 'start' })
        if (el.tabIndex < 0 && !el.matches('a,button,input,select,textarea')) el.setAttribute('tabindex', '-1')
        el.focus({ preventScroll: true })
      } else if (tries++ < 20) {
        requestAnimationFrame(tick)
      }
    }
    tick()
  }, [hash, pathname])
}

export default function App() {
  useHashScroll()
  return (
    <>
      <SiteNav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  )
}
