(() => {
  document.documentElement.classList.add('js');
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const key = `travel:${document.body.dataset.trip}:v1`;
  let state = { checks: {}, saved: [], budget: {} }, storageFailed = false;
  const storageError = () => { storageFailed = true; $('#storage-feedback').textContent = '이 브라우저에서 저장할 수 없습니다. 입력값은 현재 화면에만 유지되며, 새로고침하면 사라질 수 있습니다.'; };
  try {
    const raw = JSON.parse(localStorage.getItem(key) || 'null');
    if (raw && typeof raw === 'object') {
      if (raw.checks && typeof raw.checks === 'object' && !Array.isArray(raw.checks)) state.checks = raw.checks;
      if (Array.isArray(raw.saved)) state.saved = raw.saved.filter(x => typeof x === 'string');
      if (raw.budget && typeof raw.budget === 'object' && !Array.isArray(raw.budget)) state.budget = raw.budget;
    }
  } catch { storageError(); }
  const persist = () => { try { localStorage.setItem(key, JSON.stringify(state)); } catch { storageError(); } };
  const nav = $$('.section-nav a');
  const currentNav = id => nav.forEach(a => { if (a.hash === `#${id}`) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
  const followHash = (focus = false) => { const id = location.hash.slice(1); const target = document.getElementById(id); if (nav.some(a => a.hash === `#${id}`) && target) { currentNav(id); if (focus) target.focus({ preventScroll: true }); } };
  nav.forEach(a => a.addEventListener('click', () => { currentNav(a.hash.slice(1)); setTimeout(() => document.querySelector(a.hash)?.focus({ preventScroll: true }), 0); }));
  window.addEventListener('hashchange', () => followHash(true));
  followHash();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { const visible = entries.filter(x => x.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio); if (visible[0]) currentNav(visible[0].target.id); }, { rootMargin: '-10% 0px -65% 0px', threshold: [0,.1] });
    $$('main > .section').forEach(s => observer.observe(s));
  }
  const clock = () => { try { const now = new Date(); const zone = document.body.dataset.timezone; $('#local-clock').textContent = `현지 ${new Intl.DateTimeFormat('ko-KR', {timeZone:zone,month:'numeric',day:'numeric',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).format(now)} · 한국 ${new Intl.DateTimeFormat('ko-KR', {timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',hour12:false}).format(now)}`; } catch { $('#local-clock').textContent = '현지 시각을 표시할 수 없습니다. 일정의 시간대 안내를 확인하세요.'; } };
  clock(); setInterval(clock, 60000);
  $$('[data-day]').forEach(b => b.addEventListener('click', () => { $$('[data-day]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); $$('[data-schedule-date]').forEach(d => d.hidden = b.dataset.day !== 'all' && d.dataset.scheduleDate !== b.dataset.day); }));
  let category = 'all';
  const places = $$('.places-grid .place');
  const filterPlaces = () => {
    const query = $('#place-search').value.trim().toLocaleLowerCase(); let count = 0;
    places.forEach(p => { const match = (!query || p.dataset.search.toLocaleLowerCase().includes(query)) && (category === 'all' || (category === 'saved' ? state.saved.includes(p.dataset.place) : p.dataset.category === category)); p.hidden = !match; if (match) count++; });
    $('#place-count').textContent = `${count}개 장소`; $('#no-places').hidden = count > 0;
  };
  $('#place-search').addEventListener('input', filterPlaces);
  $$('[data-category-filter]').forEach(b => b.addEventListener('click', () => { category = b.dataset.categoryFilter; $$('[data-category-filter]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); filterPlaces(); }));
  const updateSaved = () => $$('[data-save]').forEach(b => { const saved = state.saved.includes(b.dataset.save); b.setAttribute('aria-pressed', String(saved)); b.textContent = saved ? '저장됨' : '저장'; });
  updateSaved();
  $$('[data-save]').forEach(b => b.addEventListener('click', () => { const id = b.dataset.save; state.saved = state.saved.includes(id) ? state.saved.filter(x => x !== id) : [...state.saved,id]; updateSaved(); persist(); filterPlaces(); }));
  let mapTrigger;
  $$('[data-map]').forEach(b => b.addEventListener('click', () => {
    mapTrigger = b; const panel = $('#map-panel'); $('#map-title').textContent = b.dataset.mapName;
    const frame = document.createElement('iframe'); frame.title = `${b.dataset.mapName} Google 지도`; frame.referrerPolicy = 'no-referrer'; frame.loading = 'lazy'; frame.src = `https://maps.google.com/maps?q=${encodeURIComponent(b.dataset.map)}&output=embed`; frame.allowFullscreen = true;
    $('#map-frame').replaceChildren(frame); panel.hidden = false; panel.scrollIntoView({ block: 'start' }); panel.focus({ preventScroll: true });
  }));
  $('#close-map').addEventListener('click', () => { $('#map-panel').hidden = true; $('#map-frame').replaceChildren(); mapTrigger?.focus(); });
  const checks = $$('[data-check]');
  const updateChecks = () => { let count = 0; checks.forEach(c => { c.checked = state.checks[c.dataset.check] === true; if(c.checked) count++; }); $('#check-progress').textContent = `${count} / ${checks.length} 완료`; $('#check-meter').value = count; };
  updateChecks(); checks.forEach(c => c.addEventListener('change', () => { state.checks[c.dataset.check] = c.checked; updateChecks(); persist(); }));
  let undo;
  $('#reset-checks').addEventListener('click', () => { undo = {...state.checks}; state.checks = {}; updateChecks(); persist(); $('#undo-checks').hidden = false; $('#check-feedback').textContent = '체크를 모두 해제했습니다.'; });
  $('#undo-checks').addEventListener('click', () => { state.checks = undo || {}; updateChecks(); persist(); $('#undo-checks').hidden = true; $('#check-feedback').textContent = '이전 체크 상태를 복원했습니다.'; $('#reset-checks').focus(); });
  const money = n => `${new Intl.NumberFormat('ko-KR',{maximumFractionDigits:0}).format(n)}원`;
  const valid = v => v !== '' && v !== null && v !== undefined && Number.isFinite(Number(v)) && Number(v) >= 0 && Number(v) <= 1e9;
  const validWon = v => valid(v) && Number.isInteger(Number(v));
  const budgets = $$('[data-budget]');
  budgets.forEach(i => { const v = state.budget[i.dataset.budget]; i.value = validWon(v) ? v : ''; });
  const budget = () => {
    let plan = 0, spent = 0, plans = 0, spends = 0, paired = 0, remaining = 0;
    $$('.budget-row').forEach(row => { const [a,b] = [...row.querySelectorAll('input')]; const av = validWon(a.value), bv = validWon(b.value); if(av){plan+=Number(a.value);plans++;} if(bv){spent+=Number(b.value);spends++;} if(av&&bv){remaining+=Number(a.value)-Number(b.value);paired++;} });
    $('#budget-plan').textContent = plans ? money(plan) : '금액을 입력하세요';
    $('#budget-spent').textContent = spends ? money(spent) : '미입력';
    $('#budget-coverage').textContent = plans ? `${plans} / ${$$('.budget-row').length}개 계획 입력 · ${plans === $$('.budget-row').length ? '전체' : '부분'} 합계` : '입력한 항목만 합산합니다.';
    $('#budget-remaining').textContent = paired ? `${money(remaining)} (${paired}개 항목)` : '계획·사용 입력 필요';
  };
  budget(); budgets.forEach(i => i.addEventListener('input', () => { const invalid = i.value !== '' && !validWon(i.value); i.setAttribute('aria-invalid', String(invalid)); i.setCustomValidity(invalid ? '0~10억 원 사이 정수 금액을 입력하세요.' : ''); state.budget[i.dataset.budget] = validWon(i.value) ? i.value : ''; $('#budget-error').textContent = budgets.some(x => x.getAttribute('aria-invalid') === 'true') ? '0~10억 원 사이 정수 금액을 입력하세요. 잘못된 금액은 합계에서 제외됩니다.' : ''; budget(); persist(); }));
  const convert = () => { const a = $('#usd-amount').value, r = $('#usd-rate').value; $('#converted-amount').textContent = valid(a) && valid(r) && Number(r)>0 ? money(Number(a)*Number(r)) : '금액과 적용 환율을 입력하세요.'; };
  ['#usd-amount','#usd-rate'].forEach(s => $(s).addEventListener('input',convert));
  if (storageFailed) storageError();
})();
