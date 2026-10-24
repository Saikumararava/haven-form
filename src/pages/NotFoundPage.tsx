import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { Button } from '../components/ui'

export function NotFoundPage() {
  return (
    <>
      <PageMeta title="Page not found" description="This path does not exist on the Haven & Form demo site." />
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-copper">404</p>
        <h1 className="mt-4 font-serif text-5xl text-forest">This room was never drawn.</h1>
        <p className="mt-4 text-ink-muted">
          The page you asked for is not part of the sample site. Return home, or walk the projects
          gallery.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/">
            <Button type="button">Home</Button>
          </Link>
          <Link to="/projects">
            <Button type="button" variant="secondary">
              Projects
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
