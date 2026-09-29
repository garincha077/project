import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

const MAX_MEDIA_BYTES = 50 * 1024 * 1024

// Statuses are controlled by the Telegram admin route and read by users through RLS.

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    return NextResponse.json({ error: 'Telegram не настроен на сервере.' }, { status: 503 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Войдите в личный кабинет перед отправкой обращения.' }, { status: 401 })

  const formData = await request.formData()
  const category = String(formData.get('category') ?? '').trim()
  const address = String(formData.get('address') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const media = formData.get('media')

  if (!category || !address) {
    return NextResponse.json({ error: 'Укажите категорию и адрес.' }, { status: 400 })
  }

  if (media instanceof File && media.size > MAX_MEDIA_BYTES) {
    return NextResponse.json({ error: 'Размер фото или видео не должен превышать 50 МБ.' }, { status: 400 })
  }

  if (media instanceof File && media.size > 0 && !media.type.startsWith('image/') && !media.type.startsWith('video/')) {
    return NextResponse.json({ error: 'Можно отправить только изображение или видео.' }, { status: 400 })
  }

  let mediaUrl: string | null = null
  let mediaType: string | null = null
  if (media instanceof File && media.size > 0) {
    const filePath = `${user.id}/${crypto.randomUUID()}-${media.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`
    const { error: uploadError } = await supabase.storage.from('reports-media').upload(filePath, media, { contentType: media.type, upsert: false })
    if (uploadError) return NextResponse.json({ error: 'Не удалось сохранить фото или видео.' }, { status: 500 })
    const { data: publicFile } = supabase.storage.from('reports-media').getPublicUrl(filePath)
    mediaUrl = publicFile.publicUrl
    mediaType = media.type
  }

  const text = [
    'Новое обращение: Проблемы Караганды',
    `Категория: ${category}`,
    `Адрес: ${address}`,
    description ? `Описание: ${description}` : '',
  ].filter(Boolean).join('\n')

  const apiUrl = `https://api.telegram.org/bot${token}`
  if (media instanceof File && media.size > 0) {
    const telegramMedia = new FormData()
    telegramMedia.append('chat_id', chatId)
    telegramMedia.append(media.type.startsWith('video/') ? 'video' : 'photo', media, media.name)
    telegramMedia.append('caption', text)

    const mediaResponse = await fetch(`${apiUrl}/${media.type.startsWith('video/') ? 'sendVideo' : 'sendPhoto'}`, {
      method: 'POST',
      body: telegramMedia,
    })

    if (!mediaResponse.ok) {
      return NextResponse.json({ error: 'Не удалось передать обращение и медиафайл в Telegram.' }, { status: 502 })
    }
  } else {
    const messageResponse = await fetch(`${apiUrl}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })

    if (!messageResponse.ok) {
      return NextResponse.json({ error: 'Не удалось передать обращение в Telegram.' }, { status: 502 })
    }
  }


  const { error: insertError } = await supabase.from('reports').insert({
    user_id: user.id,
    category,
    address,
    description: description || null,
    media_url: mediaUrl,
    media_type: mediaType,
  })
  if (insertError) return NextResponse.json({ error: 'Обращение отправлено, но не удалось сохранить его в личном кабинете.' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
