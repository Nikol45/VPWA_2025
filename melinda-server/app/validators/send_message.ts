import vine from '@vinejs/vine'

export const SendMessageValidator = vine.compile(
  vine.object({
    text: vine.string().trim().minLength(1).maxLength(500),
  })
)
