export type ChannelVisibility = 'public' | 'private'

export interface Channel {
    id: number

    name: string
    iconUrl: string
    visibility: ChannelVisibility
    nMembers: number
    adminId: number
    inviteCode: string

    lastMessageAt: string | null

    createdAt: string
    updatedAt: string | null

    isMember: boolean
    isInvited: boolean
    isAdmin: boolean
}
