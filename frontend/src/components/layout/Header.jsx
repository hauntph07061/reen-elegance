import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, User, Heart } from 'lucide-react'
import { useCartStore } from '../../store/useCartStore'
import { useCustomerAuthStore } from '../../store/useCustomerAuthStore'
import { useFavoriteStore } from '../../store/useFavoriteStore'

function Header() {
  const { getCartCount, setCartOpen } = useCartStore()
  const { customer, customerToken } = useCustomerAuthStore()
  const { fetchFavorites, favoriteIds } = useFavoriteStore()
  const [searchQuery, setSearchQuery] = useState('')
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
    }
  }

  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-6 pointer-events-none">
      <header className="max-w-7xl mx-auto bg-white rounded-full h-[72px] px-8 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.05)] pointer-events-auto">
        
        {/* Left Side */}
        <div className="flex items-center gap-10 lg:gap-14">
          {/* Logo */}
          <Link to="/" className="font-serif text-2xl font-normal tracking-widest text-[#222222] uppercase">
            GREEN ELEGANCE
          </Link>

          {/* Navigation */}
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
        <div className="flex items-center gap-6">
          <form 
            onSubmit={handleSearchSubmit} 
            className="flex items-center bg-gray-50 border border-gray-200 rounded-full w-44 lg:w-52 overflow-hidden focus-within:border-gray-400 focus-within:bg-white transition-colors"
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
          
          <Link to={customer ? "/profile?tab=favorites" : "/login"} className="text-[#222222] hover:text-[#a3a68c] transition-colors relative">
            <Heart className="w-5 h-5" strokeWidth={1.5} />
            {favoriteIds.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#1b6060] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {favoriteIds.length}
              </span>
            )}
          </Link>
          
          <Link to={customer ? "/profile" : "/login"} className="text-[#222222] hover:text-[#a3a68c] transition-colors">
            <User className="w-5 h-5" strokeWidth={1.5} />
          </Link>
          <button onClick={() => setCartOpen(true)} className="text-[#222222] hover:text-[#a3a68c] transition-colors relative">
            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
            {getCartCount() > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#a3a68c] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>
      </header>
    </div>
  )
}

export default Header
