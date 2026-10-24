import { Heart, LayoutGrid, List, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/cards'
import { PageMeta } from '../components/PageMeta'
import { Badge, EmptyState, Modal, StarRating, Button, SmartImage } from '../components/ui'
import { inputClass } from '../lib/classes'
import { useApp } from '../context/useApp'
import { PRODUCT_CATEGORIES } from '../lib/constants'
import { formatInr } from '../lib/format'
import type { Product, ProductCategory } from '../types'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating'

export function ShopPage() {
  const { state, dispatch, notify } = useApp()
  const [params] = useSearchParams()
  const savedOnly = params.get('saved') === '1'
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ProductCategory | 'All'>('All')
  const [sort, setSort] = useState<SortKey>('featured')
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const list = state.products.filter((product) => {
      if (savedOnly && !state.wishlist.includes(product.id)) return false
      const matchesCategory = category === 'All' || product.category === category
      const haystack = `${product.name} ${product.category} ${product.materials}`.toLowerCase()
      return matchesCategory && (!needle || haystack.includes(needle))
    })
    return [...list].sort((a, b) => {
      if (sort === 'price-asc') return a.priceInr - b.priceInr
      if (sort === 'price-desc') return b.priceInr - a.priceInr
      if (sort === 'rating') return b.rating - a.rating
      return Number(b.featured) - Number(a.featured)
    })
  }, [state.products, state.wishlist, query, category, sort, savedOnly])

  return (
    <>
      <PageMeta
        title={savedOnly ? 'Wishlist' : 'Shop'}
        description="Sample furniture catalogue with INR pricing, filters, wishlist and a demo cart."
      />
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <h1 className="font-serif text-5xl text-forest">{savedOnly ? 'Wishlist' : 'Shop'}</h1>
        <p className="mt-4 max-w-2xl text-ink-muted">
          {savedOnly
            ? 'Pieces you saved in this browser. Nothing is synced to a server.'
            : 'A sample catalogue. Add to cart, save pieces, then send a demo enquiry — no payment is taken.'}
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Product categories">
            {(['All', ...PRODUCT_CATEGORIES] as const).map((item) => (
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
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="relative block flex-1">
              <span className="sr-only">Search products</span>
              <Search size={16} className="absolute top-3 left-3 text-ink-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, material, category"
                className={`${inputClass()} pl-9`}
              />
            </label>
            <label className="text-sm">
              <span className="sr-only">Sort</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className={inputClass()}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price · low to high</option>
                <option value="price-desc">Price · high to low</option>
                <option value="rating">Rating</option>
              </select>
            </label>
            <div className="flex gap-1">
              <button
                type="button"
                className={`rounded-sm p-2 ${layout === 'grid' ? 'bg-forest text-ivory' : 'bg-paper'}`}
                onClick={() => setLayout('grid')}
                aria-pressed={layout === 'grid'}
                aria-label="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                className={`rounded-sm p-2 ${layout === 'list' ? 'bg-forest text-ivory' : 'bg-paper'}`}
                onClick={() => setLayout('list')}
                aria-pressed={layout === 'list'}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              title={savedOnly ? 'Nothing saved yet' : 'No pieces match'}
              copy={
                savedOnly
                  ? 'Open the shop and tap the heart on a piece you want to keep nearby.'
                  : 'Adjust filters or search. The catalogue is a small sample set.'
              }
              action={
                savedOnly ? (
                  <Link to="/shop">
                    <Button type="button">Browse the shop</Button>
                  </Link>
                ) : null
              }
            />
          </div>
        ) : layout === 'list' ? (
          <ul className="mt-10 space-y-4">
            {filtered.map((product) => (
              <li
                key={product.id}
                className="grid gap-4 rounded-sm bg-paper p-3 sm:grid-cols-[8rem_1fr_auto] sm:items-center"
              >
                <SmartImage
                  src={product.image}
                  alt={product.name}
                  className="aspect-square w-full object-cover sm:h-28 sm:w-28"
                />
                <div>
                  <Link to={`/shop/${product.slug}`} className="font-serif text-2xl text-forest">
                    {product.name}
                  </Link>
                  <p className="mt-1 text-sm text-ink-muted">{product.category}</p>
                  <StarRating value={product.rating} />
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <p className="text-forest">{formatInr(product.priceInr)}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      onClick={() => {
                        dispatch({ type: 'add-to-cart', productId: product.id })
                        notify('success', 'Added to cart', product.name)
                      }}
                    >
                      Add to cart
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setQuickViewProduct(product)}
                    >
                      Quick view
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}

        <Modal
          open={Boolean(quickViewProduct)}
          title={quickViewProduct?.name ?? 'Product details'}
          onClose={() => setQuickViewProduct(null)}
        >
          {quickViewProduct ? (
            <div className="space-y-4">
              <SmartImage
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="aspect-[16/10] w-full rounded-sm object-cover"
              />
              <div className="flex items-center justify-between gap-3">
                <Badge>{quickViewProduct.category}</Badge>
                <p className="font-serif text-2xl text-forest">
                  {formatInr(quickViewProduct.priceInr)}
                </p>
              </div>
              <StarRating value={quickViewProduct.rating} />
              <p className="text-sm leading-relaxed text-ink-muted">
                {quickViewProduct.description}
              </p>
              <div className="grid gap-2 border-t border-ivory-deep pt-3 text-xs text-ink-muted">
                <p>
                  <strong className="text-charcoal">Materials:</strong>{' '}
                  {quickViewProduct.materials}
                </p>
                <p>
                  <strong className="text-charcoal">Dimensions:</strong>{' '}
                  {quickViewProduct.dimensions}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 border-t border-ivory-deep pt-4">
                <Button
                  type="button"
                  className="flex-1"
                  onClick={() => {
                    dispatch({ type: 'add-to-cart', productId: quickViewProduct.id })
                    notify('success', 'Added to cart', quickViewProduct.name)
                  }}
                >
                  Add to cart
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    dispatch({ type: 'toggle-wishlist', productId: quickViewProduct.id })
                    const isSaved = state.wishlist.includes(quickViewProduct.id)
                    notify('info', isSaved ? 'Removed from wishlist' : 'Saved to wishlist')
                  }}
                >
                  <Heart
                    size={16}
                    fill={state.wishlist.includes(quickViewProduct.id) ? 'currentColor' : 'none'}
                  />
                  {state.wishlist.includes(quickViewProduct.id) ? 'Saved' : 'Save'}
                </Button>
                <Link
                  to={`/shop/${quickViewProduct.slug}`}
                  className="w-full text-center text-xs text-forest underline hover:text-forest-mid"
                  onClick={() => setQuickViewProduct(null)}
                >
                  Open full product page →
                </Link>
              </div>
            </div>
          ) : null}
        </Modal>
      </section>
    </>
  )
}
