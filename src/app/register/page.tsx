'use client'

import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Zap, UserPlus } from 'lucide-react'
import Link from 'next/link'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Предзаполняем email из URL
  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Регистрируем пользователя в Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      // 2. Добавляем его в таблицу waitlist
      await supabase
        .from('waitlist')
        .insert([{ email, status: 'pending' }])

      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-md vyud-card border-l-4 border-l-green-500">
        <Zap className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-4 font-display">Аккаунт создан!</h1>
        <p className="text-vyud-neutral-400 mb-6 font-body">Проверьте почту для подтверждения (если требуется) и войдите в систему через пару секунд...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md animate-vyud-fade-up">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-vyud-primary-500 rounded-2xl mb-6 shadow-lg shadow-vyud-primary-500/20">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2 font-display tracking-tight">Регистрация в VYUD</h1>
        <p className="text-vyud-neutral-400 font-body text-sm">Создайте аккаунт для доступа к ИИ-агенту</p>
      </div>

      <div className="vyud-card">
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-vyud-neutral-500 mb-2 font-body">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="vyud-input w-full"
              placeholder="you@example.com"
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
              placeholder="минимум 6 символов"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="vyud-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-vyud-spin" /> : 'Создать аккаунт'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-vyud-neutral-500">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-vyud-primary-400 hover:underline">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-vyud-neutral-950 text-white flex items-center justify-center p-6">
      <Suspense fallback={<Loader2 className="w-12 h-12 animate-vyud-spin text-vyud-primary-500" />}>
        <RegisterForm />
      </Suspense>
    </div>
  )
}
