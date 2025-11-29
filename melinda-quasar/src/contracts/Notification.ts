export type NotificationType =
    | 'mention'
    | 'invite'
    | 'vote_kick_start'
    | 'vote_kick_new'
    | 'vote_kick_final'
    | 'removed_admin'
    | 'removed_vote'
    | 'channel_deleted_inactive'
    | 'channel_deleted_admin'
    | 'added_to_channel'
    | 'ban_revoked'

export interface NotificationUser {
    id: number
    nickname: string
    avatarUrl: string
}

export interface NotificationChannel {
    id: number
    name: string
}

export interface Notification {
    id: number
    userId: number
    channelId: number | null
    senderId: number | null
    isRead: boolean
    type: NotificationType
    createdAt: string
    updatedAt: string


    sender?: NotificationUser
    channel?: NotificationChannel
}
