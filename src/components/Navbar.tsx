import { Heart, Menu, ShoppingBag, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { BRAND } from '../lib/constants'

const links = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const { itemCount, state } = useApp()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-ivory-deep/80 bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/" className="group flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-serif text-2xl text-forest">{BRAND}</span>
          <span className="hidden text-[10px] uppercase tracking-[0.22em] text-copper sm:inline">
            Studio
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `nav-link text-sm tracking-wide ${
                  isActive ? 'is-active text-forest' : 'text-ink-muted hover:text-forest'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/shop?saved=1"
            className="relative rounded-sm p-2 text-forest hover:bg-ivory-deep"
            aria-label={`Wishlist, ${state.wishlist.length} saved`}
          >
            <Heart size={18} />
            {state.wishlist.length > 0 ? (
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-copper" />
            ) : null}
          </Link>
          <Link
            to="/cart"
            className="relative rounded-sm p-2 text-forest hover:bg-ivory-deep"
            aria-label={`Cart, ${itemCount} items`}
          >
            <ShoppingBag size={18} />
            {itemCount > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 rounded-full bg-forest px-1 text-center text-[10px] text-ivory">
                {itemCount}
              </span>
            ) : null}
          </Link>
            <Link
              to="/contact"
              className="hidden rounded-sm bg-forest px-4 py-2 text-sm text-ivory hover:bg-forest-mid md:inline-flex"
            >
              Book a Consultation
            </Link>
            <Link
              to="/admin"
              className="hidden text-xs tracking-wide text-ink-muted hover:text-forest xl:inline"
            >
              Demo
            </Link>
          <button
            type="button"
            className="rounded-sm p-2 text-forest lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-ivory-deep bg-paper px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className="py-1 text-forest"
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-sm bg-forest px-4 py-2.5 text-center text-sm text-ivory"
            >
              Book a Consultation
            </Link>
            <Link to="/admin" onClick={() => setOpen(false)} className="text-sm text-ink-muted">
              Demo dashboard
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
