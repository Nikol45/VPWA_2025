import { getIO } from '#start/ws'

export async function emitToChannel(channelId: number, event: string, payload: any) {
  const io = await getIO()
  io.to(`channel:${channelId}`).emit(event, payload)
}

export async function emitToAll(event: string, payload: any) {
  const io = await getIO()
  io.emit(event, payload)
}

export async function emitToUser(userId: number, event: string, payload: any) {
  const io = await getIO()
  io.to(`user:${userId}`).emit(event, payload)
}

export async function emitChannelDeleted(channelId: number) {
    await emitToChannel(channelId, 'channel:deleted', { channelId })
}

export async function emitMemberCountUpdate(channelId: number, count: number) {
    const io = await getIO()
  io.emit('channel:update_member_count', { channelId, count })
}
