import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import SEO from '../components/ui/SEO'

export default function BlogDetails() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/v1/posts/${slug}`)
      .then(r => { if (r.status === 404) navigate('/tin-tuc'); return r.json() })
      .then(data => { setPost(data); setLoading(false) })
      .catch(() => setLoading(false))

    fetch(`${import.meta.env.VITE_API_URL}/v1/posts/${slug}/related?limit=3`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setRelatedPosts(data))
      .catch(() => {})
  }, [slug])

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#2c2c2c]">
      <Header />

      <main className="flex-1 pb-20">
        {loading ? (
          <div className="max-w-3xl mx-auto px-6 pt-16 animate-pulse space-y-6">
            <div className="h-5 bg-[#f6f3ed] rounded-full w-1/3" />
            <div className="h-10 bg-[#f6f3ed] rounded-2xl w-full" />
            <div className="h-[400px] bg-[#f6f3ed] rounded-3xl" />
            {[...Array(4)].map((_, i) => <div key={i} className="h-4 bg-[#f6f3ed] rounded-full" />)}
          </div>
        ) : post ? (
          <>
            <SEO
              title={post.title}
              description={post.summary}
              image={post.thumbnailUrl}
              url={`${window.location.origin}/tin-tuc/${post.slug}`}
            />

            {/* Hero Image */}
            <div className="w-full h-[55vh] bg-[#f6f3ed] overflow-hidden relative">
              <img
                src={post.thumbnailUrl || `https://picsum.photos/seed/${slug}/1400/600`}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/30">
                    Blog
                  </span>
                  <span className="text-white/70 text-xs">
                    {new Date(post.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-md">
                  {post.title}
                </h1>
              </div>
            </div>

            {/* Article Content */}
            <article className="max-w-3xl mx-auto px-6 pt-10">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs text-[#888888] mb-8">
                <Link to="/" className="hover:text-[#1b6060] transition-colors">Trang chủ</Link>
                <span>/</span>
                <Link to="/tin-tuc" className="hover:text-[#1b6060] transition-colors">Tin tức</Link>
                <span>/</span>
                <span className="text-[#2c2c2c] truncate">{post.title}</span>
              </nav>

              {/* Summary / Lead */}
              {post.summary && (
                <div className="bg-[#f6f3ed] border-l-4 border-[#1b6060] rounded-r-2xl p-6 mb-10">
                  <p className="text-[#2c2c2c] text-lg leading-relaxed font-medium italic">{post.summary}</p>
                </div>
              )}

              {/* Content */}
              <div
                className="prose prose-lg max-w-none text-[#4a4a4a] leading-relaxed
                  prose-headings:font-serif prose-headings:text-[#2c2c2c]
                  prose-a:text-[#1b6060] prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-[#2c2c2c]
                  prose-img:rounded-2xl prose-img:shadow-md
                  prose-blockquote:border-l-[#1b6060] prose-blockquote:bg-[#f6f3ed] prose-blockquote:rounded-r-xl prose-blockquote:py-1"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Author & Share */}
              <div className="mt-12 pt-8 border-t border-[#e8e0d5] flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1b6060]/10 rounded-full flex items-center justify-center font-bold text-[#1b6060]">
                    GE
                  </div>
                  <div>
                    <div className="font-semibold text-[#2c2c2c] text-sm">Green Elegance</div>
                    <div className="text-xs text-[#888888]">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#888888]">Chia sẻ:</span>
                  {['Facebook', 'Zalo'].map(s => (
                    <button key={s} className="bg-[#f6f3ed] hover:bg-[#1b6060] hover:text-white text-[#5a5a5a] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#e8e0d5] transition-all duration-200">
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Back to blog */}
              <div className="mt-8">
                <Link
                  to="/tin-tuc"
                  className="inline-flex items-center gap-2 text-[#1b6060] border border-[#1b6060] hover:bg-[#1b6060] hover:text-white font-semibold px-5 py-2.5 rounded-full transition-all duration-300 text-sm"
                >
                  ← Quay lại danh sách bài viết
                </Link>
              </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="max-w-7xl mx-auto px-6 mt-20 pt-12 border-t border-[#e8e0d5]">
                <div className="text-center mb-10">
                  <span className="text-xs font-semibold tracking-widest text-[#1b6060] uppercase">Có thể bạn thích</span>
                  <h3 className="font-serif text-3xl font-bold text-[#2c2c2c] mt-2">Bài Viết Liên Quan</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map(item => (
                    <Link key={item.id} to={`/tin-tuc/${item.slug}`}
                      className="group bg-white border border-[#e8e0d5] rounded-3xl overflow-hidden hover:shadow-[0_12px_40px_rgba(27,96,96,0.1)] hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="aspect-[16/9] overflow-hidden bg-[#f6f3ed]">
                        <img src={item.thumbnailUrl || `https://picsum.photos/seed/${item.id}/800/450`} alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                      <div className="p-5">
                        <h4 className="font-serif font-bold text-[#2c2c2c] text-sm line-clamp-2 group-hover:text-[#1b6060] transition-colors mb-2">
                          {item.title}
                        </h4>
                        {item.summary && (
                          <p className="text-[#888888] text-xs line-clamp-2">{item.summary}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : null}
      </main>

      <Footer />
    </div>
  )
}
