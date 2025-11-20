import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Kickvotes extends BaseSchema {
  protected tableName = 'kickvotes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('n_votes').notNullable().defaultTo(0)
      table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('creator_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('channel_id').notNullable().references('id').inTable('channels').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}