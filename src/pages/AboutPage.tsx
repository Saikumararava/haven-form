import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { Button, SectionHeading, SmartImage } from '../components/ui'
import { unsplash } from '../lib/images'

export function AboutPage() {
  return (
    <>
      <PageMeta
        title="About the fictional studio"
        description="Haven & Form is a made-up interior practice created as a developer portfolio piece."
      />
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <p className="text-xs uppercase tracking-[0.28em] text-copper">The studio</p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl text-forest md:text-6xl">
          A practice invented so the work can be shown.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
          Haven & Form does not exist as a company. It is a carefully designed sample brand for an
          App and Web Developer interview — a place to demonstrate typography, product flow, and a
          dashboard that actually works.
        </p>
      </section>
      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
          <SmartImage
            src={unsplash('photo-1618221195710-dd6b41faaea6')}
            alt="Warm contemporary sitting room used as studio mood"
            className="aspect-[4/5] w-full object-cover"
          />
          <div>
            <SectionHeading
              title="How the fiction is held"
              copy="Every room, price, testimonial and enquiry is labelled as sample content. The WhatsApp number is a replaceable placeholder. Nothing here should be mistaken for a live interior firm."
            />
            <ul className="mt-8 space-y-4 text-sm leading-relaxed text-ink-muted">
              <li>
                <strong className="text-forest">Language.</strong> Quiet luxury without costume —
                ivory, forest, charcoal, a little copper.
              </li>
              <li>
                <strong className="text-forest">Catalogue.</strong> INR pricing, ratings, and a demo
                cart that ends in an enquiry, never a charge.
              </li>
              <li>
                <strong className="text-forest">Operations.</strong> A labelled demo dashboard stores
                leads in localStorage on this device.
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact">
                <Button type="button">Book a consultation</Button>
              </Link>
              <Link to="/case-study">
                <Button type="button" variant="secondary">
                  Engineering notes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
