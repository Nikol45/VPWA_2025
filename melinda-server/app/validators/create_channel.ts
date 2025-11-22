import vine from '@vinejs/vine'

export const CreateChannelValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    visibility: vine.enum(['public', 'private'] as const),
    iconUrl: vine.string().trim().optional(),
    inviteCode: vine.string().trim().optional(),
  })
)
