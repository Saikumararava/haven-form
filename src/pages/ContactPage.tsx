import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DemoNotice } from '../components/DemoNotice'
import { PageMeta } from '../components/PageMeta'
import { Button, Field } from '../components/ui'
import { inputClass } from '../lib/classes'
import { useApp } from '../context/useApp'
import { BUDGETS, SERVICES, WHATSAPP_PLACEHOLDER_DISPLAY, whatsappHref } from '../lib/constants'
import { createEnquiryReference, createId } from '../lib/format'
import { hasErrors, validateContactForm } from '../lib/validation'
import type { BudgetRange, ContactFormValues, ServiceType } from '../types'

const emptyForm: ContactFormValues = {
  name: '',
  email: '',
  phone: '',
  service: '',
  budget: '',
  message: '',
}

export function ContactPage() {
  const { state, dispatch, notify } = useApp()
  const [params] = useSearchParams()
  const projectSlug = params.get('project')
  const intent = params.get('intent')
  const project = state.projects.find((item) => item.slug === projectSlug)

  const defaultMessage = useMemo(() => {
    if (intent === 'checkout') {
      const names = state.cart
        .map((item) => state.products.find((product) => product.id === item.productId)?.name)
        .filter(Boolean)
        .join(', ')
      return names
        ? `I would like a demo quote for: ${names}. This is a sample checkout enquiry — please do not charge a card.`
        : 'I would like a demo quote for pieces in my bag. This is not a payment.'
    }
    if (project) {
      return `I am interested in a scheme in the spirit of ${project.title} (${project.style}). This is a sample enquiry from the portfolio site.`
    }
    return ''
  }, [intent, project, state.cart, state.products])

  const [values, setValues] = useState<ContactFormValues>(() => ({
    ...emptyForm,
    service: intent === 'checkout' ? 'Shop enquiry' : project ? 'Interior design' : '',
    budget: intent === 'checkout' ? 'Product only' : '',
    message: defaultMessage,
  }))
  const [errors, setErrors] = useState<ReturnType<typeof validateContactForm>>({})
  const [reference, setReference] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function update<K extends keyof ContactFormValues>(key: K, value: ContactFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validateContactForm(values)
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) {
      notify('error', 'Please check the form', 'A few fields need attention before we can save this enquiry.')
      return
    }
    setSubmitting(true)
    const ref = createEnquiryReference()
    dispatch({
      type: 'add-enquiry',
      enquiry: {
        id: createId('enq'),
        reference: ref,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        service: values.service as ServiceType,
        budget: values.budget as BudgetRange,
        message: values.message.trim(),
        relatedProjectId: project?.id,
        relatedProductId: intent === 'checkout' ? state.cart[0]?.productId : undefined,
        status: 'new',
        priority: 'medium',
        notes: intent === 'checkout' ? 'Created from demo checkout / enquiry flow.' : '',
        createdAt: new Date().toISOString(),
        source: intent === 'checkout' ? 'checkout' : project ? 'project' : 'contact',
      },
    })
    if (intent === 'checkout') dispatch({ type: 'clear-cart' })
    setReference(ref)
    setSubmitting(false)
    notify('success', 'Enquiry saved in this browser', `Reference ${ref}`)
  }

  return (
    <>
      <PageMeta
        title="Contact"
        description="Send a sample enquiry to the Haven & Form demo studio. Data stays in this browser."
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.1fr_0.9fr] md:px-6">
        <div>
          <h1 className="font-serif text-5xl text-forest">Book a consultation</h1>
          <p className="mt-4 text-ink-muted">
            Tell us about the room. We will generate a reference and store the enquiry locally so
            the demo dashboard can show it.
          </p>
          <DemoNotice className="mt-6" />

          {reference ? (
            <div className="mt-8 rounded-sm border border-forest bg-paper p-6" role="status">
              <p className="text-xs uppercase tracking-[0.2em] text-copper">Received</p>
              <h2 className="mt-2 font-serif text-3xl text-forest">Thank you, {values.name.trim()}.</h2>
              <p className="mt-3 text-ink-muted">
                Your sample enquiry reference is <strong>{reference}</strong>. Open the demo
                dashboard to change status, add notes, or delete the record.
              </p>
              <Button type="button" className="mt-6" onClick={() => setReference(null)}>
                Send another
              </Button>
            </div>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={onSubmit} noValidate>
              <Field label="Full name" error={errors.name}>
                <input
                  className={inputClass(errors.name)}
                  value={values.name}
                  onChange={(event) => update('name', event.target.value)}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  className={inputClass(errors.email)}
                  value={values.email}
                  onChange={(event) => update('email', event.target.value)}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                />
              </Field>
              <Field label="Phone" error={errors.phone} hint="10–13 digits, with or without +91">
                <input
                  className={inputClass(errors.phone)}
                  value={values.phone}
                  onChange={(event) => update('phone', event.target.value)}
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                />
              </Field>
              <Field label="Service required" error={errors.service}>
                <select
                  className={inputClass(errors.service)}
                  value={values.service}
                  onChange={(event) => update('service', event.target.value as ContactFormValues['service'])}
                  aria-invalid={Boolean(errors.service)}
                >
                  <option value="">Select a service</option>
                  {SERVICES.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Budget range" error={errors.budget}>
                <select
                  className={inputClass(errors.budget)}
                  value={values.budget}
                  onChange={(event) => update('budget', event.target.value as ContactFormValues['budget'])}
                  aria-invalid={Boolean(errors.budget)}
                >
                  <option value="">Select a range</option>
                  {BUDGETS.map((budget) => (
                    <option key={budget} value={budget}>
                      {budget}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Message" error={errors.message}>
                <textarea
                  rows={5}
                  className={inputClass(errors.message)}
                  value={values.message}
                  onChange={(event) => update('message', event.target.value)}
                  aria-invalid={Boolean(errors.message)}
                />
              </Field>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : 'Send sample enquiry'}
              </Button>
            </form>
          )}
        </div>
        <aside className="h-fit bg-forest p-8 text-ivory">
          <p className="text-xs uppercase tracking-[0.22em] text-copper-soft">Studio desk</p>
          <h2 className="mt-3 font-serif text-3xl">A conversation, not a ticket.</h2>
          <p className="mt-4 text-sm leading-relaxed text-ivory/75">
            Prefer a message? Use the WhatsApp placeholder. Replace the number in{' '}
            <code className="text-copper-soft">src/lib/constants.ts</code> if you ever adapt this
            demo.
          </p>
          <a href={whatsappHref()} className="mt-6 inline-flex rounded-sm bg-copper px-4 py-2.5 text-sm">
            WhatsApp {WHATSAPP_PLACEHOLDER_DISPLAY}
          </a>
          <p className="mt-6 text-xs text-ivory/60">
            Placeholder number only. Not a real business line.
          </p>
        </aside>
      </section>
    </>
  )
}
