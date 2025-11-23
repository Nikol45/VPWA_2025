import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        firstName: 'Nikol',
        lastName: 'Maljarová',
        nickname: 'nikol45',
        email: 'nikol45@example.com',
        password: '452004',
        theme: 'lilac',
        avatarUrl: '/avatars/users/nikol.png',
        status: 'online',
        notificationSetting: 'show_all',
      },
      {
        firstName: 'Svetlana',
        lastName: 'Pivarčiová',
        nickname: 'firefly96',
        email: 'firefly96@example.com',
        password: 'hesslo123',
        theme: 'lilac',
        avatarUrl: '/avatars/users/firefly.jpg',
        status: 'online',
        notificationSetting: 'show_all',
      },
      {
        firstName: 'Peter',
        lastName: 'Ďurčo',
        nickname: 'svatec',
        email: 'svetec@example.com',
        password: 'heslo123',
        theme: 'midnight',
        avatarUrl: '/avatars/users/peto.png',
        status: 'offline',
        notificationSetting: 'mentions_only',
      },
      {
        firstName: 'Simona',
        lastName: 'Ričovská',
        nickname: 'simca',
        email: 'simona@example.com',
        password: 'heslo123',
        theme: 'forest',
        avatarUrl: '/avatars/users/simca.png',
        status: 'dnd',
        notificationSetting: 'show_all',
      },
      {
        firstName: 'Alžbeta',
        lastName: 'Zatloukalová',
        nickname: 'betka',
        email: 'alzbetzat@example.com',
        password: 'heslo123',
        theme: 'forest',
        avatarUrl: '/avatars/users/betka.png',
        status: 'online',
        notificationSetting: 'show_all',
      },
      {
        firstName: 'Lukáš',
        lastName: 'Katreniak',
        nickname: 'cvirko',
        email: 'cvirko@example.com',
        password: 'heslo123',
        theme: 'forest',
        avatarUrl: '/avatars/users/cvirko.png',
        status: 'offline',
        notificationSetting: 'mute_all',
      },
    ])
  }
}
