import { api } from 'src/boot/axios'
import type { User } from 'src/contracts'

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
}

export default new UserService()
