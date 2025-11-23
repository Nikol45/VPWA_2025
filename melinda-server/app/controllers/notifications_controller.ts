import type { HttpContext } from '@adonisjs/core/http'
import Notification from '#models/notification'

export default class NotificationsController {
  public async index({ auth }: HttpContext) {
    const user = auth.user!

    const notifications = await Notification.query()
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')
      .limit(100)

    return notifications.map((n) => n.serialize())
  }
}
