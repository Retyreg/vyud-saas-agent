'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Loader2, Zap, Shield } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Ошибка входа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-vyud-neutral-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-vyud-fade-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-vyud-primary-500 rounded-2xl mb-6 shadow-lg shadow-vyud-primary-500/20">
            <Zap className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2 font-display tracking-tight">Вход в VYUD AI</h1>
          <p className="text-vyud-neutral-400 font-body text-sm">Авторизуйтесь для доступа к панели управления</p>
        </div>

        <div className="vyud-card backdrop-blur-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-vyud-neutral-500 mb-2 font-body">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="vyud-input w-full"
                placeholder="admin@vyud.tech"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-vyud-neutral-500 mb-2 font-body">Пароль</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="vyud-input w-full"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs text-center font-medium animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="vyud-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-vyud-spin" /> : 'Войти'}
            </button>
          </form>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-vyud-neutral-500 font-mono uppercase tracking-widest">
          <Shield className="w-3 h-3" />
          <span>Protected by Supabase Auth</span>
        </div>
      </div>
    </div>
  )
}
