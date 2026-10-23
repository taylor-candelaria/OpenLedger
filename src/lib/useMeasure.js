import { useLayoutEffect, useRef, useState } from 'react'

export function useMeasure(initialWidth = 640) {
  const ref = useRef(null)
  const [width, setWidth] = useState(initialWidth)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(el.getBoundingClientRect().width || initialWidth)
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      if (w > 0) setWidth(w)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [initialWidth])
  return [ref, width]
}
