import vine from '@vinejs/vine'

export const ChannelNicknameActionValidator = vine.compile(
  vine.object({
    nickname: vine.string().trim().minLength(1),
  })
)
