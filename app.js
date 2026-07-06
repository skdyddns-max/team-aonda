/* ============================================================
   팀아온다 — 앱 로직 (매칭 엔진 + 렌더링)
   ============================================================ */
const $  = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const won = n => n.toLocaleString('ko-KR')+"원";

function scrollTo2(id){ document.getElementById(id).scrollIntoView({behavior:'smooth'}); }

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

  html += `<div style="font-size:13px;font-weight:800;color:var(--forest);margin:14px 0 8px">추천 박지</div>`;
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

  html += `<button class="btn btn-ghost" style="width:100%;margin-top:12px;color:var(--forest);border-color:var(--sage)"
            onclick="scrollTo2('tents')">전체 텐트 비교 보기 →</button>`;

  res.innerHTML = html;
  res.classList.add('show');
  setTimeout(()=>res.scrollIntoView({behavior:'smooth',block:'nearest'}),80);
}

/* ---------- 2. 텐트 데이터베이스 (검색·필터·정렬·페이지네이션) ---------- */
const PAGE = 24;
const tState = { q:'', kw:null, brand:'', cap:'', sort:'weight', limit:PAGE };

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
  let items = TENTS.filter(t=>{
    if(tState.kw && !kwPass(t,tState.kw)) return false;
    if(tState.brand && t.brand!==tState.brand) return false;
    if(tState.cap){
      const tn = parseInt(t.cap);
      if(tState.cap==='3인'){ if(tn<3) return false; }        // 3인+
      else if(tn !== parseInt(tState.cap)) return false;      // 1인·2인 정확히
    }
    if(q){
      const kr = (typeof BRAND_KR!=='undefined' && BRAND_KR[t.brand]) || '';
      const hay = (t.name+' '+t.brand+' '+kr+' '+t.tags.join(' ')).toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });
  const s = tState.sort;
  items.sort((a,b)=>
    s==='price'  ? a.price-b.price :
    s==='priceD' ? b.price-a.price :
    s==='brand'  ? a.brand.localeCompare(b.brand) || a.weight-b.weight :
                   a.weight-b.weight);
  return items;
}
function tentCardHTML(t){
  return `<div class="tcard">
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
  </div>`;
}
function renderTents(){
  const list = $('#tentList');
  const items = filteredTents();
  const shown = items.slice(0, tState.limit);
  list.innerHTML = shown.length
    ? shown.map(tentCardHTML).join('')
    : `<div class="empty">조건에 맞는 텐트가 없어요. 검색어나 필터를 바꿔보세요 🙂</div>`;
  $('#tentCount').textContent = items.length;
  const more = $('#tentMore');
  if(items.length > tState.limit){
    more.style.display=''; more.textContent = `더 보기 ▾ (남은 ${items.length - tState.limit}종)`;
  } else more.style.display='none';
}
function moreTents(){ tState.limit += PAGE; renderTents(); }
function resetLimit(){ tState.limit = PAGE; }

function setupTentControls(){
  // 총계 표시
  $('#tentTotal').textContent = TENTS.length;
  $('#brandTotal').textContent = new Set(TENTS.map(t=>t.brand)).size;
  // 브랜드 드롭다운 (텐트 많은 순)
  const cnt = {};
  TENTS.forEach(t=>cnt[t.brand]=(cnt[t.brand]||0)+1);
  const brands = Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a] || a.localeCompare(b));
  $('#fBrand').insertAdjacentHTML('beforeend',
    brands.map(b=>`<option value="${esc(b)}">${esc(b)} (${cnt[b]})</option>`).join(''));
  // 검색 (디바운스)
  let deb;
  $('#tentSearch').addEventListener('input', e=>{
    clearTimeout(deb);
    deb = setTimeout(()=>{ tState.q=e.target.value; resetLimit(); renderTents(); }, 160);
  });
  $('#fBrand').addEventListener('change', e=>{ tState.brand=e.target.value; resetLimit(); renderTents(); });
  $('#fSort').addEventListener('change',  e=>{ tState.sort=e.target.value;  resetLimit(); renderTents(); });
  // 무게·가격 기준 세그먼트 (전체 / 1인 / 2인 / 3인+)
  $$('#capSeg button').forEach(b=>{
    b.addEventListener('click',()=>{
      $$('#capSeg button').forEach(x=>x.classList.remove('on'));
      b.classList.add('on');
      tState.cap = b.dataset.cap;
      resetLimit(); renderTents();
    });
  });
  // 키워드 칩
  $$('#kwRow .kw').forEach(kw=>{
    kw.addEventListener('click',()=>{
      const v=kw.dataset.kw;
      if(tState.kw===v){ tState.kw=null; kw.classList.remove('on'); }
      else{ tState.kw=v; $$('#kwRow .kw').forEach(k=>k.classList.remove('on')); kw.classList.add('on'); }
      resetLimit(); renderTents();
    });
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

/* ---------- 4. 박지 + 필터 ---------- */
const SPOT_PAGE = 12;
let spotFilter = 'all', spotQuery = '', spotLimit = SPOT_PAGE;
function filteredSpots(){
  const q = spotQuery.trim().toLowerCase();
  return SPOTS.filter(sp=>{
    if(spotFilter==='nocar'){ if(sp.car) return false; }
    else if(spotFilter!=='all'){ if(sp.type!==spotFilter) return false; }
    if(q){
      const hay = (sp.name+' '+sp.region+' '+sp.season+' '+sp.keyword.join(' ')+' '+sp.vibe.join(' ')).toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });
}
function spotCardHTML(sp){
  return `<div class="spot">
    <div class="sh">
      <div><span class="snm">${esc(sp.name)}</span> <span class="sregion">${esc(sp.region)}</span></div>
      <span class="stype">${esc(sp.type)}</span>
    </div>
    <div class="sdesc">${esc(sp.desc)}</div>
    <div class="sinfo">
      <span class="pill">난이도 ${esc(sp.difficulty)}</span>
      <span class="pill">${esc(sp.season)}</span>
      <span class="pill ${sp.car?'car':''}">${sp.car?'🚗 자차권장':'🚌 자차없이 OK'}</span>
      ${sp.keyword.map(k=>`<span class="pill">#${esc(k)}</span>`).join('')}
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
  const more = $('#spotMore');
  if(items.length > spotLimit){ more.style.display=''; more.textContent = `더 보기 ▾ (남은 ${items.length - spotLimit}곳)`; }
  else more.style.display='none';
}
function moreSpots(){ spotLimit += SPOT_PAGE; renderSpots(); }
function setupSpots(){
  $('#spotTotal').textContent = SPOTS.length;
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
    r.spot ? `<span class="p spot">📍 ${esc(r.spot)}</span>` : '',
    r.when ? `<span class="p">🗓 ${esc(r.when)}</span>` : '',
    r.gear ? `<span class="p gear">⛺ ${esc(r.gear)}</span>` : '',
    ...tags.map(t=>`<span class="p">#${esc(t)}</span>`)
  ].filter(Boolean).join('');
  return `<div class="review${mine?' mine':''}">
    <div class="rh">
      <div class="av">${esc(r.name.slice(0,1))}</div>
      <div><div class="rn">${esc(r.name)}${mine?' <span style="font-size:10px;color:var(--sage)">· 내 후기</span>':''}</div>
        <div class="rt">${tags.slice(0,2).map(esc).join(' · ') || '팀아온다'}</div></div>
      <div class="stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
    </div>
    <div class="rtext">"${esc(r.text)}"</div>
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
  // 백엔드 설정 시 안내문 갱신
  if(supaOn()){ const n=$('.rform .fnote2'); if(n) n.innerHTML='등록하면 <b>크루 전체</b>에게 바로 공유되고 모든 기기에서 보여요.'; }
}
function paintStars(){ $$('#f-stars span').forEach(s=> s.classList.toggle('on', +s.dataset.s <= fStars)); }

function clearForm(){
  ['f-name','f-when','f-gear','f-text'].forEach(id=>$('#'+id).value='');
  $('#f-cnt').textContent='0'; $('#f-spot').value=''; fStars=0; paintStars();
  fTags.clear(); $$('#f-tags .tg').forEach(t=>t.classList.remove('on'));
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
        body: JSON.stringify({ name, text, spot, visited:when, gear, stars:fStars, tags })
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
  const r = { id: Date.now(), name, text, spot, when, gear, stars: fStars, tags };
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
renderCrew(); setupTentControls(); renderTents(); renderDeals(); setupSpots(); renderSpots();
renderReviews(); renderCheck(); renderStars();
setupReviewForm(); setupContact();
if(supaOn()) fetchRemoteReviews();   // 백엔드 설정 시 전체 후기 로드
