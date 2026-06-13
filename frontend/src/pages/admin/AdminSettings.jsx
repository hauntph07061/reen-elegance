import { useState, useEffect, useMemo } from 'react';
import { Save, Store, Truck, Mail, Phone, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import JoditEditor from 'jodit-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    store_name: '',
    store_address: '',
    store_phone: '',
    store_email: '',
    shipping_base_fee: '',
    shipping_free_threshold: '',
    loyalty_earn_rate: '10000',
    store_working_hours: '',
    store_zalo_link: '',
    store_facebook_link: '',
    store_messenger_link: '',
    store_instagram_link: '',
    store_pinterest_link: '',
    about_story: '',
    about_vision: '',
    about_mission: '',
    about_image: '',
    purchase_policy: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    contact: true,
    social: false,
    shipping: false,
    loyalty: false,
    about: false,
    policy: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({...prev, [section]: !prev[section]}));
  };

  const viTranslations = {
    'Type something': 'Nhập nội dung...',
    'bold': 'In đậm',
    'italic': 'In nghiêng',
    'underline': 'Gạch chân',
    'strikethrough': 'Gạch ngang',
    'eraser': 'Xóa định dạng',
    'font': 'Phông chữ',
    'fontsize': 'Cỡ chữ',
    'brush': 'Màu sắc',
    'paragraph': 'Đoạn văn',
    'align': 'Căn lề',
    'ul': 'Danh sách chấm',
    'ol': 'Danh sách số',
    'link': 'Liên kết',
    'image': 'Hình ảnh',
    'video': 'Video',
    'table': 'Bảng',
    'undo': 'Hoàn tác',
    'redo': 'Làm lại',
    'fullsize': 'Toàn màn hình',
    'source': 'Mã HTML'
  };

  const editorConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Nhập nội dung...',
    height: 400,
    language: 'vi',
    i18n: { vi: viTranslations }
  }), []);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Dùng API của public hay admin đều được (chúng ta dùng Admin API)
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/settings`);
      if (response.ok) {
        const data = await response.json();
        // data là mảng các object [{settingKey: '...', settingValue: '...'}]
        const newSettings = {};
        data.forEach(item => {
          newSettings[item.settingKey] = item.settingValue;
        });
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Failed to fetch settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        toast.success('Lưu cài đặt thành công!');
      } else {
        toast.error('Có lỗi xảy ra khi lưu!');
      }
    } catch (error) {
      console.error('Save settings failed', error);
      toast.error('Không thể kết nối với máy chủ!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-[#5a5a5a]">Đang tải cài đặt...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-serif text-[#2c2c2c] mb-1">Cài đặt Hệ thống</h2>
          <p className="text-[#5a5a5a] text-sm">Cấu hình thông tin hiển thị chung và phí giao hàng</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1b6060] hover:bg-[#144848] text-[#ffffff] px-6 py-2.5 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-[#1b6060]/20 disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Thông tin cửa hàng */}
        <div className="bg-white rounded-2xl border border-[#e8e0d5] overflow-hidden">
          <div 
            className="bg-[#f6f3ed] px-6 py-4 border-b border-[#e8e0d5] flex items-center justify-between cursor-pointer select-none hover:bg-[#efeadf] transition-colors"
            onClick={() => toggleSection('contact')}
          >
            <div className="flex items-center">
              <Store className="w-5 h-5 text-[#1b6060] mr-2" />
              <h3 className="font-medium text-[#2c2c2c]">Thông tin liên hệ chung</h3>
            </div>
            {expandedSections.contact ? <ChevronUp className="w-5 h-5 text-[#5a5a5a]" /> : <ChevronDown className="w-5 h-5 text-[#5a5a5a]" />}
          </div>
          {expandedSections.contact && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Tên cửa hàng / Thương hiệu</label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                <input 
                  type="text" name="store_name" value={settings.store_name} onChange={handleChange}
                  className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg pl-10 pr-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Số điện thoại CSKH</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                <input 
                  type="text" name="store_phone" value={settings.store_phone} onChange={handleChange}
                  className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg pl-10 pr-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Địa chỉ trụ sở</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                <input 
                  type="text" name="store_address" value={settings.store_address} onChange={handleChange}
                  className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg pl-10 pr-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Email hỗ trợ</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                <input 
                  type="email" name="store_email" value={settings.store_email} onChange={handleChange}
                  className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg pl-10 pr-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                />
              </div>
            </div>
            </div>
          )}
        </div>

        {/* Thông tin Mạng xã hội & Hỗ trợ */}
        <div className="bg-white rounded-2xl border border-[#e8e0d5] overflow-hidden">
          <div 
            className="bg-[#f6f3ed] px-6 py-4 border-b border-[#e8e0d5] flex items-center justify-between cursor-pointer select-none hover:bg-[#efeadf] transition-colors"
            onClick={() => toggleSection('social')}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 text-[#1b6060] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              <h3 className="font-medium text-[#2c2c2c]">Mạng xã hội & Giờ làm việc</h3>
            </div>
            {expandedSections.social ? <ChevronUp className="w-5 h-5 text-[#5a5a5a]" /> : <ChevronDown className="w-5 h-5 text-[#5a5a5a]" />}
          </div>
          {expandedSections.social && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Giờ làm việc</label>
              <input 
                type="text" name="store_working_hours" value={settings.store_working_hours || ''} onChange={handleChange}
                className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                placeholder="VD: 8:00 – 21:00 Hàng ngày"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Link Zalo OA</label>
              <input 
                type="text" name="store_zalo_link" value={settings.store_zalo_link || ''} onChange={handleChange}
                className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                placeholder="https://zalo.me/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Link Facebook Fanpage</label>
              <input 
                type="text" name="store_facebook_link" value={settings.store_facebook_link || ''} onChange={handleChange}
                className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Link Messenger</label>
              <input 
                type="text" name="store_messenger_link" value={settings.store_messenger_link || ''} onChange={handleChange}
                className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                placeholder="https://m.me/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Link Instagram</label>
              <input 
                type="text" name="store_instagram_link" value={settings.store_instagram_link || ''} onChange={handleChange}
                className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Link Pinterest</label>
              <input 
                type="text" name="store_pinterest_link" value={settings.store_pinterest_link || ''} onChange={handleChange}
                className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                placeholder="https://pinterest.com/..."
              />
            </div>
            </div>
          )}
        </div>

        {/* Phí vận chuyển */}
        <div className="bg-white rounded-2xl border border-[#e8e0d5] overflow-hidden">
          <div 
            className="bg-[#f6f3ed] px-6 py-4 border-b border-[#e8e0d5] flex items-center justify-between cursor-pointer select-none hover:bg-[#efeadf] transition-colors"
            onClick={() => toggleSection('shipping')}
          >
            <div className="flex items-center">
              <Truck className="w-5 h-5 text-[#1b6060] mr-2" />
              <h3 className="font-medium text-[#2c2c2c]">Luật phí vận chuyển (Giao hàng)</h3>
            </div>
            {expandedSections.shipping ? <ChevronUp className="w-5 h-5 text-[#5a5a5a]" /> : <ChevronDown className="w-5 h-5 text-[#5a5a5a]" />}
          </div>
          {expandedSections.shipping && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Phí vận chuyển cơ bản (VNĐ)</label>
              <input 
                type="number" name="shipping_base_fee" value={settings.shipping_base_fee} onChange={handleChange}
                className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                placeholder="VD: 30000"
              />
              <p className="text-xs text-[#888888] mt-1">Phí áp dụng cho mọi đơn hàng chưa đạt hạn mức.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Hạn mức Freeship (VNĐ)</label>
              <input 
                type="number" name="shipping_free_threshold" value={settings.shipping_free_threshold} onChange={handleChange}
                className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                placeholder="VD: 500000"
              />
              <p className="text-xs text-[#888888] mt-1">Đơn hàng có tổng tiền lớn hơn hoặc bằng mức này sẽ được miễn phí vận chuyển.</p>
            </div>
            </div>
          )}
        </div>
        
        {/* Tích điểm Khách hàng */}
        <div className="bg-white rounded-2xl border border-[#e8e0d5] overflow-hidden">
          <div 
            className="bg-[#f6f3ed] px-6 py-4 border-b border-[#e8e0d5] flex items-center justify-between cursor-pointer select-none hover:bg-[#efeadf] transition-colors"
            onClick={() => toggleSection('loyalty')}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 text-[#1b6060] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-medium text-[#2c2c2c]">Chương trình Điểm Thưởng (Loyalty)</h3>
            </div>
            {expandedSections.loyalty ? <ChevronUp className="w-5 h-5 text-[#5a5a5a]" /> : <ChevronDown className="w-5 h-5 text-[#5a5a5a]" />}
          </div>
          {expandedSections.loyalty && (
            <div className="p-6">
            <div className="max-w-md">
              <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Tỷ lệ quy đổi ra 1 Điểm (VNĐ)</label>
              <input 
                type="number" name="loyalty_earn_rate" value={settings.loyalty_earn_rate} onChange={handleChange}
                className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                placeholder="VD: 10000"
              />
              <p className="text-xs text-[#888888] mt-1">Hệ thống sẽ lấy Tổng tiền đơn hàng chia cho số này để ra số điểm khách nhận được (Ví dụ: 100k / 10.000 = 10 điểm).</p>
            </div>
            </div>
          )}
        </div>

        {/* Thông tin Về chúng tôi */}
        <div className="bg-white rounded-2xl border border-[#e8e0d5] overflow-hidden">
          <div 
            className="bg-[#f6f3ed] px-6 py-4 border-b border-[#e8e0d5] flex items-center justify-between cursor-pointer select-none hover:bg-[#efeadf] transition-colors"
            onClick={() => toggleSection('about')}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 text-[#1b6060] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-medium text-[#2c2c2c]">Thông tin Về chúng tôi (About Us)</h3>
            </div>
            {expandedSections.about ? <ChevronUp className="w-5 h-5 text-[#5a5a5a]" /> : <ChevronDown className="w-5 h-5 text-[#5a5a5a]" />}
          </div>
          {expandedSections.about && (
            <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Câu chuyện của chúng tôi</label>
              <textarea 
                name="about_story" value={settings.about_story || ''} onChange={handleChange}
                rows={3}
                className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                placeholder="Ví dụ: Green Elegance ra đời với sứ mệnh..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Tầm nhìn</label>
              <textarea 
                name="about_vision" value={settings.about_vision || ''} onChange={handleChange}
                rows={3}
                className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                placeholder="Ví dụ: Trở thành thương hiệu hàng đầu..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Sứ mệnh</label>
              <textarea 
                name="about_mission" value={settings.about_mission || ''} onChange={handleChange}
                rows={3}
                className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                placeholder="Ví dụ: Lan tỏa tình yêu thiên nhiên..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Ảnh minh họa</label>
              <div className="flex gap-4">
                <input 
                  type="text"
                  name="about_image" value={settings.about_image || ''} onChange={handleChange}
                  className="flex-1 bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                  placeholder="https://example.com/image.jpg hoặc tải ảnh lên"
                />
                <label className="bg-[#e8e0d5] hover:bg-[#d5ccbe] text-[#2c2c2c] px-4 py-2 rounded-lg cursor-pointer flex items-center transition-colors font-medium">
                  Tải ảnh lên
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (file.size > 10 * 1024 * 1024) {
                          toast.error('Kích thước ảnh vượt quá giới hạn 10MB. Vui lòng chọn ảnh nhỏ hơn.');
                          e.target.value = ''; // Reset input
                          return;
                        }
                        const formData = new FormData();
                        formData.append('file', file);
                        try {
                          const uploadRes = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/upload`, {
                            method: 'POST',
                            body: formData
                          });
                          if (uploadRes.ok) {
                            const result = await uploadRes.json();
                            setSettings({ ...settings, about_image: result.url });
                            toast.success('Tải ảnh lên thành công!');
                          } else {
                            toast.error('Lỗi khi tải ảnh lên.');
                          }
                        } catch (err) {
                          toast.error('Không thể kết nối đến máy chủ.');
                        }
                      }
                    }} 
                  />
                </label>
              </div>
              {settings.about_image && (
                <div className="mt-4">
                  <p className="text-xs text-[#888888] mb-2">Xem trước ảnh:</p>
                  <img src={settings.about_image} alt="Preview" className="h-32 object-cover rounded-xl border border-[#e8e0d5]" />
                </div>
              )}
            </div>
            </div>
          )}
        </div>

        {/* Chính sách */}
        <div className="bg-white rounded-2xl border border-[#e8e0d5] overflow-hidden">
          <div 
            className="bg-[#f6f3ed] px-6 py-4 border-b border-[#e8e0d5] flex items-center justify-between cursor-pointer select-none hover:bg-[#efeadf] transition-colors"
            onClick={() => toggleSection('policy')}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 text-[#1b6060] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="font-medium text-[#2c2c2c]">Chính sách mua hàng và đổi trả</h3>
            </div>
            {expandedSections.policy ? <ChevronUp className="w-5 h-5 text-[#5a5a5a]" /> : <ChevronDown className="w-5 h-5 text-[#5a5a5a]" />}
          </div>
          {expandedSections.policy && (
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#5a5a5a] mb-2">Nội dung Chính sách</label>
                <div className="border border-[#e8e0d5] rounded-lg overflow-hidden">
                  <JoditEditor
                    value={settings.purchase_policy || ''}
                    config={editorConfig}
                    onBlur={(newContent) => setSettings({ ...settings, purchase_policy: newContent })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
