import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class ChannelBanSeeder extends BaseSeeder {
  async run() {
    await db.insertQuery().table('channel_bans').insert([
      { channel_id: 1, user_id: 5 },
    ])
  }
}