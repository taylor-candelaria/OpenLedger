import { useEffect, useMemo, useRef } from 'react'
import { ORDINAL_ICE } from '@/lib/palette.js'
import { useYieldCurves } from '@/features/rates/useYieldCurves.js'
import { RIBBON_ALPHA, interpolate, layoutPoints, normalizeCurve, rateRange, sampleKeyframes } from './ribbon.js'

const STEP_MS = 900
const HOLD_MS = 6000
const ECHO_LAG = [0, 4, 8, 12, 16, 20, 24]
const ECHO_LAG_NARROW = [0, 8, 16]
const FRAME_MS = 1000 / 30

function rgba(hex, a) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

function strokeSpline(ctx, pts) {
  ctx.beginPath()
  ctx.moveTo(pts[0].x, pts[0].y)
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    ctx.bezierCurveTo(
      p1.x + (p2.x - p0.x) / 6,
      p1.y + (p2.y - p0.y) / 6,
      p2.x - (p3.x - p1.x) / 6,
      p2.y - (p3.y - p1.y) / 6,
      p2.x,
      p2.y,
    )
  }
  ctx.stroke()
}

export function YieldBackdrop({ align = 'full' }) {
  const canvasRef = useRef(null)
  const query = useYieldCurves()

  const frames = useMemo(() => {
    const days = query.data?.days
    if (!days?.length) return null
    const maturities = query.data.latest.points.map((p) => ({ label: p.label, years: p.years }))
    const rates = sampleKeyframes(days, 5).map((d) => normalizeCurve(d, maturities))
    return rates.length > 1 ? { rates, range: rateRange(rates) } : null
  }, [query.data])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !frames) return
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const reduceTransparency = window.matchMedia('(prefers-reduced-transparency: reduce)').matches
    const dim = reduceTransparency ? 0.6 : 1
    const last = frames.rates.length - 1
    const cycle = last * STEP_MS + HOLD_MS

    let width = 0
    let height = 0
    let raf = 0
    let visible = true
    let lastDraw = 0
    const start = performance.now()

    function resize() {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(1.5, window.devicePixelRatio || 1)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const positionAt = (t) => Math.min(last, (t % cycle) / STEP_MS)

    function ratesAt(pos) {
      const p = Math.max(0, pos)
      const i = Math.floor(p)
      const j = Math.min(last, i + 1)
      return interpolate(frames.rates[i], frames.rates[j], p - i)
    }

    function draw(pos) {
      ctx.clearRect(0, 0, width, height)
      const narrow = width < 640
      const box = {
        x0: align === 'right' && !narrow ? width * 0.38 : -width * 0.04,
        x1: width * 1.04,
        top: height * (narrow ? 0.45 : 0.22),
        bottom: height * 0.95,
        ...frames.range,
      }
      const lags = narrow ? ECHO_LAG_NARROW : ECHO_LAG
      const depth = narrow ? 10 : 14
      for (let k = lags.length - 1; k >= 0; k--) {
        const pts = layoutPoints(ratesAt(pos - lags[k]), box).map((p) => ({ x: p.x - k * depth, y: p.y - k * depth * 0.8 }))
        const color = ORDINAL_ICE[Math.min(ORDINAL_ICE.length - 1, Math.floor((k * ORDINAL_ICE.length) / lags.length))]
        const fade = 1 - (k / lags.length) * 0.65
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.strokeStyle = rgba(color, RIBBON_ALPHA.glow * fade * dim)
        ctx.lineWidth = narrow ? 8 : 14
        strokeSpline(ctx, pts)
        ctx.strokeStyle = rgba(color, RIBBON_ALPHA.core * fade * dim)
        ctx.lineWidth = narrow ? 1 : 1.5
        strokeSpline(ctx, pts)
      }
    }

    function tick(now) {
      raf = requestAnimationFrame(tick)
      if (now - lastDraw < FRAME_MS) return
      lastDraw = now
      draw(positionAt(now - start))
    }

    function stop() {
      cancelAnimationFrame(raf)
      raf = 0
    }

    function play() {
      if (raf || reduceMotion || !visible || document.hidden) return
      raf = requestAnimationFrame(tick)
    }

    resize()
    if (reduceMotion) draw(last)
    else draw(positionAt(0))
    play()

    const ro = new ResizeObserver(() => {
      resize()
      draw(raf ? positionAt(performance.now() - start) : last)
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) play()
      else stop()
    })
    io.observe(canvas)
    const onVisibility = () => (document.hidden ? stop() : play())
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [frames, align])

  if (!frames) return null
  return <canvas ref={canvasRef} className="backdrop" aria-hidden="true" />
}
