import { useState, useEffect } from 'react';
import { Plus, Edit2, ShieldBan, Shield, UserCog, Search } from 'lucide-react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import { useAuthStore } from '../../store/useAuthStore';
import { Navigate } from 'react-router-dom';
import Pagination from '../../components/ui/Pagination';

export default function AdminStaff() {
  const { user } = useAuthStore();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [modalError, setModalError] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, staff: null });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  
  const [formData, setFormData] = useState({
    username: '', fullName: '', password: '', role: 'STAFF', isActive: true
  });

  // Nếu không phải ADMIN, chặn truy cập
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/users`);
      if (response.ok) {
        setStaffList(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch staff', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (staff = null) => {
    setModalError('');
    if (staff) {
      setEditingStaff(staff);
      setFormData({ 
        username: staff.username, 
        fullName: staff.fullName, 
        password: '', 
        role: staff.role, 
        isActive: staff.active !== undefined ? staff.active : true 
      });
    } else {
      setEditingStaff(null);
      setFormData({ username: '', fullName: '', password: '', role: 'STAFF', isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    const url = editingStaff 
      ? `${import.meta.env.VITE_API_URL}/v1/admin/users/${editingStaff.id}`
      : `${import.meta.env.VITE_API_URL}/v1/admin/users`;
      
    try {
      const response = await fetchWithAuth(url, {
        method: editingStaff ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchStaff();
      } else {
        const msg = await response.text();
        setModalError(msg || 'Có lỗi xảy ra!');
      }
    } catch (error) {
      setModalError('Lỗi kết nối máy chủ');
    }
  };

  const handleToggleClick = (staff) => {
    if (staff.username === 'admin') return;
    setConfirmModal({ isOpen: true, staff });
  };

  const confirmToggle = async () => {
    const staff = confirmModal.staff;
    if (!staff) return;

    try {
      const currentState = staff.active !== undefined ? staff.active : staff.isActive;
      const payload = { ...staff, isActive: !currentState };
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/users/${staff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) fetchStaff();
    } catch (error) {
      console.error('Toggle status failed', error);
    } finally {
      setConfirmModal({ isOpen: false, staff: null });
    }
  };

  const filteredStaff = staffList.filter(staff => 
    staff.username !== 'admin' && // Ẩn Super Admin
    (staff.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     staff.username?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalItems = filteredStaff.length;
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif text-[#2c2c2c] mb-1">Quản lý Nhân sự</h2>
          <p className="text-[#5a5a5a] text-sm">Cấp quyền và quản lý tài khoản nhân viên</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#1b6060] hover:bg-[#144848] text-[#ffffff] px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-[#1b6060]/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm nhân viên
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8e0d5] overflow-hidden">
        <div className="p-4 border-b border-[#e8e0d5] flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] w-5 h-5" />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhân sự..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg pl-10 pr-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060] transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#5a5a5a]">
            <thead className="bg-[#f6f3ed] text-[#4a4a4a] uppercase text-xs font-medium">
              <tr>
                <th className="px-6 py-4">Nhân sự</th>
                <th className="px-6 py-4">Chức vụ</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-[#888888]">Đang tải dữ liệu...</td></tr>
              ) : paginatedStaff.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-[#888888]">Chưa có tài khoản nào.</td></tr>
              ) : (
                paginatedStaff.map(staff => (
                  <tr key={staff.id} className="hover:bg-[#f6f3ed]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1b6060]/10 rounded-full flex items-center justify-center text-[#1b6060] font-bold">
                          {staff.fullName.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-[#2c2c2c] font-medium">{staff.fullName}</div>
                          <div className="text-xs text-[#888888]">@{staff.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {staff.role === 'ADMIN' ? (
                        <span className="flex items-center text-[#1b6060] font-medium"><Shield className="w-4 h-4 mr-1"/> Quản trị viên</span>
                      ) : (
                        <span className="flex items-center text-[#5a5a5a]"><UserCog className="w-4 h-4 mr-1"/> Nhân viên</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${(staff.active !== undefined ? staff.active : staff.isActive) ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                        {(staff.active !== undefined ? staff.active : staff.isActive) ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(staff)}
                          className="p-2 text-[#5a5a5a] hover:bg-[#1b6060]/10 hover:text-[#1b6060] rounded transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleClick(staff)}
                          disabled={staff.username === 'admin'}
                          className={`p-2 rounded transition-colors ${staff.username === 'admin' ? 'text-gray-300 cursor-not-allowed' : 'text-[#5a5a5a] hover:bg-red-500/10 hover:text-red-500'}`}
                          title={(staff.active !== undefined ? staff.active : staff.isActive) ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                        >
                          <ShieldBan className="w-4 h-4" />
                        </button>
                      </div>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="bg-white border border-[#e8e0d5] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-serif text-[#2c2c2c] mb-6">
              {editingStaff ? 'Cập nhật tài khoản' : 'Thêm tài khoản mới'}
            </h3>
            {modalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {modalError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Tên hiển thị *</label>
                <input 
                  type="text" required value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg px-4 py-2.5 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Tên đăng nhập (Username) *</label>
                <input 
                  type="text" required value={formData.username} disabled={!!editingStaff}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg px-4 py-2.5 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060] disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Mật khẩu {editingStaff && '(Để trống nếu không đổi)'}</label>
                <input 
                  type="password" required={!editingStaff} value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder={!editingStaff ? 'Mặc định: staff123' : '••••••••'}
                  className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg px-4 py-2.5 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Phân quyền</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-lg px-4 py-2.5 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060]"
                >
                  <option value="STAFF">Nhân viên (STAFF)</option>
                  <option value="ADMIN">Quản trị viên (ADMIN)</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 bg-[#f6f3ed] hover:bg-[#e8e0d5] text-[#2c2c2c] rounded-lg font-medium">Hủy</button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-[#1b6060] hover:bg-[#144848] text-[#ffffff] rounded-lg font-medium shadow-lg shadow-[#1b6060]/20">Lưu lại</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="bg-white border border-[#e8e0d5] rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <h3 className="text-xl font-serif text-[#2c2c2c] mb-2">Xác nhận</h3>
            <p className="text-[#5a5a5a] text-sm mb-6">
              Bạn có chắc muốn {(confirmModal.staff?.active !== undefined ? confirmModal.staff?.active : confirmModal.staff?.isActive) ? 'KHÓA' : 'MỞ KHÓA'} tài khoản <span className="font-bold">{confirmModal.staff?.fullName}</span>?
            </p>
            <div className="flex gap-4">
              <button onClick={() => setConfirmModal({ isOpen: false, staff: null })} className="flex-1 px-4 py-2 bg-[#f6f3ed] hover:bg-[#e8e0d5] text-[#2c2c2c] rounded-lg font-medium">Hủy</button>
              <button onClick={confirmToggle} className="flex-1 px-4 py-2 bg-[#1b6060] hover:bg-[#144848] text-[#ffffff] rounded-lg font-medium">Đồng ý</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
