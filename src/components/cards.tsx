import { ArrowUpRight, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/useApp'
import { formatInr } from '../lib/format'
import type { Product, Project } from '../types'
import { Badge, Button, SmartImage, StarRating } from './ui'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group overflow-hidden rounded-sm bg-paper shadow-[0_20px_40px_-28px_rgba(30,58,47,0.45)]">
      <Link to={`/projects/${project.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <SmartImage
            src={project.coverImage}
            alt={`${project.title} — ${project.style} interior in ${project.location}`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <span className="absolute top-3 left-3">
            <Badge>{project.category}</Badge>
          </span>
        </div>
        <div className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-copper">{project.location}</p>
          <h3 className="mt-2 font-serif text-2xl text-forest">{project.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{project.excerpt}</p>
          <p className="mt-4 inline-flex items-center gap-1 text-sm text-forest">
            View project <ArrowUpRight size={14} />
          </p>
        </div>
      </Link>
    </article>
  )
}

export function ProductCard({
  product,
  onQuickView,
}: {
  product: Product
  onQuickView?: (product: Product) => void
}) {
  const { state, dispatch, notify } = useApp()
  const saved = state.wishlist.includes(product.id)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-sm bg-paper">
      <Link to={`/shop/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden">
        <SmartImage
          src={product.image}
          alt={`${product.name}, ${product.category}`}
          className="h-full w-full object-cover transition duration-700 hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-ink-muted">
              {product.category}
            </p>
            <h3 className="mt-1 font-serif text-xl text-forest">
              <Link to={`/shop/${product.slug}`}>{product.name}</Link>
            </h3>
          </div>
          <button
            type="button"
            aria-pressed={saved}
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            className="rounded-full p-2 text-forest hover:bg-ivory-deep"
            onClick={() => {
              dispatch({ type: 'toggle-wishlist', productId: product.id })
              notify('info', saved ? 'Removed from wishlist' : 'Saved to wishlist')
            }}
          >
            <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="mt-2">
          <StarRating value={product.rating} />
        </div>
        <p className="mt-3 mb-4 text-sm text-forest">{formatInr(product.priceInr)}</p>
        <div className="mt-auto flex gap-2">
          <Button
            type="button"
            className="flex-1"
            onClick={() => {
              dispatch({ type: 'add-to-cart', productId: product.id })
              notify('success', 'Added to cart', `${product.name} is waiting in your sample bag.`)
            }}
          >
            Add to cart
          </Button>
          {onQuickView ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => onQuickView(product)}
              aria-label={`Quick view ${product.name}`}
            >
              Quick view
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  )
}
