import { BaseSeeder } from '@adonisjs/lucid/seeders'
import KickVote from '#models/kickvote'

export default class KickvoteSeeder extends BaseSeeder {
  async run() {
    await KickVote.createMany([
      {
        nVotes: 2,
        userId: 5,
        creatorId: 1,
        channelId: 1,
      },
    ])
  }
}