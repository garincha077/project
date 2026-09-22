import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Введите корректный email.' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Пароль должен содержать минимум 6 символов.' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      const alreadyExists = error.message.toLowerCase().includes('already') || error.message.toLowerCase().includes('registered')
      return NextResponse.json(
        { error: alreadyExists ? 'Пользователь с таким email уже зарегистрирован.' : 'Не удалось создать аккаунт.' },
        { status: alreadyExists ? 409 : 400 },
      )
    }

    return NextResponse.json({ userId: data.user.id })
  } catch {
    return NextResponse.json({ error: 'Не удалось создать аккаунт.' }, { status: 500 })
  }
}
