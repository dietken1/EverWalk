export interface User {
  id: number
  email: string
  name: string
  provider: 'LOCAL' | 'GOOGLE' | 'KAKAO'
  createdAt: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  user: User
}

export interface Pet {
  id: number
  name: string
  species?: string
  aiDescription?: string
  primaryImageUrl?: string
  isActive: boolean
  memorialDate?: string
  imageUrls: string[]
  createdAt: string
}

export type InteractionType = 'FEEDING' | 'PETTING' | 'PLAYING' | 'WALKING'

export interface Video {
  id: number
  petId: number
  petName: string
  interactionType: InteractionType
  videoUrl: string
  thumbnailUrl?: string
  durationSeconds: number
  createdAt: string
}

export interface VideoJob {
  id: number
  petId: number
  interactionType: InteractionType
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  lumaJobId?: string
  errorMessage?: string
  progressPercent: number
  createdAt: string
  completedAt?: string
}

export interface ErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  details?: Record<string, string>
}

export type SenderType = 'USER' | 'PET'

export interface Message {
  id: number
  petId: number
  senderType: SenderType
  content: string
  isRead: boolean
  createdAt: string
}

export type DiaryMood = 'HAPPY' | 'PLAYFUL' | 'SLEEPY' | 'MISSING_YOU' | 'GRATEFUL'

export interface DiaryEntry {
  id: number
  petId: number
  petName: string
  title: string
  content: string
  mood: DiaryMood
  isRead: boolean
  createdAt: string
}
