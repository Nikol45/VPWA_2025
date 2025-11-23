import type { HttpContext } from '@adonisjs/core/http'
import { UpdateStatusValidator } from '#validators/update_status'
import { UpdateNotificationSettingValidator } from '#validators/update_notification_setting'

export default class UsersController {
  public async updateStatus({ auth, request }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(UpdateStatusValidator)

    user.status = payload.status
    await user.save()

    return user
  }

  public async updateNotificationSetting({ auth, request }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(UpdateNotificationSettingValidator)

    user.notificationSetting = payload.notificationSetting
    await user.save()

    return user
  }
}
