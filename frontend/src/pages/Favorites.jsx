import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/shop/ProductCard';
import SEO from '../components/ui/SEO';
import { Heart, ArrowRight } from 'lucide-react';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { useCustomerAuthStore } from '../store/useCustomerAuthStore';

export default function Favorites() {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { favoriteIds } = useFavoriteStore();
  const { customerToken } = useCustomerAuthStore();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadFavorites = async () => {
      setLoading(true);
      try {
        if (customerToken) {
          // If logged in, fetch full product objects from API
          const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/favorites`, {
            headers: { 'Authorization': `Bearer ${customerToken}` }
          });
          if (res.ok) {
            const data = await res.json();
            setFavoriteProducts(data);
          }
        } else {
          // If guest, fetch all products and filter by local favorite IDs
          if (favoriteIds.length === 0) {
            setFavoriteProducts([]);
            setLoading(false);
            return;
          }
          
          const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/products?size=100`);
          if (res.ok) {
            const pageData = await res.json();
            const allProducts = pageData.content || [];
            const filtered = allProducts.filter(p => favoriteIds.includes(p.id));
            setFavoriteProducts(filtered);
          }
        }
      } catch (error) {
        console.error('Failed to load favorites details', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [customerToken, favoriteIds]);

  return (
    <>
      <SEO
        title="Danh sách yêu thích | Green Elegance"
        description="Các sản phẩm hoa tươi nghệ thuật bạn đã lưu và yêu thích tại Green Elegance."
        url={`${window.location.origin}/favorites`}
      />
      
      <div className="flex flex-col min-h-screen bg-white text-[#2c2c2c] font-sans">
        <Header />

        {/* Page Banner */}
        <div className="bg-[#f6f3ed] border-b border-[#e8e0d5] pt-24 md:pt-32 pb-8 md:pb-14 text-center px-4">
          <div className="max-w-3xl mx-auto">
            <span className="text-xs font-semibold tracking-widest text-[#1b6060] uppercase">Lưu trữ cảm hứng</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2c2c2c] mt-2 mb-4">Sản Phẩm Yêu Thích</h1>
            <p className="text-[#5a5a5a] text-xs sm:text-sm leading-relaxed">
              Danh sách các tác phẩm hoa và cây cảnh bạn đã lưu trữ để chuẩn bị cho những dịp đặc biệt.
            </p>
          </div>
        </div>

        <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-12 w-full">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-[#f6f3ed] rounded-2xl h-[320px] border border-[#e8e0d5]" />
              ))}
            </div>
          ) : favoriteProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-6 max-w-md mx-auto">
              <div className="w-20 h-20 bg-[#f6f3ed] rounded-full flex items-center justify-center text-[#1b6060]">
                <Heart className="w-10 h-10" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-[#2c2c2c] text-xl mb-2">Danh sách trống</h2>
                <p className="text-[#888888] text-sm leading-relaxed">
                  Hãy duyệt các sản phẩm hoa tươi nghệ thuật của chúng tôi và nhấn nút trái tim để lưu lại những đóa hoa yêu thích nhé!
                </p>
              </div>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#1b6060] text-white hover:bg-[#144848] font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-md text-sm"
              >
                Khám phá sản phẩm ngay
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
