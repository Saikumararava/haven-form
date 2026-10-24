import { PageMeta } from '../components/PageMeta'

const blocks = [
  {
    title: 'Problem',
    copy: 'An advertising and branding agency interview needs more than a résumé: a site that feels like a studio, with working customer flows and an operations view. Generic templates fail that test.',
  },
  {
    title: 'Solution',
    copy: 'Haven & Form is a fictional premium interior brand. The public site sells a language; the shop and enquiry form capture intent; the dashboard lets a reviewer mutate sample data and see it persist in the browser.',
  },
  {
    title: 'Tech stack',
    copy: 'React 19, Vite, TypeScript, Tailwind CSS v4, React Router, Lucide icons, Vitest, and localStorage. No paid APIs, no environment secrets, ready for a static Vercel deploy.',
  },
]

export function CaseStudyPage() {
  return (
    <>
      <PageMeta
        title="Project case study"
        description="How Haven & Form was designed as a portfolio demonstration for an agency interview."
      />
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <p className="text-xs uppercase tracking-[0.28em] text-copper">Case study</p>
        <h1 className="mt-4 font-serif text-5xl text-forest">Building a studio that is allowed to be fictional.</h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-muted">
          The constraint was honesty: never pretend this is client work, never fake a payment,
          never invent a live phone number. The opportunity was craft — editorial type, a warm
          palette, and software that actually does something.
        </p>
        <div className="mt-12 space-y-8">
          {blocks.map((block) => (
            <article key={block.title} className="border-t border-ivory-deep pt-6">
              <h2 className="font-serif text-3xl text-forest">{block.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-muted">{block.copy}</p>
            </article>
          ))}
          <article className="border-t border-ivory-deep pt-6">
            <h2 className="font-serif text-3xl text-forest">Features shown</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-muted">
              <li>Sticky navigation, mobile menu, SEO titles, 404, and labelled demo access.</li>
              <li>Project gallery with search, category filters, and detail pages.</li>
              <li>Shop with sort, wishlist, cart quantities, subtotal, and empty states.</li>
              <li>Validated enquiry form with generated references written to localStorage.</li>
              <li>Admin overview, enquiry pipeline, and CRUD for sample products and projects.</li>
            </ul>
          </article>
        </div>
      </section>
    </>
  )
}
