import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import BlogList from './pages/BlogList'
import BlogDetails from './pages/BlogDetails'
import Contact from './pages/Contact'
import About from './pages/About'
import CustomerLogin from './pages/CustomerLogin'
import CustomerProfile from './pages/CustomerProfile'
import { DeliveryPolicy, ReturnPolicy, PrivacyPolicy, PurchasePolicy } from './pages/StaticPages'
import FloatingContact from './components/ui/FloatingContact'
import ScrollToTop from './components/ui/ScrollToTop'
import CartDrawer from './components/cart/CartDrawer'
import AdminLayout from './components/layout/AdminLayout'
import AdminCategories from './pages/admin/AdminCategories'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminOrderDetails from './pages/admin/AdminOrderDetails'
import AdminLogin from './pages/admin/AdminLogin'
import AdminStaff from './pages/admin/AdminStaff'
import AdminSettings from './pages/admin/AdminSettings'
import AdminContacts from './pages/admin/AdminContacts'
import AdminShops from './pages/admin/AdminShops'
import AdminPosts from './pages/admin/AdminPosts'
import AdminPostForm from './pages/admin/AdminPostForm'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminBankAccounts from './pages/admin/AdminBankAccounts'
import { Toaster } from 'react-hot-toast'

import { useEffect } from 'react'

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
