import { useState, type FormEvent } from 'react'
import { PageMeta } from '../../components/PageMeta'
import { Button, ConfirmBar, Field, Modal } from '../../components/ui'
import { inputClass } from '../../lib/classes'
import { useApp } from '../../context/useApp'
import { PROJECT_CATEGORIES } from '../../lib/constants'
import { createId, slugify } from '../../lib/format'
import { unsplash } from '../../lib/images'
import type { Project, ProjectCategory } from '../../types'

const blank: Omit<Project, 'id'> = {
  slug: '',
  title: '',
  category: 'Living rooms',
  location: 'Bengaluru (fictional)',
  style: 'Warm contemporary',
  year: '2026',
  excerpt: '',
  description: '',
  coverImage: unsplash('photo-1600210492486-724fe5c67fb0'),
  gallery: [unsplash('photo-1600210492486-724fe5c67fb0')],
  featured: false,
}

export function AdminProjects() {
  const { state, dispatch, notify } = useApp()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState(blank)
  const [pending, setPending] = useState<string | null>(null)

  function startCreate() {
    setEditing(null)
    setForm(blank)
    setOpen(true)
  }

  function startEdit(project: Project) {
    setEditing(project)
    setForm({
      slug: project.slug,
      title: project.title,
      category: project.category,
      location: project.location,
      style: project.style,
      year: project.year,
      excerpt: project.excerpt,
      description: project.description,
      coverImage: project.coverImage,
      gallery: project.gallery,
      featured: project.featured,
    })
    setOpen(true)
  }

  function save(event: FormEvent) {
    event.preventDefault()
    if (form.title.trim().length < 2) {
      notify('error', 'A project title is required')
      return
    }
    const project: Project = {
      ...form,
      id: editing?.id ?? createId('proj'),
      slug: form.slug || slugify(form.title),
      title: form.title.trim(),
      excerpt: form.excerpt || form.description.slice(0, 120),
      gallery: form.gallery.length ? form.gallery : [form.coverImage],
    }
    dispatch({ type: 'upsert-project', project })
    notify('success', editing ? 'Project updated' : 'Project added')
    setOpen(false)
  }

  return (
    <>
      <PageMeta title="Projects admin" description="CRUD for sample interior projects." />
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-4xl text-forest">Projects</h1>
        <Button type="button" onClick={startCreate}>
          New sample project
        </Button>
      </div>
      <ul className="mt-6 space-y-3">
        {state.projects.map((project) => (
          <li key={project.id} className="rounded-sm bg-paper p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl text-forest">{project.title}</h2>
                <p className="text-sm text-ink-muted">
                  {project.category} · {project.location}
                </p>
              </div>
              {pending === project.id ? (
                <ConfirmBar
                  question={`Remove ${project.title}?`}
                  onCancel={() => setPending(null)}
                  onConfirm={() => {
                    dispatch({ type: 'delete-project', id: project.id })
                    setPending(null)
                    notify('info', 'Project removed')
                  }}
                />
              ) : (
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={() => startEdit(project)}>
                    Edit
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setPending(project.id)}>
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      <Modal open={open} title={editing ? 'Edit project' : 'New sample project'} onClose={() => setOpen(false)}>
        <form className="space-y-3" onSubmit={save}>
          <Field label="Title">
            <input className={inputClass()} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Category">
            <select
              className={inputClass()}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ProjectCategory })}
            >
              {PROJECT_CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </Field>
          <Field label="Location (fictional)">
            <input
              className={inputClass()}
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </Field>
          <Field label="Style">
            <input className={inputClass()} value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} />
          </Field>
          <Field label="Description">
            <textarea
              rows={4}
              className={inputClass()}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured on homepage
          </label>
          <Button type="submit">Save</Button>
        </form>
      </Modal>
    </>
  )
}
