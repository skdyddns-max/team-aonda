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

/* ---------- 2. 텐트 리스트 + 키워드 필터 ---------- */
let activeKw = null;
function tentMatches(t,kw){
  if(!kw) return true;
  switch(kw){
    case 'value': return t.value;
    case 's3':    return t.season===3;
    case 's4':    return t.season===4;
    case 'light': return t.weight>=1 && t.weight<2;
    case 'ul':    return t.wclass==='UL';
  }
}
function renderTents(){
  const list = $('#tentList');
  const items = TENTS.filter(t=>tentMatches(t,activeKw))
                     .sort((a,b)=>a.weight-b.weight);
  if(!items.length){ list.innerHTML=`<div class="empty">해당 조건의 텐트가 없어요.</div>`; return; }
  list.innerHTML = items.map(t=>`
    <div class="tcard">
      <div class="row1">
        <div><div class="brand">${t.brand}</div><div class="tname">${t.name}</div></div>
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
        ${t.tags.map(tag=>`<span class="tag">${tag}</span>`).join('')}
      </div>
    </div>`).join('');
}
$$('#kwRow .kw').forEach(kw=>{
  kw.addEventListener('click',()=>{
    const v=kw.dataset.kw;
    if(activeKw===v){ activeKw=null; kw.classList.remove('on'); }
    else{
      activeKw=v;
      $$('#kwRow .kw').forEach(k=>k.classList.remove('on'));
      kw.classList.add('on');
    }
    renderTents();
  });
});

/* ---------- 3. 할인 정보 ---------- */
function renderDeals(){
  $('#dealList').innerHTML = DEALS.map(d=>`
    <div class="deal ${d.hot?'hot':''}">
      <div class="pd">${d.period}</div>
      <div><div class="dt">${d.title}</div><div class="dd">${d.desc}</div></div>
    </div>`).join('');
}

/* ---------- 4. 박지 + 필터 ---------- */
let spotFilter='all';
function renderSpots(){
  const items = SPOTS.filter(sp=>{
    if(spotFilter==='all') return true;
    if(spotFilter==='nocar') return !sp.car;
    return sp.type===spotFilter;
  });
  $('#spotList').innerHTML = items.length ? items.map(sp=>`
    <div class="spot">
      <div class="sh">
        <div><span class="snm">${sp.name}</span> <span class="sregion">${sp.region}</span></div>
        <span class="stype">${sp.type}</span>
      </div>
      <div class="sdesc">${sp.desc}</div>
      <div class="sinfo">
        <span class="pill">난이도 ${sp.difficulty}</span>
        <span class="pill">${sp.season}</span>
        <span class="pill ${sp.car?'car':''}">${sp.car?'🚗 자차권장':'🚌 자차없이 OK'}</span>
        ${sp.keyword.map(k=>`<span class="pill">#${k}</span>`).join('')}
      </div>
    </div>`).join('') : `<div class="empty">해당 조건의 박지가 없어요.</div>`;
}
$$('#spotFilter .fchip').forEach(f=>{
  f.addEventListener('click',()=>{
    $$('#spotFilter .fchip').forEach(x=>x.classList.remove('on'));
    f.classList.add('on');
    spotFilter=f.dataset.f;
    renderSpots();
  });
});

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

/* ---------- 7. 후기 ---------- */
function renderReviews(){
  $('#reviewList').innerHTML = REVIEWS.map(r=>`
    <div class="review">
      <div class="rh">
        <div class="av">${r.name.slice(0,1)}</div>
        <div><div class="rn">${r.name}</div><div class="rt">${r.tag}</div></div>
        <div class="stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
      </div>
      <div class="rtext">"${r.text}"</div>
    </div>`).join('');
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
renderCrew(); renderTents(); renderDeals(); renderSpots(); renderReviews(); renderCheck(); renderStars();
