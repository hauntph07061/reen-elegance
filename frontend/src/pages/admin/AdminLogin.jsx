import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const login = useAuthStore(state => state.login)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.role === 'CUSTOMER') {
          setError('Tên đăng nhập hoặc mật khẩu không chính xác.')
          setLoading(false)
          return
        }
        login({ username: data.username, role: data.role, fullName: data.fullName }, data.token)
        navigate('/admin')
      } else {
        const msg = await response.text()
        setError(msg || 'Đăng nhập thất bại!')
      }
    } catch (err) {
      setError('Lỗi kết nối đến máy chủ.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f3ed] flex items-center justify-center p-6">
      <div className="bg-white max-w-md w-full rounded-3xl p-8 border border-[#e8e0d5] shadow-[0_20px_60px_rgba(27,96,96,0.05)]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1b6060] text-white rounded-2xl mx-auto flex items-center justify-center text-3xl font-serif mb-4 shadow-lg shadow-[#1b6060]/20">
            GE
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#2c2c2c]">Quản Trị Hệ Thống</h1>
          <p className="text-[#888888] text-sm mt-1">Đăng nhập để tiếp tục</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 text-center">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-[#5a5a5a] mb-1.5 block">Tên đăng nhập</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              placeholder="Nhập tên tài khoản"
              className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1b6060] focus:ring-2 focus:ring-[#1b6060]/10 transition-all" 
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#5a5a5a] mb-1.5 block">Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-[#f6f3ed] border border-[#e8e0d5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1b6060] focus:ring-2 focus:ring-[#1b6060]/10 transition-all" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1b6060] hover:bg-[#144848] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#1b6060]/20 transition-all mt-4 flex items-center justify-center disabled:opacity-70"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'ĐĂNG NHẬP'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#e8e0d5] text-center">
          <a href="/" className="text-[#5a5a5a] hover:text-[#1b6060] text-sm transition-colors font-medium">
            ← Quay lại Cửa hàng
          </a>
        </div>
      </div>
    </div>
  )
}
