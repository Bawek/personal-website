/** Obfuscate email for display (PRD: discourage spam bots) */
export function obfuscateEmail(email) {
  if (!email || !email.includes('@')) return email
  const [user, domain] = email.split('@')
  const [host, tld] = domain.includes('.') ? domain.split('.') : [domain, '']
  const tldPart = tld ? ` [dot] ${tld}` : ''
  return `${user} [at] ${host}${tldPart}`
}

export function mailtoFromObfuscated() {
  return null
}
