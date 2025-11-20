import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class KickvoteVoterSeeder extends BaseSeeder {
  async run() {
    await db.insertQuery().table('kickvote_voters').insert([
      { kickvote_id: 1, user_id: 1 },
      { kickvote_id: 1, user_id: 2 },
    ])
  }
}