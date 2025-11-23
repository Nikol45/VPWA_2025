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

export type UserTheme = 'lilac' | 'midnight' | 'pink_chocolate' | 'forest'
export type UserStatus = 'online' | 'dnd' | 'offline'
export type NotificationSetting = 'show_all' | 'mentions_only' | 'mute_all'

export interface User {
  id: number

  firstName: string
  lastName: string
  nickname: string
  email: string

  avatarUrl: string

  theme: UserTheme
  status: UserStatus
  notificationSetting: NotificationSetting

  createdAt: string
  updatedAt: string | null
}
