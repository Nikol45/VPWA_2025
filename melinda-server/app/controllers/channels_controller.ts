import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import app from '@adonisjs/core/services/app'
import Channel from '#models/channel'
import Message from '#models/message'
import Kickvote from '#models/kickvote'
import User from '#models/user'
import { CreateChannelValidator } from '#validators/create_channel'
import { JoinChannelValidator } from '#validators/join_channel'
import { ChannelNicknameActionValidator } from '#validators/channel_nickname_action'
import { emitToUser, emitChannelDeleted, emitMemberCountUpdate } from '#services/ws_events'

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

    for (const channel of inactive) {
      await this.cleanupAndDeleteChannel(channel)
    }
  }

  private async cleanupAndDeleteChannel(channel: Channel) {
    const members = await channel.related('members').query()
    for (const member of members) {
        await emitToUser(member.id, 'channel:deleted', { 
            channelId: channel.id,
            channelName: channel.name
        })
    }
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

  public async store({ auth, request, response }: HttpContext) {
    const user = auth.user!
    
    const payload = await request.validateUsing(CreateChannelValidator)

    const iconImage = request.file('icon')
    let iconUrl = '/avatars/channels/default_channel.jpg'

    if (iconImage) {
        if (!iconImage.isValid) {
            return response.badRequest({ error: 'Invalid image file' })
        }

        const fileName = `${new Date().getTime()}_${iconImage.clientName}`
        
        await iconImage.move(app.makePath('public/avatars/channels'), {
            name: fileName
        })

        iconUrl = `/avatars/channels/${fileName}`
    }

    const channel = await Channel.create({
      name: payload.name,
      iconUrl: iconUrl,
      visibility: payload.visibility,
      nMembers: 1,
      adminId: user.id,
      inviteCode: Math.random().toString(36).substring(2, 10),
      lastMessageAt: DateTime.now(),
    })

    await channel.related('members').attach([user.id])

    const serialized = channel.serialize() as any

    return {
      ...serialized,
      isMember: true,
      isInvited: false,
      isAdmin: true,
    }
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

      const serialized = channel.serialize()

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
      const serialized = channel.serialize()
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
      await channel.related('invitations').detach([user.id])
    }

      await channel.related('members').attach([user.id])
      channel.nMembers = channel.nMembers + 1
      await channel.save()
      await emitMemberCountUpdate(channel.id, channel.nMembers)

      const serialized = channel.serialize()

      return {
        ...serialized,
        isMember: true,
        isInvited: false,
        isAdmin: channel.adminId === user.id,
      } as ChannelResponse
  }

  public async decline({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const channel = await Channel.findOrFail(params.id)

    const invitation = await channel
      .related('invitations')
      .query()
      .where('users.id', user.id)
      .first()

    if (!invitation) {
      return response.notFound({ error: 'Invitation not found' })
    }

    await channel.related('invitations').detach([user.id])

    return { success: true }
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

    await emitMemberCountUpdate(channel.id, channel.nMembers)

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

    if (channel.visibility === 'private' && channel.adminId !== user.id) {
      return response.forbidden({ error: 'Only channel admin can invite to a private channel' })
    }

    if (channel.visibility !== 'private') {
        const isMember = await channel.related('members').query().where('users.id', user.id).first()
        if (!isMember) return response.forbidden({ error: 'Only members can invite' })
    }

    let target: User
    try {
      target = await this.findUserByNicknameOrFail(payload.nickname)
    } catch {
      return response.notFound({ error: 'User not found' })
    }

    const banned = await channel.related('blacklist').query().where('users.id', target.id).first()
    if (banned) {
        if (channel.adminId === user.id) {
            await channel.related('blacklist').detach([target.id])
        } else {
            return response.forbidden({ error: 'User is banned. Only admin can restore access.' })
        }
    }

    const isMember = await channel.related('members').query().where('users.id', target.id).first()
    if (isMember) return { success: true, invited: false, message: 'User is already a member' }

    const alreadyInvited = await channel.related('invitations').query().where('users.id', target.id).first()
    if (!alreadyInvited) {
      await channel.related('invitations').attach([target.id])
      
      await emitToUser(target.id, 'channel:invite', { 
          channelId: channel.id,
          channelName: channel.name 
      })
    }

    return { success: true, invited: true }
  }

  public async revoke({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const channel = await Channel.findOrFail(params.id)
    if (channel.visibility !== 'private') return response.badRequest({ error: 'Revoke is only for private channels' })
    if (channel.adminId !== user.id) return response.forbidden({ error: 'Only admin can revoke' })

    const payload = await request.validateUsing(ChannelNicknameActionValidator)
    const target = await this.findUserByNicknameOrFail(payload.nickname)

    await channel.related('members').detach([target.id])
    await channel.related('invitations').detach([target.id])

    channel.nMembers = Math.max(channel.nMembers - 1, 0)
    await channel.save()

    await emitMemberCountUpdate(channel.id, channel.nMembers)
    await emitToUser(target.id, 'channel:kick', { channelId: channel.id, channelName: channel.name })

    return { success: true }
  }

  public async kick({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const channel = await Channel.findOrFail(params.id)
    const payload = await request.validateUsing(ChannelNicknameActionValidator)

    const isMember = await channel.related('members').query().where('users.id', user.id).first()
    if (!isMember) return response.forbidden({ error: 'Only members can use kick' })

    let target: User
    try {
      target = await this.findUserByNicknameOrFail(payload.nickname)
    } catch {
      return response.notFound({ error: 'User not found' })
    }

    if (target.id === user.id) return response.badRequest({ error: 'You cannot kick yourself' })
    if (target.id === channel.adminId) return response.forbidden({ error: 'You cannot kick the admin' })

    if (channel.adminId === user.id) {
        await channel.related('blacklist').attach([target.id])
        await channel.related('members').detach([target.id])
        await channel.related('invitations').detach([target.id])
        
        await Kickvote.query().where('user_id', target.id).andWhere('channel_id', channel.id).delete()

        channel.nMembers = Math.max(channel.nMembers - 1, 0)
        await channel.save()

        await emitMemberCountUpdate(channel.id, channel.nMembers)
        await emitToUser(target.id, 'channel:kick', { channelId: channel.id, channelName: channel.name })

        return { success: true, banned: true, votes: 0, message: 'User banned by admin' }
    } else {
        if (channel.visibility === 'private') {
            return response.forbidden({ error: 'Only admin can kick in private channels' })
        }

        let vote = await Kickvote.query().where('user_id', target.id).andWhere('channel_id', channel.id).first()

        if (!vote) {
            vote = await Kickvote.create({ userId: target.id, creatorId: user.id, channelId: channel.id, nVotes: 1 })
            await vote.related('voters').attach([user.id])
        } else {
            const alreadyVoted = await vote.related('voters').query().where('users.id', user.id).first()
            if (alreadyVoted) return response.badRequest({ error: 'You already voted' })

            vote.nVotes++
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

            await emitMemberCountUpdate(channel.id, channel.nMembers)
            await emitToUser(target.id, 'channel:kick', { channelId: channel.id, channelName: channel.name })
            return { success: true, banned: true, votes: 3, message: 'Vote passed. User banned.' }
        }

        return { success: true, banned: false, votes: vote.nVotes, message: `Vote added (${vote.nVotes}/3)` }
    }
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
      await emitMemberCountUpdate(channel.id, channel.nMembers)
      await emitToUser(target.id, 'channel:kick', { 
          channelId: channel.id, 
          channelName: channel.name 
      })
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
