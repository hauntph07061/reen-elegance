import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle, Package, MapPin, Calendar, Clock, Copy, Eye, EyeOff, ShoppingBag, Home, LogIn, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

function OrderSuccess() {
  const location = useLocation();
  const state = location.state;

  const [showPassword, setShowPassword] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showItems, setShowItems] = useState(false);

  // Redirect if no state (e.g. navigated directly)
  if (!state || !state.orderCode) {
    return <Navigate to="/shop" replace />;
  }

  const { orderCode, formData, cart, grandTotal, shippingFee, isNewUser } = state;

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(orderCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const subtotal = grandTotal - (shippingFee || 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f3ed] text-[#2c2c2c] font-sans">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pt-32 pb-24">

        {/* Success Hero */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#1b6060] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#1b6060]/30">
            <CheckCircle className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#1b6060] mb-3">
            Đặt hàng thành công!
          </h1>
          <p className="text-[#5a5a5a] text-sm leading-relaxed max-w-sm mx-auto">
            Cảm ơn bạn đã tin tưởng <strong className="text-[#2c2c2c]">Green Elegance</strong>.<br />
            Chúng tôi sẽ liên hệ xác nhận đơn qua số điện thoại sớm nhất.
          </p>
        </div>

        {/* Order Code Card */}
        <div className="bg-white border border-[#e8e0d5] rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1b6060]/10 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-[#1b6060]" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#888888] mb-0.5">Mã đơn hàng</p>
                <p className="text-lg font-bold text-[#1b6060] font-mono">{orderCode}</p>
              </div>
            </div>
            <button
              onClick={handleCopyCode}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                copiedCode
                  ? 'bg-[#1b6060] text-white'
                  : 'bg-[#f6f3ed] text-[#5a5a5a] hover:bg-[#e8e0d5]'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedCode ? 'Đã sao chép!' : 'Sao chép'}
            </button>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white border border-[#e8e0d5] rounded-2xl p-6 mb-6 shadow-sm space-y-4">
          <h2 className="text-[10px] uppercase tracking-widest font-bold text-[#888888] pb-3 border-b border-[#f0ebe4]">
            Thông tin giao hàng
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#f6f3ed] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-base">👤</span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-[#888888] mb-0.5">Người nhận</p>
                <p className="font-semibold text-[#2c2c2c]">{formData.fullName}</p>
                <p className="text-[#5a5a5a]">{formData.phone}</p>
                {formData.email && <p className="text-[#5a5a5a] text-xs">{formData.email}</p>}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#f6f3ed] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-[#1b6060]" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-[#888888] mb-0.5">Địa chỉ</p>
                <p className="text-[#2c2c2c] leading-relaxed">
                  {formData.addressDetail && `${formData.addressDetail}, `}
                  {formData.ward && `${formData.ward}, `}
                  {formData.district && `${formData.district}, `}
                  {formData.province}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#f6f3ed] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-4 h-4 text-[#1b6060]" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-[#888888] mb-0.5">Ngày giao</p>
                <p className="text-[#2c2c2c]">
                  {formData.deliveryDate
                    ? new Date(formData.deliveryDate).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                    : '—'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#f6f3ed] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-[#1b6060]" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-[#888888] mb-0.5">Khung giờ giao</p>
                <p className="text-[#2c2c2c]">{formData.deliveryTimeSlot || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items (collapsible) */}
        <div className="bg-white border border-[#e8e0d5] rounded-2xl mb-6 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowItems(v => !v)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-[#f9f7f4] transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#1b6060]" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#888888]">
                Sản phẩm đã đặt ({cart?.length || 0} mặt hàng)
              </span>
            </div>
            {showItems ? <ChevronUp className="w-4 h-4 text-[#888888]" /> : <ChevronDown className="w-4 h-4 text-[#888888]" />}
          </button>

          {showItems && cart && (
            <div className="px-6 pb-6 space-y-4 border-t border-[#f0ebe4]">
              {cart.map((item) => {
                const price = item.product.salePrice || item.product.regularPrice;
                return (
                  <div key={item.product.id} className="flex items-center gap-4 pt-4">
                    <img
                      src={item.product.thumbnailUrl}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-xl object-cover border border-[#e8e0d5] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#2c2c2c] truncate">{item.product.name}</p>
                      <p className="text-xs text-[#888888]">{formatPrice(price)} × {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-[#1b6060] shrink-0">{formatPrice(price * item.quantity)}</span>
                  </div>
                );
              })}

              {/* Totals */}
              <div className="pt-4 border-t border-[#f0ebe4] space-y-2 text-sm">
                <div className="flex justify-between text-[#5a5a5a]">
                  <span>Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#5a5a5a]">
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee === 0 ? <span className="text-[#1b6060] font-semibold">Miễn phí</span> : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-[#2c2c2c] text-base pt-1 border-t border-[#f0ebe4]">
                  <span>Tổng cộng</span>
                  <span className="text-[#1b6060]">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Info Block (only for new users) */}
        {isNewUser && (
          <div className="bg-[#1b6060] rounded-2xl p-6 mb-6 shadow-lg shadow-[#1b6060]/20 text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🔐</span>
              <div>
                <h2 className="font-bold text-base">Tài khoản vừa được tạo cho bạn!</h2>
                <p className="text-[#a8d5d5] text-xs">Dùng để theo dõi đơn hàng và tích điểm thưởng</p>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 space-y-3 backdrop-blur-sm border border-white/20">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-[#a8d5d5] font-bold">Tên đăng nhập</span>
                <span className="font-mono font-bold text-white">{formData.phone}</span>
              </div>
              <div className="border-t border-white/10" />
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-[#a8d5d5] font-bold">Mật khẩu</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">
                    {showPassword ? formData.phone : '••••••••••'}
                  </span>
                  <button
                    onClick={() => setShowPassword(v => !v)}
                    className="text-[#a8d5d5] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-[#a8d5d5] flex items-center gap-1.5">
              <span>⚠️</span>
              Hãy đổi mật khẩu sau khi đăng nhập lần đầu để bảo mật tài khoản.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {isNewUser && (
            <Link
              to="/login"
              className="flex-1 flex items-center justify-center gap-2 bg-[#1b6060] hover:bg-[#144848] text-white font-bold py-4 rounded-full transition-all duration-300 text-[10px] uppercase tracking-widest shadow-lg shadow-[#1b6060]/20"
            >
              <LogIn className="w-4 h-4" />
              Đăng nhập ngay
            </Link>
          )}
          <Link
            to="/shop"
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#e8e0d5] hover:border-[#1b6060] text-[#2c2c2c] hover:text-[#1b6060] font-bold py-4 rounded-full transition-all duration-300 text-[10px] uppercase tracking-widest"
          >
            <ShoppingBag className="w-4 h-4" />
            Tiếp tục mua sắm
          </Link>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-[#e8e0d5] hover:border-[#1b6060] text-[#2c2c2c] hover:text-[#1b6060] font-bold py-4 rounded-full transition-all duration-300 text-[10px] uppercase tracking-widest"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default OrderSuccess;
