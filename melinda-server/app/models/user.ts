import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Channel from '#models/channel'
import Message from '#models/message'
import Kickvote from '#models/kickvote'
import Notification from '#models/notification'


const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['nickname'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @hasMany(() => Message, {
    foreignKey: 'userId',
  })
  declare messages: HasMany<typeof Message>

  @manyToMany(() => Channel, {
    pivotTable: 'channel_users',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'channel_id',
    pivotTimestamps: true,
  })
  declare channels: ManyToMany<typeof Channel>

  @manyToMany(() => Channel, {
    pivotTable: 'channel_invitations',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'channel_id',
    pivotTimestamps: true,
  })
  declare invitations: ManyToMany<typeof Channel>

  @manyToMany(() => Channel, {
    pivotTable: 'channel_bans',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'channel_id',
    pivotTimestamps: true,
  })
  declare blacklist: ManyToMany<typeof Channel>

  @hasMany(() => Kickvote, {
    foreignKey: 'creatorId',
  })
  declare createdKickvotes: HasMany<typeof Kickvote>

  @manyToMany(() => Kickvote, {
    pivotTable: 'kickvote_voters',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'kickvote_id',
    pivotTimestamps: true,
  })
  declare votedKickvotes: ManyToMany<typeof Kickvote>

  @hasMany(() => Notification, {
    foreignKey: 'userId',
  })
  declare notifications: HasMany<typeof Notification>

  @hasMany(() => Channel, {
    foreignKey: 'adminId',
  })
  declare adminChannels: HasMany<typeof Channel>

  @hasMany(() => Kickvote, {
    foreignKey: 'userId',
  })
  declare kickvotesAboutUser: HasMany<typeof Kickvote>

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare nickname: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare theme: 'lilac' | 'midnight' | 'pink_chocolate' | 'forest'

  @column()
  declare avatarUrl: string

  @column()
  declare status: 'online' | 'dnd' | 'offline'

  @column()
  declare notificationSetting: 'show_all' | 'mentions_only' | 'mute_all'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)
}