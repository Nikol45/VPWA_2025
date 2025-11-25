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
        nMembers: 10,
        // Admin: Firefly (Svetlana, id 2)
        adminId: 2,
        inviteCode: await generateUniqueInviteCode(),
      },
      {
        name: 'Študenti FIIT 3.ročník',
        iconUrl: '/avatars/channels/tretiacky.png',
        visibility: 'private',
        nMembers: 25,
        // Admin: Nikol
        adminId: 1,
        inviteCode: await generateUniqueInviteCode(),
      },
      {
        name: 'FIIT',
        iconUrl: '/avatars/channels/FIIT.png',
        visibility: 'public',
        nMembers: 760,
        // Admin: Najlepší Študent (fiitkar, id 15)
        adminId: 15,
        inviteCode: await generateUniqueInviteCode(),
      },
      {
        name: 'Ženy na FIIT',
        iconUrl: '/avatars/channels/zeny.png',
        visibility: 'private',
        nMembers: 3,
        // Admin: Nikol (id 1)
        adminId: 1,
        inviteCode: await generateUniqueInviteCode(),
      },
      {
        name: 'League of Legends',
        iconUrl: '/avatars/channels/default_channel.jpg',
        visibility: 'public',
        nMembers: 1860,

        adminId: 2,
        inviteCode: await generateUniqueInviteCode(),
      },
      {
        name: 'Marvel Rivals',
        iconUrl: '/avatars/channels/default_channel.jpg',
        visibility: 'public',
        nMembers: 553,
        // Admin: Nikol (id 1)
        adminId: 1,
        inviteCode: await generateUniqueInviteCode(),
      },
      {
        name: 'Spotify',
        iconUrl: '/avatars/channels/default_channel.jpg',
        visibility: 'public',
        nMembers: 1130,
        // Admin: Jakub (jakub_velky, id 18)
        adminId: 18,
        inviteCode: await generateUniqueInviteCode(),
      },
      {
        name: 'ICP',
        iconUrl: '/avatars/channels/default_channel.jpg',
        visibility: 'private',
        nMembers: 5,
        // Admin: Jakub (jakub_velky, id 18)
        adminId: 18,
        inviteCode: await generateUniqueInviteCode(),
      },
      {
        name: 'Bakalárka Generatory',
        iconUrl: '/avatars/channels/default_channel.jpg',
        visibility: 'private',
        nMembers: 4,
        // Admin: Monika Kováčová (kitty, id 22)
        adminId: 22,
        inviteCode: await generateUniqueInviteCode(),
      },
    ])
  }
}
