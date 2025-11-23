import { api } from 'src/boot/axios'
import type { Message as ApiMessage } from 'src/contracts'

export interface ListMessageParams {
  before?: string | null
  limit?: number
}

class MessageService {
  async list(
    channelId: number,
    params?: ListMessageParams
  ): Promise<ApiMessage[]> {
    const query: Record<string, string | number> = {}

    if (params?.before != null) {
      query.before = params.before
    }
    if (params?.limit != null) {
      query.limit = params.limit
    }

    const response = await api.get<ApiMessage[]>(
      `channels/${channelId}/messages`,
      { params: query }
    )

    return response.data
  }

  async create(channelId: number, text: string): Promise<ApiMessage> {
    const response = await api.post<ApiMessage>(
      `channels/${channelId}/messages`,
      { text }
    )
    return response.data
  }
}

export default new MessageService()
