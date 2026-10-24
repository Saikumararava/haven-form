import { products as seedProducts, projects as seedProjects, seedEnquiries } from '../data/seed'
import type { AppState, CartItem, Enquiry, Product, Project } from '../types'
import { STORAGE_KEY } from './constants'

export function createInitialState(): AppState {
  return {
    products: seedProducts,
    projects: seedProjects,
    enquiries: seedEnquiries,
    cart: [],
    wishlist: [],
  }
}

export function loadState(): AppState {
  const fallback = createInitialState()
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      products: Array.isArray(parsed.products) ? parsed.products : fallback.products,
      projects: Array.isArray(parsed.projects) ? parsed.projects : fallback.projects,
      enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : fallback.enquiries,
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : [],
    }
  } catch {
    return fallback
  }
}

export function persistState(state: AppState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export type AppAction =
  | { type: 'hydrate'; state: AppState }
  | { type: 'reset' }
  | { type: 'add-to-cart'; productId: string }
  | { type: 'set-qty'; productId: string; quantity: number }
  | { type: 'remove-from-cart'; productId: string }
  | { type: 'clear-cart' }
  | { type: 'toggle-wishlist'; productId: string }
  | { type: 'add-enquiry'; enquiry: Enquiry }
  | { type: 'update-enquiry'; id: string; patch: Partial<Enquiry> }
  | { type: 'delete-enquiry'; id: string }
  | { type: 'upsert-product'; product: Product }
  | { type: 'delete-product'; id: string }
  | { type: 'upsert-project'; project: Project }
  | { type: 'delete-project'; id: string }

function bumpCart(cart: CartItem[], productId: string): CartItem[] {
  const found = cart.find((item) => item.productId === productId)
  if (!found) return [...cart, { productId, quantity: 1 }]
  return cart.map((item) =>
    item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
  )
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'hydrate':
      return action.state
    case 'reset':
      return createInitialState()
    case 'add-to-cart':
      return { ...state, cart: bumpCart(state.cart, action.productId) }
    case 'set-qty': {
      const quantity = Math.max(0, Math.min(12, action.quantity))
      if (quantity === 0) {
        return {
          ...state,
          cart: state.cart.filter((item) => item.productId !== action.productId),
        }
      }
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.productId === action.productId ? { ...item, quantity } : item,
        ),
      }
    }
    case 'remove-from-cart':
      return {
        ...state,
        cart: state.cart.filter((item) => item.productId !== action.productId),
      }
    case 'clear-cart':
      return { ...state, cart: [] }
    case 'toggle-wishlist': {
      const on = state.wishlist.includes(action.productId)
      return {
        ...state,
        wishlist: on
          ? state.wishlist.filter((id) => id !== action.productId)
          : [...state.wishlist, action.productId],
      }
    }
    case 'add-enquiry':
      return { ...state, enquiries: [action.enquiry, ...state.enquiries] }
    case 'update-enquiry':
      return {
        ...state,
        enquiries: state.enquiries.map((item) =>
          item.id === action.id ? { ...item, ...action.patch } : item,
        ),
      }
    case 'delete-enquiry':
      return {
        ...state,
        enquiries: state.enquiries.filter((item) => item.id !== action.id),
      }
    case 'upsert-product': {
      const exists = state.products.some((item) => item.id === action.product.id)
      return {
        ...state,
        products: exists
          ? state.products.map((item) =>
              item.id === action.product.id ? action.product : item,
            )
          : [action.product, ...state.products],
      }
    }
    case 'delete-product':
      return {
        ...state,
        products: state.products.filter((item) => item.id !== action.id),
        cart: state.cart.filter((item) => item.productId !== action.id),
        wishlist: state.wishlist.filter((id) => id !== action.id),
      }
    case 'upsert-project': {
      const exists = state.projects.some((item) => item.id === action.project.id)
      return {
        ...state,
        projects: exists
          ? state.projects.map((item) =>
              item.id === action.project.id ? action.project : item,
            )
          : [action.project, ...state.projects],
      }
    }
    case 'delete-project':
      return {
        ...state,
        projects: state.projects.filter((item) => item.id !== action.id),
      }
    default:
      return state
  }
}

export function cartSubtotal(state: AppState): number {
  return state.cart.reduce((sum, item) => {
    const product = state.products.find((entry) => entry.id === item.productId)
    return sum + (product ? product.priceInr * item.quantity : 0)
  }, 0)
}

export function cartCount(state: AppState): number {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0)
}
