export const BRAND = 'Haven & Form'
export const STORAGE_KEY = 'haven-form-demo-v1'
export const DEMO_ACCESS_KEY = 'haven-form-demo-access'
export const DEMO_ACCESS_CODE = 'haven-demo'

/** Replace this placeholder before any real-world use. Not a live business number. */
export const WHATSAPP_PLACEHOLDER_E164 = '919000000000'
export const WHATSAPP_PLACEHOLDER_DISPLAY = '+91 90000 00000'

export const STUDIO_EMAIL = 'studio@havenandform.demo'
export const STUDIO_ADDRESS = 'Fictional studio desk, Indiranagar, Bengaluru'

export const SERVICES = [
  'Interior design',
  'Furniture sourcing',
  'Space planning',
  'Turnkey project',
  'Shop enquiry',
  'Consultation',
] as const

export const BUDGETS = [
  'Under ₹5L',
  '₹5L–₹15L',
  '₹15L–₹40L',
  '₹40L+',
  'Product only',
] as const

export const PROJECT_CATEGORIES = [
  'Living rooms',
  'Bedrooms',
  'Offices',
  'Hospitality',
] as const

export const PRODUCT_CATEGORIES = [
  'Seating',
  'Tables',
  'Lighting',
  'Textiles',
  'Storage',
] as const

export function whatsappHref(prefill?: string): string {
  const text = encodeURIComponent(
    prefill ??
      'Hello Haven & Form (demo). I would like to discuss a project. This is a sample enquiry from the portfolio site.',
  )
  return `https://wa.me/${WHATSAPP_PLACEHOLDER_E164}?text=${text}`
}
