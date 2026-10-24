import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react'
import type { ToastMessage, ToastTone } from '../types'
import {
  appReducer,
  cartCount,
  cartSubtotal,
  loadState,
  persistState,
} from '../lib/store'
import { AppContext } from './AppContext'

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, loadState)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    persistState(state)
  }, [state])

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback(
    (tone: ToastTone, title: string, body?: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      setToasts((current) => [...current, { id, tone, title, body }])
      window.setTimeout(() => dismissToast(id), 5200)
    },
    [dismissToast],
  )

  const value = useMemo(
    () => ({
      state,
      dispatch,
      subtotal: cartSubtotal(state),
      itemCount: cartCount(state),
      toasts,
      notify,
      dismissToast,
    }),
    [state, toasts, notify, dismissToast],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
