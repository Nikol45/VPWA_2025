import { api } from 'src/boot/axios'
import type { Notification } from 'src/contracts'

class NotificationService {
  async list(): Promise<Notification[]> {
    const response = await api.get<Notification[]>('notifications')
    return response.data
  }
}

export default new NotificationService()
