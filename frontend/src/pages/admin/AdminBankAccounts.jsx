import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

const AdminBankAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    bankId: '',
    accountNo: '',
    accountName: '',
    isActive: false
  });

  const fetchAccounts = async () => {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/bank-accounts`);
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách tài khoản');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `${import.meta.env.VITE_API_URL}/v1/admin/bank-accounts/${editingId}`
        : `${import.meta.env.VITE_API_URL}/v1/admin/bank-accounts`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetchWithAuth(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingId ? 'Cập nhật tài khoản thành công' : 'Thêm tài khoản thành công');
        setShowModal(false);
        fetchAccounts();
      } else {
        toast.error('Lỗi khi lưu tài khoản');
      }
    } catch (error) {
      toast.error('Lỗi khi lưu tài khoản');
    }
  };

  const handleEdit = (account) => {
    setFormData({
      bankId: account.bankId,
      accountNo: account.accountNo,
      accountName: account.accountName,
      isActive: account.isActive
    });
    setEditingId(account.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      try {
        const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/bank-accounts/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          toast.success('Xóa tài khoản thành công');
          fetchAccounts();
        } else {
          toast.error('Lỗi khi xóa tài khoản');
        }
      } catch (error) {
        toast.error('Lỗi khi xóa tài khoản');
      }
    }
  };

  const handleToggleActive = async (account) => {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/bank-accounts/${account.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...account,
          isActive: true
        }),
      });
      if (response.ok) {
        toast.success('Đã đặt làm tài khoản mặc định');
        fetchAccounts();
      } else {
        toast.error('Lỗi khi cập nhật trạng thái');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const openAddModal = () => {
    setFormData({ bankId: '', accountNo: '', accountName: '', isActive: false });
    setEditingId(null);
    setShowModal(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[#1b6060]">Tài khoản ngân hàng</h1>
          <p className="text-gray-500 mt-1">Quản lý các tài khoản nhận thanh toán qua VietQR</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-[#1b6060] text-white rounded-lg hover:bg-[#144b4b] transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm tài khoản
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-4 font-semibold text-gray-600 text-sm">Ngân hàng</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Số tài khoản</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Tên chủ thẻ</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Trạng thái</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {accounts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      Chưa có tài khoản nào
                    </td>
                  </tr>
                ) : (
                  accounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-medium text-gray-900 uppercase">
                        {account.bankId}
                      </td>
                      <td className="p-4 text-gray-600">{account.accountNo}</td>
                      <td className="p-4 text-gray-600 font-medium">{account.accountName}</td>
                      <td className="p-4">
                        {account.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Đang sử dụng
                          </span>
                        ) : (
                          <button
                            onClick={() => handleToggleActive(account)}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            Đặt làm mặc định
                          </button>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(account)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md transition-colors"
                            title="Sửa"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(account.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-md transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? 'Sửa tài khoản' : 'Thêm tài khoản'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã ngân hàng (VD: bidv, vcb, momo)</label>
                <input
                  type="text"
                  name="bankId"
                  required
                  value={formData.bankId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1b6060] focus:border-transparent"
                  placeholder="bidv"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản</label>
                <input
                  type="text"
                  name="accountNo"
                  required
                  value={formData.accountNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1b6060] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên chủ tài khoản (Viết Hoa Không Dấu)</label>
                <input
                  type="text"
                  name="accountName"
                  required
                  value={formData.accountName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1b6060] focus:border-transparent uppercase"
                />
              </div>
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#1b6060] border-gray-300 rounded focus:ring-[#1b6060]"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Đặt làm tài khoản mặc định nhận tiền
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-[#1b6060] hover:bg-[#144b4b] rounded-lg transition-colors"
                >
                  {editingId ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBankAccounts;
