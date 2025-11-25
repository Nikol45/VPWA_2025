import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class ChannelUserSeeder extends BaseSeeder {
  async run() {
    await db.insertQuery().table('channel_users').insert([
      // 1. Slováci na Mladosti (admin: Svetlana = user_id 2)
      { channel_id: 1, user_id: 1 },  // Nikol
      { channel_id: 1, user_id: 2 },  // Svetlana
      { channel_id: 1, user_id: 4 },  // Simona
      { channel_id: 1, user_id: 7 },  // Filip Burin
      { channel_id: 1, user_id: 8 },  // Šimon
      { channel_id: 1, user_id: 9 },  // Dávid
      { channel_id: 1, user_id: 10 }, // Krištof
      { channel_id: 1, user_id: 11 }, // Richard
      { channel_id: 1, user_id: 12 }, // Tomáš Zenka
      { channel_id: 1, user_id: 13 }, // Juraj

      // 2. Študenti FIIT 3.ročník (admin: Matej Smatana = user_id 14)
      // podmnožina FIIT kanála – tretiaci a hlavne spomenutí ľudia
      { channel_id: 2, user_id: 1 },  // Nikol
      { channel_id: 2, user_id: 2 },  // Svetlana
      { channel_id: 2, user_id: 4 },  // Simona
      { channel_id: 2, user_id: 5 },  // Alžbeta
      { channel_id: 2, user_id: 7 },  // Filip Burin
      { channel_id: 2, user_id: 13 }, // Juraj
      { channel_id: 2, user_id: 14 }, // Matej Smatana (admin)
      { channel_id: 2, user_id: 18 }, // Jakub
      { channel_id: 2, user_id: 20 }, // Maximiliam
      { channel_id: 2, user_id: 21 }, // Martin
      { channel_id: 2, user_id: 23 }, // Matej Herzog
      { channel_id: 2, user_id: 24 }, // Damián
      { channel_id: 2, user_id: 68 },
      { channel_id: 2, user_id: 69 },
      { channel_id: 2, user_id: 70 },
      { channel_id: 2, user_id: 71 },
      { channel_id: 2, user_id: 72 },
      { channel_id: 2, user_id: 73 },
      { channel_id: 2, user_id: 74 },
      { channel_id: 2, user_id: 75 },

      // 3. FIIT (public) – všetci okrem Mareka, Cvirka a Peťa
      // (teda všetci useri 1–24 okrem 3, 6, 17)
      { channel_id: 3, user_id: 1 },  // Nikol
      { channel_id: 3, user_id: 2 },  // Svetlana
      { channel_id: 3, user_id: 4 },  // Simona
      { channel_id: 3, user_id: 5 },  // Alžbeta
      { channel_id: 3, user_id: 7 },  // Filip Burin
      { channel_id: 3, user_id: 8 },  // Šimon
      { channel_id: 3, user_id: 9 },  // Dávid
      { channel_id: 3, user_id: 10 }, // Krištof
      { channel_id: 3, user_id: 11 }, // Richard
      { channel_id: 3, user_id: 12 }, // Tomáš Zenka
      { channel_id: 3, user_id: 13 }, // Juraj
      { channel_id: 3, user_id: 14 }, // Matej Smatana
      { channel_id: 3, user_id: 15 }, // Najlepší Študent (admin)
      { channel_id: 3, user_id: 18 }, // Jakub
      { channel_id: 3, user_id: 19 }, // Žofia
      { channel_id: 3, user_id: 20 }, // Maximiliam
      { channel_id: 3, user_id: 21 }, // Martin
      { channel_id: 3, user_id: 22 }, // Monika (iba FIIT + Bakalárka)
      { channel_id: 3, user_id: 23 }, // Matej Herzog
      { channel_id: 3, user_id: 24 }, // Damián
      { channel_id: 3, user_id: 68 },
      { channel_id: 3, user_id: 69 },
      { channel_id: 3, user_id: 70 },
      { channel_id: 3, user_id: 71 },
      { channel_id: 3, user_id: 72 },
      { channel_id: 3, user_id: 73 },
      { channel_id: 3, user_id: 74 },
      { channel_id: 3, user_id: 75 },
      { channel_id: 3, user_id: 76 },
      { channel_id: 3, user_id: 77 },
      { channel_id: 3, user_id: 78 },
      { channel_id: 3, user_id: 79 },
      { channel_id: 3, user_id: 80 },
      { channel_id: 3, user_id: 81 },
      { channel_id: 3, user_id: 82 },
      { channel_id: 3, user_id: 83 },
      { channel_id: 3, user_id: 84 },
      { channel_id: 3, user_id: 85 },
      { channel_id: 3, user_id: 86 },
      { channel_id: 3, user_id: 87 },
      { channel_id: 3, user_id: 88 },
      { channel_id: 3, user_id: 89 },
      { channel_id: 3, user_id: 90 },
      { channel_id: 3, user_id: 91 },
      { channel_id: 3, user_id: 92 },
      { channel_id: 3, user_id: 93 },
      { channel_id: 3, user_id: 94 },
      { channel_id: 3, user_id: 95 },
      { channel_id: 3, user_id: 96 },
      { channel_id: 3, user_id: 97 },
      { channel_id: 3, user_id: 98 },
      { channel_id: 3, user_id: 99 },
      { channel_id: 3, user_id: 100 },
      { channel_id: 3, user_id: 101 },
      { channel_id: 3, user_id: 102 },
      { channel_id: 3, user_id: 103 },
      { channel_id: 3, user_id: 104 },
      { channel_id: 3, user_id: 105 },
      { channel_id: 3, user_id: 106 },
      { channel_id: 3, user_id: 107 },

      // 4. Ženy na FIIT (admin: Nikol = user_id 1)
      // členky: Nikol, Svetlana, Simča (Žofka je bannuta a Alžbetka ma invite)
      { channel_id: 4, user_id: 1 }, // Nikol
      { channel_id: 4, user_id: 2 }, // Svetlana
      { channel_id: 4, user_id: 4 }, // Simona

      // 5. League of Legends (public, admin: faker = user_id 16)
      // vnútorná skupinka + admin
      { channel_id: 5, user_id: 2 },  // Svetlana
      { channel_id: 5, user_id: 6 },  // Lukáš (cvirko)
      { channel_id: 5, user_id: 8 },  // Šimon
      { channel_id: 5, user_id: 9 },  // Dávid
      { channel_id: 5, user_id: 10 }, // Krištof
      { channel_id: 5, user_id: 11 }, // Richard
      { channel_id: 5, user_id: 16 }, // faker (admin)
      { channel_id: 5, user_id: 17 }, // Marek
      { channel_id: 5, user_id: 25 },
      { channel_id: 5, user_id: 26 },
      { channel_id: 5, user_id: 27 },
      { channel_id: 5, user_id: 28 },
      { channel_id: 5, user_id: 29 },
      { channel_id: 5, user_id: 30 },
      { channel_id: 5, user_id: 31 },
      { channel_id: 5, user_id: 32 },
      { channel_id: 5, user_id: 33 },
      { channel_id: 5, user_id: 34 },
      { channel_id: 5, user_id: 35 },
      { channel_id: 5, user_id: 36 },
      { channel_id: 5, user_id: 37 },
      { channel_id: 5, user_id: 38 },
      { channel_id: 5, user_id: 39 },
      { channel_id: 5, user_id: 40 },
      { channel_id: 5, user_id: 41 },
      { channel_id: 5, user_id: 42 },
      { channel_id: 5, user_id: 43 },
      { channel_id: 5, user_id: 44 },
      { channel_id: 5, user_id: 45 },
      { channel_id: 5, user_id: 46 },
      { channel_id: 5, user_id: 47 },
      { channel_id: 5, user_id: 48 },
      { channel_id: 5, user_id: 49 },
      { channel_id: 5, user_id: 50 },
      { channel_id: 5, user_id: 51 },
      { channel_id: 5, user_id: 52 },
      { channel_id: 5, user_id: 53 },
      { channel_id: 5, user_id: 54 },
      { channel_id: 5, user_id: 55 },
      { channel_id: 5, user_id: 56 },
      { channel_id: 5, user_id: 57 },
      { channel_id: 5, user_id: 58 },
      { channel_id: 5, user_id: 59 },
      { channel_id: 5, user_id: 60 },
      { channel_id: 5, user_id: 61 },
      { channel_id: 5, user_id: 62 },
      { channel_id: 5, user_id: 63 },
      { channel_id: 5, user_id: 64 },
      { channel_id: 5, user_id: 65 },
      { channel_id: 5, user_id: 66 },
      { channel_id: 5, user_id: 68 },
      { channel_id: 5, user_id: 69 },
      { channel_id: 5, user_id: 70 },
      { channel_id: 5, user_id: 71 },
      { channel_id: 5, user_id: 72 },
      { channel_id: 5, user_id: 73 },
      { channel_id: 5, user_id: 74 },
      { channel_id: 5, user_id: 75 },

      // 6. Marvel Rivals (public, admin: Nikol = user_id 1)
      // členovia: Nikol, Peťo, Burin
      { channel_id: 6, user_id: 1 }, // Nikol
      { channel_id: 6, user_id: 3 }, // Peter (svatec)
      { channel_id: 6, user_id: 7 }, // Filip Burin
      { channel_id: 6, user_id: 25 },
      { channel_id: 6, user_id: 26 },
      { channel_id: 6, user_id: 27 },
      { channel_id: 6, user_id: 28 },
      { channel_id: 6, user_id: 29 },
      { channel_id: 6, user_id: 30 },
      { channel_id: 6, user_id: 31 },
      { channel_id: 6, user_id: 32 },
      { channel_id: 6, user_id: 33 },
      { channel_id: 6, user_id: 34 },
      { channel_id: 6, user_id: 35 },
      { channel_id: 6, user_id: 36 },
      { channel_id: 6, user_id: 37 },
      { channel_id: 6, user_id: 38 },
      { channel_id: 6, user_id: 39 },
      { channel_id: 6, user_id: 40 },
      { channel_id: 6, user_id: 41 },
      { channel_id: 6, user_id: 42 },
      { channel_id: 6, user_id: 43 },
      { channel_id: 6, user_id: 44 },
      { channel_id: 6, user_id: 45 },
      { channel_id: 6, user_id: 46 },
      { channel_id: 6, user_id: 47 },
      { channel_id: 6, user_id: 48 },
      { channel_id: 6, user_id: 49 },
      { channel_id: 6, user_id: 50 },
      { channel_id: 6, user_id: 51 },
      { channel_id: 6, user_id: 52 },
      { channel_id: 6, user_id: 53 },
      { channel_id: 6, user_id: 54 },
      { channel_id: 6, user_id: 68 },
      { channel_id: 6, user_id: 69 },
      { channel_id: 6, user_id: 70 },
      { channel_id: 6, user_id: 71 },
      { channel_id: 6, user_id: 72 },
      { channel_id: 6, user_id: 73 },
      { channel_id: 6, user_id: 74 },
      { channel_id: 6, user_id: 75 },
      { channel_id: 6, user_id: 76 },
      { channel_id: 6, user_id: 77 },
      { channel_id: 6, user_id: 78 },
      { channel_id: 6, user_id: 79 },
      { channel_id: 6, user_id: 80 },
      { channel_id: 6, user_id: 81 },
      { channel_id: 6, user_id: 82 },
      { channel_id: 6, user_id: 83 },
      { channel_id: 6, user_id: 84 },
      { channel_id: 6, user_id: 85 },
      { channel_id: 6, user_id: 86 },
      { channel_id: 6, user_id: 87 },

      // 7. Spotify – random ľudia (admin: Jakub = user_id 18)
      // explicitne: Jakub, Alžbetka, Žofka
      { channel_id: 7, user_id: 5 },  // Alžbeta
      { channel_id: 7, user_id: 18 }, // Jakub (admin)
      { channel_id: 7, user_id: 19 }, // Žofia
      { channel_id: 7, user_id: 25 },
      { channel_id: 7, user_id: 26 },
      { channel_id: 7, user_id: 27 },
      { channel_id: 7, user_id: 28 },
      { channel_id: 7, user_id: 29 },
      { channel_id: 7, user_id: 30 },
      { channel_id: 7, user_id: 31 },
      { channel_id: 7, user_id: 32 },
      { channel_id: 7, user_id: 33 },
      { channel_id: 7, user_id: 34 },
      { channel_id: 7, user_id: 68 },
      { channel_id: 7, user_id: 69 },
      { channel_id: 7, user_id: 70 },
      { channel_id: 7, user_id: 71 },
      { channel_id: 7, user_id: 72 },

      // 8. ICP (admin: Jakub = user_id 18)
      // členovia: Nikol, Svetlana, Maximiliam, Jakub, Martin
      { channel_id: 8, user_id: 1 },  // Nikol
      { channel_id: 8, user_id: 2 },  // Svetlana
      { channel_id: 8, user_id: 18 }, // Jakub (admin)
      { channel_id: 8, user_id: 20 }, // Maximiliam
      { channel_id: 8, user_id: 21 }, // Martin

      // 9. Bakalárka Generatory (admin: Monika = user_id 22)
      // členovia: herby, Svetlana, Damián + Monika
      { channel_id: 9, user_id: 2 },  // Svetlana
      { channel_id: 9, user_id: 22 }, // Monika (admin)
      { channel_id: 9, user_id: 23 }, // Matej Herzog
      { channel_id: 9, user_id: 24 }, // Damián
    ])
  }
}
