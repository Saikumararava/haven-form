import { Heart } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '../components/cards'
import { PageMeta } from '../components/PageMeta'
import { Badge, Button, SmartImage, StarRating } from '../components/ui'
import { useApp, useProduct } from '../context/useApp'
import { formatInr } from '../lib/format'

export function ProductDetailPage() {
  const { slug } = useParams()
  const product = useProduct(slug)
  const { state, dispatch, notify } = useApp()

  if (!product) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-serif text-4xl text-forest">Piece not found</h1>
        <Link to="/shop" className="mt-6 inline-block text-forest underline">
          Back to shop
        </Link>
      </section>
    )
  }

  const saved = state.wishlist.includes(product.id)

  return (
    <>
      <PageMeta title={product.name} description={product.description} />
      <article className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:px-6">
        <SmartImage
          src={product.image}
          alt={`${product.name} — ${product.materials}`}
          className="aspect-[4/5] w-full object-cover"
        />
        <div>
          <Badge>{product.category}</Badge>
          <h1 className="mt-4 font-serif text-5xl text-forest">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <StarRating value={product.rating} />
            <span className="text-sm text-ink-muted">{product.reviewCount} sample ratings</span>
          </div>
          <p className="mt-4 text-2xl text-forest">{formatInr(product.priceInr)}</p>
          <p className="mt-6 leading-relaxed text-ink-muted">{product.description}</p>
          <dl className="mt-6 grid gap-3 text-sm">
            <div>
              <dt className="text-ink-muted">Materials</dt>
              <dd>{product.materials}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Dimensions</dt>
              <dd>{product.dimensions}</dd>
            </div>
          </dl>
          <ul className="mt-6 list-disc space-y-1 pl-5 text-sm text-ink-muted">
            {product.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() => {
                dispatch({ type: 'add-to-cart', productId: product.id })
                notify('success', 'Added to cart', 'Open the bag when you are ready to enquire.')
              }}
            >
              Add to cart
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => dispatch({ type: 'toggle-wishlist', productId: product.id })}
            >
              <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
              {saved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>
      </article>
      {state.products.some((item) => item.category === product.category && item.id !== product.id) ? (
        <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
          <h2 className="font-serif text-3xl text-forest">Nearby in the catalogue</h2>
          <p className="mt-2 text-sm text-ink-muted">Other sample pieces in {product.category}.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {state.products
              .filter((item) => item.category === product.category && item.id !== product.id)
              .slice(0, 3)
              .map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
