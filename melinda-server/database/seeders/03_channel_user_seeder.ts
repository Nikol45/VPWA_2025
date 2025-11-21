import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class ChannelUserSeeder extends BaseSeeder {
  async run() {
    await db.insertQuery().table('channel_users').insert([
      { channel_id: 1, user_id: 1 },
      { channel_id: 1, user_id: 2 },
      { channel_id: 1, user_id: 3 },
      { channel_id: 1, user_id: 4 },
      { channel_id: 1, user_id: 5 },
      { channel_id: 1, user_id: 6 },

      { channel_id: 2, user_id: 1 },
      { channel_id: 2, user_id: 2 },
      { channel_id: 2, user_id: 4 },

      { channel_id: 3, user_id: 1 },
      { channel_id: 3, user_id: 2 },
      { channel_id: 3, user_id: 3 },
      { channel_id: 3, user_id: 4 },
      { channel_id: 3, user_id: 6 },

      { channel_id: 4, user_id: 1 },
      { channel_id: 4, user_id: 2 },
      { channel_id: 4, user_id: 4 },
      { channel_id: 4, user_id: 5 },

      { channel_id: 5, user_id: 2 },
      { channel_id: 5, user_id: 1 },

      { channel_id: 6, user_id: 1 },
      { channel_id: 6, user_id: 3 },

      { channel_id: 7, user_id: 2 },
      { channel_id: 7, user_id: 6 },

      { channel_id: 8, user_id: 1 },
      { channel_id: 8, user_id: 3 },
      { channel_id: 8, user_id: 2 },
      { channel_id: 8, user_id: 6 },

    ])
  }
}