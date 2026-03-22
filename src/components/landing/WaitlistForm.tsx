'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email, status: 'pending' }])

      if (error) {
        if (error.code === '23505') { // Duplicate key
          setStatus('success')
          setMessage('Вы уже в списке! Мы свяжемся с вами скоро.')
        } else {
          throw error
        }
      } else {
        setStatus('success')
        setMessage('Ура! Вы добавлены в лист ожидания. 🚀')
      }
    } catch (err: any) {
      console.error('Waitlist error:', err)
      setStatus('error')
      setMessage('Что-то пошло не так. Попробуйте позже.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-center">
        {message}
      </div>
    )
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
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {status === 'loading' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          'Присоединиться'
        )}
      </button>
      {status === 'error' && (
        <p className="absolute -bottom-6 left-0 text-red-400 text-xs">{message}</p>
      )}
    </form>
  )
}
