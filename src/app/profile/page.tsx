'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Check, ExternalLink, KeyRound, Trash2 } from 'lucide-react'
import Button from '@/components/Button'
import {
  clearUserApiKey,
  getUserApiKey,
  looksLikeGeminiKey,
  maskApiKey,
  setUserApiKey,
} from '@/lib/user-api-key'

export default function Profile() {
  const { user, isLoaded } = useUser()

  // The saved key, read once on mount. localStorage is unavailable during the
  // server render, so this starts empty and fills in on the client.
  const [savedKey, setSavedKey] = useState('')
  const [draftKey, setDraftKey] = useState('')
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setSavedKey(getUserApiKey())
  }, [])

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault()
    const key = draftKey.trim()

    if (!looksLikeGeminiKey(key)) {
      setStatus('error')
      setErrorMessage(
        'That does not look like a Google AI Studio key. They start with "AIza".'
      )
      return
    }

    setUserApiKey(key)
    setSavedKey(key)
    setDraftKey('')
    setErrorMessage('')
    setStatus('saved')
  }

  const handleRemove = () => {
    clearUserApiKey()
    setSavedKey('')
    setDraftKey('')
    setErrorMessage('')
    setStatus('idle')
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-slate-900">Profile settings</h1>
        {isLoaded && user && (
          <p className="mt-1 text-sm text-slate-600">
            Signed in as {user.primaryEmailAddress?.emailAddress ?? user.username}
          </p>
        )}
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 rounded-md bg-brand-50 p-2 text-brand-600">
            <KeyRound className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Gemini API key</h2>
            <p className="mt-1 text-sm text-slate-600">
              SkillPilot generates roadmaps with your own Google AI Studio key, so
              usage is billed to your account and nobody else&apos;s. The key is stored
              only in this browser and sent to our server just long enough to make
              your request. It is never saved in our database.
            </p>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Get a free key from Google AI Studio
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
            </a>
          </div>
        </div>

        {savedKey ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Saved key
              </p>
              <p className="mt-0.5 font-mono text-sm text-slate-800">
                {maskApiKey(savedKey)}
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleRemove}>
              <Trash2 className="h-4 w-4" strokeWidth={1.75} />
              Remove
            </Button>
          </div>
        ) : (
          <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            No key saved yet. Roadmap generation stays disabled until you add one.
          </p>
        )}

        <form onSubmit={handleSave} className="mt-6">
          <label
            htmlFor="gemini-key"
            className="block text-sm font-medium text-slate-700"
          >
            {savedKey ? 'Replace key' : 'Add your key'}
          </label>
          <div className="mt-2 flex flex-wrap gap-3">
            <input
              id="gemini-key"
              type="password"
              value={draftKey}
              onChange={(event) => {
                setDraftKey(event.target.value)
                setStatus('idle')
              }}
              placeholder="AIza..."
              autoComplete="off"
              spellCheck={false}
              className="h-11 min-w-0 flex-1 rounded-md border border-slate-300 px-3 font-mono text-sm text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <Button type="submit" disabled={!draftKey.trim()}>
              Save key
            </Button>
          </div>

          {status === 'error' && (
            <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
          )}
          {status === 'saved' && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-emerald-700">
              <Check className="h-4 w-4" strokeWidth={2} />
              Key saved in this browser.
            </p>
          )}
        </form>
      </section>
    </main>
  )
}
