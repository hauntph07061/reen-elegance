import { useState, useEffect } from 'react';
import { User, Search, MapPin, Phone, Mail, Award, Clock } from 'lucide-react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import toast from 'react-hot-toast';
import Pagination from '../../components/ui/Pagination';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal Orders
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/users`);
      if (res.ok) {
        const data = await res.json();
        // Lọc ra các user có role CUSTOMER
        setCustomers(data.filter(u => u.role === 'CUSTOMER'));
      }
    } catch (error) {
      toast.error('Lỗi tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrders = async (customer) => {
    setSelectedCustomer(customer);
    setIsOrderModalOpen(true);
    setLoadingOrders(true);
    try {
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/users/${customer.id}/orders`);
      if (res.ok) {
        setCustomerOrders(await res.json());
      }
    } catch (error) {
      toast.error('Lỗi tải lịch sử mua hàng');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter & Pagination Logic
  const filteredCustomers = customers.filter(c => 
    c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalItems = filteredCustomers.length;
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif text-[#2c2c2c] mb-1">Quản lý Khách hàng</h2>
          <p className="text-[#888888] text-sm">Xem danh sách, thông tin liên lạc và điểm thưởng của khách hàng.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm khách hàng..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#e8e0d5] rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#2c2c2c] transition-colors"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8e0d5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-[#e8e0d5] text-[#5a5a5a] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Khách hàng</th>
                <th className="px-6 py-4 font-bold">Ngày đăng ký</th>
                <th className="px-6 py-4 font-bold text-center">Tổng đơn hàng</th>
                <th className="px-6 py-4 font-bold text-right">Tổng chi tiêu</th>
                <th className="px-6 py-4 font-bold text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e0d5]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Đang tải...</td>
                </tr>
              ) : paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Không tìm thấy khách hàng nào</td>
                </tr>
              ) : (
                paginatedCustomers.map(customer => (
                  <tr 
                    key={customer.id} 
                    onClick={() => handleViewOrders(customer)}
                    className="cursor-pointer hover:bg-[#f6f3ed] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#f6f3ed] flex items-center justify-center text-[#2c2c2c] font-bold">
                          {customer.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-[#2c2c2c]">{customer.fullName || 'Chưa cập nhật'}</div>
                          <div className="text-xs text-[#888888] flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-[#a3a68c]" />
                            {customer.phone || customer.username || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-[#5a5a5a]">
                        {new Date(customer.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-[#2c2c2c]">
                        {customer.totalOrders || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs text-[#2e7d32] font-semibold bg-green-50 px-2 py-0.5 rounded">
                        {customer.totalSpent?.toLocaleString('vi-VN') || 0}đ
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        customer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {customer.isActive ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          <Pagination 
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>

      {/* Modal Lịch sử đơn hàng */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#e8e0d5] flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f6f3ed] flex items-center justify-center text-[#2c2c2c] font-bold text-xl shrink-0">
                  {selectedCustomer?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="text-xl font-serif text-[#2c2c2c] mb-1">{selectedCustomer?.fullName}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[#5a5a5a]">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#a3a68c]" /> {selectedCustomer?.phone || selectedCustomer?.username || 'N/A'}</span>
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#a3a68c]" /> {selectedCustomer?.email || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOrderModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 rounded-full p-1"
              >
                ✕
              </button>
            </div>
            
            <div className="px-6 py-4 bg-[#fcfbf9] border-b border-[#e8e0d5] grid grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-xl border border-[#e8e0d5]">
                <div className="text-xs text-[#888888] mb-1 uppercase tracking-wider">Tổng đơn hàng</div>
                <div className="text-lg font-bold text-[#2c2c2c]">{selectedCustomer?.totalOrders || 0}</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#e8e0d5]">
                <div className="text-xs text-[#888888] mb-1 uppercase tracking-wider">Tổng chi tiêu</div>
                <div className="text-lg font-bold text-[#2e7d32]">{selectedCustomer?.totalSpent?.toLocaleString('vi-VN') || 0}đ</div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#e8e0d5]">
                <div className="text-xs text-[#888888] mb-1 uppercase tracking-wider">Điểm thưởng</div>
                <div className="text-lg font-bold text-amber-600">{selectedCustomer?.loyaltyPoints?.toLocaleString('vi-VN') || 0}</div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-white">
              <h4 className="font-bold text-[#2c2c2c] mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#a3a68c]" /> Lịch sử mua hàng chi tiết
              </h4>
              {loadingOrders ? (
                <div className="text-center py-8 text-gray-500">Đang tải lịch sử...</div>
              ) : customerOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">Khách hàng này chưa có đơn hàng nào.</div>
              ) : (
                <div className="space-y-4">
                  {customerOrders.map(order => (
                    <div key={order.id} className="border border-[#e8e0d5] rounded-xl p-4 hover:border-[#a3a68c] transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold text-[#2c2c2c]">{order.orderCode}</div>
                          <div className="text-xs text-[#888888]">{new Date(order.createdAt).toLocaleString('vi-VN')}</div>
                        </div>
                        <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {order.status === 'PENDING_CONFIRMATION' ? 'Chờ xác nhận' :
                           order.status === 'PROCESSING' ? 'Đang xử lý' :
                           order.status === 'DELIVERING' ? 'Đang giao' :
                           order.status === 'DELIVERED' ? 'Đã giao' :
                           order.status === 'CANCELLED' ? 'Đã hủy' : order.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100">
                        <div className="text-xs text-[#5a5a5a]">
                          Thanh toán: <span className="font-semibold text-[#2c2c2c]">{order.paymentMethod}</span>
                        </div>
                        <div className="font-bold text-[#2e7d32]">
                          {order.grandTotal?.toLocaleString('vi-VN')}đ
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
