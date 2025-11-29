import type { HttpContext } from '@adonisjs/core/http'
import Notification from '#models/notification'

export default class NotificationsController {
    public async index({ auth }: HttpContext) {
        const user = auth.user!

        const notifications = await Notification.query()
            .where('userId', user.id)
            .preload('sender', (q) => q.select('id', 'nickname', 'avatarUrl'))
            .preload('channel', (q) => q.select('id', 'name'))
            .orderBy('createdAt', 'desc')
            .limit(50)

        return notifications.map((n) => n.serialize())
    }
}
