import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GripVertical, ChevronRight, ChevronDown } from 'lucide-react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({ name: '', description: '', parentId: '' });

  // Drag state
  const [draggedItem, setDraggedItem] = useState(null);
  const [expanded, setExpanded] = useState(new Set());

  // Delete Confirm State
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/categories/tree`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Modal & Form Logic ---
  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingCat(cat);
      setFormData({ name: cat.name, description: cat.description || '', parentId: cat.parentId || '' });
    } else {
      setEditingCat(null);
      setFormData({ name: '', description: '', parentId: '' });
    }
    setIsModalOpen(true);
  };

  const handleOpenModalWithParent = (parentId) => {
    setEditingCat(null);
    setFormData({ name: '', description: '', parentId: parentId });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingCat 
      ? `${import.meta.env.VITE_API_URL}/v1/admin/categories/${editingCat.id}`
      : `${import.meta.env.VITE_API_URL}/v1/admin/categories`;
    
    const method = editingCat ? 'PUT' : 'POST';
    
    try {
      const response = await fetchWithAuth(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          parentId: formData.parentId ? Number(formData.parentId) : null
        })
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchCategories();
      }
    } catch (error) {
      console.error('Submit failed', error);
    }
  };

  const handleDeleteClick = (cat) => {
    if (cat.productCount > 0) {
      setAlertMsg(`Không thể xóa danh mục "${cat.name}" vì đang chứa ${cat.productCount} sản phẩm!`);
      return;
    }
    setDeleteConfirm(cat);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/categories/${deleteConfirm.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setDeleteConfirm(null);
        fetchCategories();
      }
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  // --- Drag and Drop Logic ---
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    // Add visual feedback
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetItem, dropPosition) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.id === targetItem.id) return;
    
    // dropPosition: 'inside' (make child), 'before', 'after' (sibling)
    
    // For simplicity in this demo, if dropped on a parent, make it a child.
    // Otherwise make it a sibling.
    
    let newParentId = targetItem.parentId;
    if (dropPosition === 'inside') {
      newParentId = targetItem.id;
    }

    // Ngăn chặn vòng lặp cha-con (Kéo cha bỏ vào con)
    const isChildOfDragged = (targetId) => {
      let current = categories.find(c => c.id === targetId);
      while(current && current.parentId) {
        if(current.parentId === draggedItem.id) return true;
        current = categories.find(c => c.id === current.parentId);
      }
      return false;
    };

    if (isChildOfDragged(targetItem.id) || (dropPosition === 'inside' && draggedItem.id === targetItem.id)) {
      setAlertMsg('Không thể kéo danh mục cha vào danh mục con của chính nó!');
      return;
    }

    // Calculate new display order
    // This is a simplified approach. In a real app we'd re-calculate all siblings.
    let reorderPayload = [];
    
    // We get all siblings in the new parent
    const siblings = categories
      .filter(c => c.parentId === newParentId && c.id !== draggedItem.id)
      .sort((a,b) => a.displayOrder - b.displayOrder);
    
    let targetIndex = siblings.findIndex(s => s.id === targetItem.id);
    if (dropPosition === 'inside') {
      siblings.push(draggedItem);
    } else if (dropPosition === 'before') {
      siblings.splice(targetIndex, 0, draggedItem);
    } else {
      siblings.splice(targetIndex + 1, 0, draggedItem);
    }

    siblings.forEach((sib, idx) => {
      reorderPayload.push({
        id: sib.id,
        parentId: newParentId,
        displayOrder: idx
      });
    });

    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/categories/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reorderPayload)
      });
      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Reorder failed', error);
    }
  };

  const toggleExpand = (id) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpanded(newExpanded);
  };

  // Build Tree
  const buildTree = () => {
    const rootCats = categories.filter(c => !c.parentId).sort((a,b) => a.displayOrder - b.displayOrder);
    const getChildren = (parentId) => {
      return categories.filter(c => c.parentId === parentId).sort((a,b) => a.displayOrder - b.displayOrder);
    };

    const renderNode = (node, depth = 0) => {
      const children = getChildren(node.id);
      const isExpanded = expanded.has(node.id) || depth === 0;

      return (
        <div key={node.id} className="w-full">
          <div 
            className={`flex items-center group py-3 px-4 mb-2 bg-white border border-[#e8e0d5] rounded-lg hover:border-[#1b6060]/50 transition-colors
              ${draggedItem?.id === node.id ? 'opacity-50' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, node)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => {
              // Basic logic: upper half = before, lower half = after, middle = inside
              const rect = e.currentTarget.getBoundingClientRect();
              const y = e.clientY - rect.top;
              if (y < rect.height * 0.25) handleDrop(e, node, 'before');
              else if (y > rect.height * 0.75) handleDrop(e, node, 'after');
              else handleDrop(e, node, 'inside');
            }}
            style={{ marginLeft: `${depth * 2}rem` }}
          >
            <div className="cursor-grab active:cursor-grabbing text-[#888888] hover:text-[#2c2c2c] mr-2">
              <GripVertical className="w-5 h-5" />
            </div>
            
            {children.length > 0 ? (
              <button onClick={() => toggleExpand(node.id)} className="mr-2 text-[#5a5a5a] hover:text-[#2c2c2c]">
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <div className="w-6 mr-2"></div>
            )}

            <div className="flex-1 font-medium text-[#2c2c2c]">
              {node.name}
              <span className="ml-3 text-xs bg-[#f6f3ed] px-2 py-1 rounded text-[#888888]">
                /{node.slug}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-[#5a5a5a]">
              <span className="bg-[#f6f3ed] px-2 py-1 rounded">
                {node.productCount} sản phẩm
              </span>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleOpenModalWithParent(node.id); }}
                  className="p-1.5 hover:bg-[#f0ebe4] hover:text-green-400 rounded"
                  title="Thêm danh mục con"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleOpenModal(node); }}
                  className="p-1.5 hover:bg-[#f0ebe4] hover:text-[#1b6060] rounded"
                  title="Sửa danh mục"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteClick(node); }}
                  disabled={node.productCount > 0}
                  className={`p-1.5 rounded ${node.productCount > 0 ? 'text-[#5a5a5a] cursor-not-allowed opacity-50' : 'hover:bg-red-500/10 hover:text-red-400'}`}
                  title={node.productCount > 0 ? "Không thể xóa do có sản phẩm" : "Xóa danh mục"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {isExpanded && children.length > 0 && (
            <div className="w-full">
              {children.map(child => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    };

    return rootCats.map(root => renderNode(root));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif text-[#2c2c2c] mb-1">Cây Danh Mục</h2>
          <p className="text-[#5a5a5a] text-sm">Kéo thả để sắp xếp vị trí và quan hệ cha-con</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#1b6060] hover:bg-[#144848] text-[#ffffff] px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm danh mục
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-[#f6f3ed] rounded-lg w-full"></div>
          <div className="h-12 bg-[#f6f3ed] rounded-lg w-full"></div>
          <div className="h-12 bg-[#f6f3ed] rounded-lg w-3/4 ml-8"></div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-[#e8e0d5]">
          {buildTree()}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="bg-white border border-[#e8e0d5] rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-serif text-[#2c2c2c] mb-6">
              {editingCat ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Tên danh mục *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#ffffff] border border-[#e8e0d5] rounded-lg px-4 py-2.5 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060] transition-colors"
                  placeholder="VD: Lan Hồ Điệp"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Danh mục cha</label>
                <select
                  value={formData.parentId}
                  onChange={e => setFormData({...formData, parentId: e.target.value})}
                  className="w-full bg-[#ffffff] border border-[#e8e0d5] rounded-lg px-4 py-2.5 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060] transition-colors appearance-none"
                >
                  <option value="">-- Không có (Danh mục gốc) --</option>
                  {categories
                    .filter(c => !editingCat || c.id !== editingCat.id) // Cannot be parent of itself
                    .map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5a5a5a] mb-1">Mô tả ngắn</label>
                <textarea 
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-[#ffffff] border border-[#e8e0d5] rounded-lg px-4 py-2 text-[#2c2c2c] focus:outline-none focus:border-[#1b6060] transition-colors resize-none"
                  placeholder="Mô tả về danh mục (tùy chọn)..."
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-[#f6f3ed] hover:bg-[#f0ebe4] text-[#2c2c2c] rounded-lg transition-colors font-medium"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#1b6060] hover:bg-[#144848] text-[#ffffff] rounded-lg transition-colors font-medium shadow-lg shadow-[#1b6060]/25"
                >
                  {editingCat ? 'Lưu thay đổi' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="bg-white border border-[#e8e0d5] rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <h3 className="text-xl font-serif text-[#1b6060] mb-4">Thông báo</h3>
            <p className="text-[#4a4a4a] mb-6">{alertMsg}</p>
            <button 
              onClick={() => setAlertMsg(null)}
              className="w-full px-4 py-2.5 bg-[#f6f3ed] hover:bg-[#f0ebe4] text-[#2c2c2c] rounded-lg transition-colors font-medium"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="bg-white border border-[#e8e0d5] rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif text-[#2c2c2c] mb-2">Xác nhận xóa</h3>
            <p className="text-[#5a5a5a] mb-6 text-sm">
              Bạn có chắc chắn muốn xóa danh mục <span className="text-[#2c2c2c] font-medium">"{deleteConfirm.name}"</span> không? Thao tác này không thể hoàn tác.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-[#f6f3ed] hover:bg-[#f0ebe4] text-[#2c2c2c] rounded-lg transition-colors font-medium"
              >
                Hủy
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-[#ffffff] rounded-lg transition-colors font-medium shadow-lg shadow-red-500/25"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
