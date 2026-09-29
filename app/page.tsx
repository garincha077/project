'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
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
  Settings,
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
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState<'ru' | 'en' | 'kk'>('ru')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [reports, setReports] = useState<Array<{ id: string; category: string; address: string; status: string; created_at: string }>>([])
  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? ''))
    setDarkMode(window.localStorage.getItem('city-service-theme') === 'dark')
    setLanguage(window.localStorage.getItem('city-service-language') === 'en' ? 'en' : window.localStorage.getItem('city-service-language') === 'kk' ? 'kk' : 'ru')
  }, [])

  const localizedCategories = language === 'en' ? ['Roads and potholes', 'Sidewalks and pedestrian areas', 'Street lighting', 'Traffic lights and road signs', 'Public transport', 'Waste and sanitation', 'Green spaces', 'Water and sewerage', 'Buildings and city facilities', 'Safety', 'Accessibility', 'Parking and traffic', 'Environment', 'Public spaces', 'Advertising and city navigation', 'Other problems'] : language === 'kk' ? ['Жолдар мен шұңқырлар', 'Тротуарлар және жаяу жүргіншілер аймақтары', 'Жарықтандыру', 'Бағдаршамдар мен жол белгілері', 'Қоғамдық көлік', 'Қоқыс және санитарлық жағдай', 'Көгалдандыру', 'Су және кәріз', 'Ғимараттар мен қалалық нысандар', 'Қауіпсіздік', 'Қолжетімді орта', 'Тұрақ және қозғалыс', 'Экология', 'Қоғамдық кеңістіктер', 'Жарнама және қалалық навигация', 'Басқа мәселелер'] : categories.map((item) => item.label)

  const copy = language === 'en' ? {
    navHow: 'How it works', navAbout: 'About the service', navContacts: 'Contacts', report: 'Report a problem', account: userEmail ? 'Personal account' : 'Sign in', settings: 'Settings', settingsTitle: 'Settings', theme: 'Theme', dark: 'Dark', light: 'Light', languageLabel: 'Language', close: 'Close', heroEyebrow: 'City service for requests', heroTitle: 'Together for a better Karaganda', heroCopy: 'Have you noticed a problem in the city? Tell us — it only takes a couple of minutes.', heroButton: 'Report a problem', heroNote: 'Your message will be sent to city services', newReport: 'New request', what: 'What happened?', step: 'Step 1 of 1', category: 'Problem category', address: 'Incident address', addressHint: 'Enter a street, building number or nearby landmark', description: 'Describe the situation', optional: '(optional)', descriptionPlaceholder: 'Tell us more about what happened…', media: 'Photo or video', upload: 'Add a photo or video', submit: 'Submit request', submitting: 'Sending…', howKicker: 'Simple and clear', howTitle: 'How it works', thanks: 'Thank you for your request', another: 'Send another', languageRu: 'Russian', languageEn: 'English', languageKk: 'Kazakh', languageValue: 'en' as const, addressPlaceholder: 'For example, Bukhar Zhyrau Avenue, 56', optional: '(optional)', descriptionPlaceholder: 'Tell us more about what happened…', rules: 'service rules', uploadAdded: 'Photo added', videoAdded: 'Video added', replaceFile: 'click to replace', removeFile: 'Remove file', addMedia: 'Add a photo or video', mediaHint: 'Choose a file or take a camera photo · JPG, PNG, MP4 up to 50 MB', takePhoto: 'Take a photo', chooseFile: 'or click to choose', stepOneTitle: 'Report the problem', stepOneText: 'Describe the situation, specify the address and add a photo.', stepTwoTitle: 'We will forward the request', stepTwoText: 'The information will reach the relevant city service.', stepThreeTitle: 'The city will improve', stepThreeText: 'Specialists will review the request and take action.', trustTitle: 'Open City Service', trustText: 'Your messages help find and solve problems in Karaganda.', help: 'Have a question? Contact us', footer: 'Made for Karaganda', successText: 'Your message was accepted and sent to the responsible city services. We will review it.',
  } : language === 'kk' ? {
    navHow: 'Қалай жұмыс істейді', navAbout: 'Сервис туралы', navContacts: 'Байланыс', report: 'Мәселе туралы хабарлау', account: userEmail ? 'Жеке кабинет' : 'Кіру', settings: 'Баптаулар', settingsTitle: 'Баптаулар', theme: 'Тақырып', dark: 'Қараңғы', light: 'Жарық', languageLabel: 'Тіл', close: 'Жабу', heroEyebrow: 'Қалалық өтініштер сервисі', heroTitle: 'Қарағандыны бірге жақсартамыз', heroCopy: 'Қалада мәселе көрдіңіз бе? Бізге хабарлаңыз — бұл бірнеше минут қана алады.', heroButton: 'Мәселе туралы хабарлау', heroNote: 'Хабарыңыз қалалық қызметтерге жіберіледі', newReport: 'Жаңа өтініш', what: 'Не болды?', step: '1-қадам / 1', category: 'Мәселе санаты', address: 'Оқиға мекенжайы', addressHint: 'Көше, үй нөмірі немесе жақын жердегі нысанды жазыңыз', description: 'Жағдайды сипаттаңыз', optional: '(міндетті емес)', descriptionPlaceholder: 'Не болғанын толығырақ жазыңыз…', media: 'Фото немесе бейне', upload: 'Фото немесе бейне қосыңыз', submit: 'Өтініш жіберу', submitting: 'Жіберілуде…', howKicker: 'Қарапайым әрі түсінікті', howTitle: 'Бұл қалай жұмыс істейді', thanks: 'Өтінішіңізге рақмет', another: 'Тағы жіберу', languageRu: 'Орысша', languageEn: 'Ағылшынша', languageKk: 'Қазақша', languageValue: 'kk' as const, addressPlaceholder: 'Мысалы, Бұқар Жырау даңғылы, 56', optional: '(міндетті емес)', descriptionPlaceholder: 'Не болғанын толығырақ жазыңыз…', rules: 'сервис ережелерімен', uploadAdded: 'Фото қосылды', videoAdded: 'Бейне қосылды', replaceFile: 'ауыстыру үшін басыңыз', removeFile: 'Файлды өшіру', addMedia: 'Фото немесе бейне қосыңыз', mediaHint: 'Файл таңдаңыз немесе камерамен түсіріңіз · JPG, PNG, MP4, 50 МБ дейін', takePhoto: 'Фото түсіру', chooseFile: 'немесе таңдау үшін басыңыз', stepOneTitle: 'Мәселе туралы хабарлаңыз', stepOneText: 'Жағдайды сипаттап, мекенжайды көрсетіп, фото қосыңыз.', stepTwoTitle: 'Өтінішті жібереміз', stepTwoText: 'Ақпарат тиісті қалалық қызметке жіберіледі.', stepThreeTitle: 'Қала жақсарады', stepThreeText: 'Мамандар өтінішті қарап, шара қолданады.', trustTitle: 'Ашық қалалық сервис', trustText: 'Хабарламаларыңыз Қарағандыдағы мәселелерді табуға және шешуге көмектеседі.', help: 'Сұрағыңыз бар ма? Бізге жазыңыз', footer: 'Қарағанды үшін жасалды', successText: 'Хабарыңыз қабылданып, жауапты қалалық қызметтерге жіберілді. Біз оны міндетті түрде қарастырамыз.',
  } : {
    navHow: 'Как это работает', navAbout: 'О сервисе', navContacts: 'Контакты', report: 'Сообщить о проблеме', account: userEmail ? 'Личный кабинет' : 'Войти', settings: 'Настройки', settingsTitle: 'Настройки', theme: 'Тема', dark: 'Тёмная', light: 'Светлая', languageLabel: 'Язык', close: 'Закрыть', heroEyebrow: 'Городской сервис обращений', heroTitle: 'Вместе сделаем Караганду лучше', heroCopy: 'Увидели проблему в городе? Сообщите нам — это займёт всего пару минут.', heroButton: 'Сообщить о проблеме', heroNote: 'Ваше сообщение будет направлено в городские службы', newReport: 'Новое обращение', what: 'Что случилось?', step: 'Шаг 1 из 1', category: 'Категория проблемы', address: 'Адрес происшествия', addressHint: 'Укажите улицу, номер дома или ближайший ориентир', description: 'Опишите ситуацию', optional: '(необязательно)', descriptionPlaceholder: 'Расскажите подробнее, что произошло…', media: 'Фото или видео', upload: 'Добавьте фото или видео', submit: 'Отправить обращение', submitting: 'Отправляем…', howKicker: 'Просто и понятно', howTitle: 'Как это работает', thanks: 'Спасибо за обращение', another: 'Отправить ещё одно', languageRu: 'Русский', languageEn: 'English', languageKk: 'Қазақша', languageValue: 'ru' as const, addressPlaceholder: 'Например, проспект Бухар Жырау, 56', optional: '(необязательно)', descriptionPlaceholder: 'Расскажите подробнее, что произошло…', rules: 'правилами сервиса', uploadAdded: 'Фото добавлено', videoAdded: 'Видео добавлено', replaceFile: 'нажмите, чтобы заменить', removeFile: 'Удалить файл', addMedia: 'Добавьте фото или видео', mediaHint: 'Выберите файл или сделайте снимок камерой · JPG, PNG, MP4 до 50 МБ', takePhoto: 'Сделать фото', chooseFile: 'или нажмите для выбора', stepOneTitle: 'Сообщите о проблеме', stepOneText: 'Опишите ситуацию, укажите адрес и добавьте фото.', stepTwoTitle: 'Мы передадим обращение', stepTwoText: 'Информация поступит в нужную городскую службу.', stepThreeTitle: 'Город станет лучше', stepThreeText: 'Специалисты рассмотрят обращение и примут меры.', trustTitle: 'Открытый городской сервис', trustText: 'Сообщения помогают находить и устранять проблемы в Караганде.', help: 'Есть вопрос? Напишите нам', footer: 'Сделано для Караганды', successText: 'Сообщение принято и передано ответственным городским службам. Мы обязательно разберёмся.',
  }

  function toggleTheme() {
    const nextMode = !darkMode
    setDarkMode(nextMode)
    window.localStorage.setItem('city-service-theme', nextMode ? 'dark' : 'light')
  }

  function changeLanguage(nextLanguage: 'ru' | 'en' | 'kk') {
    setLanguage(nextLanguage)
    window.localStorage.setItem('city-service-language', nextLanguage)
  }

  async function handleAuth(event: React.FormEvent) {
    event.preventDefault()
    setAuthMessage('')
    const supabase = createClient()
    const result = authMode === 'login' ? await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword }) : await supabase.auth.signUp({ email: authEmail, password: authPassword, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } })
    if (result.error) setAuthMessage('Проверьте email и пароль.')
    else { setUserEmail(authEmail); setAuthMessage(authMode === 'signup' ? 'Проверьте почту для подтверждения.' : 'Вы вошли в кабинет.') }
  }

  async function loadReports() {
    const { data } = await createClient().from('reports').select('id, category, address, status, created_at').order('created_at', { ascending: false })
    setReports(data ?? [])
  }

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
      <div className={darkMode ? 'site-shell dark-mode' : 'site-shell'}>
      <header className="topbar">
        <div className="topbar-inner">
          <a href="#top" className="brand" aria-label="Открытый городской сервис — на главную">
            <img className="brand-logo" src="/open-city-service-logo.png" alt="Открытый городской сервис" />
            <span>Открытый <b>городской сервис</b></span>
          </a>
          <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Основная навигация">
            <a href="#how">{copy.navHow}</a>
            <a href="#about">{copy.navAbout}</a>
            <a href="#contacts">{copy.navContacts}</a>
          </nav>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Открыть меню" aria-expanded={menuOpen}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <a className="header-action" href="#report"><Siren size={17} /> {copy.report}</a>
          <a className="account-link" href={userEmail ? '/account' : '/login'}>{copy.account}</a>
          <button className="settings-button" type="button" onClick={() => setSettingsOpen(true)} aria-label={copy.settings} title={copy.settings}><Settings size={18} /> <span>{copy.settings}</span></button>
        </div>
      </header>

      {settingsOpen && <div className="settings-backdrop" role="presentation" onClick={() => setSettingsOpen(false)}><section className="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title" onClick={(event) => event.stopPropagation()}><div className="settings-header"><h2 id="settings-title">{copy.settingsTitle}</h2><button className="settings-close" type="button" onClick={() => setSettingsOpen(false)} aria-label={copy.close}>×</button></div><label className="settings-field">{copy.languageLabel}<select value={language} onChange={(event) => changeLanguage(event.target.value as 'ru' | 'en' | 'kk')}><option value="ru">{copy.languageRu}</option><option value="en">{copy.languageEn}</option><option value="kk">{copy.languageKk}</option></select></label><div className="settings-field"><span>{copy.theme}</span><div className="theme-options"><button className={!darkMode ? 'theme-option active' : 'theme-option'} type="button" onClick={() => { if (darkMode) toggleTheme() }}>{copy.light}</button><button className={darkMode ? 'theme-option active' : 'theme-option'} type="button" onClick={() => { if (!darkMode) toggleTheme() }}>{copy.dark}</button></div></div></section></div>}

      <main id="top">
        <section className="hero">
          <div className="hero-inner">
            <div className="eyebrow"><span className="eyebrow-dot" /> {copy.heroEyebrow}</div>
            <h1>{copy.heroTitle}</h1>
            <p className="hero-copy">{copy.heroCopy}</p>
            <a className="hero-button" href="#report">{copy.heroButton} <ArrowRight size={19} /></a>
            <div className="hero-note"><ShieldCheck size={16} /> {copy.heroNote}</div>
          </div>
          <div className="hero-stamp" aria-hidden="true"><span>ВМЕСТЕ</span><strong>ДЛЯ ГОРОДА</strong><i /></div>
        </section>

        <section className="account-section" id="account">
          <div className="section-heading"><div><span className="section-kicker">Мои обращения</span><h2>Личный кабинет</h2></div></div>
          {!userEmail ? <form className="account-form" onSubmit={handleAuth}><input type="email" placeholder="Ваш email" value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} required /><input type="password" placeholder="Пароль" value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} minLength={6} required /><button className="submit-button" type="submit">{authMode === 'login' ? 'Войти' : 'Зарегистрироваться'} <ArrowRight size={18} /></button><button type="button" className="text-button" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>{authMode === 'login' ? 'Создать аккаунт' : 'У меня уже есть аккаунт'}</button>{authMessage && <p className="field-hint">{authMessage}</p>}</form> : <div className="account-panel"><p>Вы вошли как <strong>{userEmail}</strong></p><button className="outline-button" onClick={() => { createClient().auth.signOut(); setUserEmail(''); setReports([]) }}>Выйти</button><button className="outline-button" onClick={loadReports}>Показать мои обращения</button>{reports.length > 0 && <div className="reports-list">{reports.map((report) => <div className="report-row" key={report.id}><div><strong>{report.category}</strong><span>{report.address}</span></div><b className={`status status-${report.status}`}>{report.status === 'new' ? 'Новое' : report.status === 'in_progress' ? 'В обработке' : 'Обработано'}</b></div>)}</div>}</div>}
        </section>

        <section className="report-section" id="report">
          <div className="section-heading">
            <div><span className="section-kicker">{copy.newReport}</span><h2>{copy.what}</h2></div>
            <span className="step-count">{copy.step}</span>
          </div>

          {submitted ? (
            <div className="success-card"><div className="success-icon"><Check size={30} /></div><h2>{copy.thanks}</h2><p>{copy.successText}</p><button className="outline-button" onClick={() => { setSubmitted(false); setFile(null) }}>{copy.another}</button></div>
          ) : (
            <form className="report-form" onSubmit={submitReport}>
              <div className="form-grid">
                <div className="field-group category-field"><label htmlFor="category">{copy.category}</label><div className="select-wrap"><select id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item, index) => <option key={item.label}>{localizedCategories[index]}</option>)}</select><ChevronDown size={18} /></div></div>
                <div className="field-group"><label htmlFor="address">{copy.address}</label><div className="input-wrap"><MapPin size={18} /><input id="address" name="address" placeholder={copy.addressPlaceholder} required /><button type="button" aria-label="Определить моё местоположение" title="Определить местоположение"><LocateFixed size={17} /></button></div><span className="field-hint">{copy.addressHint}</span></div>
              </div>
              <div className="field-group"><label htmlFor="description">{copy.description} <span>{copy.optional}</span></label><textarea id="description" name="description" rows={4} placeholder={copy.descriptionPlaceholder} /><div className="char-count">0 / 500</div></div>
              <div className="field-group"><label>{copy.media} <span>{copy.optional}</span></label><div className={file ? 'upload-box has-file' : 'upload-box'} onClick={() => fileInput.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files[0]) }} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') fileInput.current?.click() }}><input ref={fileInput} name="media" type="file" accept="image/*,video/*" hidden onChange={(event) => selectFile(event.target.files?.[0])} /><input ref={cameraInput} type="file" accept="image/*" capture="environment" hidden onChange={(event) => selectFile(event.target.files?.[0])} />{file ? <><div className="file-icon">{file.type.startsWith('video/') ? <Video size={22} /> : <FileImage size={22} />}</div><div className="upload-text"><strong>{file.name}</strong><span>{file.type.startsWith('video/') ? copy.videoAdded : copy.uploadAdded} · {copy.replaceFile}</span></div><button type="button" className="remove-file" onClick={(event) => { event.stopPropagation(); setFile(null) }} aria-label="Удалить файл"><X size={17} /></button></> : <><div className="upload-icon"><Upload size={21} /></div><div className="upload-text"><strong>{copy.addMedia}</strong><span>{copy.mediaHint}</span><div className="media-actions"><button type="button" className="camera-button" onClick={(event) => { event.stopPropagation(); cameraInput.current?.click() }}><Video size={16} /> {copy.takePhoto}</button><span>{copy.chooseFile}</span></div></div><ArrowRight className="upload-arrow" size={18} /></>}</div></div>
              {error && <p className="form-error" role="alert">{error}</p>}
              <div className="form-footer"><p><ShieldCheck size={16} /> {language === 'en' ? 'By submitting, you agree to the' : language === 'kk' ? 'Жіберу арқылы сіз' : 'Отправляя обращение, вы соглашаетесь с'} <a href="#about">{copy.rules}</a></p><button className="submit-button" type="submit" disabled={sending}>{sending ? copy.submitting : copy.submit} {!sending && <ArrowRight size={18} />}</button></div>
            </form>
          )}
        </section>

        <section className="how-section" id="how"><div className="section-heading compact"><div><span className="section-kicker">{copy.howKicker}</span><h2>{copy.howTitle}</h2></div></div><div className="steps"><div className="step"><span>01</span><div><h3>{copy.stepOneTitle}</h3><p>{copy.stepOneText}</p></div></div><div className="step"><span>02</span><div><h3>{copy.stepTwoTitle}</h3><p>{copy.stepTwoText}</p></div></div><div className="step"><span>03</span><div><h3>{copy.stepThreeTitle}</h3><p>{copy.stepThreeText}</p></div></div></div></section>
        <section className="trust-strip" id="about"><div><ShieldCheck size={21} /><strong>{copy.trustTitle}</strong><span>{copy.trustText}</span></div><div className="trust-contact" id="contacts"><CircleHelp size={20} /><a href="mailto:help@karaganda.kz">{copy.help}</a></div></section>
      </main>
      <footer><span>© 2026 {copy.trustTitle}</span><span>{copy.footer}</span></footer>
    </div>
  )
}
