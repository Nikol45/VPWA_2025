import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Notifications extends BaseSchema {
    protected tableName = 'notifications'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table.integer('user_id')
                .notNullable()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE')

            // Povolené NULL, aby notifikácia prežila zmazanie kanála
            table.integer('channel_id')
                .nullable()
                .references('id')
                .inTable('channels')
                .onDelete('SET NULL')

            table.integer('sender_id')
                .nullable()
                .references('id')
                .inTable('users')
                .onDelete('SET NULL')

            table.boolean('is_read')
                .notNullable()
                .defaultTo(false)

            table.string('type')
                .notNullable()

            table.timestamp('created_at', { useTz: true })
                .defaultTo(this.now())

            table.timestamp('updated_at', { useTz: true })
                .defaultTo(this.now())
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
