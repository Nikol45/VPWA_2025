export type NotificationSenderType = 'user' | 'channel'

export interface Notification {
  id: number
  userId: number
  senderType: NotificationSenderType
  senderId: number
  isRead: boolean
  text: string
  createdAt: string
  updatedAt: string
}
