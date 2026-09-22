'use client'

import { FormEvent, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (data.user) window.location.href = '/account'
    })
  }, [])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    const supabase = createClient()
    if (mode === 'signup') {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const registration = await response.json()
      if (!response.ok) {
        setLoading(false)
        setMessage(registration.error || 'Не удалось создать аккаунт. Проверьте данные.')
        return
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (error) {
        setMessage('Аккаунт создан. Теперь войдите с указанными данными.')
        setMode('login')
        return
      }
      window.location.href = '/account'
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setMessage('Проверьте email и пароль.')
      return
    }
    window.location.href = '/account'
  }

  return <main className="auth-page"><a className="auth-back" href="/"><ArrowLeft size={17} /> На главную</a><section className="auth-card"><img src="/open-city-service-logo.png" alt="Открытый городской сервис" className="auth-logo" /><span className="section-kicker">Открытый городской сервис</span><h1>{mode === 'login' ? 'Вход в кабинет' : 'Создание аккаунта'}</h1><p className="auth-lead">{mode === 'login' ? 'Следите за статусом своих обращений в одном месте.' : 'Зарегистрируйтесь, чтобы отправлять обращения и видеть их статус.'}</p><form className="auth-form" onSubmit={submit}><label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></label><label>Пароль<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Не менее 6 символов" minLength={6} required /></label><button className="submit-button" disabled={loading}>{loading ? 'Подождите…' : mode === 'login' ? 'Войти в кабинет' : 'Зарегистрироваться'} {!loading && <ArrowRight size={18} />}</button></form>{message && <p className="auth-message">{message}</p>}<button className="text-button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage('') }}>{mode === 'login' ? 'Создать новый аккаунт' : 'У меня уже есть аккаунт'}</button><div className="auth-security"><ShieldCheck size={17} /> Ваши данные защищены</div></section></main>
}

// Keep the authentication surface separate from the public report form.

