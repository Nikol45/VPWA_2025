import vine from '@vinejs/vine'

export const UpdateProfileValidator = vine.compile(
  vine.object({
    nickname: vine.string().trim().minLength(3),
    firstName: vine.string().trim().minLength(1),
    lastName: vine.string().trim().minLength(1),
    email: vine.string().trim().email(),
  })
)
