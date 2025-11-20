import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        firstName: 'Nikol',
        lastName: 'Maljarová',
        nickname: 'Nikol45',
        email: 'nikol.maljarova@example.com',
        password: await hash.make('452004'),
        theme: 'lilac',
        avatarUrl: '/avatars/users/nikol.png',
        status: 'online',
        notificationSetting: 'show_all',
      },
      {
        firstName: 'Svetlana',
        lastName: 'Pivarčiová',
        nickname: 'FireFly x3',
        email: 'firefly96@example.com',
        password: await hash.make('heslo123'),
        theme: 'lilac',
        avatarUrl: '/avatars/users/firefly.jpg',
        status: 'online',
        notificationSetting: 'show_all',
      },
      {
        firstName: 'Peter',
        lastName: 'Ďurčo',
        nickname: 'Svatec',
        email: 'pepo.jxd@example.com',
        password: await hash.make('heslo123'),
        theme: 'midnight',
        avatarUrl: '/avatars/users/peto.png',
        status: 'offline',
        notificationSetting: 'mentions_only',
      },
      {
        firstName: 'Simona',
        lastName: 'Ričovská',
        nickname: 'simca',
        email: 'simona.ricovska@example.com',
        password: await hash.make('heslo123'),
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
        password: await hash.make('heslo123'),
        theme: 'forest',
        avatarUrl: '/avatars/users/betka.png',
        status: 'online',
        notificationSetting: 'show_all',
      },
      {
        firstName: 'Lukáš',
        lastName: 'Neviem',
        nickname: 'lukas',
        email: 'luk@example.com',
        password: await hash.make('heslo123'),
        theme: 'forest',
        avatarUrl: '/avatars/users/firefly.jpg',
        status: 'offline',
        notificationSetting: 'mute_all',
      },
    ])
  }
}