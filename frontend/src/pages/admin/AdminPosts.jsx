import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import toast from 'react-hot-toast';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const loadPosts = () => {
    setLoading(true);
    fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/posts?page=${page}&size=10`)
      .then(res => res.json())
      .then(data => {
        setPosts(data.content);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch(err => {
        toast.error('Lỗi khi tải danh sách tin tức');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPosts();
  }, [page]);

  const handleDelete = (id) => {
    toast((t) => (
      <div>
        <p className="font-medium text-[#2c2c2c] mb-3">Bạn có chắc chắn muốn xóa bài viết này?</p>
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
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/posts/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('Xóa bài viết thành công');
        loadPosts();
      } else {
        toast.error('Có lỗi xảy ra khi xóa bài viết');
      }
    } catch (error) {
      toast.error('Lỗi kết nối máy chủ');
    }
  };

  const handleTogglePublish = async (post) => {
    try {
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, isPublished: !post.isPublished })
      });
      if (res.ok) {
        toast.success(post.isPublished ? 'Đã ẩn bài viết' : 'Đã hiển thị bài viết');
        loadPosts();
      } else {
        toast.error('Lỗi khi cập nhật trạng thái');
      }
    } catch (e) {
      toast.error('Lỗi kết nối máy chủ');
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#2c2c2c]">Quản lý Tin Tức</h1>
          <p className="text-[#5a5a5a] mt-2">Quản lý bài viết, blog và tin tức của cửa hàng.</p>
        </div>
        <Link 
          to="/admin/posts/new"
          className="bg-[#1b6060] hover:bg-[#144848] text-white px-5 py-2.5 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-[#1b6060]/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          Viết bài mới
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8e0d5] overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-[#5a5a5a]">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f6f3ed] text-[#5a5a5a] text-sm font-semibold uppercase tracking-wider">
                  <th className="p-4 border-b border-[#e8e0d5] w-24">Hình ảnh</th>
                  <th className="p-4 border-b border-[#e8e0d5]">Tiêu đề</th>
                  <th className="p-4 border-b border-[#e8e0d5]">Ngày tạo</th>
                  <th className="p-4 border-b border-[#e8e0d5] text-center w-32">Hiển thị</th>
                  <th className="p-4 border-b border-[#e8e0d5] text-right w-32">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e0d5]">
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-[#888888]">Chưa có bài viết nào</td>
                  </tr>
                ) : (
                  posts.map(post => (
                    <tr key={post.id} className="hover:bg-[#fcfbf9] transition-colors">
                      <td className="p-4">
                        <img 
                          src={post.thumbnailUrl || `https://picsum.photos/seed/${post.id}/200/200`} 
                          alt="Thumbnail" 
                          className="w-16 h-16 object-cover rounded-lg border border-[#e8e0d5]"
                        />
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-[#2c2c2c] text-sm line-clamp-2">{post.title}</div>
                        <div className="text-xs text-[#888888] mt-1 truncate">{post.slug}</div>
                      </td>
                      <td className="p-4 text-sm text-[#5a5a5a]">
                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleTogglePublish(post)}
                          className={`p-2 rounded-full transition-colors ${post.isPublished ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                          title={post.isPublished ? 'Đang hiển thị (Click để ẩn)' : 'Đang ẩn (Click để hiển thị)'}
                        >
                          {post.isPublished ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            to={`/admin/posts/${post.id}/edit`}
                            className="p-2 text-[#1b6060] hover:bg-[#1b6060]/10 rounded-lg transition-colors"
                            title="Sửa bài viết"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(post.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa bài viết"
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

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <button 
            disabled={page === 0} 
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-lg border border-[#e8e0d5] bg-white text-[#5a5a5a] hover:bg-[#f6f3ed] disabled:opacity-50"
          >
            Trước
          </button>
          <span className="px-4 py-2 text-[#2c2c2c] font-medium">Trang {page + 1} / {totalPages}</span>
          <button 
            disabled={page === totalPages - 1} 
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-lg border border-[#e8e0d5] bg-white text-[#5a5a5a] hover:bg-[#f6f3ed] disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
