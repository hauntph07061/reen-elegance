import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';

function CartDrawer() {
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCartStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleCheckoutClick = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 animate-fade-in"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer Panel — Bean Spa white */}
      <div className="relative w-full max-w-[420px] h-full bg-white shadow-[−20px_0_60px_rgba(27,96,96,0.12)] flex flex-col z-10 animate-slide-in-right">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#e8e0d5] flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-[#2c2c2c] flex items-center gap-2">
            Giỏ hàng
            <span className="text-xs bg-[#1b6060] text-white px-2 py-0.5 rounded-full font-sans font-bold">
              {getCartCount()}
            </span>
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 -mr-2 text-[#888888] hover:text-[#2c2c2c] hover:bg-[#f6f3ed] rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#888888] py-16 gap-4">
              <div className="w-16 h-16 bg-[#f6f3ed] rounded-full flex items-center justify-center text-3xl">🛒</div>
              <div>
                <p className="font-serif font-semibold text-[#2c2c2c] mb-1">Giỏ hàng đang trống</p>
                <p className="text-xs text-[#888888]">Khám phá các sản phẩm hoa & cây cảnh nhé!</p>
              </div>
              <button
                onClick={() => { setCartOpen(false); navigate('/shop'); }}
                className="mt-2 bg-[#1b6060] hover:bg-[#144848] text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const activePrice = item.product.salePrice || item.product.regularPrice;
              return (
                <div key={item.product.id} className="flex gap-3 p-3.5 rounded-2xl bg-[#f6f3ed] border border-[#e8e0d5] group">
                  {/* Thumbnail */}
                  <img
                    src={item.product.thumbnailUrl}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-white border border-[#e8e0d5] flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-[#2c2c2c] truncate group-hover:text-[#1b6060] transition-colors">
                        {item.product.name}
                      </h4>
                      <p className="text-sm font-bold text-[#1b6060] mt-0.5">
                        {formatPrice(activePrice)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity stepper */}
                      <div className="flex items-center gap-1 bg-white border border-[#e8e0d5] rounded-full px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#888888] hover:text-[#1b6060] rounded-full hover:bg-[#e8e0d5] transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="text-sm text-[#2c2c2c] font-bold w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#888888] hover:text-[#1b6060] rounded-full hover:bg-[#e8e0d5] transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-xs text-[#888888] hover:text-red-500 transition-colors font-medium"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-[#e8e0d5] bg-white space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#5a5a5a]">Tạm tính:</span>
              <span className="font-serif text-xl font-bold text-[#2c2c2c]">{formatPrice(getCartTotal())}</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleCheckoutClick}
                className="w-full bg-[#1b6060] hover:bg-[#144848] text-white font-bold py-3.5 rounded-full shadow-[0_8px_24px_rgba(27,96,96,0.25)] hover:shadow-[0_12px_32px_rgba(27,96,96,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                THANH TOÁN NGAY
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button
                onClick={() => setCartOpen(false)}
                className="w-full bg-transparent hover:bg-[#f6f3ed] text-[#1b6060] text-sm font-semibold py-2.5 rounded-full border border-[#1b6060] transition-all"
              >
                TIẾP TỤC MUA SẮM
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
