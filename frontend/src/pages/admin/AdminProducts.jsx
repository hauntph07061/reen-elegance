import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Package, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import Pagination from '../../components/ui/Pagination';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/products?size=100`); // Fetch a large page for admin
      if (response.ok) {
        const data = await response.json();
        setProducts(data.content || []);
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/products/${deleteConfirm.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setDeleteConfirm(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/products/${product.id}/featured?isFeatured=${!product.isFeatured}`, {
        method: 'PATCH'
      });
      if (response.ok) {
        fetchProducts(); // Refresh list to get updated status
      }
    } catch (error) {
      console.error('Failed to toggle featured', error);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredProducts.length;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif text-[#2c2c2c] mb-1">Quản lý Sản phẩm</h2>
          <p className="text-[#5a5a5a] text-sm">Xem và cập nhật danh sách sản phẩm</p>
        </div>
        <Link 
          to="/admin/products/new"
          className="bg-[#1b6060] hover:bg-[#144848] text-[#ffffff] px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-[#1b6060]/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tạo sản phẩm mới
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8e0d5] overflow-hidden">
        {/* Search Bar Placeholder */}
        <div className="p-4 border-b border-[#e8e0d5] flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] w-5 h-5" />
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm theo tên, SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#ffffff] border border-[#e8e0d5] rounded-lg pl-10 pr-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060] transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#5a5a5a]">
            <thead className="bg-[#ffffff] text-[#4a4a4a] uppercase text-xs font-medium">
              <tr>
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">Giá bán</th>
                <th className="px-6 py-4 min-w-[140px]">Tồn kho</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[#888888]">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-4 bg-[#f0ebe4] rounded w-1/4 mb-4"></div>
                      <div className="h-4 bg-[#f0ebe4] rounded w-1/3"></div>
                    </div>
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-[#888888]">
                      <Package className="w-12 h-12 mb-4 opacity-50" />
                      <p>Không tìm thấy sản phẩm nào.</p>
                      <Link to="/admin/products/new" className="text-[#1b6060] hover:underline mt-2">Thêm ngay</Link>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map(product => (
                  <tr key={product.id} className="hover:bg-[#ffffff] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={product.thumbnailUrl || 'https://placehold.co/100x100?text=No+Image'} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-[#f6f3ed]"
                        />
                        <div>
                          <div className="text-[#2c2c2c] font-medium mb-1">{product.name}</div>
                          <div className="text-xs text-[#888888]">/{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.salePrice ? (
                        <div>
                          <div className="text-[#1b6060] font-medium">{product.salePrice.toLocaleString()}đ</div>
                          <div className="text-xs line-through text-[#888888]">{product.regularPrice.toLocaleString()}đ</div>
                        </div>
                      ) : (
                        <div className="text-[#2c2c2c] font-medium">{product.regularPrice.toLocaleString()}đ</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${product.stockQuantity > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {product.stockQuantity > 0 ? `${product.stockQuantity} có sẵn` : 'Hết hàng'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.categories?.map(c => c.name).join(', ') || '--'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleToggleFeatured(product)}
                          className={`p-2 rounded transition-colors ${product.isFeatured ? 'text-red-500 hover:bg-red-500/10' : 'text-[#888888] hover:bg-[#f0ebe4] hover:text-red-500'}`}
                          title={product.isFeatured ? "Bỏ nổi bật" : "Đánh dấu nổi bật"}
                        >
                          <Heart className={`w-4 h-4 ${product.isFeatured ? 'fill-current' : ''}`} />
                        </button>
                        <Link 
                          to={`/admin/products/${product.id}/edit`}
                          className="p-2 text-[#5a5a5a] hover:bg-[#f0ebe4] hover:text-[#1b6060] rounded transition-colors"
                          title="Sửa sản phẩm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => setDeleteConfirm(product)}
                          className="p-2 text-[#5a5a5a] hover:bg-red-500/10 hover:text-red-400 rounded transition-colors"
                          title="Xóa/Ẩn sản phẩm"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Confirm Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="bg-white border border-[#e8e0d5] rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif text-[#2c2c2c] mb-2">Tạm ẩn sản phẩm</h3>
            <p className="text-[#5a5a5a] mb-6 text-sm">
              Bạn có chắc chắn muốn ẩn sản phẩm <span className="text-[#2c2c2c] font-medium">"{deleteConfirm.name}"</span> không? Sản phẩm này sẽ không hiển thị với khách hàng nữa.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-[#f6f3ed] hover:bg-[#f0ebe4] text-[#2c2c2c] rounded-lg transition-colors font-medium"
              >
                Hủy
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-[#ffffff] rounded-lg transition-colors font-medium shadow-lg shadow-red-500/25"
              >
                Xác nhận ẩn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
