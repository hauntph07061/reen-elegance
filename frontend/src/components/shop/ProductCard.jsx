import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useCartStore } from '../../store/useCartStore'
import { useFavoriteStore } from '../../store/useFavoriteStore'

function ProductCard({ product }) {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const { favoriteIds, toggleFavorite } = useFavoriteStore();

  const formatVND = (price) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

  const hasSale = product.salePrice && product.salePrice < product.regularPrice;
  const isFavorite = favoriteIds.includes(product.id);
  const isOutOfStock = product.stockQuantity <= 0;

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    const success = await toggleFavorite(product.id);
    if (success === false) {
      navigate('/login');
    }
  };

  return (
    <div className="group flex flex-col relative h-full">
      {/* Image Card */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-5 flex-shrink-0">
        <Link to={`/san-pham/${product.slug}`} className="block w-full h-full">
          <img
            src={product.thumbnailUrl || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-sm group/heart"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 group-hover/heart:text-red-500'}`} 
          />
        </button>
        {isOutOfStock && (
          <span className="absolute top-4 right-4 bg-[#2c2c2c]/80 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-wider backdrop-blur-sm z-10">
            Hết hàng
          </span>
        )}
        {!isOutOfStock && hasSale && (
          <span className="absolute top-4 right-4 bg-gray-500/80 text-white text-[10px] uppercase font-semibold px-3 py-1 rounded-full tracking-wider backdrop-blur-sm z-10">
            Sale
          </span>
        )}
        {/* Quick Add Buttons (appears on hover) */}
        {!isOutOfStock && (
          <div className="absolute bottom-4 left-0 right-0 px-4 opacity-0 group-hover:opacity-100 flex gap-2 transition-all duration-300">
            <button
              onClick={(e) => { e.preventDefault(); addToCart(product, 1); }}
              className="flex-1 bg-white/90 backdrop-blur-sm hover:bg-[#a3a68c] text-[#222222] hover:text-white font-medium py-2.5 rounded-full shadow-lg transition-all duration-300 text-[9px] uppercase tracking-wider whitespace-nowrap"
            >
              Thêm vào giỏ
            </button>
            <button
              onClick={(e) => { 
                e.preventDefault(); 
                addToCart(product, 1); 
                navigate('/checkout'); 
              }}
              className="flex-1 bg-[#222222]/90 backdrop-blur-sm hover:bg-[#a3a68c] text-white font-medium py-2.5 rounded-full shadow-lg transition-all duration-300 text-[9px] uppercase tracking-wider whitespace-nowrap"
            >
              Mua ngay
            </button>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1.5 flex-1">
        <Link to={`/san-pham/${product.slug}`}>
          <h3 className="font-serif text-base text-[#222222] font-normal tracking-wide uppercase line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex gap-2 items-center text-sm mt-auto">
          <span className="text-[#222222]">
            {formatVND(hasSale ? product.salePrice : product.regularPrice)}
          </span>
          {hasSale && (
            <span className="text-gray-500 line-through">
              {formatVND(product.regularPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
