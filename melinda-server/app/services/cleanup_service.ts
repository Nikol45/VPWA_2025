import { DateTime } from 'luxon'
import Channel from '#models/channel'
import Message from '#models/message'
import Kickvote from '#models/kickvote'
import { emitToUser } from '#services/ws_events'

export default class CleanupService {
  private static INTERVAL = 24 * 60 * 60 * 1000 

  public static start() {    
    void this.runCleanup()

    setInterval(() => {
      void this.runCleanup()
    }, this.INTERVAL)
  }

  private static async runCleanup() {
    const threshold = DateTime.now().minus({ days: 30 })

    try {
        const inactive = await Channel.query()
        .where((q) => {
          q.whereNotNull('last_message_at').andWhere('last_message_at', '<', threshold.toSQL())
        })
        .orWhere((q) => {
          q.whereNull('last_message_at').andWhere('created_at', '<', threshold.toSQL())
        })

      if (inactive.length === 0) {
        return
      }

      for (const channel of inactive) {
       const members = await channel.related('members').query()
        
        await Promise.all(members.map(member => 
            emitToUser(member.id, 'channel:deleted', { 
                channelId: channel.id,
                channelName: channel.name
            })
        ))

        await Message.query().where('channel_id', channel.id).delete()
        await Kickvote.query().where('channel_id', channel.id).delete()
        
        await channel.related('members').detach()
        await channel.related('invitations').detach()
        await channel.related('blacklist').detach()
        
        await channel.delete()
      }
      
    } catch (error) {
      console.error('Error during channel cleanup:', error)
    }
  }
}