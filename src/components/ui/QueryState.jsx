import { Button } from './Button.jsx'
import { Icon } from './Icon.jsx'

export function QueryState({ query, skeleton, label, children, empty }) {
  if (query.isPending) {
    return (
      <div role="status" aria-live="polite">
        <span className="sr-only">Loading {label}…</span>
        {skeleton ?? <div className="skeleton h-40 w-full" />}
      </div>
    )
  }
  if (query.isError) {
    return <ErrorState error={query.error} label={label} onRetry={() => query.refetch()} />
  }
  if (empty && isEmpty(query.data)) return empty
  return children(query.data)
}

function isEmpty(data) {
  if (data == null) return true
  if (Array.isArray(data)) return data.length === 0
  return false
}

export function ErrorState({ error, label, onRetry }) {
  return (
    <div role="alert" className="surface flex flex-col items-start gap-3 rounded-md p-5 sm:flex-row sm:items-center">
      <Icon name="caution" className="text-caution" />
      <div className="min-w-0 flex-1 text-[0.9375rem]">
        <p className="font-semibold text-fg">Couldn’t load {label}.</p>
        <p className="text-muted">{error?.message ?? 'Something went wrong.'}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

export function FigureSkeleton({ className = '' }) {
  return (
    <div className={className}>
      <div className="skeleton h-12 w-64 max-w-full" />
      <div className="skeleton mt-3 h-4 w-48 max-w-full" />
    </div>
  )
}
