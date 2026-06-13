import React, { useState, useEffect } from 'react'

function ProductSidebar({ selectedCategoryId, onCategoryChange, priceRange, onPriceChange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localMin, setLocalMin] = useState(priceRange.min);
  const [localMax, setLocalMax] = useState(priceRange.max);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/categories`)
      .then(res => res.json())
      .then(data => { setCategories(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setLocalMin(priceRange.min);
    setLocalMax(priceRange.max);
  }, [priceRange]);

  const handleApplyPrice = () => onPriceChange({ min: localMin, max: localMax });

  const renderCategories = (parentId = null, depth = 0) => {
    const childs = categories.filter(c => c.parentId === parentId);
    if (childs.length === 0) return null;

    return (
      <ul className={`flex flex-col gap-0.5 ${depth > 0 ? 'ml-4 mt-1' : ''}`}>
        {childs.map(cat => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <li key={cat.id}>
              <button
                onClick={() => onCategoryChange(isSelected ? null : cat.id)}
                className={`w-full text-left flex justify-between items-center px-3 py-2.5 rounded-full transition-all text-sm ${
                  isSelected
                    ? 'bg-[#1b6060] text-white font-semibold shadow-md shadow-[#1b6060]/20'
                    : 'text-[#5a5a5a] hover:text-[#2c2c2c] hover:bg-[#f6f3ed]'
                }`}
              >
                <span>{cat.name}</span>
                {cat.productCount > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-[#e8e0d5] text-[#888888]'}`}>
                    {cat.productCount}
                  </span>
                )}
              </button>
              {renderCategories(cat.id, depth + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="w-full bg-white border border-[#e8e0d5] rounded-3xl p-6 shadow-sm sticky top-28">
      {/* Danh mục */}
      <div className="mb-8">
        <h3 className="font-serif text-[#2c2c2c] font-bold text-base mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#1b6060]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
          </svg>
          Danh mục
        </h3>
        {loading ? (
          <div className="text-sm text-[#888888] animate-pulse">Đang tải...</div>
        ) : (
          renderCategories(null)
        )}
      </div>

      <hr className="border-[#e8e0d5] mb-8" />

      {/* Lọc theo giá */}
      <div>
        <h3 className="font-serif text-[#2c2c2c] font-bold text-base mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#1b6060]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Khoảng giá
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={localMin || ''}
              onChange={e => setLocalMin(e.target.value)}
              placeholder="Từ..."
              className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-xl px-3 py-2 text-sm text-[#2c2c2c] focus:outline-none focus:border-[#1b6060] focus:ring-2 focus:ring-[#1b6060]/10 transition-all"
            />
            <span className="text-[#888888] font-bold">—</span>
            <input
              type="number"
              value={localMax || ''}
              onChange={e => setLocalMax(e.target.value)}
              placeholder="Đến..."
              className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-xl px-3 py-2 text-sm text-[#2c2c2c] focus:outline-none focus:border-[#1b6060] focus:ring-2 focus:ring-[#1b6060]/10 transition-all"
            />
          </div>
          <button
            onClick={handleApplyPrice}
            className="w-full bg-[#1b6060] hover:bg-[#144848] text-white py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-md shadow-[#1b6060]/20"
          >
            Áp dụng
          </button>
          {(priceRange.min || priceRange.max) && (
            <button
              onClick={() => { setLocalMin(''); setLocalMax(''); onPriceChange({ min: '', max: '' }); }}
              className="text-xs text-[#888888] hover:text-[#1b6060] mt-0 text-center transition-colors"
            >
              Xóa bộ lọc giá
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductSidebar
