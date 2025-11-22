import vine from '@vinejs/vine'

export const TypingStateValidator = vine.compile(
  vine.object({
    isTyping: vine.boolean(),
    text: vine.string().optional(),
  })
)
