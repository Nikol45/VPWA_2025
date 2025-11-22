import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Channel from '#models/channel'
import User from '#models/user'
import { TypingStateValidator } from '#validators/typing_state'

interface TypingState {
  userId: number
  channelId: number
  text: string
  updatedAt: DateTime
}

type TypingKey = string

const typingStates = new Map<TypingKey, TypingState>()

function makeKey(channelId: number, userId: number): string {
  return `${channelId}:${userId}`
}

export default class TypingController {
  private cleanupExpired(channelId: number) {
    const now = DateTime.now()
    const threshold = now.minus({ seconds: 10 })

    for (const [key, state] of typingStates) {
      if (state.channelId !== channelId) continue
      if (state.updatedAt < threshold) {
        typingStates.delete(key)
      }
    }
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

    const payload = await request.validateUsing(TypingStateValidator)

    const key = makeKey(channel.id, user.id)

    if (!payload.isTyping) {
      typingStates.delete(key)
      return { success: true }
    }

    typingStates.set(key, {
      userId: user.id,
      channelId: channel.id,
      text: payload.text ?? '',
      updatedAt: DateTime.now(),
    })

    return { success: true }
  }

  public async index({ auth, params, response }: HttpContext) {
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

    this.cleanupExpired(channel.id)

    const states = Array.from(typingStates.values()).filter(
      (s) => s.channelId === channel.id && s.userId !== user.id
    )

    if (states.length === 0) {
      return []
    }

    const userIds = states.map((s) => s.userId)
    const users = await User.query().whereIn('id', userIds)

    const userMap = new Map<number, User>()
    for (const u of users) {
      userMap.set(u.id, u)
    }

    return states
      .map((s) => {
        const u = userMap.get(s.userId)
        if (!u) return null

        return {
          userId: u.id,
          nickname: u.nickname,
          text: s.text,
        }
      })
      .filter((v) => v !== null)
  }
}
