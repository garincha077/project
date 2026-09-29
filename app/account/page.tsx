'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, LogOut, RefreshCw, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Report = { id: string; category: string; address: string; description: string | null; status: string; created_at: string; media_url: string | null; media_type: string | null }

const statusNames: Record<string, string> = { new: 'Новое', under_review: 'На рассмотрении', in_progress: 'В обработке', resolved: 'Сделано' }

function ReportMedia({ report }: { report: Report }) {
  if (!report.media_url) return null
  if (report.media_type?.startsWith('video/')) return <video className="report-media" src={report.media_url} controls preload="metadata" />
  return <img className="report-media" src={report.media_url} alt={`Материал обращения: ${report.category}`} />
}

export default function AccountPage() {
  const [email, setEmail] = useState('')
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  async function loadAccount() {
    const supabase = createClient()
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) { window.location.href = '/login'; return }
    setEmail(userData.user.email ?? '')
    const { data, error } = await supabase.from('reports').select('id, category, address, description, status, created_at, media_url, media_type').order('created_at', { ascending: false })
    setReports(data ?? [])
    if (error) setMessage('Не удалось загрузить обращения.')
    setLoading(false)
  }

  useEffect(() => { loadAccount() }, [])

  async function logout() { await createClient().auth.signOut(); window.location.href = '/' }

  return <main className="account-page"><header className="account-top"><a className="brand" href="/"><img className="brand-logo" src="/open-city-service-logo.png" alt="Открытый городской сервис" /><span>Открытый <b>городской сервис</b></span></a><button className="outline-button" onClick={logout}><LogOut size={16} /> Выйти</button></header><section className="account-content"><a className="auth-back" href="/"><ArrowLeft size={17} /> На главную</a><div className="account-title"><div><span className="section-kicker">Мои обращения</span><h1>Личный кабинет</h1><p>{email}</p></div><button className="outline-button" onClick={loadAccount}><RefreshCw size={16} /> Обновить</button></div>{loading ? <div className="empty-account">Загрузка обращений…</div> : reports.length === 0 ? <div className="empty-account"><ShieldCheck size={28} /><h2>Обращений пока нет</h2><p>Сообщите о городской проблеме — она появится здесь.</p><a className="submit-button" href="/#report">Создать обращение</a></div> : <div className="reports-list">{reports.map((report) => <article className="report-card" key={report.id}><div className="report-card-head"><div><span className="report-date">{new Date(report.created_at).toLocaleDateString('ru-RU')}</span><h2>{report.category}</h2></div><b className={`status status-${report.status}`}>{statusNames[report.status] ?? report.status}</b></div><p className="report-address">{report.address}</p>{report.description && <p>{report.description}</p>}<ReportMedia report={report} /></article>)}</div>}{message && <p className="form-error">{message}</p>}</section></main>
}
