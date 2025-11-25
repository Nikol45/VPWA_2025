import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class ChannelInvitationSeeder extends BaseSeeder {
  async run() {
    await db.insertQuery().table('channel_invitations').insert([
      // Nikol (nikol45) pozvala Alžbetu (betka) do kanála „Ženy na FIIT“
      {
        channel_id: 4, // Ženy na FIIT
        user_id: 5,    // Alžbeta
      },
    ])
  }
}
