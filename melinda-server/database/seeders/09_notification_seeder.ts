import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Notification from '#models/notification'

export default class NotificationSeeder extends BaseSeeder {
  async run() {
    await Notification.createMany([
      // ========================
      // Kickvote o Burinovi (cieľ: Filip "businessman")
      // ========================

      // 1) Juraj (diktator) spustil kickvote na Burina v kanáli Slováci na Mladosti
      {
        userId: 7, // Filip "businessman"
        senderType: 'user',
        senderId: 13, // Juraj "diktator"
        isRead: false,
        text: 'Používateľ diktator spustil hlasovanie o vašom odstránení z kanála Slováci na Mladosti.',
      },
      // 2) Hlas Juraja v kickvote
      {
        userId: 7, // Filip "businessman"
        senderType: 'user',
        senderId: 13, // Juraj "diktator"
        isRead: false,
        text: 'V hlasovaní o vašom odstránení z kanála Slováci na Mladosti pribudol nový hlas.',
      },
      // 3) Hlas Tomáša (zuzenka) v kickvote
      {
        userId: 7, // Filip "businessman"
        senderType: 'user',
        senderId: 12, // Tomáš "zuzenka"
        isRead: false,
        text: 'V hlasovaní o vašom odstránení z kanála Slováci na Mladosti pribudol nový hlas.',
      },

      // ========================
      // Mentiony – Slováci na Mladosti (channel_id = 1)
      // ========================

      // Juraj pingne Firefly: '@firefly96 daj mu ban'
      {
        userId: 2, // Svetlana "firefly96"
        senderType: 'user',
        senderId: 13, // Juraj "diktator"
        isRead: false,
        text: 'Používateľ diktator vás spomenul v kanáli Slováci na Mladosti.',
      },
      // Juraj pingne Firefly: '@firefly daj mu ban už fakt'
      {
        userId: 2, // Svetlana "firefly96"
        senderType: 'user',
        senderId: 13, // Juraj "diktator"
        isRead: false,
        text: 'Používateľ diktator vás spomenul v kanáli Slováci na Mladosti.',
      },
      // Riško (tetris) mention na Firefly: 'Ja si dám kľudne tiež' (mentions: [2])
      {
        userId: 2, // Svetlana "firefly96"
        senderType: 'user',
        senderId: 11, // Richard "tetris"
        isRead: false,
        text: 'Používateľ tetris vás spomenul v kanáli Slováci na Mladosti.',
      },
      // Riško pingne Firefly v IBAN správe
      {
        userId: 2, // Svetlana "firefly96"
        senderType: 'user',
        senderId: 11, // Richard "tetris"
        isRead: false,
        text: 'Používateľ tetris vás spomenul v kanáli Slováci na Mladosti.',
      },
      // Riško pingne Juraja v IBAN správe
      {
        userId: 13, // Juraj "diktator"
        senderType: 'user',
        senderId: 11, // Richard "tetris"
        isRead: false,
        text: 'Používateľ tetris vás spomenul v kanáli Slováci na Mladosti.',
      },

      // ========================
      // Mentiony – League of Legends (public) (channel_id = 5)
      // ========================

      // Firefly pingne @tetris
      {
        userId: 11, // Richard "tetris"
        senderType: 'user',
        senderId: 2, // Svetlana "firefly96"
        isRead: false,
        text: 'Používateľ firefly96 vás spomenul v kanáli League of Legends (public).',
      },
      // Firefly pingne @kivin
      {
        userId: 8, // Šimon "kivin"
        senderType: 'user',
        senderId: 2, // Svetlana "firefly96"
        isRead: false,
        text: 'Používateľ firefly96 vás spomenul v kanáli League of Legends (public).',
      },

      // ========================
      // Mention – Spotify – random ľudia (channel_id = 7)
      // ========================

      // Jakub pingne @betka
      {
        userId: 5, // Alžbeta "betka"
        senderType: 'user',
        senderId: 18, // Jakub "jakub_velky"
        isRead: false,
        text: 'Používateľ jakub_velky vás spomenul v kanáli Spotify – random ľudia.',
      },

      // ========================
      // Mention – ICP – BudgetBuddy (channel_id = 8)
      // ========================

      // Firefly pingne @jakub_velky
      {
        userId: 18, // Jakub "jakub_velky"
        senderType: 'user',
        senderId: 2, // Svetlana "firefly96"
        isRead: false,
        text: 'Používateľ firefly96 vás spomenul v kanáli ICP – BudgetBuddy.',
      },

      // ========================
      // Pozvánka – Ženy na FIIT (channel_id = 4)
      // ========================

      // Nikol pozve Alžbetu do kanála Ženy na FIIT
      {
        userId: 5, // Alžbeta "betka"
        senderType: 'user',
        senderId: 1, // Nikol "nikol45"
        isRead: false,
        text: 'Používateľ nikol45 vás pozval do kanála Ženy na FIIT.',
      },

      // ========================
      // Ban – Ženy na FIIT (Žofia bola odstránená Nikol)
      // ========================

      {
        userId: 19, // Žofia
        senderType: 'user',
        senderId: 1, // Nikol "nikol45"
        isRead: false,
        text: 'Boli ste odstránení z kanála Ženy na FIIT adminom.',
      },
    ])
  }
}
