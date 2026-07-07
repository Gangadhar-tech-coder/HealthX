import axios, { InternalAxiosRequestConfig } from 'axios'

let rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'
if (!rawUrl.endsWith('/')) {
  rawUrl += '/'
}
if (!rawUrl.endsWith('api/')) {
  rawUrl += 'api/'
}
const API_BASE_URL = rawUrl

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Automatically attach DRF Token key if found in localStorage
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

export default axiosInstance
