import vine from '@vinejs/vine'

export const UpdateStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(['online', 'dnd', 'offline'] as const),
  })
)
