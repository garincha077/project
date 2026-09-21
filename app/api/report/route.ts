import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const MAX_IMAGE_BYTES = 10 * 1024 * 1024

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    return NextResponse.json({ error: 'Telegram не настроен на сервере.' }, { status: 503 })
  }

  const formData = await request.formData()
  const category = String(formData.get('category') ?? '').trim()
  const address = String(formData.get('address') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const photo = formData.get('photo')

  if (!category || !address) {
    return NextResponse.json({ error: 'Укажите категорию и адрес.' }, { status: 400 })
  }

  if (photo instanceof File && photo.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: 'Размер фотографии не должен превышать 10 МБ.' }, { status: 400 })
  }

  const text = [
    'Новое обращение: Проблемы Караганды',
    `Категория: ${category}`,
    `Адрес: ${address}`,
    description ? `Описание: ${description}` : '',
  ].filter(Boolean).join('\n')

  const apiUrl = `https://api.telegram.org/bot${token}`
  const messageResponse = await fetch(`${apiUrl}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })

  if (!messageResponse.ok) {
    return NextResponse.json({ error: 'Не удалось передать обращение в Telegram.' }, { status: 502 })
  }

  if (photo instanceof File && photo.size > 0) {
    const telegramPhoto = new FormData()
    telegramPhoto.append('chat_id', chatId)
    telegramPhoto.append('photo', photo, photo.name)
    telegramPhoto.append('caption', `Фото к обращению: ${category}\n${address}`)

    const photoResponse = await fetch(`${apiUrl}/sendPhoto`, {
      method: 'POST',
      body: telegramPhoto,
    })

    if (!photoResponse.ok) {
      return NextResponse.json({ error: 'Текст отправлен, но фотографию передать не удалось.' }, { status: 502 })
    }
  }

  return NextResponse.json({ ok: true })
}
