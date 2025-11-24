export function extractMentions(text: string): string[] {
  const regex = /@([A-Za-z0-9_]+)/g
  const set = new Set<string>()
  let m: RegExpExecArray | null

  while ((m = regex.exec(text)) !== null) {
    set.add(m[1])
  }

  return Array.from(set)
}
