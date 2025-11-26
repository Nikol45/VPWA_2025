import type { HttpContext } from '@adonisjs/core/http'
import { UpdateStatusValidator } from '#validators/update_status'
import { UpdateThemeValidator } from '#validators/update_theme'
import { UpdateProfileValidator } from '#validators/update_profile'
import vine from '@vinejs/vine'

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
        
        const schema = vine.compile(
            vine.object({
                setting: vine.enum(['show_all', 'mentions_only', 'mute_all'])
            })
        )
        const payload = await request.validateUsing(schema)

        user.notificationSetting = payload.setting as any
        await user.save()

        return { notificationSetting: user.notificationSetting }
    }

  public async updateTheme({ auth, request }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(UpdateThemeValidator)

    user.theme = payload.theme
    await user.save()

    return user
  }

  public async updateProfile({ auth, request }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(UpdateProfileValidator)

    user.nickname = payload.nickname
    user.firstName = payload.firstName
    user.lastName = payload.lastName
    user.email = payload.email

    await user.save()

    return user
  }
}
