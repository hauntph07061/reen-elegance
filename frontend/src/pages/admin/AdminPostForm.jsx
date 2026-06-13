import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';
import JoditEditor from 'jodit-react';
import toast from 'react-hot-toast';

export default function AdminPostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  const viTranslations = {
    'Type something': 'Nhập nội dung...',
    'bold': 'In đậm', 'Bold': 'In đậm',
    'italic': 'In nghiêng', 'Italic': 'In nghiêng',
    'underline': 'Gạch chân', 'Underline': 'Gạch chân',
    'strikethrough': 'Gạch ngang', 'Strikethrough': 'Gạch ngang', 'Strike through': 'Gạch ngang',
    'eraser': 'Xóa định dạng', 'Eraser': 'Xóa định dạng', 'Clear Formatting': 'Xóa định dạng',
    'font': 'Phông chữ', 'Font': 'Phông chữ', 'Font family': 'Phông chữ',
    'fontsize': 'Cỡ chữ', 'Font size': 'Cỡ chữ',
    'brush': 'Màu sắc', 'Brush': 'Màu sắc',
    'Fill color or set the text color': 'Đổi màu nền / màu chữ',
    'Text': 'Màu chữ', 'Background': 'Màu nền',
    'paragraph': 'Đoạn văn', 'Paragraph': 'Đoạn văn',
    'Heading 1': 'Tiêu đề 1', 'Heading 2': 'Tiêu đề 2', 'Heading 3': 'Tiêu đề 3', 'Heading 4': 'Tiêu đề 4',
    'Normal': 'Bình thường', 'Quote': 'Trích dẫn', 'Code': 'Mã lệnh',
    'align': 'Căn lề', 'Align': 'Căn lề',
    'Left': 'Căn trái', 'Center': 'Căn giữa', 'Right': 'Căn phải', 'Justify': 'Căn đều',
    'ul': 'Danh sách chấm', 'ol': 'Danh sách số',
    'Ordered list': 'Danh sách số', 'Unordered list': 'Danh sách chấm',
    'Insert link': 'Chèn liên kết', 'link': 'Liên kết', 'Link': 'Liên kết',
    'Insert Image': 'Chèn hình ảnh', 'image': 'Hình ảnh', 'Image': 'Hình ảnh',
    'Insert video': 'Chèn video', 'video': 'Video', 'Video': 'Video',
    'Insert table': 'Chèn bảng', 'table': 'Bảng', 'Table': 'Bảng',
    'undo': 'Hoàn tác', 'Undo': 'Hoàn tác',
    'redo': 'Làm lại', 'Redo': 'Làm lại',
    'fullsize': 'Toàn màn hình', 'Fullsize': 'Toàn màn hình',
    'source': 'Mã HTML', 'Source code': 'Mã HTML',
    'Line height': 'Khoảng cách dòng',
    'Superscript': 'Chỉ số trên', 'Subscript': 'Chỉ số dưới',
    'Find': 'Tìm kiếm',
    'symbol': 'Ký tự đặc biệt', 'Symbols': 'Ký tự đặc biệt',
    'print': 'In', 'Print': 'In',
    'indent': 'Tăng lề', 'Indent': 'Tăng lề',
    'outdent': 'Giảm lề', 'Outdent': 'Giảm lề',
    'hr': 'Đường gạch ngang', 'Horizontal line': 'Đường gạch ngang',
    'copy': 'Sao chép', 'Copy': 'Sao chép',
    'cut': 'Cắt', 'Cut': 'Cắt',
    'paste': 'Dán', 'Paste': 'Dán', 'Paste as text': 'Dán văn bản thuần',
    'Select all': 'Chọn tất cả',
    'Change mode': 'Đổi chế độ', 'Preview': 'Xem trước',
    'copyformat': 'Sao chép định dạng', 'Copy format': 'Sao chép định dạng',
    'about': 'Thông tin Jodit', 'About Jodit': 'Thông tin Jodit',
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
    placeholder: 'Nhập nội dung bài viết...',
    height: 500,
    language: 'vi',
    i18n: { vi: viTranslations }
  }), []);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    thumbnailUrl: '',
    isPublished: true
  });

  useEffect(() => {
    if (isEditing) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/posts/${id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          summary: data.summary || '',
          content: data.content || '',
          thumbnailUrl: data.thumbnailUrl || '',
          isPublished: data.isPublished !== false
        });
      }
    } catch (e) {
      toast.error('Lỗi khi tải thông tin bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'title' && !isEditing) {
      const generatedSlug = value.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9 ]/g, '')
        .trim().replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, title: value, slug: generatedSlug }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error('Vui lòng điền các trường bắt buộc (*)');
      return;
    }

    setSaving(true);
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing 
      ? `${import.meta.env.VITE_API_URL}/v1/admin/posts/${id}`
      : `${import.meta.env.VITE_API_URL}/v1/admin/posts`;

    try {
      const res = await fetchWithAuth(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success(isEditing ? 'Cập nhật bài viết thành công!' : 'Tạo bài viết thành công!');
        navigate('/admin/posts');
      } else {
        const err = await res.json();
        toast.error(err.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      toast.error('Lỗi kết nối máy chủ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-[#2c2c2c]">Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/posts" className="p-2 hover:bg-[#f0ebe4] rounded-lg text-[#5a5a5a] hover:text-[#2c2c2c] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h2 className="text-3xl font-serif text-[#2c2c2c]">
            {isEditing ? 'Cập nhật Bài viết' : 'Viết bài mới'}
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

      <div className="bg-white rounded-2xl border border-[#e8e0d5] p-6 md:p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Tiêu đề bài viết *</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="Ví dụ: Nghệ thuật chăm sóc cây..."
              className="w-full bg-[#ffffff] border border-[#e8e0d5] rounded-lg px-4 py-2.5 text-[#2c2c2c] focus:border-[#1b6060] outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Đường dẫn (Slug) *</label>
            <input 
              type="text" 
              name="slug" 
              value={formData.slug} 
              onChange={handleChange} 
              className="w-full bg-[#f9f9f9] border border-[#e8e0d5] rounded-lg px-4 py-2.5 text-[#5a5a5a] focus:border-[#1b6060] outline-none" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Hình ảnh đại diện (Thumbnail URL)</label>
          <input 
            type="text" 
            name="thumbnailUrl" 
            value={formData.thumbnailUrl} 
            onChange={handleChange} 
            placeholder="https://..."
            className="w-full bg-[#ffffff] border border-[#e8e0d5] rounded-lg px-4 py-2.5 text-[#2c2c2c] focus:border-[#1b6060] outline-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Mô tả ngắn (Summary)</label>
          <textarea 
            rows="3" 
            name="summary" 
            value={formData.summary} 
            onChange={handleChange} 
            placeholder="Đoạn văn giới thiệu ngắn..."
            className="w-full bg-[#ffffff] border border-[#e8e0d5] rounded-lg px-4 py-3 text-[#2c2c2c] focus:border-[#1b6060] outline-none resize-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#5a5a5a] mb-2">Nội dung chi tiết *</label>
          <div className="bg-white rounded-lg overflow-hidden border border-[#e8e0d5] mb-2">
            <JoditEditor 
              value={formData.content} 
              config={editorConfig}
              onBlur={handleEditorChange} 
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#e8e0d5]">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              name="isPublished" 
              checked={formData.isPublished} 
              onChange={handleChange} 
              className="w-5 h-5 accent-[#1b6060]" 
            />
            <span className="text-[#2c2c2c] font-medium">Hiển thị bài viết này trên trang web (Publish)</span>
          </label>
        </div>

      </div>
    </div>
  );
}
