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
  "Granite Gear":"그래닛기어","Western Mountaineering":"웨스턴마운티니어링","Marmot":"마모트"
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
const TENTS = [];
TENT_MODELS.forEach(m => {
  let [brand, line, w2, season, p2, caps, value, ...tags] = m;
  const vkey = `${brand}|${line}`, ver = VERIFIED[vkey];
  if (ver) { w2 = ver[0]; p2 = ver[1]; }
  const capList = [...String(caps)].map(Number);
  const anchor = capList.includes(2) ? 2 : capList[0];   // 대표 인원(2인 우선)
  capList.forEach(c => {
    const w = +(w2 * _CW[c] / _CW[anchor]).toFixed(2);
    TENTS.push({
      brand, name: `${line} ${c}P`, weight: w, season,
      price: Math.round(p2 * 10000 * (_CP[c] / _CP[anchor]) / 1000) * 1000,
      cap: `${c}인`, wclass: _wc(w), value: !!value, tags,
      verified: !!ver && c === anchor          // 실측 확인 = 대표 인원 카드만
    });
  });
});

// 박지(캠핑 장소) — car: 자차 없이 접근 난이도, type: 섬/캠핑장/오지
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

// 장비 카탈로그 (텐트 외) — 카테고리별. 가격은 만원 단위 대략치.
const GEAR_CATS = ["침낭","매트","배낭","스토브","랜턴"];
const _GEAR_RAW = {
  "침낭":[
    ["Naturehike","CW280 다운 침낭",12,1,"가성비","다운","3계절"],
    ["Naturehike","U350 다운 침낭",20,1,"가성비","동계","다운"],
    ["Sea to Summit","스파크 Sp3",38,0,"경량","다운","3계절"],
    ["Sea to Summit","이스케이프 Ebx",30,0,"합성","결로강함"],
    ["Marmot","트레스레스 30",20,1,"합성","3계절","가성비"],
    ["Mont-bell","다운헐거 800 #3",35,0,"경량","다운"],
    ["Zerogram","미니멀 다운",28,0,"국산","경량"],
    ["Rab","뉴트리노 400",45,0,"동계","고급다운"],
    ["Western Mountaineering","울트라라이트",60,0,"프리미엄","초경량"],
    ["Sea to Summit","베이스캠프 Bt2",25,1,"입문","합성"],
  ],
  "매트":[
    ["Naturehike","에어매트",4,1,"가성비","에어"],
    ["Naturehike","폼 매트",2,1,"초저가","폼"],
    ["Therm-a-Rest","Z라이트 쏠",13,0,"폼","내구성"],
    ["Therm-a-Rest","넴프로라이트",18,0,"경량","3계절"],
    ["Therm-a-Rest","넴프로",28,0,"고R값","동계"],
    ["Exped","울트라 3R",22,0,"경량","에어"],
    ["Sea to Summit","이써 라이트",20,0,"경량","에어"],
    ["NEMO","텐서",24,0,"경량","정숙"],
    ["Klymit","스태틱 V",8,1,"가성비","에어"],
    ["Big Agnes","래틀스네이크 SL",16,0,"에어","3계절"],
  ],
  "배낭":[
    ["Naturehike","로버 55L",9,1,"가성비","55L"],
    ["Osprey","이더 65",32,0,"종주","등판편함"],
    ["Osprey","엑소스 58",28,0,"경량","통기"],
    ["Gregory","바탄 65",33,0,"거주성","종주"],
    ["Deuter","에어컨택트 65+10",25,0,"내구성","등판"],
    ["Hyperlite","2400 사우스웨스트",55,0,"UL","DCF"],
    ["Granite Gear","크라운3 60",32,0,"UL","경량"],
    ["Zerogram","백팩 50L",22,0,"국산","경량"],
    ["Millet","쿨라 60",20,1,"입문","종주"],
    ["Naturehike","65L 대용량",11,1,"가성비","대용량"],
  ],
  "스토브":[
    ["BRS","3000T",2,1,"초경량","가스"],
    ["Fire Maple","FMS-300T",3,1,"가성비","가스"],
    ["MSR","포켓로켓2",7,0,"화력","안정"],
    ["Soto","아미카스",8,0,"내풍","가성비"],
    ["Soto","윈드마스터",12,0,"내풍","정밀"],
    ["MSR","윈드버너",18,0,"일체형","내풍"],
    ["Jetboil","플래시",17,0,"일체형","빠른가열"],
    ["Kovea","알파인마스터",9,1,"국산","동계"],
    ["Trangia","알콜 스토브",4,0,"알콜","정숙"],
    ["Primus","라이트",10,0,"경량","안정"],
  ],
  "랜턴":[
    ["Petzl","티키나",3,1,"입문","경량"],
    ["Petzl","액틱",6,0,"충전","밝기"],
    ["Petzl","스위프트 RL",14,0,"고광량","리액티브"],
    ["Petzl","e+LITE",4,0,"초경량","비상"],
    ["Black Diamond","스팟 400",6,0,"밝기","방수"],
    ["Black Diamond","스톰 400",9,0,"고방수","밝기"],
    ["Ledlenser","MH5",7,0,"충전","컴팩트"],
    ["Naturehike","캠핑 랜턴",3,1,"가성비","캠핑"],
    ["Goal Zero","라이트하우스 미니",8,0,"캠핑","충전"],
    ["Fenix","HM65R",13,0,"고광량","충전"],
  ],
};
const GEAR_ITEMS = {};
GEAR_CATS.forEach(c=>{ GEAR_ITEMS[c] = _GEAR_RAW[c].map(m=>{ const[brand,name,price,value,...tags]=m; return {brand,name,price,value:!!value,tags}; }); });

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
