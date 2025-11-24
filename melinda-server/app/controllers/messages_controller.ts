import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Message from '#models/message'
import Channel from '#models/channel'
import User from '#models/user'
import Notification from '#models/notification'
import { SendMessageValidator } from '#validators/send_message'
import { emitToChannel } from '#services/ws_events'

export default class MessagesController {
  private extractMentions(text: string): string[] {
    const regex = /@([A-Za-z0-9_]+)/g
    const nicknames = new Set<string>()
    let match: RegExpExecArray | null

    while ((match = regex.exec(text)) !== null) {
      nicknames.add(match[1])
    }

    return Array.from(nicknames)
  }

  private async createNotifications(
    channel: Channel,
    sender: User,
    message: Message,
    mentionedUserIds: number[]
  ) {
    const members = await channel.related('members').query()

    const mentionedIds = new Set<number>(mentionedUserIds || [])

    const textPreview =
      message.text.length > 200 ? message.text.slice(0, 200) : message.text

    const notifications: {
      userId: number
      senderType: 'user' | 'channel'
      senderId: number
      isRead: boolean
      text: string
    }[] = []

    for (const member of members) {
      if (member.id === sender.id) continue

      if (member.notificationSetting === 'mute_all') continue
      if (member.status === 'dnd') continue

      if (
        member.notificationSetting === 'mentions_only' &&
        !mentionedIds.has(member.id)
      ) {
        continue
      }

      notifications.push({
        userId: member.id,
        senderType: 'channel',
        senderId: channel.id,
        isRead: false,
        text: textPreview,
      })
    }

    if (notifications.length > 0) {
      await Notification.createMany(notifications)
    }
  }

  public async index({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const channel = await Channel.findOrFail(params.id)

    const isMember = await channel
      .related('members')
      .query()
      .where('users.id', user.id)
      .first()

    if (!isMember) {
      return response.forbidden({
        error: 'You are not a member of this channel',
      })
    }

    const before = request.input('before') as string | undefined
    const limit = Number(request.input('limit') ?? 20)

    const query = Message.query()
      .where('channel_id', channel.id)
      .orderBy('created_at', 'desc')
      .preload('user')

    if (before) {
      const beforeDate = DateTime.fromISO(before)
      
      if (!beforeDate.isValid) {
      }
      else {
        query.where('created_at', '<', beforeDate.toSQL())
      }
    }

    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 20
    const messages = await query.limit(safeLimit)

    return messages.map((m) => m.serialize())
  }

  public async store({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const channel = await Channel.findOrFail(params.id)

    const isMember = await channel
      .related('members')
      .query()
      .where('users.id', user.id)
      .first()

    if (!isMember) {
      return response.forbidden({
        error: 'You are not a member of this channel',
      })
    }

    const banned = await channel
      .related('blacklist')
      .query()
      .where('users.id', user.id)
      .first()

    if (banned) {
      return response.forbidden({
        error: 'You are banned from this channel',
      })
    }

    const payload = await request.validateUsing(SendMessageValidator)

    const nicknames = this.extractMentions(payload.text)
    let mentions: number[] = []

    if (nicknames.length > 0) {
      const users = await User.query().whereIn('nickname', nicknames)
      mentions = users.map((u) => u.id)
    }

    const message = await Message.create({
      userId: user.id,
      channelId: channel.id,
      text: payload.text,
      mentions,
    })

    channel.lastMessageAt = DateTime.now()
    await channel.save()

    await this.createNotifications(channel, user, message, mentions)

    await message.load('user')

    emitToChannel(channel.id, 'message:new', message.serialize())

    return message.serialize()
  }
}
