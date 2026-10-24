export type ProjectCategory =
  | 'Living rooms'
  | 'Bedrooms'
  | 'Offices'
  | 'Hospitality'

export type ProductCategory =
  | 'Seating'
  | 'Tables'
  | 'Lighting'
  | 'Textiles'
  | 'Storage'

export type EnquiryStatus = 'new' | 'contacted' | 'converted' | 'archived'
export type EnquiryPriority = 'low' | 'medium' | 'high'

export type ServiceType =
  | 'Interior design'
  | 'Furniture sourcing'
  | 'Space planning'
  | 'Turnkey project'
  | 'Shop enquiry'
  | 'Consultation'

export type BudgetRange =
  | 'Under ₹5L'
  | '₹5L–₹15L'
  | '₹15L–₹40L'
  | '₹40L+'
  | 'Product only'

export type Project = {
  id: string
  slug: string
  title: string
  category: ProjectCategory
  location: string
  style: string
  year: string
  excerpt: string
  description: string
  coverImage: string
  gallery: string[]
  featured: boolean
}

export type Product = {
  id: string
  slug: string
  name: string
  category: ProductCategory
  priceInr: number
  rating: number
  reviewCount: number
  materials: string
  dimensions: string
  description: string
  details: string[]
  image: string
  featured: boolean
}

export type CartItem = {
  productId: string
  quantity: number
}

export type Enquiry = {
  id: string
  reference: string
  name: string
  email: string
  phone: string
  service: ServiceType
  budget: BudgetRange
  message: string
  relatedProductId?: string
  relatedProjectId?: string
  status: EnquiryStatus
  priority: EnquiryPriority
  notes: string
  createdAt: string
  source: 'contact' | 'checkout' | 'project' | 'seed'
}

export type ToastTone = 'success' | 'error' | 'info'

export type ToastMessage = {
  id: string
  tone: ToastTone
  title: string
  body?: string
}

export type AppState = {
  products: Product[]
  projects: Project[]
  enquiries: Enquiry[]
  cart: CartItem[]
  wishlist: string[]
}

export type ContactFormValues = {
  name: string
  email: string
  phone: string
  service: ServiceType | ''
  budget: BudgetRange | ''
  message: string
}
