export type Visibility = 'all' | 'public' | 'private'

export interface Member {
  id: number
  nickname: string
  name: string
  avatarUrl: string
  role?: string
  status: 'online' | 'offline' | 'dnd'
}