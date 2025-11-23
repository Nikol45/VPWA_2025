import vine from '@vinejs/vine'

export const UpdateNotificationSettingValidator = vine.compile(
  vine.object({
    notificationSetting: vine.enum(['show_all', 'mentions_only', 'mute_all'] as const),
  })
)
