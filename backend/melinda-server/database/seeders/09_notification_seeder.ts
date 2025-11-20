import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Notification from '#models/notification'

export default class NotificationSeeder extends BaseSeeder {
  async run() {
     await Notification.createMany([
      // ------------------------------------------------------
      // USER 5 — kickvote, invite, ban
      // ------------------------------------------------------
      {
        userId: 5,
        senderType: 'user',
        senderId: 1, // Nikol
        isRead: false,
        text: 'Bol vytvorený kickvote o vašom vyhodení z kanála Slováci na Mladosti.',
      },
      {
        userId: 5,
        senderType: 'channel',
        senderId: 8,
        isRead: false,
        text: 'Boli ste pozvaná do kanála Študovňa.',
      },
      {
        userId: 5,
        senderType: 'channel',
        senderId: 1,
        isRead: false,
        text: 'Boli ste zabanovaná v kanáli Slováci na Mladosti.',
      },

      // Single unread message example (real preview)
      {
        userId: 5,
        senderType: 'user',
        senderId: 4, // Simča
        isRead: false,
        text: 'Simča: "Nie je to too much?" (Ženy na FIIT)',
      },

      // ------------------------------------------------------
      // USER 1 — Nikol
      // ------------------------------------------------------

      // Multiple unread messages summary
      {
        userId: 1,
        senderType: 'channel',
        senderId: 3, // FIITka
        isRead: false,
        text: 'Máte 4 neprečítané správy v kanáli FIITka.',
      },

      // Single unread message (message preview)
      {
        userId: 1,
        senderType: 'user',
        senderId: 4, // Simča
        isRead: false,
        text: 'Simča: "maybeee 🥺" (Ženy na FIIT)',
      },

      {
        userId: 1,
        senderType: 'channel',
        senderId: 2,
        isRead: false,
        text: 'Máte 3 neprečítané správy v kanáli Tretiačikovia.',
      },

      // ------------------------------------------------------
      // USER 2 — FireFly
      // ------------------------------------------------------
      {
        userId: 2,
        senderType: 'channel',
        senderId: 1,
        isRead: false,
        text: 'Máte 5 neprečítaných správ v kanáli Slováci na Mladosti.',
      },
      {
        userId: 2,
        senderType: 'user',
        senderId: 4,
        isRead: false,
        text: 'Simča: "Môže byť? @Firefly" (Ženy na FIIT)',
      },
      {
        userId: 2,
        senderType: 'channel',
        senderId: 3,
        isRead: false,
        text: 'Máte 2 neprečítané správy v kanáli FIITka.',
      },

      // ------------------------------------------------------
      // USER 3 — Svatec
      // ------------------------------------------------------
      {
        userId: 3,
        senderType: 'channel',
        senderId: 6, // Marvel Rivals
        isRead: false,
        text: 'Máte 3 neprečítané správy v kanáli Marvel Rivals.',
      },
      {
        userId: 3,
        senderType: 'user',
        senderId: 1,
        isRead: false,
        text: 'Nikol: "Idem do študovne, kto sa pridá?" (Študovňa)',
      },
      {
        userId: 3,
        senderType: 'channel',
        senderId: 8,
        isRead: false,
        text: 'Máte 2 neprečítané správy v kanáli Študovňa.',
      },

      // ------------------------------------------------------
      // USER 4 — Simča
      // ------------------------------------------------------
      {
        userId: 4,
        senderType: 'channel',
        senderId: 4,
        isRead: false,
        text: 'Máte 6 neprečítaných správ v kanáli Ženy na FIIT.',
      },
      {
        userId: 4,
        senderType: 'user',
        senderId: 1,
        isRead: false,
        text: 'Nikol: "aaa vyzerá to perfektne 🔥" (Ženy na FIIT)',
      },
      {
        userId: 4,
        senderType: 'channel',
        senderId: 2,
        isRead: false,
        text: 'Máte 2 neprečítané správy v kanáli Tretiačikovia.',
      },

      // ------------------------------------------------------
      // USER 6 — Lukáš
      // ------------------------------------------------------
      {
        userId: 6,
        senderType: 'channel',
        senderId: 7,
        isRead: false,
        text: 'Máte 3 neprečítané správy v kanáli League of Legends.',
      },
      {
        userId: 6,
        senderType: 'user',
        senderId: 2,
        isRead: false,
        text: 'FireFly: "Ak nebudeš intovať, tak idem 😂" (League of Legends)',
      },
      {
        userId: 6,
        senderType: 'channel',
        senderId: 6,
        isRead: false,
        text: 'Máte 4 neprečítané správy v kanáli Marvel Rivals.',
      },
    ])
  }
}