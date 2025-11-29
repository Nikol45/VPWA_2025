import app from '@adonisjs/core/services/app'
import { Server } from 'socket.io'
import User from '#models/user'
import { registerSocketEvents } from '#services/ws_events'

let io: Server

export async function getIO(): Promise<Server> {
    if (io) return io
    io = await app.container.make('ws')
    return io
}

app.ready(async () => {
    io = await getIO()

    io.on('connection', async (socket) => {
        const userId = socket.handshake.auth.userId
        const token = socket.handshake.auth.token

        if (!userId && !token) {
            socket.disconnect()
            return
        }

        let user: User | null = null
        if (userId) {
            user = await User.find(userId)
        }

        if (!user) {
            socket.disconnect()
            return
        }


        socket.data.user = user
        socket.join(`user:${user.id}`)

        registerSocketEvents(socket)
    })
})
