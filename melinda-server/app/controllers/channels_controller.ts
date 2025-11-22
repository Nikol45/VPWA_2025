import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Channel from '#models/channel'
import Message from '#models/message'
import Kickvote from '#models/kickvote'
import User from '#models/user'
import { CreateChannelValidator } from '#validators/create_channel'
import { JoinChannelValidator } from '#validators/join_channel'
import { ChannelNicknameActionValidator } from '#validators/channel_nickname_action'

interface ChannelResponse {
  id: number
  name: string
  iconUrl: string
  visibility: 'public' | 'private'
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

export default class ChannelsController {
  private async deleteInactiveChannels() {
    const threshold = DateTime.now().minus({ days: 30 })

    const inactive = await Channel.query()
      .where((q) => q.whereNull('last_message_at').where('created_at', '<', threshold.toSQL()))
      .orWhere('last_message_at', '<', threshold.toSQL())

    if (inactive.length === 0) return

    const ids = inactive.map((c) => c.id)

    await Message.query().whereIn('channel_id', ids).delete()
    await Kickvote.query().whereIn('channel_id', ids).delete()

    for (const channel of inactive) {
      await channel.related('members').detach()
      await channel.related('invitations').detach()
      await channel.related('blacklist').detach()
      await channel.delete()
    }
  }

  private async cleanupAndDeleteChannel(channel: Channel) {
    await Message.query().where('channel_id', channel.id).delete()
    await Kickvote.query().where('channel_id', channel.id).delete()

    await channel.related('members').detach()
    await channel.related('invitations').detach()
    await channel.related('blacklist').detach()

    await channel.delete()
  }

  private async findUserByNicknameOrFail(nickname: string) {
    const user = await User.findBy('nickname', nickname)
    if (!user) {
      throw new Error('USER_NOT_FOUND')
    }
    return user
  }

  public async index({ auth }: HttpContext) {
    await this.deleteInactiveChannels()

    const user = auth.user!
    const [memberChannels, invitedChannels] = await Promise.all([
      user.related('channels').query(),
      user.related('invitations').query(),
    ])

    const map = new Map<number, ChannelResponse>()

    for (const c of memberChannels) {
      const serialized = c.serialize() as Omit<ChannelResponse, 'isMember' | 'isInvited' | 'isAdmin'>
      map.set(c.id, {
        ...serialized,
        isMember: true,
        isInvited: false,
        isAdmin: c.adminId === user.id,
      })
    }

    for (const c of invitedChannels) {
      const existing = map.get(c.id)

      if (existing) {
        existing.isInvited = true
      } else {
        const serialized = c.serialize() as Omit<ChannelResponse, 'isMember' | 'isInvited' | 'isAdmin'>
        map.set(c.id, {
          ...serialized,
          isMember: false,
          isInvited: true,
          isAdmin: c.adminId === user.id,
        })
      }
    }

    return [...map.values()]
  }

  public async store({ auth, request }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(CreateChannelValidator)

    const channel = await Channel.create({
      name: payload.name,
      iconUrl: payload.iconUrl ?? '',
      visibility: payload.visibility,
      nMembers: 1,
      adminId: user.id,
      inviteCode: payload.inviteCode ?? '',
      lastMessageAt: DateTime.now(),
    })

    await channel.related('members').attach([user.id])

    const serialized = channel.serialize() as Omit<ChannelResponse, 'isMember' | 'isInvited' | 'isAdmin'>

    return {
      ...serialized,
      isMember: true,
      isInvited: false,
      isAdmin: true,
    } as ChannelResponse
  }

  public async joinByName({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(JoinChannelValidator)

    const existing = await Channel.findBy('name', payload.name)

    if (!existing) {
      const visibility = payload.visibility ?? 'public'

      const channel = await Channel.create({
        name: payload.name,
        iconUrl: '',
        visibility,
        nMembers: 1,
        adminId: user.id,
        inviteCode: '',
        lastMessageAt: DateTime.now(),
      })

      await channel.related('members').attach([user.id])

      const serialized = channel.serialize() as Omit<ChannelResponse, 'isMember' | 'isInvited' | 'isAdmin'>

      return {
        ...serialized,
        isMember: true,
        isInvited: false,
        isAdmin: true,
      } as ChannelResponse
    }

    const channel = existing

    const banned = await channel
      .related('blacklist')
      .query()
      .where('users.id', user.id)
      .first()

    if (banned) {
      return response.forbidden({ error: 'You are banned from this channel' })
    }

    const isMember = await channel
      .related('members')
      .query()
      .where('users.id', user.id)
      .first()

    if (isMember) {
      const serialized = channel.serialize() as Omit<ChannelResponse, 'isMember' | 'isInvited' | 'isAdmin'>
      return {
        ...serialized,
        isMember: true,
        isInvited: false,
        isAdmin: channel.adminId === user.id,
      } as ChannelResponse
    }

    if (channel.visibility === 'private') {
      const hasInvitation = await channel
        .related('invitations')
        .query()
        .where('users.id', user.id)
        .first()

      if (!hasInvitation) {
        return response.forbidden({
          error: 'Cannot join a private channel without invitation',
        })
      }

      await channel.related('members').attach([user.id])
      await channel.related('invitations').detach([user.id])

      channel.nMembers = channel.nMembers + 1
      await channel.save()

      const serialized = channel.serialize() as Omit<ChannelResponse, 'isMember' | 'isInvited' | 'isAdmin'>

      return {
        ...serialized,
        isMember: true,
        isInvited: false,
        isAdmin: channel.adminId === user.id,
      } as ChannelResponse
    }

    await channel.related('members').attach([user.id])
    await channel.related('invitations').detach([user.id])

    channel.nMembers = channel.nMembers + 1
    await channel.save()

    const serialized = channel.serialize() as Omit<ChannelResponse, 'isMember' | 'isInvited' | 'isAdmin'>

    return {
      ...serialized,
      isMember: true,
      isInvited: false,
      isAdmin: channel.adminId === user.id,
    } as ChannelResponse
  }

  public async leave({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const channel = await Channel.findOrFail(params.id)

    if (channel.adminId === user.id) {
      await this.cleanupAndDeleteChannel(channel)
      return { success: true, deleted: true }
    }

    const isMember = await channel
      .related('members')
      .query()
      .where('users.id', user.id)
      .first()

    if (!isMember) {
      return response.forbidden({ error: 'You are not a member of this channel' })
    }

    await channel.related('members').detach([user.id])

    channel.nMembers = Math.max(channel.nMembers - 1, 0)
    await channel.save()

    return { success: true, deleted: false }
  }

  public async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const channel = await Channel.findOrFail(params.id)

    if (channel.adminId !== user.id) {
      return response.forbidden({
        error: 'Only channel admin can delete the channel',
      })
    }

    await this.cleanupAndDeleteChannel(channel)

    return { success: true }
  }

  public async invite({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const channel = await Channel.findOrFail(params.id)
    const payload = await request.validateUsing(ChannelNicknameActionValidator)

    if (channel.visibility === 'private') {
      if (channel.adminId !== user.id) {
        return response.forbidden({
          error: 'Only channel admin can invite to a private channel',
        })
      }
    } else {
      const isMember = await channel
        .related('members')
        .query()
        .where('users.id', user.id)
        .first()

      if (!isMember) {
        return response.forbidden({
          error: 'Only channel members can invite to a public channel',
        })
      }
    }

    let target: User
    try {
      target = await this.findUserByNicknameOrFail(payload.nickname)
    } catch {
      return response.notFound({ error: 'User not found' })
    }

    const banned = await channel
      .related('blacklist')
      .query()
      .where('users.id', target.id)
      .first()

    if (banned) {
      return response.forbidden({ error: 'User is banned from this channel' })
    }

    const isMember = await channel
      .related('members')
      .query()
      .where('users.id', target.id)
      .first()

    if (isMember) {
      return { success: true, invited: false }
    }

    const alreadyInvited = await channel
      .related('invitations')
      .query()
      .where('users.id', target.id)
      .first()

    if (!alreadyInvited) {
      await channel.related('invitations').attach([target.id])
    }

    return { success: true, invited: true }
  }

  public async revoke({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const channel = await Channel.findOrFail(params.id)
    const payload = await request.validateUsing(ChannelNicknameActionValidator)

    if (channel.adminId !== user.id) {
      return response.forbidden({
        error: 'Only channel admin can revoke members',
      })
    }

    let target: User
    try {
      target = await this.findUserByNicknameOrFail(payload.nickname)
    } catch {
      return response.notFound({ error: 'User not found' })
    }

    const wasMember = await channel
      .related('members')
      .query()
      .where('users.id', target.id)
      .first()

    await channel.related('members').detach([target.id])
    await channel.related('invitations').detach([target.id])

    if (wasMember) {
      channel.nMembers = Math.max(channel.nMembers - 1, 0)
      await channel.save()
    }

    return { success: true }
  }

  public async kick({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const channel = await Channel.findOrFail(params.id)
    const payload = await request.validateUsing(ChannelNicknameActionValidator)

    if (channel.visibility !== 'public') {
      return response.badRequest({ error: 'Kick votes are only for public channels' })
    }

    const isMember = await channel
      .related('members')
      .query()
      .where('users.id', user.id)
      .first()

    if (!isMember) {
      return response.forbidden({
        error: 'Only channel members can start a kick vote',
      })
    }

    let target: User
    try {
      target = await this.findUserByNicknameOrFail(payload.nickname)
    } catch {
      return response.notFound({ error: 'User not found' })
    }

    if (target.id === user.id) {
      return response.badRequest({ error: 'You cannot kick yourself' })
    }

    if (target.id === channel.adminId) {
      return response.forbidden({ error: 'You cannot kick the channel admin' })
    }

    const targetMember = await channel
      .related('members')
      .query()
      .where('users.id', target.id)
      .first()

    if (!targetMember) {
      return response.badRequest({ error: 'User is not a member of this channel' })
    }

    const banned = await channel
      .related('blacklist')
      .query()
      .where('users.id', target.id)
      .first()

    if (banned) {
      await channel.related('members').detach([target.id])
      await channel.related('invitations').detach([target.id])
      return { success: true, banned: true, votes: 0 }
    }

    let vote = await Kickvote.query()
      .where('user_id', target.id)
      .andWhere('channel_id', channel.id)
      .first()

    if (!vote) {
      vote = await Kickvote.create({
        userId: target.id,
        creatorId: user.id,
        channelId: channel.id,
        nVotes: 1,
      })
      await vote.related('voters').attach([user.id])
    } else {
      const alreadyVoted = await vote
        .related('voters')
        .query()
        .where('users.id', user.id)
        .first()

      if (alreadyVoted) {
        return response.badRequest({ error: 'You have already voted to kick this user' })
      }

      vote.nVotes = vote.nVotes + 1
      await vote.save()
      await vote.related('voters').attach([user.id])
    }

    if (vote.nVotes >= 3) {
      await channel.related('blacklist').attach([target.id])
      await channel.related('members').detach([target.id])
      await channel.related('invitations').detach([target.id])

      await vote.related('voters').detach()
      await vote.delete()

      channel.nMembers = Math.max(channel.nMembers - 1, 0)
      await channel.save()

      return { success: true, banned: true, votes: 3 }
    }

    return { success: true, banned: false, votes: vote.nVotes }
  }

  public async ban({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const channel = await Channel.findOrFail(params.id)
    const payload = await request.validateUsing(ChannelNicknameActionValidator)

    if (channel.adminId !== user.id) {
      return response.forbidden({
        error: 'Only channel admin can ban users',
      })
    }

    let target: User
    try {
      target = await this.findUserByNicknameOrFail(payload.nickname)
    } catch {
      return response.notFound({ error: 'User not found' })
    }

    const alreadyBanned = await channel
      .related('blacklist')
      .query()
      .where('users.id', target.id)
      .first()

    if (!alreadyBanned) {
      await channel.related('blacklist').attach([target.id])
    }

    const wasMember = await channel
      .related('members')
      .query()
      .where('users.id', target.id)
      .first()

    await channel.related('members').detach([target.id])
    await channel.related('invitations').detach([target.id])

    if (wasMember) {
      channel.nMembers = Math.max(channel.nMembers - 1, 0)
      await channel.save()
    }

    await Kickvote.query()
      .where('user_id', target.id)
      .andWhere('channel_id', channel.id)
      .delete()

    return { success: true }
  }

  public async unban({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const channel = await Channel.findOrFail(params.id)
    const payload = await request.validateUsing(ChannelNicknameActionValidator)

    if (channel.adminId !== user.id) {
      return response.forbidden({
        error: 'Only channel admin can unban users',
      })
    }

    let target: User
    try {
      target = await this.findUserByNicknameOrFail(payload.nickname)
    } catch {
      return response.notFound({ error: 'User not found' })
    }

    await channel.related('blacklist').detach([target.id])

    return { success: true }
  }

  public async members({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const channel = await Channel.findOrFail(params.id)

    const isMember = await channel
      .related('members')
      .query()
      .where('users.id', user.id)
      .first()

    if (!isMember && channel.adminId !== user.id) {
      return response.forbidden({
        error: 'You are not a member of this channel',
      })
    }

    const members = await channel
      .related('members')
      .query()
      .orderBy('users.nickname', 'asc')

    return members.map((m) => ({
      id: m.id,
      nickname: m.nickname,
      firstName: m.firstName,
      lastName: m.lastName,
      avatarUrl: m.avatarUrl,
      status: m.status,
      isAdmin: m.id === channel.adminId,
    }))
  }
}
