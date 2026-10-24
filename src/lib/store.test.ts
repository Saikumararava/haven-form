import { describe, expect, it } from 'vitest'
import { appReducer, cartCount, cartSubtotal, createInitialState } from './store'

describe('appReducer cart', () => {
  it('adds, updates quantity and computes subtotal', () => {
    let state = createInitialState()
    const product = state.products[0]
    state = appReducer(state, { type: 'add-to-cart', productId: product.id })
    state = appReducer(state, { type: 'add-to-cart', productId: product.id })
    expect(cartCount(state)).toBe(2)
    expect(cartSubtotal(state)).toBe(product.priceInr * 2)
    state = appReducer(state, { type: 'set-qty', productId: product.id, quantity: 1 })
    expect(cartCount(state)).toBe(1)
    state = appReducer(state, { type: 'set-qty', productId: product.id, quantity: 0 })
    expect(state.cart).toHaveLength(0)
  })

  it('toggles wishlist and removes product from cart on delete', () => {
    let state = createInitialState()
    const product = state.products[0]
    state = appReducer(state, { type: 'toggle-wishlist', productId: product.id })
    state = appReducer(state, { type: 'add-to-cart', productId: product.id })
    state = appReducer(state, { type: 'delete-product', id: product.id })
    expect(state.wishlist).not.toContain(product.id)
    expect(state.cart.find((item) => item.productId === product.id)).toBeUndefined()
  })
})
