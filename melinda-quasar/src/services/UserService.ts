import { api } from 'src/boot/axios'
import type { User } from 'src/contracts'

interface UpdateProfilePayload {
  nickname: string
  firstName: string
  lastName: string
  email: string
}

class UserService {
  async updateStatus(status: User['status']): Promise<User> {
    const response = await api.patch<User>('me/status', { status })
    return response.data
  }

  async updateNotificationSetting(
    notificationSetting: User['notificationSetting']
  ): Promise<User> {
    const response = await api.patch<User>('me/notifications', { notificationSetting })
    return response.data
  }

  async updateTheme(theme: User['theme']): Promise<User> {
    const response = await api.patch<User>('me/theme', { theme })
    return response.data
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const response = await api.patch<User>('me/profile', payload)
    return response.data
  }
}

export default new UserService()
