import { api } from 'src/boot/axios'
import type { TypingState } from 'src/contracts'

class TypingService {
  async setTyping(channelId: number, isTyping: boolean, text?: string): Promise<void> {
    await api.post(`channels/${channelId}/typing`, { isTyping, text })
  }

  async listTyping(channelId: number): Promise<TypingState[]> {
    const response = await api.get<TypingState[]>(`channels/${channelId}/typing`)
    return response.data
  }
}

export default new TypingService()
