import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class ChannelBanSeeder extends BaseSeeder {
  async run() {
    await db.insertQuery().table('channel_bans').insert([
      // Nikol kicked Žofka from "Ženy na FIIT"
      { channel_id: 4, user_id: 19 },
    ])
  }
}
