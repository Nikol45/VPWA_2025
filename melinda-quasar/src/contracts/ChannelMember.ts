export interface ChannelMember {
  id: number
  nickname: string
  firstName: string
  lastName: string
  avatarUrl: string
  status: 'online' | 'offline' | 'dnd'
  isAdmin: boolean
}
