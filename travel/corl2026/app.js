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
 function captureScroll() { $$('[data-scroll]',$(`#${ui.view}`)).forEach(el=>scrolls[el.dataset.scroll]=el.scrollTop); }
 function showView(focus=false) {
  $$('.view').forEach(v=>{const active=v.id===ui.view;v.hidden=!active;v.toggleAttribute('data-active',active);});
  $$('[data-view-link]').forEach(a=>{if(a.dataset.viewLink===ui.view)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  document.title=`${trip.title} · ${$(`#${ui.view} h2`).textContent}`;
  updateSchedule();
  if(ui.view==='places')updatePlaces();
  if(ui.view==='checklist')updateChecks();
  if(ui.view==='budget')updateBudget();
  if(ui.view==='summaries')updateResources();
  $$('[data-scroll]',$(`#${ui.view}`)).forEach(el=>{el.scrollTop=scrolls[el.dataset.scroll]||0;});
  if(focus)$(`#${ui.view}`).focus({preventScroll:true});
 }
 function routeHash() {
  if(ui.view==='schedule')return `#schedule/${ui.day}${ui.agenda==='visits'?'/visits':''}`;
  if(ui.view==='places')return `#places${ui.place&&(ui.placeOpen||ui.placeMode==='map')?`/${ui.place}${ui.placeMode==='map'?'/map':''}`:''}`;
  if(ui.view==='summaries')return `#summaries/${ui.resource}`;
  return `#${ui.view}`;
 }
 function navigate(view,options={}) {
  captureScroll();
  for(const d of $$('dialog[open]'))closeDialog(d,true);
  ui.view=view;
  if(days.has(options.day))ui.day=options.day;
  if(['conference','visits'].includes(options.agenda))ui.agenda=options.agenda;
  if(destinations.has(options.place))ui.place=options.place;
  const hash=routeHash();
  if(location.hash!==hash)history[options.replace?'replaceState':'pushState'](null,'',hash);
  showView(options.focus!==false);
 }
 function readRoute(initial=false) {
  let hash=location.hash.slice(1);try{hash=decodeURIComponent(hash);}catch{hash='';}
  const [view,value,mode]=hash.split('/');
  if(['schedule','places','checklist','budget','summaries'].includes(view)) {
   captureScroll();ui.view=view;
   if(view==='schedule'){if(days.has(value))ui.day=value;ui.agenda=mode==='visits'?'visits':'conference';}
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
 $$('[data-day]').forEach(b=>b.addEventListener('click',()=>navigate('schedule',{day:b.dataset.day,focus:false})));
 $$('[data-agenda]').forEach(b=>b.addEventListener('click',()=>navigate('schedule',{agenda:b.dataset.agenda,focus:false})));
 $$('[data-go-places]').forEach(b=>b.addEventListener('click',()=>navigate('places')));
 function updateSchedule() {
  $$('[data-day]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.day===ui.day)));
  $$('[data-agenda]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.agenda===ui.agenda)));
  $$('[data-schedule-date]').forEach(d=>{const active=d.dataset.scheduleDate===ui.day;d.hidden=!active;d.toggleAttribute('data-day-active',active);});
  $('#day-title').textContent=trip.schedule.find(d=>d.date===ui.day)?.title||'';
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
  if(target.dataset.mounted===id&&target.childElementCount){const date=$('[data-add-date]',target);if(date)date.value=ui.day;syncPlanButtons(target);return;}
  target.dataset.mounted=id;target.replaceChildren($(`#detail-${id}`).content.cloneNode(true));
  const select=$('[data-add-date]',target);if(select)select.value=ui.day;
  bindSaved(target);updateSaved();
  $$('[data-load-map]',target).forEach(b=>b.addEventListener('click',()=>loadMap(b.closest('.map-host'),allPlaces.get(id))));
  const add=$('[data-add-plan]',target);
  if(add){add.addEventListener('click',()=>{const date=$('[data-add-date]',target).value;if(!days.has(date))return;const list=state.plan[date]||(state.plan[date]=[]);if(!list.some(v=>v.id===id))list.push({id,time:''});persist();ui.day=date;updateSchedule();syncPlanButtons(target);const feedback=$('[data-plan-feedback]',target);feedback.innerHTML=`${e(trip.schedule.find(d=>d.date===date).label)}에 추가했습니다. <button class="quiet-button" data-open-visits>일정 보기</button>`;$('[data-open-visits]',feedback).addEventListener('click',()=>navigate('schedule',{agenda:'visits'}));});select.addEventListener('change',()=>syncPlanButtons(target));}
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
 $$('[data-event]').forEach(b=>b.addEventListener('click',()=>{
  const [date,index]=b.dataset.event.split('/');const day=trip.schedule.find(d=>d.date===date);const item=day?.items[Number(index)];if(!item)return;
  $('#detail-title').textContent=day.label;delete $('#detail-body').dataset.mounted;
  $('#detail-body').innerHTML=`<span class="event-modal-time">${e(item.time)}</span><h3 class="event-modal-title">${e(item.title)}</h3>${item.venue?`<button class="button" data-event-venue="${e(item.venue)}">${e(allPlaces.get(item.venue)?.shortName||allPlaces.get(item.venue)?.name)}</button>`:''}<p class="event-modal-note">${e(item.note)}</p>${item.url?`<a class="text-link" href="${e(item.url)}" target="_blank" rel="noopener noreferrer">공식 일정 ↗</a>`:''}`;
  const venue=$('[data-event-venue]',$('#detail-body'));if(venue)venue.addEventListener('click',()=>{mountPlace(venue.dataset.eventVenue,$('#detail-body'));$('#detail-title').textContent='행사장';});
  showDialog($('#detail-dialog'),b);
 }));
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
 readRoute(true);updateChecks();updateBudget();updateSaved();
})();
