import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import SEO from '../components/ui/SEO'
import { useCartStore } from '../store/useCartStore'

function ProductDetails() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [mainImage, setMainImage] = useState(null)
  const [activeTab, setActiveTab] = useState('details')
  const [addedToCart, setAddedToCart] = useState(false)
  const [isHoveringImage, setIsHoveringImage] = useState(false)
  const addToCart = useCartStore(s => s.addToCart)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetch(`${import.meta.env.VITE_API_URL}/v1/products/${slug}`)
      .then(res => { if (!res.ok) throw new Error(); return res.json() })
      .then(data => { 
        setProduct(data); 
        setMainImage(data.thumbnailUrl);
        setLoading(false); 
      })
      .catch(() => navigate('/shop'))
  }, [slug, navigate])

  useEffect(() => {
    if (!product) return;
    const allImages = [product.thumbnailUrl, ...(product.images?.map(i => i.imageUrl) || [])].filter(Boolean);
    if (allImages.length <= 1) return;

    const currentImageIndex = allImages.indexOf(mainImage || product.thumbnailUrl);

    const handleKeyDown = (e) => {
      if (!isHoveringImage) return;
      
      if (e.key === 'ArrowRight') {
        if (currentImageIndex < allImages.length - 1) {
          setMainImage(allImages[currentImageIndex + 1]);
        } else {
          setMainImage(allImages[0]);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentImageIndex > 0) {
          setMainImage(allImages[currentImageIndex - 1]);
        } else {
          setMainImage(allImages[allImages.length - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, mainImage, isHoveringImage]);

  const handleAddToCart = () => {
    if (product.stockQuantity <= 0) return;
    addToCart(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    if (product.stockQuantity <= 0) return;
    addToCart(product, quantity)
    navigate('/checkout')
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

  if (loading) return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-[#a3a68c] rounded-full animate-spin" />
      </main>
      <Footer />
    </div>
  )

  const hasSale = product.salePrice && product.salePrice < product.regularPrice
  const isOutOfStock = product.stockQuantity <= 0

  const allImages = [product.thumbnailUrl, ...(product.images?.map(i => i.imageUrl) || [])].filter(Boolean)
  const currentImageIndex = allImages.indexOf(mainImage || product.thumbnailUrl)

  const handleNextImage = () => {
    if (currentImageIndex < allImages.length - 1) {
      setMainImage(allImages[currentImageIndex + 1])
    } else {
      setMainImage(allImages[0])
    }
  }

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setMainImage(allImages[currentImageIndex - 1])
    } else {
      setMainImage(allImages[allImages.length - 1])
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#222222]">
      <SEO
        title={product.name}
        description={product.description || `${product.name} — Green Elegance`}
        image={product.thumbnailUrl}
        url={`${window.location.origin}/san-pham/${product.slug}`}
      />
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 pt-32 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#5a5a5a] mb-10 font-bold">
          <Link to="/" className="hover:text-[#a3a68c] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#a3a68c] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#222222] truncate">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">

          {/* ——— Image Column ——— */}
          <div className="lg:w-1/2 flex-shrink-0 flex flex-col gap-4">
            <div 
              className="group relative w-full aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-[#e8e0d5]"
              onMouseEnter={() => setIsHoveringImage(true)}
              onMouseLeave={() => setIsHoveringImage(false)}
            >
              <img
                src={mainImage || product.thumbnailUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {hasSale && (
                <div className="absolute top-4 left-4 bg-gray-500/80 text-white text-[10px] uppercase font-semibold px-3 py-1 rounded-full tracking-wider backdrop-blur-sm z-10">
                  Sale
                </div>
              )}
              {allImages.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-[#222222] shadow-sm backdrop-blur-sm transition-all z-10 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-[#222222] shadow-sm backdrop-blur-sm transition-all z-10 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Gallery */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {/* Always include thumbnail as first image */}
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(imgUrl)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      mainImage === imgUrl ? 'border-[#a3a68c] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ——— Details Column ——— */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            
            <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#222222] mb-6 uppercase tracking-wider">
              {product.name}
            </h1>

            {/* Pricing and Stock */}
            <div className="flex items-center gap-4 mb-8 flex-wrap">
              <div className="flex items-center gap-4">
                {hasSale ? (
                  <>
                    <span className="text-2xl text-[#222222]">{formatPrice(product.salePrice)}</span>
                    <span className="text-lg text-gray-500 line-through">{formatPrice(product.regularPrice)}</span>
                  </>
                ) : (
                  <span className="text-2xl text-[#222222]">{formatPrice(product.regularPrice)}</span>
                )}
              </div>
              {isOutOfStock && (
                <span className="bg-[#2c2c2c]/80 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-sm">Hết hàng</span>
              )}
            </div>

            {/* Description Preview */}
            <div className="text-[#5a5a5a] text-sm leading-relaxed mb-10">
              <p>{product.description || 'Sản phẩm đang được cập nhật thông tin mô tả chi tiết.'}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              {isOutOfStock ? (
                <div className="bg-gray-100 text-[#5a5a5a] text-center font-medium py-4 rounded-full text-sm tracking-widest uppercase border border-gray-200">
                  Sản phẩm tạm hết hàng
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    {/* Quantity */}
                    <div className="flex items-center bg-white rounded-full overflow-hidden border border-gray-300">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 flex items-center justify-center text-[#5a5a5a] hover:bg-gray-50 transition-colors">
                        −
                      </button>
                      <span className="w-8 text-center text-[#222222] text-sm font-medium">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(product.stockQuantity ?? 999, quantity + 1))}
                        className="w-12 h-12 flex items-center justify-center text-[#5a5a5a] hover:bg-gray-50 transition-colors">
                        +
                      </button>
                    </div>

                    {/* Add to cart */}
                    <button
                      onClick={handleAddToCart}
                      className={`flex-1 font-medium py-3.5 rounded-full transition-all duration-300 text-sm tracking-widest uppercase ${
                        addedToCart
                          ? 'bg-[#a3a68c] text-white'
                          : 'bg-[#222222] hover:bg-[#a3a68c] text-white'
                      }`}
                    >
                      {addedToCart ? 'Đã thêm' : 'Thêm vào giỏ'}
                    </button>
                  </div>

                  {/* Buy Now */}
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-transparent border border-[#222222] text-[#222222] hover:bg-[#222222] hover:text-white font-medium py-3.5 rounded-full transition-all duration-300 text-sm tracking-widest uppercase"
                  >
                    Mua ngay
                  </button>
                </>
              )}
            </div>
            
            {/* Tabs */}
            <div className="mt-16 pt-8 border-t border-gray-300">
              <div className="flex gap-8 mb-6 border-b border-gray-300">
                {['details', 'care'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-[10px] font-bold uppercase tracking-widest transition-colors relative ${
                      activeTab === tab
                        ? 'text-[#222222]'
                        : 'text-[#888888] hover:text-[#5a5a5a]'
                    }`}
                  >
                    {tab === 'details' ? 'Thuộc tính' : 'Chăm sóc'}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#222222]"></div>}
                  </button>
                ))}
              </div>

              <div className="text-[#5a5a5a] text-sm leading-relaxed min-h-[100px]">
                {activeTab === 'details' && (
                  <div className="animate-fade-in text-sm leading-relaxed text-[#5a5a5a]">
                    {product.attributes && product.attributes.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-2">
                        {product.attributes.map((attr, idx) => (
                          <li key={idx}><strong>{attr.attributeName}:</strong> {attr.attributeValue}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>Đang cập nhật thông tin chi tiết.</p>
                    )}
                  </div>
                )}
                {activeTab === 'care' && (
                  <div className="animate-fade-in text-sm leading-relaxed text-[#5a5a5a]">
                    {product.careInstructions ? (
                      <div dangerouslySetInnerHTML={{ __html: product.careInstructions }} />
                    ) : (
                      <p>Đang cập nhật hướng dẫn chăm sóc.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ——— Full Width HTML Description ——— */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="w-full">
            <h2 className="text-left font-serif text-3xl text-[#222222] mb-6 uppercase tracking-widest border-b border-gray-200 pb-4">
              Mô tả
            </h2>
            <div className="text-[#5a5a5a] text-base leading-relaxed">
              {product.descriptionHtml ? (
                <div 
                  className="prose prose-stone max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} 
                />
              ) : (
                <p className="italic">Đang cập nhật bài viết mô tả chi tiết cho sản phẩm này.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ProductDetails
