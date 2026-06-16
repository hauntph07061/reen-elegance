import React, { useState, useRef, useEffect } from 'react'

function FloatingContact() {
  const [isOpen, setIsOpen] = useState(true)
  const menuRef = useRef(null)

  const [settings, setSettings] = useState({
    store_zalo_link: 'https://zalo.me/',
    store_messenger_link: 'https://m.me/',
    store_phone: '0123456789',
    store_address: '123 Đường Hoa Lan, Quận 1, TP. HCM'
  });

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    
    // Fetch settings
    fetch(`${import.meta.env.VITE_API_URL}/v1/settings`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          setSettings(prev => ({...prev, ...data}));
        } else if (Array.isArray(data)) {
          const newSettings = {};
          data.forEach(item => { newSettings[item.settingKey] = item.settingValue; });
          setSettings(prev => ({...prev, ...newSettings}));
        }
      })
      .catch(e => console.error(e));

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const contacts = [
    {
      id: 'zalo',
      name: 'Chat Zalo',
      href: settings.store_zalo_link === 'https://zalo.me/0123456789' || settings.store_zalo_link === 'https://zalo.me/' || !settings.store_zalo_link
        ? `https://zalo.me/${(settings.store_phone || '0123456789').replace(/\D/g, '')}`
        : settings.store_zalo_link,
      icon: (
        <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" className="w-8 h-8 object-contain" />
      )
    },
    {
      id: 'messenger',
      name: 'Messenger',
      href: settings.store_messenger_link || 'https://m.me/',
      icon: (
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg" alt="Messenger" className="w-8 h-8 object-contain" />
      )
    },
    {
      id: 'call',
      name: 'Gọi điện',
      href: `tel:${(settings.store_phone || '0123456789').replace(/\D/g, '')}`,
      icon: (
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
      )
    },
    {
      id: 'sms',
      name: 'Gửi SMS',
      href: `sms:${(settings.store_phone || '0123456789').replace(/\D/g, '')}`,
      icon: (
        <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
      )
    },
    {
      id: 'map',
      name: 'Chỉ đường',
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.store_address || '')}`,
      icon: (
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" alt="Google Maps" className="w-8 h-8 object-contain" />
      )
    }
  ]

  return (
    <div ref={menuRef} className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
      
      {/* Nút mở rộng (Speed Dial items) */}
      <div className={`flex flex-col gap-3 mb-4 transition-all duration-300 origin-bottom ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-75 opacity-0 pointer-events-none'}`}>
        {contacts.map((contact, idx) => (
          <div key={contact.id} className="flex items-center justify-start gap-3 group">
            {/* Button */}
            <a
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white border border-[#e8e0d5] text-[#1b6060] hover:bg-[#a3a68c] hover:text-white flex items-center justify-center shadow-md hover:scale-110 transition-all duration-300 focus:outline-none"
              aria-label={contact.name}
            >
              {contact.icon}
            </a>
            {/* Tooltip Name */}
            <span className="px-3 py-1.5 bg-white/90 text-[#2c2c2c] text-xs font-medium rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#e8e0d5] pointer-events-none">
              {contact.name}
            </span>
          </div>
        ))}
      </div>

      {/* Nút Main (Toggle) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-[#1b6060] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-[#144848] transition-all duration-300 focus:outline-none"
        aria-label="Liên hệ hỗ trợ"
      >
        {/* Pulse effect background */}
        <span className="absolute inset-0 rounded-full bg-[#1b6060] animate-ping opacity-20"></span>
        
        {/* Toggle Icon */}
        <div className={`transform transition-transform duration-300 ${isOpen ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'} absolute`}>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        
        {/* Close Icon */}
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'} absolute`}>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </button>

    </div>
  )
}

export default FloatingContact
