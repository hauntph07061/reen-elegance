import React, { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ProductCard from '../components/shop/ProductCard'
import Pagination from '../components/ui/Pagination'

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q')
  const categoryIdParam = searchParams.get('categoryId')

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [pageData, setPageData] = useState({ totalPages: 0, totalElements: 0, number: 0 })
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState(searchParams.get('sort') || 'id,desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/categories`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(e => console.error(e))
  }, [])

  useEffect(() => {
    const abortController = new AbortController()
    fetchProducts(abortController.signal)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return () => abortController.abort()
  }, [sort, currentPage, pageSize, q, categoryIdParam])

  const fetchProducts = (signal) => {
    setLoading(true)
    let url = new URL(`${import.meta.env.VITE_API_URL}/v1/products`)
    if (q) url.searchParams.append('q', q)
    if (categoryIdParam) url.searchParams.append('categoryId', categoryIdParam)
    url.searchParams.append('sort', sort)
    url.searchParams.append('page', currentPage - 1)
    url.searchParams.append('size', pageSize)
    fetch(url.toString(), { signal })
      .then(res => res.json())
      .then(data => {
        setProducts(data.content)
        setPageData({ totalPages: data.totalPages, totalElements: data.totalElements, number: data.number })
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setProducts([])
        setPageData({ totalPages: 0, totalElements: 0, number: 0 })
        setLoading(false)
      })
  }

  const handleCategoryClick = (id) => {
    const newParams = new URLSearchParams(searchParams)
    if (id) {
      newParams.set('categoryId', id)
    } else {
      newParams.delete('categoryId')
    }
    newParams.delete('page')
    setCurrentPage(1)
    setSearchParams(newParams)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#222222]">
      <Header />

      {/* Hero Banner for Shop */}
      <div className="pt-24 md:pt-40 pb-8 md:pb-16 text-center px-4">
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#222222] uppercase tracking-wider">
          {q ? `Search: "${q}"` : 'Our Collection'}
        </h1>
        <p className="mt-2 md:mt-4 text-[#5a5a5a] text-xs sm:text-sm">
          Carefully selected plants to bring life to your space.
        </p>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 pb-24 flex flex-col md:flex-row gap-12 lg:gap-16">
        
        {/* Left Sidebar: Categories (Desktop only) */}
        <aside className="hidden md:block w-56 lg:w-64 flex-shrink-0">
          <div className="md:sticky md:top-32 bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="font-serif text-lg text-[#222222] font-medium mb-6 tracking-widest uppercase border-b border-gray-200 pb-4">
              Danh Mục
            </h2>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => handleCategoryClick(null)}
                  className={`text-sm uppercase tracking-wide transition-colors flex items-center ${!categoryIdParam ? 'text-[#222222] font-bold' : 'text-[#5a5a5a] font-medium hover:text-[#222222]'}`}
                >
                  {!categoryIdParam && <span className="mr-2 text-[#a3a68c]">•</span>}
                  Tất cả sản phẩm
                </button>
              </li>
              {categories.filter(c => !c.parentId).map(category => {
                const isActive = Number(categoryIdParam) === category.id;
                return (
                  <li key={category.id}>
                    <button 
                      onClick={() => handleCategoryClick(category.id)}
                      className={`text-sm uppercase tracking-wide transition-colors text-left flex items-center ${isActive ? 'text-[#222222] font-bold' : 'text-[#5a5a5a] font-medium hover:text-[#222222]'}`}
                    >
                      {isActive && <span className="mr-2 text-[#a3a68c]">•</span>}
                      {category.name}
                    </button>
                    {/* Subcategories */}
                    {categories.filter(sub => sub.parentId === category.id).length > 0 && (
                      <ul className="mt-3 ml-2 space-y-3 border-l-2 border-gray-200 pl-4">
                        {categories.filter(sub => sub.parentId === category.id).map(sub => {
                          const isSubActive = Number(categoryIdParam) === sub.id;
                          return (
                            <li key={sub.id}>
                              <button 
                                onClick={() => handleCategoryClick(sub.id)}
                                className={`text-sm uppercase tracking-wide transition-colors text-left flex items-center ${isSubActive ? 'text-[#222222] font-bold' : 'text-[#888888] font-medium hover:text-[#222222]'}`}
                              >
                                {isSubActive && <span className="mr-2 text-[#a3a68c]">•</span>}
                                {sub.name}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1 min-w-0">

          {/* Mobile Categories (Horizontal Scroll - Mobile only) */}
          <div className="block md:hidden mb-6">
            <div className="flex overflow-x-auto gap-2 pb-3 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <button 
                onClick={() => handleCategoryClick(null)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border whitespace-nowrap transition-all ${!categoryIdParam ? 'bg-[#a3a68c] text-white border-[#a3a68c] shadow-sm' : 'bg-gray-50 text-[#5a5a5a] border-gray-200'}`}
              >
                Tất cả
              </button>
              {categories.map(category => {
                const isActive = Number(categoryIdParam) === category.id;
                return (
                  <button 
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border whitespace-nowrap transition-all ${isActive ? 'bg-[#a3a68c] text-white border-[#a3a68c] shadow-sm' : 'bg-gray-50 text-[#5a5a5a] border-gray-200'}`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
            {/* Custom CSS to hide scrollbar */}
            <style dangerouslySetInnerHTML={{ __html: `
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}} />
          </div>

          {/* Toolbar */}
          <div className="flex justify-between items-center mb-6 md:mb-10 pb-4 border-b border-gray-200 gap-4">
            <p className="text-xs sm:text-sm text-[#5a5a5a]">
              Showing <strong className="text-[#222222] font-semibold">{pageData.totalElements}</strong> results
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              <label className="text-[9px] sm:text-sm text-[#5a5a5a] uppercase tracking-wider font-bold whitespace-nowrap">Sort by</label>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setCurrentPage(1) }}
                className="bg-transparent border-none text-xs sm:text-sm text-[#222222] focus:outline-none cursor-pointer uppercase font-serif"
              >
                <option value="id,desc">Newest</option>
                <option value="regularPrice,asc">Price: Low to High</option>
                <option value="regularPrice,desc">Price: High to Low</option>
                <option value="name,asc">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-[#a3a68c] rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
              <h2 className="font-serif text-2xl text-[#222222]">No products found</h2>
              <Link to="/shop" className="text-[#a3a68c] underline text-sm hover:text-[#8e9177]">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-12">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        {/* Pagination */}
        {!loading && pageData.totalElements > 0 && (
          <div className="mt-16">
            <Pagination 
              currentPage={currentPage}
              totalItems={pageData.totalElements}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[12, 20, 50, 100]} // Added 12 for backwards compatibility in UI preference
            />
          </div>
        )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Shop
