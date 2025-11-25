import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class KickvoteVoterSeeder extends BaseSeeder {
  async run() {
    await db.insertQuery().table('kickvote_voters').insert([
      // Juraj (diktator, user_id = 13) hlasuje za kick Burina (kickvote_id = 1)
      { kickvote_id: 1, user_id: 13 },
      // Tomáš Zenka (zuzenka, user_id = 12) hlasuje za kick Burina (kickvote_id = 1)
      { kickvote_id: 1, user_id: 12 },
    ])
  }
}
