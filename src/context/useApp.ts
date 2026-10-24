import { useContext } from 'react'
import { AppContext } from './AppContext'
import { createInitialState, type AppAction } from '../lib/store'
import type { Enquiry, Product, Project } from '../types'

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export function useProduct(idOrSlug: string | undefined): Product | undefined {
  const { state } = useApp()
  return state.products.find((item) => item.id === idOrSlug || item.slug === idOrSlug)
}

export function useProject(idOrSlug: string | undefined): Project | undefined {
  const { state } = useApp()
  return state.projects.find((item) => item.id === idOrSlug || item.slug === idOrSlug)
}

export function resetDemo(dispatch: (action: AppAction) => void) {
  dispatch({ type: 'reset' })
  return createInitialState()
}

export type { Enquiry }
