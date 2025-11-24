import { getIO } from '#start/ws'

export async function emitToChannel(channelId: number, event: string, payload: any) {
  const io = await getIO()
  io.to(`channel:${channelId}`).emit(event, payload)
}

export async function emitToAll(event: string, payload: any) {
  const io = await getIO()
  io.emit(event, payload)
}
