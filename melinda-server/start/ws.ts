import app from '@adonisjs/core/services/app'
import type { Server } from 'socket.io'

export async function getIO(): Promise<Server> {
  const io = await app.container.make('ws')
  return io as Server
}
