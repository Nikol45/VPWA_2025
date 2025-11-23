import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('first_name', 50).notNullable()
      table.string('last_name', 50).notNullable()
      table.string('nickname', 50).notNullable().unique()
      table.string('email', 255).notNullable()
      table.string('password', 255).notNullable()
      table
        .enum('theme', ['lilac', 'midnight', 'pink_chocolate', 'forest'])
        .notNullable()
        .defaultTo('lilac')
      table.string('avatar_url', 2048).notNullable().defaultTo('/avatars/users/default.png')
      table.enum('status', ['online', 'dnd', 'offline']).notNullable().defaultTo('offline')
      table
        .enum('notification_setting', ['show_all', 'mentions_only', 'mute_all'])
        .notNullable()
        .defaultTo('show_all')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
