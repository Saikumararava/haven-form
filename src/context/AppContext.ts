import { createContext } from 'react'
import type { AppAction } from '../lib/store'
import type { AppState, ToastMessage, ToastTone } from '../types'

export type AppContextValue = {
  state: AppState
  dispatch: (action: AppAction) => void
  subtotal: number
  itemCount: number
  toasts: ToastMessage[]
  notify: (tone: ToastTone, title: string, body?: string) => void
  dismissToast: (id: string) => void
}

export const AppContext = createContext<AppContextValue | null>(null)
