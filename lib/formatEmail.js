/**
 * Obfuscate email for privacy on the frontend
 * Shows first 3 chars + asterisks + domain
 * Example: contact@example.com -> con***@example.com
 */
export function obfuscateEmail(email) {
  const [localPart, domain] = email.split('@')
  if (!domain) return email
  
  const visibleChars = Math.min(3, Math.max(1, localPart.length - 3))
  const masked = localPart.substring(0, visibleChars) + '*'.repeat(Math.max(1, localPart.length - visibleChars))
  
  return `${masked}@${domain}`
}

/**
 * Format email for display
 */
export function formatEmail(email) {
  return email?.toLowerCase().trim() || ''
}
