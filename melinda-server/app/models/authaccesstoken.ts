import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AuthAccessToken extends BaseModel {
  public static table = 'auth_access_tokens'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tokenableId: number

  @column()
  declare type: string

  @column()
  declare name: string | null

  @column()
  declare hash: string

  @column()
  declare abilities: string
}
