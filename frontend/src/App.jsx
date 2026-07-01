import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layout & Global Components (Keep eager for immediate layout rendering)
import FloatingContact from './components/ui/FloatingContact'
import ScrollToTop from './components/ui/ScrollToTop'
import CartDrawer from './components/cart/CartDrawer'
import AdminLayout from './components/layout/AdminLayout'

// Storefront Pages (Lazy loaded)
const Home = lazy(() => import('./pages/Home'))
const Shop = lazy(() => import('./pages/Shop'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'))
const BlogList = lazy(() => import('./pages/BlogList'))
const BlogDetails = lazy(() => import('./pages/BlogDetails'))
const Contact = lazy(() => import('./pages/Contact'))
const About = lazy(() => import('./pages/About'))
const CustomerLogin = lazy(() => import('./pages/CustomerLogin'))
const CustomerProfile = lazy(() => import('./pages/CustomerProfile'))
const Favorites = lazy(() => import('./pages/Favorites'))

// Static Policies (Lazy loaded named exports)
const DeliveryPolicy = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.DeliveryPolicy })))
const ReturnPolicy = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.ReturnPolicy })))
const PrivacyPolicy = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.PrivacyPolicy })))
const PurchasePolicy = lazy(() => import('./pages/StaticPages').then(m => ({ default: m.PurchasePolicy })))

// Admin Pages (Lazy loaded)
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))
const AdminOrderDetails = lazy(() => import('./pages/admin/AdminOrderDetails'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminStaff = lazy(() => import('./pages/admin/AdminStaff'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'))
const AdminShops = lazy(() => import('./pages/admin/AdminShops'))
const AdminBankAccounts = lazy(() => import('./pages/admin/AdminBankAccounts'))
const AdminPosts = lazy(() => import('./pages/admin/AdminPosts'))
const AdminPostForm = lazy(() => import('./pages/admin/AdminPostForm'))
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'))

// Beautiful brand-aligned loading spinner
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <div className="w-10 h-10 border-4 border-gray-100 border-t-[#1b6060] rounded-full animate-spin"></div>
    <p className="text-xs uppercase tracking-widest text-[#1b6060] font-medium font-sans">Đang tải...</p>
  </div>
);

function AppContent() {
  useEffect(() => {
    const handleInvalid = (e) => {
      if (e.target && e.target.classList) {
        e.target.classList.add('border-red-500', 'border-2');
        
        const form = e.target.form;
        if (form) {
          const firstInvalid = form.querySelector(':invalid');
          if (firstInvalid === e.target) {
            e.preventDefault();
            setTimeout(() => {
              firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
              firstInvalid.focus();
            }, 100);
          } else {
            e.preventDefault();
          }
        }
      }
    };

    const handleInput = (e) => {
      if (e.target && e.target.classList && e.target.classList.contains('border-red-500')) {
        if (e.target.validity && e.target.validity.valid) {
          e.target.classList.remove('border-red-500', 'border-2');
        }
      }
    };

    document.addEventListener('invalid', handleInvalid, true);
    document.addEventListener('input', handleInput, true);

    return () => {
      document.removeEventListener('invalid', handleInvalid, true);
      document.removeEventListener('input', handleInput, true);
    };
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* --- Admin Routes --- */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="categories" element={<AdminCategories />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetails />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="shops" element={<AdminShops />} />
          <Route path="bank-accounts" element={<AdminBankAccounts />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="posts/new" element={<AdminPostForm />} />
          <Route path="posts/:id/edit" element={<AdminPostForm />} />
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* --- Storefront Routes --- */}
        <Route path="*" element={
          <div className="min-h-screen bg-white text-[#222222] flex flex-col justify-between font-sans selection:bg-[#222222] selection:text-white">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/san-pham/:slug" element={<ProductDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/tin-tuc" element={<BlogList />} />
              <Route path="/tin-tuc/:slug" element={<BlogDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/lien-he" element={<Contact />} />
              <Route path="/login" element={<CustomerLogin />} />
              <Route path="/profile" element={<CustomerProfile />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/chinh-sach-giao-nhan" element={<DeliveryPolicy />} />
              <Route path="/chinh-sach-doi-tra" element={<ReturnPolicy />} />
              <Route path="/chinh-sach-bao-mat" element={<PrivacyPolicy />} />
              <Route path="/chinh-sach-mua-hang" element={<PurchasePolicy />} />
            </Routes>
            <FloatingContact />
            <ScrollToTop />
            <CartDrawer />
          </div>
        } />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <AppContent />
    </Router>
  )
}

export default App
