import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Channels extends BaseSchema {
  protected tableName = 'channels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 50).notNullable().unique()
      table.string('icon_url', 2048).notNullable().defaultTo('/avatars/channels/default_channel.png')
      table.enum('visibility', ['public', 'private']).notNullable().defaultTo('public')
      table.integer('n_members').notNullable().defaultTo(0)
      table.integer('admin_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('invite_code', 8).notNullable().unique()
      table.timestamp('last_message_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
