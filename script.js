const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav');
menu?.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('show'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const glow = document.querySelector('.cursor-glow');
document.addEventListener('pointermove', (e) => {
  if (glow) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }
});

const shell = document.querySelector('.device-shell');
document.querySelector('.hero-stage')?.addEventListener('pointermove', (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - .5;
  const y = (e.clientY - r.top) / r.height - .5;
  shell.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateZ(10px)`;
});
document.querySelector('.hero-stage')?.addEventListener('pointerleave', () => shell.style.transform = '');

const metric = document.querySelector('#screen-metric');
const status = document.querySelector('#screen-status');
const l1 = document.querySelector('#screen-line-1');
const l2 = document.querySelector('#screen-line-2');

document.querySelector('[data-demo="alco"]')?.addEventListener('click', () => {
  metric.textContent = '0.00‰';
  status.textContent = 'SAFE';
  l1.textContent = 'Алкотестер: проверка пройдена';
  l2.textContent = 'Запуск разрешён';
});
document.querySelector('[data-demo="finger"]')?.addEventListener('click', () => {
  metric.textContent = 'ID ✓';
  status.textContent = 'AUTH';
  l1.textContent = 'Водитель: Алексей';
  l2.textContent = 'Доступ подтверждён';
});

const appTabs = document.querySelectorAll('.app-tab');
const appScreens = document.querySelectorAll('[data-phone-screen]');
appTabs.forEach(btn => {
  btn.addEventListener('click', () => {
    appTabs.forEach(b => b.classList.remove('active'));
    appScreens.forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector(`[data-phone-screen="${btn.dataset.screen}"]`)?.classList.add('active');
  });
});

let screenIndex = 0;
const screenNames = ['home', 'map', 'ai', 'fleet', 'security', 'reports', 'video', 'settings', 'sos', 'support', 'store', 'profile'];
/* старое автопереключение отключено: используется DELUXE-переключатель ниже */

const canvas = document.querySelector('#scoreCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = 220 * dpr;
  canvas.height = 220 * dpr;
  ctx.scale(dpr, dpr);
  function drawScore() {
    ctx.clearRect(0,0,220,220);
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255,255,255,.08)';
    ctx.beginPath();
    ctx.arc(110,110,82,Math.PI*.78,Math.PI*2.22);
    ctx.stroke();
    const grad = ctx.createLinearGradient(20,20,200,200);
    grad.addColorStop(0,'#1b52ff');
    grad.addColorStop(1,'#54ecff');
    ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.arc(110,110,82,Math.PI*.78,Math.PI*(.78 + 1.44*0.94));
    ctx.stroke();
  }
  drawScore();
}

const cars = document.querySelector('#carsRange');
const sale = document.querySelector('#saleRange');
const carsValue = document.querySelector('#carsValue');
const saleValue = document.querySelector('#saleValue');
const costRevenue = document.querySelector('#costRevenue');
const hardwareRevenue = document.querySelector('#hardwareRevenue');
const grossProfit = document.querySelector('#grossProfit');
const mrrRevenue = document.querySelector('#mrrRevenue');
const arrRevenue = document.querySelector('#arrRevenue');
const payback = document.querySelector('#payback');
const rub = n => new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
function updateCalc(){
  if (!cars) return;
  const count = Number(cars.value);
  const salePrice = Number(sale.value);
  const unitCost = 20000;
  const subscription = 5000;
  const totalCost = count * unitCost;
  const hardware = count * salePrice;
  const profit = hardware - totalCost;
  const mrr = count * subscription;
  const months = mrr > 0 ? Math.ceil(totalCost / mrr) : 0;
  carsValue.textContent = count;
  saleValue.textContent = rub(salePrice);
  costRevenue.textContent = rub(totalCost);
  hardwareRevenue.textContent = rub(hardware);
  grossProfit.textContent = rub(profit);
  mrrRevenue.textContent = rub(mrr);
  arrRevenue.textContent = rub(mrr * 12);
  payback.textContent = months + ' мес.';
}
cars?.addEventListener('input', updateCalc);
sale?.addEventListener('input', updateCalc);
updateCalc();

document.querySelector('#leadForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget).entries());
  const leads = JSON.parse(localStorage.getItem('mig-leads') || '[]');
  leads.push({ ...data, createdAt: new Date().toISOString() });
  localStorage.setItem('mig-leads', JSON.stringify(leads));
  document.querySelector('#formStatus').textContent = 'Заявка сохранена в демо-режиме. Для реального сайта подключите Telegram/CRM/backend.';
  e.currentTarget.reset();
});


// EXTREME: модальное демо
const modal = document.querySelector('#demoModal');
document.querySelector('#openModal')?.addEventListener('click', () => modal?.classList.add('open'));
document.querySelector('#closeModal')?.addEventListener('click', () => modal?.classList.remove('open'));
modal?.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('open');
});

// EXTREME: функциональная карта
const matrixData = {
  driver: {
    title: 'Контроль водителя',
    text: 'Алкотестер, отпечаток, распознавание лица, температура, индекс усталости, история проверок и запрет запуска при риске.',
    tags: ['0.00‰', 'Лицо', 'Отпечаток', 'AI‑риск', 'История']
  },
  car: {
    title: 'Контроль автомобиля',
    text: 'Охрана, CAN‑интеграция, контроль дверей, геозоны, датчик удара, GPS и автоматическая блокировка.',
    tags: ['CAN', 'GPS', 'Геозона', 'Удар', 'Охрана']
  },
  family: {
    title: 'Семейная безопасность',
    text: 'Близкие видят маршрут, получают SOS‑уведомления, события ДТП, тревоги и статус поездки.',
    tags: ['SOS', 'Маршрут', 'Близкие', 'Уведомления', 'Видео']
  },
  business: {
    title: 'B2B‑автопарк',
    text: 'Диспетчер видит машины, нарушения, водителей, отчёты, видеоархив, рейтинги и данные через API.',
    tags: ['Fleet', 'API', 'Отчёты', 'MRR', 'Рейтинги']
  }
};
document.querySelectorAll('.matrix-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.matrix-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const data = matrixData[btn.dataset.matrix];
    const panel = document.querySelector('#matrixPanel');
    panel.innerHTML = `<h3>${data.title}</h3><p>${data.text}</p><div class="panel-tags">${data.tags.map(t => `<span>${t}</span>`).join('')}</div>`;
  });
});

// EXTREME: сценарный симулятор
const scenarios = {
  fleet: {
    status: 'Нарушение зафиксировано',
    type: 'warn',
    title: 'Диспетчер получил событие',
    text: 'Система отправляет событие в B2B‑панель, формирует отчёт и помечает поездку.',
    actions: ['B2B‑панель', 'PDF‑отчёт', 'API‑событие', 'Рейтинг']
  },
  normal: {
    status: 'Поездка разрешена',
    type: 'safe',
    title: 'Система работает в фоновом режиме',
    text: 'МИГ проверил водителя, подтвердил доступ и продолжает анализировать поездку.',
    actions: ['Биометрия ✓', 'Алкотест ✓', 'Камера ✓', 'GPS ✓']
  },
  alcohol: {
    status: 'Запуск заблокирован',
    type: 'danger',
    title: 'Алкотест не пройден',
    text: 'Система блокирует запуск, сохраняет событие и отправляет уведомление владельцу или диспетчеру.',
    actions: ['Блокировка двигателя', 'Уведомление', 'Запись события', 'Отчёт']
  },
  crash: {
    status: 'Экстренный сценарий',
    type: 'danger',
    title: 'Зафиксировано ДТП',
    text: 'Акселерометр определил удар. МИГ сохраняет видео, отправляет координаты и запускает сценарий помощи.',
    actions: ['GPS координаты', '112', 'Видеоархив', 'Близкие']
  },
  theft: {
    status: 'Попытка угона',
    type: 'warn',
    title: 'Неизвестный водитель',
    text: 'Биометрия не совпала. Система блокирует запуск, включает охрану и отправляет тревогу.',
    actions: ['Face ID отказ', 'Блокировка', 'Геозона', 'Тревога']
  },
  fatigue: {
    status: 'Риск усталости',
    type: 'warn',
    title: 'AI заметил опасное состояние',
    text: 'Камера и поведение водителя показывают риск усталости. МИГ предлагает остановку и уведомляет диспетчера.',
    actions: ['AI анализ', 'Голосовое предупреждение', 'Рекомендация', 'Отчёт']
  }
};
document.querySelectorAll('.scenario-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const data = scenarios[btn.dataset.scenario];
    const status = document.querySelector('#simStatus');
    status.className = 'sim-status';
    if (data.type === 'danger') status.classList.add('danger');
    if (data.type === 'warn') status.classList.add('warn');
    status.textContent = data.status;
    document.querySelector('#simTitle').textContent = data.title;
    document.querySelector('#simText').textContent = data.text;
    document.querySelector('#simActions').innerHTML = data.actions.map(a => `<span>${a}</span>`).join('');
  });
});


// FIXED: улучшенный визуальный симулятор
const originalScenarioButtons = document.querySelectorAll('.scenario-btn');
const pulseZone = document.querySelector('#pulseZone');
const simLog = document.querySelector('#simLog');

const scenarioLogs = {
  normal: [
    '12:30 · Водитель идентифицирован',
    '12:31 · Алкотест пройден',
    '12:32 · Поездка разрешена'
  ],
  alcohol: [
    '12:30 · Алкотест: превышение',
    '12:30 · Запуск заблокирован',
    '12:31 · Уведомление отправлено владельцу'
  ],
  crash: [
    '12:42 · Удар зафиксирован акселерометром',
    '12:42 · Видео сохранено в архив',
    '12:43 · Координаты отправлены в SOS‑сценарий'
  ],
  theft: [
    '03:14 · Биометрия не совпала',
    '03:14 · Двери и запуск заблокированы',
    '03:15 · Геозона и тревога активированы'
  ],
  fatigue: [
    '21:06 · AI заметил признаки усталости',
    '21:07 · Голосовое предупреждение включено',
    '21:08 · Рекомендована остановка'
  ],
  fleet: [
    '09:12 · Нарушение сценария',
    '09:13 · Диспетчер уведомлён',
    '09:14 · Отчёт создан'
  ]
};

originalScenarioButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.scenario;
    const data = scenarios[key];
    pulseZone?.classList.remove('danger', 'warn');
    if (data?.type === 'danger') pulseZone?.classList.add('danger');
    if (data?.type === 'warn') pulseZone?.classList.add('warn');
    if (simLog && scenarioLogs[key]) {
      simLog.innerHTML = '<b>Журнал сценария</b>' + scenarioLogs[key].map(item => `<p>${item}</p>`).join('');
    }
  });
});


// INVESTOR PLUS: при ручном выборе экрана приложение не сливается и экран фиксируется на выбранном модуле
window.manualAppMode = false;
document.querySelectorAll('.app-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    window.manualAppMode = true;
    setTimeout(() => window.manualAppMode = false, 12000);
  });
});


// DELUXE: гарантированное переключение всех экранов телефона
(function(){
  const tabs = document.querySelectorAll('.app-tab');
  const screens = document.querySelectorAll('[data-phone-screen]');
  const names = ['home','map','ai','fleet','security','reports','video','settings','sos','support','store','profile'];
  let idx = 0;
  let hold = false;

  function showScreen(name){
    tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.screen === name));
    screens.forEach(screen => {
      const active = screen.dataset.phoneScreen === name;
      screen.classList.toggle('active', active);
      screen.style.opacity = active ? '1' : '';
      screen.style.pointerEvents = active ? 'auto' : '';
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      idx = Math.max(0, names.indexOf(tab.dataset.screen));
      showScreen(tab.dataset.screen);
      hold = true;
      window.manualAppMode = true;
      setTimeout(() => { hold = false; window.manualAppMode = false; }, 12000);
    });
  });

  setInterval(() => {
    if (document.hidden || hold || window.manualAppMode) return;
    idx = (idx + 1) % names.length;
    showScreen(names[idx]);
  }, 7000);

  showScreen('home');
})();


// PLATINUM: улучшенные подписи экранов телефона
(function(){
  const descriptions = {
    home: ['Главный экран', 'Сводка безопасности, состояние водителя и быстрые события.'],
    map: ['Карта', 'Онлайн‑маршрут, геозона, скорость, риск и передача маршрута близким.'],
    ai: ['AI‑чат', 'Помощник объясняет события, диагностику, ДТП‑сценарии и отчёты.'],
    fleet: ['Автопарк', 'B2B‑панель: машины, водители, нарушения и тревоги.'],
    security: ['Защита', 'Биометрия, CAN, двери, GPS‑геозона и уровень защиты.'],
    reports: ['Отчёты', 'PDF‑отчёты, динамика безопасности, поездки и предупреждения.'],
    video: ['Видео', 'Передняя камера, салон, события и экспорт фрагментов.'],
    settings: ['Настройки', 'Сценарии безопасности, уведомления, ДТП‑чувствительность.'],
    sos: ['SOS', 'Экстренный сценарий: координаты, 112, контакты и видео.'],
    support: ['Поддержка', 'Чат, оператор, сервис, ДТП‑заявки и оценка качества.'],
    store: ['Подписки', 'Платные модули: AI, видеоархив, семейный доступ, Fleet API.'],
    profile: ['Профиль', 'Роли доступа, статистика поездок и персональный аккаунт.']
  };
  const title = document.querySelector('#phoneScreenTitle');
  const desc = document.querySelector('#phoneScreenDesc');
  document.querySelectorAll('.app-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const data = descriptions[btn.dataset.screen];
      if (data && title && desc) {
        title.textContent = data[0];
        desc.textContent = data[1];
      }
    });
  });
})();

// PLATINUM: расширенный симулятор с телеметрией
(function(){
  const data = {
    normal: {
      status:'Поездка разрешена', type:'safe', title:'Система работает в фоновом режиме',
      text:'МИГ проверил водителя, подтвердил доступ и продолжает анализировать поездку.',
      actions:['Биометрия ✓','Алкотест ✓','Камера ✓','GPS ✓'],
      logs:['12:30 · Водитель идентифицирован','12:31 · Алкотест пройден','12:32 · Поездка разрешена'],
      speed:'62', risk:'Низкий', alco:'0.00‰', bio:'OK', gps:'Online', video:'REC'
    },
    alcohol: {
      status:'Запуск заблокирован', type:'danger', title:'Алкотест не пройден',
      text:'Система блокирует запуск, сохраняет событие и отправляет уведомление владельцу или диспетчеру.',
      actions:['Блокировка двигателя','Уведомление','Запись события','Отчёт'],
      logs:['12:30 · Алкотест: превышение','12:30 · Запуск заблокирован','12:31 · Уведомление отправлено владельцу'],
      speed:'0', risk:'Высокий', alco:'0.42‰', bio:'OK', gps:'Online', video:'REC'
    },
    crash: {
      status:'Экстренный сценарий', type:'danger', title:'Зафиксировано ДТП',
      text:'Акселерометр определил удар. МИГ сохраняет видео, отправляет координаты и запускает сценарий помощи.',
      actions:['GPS координаты','112','Видеоархив','Близкие'],
      logs:['12:42 · Удар зафиксирован','12:42 · Видео сохранено','12:43 · Координаты отправлены'],
      speed:'0', risk:'Критичный', alco:'0.00‰', bio:'OK', gps:'SOS', video:'SAVE'
    },
    theft: {
      status:'Попытка угона', type:'warn', title:'Неизвестный водитель',
      text:'Биометрия не совпала. Система блокирует запуск, включает охрану и отправляет тревогу.',
      actions:['Face ID отказ','Блокировка','Геозона','Тревога'],
      logs:['03:14 · Биометрия не совпала','03:14 · Двери и запуск заблокированы','03:15 · Тревога активирована'],
      speed:'0', risk:'Высокий', alco:'—', bio:'FAIL', gps:'Online', video:'REC'
    },
    fatigue: {
      status:'Риск усталости', type:'warn', title:'AI заметил опасное состояние',
      text:'Камера и поведение водителя показывают риск усталости. МИГ предлагает остановку и уведомляет диспетчера.',
      actions:['AI анализ','Голосовое предупреждение','Рекомендация','Отчёт'],
      logs:['21:06 · AI заметил усталость','21:07 · Голосовое предупреждение','21:08 · Рекомендована остановка'],
      speed:'74', risk:'Средний', alco:'0.00‰', bio:'OK', gps:'Online', video:'REC'
    },
    fleet: {
      status:'Нарушение зафиксировано', type:'warn', title:'Диспетчер получил событие',
      text:'Водитель нарушил сценарий безопасности. Система отправляет событие в B2B‑панель, формирует отчёт и помечает поездку.',
      actions:['B2B‑панель','Рейтинг водителя','PDF‑отчёт','API‑событие'],
      logs:['09:12 · Нарушение сценария','09:13 · Диспетчер уведомлён','09:14 · Отчёт создан'],
      speed:'88', risk:'Средний', alco:'0.00‰', bio:'OK', gps:'Online', video:'REC'
    }
  };

  const pulse = document.querySelector('#pulseZone');
  const status = document.querySelector('#simStatus');
  const title = document.querySelector('#simTitle');
  const text = document.querySelector('#simText');
  const actions = document.querySelector('#simActions');
  const log = document.querySelector('#simLog');
  const speed = document.querySelector('#simSpeed');
  const risk = document.querySelector('#simRisk');
  const alco = document.querySelector('#teleAlco');
  const bio = document.querySelector('#teleBio');
  const gps = document.querySelector('#teleGps');
  const video = document.querySelector('#teleVideo');

  function setScenario(key){
    const s = data[key];
    if (!s) return;
    document.querySelectorAll('.scenario-btn').forEach(b => b.classList.toggle('active', b.dataset.scenario === key));
    pulse?.classList.remove('danger','warn');
    status?.classList.remove('danger','warn');
    if (s.type === 'danger') { pulse?.classList.add('danger'); status?.classList.add('danger'); }
    if (s.type === 'warn') { pulse?.classList.add('warn'); status?.classList.add('warn'); }
    status.textContent = s.status;
    title.textContent = s.title;
    text.textContent = s.text;
    actions.innerHTML = s.actions.map(x => `<span>${x}</span>`).join('');
    log.innerHTML = '<b>Журнал сценария</b>' + s.logs.map(x => `<p>${x}</p>`).join('');
    speed.textContent = s.speed;
    risk.textContent = s.risk;
    alco.textContent = s.alco;
    bio.textContent = s.bio;
    gps.textContent = s.gps;
    video.textContent = s.video;
  }

  document.querySelectorAll('.scenario-btn').forEach(btn => {
    btn.addEventListener('click', () => setScenario(btn.dataset.scenario));
  });
  setScenario('normal');
})();


// SHOWCASE: быстрый выбор сценария в форме
document.querySelectorAll('.contact-options button').forEach(btn => {
  btn.addEventListener('click', () => {
    const interest = document.querySelector('select[name="interest"]');
    if (!interest) return;
    [...interest.options].forEach((opt, i) => {
      if (opt.textContent === btn.dataset.fill) interest.selectedIndex = i;
    });
    document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'});
  });
});

// SHOWCASE: микро-интеракция новостей
document.querySelectorAll('.news-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.news-card');
    card.style.transform = 'translateY(-4px) scale(1.01)';
    setTimeout(() => card.style.transform = '', 300);
  });
});


// PRO READABLE: progress bar
(function(){
  const bar = document.querySelector('.page-progress span');
  function updateProgress(){
    const h = document.documentElement;
    const scroll = h.scrollTop || document.body.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (scroll / max) * 100 : 0;
    if (bar) bar.style.width = pct + '%';
  }
  document.addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();
})();

// PRO READABLE: beautiful choice cards in feedback form
(function(){
  function activateChoice(btn){
    const targetId = btn.dataset.target;
    const input = document.querySelector('#' + targetId);
    if (!input) return;
    input.value = btn.dataset.value;
    const group = btn.closest('.choice-grid');
    group?.querySelectorAll('.choice-card, .choice-chip').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
  }
  document.querySelectorAll('.choice-card, .choice-chip').forEach(btn => {
    btn.addEventListener('click', () => activateChoice(btn));
  });

  document.querySelectorAll('.contact-options button').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.fill;
      const target = document.querySelector(`.choice-chip[data-value="${value}"]`);
      if (target) activateChoice(target);
    });
  });
})();


// COMPACT: working fleet dashboard tabs
(function(){
  const buttons = document.querySelectorAll('.fleet-tab');
  const side = document.querySelectorAll('[data-fleet-side]');
  const screens = document.querySelectorAll('[data-fleet-screen]');
  function showFleet(name){
    buttons.forEach(b => b.classList.toggle('active', b.dataset.fleet === name));
    side.forEach(s => s.classList.toggle('active', s.dataset.fleetSide === name));
    screens.forEach(sc => sc.classList.toggle('active', sc.dataset.fleetScreen === name));
  }
  buttons.forEach(btn => btn.addEventListener('click', () => showFleet(btn.dataset.fleet)));
  side.forEach(btn => btn.addEventListener('click', () => showFleet(btn.dataset.fleetSide)));
  showFleet('overview');
})();

// CALM PRO: спокойный мелодичный трек через WebAudio без внешних файлов
(function(){
  const oldBtn = document.querySelector('#musicToggle');
  if (!oldBtn) return;
  const btn = oldBtn.cloneNode(true);
  oldBtn.parentNode.replaceChild(btn, oldBtn);

  let ctx, master, timer, playing = false;
  let nodes = [];

  const melody = [261.63, 329.63, 392.00, 493.88, 392.00, 329.63, 293.66, 349.23];
  const bass = [130.81, 146.83, 164.81, 196.00];

  function playTone(freq, time, duration, gainValue, type='sine'){
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(gainValue, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    osc.connect(gain);
    gain.connect(master);
    osc.start(time);
    osc.stop(time + duration + 0.05);
    nodes.push(osc);
  }

  function startCalmTrack(){
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.045;
    master.connect(ctx.destination);

    let step = 0;
    function schedule(){
      const now = ctx.currentTime;
      for (let i = 0; i < 8; i++){
        const t = now + i * 0.55;
        playTone(melody[(step + i) % melody.length], t, 0.48, 0.075, 'sine');
        if (i % 2 === 0) playTone(bass[((step/2)|0) % bass.length], t, 1.05, 0.045, 'triangle');
      }
      step = (step + 8) % melody.length;
    }
    schedule();
    timer = setInterval(schedule, 4200);
    playing = true;
    btn.classList.add('active');
    btn.textContent = '♪ Трек включён';
  }

  function stopCalmTrack(){
    clearInterval(timer);
    if (master && ctx) {
      master.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      setTimeout(() => {
        try { nodes.forEach(n => { try { n.stop(); } catch(e){} }); ctx.close(); } catch(e){}
        nodes = [];
        ctx = null;
      }, 300);
    }
    playing = false;
    btn.classList.remove('active');
    btn.textContent = '♪ Спокойный трек';
  }

  btn.addEventListener('click', () => playing ? stopCalmTrack() : startCalmTrack());
})();


// CALM PRO: extra simulator scenarios
(function(){
  const extra = {
    family: {
      status:'Семья уведомлена', type:'safe', title:'Семейный режим активен',
      text:'Близкие получают маршрут, статус поездки и уведомление, если система заметит риск.',
      actions:['Маршрут семье','Статус водителя','SOS‑контакт','История поездки'],
      logs:['18:02 · Маршрут отправлен семье','18:03 · Геозона активна','18:04 · Статус: безопасно'],
      speed:'54', risk:'Низкий', alco:'0.00‰', bio:'OK', gps:'Family', video:'REC'
    },
    service: {
      status:'Диагностика завершена', type:'safe', title:'Устройство проверено',
      text:'МИГ проверил камеры, GPS, SIM‑модуль, алкотестер и датчик удара. Рекомендации отправлены владельцу.',
      actions:['Камеры OK','GPS OK','Алкотестер OK','SIM проверить'],
      logs:['10:11 · Диагностика начата','10:12 · Алкотестер исправен','10:13 · Рекомендация: проверить SIM‑сигнал'],
      speed:'0', risk:'Низкий', alco:'OK', bio:'OK', gps:'98%', video:'OK'
    }
  };
  if (window.platinumScenarioData) Object.assign(window.platinumScenarioData, extra);
})();

// CALM PRO: simulator manual command buttons
document.querySelectorAll('[data-command]').forEach(btn => {
  btn.addEventListener('click', () => {
    const result = document.querySelector('#simCommandResult');
    const text = {
      call: 'Сценарий помощи готов: координаты, контакт 112, близкие и видео события будут отправлены автоматически.',
      lock: 'Команда блокировки создана: запуск запрещён до повторной биометрии и успешного алкотеста.',
      report: 'Отчёт сформирован: событие, водитель, машина, координаты, видео и рекомендации добавлены в PDF/API.',
      notify: 'Уведомления подготовлены: владелец, диспетчер и доверенные контакты получат статус поездки.'
    }[btn.dataset.command];
    if (result) result.textContent = text;
  });
});


// CALM PRO: direct handler for new family/service buttons
(function(){
  const scenariosExtra = {
    family: {
      status:'Семья уведомлена', type:'safe', title:'Семейный режим активен',
      text:'Близкие получают маршрут, статус поездки и уведомление, если система заметит риск.',
      actions:['Маршрут семье','Статус водителя','SOS‑контакт','История поездки'],
      logs:['18:02 · Маршрут отправлен семье','18:03 · Геозона активна','18:04 · Статус: безопасно'],
      speed:'54', risk:'Низкий', alco:'0.00‰', bio:'OK', gps:'Family', video:'REC'
    },
    service: {
      status:'Диагностика завершена', type:'safe', title:'Устройство проверено',
      text:'МИГ проверил камеры, GPS, SIM‑модуль, алкотестер и датчик удара. Рекомендации отправлены владельцу.',
      actions:['Камеры OK','GPS OK','Алкотестер OK','SIM проверить'],
      logs:['10:11 · Диагностика начата','10:12 · Алкотестер исправен','10:13 · Рекомендация: проверить SIM‑сигнал'],
      speed:'0', risk:'Низкий', alco:'OK', bio:'OK', gps:'98%', video:'OK'
    }
  };
  function setExtra(key){
    const s = scenariosExtra[key];
    if (!s) return;
    document.querySelectorAll('.scenario-btn').forEach(b => b.classList.toggle('active', b.dataset.scenario === key));
    const pulse = document.querySelector('#pulseZone');
    const status = document.querySelector('#simStatus');
    pulse?.classList.remove('danger','warn');
    status?.classList.remove('danger','warn');
    status.textContent = s.status;
    document.querySelector('#simTitle').textContent = s.title;
    document.querySelector('#simText').textContent = s.text;
    document.querySelector('#simActions').innerHTML = s.actions.map(x => `<span>${x}</span>`).join('');
    document.querySelector('#simLog').innerHTML = '<b>Журнал сценария</b>' + s.logs.map(x => `<p>${x}</p>`).join('');
    document.querySelector('#simSpeed').textContent = s.speed;
    document.querySelector('#simRisk').textContent = s.risk;
    document.querySelector('#teleAlco').textContent = s.alco;
    document.querySelector('#teleBio').textContent = s.bio;
    document.querySelector('#teleGps').textContent = s.gps;
    document.querySelector('#teleVideo').textContent = s.video;
  }
  document.querySelectorAll('.scenario-btn[data-scenario="family"], .scenario-btn[data-scenario="service"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
      setExtra(btn.dataset.scenario);
    }, true);
  });
})();


// BLACK LABEL: music panel + real selectable music + upload
(function(){
  const btn = document.querySelector('#musicToggle');
  const panel = document.querySelector('#musicPanel');
  const close = document.querySelector('#closeMusicPanel');
  const volume = document.querySelector('#musicVolume');
  const upload = document.querySelector('#musicUpload');
  const choices = document.querySelectorAll('.track-choice');
  if (!btn || !panel) return;

  let ctx, master, timer, playing = false, selected = 'calm', fileAudio = null, fileUrl = null;
  let activeNodes = [];

  const presets = {
    calm: { melody:[261.63,329.63,392,329.63,293.66,349.23], bass:[130.81,146.83], tempo:640, wave:'sine' },
    premium: { melody:[220,277.18,329.63,415.30,369.99,329.63], bass:[110,164.81], tempo:520, wave:'triangle' },
    cyber: { melody:[196,246.94,293.66,392,493.88,392], bass:[98,146.83], tempo:380, wave:'sawtooth' }
  };

  function ensureCtx(){
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = Number(volume?.value || 35) / 100 * 0.28;
      master.connect(ctx.destination);
    }
  }

  function tone(freq, t, dur, gainVal, type){
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = type;
    osc.frequency.value = freq;
    filter.type = 'lowpass';
    filter.frequency.value = type === 'sawtooth' ? 900 : 1600;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(gainVal, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + dur + 0.08);
    activeNodes.push(osc);
  }

  function stopSynth(){
    clearInterval(timer);
    timer = null;
    activeNodes.forEach(n => { try { n.stop(); } catch(e){} });
    activeNodes = [];
  }

  function startSynth(){
    ensureCtx();
    stopSynth();
    const p = presets[selected] || presets.calm;
    let step = 0;
    function schedule(){
      const now = ctx.currentTime;
      for (let i=0; i<8; i++){
        const t = now + i * (p.tempo / 1000);
        tone(p.melody[(step+i)%p.melody.length], t, p.tempo/1000*0.84, 0.12, p.wave);
        if (i % 2 === 0) tone(p.bass[(step+i)%p.bass.length], t, p.tempo/1000*1.7, 0.075, 'sine');
      }
      step = (step + 8) % p.melody.length;
    }
    schedule();
    timer = setInterval(schedule, p.tempo * 7.2);
  }

  function start(){
    ensureCtx();
    if (fileAudio) {
      fileAudio.volume = Number(volume?.value || 35) / 100;
      fileAudio.loop = true;
      fileAudio.play();
    } else {
      startSynth();
    }
    playing = true;
    btn.classList.add('active');
    btn.textContent = '♪ Музыка включена';
    panel.classList.add('open');
  }

  function stop(){
    stopSynth();
    if (fileAudio) fileAudio.pause();
    playing = false;
    btn.classList.remove('active');
    btn.textContent = '♪ Музыка';
  }

  btn.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (!playing) start();
    else stop();
  });
  close?.addEventListener('click', () => panel.classList.remove('open'));

  choices.forEach(ch => ch.addEventListener('click', () => {
    choices.forEach(x => x.classList.remove('active'));
    ch.classList.add('active');
    selected = ch.dataset.track;
    fileAudio = null;
    if (playing) startSynth();
  }));

  volume?.addEventListener('input', () => {
    const v = Number(volume.value) / 100;
    if (master) master.gain.value = v * 0.28;
    if (fileAudio) fileAudio.volume = v;
  });

  upload?.addEventListener('change', () => {
    const file = upload.files?.[0];
    if (!file) return;
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    fileUrl = URL.createObjectURL(file);
    stopSynth();
    fileAudio = new Audio(fileUrl);
    fileAudio.loop = true;
    fileAudio.volume = Number(volume?.value || 35) / 100;
    choices.forEach(x => x.classList.remove('active'));
    if (playing) fileAudio.play();
  });
})();

// BLACK LABEL: investor calculator upgrade
(function(){
  const cars = document.querySelector('#carsRange');
  const sale = document.querySelector('#saleRange');
  const sub = document.querySelector('#subRange');
  if (!cars || !sale || !sub) return;

  const rub = n => new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₽';
  const unitCost = 20000;

  function set(id, text){ const el = document.querySelector(id); if (el) el.textContent = text; }

  function update(){
    const count = Number(cars.value);
    const salePrice = Number(sale.value);
    const subscription = Number(sub.value);
    const cost = count * unitCost;
    const hardware = count * salePrice;
    const profit = hardware - cost;
    const mrr = count * subscription;
    const arr = mrr * 12;
    const payback = mrr > 0 ? Math.ceil(cost / mrr) : 0;
    const ltv = mrr * 24;
    const margin = hardware > 0 ? Math.round(profit / hardware * 100) : 0;

    set('#carsValue', count);
    set('#saleValue', rub(salePrice));
    set('#subValue', rub(subscription));
    set('#costRevenue', rub(cost));
    set('#hardwareRevenue', rub(hardware));
    set('#grossProfit', rub(profit));
    set('#mrrRevenue', rub(mrr));
    set('#arrRevenue', rub(arr));
    set('#payback', payback + ' мес.');
    set('#ltvRevenue', rub(ltv));
    set('#grossMargin', margin + '%');
    set('#calcNote', `При ${count} машинах: ${rub(mrr)} MRR, ${rub(arr)} ARR, LTV за 24 месяца — ${rub(ltv)}.`);
  }

  cars.addEventListener('input', update);
  sale.addEventListener('input', update);
  sub.addEventListener('input', update);
  update();
})();

// BLACK LABEL: dynamic feedback information
(function(){
  const live = document.querySelector('#contactLiveCard');
  function updateFromButton(btn){
    if (!live || !btn?.dataset.infoTitle) return;
    live.querySelector('b').textContent = btn.dataset.infoTitle;
    live.querySelector('p').textContent = btn.dataset.infoText;
  }
  document.querySelectorAll('.choice-card[data-info-title]').forEach(btn => {
    btn.addEventListener('click', () => updateFromButton(btn));
  });
})();


// CONTROL CENTER: clear music controls with on/off + quick volume
(function(){
  const oldBtn = document.querySelector('#musicToggle');
  if (!oldBtn) return;
  const btn = oldBtn.cloneNode(true);
  oldBtn.parentNode.replaceChild(btn, oldBtn);

  const panel = document.querySelector('#musicPanel');
  const close = document.querySelector('#closeMusicPanel');
  const playBtn = document.querySelector('#musicPlay');
  const stopBtn = document.querySelector('#musicStop');
  const volume = document.querySelector('#musicVolume');
  const upload = document.querySelector('#musicUpload');
  const presets = document.querySelectorAll('[data-volume]');

  let ctx, master, timer, playing = false, fileAudio = null, fileUrl = null, nodes = [];
  const melody = [261.63, 329.63, 392, 493.88, 440, 392, 329.63, 293.66];
  const bass = [130.81, 146.83, 164.81, 196];

  function ensure(){
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = Number(volume?.value || 45) / 100 * 0.42;
      master.connect(ctx.destination);
    }
  }
  function tone(freq, t, dur, gainVal){
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = 'sine';
    filter.type = 'lowpass';
    filter.frequency.value = 1800;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(gainVal, t + .04);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(filter); filter.connect(gain); gain.connect(master);
    osc.start(t); osc.stop(t + dur + .1);
    nodes.push(osc);
  }
  function startSynth(){
    ensure();
    clearInterval(timer);
    let step = 0;
    function schedule(){
      const now = ctx.currentTime;
      for (let i=0;i<8;i++){
        const t = now + i*.46;
        tone(melody[(step+i)%melody.length], t, .42, .13);
        if (i%2===0) tone(bass[(step+i)%bass.length], t, .95, .085);
      }
      step = (step + 8) % melody.length;
    }
    schedule();
    timer = setInterval(schedule, 3600);
  }
  function play(){
    panel?.classList.add('open');
    if (fileAudio) {
      fileAudio.volume = Number(volume?.value || 45)/100;
      fileAudio.loop = true;
      fileAudio.play();
    } else startSynth();
    playing = true;
    btn.classList.add('active');
    btn.textContent = '♪ Выключить';
  }
  function stop(){
    clearInterval(timer);
    nodes.forEach(n => {try{n.stop()}catch(e){}});
    nodes = [];
    if (fileAudio) fileAudio.pause();
    playing = false;
    btn.classList.remove('active');
    btn.textContent = '♪ Музыка';
  }
  btn.addEventListener('click', () => playing ? stop() : play());
  playBtn?.addEventListener('click', play);
  stopBtn?.addEventListener('click', stop);
  close?.addEventListener('click', () => panel?.classList.remove('open'));
  presets.forEach(p => p.addEventListener('click', () => {
    presets.forEach(x=>x.classList.remove('active'));
    p.classList.add('active');
    if (volume) volume.value = p.dataset.volume;
    if (master) master.gain.value = Number(p.dataset.volume)/100 * .42;
    if (fileAudio) fileAudio.volume = Number(p.dataset.volume)/100;
  }));
  volume?.addEventListener('input', () => {
    if (master) master.gain.value = Number(volume.value)/100 * .42;
    if (fileAudio) fileAudio.volume = Number(volume.value)/100;
  });
  upload?.addEventListener('change', () => {
    const f = upload.files?.[0];
    if (!f) return;
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    fileUrl = URL.createObjectURL(f);
    clearInterval(timer);
    fileAudio = new Audio(fileUrl);
    fileAudio.loop = true;
    fileAudio.volume = Number(volume?.value || 45)/100;
    if (playing) fileAudio.play();
  });
})();

// CONTROL CENTER: phone working action buttons
document.querySelectorAll('[data-phone-action]').forEach(btn => {
  btn.addEventListener('click', () => {
    const feed = document.querySelector('#phoneFeed');
    const map = {
      lock:'Запуск заблокирован вручную',
      route:'Маршрут отправлен близким',
      report:'Отчёт сформирован в приложении',
      sos:'SOS‑сценарий подготовлен'
    };
    if (feed) feed.insertAdjacentHTML('afterbegin', `<p><b>Сейчас</b> ${map[btn.dataset.phoneAction]}</p>`);
  });
});

// CONTROL CENTER: fleet quick actions
document.querySelectorAll('[data-fleet-action]').forEach(btn => {
  btn.addEventListener('click', () => {
    const box = document.querySelector('.dash-alerts');
    const map = {notify:'Диспетчер уведомлён', lock:'Команда блокировки создана', pdf:'PDF‑отчёт сформирован'};
    if (box) box.insertAdjacentHTML('beforeend', `<p><b>Действие</b><span>${map[btn.dataset.fleetAction]}</span></p>`);
  });
});

// CONTROL CENTER: calc presets and extended formula
(function(){
  const cars = document.querySelector('#carsRange');
  const sale = document.querySelector('#saleRange');
  const sub = document.querySelector('#subRange');
  const term = document.querySelector('#termRange');
  const conv = document.querySelector('#convRange');
  if (!cars || !sale || !sub || !term || !conv) return;
  const rub = n => new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₽';
  const unitCost = 20000;
  function set(id, v){const el=document.querySelector(id); if(el) el.textContent=v;}
  function update(){
    const count=+cars.value, salePrice=+sale.value, subscription=+sub.value, months=+term.value, conversion=+conv.value/100;
    const cost=count*unitCost, hardware=count*salePrice, profit=hardware-cost, mrr=count*subscription, arr=mrr*12, payback=Math.ceil(cost/Math.max(mrr,1));
    const ltv=mrr*months, margin=Math.round(profit/Math.max(hardware,1)*100), expected=Math.round(count*conversion), expectedMrr=expected*subscription;
    set('#carsValue', count); set('#saleValue', rub(salePrice)); set('#subValue', rub(subscription)); set('#termValue', months+' мес.'); set('#convValue', Math.round(conversion*100)+'%');
    set('#costRevenue', rub(cost)); set('#hardwareRevenue', rub(hardware)); set('#grossProfit', rub(profit)); set('#mrrRevenue', rub(mrr)); set('#arrRevenue', rub(arr)); set('#payback', payback+' мес.');
    set('#ltvRevenue', rub(ltv)); set('#grossMargin', margin+'%'); set('#expectedClients', expected); set('#expectedMrr', rub(expectedMrr));
    set('#calcNote', `Сценарий: ${count} машин, ${rub(subscription)} подписка, ${months} мес. LTV = ${rub(ltv)}. При конверсии ${Math.round(conversion*100)}% ожидаемый MRR = ${rub(expectedMrr)}.`);
  }
  [cars,sale,sub,term,conv].forEach(el=>el.addEventListener('input', update));
  document.querySelectorAll('[data-calc-preset]').forEach(btn=>btn.addEventListener('click',()=>{
    const p=btn.dataset.calcPreset;
    if(p==='startup'){cars.value=50;sale.value=35000;sub.value=5000;term.value=18;conv.value=25}
    if(p==='fleet'){cars.value=300;sale.value=42000;sub.value=6500;term.value=24;conv.value=40}
    if(p==='scale'){cars.value=1500;sale.value=50000;sub.value=8000;term.value=36;conv.value=55}
    update();
  }));
  update();
})();


// INVESTOR SUITE: device modes
document.querySelectorAll('[data-device-mode]').forEach(btn => {
  btn.addEventListener('click', () => {
    const text = {
      safe:'Безопасный режим: водитель допущен, алкотест пройден, GPS и камера активны.',
      guard:'Охрана: запуск заблокирован, геозона активна, события отправляются владельцу.',
      demo:'Демо инвестору: показываем устройство, приложение, экономику, автопарк и подписку.',
      service:'Диагностика: камеры, GPS, SIM, алкотестер и датчик удара проверяются системой.'
    }[btn.dataset.deviceMode];
    const box = document.querySelector('#deviceModeText');
    if (box) box.textContent = text;
  });
});

// INVESTOR SUITE: video demo
(function(){
  const stage = document.querySelector('#videoStage');
  const caption = document.querySelector('#videoCaption');
  const scenes = {
    driver:'МИГ проверяет водителя: лицо, отпечаток, алкотест и состояние перед поездкой.',
    crash:'При ДТП система сохраняет видео, готовит координаты и запускает SOS‑сценарий.',
    fleet:'Автопарк получает событие: машина, водитель, риск, отчёт и API‑уведомление.'
  };
  document.querySelector('#videoPlay')?.addEventListener('click',()=>stage?.classList.add('playing'));
  document.querySelector('#videoPause')?.addEventListener('click',()=>stage?.classList.remove('playing'));
  document.querySelectorAll('[data-video-scene]').forEach(btn=>btn.addEventListener('click',()=>{
    if (caption) caption.textContent = scenes[btn.dataset.videoScene];
    stage?.classList.add('playing');
  }));
})();

// INVESTOR SUITE: cabinet tabs
(function(){
  const tabs = document.querySelectorAll('.cab-tab');
  const screens = document.querySelectorAll('[data-cab-screen]');
  function show(name){
    tabs.forEach(t=>t.classList.toggle('active', t.dataset.cab===name));
    screens.forEach(s=>s.classList.toggle('active', s.dataset.cabScreen===name));
  }
  tabs.forEach(t=>t.addEventListener('click',()=>show(t.dataset.cab)));
})();

// INVESTOR SUITE: news filters
(function(){
  const filters = document.querySelectorAll('.news-filter');
  const cards = document.querySelectorAll('[data-news-card]');
  filters.forEach(f=>f.addEventListener('click',()=>{
    filters.forEach(x=>x.classList.remove('active'));
    f.classList.add('active');
    const type=f.dataset.news;
    cards.forEach(c=>{
      c.style.display = (type==='all' || c.dataset.newsCard===type) ? '' : 'none';
    });
  }));
})();

// INVESTOR SUITE: extended calculator additions
(function(){
  const commission = document.querySelector('#commissionRange');
  const marketing = document.querySelector('#marketingRange');
  const sub = document.querySelector('#subRange');
  const cars = document.querySelector('#carsRange');
  const rub = n => new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₽';
  function set(id, v){const el=document.querySelector(id); if(el) el.textContent=v;}
  function updateExtra(){
    if (!commission || !marketing || !sub || !cars) return;
    const comm=+commission.value/100, mkt=+marketing.value, mrr=+cars.value * +sub.value;
    set('#commissionValue', Math.round(comm*100)+'%');
    set('#marketingValue', rub(mkt));
    set('#partnerCommission', rub(mrr*comm));
    set('#netMrr', rub(mrr - mrr*comm - mkt));
  }
  [commission,marketing,sub,cars].forEach(el=>el?.addEventListener('input',updateExtra));
  updateExtra();
})();


// COMPACT YOUTUBE: smoother compact interactions
document.querySelectorAll('.news-card, .feature, .stat, .value-card, .package-card').forEach(card => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `translateY(-3px) rotateX(${-y*2}deg) rotateY(${x*2}deg)`;
  });
  card.addEventListener('pointerleave', () => card.style.transform = '');
});


// MOBILE REBUILD: descriptions for clean app
(function(){
  const desc = {
    home:['Главная','Сводка безопасности, быстрые действия и последние события.'],
    driver:['Водитель','Допуск, биометрия, алкотест, рейтинг и история поездок.'],
    map:['Карта','Маршрут, геозона, передача близким и статус риска.'],
    fleet:['Автопарк','B2B‑сводка машин, тревог, индекса и быстрых отчётов.'],
    video:['Видео','Передняя камера, салон, события и экспорт фрагментов.'],
    sos:['SOS','Экстренный сценарий: GPS, контакты, видео и помощь.'],
    support:['Поддержка','Чат, оператор, сервис и заявки по устройству.'],
    profile:['Профиль','Аккаунт, роли доступа, статистика и подписка.']
  };
  document.querySelectorAll('.app-tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const d=desc[btn.dataset.screen];
      const t=document.querySelector('#phoneScreenTitle');
      const p=document.querySelector('#phoneScreenDesc');
      if(d&&t&&p){t.textContent=d[0];p.textContent=d[1];}
    });
  });
})();

// Fleet actions: write inside log, not full page
document.querySelectorAll('[data-fleet-action]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopImmediatePropagation();
    const log = document.querySelector('#fleetActionLog');
    const map = {notify:'Диспетчер уведомлён', lock:'Команда блокировки создана', pdf:'PDF‑отчёт сформирован'};
    if (log) log.insertAdjacentHTML('beforeend', `<p><b>Сейчас</b> · ${map[btn.dataset.fleetAction]}</p>`);
  }, true);
});

// Ensure no music starts automatically
window.addEventListener('load', () => {
  const btn = document.querySelector('#musicToggle');
  if (btn) {
    btn.classList.remove('active');
    btn.textContent = '♪ Музыка';
  }
});


// FINAL CLEAN: music never starts from header; header only opens panel
(function(){
  const oldBtn = document.querySelector('#musicToggle');
  if (!oldBtn) return;
  const btn = oldBtn.cloneNode(true);
  oldBtn.parentNode.replaceChild(btn, oldBtn);

  const panel = document.querySelector('#musicPanel');
  const close = document.querySelector('#closeMusicPanel');
  const playBtn = document.querySelector('#musicPlay');
  const stopBtn = document.querySelector('#musicStop');
  const volume = document.querySelector('#musicVolume');
  const upload = document.querySelector('#musicUpload');
  const presets = document.querySelectorAll('[data-volume]');

  let ctx, master, timer, playing = false, fileAudio = null, fileUrl = null, nodes = [];
  const melody = [261.63, 329.63, 392, 493.88, 440, 392, 329.63, 293.66];
  const bass = [130.81, 146.83, 164.81, 196];

  function ensure(){
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = Number(volume?.value || 35) / 100 * 0.42;
      master.connect(ctx.destination);
    }
  }
  function tone(freq,t,dur,g){
    const osc=ctx.createOscillator(), gain=ctx.createGain(), filter=ctx.createBiquadFilter();
    osc.type='sine'; osc.frequency.value=freq; filter.type='lowpass'; filter.frequency.value=1600;
    gain.gain.setValueAtTime(0.0001,t); gain.gain.exponentialRampToValueAtTime(g,t+.04); gain.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    osc.connect(filter); filter.connect(gain); gain.connect(master); osc.start(t); osc.stop(t+dur+.1); nodes.push(osc);
  }
  function startSynth(){
    ensure(); clearInterval(timer);
    let step=0;
    function schedule(){
      const now=ctx.currentTime;
      for(let i=0;i<8;i++){ const t=now+i*.5; tone(melody[(step+i)%melody.length],t,.44,.11); if(i%2===0) tone(bass[(step+i)%bass.length],t,.95,.07); }
      step=(step+8)%melody.length;
    }
    schedule(); timer=setInterval(schedule,3900);
  }
  function play(){
    if(fileAudio){ fileAudio.volume=Number(volume?.value||35)/100; fileAudio.loop=true; fileAudio.play(); }
    else startSynth();
    playing=true; btn.classList.add('active'); btn.textContent='♪ Музыка играет';
  }
  function stop(){
    clearInterval(timer); nodes.forEach(n=>{try{n.stop()}catch(e){}}); nodes=[];
    if(fileAudio) fileAudio.pause();
    playing=false; btn.classList.remove('active'); btn.textContent='♪ Музыка';
  }

  btn.addEventListener('click', () => panel?.classList.toggle('open'));
  playBtn?.addEventListener('click', play);
  stopBtn?.addEventListener('click', stop);
  close?.addEventListener('click', () => panel?.classList.remove('open'));
  presets.forEach(p=>p.addEventListener('click',()=>{
    presets.forEach(x=>x.classList.remove('active')); p.classList.add('active');
    if(volume) volume.value=p.dataset.volume;
    if(master) master.gain.value=Number(p.dataset.volume)/100*.42;
    if(fileAudio) fileAudio.volume=Number(p.dataset.volume)/100;
  }));
  volume?.addEventListener('input',()=>{ if(master) master.gain.value=Number(volume.value)/100*.42; if(fileAudio) fileAudio.volume=Number(volume.value)/100; });
  upload?.addEventListener('change',()=>{
    const f=upload.files?.[0]; if(!f) return;
    if(fileUrl) URL.revokeObjectURL(fileUrl);
    fileUrl=URL.createObjectURL(f); clearInterval(timer); nodes.forEach(n=>{try{n.stop()}catch(e){}});
    fileAudio=new Audio(fileUrl); fileAudio.loop=true; fileAudio.volume=Number(volume?.value||35)/100;
    if(playing) fileAudio.play();
  });

  stop();
})();

// FINAL CLEAN: more phone actions
document.querySelectorAll('[data-phone-action]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopImmediatePropagation();
    const feed = document.querySelector('#phoneFeed');
    const map = {
      lock:'Запуск заблокирован',
      route:'Маршрут отправлен близким',
      report:'Отчёт сформирован',
      sos:'SOS‑сценарий готов',
      guard:'Охрана усилена',
      video:'Видео сохранено',
      family:'Семейный доступ открыт',
      service:'Диагностика запущена'
    };
    if (feed) feed.insertAdjacentHTML('afterbegin', `<p><b>Сейчас</b> ${map[btn.dataset.phoneAction] || 'Действие выполнено'}</p>`);
  }, true);
})();
