import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ProjectCard } from '../components/cards'
import { PageMeta } from '../components/PageMeta'
import { EmptyState } from '../components/ui'
import { inputClass } from '../lib/classes'
import { useApp } from '../context/useApp'
import { PROJECT_CATEGORIES } from '../lib/constants'
import type { ProjectCategory } from '../types'

export function ProjectsPage() {
  const { state } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ProjectCategory | 'All'>('All')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return state.projects.filter((project) => {
      const matchesCategory = category === 'All' || project.category === category
      const haystack = `${project.title} ${project.style} ${project.location} ${project.excerpt}`.toLowerCase()
      const matchesQuery = !needle || haystack.includes(needle)
      return matchesCategory && matchesQuery
    })
  }, [state.projects, query, category])

  return (
    <>
      <PageMeta
        title="Projects"
        description="A fictional gallery of living rooms, bedrooms, offices and hospitality interiors."
      />
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <h1 className="font-serif text-5xl text-forest">Projects</h1>
        <p className="mt-4 max-w-2xl text-ink-muted">
          Filter by room type or search by style and place. Locations are fictional; the rooms are
          sample schemes.
        </p>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Project categories">
            {(['All', ...PROJECT_CATEGORIES] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-4 py-1.5 text-sm ${
                  category === item ? 'bg-forest text-ivory' : 'bg-paper text-forest hover:bg-ivory-deep'
                }`}
                aria-pressed={category === item}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="relative block w-full md:max-w-xs">
            <span className="sr-only">Search projects</span>
            <Search size={16} className="absolute top-3 left-3 text-ink-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search style, place, title"
              className={`${inputClass()} pl-9`}
            />
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              title="No rooms match"
              copy="Try another category or clear the search. The gallery is a small sample set."
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
