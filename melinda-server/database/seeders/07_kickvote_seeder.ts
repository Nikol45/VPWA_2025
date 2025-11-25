import { BaseSeeder } from '@adonisjs/lucid/seeders'
import KickVote from '#models/kickvote'

export default class KickvoteSeeder extends BaseSeeder {
  async run() {
    await KickVote.createMany([
      {
        nVotes: 2,
        // Cieľ: Filip Burin (businessman, user_id = 7)
        userId: 7,
        // Autor kickvote: Juraj Flamik (diktator, user_id = 13)
        creatorId: 13,
        // Kanál: Slováci na Mladosti (channel_id = 1)
        channelId: 1,
      },
    ])
  }
}
