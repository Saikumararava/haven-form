import type { ContactFormValues } from '../types'

export type FieldErrors = Partial<Record<keyof ContactFormValues, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalisePhone(phone: string): string {
  return phone.replace(/[\s-()]/g, '')
}

export function validateContactForm(values: ContactFormValues): FieldErrors {
  const errors: FieldErrors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const phone = normalisePhone(values.phone)
  const message = values.message.trim()

  if (name.length < 2) {
    errors.name = 'Please enter your full name.'
  }

  if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!/^\+?\d{10,13}$/.test(phone)) {
    errors.phone = 'Enter a 10–13 digit phone number.'
  }

  if (!values.service) {
    errors.service = 'Select the service you need.'
  }

  if (!values.budget) {
    errors.budget = 'Select a budget range.'
  }

  if (message.length < 20) {
    errors.message =
      'Tell us a little more about the space (at least 20 characters).'
  }

  return errors
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0
}
