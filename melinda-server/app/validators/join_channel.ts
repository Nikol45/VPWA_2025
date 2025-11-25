import vine from '@vinejs/vine'

export const JoinChannelValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    visibility: vine.enum(['public', 'private'] as const).optional(),
  })
)
