import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ 
  currentPage, 
  totalItems, 
  pageSize, 
  onPageChange, 
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100]
}) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-[#e8e0d5] bg-[#fcfbf9] gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#5a5a5a]">
          Hiển thị <span className="font-semibold text-[#2c2c2c]">{(currentPage - 1) * pageSize + 1}</span> - <span className="font-semibold text-[#2c2c2c]">{Math.min(currentPage * pageSize, totalItems)}</span> trong <span className="font-semibold text-[#2c2c2c]">{totalItems}</span>
        </span>
        <select 
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1); // Reset to first page on size change
          }}
          className="text-sm border border-[#e8e0d5] rounded-lg px-2 py-1 text-[#2c2c2c] bg-white focus:outline-none focus:border-[#1b6060] transition-colors"
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>{size} / trang</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-[#e8e0d5] bg-white text-[#5a5a5a] hover:bg-[#f6f3ed] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-sm font-medium text-[#2c2c2c] bg-white px-3 py-1.5 rounded-lg border border-[#e8e0d5] shadow-sm">
          Trang {currentPage} / {totalPages}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-lg border border-[#e8e0d5] bg-white text-[#5a5a5a] hover:bg-[#f6f3ed] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
