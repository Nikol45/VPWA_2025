import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Channel from '#models/channel'

// generate + kontrola duplicít
async function generateUniqueInviteCode(): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  function gen() {
    let out = ''
    for (let i = 0; i < 8; i++) {
      out += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return out
  }

  let code = gen()
  while (await Channel.findBy('inviteCode', code)) {
    code = gen()
  }

  return code
}

export default class ChannelSeeder extends BaseSeeder {
  async run() {
    await Channel.createMany([
      {
        name: 'Slováci na Mladosti',
        iconUrl: '/avatars/channels/cerveny.png',
        visibility: 'public',
        nMembers: 6,
        adminId: 2,
        inviteCode: await generateUniqueInviteCode(),
      },
      {
        name: 'Tretiačikovia',
        iconUrl: '/avatars/channels/tretiacky.png',
        visibility: 'private',
        nMembers: 3,
        adminId: 1,
        inviteCode: await generateUniqueInviteCode(),
      },
      {
        name: 'FIITka',
        iconUrl: '/avatars/channels/FIIT.png',
        visibility: 'public',
        nMembers: 5,
        adminId: 1,
        inviteCode: await generateUniqueInviteCode(),
      },
      {
        name: 'Ženy na FIIT',
        iconUrl: '/avatars/channels/zeny.png',
        visibility: 'private',
        nMembers: 4,
        adminId: 2,
        inviteCode: await generateUniqueInviteCode(),
      },
      {
        name: 'CEO',
        iconUrl: '/avatars/channels/default_channel.png',
        visibility: 'public',
        nMembers: 2,
        adminId: 4,
        inviteCode: await generateUniqueInviteCode(),
      },
      {
        name: 'Marvel Rivals',
        iconUrl: '/avatars/channels/default_channel.png',
        visibility: 'public',
        nMembers: 500,
        adminId: 3,
        inviteCode: await generateUniqueInviteCode(),
      },
      {
        name: 'League of Legends',
        iconUrl: '/avatars/channels/default_channel.png',
        visibility: 'public',
        nMembers: 1000,
        adminId: 5,
        inviteCode: await generateUniqueInviteCode(),
      },
      {
        name: 'Študovňa',
        iconUrl: '/avatars/channels/FIIT.png',
        visibility: 'public',
        nMembers: 5,
        adminId: 6,
        inviteCode: await generateUniqueInviteCode(),
      },
    ])
  }
}
