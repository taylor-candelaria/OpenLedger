import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

export default function RouteError() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unknown error'
  return (
    <div className="mx-auto max-w-xl px-4 py-40">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-3 text-title text-fg">This page couldn’t be displayed.</h1>
      <p className="mt-4 text-muted">{message}</p>
      <Link to="/" className="link mt-6 inline-block font-semibold">
        Back to the home page
      </Link>
    </div>
  )
}
