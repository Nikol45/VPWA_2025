import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Channel from '#models/channel'

export default class ChannelSeeder extends BaseSeeder {
  async run() {
    await Channel.createMany([
      {
        name: 'Slováci na Mladosti',
        iconUrl: '/avatars/channels/cerveny.png',
        visibility: 'public',
        nMembers: 6,
        adminId: 2,
      },
      {
        name: 'Tretiačikovia',
        iconUrl: '/avatars/channels/tretiacky.png',
        visibility: 'private',
        nMembers: 3,
        adminId: 1,
      },
      {
        name: 'FIITka',
        iconUrl: '/avatars/channels/FIIT.png',
        visibility: 'public',
        nMembers: 5,
        adminId: 1,
      },
      {
        name: 'Ženy na FIIT',
        iconUrl: '/avatars/channels/zeny.png',
        visibility: 'private',
        nMembers: 4,
        adminId: 2,
      },
      {
        name: 'CEO',
        iconUrl: '/avatars/channels/default_channel.png',
        visibility: 'public',
        nMembers: 2,
        adminId: 4,
      },
      {
        name: 'Marvel Rivals',
        iconUrl: '/avatars/channels/default_channel.png',
        visibility: 'public',
        nMembers: 500,
        adminId: 3,
      },
      {
        name: 'League of Legends',
        iconUrl: '/avatars/channels/default_channel.png',
        visibility: 'public',
        nMembers: 1000,
        adminId: 5,
      },
      {
        name: 'Študovňa',
        iconUrl: '/avatars/channels/FIIT.png',
        visibility: 'public',
        nMembers: 5,
        adminId: 6,
      }
    ])
  }
}