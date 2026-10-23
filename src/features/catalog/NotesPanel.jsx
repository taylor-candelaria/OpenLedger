import { useEffect, useId, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button.jsx'
import { Segmented } from '@/components/ui/Fields.jsx'
import { Icon } from '@/components/ui/Icon.jsx'
import { Callout } from '@/components/ui/Notes.jsx'
import { ErrorState } from '@/components/ui/QueryState.jsx'
import { GlassPanel } from '@/components/ui/Surfaces.jsx'
import { useApiStatus, useCreateNote, useDeleteNote, useNotes, useToggleNote, useUpdateNote } from '@/lib/api/hooks.js'
import { formatDate, toISODate } from '@/lib/format.js'

const field =
  'w-full rounded-md border border-control bg-night-2 px-3 text-[0.9375rem] text-fg transition-colors duration-150 ' +
  'placeholder:text-subtle hover:border-muted focus-visible:border-ice'

function weekFromToday() {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return toISODate(d)
}

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'reviewed', label: 'Reviewed' },
]

export function NotesPanel({ attach, onAttachUsed }) {
  const status = useApiStatus()
  const configured = status.data?.notes?.configured ?? false
  const notes = useNotes({ enabled: configured })
  const [filter, setFilter] = useState('all')
  const [announcement, setAnnouncement] = useState('')

  const all = notes.data ?? []
  const shown = all.filter((n) => (filter === 'open' ? !n.reviewed : filter === 'reviewed' ? n.reviewed : true))
  const openCount = all.filter((n) => !n.reviewed).length

  return (
    <GlassPanel as="section" aria-labelledby="notes-heading" className="p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="notes-heading" className="font-serif text-[1.4rem] text-fg">
          Research notes
        </h2>
        {configured && notes.isSuccess && (
          <p className="text-[0.8125rem] text-muted">
            <span className="num text-fg">{openCount}</span> open of <span className="num text-fg">{all.length}</span>
          </p>
        )}
      </div>
      <p className="mt-1 text-[0.875rem] leading-relaxed text-muted">
        Keep track of datasets worth a closer look. Save one from the results, or write your own note.
      </p>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {!status.isPending && !configured && (
        <Callout tone="caution" title="Notes aren’t connected yet" className="mt-5">
          <p>
            Everything below works once the SimplyCoding Todo App API has your class token. In{' '}
            <code className="num">~/OpenLedger/.env.local</code>, set <code className="num">SIMPLYCODING_TOKEN=</code> to your
            token from the course’s API Access page, then restart <code className="num">npm run dev</code>.
          </p>
        </Callout>
      )}

      <NewNoteForm
        attach={attach}
        onAttachUsed={onAttachUsed}
        disabled={!configured}
        onSaved={() => setAnnouncement('Note saved.')}
      />

      <div className="mt-6 border-t border-line pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-sans text-[0.9375rem] font-semibold text-fg">Your notes</h3>
          <Segmented legend="Show" hideLegend size="sm" value={filter} onChange={setFilter} options={FILTERS} />
        </div>

        <div className="mt-4">
          {!configured && !status.isPending && (
            <p className="rounded-md border border-dashed border-line px-4 py-6 text-center text-[0.9375rem] text-muted">
              Saved notes will be listed here, each with Edit, Reviewed and Delete controls.
            </p>
          )}
          {configured && notes.isPending && (
            <div role="status" className="space-y-2">
              <span className="sr-only">Loading notes…</span>
              <div className="skeleton h-20 w-full" />
              <div className="skeleton h-20 w-full" />
            </div>
          )}
          {configured && notes.isError && <ErrorState error={notes.error} label="your notes" onRetry={() => notes.refetch()} />}
          {configured && notes.isSuccess && shown.length === 0 && (
            <p className="text-[0.9375rem] text-muted">
              {all.length === 0
                ? 'No notes yet. Your first one will appear here.'
                : filter === 'open'
                  ? 'Nothing open. Every note has been reviewed.'
                  : 'No reviewed notes yet.'}
            </p>
          )}
          {shown.length > 0 && (
            <ul className="space-y-3">
              {shown.map((n) => (
                <NoteItem key={n.id} note={n} onAnnounce={setAnnouncement} />
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="mt-5 text-[0.75rem] leading-relaxed text-muted">Notes are kept for 90 days after their last edit.</p>
    </GlassPanel>
  )
}

function NewNoteForm({ attach, onAttachUsed, onSaved, disabled }) {
  const id = useId()
  const titleRef = useRef(null)
  const create = useCreateNote()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [revisitBy, setRevisitBy] = useState(weekFromToday)
  const [dataset, setDataset] = useState(null)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const [lastAttach, setLastAttach] = useState(null)
  if (attach && attach !== lastAttach) {
    setLastAttach(attach)
    setDataset(attach)
    setTitle((t) => t || attach.title)
  }
  useEffect(() => {
    if (!lastAttach) return
    titleRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    titleRef.current?.focus({ preventScroll: true })
  }, [lastAttach])

  function submit(e) {
    e.preventDefault()
    if (disabled) return
    if (!title.trim()) {
      setError('Give the note a title.')
      titleRef.current?.focus()
      return
    }
    setError('')
    create.mutate(
      { title, body, dataset, revisitBy },
      {
        onSuccess: () => {
          setTitle('')
          setBody('')
          setDataset(null)
          setRevisitBy(weekFromToday())
          setSaved(true)
          onAttachUsed()
          onSaved()
        },
      },
    )
  }

  return (
    <form onSubmit={submit} className="mt-5 space-y-4" aria-label="New note" noValidate>
      <h3 className="font-sans text-[0.9375rem] font-semibold text-fg">New note</h3>
      <fieldset disabled={disabled} className={`min-w-0 space-y-4 ${disabled ? 'opacity-60' : ''}`}>
      <div>
        <label htmlFor={`${id}-title`} className="mb-1.5 block text-[0.9375rem] font-semibold text-fg">
          Title
        </label>
        <input
          ref={titleRef}
          id={`${id}-title`}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setSaved(false)
          }}
          maxLength={200}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder="e.g. Compare city debt with the state’s"
          className={`${field} h-11`}
        />
        {error && (
          <p id={`${id}-error`} className="mt-1.5 text-[0.875rem] text-caution">
            {error}
          </p>
        )}
      </div>

      {dataset && (
        <div className="flex items-start justify-between gap-3 rounded-md border border-line bg-night-2/70 px-3 py-2.5 text-[0.875rem]">
          <div className="min-w-0">
            <p className="text-muted">Attached dataset</p>
            <p className="truncate text-fg">{dataset.title}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDataset(null)
              onAttachUsed()
            }}
            className="shrink-0 rounded-sm px-1.5 py-1 text-muted hover:bg-glass-2 hover:text-fg"
            aria-label="Remove attached dataset"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

      <div>
        <label htmlFor={`${id}-body`} className="mb-1.5 block text-[0.9375rem] font-semibold text-fg">
          Notes <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id={`${id}-body`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          maxLength={4000}
          className={`${field} resize-y py-2 leading-relaxed`}
        />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <label htmlFor={`${id}-date`} className="mb-1.5 block text-[0.9375rem] font-semibold text-fg">
            Revisit by
          </label>
          <input
            id={`${id}-date`}
            type="date"
            value={revisitBy}
            onChange={(e) => setRevisitBy(e.target.value)}
            className={`${field} num h-11 w-auto`}
          />
        </div>
        <Button type="submit" disabled={disabled || create.isPending}>
          {create.isPending ? 'Saving…' : 'Save note'}
        </Button>
      </div>
      </fieldset>

      {saved && !create.isPending && !create.isError && (
        <p className="flex items-center gap-2 text-[0.875rem] text-fg">
          <Icon name="check" size={16} className="text-teal" />
          Note saved. It’s at the top of your notes below.
        </p>
      )}
      {create.isError && <ErrorState error={create.error} label="the note" />}
    </form>
  )
}

function NoteItem({ note, onAnnounce }) {
  const id = useId()
  const update = useUpdateNote()
  const toggle = useToggleNote()
  const remove = useDeleteNote()
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [title, setTitle] = useState(note.title)
  const [body, setBody] = useState(note.body)
  const [revisitBy, setRevisitBy] = useState(note.revisitBy ?? '')

  const [today] = useState(() => toISODate(new Date()))
  const overdue = !note.reviewed && note.revisitBy && note.revisitBy < today
  const failed = update.error ?? toggle.error ?? remove.error

  function startEditing() {
    setTitle(note.title)
    setBody(note.body)
    setRevisitBy(note.revisitBy ?? '')
    setEditing(true)
  }

  function save(e) {
    e.preventDefault()
    if (!title.trim()) return
    const changes = {}
    if (title.trim() !== note.title) changes.title = title.trim()
    if (body.trim() !== note.body) changes.body = body.trim()
    if (revisitBy && revisitBy !== note.revisitBy) changes.revisitBy = revisitBy
    update.mutate({ current: note, changes }, { onSuccess: () => onAnnounce('Note updated.') })
    setEditing(false)
  }

  return (
    <li className={`surface rounded-md p-4 ${note.reviewed ? 'opacity-80' : ''}`}>
      {editing ? (
        <form onSubmit={save} className="space-y-3" aria-label={`Edit note: ${note.title}`}>
          <div>
            <label htmlFor={`${id}-t`} className="mb-1 block text-[0.8125rem] font-semibold text-muted">
              Title
            </label>
            <input id={`${id}-t`} value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} className={`${field} h-10`} />
          </div>
          <div>
            <label htmlFor={`${id}-b`} className="mb-1 block text-[0.8125rem] font-semibold text-muted">
              Notes
            </label>
            <textarea id={`${id}-b`} value={body} onChange={(e) => setBody(e.target.value)} rows={3} maxLength={4000} className={`${field} resize-y py-2`} />
          </div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <label htmlFor={`${id}-d`} className="mb-1 block text-[0.8125rem] font-semibold text-muted">
                Revisit by
              </label>
              <input id={`${id}-d`} type="date" value={revisitBy} onChange={(e) => setRevisitBy(e.target.value)} className={`${field} num h-10 w-auto`} />
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!title.trim()}>
                Save
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-start gap-3">
            <input
              id={`${id}-done`}
              type="checkbox"
              checked={note.reviewed}
              onChange={() =>
                toggle.mutate(note.id, { onSuccess: (n) => onAnnounce(n.reviewed ? 'Marked reviewed.' : 'Marked open.') })
              }
              className="mt-1 size-4 shrink-0 accent-[var(--color-ice)]"
              aria-describedby={`${id}-title`}
            />
            <div className="min-w-0 flex-1">
              <label htmlFor={`${id}-done`} className="sr-only">
                Reviewed
              </label>
              <p id={`${id}-title`} className={`font-semibold text-fg ${note.reviewed ? 'line-through decoration-muted/60' : ''}`}>
                {note.title}
              </p>
              {note.body && <p className="mt-1 text-[0.9375rem] leading-relaxed whitespace-pre-line text-muted">{note.body}</p>}
              {note.dataset && (
                <a
                  href={note.dataset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex max-w-full items-center gap-1.5 text-[0.875rem] text-ice underline decoration-ice/40 underline-offset-4 hover:decoration-ice"
                >
                  <span className="truncate">{note.dataset.title}</span>
                  <Icon name="external" size={14} />
                  <span className="sr-only"> (opens data.gov in a new tab)</span>
                </a>
              )}
              <p className="mt-2 text-[0.8125rem] text-muted">
                {note.reviewed ? 'Reviewed' : overdue ? 'Past its revisit date' : 'Open'}
                {note.revisitBy && (
                  <>
                    {' '}· Revisit by <span className="num text-fg/90">{formatDate(note.revisitBy)}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-end gap-2 border-t border-line pt-3">
            {confirming ? (
              <>
                <span className="mr-auto text-[0.875rem] text-fg">Delete this note?</span>
                <Button variant="secondary" size="sm" onClick={() => setConfirming(false)}>
                  No
                </Button>
                <Button
                  size="sm"
                  onClick={() => remove.mutate(note.id, { onSuccess: () => onAnnounce('Note deleted.') })}
                  disabled={remove.isPending}
                >
                  {remove.isPending ? 'Deleting…' : 'Yes, delete'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={startEditing} aria-label={`Edit note: ${note.title}`}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirming(true)} aria-label={`Delete note: ${note.title}`}>
                  Delete
                </Button>
              </>
            )}
          </div>
          {failed && <p className="mt-2 text-[0.8125rem] text-caution">{failed.message}</p>}
        </>
      )}
    </li>
  )
}
