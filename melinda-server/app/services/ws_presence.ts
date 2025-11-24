class PresenceService {
  private users = new Map<number, string>()

  async setOnline(userId: number) {
    this.users.set(userId, 'online')
  }

  async setOffline(userId: number) {
    this.users.set(userId, 'offline')
  }

  getStatus(userId: number) {
    return this.users.get(userId) || 'offline'
  }
}

let instance: PresenceService | null = null

export function getPresenceService() {
  if (!instance) instance = new PresenceService()
  return instance
}
