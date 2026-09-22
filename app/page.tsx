'use client'

import { useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  CircleHelp,
  FileImage,
  LocateFixed,
  MapPin,
  Menu,
  MessageSquareText,
  ShieldCheck,
  Siren,
  TrafficCone,
  Upload,
  Video,
  X,
} from 'lucide-react'

const categories = [
  { label: 'Дороги и ямы', icon: AlertTriangle, tone: 'blue' },
  { label: 'Тротуары и пешеходные зоны', icon: MapPin, tone: 'slate' },
  { label: 'Освещение', icon: Siren, tone: 'amber' },
  { label: 'Светофоры и дорожные знаки', icon: TrafficCone, tone: 'amber' },
  { label: 'Общественный транспорт', icon: TrafficCone, tone: 'blue' },
  { label: 'Мусор и санитарное состояние', icon: FileImage, tone: 'green' },
  { label: 'Озеленение', icon: FileImage, tone: 'green' },
  { label: 'Вода и канализация', icon: MapPin, tone: 'blue' },
  { label: 'Здания и городские объекты', icon: AlertTriangle, tone: 'slate' },
  { label: 'Безопасность', icon: ShieldCheck, tone: 'red' },
  { label: 'Доступная среда', icon: MapPin, tone: 'blue' },
  { label: 'Парковка и движение', icon: TrafficCone, tone: 'amber' },
  { label: 'Экология', icon: FileImage, tone: 'green' },
  { label: 'Общественные пространства', icon: MessageSquareText, tone: 'slate' },
  { label: 'Реклама и городская навигация', icon: MessageSquareText, tone: 'slate' },
  { label: 'Другие проблемы', icon: MessageSquareText, tone: 'slate' },
]

export default function Page() {
  const fileInput = useRef<HTMLInputElement>(null)
  const cameraInput = useRef<HTMLInputElement>(null)
  const [category, setCategory] = useState(categories[0].label)
  const [file, setFile] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  function selectFile(nextFile?: File) {
    if (nextFile && (nextFile.type.startsWith('image/') || nextFile.type.startsWith('video/'))) setFile(nextFile)
  }

  async function submitReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSending(true)
    setError('')

    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        body: new FormData(event.currentTarget),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Не удалось отправить обращение')
      setSubmitted(true)
      setFile(null)
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Не удалось отправить обращение')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <a href="#top" className="brand" aria-label="Открытый городской сервис — на главную">
            <img className="brand-logo" src="/open-city-service-logo.png" alt="Открытый городской сервис" />
            <span>Открытый <b>городской сервис</b></span>
          </a>
          <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Основная навигация">
            <a href="#how">Как это работает</a>
            <a href="#about">О сервисе</a>
            <a href="#contacts">Контакты</a>
          </nav>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Открыть меню" aria-expanded={menuOpen}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <a className="header-action" href="#report"><Siren size={17} /> Сообщить о проблеме</a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-inner">
            <div className="eyebrow"><span className="eyebrow-dot" /> Городской сервис обращений</div>
            <h1>Помогаем сделать<br /><em>Караганду лучше</em></h1>
            <p className="hero-copy">Увидели проблему в городе? Сообщите нам —<br className="desktop-break" /> это займёт всего пару минут.</p>
            <a className="hero-button" href="#report">Сообщить о проблеме <ArrowRight size={19} /></a>
            <div className="hero-note"><ShieldCheck size={16} /> Ваше сообщение будет направлено в городские службы</div>
          </div>
          <div className="hero-stamp" aria-hidden="true"><span>ВМЕСТЕ</span><strong>ДЛЯ ГОРОДА</strong><i /></div>
        </section>

        <section className="report-section" id="report">
          <div className="section-heading">
            <div><span className="section-kicker">Новое обращение</span><h2>Что случилось?</h2></div>
            <span className="step-count">Шаг 1 из 1</span>
          </div>

          {submitted ? (
            <div className="success-card"><div className="success-icon"><Check size={30} /></div><h2>Спасибо за обращение</h2><p>Сообщение принято и передано ответственным городским службам. Мы обязательно разберёмся.</p><button className="outline-button" onClick={() => { setSubmitted(false); setFile(null) }}>Отправить ещё одно</button></div>
          ) : (
            <form className="report-form" onSubmit={submitReport}>
              <div className="form-grid">
                <div className="field-group category-field"><label htmlFor="category">Категория проблемы</label><div className="select-wrap"><select id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item.label}>{item.label}</option>)}</select><ChevronDown size={18} /></div></div>
                <div className="field-group"><label htmlFor="address">Адрес происшествия</label><div className="input-wrap"><MapPin size={18} /><input id="address" name="address" placeholder="Например, проспект Бухар Жырау, 56" required /><button type="button" aria-label="Определить моё местоположение" title="Определить местоположение"><LocateFixed size={17} /></button></div><span className="field-hint">Укажите улицу, номер дома или ближайший ориентир</span></div>
              </div>
              <div className="field-group"><label htmlFor="description">Опишите ситуацию <span>(необязательно)</span></label><textarea id="description" name="description" rows={4} placeholder="Расскажите подробнее, что произошло..." /><div className="char-count">0 / 500</div></div>
              <div className="field-group"><label>Фото или видео <span>(необязательно)</span></label><div className={file ? 'upload-box has-file' : 'upload-box'} onClick={() => fileInput.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files[0]) }} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') fileInput.current?.click() }}><input ref={fileInput} name="media" type="file" accept="image/*,video/*" hidden onChange={(event) => selectFile(event.target.files?.[0])} /><input ref={cameraInput} type="file" accept="image/*" capture="environment" hidden onChange={(event) => selectFile(event.target.files?.[0])} />{file ? <><div className="file-icon">{file.type.startsWith('video/') ? <Video size={22} /> : <FileImage size={22} />}</div><div className="upload-text"><strong>{file.name}</strong><span>{file.type.startsWith('video/') ? 'Видео добавлено' : 'Фото добавлено'} · нажмите, чтобы заменить</span></div><button type="button" className="remove-file" onClick={(event) => { event.stopPropagation(); setFile(null) }} aria-label="Удалить файл"><X size={17} /></button></> : <><div className="upload-icon"><Upload size={21} /></div><div className="upload-text"><strong>Добавьте фото или видео</strong><span>Выб��рите файл или сделайте снимок камерой · JPG, PNG, MP4 до 50 МБ</span><div className="media-actions"><button type="button" className="camera-button" onClick={(event) => { event.stopPropagation(); cameraInput.current?.click() }}><Video size={16} /> Сделать фото</button><span>или нажмите для выбора</span></div></div><ArrowRight className="upload-arrow" size={18} /></>}</div></div>
              {error && <p className="form-error" role="alert">{error}</p>}
              <div className="form-footer"><p><ShieldCheck size={16} /> Отправляя обращение, вы соглашаетесь с <a href="#about">правилами сервиса</a></p><button className="submit-button" type="submit" disabled={sending}>{sending ? 'Отправляем…' : 'Отправить обращение'} {!sending && <ArrowRight size={18} />}</button></div>
            </form>
          )}
        </section>

        <section className="how-section" id="how"><div className="section-heading compact"><div><span className="section-kicker">Просто и понятно</span><h2>Как это работает</h2></div></div><div className="steps"><div className="step"><span>01</span><div><h3>Сообщите о проблеме</h3><p>Опишите ситуацию, укажите адрес и добавьте фото.</p></div></div><div className="step"><span>02</span><div><h3>Мы передадим обращение</h3><p>Информация поступит в нужную городскую службу.</p></div></div><div className="step"><span>03</span><div><h3>Город станет лучше</h3><p>Специалисты рассмотрят обращение и примут меры.</p></div></div></div></section>
        <section className="trust-strip" id="about"><div><ShieldCheck size={21} /><strong>Открытый городской сервис</strong><span>Сообщения помогают находить и устранять проблемы в Караганде.</span></div><div className="trust-contact" id="contacts"><CircleHelp size={20} /><a href="mailto:help@karaganda.kz">Есть вопрос? Напишите нам</a></div></section>
      </main>
      <footer><span>© 2026 Открытый городской сервис</span><span>Сделано для Караганды</span></footer>
    </div>
  )
}
