import vine from '@vinejs/vine'

export const UpdateThemeValidator = vine.compile(
  vine.object({
    theme: vine.enum(['lilac', 'midnight', 'chocolate', 'forest', 'rose'] as const),
  })
)
