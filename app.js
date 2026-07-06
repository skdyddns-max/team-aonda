/* ============================================================
   팀아온다 — 앱 로직 (매칭 엔진 + 렌더링)
   ============================================================ */
const $  = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const won = n => n.toLocaleString('ko-KR')+"원";

function scrollTo2(id){ document.getElementById(id).scrollIntoView({behavior:'smooth'}); }
function openKakao(){
  const url = (typeof CONTACT!=='undefined' && CONTACT.kakao) ? CONTACT.kakao : '';
  if(url) window.open(url,'_blank','noopener'); else showView('reviews');
}
// 앱형 탭 뷰 전환 (한 번에 한 섹션만)
function showView(v){
  document.querySelectorAll('[data-view]').forEach(el=>{ el.style.display = (el.dataset.view===v) ? '' : 'none'; });
  $$('#navTabs a').forEach(a=>a.classList.toggle('active', a.dataset.tab===v));
  window.scrollTo(0,0);
}
function setupViews(){
  $$('#navTabs a').forEach(a=> a.addEventListener('click', ()=>showView(a.dataset.tab)) );
  showView('home');
}

/* ---------- 1. 매칭 도구: 옵션 선택 ---------- */
const answers = {};
$$('.opts .opt').forEach(opt=>{
  opt.addEventListener('click',()=>{
    const q = opt.parentElement.dataset.q;
    opt.parentElement.querySelectorAll('.opt').forEach(o=>o.classList.remove('on'));
    opt.classList.add('on');
    answers[q] = opt.dataset.v;
  });
});

/* ---------- 매칭 엔진 ---------- */
function runMatch(){
  const a = answers;
  // 필수: 무게 + 예산 최소
  if(!a.weight || !a.budget){
    alert('무게 스타일과 예산은 꼭 선택해 주세요 🙏 (더 많이 고를수록 정확해져요)');
    return;
  }

  // --- 텐트 점수화 ---
  const budgetRange = { low:[0,300000], mid:[300000,700000], high:[700000,99999999] };
  const [bMin,bMax] = budgetRange[a.budget];

  const scored = TENTS.map(t=>{
    let s = 0; const reasons = [];
    // 무게 등급 일치
    if(a.weight && t.wclass===a.weight){ s+=40; reasons.push(`${a.weight} 무게대`); }
    else if(a.weight==='UL' && t.weight<1.2){ s+=25; }
    else if(a.weight==='BPL' && t.weight>=1.2 && t.weight<2){ s+=25; }
    // 예산 일치
    if(t.price>=bMin && t.price<=bMax){ s+=30; reasons.push('예산 적합'); }
    else if(t.price < bMin){ s+=10; } // 예산보다 저렴 → 살짝 가점
    // 성향: 솔캠 → 1인 선호, 친목 → 2인+ 선호
    if(a.vibe==='솔캠' && /1인/.test(t.cap)){ s+=14; reasons.push('솔캠용 1인'); }
    if(a.vibe==='친목' && (/2인|3|4/.test(t.cap))){ s+=14; reasons.push('여럿이 쓰기 좋음'); }
    // 박지: 오지/섬(강풍) → 내구·경량, 캠핑장 → 거주성
    if((a.place==='오지'||a.place==='섬') && t.weight<2){ s+=10; }
    if(a.place==='캠핑장' && t.wclass==='헤비'){ s+=8; reasons.push('거주성 좋음'); }
    // 겨울 오지 성향 힌트: 헤비+사계절
    if(a.place==='오지' && a.weight==='헤비' && t.season===4){ s+=12; reasons.push('동계 대응'); }
    // 가성비 예산이면 value 가점
    if(a.budget==='low' && t.value){ s+=12; reasons.push('가성비'); }
    return {t, s, reasons};
  }).sort((x,y)=>y.s-x.s);

  const topTents = scored.slice(0,2);

  // --- 박지 점수화 ---
  const spotScored = SPOTS.map(sp=>{
    let s=0; const reasons=[];
    if(a.place && sp.type===a.place){ s+=45; reasons.push(`${a.place} 박지`); }
    if(a.vibe && sp.vibe.includes(a.vibe)){ s+=25; reasons.push(`${a.vibe} 어울림`); }
    // 자차 없음 → car:false(대중교통 가능) 우대
    if(a.car==='no'){ if(!sp.car){ s+=30; reasons.push('자차 없이 접근 가능'); } else { s-=40; } }
    if(a.car==='yes' && sp.car){ s+=6; }
    // 헤비/거주성 성향은 편한 캠핑장 살짝 우대
    if(a.weight==='헤비' && sp.type==='캠핑장'){ s+=8; }
    return {sp,s,reasons};
  }).sort((x,y)=>y.s-x.s);

  const topSpots = spotScored.slice(0,2);

  renderResult(topTents, topSpots, a);
}

function renderResult(tents, spots, a){
  const res = $('#result');
  const profile = [
    a.vibe && (a.vibe==='솔캠'?'🌙 솔캠':'🔥 친목'),
    a.place, a.weight && `${a.weight} 무게`,
    a.car && (a.car==='no'?'🚌 대중교통':'🚗 자차'),
    a.budget && ({low:'가성비 예산',mid:'중급 예산',high:'프리미엄 예산'})[a.budget]
  ].filter(Boolean).join(' · ');

  let html = `<div class="res-head">🎯 당신의 프로필 — ${profile}</div>`;

  html += `<div style="font-size:13px;font-weight:800;color:var(--forest);margin:4px 0 8px">추천 텐트</div>`;
  tents.forEach((x,i)=>{
    const t=x.t;
    html += `<div class="pick">
      <div class="top"><span class="nm">${i===0?'🥇 ':'🥈 '}${t.name}</span>
        <span class="badge">${t.wclass}</span></div>
      <div class="meta">${t.brand} · ${t.weight}kg · ${t.cap} · <span class="price">${won(t.price)}</span></div>
      <div class="why">👉 ${x.reasons.slice(0,3).join(', ') || '전반적으로 무난한 선택'}</div>
    </div>`;
  });

  // ── 예산별 함께 챙길 장비 (텐트 외) ──
  if(typeof GEAR!=='undefined' && a.budget){
    const tier = a.budget;   // low / mid / high
    const tierLabel = ({low:'가성비',mid:'중급',high:'프리미엄'})[tier];
    html += `<div style="font-size:13px;font-weight:800;color:var(--forest);margin:16px 0 8px">함께 챙기면 좋은 장비 <span style="color:var(--muted);font-weight:600">· ${tierLabel} 예산 기준</span></div>`;
    GEAR.forEach(g=>{
      const it = g[tier];
      html += `<div class="pick">
        <div class="top"><span class="nm">${esc(g.cat)}</span>
          <span class="badge" style="background:var(--brand);color:#2c2408">${esc(it.price)}</span></div>
        <div class="meta">${esc(it.name)}</div>
        <div class="why">👉 ${esc(it.note)}</div>
      </div>`;
    });
    html += `<p style="font-size:11px;color:var(--muted);margin:2px 2px 4px">※ 예산은 텐트 예산과 같은 기준으로 맞췄어요. 품목별 대략가이며 브랜드는 예시입니다.</p>`;
  }

  html += `<div style="font-size:13px;font-weight:800;color:var(--forest);margin:16px 0 8px">추천 박지</div>`;
  if(spots[0] && spots[0].s>0){
    spots.forEach((x,i)=>{
      const sp=x.sp;
      html += `<div class="pick">
        <div class="top"><span class="nm">📍 ${sp.name}</span>
          <span class="badge" style="background:var(--forest)">${sp.type}</span></div>
        <div class="meta">${sp.region} · 난이도 ${sp.difficulty} · ${sp.season}</div>
        <div class="why">👉 ${x.reasons.slice(0,3).join(', ')}</div>
      </div>`;
    });
  } else {
    html += `<div class="empty">조건에 딱 맞는 박지가 없어요. 자차 여부나 박지 종류를 바꿔보세요 🙂</div>`;
  }

  html += `<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
    <button class="btn btn-ghost" style="flex:1;min-width:130px;color:var(--forest);border-color:var(--sage)"
      onclick="showView('gear')">⛺ 전체 텐트 보기</button>
    <button class="btn btn-ghost" style="flex:1;min-width:130px;color:var(--forest);border-color:var(--sage)"
      onclick="showView('spots')">📍 전체 박지 보기</button>
  </div>`;

  res.innerHTML = html;
  res.classList.add('show');
  setTimeout(()=>res.scrollIntoView({behavior:'smooth',block:'nearest'}),80);
}

/* ---------- 2. 텐트 데이터베이스 (검색·필터·정렬·페이지네이션) ---------- */
const PAGE = 24;
const tState = { q:'', kws:new Set(), brand:'', cap:'', sort:'weight', limit:PAGE };

function kwPass(t,kw){
  switch(kw){
    case 'value': return t.value;
    case 's3':    return t.season===3;
    case 's4':    return t.season===4;
    case 'light': return t.weight>=1 && t.weight<2;
    case 'ul':    return t.wclass==='UL';
    default:      return true;
  }
}
function filteredTents(){
  const q = tState.q.trim().toLowerCase();
  let items = TENTS.filter(t=>tentMatch(t, {skip:null}));
  const s = tState.sort;
  items.sort((a,b)=>
    s==='price'  ? a.price-b.price :
    s==='priceD' ? b.price-a.price :
    s==='brand'  ? a.brand.localeCompare(b.brand) || a.weight-b.weight :
                   a.weight-b.weight);
  return items;
}
// 텐트가 현재 필터에 맞는지 (skip: 제외할 필터 축 — 패싯 카운트용)
function tentMatch(t, opt){
  const skip = opt && opt.skip;
  if(skip!=='kw' && tState.kws.size){ for(const kw of tState.kws){ if(!kwPass(t,kw)) return false; } }
  if(skip!=='brand' && tState.brand && t.brand!==tState.brand) return false;
  if(skip!=='cap' && tState.cap){
    const tn = parseInt(t.cap);
    if(tState.cap==='3인'){ if(tn<3) return false; }        // 3인+
    else if(tn !== parseInt(tState.cap)) return false;      // 1인·2인 정확히
  }
  if(skip!=='q'){
    const q = tState.q.trim().toLowerCase();
    if(q){
      const kr = (typeof BRAND_KR!=='undefined' && BRAND_KR[t.brand]) || '';
      const hay = (t.name+' '+t.brand+' '+kr+' '+t.tags.join(' ')).toLowerCase();
      if(!hay.includes(q)) return false;
    }
  }
  return true;
}
// 네이버 검색 URL (한글 브랜드명 우선 → 사진·가격·후기 바로 확인)
function naverURL(q){ return 'https://search.naver.com/search.naver?query=' + encodeURIComponent(q); }
function krBrand(brand){ return (typeof BRAND_KR!=='undefined' && BRAND_KR[brand]) ? BRAND_KR[brand].split(' ')[0] : brand; }
function naverSearch(t){ return naverURL(krBrand(t.brand) + ' ' + t.name); }
function tentCardHTML(t){
  return `<a class="tcard" href="${naverSearch(t)}" target="_blank" rel="noopener">
    <div class="row1">
      <div><div class="brand">${esc(t.brand)}
        ${t.verified?'<span class="vbadge" title="웹 조사로 확인된 실측 스펙">✓ 실측</span>'
                    :'<span class="ebadge" title="대표값에서 인원별 스케일한 추정치">≈ 추정</span>'}</div>
        <div class="tname">${esc(t.name)}</div></div>
      <span class="season ${t.season===4?'s4':'s3'}">${t.season===4?'사계절':'삼계절'}</span>
    </div>
    <div class="stats">
      <div class="stat">무게<b class="w">${t.weight}kg</b></div>
      <div class="stat">가격<b>${won(t.price)}</b></div>
      <div class="stat">인원<b>${t.cap}</b></div>
      <div class="stat">등급<b>${t.wclass}</b></div>
    </div>
    <div class="tags">
      ${t.value?'<span class="tag value">가성비</span>':''}
      ${t.tags.map(tag=>`<span class="tag">${esc(tag)}</span>`).join('')}
    </div>
    <span class="tsearch">🔍 네이버에서 사진·가격 보기 →</span>
  </a>`;
}
function renderTents(){
  const list = $('#tentList');
  const items = filteredTents();
  const shown = items.slice(0, tState.limit);
  list.innerHTML = shown.length
    ? shown.map(tentCardHTML).join('')
    : `<div class="empty">조건에 맞는 텐트가 없어요. 검색어나 필터를 바꿔보세요 🙂</div>`;
  $('#tentCount').textContent = items.length;
  listMoreButtons(items.length, tState.limit, '종');
}
// 더보기/접기 버튼 공통 토글
function listMoreButtons(total, limit, unit){
  const more=$('#tentMore'), coll=$('#tentCollapse');
  if(total>limit){ more.style.display=''; more.textContent=`더 보기 ▾ (남은 ${total-limit}${unit})`; } else more.style.display='none';
  coll.style.display = limit>PAGE ? '' : 'none';
}
function resetLimit(){ tState.limit = PAGE; }

/* ── 장비 카테고리 (텐트 / 침낭 / 매트 / 배낭 / 스토브 / 랜턴) ── */
let curCat = '텐트', gearQuery = '', gearLimit = PAGE;
function gearCardHTML(g){
  return `<a class="tcard" href="${naverURL(krBrand(g.brand)+' '+g.name)}" target="_blank" rel="noopener">
    <div class="row1">
      <div><div class="brand">${esc(g.brand)}</div><div class="tname">${esc(g.name)}</div></div>
      ${g.value?'<span class="season s3">가성비</span>':''}
    </div>
    <div class="stats">
      <div class="stat">가격<b>~${g.price}만</b></div>
    </div>
    <div class="tags">${g.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>
    <span class="tsearch">🔍 네이버에서 사진·가격 보기 →</span>
  </a>`;
}
function renderGear(cat){
  const q = gearQuery.trim().toLowerCase();
  const items = (GEAR_ITEMS[cat]||[]).filter(g=>{
    if(!q) return true;
    const kr = (typeof BRAND_KR!=='undefined' && BRAND_KR[g.brand]) || '';
    return (g.brand+' '+g.name+' '+kr+' '+g.tags.join(' ')).toLowerCase().includes(q);
  });
  const shown = items.slice(0, gearLimit);
  $('#tentList').innerHTML = shown.length ? shown.map(gearCardHTML).join('') : `<div class="empty">검색 결과가 없어요.</div>`;
  $('#tentCount').textContent = items.length;
  listMoreButtons(items.length, gearLimit, '개');
}
function selectCat(cat){
  curCat = cat;
  $$('#catTabs button').forEach(b=>b.classList.toggle('on', b.dataset.cat===cat));
  const isTent = cat==='텐트';
  $('#tentControls').style.display = isTent ? '' : 'none';
  $('#gearControls').style.display = isTent ? 'none' : '';
  $('#tentAccuracy').style.display = isTent ? '' : 'none';
  if(isTent){ resetLimit(); renderTents(); }
  else { gearQuery=''; $('#gearSearch').value=''; gearLimit=PAGE; renderGear(cat); }
}
function moreTents(){
  if(curCat==='텐트'){ tState.limit += PAGE; renderTents(); }
  else { gearLimit += PAGE; renderGear(curCat); }
}
function collapseTents(){
  if(curCat==='텐트'){ tState.limit = PAGE; renderTents(); }
  else { gearLimit = PAGE; renderGear(curCat); }
  scrollTo2('tents');
}

// 브랜드 드롭다운을 현재 필터(브랜드 제외) 기준 개수로 다시 채움 → "있는데 0개" 방지
function updateBrandOptions(){
  const sel = $('#fBrand'), prev = sel.value;
  const cnt = {};
  TENTS.forEach(t=>{ if(tentMatch(t,{skip:'brand'})) cnt[t.brand]=(cnt[t.brand]||0)+1; });
  const brands = Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a] || a.localeCompare(b));
  sel.innerHTML = `<option value="">전체 브랜드</option>`
    + brands.map(b=>`<option value="${esc(b)}">${esc(b)} (${cnt[b]})</option>`).join('');
  if(prev && cnt[prev]) sel.value = prev;          // 선택 유지
  else if(prev){ sel.value=''; tState.brand=''; }  // 현재 필터서 사라졌으면 해제
}
function refreshTents(){ resetLimit(); updateBrandOptions(); renderTents(); }

function setupTentControls(){
  $('#tentTotal').textContent = TENTS.length;
  $('#brandTotal').textContent = new Set(TENTS.map(t=>t.brand)).size;
  updateBrandOptions();
  // 검색 (디바운스)
  let deb;
  $('#tentSearch').addEventListener('input', e=>{
    clearTimeout(deb);
    deb = setTimeout(()=>{ tState.q=e.target.value; refreshTents(); }, 160);
  });
  $('#fBrand').addEventListener('change', e=>{ tState.brand=e.target.value; resetLimit(); renderTents(); });
  $('#fSort').addEventListener('change',  e=>{ tState.sort=e.target.value;  resetLimit(); renderTents(); });
  // 무게·가격 기준 세그먼트 (전체 / 1인 / 2인 / 3인+)
  $$('#capSeg button').forEach(b=>{
    b.addEventListener('click',()=>{
      $$('#capSeg button').forEach(x=>x.classList.remove('on'));
      b.classList.add('on');
      tState.cap = b.dataset.cap;
      refreshTents();
    });
  });
  // 키워드 칩 (다중 선택 가능 — AND)
  $$('#kwRow .kw').forEach(kw=>{
    kw.addEventListener('click',()=>{
      const v=kw.dataset.kw;
      if(tState.kws.has(v)){ tState.kws.delete(v); kw.classList.remove('on'); }
      else{ tState.kws.add(v); kw.classList.add('on'); }
      refreshTents();
    });
  });
  // 카테고리 탭 (텐트 / 침낭 / 매트 / 배낭 / 스토브 / 랜턴)
  $$('#catTabs button').forEach(b=> b.addEventListener('click', ()=>selectCat(b.dataset.cat)) );
  // 기타 장비 검색
  let gdeb;
  $('#gearSearch').addEventListener('input', e=>{
    clearTimeout(gdeb);
    gdeb = setTimeout(()=>{ gearQuery=e.target.value; gearLimit=PAGE; renderGear(curCat); }, 160);
  });
}

/* ---------- 3. 할인 정보 ---------- */
function renderDeals(){
  $('#dealList').innerHTML = DEALS.map(d=>`
    <div class="deal ${d.hot?'hot':''}">
      <div class="pd">${d.period}</div>
      <div><div class="dt">${d.title}</div><div class="dd">${d.desc}</div></div>
    </div>`).join('');
}

/* ---------- 행사 (백패킹 · 트레일러닝) ---------- */
let evtFilter = 'all';
function eventCardHTML(ev){
  const tr = ev.type==='트레일러닝';
  return `<a class="evt" href="${naverURL(ev.q)}" target="_blank" rel="noopener">
    <div class="eh"><span class="enm">${esc(ev.name)}</span>
      <span class="etype ${tr?'tr':'bp'}">${tr?'🏃':'🎒'} ${esc(ev.type)}</span></div>
    <div class="emeta">🗓 ${esc(ev.when)} · 📍 ${esc(ev.region)}</div>
    <div class="edesc">${esc(ev.desc)}</div>
    <span class="tsearch">🔗 접수·정보 보기 →</span>
  </a>`;
}
function renderEvents(){
  const items = EVENTS.filter(ev=> evtFilter==='all' || ev.type===evtFilter);
  $('#eventList').innerHTML = items.length ? items.map(eventCardHTML).join('') : `<div class="empty">해당 행사가 없어요.</div>`;
}
function setupEvents(){
  $$('#evtFilter .fchip').forEach(f=>{
    f.addEventListener('click',()=>{
      $$('#evtFilter .fchip').forEach(x=>x.classList.remove('on'));
      f.classList.add('on');
      evtFilter=f.dataset.e; renderEvents();
    });
  });
}

/* ---------- 4. 박지 + 필터 ---------- */
const SPOT_PAGE = 12;
const REGION_ORDER = ['수도권','강원','충청','경상','전라','제주'];
function regionGroup(region){
  if(/서울|인천|경기/.test(region)) return '수도권';
  if(/강원/.test(region)) return '강원';
  if(/충남|충북|대전|세종|충청/.test(region)) return '충청';
  if(/경남|경북|대구|울산|부산|경상/.test(region)) return '경상';
  if(/전남|전북|광주|전라/.test(region)) return '전라';
  if(/제주/.test(region)) return '제주';
  return '기타';
}
const DIFF_LV = { '하':1, '중':2, '상':3 };
let spotFilter='all', spotQuery='', spotRegion='', spotDiff='', spotLimit=SPOT_PAGE;
function filteredSpots(){
  const q = spotQuery.trim().toLowerCase();
  return SPOTS.filter(sp=>{
    if(spotFilter==='nocar'){ if(sp.car) return false; }
    else if(spotFilter!=='all'){ if(sp.type!==spotFilter) return false; }
    if(spotRegion && regionGroup(sp.region)!==spotRegion) return false;
    if(spotDiff && sp.difficulty!==spotDiff) return false;
    if(q){
      const hay = (sp.name+' '+sp.region+' '+sp.season+' '+sp.keyword.join(' ')+' '+sp.vibe.join(' ')).toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });
}
// 박지 키워드·유형으로 테마 사진 매칭 (assets/spots/{theme}.jpg)
function spotTheme(sp){
  const k = sp.keyword.join(' '), s = sp.season || '';
  if(/은하수|별/.test(k)) return 'galaxy';
  if(/억새/.test(k)) return 'grass';
  if(/설경|상고대/.test(k) || /겨울/.test(s)) return 'snow';
  if(/일출|운해/.test(k)) return 'sunrise';
  if(/철쭉|야생화|참꽃|청보리|유채|화원|초원|고원|고지대|풍력/.test(k)) return 'meadow';
  if(sp.type==='섬') return 'island';
  if(sp.type==='캠핑장') return 'deck';
  return 'ridge';
}
// 박지 네이버 검색/날씨 URL
function spotCleanName(sp){ return sp.name.replace(/[()·]/g,' ').replace(/\s+/g,' ').trim(); }
function spotSearch(sp){ return naverURL(spotCleanName(sp) + ' 백패킹'); }
function spotWeather(sp){ return naverURL(spotCleanName(sp) + ' 날씨'); }
function spotCardHTML(sp){
  const th = spotTheme(sp);
  return `<div class="spot card-static">
    <div class="sthumb theme-${th}" style="background-image:url('assets/spots/${th}.jpg')">
      <span class="stype">${esc(sp.type)}</span>
    </div>
    <div class="sbody">
      <div class="sh"><span class="snm">${esc(sp.name)}</span> <span class="sregion">${esc(sp.region)}</span></div>
      <div class="sdesc">${esc(sp.desc)}</div>
      <div class="sinfo">
        <span class="pill diff d${DIFF_LV[sp.difficulty]||2}">난이도 ${esc(sp.difficulty)}</span>
        <span class="pill">${esc(sp.season)}</span>
        <span class="pill ${sp.car?'car':''}">${sp.car?'🚗 자차권장':'🚌 자차없이 OK'}</span>
        ${sp.keyword.map(k=>`<span class="pill">#${esc(k)}</span>`).join('')}
      </div>
      <div class="sacts">
        <a class="sact" href="${spotSearch(sp)}" target="_blank" rel="noopener">🔍 사진·후기</a>
        <a class="sact wx" href="${spotWeather(sp)}" target="_blank" rel="noopener">🌤 날씨</a>
      </div>
    </div>
  </div>`;
}
function renderSpots(){
  const items = filteredSpots();
  const shown = items.slice(0, spotLimit);
  $('#spotList').innerHTML = shown.length
    ? shown.map(spotCardHTML).join('')
    : `<div class="empty">조건에 맞는 박지가 없어요. 검색어나 필터를 바꿔보세요 🙂</div>`;
  $('#spotCount').textContent = items.length;
  const more = $('#spotMore'), coll = $('#spotCollapse');
  if(items.length > spotLimit){ more.style.display=''; more.textContent = `더 보기 ▾ (남은 ${items.length - spotLimit}곳)`; }
  else more.style.display='none';
  coll.style.display = spotLimit>SPOT_PAGE ? '' : 'none';
}
function moreSpots(){ spotLimit += SPOT_PAGE; renderSpots(); }
function collapseSpots(){ spotLimit = SPOT_PAGE; renderSpots(); scrollTo2('spots'); }
function setupSpots(){
  $('#spotTotal').textContent = SPOTS.length;
  // 지역 드롭다운 (권역별 개수)
  const gc = {};
  SPOTS.forEach(sp=>{ const g=regionGroup(sp.region); gc[g]=(gc[g]||0)+1; });
  const regs = REGION_ORDER.filter(g=>gc[g]);
  if(gc['기타']) regs.push('기타');
  $('#fRegion').insertAdjacentHTML('beforeend',
    regs.map(g=>`<option value="${g}">${g} (${gc[g]})</option>`).join(''));
  $('#fRegion').addEventListener('change', e=>{ spotRegion=e.target.value; spotLimit=SPOT_PAGE; renderSpots(); });
  $('#fDiff').addEventListener('change',  e=>{ spotDiff=e.target.value;  spotLimit=SPOT_PAGE; renderSpots(); });
  let deb;
  $('#spotSearch').addEventListener('input', e=>{
    clearTimeout(deb);
    deb = setTimeout(()=>{ spotQuery=e.target.value; spotLimit=SPOT_PAGE; renderSpots(); }, 160);
  });
  $$('#spotFilter .fchip').forEach(f=>{
    f.addEventListener('click',()=>{
      $$('#spotFilter .fchip').forEach(x=>x.classList.remove('on'));
      f.classList.add('on');
      spotFilter=f.dataset.f; spotLimit=SPOT_PAGE; renderSpots();
    });
  });
}

/* ---------- 5. 체크리스트 ---------- */
function renderCheck(){
  $('#checkList').innerHTML = CHECKLIST.map((c,i)=>`
    <div class="ci" data-i="${i}"><span class="box"></span><span class="lbl">${c}</span></div>`).join('');
  $$('#checkList .ci').forEach(ci=>ci.addEventListener('click',()=>ci.classList.toggle('done')));
}

/* ---------- 홈 바로가기 카드 ---------- */
function renderMenu(){
  const items = [
    { v:'gear',    ic:'⛺', t:'장비 카탈로그', d:`텐트 ${TENTS.length}종 + 침낭·매트·배낭·스토브·랜턴` },
    { v:'spots',   ic:'📍', t:'박지 가이드',   d:`전국 백패킹 성지 ${SPOTS.length}곳 · 사진·날씨` },
    { v:'events',  ic:'🎽', t:'행사',          d:`백패킹·트레일러닝 ${EVENTS.length}개 · 미리 접수` },
    { v:'deals',   ic:'🔥', t:'할인·블프',     d:`장비 세일·블랙프라이데이 캘린더` },
    { v:'reviews', ic:'✍️', t:'다녀온 후기',   d:`크루 후기·사진 + 오픈채팅 참여` },
  ];
  $('#menuGrid').innerHTML = items.map(m=>`
    <button class="mcard" onclick="showView('${m.v}')">
      <div class="mic">${m.ic}</div>
      <div class="mtxt"><div class="mt">${m.t}</div><div class="md">${esc(m.d)}</div></div>
      <div class="marrow">→</div>
    </button>`).join('');
}

/* ---------- 6. 크루 소개 ---------- */
function renderCrew(){
  $('#crewGrid').innerHTML = CREW.map(c=>`
    <div class="crew-card">
      <div class="ic">${c.icon}</div>
      <div class="ct">${c.title}</div>
      <div class="cd">${c.desc}</div>
    </div>`).join('');
}

/* ---------- 7. 후기 (시드 + 내 기기 저장분) ---------- */
const LS_KEY = 'ta_reviews_v1';
const esc = s => String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const loadMine = () => { try{ return JSON.parse(localStorage.getItem(LS_KEY)) || []; }catch{ return []; } };
const saveMine = arr => localStorage.setItem(LS_KEY, JSON.stringify(arr));

function reviewCard(r, mine){
  const tags = (r.tags && r.tags.length) ? r.tags : (r.tag ? [r.tag] : []);
  const meta = [
    r.gear ? `<span class="p gear">⛺ ${esc(r.gear)}</span>` : '',
    ...tags.map(t=>`<span class="p">#${esc(t)}</span>`)
  ].filter(Boolean).join('');
  // 다녀온 박지를 헤더에 눈에 띄게 노출 (#4)
  const sub = r.spot ? `📍 ${esc(r.spot)}${r.when?` · ${esc(r.when)}`:''}`
            : (r.when ? `🗓 ${esc(r.when)}` : (tags.slice(0,2).map(esc).join(' · ') || '팀아온다'));
  return `<div class="review${mine?' mine':''}">
    <div class="rh">
      <div class="av">${esc(r.name.slice(0,1))}</div>
      <div><div class="rn">${esc(r.name)}${mine?' <span style="font-size:10px;color:var(--sage)">· 내 후기</span>':''}</div>
        <div class="rt${r.spot?' rt-spot':''}">${sub}</div></div>
      <div class="stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
    </div>
    <div class="rtext">"${esc(r.text)}"</div>
    ${(typeof r.photo==='string' && /^data:image\//.test(r.photo)) ? `<img class="rphoto" src="${r.photo}" loading="lazy" alt="후기 사진">` : ''}
    ${meta?`<div class="rmeta">${meta}</div>`:''}
    ${mine?`<div style="text-align:right;margin-top:6px"><button class="del" onclick="deleteReview(${r.id})">삭제</button></div>`:''}
  </div>`;
}
/* ── Supabase 백엔드 (설정 시 전체공유, 미설정 시 localStorage) ── */
let remoteReviews = null;      // 원격 로드 결과 (enabled일 때)
const supaOn = () => typeof SUPABASE!=='undefined' && SUPABASE.url && SUPABASE.key;
const supaHeaders = () => {
  const h = { apikey: SUPABASE.key, 'Content-Type':'application/json' };
  if(String(SUPABASE.key).startsWith('eyJ')) h.Authorization = 'Bearer '+SUPABASE.key; // 레거시 anon JWT일 때만
  return h;
};
async function fetchRemoteReviews(){
  try{
    const res = await fetch(`${SUPABASE.url}/rest/v1/reviews?select=*&order=id.desc`, { headers: supaHeaders() });
    if(!res.ok) throw new Error('HTTP '+res.status);
    const rows = await res.json();
    remoteReviews = rows.map(r=>({ ...r, when:r.visited }));   // visited 컬럼 → when 필드
  }catch(e){ remoteReviews = []; console.warn('후기 로드 실패:', e.message); }
  renderReviews();
}
function renderReviews(){
  let html;
  if(supaOn()){
    html = (remoteReviews||[]).map(r=>reviewCard(r,false)).join('')
         + REVIEWS.map(r=>reviewCard(r,false)).join('');
  }else{
    html = loadMine().map(r=>reviewCard(r,true)).join('')
         + REVIEWS.map(r=>reviewCard(r,false)).join('');
  }
  $('#reviewList').innerHTML = html;
}
function deleteReview(id){
  if(!confirm('이 후기를 삭제할까요?')) return;
  saveMine(loadMine().filter(r=>r.id!==id));
  renderReviews();
  toast('후기를 삭제했어요');
}

/* ---------- 후기 폼 ---------- */
let fStars = 0;
const fTags = new Set();
let fPhoto = null;   // 첨부 사진 (압축된 dataURL)
// 이미지 압축 → 작은 JPEG dataURL (용량 절약)
function compressImage(file, maxDim, quality){
  return new Promise((resolve, reject)=>{
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = ()=>{
      let w = img.naturalWidth, h = img.naturalHeight;
      const scale = Math.min(1, maxDim/Math.max(w,h));
      w = Math.round(w*scale); h = Math.round(h*scale);
      const c = document.createElement('canvas'); c.width=w; c.height=h;
      c.getContext('2d').drawImage(img,0,0,w,h);
      URL.revokeObjectURL(url);
      try{ resolve(c.toDataURL('image/jpeg', quality)); }catch(e){ reject(e); }
    };
    img.onerror = ()=>{ URL.revokeObjectURL(url); reject(new Error('이미지 로드 실패')); };
    img.src = url;
  });
}
function clearPhoto(){
  fPhoto = null;
  const inp=$('#f-photo'); if(inp) inp.value='';
  const pv=$('#f-photo-preview'); if(pv) pv.style.display='none';
}
function setupReviewForm(){
  // 박지 드롭다운
  const sel = $('#f-spot');
  sel.innerHTML = `<option value="">— 박지 선택 —</option>`
    + SPOTS.map(s=>`<option value="${s.name}">${s.name} (${s.type})</option>`).join('')
    + `<option value="기타">기타 / 직접 입력</option>`;
  // 별점
  $$('#f-stars span').forEach(st=>{
    st.addEventListener('click',()=>{ fStars = +st.dataset.s; paintStars(); });
  });
  // 태그
  $$('#f-tags .tg').forEach(tg=>{
    tg.addEventListener('click',()=>{
      const t=tg.dataset.t;
      if(fTags.has(t)){ fTags.delete(t); tg.classList.remove('on'); }
      else{ fTags.add(t); tg.classList.add('on'); }
    });
  });
  // 글자수
  $('#f-text').addEventListener('input', e=> $('#f-cnt').textContent = e.target.value.length);
  // 사진 첨부 (압축 후 미리보기)
  $('#f-photo').addEventListener('change', async e=>{
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    if(!/^image\//.test(file.type)){ toast('이미지 파일만 첨부할 수 있어요'); clearPhoto(); return; }
    try{
      fPhoto = await compressImage(file, 900, 0.65);
      $('#f-photo-img').src = fPhoto;
      $('#f-photo-preview').style.display = '';
    }catch(err){ toast('사진 처리에 실패했어요'); clearPhoto(); console.warn(err); }
  });
  // 백엔드 설정 시 안내문 갱신
  if(supaOn()){ const n=$('.rform .fnote2'); if(n) n.innerHTML='등록하면 <b>크루 전체</b>에게 바로 공유되고 모든 기기에서 보여요.'; }
}
function paintStars(){ $$('#f-stars span').forEach(s=> s.classList.toggle('on', +s.dataset.s <= fStars)); }

function clearForm(){
  ['f-name','f-when','f-gear','f-text'].forEach(id=>$('#'+id).value='');
  $('#f-cnt').textContent='0'; $('#f-spot').value=''; fStars=0; paintStars();
  fTags.clear(); $$('#f-tags .tg').forEach(t=>t.classList.remove('on'));
  clearPhoto();
}
async function submitReview(ev){
  const name = $('#f-name').value.trim();
  const text = $('#f-text').value.trim();
  const spot = $('#f-spot').value;
  const when = $('#f-when').value.trim();
  const gear = $('#f-gear').value.trim();
  if(!name){ toast('닉네임을 입력해 주세요 🙏'); $('#f-name').focus(); return; }
  if(!fStars){ toast('만족도(별점)를 선택해 주세요 ⭐'); return; }
  if(text.length < 10){ toast('후기를 조금만 더 구체적으로 적어주세요 (10자 이상)'); $('#f-text').focus(); return; }

  const tags = [...fTags];

  // 백엔드 설정 시: 전체 공유 (Supabase에 저장)
  if(supaOn()){
    const btn = ev && ev.target; if(btn){ btn.disabled=true; btn.textContent='등록 중…'; }
    try{
      const res = await fetch(`${SUPABASE.url}/rest/v1/reviews`, {
        method:'POST', headers:{ ...supaHeaders(), Prefer:'return=minimal' },
        body: JSON.stringify({ name, text, spot, visited:when, gear, stars:fStars, tags, photo:fPhoto })
      });
      if(!res.ok) throw new Error('HTTP '+res.status);
      clearForm();
      await fetchRemoteReviews();
      toast('✅ 후기 등록 완료! 크루 모두에게 공유됐어요');
    }catch(e){
      toast('등록에 실패했어요 😢 잠시 후 다시 시도해 주세요');
      console.warn('후기 등록 실패:', e.message);
    }finally{ if(btn){ btn.disabled=false; btn.textContent='후기 등록하기'; } }
    return;
  }

  // 미설정 시: 이 기기에 저장 + 카톡 공유
  const r = { id: Date.now(), name, text, spot, when, gear, stars: fStars, tags, photo: fPhoto };
  const mine = loadMine(); mine.unshift(r); saveMine(mine);
  renderReviews(); clearForm(); showShare(r);
}

// 등록 후 카톡 공유 안내
function showShare(r){
  const spot = r.spot && r.spot!=='기타' ? r.spot : '';
  const share = `[팀아온다 후기] ${r.name} ${'★'.repeat(r.stars)}\n`
    + (spot?`📍 ${spot}${r.when?' · '+r.when:''}\n`:'')
    + (r.gear?`⛺ ${r.gear}\n`:'')
    + `\n${r.text}`;
  const kakao = (typeof CONTACT!=='undefined' && CONTACT.kakao) ? CONTACT.kakao : '';
  const doShare = async ()=>{
    try{
      if(navigator.share){ await navigator.share({text:share}); }
      else{ await navigator.clipboard.writeText(share); toast('후기가 복사됐어요! 오픈채팅에 붙여넣기 하세요'); if(kakao) window.open(kakao,'_blank'); }
    }catch{ if(kakao) window.open(kakao,'_blank'); }
  };
  toast('✅ 후기가 등록됐어요! 크루와 공유하려면 탭하세요', 4200, doShare);
}

/* ---------- 연락처 채널 ---------- */
function setupContact(){
  if(typeof CONTACT==='undefined') return;
  const k=$('#join-kakao'); if(k && CONTACT.kakao) k.href=CONTACT.kakao;
  const ig=$('#join-insta');
  if(ig){
    if(CONTACT.instagram){ ig.href=CONTACT.instagram; }
    else{ ig.style.display='none'; }   // 인스타 핸들 미입력 시 버튼 숨김
  }
}

/* ---------- 토스트 ---------- */
let toastTimer;
function toast(msg, ms=2400, onTap){
  const t=$('#toast'); t.textContent=msg; t.classList.add('show');
  t.onclick = onTap ? (()=>{ onTap(); t.classList.remove('show'); }) : null;
  t.style.cursor = onTap ? 'pointer' : 'default';
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'), ms);
}

/* ---------- 히어로 별 ---------- */
function renderStars(){
  const box = $('#stars'); if(!box) return;
  // 시드 기반 의사난수 (Math.random 미사용 — 렌더 일관성)
  let seed = 7; const rnd = ()=>{ seed=(seed*9301+49297)%233280; return seed/233280; };
  let h='';
  for(let i=0;i<26;i++){
    h+=`<i style="left:${(rnd()*100).toFixed(1)}%;top:${(rnd()*70).toFixed(1)}%;opacity:${(0.3+rnd()*0.6).toFixed(2)}"></i>`;
  }
  box.innerHTML=h;
}

/* ---------- init ---------- */
renderMenu(); renderCrew(); setupTentControls(); renderTents(); renderDeals(); setupSpots(); renderSpots();
setupEvents(); renderEvents();
renderReviews(); renderCheck(); renderStars();
setupReviewForm(); setupContact();
setupViews();                        // 앱형 탭 뷰 전환 (홈 뷰로 시작)
if(supaOn()) fetchRemoteReviews();   // 백엔드 설정 시 전체 후기 로드
