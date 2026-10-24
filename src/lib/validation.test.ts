import { describe, expect, it } from 'vitest'
import type { ContactFormValues } from '../types'
import { hasErrors, validateContactForm } from './validation'

const valid: ContactFormValues = {
  name: 'Ananya Rao',
  email: 'ananya@example.com',
  phone: '+919876543210',
  service: 'Interior design',
  budget: '₹15L–₹40L',
  message: 'We would like to restage a living room in warm linen and oak.',
}

describe('validateContactForm', () => {
  it('accepts a complete enquiry', () => {
    expect(hasErrors(validateContactForm(valid))).toBe(false)
  })

  it('rejects a short name and invalid email', () => {
    const errors = validateContactForm({
      ...valid,
      name: 'A',
      email: 'not-an-email',
    })
    expect(errors.name).toMatch(/full name/i)
    expect(errors.email).toMatch(/valid email/i)
  })

  it('rejects a short message and missing selects', () => {
    const errors = validateContactForm({
      ...valid,
      service: '',
      budget: '',
      message: 'Too short',
    })
    expect(errors.service).toBeTruthy()
    expect(errors.budget).toBeTruthy()
    expect(errors.message).toMatch(/20 characters/i)
  })

  it('allows spaced phone numbers', () => {
    const errors = validateContactForm({ ...valid, phone: '98765 43210' })
    expect(errors.phone).toBeUndefined()
  })
})
