// The user's own Gemini API key, held only in their browser.
//
// This is deliberately never sent to Supabase or persisted server-side: the app
// never becomes custodian of anyone's provider credential. The key is read out
// of localStorage at request time and passed to /api/generate-path, which uses
// it in memory for that one call.
//
// No 'use client' directive: the accessors guard on `window` so the route
// handler can import MISSING_KEY_MESSAGE and keep one copy of the wording.

const STORAGE_KEY = 'skillpilot.geminiApiKey'

export const MISSING_KEY_MESSAGE =
  'Add your own Gemini API key in Profile settings to generate a roadmap.'

export const INVALID_KEY_MESSAGE =
  'Google rejected your Gemini API key. Check it in Profile settings and try again.'

export function getUserApiKey(): string {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(STORAGE_KEY)?.trim() ?? ''
}

export function setUserApiKey(key: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, key.trim())
}

export function clearUserApiKey() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}

// Google AI Studio keys look like AIza..., so this is a cheap client-side check
// letting users catch a pasted-wrong value before spending a round trip. The
// real validation is Gemini rejecting it.
export function looksLikeGeminiKey(key: string): boolean {
  return /^AIza[0-9A-Za-z_-]{30,}$/.test(key.trim())
}

// Show enough to recognise which key is saved, without rendering the secret.
export function maskApiKey(key: string): string {
  const trimmed = key.trim()
  if (trimmed.length <= 8) return '••••••••'
  return `${trimmed.slice(0, 6)}${'•'.repeat(18)}${trimmed.slice(-4)}`
}
