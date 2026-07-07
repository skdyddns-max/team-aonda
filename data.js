/* ============================================================
   팀아온다 — 데이터 (텐트 / 박지 / 할인정보)
   가격은 2026년 기준 대략치이며 실제 가격은 판매처마다 다릅니다.
   ============================================================ */

// 텐트 데이터베이스 (해외 브랜드 포함 500종+)
// 실제 브랜드의 모델 라인 × 인원 변형(1P/2P/3P…)으로 구성.
// 형식: [브랜드, 모델명, 2인기준무게(kg), 계절(3/4), 2인가격(만원), 인원변형("123"), 가성비(1/0), ...태그]
// ⚠️ 무게·가격은 참고용 대략치입니다. 실제 스펙·가격은 판매처/연식마다 다릅니다.
const TENT_MODELS = [
  // ── Big Agnes (미국) ──
  ["Big Agnes","코퍼스퍼 HV UL",1.36,3,68,"123",0,"거주성","더블월"],
  ["Big Agnes","타이거월 UL",1.15,3,60,"123",0,"경량","반자립"],
  ["Big Agnes","플라이크릭 HV UL",0.95,3,52,"123",0,"솔캠","반자립"],
  ["Big Agnes","플라이크릭 카본",0.68,3,95,"12",0,"초경량","DCF"],
  ["Big Agnes","씨드하우스 SL",1.6,3,45,"123",0,"경량","자립"],
  ["Big Agnes","블랙테일",2.2,3,38,"23",1,"입문","자립"],
  ["Big Agnes","솔트크릭 SL",2.4,3,45,"23",0,"거주성","자립"],
  ["Big Agnes","래빗 이어스",2.4,3,34,"23",1,"입문","자립"],
  ["Big Agnes","코퍼스퍼 익스페디션",2.0,4,95,"23",0,"동계","4계절"],
  // ── MSR (미국) ──
  ["MSR","허바허바",1.54,3,62,"123",0,"밸런스","자립"],
  ["MSR","프리라이트",0.96,3,68,"123",0,"종주","경량"],
  ["MSR","카본 리플렉스",0.79,3,75,"12",0,"초경량","UL"],
  ["MSR","엘릭서",2.5,3,33,"234",1,"입문","내구성"],
  ["MSR","조익",2.3,3,30,"123",1,"가성비","입문"],
  ["MSR","레모어",2.7,3,30,"234",1,"입문","자립"],
  ["MSR","액세스",1.86,4,85,"123",0,"동계경량","4계절"],
  ["MSR","어드밴스 프로",1.2,4,90,"12",0,"알파인","싱글월"],
  ["MSR","레무어 미티어",2.6,4,110,"2",0,"동계","4계절"],
  // ── NEMO (미국) ──
  ["NEMO","호넷 오스모",0.87,3,58,"123",0,"솔캠","반자립"],
  ["NEMO","호넷 엘리트 오스모",0.73,3,72,"12",0,"초경량","UL"],
  ["NEMO","대거 오스모",1.4,3,60,"234",0,"거주성","자립"],
  ["NEMO","드래곤플라이 오스모",1.2,3,55,"123",0,"경량","자립"],
  ["NEMO","블레이즈",1.1,3,60,"12",0,"UL","경량"],
  ["NEMO","오로라",2.6,3,32,"23",1,"입문","자립"],
  ["NEMO","갤럭시",2.7,3,28,"23",1,"입문","자립"],
  ["NEMO","다크 팀버",2.8,3,30,"234",1,"입문","자립"],
  ["NEMO","쿠나이",2.4,4,80,"23",0,"동계","4계절"],
  // ── Sea to Summit (호주) ──
  ["Sea to Summit","알토 TR",1.0,3,62,"12",0,"UL","반자립"],
  ["Sea to Summit","텔로스 TR",1.5,3,66,"23",0,"거주성","자립"],
  // ── Hilleberg (스웨덴) ──
  ["Hilleberg","아크토",1.5,4,120,"1",0,"동계","솔캠"],
  ["Hilleberg","에난",1.0,3,110,"1",0,"UL","솔캠"],
  ["Hilleberg","우나",1.9,4,130,"1",0,"동계","솔캠"],
  ["Hilleberg","솔로",2.4,4,150,"1",0,"동계","자립"],
  ["Hilleberg","니악",1.7,3,115,"12",0,"경량","3계절+"],
  ["Hilleberg","안얀",1.7,3,120,"23",0,"경량","터널형"],
  ["Hilleberg","안얀 GT",2.1,3,135,"23",0,"거주성","터널형"],
  ["Hilleberg","로겐",2.2,3,140,"2",0,"자립","돔형"],
  ["Hilleberg","알락",2.7,4,165,"23",0,"동계","프리스탠딩"],
  ["Hilleberg","날로",2.4,4,175,"234",0,"동계","터널형"],
  ["Hilleberg","날로 GT",2.9,4,195,"234",0,"거주성","동계"],
  ["Hilleberg","야누",2.6,4,185,"2",0,"동계","돔형"],
  ["Hilleberg","남마츠",3.0,4,210,"234",0,"강풍","동계"],
  ["Hilleberg","카이툼",2.9,4,200,"234",0,"동계","터널형"],
  ["Hilleberg","케론",3.6,4,240,"34",0,"원정","동계"],
  ["Hilleberg","스타이카",3.8,4,230,"3",0,"자립","동계"],
  ["Hilleberg","사이타리스",4.4,4,270,"4",0,"원정","동계"],
  // ── Terra Nova (영국) ──
  ["Terra Nova","레이저 컴팩트",1.2,3,55,"12",0,"경량","자립"],
  ["Terra Nova","레이저 포톤",0.68,3,90,"12",0,"초경량","UL"],
  ["Terra Nova","솔라 포톤",0.83,3,80,"12",0,"초경량","UL"],
  ["Terra Nova","보이저",2.7,3,60,"23",0,"거주성","터널형"],
  ["Terra Nova","스타라이트",2.2,3,45,"234",0,"거주성","자립"],
  ["Terra Nova","서던 크로스",2.6,4,70,"23",0,"동계","자립"],
  ["Terra Nova","쿼사",2.9,4,85,"23",0,"강풍","동계"],
  // ── Vaude (독일) ──
  ["Vaude","파워 리자드",1.28,3,50,"12",0,"경량","반자립"],
  ["Vaude","리자드 시즌",1.8,3,45,"12",0,"경량","반자립"],
  ["Vaude","타우러스",2.9,3,28,"23",1,"입문","가성비"],
  ["Vaude","호간",2.6,3,40,"23",0,"자립","더블월"],
  ["Vaude","아르코 돔",2.6,3,38,"23",0,"자립","더블월"],
  ["Vaude","스페이스",3.0,3,45,"234",0,"거주성"],
  // ── Fjällräven (스웨덴) ──
  ["Fjallraven","아비스코 돔",2.6,3,75,"23",0,"자립","더블월"],
  ["Fjallraven","아비스코 라이트",1.9,3,68,"23",0,"경량","터널형"],
  ["Fjallraven","켑 돔",3.4,4,110,"23",0,"동계","4계절"],
  // ── The North Face (미국) ──
  ["The North Face","스톰브레이크",2.5,3,26,"123",1,"입문","가성비"],
  ["The North Face","트라이아치",1.2,3,55,"23",0,"경량","자립"],
  ["The North Face","어썰트",2.0,4,120,"2",0,"동계","알파인"],
  ["The North Face","마운틴 25",4.5,4,140,"2",0,"원정","동계"],
  // ── Marmot (미국) ──
  ["Marmot","텅스텐",2.4,3,28,"1234",1,"입문","가성비"],
  ["Marmot","텅스텐 UL",1.5,3,45,"123",0,"경량","자립"],
  ["Marmot","캐탈리스트",2.5,3,30,"23",1,"입문","자립"],
  ["Marmot","라임라이트",2.6,3,32,"23",1,"입문","자립"],
  ["Marmot","슈퍼얼로이",1.3,3,60,"23",0,"UL","자립"],
  ["Marmot","포스 UL",1.1,3,55,"123",0,"UL","경량"],
  ["Marmot","크로스오버",1.4,3,50,"12",0,"경량","자립"],
  // ── REI Co-op (미국) ──
  ["REI Co-op","쿼터돔 SL",1.4,3,42,"123",0,"경량","반자립"],
  ["REI Co-op","하프돔",2.4,3,30,"23",1,"입문","자립"],
  ["REI Co-op","플래시 에어",0.9,3,50,"12",0,"UL","반자립"],
  ["REI Co-op","트레일메이드",2.7,3,22,"23",1,"가성비","입문"],
  ["REI Co-op","아레테 ASL",2.7,4,55,"2",0,"동계","4계절"],
  // ── Tarptent (미국) ──
  ["Tarptent","더블 레인보우",1.3,3,45,"2",0,"경량","싱글월"],
  ["Tarptent","노치",0.77,3,42,"1",0,"UL","솔캠"],
  ["Tarptent","프로트레일",0.62,3,32,"1",1,"초경량","가성비"],
  ["Tarptent","스트라토스파이어",1.1,3,55,"12",0,"UL","더블월"],
  ["Tarptent","다이폴",1.0,3,60,"12",0,"UL","트레킹폴"],
  ["Tarptent","모먼트 DW",0.9,3,40,"1",0,"UL","자립"],
  ["Tarptent","에이온 Li",0.5,3,110,"1",0,"DCF","초경량"],
  ["Tarptent","레인섀도우",1.4,3,50,"3",0,"경량","싱글월"],
  // ── Zpacks (미국·큐벤) ──
  ["Zpacks","듀플렉스",0.54,3,95,"2",0,"DCF","초경량"],
  ["Zpacks","트리플렉스",0.64,3,110,"3",0,"DCF","초경량"],
  ["Zpacks","플렉사미드",0.4,3,75,"1",0,"DCF","솔캠"],
  ["Zpacks","오프셋 듀오",0.56,3,105,"2",0,"DCF","초경량"],
  ["Zpacks","프리 듀오",0.85,3,130,"2",0,"DCF","자립"],
  // ── Durston (캐나다) ──
  ["Durston","X-Mid",0.88,3,38,"12",1,"가성비","트레킹폴"],
  ["Durston","X-Mid Pro",0.52,3,90,"12",0,"DCF","초경량"],
  ["Durston","X-Dome",1.1,3,55,"12",0,"경량","자립"],
  // ── Six Moon Designs (미국) ──
  ["Six Moon Designs","루나 솔로",0.74,3,35,"1",1,"가성비","솔캠"],
  ["Six Moon Designs","루나 듀오",0.95,3,42,"2",0,"경량","트레킹폴"],
  ["Six Moon Designs","스카이스케이프",0.68,3,38,"1",1,"UL","가성비"],
  ["Six Moon Designs","헤이븐",1.1,3,48,"2",0,"경량","모듈러"],
  // ── Gossamer Gear (미국) ──
  ["Gossamer Gear","더 원",0.62,3,40,"1",0,"UL","솔캠"],
  ["Gossamer Gear","더 투",0.79,3,48,"2",0,"UL","트레킹폴"],
  // ── Mountain Hardwear (미국) ──
  ["Mountain Hardwear","님버스 UL",1.0,3,60,"12",0,"UL","경량"],
  ["Mountain Hardwear","AC",2.4,3,40,"23",1,"입문","자립"],
  ["Mountain Hardwear","아스펙트",2.6,4,80,"23",0,"동계","4계절"],
  ["Mountain Hardwear","트랑고",4.3,4,90,"234",0,"원정","동계"],
  // ── Sierra Designs (미국) ──
  ["Sierra Designs","메테오",2.4,3,30,"234",1,"입문","자립"],
  ["Sierra Designs","하이 루트",1.3,3,48,"1",0,"UL","트레킹폴"],
  ["Sierra Designs","클립 플래시라이트",1.6,3,25,"2",1,"클래식","가성비"],
  ["Sierra Designs","컨버트",3.2,4,75,"23",0,"동계","4계절"],
  // ── Exped (스위스) ──
  ["Exped","미라",1.6,3,50,"12",0,"경량","자립"],
  ["Exped","라이라",2.5,3,32,"23",1,"입문","자립"],
  ["Exped","비너스",2.9,3,42,"23",0,"거주성"],
  ["Exped","제미니",3.2,3,50,"234",0,"거주성"],
  ["Exped","오리온",2.8,4,80,"23",0,"동계","4계절"],
  // ── Nordisk (덴마크) ──
  ["Nordisk","텔레마크",0.95,3,70,"12",0,"UL","경량"],
  ["Nordisk","할란드",2.4,3,45,"2",0,"자립","더블월"],
  ["Nordisk","오플란드",2.3,3,55,"23",0,"경량","터널형"],
  ["Nordisk","스발바르",3.0,4,95,"23",0,"동계","터널형"],
  ["Nordisk","로포텐",0.5,3,120,"12",0,"초경량","DCF"],
  // ── Robens (덴마크) ──
  ["Robens","체이서",2.0,3,22,"23",1,"가성비","입문"],
  ["Robens","애로우 헤드",1.6,3,28,"1",1,"경량","가성비"],
  ["Robens","볼더",2.2,3,25,"12",1,"가성비"],
  ["Robens","파이오니어",2.5,3,26,"23",1,"입문"],
  ["Robens","굿우드",4.5,3,60,"5",0,"핫텐트","친목"],
  // ── Wechsel (독일) ──
  ["Wechsel","패스파인더",2.5,4,40,"1",0,"동계","자립"],
  ["Wechsel","엑소젠",1.9,3,55,"12",0,"경량","반자립"],
  ["Wechsel","차저",2.9,4,60,"2",0,"동계"],
  // ── Snugpak (영국) ──
  ["Snugpak","아이오노스피어",1.1,3,25,"1",1,"가성비","솔캠"],
  ["Snugpak","저니",1.6,3,22,"12",1,"가성비"],
  ["Snugpak","바이크",1.4,3,30,"12",0,"경량"],
  ["Snugpak","스콜피온",2.4,4,45,"23",0,"동계","4계절"],
  // ── Naturehike (중국·가성비) ──
  ["Naturehike","클라우드업",1.5,3,18,"123",1,"가성비","입문"],
  ["Naturehike","클라우드업 프로",1.36,3,28,"123",1,"가성비","경량"],
  ["Naturehike","몽가",2.4,3,25,"23",1,"가성비","거주성"],
  ["Naturehike","VIK",0.98,3,32,"12",1,"가성비","UL"],
  ["Naturehike","스타 리버",2.2,3,22,"23",1,"가성비","자립"],
  ["Naturehike","오팔러스",2.9,3,26,"234",1,"가성비","거주성"],
  ["Naturehike","하이비",2.5,3,20,"34",1,"가성비","입문"],
  ["Naturehike","타가",3.4,3,30,"2",1,"가성비","캐노피"],
  ["Naturehike","클라우드 피크",2.6,4,38,"23",1,"가성비","동계"],
  ["Naturehike","P 시리즈",1.7,3,16,"123",1,"가성비","입문"],
  ["Naturehike","울트라라이트",1.2,3,35,"12",1,"가성비","UL"],
  ["Naturehike","클라우드업 EXT",1.8,4,34,"23",1,"가성비","4계절"],
  ["Naturehike","시더",1.9,3,24,"23",1,"가성비","자립"],
  ["Naturehike","네뷸라",2.3,3,28,"23",1,"가성비","거주성"],
  ["Naturehike","클라우드 트레일",1.1,3,30,"12",1,"가성비","UL"],
  ["Naturehike","클라우드 게이트",2.0,3,26,"23",1,"가성비","자립"],
  ["Naturehike","스카이라인",3.5,3,40,"34",1,"가성비","거실형"],
  // ── Zerogram (한국) ──
  ["Zerogram","올뉴 엘찰텐 프로",1.86,3,58,"12",0,"국산","거주성"],
  ["Zerogram","엘찰텐 제로본",1.06,3,50,"12",0,"국산","UL"],
  ["Zerogram","파필리오",1.0,3,48,"12",0,"국산","경량"],
  ["Zerogram","제로1",0.9,3,55,"1",0,"국산","솔캠"],
  ["Zerogram","쓰루하이커",0.7,3,52,"1",0,"국산","초경량"],
  // ── Snow Peak (일본) ──
  ["Snow Peak","랜드브리즈",5.2,3,48,"34",0,"오토캠핑","친목"],
  ["Snow Peak","아메니티 돔",4.5,3,35,"34",1,"입문","친목"],
  ["Snow Peak","팰",4.0,3,55,"23",0,"친목","자립"],
  ["Snow Peak","라고",6.0,3,70,"4",0,"친목","거실형"],
  ["Snow Peak","미니멀리스트",1.5,3,40,"1",0,"경량","솔캠"],
  // ── Mont-bell (일본) ──
  ["Mont-bell","스텔라리지",1.43,3,45,"123",0,"경량","자립"],
  ["Mont-bell","크레센트",1.9,3,40,"12",0,"자립","경량"],
  ["Mont-bell","U.L. 돔 쉘터",0.85,3,55,"12",0,"UL","싱글월"],
  ["Mont-bell","루나돔",2.0,3,42,"234",0,"자립"],
  ["Mont-bell","모노프레임",1.3,4,70,"12",0,"동계","자립"],
  // ── Slingfin (미국) ──
  ["Slingfin","포탈",1.4,3,58,"23",0,"경량","자립"],
  ["Slingfin","2라이트",0.9,3,52,"2",0,"UL","트레킹폴"],
  ["Slingfin","스플릿윙",0.6,3,48,"12",0,"초경량","타프"],
  ["Slingfin","크로스보우",3.0,4,95,"2",0,"강풍","동계"],
  // ── Samaya (프랑스) ──
  ["Samaya","2.0",1.0,4,130,"2",0,"알파인","싱글월"],
  ["Samaya","2.5",1.2,4,120,"2",0,"동계","경량"],
  ["Samaya","어썰트",1.3,4,150,"2",0,"원정","동계"],
  // ── Helsport (노르웨이) ──
  ["Helsport","링스틴드",2.3,4,90,"23",0,"동계","자립"],
  ["Helsport","레인스피엘",2.9,4,80,"23",0,"동계","터널형"],
  ["Helsport","로포텐 캠프",3.5,4,110,"34",0,"동계","거주성"],
  // ── Wild Country (영국) ──
  ["Wild Country","제피로스",1.9,3,20,"12",1,"가성비","반자립"],
  ["Wild Country","헬름",2.4,3,25,"23",1,"가성비","자립"],
  ["Wild Country","코시",2.7,3,22,"23",1,"가성비"],
  // ── ALPS Mountaineering (미국) ──
  ["ALPS Mountaineering","링스",2.4,3,18,"1234",1,"가성비","자립"],
  ["ALPS Mountaineering","제피르",1.8,3,22,"12",1,"가성비","경량"],
  ["ALPS Mountaineering","태즈매니안",3.5,4,35,"23",0,"동계","4계절"],
  // ── Kelty (미국) ──
  ["Kelty","레이트 스타트",2.3,3,20,"12",1,"가성비","입문"],
  ["Kelty","살리다",2.4,3,22,"1234",1,"가성비","자립"],
  ["Kelty","더트 모텔",1.9,3,30,"23",0,"경량","자립"],
  ["Kelty","그랜드 메사",2.0,3,18,"24",1,"가성비","입문"],
  // ── Quechua / 데카트론 (프랑스) ──
  ["Quechua","MT900 UL",1.9,3,25,"12",1,"가성비","경량"],
  ["Quechua","MT500",3.0,3,18,"23",1,"가성비","입문"],
  ["Quechua","2 세컨즈 이지",2.6,3,12,"23",1,"가성비","팝업"],
  ["Quechua","포클라즈 트렉",2.4,3,20,"234",1,"가성비","입문"],
  // ── Jack Wolfskin (독일) ──
  ["Jack Wolfskin","익스올루션",2.6,3,35,"23",0,"자립","더블월"],
  ["Jack Wolfskin","고스트",1.9,3,40,"12",0,"경량"],
  // ── Salewa (이탈리아) ──
  ["Salewa","리톤",2.6,4,60,"23",0,"동계","알파인"],
  ["Salewa","마사이",3.0,3,45,"234",0,"거주성"],
  // ── Ferrino (이탈리아) ──
  ["Ferrino","라이트텐트",2.0,3,28,"123",1,"가성비","경량"],
  ["Ferrino","스핏파이어",1.5,3,35,"12",0,"경량","반자립"],
  // ── 기타 해외 브랜드 ──
  ["Luxe","사일 라이트",1.0,3,38,"12",0,"UL","트레킹폴"],
  ["Luxe","히코리",2.8,3,55,"46",0,"핫텐트","친목"],
  ["Big Sky","솔플러스",1.3,3,50,"12",0,"경량","자립"],
  ["Crux","X1",1.8,4,110,"12",0,"동계","알파인"],
  ["Lightwave","G 시리즈",2.5,4,90,"12",0,"동계","터널형"],
  ["Nortent","가밈",3.5,4,90,"46",0,"핫텐트","동계"],
  ["Seek Outside","시마론",1.4,4,70,"46",0,"핫텐트","경량"],
  ["Pomoly","돔 X",5.0,4,50,"46",0,"핫텐트","친목"],
  ["Vango","니밤",2.3,3,17,"12",1,"가성비","반자립"],
  ["Vango","밴텀",1.6,3,20,"12",1,"가성비","경량"],
  ["Vango","니밤 프로",2.2,3,25,"234",1,"가성비"],
  ["Coleman","선돔",3.0,3,10,"234",1,"가성비","입문"],
  ["Coleman","다크룸",4.5,3,20,"46",1,"가성비","친목"],
  // ── 가성비 UL / 알리 인기 브랜드 ──
  ["3F UL Gear","란산",0.9,3,12,"123",1,"가성비","트레킹폴"],
  ["3F UL Gear","란산 프로",0.64,3,25,"12",1,"가성비","DCF"],
  ["3F UL Gear","타이지투",1.3,3,18,"2",1,"가성비","더블월"],
  ["3F UL Gear","플로팅 클라우드",1.4,3,16,"123",1,"가성비","자립"],
  ["3F UL Gear","질라",1.1,3,20,"2",1,"가성비","경량"],
  ["Flame's Creed","울트라라이트",0.7,3,10,"12",1,"가성비","트레킹폴"],
  ["Asta Gear","윈드 시커",0.9,3,14,"12",1,"가성비","트레킹폴"],
  ["Aricxi","피라미드",0.5,3,11,"12",1,"가성비","트레킹폴"],
  ["OneTigris","스텔라",1.4,3,15,"12",1,"가성비","싱글월"],
  ["OneTigris","백우즈",2.0,3,18,"2",1,"가성비","자립"],
  ["OneTigris","로크 실드",1.6,3,20,"12",1,"가성비","타프"],
  ["OneTigris","탱그램",2.4,3,22,"2",1,"가성비","핫텐트"],
  ["OneTigris","솔로 홈스테드",2.2,4,30,"12",1,"가성비","핫텐트"],
  ["FireHiking","레보",2.0,4,25,"12",1,"가성비","핫텐트"],
  ["Onewind","타프 텐트",1.0,3,18,"1",1,"가성비","타프"],
  ["DD Hammocks","슈퍼라이트 타프",0.46,3,12,"1",1,"가성비","타프"],
  ["Trekology","백패킹",2.2,3,12,"23",1,"가성비","입문"],
  ["Night Cat","백패킹",1.9,3,9,"12",1,"가성비","입문"],
  ["Sportneer","울트라라이트",1.7,3,11,"12",1,"가성비"],
  ["Camel Crown","돔 텐트",2.6,3,13,"234",1,"가성비","입문"],
  ["Mier","울트라라이트",1.5,3,14,"12",1,"가성비","경량"],
  ["Hillman","3F 스타일",1.3,3,15,"12",1,"가성비","트레킹폴"],
  ["Geertop","알파인",2.5,4,25,"23",0,"동계","가성비"],
  ["Azarxis","백패킹",1.8,3,10,"12",1,"가성비"],
  ["Weanas","경량 돔",2.1,3,12,"123",1,"가성비","입문"],
  ["Bessport","캠핑 텐트",2.2,3,10,"123",1,"가성비","입문"],
  ["Clostnature","울트라라이트",1.7,3,13,"123",1,"가성비","경량"],
  ["Forceatt","백패킹",1.9,3,9,"23",1,"가성비","입문"],
  ["Featherstone","UL 그래닛",2.2,3,14,"23",1,"가성비","자립"],
  ["Paria","브리즈우드",2.0,3,16,"123",1,"가성비","자립"],
  // ── 추가 보강 (대형·패밀리·에어텐트 포함) ──
  ["Big Agnes","도스 캐빈스",3.0,3,50,"234",0,"거주성","자립"],
  ["Big Agnes","슬레이터 SL",2.6,3,42,"234",0,"거주성","자립"],
  ["MSR","허바 NX",1.4,3,55,"1",0,"경량","솔캠"],
  ["Marmot","뱁틱",1.1,3,58,"12",0,"UL","경량"],
  ["REI Co-op","패시지",2.4,3,24,"23",1,"입문","자립"],
  ["REI Co-op","캠프 돔",2.9,3,26,"234",1,"입문","자립"],
  ["REI Co-op","베이스캠프",7.0,4,60,"46",0,"동계","친목"],
  ["Kelty","디스커버리",3.5,3,15,"46",1,"가성비","친목"],
  ["Kelty","레인지오버",4.0,3,20,"46",1,"가성비","친목"],
  ["Coleman","선돔 라이트",2.6,3,12,"23",1,"가성비","입문"],
  ["Coleman","피크1",1.6,3,25,"12",0,"경량","자립"],
  ["Quechua","MT900 미니멀",1.1,3,35,"12",0,"경량","솔캠"],
  ["Quechua","에어세컨즈",5.0,3,25,"46",1,"가성비","에어"],
  ["ALPS Mountaineering","익스트림",2.9,4,30,"23",0,"동계","4계절"],
  ["ALPS Mountaineering","코퍼 캐년",4.0,3,28,"46",1,"가성비","친목"],
  ["Naturehike","도넛 에어",3.0,3,35,"34",1,"가성비","에어"],
  ["Naturehike","글램핑 에어",3.2,3,45,"24",1,"가성비","에어"],
  ["Snugpak","케이브",2.8,4,50,"23",0,"동계","4계절"],
];

// 브랜드 한글 별칭 (한글로 검색해도 잡히도록)
const BRAND_KR = {
  "Big Agnes":"빅아그네스","MSR":"엠에스알","NEMO":"니모","Sea to Summit":"씨투써밋 시투서밋",
  "Hilleberg":"힐레베르그","Terra Nova":"테라노바","Vaude":"바우데","Fjallraven":"피엘라벤 피엘라벤",
  "The North Face":"노스페이스 더노스페이스","Marmot":"마모트","REI Co-op":"알이아이 REI",
  "Tarptent":"타프텐트","Zpacks":"지팩스","Durston":"더스턴","Six Moon Designs":"식스문디자인",
  "Gossamer Gear":"고서머기어","Mountain Hardwear":"마운틴하드웨어","Sierra Designs":"시에라디자인",
  "Exped":"엑스페드","Nordisk":"노르디스크","Robens":"로벤스","Wechsel":"벡셀","Snugpak":"스너그팩",
  "Naturehike":"네이처하이크","Zerogram":"제로그램","Snow Peak":"스노우피크 스노피크","Mont-bell":"몽벨 몽벨",
  "Slingfin":"슬링핀","Samaya":"사마야","Helsport":"헬스포트","Wild Country":"와일드컨트리",
  "ALPS Mountaineering":"알프스 ALPS","Kelty":"켈티","Quechua":"케찾 퀘차 데카트론","Jack Wolfskin":"잭울프스킨",
  "Salewa":"살레와","Ferrino":"페리노","Luxe":"룩스","Big Sky":"빅스카이","Crux":"크럭스",
  "Lightwave":"라이트웨이브","Nortent":"노르텐트","Seek Outside":"씩아웃사이드","Pomoly":"포몰리",
  "Vango":"반고","Coleman":"콜맨 콜먼","3F UL Gear":"3F 란산","Flame's Creed":"플레임크리드",
  "Asta Gear":"아스타기어","Aricxi":"아릭시","OneTigris":"원티그리스 원티그리스","FireHiking":"파이어하이킹",
  "Onewind":"원윈드","DD Hammocks":"디디해먹","Trekology":"트레콜로지","Night Cat":"나이트캣",
  "Sportneer":"스포트니어","Camel Crown":"카멜크라운","Mier":"미어","Hillman":"힐만","Geertop":"기어탑",
  "Azarxis":"아자시스","Weanas":"위나스","Bessport":"베스포트","Clostnature":"클로스트네이처",
  "Forceatt":"포스캣","Featherstone":"페더스톤","Paria":"파리아","Durango":"듀랑고",
  // 장비(텐트 외) 브랜드
  "Osprey":"오스프리","Gregory":"그레고리","Deuter":"도이터","Rab":"랩","Petzl":"페츨",
  "Jetboil":"제트보일","Soto":"소토","Therm-a-Rest":"써머레스트","Black Diamond":"블랙다이아몬드",
  "Millet":"밀레","Kovea":"코베아","Primus":"프리머스","Trangia":"트랑기아","Fire Maple":"파이어메이플",
  "Klymit":"클라이밋","Ledlenser":"레드렌서","Goal Zero":"고제로","Fenix":"페닉스",
  "Granite Gear":"그래닛기어","Western Mountaineering":"웨스턴마운티니어링","Marmot":"마모트",
  // 캠핑 브랜드
  "Helinox":"헬리녹스","Minimworks":"미니멀웍스","Vidalido":"비달리도","Petromax":"페트로막스",
  "Solo Stove":"솔로스토브","YETI":"예티","Igloo":"이글루","Orca":"오르카","Barebones":"베어본즈","Kermit":"커밋체어",
  "Arcteryx":"아크테릭스","Patagonia":"파타고니아","Montbell":"몽벨","Black Yak":"블랙야크","Kolon Sport":"코오롱스포츠",
  "Columbia":"컬럼비아","Icebreaker":"아이스브레이커","Smartwool":"스마트울","Salomon":"살로몬","K2":"케이투 K2",
  "Nepa":"네파","Helly Hansen":"헬리한센","Discovery":"디스커버리","Decathlon":"데카트론",
  "Feathered Friends":"페더드프렌즈","Mountain Equipment":"마운틴이큅먼트","ISUKA":"이스카","NANGA":"난가",
  "Cumulus":"쿠물루스","Enlightened Equipment":"인라이튼드이큅먼트 EE","Katabatic":"카타바틱","Hammock Gear":"해먹기어",
  "Carinthia":"카린시아","Valandre":"발란드레","AEGISMAX":"에지스맥스","The Base":"더베이스",
  "EZIS":"이지스","Kazmi":"카즈미","Buffalo":"버팔로","Forclaz":"포클라즈 데카트론",
  "Hyperlite":"하이퍼라이트","ULA":"울라 ULA","Esbit":"에스빗","Evernew":"에버뉴","Toaks":"토악스","Vargo":"바르고",
  "Nitecore":"나이트코어","Claymore":"크레모아","Lumena":"루메나","38explore":"38익스플로러 38등","UCO":"유코",
  "Snowline":"스노우라인","DOD":"디오디","Ogawa":"오가와","Uniflame":"유니프레임 유니플레임","Lodge":"롯지",
  "Stanley":"스탠리","Pelican":"펠리칸","Iwatani":"이와타니","Paseco":"파세코","Alpaca":"알파카 난로",
  "Aladdin":"알라딘 난로","Toyotomi":"도요토미","Mr.Heater":"미스터히터","EcoFlow":"에코플로우","Jackery":"잭커리","Hanil":"한일"
};

/* ── 웹 조사(2026.07)로 확인한 실측 스펙 — [대표인원 min/trail 무게(kg), KR 대략가(만원)] ──
   출처: 제조사·REI·OutdoorGearLab·Switchback 등. 이 라인들은 카드에 '실측' 표시.
   나머지는 추정치(대표값에서 인원별 스케일) — 실측 대비 무게 ±10~15%, 가격 ±20% 오차 가능. */
const VERIFIED = {
  "Big Agnes|코퍼스퍼 HV UL":[1.36,68], "MSR|허바허바":[1.30,62], "MSR|프리라이트":[0.96,68],
  "NEMO|호넷 오스모":[0.95,60], "NEMO|대거 오스모":[1.48,66], "Zpacks|듀플렉스":[0.54,95],
  "Durston|X-Mid":[1.12,40], "Durston|X-Mid Pro":[0.55,78], "Six Moon Designs|루나 솔로":[0.71,33],
  "Sea to Summit|알토 TR":[1.15,62], "Sea to Summit|텔로스 TR":[1.50,75],
  "The North Face|스톰브레이크":[2.66,26], "REI Co-op|하프돔":[2.50,30], "Marmot|텅스텐":[2.40,28],
  "Naturehike|클라우드업":[1.50,18], "Zerogram|올뉴 엘찰텐 프로":[1.86,58], "Hilleberg|알락":[2.70,165]
};

// 무게 등급: UL(<1.3kg) / BPL(경량 <2.2kg) / 헤비(거주성·오토·동계)
// 인원 변형 스케일 계수. 대표(anchor) 인원을 기준으로 정규화해 스케일 → 1인전용/대형 텐트 오차 보정.
const _CW = {1:.74, 2:1, 3:1.32, 4:1.7, 5:2.1, 6:2.5};
const _CP = {1:.84, 2:1, 3:1.24, 4:1.5, 5:1.8, 6:2.1};
const _wc = w => w < 1.3 ? "UL" : w < 2.2 ? "BPL" : "헤비";
// 구조(자립/반자립/비자립)·월(싱글월/더블월)·메쉬 — 명시 태그 우선, 없으면 태그·모델명으로 추정
function _struct(tags, line){
  const T = tags.join(' ');
  if(/비자립/.test(T)) return '비자립';
  if(/반자립/.test(T)) return '반자립';
  if(/자립|프리스탠딩|돔형|팝업|에어/.test(T)) return '자립';
  if(/트레킹폴|타프(?!텐트)/.test(T) || /미드|피라미드|티피|모노폴|플렉사/.test(line)) return '비자립';
  if(/터널형/.test(T)) return '비자립';
  return '자립';                                // 일반 돔형 기본값
}
function _wall(tags, line){
  const T = tags.join(' ');
  if(/싱글월/.test(T)) return '싱글월';
  if(/더블월/.test(T)) return '더블월';
  if(/DCF|핫텐트|알파인/.test(T) || /미드|피라미드|티피|플렉사/.test(line)) return '싱글월';
  return '더블월';                              // 일반 백패킹 텐트 기본값
}
const TENTS = [];
TENT_MODELS.forEach(m => {
  let [brand, line, w2, season, p2, caps, value, ...tags] = m;
  const vkey = `${brand}|${line}`, ver = VERIFIED[vkey];
  if (ver) { w2 = ver[0]; p2 = ver[1]; }
  const capList = [...String(caps)].map(Number);
  const anchor = capList.includes(2) ? 2 : capList[0];   // 대표 인원(2인 우선)
  const struct = _struct(tags, line), wall = _wall(tags, line);
  const mesh = season === 3 && !/핫텐트/.test(tags.join(' '));  // 삼계절=메쉬 이너, 동계·핫텐트=최소화
  capList.forEach(c => {
    const w = +(w2 * _CW[c] / _CW[anchor]).toFixed(2);
    TENTS.push({
      brand, name: `${line} ${c}P`, weight: w, season,
      price: Math.round(p2 * 10000 * (_CP[c] / _CP[anchor]) / 1000) * 1000,
      cap: `${c}인`, wclass: _wc(w), value: !!value, tags,
      struct, wall, mesh,
      verified: !!ver && c === anchor          // 실측 확인 = 대표 인원 카드만
    });
  });
});

// 박지(캠핑 장소) — car: 자차 없이 접근 난이도, type: 섬/캠핑장/오지
// 각 박지에 insta:"https://www.instagram.com/p/XXXX/" 를 넣으면 그 게시물로,
// 없으면 CONTACT.instagram(아온다 프로필)로 연결됩니다. (박지 정보는 인스타에 하나씩 올려 링크)
const SPOTS = [
  { name: "굴업도", type: "섬", region: "인천 옹진", car: false, difficulty: "중", season: "봄·가을·초겨울",
    desc: "백패커의 성지. 개머리언덕 능선 노지. 배편+도보 접근이라 자차 없이 OK.", vibe:["솔캠","친목"], keyword:["노지","일몰","억새"] },
  { name: "대이작도", type: "섬", region: "인천 옹진", car: false, difficulty: "하", season: "봄·여름·가을",
    desc: "풀등 모래섬으로 유명. 접근 쉽고 초보 섬백패킹 입문지.", vibe:["친목"], keyword:["해변","입문","가족"] },
  { name: "승봉도", type: "섬", region: "인천 옹진", car: false, difficulty: "하", season: "봄·가을",
    desc: "이일레해변 야영. 조용하고 한적한 솔캠 최적지.", vibe:["솔캠"], keyword:["해변","한적","노지"] },
  { name: "선자령", type: "오지", region: "강원 평창", car: true, difficulty: "중", season: "가을·겨울",
    desc: "풍력발전기 능선. 설경·강풍의 대명사. 동계 장비 필수.", vibe:["솔캠","친목"], keyword:["설산","능선","강풍"] },
  { name: "민둥산", type: "오지", region: "강원 정선", car: true, difficulty: "중", season: "가을(억새)",
    desc: "억새 능선 백패킹의 명소. 가을 억새철 인기 폭발.", vibe:["친목"], keyword:["억새","능선","일출"] },
  { name: "두타산 무릉계곡", type: "오지", region: "강원 동해", car: true, difficulty: "상", season: "봄·가을",
    desc: "체력 요구되는 오지 산행형 박지. 자연 그대로의 뷰.", vibe:["솔캠"], keyword:["산행","계곡","도전"] },
  { name: "국립 자연휴양림(대야산 등)", type: "캠핑장", region: "충북 괴산", car: true, difficulty: "하", season: "사계절",
    desc: "데크·화장실·전기 완비. 편하게 백패킹 감성만 즐기기 좋음.", vibe:["친목"], keyword:["편의","입문","가족"] },
  { name: "가리왕산 자연휴양림", type: "캠핑장", region: "강원 정선", car: true, difficulty: "하", season: "사계절",
    desc: "고지대 데크 사이트. 여름 시원, 시설 좋아 친목캠에 최적.", vibe:["친목"], keyword:["데크","여름","시설"] },
  { name: "소무의도", type: "섬", region: "인천 중구", car: false, difficulty: "하", season: "봄·여름·가을",
    desc: "무의도 연결. 둘레길+한적한 노지. 당일~1박 가볍게.", vibe:["솔캠","친목"], keyword:["둘레길","한적","입문"] },
  // ── 섬 추가 ──
  { name: "우이도", type: "섬", region: "전남 신안", car: false, difficulty: "상", season: "봄·가을",
    desc: "풍성사구(모래언덕) 성지. 배를 여러 번 갈아타는 오지 섬이라 여유 일정 필수.", vibe:["솔캠"], keyword:["사구","오지섬","도전"] },
  { name: "소매물도", type: "섬", region: "경남 통영", car: false, difficulty: "중", season: "봄·가을",
    desc: "등대섬(초원+등대) 절경. 배로 접근하는 남해 인생샷 명소.", vibe:["친목"], keyword:["등대섬","절경","인생샷"] },
  { name: "관매도", type: "섬", region: "전남 진도", car: false, difficulty: "하", season: "봄·여름·가을",
    desc: "관매8경·해송숲. 물 맑고 조용한 남도 섬백패킹.", vibe:["솔캠","친목"], keyword:["해송","해변","한적"] },
  { name: "덕적도", type: "섬", region: "인천 옹진", car: false, difficulty: "하", season: "봄·여름·가을",
    desc: "서포리 해변 솔밭 야영. 인천서 배로 쉽게 가는 섬 입문지.", vibe:["친목"], keyword:["해변","솔밭","입문"] },
  { name: "국화도", type: "섬", region: "경기 화성", car: false, difficulty: "하", season: "봄·여름·가을",
    desc: "당일치기도 되는 미니 섬. 썰물 때 바닷길 열림. 가족·입문에 딱.", vibe:["친목"], keyword:["미니섬","입문","가족"] },
  // ── 오지·능선 추가 ──
  { name: "안반데기", type: "오지", region: "강원 강릉", car: true, difficulty: "하", season: "여름·가을·겨울",
    desc: "해발 1100m 고랭지 배추밭. 은하수·일출 성지. 차로 정상 근처까지 접근.", vibe:["솔캠","친목"], keyword:["은하수","일출","성지"] },
  { name: "청옥산 육백마지기", type: "오지", region: "강원 평창", car: true, difficulty: "중", season: "봄·여름·가을",
    desc: "드넓은 초원+샤스타데이지 꽃밭. 백패커들의 성지 중 성지.", vibe:["친목"], keyword:["초원","야생화","성지"] },
  { name: "매봉산 바람의언덕", type: "오지", region: "강원 태백", car: true, difficulty: "중", season: "여름·가을",
    desc: "고랭지 배추밭+풍력발전기. 시원한 능선 뷰가 일품.", vibe:["솔캠","친목"], keyword:["풍력","고랭지","능선"] },
  { name: "함백산 만항재", type: "오지", region: "강원 정선·태백", car: true, difficulty: "중", season: "여름·가을·겨울",
    desc: "국내 최고도 포장도로. 야생화 천국·설경. 정상 가까이 차로 접근.", vibe:["솔캠"], keyword:["야생화","설경","고지대"] },
  { name: "명성산", type: "오지", region: "경기 포천", car: true, difficulty: "중", season: "가을(억새)",
    desc: "산정호수 위 억새평원. 수도권 대표 억새 백패킹 명소.", vibe:["친목"], keyword:["억새","호수","수도권"] },
  { name: "오서산", type: "오지", region: "충남 보령", car: true, difficulty: "중", season: "가을",
    desc: "서해 조망+억새 능선. 일몰·운해가 아름다운 충남 명산.", vibe:["솔캠","친목"], keyword:["억새","일몰","서해"] },
  // ── 캠핑장·휴양림 추가 ──
  { name: "유명산 자연휴양림", type: "캠핑장", region: "경기 가평", car: true, difficulty: "하", season: "사계절",
    desc: "수도권 근교 데크 사이트. 계곡·숲, 접근성 좋아 입문·가족에 좋음.", vibe:["친목"], keyword:["데크","근교","가족"] },
  { name: "방태산 자연휴양림", type: "캠핑장", region: "강원 인제", car: true, difficulty: "하", season: "봄·여름·가을",
    desc: "이단폭포·원시림. 여름 시원하고 단풍 절경인 데크 야영지.", vibe:["친목"], keyword:["계곡","단풍","시설"] },

  // ═══ 섬 대폭 추가 ═══
  { name:"문갑도", type:"섬", region:"인천 옹진", car:false, difficulty:"중", season:"봄·가을", desc:"덕적군도의 조용한 섬. 한월리해변 노지, 한적함 그 자체.", vibe:["솔캠"], keyword:["노지","한적","해변"] },
  { name:"자월도", type:"섬", region:"인천 옹진", car:false, difficulty:"하", season:"봄·여름·가을", desc:"장골해변 솔밭 야영. 접근 쉬운 서해 섬 입문지.", vibe:["친목"], keyword:["해변","입문","가족"] },
  { name:"백아도", type:"섬", region:"인천 옹진", car:false, difficulty:"상", season:"봄·가을", desc:"덕적군도 오지 섬. 능선 뷰가 일품인 마니아 코스.", vibe:["솔캠"], keyword:["오지섬","능선","도전"] },
  { name:"무의도", type:"섬", region:"인천 중구", car:false, difficulty:"하", season:"사계절", desc:"공항 근처 접근성 갑. 하나개해변·호룡곡산 연계.", vibe:["친목"], keyword:["해변","근교","입문"] },
  { name:"장봉도", type:"섬", region:"인천 옹진", car:false, difficulty:"하", season:"봄·여름·가을", desc:"한들·옹암해변 백사장. 인천서 배로 쉬운 섬 입문지.", vibe:["친목"], keyword:["해변","입문","가족"] },
  { name:"소야도", type:"섬", region:"인천 옹진", car:false, difficulty:"중", season:"봄·가을", desc:"덕적도 옆 떼뿌루해변. 물때 맞으면 무인도 걷기.", vibe:["솔캠","친목"], keyword:["해변","무인도","한적"] },
  { name:"풍도", type:"섬", region:"경기 안산", car:false, difficulty:"중", season:"봄", desc:"봄 야생화(풍도바람꽃) 성지. 작고 고요한 섬.", vibe:["솔캠"], keyword:["야생화","한적","봄"] },
  { name:"입파도", type:"섬", region:"경기 화성", car:false, difficulty:"하", season:"봄·여름·가을", desc:"몽돌·모래 해변. 서해 낙조 명소인 아담한 섬.", vibe:["친목"], keyword:["낙조","해변","입문"] },
  { name:"연화도", type:"섬", region:"경남 통영", car:false, difficulty:"중", season:"봄·가을", desc:"용머리 절경+연화사. 통영 섬백패킹 인기 코스.", vibe:["친목"], keyword:["절경","능선","인생샷"] },
  { name:"비진도", type:"섬", region:"경남 통영", car:false, difficulty:"하", season:"봄·여름·가을", desc:"산호빛 해변+모래사장. 물놀이·야영 다 좋은 섬.", vibe:["친목"], keyword:["해변","물놀이","가족"] },
  { name:"사량도", type:"섬", region:"경남 통영", car:false, difficulty:"상", season:"봄·가을", desc:"지리산 능선(칠현산) 릿지. 스릴 있는 섬 산행 백패킹.", vibe:["솔캠"], keyword:["릿지","능선","도전"] },
  { name:"욕지도", type:"섬", region:"경남 통영", car:false, difficulty:"중", season:"봄·가을", desc:"고구마·출렁다리로 유명. 섬 일주+야영 여유롭게.", vibe:["친목"], keyword:["절경","드라이브","휴양"] },
  { name:"청산도", type:"섬", region:"전남 완도", car:false, difficulty:"하", season:"봄", desc:"슬로시티·유채꽃 청보리. 느린 섬 감성 백패킹.", vibe:["친목"], keyword:["슬로시티","유채","감성"] },
  { name:"보길도", type:"섬", region:"전남 완도", car:false, difficulty:"하", season:"봄·여름·가을", desc:"윤선도 원림+예송리 몽돌해변. 남도 섬 여행+야영.", vibe:["친목"], keyword:["몽돌","역사","휴양"] },
  { name:"생일도", type:"섬", region:"전남 완도", car:false, difficulty:"중", season:"봄·가을", desc:"백운산 숲길+금곡해변. 청정 무공해 섬.", vibe:["솔캠"], keyword:["숲길","한적","청정"] },
  { name:"외연도", type:"섬", region:"충남 보령", car:false, difficulty:"중", season:"봄·가을", desc:"상록수림·서해 최서단 감성. 배로만 가는 오지 섬.", vibe:["솔캠"], keyword:["상록수림","오지섬","낙조"] },
  { name:"삽시도", type:"섬", region:"충남 보령", car:false, difficulty:"하", season:"봄·여름·가을", desc:"물망터·거멀너머 해변. 서해 몽돌·모래 섬.", vibe:["친목"], keyword:["해변","입문","가족"] },
  { name:"선유도", type:"섬", region:"전북 군산", car:false, difficulty:"하", season:"봄·여름·가을", desc:"고군산군도 대표. 명사십리+장자도 연계 야영.", vibe:["친목"], keyword:["해변","인생샷","입문"] },
  { name:"신시도", type:"섬", region:"전북 군산", car:true, difficulty:"중", season:"봄·가을", desc:"새만금으로 차 접근 가능. 대각산 전망+몽돌해변.", vibe:["친목"], keyword:["전망","드라이브","해변"] },
  { name:"어청도", type:"섬", region:"전북 군산", car:false, difficulty:"상", season:"봄·가을", desc:"군산서 배 2시간 오지 섬. 등대·야생 그대로.", vibe:["솔캠"], keyword:["오지섬","등대","도전"] },
  { name:"홍도", type:"섬", region:"전남 신안", car:false, difficulty:"상", season:"봄·가을", desc:"천연기념물 절경 섬. 야영 규제 있어 사전 확인 필수.", vibe:["친목"], keyword:["절경","규제","인생샷"] },
  { name:"가거도", type:"섬", region:"전남 신안", car:false, difficulty:"상", season:"봄·가을", desc:"국토 최서남단. 배 4시간, 진짜 오지 백패킹.", vibe:["솔캠"], keyword:["최서남단","오지","도전"] },
  { name:"대청도", type:"섬", region:"인천 옹진", car:false, difficulty:"상", season:"봄·가을", desc:"모래사막(옥죽동 사구)+농여해변. 서해 최북단 감성.", vibe:["솔캠"], keyword:["사구","최북단","절경"] },
  { name:"가파도", type:"섬", region:"제주 서귀포", car:false, difficulty:"하", season:"봄", desc:"청보리밭+마라도·산방산 조망. 자전거+야영 감성.", vibe:["친목"], keyword:["청보리","조망","감성"] },
  { name:"추자도", type:"섬", region:"제주", car:false, difficulty:"상", season:"봄·가을", desc:"제주·완도 사이 오지 군도. 나바론절벽 절경.", vibe:["솔캠"], keyword:["절벽","오지","도전"] },
  { name:"우도", type:"섬", region:"제주", car:false, difficulty:"하", season:"사계절", desc:"성산 앞 인기 섬. 해변·등대, 붐비지만 접근 쉬움.", vibe:["친목"], keyword:["해변","관광","입문"] },

  // ═══ 오지·능선 대폭 추가 ═══
  { name:"덕항산", type:"오지", region:"강원 삼척", car:true, difficulty:"중", season:"봄·가을", desc:"환선굴 위 능선. 광활한 뷰의 백패킹 성지.", vibe:["솔캠","친목"], keyword:["능선","성지","조망"] },
  { name:"발왕산", type:"오지", region:"강원 평창", car:true, difficulty:"중", season:"여름·가을·겨울", desc:"케이블카+정상 능선. 주목군락·설경 뷰.", vibe:["친목"], keyword:["케이블카","설경","조망"] },
  { name:"태기산", type:"오지", region:"강원 횡성·평창", car:true, difficulty:"중", season:"여름·가을", desc:"풍력발전 능선. 시원한 초원·야생화.", vibe:["솔캠","친목"], keyword:["풍력","초원","능선"] },
  { name:"계방산", type:"오지", region:"강원 홍천·평창", car:true, difficulty:"중", season:"겨울", desc:"국내 5위 고봉. 겨울 상고대·설경 명소.", vibe:["솔캠"], keyword:["상고대","설경","겨울"] },
  { name:"두위봉", type:"오지", region:"강원 정선", car:true, difficulty:"중", season:"봄·가을", desc:"천년 주목+철쭉. 정선 오지 능선 야영.", vibe:["솔캠"], keyword:["주목","철쭉","오지"] },
  { name:"백덕산", type:"오지", region:"강원 영월", car:true, difficulty:"중", season:"봄·가을", desc:"사자산 연계 능선. 조용한 강원 오지.", vibe:["솔캠"], keyword:["능선","오지","한적"] },
  { name:"가리산", type:"오지", region:"강원 홍천", car:true, difficulty:"중", season:"봄·가을", desc:"홍천 진산. 정상 암봉+조망 좋은 야영지.", vibe:["솔캠","친목"], keyword:["암봉","조망","능선"] },
  { name:"곰배령", type:"오지", region:"강원 인제", car:true, difficulty:"중", season:"여름·가을", desc:"천상의 화원(예약 탐방). 야생화 천국. 야영 규정 확인.", vibe:["친목"], keyword:["야생화","예약","화원"] },
  { name:"능경봉", type:"오지", region:"강원 강릉", car:true, difficulty:"하", season:"여름·가을·겨울", desc:"대관령 위 완만 능선. 일출·설경 접근 쉬움.", vibe:["친목"], keyword:["일출","설경","입문"] },
  { name:"금대봉·대덕산", type:"오지", region:"강원 태백", car:true, difficulty:"중", season:"여름·가을", desc:"야생화 보호구역 인근 능선. 청정 고지대.", vibe:["솔캠"], keyword:["야생화","고지대","청정"] },
  { name:"오도산", type:"오지", region:"경남 합천", car:true, difficulty:"중", season:"여름·가을", desc:"정상 차 접근 가능. 은하수·운해·일출 성지.", vibe:["솔캠","친목"], keyword:["은하수","운해","성지"] },
  { name:"황매산", type:"오지", region:"경남 합천·산청", car:true, difficulty:"중", season:"봄·가을", desc:"철쭉·억새 대평원. 남부 대표 백패킹 성지.", vibe:["친목"], keyword:["철쭉","억새","성지"] },
  { name:"신불산", type:"오지", region:"울산·양산", car:true, difficulty:"중", season:"가을", desc:"영남알프스 억새 성지. 간월재 연계 능선.", vibe:["친목"], keyword:["억새","영남알프스","능선"] },
  { name:"간월재", type:"오지", region:"울산 울주", car:true, difficulty:"하", season:"가을", desc:"억새 물결 고개. 영남알프스 백패킹 입문 성지.", vibe:["친목"], keyword:["억새","고개","입문"] },
  { name:"재약산 사자평", type:"오지", region:"경남 밀양", car:true, difficulty:"중", season:"가을", desc:"국내 최대급 억새평원. 표충사 연계.", vibe:["솔캠","친목"], keyword:["억새","평원","능선"] },
  { name:"비슬산", type:"오지", region:"대구 달성", car:true, difficulty:"중", season:"봄", desc:"대견사+참꽃 군락. 봄 진달래 절경 야영.", vibe:["친목"], keyword:["참꽃","절경","능선"] },
  { name:"천관산", type:"오지", region:"전남 장흥", car:true, difficulty:"중", season:"가을", desc:"남해 조망+억새. 호남 5대 명산 백패킹.", vibe:["솔캠","친목"], keyword:["억새","남해","조망"] },
  { name:"달마산", type:"오지", region:"전남 해남", car:true, difficulty:"중", season:"봄·가을", desc:"미황사 위 공룡능선. 남도의 금강산 릿지 뷰.", vibe:["솔캠"], keyword:["릿지","절경","미황사"] },
  { name:"두륜산", type:"오지", region:"전남 해남", car:true, difficulty:"중", season:"봄·가을", desc:"대흥사+다도해 조망. 케이블카 연계 능선.", vibe:["친목"], keyword:["다도해","조망","능선"] },
  { name:"팔영산", type:"오지", region:"전남 고흥", car:true, difficulty:"상", season:"봄·가을", desc:"8개 암봉 릿지+다도해. 스릴 있는 남해 산행.", vibe:["솔캠"], keyword:["릿지","암봉","도전"] },
  { name:"바래봉", type:"오지", region:"전북 남원", car:true, difficulty:"중", season:"봄", desc:"지리산 서북능선 철쭉 성지. 초원 능선 야영.", vibe:["친목"], keyword:["철쭉","초원","능선"] },
  { name:"마이산", type:"오지", region:"전북 진안", car:true, difficulty:"하", season:"봄·가을", desc:"말 귀 모양 암봉. 탑사+독특한 지형 조망.", vibe:["친목"], keyword:["암봉","조망","관광"] },
  { name:"운장산", type:"오지", region:"전북 진안", car:true, difficulty:"중", season:"봄·가을", desc:"호남 중심 고봉. 운해·야생화 오지 능선.", vibe:["솔캠"], keyword:["운해","오지","능선"] },
  { name:"장안산", type:"오지", region:"전북 장수", car:true, difficulty:"중", season:"여름·가을", desc:"호남정맥 억새 능선. 무룡고개 접근 편함.", vibe:["솔캠","친목"], keyword:["억새","능선","고개"] },
  { name:"광덕산", type:"오지", region:"충남 아산·천안", car:true, difficulty:"하", season:"봄·가을", desc:"수도권서 가까운 완만 능선. 입문 야영지.", vibe:["친목"], keyword:["근교","입문","능선"] },
  { name:"서대산", type:"오지", region:"충남 금산", car:true, difficulty:"중", season:"봄·가을", desc:"충남 최고봉. 암릉+조망 좋은 오지.", vibe:["솔캠"], keyword:["암릉","조망","오지"] },
  { name:"대둔산", type:"오지", region:"충남·전북", car:true, difficulty:"중", season:"봄·가을", desc:"케이블카+구름다리 암릉. 사계절 절경.", vibe:["친목"], keyword:["암릉","절경","케이블카"] },
  { name:"구병산", type:"오지", region:"충북 보은", car:true, difficulty:"중", season:"봄·가을", desc:"속리산 남쪽 병풍 암릉. 충북알프스 코스.", vibe:["솔캠"], keyword:["암릉","능선","오지"] },
  { name:"도락산", type:"오지", region:"충북 단양", car:true, difficulty:"중", season:"봄·가을", desc:"단양팔경 인근 암봉. 소백 조망 좋은 산.", vibe:["솔캠"], keyword:["암봉","조망","단양"] },
  { name:"감악산(원주)", type:"오지", region:"강원 원주·충북 제천", car:true, difficulty:"중", season:"봄·가을", desc:"일망무제 조망의 강원 남부 능선.", vibe:["솔캠"], keyword:["조망","능선","오지"] },
  { name:"백운산(정선)", type:"오지", region:"강원 정선·영월", car:true, difficulty:"중", season:"봄·가을", desc:"동강 굽어보는 능선. 칠족령 절경 뷰.", vibe:["솔캠"], keyword:["동강","절경","능선"] },
  { name:"응봉산", type:"오지", region:"강원·경북", car:true, difficulty:"상", season:"봄·가을", desc:"덕구온천 위 깊은 오지. 원시림 능선.", vibe:["솔캠"], keyword:["오지","원시림","도전"] },
  { name:"소황병산", type:"오지", region:"강원 평창", car:true, difficulty:"중", season:"여름·가을", desc:"대관령 초원(양떼목장 인근). 완만 고원 뷰.", vibe:["친목"], keyword:["초원","고원","조망"] },
  { name:"팔공산", type:"오지", region:"대구·경북", car:true, difficulty:"중", season:"봄·가을", desc:"영남 명산. 갓바위·능선 조망.", vibe:["친목"], keyword:["능선","조망","명산"] },

  // ═══ 캠핑장·자연휴양림 대폭 추가 ═══
  { name:"청태산 자연휴양림", type:"캠핑장", region:"강원 횡성", car:true, difficulty:"하", season:"사계절", desc:"잣나무 숲 데크. 사계절 쾌적한 고지대 휴양림.", vibe:["친목"], keyword:["데크","잣나무","시설"] },
  { name:"대관령 자연휴양림", type:"캠핑장", region:"강원 강릉", car:true, difficulty:"하", season:"사계절", desc:"금강소나무 숲 국내 1호 휴양림. 데크 야영.", vibe:["친목"], keyword:["소나무","데크","시설"] },
  { name:"삼봉 자연휴양림", type:"캠핑장", region:"강원 홍천", car:true, difficulty:"하", season:"봄·여름·가을", desc:"약수·원시림. 계곡 데크로 여름 인기.", vibe:["친목"], keyword:["계곡","약수","시설"] },
  { name:"미천골 자연휴양림", type:"캠핑장", region:"강원 양양", car:true, difficulty:"하", season:"봄·여름·가을", desc:"깊은 계곡·불바라기약수. 청정 데크.", vibe:["친목"], keyword:["계곡","청정","데크"] },
  { name:"검봉산 자연휴양림", type:"캠핑장", region:"강원 삼척", car:true, difficulty:"하", season:"봄·여름·가을", desc:"동해 조망+숲. 바다 가까운 휴양림.", vibe:["친목"], keyword:["바다조망","데크","시설"] },
  { name:"백운산 자연휴양림(원주)", type:"캠핑장", region:"강원 원주", car:true, difficulty:"하", season:"사계절", desc:"원주 근교 숲 데크. 접근성 좋은 입문지.", vibe:["친목"], keyword:["근교","데크","입문"] },
  { name:"청옥산 자연휴양림", type:"캠핑장", region:"경북 봉화", car:true, difficulty:"하", season:"봄·여름·가을", desc:"백두대간 숲. 별 잘 보이는 고지대 휴양림.", vibe:["친목"], keyword:["별","고지대","데크"] },
  { name:"통고산 자연휴양림", type:"캠핑장", region:"경북 울진", car:true, difficulty:"하", season:"봄·여름·가을", desc:"울진 깊은 숲. 조용하고 시설 좋은 데크.", vibe:["친목"], keyword:["숲","한적","시설"] },
  { name:"운문산 자연휴양림", type:"캠핑장", region:"경북 청도", car:true, difficulty:"하", season:"봄·여름·가을", desc:"영남알프스 자락 계곡 데크. 여름 시원.", vibe:["친목"], keyword:["계곡","여름","데크"] },
  { name:"희리산 해송 자연휴양림", type:"캠핑장", region:"충남 서천", car:true, difficulty:"하", season:"사계절", desc:"국내 유일 해송림 휴양림. 서해 조망.", vibe:["친목"], keyword:["해송","바다","데크"] },
  { name:"축령산 자연휴양림", type:"캠핑장", region:"경기 남양주", car:true, difficulty:"하", season:"사계절", desc:"수도권 잣숲 데크. 가족·입문에 최적.", vibe:["친목"], keyword:["잣숲","근교","가족"] },
  { name:"중미산 자연휴양림", type:"캠핑장", region:"경기 양평", car:true, difficulty:"하", season:"사계절", desc:"별 관측 명소. 수도권 근교 숲 데크.", vibe:["친목"], keyword:["별","근교","데크"] },
  { name:"산음 자연휴양림", type:"캠핑장", region:"경기 양평", car:true, difficulty:"하", season:"사계절", desc:"치유의 숲. 넓고 쾌적한 데크 사이트.", vibe:["친목"], keyword:["치유","데크","가족"] },
  { name:"용화산 자연휴양림", type:"캠핑장", region:"강원 춘천·화천", car:true, difficulty:"하", season:"봄·여름·가을", desc:"파로호 조망 능선+휴양림. 물·산 연계.", vibe:["친목"], keyword:["조망","데크","계곡"] },
  { name:"방장산 자연휴양림", type:"캠핑장", region:"전북 고창", car:true, difficulty:"하", season:"봄·여름·가을", desc:"호남정맥 숲. 고창 근교 조용한 데크.", vibe:["친목"], keyword:["숲","한적","데크"] },
  { name:"지리산 자연휴양림", type:"캠핑장", region:"전북 남원", car:true, difficulty:"하", season:"사계절", desc:"지리산 자락 데크(공원 밖). 합법 야영으로 지리 감성.", vibe:["친목"], keyword:["지리산","데크","시설"] },
  { name:"덕유산 자연휴양림", type:"캠핑장", region:"전북 무주", car:true, difficulty:"하", season:"사계절", desc:"덕유 자락 계곡 데크. 여름·단풍 인기.", vibe:["친목"], keyword:["계곡","단풍","데크"] },
  { name:"운장산 자연휴양림", type:"캠핑장", region:"전북 진안", car:true, difficulty:"하", season:"봄·여름·가을", desc:"운장산 아래 청정 데크. 별·계곡 좋음.", vibe:["친목"], keyword:["별","계곡","데크"] },
];

// 할인 / 블랙프라이데이 정보 (예시 캘린더 — 매년 유사 패턴)
const DEALS = [
  { period: "1월", title: "겨울 시즌오프", desc: "동계 텐트·침낭 재고소진 할인. 힐레베르그·MSR 동계 라인 노려볼 시즌.", hot:false },
  { period: "3~4월", title: "봄 캠핑 시즌 오픈", desc: "신상 출시 + 이월 특가 공존. 삼계절 텐트 입문 타이밍.", hot:false },
  { period: "6~7월", title: "여름 클리어런스", desc: "네이처하이크 등 가성비 브랜드 상반기 최저가 구간.", hot:false },
  { period: "11월", title: "블랙프라이데이", desc: "연중 최대 세일. 빅아그네스·MSR·써머레스트 해외직구 최저. 배대지/관세 미리 확인!", hot:true },
  { period: "11월 말", title: "코리안 블프 (11번가·무신사 등)", desc: "국내몰 동시 세일. 제로그램·국산 브랜드 쿠폰 중복 노리기.", hot:true },
  { period: "12월", title: "연말 결산세일", desc: "블프 놓친 재고 추가 인하. 침낭·매트 등 소품 보충 적기.", hot:false },
];

// 연락처 / 채널  (인스타 핸들 알려주시면 instagram 값만 바꾸면 됩니다)
// ── 아온다 발자국: 크루가 실제 다녀온 기록 (후기·갤러리 탭 지도에 핀으로 표시) ──
// 새 기록 추가: name(장소), lat/lng(좌표 — 네이버지도에서 장소 우클릭하면 확인),
// date(날짜), people(함께한 크루 이름 배열 또는 숫자), note(한 줄 메모),
// photo(사진 경로 assets/... 또는 https 주소), insta(인스타 게시물 주소 — 있으면 팝업에 버튼)
const TRIPS = [
  { name:"굴업도", lat:37.190, lng:125.998, date:"2026.05", people:["준호","세아","도현"],
    note:"개머리언덕 능선 1박 — 정기 백패킹", photo:"", insta:"" },
  { name:"대이작도", lat:37.255, lng:126.293, date:"2026.06", people:["세아","민지"],
    note:"풀등 모래섬 + 해변 박", photo:"", insta:"" },
  { name:"선자령", lat:37.687, lng:128.760, date:"2026.01", people:["도현","준호"],
    note:"칼바람 설산 능선 — 동계 첫 도전", photo:"", insta:"" },
];

const CONTACT = {
  kakao: "https://open.kakao.com/o/g9pC3BIh",
  instagram: "https://www.instagram.com/team_a.o.d",   // 팀아온다 인스타
};

// 후기 전체공유 백엔드 (Supabase) — url·key 둘 다 채우면 크루 전체 공유 활성화.
// 비워두면 자동으로 기기별 localStorage 저장으로 동작.
// 설정법: Supabase 프로젝트 생성 → SQL로 reviews 테이블 생성(README 참고) →
//         Project Settings > API 의 Project URL 과 anon public key 를 아래에 붙여넣기.
const SUPABASE = {
  url: "https://wzlapxdnfhgapheuuqnl.supabase.co",   // keto-fridge 프로젝트 (reviews 테이블 공유)
  key: "sb_publishable_I7P96pUCMlS9eGv_uGdRfg_Etx_0ooc",   // publishable key — 공개돼도 안전한 키
};

// 예산별 장비 추천 (텐트 외) — low(~30만)/mid(30~70만)/high(70만+) 예산 티어별 · 여러 브랜드
// 가격은 해당 품목 1개 기준 대략치입니다.
const GEAR = [
  { cat:"침낭",
    low:{ name:"네이처하이크 CW280 다운", price:"8~13만", note:"3계절 가성비 다운" },
    mid:{ name:"씨투써밋 스파크 / 이스케이프", price:"25~42만", note:"경량 다운·압축성 우수" },
    high:{ name:"컴포트라이트 / 웨스턴마운티니어링", price:"55만+", note:"초경량 고급 구스다운" } },
  { cat:"매트",
    low:{ name:"네이처하이크 에어매트 / 폼매트", price:"3~6만", note:"입문용, 여름 위주" },
    mid:{ name:"써머레스트 Z라이트 / 넴 프로라이트", price:"12~20만", note:"R값·내구성 밸런스" },
    high:{ name:"써머레스트 넴프로 / 엑스페드 UL", price:"25만+", note:"고R값 초경량, 동계까지" } },
  { cat:"배낭",
    low:{ name:"네이처하이크 55L / 트레커리", price:"6~12만", note:"가성비 55L 백패킹팩" },
    mid:{ name:"오스프리 / 그레고리 60L급", price:"22~38만", note:"背面 편한 종주용" },
    high:{ name:"하이퍼라이트 / 그래닛기어", price:"45만+", note:"초경량 UL 배낭" } },
  { cat:"스토브",
    low:{ name:"BRS-3000T / 파이어메이플", price:"1~4만", note:"초경량 가스 스토브" },
    mid:{ name:"MSR 포켓로켓 / 소토 아미카스", price:"6~13만", note:"화력·안정성 좋음" },
    high:{ name:"MSR 윈드버너 / 소토 윈드마스터", price:"14만+", note:"내풍·정밀 화력" } },
  { cat:"헤드랜턴",
    low:{ name:"페츨 티키나 / 가성비 충전식", price:"2~4만", note:"입문 헤드랜턴" },
    mid:{ name:"페츨 액틱 / 블랙다이아몬드 스팟", price:"5~9만", note:"충전·밝기 균형" },
    high:{ name:"페츨 스위프트 RL", price:"12만+", note:"고광량·리액티브 조명" } },
];

// 백패킹·트레일러닝 행사 — 일정·접수는 매년 변동. 카드 클릭 시 접수·공식정보 검색으로 연결.
const EVENTS = [
  // ── 2026 확정 행사 (웹 조사로 확인) ──
  { name:"KOLON TRAIL CAMP · 동서트레일", type:"백패킹", when:"2026.10.10~11", region:"경북 봉화 일대", desc:"코오롱스포츠 주최. 국내 최초 동서트레일(849km) 장거리 백패킹. 25/60/120km 코스.", url:"https://www.kolonsport.com/KolonTrailCamp/Detail" },
  { name:"2026 MoonwaRk ORIGIN (문워크)", type:"백패킹", when:"2026.10.10~11", region:"산악 노지", desc:"밤을 걷는 감성 나이트 백패킹 시리즈. 문워크 오리진.", url:"https://www.instagram.com/moonwark_/" },
  { name:"B.T.C 베어트레일캠프 · 안동 (Second Forest)", type:"백패킹", when:"2026.10.17~18", region:"경북 안동", desc:"에코라인 주최 소셜 하이킹 캠프. 'Leave No Trace, Create New Trace'.", q:"BTC 베어트레일캠프 안동 신청" },
  { name:"BASED IN NATURE · 강진", type:"백패킹", when:"2026.10.17~18", region:"전남 강진", desc:"아웃도어 컬처 페스티벌. Spread the outdoor culture.", q:"강진 Based in Nature 아웃도어 2026" },
  { name:"off_index · Carry the Trail (53K)", type:"백패킹", when:"2026.10.24~25", region:"트레일 53km·4000m+", desc:"53km·누적고도 4000m+ 하드코어 트레일 챌린지(패스트패킹).", url:"https://www.instagram.com/ott_onthetrail/" },
  // 트레일러닝 (정기·시즌)
  { name:"코리아 50K", type:"트레일러닝", when:"매년 4~5월", region:"경기 가평·강원", desc:"국내 대표 트레일러닝 대회. 50K/25K 등 코스.", q:"코리아50K 트레일러닝 대회 접수" },
  { name:"트랜스제주 (Trans Jeju)", type:"트레일러닝", when:"매년 10월", region:"제주", desc:"UTMB 월드시리즈. 제주 오름·곶자왈 종주.", q:"트랜스제주 트레일러닝 접수" },
  { name:"서울 100K", type:"트레일러닝", when:"매년 가을", region:"서울 근교 산군", desc:"수도권 산줄기를 잇는 장거리 트레일.", q:"서울100K 트레일러닝 접수" },
  { name:"울주 트레일 나인피크", type:"트레일러닝", when:"매년 가을", region:"울산 울주", desc:"영남알프스 9봉을 잇는 하드코어 코스.", q:"울주 트레일 나인피크 접수" },
  { name:"진안 마이산 트레일", type:"트레일러닝", when:"매년 봄", region:"전북 진안", desc:"마이산 일대 트레일 러닝 코스.", q:"마이산 트레일러닝 대회 접수" },
  { name:"한국 100마일 (Korea 100 Miles)", type:"트레일러닝", when:"매년 가을", region:"강원 등", desc:"국내 대표 100마일 울트라 트레일.", q:"한국 100마일 트레일러닝 접수" },
  { name:"브랜드 트레일런 시리즈 (TNF·살로몬·코오롱 등)", type:"트레일러닝", when:"봄·가을 시즌", region:"전국", desc:"브랜드 주최 트레일런. 입문~고급 다양.", q:"트레일러닝 대회 일정 2026 접수" },
  // 백패킹 / 아웃도어
  { name:"고아웃 캠프 (GoOut Camp)", type:"백패킹", when:"봄·가을", region:"전국 순회", desc:"국내 대표 아웃도어·캠핑 페스티벌.", q:"고아웃 캠프 GoOut Camp 신청" },
  { name:"캠핑·아웃도어 박람회", type:"백패킹", when:"봄(2~4월)", region:"킨텍스·코엑스", desc:"신상 장비·브랜드 총출동. 현장 특가.", q:"캠핑 박람회 아웃도어 페어 2026" },
  { name:"백패킹 페스티벌", type:"백패킹", when:"봄·가을", region:"지역별", desc:"지자체·브랜드 주최 백패킹 모임·행사.", q:"백패킹 페스티벌 2026" },
  { name:"브랜드·커뮤니티 백패킹 모임", type:"백패킹", when:"수시", region:"전국", desc:"제로그램 등 브랜드·크루 정기·번개 모임.", q:"백패킹 모임 번개 2026" },
  { name:"Leave No Trace 정화 산행", type:"백패킹", when:"수시", region:"전국", desc:"흔적 남기지 않기·산행 정화 봉사 행사.", q:"Leave No Trace 정화 산행 봉사" },
];

// 장비 카탈로그 (텐트 외) — 카테고리별 전용 DB. 가격 만원 단위, 스펙(무게·R값·용량·루멘 등)은 대략치.
const GEAR_CATS = ["침낭","매트","배낭","스토브","랜턴"];
const GEAR_ITEMS = {};

// ── 매트 DB — [브랜드,모델,가격만,가성비,무게g,R값,타입(에어/폼/자충),...태그] R값·무게 대략치 ──
const _MAT_RAW = [
  ["Therm-a-Rest","네오에어 X라이트 NXT",30,0,370,4.5,"에어","초경량","3계절+"],
  ["Therm-a-Rest","네오에어 X썸 NXT",40,0,440,7.3,"에어","동계","초경량"],
  ["Therm-a-Rest","프로라이트",18,0,510,2.4,"자충","클래식"],
  ["Therm-a-Rest","Z라이트 쏠",13,0,410,2.0,"폼","내구성","펑크없음"],
  ["Therm-a-Rest","리지레스트",8,1,400,2.1,"폼","초저가","내구성"],
  ["Therm-a-Rest","베이스캠프",22,0,870,6.0,"자충","캠핑겸용","동계"],
  ["NEMO","텐서 트레일",22,0,400,2.8,"에어","정숙"],
  ["NEMO","텐서 올시즌",28,0,500,5.4,"에어","동계","정숙"],
  ["NEMO","스위치백",8,1,415,2.0,"폼","가성비"],
  ["NEMO","플라이어",20,0,545,3.3,"자충","안정감"],
  ["Sea to Summit","이더라이트 XT",28,0,490,3.2,"에어","두께10cm"],
  ["Sea to Summit","이더라이트 XT 익스트림",35,0,630,6.2,"에어","동계"],
  ["Sea to Summit","울트라라이트 에어",15,0,395,0.7,"에어","여름"],
  ["Sea to Summit","컴포트라이트 SI",20,0,620,3.7,"자충","편안함"],
  ["Exped","울트라 3R",22,0,415,2.9,"에어","경량"],
  ["Exped","울트라 5R",28,0,595,4.8,"에어","동계"],
  ["Exped","울트라 7R",35,0,640,7.1,"에어","혹한","동계"],
  ["Big Agnes","줌 UL",25,0,400,4.3,"에어","경량","동계경계"],
  ["Big Agnes","인슐레이티드 에어코어 울트라",18,1,600,4.5,"에어","가성비동계"],
  ["Klymit","스태틱 V",8,1,510,1.3,"에어","가성비","여름"],
  ["Klymit","인슐레이티드 스태틱 V",13,1,700,4.4,"에어","가성비동계"],
  ["Naturehike","경량 에어매트",4,1,480,2.1,"에어","가성비"],
  ["Naturehike","동계 에어매트",8,1,650,5.8,"에어","가성비동계"],
  ["Naturehike","폼 매트",2,1,400,1.5,"폼","초저가"],
  ["Forclaz","MT500 에어",6,1,500,3.3,"에어","가성비"],
  ["Forclaz","MT100 폼",2,1,450,1.5,"폼","초저가","입문"],
  ["Trekology","UL80 에어매트",5,1,450,2.0,"에어","초저가"],
];
GEAR_ITEMS["매트"] = _MAT_RAW.map(m=>{ const[brand,name,price,value,weight,rval,type,...tags]=m; return {brand,name,price,value:!!value,weight,rval,type,tags}; });

// ── 배낭 DB — [브랜드,모델,가격만,가성비,무게g,용량L,...태그] ──
const _PACK_RAW = [
  ["Osprey","이더 65",32,0,2270,65,"종주","등판시스템"],
  ["Osprey","아트모스 AG 65",33,0,2060,65,"AG등판","통기"],
  ["Osprey","엑소스 58",28,0,1160,58,"경량","통기"],
  ["Osprey","엑소스 48",26,0,1100,48,"경량"],
  ["Osprey","탈론 44",20,0,1150,44,"다용도"],
  ["Osprey","케스트럴 48",25,0,1600,48,"내구성"],
  ["Gregory","바탄 65",33,0,2100,65,"거주성","종주"],
  ["Gregory","파라곤 48",25,0,1600,48,"밸런스"],
  ["Gregory","포칼 48",28,0,1200,48,"경량"],
  ["Deuter","에어컨택트 라이트 65+10",28,0,1950,65,"등판","종주"],
  ["Deuter","퓨투라 에어트렉 60+10",30,0,2300,60,"통기등판"],
  ["Hyperlite","2400 사우스웨스트",55,0,795,40,"UL","DCF","방수"],
  ["Hyperlite","3400 사우스웨스트",60,0,880,55,"UL","DCF","방수"],
  ["Zpacks","아크 블라스트 55",60,0,595,55,"UL","DCF","프레임"],
  ["Granite Gear","크라운3 60",32,0,1050,60,"UL","가성비UL"],
  ["ULA","서킷",45,0,1160,68,"UL","종주검증"],
  ["Gossamer Gear","마리포사 60",42,0,975,60,"UL","수납좋음"],
  ["Gossamer Gear","고릴라 50",40,0,900,50,"UL"],
  ["Durston","카콰 55",40,0,870,55,"UL","가성비UL"],
  ["Mont-bell","알파인팩 60",25,0,1900,60,"알파인"],
  ["Millet","쿨라 60",20,1,2100,60,"입문","종주"],
  ["The North Face","테라 65",22,1,2300,65,"입문"],
  ["Kelty","코요테 65",18,1,2200,65,"가성비"],
  ["REI Co-op","플래시 55",25,0,1190,55,"경량","가성비"],
  ["Sierra Designs","플렉스 캐패시터 40-60",28,0,1220,60,"용량가변"],
  ["Exped","라이트닝 60",35,0,1160,60,"경량","방수원단"],
  ["Zerogram","UL 백팩 50",22,0,1100,50,"국산","경량"],
  ["Naturehike","로버 55",9,1,1400,55,"가성비"],
  ["Naturehike","울트라라이트 40",6,1,700,40,"가성비","경량"],
  ["Naturehike","65L 대용량",11,1,1600,65,"가성비","대용량"],
];
GEAR_ITEMS["배낭"] = _PACK_RAW.map(m=>{ const[brand,name,price,value,weight,vol,...tags]=m; return {brand,name,price,value:!!value,weight,vol,tags}; });

// ── 스토브 DB — [브랜드,모델,가격만,가성비,무게g,타입(가스/일체형/알콜/고체/화목/휘발유),...태그] ──
const _STOVE_RAW = [
  ["BRS","3000T",2,1,25,"가스","초경량","25g"],
  ["Fire Maple","FMS-300T",3,1,45,"가스","가성비","경량"],
  ["MSR","포켓로켓 2",7,0,73,"가스","안정","클래식"],
  ["MSR","포켓로켓 디럭스",10,0,83,"가스","압전점화","레귤레이터"],
  ["MSR","윈드버너",18,0,465,"일체형","내풍끝판"],
  ["MSR","리액터",30,0,500,"일체형","최강화력","원정"],
  ["MSR","위스퍼라이트",18,0,320,"휘발유","동계","원정"],
  ["MSR","드래곤플라이",22,0,400,"휘발유","화력조절","원정"],
  ["Soto","아미카스",8,1,81,"가스","내풍","가성비"],
  ["Soto","윈드마스터",12,0,87,"가스","내풍","정밀"],
  ["Soto","스톰브레이커",30,0,250,"휘발유","가스겸용","동계"],
  ["Jetboil","플래시",17,0,371,"일체형","빠른가열"],
  ["Jetboil","미니모",22,0,415,"일체형","불조절","취사"],
  ["Jetboil","스태시",20,0,200,"일체형","경량일체형"],
  ["Kovea","알파인마스터 2.0",9,1,400,"일체형","국산","동계"],
  ["Kovea","부스터+1",12,1,400,"휘발유","가스겸용","국산"],
  ["Primus","옴니퓨얼",35,0,440,"휘발유","멀티연료","원정"],
  ["Primus","라이트플러스",10,0,82,"가스","경량"],
  ["Trangia","알콜 스토브",4,0,110,"알콜","정숙","클래식"],
  ["Trangia","스톰쿠커 27",15,0,740,"알콜","일체세트","내풍"],
  ["Esbit","고체연료 스토브",2,1,11,"고체","비상용","초경량"],
  ["Evernew","티탄 알콜 스토브",6,0,34,"알콜","티타늄","UL"],
  ["Toaks","티타늄 사이폰 알콜",5,0,20,"알콜","UL"],
  ["Vargo","헥사곤 화목 스토브",6,0,116,"화목","티타늄","연료불필요"],
  ["Solo Stove","라이트",12,0,255,"화목","이중연소"],
  ["FireHiking","레온 화목난로",25,0,2800,"화목","핫텐트용","동계"],
];
GEAR_ITEMS["스토브"] = _STOVE_RAW.map(m=>{ const[brand,name,price,value,weight,type,...tags]=m; return {brand,name,price,value:!!value,weight,type,tags}; });

// ── 랜턴·조명 DB — [브랜드,모델,가격만,가성비,무게g,루멘,...태그] ──
const _LIGHT_RAW = [
  ["Petzl","티키나",3,1,81,250,"헤드랜턴","입문"],
  ["Petzl","액틱 코어",8,0,88,450,"헤드랜턴","충전"],
  ["Petzl","스위프트 RL",14,0,100,1100,"헤드랜턴","고광량","리액티브"],
  ["Petzl","e+LITE",4,0,26,30,"헤드랜턴","비상용","초경량"],
  ["Black Diamond","스팟 400",6,0,86,400,"헤드랜턴","방수"],
  ["Black Diamond","스톰 500-R",9,0,100,500,"헤드랜턴","고방수","충전"],
  ["Black Diamond","모지",4,1,122,200,"랜턴","감성","소형"],
  ["Ledlenser","MH5",7,0,92,400,"헤드랜턴","줌기능"],
  ["Ledlenser","ML4",6,0,71,300,"랜턴","소형","충전"],
  ["Nitecore","NU25 UL",6,0,45,400,"헤드랜턴","초경량","UL"],
  ["Fenix","HM65R",13,0,145,1400,"헤드랜턴","고광량","충전"],
  ["Goal Zero","라이트하우스 미니",8,0,230,210,"랜턴","USB충전"],
  ["Goal Zero","크러시 라이트",3,1,91,60,"랜턴","태양광","접이식"],
  ["Claymore","울트라 3.0 M",12,0,460,2700,"랜턴","고광량","파워뱅크"],
  ["Claymore","캐빈",8,1,300,700,"랜턴","파워뱅크","국내인기"],
  ["Lumena","루메나2",10,0,220,1300,"랜턴","국내인기","파워뱅크"],
  ["Lumena","루메나 M3",5,1,88,200,"랜턴","미니","충전"],
  ["38explore","38라이트",7,0,100,100,"랜턴","감성","무드등"],
  ["UCO","캔들 랜턴",3,0,110,15,"랜턴","감성","캔들"],
  ["Naturehike","캠핑 랜턴",3,1,120,150,"랜턴","가성비"],
];
GEAR_ITEMS["랜턴"] = _LIGHT_RAW.map(m=>{ const[brand,name,price,value,weight,lumen,...tags]=m; return {brand,name,price,value:!!value,weight,lumen,tags}; });

// ── 침낭 전용 DB (웹 조사 기반 확장) ──
// [브랜드, 모델, 가격(만원, 국내가 대략), 가성비, 무게(g), 리밋온도(℃, 추정), 충전재, ...태그]
// 온도는 리밋(EN/ISO Limit) 기준 대략치 — 개인차·습도에 따라 ±5℃. 무게 ±10%, 가격 ±20% 오차 가능.
const _BAG_RAW = [
  // ── Western Mountaineering (미국 · 구스 850+) ──
  ["Western Mountaineering","하이라이트",75,0,460,2,"구스850","초경량","여름·간절기"],
  ["Western Mountaineering","메가라이트",82,0,680,-1,"구스850","경량","넉넉한핏"],
  ["Western Mountaineering","울트라라이트",90,0,820,-7,"구스850","프리미엄","3계절끝판"],
  ["Western Mountaineering","알파인라이트",95,0,880,-7,"구스850","넉넉한핏","프리미엄"],
  ["Western Mountaineering","버사라이트",100,0,910,-12,"구스850","동계","프리미엄"],
  ["Western Mountaineering","안텔로프 MF",110,0,1080,-15,"구스850","동계","원정"],
  // ── Feathered Friends (미국 · 구스 900+) ──
  ["Feathered Friends","스왈로우 UL 20",85,0,730,-7,"구스900","프리미엄","경량"],
  ["Feathered Friends","험밍버드 UL 20",95,0,660,-7,"구스900","초경량","프리미엄"],
  ["Feathered Friends","라크 UL 10",100,0,820,-12,"구스900","동계","프리미엄"],
  // ── Rab (영국) ──
  ["Rab","미틱 울트라 180",90,0,400,2,"구스900","초경량","여름·간절기"],
  ["Rab","미틱 울트라 360",105,0,635,-6,"구스900","초경량","프리미엄"],
  ["Rab","뉴트리노 200",55,0,560,2,"구스800","경량","간절기"],
  ["Rab","뉴트리노 400",70,0,800,-7,"구스800","3계절","드래프트칼라"],
  ["Rab","뉴트리노 600",82,0,1035,-12,"구스800","동계"],
  ["Rab","어센트 700",55,0,1260,-12,"구스650","동계","합리적"],
  ["Rab","솔라 에코 2",28,1,1100,0,"합성","비오는날강함"],
  // ── Sea to Summit (호주) ──
  ["Sea to Summit","스파크 40",45,0,350,5,"구스850","초경량","여름"],
  ["Sea to Summit","스파크 28",55,0,500,0,"구스850","초경량","간절기"],
  ["Sea to Summit","스파크 15",68,0,800,-9,"구스850","경량","3계절+"],
  ["Sea to Summit","어센트 AcII",48,0,950,-1,"구스750","다용도","지퍼확장"],
  ["Sea to Summit","트렉 TkII",35,1,1200,-1,"덕650","입문","넉넉한핏"],
  // ── Therm-a-Rest (미국) ──
  ["Therm-a-Rest","하이페리온 20",75,0,570,-6,"구스900","초경량"],
  ["Therm-a-Rest","파섹 20",62,0,820,-6,"구스900","경량","2026리뉴얼"],
  ["Therm-a-Rest","퀘스타 20",38,1,1090,-6,"덕650","가성비다운"],
  ["Therm-a-Rest","스페이스 카우보이 45",30,0,470,7,"합성","여름","경량합성"],
  // ── Mountain Equipment (영국) ──
  ["Mountain Equipment","헬륨 250",40,0,715,2,"덕700","간절기"],
  ["Mountain Equipment","헬륨 400",48,0,870,-4,"덕700","3계절"],
  ["Mountain Equipment","헬륨 600",58,0,1120,-10,"덕700","동계"],
  ["Mountain Equipment","아이스라인",75,0,1345,-12,"덕700","동계","방수쉘"],
  // ── Marmot (미국) ──
  ["Marmot","하이드로겐 30",45,0,680,0,"구스800","경량"],
  ["Marmot","헬륨 15",58,0,880,-9,"구스800","3계절+"],
  ["Marmot","리튬 0",75,0,1140,-18,"구스800","동계","원정"],
  ["Marmot","트레슬스 15",22,1,1740,-9,"합성","가성비동계"],
  ["Marmot","트레슬스 30",18,1,1360,0,"합성","입문"],
  // ── Mont-bell (일본) ──
  ["Mont-bell","다운허거 800 #5",38,0,470,4,"구스800","여름","신축베플"],
  ["Mont-bell","다운허거 800 #3",45,0,600,-2,"구스800","3계절","신축베플"],
  ["Mont-bell","다운허거 800 #1",58,0,820,-8,"구스800","동계입문","신축베플"],
  ["Mont-bell","다운허거 800 #0",70,0,990,-14,"구스800","동계"],
  ["Mont-bell","다운허거 650 #3",28,1,790,-2,"덕650","가성비다운"],
  ["Mont-bell","버로우백 #3",15,1,1050,-1,"합성","가성비","세탁편함"],
  // ── NEMO (미국) ──
  ["NEMO","디스코 15",45,0,1170,-9,"덕650","옆잠전용","스푼쉐입"],
  ["NEMO","소닉 0",68,0,1250,-18,"구스800","동계","원정"],
  ["NEMO","포르테 20",30,1,1300,-6,"합성","옆잠전용"],
  // ── Big Agnes (미국) ──
  ["Big Agnes","토치라이트 UL 20",45,0,960,-6,"덕850","폭조절가능"],
  ["Big Agnes","로스트 레인저 UL 3N1",60,0,1160,-9,"덕850","레이어드","다용도"],
  // ── Kelty (미국) ──
  ["Kelty","코스믹 다운 20",18,1,1200,-6,"덕550","가성비다운","입문"],
  ["Kelty","코스믹 다운 0",26,1,1700,-18,"덕550","가성비동계"],
  ["Kelty","미스틱 20",12,1,1500,-6,"합성","입문"],
  // ── REI Co-op (미국) ──
  ["REI Co-op","마그마 15",52,0,800,-9,"구스850","가성비프리미엄"],
  ["REI Co-op","마그마 30",45,0,620,-1,"구스850","경량"],
  ["REI Co-op","트레일브레이크 30",15,1,1300,0,"합성","입문"],
  // ── Deuter · Vaude · Exped (유럽) ──
  ["Deuter","아스트로 프로 400",40,0,900,-4,"덕700","3계절"],
  ["Deuter","아스트로 500",35,0,1000,-6,"덕650","합리적"],
  ["Deuter","오비트 0°",15,1,1300,0,"합성","입문"],
  ["Vaude","시오크 400 S",20,0,900,1,"합성","친환경소재"],
  ["Exped","울트라 0°",48,0,650,0,"구스800","경량"],
  ["Exped","울트라 -5°",55,0,800,-5,"구스800","3계절"],
  // ── Carinthia · Snugpak (군용·합성 강자) ──
  ["Carinthia","디펜스 4",35,0,2000,-8,"합성","군용","험한환경"],
  ["Carinthia","트로픈",22,0,1100,5,"합성","여름","군용"],
  ["Snugpak","스페셜포스 1",20,0,1500,-5,"합성","군용","레이어드"],
  ["Snugpak","소프티 익스팬다",18,1,1700,-7,"합성","폭확장"],
  // ── Valandre · Cumulus (유럽 프리미엄) ──
  ["Valandre","블러디메리",95,0,1250,-16,"구스850","동계","원정"],
  ["Cumulus","라이트라인 400",42,0,845,-4,"구스850","폴란드구스"],
  ["Cumulus","엑스라이트 200",38,0,475,4,"구스900","초경량","여름"],
  // ── 퀼트 (UL 백패커) ──
  ["Enlightened Equipment","레벨레이션 20",45,0,570,-6,"덕850","퀼트","커스텀"],
  ["Enlightened Equipment","이니그마 10",52,0,660,-12,"덕850","퀼트","박스풋"],
  ["Katabatic","플렉스 22",60,0,620,-6,"구스900","퀼트","프리미엄"],
  ["Hammock Gear","버로우 20",38,1,600,-6,"구스800","퀼트","가성비퀼트"],
  ["Zpacks","클래식 슬리핑백 20",65,0,520,-6,"구스900","초경량","UL"],
  // ── 일본 (이스카 · 난가) ──
  ["ISUKA","에어 280X",35,0,570,2,"구스800","간절기","일본"],
  ["ISUKA","에어 450X",45,0,840,-6,"구스800","3계절","일본"],
  ["ISUKA","에어 630X",58,0,1030,-15,"구스800","동계","일본"],
  ["NANGA","오로라라이트 350DX",38,0,750,-1,"덕760","방수쉘","일본"],
  ["NANGA","오로라라이트 450DX",45,0,865,-6,"덕760","방수쉘","영구AS"],
  ["NANGA","오로라라이트 600DX",55,0,1050,-11,"덕760","동계","방수쉘"],
  ["NANGA","미니멀리즘 180",45,0,340,3,"구스930","초초경량","여름"],
  // ── 국산 · 국내 인기 ──
  ["The Base","웜웨이스트 800",33,1,1200,-15,"구스800","국산","동계가성비"],
  ["The Base","웜웨이스트 400",24,1,800,-5,"구스800","국산","3계절"],
  ["EZIS","맥스 M3",20,1,1150,-10,"구스800","국산","동계가성비"],
  ["Kazmi","프라임 덕다운",15,1,1300,-5,"덕600","캠핑겸용"],
  ["Kovea","익스트림 III",18,1,1500,-10,"덕600","캠핑겸용","국내AS"],
  ["Buffalo","알래스카",8,1,1800,-5,"합성","초저가","캠핑겸용"],
  // ── 중국 가성비 (네이처하이크 · 에지스맥스) ──
  ["Naturehike","CW280",9,1,550,3,"구스750","가성비","간절기"],
  ["Naturehike","CW400",13,1,750,-3,"구스750","가성비","3계절"],
  ["Naturehike","M300 합성",5,1,900,5,"합성","초저가","여름"],
  ["AEGISMAX","나노 2",8,1,350,4,"구스800","초경량가성비","여름"],
  ["AEGISMAX","G1",12,1,450,1,"구스800","경량가성비"],
  ["AEGISMAX","G3",16,1,640,-5,"구스800","3계절가성비"],
  // ── 데카트론 (초가성비) ──
  ["Forclaz","MT900 0°",12,1,800,0,"덕800","가성비다운"],
  ["Forclaz","MT900 -5°",16,1,1000,-5,"덕800","가성비다운"],
  ["Forclaz","MT500 합성",5,1,1300,5,"합성","입문","초저가"],
  // ── 기타 ──
  ["Sierra Designs","클라우드 20",40,0,860,-6,"덕800","지퍼리스"],
];
GEAR_ITEMS["침낭"] = _BAG_RAW.map(m=>{
  const [brand,name,price,value,weight,temp,fill,...tags]=m;
  return {brand,name,price,value:!!value,weight,temp,fill,tags};
});

// ── 캠핑(오토캠핑) 장비 카탈로그 ──
const CAMP_GEAR_CATS = ["대형텐트","타프","테이블·체어","화로대","버너·키친","난방·전원","랜턴","아이스박스","의류"];
const _CAMP_RAW = {
  "대형텐트":[
    ["Snow Peak","랜드락",120,0,"터널형","거실형","프리미엄"],
    ["Snow Peak","리빙쉘 롱 Pro.",95,0,"거실형","프리미엄"],
    ["Snow Peak","엔트리 2룸 엘필드",55,0,"2룸","입문"],
    ["Kovea","네스트 II",35,1,"돔형","국산","가성비"],
    ["Coleman","4S 와이드 2룸 코쿤 III",40,1,"2룸","가성비"],
    ["Coleman","터프 스크린 2룸 하우스",30,1,"거실형","가성비"],
    ["Nordisk","아스가르드 12.6",90,0,"벨텐트","감성"],
    ["Minimworks","쉘터G",45,0,"국산","쉘터"],
    ["Helinox","택티컬 필드 6.0",70,0,"경량대형","프리미엄"],
    ["Vidalido","옥타곤 돔텐트",20,1,"돔형","가성비"],
    ["Snow Peak","아메니티돔 M",30,1,"돔형","입문","스테디셀러"],
    ["Nordisk","레이사 6",120,0,"터널형","프리미엄","패밀리"],
    ["Nordisk","우드나 벨텐트",75,0,"벨텐트","감성","면텐트"],
    ["Ogawa","아폴론",130,0,"터널형","프리미엄","일본"],
    ["Ogawa","그로케 12",95,0,"모노폴+","감성","일본"],
    ["DOD","카마보코 텐트 3M",60,0,"터널형","감성","패밀리"],
    ["DOD","원폴 텐트 L",25,1,"티피","감성","간편설치"],
    ["Coleman","웨더마스터 2룸",55,0,"2룸","암실옵션","패밀리"],
    ["Snowline","새턴 2룸",35,1,"2룸","국산","가성비"],
    ["Kazmi","타워 2룸 텐트",30,1,"2룸","국산","가성비"],
    ["Naturehike","에어 텐트 12X",45,1,"에어빔","펌프설치","간편"],
    ["Minimworks","잭 쉘터 플러스",55,0,"국산","쉘터","동계강함"],
    ["Pomoly","호트 티피 핫텐트",40,0,"핫텐트","화목난로","동계"],
  ],
  "타프":[
    ["Snow Peak","HD 타프 쉴드 헥사",25,0,"헥사","내구성"],
    ["MSR","론지 타프",18,0,"경량","방수"],
    ["Kovea","일자형 그늘막 타프",8,1,"일자","가성비"],
    ["Minimworks","어반 타프",15,0,"국산","도심감성"],
    ["Nordisk","카리 20",30,0,"대형","감성"],
    ["Coleman","XP 헥사 타프",9,1,"헥사","가성비"],
    ["Helinox","타프 5.0",40,0,"경량","프리미엄"],
    ["Naturehike","방수 사각 타프",6,1,"가성비","입문"],
    ["Snow Peak","HD 타프 헥사 L",35,0,"헥사","대형","내구성"],
    ["DD Hammocks","타프 4x4",12,0,"사각","다변형","방수"],
    ["DOD","이츠카노 타프",15,1,"헥사","감성"],
    ["Kazmi","블랙 렉타 타프",10,1,"렉타","국산","암막"],
    ["Snowline","미니멀 타프",8,1,"국산","경량","가성비"],
    ["Minimworks","파오 쉘터타프",35,0,"국산","감성","쉘터형"],
    ["Ogawa","시스템 타프 헥사 DX",30,0,"헥사","일본","연결형"],
  ],
  "테이블·체어":[
    ["Helinox","체어 원",13,0,"경량","베스트셀러"],
    ["Helinox","택티컬 체어",15,0,"경량","프리미엄"],
    ["Kovea","롱 릴렉스 체어",6,1,"릴렉스","가성비"],
    ["Snow Peak","IGT 아이언그릴테이블",40,0,"모듈시스템","확장성"],
    ["Coleman","4단 롤 테이블",7,1,"롤테이블","가성비"],
    ["Helinox","테이블 원",9,0,"경량","컴팩트"],
    ["Kermit","커밋 체어",25,0,"우드","감성"],
    ["Naturehike","경량 폴딩 체어",4,1,"가성비","입문"],
    ["Helinox","체어 투",17,0,"하이백","편안함"],
    ["Helinox","선셋 체어",19,0,"하이백","릴렉스"],
    ["Helinox","택티컬 테이블 M",16,0,"경량","프리미엄"],
    ["Snow Peak","로우 체어 30",22,0,"로우스타일","스테디셀러"],
    ["Snow Peak","원 액션 테이블",25,0,"원터치","우드상판"],
    ["Coleman","릴렉스 폴딩 벤치",8,1,"벤치","2인용"],
    ["Kazmi","시그니처 릴렉스 체어",7,1,"국산","릴렉스","가성비"],
    ["DOD","스고이 체어",14,0,"각도조절","감성"],
    ["Snowline","큐브 백패커 테이블",5,1,"국산","경량","백패킹겸용"],
    ["Vidalido","우드롤 테이블",8,1,"우드","롤테이블","가성비"],
  ],
  "화로대":[
    ["Snow Peak","화로대 L",25,0,"스테디셀러","내구성"],
    ["Kovea","슬림 화로대",8,1,"슬림","가성비"],
    ["Coleman","파이어 디스크",12,1,"디스크","간편"],
    ["Minimworks","인디안 화로대",30,0,"국산","감성"],
    ["Petromax","아타고",20,0,"멀티","조리"],
    ["Solo Stove","레인저",25,0,"무연","화목"],
    ["Naturehike","접이식 화로대",6,1,"가성비","휴대"],
    ["Solo Stove","본파이어 2.0",40,0,"무연","화목","시그니처"],
    ["Uniflame","파이어 그릴",8,1,"일본","그릴겸용","스테디셀러"],
    ["Uniflame","유니세라 TG-III",15,0,"일본","세라믹","탁상그릴"],
    ["Snow Peak","야에 화로대",18,0,"경량","조립식"],
    ["Barebones","카우보이 화로대 23",30,0,"감성","조리겸용"],
    ["DOD","메라 텔레스코프 화로대",12,1,"컴팩트","감성"],
    ["Kazmi","와일드 필드 화로대",6,1,"국산","가성비"],
    ["Lodge","더치오븐 캠프 12인치",12,0,"무쇠","화로대조리","캠프쿡"],
  ],
  "랜턴":[
    ["Coleman","노스스타 가솔린 랜턴",15,0,"가솔린","밝기"],
    ["Snow Peak","리틀램프 노쿠토",9,0,"가스","감성"],
    ["Goal Zero","라이트하우스 600",10,0,"충전","캠핑"],
    ["Kovea","경질 가스 랜턴",7,1,"가스","가성비"],
    ["Barebones","비콘 라이트",6,0,"감성","충전"],
    ["Fenix","CL30R",8,0,"충전","고광량"],
    ["Naturehike","캠핑 랜턴",3,1,"가성비","입문"],
    ["Petromax","HK500 등유랜턴",35,0,"등유","감성끝판","클래식"],
    ["Claymore","울트라 3.0 X",15,0,"충전","고광량","파워뱅크"],
    ["Lumena","루메나 프로 5",12,0,"충전","3면발광","국내인기"],
    ["Barebones","레일로드 랜턴",9,0,"감성","엣지슨전구"],
    ["DOD","포섬 랜턴",8,1,"충전","감성","무드등"],
    ["Coleman","배터리 가드 랜턴",4,1,"건전지","가성비"],
    ["38explore","38등 오리지널",7,0,"감성","무드등","국내인기"],
  ],
  "아이스박스":[
    ["Coleman","익스트림 쿨러 58L",9,1,"대용량","가성비"],
    ["YETI","툰드라 45",45,0,"프리미엄","보냉끝판왕"],
    ["Igloo","맥스콜드 62L",7,1,"가성비","대용량"],
    ["Kovea","아이스박스 25L",6,1,"중형","가성비"],
    ["Coleman","소프트 쿨러",4,1,"소프트","경량"],
    ["Orca","하드 쿨러 40",40,0,"프리미엄","내구성"],
    ["Naturehike","폴딩 쿨러백",3,1,"가성비","휴대"],
    ["YETI","로디 24",35,0,"프리미엄","컴팩트"],
    ["Stanley","어드벤처 쿨러 30QT",15,0,"레트로","내구성"],
    ["Coleman","스틸벨트 쿨러 54QT",25,0,"레트로","감성","스테디셀러"],
    ["Pelican","엘리트 쿨러 50QT",45,0,"프리미엄","밀스펙"],
    ["Kazmi","블랙 아이스박스 38L",8,1,"국산","가성비"],
  ],
  "버너·키친":[
    ["Kovea","슬림 트윈버너 프로",12,1,"투버너","국산","스테디셀러"],
    ["Coleman","파워하우스 투버너",18,0,"투버너","화이트가솔린"],
    ["Snow Peak","홈앤캠프 버너",13,0,"싱글버너","수납미학"],
    ["Iwatani","카세트후 마블",6,1,"싱글버너","일본","가성비"],
    ["Soto","레귤레이터 스토브 ST-310",9,0,"싱글버너","일본","감성"],
    ["Kovea","3웨이 올인원 버너",15,1,"멀티","국산"],
    ["Snow Peak","기가파워 플레이트버너 LI",25,0,"플레이트","IGT호환"],
    ["Kazmi","필드 키친테이블 세트",13,1,"키친테이블","국산","수납"],
    ["Coleman","올인원 키친테이블",11,1,"키친테이블","가성비"],
    ["Stanley","베이스캠프 쿡세트",13,0,"코펠세트","올인원"],
    ["Snow Peak","필드 쿠커 Pro.1",20,0,"코펠세트","프리미엄"],
    ["Kovea","캠핑 하드코펠 XL",5,1,"코펠세트","국산","가성비"],
    ["Lodge","스킬렛 10인치",5,0,"무쇠","시즈닝","스테디셀러"],
    ["Petromax","티키틀 주전자",8,0,"감성","캠핑케틀"],
    ["Naturehike","캠핑 조리도구 세트",4,1,"쿡툴","가성비"],
    ["Trangia","스톰쿠커 L",17,0,"알콜","일체형","스웨덴"],
  ],
  "난방·전원":[
    ["Paseco","캠프 25 등유난로",25,1,"등유난로","국민난로","동계"],
    ["Alpaca","TS-77A 컴팩트",22,0,"등유난로","국산","스테디셀러"],
    ["Aladdin","블루플레임",45,0,"등유난로","감성","클래식"],
    ["Toyotomi","레인보우",35,0,"등유난로","일본","무드"],
    ["Kovea","큐피드 가스히터",6,1,"가스히터","휴대"],
    ["Coleman","핸디 가스히터",8,0,"가스히터","소형"],
    ["Mr.Heater","버디 히터",18,0,"가스히터","미국","안전장치"],
    ["EcoFlow","리버 2",35,0,"파워스테이션","급속충전"],
    ["EcoFlow","델타 2",95,0,"파워스테이션","대용량"],
    ["Jackery","익스플로러 240",30,0,"파워스테이션","입문"],
    ["Jackery","익스플로러 500",60,0,"파워스테이션","중형"],
    ["Hanil","캠핑용 전기요",5,1,"전기요","국산","전기사이트용"],
    ["Naturehike","USB 전기담요",4,1,"전기담요","가성비"],
  ],
  "의류":[
    ["Arcteryx","베타 AR 재킷",95,0,"하드쉘","고어텍스","방수"],
    ["The North Face","눕시 다운자켓",35,0,"다운","보온","겨울"],
    ["Patagonia","나노퍼프 재킷",29,1,"경량패딩","간절기"],
    ["Patagonia","R1 플리스",16,0,"플리스","베이스","보온"],
    ["Mountain Hardwear","고스트휘스퍼러 후디",30,0,"다운","초경량","백패킹"],
    ["Rab","마이크로라이트 다운",30,0,"다운","경량","보온"],
    ["Montbell","퍼마프로스트 다운",28,1,"다운","경량","보온"],
    ["Marmot","프리시피 레인자켓",18,1,"레인","방수","경량"],
    ["Black Yak","고어텍스 등산자켓",42,0,"하드쉘","방수","등산"],
    ["Kolon Sport","안타티카 다운",40,0,"다운","보온","겨울"],
    ["Millet","트리로지 다운",33,0,"다운","알파인","보온"],
    ["Columbia","옴니히트 플리스",12,1,"플리스","가성비","보온"],
    ["Icebreaker","메리노 베이스레이어",14,0,"베이스레이어","메리노","보온"],
    ["Smartwool","메리노 티셔츠",11,0,"베이스레이어","메리노","속건"],
    ["Fjallraven","베그포스 팬츠",22,0,"팬츠","내구성","G-1000"],
    ["Salomon","트레일 팬츠",13,0,"팬츠","트레킹"],
    ["K2","트레킹 팬츠",9,1,"팬츠","신축성","가성비"],
    ["Nepa","경량 바람막이",7,1,"바람막이","간절기","가성비"],
    ["Helly Hansen","방수 쉘자켓",25,0,"하드쉘","방수"],
    ["Discovery","플리스 집업",9,1,"플리스","가성비","캐주얼"],
    ["Decathlon","MH100 플리스",3,1,"플리스","초가성비","입문"],
    ["Decathlon","레인코트 방수자켓",5,1,"레인","방수","가성비"],
  ],
};
const CAMP_GEAR_ITEMS = {};
CAMP_GEAR_CATS.forEach(c=>{ CAMP_GEAR_ITEMS[c] = _CAMP_RAW[c].map(m=>{ const[brand,name,price,value,...tags]=m; return {brand,name,price,value:!!value,tags}; }); });

// 오토캠핑 캠핑장 (캠핑 도메인의 '박지' 대체) — 시설·요금은 참고용, 예약·정확한 정보는 카드 링크에서 확인.
// type: 오토 / 휴양림(자연휴양림 데크) / 노지 / 글램핑 · elec 전기 · hot 온수 · pet 반려동물 동반
const CAMPGROUNDS = [
  { name:"자라섬 오토캠핑장", type:"오토", region:"경기 가평", season:"사계절", elec:true, hot:true, pet:false, price:"2~4만",
    desc:"북한강 섬 오토캠핑의 대명사. 사이트가 넓고 접근이 편해 초보·가족에게 인기.", keyword:["섬","입문","가족"] },
  { name:"난지 한강공원 캠핑장", type:"오토", region:"서울 마포", season:"사계절", elec:true, hot:true, pet:false, price:"3~4만",
    desc:"도심 속 한강 캠핑. 지하철로 접근 가능해 장비 없이도 부담 없는 입문지.", keyword:["도심","한강","입문"] },
  { name:"유명산자연휴양림", type:"휴양림", region:"경기 가평", season:"봄·여름·가을", elec:true, hot:true, pet:false, price:"3~5만",
    desc:"계곡 옆 데크 오토. 서울 근교라 여름 물놀이 캠핑으로 붐빈다.", keyword:["계곡","숲","가족"] },
  { name:"중미산자연휴양림", type:"휴양림", region:"경기 양평", season:"봄·가을", elec:true, hot:true, pet:false, price:"3~5만",
    desc:"고지대 데크라 별 보기 좋음. 천문대가 인접해 밤하늘 명소.", keyword:["별","숲","고지대"] },
  { name:"호명호수 글램핑", type:"글램핑", region:"경기 가평", season:"사계절", elec:true, hot:true, pet:true, price:"8~15만",
    desc:"침구·난방 완비 글램핑. 초보·커플용, 반려동물 동반 사이트 운영.", keyword:["글램핑","커플","반려동물"] },
  { name:"오대산자연휴양림", type:"휴양림", region:"강원 평창", season:"봄·여름·가을", elec:true, hot:true, pet:false, price:"3~5만",
    desc:"국립. 전나무숲과 맑은 계곡으로 여름에 시원한 대표 휴양림.", keyword:["숲","계곡","국립"] },
  { name:"대관령자연휴양림", type:"휴양림", region:"강원 강릉", season:"봄·여름·가을", elec:true, hot:true, pet:false, price:"3~5만",
    desc:"국내 1호 자연휴양림. 아름드리 소나무 숲 데크가 인상적.", keyword:["소나무","숲","국립"] },
  { name:"방태산자연휴양림", type:"휴양림", region:"강원 인제", season:"여름·가을", elec:true, hot:true, pet:false, price:"3~4만",
    desc:"이단폭포와 청정 계곡. 가을 단풍 절경으로 유명.", keyword:["계곡","단풍","폭포"] },
  { name:"청태산자연휴양림", type:"휴양림", region:"강원 횡성", season:"사계절", elec:true, hot:true, pet:false, price:"3~4만",
    desc:"잣나무 숲과 눈 많은 겨울 설경. 사계절 데크 오토 가능.", keyword:["잣나무","설경","숲"] },
  { name:"아우라지 오토캠핑장", type:"오토", region:"강원 정선", season:"사계절", elec:true, hot:true, pet:true, price:"2~4만",
    desc:"강변 오토캠핑. 레일바이크가 인접해 아이와 즐기기 좋고 반려동물 동반 가능.", keyword:["강변","반려동물","가족"] },
  { name:"덕산기계곡 노지", type:"노지", region:"강원 정선", season:"여름·가을", elec:false, hot:false, pet:true, price:"무료~1만",
    desc:"화장실 정도만 있는 청정 계곡 노지. 물놀이·차박 겸용, 무료급.", keyword:["계곡","노지","무료"] },
  { name:"동강 노지 캠핑", type:"노지", region:"강원 영월", season:"여름·가을", elec:false, hot:false, pet:true, price:"무료~1만",
    desc:"동강 래프팅 명소의 강변 노지. 밤하늘 별 보기가 일품.", keyword:["강변","별","노지"] },
  { name:"안면도자연휴양림", type:"휴양림", region:"충남 태안", season:"사계절", elec:true, hot:true, pet:false, price:"3~5만",
    desc:"국내 유일 소나무 자연림에 해변까지 인접. 서해 노을 명소.", keyword:["바다","소나무","노을"] },
  { name:"몽산포 오토캠핑장", type:"오토", region:"충남 태안", season:"사계절", elec:true, hot:true, pet:false, price:"2~4만",
    desc:"솔숲과 해변을 낀 오토캠핑. 갯벌 체험으로 가족 캠핑 인기.", keyword:["바다","솔숲","가족"] },
  { name:"대야산자연휴양림", type:"휴양림", region:"충북 괴산", season:"봄·여름·가을", elec:true, hot:true, pet:false, price:"3~4만",
    desc:"용추계곡 옆 데크. 물이 맑고 트레킹 코스가 좋다.", keyword:["계곡","트레킹","숲"] },
  { name:"희리산해송자연휴양림", type:"휴양림", region:"충남 서천", season:"사계절", elec:true, hot:true, pet:false, price:"3~4만",
    desc:"해송림에서 서해가 조망되는 휴양림. 겨울에도 비교적 온화.", keyword:["바다","해송","조망"] },
  { name:"지리산자연휴양림", type:"휴양림", region:"경남 함양", season:"봄·여름·가을", elec:true, hot:true, pet:false, price:"3~5만",
    desc:"지리산 자락 숲속 데크. 계곡과 둘레길을 함께 즐긴다.", keyword:["지리산","계곡","숲"] },
  { name:"가야산자연휴양림", type:"휴양림", region:"경남 합천", season:"봄·가을", elec:true, hot:true, pet:false, price:"3~4만",
    desc:"가야산 조망과 해인사 인접. 가을 단풍이 특히 좋다.", keyword:["산","조망","단풍"] },
  { name:"운문산자연휴양림", type:"휴양림", region:"경북 청도", season:"봄·여름·가을", elec:true, hot:true, pet:false, price:"3~4만",
    desc:"맑은 계곡과 숲. 영남알프스 등산 베이스로도 좋다.", keyword:["계곡","등산","숲"] },
  { name:"학동몽돌 오토캠핑장", type:"오토", region:"경남 거제", season:"사계절", elec:true, hot:true, pet:false, price:"2~4만",
    desc:"몽돌해변 바로 앞 오토캠핑. 남해 물놀이와 파도 소리.", keyword:["바다","몽돌","물놀이"] },
  { name:"회문산자연휴양림", type:"휴양림", region:"전북 순창", season:"봄·가을", elec:true, hot:true, pet:false, price:"3~4만",
    desc:"숲과 계곡이 어우러진 조용한 힐링 휴양림.", keyword:["숲","계곡","힐링"] },
  { name:"방장산자연휴양림", type:"휴양림", region:"전북 고창", season:"봄·가을", elec:true, hot:true, pet:false, price:"3~4만",
    desc:"고창 방장산 자락의 편백숲 데크. 피톤치드 산책 좋음.", keyword:["편백","숲","산책"] },
  { name:"축령산편백휴양림", type:"휴양림", region:"전남 장성", season:"사계절", elec:true, hot:true, pet:false, price:"3~4만",
    desc:"국내 최대 편백 조림지. 치유의 숲으로 유명.", keyword:["편백","치유","숲"] },
  { name:"나로우주해변 오토캠핑장", type:"오토", region:"전남 고흥", season:"여름·가을", elec:true, hot:true, pet:false, price:"2~3만",
    desc:"우주센터 근처 해변 오토. 별과 바다를 함께 보는 곳.", keyword:["바다","별","해변"] },
  { name:"절물자연휴양림", type:"휴양림", region:"제주", season:"사계절", elec:true, hot:true, pet:false, price:"3~4만",
    desc:"삼나무 숲 야영장. 사려니숲길과 이어져 산책이 좋다.", keyword:["삼나무","숲","제주"] },
  { name:"서귀포자연휴양림", type:"휴양림", region:"제주 서귀포", season:"사계절", elec:true, hot:true, pet:false, price:"3~4만",
    desc:"한라산이 조망되는 편백·삼나무 숲. 안개 감성이 매력.", keyword:["편백","한라산","제주"] },
];

// 크루 활동 방식 / 가치
const CREW = [
  { icon:"🌿", title:"Leave No Trace", desc:"왔던 자리는 왔던 그대로. 흔적 없이 자연을 지키는 게 1원칙." },
  { icon:"🎒", title:"가볍게, 멀리", desc:"무게를 줄일수록 더 멀리, 더 깊이. UL부터 입문까지 함께 배워요." },
  { icon:"🤝", title:"솔캠도 친목도", desc:"혼자만의 고요함도, 함께하는 불멍도. 강요 없이 각자의 속도로." },
  { icon:"📍", title:"섬 · 오지 · 능선", desc:"굴업도 노지부터 선자령 설능까지. 계절마다 새로운 박지로." },
];

// 크루 후기 (실제 멤버 후기로 교체하세요)
const REVIEWS = [
  { name:"준호", spot:"굴업도", when:"2026.05", tag:"솔캠 · UL 파", stars:5, text:"굴업도 첫 백패킹인데 장비 매칭으로 고른 텐트가 딱이었어요. 짐 무게 확 줄었습니다." },
  { name:"세아", spot:"대이작도", when:"2026.06", tag:"친목 · 감성캠", stars:5, text:"자차 없이 갈 수 있는 박지 정리가 최고. 대중교통으로 섬백패킹 다녀왔어요!" },
  { name:"도현", spot:"선자령", when:"2026.01", tag:"오지 · 헤비", stars:4, text:"블프 캘린더 보고 힐레베르그 세일 타이밍 잡음. 겨울 선자령 든든했습니다." },
];

// 초보 체크리스트
const CHECKLIST = [
  "텐트 (박지 계절에 맞게)", "침낭 (내한온도 확인)", "에어매트 (R값 체크)",
  "백패킹 배낭 (40~60L)", "헤드랜턴 + 예비 배터리", "버너·코펠·연료",
  "식수 & 행동식", "보온 의류(레이어링)", "구급킷·상비약", "쓰레기봉투(흔적 남기지 않기)"
];
