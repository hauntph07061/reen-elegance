import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  const [settings, setSettings] = useState({
    store_name: 'Green Elegance',
    store_address: '123 Đường Hoa Lan, Quận 1, TP. HCM',
    store_phone: '0987.654.321',
    store_email: 'contact@greenelegance.vn'
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/settings`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const newSettings = {};
          data.forEach(item => { newSettings[item.settingKey] = item.settingValue; });
          setSettings(prev => ({...prev, ...newSettings}));
        }
      })
      .catch(e => console.error(e));
  }, []);

  return (
    <footer className="bg-[#b2b59e] text-[#222222]">
      <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="font-serif text-2xl font-normal tracking-widest text-[#222222] uppercase">
            {settings.store_name || 'GREEN ELEGANCE'}
          </Link>
          <p className="text-sm leading-relaxed text-[#222222]/80 mt-2">
            Nâng tầm không gian sống của bạn với những tác phẩm nghệ thuật hoa và cây cảnh cao cấp.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-serif font-semibold mb-6 text-sm tracking-widest uppercase text-[#222222]">Khám phá</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li><Link to="/" className="text-[#222222]/80 hover:text-[#222222] transition-colors">Trang chủ</Link></li>
            <li><Link to="/about" className="text-[#222222]/80 hover:text-[#222222] transition-colors">Về chúng tôi</Link></li>
            <li><Link to="/shop" className="text-[#222222]/80 hover:text-[#222222] transition-colors">Sản phẩm</Link></li>
            <li><Link to="/lien-he" className="text-[#222222]/80 hover:text-[#222222] transition-colors">Liên hệ</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-serif font-semibold mb-6 text-sm tracking-widest uppercase text-[#222222]">Kết nối</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li><a href={settings.store_instagram_link || '#'} target="_blank" rel="noopener noreferrer" className="text-[#222222]/80 hover:text-[#222222] transition-colors">Instagram</a></li>
            <li><a href={settings.store_facebook_link || '#'} target="_blank" rel="noopener noreferrer" className="text-[#222222]/80 hover:text-[#222222] transition-colors">Facebook</a></li>
            <li><a href={settings.store_pinterest_link || '#'} target="_blank" rel="noopener noreferrer" className="text-[#222222]/80 hover:text-[#222222] transition-colors">Pinterest</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-serif font-semibold mb-6 text-sm tracking-widest uppercase text-[#222222]">Liên hệ</h3>
          <ul className="flex flex-col gap-3 text-sm text-[#222222]/80">
            <li>{settings.store_email}</li>
            <li>{settings.store_phone}</li>
            <li>{settings.store_address}</li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-[#222222]/20 py-6 px-6 text-center text-xs text-[#222222]/70">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} {settings.store_name || 'Green Elegance'}. All rights reserved.</p>
          <div className="flex gap-6 flex-wrap justify-center sm:justify-end">
            <Link to="/chinh-sach-mua-hang" className="hover:text-[#222222] transition-colors">Chính sách mua hàng</Link>
            <Link to="/chinh-sach-bao-mat" className="hover:text-[#222222] transition-colors">Chính sách bảo mật</Link>
            <Link to="/chinh-sach-giao-nhan" className="hover:text-[#222222] transition-colors">Chính sách giao nhận</Link>
            <Link to="/chinh-sach-doi-tra" className="hover:text-[#222222] transition-colors">Chính sách đổi trả</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
