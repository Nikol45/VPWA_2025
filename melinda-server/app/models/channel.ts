import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Message from '#models/message'
import Kickvote from '#models/kickvote'

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare iconUrl: string

  @column()
  declare visibility: 'public' | 'private'

  @column()
  declare nMembers: number

  @column()
  declare adminId: number

  @belongsTo(() => User, {
    foreignKey: 'adminId',
  })
  declare admin: BelongsTo<typeof User>

  @hasMany(() => Message, {
    foreignKey: 'channelId',
  })
  declare messages: HasMany<typeof Message>

  @hasMany(() => Kickvote, {
    foreignKey: 'channelId',
  })
  declare kickVotes: HasMany<typeof Kickvote>

  @manyToMany(() => User, {
    pivotTable: 'channel_users',
    pivotForeignKey: 'channel_id',
    pivotRelatedForeignKey: 'user_id',
    pivotTimestamps: true,
  })
  declare members: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'channel_invitations',
    pivotForeignKey: 'channel_id',
    pivotRelatedForeignKey: 'user_id',
    pivotTimestamps: true,
  })
  declare invitations: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'channel_bans',
    pivotForeignKey: 'channel_id',
    pivotRelatedForeignKey: 'user_id',
    pivotTimestamps: true,
  })
  declare blacklist: ManyToMany<typeof User>

  @column()
  declare inviteCode: string

  @column.dateTime()
  declare lastMessageAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
