import { useState, useEffect } from 'react';
import { Download, Search, Eye, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import Pagination from '../../components/ui/Pagination';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [currentPage, pageSize, statusFilter, startDate, endDate, keyword]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const pageIndex = currentPage - 1; // Spring uses 0-based page index
      let url = `${import.meta.env.VITE_API_URL}/v1/admin/orders?page=${pageIndex}&size=${pageSize}`;
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
      const response = await fetchWithAuth(url);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };



  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING_CONFIRMATION':
        return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">Chờ xác nhận</span>;
      case 'CONFIRMED':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Đã xác nhận</span>;
      case 'SHIPPED':
        return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">Đang giao hàng</span>;
      case 'DELIVERED':
        return <span className="px-3 py-1 bg-[#e0eeee] text-[#144848] rounded-full text-xs font-semibold">Giao thành công</span>;
      case 'CANCELLED':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Đã hủy</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-serif text-[#2c2c2c] mb-1">Quản lý Đơn Hàng</h2>
          <p className="text-[#5a5a5a] text-sm">Theo dõi và cập nhật trạng thái đơn hàng.</p>
        </div>
        
        <div className="flex items-center flex-wrap gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-48 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <input 
              type="text"
              placeholder="Tìm mã đơn, SĐT..."
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white border border-[#e8e0d5] rounded-lg pl-9 pr-4 py-2 text-sm text-[#2c2c2c] focus:outline-none focus:border-[#1b6060] transition-colors"
            />
          </div>
          <input 
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-auto bg-white border border-[#e8e0d5] rounded-lg px-3 py-2 text-sm text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
          />
          <span className="text-[#888888] hidden sm:inline">-</span>
          <input 
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-auto bg-white border border-[#e8e0d5] rounded-lg px-3 py-2 text-sm text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
          />
          <div className="relative flex-1 sm:w-56">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white border border-[#e8e0d5] rounded-lg pl-9 pr-4 py-2 text-sm text-[#2c2c2c] focus:outline-none focus:border-[#1b6060] appearance-none"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING_CONFIRMATION">Chờ xác nhận</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="SHIPPED">Đang giao hàng</option>
              <option value="DELIVERED">Giao thành công</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8e0d5] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#ffffff] border-b border-[#e8e0d5]">
                <th className="px-6 py-4 text-xs font-bold text-[#4a4a4a] uppercase tracking-wider">Mã Đơn</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4a4a4a] uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4a4a4a] uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4a4a4a] uppercase tracking-wider text-right">Tổng Tiền</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4a4a4a] uppercase tracking-wider">Trạng Thái</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4a4a4a] uppercase tracking-wider text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e0d5]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[#888888]">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[#888888]">
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#ffffff] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-[#1b6060]">{order.orderCode}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#5a5a5a]">
                      {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#2c2c2c]">{order.fullName}</div>
                      <div className="text-xs text-[#888888] mt-0.5">{order.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-[#2c2c2c]">
                      {order.grandTotal.toLocaleString()} đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Link 
                        to={`/admin/orders/${order.id}`}
                        className="inline-flex items-center justify-center p-2 text-[#5a5a5a] hover:text-[#1b6060] hover:bg-[#e8e0d5] rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <Pagination 
          currentPage={currentPage}
          totalItems={totalElements}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}
