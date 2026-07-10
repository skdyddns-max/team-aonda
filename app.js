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
// 앱형 탭 뷰 전환 (한 번에 한 섹션만) + 브라우저 뒤로가기 연동
let currentView = 'home';
const VALID_VIEWS = ['home','gear','spots','events','deals','reviews'];
function showView(v, push=true){
  if(!VALID_VIEWS.includes(v)) v='home';
  document.querySelectorAll('[data-view]').forEach(el=>{ el.style.display = (el.dataset.view===v) ? '' : 'none'; });
  $$('#navTabs a').forEach(a=>a.classList.toggle('active', a.dataset.tab===v));
  currentView = v;
  window.scrollTo(0,0);
  if(push){ try{ history.pushState({view:v}, '', '#'+v); }catch(e){} }
  if(v==='reviews'){   // 발자국 지도: 뷰가 보일 때 초기화(숨김 상태 init 시 타일 깨짐)
    initTripMap();
    if(tripMap) setTimeout(()=>tripMap.invalidateSize(), 80);
  }
  if(v==='spots' && spotViewMode==='map' && spotMap) setTimeout(()=>{ spotMap.invalidateSize(); refreshSpotMarkers(); }, 80);
  updatePackVis();     // 내 장비함 바: 장비 탭에서만 표시
}
function setupViews(){
  $$('#navTabs a').forEach(a=> a.addEventListener('click', ()=>showView(a.dataset.tab)) );
  // 초기 뷰: URL 해시가 유효하면 그걸로, 아니면 home
  const initial = (location.hash||'').replace('#','');
  const v = VALID_VIEWS.includes(initial) ? initial : 'home';
  try{ history.replaceState({view:v}, '', '#'+v); }catch(e){}
  showView(v, false);
  // 뒤로가기/앞으로가기 → 이전 탭으로 (사이트 이탈 대신)
  window.addEventListener('popstate', e=>{
    const lb = $('#lightbox');
    if(lb && lb.style.display==='flex'){ closeLightbox(); }   // 라이트박스 열려있으면 먼저 닫기
    showView((e.state && e.state.view) || 'home', false);
  });
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
    a.vibe && (a.vibe==='솔캠'?'솔캠':'친목'),
    a.place, a.weight && `${a.weight} 무게`,
    a.car && (a.car==='no'?'대중교통':'자차'),
    a.budget && ({low:'가성비 예산',mid:'중급 예산',high:'프리미엄 예산'})[a.budget]
  ].filter(Boolean).join(' · ');

  let html = `<div class="res-head">당신의 프로필 — ${profile}</div>`;

  html += `<div style="font-size:13px;font-weight:800;color:var(--forest);margin:4px 0 8px">추천 텐트</div>`;
  tents.forEach((x,i)=>{
    const t=x.t;
    html += `<div class="pick">
      <div class="top"><span class="nm">${i===0?'':''}${t.name}</span>
        <span class="badge">${t.wclass}</span></div>
      <div class="meta">${t.brand} · ${t.weight}kg · ${t.cap} · <span class="price">${won(t.price)}</span></div>
      <div class="why">${x.reasons.slice(0,3).join(', ') || '전반적으로 무난한 선택'}</div>
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
        <div class="why">${esc(it.note)}</div>
      </div>`;
    });
    html += `<p style="font-size:11px;color:var(--muted);margin:2px 2px 4px">※ 예산은 텐트 예산과 같은 기준으로 맞췄어요. 품목별 대략가이며 브랜드는 예시입니다.</p>`;
  }

  html += `<div style="font-size:13px;font-weight:800;color:var(--forest);margin:16px 0 8px">추천 박지</div>`;
  if(spots[0] && spots[0].s>0){
    spots.forEach((x,i)=>{
      const sp=x.sp;
      html += `<div class="pick">
        <div class="top"><span class="nm">${sp.name}</span>
          <span class="badge" style="background:var(--forest)">${sp.type}</span></div>
        <div class="meta">${sp.region} · 난이도 ${sp.difficulty} · ${sp.season}</div>
        <div class="why">${x.reasons.slice(0,3).join(', ')}</div>
      </div>`;
    });
  } else {
    html += `<div class="empty">조건에 딱 맞는 박지가 없어요. 자차 여부나 박지 종류를 바꿔보세요 🙂</div>`;
  }

  html += `<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
    <button class="btn btn-ghost" style="flex:1;min-width:130px;color:var(--forest);border-color:var(--sage)"
      onclick="showView('gear')">전체 텐트 보기</button>
    <button class="btn btn-ghost" style="flex:1;min-width:130px;color:var(--forest);border-color:var(--sage)"
      onclick="showView('spots')">전체 박지 보기</button>
  </div>`;

  res.innerHTML = html;
  res.classList.add('show');
  setTimeout(()=>res.scrollIntoView({behavior:'smooth',block:'nearest'}),80);
}

/* ---------- 매칭 엔진 (오토캠핑) — 대형텐트 + 서브장비 + 캠핑장 ---------- */
function runMatchCamp(){
  const a = answers;
  if(!a.party || !a.budgetC){ alert('인원과 예산은 꼭 선택해 주세요 🙏'); return; }
  const [bMin,bMax] = ({low:[0,30], mid:[30,70], high:[70,9999]})[a.budgetC];
  // 대형텐트 점수화 (가격 = 만원 단위)
  const T = tags => x => tags.some(t=>x.tags.includes(t));
  const tents = CAMP_GEAR_ITEMS["대형텐트"].map(t=>{
    let s=0; const reasons=[];
    if(t.price>=bMin && t.price<=bMax){ s+=30; reasons.push('예산 적합'); }
    else if(t.price<bMin) s+=10;
    if(a.party==='solo'  && T(['돔형','티피','입문','간편설치'])(t)){ s+=20; reasons.push('소인원 설치 간편'); }
    if(a.party==='family'&& T(['2룸','터널형','거실형','패밀리'])(t)){ s+=20; reasons.push('가족용 거실 공간'); }
    if(a.party==='group' && T(['거실형','벨텐트','터널형','쉘터'])(t)){ s+=18; reasons.push('단체 수용'); }
    if(a.style==='감성' && T(['감성','벨텐트','면텐트','티피'])(t)){ s+=25; reasons.push('감성 무드'); }
    if(a.style==='기능' && T(['2룸','터널형','암실옵션','거실형'])(t)){ s+=20; reasons.push('실용 구조'); }
    if(a.style==='입문'){ if(t.value){ s+=25; reasons.push('가성비'); } if(T(['입문'])(t)) s+=15; }
    if(a.when==='겨울' && T(['핫텐트','동계','동계강함','쉘터'])(t)){ s+=15; reasons.push('동계 대응'); }
    return {t,s,reasons};
  }).sort((x,y)=>y.s-x.s).slice(0,2);
  // 함께 챙기면 좋은 장비 (계절·전기 기반 1~2개)
  const pickBy = (cat,re) => (CAMP_GEAR_ITEMS[cat]||[]).find(g=>re.test(g.tags.join(' ')+g.name));
  const extras = [];
  if(a.when==='겨울'){
    const st = pickBy('난방·전원',/등유난로/); if(st) extras.push({g:st, why:'동계 필수 — 일산화탄소 경보기와 함께'});
    if(a.elec==='yes'){ const eb=pickBy('난방·전원',/전기요|전기담요/); if(eb) extras.push({g:eb, why:'전기사이트면 바닥 보온 해결'}); }
  } else {
    const ic = pickBy('아이스박스',/가성비|대용량/); if(ic) extras.push({g:ic, why:'식재료 보냉'});
  }
  if(a.style==='감성' && extras.length<2){ const lt=pickBy('랜턴',/감성/); if(lt) extras.push({g:lt, why:'밤 분위기 담당'}); }
  // 캠핑장 점수화
  const grounds = CAMPGROUNDS.map(cg=>{
    let s=0; const reasons=[];
    if(a.elec==='yes'){ if(cg.elec){ s+=30; reasons.push('전기 사이트'); } else s-=30; }
    if(a.when==='겨울' && /사계절/.test(cg.season)){ s+=20; reasons.push('사계절 운영'); }
    if(a.when==='여름' && /여름|사계절/.test(cg.season)){ s+=12; }
    if(a.style==='감성' && (cg.type==='글램핑'||cg.type==='휴양림')){ s+=15; reasons.push('감성·숲'); }
    if(a.style==='기능' && cg.type==='오토'){ s+=10; }
    if(a.party==='family' && (cg.keyword||[]).includes('가족')){ s+=15; reasons.push('가족 캠핑 인기'); }
    if(a.party==='solo' && a.style==='감성' && cg.type==='글램핑'){ s+=10; }
    return {cg,s,reasons};
  }).sort((x,y)=>y.s-x.s).slice(0,2);
  // 렌더
  const profile = [
    ({solo:'솔로·커플',family:'가족',group:'단체'})[a.party], a.style, a.when,
    a.elec && (a.elec==='yes'?'전기':'무전원'),
    ({low:'가성비 예산',mid:'중급 예산',high:'프리미엄 예산'})[a.budgetC]
  ].filter(Boolean).join(' · ');
  let html = `<div class="res-head">당신의 프로필 — ${profile}</div>`;
  html += `<div style="font-size:13px;font-weight:800;color:var(--forest);margin:4px 0 8px">추천 텐트</div>`;
  tents.forEach(x=>{
    const t=x.t;
    html += `<div class="pick">
      <div class="top"><span class="nm">${esc(t.name)}</span><span class="badge">~${t.price}만</span></div>
      <div class="meta">${esc(t.brand)} · ${t.tags.slice(0,3).join(' · ')}</div>
      <div class="why">${x.reasons.slice(0,3).join(', ') || '전반적으로 무난한 선택'}</div>
    </div>`;
  });
  if(extras.length){
    html += `<div style="font-size:13px;font-weight:800;color:var(--forest);margin:16px 0 8px">함께 챙기면 좋은 장비</div>`;
    extras.forEach(x=>{
      html += `<div class="pick">
        <div class="top"><span class="nm">${esc(x.g.name)}</span><span class="badge" style="background:var(--brand);color:#2c2408">~${x.g.price}만</span></div>
        <div class="meta">${esc(x.g.brand)}</div><div class="why">${esc(x.why)}</div>
      </div>`;
    });
  }
  html += `<div style="font-size:13px;font-weight:800;color:var(--forest);margin:16px 0 8px">추천 캠핑장</div>`;
  if(grounds[0] && grounds[0].s>0){
    grounds.forEach(x=>{
      const cg=x.cg;
      html += `<div class="pick">
        <div class="top"><span class="nm">${esc(cg.name)}</span><span class="badge" style="background:var(--forest)">${esc(cg.type)}</span></div>
        <div class="meta">${esc(cg.region)} · ${esc(cg.season)}${cg.price?' · '+esc(cg.price):''}</div>
        <div class="why">${x.reasons.slice(0,3).join(', ') || '무난한 선택'}</div>
      </div>`;
    });
  } else {
    html += `<div class="empty">조건에 맞는 캠핑장이 없어요. 전기 조건을 바꿔보세요 🙂</div>`;
  }
  html += `<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
    <button class="btn btn-ghost" style="flex:1;min-width:130px;color:var(--forest);border-color:var(--sage)" onclick="showView('gear')">전체 장비 보기</button>
    <button class="btn btn-ghost" style="flex:1;min-width:130px;color:var(--forest);border-color:var(--sage)" onclick="showView('spots')">전체 캠핑장 보기</button>
  </div>`;
  const res = $('#resultCamp');
  res.innerHTML = html; res.classList.add('show');
  setTimeout(()=>res.scrollIntoView({behavior:'smooth',block:'nearest'}),80);
}
// 도메인에 따라 매칭 도구 전환 (백패킹 ↔ 오토캠핑)
function applyDomainToTool(){
  const camp = domain==='camp';
  const bp=$('#toolBp'), cp=$('#toolCamp');
  if(bp) bp.style.display = camp?'none':'';
  if(cp) cp.style.display = camp?'':'none';
  const tt=$('#toolTitle'), ts=$('#toolSub');
  if(tt) tt.textContent = camp ? '나에게 맞는 캠핑 장비 · 캠핑장 찾기' : '나에게 맞는 장비 · 박지 찾기';
  if(ts) ts.innerHTML = camp
    ? '아래 항목을 선택하면 <b>대형텐트 + 계절 장비 + 캠핑장</b>을 한 번에 추천해 드려요.'
    : '아래 항목을 선택하면 <b>텐트 + 예산별 장비(침낭·매트·배낭 등) + 박지</b>를 한 번에 추천해 드려요.';
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
    case 'fs':    return t.struct==='자립';
    case 'semi':  return t.struct==='반자립';
    case 'nfs':   return t.struct==='비자립';
    case 'sw':    return t.wall==='싱글월';
    case 'dw':    return t.wall==='더블월';
    case 'mesh':  return !!t.mesh;
    case 'nomesh':return !t.mesh;
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
// 검색어에 카테고리 단어를 붙여 모호한 모델명 보정 (예: '피라미드' → '피라미드 1P 텐트')
const CAT_QWORD = {
  '텐트':'텐트','침낭':'침낭','매트':'캠핑 매트','배낭':'배낭','스토브':'캠핑 스토브','랜턴':'랜턴',
  '취사·식수':'캠핑','소품·안전':'캠핑','의류':'',
  '대형텐트':'텐트','타프':'타프','테이블·체어':'캠핑','야전침대·침구':'캠핑','침대·침구':'캠핑',
  '화로대':'화로대','버너·키친':'캠핑','난방·전원':'캠핑','아이스박스':'아이스박스',
  '수납·운반':'캠핑','설영·정리':'캠핑','물통·위생':'캠핑',
};
function gearQ(brand, name, cat){
  const w = CAT_QWORD[cat] !== undefined ? CAT_QWORD[cat] : '캠핑';
  const base = krBrand(brand) + ' ' + name;
  return (w && !base.includes(w)) ? base + ' ' + w : base;   // 이름에 이미 있으면 중복 방지
}
function naverSearch(t){ return naverURL(gearQ(t.brand, t.name, '텐트')); }
// 네이버 이미지 검색 (썸네일 탭 → 실물 사진 바로)
function naverImgURL(q){ return 'https://search.naver.com/search.naver?where=image&query=' + encodeURIComponent(q); }
function openImg(e, q){
  e.preventDefault(); e.stopPropagation();
  window.open(naverImgURL(decodeURIComponent(q)), '_blank', 'noopener');
}
// 검색 연동 썸네일: 탭하면 네이버 '이미지' 탭으로 바로 — 카드 본문은 통합검색 유지
function searchThumb(query){
  return `<div class="tthumb" role="button" data-q="${encodeURIComponent(query||'')}" onclick="openImg(event,this.dataset.q)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="1.5"/><path d="M5 16.4l4-3 3 2 3-2.2 4 3.2"/></svg><span>실물↗</span></div>`;
}

/* ── 내 장비함 (베이스웨이트 계산기) — 카드에서 담으면 총무게·가격 합산 ── */
const PACK_REG = {};                         // pk → {cat,brand,name,weightG,priceWon}
let pack = [];
try{ pack = JSON.parse(localStorage.getItem('aonda_pack')||'[]'); }catch(e){ pack = []; }
const packHas = pk => pack.some(p=>p.pk===pk);
function packBtn(cat, brand, name, weightG, priceWon, spec){
  const pk = encodeURIComponent(brand+'|'+name);
  PACK_REG[pk] = { pk, cat, brand, name, weightG: weightG||0, priceWon: priceWon||0, spec: spec||{} };
  const inp = packHas(pk);
  return `<span class="addpack${inp?' in':''}" role="button" data-pk="${pk}" onclick="packToggle(event,this.dataset.pk)">${inp?'담김 ✓':'담기 +'}</span>`;
}
function packToggle(e, pk){
  e.preventDefault(); e.stopPropagation();
  if(packHas(pk)) pack = pack.filter(p=>p.pk!==pk);
  else if(PACK_REG[pk]) pack.push(PACK_REG[pk]);
  localStorage.setItem('aonda_pack', JSON.stringify(pack));
  renderPackUI();
}
function removePack(pk){ pack = pack.filter(p=>p.pk!==pk); localStorage.setItem('aonda_pack', JSON.stringify(pack)); renderPackUI(); }
function clearPack(){ if(pack.length && !confirm('장비함을 비울까요?')) return; pack=[]; localStorage.setItem('aonda_pack','[]'); renderPackUI(); }
function togglePackPanel(){
  const p = $('#packPanel'); if(!p) return;
  const open = p.style.display!=='none';
  p.style.display = open ? 'none' : '';
  const h = $('#packHint'); if(h) h.textContent = open ? '열기 ▴' : '닫기 ▾';
}
const fmtKg = g => g>=1000 ? (g/1000).toFixed(2)+'kg' : g+'g';
// 베이스웨이트 등급 (담은 장비 합계 기준 대략)
const packGrade = w => w<=0 ? '—' : w<=2500 ? 'SUL급' : w<=4500 ? 'UL급' : w<=7000 ? '라이트급' : '전통 백패킹';
let packView = 'sum';   // 'sum'(합계) | 'cmp'(비교표)
function setPackView(v){
  packView = v;
  $$('#packSeg button').forEach(b=>b.classList.toggle('on', b.dataset.pv===v));
  renderPackUI();
}
// 비교표: 담은 장비의 스펙을 행=항목, 열=제품으로
function renderCompare(){
  const box = $('#packCompare');
  if(pack.length<2){ box.innerHTML = `<div class="empty" style="padding:14px 0">2개 이상 담으면 스펙을 나란히 비교해요.</div>`; return; }
  const rows = ['가격','무게'];
  const specKeys = [];
  pack.forEach(p=>Object.keys(p.spec||{}).forEach(k=>{ if((p.spec[k]||p.spec[k]===0) && p.spec[k]!=='' && !specKeys.includes(k)) specKeys.push(k); }));
  const allRows = rows.concat(specKeys);
  const cell = (p,row)=>{
    if(row==='가격') return p.priceWon?`~${Math.round(p.priceWon/10000)}만`:'—';
    if(row==='무게') return p.weightG?fmtKg(p.weightG):'—';
    const v=(p.spec||{})[row]; return (v||v===0)&&v!=='' ? v : '—';
  };
  box.innerHTML = `<div class="cmp-wrap"><table class="cmp">
    <thead><tr><th></th>${pack.map(p=>`<th>${esc(p.name)}<small>${esc(p.brand)}</small></th>`).join('')}</tr></thead>
    <tbody>${allRows.map(r=>`<tr><td class="k">${esc(r)}</td>${pack.map(p=>`<td>${esc(String(cell(p,r)))}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`;
}
function renderPackUI(){
  const bar=$('#packBar'); if(!bar) return;
  const totalW = pack.reduce((s,p)=>s+(p.weightG||0),0);
  const totalP = pack.reduce((s,p)=>s+(p.priceWon||0),0);
  $('#packSummary').textContent = `내 장비함 ${pack.length} · ${fmtKg(totalW)}`;
  const cmp = packView==='cmp';
  $('#packList').style.display = cmp?'none':'';
  $('#packTotal').style.display = cmp?'none':'';
  $('#packCompare').style.display = cmp?'':'none';
  if(cmp){ renderCompare(); }
  else {
    $('#packList').innerHTML = pack.length
      ? pack.map(p=>`<div class="pp-row">
          <div class="nm">${esc(p.name)}<small>${esc(p.brand)} · ${esc(p.cat)}</small></div>
          <span class="wt">${p.weightG?fmtKg(p.weightG):'무게 —'}</span>
          <button class="rm" data-pk="${p.pk}" onclick="removePack(this.dataset.pk)" aria-label="빼기">×</button>
        </div>`).join('')
      : `<div class="empty" style="padding:14px 0">장비 카드의 <b>담기 +</b> 를 눌러보세요.</div>`;
    $('#packTotal').innerHTML = `
      <span>총무게<b>${fmtKg(totalW)}</b></span>
      <span>총가격<b>약 ${Math.round(totalP/10000)}만</b></span>
      <span class="grade">등급<b>${packGrade(totalW)}</b></span>`;
  }
  renderPackSets();
  $$('.addpack').forEach(b=>{ const i=packHas(b.dataset.pk); b.classList.toggle('in',i); b.textContent=i?'담김 ✓':'담기 +'; });
  updatePackVis();
}
/* ── 장비함 저장 세트 (여름/동계 등 여러 구성 저장) ── */
function loadSets(){ try{ return JSON.parse(localStorage.getItem('aonda_pack_sets')||'{}'); }catch(e){ return {}; } }
function saveSets(s){ localStorage.setItem('aonda_pack_sets', JSON.stringify(s)); }
function savePackSet(){
  if(!pack.length){ alert('먼저 장비를 담아주세요 🙂'); return; }
  const name = (prompt('세트 이름 (예: 동계 세트, 여름 UL)')||'').trim();
  if(!name) return;
  const sets = loadSets(); sets[name] = pack.map(p=>({...p})); saveSets(sets);
  toast(`'${name}' 저장 완료`); renderPackSets();
}
function loadPackSet(name){
  const sets = loadSets(); if(!sets[name]) return;
  pack = sets[name].map(p=>({...p}));
  pack.forEach(p=>{ PACK_REG[p.pk]=p; });   // 카드 버튼 동기화용 재등록
  localStorage.setItem('aonda_pack', JSON.stringify(pack));
  toast(`'${name}' 불러옴`); renderPackUI();
}
function deletePackSet(name){
  const sets = loadSets(); delete sets[name]; saveSets(sets); renderPackSets();
}
function renderPackSets(){
  const box = $('#packSets'); if(!box) return;
  const sets = loadSets(); const names = Object.keys(sets);
  box.innerHTML = names.length
    ? `<div class="pp-sets-h">저장된 세트</div>` + names.map(n=>{
        const d = encodeURIComponent(n);
        return `<div class="pp-set">
          <button class="ps-load" data-n="${d}" onclick="loadPackSet(decodeURIComponent(this.dataset.n))">${esc(n)} <small>${sets[n].length}개</small></button>
          <button class="ps-del" data-n="${d}" onclick="deletePackSet(decodeURIComponent(this.dataset.n))" aria-label="삭제">×</button>
        </div>`;
      }).join('')
    : '';
}
/* ── 패킹리스트 공유 (카톡 등) ── */
function sharePack(){
  if(!pack.length){ alert('먼저 장비를 담아주세요 🙂'); return; }
  const totalW = pack.reduce((s,p)=>s+(p.weightG||0),0);
  const totalP = pack.reduce((s,p)=>s+(p.priceWon||0),0);
  const lines = [
    `[팀아온다] 내 패킹리스트 (${pack.length}종)`,
    ...pack.map(p=>`· ${p.name} (${p.brand})${p.weightG?` ${fmtKg(p.weightG)}`:''}`),
    `— 총 ${fmtKg(totalW)} · 약 ${Math.round(totalP/10000)}만원 · ${packGrade(totalW)}`,
    `장비 담아보기 → ${SITE_URL}#gear`,
  ];
  shareText(lines.join('\n'));
}
function updatePackVis(){
  const bar=$('#packBar'); if(!bar) return;
  bar.style.display = (currentView==='gear' && pack.length) ? 'flex' : 'none';
  if(currentView!=='gear'){ const p=$('#packPanel'); if(p) p.style.display='none'; const h=$('#packHint'); if(h) h.textContent='열기 ▴'; }
}
function tentCardHTML(t){
  return `<a class="tcard withthumb" href="${naverSearch(t)}" target="_blank" rel="noopener">${searchThumb(gearQ(t.brand,t.name,'텐트'))}${packBtn('텐트',t.brand,t.name,Math.round(t.weight*1000),t.price,{인원:t.cap,계절:t.season===4?'사계절':'삼계절',구조:t.struct,월:t.wall})}<div class="tcontent">
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
      <span class="tag attr">${t.struct}</span>
      <span class="tag attr">${t.wall}</span>
      <span class="tag attr">${t.mesh?'메쉬':'노메쉬'}</span>
      ${t.tags.filter(tag=>!/^(자립|반자립|비자립|싱글월|더블월|프리스탠딩)$/.test(tag) && !(t.value&&tag==='가성비')).map(tag=>`<span class="tag">${esc(tag)}</span>`).join('')}
    </div>
  </div></a>`;
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

/* ── 도메인(백패킹/오토캠핑) + 장비 카테고리 ── */
let domain = 'bp';   // 'bp'(백패킹) | 'camp'(오토캠핑)
const catsFor = d => d==='camp' ? CAMP_GEAR_CATS.slice() : ['텐트', ...GEAR_CATS];
// 도메인 우선 조회 — '랜턴'처럼 양쪽에 있는 카테고리는 현재 도메인 것을 사용
const gearItemsFor = cat => domain==='camp'
  ? ((typeof CAMP_GEAR_ITEMS!=='undefined' && CAMP_GEAR_ITEMS[cat]) || [])
  : (GEAR_ITEMS[cat] || (typeof CAMP_GEAR_ITEMS!=='undefined' && CAMP_GEAR_ITEMS[cat]) || []);
function renderCatTabs(){
  const cats = catsFor(domain);
  $('#catTabs').innerHTML = cats.map((c,i)=>`<button class="${i===0?'on':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
  $$('#catTabs button').forEach(b=> b.addEventListener('click', ()=>selectCat(b.dataset.cat)) );
}
function selectDomain(d){
  domain = d;
  $$('#domainSeg button').forEach(b=>b.classList.toggle('on', b.dataset.dm===d));
  renderCatTabs();
  selectCat(catsFor(domain)[0]);   // 첫 카테고리로
  renderReviews(); renderGallery();
  applyDomainToSpots();            // 박지 ↔ 오토캠핑장 스위칭
  applyDomainToTool();             // 매칭 도구 스위칭
  checkPreset = domain==='camp' ? '오토캠핑' : '백패킹 기본';   // 체크리스트 기본 프리셋
  renderCheckTabs(); renderCheck();
}
let curCat = '텐트', gearQuery = '', gearLimit = PAGE;
const _fmtW = w => w>=1000 ? (Math.round(w/10)/100)+'kg' : w+'g';
// 침낭 계절 구분 (리밋온도 기준): 동계 ≤-10℃ · 삼계절 -9~2℃ · 여름·간절기 3℃~
function bagSeason(g){
  if(g.temp===undefined) return null;
  return g.temp<=-10 ? '동계' : (g.temp<=2 ? '삼계절' : '여름·간절기');
}
const _BAG_SEASON_CLS = { '동계':'s4', '삼계절':'s3', '여름·간절기':'s0' };
function gearCardHTML(g){
  const bs = bagSeason(g);
  return `<a class="tcard withthumb" href="${naverURL(gearQ(g.brand,g.name,curCat))}" target="_blank" rel="noopener">${searchThumb(gearQ(g.brand,g.name,curCat))}${packBtn(curCat,g.brand,g.name,g.weight||0,(g.price||0)*10000,{리밋온도:g.temp!==undefined?(g.temp>0?'+':'')+g.temp+'℃':'',충전재:g.fill,타입:g.type,'R값':g.rval,용량:g.vol?g.vol+'L':'',밝기:g.lumen?g.lumen+'lm':''})}<div class="tcontent">
    <div class="row1">
      <div><div class="brand">${esc(g.brand)}</div><div class="tname">${esc(g.name)}</div></div>
      <span style="display:flex;gap:4px;align-items:center">
        ${bs?`<span class="season ${_BAG_SEASON_CLS[bs]}">${bs}</span>`:''}
        ${g.value?'<span class="season s3">가성비</span>':''}
      </span>
    </div>
    <div class="stats">
      <div class="stat">가격<b>~${g.price}만</b></div>
      ${g.temp!==undefined?`<div class="stat">리밋<b class="w">${g.temp>0?'+':''}${g.temp}℃</b></div>`:''}
      ${g.rval!==undefined?`<div class="stat">R값<b class="w">${g.rval}</b></div>`:''}
      ${g.vol?`<div class="stat">용량<b>${g.vol}L</b></div>`:''}
      ${g.lumen?`<div class="stat">밝기<b>${g.lumen}lm</b></div>`:''}
      ${g.weight?`<div class="stat">무게<b>${_fmtW(g.weight)}</b></div>`:''}
    </div>
    <div class="tags">
      ${(g.fill||g.type)?`<span class="tag attr">${esc(g.fill||g.type)}</span>`:''}
      ${g.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}
    </div>
  </div></a>`;
}
// 카테고리별 필터 칩 (침낭: 충전재·온도대·무게)
const CAT_CHIPS = {
  "침낭": [
    ['down','다운', g=>/구스|덕/.test(g.fill||'')],
    ['syn','합성', g=>/합성/.test(g.fill||'')],
    ['sub1k','1kg 이하', g=>g.weight && g.weight<=1000],
    ['quilt','퀼트', g=>g.tags.includes('퀼트')],
  ],
  "매트": [
    ['air','에어', g=>g.type==='에어'],
    ['foam','폼', g=>g.type==='폼'],
    ['si','자충', g=>g.type==='자충'],
    ['r4','R4↑ 동계', g=>g.rval!==undefined && g.rval>=4],
    ['sub500','500g 이하', g=>g.weight && g.weight<=500],
  ],
  "배낭": [
    ['ul','UL 1kg↓', g=>g.weight && g.weight<=1000],
    ['v40','~40L', g=>g.vol && g.vol<=40],
    ['v55','41~55L', g=>g.vol && g.vol>=41 && g.vol<=55],
    ['v56','56L+', g=>g.vol && g.vol>=56],
  ],
  "스토브": [
    ['gas','가스', g=>g.type==='가스'],
    ['sys','일체형', g=>g.type==='일체형'],
    ['alc','알콜·고체', g=>/알콜|고체/.test(g.type||'')],
    ['wood','화목', g=>g.type==='화목'],
    ['liq','휘발유·멀티', g=>g.type==='휘발유'],
    ['sub100','100g 이하', g=>g.weight && g.weight<=100],
  ],
  "랜턴": [
    ['head','헤드랜턴', g=>g.tags.includes('헤드랜턴')],
    ['lant','랜턴형', g=>g.tags.includes('랜턴')],
    ['lm500','500lm+', g=>g.lumen && g.lumen>=500],
    ['sub100','100g 이하', g=>g.weight && g.weight<=100],
  ],
};
const gearKws = new Set();
// 계절 세그먼트 (침낭: 전체/동계/삼계절/여름·간절기)
const CAT_SEG = { "침낭": ['동계','삼계절','여름·간절기'] };
let gearSeason = '';
function renderGearSeg(cat){
  const seasons = CAT_SEG[cat], seg = $('#gearSeg');
  gearSeason = '';
  if(!seasons){ seg.style.display='none'; seg.innerHTML=''; return; }
  seg.style.display='';
  seg.innerHTML = `<button class="on" data-gs="">전체</button>`
    + seasons.map(s=>`<button data-gs="${s}">${s}</button>`).join('');
  $$('#gearSeg button').forEach(b=>{
    b.addEventListener('click',()=>{
      $$('#gearSeg button').forEach(x=>x.classList.remove('on'));
      b.classList.add('on');
      gearSeason = b.dataset.gs;
      gearLimit=PAGE; renderGear(curCat);
    });
  });
}
function renderGearChips(cat){
  const defs = CAT_CHIPS[cat], row = $('#gearChips');
  gearKws.clear();
  if(!defs){ row.style.display='none'; row.innerHTML=''; return; }
  row.style.display='';
  row.innerHTML = defs.map(([k,label])=>`<div class="kw" data-gk="${k}">${label}</div>`).join('');
  $$('#gearChips .kw').forEach(ch=>{
    ch.addEventListener('click',()=>{
      const k=ch.dataset.gk;
      if(gearKws.has(k)){ gearKws.delete(k); ch.classList.remove('on'); }
      else{ gearKws.add(k); ch.classList.add('on'); }
      gearLimit=PAGE; renderGear(curCat);
    });
  });
}
const _SEASON_ORDER = { '동계':0, '삼계절':1, '여름·간절기':2 };
function renderGear(cat){
  const q = gearQuery.trim().toLowerCase();
  const defs = CAT_CHIPS[cat] || [];
  const seasonal = !!CAT_SEG[cat];
  let items = gearItemsFor(cat).filter(g=>{
    if(seasonal && gearSeason && bagSeason(g)!==gearSeason) return false;
    for(const k of gearKws){ const d=defs.find(x=>x[0]===k); if(d && !d[2](g)) return false; }
    if(!q) return true;
    const kr = (typeof BRAND_KR!=='undefined' && BRAND_KR[g.brand]) || '';
    return (g.brand+' '+g.name+' '+kr+' '+(g.fill||'')+' '+(g.type||'')+' '+g.tags.join(' ')).toLowerCase().includes(q);
  });
  // 계절 카테고리는 동계→삼계절→여름 순 정렬 (같은 계절 안에선 추운 순)
  if(seasonal) items = items.slice().sort((a,b)=>
    (_SEASON_ORDER[bagSeason(a)]-_SEASON_ORDER[bagSeason(b)]) || (a.temp-b.temp));
  const shown = items.slice(0, gearLimit);
  let html='';
  if(seasonal && !gearSeason){   // 전체 보기: 계절 그룹 헤더 삽입
    const totals={}; items.forEach(g=>{ const s=bagSeason(g); totals[s]=(totals[s]||0)+1; });
    let prev=null;
    shown.forEach(g=>{
      const s=bagSeason(g);
      if(s!==prev){ html+=`<div class="ghead"><span class="season ${_BAG_SEASON_CLS[s]}">${s}</span> ${totals[s]}종</div>`; prev=s; }
      html+=gearCardHTML(g);
    });
  } else {
    html = shown.map(gearCardHTML).join('');
  }
  $('#tentList').innerHTML = html || `<div class="empty">검색 결과가 없어요.</div>`;
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
  else { gearQuery=''; $('#gearSearch').value=''; gearLimit=PAGE; renderGearSeg(cat); renderGearChips(cat); renderGear(cat); }
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
  // 도메인 토글 (백패킹 / 오토캠핑)
  $$('#domainSeg button').forEach(b=> b.addEventListener('click', ()=>selectDomain(b.dataset.dm)) );
  // 카테고리 탭 (도메인별 동적 생성 + 클릭 연결)
  renderCatTabs();
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
const EVT_PAGE = 8;
let evtFilter = 'all', evtLimit = EVT_PAGE;
function eventCardHTML(ev){
  const tr = ev.type==='트레일러닝';
  const href = ev.url || naverURL(ev.q);
  return `<a class="evt" href="${href}" target="_blank" rel="noopener">
    <div class="eh"><span class="enm">${esc(ev.name)}</span>
      <span class="etype ${tr?'tr':'bp'}">${esc(ev.type)}</span>
      <span class="evshare" role="button" onclick="shareEvent(event,'${encodeURIComponent(ev.name)}')">공유</span></div>
    <div class="emeta">${esc(ev.when)} · ${esc(ev.region)}</div>
    <div class="edesc">${esc(ev.desc)}</div>
  </a>`;
}
function renderEvents(){
  const items = EVENTS.filter(ev=> evtFilter==='all' || ev.type===evtFilter);
  const shown = items.slice(0, evtLimit);
  $('#eventList').innerHTML = shown.length ? shown.map(eventCardHTML).join('') : `<div class="empty">해당 행사가 없어요.</div>`;
  const more=$('#eventMore'), coll=$('#eventCollapse');
  if(items.length>evtLimit){ more.style.display=''; more.textContent=`더 보기 (남은 ${items.length-evtLimit}개)`; } else more.style.display='none';
  coll.style.display = evtLimit>EVT_PAGE ? '' : 'none';
}
function moreEvents(){ evtLimit+=EVT_PAGE; renderEvents(); }
function collapseEvents(){ evtLimit=EVT_PAGE; renderEvents(); scrollTo2('events'); }
function setupEvents(){
  $$('#evtFilter .fchip').forEach(f=>{
    f.addEventListener('click',()=>{
      $$('#evtFilter .fchip').forEach(x=>x.classList.remove('on'));
      f.classList.add('on');
      evtFilter=f.dataset.e; evtLimit=EVT_PAGE; renderEvents();
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
// 도메인별 데이터: 백패킹=박지(SPOTS), 오토캠핑=오토캠핑장(CAMPGROUNDS)
const activeSpotData = () => (domain==='camp' && typeof CAMPGROUNDS!=='undefined') ? CAMPGROUNDS : SPOTS;
function filteredSpots(){
  const q = spotQuery.trim().toLowerCase();
  const camp = domain==='camp';
  return activeSpotData().filter(sp=>{
    if(camp){
      if(spotFilter==='pet'){ if(!sp.pet) return false; }
      else if(spotFilter!=='all'){ if(sp.type!==spotFilter) return false; }
    } else {
      if(spotFilter==='nocar'){ if(sp.car) return false; }
      else if(spotFilter!=='all'){ if(sp.type!==spotFilter) return false; }
      if(spotDiff && sp.difficulty!==spotDiff) return false;
    }
    if(spotRegion && regionGroup(sp.region)!==spotRegion) return false;
    if(q){
      const hay = camp
        ? (sp.name+' '+sp.region+' '+sp.type+' '+sp.season+' '+(sp.keyword||[]).join(' ')+' '+sp.desc).toLowerCase()
        : (sp.name+' '+sp.region+' '+sp.season+' '+sp.keyword.join(' ')+' '+sp.vibe.join(' ')).toLowerCase();
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
// 박지 인스타 링크: 게시물 URL 있으면 그 게시물, 없으면 아온다 프로필로
function spotInsta(sp){ return sp.insta || (typeof CONTACT!=='undefined' && CONTACT.instagram) || '#'; }
function spotCardHTML(sp){
  const th = spotTheme(sp);
  const ig = spotInsta(sp);
  const igLabel = sp.insta ? '이 박지 인스타' : '아온다 인스타';
  return `<div class="spot card-static">
    <a class="sthumb theme-${th}" href="${ig}" target="_blank" rel="noopener" style="background-image:url('assets/spots/${th}.jpg')">
      <span class="stype">${esc(sp.type)}</span>
      <span class="sig">인스타에서 보기 ↗</span>
    </a>
    <div class="sbody">
      <div class="sh"><span class="snm">${esc(sp.name)}</span> <span class="sregion">${esc(sp.region)}</span></div>
      <div class="sdesc">${esc(sp.desc)}</div>
      <div class="sinfo">
        <span class="pill diff d${DIFF_LV[sp.difficulty]||2}">난이도 ${esc(sp.difficulty)}</span>
        <span class="pill">${esc(sp.season)}</span>
        <span class="pill ${sp.car?'car':''}">${sp.car?'자차권장':'자차없이 OK'}</span>
      </div>
      <div class="sacts">
        <a class="sact ig" href="${ig}" target="_blank" rel="noopener">${igLabel}</a>
        <a class="sact wx" href="${spotWeather(sp)}" target="_blank" rel="noopener">날씨</a>
      </div>
    </div>
  </div>`;
}
// ── 오토캠핑장 카드 (오토캠핑 도메인) ──
function campTheme(cg){
  if(/제주/.test(cg.region)) return 'island';
  if(cg.type==='노지') return 'meadow';
  if(cg.type==='휴양림') return 'ridge';
  return 'deck';   // 오토·글램핑
}
function campInfo(cg){ return naverURL(spotCleanName(cg) + ' 캠핑장'); }
function campgroundCardHTML(cg){
  const th = campTheme(cg);
  const am = [];
  if(cg.elec) am.push('전기');
  if(cg.hot) am.push('온수');
  if(cg.pet) am.push('반려동물 OK');
  return `<div class="spot card-static">
    <a class="sthumb theme-${th}" href="${campInfo(cg)}" target="_blank" rel="noopener" style="background-image:url('assets/spots/${th}.jpg')">
      <span class="stype">${esc(cg.type)}</span>
      <span class="sig cg">사진·예약 검색 ↗</span>
    </a>
    <div class="sbody">
      <div class="sh"><span class="snm">${esc(cg.name)}</span> <span class="sregion">${esc(cg.region)}</span></div>
      <div class="sdesc">${esc(cg.desc)}</div>
      <div class="sinfo">
        <span class="pill">${esc(cg.season||'사계절')}</span>
        ${cg.price?`<span class="pill price">${esc(cg.price)}</span>`:''}
        ${am.map(a=>`<span class="pill amen">${esc(a)}</span>`).join('')}
      </div>
      <div class="sacts">
        <a class="sact ig" href="${campInfo(cg)}" target="_blank" rel="noopener">정보·예약</a>
        <a class="sact wx" href="${naverURL(spotCleanName(cg)+' 날씨')}" target="_blank" rel="noopener">날씨</a>
      </div>
    </div>
  </div>`;
}
function renderSpots(){
  const camp = domain==='camp';
  const items = filteredSpots();
  const shown = items.slice(0, spotLimit);
  const card = camp ? campgroundCardHTML : spotCardHTML;
  $('#spotList').innerHTML = shown.length
    ? shown.map(card).join('')
    : `<div class="empty">조건에 맞는 ${camp?'오토캠핑장':'박지'}이 없어요. 검색어나 필터를 바꿔보세요 🙂</div>`;
  $('#spotCount').textContent = items.length;
  const more = $('#spotMore'), coll = $('#spotCollapse');
  if(items.length > spotLimit){ more.style.display=''; more.textContent = `더 보기 ▾ (남은 ${items.length - spotLimit}곳)`; }
  else more.style.display='none';
  coll.style.display = spotLimit>SPOT_PAGE ? '' : 'none';
  if(spotViewMode==='map' && spotMap) refreshSpotMarkers();
}

/* ── 박지·캠핑장 지도 뷰 ── */
let spotViewMode = 'list', spotMap = null, spotLayer = null;
function setSpotView(v){
  spotViewMode = v;
  $$('#spotSeg button').forEach(b=>b.classList.toggle('on', b.dataset.sv===v));
  const map = v==='map';
  $('#spotMap').style.display = map?'':'none';
  $('#spotMapNote').style.display = map?'':'none';
  $('#spotList').style.display = map?'none':'';
  $('#spotMore').closest('.more-row').style.display = map?'none':'';
  if(map){ loadLeaflet(buildSpotMap); }
}
function spotMapPopup(sp){
  const camp = domain==='camp';
  const nmap = 'https://map.naver.com/p/search/' + encodeURIComponent(spotCleanName(sp));
  const info = camp ? campInfo(sp) : spotInsta(sp);
  const infoLabel = camp ? '정보·예약' : (sp.insta ? '이 박지 인스타' : '아온다 인스타');
  return `<div class="tpop">
    <div class="tpn">${esc(sp.name)}</div>
    <div class="tpm">${esc(sp.region)}${sp.type?' · '+esc(sp.type):''}</div>
    <a class="tpa" href="${nmap}" target="_blank" rel="noopener">지도에서 위치 보기 ↗</a>
    <a class="tpa" href="${info}" target="_blank" rel="noopener">${infoLabel} ↗</a>
  </div>`;
}
function refreshSpotMarkers(){
  if(!spotMap || typeof L==='undefined') return;
  if(spotLayer) spotLayer.remove();
  spotLayer = L.layerGroup().addTo(spotMap);
  const camp = domain==='camp';
  const color = camp ? '#b48a12' : '#2b3624';
  const items = filteredSpots(), pts = [];
  items.forEach(sp=>{
    const g = geoForSpot(sp); pts.push(g);
    L.circleMarker(g, {radius:7, color:'#fff', weight:2, fillColor:color, fillOpacity:.95})
      .addTo(spotLayer).bindPopup(spotMapPopup(sp));
  });
  if(pts.length) spotMap.fitBounds(pts, {padding:[30,30], maxZoom:10});
}
function buildSpotMap(){
  if(!spotMap){
    spotMap = L.map('spotMap', {scrollWheelZoom:false});
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution:'&copy; OpenStreetMap', maxZoom:18}).addTo(spotMap);
  }
  refreshSpotMarkers();
  setTimeout(()=>spotMap.invalidateSize(), 80);
}
function moreSpots(){ spotLimit += SPOT_PAGE; renderSpots(); }
function collapseSpots(){ spotLimit = SPOT_PAGE; renderSpots(); scrollTo2('spots'); }
// 도메인별 필터 칩 정의
const SPOT_CHIPS = {
  bp:   [['all','전체'],['섬','섬'],['오지','오지'],['캠핑장','캠핑장'],['nocar','자차없이']],
  camp: [['all','전체'],['오토','오토'],['휴양림','휴양림'],['노지','노지'],['글램핑','글램핑'],['pet','반려동물']],
};
function buildRegionOptions(){
  const gc = {};
  activeSpotData().forEach(sp=>{ const g=regionGroup(sp.region); gc[g]=(gc[g]||0)+1; });
  const regs = REGION_ORDER.filter(g=>gc[g]);
  if(gc['기타']) regs.push('기타');
  $('#fRegion').innerHTML = `<option value="">전국(전체)</option>`
    + regs.map(g=>`<option value="${g}">${g} (${gc[g]})</option>`).join('');
}
function bindSpotChips(){
  $$('#spotFilter .fchip').forEach(f=>{
    f.addEventListener('click',()=>{
      $$('#spotFilter .fchip').forEach(x=>x.classList.remove('on'));
      f.classList.add('on');
      spotFilter=f.dataset.f; spotLimit=SPOT_PAGE; renderSpots();
    });
  });
}
function renderSpotChips(){
  $('#spotFilter').innerHTML = SPOT_CHIPS[domain].map(([f,l],i)=>
    `<div class="fchip${i===0?' on':''}" data-f="${f}">${l}</div>`).join('');
  bindSpotChips();
}
// 도메인 전환 시 박지↔캠핑장 UI 스위칭
function applyDomainToSpots(){
  const camp = domain==='camp';
  const eb=$('#spotEyebrow'), hl=$('#spotHeadLabel'), sub=$('#spotSub');
  if(eb) eb.textContent = camp?'Car Camping Sites':'Backpacking Spots';
  if(hl) hl.textContent = camp?'오토캠핑장':'박지 가이드';
  if(sub) sub.textContent = camp
    ? '오토·글램핑·자연휴양림 캠핑장. 시설·요금은 참고용이며 예약·정확한 정보는 카드 링크에서 확인하세요.'
    : '국내 백패킹 성지·명소. 검색·필터로 찾아보세요. (입산·야영 통제는 방문 전 꼭 확인!)';
  $('#spotTotal').textContent = activeSpotData().length;
  $('#fDiff').style.display = camp?'none':'';   // 오토캠핑장은 난이도 필터 없음
  const tab = document.querySelector('[data-tab="spots"]'); if(tab) tab.textContent = camp?'오토캠핑장':'박지';
  // 필터 초기화 후 재구성
  spotFilter='all'; spotRegion=''; spotDiff=''; spotQuery=''; spotLimit=SPOT_PAGE;
  const ss=$('#spotSearch'); if(ss) ss.value='';
  const fd=$('#fDiff'); if(fd) fd.value='';
  buildRegionOptions();
  renderSpotChips();
  renderSpots();
}
function setupSpots(){
  buildRegionOptions();
  $('#fRegion').addEventListener('change', e=>{ spotRegion=e.target.value; spotLimit=SPOT_PAGE; renderSpots(); });
  $('#fDiff').addEventListener('change',  e=>{ spotDiff=e.target.value;  spotLimit=SPOT_PAGE; renderSpots(); });
  let deb;
  $('#spotSearch').addEventListener('input', e=>{
    clearTimeout(deb);
    deb = setTimeout(()=>{ spotQuery=e.target.value; spotLimit=SPOT_PAGE; renderSpots(); }, 160);
  });
  applyDomainToSpots();   // 초기(백패킹) 헤더·칩·목록 구성
}

/* ---------- 장비 인사이트·랭킹 ---------- */
// 카테고리별 아이템을 통일 형태로: {brand,name,weightG,priceMan,temp,rval,lumen,vol,value}
function insightItems(cat){
  if(cat==='텐트') return TENTS.map(t=>({brand:t.brand,name:t.name,weightG:Math.round(t.weight*1000),priceMan:Math.round(t.price/10000),value:t.value}));
  return (GEAR_ITEMS[cat]||[]).map(g=>({brand:g.brand,name:g.name,weightG:g.weight||0,priceMan:g.price||0,temp:g.temp,rval:g.rval,lumen:g.lumen,vol:g.vol,value:g.value}));
}
// 카테고리별 사용 가능한 기준 [key, label, 정렬fn(오름=상위), 표시fn]
const INSIGHT_METRICS = {
  light:  ['light','가벼운 순', a=>a.weightG||9e9, x=>x.weightG?fmtKg(x.weightG):'—'],
  cheap:  ['cheap','저렴한 순', a=>a.priceMan||9e9, x=>x.priceMan?`~${x.priceMan}만`:'—'],
  value:  ['value','가성비 픽', a=>(a.value?0:1)*1e6 + (a.priceMan||9e9), x=>`~${x.priceMan}만${x.value?' · 가성비':''}`],
  warm:   ['warm','따뜻한 순', a=>a.temp!==undefined?a.temp:9e9, x=>x.temp!==undefined?`${x.temp>0?'+':''}${x.temp}℃`:'—'],
  rval:   ['rval','보온(R값) 순', a=>a.rval!==undefined?-a.rval:9e9, x=>x.rval!==undefined?`R${x.rval}`:'—'],
  bright: ['bright','밝은 순', a=>a.lumen?-a.lumen:9e9, x=>x.lumen?`${x.lumen}lm`:'—'],
  big:    ['big','대용량 순', a=>a.vol?-a.vol:9e9, x=>x.vol?`${x.vol}L`:'—'],
};
const INSIGHT_CATS = [
  ['텐트', ['light','cheap','value']],
  ['침낭', ['light','cheap','warm']],
  ['매트', ['light','cheap','rval']],
  ['배낭', ['light','cheap','big']],
  ['스토브', ['light','cheap']],
  ['랜턴', ['bright','light','cheap']],
];
let insCat = '텐트', insMetric = 'light';
function renderInsCat(){
  $('#insCat').innerHTML = INSIGHT_CATS.map(([c])=>`<div class="fchip${c===insCat?' on':''}" data-ic="${c}">${c}</div>`).join('');
  $$('#insCat .fchip').forEach(f=>f.addEventListener('click',()=>{
    insCat=f.dataset.ic;
    const metrics=(INSIGHT_CATS.find(x=>x[0]===insCat)||[])[1]||['light'];
    if(!metrics.includes(insMetric)) insMetric=metrics[0];
    renderInsCat(); renderInsMetric(); renderInsList();
  }));
}
function renderInsMetric(){
  const metrics=(INSIGHT_CATS.find(x=>x[0]===insCat)||[])[1]||['light'];
  $('#insMetric').innerHTML = metrics.map(m=>`<div class="fchip sub${m===insMetric?' on':''}" data-im="${m}">${INSIGHT_METRICS[m][1]}</div>`).join('');
  $$('#insMetric .fchip').forEach(f=>f.addEventListener('click',()=>{ insMetric=f.dataset.im; renderInsMetric(); renderInsList(); }));
}
function renderInsList(){
  const [,,sortFn,fmt] = INSIGHT_METRICS[insMetric];
  const top = insightItems(insCat).slice().sort((a,b)=>sortFn(a)-sortFn(b)).slice(0,5);
  $('#insList').innerHTML = top.map((x,i)=>`
    <a class="ins-row" href="${naverURL(gearQ(x.brand,x.name,insCat))}" target="_blank" rel="noopener">
      <span class="ins-rank r${i+1}">${i+1}</span>
      <span class="ins-nm">${esc(x.name)}<small>${esc(x.brand)}</small></span>
      <span class="ins-stat">${fmt(x)}</span>
    </a>`).join('') || `<div class="empty">데이터가 없어요.</div>`;
}
function renderInsight(){ renderInsCat(); renderInsMetric(); renderInsList(); }

/* ---------- 5. 체크리스트 (상황별 프리셋 + 체크상태 저장) ---------- */
let checkPreset = "백패킹 기본";
const _ckKey = () => 'aonda_check_' + checkPreset;
function renderCheckTabs(){
  const tabs = $('#checkTabs'); if(!tabs) return;
  tabs.innerHTML = Object.keys(CHECKLISTS).map(k=>
    `<div class="fchip${k===checkPreset?' on':''}" data-ck="${k}">${k}</div>`).join('');
  $$('#checkTabs .fchip').forEach(f=>f.addEventListener('click',()=>{
    checkPreset = f.dataset.ck; renderCheckTabs(); renderCheck();
  }));
}
function renderCheck(){
  const items = CHECKLISTS[checkPreset] || [];
  let done = new Set();
  try{ done = new Set(JSON.parse(localStorage.getItem(_ckKey())||'[]')); }catch(e){}
  $('#checkList').innerHTML = items.map((c,i)=>`
    <div class="ci${done.has(i)?' done':''}" data-i="${i}"><span class="box"></span><span class="lbl">${c}</span></div>`).join('');
  $$('#checkList .ci').forEach(ci=>ci.addEventListener('click',()=>{
    ci.classList.toggle('done');
    const d=[...$$('#checkList .ci')].filter(x=>x.classList.contains('done')).map(x=>+x.dataset.i);
    localStorage.setItem(_ckKey(), JSON.stringify(d));
  }));
}

/* ---------- 홈 바로가기 카드 ---------- */
function renderMenu(){
  const items = [
    { v:'gear',    t:'장비 카탈로그', d:`텐트 ${TENTS.length}종 + 침낭·매트·배낭·스토브·랜턴` },
    { v:'spots',   t:'박지 가이드',   d:`전국 백패킹 성지 ${SPOTS.length}곳 · 사진·날씨` },
    { v:'events',  t:'행사',          d:`백패킹·트레일러닝 ${EVENTS.length}개 · 미리 접수` },
    { v:'deals',   t:'할인·블프',     d:`장비 세일·블랙프라이데이 캘린더` },
    { v:'reviews', t:'후기 · 갤러리',  d:`크루 후기·사진 모아보기 + 오픈채팅 참여` },
  ];
  $('#menuGrid').innerHTML = items.map(m=>`
    <button class="mcard" onclick="showView('${m.v}')">
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
  const tags = ((r.tags && r.tags.length) ? r.tags : (r.tag ? [r.tag] : [])).filter(t=>!String(t).startsWith('__'));
  const meta = [
    r.gear ? `<span class="p gear">${esc(r.gear)}</span>` : '',
    ...tags.map(t=>`<span class="p">#${esc(t)}</span>`)
  ].filter(Boolean).join('');
  // 다녀온 박지를 헤더에 눈에 띄게 노출 (#4)
  const sub = r.spot ? `${esc(r.spot)}${r.when?` · ${esc(r.when)}`:''}`
            : (r.when ? `${esc(r.when)}` : (tags.slice(0,2).map(esc).join(' · ') || '팀아온다'));
  return `<div class="review${mine?' mine':''}">
    <div class="rh">
      <div class="av">${esc(r.name.slice(0,1))}</div>
      <div><div class="rn">${esc(r.name)}${mine?' <span style="font-size:10px;color:var(--sage)">· 내 후기</span>':''}</div>
        <div class="rt${r.spot?' rt-spot':''}">${sub}</div></div>
      <div class="stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
    </div>
    <div class="rtext">"${esc(r.text)}"</div>
    ${validPhoto(r.photo) ? `<img class="rphoto" src="${r.photo}" loading="lazy" alt="후기 사진">` : ''}
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
  renderReviews(); renderGallery();
}
const REV_PAGE = 5;
let revLimit = REV_PAGE;
// 후기 도메인 마커 (태그 기반 — 새 컬럼 없이 백패킹/오토캠핑 분리)
const DOMAIN_TAG = { bp:'__bp', camp:'__camp' };
const reviewDomain = r => (r.tags && r.tags.includes('__camp')) ? 'camp' : 'bp';   // 마커 없으면 백패킹(기본)
// 유효 사진 판별: data:image URL이면서 실제 이미지로 볼 만한 길이 (깨진/더미 photo 방어)
const validPhoto = p => typeof p==='string' && /^data:image\//.test(p) && p.length > 200;
// 백엔드 점검용 더미 후기 숨김
const isJunkReview = r => ['컬럼테스트'].includes(String(r.name||'').trim());
function renderReviews(){
  const raw = supaOn()
    ? (remoteReviews||[]).map(r=>({r,mine:false})).concat(REVIEWS.map(r=>({r,mine:false})))
    : loadMine().map(r=>({r,mine:true})).concat(REVIEWS.map(r=>({r,mine:false})));
  const all = raw.filter(o=> !isJunkReview(o.r) && !isRsvpRow(o.r) && reviewDomain(o.r)===domain);   // 참석투표 행 제외
  const shown = all.slice(0, revLimit);
  $('#reviewList').innerHTML = shown.map(o=>reviewCard(o.r, o.mine)).join('')
    || `<div class="empty">아직 ${domain==='camp'?'오토캠핑':'백패킹'} 후기가 없어요. 첫 후기를 남겨보세요!</div>`;
  const more=$('#reviewMore'), coll=$('#reviewCollapse');
  if(more){ if(all.length>revLimit){ more.style.display=''; more.textContent=`후기 더 보기 (남은 ${all.length-revLimit}개)`; } else more.style.display='none'; }
  if(coll) coll.style.display = revLimit>REV_PAGE ? '' : 'none';
}
function moreReviews(){ revLimit+=REV_PAGE; renderReviews(); }
function collapseReviews(){ revLimit=REV_PAGE; renderReviews(); }
function deleteReview(id){
  if(!confirm('이 후기를 삭제할까요?')) return;
  saveMine(loadMine().filter(r=>r.id!==id));
  renderReviews(); renderGallery();
  toast('후기를 삭제했어요');
}

/* ---------- 갤러리 (후기 사진 모아보기 + 라이트박스) ---------- */
let galPhotos = [];
function renderGallery(){
  const src = supaOn() ? (remoteReviews||[]).concat(REVIEWS) : loadMine().concat(REVIEWS);
  galPhotos = src.filter(r=> validPhoto(r.photo) && !isJunkReview(r) && !isRsvpRow(r) && reviewDomain(r)===domain);
  const grid = $('#galGrid'); if(!grid) return;
  if(!galPhotos.length){
    grid.innerHTML = `<div class="gal-empty">아직 갤러리가 비어 있어요.<br>후기 작성 시 <b>사진을 첨부</b>하면 여기에 모여요.<br>
      <button class="btn btn-ghost" style="margin-top:14px;color:var(--forest);border-color:var(--sage)" onclick="showView('reviews')">후기 남기러 가기</button></div>`;
    return;
  }
  grid.innerHTML = galPhotos.map((r,i)=>`
    <button class="gal-item" onclick="openLightbox(${i})">
      <img src="${r.photo}" loading="lazy" alt="">
      <span class="gal-cap">${esc(r.name||'')}${r.spot?' · '+esc(r.spot):''}</span>
    </button>`).join('');
}
function openLightbox(i){
  const r = galPhotos[i]; if(!r) return;
  $('#lb-img').src = r.photo;
  const spot = r.spot ? ` · ${esc(r.spot)}` : '';
  const when = (r.when||r.visited) ? ` · ${esc(r.when||r.visited)}` : '';
  $('#lb-cap').innerHTML = `<b>${esc(r.name||'')}</b>${spot}${when}${r.text?`<br>"${esc(r.text)}"`:''}`;
  $('#lightbox').style.display = 'flex';
  try{ history.pushState({view:currentView, lb:1}, '', location.hash); }catch(e){}
}
function closeLightbox(){ $('#lightbox').style.display='none'; $('#lb-img').src=''; }

/* ---------- 다음 모임 + 참석투표 (Supabase rsvp 테이블, 없으면 안내 폴백) ---------- */
let rsvpOK = null;   // null=미확인, true/false=테이블 존재 여부
const activeMeetups = () => (typeof MEETUPS!=='undefined' ? MEETUPS.filter(m=>m.status!=='마감') : []);
function ddayLabel(iso){
  if(!iso) return '';
  const d = Math.round((new Date(iso+'T00:00:00+09:00') - new Date(new Date().toDateString()))/86400000);
  return d===0 ? 'D-DAY' : (d>0 ? 'D-'+d : '지남');
}
// 참석투표는 별도 테이블 없이 reviews 테이블에 __rsvp 마커로 저장 (gear=모임id, text=상태)
const isRsvpRow = r => r.tags && r.tags.includes('__rsvp');
async function fetchRsvp(mid){
  const res = await fetch(`${SUPABASE.url}/rest/v1/reviews?tags=cs.%7B__rsvp%7D&select=name,text,gear,created_at&order=created_at.desc`, {headers:supaHeaders()});
  if(!res.ok) throw new Error('HTTP '+res.status);
  const rows = (await res.json()).filter(r=> r.gear===mid && !String(r.name||'').startsWith('_'));   // '_' 시작=점검용 제외
  const seen = new Set(), latest = [];
  rows.forEach(r=>{ const k=(r.name||'').trim(); if(!seen.has(k)){ seen.add(k); latest.push({name:r.name, status:r.text, created_at:r.created_at}); } });  // 이름당 최신만
  return latest;
}
function meetupCardHTML(m, votes){
  const dd = ddayLabel(m.dateISO);
  const yes = votes ? votes.filter(v=>v.status==='참석') : [];
  const no  = votes ? votes.filter(v=>v.status==='불참') : [];
  const nick = localStorage.getItem('aonda_nick') || '';
  return `<div class="mt-card" data-mid="${esc(m.id)}">
    <div class="mt-top">
      ${dd?`<span class="mt-dday${dd==='D-DAY'?' today':''}">${dd}</span>`:''}
      <span class="mt-title">${esc(m.title)}</span>
      <span class="mt-state">${esc(m.status||'모집중')}</span>
    </div>
    <div class="mt-meta">${esc(m.date||'')}${m.where?' · '+esc(m.where):''}</div>
    ${m.note?`<div class="mt-note">${esc(m.note)}</div>`:''}
    ${votes ? `
      <div class="mt-counts"><span>참석 ${yes.length}</span><span class="no">불참 ${no.length}</span></div>
      ${yes.length?`<div class="mt-names">${yes.map(v=>esc(v.name)).join(' · ')}</div>`:''}
      <div class="mt-vote">
        <input class="mt-nick" placeholder="닉네임" value="${esc(nick)}" maxlength="12">
        <button class="yes" onclick="rsvpVote(this,'참석')">참석</button>
        <button class="no" onclick="rsvpVote(this,'불참')">불참</button>
      </div>
      <div class="mt-hint">다시 누르면 최신 선택으로 바뀌어요.</div>`
    : `<div class="mt-hint" style="margin-top:12px">참석 여부는 <a href="${CONTACT.kakao}" target="_blank" rel="noopener" style="font-weight:800;color:var(--brand-d)">오픈채팅</a>으로 알려주세요!</div>`}
    <button class="mt-share" onclick="shareMeetup(this.closest('.mt-card').dataset.mid)">일정 공유하기 (카톡·문자)</button>
  </div>`;
}
async function renderMeetups(){
  const sec = $('#meetup'), list = $('#meetupList');
  if(!sec || !list) return;
  const ms = activeMeetups();
  if(!ms.length){ sec.style.display='none'; return; }
  sec.style.display='';
  if(rsvpOK===null){ rsvpOK = supaOn(); }   // reviews 테이블은 항상 존재 → 투표 UI 활성
  const cards = await Promise.all(ms.map(async m=>{
    let votes = null;
    if(rsvpOK){ try{ votes = await fetchRsvp(m.id); }catch(e){ votes = null; } }
    return meetupCardHTML(m, votes);
  }));
  list.innerHTML = cards.join('');
}
/* ── 일정 공유 (모바일 공유 시트 → 카톡 선택, 미지원 시 클립보드 복사) ── */
const SITE_URL = 'https://skdyddns-max.github.io/team-aonda/';
async function shareText(text){
  if(navigator.share){
    try{ await navigator.share({ text }); return; }catch(e){ if(e.name==='AbortError') return; }
  }
  try{ await navigator.clipboard.writeText(text); toast('일정이 복사됐어요 — 카톡에 붙여넣기!'); }
  catch(e){ prompt('아래 내용을 복사해서 공유하세요', text); }
}
function shareMeetup(mid){
  const m = (typeof MEETUPS!=='undefined' ? MEETUPS : []).find(x=>x.id===mid); if(!m) return;
  const dd = ddayLabel(m.dateISO);
  shareText([
    `[팀아온다] 다음 모임${dd?` (${dd})`:''}`,
    `· ${m.title}`,
    `· ${m.date}${m.where?` · ${m.where}`:''}`,
    m.note?`· ${m.note}`:'',
    `참석 투표 → ${SITE_URL}#home`,
  ].filter(Boolean).join('\n'));
}
function shareEvent(e, name){
  e.preventDefault(); e.stopPropagation();
  const ev = EVENTS.find(x=>x.name===decodeURIComponent(name)); if(!ev) return;
  shareText([
    `[팀아온다] 행사 공유`,
    `· ${ev.name} (${ev.type})`,
    `· ${ev.when} · ${ev.region}`,
    ev.desc?`· ${ev.desc}`:'',
    `자세히 → ${ev.url || naverURL(ev.q)}`,
  ].filter(Boolean).join('\n'));
}
async function rsvpVote(btn, status){
  const card = btn.closest('.mt-card');
  const name = card.querySelector('.mt-nick').value.trim();
  if(!name){ alert('닉네임을 먼저 적어주세요 🙂'); return; }
  localStorage.setItem('aonda_nick', name);
  btn.disabled = true;
  try{
    const res = await fetch(`${SUPABASE.url}/rest/v1/reviews`, {
      method:'POST',
      headers:{...supaHeaders(), Prefer:'return=minimal'},
      // reviews 테이블 재사용: gear=모임id, text=상태, stars=1(제약 통과), __rsvp 마커
      body: JSON.stringify({ name, text:status, gear:card.dataset.mid, stars:1, tags:['__rsvp'] }),
    });
    if(!res.ok) throw new Error('HTTP '+res.status);
    toast(`${name}님 ${status} 완료!`);
    renderMeetups();
  }catch(e){ alert('전송에 실패했어요. 잠시 후 다시 시도해 주세요.'); btn.disabled=false; }
}

/* ---------- 아온다 발자국 (크루 방문 기록 지도) ---------- */
let tripMap = null;
function tripPeople(tr){
  return Array.isArray(tr.people) ? tr.people.join(' · ') : (tr.people ? tr.people+'명' : '');
}
function tripPopupHTML(tr){
  return `<div class="tpop">
    <div class="tpn">${esc(tr.name)}</div>
    <div class="tpm">${esc(tr.date||'')}${tripPeople(tr)?' · '+esc(tripPeople(tr)):''}</div>
    ${tr.note?`<div class="tpd">${esc(tr.note)}</div>`:''}
    ${tr.photo?`<img class="tpi" src="${tr.photo}" alt="">`:''}
    ${tr.insta?`<a class="tpa" href="${tr.insta}" target="_blank" rel="noopener">인스타 게시물 보기 ↗</a>`:''}
  </div>`;
}
// Leaflet은 후기 탭 첫 진입 때만 동적 로드 (초기 로딩 최적화, 실패 시 목록 폴백)
let leafletLoading = false;
function tripFallbackList(){
  const el = $('#tripMap'); if(!el || el.classList.contains('trip-fallback')) return;
  el.classList.add('trip-fallback');
  el.innerHTML = TRIPS.map(tr=>`<div class="trow"><b>${esc(tr.name)}</b>
    <span>${esc(tr.date||'')}${tripPeople(tr)?' · '+esc(tripPeople(tr)):''}</span>
    ${tr.note?`<small>${esc(tr.note)}</small>`:''}</div>`).join('');
}
function loadLeaflet(cb){
  if(typeof L!=='undefined') return cb();
  if(leafletLoading) return;
  leafletLoading = true;
  const css = document.createElement('link');
  css.rel='stylesheet'; css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(css);
  const js = document.createElement('script');
  js.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  js.onload = cb;
  js.onerror = ()=>{ leafletLoading=false; tripFallbackList(); };
  document.head.appendChild(js);
}
function buildTripMap(){
  if(tripMap) return;
  tripMap = L.map('tripMap', {scrollWheelZoom:false});
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {attribution:'&copy; OpenStreetMap', maxZoom:18}).addTo(tripMap);
  const pts = [];
  TRIPS.forEach(tr=>{
    if(typeof tr.lat!=='number' || typeof tr.lng!=='number') return;
    pts.push([tr.lat, tr.lng]);
    L.marker([tr.lat, tr.lng]).addTo(tripMap).bindPopup(tripPopupHTML(tr));
  });
  if(pts.length) tripMap.fitBounds(pts, {padding:[36,36], maxZoom:9});
  else tripMap.setView([36.5,127.8], 6);   // 기록 없으면 한반도 전체
  setTimeout(()=>tripMap.invalidateSize(), 80);
}
function initTripMap(){
  if(tripMap || typeof TRIPS==='undefined') return;
  const el = $('#tripMap'); if(!el) return;
  const cnt = $('#tripCount'); if(cnt) cnt.textContent = TRIPS.length;
  loadLeaflet(buildTripMap);
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

  const tags = [...fTags, DOMAIN_TAG[domain]];   // 현재 도메인(백패킹/오토캠핑) 마커 포함

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
  renderReviews(); renderGallery(); clearForm(); showShare(r);
}

// 등록 후 카톡 공유 안내
function showShare(r){
  const spot = r.spot && r.spot!=='기타' ? r.spot : '';
  const share = `[팀아온다 후기] ${r.name} ${'★'.repeat(r.stars)}\n`
    + (spot?`${spot}${r.when?' · '+r.when:''}\n`:'')
    + (r.gear?`${r.gear}\n`:'')
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
renderReviews(); renderGallery(); renderCheckTabs(); renderCheck(); renderStars(); renderInsight();
setupReviewForm(); setupContact();
setupViews();                        // 앱형 탭 뷰 전환 (홈 뷰로 시작)
if(supaOn()) fetchRemoteReviews();   // 백엔드 설정 시 전체 후기 로드
renderPackUI();                      // 내 장비함 (localStorage 복원)
renderMeetups();                     // 다음 모임 + 참석투표 (일정 없으면 숨김)
if('serviceWorker' in navigator){ try{ navigator.serviceWorker.register('sw.js'); }catch(e){} }  // PWA 오프라인
