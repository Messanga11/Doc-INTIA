const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface ApiResponse<T> {
  data: T
  meta?: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Don't set Content-Type for FormData
  const isFormData = options.body instanceof FormData
  const headers: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // Include cookies in requests
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
    // If unauthorized, redirect to login
    if (response.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    throw new Error(error.detail || `HTTP error! status: ${response.status}`)
  }

  // Handle 204 No Content responses (e.g., DELETE operations)
  if (response.status === 204) {
    return null as T
  }

  // Try to parse JSON, return null if no content or not JSON
  try {
    const text = await response.text()
    if (!text || text.trim().length === 0) {
      return null as T
    }
    return JSON.parse(text)
  } catch {
    return null as T
  }
}

// Auth API
export const authApi = {
  login: async (username: string, password: string) => {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    
    return apiRequest<{ access_token: string; user: any }>('/api/v1/auth/login', {
      method: 'POST',
      body: formData,
    })
  },
  
  logout: async () => {
    return apiRequest('/api/v1/auth/logout', {
      method: 'POST',
    })
  },
  
  getCurrentUser: async () => {
    return apiRequest('/api/v1/auth/me')
  },
}

// Clients API
export const clientsApi = {
  getAll: async (params?: { skip?: number; limit?: number; search?: string; branch_id?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString())
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.branch_id) queryParams.append('branch_id', params.branch_id.toString())
    
    const query = queryParams.toString()
    return apiRequest<ApiResponse<any[]>>(`/api/v1/clients${query ? `?${query}` : ''}`)
  },
  
  getById: async (id: number) => {
    return apiRequest(`/api/v1/clients/${id}`)
  },
  
  create: async (data: any) => {
    return apiRequest('/api/v1/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  update: async (id: number, data: any) => {
    return apiRequest(`/api/v1/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  
  delete: async (id: number) => {
    return apiRequest(`/api/v1/clients/${id}`, {
      method: 'DELETE',
    })
  },
}

// Policies API
export const policiesApi = {
  getAll: async (params?: { skip?: number; limit?: number; client_id?: number; status?: string; branch_id?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString())
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString())
    if (params?.client_id) queryParams.append('client_id', params.client_id.toString())
    if (params?.status) queryParams.append('status', params.status)
    if (params?.branch_id) queryParams.append('branch_id', params.branch_id.toString())
    
    const query = queryParams.toString()
    return apiRequest<ApiResponse<any[]>>(`/api/v1/policies${query ? `?${query}` : ''}`)
  },
  
  getById: async (id: number) => {
    return apiRequest(`/api/v1/policies/${id}`)
  },
  
  create: async (data: any) => {
    return apiRequest('/api/v1/policies', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  
  update: async (id: number, data: any) => {
    return apiRequest(`/api/v1/policies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  
  delete: async (id: number) => {
    return apiRequest(`/api/v1/policies/${id}`, {
      method: 'DELETE',
    })
  },
}

// Branches API
export const branchesApi = {
  getAll: async () => {
    return apiRequest('/api/v1/branches')
  },
  
  getById: async (id: number) => {
    return apiRequest(`/api/v1/branches/${id}`)
  },
}

// Users API (Admin only)
export const usersApi = {
  getAll: async () => {
    return apiRequest('/api/v1/users')
  },
  
  getById: async (id: number) => {
    return apiRequest(`/api/v1/users/${id}`)
  },
}

// Audit Logs API (Admin only)
export const auditApi = {
  getAll: async (params?: { skip?: number; limit?: number; user_id?: number; action?: string; resource_type?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString())
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString())
    if (params?.user_id) queryParams.append('user_id', params.user_id.toString())
    if (params?.action) queryParams.append('action', params.action)
    if (params?.resource_type) queryParams.append('resource_type', params.resource_type)
    
    const query = queryParams.toString()
    return apiRequest<ApiResponse<any[]>>(`/api/v1/audit-logs${query ? `?${query}` : ''}`)
  },
}
