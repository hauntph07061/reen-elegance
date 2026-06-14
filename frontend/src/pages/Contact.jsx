import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import SEO from '../components/ui/SEO'

export default function Contact() {
  const [shops, setShops] = useState([])
  const [selectedShop, setSelectedShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    store_name: 'CÔNG TY TNHH GREEN ELEGANCE',
    store_address: '123 Đường Hoa Lan, Quận 1, TP. HCM',
    store_phone: '0987.654.321',
    store_email: 'contact@greenelegance.vn'
  });
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0)
    
    // Fetch settings
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

    // Fetch shops
    fetch(`${import.meta.env.VITE_API_URL}/v1/shops`)
      .then(r => r.json())
      .then(data => {
        setShops(data)
        if (data?.length > 0) setSelectedShop(data[0])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc (Họ tên, Email, Nội dung).');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          subject: 'Liên hệ từ khách hàng',
          message: formData.message
        })
      });
      
      if (response.ok) {
        toast.success('Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ lại sớm nhất.');
        setFormData({ fullName: '', phone: '', email: '', message: '' });
      } else {
        toast.error('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.');
      }
    } catch (error) {
      toast.error('Lỗi kết nối máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us | Green Elegance"
        description="Find Green Elegance store locations and contact information."
        url="https://greenelegance.vn/contact"
      />
      <div className="flex flex-col min-h-screen bg-white text-[#222222]">
        <Header />

        {/* Page Banner */}
        <div className="pt-24 md:pt-40 pb-8 md:pb-16 text-center px-4">
          <div className="max-w-6xl mx-auto">
            <span className="text-[10px] font-bold tracking-widest text-[#5a5a5a] uppercase">Hệ Thống Cửa Hàng</span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#222222] mt-4 mb-4 uppercase tracking-wider">Liên Hệ</h1>
            <p className="text-[#5a5a5a] max-w-xl mx-auto text-xs sm:text-sm">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn tìm kiếm mảng xanh phù hợp nhất cho không gian của mình.
            </p>
          </div>
        </div>

        <main className="flex-1 max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-12 w-full">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { icon: '📞', label: 'Điện thoại', value: settings.store_phone, sub: settings.store_working_hours || '8:00 – 21:00 Hàng ngày' },
              { icon: '✉️', label: 'Email', value: settings.store_email, sub: 'Phản hồi trong 24h' },
              { icon: '💬', label: 'Tư vấn', value: settings.store_phone, sub: 'Hỗ trợ qua Zalo' },
              { icon: '📍', label: 'Văn phòng chính', value: settings.store_address, sub: 'Việt Nam' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-transparent hover:border-gray-200 text-center transition-all duration-300">
                <div className="text-2xl mb-2 md:mb-4">{item.icon}</div>
                <div className="text-[9px] md:text-[10px] font-bold text-[#5a5a5a] uppercase tracking-widest mb-1 md:mb-2">{item.label}</div>
                <div className="font-serif text-[#222222] text-xs md:text-sm break-all">{item.value}</div>
                <div className="text-[10px] md:text-xs text-[#888888] mt-1 md:mt-2">{item.sub}</div>
              </div>
            ))}
          </div>

          {/* Shop List + Map */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-16">
            <div className="flex flex-col lg:flex-row">
              {/* Left: Shop List */}
              <div className="w-full lg:w-1/3 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-gray-100">
                <h2 className="font-serif text-xl md:text-2xl font-normal uppercase tracking-wider text-[#222222] mb-6 md:mb-8">Danh sách cửa hàng</h2>
                {loading ? (
                  <div className="flex flex-col gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-100 h-24 rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 overflow-y-auto max-h-[350px] lg:max-h-[500px] pr-2">
                    {shops.map((shop) => (
                      <div
                        key={shop.id}
                        onClick={() => setSelectedShop(shop)}
                        className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 ${
                          selectedShop?.id === shop.id
                            ? 'border-[#222222] bg-gray-50'
                            : 'border-transparent hover:bg-gray-50'
                        }`}
                      >
                        <h3 className={`font-serif text-base md:text-lg tracking-wide uppercase mb-1 md:mb-2 ${selectedShop?.id === shop.id ? 'text-[#222222]' : 'text-[#5a5a5a]'}`}>
                          {shop.name}
                        </h3>
                        <p className="text-[#5a5a5a] text-xs mb-1 md:mb-2 leading-relaxed">
                          {shop.address}
                        </p>
                        <p className="text-[#222222] text-xs font-medium">
                          {shop.phone}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Map */}
              <div className="flex-1 min-h-[300px] md:min-h-[450px] lg:min-h-[600px] bg-gray-50 relative">
                {!loading && selectedShop ? (
                  <div
                    className="absolute inset-0 w-full h-full grayscale opacity-80"
                    dangerouslySetInnerHTML={{ __html: selectedShop.mapIframe }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-[#a3a68c] rounded-full animate-spin" />
                  </div>
                )}
                <style dangerouslySetInnerHTML={{ __html: `.map-iframe iframe { width: 100% !important; height: 100% !important; }` }} />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start pb-12">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#5a5a5a] uppercase">Kết nối với chúng tôi</span>
              <h2 className="font-serif text-2xl md:text-3xl font-normal uppercase tracking-wider text-[#222222] mt-2 md:mt-4 mb-4 md:mb-6">Gửi tin nhắn</h2>
              <p className="text-[#5a5a5a] text-xs md:text-sm leading-relaxed mb-6 md:mb-8">
                Bạn có câu hỏi về sản phẩm hay cần hỗ trợ với đơn hàng? Vui lòng điền thông tin vào biểu mẫu, chúng tôi sẽ phản hồi trong thời gian sớm nhất.
              </p>
              <div className="flex flex-col gap-3 md:gap-4 text-xs text-[#5a5a5a] uppercase tracking-wider font-bold">
                <div className="flex items-center gap-4"><span>—</span> Tư vấn miễn phí</div>
                <div className="flex items-center gap-4"><span>—</span> Phản hồi nhanh chóng</div>
                <div className="flex items-center gap-4"><span>—</span> Đặt hàng theo yêu cầu</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col gap-5 md:gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="text-[10px] font-bold text-[#5a5a5a] mb-2 block uppercase tracking-widest">Họ & Tên *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleFormChange} required className="w-full bg-gray-50 border border-transparent rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#222222] transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#5a5a5a] mb-2 block uppercase tracking-widest">Số điện thoại</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} className="w-full bg-gray-50 border border-transparent rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#222222] transition-all" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#5a5a5a] mb-2 block uppercase tracking-widest">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleFormChange} required className="w-full bg-gray-50 border border-transparent rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#222222] transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#5a5a5a] mb-2 block uppercase tracking-widest">Nội dung *</label>
                <textarea rows={4} name="message" value={formData.message} onChange={handleFormChange} required className="w-full bg-gray-50 border border-transparent rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#222222] transition-all resize-none" />
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full bg-[#222222] hover:bg-[#a3a68c] disabled:opacity-50 text-white font-medium py-4 rounded-full transition-all duration-300 text-[10px] uppercase tracking-widest mt-2">
                {isSubmitting ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
              </button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
