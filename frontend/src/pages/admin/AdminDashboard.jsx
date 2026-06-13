import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, Clock, TrendingUp } from 'lucide-react';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

export default function AdminDashboard() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('30days'); // '30days' or 'monthly'
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        let url = `${import.meta.env.VITE_API_URL}/v1/admin/dashboard/stats`;
        if (filterType === 'monthly') {
          url += `?month=${selectedMonth}&year=${selectedYear}`;
        } else if (filterType === 'yearly') {
          url += `?year=${selectedYear}`;
        }
        const response = await fetchWithAuth(url);
        if (response.ok) {
          const data = await response.json();
          // Format date for chart
          const formattedData = {
            ...data,
            dailyRevenues: (data.dailyRevenues || []).map(item => {
              if (!item.date) return item;
              const dateParts = item.date.split('-');
              return {
                ...item,
                displayDate: dateParts.length >= 3 ? `${dateParts[2]}/${dateParts[1]}` : item.date // format DD/MM
              };
            })
          };
          setStats(formattedData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [filterType, selectedMonth, selectedYear]);

  if (loading && !stats) {
    return <div className="p-8 text-[#5a5a5a] animate-pulse">Đang tải số liệu thống kê...</div>;
  }

  if (!stats) {
    return <div className="p-8 text-red-500">Không thể tải dữ liệu thống kê. Vui lòng kiểm tra lại kết nối.</div>;
  }


  const kpiCards = [
    { 
      title: filterType === 'yearly' ? `Doanh thu Năm ${selectedYear}` : filterType === 'monthly' ? `Doanh thu Tháng ${selectedMonth}/${selectedYear}` : 'Doanh thu tháng này', 
      value: `${stats.monthlyRevenue?.toLocaleString()}đ`, 
      icon: DollarSign, 
      color: 'bg-[#f6f3ed] text-[#1b6060]' 
    },
    { 
      title: filterType === '30days' ? 'Đơn hàng mới (30 ngày)' : 'Đơn hàng mới', 
      value: stats.newOrdersCount, 
      icon: ShoppingBag, 
      color: 'bg-blue-50 text-blue-600' 
    },
    { 
      title: 'Đơn chờ xác nhận', 
      value: stats.pendingOrdersCount, 
      icon: Clock, 
      color: 'bg-orange-50 text-orange-600' 
    },
    { 
      title: 'Sản phẩm bán chạy nhất', 
      value: stats.topProducts.length > 0 ? stats.topProducts[0].name : 'Chưa có', 
      icon: TrendingUp, 
      color: 'bg-purple-50 text-purple-600' 
    }
  ];


  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h2 className="text-2xl font-serif text-[#2c2c2c] mb-1">Tổng quan Kinh doanh</h2>
          <p className="text-[#888888] text-sm">Cập nhật nhanh các chỉ số hoạt động của hệ thống.</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl border border-[#e8e0d5] shadow-sm">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm border-0 bg-transparent text-[#2c2c2c] focus:outline-none font-medium cursor-pointer"
          >
            <option value="30days">30 ngày gần nhất</option>
            <option value="monthly">Theo tháng/năm</option>
            <option value="yearly">Theo toàn bộ năm</option>
          </select>

          {(filterType === 'monthly' || filterType === 'yearly') && (
            <div className="flex items-center gap-2 border-l border-[#e8e0d5] pl-3">
              {filterType === 'monthly' && (
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="text-sm border-0 bg-transparent text-[#2c2c2c] focus:outline-none font-medium cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>Tháng {m}</option>
                  ))}
                </select>
              )}

              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="text-sm border-0 bg-transparent text-[#2c2c2c] focus:outline-none font-medium cursor-pointer"
              >
                {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(y => (
                  <option key={y} value={y}>Năm {y}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>


      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#e8e0d5] shadow-sm flex items-start gap-4">
              <div className={`p-3 rounded-xl ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#888888] mb-1">{card.title}</p>
                <h3 className="text-xl font-bold text-[#2c2c2c] truncate max-w-[150px]" title={card.value}>
                  {card.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl border border-[#e8e0d5] shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-[#2c2c2c] mb-6 font-serif">
            {filterType === 'yearly' ? `Xu hướng doanh thu (Năm ${selectedYear})` :
             filterType === 'monthly' ? `Xu hướng doanh thu (Tháng ${selectedMonth}/${selectedYear})` :
             'Xu hướng doanh thu (30 ngày gần nhất)'}
          </h3>
          <div className="h-[300px] w-full">
            {stats.dailyRevenues.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.dailyRevenues}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="displayDate" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()}đ`, 'Doanh thu']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#059669" 
                    strokeWidth={3} 
                    dot={{ fill: '#059669', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#5a5a5a]">
                Chưa có dữ liệu giao dịch trong khoảng thời gian này.
              </div>
            )}
          </div>
        </div>


        {/* Top Products List */}
        <div className="bg-white p-6 rounded-2xl border border-[#e8e0d5] shadow-sm">
          <h3 className="text-lg font-bold text-[#2c2c2c] mb-6">Top 5 Sản phẩm</h3>
          <div className="space-y-4">
            {stats.topProducts.map((prod, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#ffffff] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f6f3ed] text-[#1b6060] flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <p className="font-medium text-[#2c2c2c] truncate max-w-[150px]" title={prod.name}>
                    {prod.name}
                  </p>
                </div>
                <div className="text-sm font-semibold text-[#5a5a5a]">
                  {prod.soldQuantity} <span className="text-xs font-normal text-[#5a5a5a]">đã bán</span>
                </div>
              </div>
            ))}
            {stats.topProducts.length === 0 && (
              <div className="text-center text-[#888888] py-8">Chưa có dữ liệu bán hàng.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
