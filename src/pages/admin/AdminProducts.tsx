import { useState, type FormEvent } from 'react'
import { PageMeta } from '../../components/PageMeta'
import { Button, ConfirmBar, Field, Modal } from '../../components/ui'
import { inputClass } from '../../lib/classes'
import { useApp } from '../../context/useApp'
import { PRODUCT_CATEGORIES } from '../../lib/constants'
import { createId, formatInr, slugify } from '../../lib/format'
import { unsplash } from '../../lib/images'
import type { Product, ProductCategory } from '../../types'

const blank: Omit<Product, 'id'> = {
  slug: '',
  name: '',
  category: 'Seating',
  priceInr: 0,
  rating: 4.5,
  reviewCount: 0,
  materials: '',
  dimensions: '',
  description: '',
  details: ['Sample product created in the demo dashboard'],
  image: unsplash('photo-1555041469-a586c61ea9bc'),
  featured: false,
}

export function AdminProducts() {
  const { state, dispatch, notify } = useApp()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(blank)
  const [pending, setPending] = useState<string | null>(null)

  function startCreate() {
    setEditing(null)
    setForm(blank)
    setOpen(true)
  }

  function startEdit(product: Product) {
    setEditing(product)
    setForm({
      slug: product.slug,
      name: product.name,
      category: product.category,
      priceInr: product.priceInr,
      rating: product.rating,
      reviewCount: product.reviewCount,
      materials: product.materials,
      dimensions: product.dimensions,
      description: product.description,
      details: product.details,
      image: product.image,
      featured: product.featured,
    })
    setOpen(true)
  }

  function save(event: FormEvent) {
    event.preventDefault()
    if (form.name.trim().length < 2 || form.priceInr <= 0) {
      notify('error', 'Name and a price above zero are required')
      return
    }
    const product: Product = {
      ...form,
      id: editing?.id ?? createId('prod'),
      slug: form.slug || slugify(form.name),
      name: form.name.trim(),
    }
    dispatch({ type: 'upsert-product', product })
    notify('success', editing ? 'Product updated' : 'Product added')
    setOpen(false)
  }

  return (
    <>
      <PageMeta title="Products" description="CRUD for sample catalogue pieces." />
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-4xl text-forest">Products</h1>
        <Button type="button" onClick={startCreate}>
          New sample product
        </Button>
      </div>
      <div className="mt-6 overflow-x-auto rounded-sm bg-paper">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-ivory-deep text-xs uppercase tracking-wider text-ink-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.products.map((product) => (
              <tr key={product.id} className="border-b border-ivory-deep/70">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">{formatInr(product.priceInr)}</td>
                <td className="px-4 py-3">
                  {pending === product.id ? (
                    <ConfirmBar
                      question={`Remove ${product.name}?`}
                      onCancel={() => setPending(null)}
                      onConfirm={() => {
                        dispatch({ type: 'delete-product', id: product.id })
                        setPending(null)
                        notify('info', 'Product removed')
                      }}
                    />
                  ) : (
                    <div className="flex gap-2">
                      <Button type="button" variant="ghost" onClick={() => startEdit(product)}>
                        Edit
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => setPending(product.id)}>
                        Delete
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editing ? 'Edit product' : 'New sample product'} onClose={() => setOpen(false)}>
        <form className="space-y-3" onSubmit={save}>
          <Field label="Name">
            <input className={inputClass()} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Category">
            <select
              className={inputClass()}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
            >
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </Field>
          <Field label="Price (INR)">
            <input
              type="number"
              className={inputClass()}
              value={form.priceInr}
              onChange={(e) => setForm({ ...form, priceInr: Number(e.target.value) })}
            />
          </Field>
          <Field label="Short description">
            <textarea
              className={inputClass()}
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
          <Field label="Materials">
            <input
              className={inputClass()}
              value={form.materials}
              onChange={(e) => setForm({ ...form, materials: e.target.value })}
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
