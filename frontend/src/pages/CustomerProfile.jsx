import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useCustomerAuthStore } from "../store/useCustomerAuthStore";
import { Award, UserCircle, Star, History, LogOut, ShoppingBag, Package, ChevronDown, ChevronUp, Settings, Heart } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/shop/ProductCard";
import toast from 'react-hot-toast';

const STATUS_MAP = {
  PENDING_CONFIRMATION: { label: 'Chờ xác nhận', color: 'bg-orange-100 text-orange-700' },
  CONFIRMED:            { label: 'Đã xác nhận',  color: 'bg-blue-100 text-blue-700' },
  SHIPPED:              { label: 'Đang giao',     color: 'bg-purple-100 text-purple-700' },
  DELIVERED:            { label: 'Đã giao',       color: 'bg-green-100 text-green-700' },
  CANCELLED:            { label: 'Đã hủy',        color: 'bg-red-100 text-red-700' },
};

export default function CustomerProfile() {
  const { customer, customerToken, customerLogout, updateCustomer } = useCustomerAuthStore();
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'profile';

  const [activeTab, setActiveTab] = useState(initialTab); // 'profile' | 'orders' | 'points' | 'favorites'
  const [loyaltyData, setLoyaltyData] = useState({ loyaltyPoints: 0, rank: 'Đồng' });
  const [history, setHistory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [profileData, setProfileData] = useState({ fullName: '', email: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState([]);

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab) setActiveTab(tab);
  }, [location.search]);

  useEffect(() => {
    if (!customer || !customerToken) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${customerToken}` };
        
        const [resMe, resHist, resOrders, resProfile, resFav] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/v1/loyalty/me`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/v1/loyalty/history`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/v1/loyalty/my-orders`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/v1/auth/me`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/v1/favorites`, { headers }),
        ]);

        if (resMe.ok) setLoyaltyData(await resMe.json());
        if (resHist.ok) setHistory(await resHist.json());
        if (resOrders.ok) setOrders(await resOrders.json());
        if (resFav.ok) setFavorites(await resFav.json());
        if (resProfile.ok) {
          const profile = await resProfile.json();
          setProfileData({
            fullName: profile.fullName || '',
            email: profile.email || '',
            phone: profile.phone || ''
          });
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customer, customerToken, navigate]);

  const handleLogout = () => {
    customerLogout();
    navigate('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${customerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        updateCustomer(profileData);
        toast.success("Cập nhật thông tin thành công!");
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error("Lỗi kết nối đến máy chủ.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }
    setIsChangingPassword(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/auth/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${customerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      if (res.ok) {
        toast.success("Đổi mật khẩu thành công!");
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const err = await res.json();
        toast.error(err.message || "Đổi mật khẩu thất bại!");
      }
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);
      toast.error("Lỗi kết nối đến máy chủ.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

  const getRankColor = (rank) => {
    if (rank === 'Vàng') return 'text-yellow-500 bg-yellow-50';
    if (rank === 'Bạc') return 'text-gray-400 bg-gray-50';
    return 'text-amber-700 bg-amber-50';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#222222]">
      <Header />
      
      <main className="flex-1 container mx-auto px-6 max-w-6xl py-12 mt-24 mb-16">
        <h1 className="text-3xl font-serif text-[#1b6060] mb-10 text-left uppercase tracking-widest">Tài khoản của tôi</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl p-6 sticky top-24 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-100">
                <UserCircle className="w-20 h-20 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-[#2c2c2c]">{customer?.username}</h2>
                <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getRankColor(loyaltyData.rank)}`}>
                  <Star className="w-4 h-4 fill-current" />
                  Thành viên {loyaltyData.rank}
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'profile' ? 'bg-[#1b6060]/10 text-[#1b6060]' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <Settings className="w-5 h-5" />
                  Hồ sơ cá nhân
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'orders' ? 'bg-[#1b6060]/10 text-[#1b6060]' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Đơn hàng của tôi
                  {orders.length > 0 && (
                    <span className="ml-auto bg-[#1b6060] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {orders.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('points')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'points' ? 'bg-[#1b6060]/10 text-[#1b6060]' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <Award className="w-5 h-5" />
                  Điểm thưởng
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'favorites' ? 'bg-[#1b6060]/10 text-[#1b6060]' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <Heart className="w-5 h-5" />
                  Sản phẩm yêu thích
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'password' ? 'bg-[#1b6060]/10 text-[#1b6060]' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <Settings className="w-5 h-5" />
                  Đổi mật khẩu
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Đăng xuất
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-8 h-full">

            {/* Tab: Hồ sơ cá nhân */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
                <h2 className="text-xl font-bold text-[#2c2c2c] mb-6">Thông tin cá nhân</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                    <input
                      type="text"
                      required
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1b6060] focus:ring-1 focus:ring-[#1b6060] transition-colors"
                      placeholder="Nhập họ và tên của bạn"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1b6060] focus:ring-1 focus:ring-[#1b6060] transition-colors"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1b6060] focus:ring-1 focus:ring-[#1b6060] transition-colors"
                      placeholder="Nhập địa chỉ email"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-3.5 bg-[#1b6060] text-white rounded-xl font-semibold hover:bg-[#144848] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
                    >
                      {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab: Đổi mật khẩu */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
                <h2 className="text-xl font-bold text-[#2c2c2c] mb-6">Đổi mật khẩu</h2>
                <form onSubmit={handleChangePassword} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1b6060] focus:ring-1 focus:ring-[#1b6060] transition-colors"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                    <input
                      type="password"
                      required
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1b6060] focus:ring-1 focus:ring-[#1b6060] transition-colors"
                      placeholder="Nhập mật khẩu mới"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1b6060] focus:ring-1 focus:ring-[#1b6060] transition-colors"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="px-6 py-3.5 bg-[#2c2c2c] text-white rounded-xl font-semibold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
                    >
                      {isChangingPassword ? 'Đang đổi...' : 'Đổi mật khẩu'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab: Favorites */}
            {activeTab === 'favorites' && (
              <div className="space-y-4 h-full bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#2c2c2c]">Sản phẩm yêu thích</h2>
                  <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">{favorites.length} sản phẩm</span>
                </div>

                {favorites.length === 0 ? (
                  <div className="bg-gray-50 rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Bạn chưa có sản phẩm yêu thích nào.</p>
                    <Link to="/shop" className="text-[#1b6060] font-semibold hover:underline inline-block">
                      Khám phá sản phẩm ngay →
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Đơn hàng */}
            {activeTab === 'orders' && (
              <div className="space-y-4 h-full bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#2c2c2c]">Lịch sử đơn hàng</h2>
                  <span className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">{orders.length} đơn hàng</span>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-gray-50 rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Bạn chưa có đơn hàng nào.</p>
                    <Link to="/shop" className="text-[#1b6060] font-semibold hover:underline inline-block">
                      Mua sắm ngay →
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => {
                    const status = STATUS_MAP[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-700' };
                    const isExpanded = expandedOrders.includes(order.id);
                    
                    const toggleOrder = () => {
                      setExpandedOrders(prev => 
                        prev.includes(order.id) 
                          ? prev.filter(id => id !== order.id) 
                          : [...prev, order.id]
                      );
                    };

                    return (
                      <div key={order.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        {/* Order Header */}
                        <button
                          onClick={toggleOrder}
                          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-4 flex-wrap">
                            <div>
                              <p className="font-bold text-[#1b6060] font-mono text-sm">{order.orderCode}</p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {new Date(order.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-bold text-[#2c2c2c]">{formatPrice(order.grandTotal)}</span>
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                          </div>
                        </button>

                        {/* Order Detail (expandable) */}
                        {isExpanded && (
                          <div className="border-t border-gray-100 p-5 space-y-4 bg-white">
                            {/* Items */}
                            {order.items && order.items.length > 0 && (
                              <div className="space-y-3">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex items-center gap-4">
                                    {item.product?.thumbnailUrl && (
                                      <img
                                        src={item.product.thumbnailUrl}
                                        alt={item.product.name}
                                        className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0 shadow-sm"
                                      />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-[#2c2c2c] truncate">{item.product?.name || 'Sản phẩm'}</p>
                                      <p className="text-xs text-gray-500 mt-0.5">Số lượng: <span className="font-medium text-gray-700">{item.quantity}</span></p>
                                    </div>
                                    <span className="text-sm font-bold text-[#1b6060] shrink-0">{formatPrice(item.price * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Summary */}
                            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                              <div className="flex justify-between text-gray-600">
                                <span>Tạm tính</span>
                                <span className="font-medium">{formatPrice(order.subtotal)}</span>
                              </div>
                              <div className="flex justify-between text-gray-600">
                                <span>Phí vận chuyển</span>
                                <span className="font-medium">{order.shippingFee === 0 ? <span className="text-[#1b6060] font-semibold">Miễn phí</span> : formatPrice(order.shippingFee)}</span>
                              </div>
                              <div className="flex justify-between font-bold text-[#2c2c2c] pt-2 border-t border-gray-100 text-base">
                                <span>Tổng cộng</span>
                                <span className="text-[#1b6060]">{formatPrice(order.grandTotal)}</span>
                              </div>
                            </div>

                            {/* Delivery */}
                            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1.5 border border-gray-100 mt-4">
                              <p><span className="font-semibold text-[#2c2c2c]">Giao đến:</span> {order.addressDetail}, {order.ward}, {order.district}, {order.province}</p>
                              {order.deliveryDate && (
                                <p><span className="font-semibold text-[#2c2c2c]">Thời gian:</span> {new Date(order.deliveryDate).toLocaleDateString('vi-VN')} | {order.deliveryTimeSlot}</p>
                              )}
                              <p><span className="font-semibold text-[#2c2c2c]">Thanh toán:</span> {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : (order.paymentMethod === 'vietqr' ? 'Chuyển khoản Ngân hàng' : order.paymentMethod)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Tab: Điểm thưởng */}
            {activeTab === 'points' && (
              <div className="space-y-6 h-full flex flex-col">
                {/* Điểm hiện tại */}
                <div className="bg-gradient-to-br from-[#1b6060] to-[#144848] rounded-3xl shadow-lg p-8 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-lg font-medium opacity-90 mb-1">Điểm tích lũy hiện tại</h3>
                    <div className="text-5xl font-bold flex items-baseline gap-2">
                      {loyaltyData.loyaltyPoints} <span className="text-2xl font-normal opacity-80">điểm</span>
                    </div>
                    <p className="mt-4 text-sm opacity-90 max-w-sm leading-relaxed">Bạn đang ở hạng <strong className="text-yellow-400">{loyaltyData.rank}</strong>. Hãy tiếp tục mua sắm để nhận nhiều đặc quyền hơn nhé!</p>
                  </div>
                  <Award className="absolute -right-4 -bottom-4 w-40 h-40 opacity-10" />
                </div>

                {/* Lịch sử điểm */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-1">
                  <h3 className="text-lg font-bold text-[#2c2c2c] mb-4 flex items-center gap-2">
                    <History className="w-5 h-5 text-[#1b6060]" />
                    Lịch sử nhận điểm
                  </h3>
                  
                  {history.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {history.map((item) => (
                        <div key={item.id} className="py-4 flex justify-between items-center hover:bg-gray-50 -mx-6 px-6 transition-colors">
                          <div>
                            <p className="font-medium text-[#2c2c2c]">{item.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(item.createdAt).toLocaleString('vi-VN')}</p>
                          </div>
                          <div className="font-bold text-[#1b6060] bg-[#1b6060]/10 px-3 py-1 rounded-full text-sm">
                            +{item.pointsChange}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Bạn chưa có lịch sử tích điểm nào.</p>
                      <Link to="/shop" className="text-[#1b6060] font-semibold hover:underline mt-2 inline-block">Mua sắm ngay để nhận điểm</Link>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
