import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Settings, LogOut, ShieldAlert, MessageSquare, Store, FileText, CreditCard } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function AdminLayout() {
  const location = useLocation();
  const { user, token, logout } = useAuthStore();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Đơn hàng', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Sản phẩm', path: '/admin/products', icon: Package },
    { name: 'Danh mục', path: '/admin/categories', icon: FolderTree },
    { name: 'Khách hàng', path: '/admin/customers', icon: Users },
    { name: 'Cửa hàng', path: '/admin/shops', icon: Store },
    { name: 'Tin tức', path: '/admin/posts', icon: FileText },
    { name: 'Liên hệ', path: '/admin/contacts', icon: MessageSquare },
  ];

  if (user?.role === 'ADMIN') {
    menuItems.push({ name: 'Nhân sự', path: '/admin/staff', icon: ShieldAlert });
    menuItems.push({ name: 'Tài khoản NH', path: '/admin/bank-accounts', icon: CreditCard });
    menuItems.push({ name: 'Cài đặt', path: '/admin/settings', icon: Settings });
  } else {
    menuItems.push({ name: 'Cài đặt', path: '/admin/settings', icon: Settings });
  }

  return (
    <div className="flex h-screen bg-[#ffffff] text-[#2c2c2c]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#e8e0d5] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#e8e0d5]">
          <Link to="/" className="text-xl font-serif text-[#2c2c2c] hover:text-[#1b6060] transition-colors">
            Green Elegance
          </Link>
          <span className="ml-2 text-xs bg-[#1b6060]/20 text-[#1b6060] px-2 py-0.5 rounded-full">Admin</span>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // Xử lý active state: nếu exact path hoặc đang ở sub-path
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(`${item.path}/`));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-[#1b6060]/10 text-[#1b6060]' 
                    : 'text-[#5a5a5a] hover:bg-[#f6f3ed] hover:text-[#2c2c2c]'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#e8e0d5]">
          <button 
            onClick={logout}
            className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#5a5a5a] hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-[#e8e0d5] flex items-center px-8 justify-between">
          <h1 className="text-xl font-serif text-[#2c2c2c]">Quản trị hệ thống</h1>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-sm text-[#1b6060] hover:text-[#144848]">Xem cửa hàng ↗</a>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#2c2c2c]">{user?.fullName || user?.username}</span>
              <div className="w-8 h-8 bg-[#1b6060] rounded-full flex items-center justify-center text-[#ffffff] font-medium text-xs">
                {user?.username ? user.username.substring(0, 2).toUpperCase() : 'AD'}
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-[#ffffff] p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
