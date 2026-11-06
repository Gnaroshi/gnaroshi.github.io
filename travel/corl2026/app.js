const travelAgenda = function createAgendaRenderer({escape: e, pin, fallbackLink}) {
 const minute = clock => {
  const [hours, minutes] = clock.split(':').map(Number);
  return hours * 60 + minutes;
 };
 const clock = minutes => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
 const timeRange = ([start, end]) => `${clock(start)}–${clock(end)}`;

 function scheduleEntries(items) {
  return items.map((item, index) => {
   const match = /^(\d{1,2}:[0-5]\d)(?:\s*[–—-]\s*(\d{1,2}:[0-5]\d))?/.exec(item.time);
   const start = match ? minute(match[1]) : Infinity;
   const end = match?.[2] ? minute(match[2]) : start;
   return { item, index, start, end };
  }).sort((a, b) => a.start - b.start || a.index - b.index);
 }

 function agendaSlots(entries) {
  const slots = [];
  let active;
  for (const entry of entries) {
   if (entry.end <= entry.start) {
    slots.push({ entries: [entry] });
    continue;
   }
   if (!active || entry.start >= active.end) {
    active = { entries: [entry], end: entry.end, overlaps: [] };
    slots.push(active);
    continue;
   }
   const end = Math.min(active.end, entry.end);
   const last = active.overlaps.at(-1);
   if (last && entry.start <= last[1]) last[1] = Math.max(last[1], end);
   else active.overlaps.push([entry.start, end]);
   active.entries.push(entry);
   active.end = Math.max(active.end, entry.end);
  }
  return slots;
 }

 function agendaItem(entry, date, venues, { sharedTime = false, track = '', hours = false } = {}) {
  const { item, index } = entry;
  const venue = venues.find(v => v.id === item.venue);
  const location = item.location || venue?.shortName || venue?.name;
  const locationMarkup = venue && !hours
   ? `<button class="venue-link" data-open-place="${e(venue.id)}">${pin}${e(location)}</button>`
   : location ? `<span class="venue-link">${e(location)}</span>` : '';
  const zone = item.zone ? `<span class="event-zone">${e(item.zone)}</span>` : '';
  const time = sharedTime ? '' : `<div class="event-time">${e(item.time)}${zone}${track}</div>`;
  const badge = item.personal ? `<span class="event-personal">${e(item.personal)}</span>` : '';
  const fallback = fallbackLink ? `<noscript><p>${e(item.note||'')}</p>${fallbackLink(item.url,item.linkLabel||'공식 일정')}</noscript>` : '';
  const arrival = item.arrival ? `<p class="event-arrival">${e(item.arrival)}</p>` : '';
  const content = `<div class="event-content"><h4><button class="event-select" data-event="${e(date)}/${index}">${e(item.title)}</button></h4>${arrival}${badge}${locationMarkup}${fallback}</div>`;
  return `<li class="agenda-event"${item.personal?' data-personal-event':''}>${time}${content}</li>`;
 }

 function agendaSlot(slot, date, venues, index) {
  if (slot.entries.length === 1) return agendaItem(slot.entries[0], date, venues);
  const first = slot.entries[0];
  const simultaneous = slot.entries.every(entry => entry.start === first.start && entry.end === first.end);
  const label = simultaneous ? '동시 진행' : '겹치는 시간';
  const overlap = slot.overlaps.map(timeRange).join(' · ');
  const duration = slot.end - first.start;
  const rows = slot.entries.map(entry => {
   if (simultaneous) return agendaItem(entry, date, venues, { sharedTime: true });
   const start = ((entry.start - first.start) / duration * 100).toFixed(2);
   const width = ((entry.end - entry.start) / duration * 100).toFixed(2);
   const track = `<span class="overlap-track" aria-hidden="true"><span style="--start:${start}%;--duration:${width}%"></span></span>`;
   return agendaItem(entry, date, venues, { track });
  }).join('');
  return `<li class="agenda-overlap" data-slot="${index}" data-overlap="${simultaneous ? 'same' : 'partial'}"><div class="overlap-heading"><span>${label}</span><strong>${overlap}</strong></div><ul class="overlap-events">${rows}</ul></li>`;
 }

 function personalClashes(slot) {
  const times = new Set();
  for (const personal of slot.entries.filter(entry => entry.item.personal)) {
   for (const official of slot.entries.filter(entry => !entry.item.personal)) {
    const start = Math.max(personal.start, official.start);
    const end = Math.min(personal.end, official.end);
    if (start < end) times.add(timeRange([start, end]));
   }
  }
  return [...times].sort();
 }

 return function dayAgenda(day, venues) {
  if (day.travel) {
   const rows = day.items.map((item,index) => agendaItem({item,index},day.date,venues)).join('');
   return `<p class="travel-day-note">${e(day.notice)}</p><ol class="timeline" aria-label="이동 순서">${rows}</ol>`;
  }
  const entries = scheduleEntries(day.items);
  const hours = entries.filter(({item}) => item.kind === 'hours');
  const sessions = entries.filter(({item}) => item.kind !== 'hours');
  const slots = agendaSlots(sessions);
  const clashes = slots.flatMap((slot,index) => personalClashes(slot).map(time => `<button type="button" class="button quiet" data-jump-slot="${index}">${time}</button>`));
  const overview = clashes.length ? `<div class="agenda-clashes"><strong>학회 일정과 겹침</strong><div>${clashes.join('')}</div></div>` : '';
  const operations = hours.length ? `<section class="agenda-hours" aria-label="현장 운영시간"><h4>현장 운영시간</h4><ul>${hours.map(entry => agendaItem(entry, day.date, venues, { hours: true })).join('')}</ul></section>` : '';
  const timeline = slots.length ? `<ol class="timeline" aria-label="시간순 일정">${slots.map((slot,index) => agendaSlot(slot, day.date, venues,index)).join('')}</ol>` : '';
  return overview + operations + timeline;
 };
};
const travelPin = "<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z\"/><circle cx=\"12\" cy=\"10\" r=\"2.5\"/></svg>";
(() => {
 'use strict';
 const $ = (s, root=document) => root.querySelector(s);
 const $$ = (s, root=document) => [...root.querySelectorAll(s)];
 const trip = JSON.parse($('#trip-data').textContent);
 const allPlaces = new Map([...trip.venues,...trip.places].map(p=>[p.id,p]));
 const destinations = new Set(trip.places.filter(p=>p.status!=='closed').map(p=>p.id));
 const days = new Set(trip.schedule.map(d=>d.date));
 const storageKey = `travel:${trip.id}:v1`;
 const plannerKey = `travel:${trip.id}:planner:v1`;
 const validAmount = v => v!=='' && v!==null && v!==undefined && Number.isFinite(Number(v)) && Number(v)>=0 && Number(v)<=1e9;
 const validWon = v => validAmount(v) && Number.isInteger(Number(v));
 const timeValid = v => /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
 const e = v => String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const money = v => validAmount(v) ? new Intl.NumberFormat('ko-KR',{maximumFractionDigits:0}).format(Number(v)) : '—';
 let state={checks:{},saved:[],budget:{},plan:{},theme:null};
 let storageUnavailable=false;
 function storageWarning(message) { $('#storage-warning').textContent=message; $('#storage-warning').hidden=false; }
 try {
  const saved=localStorage.getItem(storageKey);
  let raw;
  try { raw=saved?JSON.parse(saved):null; } catch { storageWarning('저장된 내용을 읽지 못했습니다. 새 입력부터 다시 저장합니다.'); }
  if(raw&&typeof raw==='object') {
   for(const c of trip.checklist) if(raw.checks?.[c.id]===true)state.checks[c.id]=true;
   if(Array.isArray(raw.saved))state.saved=[...new Set(raw.saved.filter(id=>destinations.has(id)))];
   for(let i=0;i<trip.budgetCategories.length;i++)for(const k of ['plan','spent']){const key=`${i}-${k}`;if(validWon(raw.budget?.[key]))state.budget[key]=String(raw.budget[key]);}
   for(const day of days)if(Array.isArray(raw.plan?.[day]))state.plan[day]=raw.plan[day].filter((p,i,a)=>p&&destinations.has(p.id)&&a.findIndex(x=>x?.id===p.id)===i).map(p=>({id:p.id,time:timeValid(p.time)?p.time:''}));
   if(['light','dark'].includes(raw.theme))state.theme=raw.theme;
  }
  let planner;
  try{planner=JSON.parse(localStorage.getItem(plannerKey)||'null');}catch{storageWarning('저장된 방문 일정을 읽지 못했습니다. 새 입력부터 다시 저장합니다.');}
  if(planner&&typeof planner==='object'){
   for(const day of days)if(Array.isArray(planner.plan?.[day]))state.plan[day]=planner.plan[day].filter((p,i,a)=>p&&destinations.has(p.id)&&a.findIndex(x=>x?.id===p.id)===i).map(p=>({id:p.id,time:timeValid(p.time)?p.time:''}));
   if(['light','dark'].includes(planner.theme))state.theme=planner.theme;
  }
 } catch { storageUnavailable=true;storageWarning('저장이 차단되어 있습니다. 입력은 현재 화면에서만 유지됩니다.'); }
 function persist() { try { localStorage.setItem(storageKey,JSON.stringify({checks:state.checks,saved:state.saved,budget:state.budget}));localStorage.setItem(plannerKey,JSON.stringify({plan:state.plan,theme:state.theme})); } catch { storageUnavailable=true;storageWarning('저장이 차단되어 있습니다. 입력은 현재 화면에서만 유지됩니다.'); } }
 const ui={view:'schedule',day:days.has(trip.start)?trip.start:trip.schedule[0]?.date,agenda:'conference',category:'all',query:'',savedOnly:false,place:trip.places.find(p=>p.status!=='closed')?.id,placeOpen:false,detailPushed:false,placeMode:'list',group:$('#check-group').value,checkFilter:'pending',resource:'essentials'};
 const publicAgenda=new Map(trip.schedule.map(day=>[day.date,day]));
 let publicDay=ui.day;
 const dateBar=$('.date-bar');
 let visibleAgenda=publicAgenda;
 const renderAgenda=travelAgenda({escape:e,pin:travelPin});
 const mine = mountMine();
 const scrolls={};
 const closeIcon=$('[data-close-dialog]').innerHTML;
 let modalTrigger=null,editIndex=null;
 function closeDialog(dialog,forNavigation=false) { if(dialog?.open){if(forNavigation)dialog.dataset.navigationClose='true';dialog.close();} }
 function showDialog(dialog,trigger) { modalTrigger=trigger||document.activeElement; if(!dialog.open)dialog.showModal(); }
 $$('dialog').forEach(dialog=>{
  dialog.addEventListener('click',ev=>{if(ev.target===dialog){const r=dialog.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)closeDialog(dialog);}});
  dialog.addEventListener('close',()=>{
   const navigationClose=dialog.dataset.navigationClose==='true';delete dialog.dataset.navigationClose;
   $$('iframe',dialog).forEach(f=>f.remove());delete $('#detail-body').dataset.mounted;
   if(!navigationClose&&dialog.id==='detail-dialog'&&ui.view==='places'&&ui.placeOpen){ui.placeOpen=false;if(ui.detailPushed){ui.detailPushed=false;history.back();}else history.replaceState(null,'',routeHash());}
   if(!navigationClose&&modalTrigger?.isConnected&&!modalTrigger.closest('[hidden]'))modalTrigger.focus({preventScroll:true});
  });
 });
 $$('[data-close-dialog]').forEach(b=>b.addEventListener('click',()=>closeDialog(b.closest('dialog'))));
 function setTheme(theme) { state.theme=theme;document.documentElement.dataset.theme=theme;$('#theme-toggle').setAttribute('aria-label',theme==='dark'?'밝은 화면으로 전환':'어두운 화면으로 전환'); }
 setTheme(state.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
 $('#theme-toggle').addEventListener('click',()=>{setTheme(state.theme==='dark'?'light':'dark');persist();});
 ['storage-info','resources-storage'].forEach(id=>$(`#${id}`).addEventListener('click',ev=>showDialog($('#info-dialog'),ev.currentTarget)));
 const desktop=()=>matchMedia('(min-width: 1001px)').matches;
 function scrollKey(el) {
  const view=el.dataset.scroll;
  return view==='schedule'?`schedule/${ui.day}/${ui.agenda}`:view;
 }
 function captureScroll() { $$('[data-scroll]',$(`#${ui.view}`)).forEach(el=>scrolls[scrollKey(el)]=el.scrollTop); }
 function addTravelDay(day) {
  const button=document.createElement('button');
  const [year,month,dayOfMonth]=day.date.split('-').map(Number);
  const weekday=new Intl.DateTimeFormat('ko-KR',{weekday:'long',timeZone:'UTC'}).format(new Date(Date.UTC(year,month-1,dayOfMonth)));
  button.type='button';
  button.dataset.day=day.date;
  button.setAttribute('data-travel-day','');
  button.setAttribute('aria-label',`${month}월 ${dayOfMonth}일 ${weekday} · ${day.title}`);
  button.innerHTML=`<span>${e(day.shortLabel||'이동')}</span><strong>${dayOfMonth}</strong>`;
  const next=$$('[data-day]',dateBar).find(item=>item.dataset.day>day.date)||$('.date-month',dateBar);
  dateBar.insertBefore(button,next);
  const article=document.createElement('article');
  article.className='day-agenda';
  article.dataset.scheduleDate=day.date;
  article.hidden=true;
  const host=document.createElement('div');
  host.setAttribute('data-day-items','');
  article.append(host);
  $('#conference-agenda').append(article);
 }
 function setPersonalAgenda(overlays,unlocked) {
  const next=new Map(publicAgenda);
  for(const overlay of overlays){
   if(!overlay||!/^\d{4}-\d{2}-\d{2}$/.test(overlay.date)||!Array.isArray(overlay.items))continue;
   const {date,items}=overlay;
   const day=publicAgenda.get(date);
   if(!day&&!overlay.travel)continue;
   const events=day?day.items.slice():[];
   for(const item of items){
    if(!item||typeof item.personal!=='string')continue;
    if(item.replaces){
     const at=events.findIndex(event=>event.id===item.replaces);
     if(at>=0)events[at]={...events[at],...item};
    }else if(typeof item.title==='string'&&typeof item.time==='string'){
     events.push(item);
    }
   }
   next.set(date,{...(day||overlay),items:events});
  }
  const privateFocus=document.activeElement?.closest('[data-travel-day], [data-lock-guide], [data-private-detail], [data-schedule-date]');
  const resetDay=!next.has(ui.day);
  for(const [date] of visibleAgenda){
   if(next.has(date))continue;
   $(`[data-day="${date}"]`)?.remove();
   $(`[data-schedule-date="${date}"]`)?.remove();
   delete scrolls[`schedule/${date}/conference`];
  }
  for(const [date,day] of next){
   if(day===visibleAgenda.get(date))continue;
   if(!visibleAgenda.has(date))addTravelDay(day);
   const host=$(`[data-schedule-date="${date}"] [data-day-items]`);
   host.innerHTML=renderAgenda(day,trip.venues);
   bindPlaceOpen(host);
  }
  visibleAgenda=next;
  if(resetDay){
   ui.day=publicDay;
   if(ui.view==='schedule')history.replaceState(null,'',routeHash());
  }
  $('#agenda-private-toolbar').hidden=!unlocked;
  if(!unlocked&&$('#detail-body').hasAttribute('data-private-detail')){
   closeDialog($('#detail-dialog'),true);
   $('#detail-body').replaceChildren();
   $('#detail-body').removeAttribute('data-private-detail');
   $('#detail-title').textContent='장소';
   modalTrigger=null;
  }
  updateSchedule();
  if(resetDay&&ui.view==='schedule'){
   $('[data-scroll="schedule"]').scrollTop=scrolls[scrollKey($('[data-scroll="schedule"]'))]||0;
   if(privateFocus)$('[data-day][aria-pressed="true"]')?.focus({preventScroll:true});
  }
 }
 function mountMine() {
  const panel=$('#mine');
  if(!panel)return null;
  const form=$('#mine-form'), password=$('#mine-password'), remember=$('#mine-remember');
  const body=$('#mine-body'), lock=$('#mine-lock'), schedule=$('#mine-schedule'), submit=$('#mine-submit'), status=$('#mine-status');
  const vault=JSON.parse($('#guide-vault').textContent);
  const decode=value=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
  const encoder=new TextEncoder();
  const cipher={name:'AES-GCM',iv:decode(vault.iv),additionalData:encoder.encode(`${trip.id}-guide:v1`),tagLength:128};
  const encrypted=decode(vault.ciphertext);
  const browserCrypto=globalThis.crypto?.subtle;
  const databaseName=`travel:${trip.id}:guide:v1`;
  const channel=typeof BroadcastChannel==='function'?new BroadcastChannel(databaseName):null;
  let active=false, epoch=0, payload=null, unlockedMessage='';
  function note(message){
   status.textContent=message;
   status.hidden=!message;
  }
  function locked(){
   body.replaceChildren();body.hidden=true;
   lock.hidden=true;schedule.hidden=true;form.hidden=false;password.value='';
  }
  function paintGuide(){
   body.innerHTML=payload.html;
   body.hidden=false;form.hidden=true;lock.hidden=false;
   schedule.hidden=payload.days.length===0;
   note(unlockedMessage);
  }
  function opened(guide,message=''){
   payload=guide;unlockedMessage=message;
   setPersonalAgenda(payload.days,true);
   if(active)paintGuide();
  }
  async function keyRecord(mode,operation){
   const db=await new Promise((resolve,reject)=>{
    const open=indexedDB.open(databaseName,1);
    open.onupgradeneeded=()=>open.result.createObjectStore('keys');
    open.onsuccess=()=>resolve(open.result);
    open.onerror=()=>reject(open.error);
   });
   try{
    return await new Promise((resolve,reject)=>{
     const tx=db.transaction('keys',mode);
     const request=operation(tx.objectStore('keys'));
     tx.oncomplete=()=>resolve(request.result);
     tx.onabort=()=>reject(tx.error||request.error);
    });
   }finally{db.close();}
  }
  async function decrypt(key){
   const bytes=await browserCrypto.decrypt(cipher,key,encrypted);
   const text=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
   if(text.startsWith('<'))return {html:text,days:[]};
   const guide=JSON.parse(text);
   if(typeof guide.html!=='string'||!Array.isArray(guide.days))throw new Error('Invalid guide');
   return guide;
  }
  function visit(open){
   if(active===open)return;
   active=open;
   if(open&&payload)paintGuide();
   else locked();
  }
  async function restore(){
   if(!browserCrypto){
    submit.disabled=true;
    note('이 브라우저에서는 안내를 열 수 없습니다. HTTPS 주소를 지원하는 최신 브라우저에서 열어 주세요.');
    return;
   }
   const turn=++epoch;
   submit.disabled=true;
   try{
    const saved=await keyRecord('readonly',db=>db.get('active')).catch(()=>null);
    if(saved?.salt!==vault.salt||turn!==epoch)return;
    const guide=await decrypt(saved.key);
    if(turn===epoch)opened(guide);
   }catch{
    if(turn===epoch)note('기억한 잠금 해제를 사용할 수 없습니다. 비밀번호를 입력해 주세요.');
   }finally{if(turn===epoch)submit.disabled=false;}
  }
  form.addEventListener('submit',async ev=>{
   ev.preventDefault();
   if(submit.disabled||!browserCrypto)return;
   const passphrase=password.value.trim();
   if(!passphrase)return;
   password.value='';
   const turn=++epoch;
   submit.disabled=true;
   note('안내를 여는 중…');
   try{
    const input=await browserCrypto.importKey('raw',encoder.encode(passphrase),'PBKDF2',false,['deriveKey']);
    const key=await browserCrypto.deriveKey({name:'PBKDF2',hash:'SHA-256',salt:decode(vault.salt),iterations:vault.iterations},input,{name:'AES-GCM',length:256},false,['decrypt']);
    const guide=await decrypt(key);
    if(turn!==epoch)return;
    let message='';
    if(remember.checked){
     try{await keyRecord('readwrite',db=>db.put({salt:vault.salt,key},'active'));}
     catch{message='이 브라우저에서 기억하지 못했습니다. 새로고침하면 비밀번호를 다시 입력해야 합니다.';}
    }
    if(turn!==epoch)return;
    opened(guide,message);
    if(active)(guide.days.length?schedule:lock).focus({preventScroll:true});
   }catch{
    if(turn!==epoch)return;
    note('비밀번호가 맞지 않습니다.');
    password.focus({preventScroll:true});
   }finally{if(turn===epoch)submit.disabled=false;}
  });
  function clearView(){
   ++epoch;
   payload=null;unlockedMessage='';
   setPersonalAgenda([],false);
   locked();
   note('');
   submit.disabled=!browserCrypto;
  }
  async function forget(){
   clearView();
   submit.disabled=true;
   const turn=epoch;
   channel?.postMessage('lock');
   try{
    await keyRecord('readwrite',db=>db.delete('active'));
    if(turn===epoch)note('잠금 해제를 잊었습니다.');
   }catch{
    if(turn===epoch)note('브라우저에 저장된 잠금 해제를 지우지 못했습니다. 사이트 데이터를 삭제해 주세요.');
   }finally{
    if(turn===epoch){submit.disabled=false;if(active)password.focus({preventScroll:true});}
   }
  }
  $$('[data-lock-guide]').forEach(button=>button.addEventListener('click',forget));
  schedule.addEventListener('click',()=>{
   const first=payload?.days.map(day=>day.date).sort()[0];
   const date=payload?.days.some(day=>day.date===ui.day)?ui.day:first;
   navigate('schedule',{day:date,agenda:'conference'});
  });
  if(channel)channel.onmessage=event=>{if(event.data==='lock')clearView();};
  window.addEventListener('pagehide',clearView);
  window.addEventListener('pageshow',event=>{if(event.persisted)restore();});
  return {visit,restore};
 }
 function showView(focus=false) {
  $$('.view').forEach(v=>{const active=v.id===ui.view;v.hidden=!active;v.toggleAttribute('data-active',active);});
  $$('[data-view-link]').forEach(a=>{if(a.dataset.viewLink===ui.view)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  document.title=`${trip.title} · ${$(`#${ui.view} h2`).textContent}`;
  updateSchedule();
  if(ui.view==='places')updatePlaces();
  if(ui.view==='checklist')updateChecks();
  if(ui.view==='budget')updateBudget();
  if(ui.view==='summaries')updateResources();
  mine?.visit(ui.view==='mine');
  $$('[data-scroll]',$(`#${ui.view}`)).forEach(el=>{el.scrollTop=scrolls[scrollKey(el)]||0;});
  if(focus)$(`#${ui.view}`).focus({preventScroll:true});
 }
 function routeHash() {
  if(ui.view==='schedule')return `#schedule/${publicDay}${ui.agenda==='visits'?'/visits':''}`;
  if(ui.view==='places')return `#places${ui.place&&(ui.placeOpen||ui.placeMode==='map')?`/${ui.place}${ui.placeMode==='map'?'/map':''}`:''}`;
  if(ui.view==='summaries')return `#summaries/${ui.resource}`;
  return `#${ui.view}`;
 }
 function navigate(view,options={}) {
  captureScroll();
  for(const d of $$('dialog[open]'))closeDialog(d,true);
  ui.view=view;
  if(visibleAgenda.has(options.day))ui.day=options.day;
  if(days.has(ui.day))publicDay=ui.day;
  if(['conference','visits'].includes(options.agenda))ui.agenda=options.agenda;
  if(ui.agenda==='visits'&&!days.has(ui.day))ui.day=publicDay;
  if(destinations.has(options.place))ui.place=options.place;
  const hash=routeHash();
  if(location.hash!==hash)history[options.replace?'replaceState':'pushState'](null,'',hash);
  showView(options.focus!==false);
 }
 function readRoute(initial=false) {
  let hash=location.hash.slice(1);try{hash=decodeURIComponent(hash);}catch{hash='';}
  const [view,value,mode]=hash.split('/');
  if(['schedule','places','checklist','budget','summaries'].includes(view)||(view==='mine'&&mine)) {
   captureScroll();ui.view=view;
   if(view==='schedule'){
    if(days.has(value))publicDay=value;
    ui.day=publicDay;ui.agenda=mode==='visits'?'visits':'conference';
   }
   if(view==='places'){
    ui.placeOpen=allPlaces.has(value)&&mode!=='map';ui.detailPushed=false;ui.placeMode=mode==='map'?'map':'list';
    if(allPlaces.has(value)){ui.place=value;if(allPlaces.get(value).status==='closed'){ui.category='closed';$('#place-category').value='closed';}}
   }
   if(view==='summaries'&&['essentials','sheets','links'].includes(value))ui.resource=value;
  }
  if(ui.view!=='places'||!ui.placeOpen)for(const d of $$('dialog[open]'))closeDialog(d,true);
  showView(!initial);
  if(ui.view==='places'&&ui.placeOpen&&!desktop())selectPlace(ui.place,$(`[data-select-place="${ui.place}"]`),true);
  if(initial&&location.hash!==routeHash())history.replaceState(null,'',routeHash());
 }
 $$('[data-view-link]').forEach(a=>a.addEventListener('click',ev=>{ev.preventDefault();navigate(a.dataset.viewLink);}));
 window.addEventListener('hashchange',()=>readRoute());
 dateBar.addEventListener('click',event=>{
  const button=event.target.closest('[data-day]');
  if(button)navigate('schedule',{day:button.dataset.day,focus:false});
 });
 $$('[data-agenda]').forEach(b=>b.addEventListener('click',()=>navigate('schedule',{agenda:b.dataset.agenda,focus:false})));
 $$('[data-go-places]').forEach(b=>b.addEventListener('click',()=>navigate('places')));
 function updateSchedule() {
  const travelDates=$$('[data-travel-day]',dateBar);
  travelDates.forEach(button=>button.hidden=ui.agenda==='visits');
  dateBar.classList.toggle('has-travel-days',travelDates.length>0&&ui.agenda!=='visits');
  $$('[data-day]',dateBar).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.day===ui.day)));
  $$('[data-agenda]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.agenda===ui.agenda)));
  $('[data-agenda="conference"]').textContent=travelDates.length?'전체 일정':trip.programLabel||'일정';
  $$('[data-schedule-date]').forEach(d=>{const active=d.dataset.scheduleDate===ui.day;d.hidden=!active;d.toggleAttribute('data-day-active',active);});
  const day=visibleAgenda.get(ui.day);
  $('#day-title').textContent=day?.title||'';
  $('#day-time-label').textContent=day?.travel?'각 지역 현지 시각':'현지 시각';
  $('#conference-agenda').hidden=ui.agenda!=='conference';$('#personal-agenda').hidden=ui.agenda!=='visits';
  const plan=state.plan[ui.day]||[];
  $('#visit-count').textContent=plan.length?String(plan.length):'';
  $('#visit-empty').hidden=plan.length>0;
  $('#personal-agenda .day-heading>[data-go-places]').hidden=plan.length===0;
  $('#visit-list').innerHTML=plan.map((visit,i)=>{
   const p=allPlaces.get(visit.id);
   return `<article class="visit-row" data-visit="${e(p.id)}"><span class="visit-number">${i+1}</span><div class="visit-body"><button class="quiet-button" data-open-place="${e(p.id)}"><h4>${e(p.name)}</h4></button><p>${e(p.area)}</p><div class="visit-tools"><input type="time" aria-label="${e(p.name)} 방문 시각" data-visit-time="${e(p.id)}" value="${e(visit.time)}">${i>0?`<button data-move-visit="${e(p.id)}" data-direction="-1" aria-label="${e(p.name)} 위로">↑</button>`:''}${i<plan.length-1?`<button data-move-visit="${e(p.id)}" data-direction="1" aria-label="${e(p.name)} 아래로">↓</button>`:''}</div></div><button class="icon-button" data-remove-visit="${e(p.id)}" aria-label="${e(p.name)} 일정에서 빼기">${closeIcon}</button></article>`;
  }).join('');
  bindPlaceOpen($('#visit-list'));
  $$('[data-visit-time]').forEach(input=>input.addEventListener('change',()=>{const item=state.plan[ui.day]?.find(v=>v.id===input.dataset.visitTime);if(item){item.time=timeValid(input.value)?input.value:'';persist();}}));
  $$('[data-move-visit]').forEach(b=>b.addEventListener('click',()=>{const list=state.plan[ui.day];const from=list.findIndex(v=>v.id===b.dataset.moveVisit),to=from+Number(b.dataset.direction);if(to>=0&&to<list.length){[list[from],list[to]]=[list[to],list[from]];persist();updateSchedule();$('#visit-feedback').textContent='방문 순서를 바꿨습니다.';$(`[data-visit="${b.dataset.moveVisit}"] button`).focus();}}));
  $$('[data-remove-visit]').forEach(b=>b.addEventListener('click',()=>{const name=allPlaces.get(b.dataset.removeVisit).name;state.plan[ui.day]=state.plan[ui.day].filter(v=>v.id!==b.dataset.removeVisit);persist();updateSchedule();$('#visit-feedback').textContent=`${name}을 일정에서 뺐습니다.`;$('#personal-agenda .day-heading h3').setAttribute('tabindex','-1');$('#personal-agenda .day-heading h3').focus({preventScroll:true});}));
 }
 function updateSaved() { $$('[data-save]').forEach(b=>{const saved=state.saved.includes(b.dataset.save);b.setAttribute('aria-pressed',String(saved));b.setAttribute('aria-label',`${allPlaces.get(b.dataset.save)?.name} ${saved?'저장 취소':'저장'}`);}); }
 function bindSaved(root) { $$('[data-save]',root).forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='true';b.addEventListener('click',()=>{const id=b.dataset.save;state.saved=state.saved.includes(id)?state.saved.filter(x=>x!==id):[...state.saved,id];persist();updateSaved();if(ui.view==='places'&&ui.savedOnly)updatePlaces();});}); }
 let filtered=[];
 function updatePlaces() {
  $$('[data-place-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.placeMode===ui.placeMode)));
  const query=ui.query.toLocaleLowerCase();
  filtered=[];
  $$('.place-row').forEach(row=>{
   const p=allPlaces.get(row.dataset.place);
   const match=(ui.category==='closed'?p.status==='closed':p.status!=='closed'&&(ui.category==='all'||p.category===ui.category))&&(!ui.savedOnly||state.saved.includes(p.id))&&(!query||row.dataset.search.toLocaleLowerCase().includes(query));
   row.hidden=!match;if(match)filtered.push(p.id);
  });
  $('#place-count').textContent=`${filtered.length}곳`;
  $('#no-places').hidden=filtered.length>0;
  if(!filtered.includes(ui.place))ui.place=filtered[0]||null;
  $$('.place-row').forEach(row=>row.toggleAttribute('data-selected',row.dataset.place===ui.place));
  $('#place-inspector').hidden=!filtered.length||ui.placeMode==='map';
  $('#place-map-view').hidden=!filtered.length||ui.placeMode!=='map';
  $('.places-layout').classList.toggle('place-map-mode',ui.placeMode==='map');
  if(ui.place&&ui.placeMode==='map')updateBrowseMap();
  else if(ui.place&&desktop())mountPlace(ui.place,$('#place-inspector'));
  else if(!ui.place)$('#place-inspector').replaceChildren();
  updateSaved();
 }
 function selectPlace(id,trigger,fromRoute=false) {
  if(!allPlaces.has(id))return;
  ui.place=id;
  if(ui.view==='places'){
   ui.placeOpen=ui.placeMode!=='map';
   if(!fromRoute&&location.hash!==routeHash()){history.pushState(null,'',routeHash());ui.detailPushed=true;}
   $$('.place-row').forEach(row=>row.toggleAttribute('data-selected',row.dataset.place===id));
   if(ui.placeMode==='map'){updateBrowseMap();return;}
   if(desktop()){mountPlace(id,$('#place-inspector'));return;}
  }
  $('#detail-title').textContent='장소';mountPlace(id,$('#detail-body'));showDialog($('#detail-dialog'),trigger);
 }
 function bindPlaceOpen(root=document) { $$('[data-open-place]',root).forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='true';b.addEventListener('click',()=>selectPlace(b.dataset.openPlace,b));}); }
 function mountPlace(id,target) {
  if(target.dataset.mounted===id&&target.childElementCount){const date=$('[data-add-date]',target);if(date)date.value=publicDay;syncPlanButtons(target);return;}
  target.dataset.mounted=id;target.replaceChildren($(`#detail-${id}`).content.cloneNode(true));
  const select=$('[data-add-date]',target);if(select)select.value=publicDay;
  bindSaved(target);updateSaved();
  $$('[data-load-map]',target).forEach(b=>b.addEventListener('click',()=>loadMap(b.closest('.map-host'),allPlaces.get(id))));
  const add=$('[data-add-plan]',target);
  if(add){add.addEventListener('click',()=>{const date=$('[data-add-date]',target).value;if(!days.has(date))return;const list=state.plan[date]||(state.plan[date]=[]);if(!list.some(v=>v.id===id))list.push({id,time:''});persist();ui.day=date;publicDay=date;updateSchedule();syncPlanButtons(target);const feedback=$('[data-plan-feedback]',target);feedback.innerHTML=`${e(trip.schedule.find(d=>d.date===date).label)}에 추가했습니다. <button class="quiet-button" data-open-visits>일정 보기</button>`;$('[data-open-visits]',feedback).addEventListener('click',()=>navigate('schedule',{agenda:'visits'}));});select.addEventListener('change',()=>syncPlanButtons(target));}
  syncPlanButtons(target);
 }
 function syncPlanButtons(root=document) { $$('[data-add-plan]',root).forEach(b=>{const date=$('[data-add-date]',b.closest('.add-plan')).value;const exists=state.plan[date]?.some(v=>v.id===b.dataset.addPlan);b.textContent=exists?'추가됨':'일정에 추가';b.disabled=!!exists;}); }
 function loadMap(host,p) {
  if(host.dataset.mapId===p.id&&$('iframe',host))return;
  host.dataset.mapId=p.id;host.replaceChildren();
  const loading=document.createElement('span');loading.className='map-loading';loading.textContent='지도를 불러오는 중…';host.append(loading);
  const frame=document.createElement('iframe');frame.title=`${p.name} 지도`;frame.referrerPolicy='no-referrer';frame.src=`https://maps.google.com/maps?q=${encodeURIComponent(p.mapQuery||`${p.name} ${p.address||''}`)}&output=embed`;frame.allowFullscreen=true;frame.addEventListener('load',()=>{if(loading.isConnected)loading.remove();},{once:true});host.append(frame);
 }
 function updateBrowseMap() {
  const p=allPlaces.get(ui.place);if(!p)return;
  if(p.status==='closed'){$('#browse-map').textContent='운영이 종료된 장소입니다.';delete $('#browse-map').dataset.mapId;}else loadMap($('#browse-map'),p);
  $('#map-selected').innerHTML=`${e(p.name)}<small>${e(p.area)} · ${filtered.indexOf(p.id)+1} / ${filtered.length}</small>`;
  $('#map-prev').disabled=filtered.indexOf(p.id)<=0;$('#map-next').disabled=filtered.indexOf(p.id)>=filtered.length-1;
 }
 $('#conference-agenda').addEventListener('click',event=>{
  const jump=event.target.closest('[data-jump-slot]');
  if(jump){
   const group=$(`[data-slot="${jump.dataset.jumpSlot}"]`,jump.closest('[data-schedule-date]'));
   if(group){group.tabIndex=-1;group.focus({preventScroll:true});group.scrollIntoView({block:'start'});}
   return;
  }
  const b=event.target.closest('[data-event]');
  if(!b)return;
  const [date,index]=b.dataset.event.split('/');const day=visibleAgenda.get(date);const item=day?.items[Number(index)];if(!item)return;
  $('#detail-body').toggleAttribute('data-private-detail',Boolean(item.personal));
  $('#detail-title').textContent=day.label;delete $('#detail-body').dataset.mounted;
  const place=allPlaces.get(item.venue);
  const location=item.location||place?.shortName||place?.name;
  const locationMarkup=place
   ? `<button class="button" data-event-venue="${e(place.id)}">${e(location)}</button>`
   : location ? `<p class="muted">${e(location)}</p>` : '';
  const eventLink=typeof item.url==='string'&&/^https:\/\//i.test(item.url)?item.url:'';
  $('#detail-body').innerHTML=`<span class="event-modal-time">${e(item.time)}${item.zone?' '+e(item.zone):''}</span><h3 class="event-modal-title">${e(item.title)}</h3>${item.arrival?`<p class="event-arrival">${e(item.arrival)}</p>`:''}${item.personal?`<p class="event-personal">${e(item.personal)}</p>`:''}${locationMarkup}<p class="event-modal-note">${e(item.note)}</p>${eventLink?`<a class="text-link" href="${e(eventLink)}" target="_blank" rel="noopener noreferrer">${e(item.linkLabel||'공식 일정')} <span aria-hidden="true">↗</span></a>`:''}`;
  const venue=$('[data-event-venue]',$('#detail-body'));if(venue)venue.addEventListener('click',()=>{mountPlace(venue.dataset.eventVenue,$('#detail-body'));$('#detail-title').textContent='행사장';});
  showDialog($('#detail-dialog'),b);
 });
 $$('[data-select-place]').forEach(b=>b.addEventListener('click',()=>selectPlace(b.dataset.selectPlace,b)));
 $('#place-search').addEventListener('input',ev=>{ui.query=ev.target.value.trim();updatePlaces();});
 $('#place-category').addEventListener('change',ev=>{ui.category=ev.target.value;updatePlaces();});
 $('#saved-filter').addEventListener('click',ev=>{ui.savedOnly=!ui.savedOnly;ev.currentTarget.setAttribute('aria-pressed',String(ui.savedOnly));updatePlaces();});
 $('#clear-filters').addEventListener('click',()=>{ui.query='';ui.category='all';ui.savedOnly=false;$('#place-search').value='';$('#place-category').value='all';$('#saved-filter').setAttribute('aria-pressed','false');updatePlaces();$('#place-search').focus();});
 $$('[data-place-mode]').forEach(b=>b.addEventListener('click',()=>{ui.placeMode=b.dataset.placeMode;ui.placeOpen=false;$$('[data-place-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));updatePlaces();history.replaceState(null,'',routeHash());}));
 ['prev','next'].forEach(dir=>$(`#map-${dir}`).addEventListener('click',()=>{const next=filtered[filtered.indexOf(ui.place)+(dir==='prev'?-1:1)];if(next)selectPlace(next);}));
 $('#map-selected').addEventListener('click',ev=>{mountPlace(ui.place,$('#detail-body'));$('#detail-title').textContent='장소';showDialog($('#detail-dialog'),ev.currentTarget);});
 bindSaved(document);bindPlaceOpen();
 $('#show-venues').addEventListener('click',ev=>{
  $('#detail-title').textContent='행사장';delete $('#detail-body').dataset.mounted;
  $('#detail-body').innerHTML=`<div class="venue-list">${trip.venues.map(v=>`<button data-open-place="${e(v.id)}">${e(v.shortName||v.name)}<span aria-hidden="true">›</span></button>`).join('')}</div>`;
  $$('[data-open-place]',$('#detail-body')).forEach(b=>b.addEventListener('click',()=>{delete $('#detail-body').dataset.mounted;mountPlace(b.dataset.openPlace,$('#detail-body'));$('#detail-title').textContent='행사장';}));
  showDialog($('#detail-dialog'),ev.currentTarget);
 });
 function updateChecks() {
  let done=0,visible=0;
  $$('[data-check]').forEach(c=>{c.checked=state.checks[c.dataset.check]===true;if(c.checked)done++;const row=c.closest('.check-row');const match=(ui.group==='all'||row.dataset.checkGroup===ui.group)&&(ui.checkFilter==='all'||!c.checked);row.hidden=!match;if(match)visible++;});
  $('#check-progress').textContent=`${done} / ${trip.checklist.length}`;$('#check-meter').value=done;$('#checks-empty').hidden=visible>0;
 }
 $('#check-group').addEventListener('change',ev=>{ui.group=ev.target.value;updateChecks();$('[data-scroll="checklist"]').scrollTop=0;});
 $$('[data-check-filter]').forEach(b=>b.addEventListener('click',()=>{ui.checkFilter=b.dataset.checkFilter;$$('[data-check-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));updateChecks();}));
 $$('[data-check]').forEach(c=>c.addEventListener('change',()=>{const rows=$$('.check-row:not([hidden])');const next=rows[rows.indexOf(c.closest('.check-row'))+1];state.checks[c.dataset.check]=c.checked;persist();updateChecks();if(c.closest('.check-row').hidden){const target=next?.querySelector('input')||$('#check-group');target.focus({preventScroll:true});}}));
 let undoChecks;
 $('#reset-checks').addEventListener('click',()=>{undoChecks={...state.checks};state.checks={};persist();updateChecks();$('#undo-checks').hidden=false;$('#check-feedback').textContent='전체 체크를 해제했습니다.';});
 $('#undo-checks').addEventListener('click',()=>{state.checks=undoChecks||{};persist();updateChecks();$('#undo-checks').hidden=true;$('#check-feedback').textContent='이전 상태로 되돌렸습니다.';$('#reset-checks').focus();});
 function updateBudget() {
  let planned=0,spent=0,plans=0,spends=0,paired=0,remaining=0;
  trip.budgetCategories.forEach((_,i)=>{const a=state.budget[`${i}-plan`],b=state.budget[`${i}-spent`];const av=validWon(a),bv=validWon(b);if(av){planned+=Number(a);plans++;}if(bv){spent+=Number(b);spends++;}if(av&&bv){remaining+=Number(a)-Number(b);paired++;}$(`[data-budget-value="${i}-plan"]`).textContent=money(a);$(`[data-budget-value="${i}-spent"]`).textContent=money(b);});
  $('#budget-plan').textContent=plans?money(planned):'—';$('#budget-spent').textContent=spends?money(spent):'—';$('#budget-remaining').textContent=paired?new Intl.NumberFormat('ko-KR').format(remaining):'—';
  $('#budget-coverage').textContent=paired?`계획 ${plans}개 · 사용 ${spends}개 입력 · 잔액은 양쪽 입력 ${paired}개 항목 기준`:plans||spends?`계획 ${plans}개 · 사용 ${spends}개 입력`:'항목을 눌러 금액을 입력하세요.';
 }
 $$('[data-edit-budget]').forEach(b=>b.addEventListener('click',()=>{editIndex=Number(b.dataset.editBudget);$('#budget-edit-title').textContent=trip.budgetCategories[editIndex];$('#edit-plan').value=state.budget[`${editIndex}-plan`]||'';$('#edit-spent').value=state.budget[`${editIndex}-spent`]||'';$('#budget-error').textContent='';$('#edit-plan').removeAttribute('aria-invalid');$('#edit-spent').removeAttribute('aria-invalid');showDialog($('#budget-dialog'),b);}));
 $('#budget-form').addEventListener('submit',ev=>{
  ev.preventDefault();let invalid=null;
  for(const type of ['plan','spent']){const field=$(`#edit-${type}`),bad=field.value!==''&&!validWon(field.value);field.setAttribute('aria-invalid',String(bad));if(bad&&!invalid)invalid=field;}
  if(invalid){$('#budget-error').textContent='0~10억 원 사이의 정수 금액을 입력하세요.';invalid.focus();return;}
  for(const type of ['plan','spent'])state.budget[`${editIndex}-${type}`]=$(`#edit-${type}`).value;
  persist();updateBudget();closeDialog($('#budget-dialog'));$('#app-status').textContent=`${trip.budgetCategories[editIndex]} 예산을 저장했습니다.`;
 });
 $('#show-converter').addEventListener('click',ev=>showDialog($('#converter-dialog'),ev.currentTarget));
 const convert=()=>{const a=$('#usd-amount').value,r=$('#usd-rate').value;$('#converted-amount').textContent=validAmount(a)&&validAmount(r)&&Number(r)>0?`${money(Number(a)*Number(r))}원`:'금액과 환율을 입력하세요.';};
 ['usd-amount','usd-rate'].forEach(id=>$(`#${id}`).addEventListener('input',convert));
 function updateResources() { $$('[data-resource]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.resource===ui.resource)));$$('[data-resource-panel]').forEach(p=>{const active=p.dataset.resourcePanel===ui.resource;p.hidden=!active;p.toggleAttribute('data-resource-active',active);}); }
 $$('[data-resource]').forEach(b=>b.addEventListener('click',()=>{ui.resource=b.dataset.resource;history.replaceState(null,'',routeHash());updateResources();$('[data-scroll="summaries"]').scrollTop=0;}));
 const clock=()=>{try{$('#local-clock').textContent=`현지 ${new Intl.DateTimeFormat('ko-KR',{timeZone:trip.timezone,hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())}`;}catch{$('#local-clock').textContent='';}};
 clock();setInterval(clock,60000);
 matchMedia('(min-width: 1001px)').addEventListener('change',()=>{if(ui.view==='places')updatePlaces();});
 readRoute(true);updateChecks();updateBudget();updateSaved();mine?.restore();
})();
