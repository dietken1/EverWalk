import axios, { AxiosError } from 'axios'
import type { AuthResponse, Pet, Video, VideoJob, Message, DiaryEntry } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 개발 중에는 인증 오류 무시 (서버 미동작 시)
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      console.warn('서버에 연결할 수 없습니다. 개발 모드로 동작합니다.')
      return Promise.reject(error)
    }

    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃 (개발 중에는 주석 처리)
      // localStorage.removeItem('accessToken')
      // localStorage.removeItem('refreshToken')
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const auth = {
  register: async (email: string, password: string, name: string) => {
    const { data } = await api.post<AuthResponse>('/auth/register', {
      email,
      password,
      name,
    })
    return data
  },

  login: async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    })
    return data
  },
}

// Pet API
export const pets = {
  getAll: async () => {
    const { data } = await api.get<Pet[]>('/pets')
    return data
  },

  getById: async (petId: number) => {
    const { data } = await api.get<Pet>(`/pets/${petId}`)
    return data
  },

  create: async (payload: {
    name: string
    imageUrls: string[]
    species?: string
    memorialDate?: string
  }) => {
    const { data } = await api.post<Pet>('/pets', payload)
    return data
  },

  delete: async (petId: number) => {
    await api.delete(`/pets/${petId}`)
  },
}

// Video API
export const videos = {
  getByPet: async (petId: number) => {
    const { data } = await api.get<Video[]>(`/videos/pets/${petId}`)
    return data
  },

  create: async (petId: number, interactionType: string) => {
    const { data } = await api.post<VideoJob>(`/videos/pets/${petId}`, {
      interactionType,
    })
    return data
  },

  getJobStatus: async (jobId: number) => {
    const { data} = await api.get<VideoJob>(`/videos/jobs/${jobId}`)
    return data
  },

  // SSE for progress streaming
  streamProgress: (jobId: number, onProgress: (data: any) => void, onComplete: () => void, onError: (error: Error) => void) => {
    const eventSource = new EventSource(`${API_URL}/videos/jobs/${jobId}/progress`)

    eventSource.addEventListener('progress', (event) => {
      const data = JSON.parse(event.data)
      onProgress(data)

      if (data.status === 'COMPLETED' || data.status === 'FAILED') {
        eventSource.close()
        onComplete()
      }
    })

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
      eventSource.close()
      onError(new Error('연결 오류가 발생했습니다'))
    }

    return eventSource
  },
}

// Message API
export const messages = {
  getByPet: async (petId: number) => {
    const { data } = await api.get<Message[]>(`/messages/pets/${petId}`)
    return data
  },

  send: async (petId: number, content: string) => {
    const { data } = await api.post<Message>(`/messages/pets/${petId}`, { content })
    return data
  },

  markAsRead: async (messageId: number) => {
    await api.put(`/messages/${messageId}/read`)
  },

  getUnreadCount: async (petId: number) => {
    const { data } = await api.get<{ unreadCount: number }>(`/messages/pets/${petId}/unread-count`)
    return data.unreadCount
  },
}

// Diary API
export const diaries = {
  getByPet: async (petId: number) => {
    const { data } = await api.get<DiaryEntry[]>(`/diaries/pets/${petId}`)
    return data
  },

  getById: async (diaryId: number) => {
    const { data } = await api.get<DiaryEntry>(`/diaries/${diaryId}`)
    return data
  },

  create: async (petId: number) => {
    const { data } = await api.post<DiaryEntry>(`/diaries/pets/${petId}`)
    return data
  },

  markAsRead: async (diaryId: number) => {
    await api.put(`/diaries/${diaryId}/read`)
  },

  getUnreadCount: async (petId: number) => {
    const { data } = await api.get<{ unreadCount: number }>(`/diaries/pets/${petId}/unread-count`)
    return data.unreadCount
  },
}

export default api
