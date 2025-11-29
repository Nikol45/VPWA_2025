import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Notification from '#models/notification'

export default class NotificationSeeder extends BaseSeeder {
    async run() {
        await Notification.createMany([
            // ========================
            // Kickvote o Burinovi (cieľ: Filip "businessman")
            // ========================

            // 1) Juraj (diktator) spustil kickvote na Burina v kanáli Slováci na Mladosti (ID 1)
            {
                userId: 7, // Filip "businessman"
                channelId: 1, // Slováci na Mladosti
                senderId: 13, // Juraj "diktator"
                isRead: false,
                type: 'vote_kick_start',
            },
            // 2) Hlas Juraja v kickvote
            {
                userId: 7, // Filip "businessman"
                channelId: 1,
                senderId: 13, // Juraj "diktator"
                isRead: false,
                type: 'vote_kick_new',
            },
            // 3) Hlas Tomáša (zuzenka) v kickvote
            {
                userId: 7, // Filip "businessman"
                channelId: 1,
                senderId: 12, // Tomáš "zuzenka"
                isRead: false,
                type: 'vote_kick_new',
            },

            // ========================
            // Mentiony – Slováci na Mladosti (channel_id = 1)
            // ========================

            // Juraj pingne Firefly
            {
                userId: 2, // Svetlana "firefly96"
                channelId: 1,
                senderId: 13, // Juraj "diktator"
                isRead: false,
                type: 'mention',
            },
            // Juraj pingne Firefly znova
            {
                userId: 2, // Svetlana "firefly96"
                channelId: 1,
                senderId: 13, // Juraj "diktator"
                isRead: false,
                type: 'mention',
            },

            // Riško pingne Firefly v IBAN správe
            {
                userId: 2, // Svetlana "firefly96"
                channelId: 1,
                senderId: 11, // Richard "tetris"
                isRead: false,
                type: 'mention',
            },
            // Riško pingne Juraja v IBAN správe
            {
                userId: 13, // Juraj "diktator"
                channelId: 1,
                senderId: 11, // Richard "tetris"
                isRead: false,
                type: 'mention',
            },

            // ========================
            // Mentiony – League of Legends (public) (channel_id = 5)
            // ========================

            // Firefly pingne @tetris
            {
                userId: 11, // Richard "tetris"
                channelId: 5, // League of Legends (public)
                senderId: 2, // Svetlana "firefly96"
                isRead: false,
                type: 'mention',
            },
            // Firefly pingne @kivin
            {
                userId: 8, // Šimon "kivin"
                channelId: 5,
                senderId: 2, // Svetlana "firefly96"
                isRead: false,
                type: 'mention',
            },

            // ========================
            // Mention – Spotify – random ľudia (channel_id = 7)
            // ========================

            // Jakub pingne @betka
            {
                userId: 5, // Alžbeta "betka"
                channelId: 7, // Spotify – random ľudia
                senderId: 18, // Jakub "jakub_velky"
                isRead: false,
                type: 'mention',
            },

            // ========================
            // Mention – ICP – BudgetBuddy (channel_id = 8)
            // ========================

            // Firefly pingne @jakub_velky
            {
                userId: 18, // Jakub "jakub_velky"
                channelId: 8, // ICP – BudgetBuddy
                senderId: 2, // Svetlana "firefly96"
                isRead: false,
                type: 'mention',
            },

            // ========================
            // Pozvánka – Ženy na FIIT (channel_id = 4)
            // ========================

            // Nikol pozve Alžbetu do kanála Ženy na FIIT
            {
                userId: 5, // Alžbeta "betka"
                channelId: 4, // Ženy na FIIT
                senderId: 1, // Nikol "nikol45"
                isRead: false,
                type: 'invite',
            },

            // ========================
            // Ban – Ženy na FIIT (Žofia bola odstránená Nikol)
            // ========================

            {
                userId: 19, // Žofia
                channelId: 4,
                senderId: 1, // Nikol "nikol45"
                isRead: false,
                type: 'removed_admin',
            },
        ])
    }
}
