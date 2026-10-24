import { LayoutDashboard, Mail, Package, PanelsTopLeft } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { DemoNotice } from '../../components/DemoNotice'
import { ToastStack } from '../../components/ToastStack'
import { Button, Field } from '../../components/ui'
import { inputClass } from '../../lib/classes'
import { DEMO_ACCESS_CODE, DEMO_ACCESS_KEY } from '../../lib/constants'

const nav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Mail, end: false },
  { to: '/admin/products', label: 'Products', icon: Package, end: false },
  { to: '/admin/projects', label: 'Projects', icon: PanelsTopLeft, end: false },
]

export function AdminLayout() {
  const [unlocked, setUnlocked] = useState(
    () => typeof window !== 'undefined' && sessionStorage.getItem(DEMO_ACCESS_KEY) === '1',
  )
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function enterDemo(event: FormEvent) {
    event.preventDefault()
    if (code.trim() !== DEMO_ACCESS_CODE) {
      setError('Use the printed demo code. This is not authentication.')
      return
    }
    sessionStorage.setItem(DEMO_ACCESS_KEY, '1')
    setUnlocked(true)
  }

  if (!unlocked) {
    return (
      <div className="min-h-svh bg-ivory px-4 py-16">
        <div className="mx-auto max-w-lg rounded-sm border border-ivory-deep bg-paper p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-copper">Demo dashboard access</p>
          <h1 className="mt-3 font-serif text-4xl text-forest">Not a login.</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            This screen exists so reviewers can see a labelled gate. It is client-side only, stored
            in sessionStorage, and is <strong>not</strong> production security. The access code is
            printed below on purpose.
          </p>
          <DemoNotice className="mt-6" />
          <p className="mt-6 rounded-sm bg-ivory px-3 py-2 text-sm">
            Demo code: <code className="text-forest">{DEMO_ACCESS_CODE}</code>
          </p>
          <form className="mt-6 space-y-4" onSubmit={enterDemo}>
            <Field label="Enter demo code" error={error}>
              <input
                className={inputClass(error)}
                value={code}
                onChange={(event) => setCode(event.target.value)}
                autoComplete="off"
              />
            </Field>
            <Button type="submit">Open sample dashboard</Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-ivory md:grid md:grid-cols-[16rem_1fr]">
      <aside className="border-b border-ivory-deep bg-forest text-ivory md:min-h-svh md:border-r md:border-b-0">
        <div className="px-5 py-6">
          <p className="font-serif text-2xl">Haven & Form</p>
          <p className="text-xs uppercase tracking-[0.18em] text-copper-soft">Demo ops</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-4 md:flex-col">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-sm px-3 py-2 text-sm whitespace-nowrap ${
                  isActive ? 'bg-ivory/15' : 'text-ivory/75 hover:bg-ivory/10'
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <a href="/" className="mx-5 mb-6 hidden text-sm text-ivory/70 md:inline-block">
          ← Public site
        </a>
      </aside>
      <div className="flex min-h-svh flex-col">
        <div className="border-b border-ivory-deep px-4 py-3 md:px-8">
          <DemoNotice />
        </div>
        <div className="flex-1 px-4 py-8 md:px-8">
          <Outlet />
        </div>
      </div>
      <ToastStack />
    </div>
  )
}
