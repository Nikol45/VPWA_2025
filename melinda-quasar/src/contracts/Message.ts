import type { User } from './Auth'

export interface Message {
  id: number
  userId: number
  channelId: number
  text: string
  mentions: number[]
  createdAt: string
  user: User
}
