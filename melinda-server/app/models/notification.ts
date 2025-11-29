import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Channel from '#models/channel'

export default class Notification extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare userId: number

    @belongsTo(() => User, {
        foreignKey: 'userId',
    })
    declare user: BelongsTo<typeof User>

    @column()
    declare channelId: number | null

    @belongsTo(() => Channel, {
        foreignKey: 'channelId',
    })
    declare channel: BelongsTo<typeof Channel>

    @column()
    declare senderId: number | null

    @belongsTo(() => User, {
        foreignKey: 'senderId',
    })
    declare sender: BelongsTo<typeof User>

    @column()
    declare isRead: boolean

    @column()
    declare type: string

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime
}
