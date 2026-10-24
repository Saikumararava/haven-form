import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { Button, EmptyState, Field, Modal, SmartImage } from '../components/ui'
import { inputClass } from '../lib/classes'
import { useApp } from '../context/useApp'
import { createEnquiryReference, createId, formatInr, nowIso } from '../lib/format'
import { validateContactForm } from '../lib/validation'

export function CartPage() {
  const { state, dispatch, subtotal, notify } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [checkoutName, setCheckoutName] = useState('')
  const [checkoutEmail, setCheckoutEmail] = useState('')
  const [checkoutPhone, setCheckoutPhone] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({})
  const [completedRef, setCompletedRef] = useState<string | null>(null)

  const lines = state.cart
    .map((item) => {
      const product = state.products.find((entry) => entry.id === item.productId)
      return product ? { product, quantity: item.quantity } : null
    })
    .filter((line) => line !== null)

  function onSubmitCheckout(event: FormEvent) {
    event.preventDefault()
    const formErrors = validateContactForm({
      name: checkoutName,
      email: checkoutEmail,
      phone: checkoutPhone,
      service: 'Shop enquiry',
      budget: 'Product only',
      message: 'Demo checkout enquiry',
    })

    const relevantErrors: { name?: string; email?: string; phone?: string } = {}
    if (formErrors.name) relevantErrors.name = formErrors.name
    if (formErrors.email) relevantErrors.email = formErrors.email
    if (formErrors.phone) relevantErrors.phone = formErrors.phone

    setErrors(relevantErrors)
    if (Object.keys(relevantErrors).length > 0) {
      notify('error', 'Please check your details', 'Name, email, and phone are required for the demo quote.')
      return
    }

    const ref = createEnquiryReference()
    const productNames = lines.map((l) => `${l.product.name} (×${l.quantity})`).join(', ')

    dispatch({
      type: 'add-enquiry',
      enquiry: {
        id: createId('enq'),
        reference: ref,
        name: checkoutName.trim(),
        email: checkoutEmail.trim(),
        phone: checkoutPhone.trim(),
        service: 'Shop enquiry',
        budget: 'Product only',
        message: `Sample checkout enquiry for: ${productNames}. Subtotal: ${formatInr(subtotal)}. Demo cart, no real charge made.`,
        relatedProductId: lines[0]?.product.id,
        status: 'new',
        priority: 'high',
        notes: 'Submitted via instant demo checkout modal on bag page.',
        createdAt: nowIso(),
        source: 'checkout',
      },
    })

    dispatch({ type: 'clear-cart' })
    setCompletedRef(ref)
    notify('success', 'Demo checkout enquiry submitted!', `Reference: ${ref}`)
  }

  return (
    <>
      <PageMeta
        title="Cart"
        description="Demo shopping bag for Haven & Form. Checkout is an enquiry, not a payment."
      />
      <section className="mx-auto max-w-5xl px-4 py-14 md:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h1 className="font-serif text-5xl text-forest">Your bag</h1>
            <p className="mt-2 text-ink-muted">
              This is a sample cart. Checkout is a labelled demo enquiry — no card is charged.
            </p>
          </div>
          {lines.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                dispatch({ type: 'clear-cart' })
                notify('info', 'Bag cleared')
              }}
              className="text-xs text-copper underline hover:text-copper-soft"
            >
              Clear entire bag
            </button>
          ) : null}
        </div>

        {lines.length === 0 ? (
          <div className="mt-10">
            {completedRef ? (
              <div className="rounded-sm border border-forest bg-paper p-8 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-copper">Enquiry received</p>
                <h2 className="mt-2 font-serif text-3xl text-forest">Thank you for your demo order!</h2>
                <p className="mt-3 text-ink-muted">
                  Your sample enquiry reference is <strong>{completedRef}</strong>. You can view,
                  update status, and review this record in the demo dashboard.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link to="/admin/enquiries">
                    <Button type="button">View in demo dashboard</Button>
                  </Link>
                  <Link to="/shop">
                    <Button type="button" variant="secondary">
                      Continue browsing
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <EmptyState
                title="The bag is empty"
                copy="Add a sofa, a lamp, or a rug from the sample catalogue."
                action={
                  <Link to="/shop">
                    <Button type="button">Visit the shop</Button>
                  </Link>
                }
              />
            )}
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
            <ul className="space-y-4">
              {lines.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="grid gap-4 rounded-sm bg-paper p-4 sm:grid-cols-[6rem_1fr_auto]"
                >
                  <SmartImage
                    src={product.image}
                    alt={product.name}
                    className="h-24 w-24 rounded-sm object-cover"
                  />
                  <div>
                    <Link to={`/shop/${product.slug}`} className="font-serif text-xl text-forest hover:underline">
                      {product.name}
                    </Link>
                    <p className="text-sm text-ink-muted">{formatInr(product.priceInr)} each</p>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="text-xs text-ink-muted">Qty:</span>
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${product.name}`}
                        onClick={() =>
                          dispatch({
                            type: 'set-qty',
                            productId: product.id,
                            quantity: quantity - 1,
                          })
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-sm border border-mist bg-ivory text-sm text-forest hover:bg-ivory-deep"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${product.name}`}
                        onClick={() =>
                          dispatch({
                            type: 'set-qty',
                            productId: product.id,
                            quantity: Math.min(12, quantity + 1),
                          })
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-sm border border-mist bg-ivory text-sm text-forest hover:bg-ivory-deep"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between sm:text-right">
                    <p className="font-medium text-forest">{formatInr(product.priceInr * quantity)}</p>
                    <button
                      type="button"
                      className="mt-3 text-xs text-copper underline hover:text-copper-soft"
                      onClick={() => {
                        dispatch({ type: 'remove-from-cart', productId: product.id })
                        notify('info', 'Removed from bag')
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="h-fit border border-ivory-deep bg-paper p-6">
              <h2 className="font-serif text-2xl text-forest">Summary</h2>
              <div className="mt-4 space-y-2 border-b border-ivory-deep pb-4 text-sm">
                <p className="flex justify-between">
                  <span className="text-ink-muted">Items count</span>
                  <span>{lines.reduce((s, l) => s + l.quantity, 0)} pieces</span>
                </p>
                <p className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span className="text-forest">{formatInr(subtotal)}</span>
                </p>
              </div>
              <p className="mt-3 text-xs text-ink-muted">
                DEMO MODE: Delivery, tax and payments are not calculated. This is an enquiry flow —
                no card details are required or charged.
              </p>
              <div className="mt-6 space-y-3">
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => {
                    setCompletedRef(null)
                    setModalOpen(true)
                  }}
                >
                  Instant demo checkout
                </Button>
                <Link to="/contact?intent=checkout" className="block">
                  <Button type="button" variant="secondary" className="w-full">
                    Custom consultation quote
                  </Button>
                </Link>
              </div>
            </aside>
          </div>
        )}

        <Modal
          open={modalOpen}
          title="Demo checkout enquiry"
          onClose={() => setModalOpen(false)}
        >
          <div className="space-y-4">
            <p className="rounded-sm bg-ivory p-3 text-xs text-ink-muted">
              <strong className="text-forest">Sample checkout:</strong> Submitting this creates a
              new lead in the demo dashboard with reference to your {lines.length} piece(s). No
              real transaction occurs.
            </p>
            <form onSubmit={onSubmitCheckout} className="space-y-3" noValidate>
              <Field label="Full name" error={errors.name}>
                <input
                  className={inputClass(errors.name)}
                  value={checkoutName}
                  onChange={(e) => setCheckoutName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  autoComplete="name"
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  className={inputClass(errors.email)}
                  value={checkoutEmail}
                  onChange={(e) => setCheckoutEmail(e.target.value)}
                  placeholder="e.g. priya@example.com"
                  autoComplete="email"
                />
              </Field>
              <Field label="Phone" error={errors.phone} hint="10–13 digits">
                <input
                  className={inputClass(errors.phone)}
                  value={checkoutPhone}
                  onChange={(e) => setCheckoutPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  autoComplete="tel"
                />
              </Field>
              <div className="border-t border-ivory-deep pt-3">
                <div className="flex justify-between text-sm">
                  <span>Demo subtotal</span>
                  <span className="font-semibold text-forest">{formatInr(subtotal)}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1">
                  Submit demo enquiry
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </section>
    </>
  )
}
