import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { RegisterUserValidator } from '#validators/register_user'

export default class AuthController {
  async register({ request }: HttpContext) {
    const data = await request.validateUsing(RegisterUserValidator)

    const avatar = request.file('avatar', {
      extnames: ['jpg', 'png', 'jpeg', 'webp'],
      size: '5mb',
    })

    let avatarUrl = '/avatars/users/default.png'

    if (avatar) {
      await avatar.move('public/avatars/users', {
        name: `${Date.now()}_${avatar.clientName}`,
        overwrite: true,
      })

      avatarUrl = `/avatars/users/${avatar.fileName}`
    }

    const {
        firstName,
        lastName,
        nickname,
        email,
        password,
    } = data

    const user = await User.create({
        firstName,
        lastName,
        nickname,
        email,
        password,
        avatarUrl,
    })

    return user
  }

  async login({ auth, request }: HttpContext) {
    const nickname = request.input('nickname')
    const password = request.input('password')
    const user = await User.findByOrFail('nickname', nickname)
    const isValid = await user.verifyPassword(password)
    if (!isValid) {
      return { error: 'Invalid credentials' }
    }
    const token = await auth.use('api').createToken(user)
    return {
      type: token.type,
      token: token.value!.release(),
      expires_at: token.expiresAt,
      user,
    }
  }

  async logout({ auth }: HttpContext) {
    await auth.use('api').authenticate()
    return auth.use('api').invalidateToken()
  }

  async me({ auth }: HttpContext) {
    await auth.user!.load('channels')
    return auth.user
  }
}