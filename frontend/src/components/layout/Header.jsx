import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, User, Heart, Menu, X } from 'lucide-react'
import { useCartStore } from '../../store/useCartStore'
import { useCustomerAuthStore } from '../../store/useCustomerAuthStore'
import { useFavoriteStore } from '../../store/useFavoriteStore'

function Header() {
  const { getCartCount, setCartOpen } = useCartStore()
  const { customer, customerToken } = useCustomerAuthStore()
  const { fetchFavorites, favoriteIds } = useFavoriteStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    if (customerToken) {
      fetchFavorites();
    }
  }, [customerToken]);

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <div className="fixed top-0 md:top-6 left-0 right-0 z-50 px-0 md:px-6 pointer-events-none">
      <header className="max-w-7xl mx-auto bg-white rounded-none md:rounded-full h-[64px] md:h-[72px] px-4 md:px-8 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.05)] pointer-events-auto border-b md:border-none border-gray-100">
        
        {/* Left Side */}
        <div className="flex items-center gap-4 md:gap-10 lg:gap-14">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="block md:hidden p-2 text-[#222222] hover:text-[#a3a68c] transition-colors"
          >
            <Menu className="w-6 h-6" strokeWidth={1.5} />
          </button>

          {/* Logo */}
          <Link to="/" className="font-serif text-sm sm:text-base md:text-2xl font-normal tracking-widest text-[#222222] uppercase whitespace-nowrap">
            GREEN ELEGANCE
          </Link>

          {/* Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 mt-1">
            <Link to="/" className="text-[#222222] text-sm font-medium hover:text-[#a3a68c] transition-colors whitespace-nowrap">Trang chủ</Link>
            <Link to="/shop" className="text-[#222222] text-sm font-medium hover:text-[#a3a68c] transition-colors whitespace-nowrap">Sản phẩm</Link>
            <Link to="/tin-tuc" className="text-[#222222] text-sm font-medium hover:text-[#a3a68c] transition-colors whitespace-nowrap">Tin tức</Link>
            <Link to="/about" className="text-[#222222] text-sm font-medium hover:text-[#a3a68c] transition-colors whitespace-nowrap">Về chúng tôi</Link>
            <Link to="/chinh-sach-mua-hang" className="text-[#222222] text-sm font-medium hover:text-[#a3a68c] transition-colors whitespace-nowrap">Chính sách</Link>
            <Link to="/lien-he" className="text-[#222222] text-sm font-medium hover:text-[#a3a68c] transition-colors whitespace-nowrap">Liên hệ</Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-6">
          {/* Search Form (Desktop) */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-full w-44 lg:w-52 overflow-hidden focus-within:border-gray-400 focus-within:bg-white transition-colors"
          >
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full pl-4 py-2 text-sm outline-none bg-transparent text-[#222222]"
            />
            <button type="submit" className="pr-4 pl-2 text-[#5a5a5a] hover:text-[#222222] transition-colors">
              <Search className="w-4 h-4" strokeWidth={2} />
            </button>
          </form>
          
          {/* Favorite Link (Desktop) */}
          <Link to={customer ? "/profile?tab=favorites" : "/login"} className="hidden sm:block text-[#222222] hover:text-[#a3a68c] transition-colors relative">
            <Heart className="w-5 h-5" strokeWidth={1.5} />
            {favoriteIds.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#1b6060] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {favoriteIds.length}
              </span>
            )}
          </Link>
          
          {/* User Profile Link (Desktop) */}
          <Link to={customer ? "/profile" : "/login"} className="hidden sm:block text-[#222222] hover:text-[#a3a68c] transition-colors">
            <User className="w-5 h-5" strokeWidth={1.5} />
          </Link>

          {/* Cart Trigger */}
          <button onClick={() => setCartOpen(true)} className="text-[#222222] hover:text-[#a3a68c] transition-colors relative p-2">
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
            {getCartCount() > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-[#a3a68c] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 pointer-events-auto block md:hidden animate-fade-in">
          <div className="w-[80vw] max-w-[300px] h-full bg-white p-6 flex flex-col justify-between shadow-2xl animate-slide-in">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <span className="font-serif text-sm font-bold tracking-widest text-[#222222]">MENU</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-[#222222] hover:text-[#a3a68c]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search bar inside drawer */}
              <form onSubmit={handleSearchSubmit} className="mt-6 flex items-center bg-gray-50 border border-gray-200 rounded-full w-full overflow-hidden">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full pl-4 py-2 text-sm outline-none bg-transparent text-[#222222]"
                />
                <button type="submit" className="pr-4 pl-2 text-[#5a5a5a]">
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Navigation Links in drawer */}
              <nav className="flex flex-col gap-5 mt-8">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-[#222222] text-base font-medium hover:text-[#a3a68c] transition-colors">Trang chủ</Link>
                <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-[#222222] text-base font-medium hover:text-[#a3a68c] transition-colors">Sản phẩm</Link>
                <Link to="/tin-tuc" onClick={() => setIsMobileMenuOpen(false)} className="text-[#222222] text-base font-medium hover:text-[#a3a68c] transition-colors">Tin tức</Link>
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-[#222222] text-base font-medium hover:text-[#a3a68c] transition-colors">Về chúng tôi</Link>
                <Link to="/chinh-sach-mua-hang" onClick={() => setIsMobileMenuOpen(false)} className="text-[#222222] text-base font-medium hover:text-[#a3a68c] transition-colors">Chính sách</Link>
                <Link to="/lien-he" onClick={() => setIsMobileMenuOpen(false)} className="text-[#222222] text-base font-medium hover:text-[#a3a68c] transition-colors">Liên hệ</Link>
              </nav>
            </div>

            {/* Bottom Actions in Drawer */}
            <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
              <Link 
                to={customer ? "/profile?tab=favorites" : "/login"} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-sm font-medium text-[#222222] hover:text-[#a3a68c]"
              >
                <Heart className="w-5 h-5" strokeWidth={1.5} />
                <span>Yêu thích ({favoriteIds.length})</span>
              </Link>
              <Link 
                to={customer ? "/profile" : "/login"} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 text-sm font-medium text-[#222222] hover:text-[#a3a68c]"
              >
                <User className="w-5 h-5" strokeWidth={1.5} />
                <span>{customer ? `Tài khoản (${customer.fullName})` : 'Đăng nhập'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
