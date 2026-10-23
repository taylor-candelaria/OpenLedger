import {
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GLOSSARY_BY_ID } from '@/content/glossary.js'

export function Term({ id, children }) {
  const entry = GLOSSARY_BY_ID[id]
  const [open, setOpen] = useState(false)
  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'top',
    middleware: [offset(8), flip({ padding: 12 }), shift({ padding: 12 })],
    whileElementsMounted: autoUpdate,
  })
  const hover = useHover(context, { delay: { open: 120, close: 80 }, handleClose: safePolygon(), mouseOnly: true })
  const focus = useFocus(context)
  const click = useClick(context, { ignoreMouse: true, keyboardHandlers: true })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'dialog' })
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, click, dismiss, role])

  const { setReference, setFloating } = refs

  if (!entry) {
    if (import.meta.env.DEV) console.warn(`Unknown glossary term: ${id}`)
    return <>{children}</>
  }

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        ref={setReference}
        data-term
        aria-expanded={open}
        className="cursor-help rounded-[3px] underline decoration-ice/55 decoration-dotted decoration-[1.5px] underline-offset-[0.22em] transition-colors hover:decoration-ice"
        {...getReferenceProps()}
      >
        {children ?? entry.term}
      </span>
      {open && (
        <FloatingPortal>
          <div
            ref={setFloating}
            style={floatingStyles}
            aria-label={entry.term}
            className="glass-pop z-50 w-[min(22rem,calc(100vw-24px))] rounded-md p-4 text-left font-sans"
            {...getFloatingProps()}
          >
            <p className="font-serif text-[1.05rem] leading-tight text-fg">{entry.term}</p>
            <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{entry.short}</p>
            <Link
              to={`/glossary#${entry.id}`}
              className="mt-2.5 inline-block text-sm font-semibold text-ice underline decoration-ice/40 underline-offset-4 hover:decoration-ice"
            >
              In the glossary
            </Link>
          </div>
        </FloatingPortal>
      )}
    </>
  )
}
