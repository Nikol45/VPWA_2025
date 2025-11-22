import vine from '@vinejs/vine'

export const RegisterUserValidator = vine.compile(
  vine.object({
    nickname: vine.string().trim().maxLength(50).unique({ table: 'users', column: 'nickname' }),
    firstName: vine.string().trim().maxLength(50),
    lastName: vine.string().trim().maxLength(50),
    email: vine.string().email().trim().maxLength(255),
    password: vine.string().minLength(6).confirmed().trim().maxLength(255),
    password_confirmation: vine.string(),
    avatar: vine.file({
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    }).optional(),
  })
)
