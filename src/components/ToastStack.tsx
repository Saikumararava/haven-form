import { X } from 'lucide-react'
import { useApp } from '../context/useApp'

export function ToastStack() {
  const { toasts, dismissToast } = useApp()
  if (!toasts.length) return null

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[80] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`pointer-events-auto rounded-sm border bg-paper px-4 py-3 shadow-lg ${
            toast.tone === 'error'
              ? 'border-copper'
              : toast.tone === 'success'
                ? 'border-forest'
                : 'border-mist'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-forest">{toast.title}</p>
              {toast.body ? <p className="mt-1 text-sm text-ink-muted">{toast.body}</p> : null}
            </div>
            <button
              type="button"
              className="rounded-sm p-1 text-ink-muted hover:bg-ivory-deep"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
