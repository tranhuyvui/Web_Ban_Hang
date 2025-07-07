import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true 
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
})

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config

    if (err.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshRes = await api.post('/auth/refresh')
        const newToken = refreshRes.data.accessToken

        localStorage.setItem('token', newToken)
        originalRequest.headers['Authorization'] = newToken

        return api(originalRequest)
      } catch (refreshErr) {
        return Promise.reject(refreshErr)
      }
    }

    return Promise.reject(err)
  }
)

export default api
