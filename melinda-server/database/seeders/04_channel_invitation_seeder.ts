import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class ChannelInvitationSeeder extends BaseSeeder {
  async run() {
    await db.insertQuery().table('channel_invitations').insert([
      { channel_id: 8, user_id: 5 },
    ])
  }
}