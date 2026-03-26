'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function WaitlistForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    // Просто перенаправляем на страницу регистрации с предзаполненным email
    router.push(`/register?email=${encodeURIComponent(email)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        placeholder="Ваш рабочий email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === 'loading'}
        className="vyud-input flex-1"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="vyud-btn-primary whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {status === 'loading' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          'Присоединиться'
        )}
      </button>
    </form>
  )
}
