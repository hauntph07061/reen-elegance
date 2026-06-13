import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchWithAuth } from '../../utils/fetchWithAuth'

const STATUS_STEPS = [
  { value: 'PENDING_CONFIRMATION', label: 'Chờ xác nhận', icon: '⏳' },
  { value: 'CONFIRMED', label: 'Đã xác nhận', icon: '✅' },
  { value: 'SHIPPED', label: 'Đang giao hàng', icon: '🚚' },
  { value: 'DELIVERED', label: 'Giao thành công', icon: '🎉' },
]

export default function AdminOrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [confirmModal, setConfirmModal] = useState({ open: false, newStatus: null })
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = () => {
    setLoading(true)
    fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/orders/${id}`)
      .then(r => r.json())
      .then(data => { setOrder(data); setLoading(false) })
      .catch(err => { console.error(err); setLoading(false) })
  }

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  const requestStatusChange = (newStatus) => {
    setConfirmModal({ open: true, newStatus })
  }

  const confirmStatusChange = () => {
    const { newStatus } = confirmModal
    setConfirmModal({ open: false, newStatus: null })
    setUpdating(true)
    fetchWithAuth(`${import.meta.env.VITE_API_URL}/v1/admin/orders/${id}/status?status=${newStatus}`, {
      method: 'PUT'
    })
      .then(async r => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({}))
          throw new Error(err.error || `Lỗi ${r.status}`)
        }
        return r.json()
      })
      .then(data => {
        setOrder(data)
        setUpdating(false)
        showToast(`Đã chuyển sang trạng thái "${STATUS_STEPS.find(s => s.value === newStatus)?.label || newStatus}" thành công!`)
      })
      .catch(err => {
        console.error(err)
        setUpdating(false)
        showToast(err.message || 'Cập nhật trạng thái thất bại', 'error')
      })
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

  const getCurrentStepIndex = (status) => {
    if (status === 'CANCELLED') return -1
    const idx = STATUS_STEPS.findIndex(s => s.value === status)
    return idx === -1 ? 0 : idx
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-[#e8e0d5] border-t-[#1b6060] rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-[#5a5a5a]">
        <p>Không tìm thấy đơn hàng này.</p>
        <Link to="/admin/orders" className="text-[#1b6060] mt-4 inline-block hover:underline">← Quay lại danh sách</Link>
      </div>
    )
  }

  const currentStep = getCurrentStepIndex(order.status)
  const isCancelled = order.status === 'CANCELLED'

  return (
    <>
    <div className="max-w-5xl mx-auto animate-in fade-in space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Link to="/admin/orders" className="text-[#5a5a5a] hover:text-[#1b6060] flex items-center gap-2 font-medium">
          ← Trở về danh sách
        </Link>
        {isCancelled ? (
          <span className="bg-red-100 text-red-600 px-4 py-1.5 rounded-full font-bold text-sm">ĐÃ HỦY</span>
        ) : (
          <button 
            onClick={() => requestStatusChange('CANCELLED')}
            className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            Hủy đơn hàng
          </button>
        )}
      </div>

      {/* --- TIMELINE (Shipper Workspace) --- */}
      <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-[#e8e0d5]">
        <h2 className="text-xl font-bold text-[#2c2c2c] mb-8 font-serif">Tiến trình xử lý (Order Timeline)</h2>
        
        {isCancelled ? (
          <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-100">
            <span className="text-4xl block mb-2">❌</span>
            <h3 className="text-red-600 font-bold">Đơn hàng này đã bị hủy</h3>
            <p className="text-red-400 text-sm mt-1">Không thể cập nhật trạng thái mới.</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative gap-8 md:gap-0">
            {/* Đường gạch ngang nền */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-[#f6f3ed] -z-10 -translate-y-1/2 rounded-full px-8"></div>
            
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= currentStep
              const isActive = index === currentStep
              const isNext = index === currentStep + 1

              return (
                <div key={step.value} className="flex flex-col items-center relative z-10 w-full md:w-1/4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300 shadow-sm ${
                    isActive ? 'bg-[#1b6060] text-white ring-4 ring-[#1b6060]/20 scale-110' :
                    isCompleted ? 'bg-[#245c36] text-white' :
                    'bg-[#f6f3ed] text-[#888888] border-2 border-[#e8e0d5]'
                  }`}>
                    {step.icon}
                  </div>
                  
                  <div className="text-center mt-4">
                    <div className={`font-bold text-sm ${isActive || isCompleted ? 'text-[#2c2c2c]' : 'text-[#888888]'}`}>
                      {step.label}
                    </div>
                    {/* Nút cập nhật trạng thái (Dành cho Admin/Shipper) */}
                    {isNext && (
                      <button 
                        disabled={updating}
                        onClick={() => requestStatusChange(step.value)}
                        className="mt-3 bg-[#e8f4f0] text-[#1b6060] hover:bg-[#1b6060] hover:text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-all disabled:opacity-50"
                      >
                        {updating ? 'Đang cập nhật...' : 'Chuyển trạng thái'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT COL (Info) --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Product List */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e8e0d5]">
            <h2 className="text-xl font-bold text-[#2c2c2c] mb-6 font-serif">Sản phẩm đã đặt</h2>
            <div className="flex flex-col gap-4">
              {order.items?.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-4 border border-[#e8e0d5] rounded-2xl hover:border-[#1b6060]/30 transition-colors">
                  <img src={item.product?.thumbnailUrl || 'https://via.placeholder.com/80'} alt={item.product?.name} className="w-20 h-20 object-cover rounded-xl bg-[#f6f3ed]" />
                  <div className="flex-1">
                    <h4 className="font-bold text-[#2c2c2c] text-sm md:text-base">{item.product?.name}</h4>
                    <p className="text-[#888888] text-sm mt-1">Đơn giá: {formatPrice(item.price)}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[#5a5a5a] text-sm">SL: <span className="font-bold text-[#2c2c2c]">{item.quantity}</span></div>
                    <div className="font-bold text-[#1b6060] mt-1">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-[#e8e0d5] flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-[#5a5a5a]">
                <span>Tạm tính</span>
                <span className="font-semibold text-[#2c2c2c]">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#5a5a5a]">
                <span>Phí giao hàng</span>
                <span className="font-semibold text-[#2c2c2c]">{order.shippingFee === 0 ? 'Miễn phí' : formatPrice(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-[#1b6060] text-lg font-bold pt-3 border-t border-[#e8e0d5] mt-1">
                <span>Tổng cộng</span>
                <span>{formatPrice(order.grandTotal)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* --- RIGHT COL (Customer & Delivery) --- */}
        <div className="space-y-8">
          
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e8e0d5]">
            <h2 className="text-xl font-bold text-[#2c2c2c] mb-6 font-serif">Khách hàng</h2>
            <div className="flex flex-col gap-4 text-sm text-[#5a5a5a]">
              <div>
                <div className="text-xs text-[#888888] uppercase tracking-wider mb-1">Người nhận</div>
                <div className="font-bold text-[#2c2c2c] text-base">{order.fullName}</div>
              </div>
              <div>
                <div className="text-xs text-[#888888] uppercase tracking-wider mb-1">Số điện thoại</div>
                <div className="font-medium text-[#2c2c2c]">{order.phone}</div>
              </div>
              {order.email && (
                <div>
                  <div className="text-xs text-[#888888] uppercase tracking-wider mb-1">Email</div>
                  <div className="font-medium text-[#2c2c2c]">{order.email}</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#f6f3ed] rounded-3xl p-8 border border-[#e8e0d5]">
            <h2 className="text-xl font-bold text-[#2c2c2c] mb-6 font-serif">Giao hàng</h2>
            <div className="flex flex-col gap-4 text-sm text-[#5a5a5a]">
              <div>
                <div className="text-xs text-[#888888] uppercase tracking-wider mb-1">Thời gian</div>
                <div className="font-bold text-[#1b6060]">
                  {order.deliveryTimeSlot} | {new Date(order.deliveryDate).toLocaleDateString('vi-VN')}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#888888] uppercase tracking-wider mb-1">Địa chỉ</div>
                <div className="font-medium text-[#2c2c2c] leading-relaxed">
                  {order.addressDetail}, {order.ward},<br/>{order.district}, {order.province}
                </div>
              </div>
              {order.cardMessage && (
                <div>
                  <div className="text-xs text-[#888888] uppercase tracking-wider mb-1">Lời nhắn thiệp</div>
                  <div className="bg-white p-3 rounded-xl border border-[#e8e0d5] italic mt-1">
                    "{order.cardMessage}"
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e8e0d5]">
            <h2 className="text-xl font-bold text-[#2c2c2c] mb-6 font-serif">Thanh toán</h2>
            <div className="flex flex-col gap-4 text-sm text-[#5a5a5a]">
              <div>
                <div className="text-xs text-[#888888] uppercase tracking-wider mb-1">Phương thức</div>
                <p className="text-[#2c2c2c] font-medium">
                  {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : (order.paymentMethod === 'vietqr' ? 'Chuyển khoản Ngân hàng' : order.paymentMethod)}
                </p>
              </div>
              {order.proofImagePath && (
                <div>
                  <div className="text-xs text-[#888888] uppercase tracking-wider mb-2">Ảnh ủy nhiệm chi</div>
                  <a href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${order.proofImagePath}`} target="_blank" rel="noreferrer" className="block w-full aspect-video rounded-xl border border-[#e8e0d5] overflow-hidden hover:opacity-90 transition-opacity">
                    <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${order.proofImagePath}`} alt="UNC" className="w-full h-full object-cover" />
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>

      {/* Confirm Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
            <h3 className="text-lg font-bold text-[#2c2c2c] mb-3">Xác nhận thay đổi</h3>
            <p className="text-[#5a5a5a] mb-6">
              {confirmModal.newStatus === 'CANCELLED' 
                ? 'Bạn có chắc chắn muốn hủy đơn hàng này không?'
                : <>Bạn có chắc muốn chuyển đơn hàng sang trạng thái{' '}
                  <strong className="text-[#1b6060]">"{STATUS_STEPS.find(s => s.value === confirmModal.newStatus)?.label}"</strong>?</>}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal({ open: false, newStatus: null })}
                className="flex-1 px-4 py-2.5 border border-[#e8e0d5] rounded-xl text-[#5a5a5a] hover:bg-[#f6f3ed] transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmStatusChange}
                className="flex-1 px-4 py-2.5 bg-[#1b6060] text-white rounded-xl hover:bg-[#144848] transition-colors font-semibold"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-lg text-white font-medium transition-all ${
          toast.type === 'success' ? 'bg-[#1b6060]' : 'bg-red-500'
        }`}>
          {toast.message}
        </div>
      )}
    </>
  )
}

