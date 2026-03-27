/** Sanitize user messages to prevent prompt injection */

const MAX_MESSAGE_LENGTH = 500
const BLOCKED_PATTERNS = [
  /ignore\s+(previous|all|above)\s+instructions/i,
  /jailbreak/i,
  /system\s+prompt/i,
  /act\s+as/i,
  /you\s+are\s+now/i,
  /forget\s+everything/i,
  /new\s+instructions:/i,
]

export function sanitizeMessage(message: string): string {
  const trimmed = message.slice(0, MAX_MESSAGE_LENGTH).replace(/[<>{}\\]/g, '').trim()
  if (!trimmed) return ''
  if (BLOCKED_PATTERNS.some((p) => p.test(trimmed))) return ''
  return trimmed
}
