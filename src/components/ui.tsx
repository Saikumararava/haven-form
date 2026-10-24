import { Star, X } from 'lucide-react'
import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react'
import { IMAGE_FALLBACK } from '../lib/images'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'copper'

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const styles: Record<ButtonVariant, string> = {
    primary:
      'bg-forest text-ivory hover:bg-forest-mid disabled:opacity-50',
    secondary:
      'border border-forest text-forest hover:bg-forest hover:text-ivory',
    ghost: 'text-forest hover:bg-ivory-deep',
    copper: 'bg-copper text-ivory hover:bg-copper-soft',
  }
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-sm tracking-wide transition ${styles[variant]} ${className}`}
      {...props}
    />
  )
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = 'left',
}: {
  eyebrow?: string
  title: string
  copy?: string
  align?: 'left' | 'center'
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow ? (
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-copper">{eyebrow}</p>
      ) : null}
      <h2 className="font-serif text-4xl font-medium leading-tight text-forest md:text-5xl">
        {title}
      </h2>
      {copy ? <p className="mt-4 text-ink-muted leading-relaxed">{copy}</p> : null}
    </div>
  )
}

export function SmartImage({
  src,
  alt,
  className = '',
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
}) {
  const [current, setCurrent] = useState(src)
  const [prevSrc, setPrevSrc] = useState(src)

  if (prevSrc !== src) {
    setPrevSrc(src)
    setCurrent(src)
  }

  return (
    <img
      src={current}
      alt={alt}
      className={`bg-ivory-deep ${className}`}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => {
        if (current !== IMAGE_FALLBACK) setCurrent(IMAGE_FALLBACK)
      }}
    />
  )
}

export function StarRating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-copper" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={14}
          fill={index < Math.round(value) ? 'currentColor' : 'none'}
          className={index < Math.round(value) ? '' : 'text-mist'}
        />
      ))}
      <span className="ml-1 text-xs text-ink-muted">{value.toFixed(1)}</span>
    </span>
  )
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-mist px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-forest">
      {children}
    </span>
  )
}

export function EmptyState({
  title,
  copy,
  action,
}: {
  title: string
  copy: string
  action?: ReactNode
}) {
  return (
    <div className="rounded-sm border border-dashed border-mist bg-paper px-6 py-16 text-center">
      <h3 className="font-serif text-2xl text-forest">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-ink-muted">{copy}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  const headingId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const hasFocusedRef = useRef(false)

  useEffect(() => {
    if (!open) {
      hasFocusedRef.current = false
      return
    }
    if (!hasFocusedRef.current) {
      closeRef.current?.focus()
      hasFocusedRef.current = true
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-charcoal/50 p-4 md:items-center">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="relative z-10 w-full max-w-lg rounded-sm bg-paper p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={headingId} className="font-serif text-2xl text-forest">
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-sm p-1 text-ink-muted hover:bg-ivory-deep"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  const fieldId = useId()
  const hintId = `${fieldId}-hint`
  const errorId = `${fieldId}-error`
  const describedBy = [hint && !error ? hintId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ')

  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<{ id?: string; 'aria-describedby'?: string }>, {
        id: fieldId,
        'aria-describedby': describedBy || undefined,
      })
    : children

  return (
    <div className="block text-sm">
      <label htmlFor={fieldId} className="mb-1.5 block font-medium text-forest">
        {label}
      </label>
      {control}
      {hint && !error ? (
        <span id={hintId} className="mt-1 block text-xs text-ink-muted">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} role="alert" className="mt-1 block text-sm text-copper">
          {error}
        </span>
      ) : null}
    </div>
  )
}

export function ConfirmBar({
  question,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: {
  question: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-copper/40 bg-ivory px-4 py-3 text-sm">
      <p>{question}</p>
      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" variant="copper" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  )
}
