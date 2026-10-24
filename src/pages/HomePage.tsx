import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProjectCard, ProductCard } from '../components/cards'
import { PageMeta } from '../components/PageMeta'
import { Badge, Button, SectionHeading, SmartImage } from '../components/ui'
import { useApp } from '../context/useApp'
import { demoTestimonials, services } from '../data/seed'
import { unsplash } from '../lib/images'

export function HomePage() {
  const { state } = useApp()
  const featuredProjects = state.projects.filter((project) => project.featured)
  const featuredProducts = state.products.filter((product) => product.featured).slice(0, 4)

  return (
    <>
      <PageMeta
        title="Interiors composed with quiet luxury"
        description="Haven & Form is a fictional premium interior studio and furniture catalogue — a portfolio website for interview demonstration."
      />

      <section className="relative isolate min-h-[88vh] overflow-hidden">
        <SmartImage
          src={unsplash('photo-1600210492486-724fe5c67fb0', 2000)}
          alt="Sunlit living room with linen sofas, oak floors and a quiet garden court"
          className="absolute inset-0 h-full w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/45 to-charcoal/10" />
        <div className="grain pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 py-20 md:px-6 md:py-28">
          <Badge>Fictional studio · Portfolio demonstration</Badge>
          <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[1.05] text-ivory md:text-7xl">
            Rooms composed for slower living.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/85 md:text-lg">
            Haven & Form is a sample interior practice: warm ivory, forest greens, and furniture
            that earns the floorplan. This site is built to show craft — not to sell a real studio.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/projects">
              <Button type="button">View projects</Button>
            </Link>
            <Link to="/contact">
              <Button type="button" variant="secondary" className="border-ivory text-ivory hover:bg-ivory hover:text-forest">
                Book a consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-ivory-deep bg-paper">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
          <p className="text-sm leading-relaxed text-ink-muted">
            <span className="block font-serif text-3xl text-forest">8</span>
            Sample rooms in the gallery — living, sleep, work, and hospitality.
          </p>
          <p className="text-sm leading-relaxed text-ink-muted">
            <span className="block font-serif text-3xl text-forest">12</span>
            Catalogue pieces with INR prices. Saved locally, never charged.
          </p>
          <p className="text-sm leading-relaxed text-ink-muted">
            <span className="block font-serif text-3xl text-forest">4</span>
            Studio services described as they would be briefed to a real team.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Selected rooms"
            title="Featured projects"
            copy="Living rooms, bedrooms, offices and hospitality — all fictional schemes created for this portfolio."
          />
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-forest">
            Full gallery <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:px-6">
          <SectionHeading
            eyebrow="How we work"
            title="Four quiet services"
            copy="The same language from first measure to dressed room. None of these are live client retainers."
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {services.map((service, index) => (
              <article key={service.title} className="border-t border-ivory-deep pt-4">
                <p className="text-xs tracking-[0.2em] text-copper">0{index + 1}</p>
                <h3 className="mt-2 font-serif text-2xl text-forest">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{service.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Sample catalogue"
            title="Furniture with a pulse"
            copy="Prices in INR. Pieces can be saved, bagged, and enquired about — no payments are processed."
          />
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-forest">
            Open the shop <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-forest text-ivory">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <p className="text-xs uppercase tracking-[0.28em] text-copper-soft">
            Sample testimonials · demo copy
          </p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">What a room should feel like.</h2>
          <p className="mt-3 max-w-xl text-ivory/70">
            These quotes are labelled sample content. They are not real client reviews.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {demoTestimonials.map((item) => (
              <blockquote key={item.name} className="border border-ivory/15 bg-forest-mid/40 p-6">
                <p className="font-serif text-xl leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
                <footer className="mt-6 text-sm text-ivory/70">
                  <cite className="not-italic">{item.name}</cite>
                  <div>{item.role}</div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="For the interview"
              title="A website as a case study"
              copy="Built to show product thinking, editorial UI, and a working demo dashboard — the kind of artefact an advertising and branding agency can click through."
            />
            <Link to="/case-study" className="mt-6 inline-block">
              <Button type="button" variant="secondary">
                Read the case study
              </Button>
            </Link>
          </div>
          <SmartImage
            src={unsplash('photo-1616486338812-3dadae4b4ace', 1400)}
            alt="Editorial interior with a long oak table and linen drapery"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </section>
    </>
  )
}
