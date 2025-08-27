import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

class ApiService {
  public api: ReturnType<typeof axios.create>

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('hoppon_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('hoppon_token')
          localStorage.removeItem('hoppon_user')
          window.location.href = '/'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async register(userData: {
    name: string
    email: string
    password: string
    phone?: string
  }) {
    return this.api.post('/auth/register', userData)
  }

  async login(credentials: {
    email: string
    password: string
  }) {
    return this.api.post('/auth/login', credentials)
  }

  async adminLogin(credentials: {
    email: string
    password: string
  }) {
    return this.api.post('/auth/admin/login', credentials)
  }

  async getProfile() {
    return this.api.get('/auth/profile')
  }

  async updateProfile(userData: {
    name?: string
    phone?: string
  }) {
    return this.api.put('/auth/profile', userData)
  }

  // Generic methods
  async get(endpoint: string) {
    return this.api.get(endpoint)
  }

  async post(endpoint: string, data: any) {
    return this.api.post(endpoint, data)
  }

  async put(endpoint: string, data: any) {
    return this.api.put(endpoint, data)
  }

  async delete(endpoint: string) {
    return this.api.delete(endpoint)
  }
}

export const apiService = new ApiService()
export default apiService