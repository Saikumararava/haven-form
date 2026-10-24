import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageMeta } from '../../components/PageMeta'
import { ConfirmBar, Button, Field } from '../../components/ui'
import { inputClass } from '../../lib/classes'
import { useApp } from '../../context/useApp'
import { formatDate } from '../../lib/format'
import type { EnquiryPriority, EnquiryStatus } from '../../types'

const statuses: EnquiryStatus[] = ['new', 'contacted', 'converted', 'archived']
const priorities: EnquiryPriority[] = ['low', 'medium', 'high']

export function AdminEnquiries() {
  const { state, dispatch, notify } = useApp()
  const [params, setParams] = useSearchParams()
  const statusFilter = params.get('status') ?? 'all'
  const [query, setQuery] = useState('')
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return state.enquiries.filter((item) => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      const haystack = `${item.name} ${item.email} ${item.reference} ${item.service}`.toLowerCase()
      return matchesStatus && (!needle || haystack.includes(needle))
    })
  }, [state.enquiries, statusFilter, query])

  return (
    <>
      <PageMeta title="Enquiries" description="Manage sample enquiries stored in this browser." />
      <h1 className="font-serif text-4xl text-forest">Enquiries</h1>
      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <select
          className={inputClass()}
          value={statusFilter}
          onChange={(event) => {
            const value = event.target.value
            if (value === 'all') setParams({})
            else setParams({ status: value })
          }}
        >
          <option value="all">All statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <input
          className={inputClass()}
          placeholder="Search name, email, reference"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="mt-6 space-y-4">
        {rows.length === 0 ? (
          <p className="text-ink-muted">No sample enquiries match these filters.</p>
        ) : (
          rows.map((item) => (
            <article key={item.id} className="rounded-sm bg-paper p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-copper">{item.reference}</p>
                  <h2 className="mt-1 font-serif text-2xl text-forest">{item.name}</h2>
                  <p className="text-sm text-ink-muted">
                    {item.email} · {item.phone} · {formatDate(item.createdAt)}
                  </p>
                </div>
                <p className="text-xs uppercase tracking-wider text-ink-muted">{item.source}</p>
              </div>
              <p className="mt-4 text-sm leading-relaxed">{item.message}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <Field label="Status">
                  <select
                    className={inputClass()}
                    value={item.status}
                    onChange={(event) =>
                      dispatch({
                        type: 'update-enquiry',
                        id: item.id,
                        patch: { status: event.target.value as EnquiryStatus },
                      })
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Priority">
                  <select
                    className={inputClass()}
                    value={item.priority}
                    onChange={(event) =>
                      dispatch({
                        type: 'update-enquiry',
                        id: item.id,
                        patch: { priority: event.target.value as EnquiryPriority },
                      })
                    }
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Service">
                  <p className="py-2.5 text-sm">{item.service} · {item.budget}</p>
                </Field>
              </div>
              <Field label="Internal notes" hint="Saved in this browser only.">
                <textarea
                  className={inputClass()}
                  rows={2}
                  value={item.notes}
                  onChange={(event) =>
                    dispatch({
                      type: 'update-enquiry',
                      id: item.id,
                      patch: { notes: event.target.value },
                    })
                  }
                />
              </Field>
              {pendingDelete === item.id ? (
                <div className="mt-4">
                  <ConfirmBar
                    question={`Delete ${item.reference}? This only removes the demo record.`}
                    onCancel={() => setPendingDelete(null)}
                    onConfirm={() => {
                      dispatch({ type: 'delete-enquiry', id: item.id })
                      setPendingDelete(null)
                      notify('info', 'Enquiry deleted')
                    }}
                  />
                </div>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-4 text-copper"
                  onClick={() => setPendingDelete(item.id)}
                >
                  Delete demo record
                </Button>
              )}
            </article>
          ))
        )}
      </div>
    </>
  )
}
