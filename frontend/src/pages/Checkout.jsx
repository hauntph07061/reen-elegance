import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useCustomerAuthStore } from '../store/useCustomerAuthStore';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Minus, Plus, Trash2 } from 'lucide-react';

function Checkout() {
  const { cart, getCartTotal, getCartCount, clearCart, updateQuantity, removeFromCart } = useCartStore();
  const navigate = useNavigate();
  const orderPlacedRef = React.useRef(false); // Flag để tránh redirect khi clearCart sau đặt hàng thành công

  // Redirect if cart is empty (nhưng không redirect nếu vừa đặt hàng xong)
  useEffect(() => {
    if (cart.length === 0 && !orderPlacedRef.current) {
      navigate('/shop');
    }
  }, [cart, navigate]);

  // Steps state: 1 = Shipping & Scheduling, 2 = Payment & Upload
  const [step, setStep] = useState(1);

  const { customer } = useCustomerAuthStore();

  // Form states
  const [formData, setFormData] = useState({
    fullName: customer?.fullName || '',
    phone: customer?.phone || customer?.username || '',
    email: customer?.email || '',
    province: 'Hà Nội',
    district: '',
    ward: '',
    addressDetail: '',
    deliveryDate: '',
    deliveryTimeSlot: '08:00 - 10:00',
    cardMessage: '',
    paymentMethod: 'vietqr', // 'vietqr' or 'momo'
  });

  useEffect(() => {
    if (customer) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || customer.fullName || '',
        phone: prev.phone || customer.phone || customer.username || '',
        email: prev.email || customer.email || ''
      }));
    }
  }, [customer]);

  const [formErrors, setFormErrors] = useState({});
  const [proofImage, setProofImage] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [orderCode, setOrderCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, message: '', type: 'info' });
  const [activeBankAccount, setActiveBankAccount] = useState(null);

  useEffect(() => {
    const fetchActiveBank = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/bank-accounts/active`);
        if (response.ok) {
          const data = await response.json();
          setActiveBankAccount(data);
        }
      } catch (error) {
        console.error('Failed to fetch active bank account', error);
      }
    };
    fetchActiveBank();
  }, []);

  const showAlert = (message, type = 'info') => {
    setModal({ isOpen: true, message, type });
  };

  const closeAlert = () => {
    setModal({ ...modal, isOpen: false });
  };

  const [shippingSettings, setShippingSettings] = useState({
    base_fee: 30000,
    free_threshold: 500000
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/v1/settings`)
      .then(r => r.json())
      .then(data => {
        let base_fee = 30000;
        let free_threshold = 500000;
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          base_fee = parseInt(data.shipping_base_fee) || 30000;
          free_threshold = parseInt(data.shipping_free_threshold) || 500000;
        } else if (Array.isArray(data)) {
          const baseItem = data.find(item => item.settingKey === 'shipping_base_fee');
          const thresholdItem = data.find(item => item.settingKey === 'shipping_free_threshold');
          if (baseItem) base_fee = parseInt(baseItem.settingValue) || 30000;
          if (thresholdItem) free_threshold = parseInt(thresholdItem.settingValue) || 500000;
        }
        setShippingSettings({
          base_fee,
          free_threshold
        });
      })
      .catch(e => console.error(e));
  }, []);

  // Dynamic calculations
  const subtotal = getCartTotal();
  const shippingFee = subtotal >= shippingSettings.free_threshold ? 0 : shippingSettings.base_fee;
  const grandTotal = subtotal + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const validateStep1 = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Required';
    if (!formData.phone.trim()) {
      errors.phone = 'Required';
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(formData.phone.trim())) {
      errors.phone = 'Invalid format';
    }
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email';
    }
    if (!formData.district.trim()) errors.district = 'Required';
    if (!formData.ward.trim()) errors.ward = 'Required';
    if (!formData.addressDetail.trim()) errors.addressDetail = 'Required';
    if (!formData.deliveryDate) errors.deliveryDate = 'Required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Generate unique order ID once moving to Step 2
  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    if (validateStep1()) {
      const today = new Date();
      const dateStr = today.getFullYear() + String(today.getMonth() + 1).padStart(2, '0') + String(today.getDate()).padStart(2, '0');
      const randomStr = Math.floor(1000 + Math.random() * 9000);
      const generatedOrderCode = `LHD-${dateStr}-${randomStr}`;
      setOrderCode(generatedOrderCode);
      
      if (formData.paymentMethod === 'cod') {
        await submitOrder(generatedOrderCode);
      } else {
        setStep(2);
        window.scrollTo(0, 0);
      }
    } else {
      setTimeout(() => {
        const errorElement = document.querySelector('.border-red-500');
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus();
        }
      }, 100);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    await submitOrder(orderCode);
  };

  const submitOrder = async (currentOrderCode) => {
    if (formData.paymentMethod === 'vietqr' && !proofImage) {
      showAlert('Vui lòng tải lên ảnh chụp màn hình biên lai thanh toán thành công!', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      let proofImagePath = null;
      if (formData.paymentMethod === 'vietqr') {
        // Bước 1: Upload hình ảnh minh chứng thanh toán
        const uploadFormData = new FormData();
        uploadFormData.append('file', proofImage);

        const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/v1/orders/upload-proof`, {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errData = await uploadResponse.json().catch(() => ({}));
          throw new Error(errData.error || 'Không thể tải ảnh minh chứng thanh toán lên máy chủ!');
        }

        const uploadResult = await uploadResponse.json();
        proofImagePath = uploadResult.proofImagePath;
      }

      // Bước 2: Tạo đơn hàng với thông tin đã nhập kèm đường dẫn ảnh
      const orderPayload = {
        orderCode: currentOrderCode,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email || null,
        province: formData.province,
        district: formData.district,
        ward: formData.ward,
        addressDetail: formData.addressDetail,
        deliveryDate: formData.deliveryDate,
        deliveryTimeSlot: formData.deliveryTimeSlot,
        cardMessage: formData.cardMessage || '',
        paymentMethod: formData.paymentMethod,
        proofImagePath: proofImagePath,
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      };

      const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (!orderResponse.ok) {
        let errMsg = 'Đã xảy ra lỗi khi tạo đơn hàng trên máy chủ!';
        try {
          const errData = await orderResponse.json();
          if (errData.error) errMsg = errData.error;
        } catch(e) {}
        throw new Error(errMsg);
      }

      const responseData = await orderResponse.json();
      console.log('✅ Order response:', responseData);
      const cartSnapshot = [...cart]; // Lưu snapshot trước khi xóa giỏ hàng
      orderPlacedRef.current = true; // Đặt flag trước khi clearCart để tránh redirect về /shop
      setIsSubmitting(false);
      clearCart();
      console.log('🚀 Navigating to /order-success...');
      navigate('/order-success', {
        state: {
          orderCode: currentOrderCode,
          formData,
          cart: cartSnapshot,
          grandTotal,
          shippingFee,
          isNewUser: responseData.isNewUser || false,
        }
      });

    } catch (err) {
      console.error('❌ Order error:', err);
      showAlert(err.message || 'Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại!', 'error');
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Dynamic VietQR generator link
  const bankId = activeBankAccount ? activeBankAccount.bankId : 'bidv';
  const accountNo = activeBankAccount ? activeBankAccount.accountNo : '2601103280';
  const accountName = activeBankAccount ? activeBankAccount.accountName : 'NGUYEN TRAC HAU';
  const vietQrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${grandTotal}&addInfo=${orderCode}&accountName=${encodeURIComponent(accountName)}`;

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f3ed] text-[#2c2c2c] font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#888888] mb-12 font-bold">
          <Link to="/" className="hover:text-[#1b6060] transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#1b6060] transition-colors">Sản phẩm</Link>
          <span>/</span>
          <span className="text-[#2c2c2c]">Thanh toán</span>
        </div>

        {/* Progress Bar */}
        <div className="max-w-xl mx-auto mb-16 flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-[#e8e0d5] -translate-y-1/2 z-0"></div>
          <div className={`absolute top-1/2 left-0 h-px bg-[#1b6060] -translate-y-1/2 z-0 transition-all duration-300`} style={{ width: step === 1 ? '0%' : '100%' }}></div>
          
          <div className="z-10 flex flex-col items-center gap-3">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= 1 ? 'bg-[#1b6060] text-white' : 'bg-white border border-[#e8e0d5] text-[#888888]'}`}>1</span>
            <span className={`text-[10px] uppercase tracking-widest font-bold ${step >= 1 ? 'text-[#1b6060]' : 'text-[#888888]'}`}>Thông tin</span>
          </div>
          <div className="z-10 flex flex-col items-center gap-3">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= 2 ? 'bg-[#1b6060] text-white' : 'bg-white border border-[#e8e0d5] text-[#888888]'}`}>2</span>
            <span className={`text-[10px] uppercase tracking-widest font-bold ${step >= 2 ? 'text-[#1b6060]' : 'text-[#888888]'}`}>Thanh toán</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column: Form Content */}
          <div className="flex-1">
            {step === 1 ? (
              <form onSubmit={handleProceedToPayment} className="space-y-12 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-[#e8e0d5]">
                <div>
                  <h2 className="font-serif text-2xl font-normal text-[#1b6060] mb-8 uppercase tracking-wider">
                    Chi tiết giao hàng
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-[#5a5a5a] mb-2 uppercase tracking-widest">Họ và tên *</label>
                      <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full bg-[#f6f3ed] border ${formErrors.fullName ? 'border-red-500' : 'border-[#e8e0d5]'} px-4 py-3 text-sm focus:outline-none focus:border-[#1b6060] rounded-xl transition-all`}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#5a5a5a] mb-2 uppercase tracking-widest">Số điện thoại *</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full bg-[#f6f3ed] border ${formErrors.phone ? 'border-red-500' : 'border-[#e8e0d5]'} px-4 py-3 text-sm focus:outline-none focus:border-[#1b6060] rounded-xl transition-all`}
                        placeholder="0912345678"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-[#5a5a5a] mb-2 uppercase tracking-widest">Email (Không bắt buộc)</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full bg-[#f6f3ed] border ${formErrors.email ? 'border-red-500' : 'border-[#e8e0d5]'} px-4 py-3 text-sm focus:outline-none focus:border-[#1b6060] rounded-xl transition-all`}
                        placeholder="nguyenvana@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-normal text-[#1b6060] mb-8 uppercase tracking-wider">
                    Địa chỉ nhận hàng
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-[#5a5a5a] mb-2 uppercase tracking-widest">Tỉnh/Thành phố *</label>
                      <select 
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        className="w-full bg-[#f6f3ed] border border-[#e8e0d5] px-4 py-3 text-sm focus:outline-none focus:border-[#1b6060] rounded-xl transition-all"
                      >
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#5a5a5a] mb-2 uppercase tracking-widest">Quận/Huyện *</label>
                      <input 
                        type="text" 
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className={`w-full bg-[#f6f3ed] border ${formErrors.district ? 'border-red-500' : 'border-[#e8e0d5]'} px-4 py-3 text-sm focus:outline-none focus:border-[#1b6060] rounded-xl transition-all`}
                        placeholder="VD: Quận 1"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#5a5a5a] mb-2 uppercase tracking-widest">Phường/Xã *</label>
                      <input 
                        type="text" 
                        name="ward"
                        value={formData.ward}
                        onChange={handleInputChange}
                        className={`w-full bg-[#f6f3ed] border ${formErrors.ward ? 'border-red-500' : 'border-[#e8e0d5]'} px-4 py-3 text-sm focus:outline-none focus:border-[#1b6060] rounded-xl transition-all`}
                        placeholder="VD: Phường Bến Nghé"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-bold text-[#5a5a5a] mb-2 uppercase tracking-widest">Địa chỉ chi tiết *</label>
                      <input 
                        type="text" 
                        name="addressDetail"
                        value={formData.addressDetail}
                        onChange={handleInputChange}
                        className={`w-full bg-[#f6f3ed] border ${formErrors.addressDetail ? 'border-red-500' : 'border-[#e8e0d5]'} px-4 py-3 text-sm focus:outline-none focus:border-[#1b6060] rounded-xl transition-all`}
                        placeholder="Số nhà, Tên đường..."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-normal text-[#1b6060] mb-8 uppercase tracking-wider">
                    Lịch giao hàng
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-[#5a5a5a] mb-2 uppercase tracking-widest">Ngày giao *</label>
                      <input 
                        type="date" 
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleInputChange}
                        min={getTodayDateString()}
                        className={`w-full bg-[#f6f3ed] border ${formErrors.deliveryDate ? 'border-red-500' : 'border-[#e8e0d5]'} px-4 py-3 text-sm focus:outline-none focus:border-[#1b6060] rounded-xl transition-all`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#5a5a5a] mb-2 uppercase tracking-widest">Khung giờ *</label>
                      <select 
                        name="deliveryTimeSlot"
                        value={formData.deliveryTimeSlot}
                        onChange={handleInputChange}
                        className="w-full bg-[#f6f3ed] border border-[#e8e0d5] px-4 py-3 text-sm focus:outline-none focus:border-[#1b6060] rounded-xl transition-all"
                      >
                        <option value="08:00 - 10:00">08:00 - 10:00</option>
                        <option value="10:00 - 12:00">10:00 - 12:00</option>
                        <option value="12:00 - 14:00">12:00 - 14:00</option>
                        <option value="14:00 - 16:00">14:00 - 16:00</option>
                        <option value="16:00 - 18:00">16:00 - 18:00</option>
                        <option value="18:00 - 20:00">18:00 - 20:00</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-normal text-[#1b6060] mb-8 uppercase tracking-wider">
                    Thông điệp đính kèm
                  </h2>
                  <div>
                    <label className="block text-[10px] font-bold text-[#5a5a5a] mb-2 uppercase tracking-widest">Nội dung thiệp (Tùy chọn)</label>
                    <textarea 
                      name="cardMessage"
                      value={formData.cardMessage}
                      onChange={handleInputChange}
                      maxLength="250"
                      rows="4"
                      className="w-full bg-[#f6f3ed] border border-[#e8e0d5] px-4 py-3 text-sm focus:outline-none focus:border-[#1b6060] rounded-xl transition-all resize-none"
                    />
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-normal text-[#1b6060] mb-8 uppercase tracking-wider">
                    Phương thức thanh toán
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={`border rounded-xl px-6 py-4 flex items-center gap-4 cursor-pointer transition-all ${formData.paymentMethod === 'vietqr' ? 'border-[#1b6060] bg-[#1b6060]/5' : 'border-[#e8e0d5] bg-white hover:border-[#1b6060]'}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="vietqr"
                        checked={formData.paymentMethod === 'vietqr'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.paymentMethod === 'vietqr' ? 'border-[#1b6060]' : 'border-gray-300'}`}>
                        {formData.paymentMethod === 'vietqr' && <span className="w-2 h-2 rounded-full bg-[#1b6060]"></span>}
                      </span>
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest font-bold text-[#2c2c2c]">Chuyển khoản Ngân hàng (MoMo, ZaloPay,...)</span>
                      </div>
                    </label>

                    <label className={`border rounded-xl px-6 py-4 flex items-center gap-4 cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-[#1b6060] bg-[#1b6060]/5' : 'border-[#e8e0d5] bg-white hover:border-[#1b6060]'}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.paymentMethod === 'cod' ? 'border-[#1b6060]' : 'border-gray-300'}`}>
                        {formData.paymentMethod === 'cod' && <span className="w-2 h-2 rounded-full bg-[#1b6060]"></span>}
                      </span>
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest font-bold text-[#2c2c2c]">Thanh toán khi nhận hàng (COD)</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mt-8 mb-2 text-center">
                  <p className="text-xs text-[#5a5a5a]">
                    Bằng việc đặt hàng, bạn đồng ý với <Link to="/chinh-sach-mua-hang" target="_blank" className="text-[#1b6060] hover:text-[#144848] font-medium underline underline-offset-2 transition-colors">Chính sách mua hàng</Link> của chúng tôi
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full text-white font-bold py-4 rounded-full transition-all duration-300 text-[10px] uppercase tracking-widest mt-4 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1b6060] hover:bg-[#144848] shadow-lg shadow-[#1b6060]/20'}`}
                >
                  {isSubmitting ? 'Đang xử lý...' : (formData.paymentMethod === 'cod' ? 'Đặt hàng ngay' : 'Tiếp tục thanh toán')}
                </button>
              </form>
            ) : (
              // Step 2: Payment & Proof upload
              <form onSubmit={handleSubmitOrder} className="space-y-12 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-[#e8e0d5]">
                <div>
                  <h2 className="font-serif text-2xl font-normal text-[#1b6060] mb-8 uppercase tracking-wider">
                    Hướng dẫn thanh toán
                  </h2>

                  <div className="bg-[#f6f3ed] border border-[#e8e0d5] rounded-xl p-6 mb-8 text-sm">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[#5a5a5a] text-[10px] uppercase tracking-widest font-bold">Mã đơn hàng:</span>
                      <strong className="text-[#1b6060] font-serif tracking-wider">{orderCode}</strong>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[#5a5a5a] text-[10px] uppercase tracking-widest font-bold">Tổng tiền:</span>
                      <strong className="text-[#1b6060] text-xl">{formatPrice(grandTotal)}</strong>
                    </div>
                    <div className="text-xs text-[#888888] border-t border-[#e8e0d5] pt-4 leading-relaxed">
                      Vui lòng đảm bảo nội dung chuyển khoản chính xác là <strong>{orderCode}</strong> để chúng tôi xác nhận nhanh chóng.
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center bg-white p-8 max-w-sm mx-auto shadow-sm mb-8 border border-[#e8e0d5] rounded-2xl">
                    <h4 className="text-[#1b6060] font-bold text-[10px] uppercase tracking-widest mb-6">Quét mã VietQR</h4>
                    
                    <div className="w-64 h-64 border border-[#e8e0d5] bg-white flex items-center justify-center p-2 rounded-xl">
                      <img 
                        src={vietQrUrl}
                        alt="VietQR code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-normal text-[#1b6060] mb-8 uppercase tracking-wider">
                    Tải lên minh chứng
                  </h2>

                  <div className="border border-dashed border-[#a3a68c] hover:border-[#1b6060] p-8 flex flex-col items-center justify-center transition-colors relative cursor-pointer min-h-[220px] bg-[#f6f3ed] rounded-xl">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    
                    {proofPreview ? (
                      <div className="flex flex-col items-center gap-4">
                        <img 
                          src={proofPreview} 
                          alt="Receipt Preview" 
                          className="w-32 h-auto max-h-40 object-contain border border-[#e8e0d5] rounded-lg"
                        />
                        <p className="text-[10px] text-[#5a5a5a] uppercase tracking-widest font-bold">Nhấn để thay đổi ảnh</p>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-[#1b6060]">Nhấn để tải ảnh biên lai</p>
                        <p className="text-xs text-[#888888]">Hỗ trợ JPG, PNG, WEBP</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-transparent border border-[#1b6060] text-[#1b6060] hover:bg-[#1b6060] hover:text-white font-bold py-4 rounded-full transition-all duration-300 text-[10px] uppercase tracking-widest"
                  >
                    Quay lại
                  </button>
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting || !proofImage}
                    className={`flex-1 font-bold py-4 rounded-full transition-all duration-300 text-[10px] uppercase tracking-widest ${!proofImage || isSubmitting ? 'bg-gray-300 text-[#888888] cursor-not-allowed' : 'bg-[#1b6060] hover:bg-[#144848] text-white shadow-lg shadow-[#1b6060]/20'}`}
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Hoàn tất đặt hàng'}
                  </button>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-xs text-[#5a5a5a]">
                    Bằng việc đặt hàng, bạn đồng ý với <Link to="/chinh-sach-mua-hang" target="_blank" className="text-[#1b6060] hover:text-[#144848] font-medium underline underline-offset-2 transition-colors">Chính sách mua hàng</Link> của chúng tôi
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-[500px] flex-shrink-0">
            <div className="bg-white border border-[#e8e0d5] p-8 rounded-2xl shadow-sm sticky top-32">
              <h3 className="font-serif text-2xl font-normal uppercase tracking-wider text-[#1b6060] mb-8 pb-4 border-b border-[#e8e0d5] flex items-center justify-between">
                Đơn hàng
                <span className="text-[10px] font-sans font-bold bg-[#1b6060]/10 text-[#1b6060] px-3 py-1 rounded-full">
                  {getCartCount()}
                </span>
              </h3>

              {/* Items List */}
              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 mb-8">
                {cart.map((item) => {
                  const activePrice = item.product.salePrice || item.product.regularPrice;
                  return (
                    <div key={item.product.id} className="flex gap-4 items-center">
                      <div className="relative w-16 h-16 bg-[#f6f3ed] border border-[#e8e0d5] rounded-xl shrink-0">
                        <img 
                          src={item.product.thumbnailUrl} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#2c2c2c] uppercase tracking-wider truncate mb-1">{item.product.name}</h4>
                        <p className="text-xs text-[#888888]">{formatPrice(activePrice)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          {step === 1 ? (
                            <>
                              <button 
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)} 
                                className="p-1 hover:bg-[#e8e0d5] rounded text-[#5a5a5a] transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-medium text-[#2c2c2c] w-4 text-center">{item.quantity}</span>
                              <button 
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)} 
                                className="p-1 hover:bg-[#e8e0d5] rounded text-[#5a5a5a] transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button 
                                type="button"
                                onClick={() => removeFromCart(item.product.id)}
                                className="p-1 hover:bg-red-50 text-[#888888] hover:text-red-500 rounded transition-colors ml-1"
                                title="Xóa sản phẩm"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] font-bold text-[#888888] bg-[#f6f3ed] px-2 py-1 rounded uppercase tracking-widest">
                              Số lượng: {item.quantity}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm text-[#1b6060] font-bold block">
                          {formatPrice(activePrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Billing Summary */}
              <div className="border-t border-[#e8e0d5] pt-6 space-y-4 text-sm">
                <div className="flex justify-between text-[#5a5a5a]">
                  <span className="text-[10px] uppercase tracking-widest font-bold">Tạm tính</span>
                  <span className="text-[#2c2c2c] font-medium">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-[#5a5a5a]">
                  <span className="text-[10px] uppercase tracking-widest font-bold">Phí giao hàng</span>
                  {shippingFee === 0 ? (
                    <span className="text-green-600 font-bold bg-green-50 px-2 rounded">Miễn phí</span>
                  ) : (
                    <span className="text-[#2c2c2c] font-medium">{formatPrice(shippingFee)}</span>
                  )}
                </div>

                <div className="border-t border-[#e8e0d5] pt-6 flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#2c2c2c]">Tổng cộng</span>
                  <span className="text-xl font-bold text-[#1b6060]">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Custom Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative animate-fade-in-up">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                modal.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {modal.type === 'success' ? (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-serif text-[#1b6060] mb-4">
                {modal.type === 'success' ? 'Thành công' : 'Lỗi'}
              </h3>
              <p className="text-[#5a5a5a] mb-8 leading-relaxed">
                {modal.message}
              </p>
              <button
                onClick={closeAlert}
                className="bg-[#1b6060] hover:bg-[#144848] text-white px-8 py-3 rounded-full font-bold transition-colors w-full text-sm uppercase tracking-widest"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
