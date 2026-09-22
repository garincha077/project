import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const update = await request.json()
  const text = update?.message?.text?.trim() ?? ''
  const chatId = String(update?.message?.chat?.id ?? '')
  const allowedChatId = process.env.TELEGRAM_CHAT_ID
  if (!allowedChatId || chatId !== allowedChatId) return NextResponse.json({ ok: false }, { status: 403 })

  const match = text.match(/^changestatus\s+([0-9a-f-]{36})\s+(new|in_progress|resolved|в обработке|обработано)$/i)
  if (!match) return NextResponse.json({ ok: true })
  const status = match[2].toLowerCase() === 'в обработке' ? 'in_progress' : match[2].toLowerCase() === 'обработано' ? 'resolved' : match[2].toLowerCase()
  const supabase = await createClient()
  const { error } = await supabase.from('reports').update({ status }).eq('id', match[1])
  if (error) return NextResponse.json({ error: 'Не удалось изменить статус' }, { status: 500 })

  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text: `Статус обращения ${match[1]} изменён.` }) })
  return NextResponse.json({ ok: true })
}

export async function GET() { return NextResponse.json({ ok: true }) }
