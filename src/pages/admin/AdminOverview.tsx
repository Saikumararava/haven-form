import { Link } from 'react-router-dom'
import { PageMeta } from '../../components/PageMeta'
import { Button } from '../../components/ui'
import { useApp } from '../../context/useApp'
import { formatDate } from '../../lib/format'

export function AdminOverview() {
  const { state, dispatch, notify } = useApp()
  const total = state.enquiries.length
  const fresh = state.enquiries.filter((item) => item.status === 'new').length
  const contacted = state.enquiries.filter((item) => item.status === 'contacted').length
  const converted = state.enquiries.filter((item) => item.status === 'converted').length
  const recent = [...state.enquiries]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5)

  const cards = [
    { label: 'Total enquiries', value: total, to: '/admin/enquiries' },
    { label: 'New', value: fresh, to: '/admin/enquiries?status=new' },
    { label: 'Contacted', value: contacted, to: '/admin/enquiries?status=contacted' },
    { label: 'Converted (demo)', value: converted, to: '/admin/enquiries?status=converted' },
  ]

  return (
    <>
      <PageMeta title="Demo dashboard" description="Sample operations overview for Haven & Form." />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-forest">Overview</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Counts are computed from sample records in this browser.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            dispatch({ type: 'reset' })
            notify('info', 'Demo data restored', 'Seeded enquiries, products and projects are back.')
          }}
        >
          Reset sample data
        </Button>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="rounded-sm bg-paper p-5 transition hover:-translate-y-0.5"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-copper">{card.label}</p>
            <p className="mt-3 font-serif text-4xl text-forest">{card.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-10 overflow-x-auto rounded-sm bg-paper">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <caption className="sr-only">Recent sample enquiries</caption>
          <thead className="border-b border-ivory-deep text-xs uppercase tracking-wider text-ink-muted">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((item) => (
              <tr key={item.id} className="border-b border-ivory-deep/70">
                <td className="px-4 py-3">{item.reference}</td>
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3 capitalize">{item.status}</td>
                <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
