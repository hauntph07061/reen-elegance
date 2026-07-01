import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ProductCard from '../components/shop/ProductCard'

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    // Fetch 3 featured products
    fetch(`${import.meta.env.VITE_API_URL}/v1/products?isFeatured=true&size=3&sort=id,desc`)
      .then(r => r.json())
      .then(d => setFeaturedProducts(d.content || []))
      .catch(() => {})
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* We keep the global header but in the template the header is floating over the hero. 
          To achieve the template look without breaking the global layout, we'll keep the header above.
          However, to match the template closely, we can use a custom hero section. */}
      <Header />

      {/* ——— HERO SECTION ——— */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=1600" 
            alt="Hero Background" 
            className="w-full h-full object-cover brightness-[0.65]"
          />
        </div>
        <div className="relative z-10 px-6 max-w-4xl mx-auto flex flex-col items-center animate-fade-in">
          <h1 className="font-serif text-5xl md:text-7xl font-normal text-white leading-tight mb-10 tracking-wide">
            Transform Your Space with Greenery
          </h1>
          <Link
            to="/shop"
            className="bg-white text-[#a3a68c] font-medium px-10 py-3.5 rounded-lg hover:bg-gray-100 transition-colors tracking-wide text-sm"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* ——— ABOUT SECTION ——— */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left Image */}
          <div className="relative aspect-[4/5] md:aspect-[3/4] w-full max-w-md mx-auto md:ml-0 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=800&q=80" 
              alt="Curated Plants"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Right Text */}
          <div className="flex flex-col items-start max-w-lg">
            <h2 className="font-serif text-4xl md:text-5xl text-[#222222] font-normal leading-[1.3] mb-10">
              We curate and cultivate plants so that they can thrive indoors in your home. No sweat!
            </h2>
            <Link
              to="/about"
              className="bg-[#a3a68c] text-white font-medium px-8 py-3.5 rounded-lg hover:bg-[#8e9177] transition-colors tracking-wide text-sm"
            >
              About Us
            </Link>
          </div>
        </div>
      </section>

      {/* ——— MARQUEE BANNER ——— */}
      <div className="bg-[#a3a68c] text-white py-3 overflow-hidden whitespace-nowrap opacity-90 border-y border-[#8e9177]">
        <div className="animate-marquee inline-block text-xs font-medium tracking-widest">
          {/* Duplicate text to create continuous loop effect */}
          {Array(4).fill("25% OFF * BUY NOW * FREE SHIPPING * ").map((text, i) => (
            <span key={i} className="mx-4">{text}</span>
          ))}
        </div>
      </div>

      {/* ——— FAVORITES SECTION ——— */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center font-serif text-4xl md:text-5xl text-[#222222] font-normal mb-16">
            Favorites
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            )) : (
              // Dummy data if API empty
              [1,2,3].map((i) => (
                <div key={i} className="group flex flex-col">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 mb-6" />
                  <div className="h-6 w-3/4 bg-gray-200 mb-2 rounded" />
                  <div className="h-4 w-1/4 bg-gray-200 rounded" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <Footer />

      {/* Marquee Animation CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}} />
    </div>
  )
}

export default Home
