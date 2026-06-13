import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCustomerAuthStore } from "../store/useCustomerAuthStore";
import { LogIn, Phone, Lock } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function CustomerLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { customerLogin } = useCustomerAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: phone, password }),
      });

      if (!response.ok) {
        throw new Error("Tên đăng nhập hoặc mật khẩu không chính xác.");
      }

      const data = await response.json();
      
      if (data.role !== 'CUSTOMER') {
        throw new Error("Tên đăng nhập hoặc mật khẩu không chính xác.");
      }
      
      // Nếu đăng nhập thành công, lưu lại token (bất kể ROLE gì, nhưng thường chỉ có Khách mới vào đây)
      customerLogin({
        id: data.id,
        username: data.username,
        role: data.role
      }, data.token);

      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f3ed]">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4 mt-24 mb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8e0d5] w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="bg-[#1b6060]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="text-[#1b6060] w-8 h-8" />
            </div>
            <h1 className="text-2xl font-serif text-[#1b6060] uppercase tracking-widest mb-2">Đăng Nhập</h1>
            <p className="text-[#5a5a5a] text-sm">Truy cập để quản lý đơn hàng & điểm thưởng</p>
          </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#2c2c2c] mb-2">Số điện thoại</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-[#888888]" />
              </div>
              <input
                type="text"
                required
                className="w-full bg-[#f6f3ed] pl-10 pr-4 py-2.5 border border-[#e8e0d5] rounded-lg focus:ring-2 focus:ring-[#1b6060]/20 focus:border-[#1b6060] outline-none text-[#2c2c2c]"
                placeholder="Nhập số điện thoại của bạn"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2c2c2c] mb-2">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#888888]" />
              </div>
              <input
                type="password"
                required
                className="w-full bg-[#f6f3ed] pl-10 pr-4 py-2.5 border border-[#e8e0d5] rounded-lg focus:ring-2 focus:ring-[#1b6060]/20 focus:border-[#1b6060] outline-none text-[#2c2c2c]"
                placeholder="Mật khẩu mặc định là SĐT của bạn"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="text-xs text-[#888888] mt-2 text-right">Lưu ý: Mật khẩu mặc định sau khi đặt hàng lần đầu chính là SĐT của bạn.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1b6060] text-white py-3 rounded-lg font-medium hover:bg-[#144848] transition-colors disabled:opacity-70 flex justify-center items-center shadow-lg shadow-[#1b6060]/20"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>
      </div>
      </div>
      <Footer />
    </div>
  );
}
