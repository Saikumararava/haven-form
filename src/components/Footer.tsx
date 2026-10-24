import { Link } from 'react-router-dom'
import {
  BRAND,
  STUDIO_ADDRESS,
  STUDIO_EMAIL,
  WHATSAPP_PLACEHOLDER_DISPLAY,
  whatsappHref,
} from '../lib/constants'

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="mt-auto border-t border-ivory-deep bg-forest text-ivory">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <p className="font-serif text-3xl">{BRAND}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/75">
            A fictional interior design and furniture studio created as a portfolio
            demonstration. Not a real company, not a live shop, and not client work.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-copper-soft">Visit</p>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            <li>
              <Link to="/projects" className="hover:text-ivory">
                Projects
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-ivory">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-ivory">
                About
              </Link>
            </li>
            <li>
              <Link to="/case-study" className="hover:text-ivory">
                Project case study
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-ivory">
                Demo dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-copper-soft">Studio</p>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            <li>{STUDIO_ADDRESS}</li>
            <li>
              <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>
            </li>
            <li>
              WhatsApp placeholder:{' '}
              <a href={whatsappHref()} className="underline decoration-copper-soft/50">
                {WHATSAPP_PLACEHOLDER_DISPLAY}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10 px-4 py-4 text-center text-xs text-ivory/60">
        © {CURRENT_YEAR} {BRAND} · Fictional portfolio project · Sample data lives in
        this browser only
      </div>
    </footer>
  )
}
