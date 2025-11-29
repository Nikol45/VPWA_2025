import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Message from '#models/message'
import Channel from '#models/channel'

export default class MessagesController {
    public async index({ auth, params, request, response }: HttpContext) {
        const user = auth.user!
        const channel = await Channel.findOrFail(params.id)

        const isMember = await channel
            .related('members')
            .query()
            .where('users.id', user.id)
            .first()

        if (!isMember) {
            return response.forbidden({ error: 'You are not a member of this channel' })
        }

        const before = request.input('before') as string | undefined
        const limit = Number(request.input('limit') ?? 20)

        const query = Message.query()
            .where('channel_id', channel.id)
            .orderBy('created_at', 'desc')
            .preload('user')

        if (before) {
            const beforeDate = DateTime.fromISO(before)
            if (beforeDate.isValid) {
                query.where('created_at', '<', beforeDate.toSQL())
            }
        }

        const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 20
        const messages = await query.limit(safeLimit)

        return messages.map((m) => m.serialize())
    }
}
