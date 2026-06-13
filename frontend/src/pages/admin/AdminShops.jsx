import { useState, useEffect } from 'react';
import { MapPin, Phone, Trash2, Edit, Plus, X } from 'lucide-react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import toast from 'react-hot-toast';
import Pagination from '../../components/ui/Pagination';

export default function AdminShops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    mapIframe: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/shops`);
      if (res.ok) {
        const data = await res.json();
        setShops(data);
      }
    } catch (error) {
      toast.error('Lỗi tải danh sách cửa hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const openModal = (shop = null) => {
    if (shop) {
      setEditingShop(shop);
      setFormData({
        name: shop.name,
        address: shop.address,
        phone: shop.phone,
        mapIframe: shop.mapIframe
      });
    } else {
      setEditingShop(null);
      setFormData({ name: '', address: '', phone: '', mapIframe: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingShop(null);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone || !formData.mapIframe) {
      toast.error('Vui lòng điền đầy đủ các trường.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const url = editingShop 
        ? `${import.meta.env.VITE_API_URL}/v1/admin/shops/${editingShop.id}`
        : `${import.meta.env.VITE_API_URL}/v1/admin/shops`;
        
      const method = editingShop ? 'PUT' : 'POST';

      const res = await fetchWithAuth(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(editingShop ? 'Cập nhật cửa hàng thành công' : 'Thêm cửa hàng thành công');
        closeModal();
        fetchShops();
      } else {
        toast.error('Lỗi khi lưu cửa hàng');
      }
    } catch (error) {
      toast.error('Lỗi kết nối máy chủ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div>
        <p className="font-medium text-[#2c2c2c] mb-3">Bạn có chắc chắn muốn xóa cửa hàng này?</p>
        <div className="flex gap-2 justify-end">
          <button 
            onClick={() => {
              toast.dismiss(t.id);
              executeDelete(id);
            }} 
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
          >
            Xóa
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="bg-gray-100 hover:bg-gray-200 text-[#5a5a5a] px-3 py-1.5 rounded text-sm transition-colors"
          >
            Hủy
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const executeDelete = async (id) => {
    try {
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/shops/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('Xóa cửa hàng thành công');
        fetchShops();
      } else {
        toast.error('Lỗi khi xóa cửa hàng');
      }
    } catch (error) {
      toast.error('Lỗi kết nối máy chủ');
    }
  };

  const totalItems = shops.length;
  const paginatedShops = shops.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-[#2c2c2c] mb-1">Hệ thống Cửa hàng</h2>
          <p className="text-[#888888] text-sm">Quản lý danh sách các chi nhánh và địa chỉ bản đồ.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-[#2c2c2c] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-black transition-colors"
        >
          <Plus className="w-4 h-4" /> Thêm cửa hàng
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-500">Đang tải...</div>
        ) : paginatedShops.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-[#e8e0d5]">Chưa có cửa hàng nào</div>
        ) : (
          paginatedShops.map(shop => (
            <div key={shop.id} className="bg-white rounded-2xl border border-[#e8e0d5] shadow-sm overflow-hidden flex flex-col">
              <div className="h-48 w-full bg-gray-100 relative">
                <div 
                  className="absolute inset-0 w-full h-full grayscale opacity-80"
                  dangerouslySetInnerHTML={{ __html: shop.mapIframe }}
                />
                <style dangerouslySetInnerHTML={{ __html: `.h-48 iframe { width: 100% !important; height: 100% !important; pointer-events: none; }` }} />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-serif text-lg font-bold text-[#2c2c2c] mb-3">{shop.name}</h3>
                <div className="space-y-2 flex-1 text-sm">
                  <div className="flex items-start gap-2 text-[#5a5a5a]">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#a3a68c]" />
                    <span className="leading-relaxed">{shop.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#5a5a5a]">
                    <Phone className="w-4 h-4 shrink-0 text-[#a3a68c]" />
                    <span>{shop.phone}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-6 pt-4 border-t border-[#e8e0d5]">
                  <button 
                    onClick={() => openModal(shop)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#f6f3ed] text-[#2c2c2c] text-sm font-medium rounded-lg hover:bg-[#e8e0d5] transition-colors"
                  >
                    <Edit className="w-4 h-4" /> Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(shop.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {!loading && totalItems > 0 && (
        <Pagination 
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-serif text-xl font-bold text-[#2c2c2c]">
                {editingShop ? 'Cập nhật cửa hàng' : 'Thêm cửa hàng mới'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Tên cửa hàng *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  placeholder="Vd: Chi nhánh Quận 1"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2c2c2c] transition-colors" 
                />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Số điện thoại *</label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  placeholder="Vd: 0987.654.321"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2c2c2c] transition-colors" 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Địa chỉ chi tiết *</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  required
                  rows={2}
                  placeholder="Vd: 123 Đường Hoa Lan, Phường 2, Quận Phú Nhuận, TP.HCM"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2c2c2c] transition-colors resize-none" 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Iframe Google Maps *</label>
                <textarea 
                  name="mapIframe"
                  value={formData.mapIframe}
                  onChange={handleFormChange}
                  required
                  rows={3}
                  placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2c2c2c] transition-colors font-mono text-xs" 
                />
                <p className="text-xs text-gray-400 mt-2">Vào Google Maps, chọn Chia sẻ &gt; Nhúng bản đồ, sau đó copy thẻ &lt;iframe&gt; dán vào đây.</p>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 text-sm font-medium border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 text-sm font-medium bg-[#222222] text-white rounded-xl hover:bg-black disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu cửa hàng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
