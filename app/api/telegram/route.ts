import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const adminClient = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { autoRefreshToken: false, persistSession: false } })

export async function POST(request: Request) {
  const update = await request.json()
  const text = update?.message?.text?.trim() ?? ''
  const chatId = String(update?.message?.chat?.id ?? '')
  const allowedChatId = process.env.TELEGRAM_CHAT_ID
  if (!allowedChatId || chatId !== allowedChatId) return NextResponse.json({ ok: false }, { status: 403 })

  const apiUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`
  const reply = (message: string) => fetch(`${apiUrl}/sendMessage`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text: message }) })

  if (/^\/start|^\/help|^помощь/i.test(text)) {
    await reply('Команды администратора:\n\n/list — последние обращения\n/changestatus ID статус\nСтатусы: на рассмотрении, в обработке, сделано')
    return NextResponse.json({ ok: true })
  }

  if (/^\/?list$/i.test(text)) {
    const { data, error } = await adminClient().from('reports').select('id, category, address, status, created_at').order('created_at', { ascending: false }).limit(20)
    if (error) return NextResponse.json({ error: 'Не удалось получить обращения' }, { status: 500 })
    const names: Record<string, string> = { new: 'новое', under_review: 'на рассмотрении', in_progress: 'в обработке', resolved: 'сделано' }
    await reply(data?.length ? data.map((item) => `${item.id}\n${item.category} — ${item.address}\nСтатус: ${names[item.status] ?? item.status}`).join('\n\n') : 'Обращений пока нет.')
    return NextResponse.json({ ok: true })
  }

  const match = text.match(/^\/?(?:changestatus|status)\s+([0-9a-f-]{36})\s+(.+)$/i)
  if (!match) { await reply('Неизвестная команда. Используйте /help.'); return NextResponse.json({ ok: true }) }
  const rawStatus = match[2].trim().toLowerCase()
  const status = rawStatus === 'на рассмотрении' || rawStatus === 'рассмотрение' || rawStatus === 'under_review' ? 'under_review' : rawStatus === 'в обработке' || rawStatus === 'обработка' || rawStatus === 'in_progress' ? 'in_progress' : rawStatus === 'сделано' || rawStatus === 'обработано' || rawStatus === 'resolved' ? 'resolved' : rawStatus === 'новое' || rawStatus === 'new' ? 'new' : null
  if (!status) { await reply('Неверный статус. Используйте: на рассмотрении, в обработке или сделано.'); return NextResponse.json({ ok: true }) }
  const { data: updated, error } = await adminClient().from('reports').update({ status }).eq('id', match[1]).select('id').maybeSingle()
  if (error || !updated) { await reply('Обращение не найдено или статус не изменён. Проверьте ID.'); return NextResponse.json({ ok: true }) }
  const names: Record<string, string> = { new: 'Новое', under_review: 'На рассмотрении', in_progress: 'В обработке', resolved: 'Сделано' }
  await reply(`Статус обращения ${match[1]} изменён: ${names[status]}.`)
  return NextResponse.json({ ok: true })
}

export async function GET() { return NextResponse.json({ ok: true }) }
