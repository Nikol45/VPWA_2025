import { Socket } from 'socket.io'
import { getIO } from '#start/socket'
import User from '#models/user'



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


export async function emitNotification(userId: number, notification: any) {
    const io = await getIO()
    io.to(`user:${userId}`).emit('notification:new', notification)
}


export async function emitChannelDeleted(channelId: number, channelName: string) {
    await emitToChannel(channelId, 'channel:deleted', { channelId, channelName })
}


export async function emitMemberCountUpdate(channelId: number, count: number) {
    const io = await getIO()
    io.emit('channel:update_member_count', { channelId, count })
}





export function registerSocketEvents(socket: Socket) {
    const user = socket.data.user as User


    socket.on('channel:join', ({ channelId }) => {

        socket.join(`channel:${channelId}`)


        socket.to(`channel:${channelId}`).emit('channel:user_joined', {
            channelId,
            user: {
                id: user.id,
                nickname: user.nickname,
                avatarUrl: user.avatarUrl,
                status: user.status
            }
        })
    })


    socket.on('channel:leave', ({ channelId }) => {
        socket.leave(`channel:${channelId}`)

        socket.to(`channel:${channelId}`).emit('channel:user_left', {
            channelId,
            userId: user.id
        })
    })



    socket.on('typing:update', ({ channelId, isTyping, text }) => {

        socket.to(`channel:${channelId}`).emit('typing:state', {
            channelId,
            userId: user.id,
            nickname: user.nickname,
            isTyping,
            text: isTyping ? text : ''
        })
    })
}
