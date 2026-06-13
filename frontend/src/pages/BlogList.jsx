import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

export default function BlogList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    setLoading(true)
    window.scrollTo(0, 0)
    fetch(`${import.meta.env.VITE_API_URL}/v1/posts?page=${page}&size=9`)
      .then(r => r.json())
      .then(data => { setPosts(data.content); setTotalPages(data.totalPages); setLoading(false) })
      .catch(() => setLoading(false))
  }, [page])

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#2c2c2c]">
      <Header />

      {/* Page Banner */}
      <div className="bg-[#f6f3ed] border-b border-[#e8e0d5] pt-32 pb-14 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs font-semibold tracking-widest text-[#1b6060] uppercase">Kiến thức & Cảm hứng</span>
          <h1 className="font-serif text-4xl font-bold text-[#2c2c2c] mt-2 mb-4">Tin Tức & Bài Viết</h1>
          <p className="text-[#5a5a5a] leading-relaxed">
            Khám phá xu hướng cắm hoa nghệ thuật, bí quyết chăm sóc cây cảnh và những câu chuyện đằng sau mỗi đóa hoa Green Elegance.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-[#f6f3ed] rounded-3xl h-[380px] border border-[#e8e0d5]" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="w-20 h-20 bg-[#f6f3ed] rounded-full flex items-center justify-center text-4xl">📰</div>
            <h2 className="font-serif font-bold text-[#2c2c2c] text-xl">Chưa có bài viết nào</h2>
            <p className="text-[#888888] text-sm">Hãy quay lại sau nhé!</p>
          </div>
        ) : (
          <>
            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {posts.map((post, idx) => (
                <Link
                  key={post.id}
                  to={`/tin-tuc/${post.slug}`}
                  className={`group flex flex-col bg-white border border-[#e8e0d5] rounded-3xl overflow-hidden hover:shadow-[0_12px_40px_rgba(27,96,96,0.1)] hover:-translate-y-1 transition-all duration-300 ${idx === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#f6f3ed]">
                    <img
                      src={post.thumbnailUrl || `https://picsum.photos/seed/${post.id}/800/450`}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Date badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#1b6060] text-xs font-bold px-3 py-1.5 rounded-full border border-[#e8e0d5]">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' })}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1 gap-3">
                    <h2 className="font-serif text-lg font-bold text-[#2c2c2c] line-clamp-2 group-hover:text-[#1b6060] transition-colors leading-snug">
                      {post.title}
                    </h2>
                    {post.summary && (
                      <p className="text-[#5a5a5a] text-sm line-clamp-2 flex-1 leading-relaxed">
                        {post.summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-[#888888]">
                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="text-[#1b6060] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Đọc tiếp
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-14 flex justify-center items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="w-10 h-10 rounded-full border border-[#e8e0d5] bg-white text-[#5a5a5a] hover:bg-[#1b6060] hover:text-white hover:border-[#1b6060] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  ←
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i)}
                    className={`w-10 h-10 rounded-full border transition-all font-semibold text-sm ${
                      page === i ? 'bg-[#1b6060] border-[#1b6060] text-white shadow-md' : 'border-[#e8e0d5] bg-white text-[#5a5a5a] hover:bg-[#f6f3ed]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="w-10 h-10 rounded-full border border-[#e8e0d5] bg-white text-[#5a5a5a] hover:bg-[#1b6060] hover:text-white hover:border-[#1b6060] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
