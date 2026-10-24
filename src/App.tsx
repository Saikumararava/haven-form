import { Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/SiteLayout'
import { AboutPage } from './pages/AboutPage'
import { AdminEnquiries } from './pages/admin/AdminEnquiries'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminOverview } from './pages/admin/AdminOverview'
import { AdminProducts } from './pages/admin/AdminProducts'
import { AdminProjects } from './pages/admin/AdminProjects'
import { CartPage } from './pages/CartPage'
import { CaseStudyPage } from './pages/CaseStudyPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ShopPage } from './pages/ShopPage'

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/case-study" element={<CaseStudyPage />} />
        <Route path="/wishlist" element={<Navigate to="/shop?saved=1" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="projects" element={<AdminProjects />} />
      </Route>
    </Routes>
  )
}
