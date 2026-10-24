import { describe, expect, it } from 'vitest'
import { createEnquiryReference, formatInr, slugify } from './format'

describe('format helpers', () => {
  it('formats INR without paise', () => {
    expect(formatInr(184000)).toMatch(/1,84,000/)
  })

  it('builds a labelled enquiry reference', () => {
    expect(createEnquiryReference(new Date('2026-10-24'))).toMatch(/^HF-2026-[A-Z0-9]{4}$/)
  })

  it('slugifies titles', () => {
    expect(slugify('Quiet Oak Bedroom')).toBe('quiet-oak-bedroom')
  })
})
