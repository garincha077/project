(() => {
  const keys = { users: 'city-users', session: 'city-session', reports: 'city-reports', language: 'city-service-language', theme: 'city-service-theme' };
  const categories = {
    ru: ['Дороги и ямы', 'Тротуары и пешеходные зоны', 'Освещение', 'Светофоры и дорожные знаки', 'Мусор и санитарное состояние', 'Другие проблемы'],
    en: ['Roads and potholes', 'Sidewalks and pedestrian areas', 'Street lighting', 'Traffic lights and road signs', 'Waste and sanitation', 'Other problems'],
    kk: ['Жолдар мен шұңқырлар', 'Тротуарлар және жаяу жүргіншілер аймақтары', 'Жарықтандыру', 'Бағдаршамдар мен жол белгілері', 'Қоқыс және санитарлық жағдай', 'Басқа мәселелер']
  };
  const copy = {
    ru: { nav: 'Как это работает', about: 'О сервисе', contacts: 'Контакты', login: 'Войти', account: 'Личный кабинет', settings: 'Настройки', hero: 'Вместе сделаем Караганду лучше', heroText: 'Увидели проблему в городе? Сообщите нам — это займёт всего пару минут.', report: 'Сообщить о проблеме', newReport: 'Новое обращение', what: 'Что случилось?', category: 'Категория проблемы', address: 'Адрес происшествия', addressHint: 'Укажите улицу, номер дома или ближайший ориентир', description: 'Опишите ситуацию', optional: '(необязательно)', media: 'Фото или видео', addMedia: 'Добавьте фото или видео', mediaHint: 'JPG, PNG, MP4 до 50 МБ', send: 'Отправить обращение', sending: 'Сохраняем…', how: 'Как это работает', steps: ['Сообщите о проблеме', 'Мы передадим обращение', 'Город станет лучше'], stepText: ['Опишите ситуацию, укажите адрес и добавьте фото.', 'Информация поступит в нужную городскую службу.', 'Специалисты рассмотрят обращение и примут меры.'], register: 'Регистрация', email: 'Email', password: 'Пароль', signIn: 'Войти', create: 'Создать аккаунт', logout: 'Выйти', noAuth: 'Войдите, чтобы увидеть свои обращения.', noReports: 'У вас пока нет обращений.', status: 'Статус', close: 'Закрыть', language: 'Язык', theme: 'Тема', light: 'Светлая', dark: 'Тёмная', rules: 'правилами сервиса', save: 'Сохранить', success: 'Обращение сохранено в этом браузере.', service: 'Открытый городской сервис', help: 'Есть вопрос? Напишите нам' },
    en: { nav: 'How it works', about: 'About', contacts: 'Contacts', login: 'Sign in', account: 'Personal account', settings: 'Settings', hero: 'Together for a better Karaganda', heroText: 'Have you noticed a problem in the city? Tell us — it only takes a couple of minutes.', report: 'Report a problem', newReport: 'New request', what: 'What happened?', category: 'Problem category', address: 'Incident address', addressHint: 'Enter a street, building or landmark', description: 'Describe the situation', optional: '(optional)', media: 'Photo or video', addMedia: 'Add a photo or video', mediaHint: 'JPG, PNG, MP4 up to 50 MB', send: 'Submit request', sending: 'Saving…', how: 'How it works', steps: ['Report the problem', 'We forward the request', 'The city improves'], stepText: ['Describe the situation, address and add a photo.', 'The information reaches the relevant city service.', 'Specialists review it and take action.'], register: 'Registration', email: 'Email', password: 'Password', signIn: 'Sign in', create: 'Create account', logout: 'Sign out', noAuth: 'Sign in to see your requests.', noReports: 'You have no requests yet.', status: 'Status', close: 'Close', language: 'Language', theme: 'Theme', light: 'Light', dark: 'Dark', rules: 'service rules', save: 'Save', success: 'Request saved in this browser.', service: 'Open City Service', help: 'Have a question? Contact us' },
    kk: { nav: 'Қалай жұмыс істейді', about: 'Сервис туралы', contacts: 'Байланыс', login: 'Кіру', account: 'Жеке кабинет', settings: 'Баптаулар', hero: 'Қарағандыны бірге жақсартамыз', heroText: 'Қалада мәселе көрдіңіз бе? Бізге хабарлаңыз — бұл бірнеше минут қана алады.', report: 'Мәселе туралы хабарлау', newReport: 'Жаңа өтініш', what: 'Не болды?', category: 'Мәселе санаты', address: 'Оқиға мекенжайы', addressHint: 'Көше, үй нөмірі немесе жақын нысанды жазыңыз', description: 'Жағдайды сипаттаңыз', optional: '(міндетті емес)', media: 'Фото немесе бейне', addMedia: 'Фото немесе бейне қосыңыз', mediaHint: 'JPG, PNG, MP4, 50 МБ дейін', send: 'Өтініш жіберу', sending: 'Сақталуда…', how: 'Бұл қалай жұмыс істейді', steps: ['Мәселе туралы хабарлаңыз', 'Өтінішті жібереміз', 'Қала жақсарады'], stepText: ['Жағдайды сипаттап, мекенжайды көрсетіп, фото қосыңыз.', 'Ақпарат тиісті қалалық қызметке жіберіледі.', 'Мамандар өтінішті қарап, шара қолданады.'], register: 'Тіркелу', email: 'Email', password: 'Құпиясөз', signIn: 'Кіру', create: 'Аккаунт жасау', logout: 'Шығу', noAuth: 'Өтініштерді көру үшін кіріңіз.', noReports: 'Өтініштеріңіз әзірге жоқ.', status: 'Мәртебе', close: 'Жабу', language: 'Тіл', theme: 'Тақырып', light: 'Жарық', dark: 'Қараңғы', rules: 'сервис ережелерімен', save: 'Сақтау', success: 'Өтініш осы браузерде сақталды.', service: 'Ашық қалалық сервис', help: 'Сұрағыңыз бар ма? Бізге жазыңыз' }
  };
  let lang = localStorage.getItem(keys.language) || 'ru';
  let dark = localStorage.getItem(keys.theme) === 'dark';
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };
  const currentEmail = () => localStorage.getItem(keys.session);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const statusLabel = (s) => ({ new: 'Новое', under_review: 'На рассмотрении', in_progress: 'В обработке', resolved: 'Сделано' }[s] || s);

  function render() {
    const t = copy[lang], email = currentEmail();
    document.documentElement.lang = lang;
    document.getElementById('app').innerHTML = `<div class="site ${dark ? 'dark' : ''}">
      <header class="topbar"><div class="topbar-inner"><a class="brand" href="#top"><span class="brand-mark">ОГС</span><span>${t.service}</span></a><nav><a href="#how">${t.nav}</a><a href="#about">${t.about}</a><a href="#contacts">${t.contacts}</a></nav><button class="header-button" id="settings">⚙ ${t.settings}</button><button class="header-button" id="auth">${email ? t.account : t.login}</button></div></header>
      <main><section class="hero" id="top"><div class="eyebrow">ГОРОДСКОЙ СЕРВИС</div><h1>${t.hero}</h1><p>${t.heroText}</p><a class="hero-button" href="#report">${t.report} <span>→</span></a></section>
      <section class="section" id="report"><div class="heading"><div><span class="kicker">${t.newReport}</span><h2>${t.what}</h2></div><span class="step-count">Шаг 1 из 1</span></div><form class="form-card" id="report-form"><div class="grid"><div class="field"><label for="category">${t.category}</label><select id="category" name="category">${categories[lang].map(x => `<option>${x}</option>`).join('')}</select></div><div class="field"><label for="address">${t.address}</label><input id="address" name="address" required placeholder="${t.addressHint}"><span class="hint">${t.addressHint}</span></div></div><div class="field"><label for="description">${t.description} <span>${t.optional}</span></label><textarea id="description" name="description" maxlength="500" placeholder="${t.description}"></textarea></div><div class="field"><label for="media">${t.media} <span>${t.optional}</span></label><input id="media" name="media" type="file" accept="image/*,video/*"><small>${t.addMedia} · ${t.mediaHint}</small></div><p class="form-footer">Отправляя обращение, вы соглашаетесь с <a href="#about">${t.rules}</a></p><button class="button" type="submit">${t.send}</button><p class="message" id="report-message"></p></form></section>
      <section class="section" id="how"><div class="heading"><h2>${t.how}</h2></div><div class="steps">${t.steps.map((step, i) => `<article class="step"><span>0${i + 1}</span><div><h3>${step}</h3><p>${t.stepText[i]}</p></div></article>`).join('')}</div></section>
      <section class="section" id="about"><div class="account-panel"><h2>${t.account}</h2><div id="account-content">${accountHtml(t, email)}</div></div></section></main><footer id="contacts"><span>© 2026 ${t.service}</span><a href="mailto:help@karaganda.kz">${t.help}</a></footer></div>`;
    bind();
  }

  function accountHtml(t, email) {
    if (!email) return `<p>${t.noAuth}</p><button class="button" id="open-auth">${t.login}</button>`;
    const list = read(keys.reports, []).filter(r => r.email === email);
    return `<div class="account-head"><div><strong>${esc(email)}</strong><p>${list.length} ${lang === 'ru' ? 'обращений' : 'requests'}</p></div><button class="outline-button" id="logout">${t.logout}</button></div><div class="reports">${list.length ? list.map(r => `<article class="report"><div><b>${esc(r.category)}</b><p>${esc(r.address)}</p><small>${new Date(r.createdAt).toLocaleString()}</small>${r.mediaName ? `<small>Файл: ${esc(r.mediaName)}</small>` : ''}</div><span class="status status-${r.status}">${statusLabel(r.status)}</span></article>`).join('') : `<p>${t.noReports}</p>`}</div>`;
  }

  function bind() {
    document.getElementById('settings').onclick = showSettings;
    document.getElementById('auth').onclick = () => currentEmail() ? document.getElementById('account').scrollIntoView() : showAuth();
    document.getElementById('open-auth')?.addEventListener('click', showAuth);
    document.getElementById('logout')?.addEventListener('click', () => { localStorage.removeItem(keys.session); render(); });
    document.getElementById('report-form').onsubmit = submitReport;
  }

  async function submitReport(event) {
    event.preventDefault();
    if (!currentEmail()) return showAuth();
    const form = event.currentTarget, button = form.querySelector('button[type=submit]'), t = copy[lang];
    button.disabled = true; button.textContent = t.sending;
    const data = new FormData(form), file = data.get('media');
    let media = null;
    if (file && file.size) media = { name: file.name, type: file.type, data: await toDataUrl(file) };
    const list = read(keys.reports, []);
    list.unshift({ id: crypto.randomUUID(), email: currentEmail(), category: data.get('category'), address: data.get('address'), description: data.get('description'), media, status: 'new', createdAt: new Date().toISOString() });
    localStorage.setItem(keys.reports, JSON.stringify(list));
    render();
    document.getElementById('report-message').textContent = t.success;
  }
  const toDataUrl = file => new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });

  function showAuth() {
    const t = copy[lang], modal = document.createElement('div');
    modal.className = 'modal'; modal.innerHTML = `<div class="modal-card"><div class="modal-head"><h2>${t.login}</h2><button class="close" aria-label="${t.close}">×</button></div><form id="auth-form"><div class="field"><label>${t.email}</label><input name="email" type="email" required autocomplete="email"></div><div class="field"><label>${t.password}</label><input name="password" type="password" minlength="6" required autocomplete="current-password"></div><button class="button" type="submit">${t.signIn}</button><button class="outline-button" type="button" id="register">${t.create}</button><p class="message" id="auth-message"></p></form></div>`;
    document.body.append(modal); modal.querySelector('.close').onclick = () => modal.remove();
    modal.querySelector('#register').onclick = () => { modal.querySelector('h2').textContent = t.register; modal.querySelector('#auth-form button[type=submit]').textContent = t.create; modal.querySelector('#register').remove(); modal.querySelector('#auth-form').dataset.register = 'true'; };
    modal.querySelector('#auth-form').onsubmit = event => { event.preventDefault(); const form = event.currentTarget, email = new FormData(form).get('email').toLowerCase().trim(), password = new FormData(form).get('password'), users = read(keys.users, {}), message = modal.querySelector('#auth-message'); if (form.dataset.register && users[email]) return message.textContent = 'Этот email уже зарегистрирован.'; if (!form.dataset.register && !users[email]) return message.textContent = 'Аккаунт не найден. Зарегистрируйтесь.'; if (users[email] && users[email] !== password) return message.textContent = 'Неверный пароль.'; users[email] = password; localStorage.setItem(keys.users, JSON.stringify(users)); localStorage.setItem(keys.session, email); modal.remove(); render(); };
  }

  function showSettings() {
    const t = copy[lang], modal = document.createElement('div');
    modal.className = 'modal'; modal.innerHTML = `<div class="modal-card"><div class="modal-head"><h2>${t.settings}</h2><button class="close">×</button></div><div class="field"><label>${t.language}</label><select id="language"><option value="ru">Русский</option><option value="en">English</option><option value="kk">Қазақша</option></select></div><div class="field"><label>${t.theme}</label><div class="theme-options"><button class="outline-button" id="light">${t.light}</button><button class="outline-button" id="dark">${t.dark}</button></div></div></div>`;
    document.body.append(modal); modal.querySelector('#language').value = lang; modal.querySelector('.close').onclick = () => modal.remove(); modal.querySelector('#language').onchange = e => { lang = e.target.value; localStorage.setItem(keys.language, lang); modal.remove(); render(); }; modal.querySelector('#light').onclick = () => { dark = false; localStorage.setItem(keys.theme, 'light'); modal.remove(); render(); }; modal.querySelector('#dark').onclick = () => { dark = true; localStorage.setItem(keys.theme, 'dark'); modal.remove(); render(); };
  }
  render();
})();
