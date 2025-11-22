import { api } from 'src/boot/axios'
import type { Channel, ChannelVisibility, ChannelMember } from 'src/contracts'

class ChannelService {
  async list(): Promise<Channel[]> {
    const response = await api.get<Channel[]>('channels')
    return response.data
  }

  async create(payload: { name: string; visibility: ChannelVisibility; iconUrl?: string }): Promise<Channel> {
    const response = await api.post<Channel>('channels', payload)
    return response.data
  }

  async joinByName(payload: { name: string; visibility?: ChannelVisibility }): Promise<Channel> {
    const response = await api.post<Channel>('channels/join', payload)
    return response.data
  }

  async leave(id: number): Promise<void> {
    await api.post(`channels/${id}/leave`)
  }

  async destroy(id: number): Promise<void> {
    await api.delete(`channels/${id}`)
  }

  async invite(channelId: number, payload: { nickname: string }): Promise<void> {
    await api.post(`channels/${channelId}/invite`, payload)
  }

  async revoke(channelId: number, nickname: string): Promise<void> {
    await api.post(`channels/${channelId}/revoke`, { nickname })
  }

  async kick(channelId: number, nickname: string): Promise<void> {
    await api.post(`channels/${channelId}/kick`, { nickname })
  }

  async ban(channelId: number, nickname: string): Promise<void> {
    await api.post(`channels/${channelId}/ban`, { nickname })
  }

  async unban(channelId: number, nickname: string): Promise<void> {
    await api.post(`channels/${channelId}/unban`, { nickname })
  }

  async listMembers(channelId: number): Promise<ChannelMember[]> {
    const response = await api.get<ChannelMember[]>(`channels/${channelId}/members`)
    return response.data
  }
}

export default new ChannelService()
