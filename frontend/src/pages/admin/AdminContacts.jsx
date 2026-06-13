import { useState, useEffect } from 'react';
import { Mail, Phone, Clock, CheckCircle, Search, Eye } from 'lucide-react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import toast from 'react-hot-toast';
import Pagination from '../../components/ui/Pagination';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedContact, setSelectedContact] = useState(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const pageIndex = currentPage - 1;
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/contacts?page=${pageIndex}&size=${pageSize}`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (error) {
      toast.error('Lỗi tải danh sách liên hệ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [currentPage, pageSize]);

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'PENDING' ? 'RESOLVED' : 'PENDING';
    try {
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/contacts/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        toast.success('Cập nhật trạng thái thành công');
        fetchContacts();
        if (selectedContact && selectedContact.id === id) {
          setSelectedContact(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (error) {
      toast.error('Lỗi cập nhật trạng thái');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-[#2c2c2c] mb-1">Quản lý Liên hệ</h2>
          <p className="text-[#888888] text-sm">Quản lý và phản hồi tin nhắn từ khách hàng.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8e0d5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-[#e8e0d5] text-[#5a5a5a] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Khách hàng</th>
                <th className="px-6 py-4 font-bold">Liên lạc</th>
                <th className="px-6 py-4 font-bold">Thời gian</th>
                <th className="px-6 py-4 font-bold">Trạng thái</th>
                <th className="px-6 py-4 font-bold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e0d5]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Đang tải...</td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Chưa có liên hệ nào</td>
                </tr>
              ) : (
                contacts.map(contact => (
                  <tr key={contact.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#2c2c2c]">{contact.fullName}</div>
                      <div className="text-xs text-[#888888] truncate max-w-[200px] mt-1" title={contact.subject || 'Không có chủ đề'}>
                        {contact.subject || 'Không có chủ đề'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-2 text-xs text-[#5a5a5a]">
                          <Mail className="w-3 h-3" /> {contact.email}
                        </span>
                        {contact.phone && (
                          <span className="flex items-center gap-2 text-xs text-[#5a5a5a]">
                            <Phone className="w-3 h-3" /> {contact.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#5a5a5a]">
                      {new Date(contact.createdAt).toLocaleDateString('vi-VN')} <br/>
                      <span className="text-xs text-[#888888]">{new Date(contact.createdAt).toLocaleTimeString('vi-VN')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        contact.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {contact.status === 'PENDING' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                        {contact.status === 'PENDING' ? 'Chờ xử lý' : 'Đã xử lý'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedContact(contact)}
                        className="p-2 text-[#5a5a5a] hover:bg-[#f6f3ed] hover:text-[#2c2c2c] rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <Pagination 
          currentPage={currentPage}
          totalItems={totalElements}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {/* Modal View Details */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-serif text-xl font-bold text-[#2c2c2c]">Chi tiết liên hệ</h3>
              <button onClick={() => setSelectedContact(null)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Khách hàng</div>
                  <div className="font-medium text-gray-900">{selectedContact.fullName}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Ngày gửi</div>
                  <div className="text-gray-900">{new Date(selectedContact.createdAt).toLocaleString('vi-VN')}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email</div>
                  <div className="text-gray-900">{selectedContact.email}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Số điện thoại</div>
                  <div className="text-gray-900">{selectedContact.phone || 'N/A'}</div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Nội dung tin nhắn</div>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-800 whitespace-pre-wrap leading-relaxed border border-gray-100">
                  {selectedContact.message}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase ${
                selectedContact.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
              }`}>
                {selectedContact.status === 'PENDING' ? 'Đang chờ xử lý' : 'Đã xử lý xong'}
              </span>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleUpdateStatus(selectedContact.id, selectedContact.status)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                    selectedContact.status === 'PENDING' 
                      ? 'bg-[#222222] text-white hover:bg-black' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {selectedContact.status === 'PENDING' ? 'Đánh dấu đã xử lý' : 'Đánh dấu chờ xử lý'}
                </button>
                <button 
                  onClick={() => setSelectedContact(null)}
                  className="px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
