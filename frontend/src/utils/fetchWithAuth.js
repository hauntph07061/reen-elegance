import { useAuthStore } from '../store/useAuthStore'

export const fetchWithAuth = async (url, options = {}) => {
  const { token, logout } = useAuthStore.getState()

  const headers = {
    ...options.headers,
    'Authorization': token ? `Bearer ${token}` : ''
  }

  // Không set Content-Type nếu đang gửi FormData (trình duyệt tự set với boundary)
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, { ...options, headers })

  if (response.status === 401 || response.status === 403) {
    logout()
    window.location.href = '/admin/login'
    throw new Error('Unauthorized or Session Expired')
  }

  return response
}
