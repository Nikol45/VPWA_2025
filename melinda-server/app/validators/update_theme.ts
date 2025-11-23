import vine from '@vinejs/vine'

export const UpdateThemeValidator = vine.compile(
  vine.object({
    theme: vine.enum(['lilac', 'midnight', 'pink_chocolate', 'forest'] as const),
  })
)
