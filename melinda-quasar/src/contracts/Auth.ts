export interface ApiToken {
  type: 'bearer'
  token: string
  expires_at?: string
  expires_in?: number
}

export interface RegisterData {
  nickname: string
  firstName: string
  lastName: string
  email: string
  password: string
  password_confirmation: string
  avatar?: File
}

export interface LoginCredentials {
  nickname: string
  password: string
}

export interface User {
  id: number

  firstName: string
  lastName: string
  nickname: string
  email: string
  
  theme: 'lilac' | 'midnight' | 'pink_chocolate' | 'forest'
  avatarUrl: string
  status: 'online' | 'dnd' | 'offline'
  notificationSetting: 'show_all' | 'mentions_only' | 'mute_all'

  createdAt: string
  updatedAt: string | null
}