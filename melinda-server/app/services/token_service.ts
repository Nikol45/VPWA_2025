
import db from '@adonisjs/lucid/services/db'

export async function findTokenById(tokenId: string) {
  const row = await db
    .from('auth_access_tokens')
    .where('id', Number(tokenId))
    .first()

  if (!row) return null

  return {
    ...row,
    tokenableId: row.tokenable_id,
    hash: row.hash,
    abilities: JSON.parse(row.abilities),
  }
}
