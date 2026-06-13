import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import JoditEditor from 'jodit-react';
import toast from 'react-hot-toast';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [activeTab, setActiveTab] = useState('basic');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  const viTranslations = {
    'Type something': 'Nhập nội dung...',
    'bold': 'In đậm',
    'Bold': 'In đậm',
    'italic': 'In nghiêng',
    'Italic': 'In nghiêng',
    'underline': 'Gạch chân',
    'Underline': 'Gạch chân',
    'strikethrough': 'Gạch ngang',
    'Strikethrough': 'Gạch ngang',
    'Strike through': 'Gạch ngang',
    'eraser': 'Xóa định dạng',
    'Eraser': 'Xóa định dạng',
    'Clear Formatting': 'Xóa định dạng',
    'font': 'Phông chữ',
    'Font': 'Phông chữ',
    'Font family': 'Phông chữ',
    'fontsize': 'Cỡ chữ',
    'Font size': 'Cỡ chữ',
    'brush': 'Màu sắc',
    'Brush': 'Màu sắc',
    'Fill color or set the text color': 'Đổi màu nền / màu chữ',
    'Text': 'Màu chữ',
    'Background': 'Màu nền',
    'paragraph': 'Đoạn văn',
    'Paragraph': 'Đoạn văn',
    'Heading 1': 'Tiêu đề 1',
    'Heading 2': 'Tiêu đề 2',
    'Heading 3': 'Tiêu đề 3',
    'Heading 4': 'Tiêu đề 4',
    'Normal': 'Bình thường',
    'Quote': 'Trích dẫn',
    'Code': 'Mã lệnh',
    'align': 'Căn lề',
    'Align': 'Căn lề',
    'Left': 'Căn trái',
    'Center': 'Căn giữa',
    'Right': 'Căn phải',
    'Justify': 'Căn đều',
    'ul': 'Danh sách chấm',
    'ol': 'Danh sách số',
    'Ordered list': 'Danh sách số',
    'Unordered list': 'Danh sách chấm',
    'Insert link': 'Chèn liên kết',
    'link': 'Liên kết',
    'Link': 'Liên kết',
    'Insert Image': 'Chèn hình ảnh',
    'image': 'Hình ảnh',
    'Image': 'Hình ảnh',
    'Insert video': 'Chèn video',
    'video': 'Video',
    'Video': 'Video',
    'Insert table': 'Chèn bảng',
    'table': 'Bảng',
    'Table': 'Bảng',
    'undo': 'Hoàn tác',
    'Undo': 'Hoàn tác',
    'redo': 'Làm lại',
    'Redo': 'Làm lại',
    'fullsize': 'Toàn màn hình',
    'Fullsize': 'Toàn màn hình',
    'source': 'Mã HTML',
    'Source code': 'Mã HTML',
    'Line height': 'Khoảng cách dòng',
    'Superscript': 'Chỉ số trên',
    'Subscript': 'Chỉ số dưới',
    'Find': 'Tìm kiếm',
    'symbol': 'Ký tự đặc biệt',
    'Symbols': 'Ký tự đặc biệt',
    'print': 'In',
    'Print': 'In',
    'indent': 'Tăng lề',
    'Indent': 'Tăng lề',
    'outdent': 'Giảm lề',
    'Outdent': 'Giảm lề',
    'hr': 'Đường gạch ngang',
    'Horizontal line': 'Đường gạch ngang',
    'copy': 'Sao chép',
    'Copy': 'Sao chép',
    'cut': 'Cắt',
    'Cut': 'Cắt',
    'paste': 'Dán',
    'Paste': 'Dán',
    'Paste as text': 'Dán văn bản thuần',
    'Select all': 'Chọn tất cả',
    'Change mode': 'Đổi chế độ',
    'Preview': 'Xem trước',
    'copyformat': 'Sao chép định dạng',
    'Copy format': 'Sao chép định dạng',
    'about': 'Thông tin Jodit',
    'About Jodit': 'Thông tin Jodit',
    'Insert Unordered List': 'Chèn danh sách chấm',
    'Insert Ordered List': 'Chèn danh sách số',
    'Default': 'Mặc định',
    'Circle': 'Vòng tròn rỗng',
    'Dot': 'Chấm đen',
    'Square': 'Hình vuông',
    'Lower Alpha': 'Chữ thường (a, b, c)',
    'Lower Greek': 'Chữ Hy Lạp',
    'Lower Roman': 'Số La Mã thường',
    'Upper Alpha': 'Chữ hoa (A, B, C)',
    'Upper Roman': 'Số La Mã hoa'
  };

  const editorConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Nhập nội dung...',
    height: 350,
    language: 'vi',
    i18n: {
      vi: viTranslations
    }
  }), []);

  const editorConfigSmall = useMemo(() => ({
    readonly: false,
    placeholder: 'Nhập nội dung...',
    height: 250,
    language: 'vi',
    i18n: {
      vi: viTranslations
    }
  }), []);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    descriptionHtml: '',
    careInstructions: '',
    regularPrice: '',
    salePrice: '',
    stockQuantity: '',
    thumbnailUrl: '',
    isActive: true,
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
    categoryIds: [],
    attributes: [],
    images: []
  });

  useEffect(() => {
    fetchCategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/categories/tree`);
      if (res.ok) setCategories(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          ...data,
          regularPrice: data.regularPrice || '',
          salePrice: data.salePrice || '',
          stockQuantity: data.stockQuantity || 0,
          categoryIds: data.categories?.map(c => c.id) || [],
          attributes: data.attributes?.sort((a, b) => a.displayOrder - b.displayOrder) || [],
          images: data.images?.sort((a, b) => a.displayOrder - b.displayOrder) || []
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleQuillChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value === '<p><br></p>' ? '' : value
    }));
  };

  const handleCategoryToggle = (catId) => {
    setFormData(prev => {
      const isSelected = prev.categoryIds.includes(catId);
      return {
        ...prev,
        categoryIds: isSelected
          ? prev.categoryIds.filter(id => id !== catId)
          : [...prev.categoryIds, catId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Ensure numbers are properly formatted
    const payload = {
      ...formData,
      regularPrice: Number(formData.regularPrice),
      salePrice: formData.salePrice ? Number(formData.salePrice) : null,
      stockQuantity: Number(formData.stockQuantity),
      // Update displayOrders based on array index
      attributes: formData.attributes.map((a, idx) => ({ ...a, displayOrder: idx })),
      images: formData.images.map((img, idx) => ({ ...img, displayOrder: idx }))
    };

    try {
      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/v1/admin/products/${id}`
        : `${import.meta.env.VITE_API_URL}/v1/admin/products`;

      const res = await fetchWithAuth(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        navigate('/admin/products');
      } else {
        toast.error('Có lỗi xảy ra khi lưu sản phẩm!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Không thể kết nối đến máy chủ!');
    } finally {
      setSaving(false);
    }
  };

  // --- IMAGE UPLOAD LOGIC ---
  const handleImageUpload = async (e, field, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const loadingToast = toast.loading('Đang tải ảnh lên...');
    const formDataObj = new FormData();
    formDataObj.append('file', file);

    try {
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/upload`, {
        method: 'POST',
        body: formDataObj
      });

      if (res.ok) {
        const data = await res.json();
        if (field === 'thumbnailUrl') {
          setFormData(prev => ({ ...prev, thumbnailUrl: data.url }));
        } else if (field === 'images' && index !== null) {
          updateImage(index, data.url);
        }
        toast.success('Tải ảnh thành công!', { id: loadingToast });
      } else {
        toast.error('Lỗi khi tải ảnh lên!', { id: loadingToast });
      }
    } catch (err) {
      console.error(err);
      toast.error('Không thể kết nối máy chủ!', { id: loadingToast });
    }
  };

  // --- ATTRIBUTES LOGIC ---
  const addAttribute = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, { attributeName: '', attributeValue: '' }]
    }));
  };

  const updateAttribute = (index, field, value) => {
    const newAttrs = [...formData.attributes];
    newAttrs[index][field] = value;
    setFormData({ ...formData, attributes: newAttrs });
  };

  const removeAttribute = (index) => {
    const newAttrs = formData.attributes.filter((_, i) => i !== index);
    setFormData({ ...formData, attributes: newAttrs });
  };

  // --- IMAGES LOGIC (HTML5 Drag and Drop) ---
  const [draggedImgIdx, setDraggedImgIdx] = useState(null);

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { imageUrl: '' }]
    }));
  };

  const updateImage = (index, value) => {
    const newImgs = [...formData.images];
    newImgs[index].imageUrl = value;
    setFormData({ ...formData, images: newImgs });
  };

  const removeImage = (index) => {
    const newImgs = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImgs });
  };

  const handleDragImgStart = (e, index) => {
    setDraggedImgIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
  };

  const handleDragImgEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedImgIdx(null);
  };

  const handleDropImg = (e, targetIndex) => {
    e.preventDefault();
    if (draggedImgIdx === null || draggedImgIdx === targetIndex) return;

    const newImgs = [...formData.images];
    const draggedItem = newImgs.splice(draggedImgIdx, 1)[0];
    newImgs.splice(targetIndex, 0, draggedItem);

    setFormData({ ...formData, images: newImgs });
  };

  if (loading) return <div className="p-8 text-[#2c2c2c]">Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 hover:bg-[#f0ebe4] rounded-lg text-[#5a5a5a] hover:text-[#2c2c2c] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-2xl font-serif text-[#2c2c2c]">
            {isEditing ? 'Cập nhật Sản phẩm' : 'Thêm Sản phẩm mới'}
          </h2>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-[#1b6060] hover:bg-[#144848] disabled:opacity-50 text-[#ffffff] px-6 py-2.5 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-[#1b6060]/20"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Đang lưu...' : 'Lưu lại'}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8e0d5] overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#e8e0d5] bg-[#ffffff]/50 p-4 space-y-2">
          {[
            { id: 'basic', label: 'Thông tin chung' },
            { id: 'attributes', label: 'Thuộc tính' },
            { id: 'images', label: 'Hình ảnh' },
            { id: 'seo', label: 'Cấu hình SEO' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                  ? 'bg-[#1b6060]/10 text-[#1b6060] border border-[#1b6060]/20'
                  : 'text-[#5a5a5a] hover:bg-[#f6f3ed] hover:text-[#2c2c2c] border border-transparent'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 md:p-8">
          {activeTab === 'basic' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Tên sản phẩm *</label>
                  <input type="text" required name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#ffffff] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:border-[#1b6060] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Mã SKU</label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full bg-[#ffffff] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:border-[#1b6060] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Giá bán thường (VNĐ) *</label>
                  <input type="number" required name="regularPrice" value={formData.regularPrice} onChange={handleChange} className="w-full bg-[#ffffff] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:border-[#1b6060] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Giá khuyến mãi (VNĐ)</label>
                  <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} className="w-full bg-[#ffffff] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:border-[#1b6060] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Tồn kho</label>
                  <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="w-full bg-[#ffffff] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:border-[#1b6060] outline-none" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-[#5a5a5a] mb-2">Ảnh đại diện (Thumbnail)</label>
                  <div className="flex gap-4 items-center bg-[#f6f3ed] p-4 rounded-xl border border-[#e8e0d5]">
                    {formData.thumbnailUrl ? (
                      <img src={formData.thumbnailUrl} alt="Thumbnail" className="w-24 h-24 rounded-lg object-cover border border-[#e8e0d5] bg-white shadow-sm flex-shrink-0" />
                    ) : (
                      <div className="w-24 h-24 rounded-lg border border-[#e8e0d5] bg-white flex items-center justify-center text-[#888888] shadow-sm flex-shrink-0">
                        <ImageIcon className="w-8 h-8 opacity-50" />
                      </div>
                    )}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <label className="bg-[#1b6060] text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-[#144848] transition-colors shadow-sm">
                          Tải ảnh từ máy tính
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'thumbnailUrl')} className="hidden" />
                        </label>
                        <span className="text-xs text-[#888888]">Hoặc sử dụng URL</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Nhập đường dẫn URL ảnh..."
                        name="thumbnailUrl"
                        value={formData.thumbnailUrl}
                        onChange={handleChange}
                        className="w-full bg-[#ffffff] border border-[#e8e0d5] rounded-lg px-3 py-2 text-[#2c2c2c] focus:border-[#1b6060] outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5a5a5a] mb-2">Danh mục liên kết</label>
                <div className="flex flex-col gap-4 bg-[#ffffff] p-4 rounded-lg border border-[#e8e0d5] max-h-64 overflow-y-auto">
                  {categories.filter(c => !c.parentId).map(parent => (
                    <div key={parent.id} className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={formData.categoryIds.includes(parent.id)}
                          onChange={() => handleCategoryToggle(parent.id)}
                          className="accent-[#1b6060] w-4 h-4 cursor-pointer"
                        />
                        <span className="text-[#2c2c2c] font-semibold group-hover:text-[#1b6060] text-sm transition-colors">
                          {parent.name}
                        </span>
                      </label>
                      
                      {categories.filter(child => child.parentId === parent.id).length > 0 && (
                        <div className="ml-6 grid grid-cols-1 sm:grid-cols-2 gap-2 border-l-2 border-[#f0ebe1] pl-3 py-1">
                          {categories.filter(child => child.parentId === parent.id).map(child => (
                            <label key={child.id} className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={formData.categoryIds.includes(child.id)}
                                onChange={() => handleCategoryToggle(child.id)}
                                className="accent-[#1b6060] w-4 h-4 cursor-pointer"
                              />
                              <span className="text-[#5a5a5a] group-hover:text-[#2c2c2c] text-sm transition-colors">
                                {child.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Mô tả ngắn</label>
                <textarea rows="3" name="description" value={formData.description} onChange={handleChange} className="w-full bg-[#ffffff] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:border-[#1b6060] outline-none resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5a5a5a] mb-2">Mô tả chi tiết (Bài viết)</label>
                <div className="bg-white rounded-lg overflow-hidden border border-[#e8e0d5] mb-12">
                  <JoditEditor
                    value={formData.descriptionHtml || ''}
                    config={editorConfig}
                    onBlur={(val) => handleQuillChange('descriptionHtml', val)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5a5a5a] mb-2">Hướng dẫn chăm sóc (Bài viết)</label>
                <div className="bg-white rounded-lg overflow-hidden border border-[#e8e0d5] mb-12">
                  <JoditEditor
                    value={formData.careInstructions || ''}
                    config={editorConfigSmall}
                    onBlur={(val) => handleQuillChange('careInstructions', val)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 accent-[#1b6060]" />
                  <span className="text-[#2c2c2c] font-medium">Sản phẩm đang kinh doanh (Hiển thị)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 accent-[#1b6060]" />
                  <span className="text-[#2c2c2c] font-medium">Sản phẩm yêu thích / Nổi bật (Hiển thị ở trang chủ)</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'attributes' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex justify-between items-end mb-4">
                <p className="text-[#5a5a5a] text-sm">Thêm các thuộc tính như Màu sắc, Kích thước, Xuất xứ...</p>
                <button onClick={addAttribute} className="text-[#1b6060] hover:text-[#144848] text-sm font-medium flex items-center">
                  <Plus className="w-4 h-4 mr-1" /> Thêm dòng
                </button>
              </div>

              {formData.attributes.map((attr, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-[#ffffff] p-2 rounded-lg border border-[#e8e0d5]">
                  <div className="text-[#888888] px-2 cursor-grab"><GripVertical className="w-4 h-4" /></div>
                  <input
                    type="text" placeholder="Tên thuộc tính (VD: Màu sắc)"
                    value={attr.attributeName} onChange={(e) => updateAttribute(idx, 'attributeName', e.target.value)}
                    className="flex-1 bg-transparent border-none text-[#2c2c2c] focus:outline-none focus:ring-1 focus:ring-[#1b6060] rounded px-2 py-1"
                  />
                  <input
                    type="text" placeholder="Giá trị (VD: Trắng, Đỏ)"
                    value={attr.attributeValue} onChange={(e) => updateAttribute(idx, 'attributeValue', e.target.value)}
                    className="flex-1 bg-transparent border-none text-[#2c2c2c] focus:outline-none focus:ring-1 focus:ring-[#1b6060] rounded px-2 py-1"
                  />
                  <button onClick={() => removeAttribute(idx)} className="p-2 text-[#888888] hover:text-red-400 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              {formData.attributes.length === 0 && (
                <div className="text-center py-12 border border-dashed border-[#e8e0d5] rounded-xl text-[#888888]">Chưa có thuộc tính nào</div>
              )}
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex justify-between items-end mb-4">
                <p className="text-[#5a5a5a] text-sm">Kéo thả các dòng để sắp xếp thứ tự ảnh hiển thị trên trang chi tiết.</p>
                <button onClick={addImage} className="text-[#1b6060] hover:text-[#144848] text-sm font-medium flex items-center">
                  <Plus className="w-4 h-4 mr-1" /> Thêm ảnh
                </button>
              </div>

              <div className="space-y-2">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    draggable
                    onDragStart={(e) => handleDragImgStart(e, idx)}
                    onDragEnd={handleDragImgEnd}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropImg(e, idx)}
                    className={`flex items-center gap-4 bg-[#ffffff] p-3 rounded-lg border border-[#e8e0d5] transition-colors ${draggedImgIdx === idx ? 'opacity-50 border-[#1b6060]' : 'hover:border-[#e8e0d5]'}`}
                  >
                    <div className="text-[#888888] px-2 cursor-grab active:cursor-grabbing hover:text-[#2c2c2c] transition-colors">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    {img.imageUrl ? (
                      <img src={img.imageUrl} alt="preview" className="w-12 h-12 rounded object-cover bg-[#f6f3ed]" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-[#f6f3ed] flex items-center justify-center text-[#5a5a5a]"><ImageIcon className="w-5 h-5" /></div>
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-xs bg-[#f0a793]/10 text-[#f0a793] hover:bg-[#f0a793]/20 px-3 py-1.5 rounded cursor-pointer font-medium transition-colors border border-[#f0a793]/30">
                          Tải ảnh lên
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'images', idx)} className="hidden" />
                        </label>
                      </div>
                      <input
                        type="text" placeholder="Nhập đường dẫn URL ảnh..."
                        value={img.imageUrl} onChange={(e) => updateImage(idx, e.target.value)}
                        className="w-full bg-transparent border border-[#e8e0d5] focus:border-[#1b6060] text-[#2c2c2c] focus:outline-none focus:ring-0 rounded px-3 py-1.5 text-sm"
                      />
                    </div>
                    <button onClick={() => removeImage(idx)} className="p-2 text-[#888888] hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>

              {formData.images.length === 0 && (
                <div className="text-center py-16 border border-dashed border-[#e8e0d5] rounded-xl text-[#888888]">
                  <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p>Sản phẩm chưa có thư viện ảnh</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6 animate-in fade-in max-w-2xl">
              <p className="text-[#5a5a5a] text-sm mb-4">Cấu hình thẻ Meta để tối ưu hóa công cụ tìm kiếm (Google SEO).</p>
              <div>
                <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Meta Title</label>
                <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full bg-[#ffffff] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:border-[#1b6060] outline-none" placeholder="Tiêu đề chuẩn SEO (tối đa 60 ký tự)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Meta Description</label>
                <textarea rows="4" name="metaDescription" value={formData.metaDescription} onChange={handleChange} className="w-full bg-[#ffffff] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:border-[#1b6060] outline-none resize-none" placeholder="Mô tả chuẩn SEO (tối đa 150-160 ký tự)" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
