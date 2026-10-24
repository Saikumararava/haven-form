import { Link, useParams } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { Badge, Button, SmartImage } from '../components/ui'
import { useProject } from '../context/useApp'
import { whatsappHref } from '../lib/constants'

export function ProjectDetailPage() {
  const { slug } = useParams()
  const project = useProject(slug)

  if (!project) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-serif text-4xl text-forest">Project not found</h1>
        <p className="mt-3 text-ink-muted">This scheme may have been removed in the demo dashboard.</p>
        <Link to="/projects" className="mt-6 inline-block text-forest underline">
          Back to projects
        </Link>
      </section>
    )
  }

  return (
    <>
      <PageMeta title={project.title} description={project.excerpt} />
      <article className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-copper">{project.category}</p>
        <h1 className="mt-3 font-serif text-5xl text-forest">{project.title}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{project.style}</Badge>
          <Badge>{project.location}</Badge>
          <Badge>{project.year}</Badge>
        </div>
        <div className="mt-8 overflow-hidden rounded-sm">
          <SmartImage
            src={project.coverImage}
            alt={`${project.title} cover — ${project.style} interior`}
            className="aspect-[16/8] w-full object-cover"
          />
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-[1.4fr_0.8fr]">
          <div>
            <p className="text-lg leading-relaxed text-ink-muted">{project.description}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {project.gallery.map((image) => (
                <SmartImage
                  key={image}
                  src={image}
                  alt={`${project.title} gallery view`}
                  className="aspect-[4/3] w-full object-cover"
                />
              ))}
            </div>
          </div>
          <aside className="h-fit border border-ivory-deep bg-paper p-6">
            <h2 className="font-serif text-2xl text-forest">Enquire about this room</h2>
            <p className="mt-3 text-sm text-ink-muted">
              Opens a sample consultation form with this project in mind. No real booking is made.
            </p>
            <Link to={`/contact?project=${project.slug}`} className="mt-5 block">
              <Button type="button" className="w-full">
                Start an enquiry
              </Button>
            </Link>
            <a href={whatsappHref(`Hello Haven & Form (demo). I am looking at ${project.title}.`)} className="mt-3 block">
              <Button type="button" variant="secondary" className="w-full">
                WhatsApp placeholder
              </Button>
            </a>
          </aside>
        </div>
      </article>
    </>
  )
}
