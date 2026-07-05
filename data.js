/* ============================================================
   팀아온다 — 데이터 (텐트 / 박지 / 할인정보)
   가격은 2026년 기준 대략치이며 실제 가격은 판매처마다 다릅니다.
   ============================================================ */

// 무게 등급 기준: UL(<1.2kg/인 급, 초경량) / BPL(경량) / 헤비(오토·동계)
// season: 3 = 삼계절, 4 = 사계절(동계)
const TENTS = [
  { name: "네이처하이크 클라우드업 2", brand: "Naturehike", weight: 1.5, season: 3, price: 180000, cap: "1~2인", wclass: "BPL", value: true, tags:["가성비","입문","더블월"] },
  { name: "네이처하이크 몽가 2", brand: "Naturehike", weight: 2.4, season: 3, price: 250000, cap: "2인", wclass: "헤비", value: true, tags:["가성비","거주성","더블월"] },
  { name: "네이처하이크 VIK 1", brand: "Naturehike", weight: 0.98, season: 3, price: 320000, cap: "1인", wclass: "UL", value: true, tags:["가성비","솔캠","싱글월"] },
  { name: "제로그램 올뉴 엘찰텐 프로 2P", brand: "Zerogram", weight: 1.86, season: 3, price: 585000, cap: "2인", wclass: "BPL", value: false, tags:["국산","거주성","더블월"] },
  { name: "제로그램 엘찰텐 제로본 1.5P", brand: "Zerogram", weight: 1.06, season: 3, price: 500000, cap: "1인", wclass: "UL", value: false, tags:["국산","초경량","솔캠"] },
  { name: "빅아그네스 코퍼스퍼 HV UL2", brand: "Big Agnes", weight: 1.36, season: 3, price: 650000, cap: "2인", wclass: "UL", value: false, tags:["거주성","UL","더블월"] },
  { name: "MSR 허바허바 2 (NX)", brand: "MSR", weight: 1.54, season: 3, price: 620000, cap: "2인", wclass: "BPL", value: false, tags:["내구성","밸런스","더블월"] },
  { name: "MSR 프리라이트 2", brand: "MSR", weight: 0.96, season: 3, price: 680000, cap: "2인", wclass: "UL", value: false, tags:["초경량","종주","UL"] },
  { name: "듀랑고 UL 타프텐트", brand: "Durango", weight: 0.65, season: 3, price: 210000, cap: "1인", wclass: "UL", value: true, tags:["가성비","타프","솔캠"] },
  { name: "힐레베르그 알락 2", brand: "Hilleberg", weight: 2.7, season: 4, price: 1650000, cap: "2인", wclass: "헤비", value: false, tags:["동계","4계절","프리스탠딩"] },
  { name: "힐레베르그 날로 3 GT", brand: "Hilleberg", weight: 3.3, season: 4, price: 1850000, cap: "3인", wclass: "헤비", value: false, tags:["동계","거주성","터널형"] },
  { name: "MSR 액세스 2", brand: "MSR", weight: 1.86, season: 4, price: 850000, cap: "2인", wclass: "BPL", value: false, tags:["동계경량","4계절","설산"] },
  { name: "스노우피크 랜드브리즈 Pro.", brand: "Snow Peak", weight: 5.2, season: 3, price: 480000, cap: "3~4인", wclass: "헤비", value: false, tags:["오토캠핑","친목","거실형"] },
];

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
  { name: "국립 자연휴양림(대야산 등)", type: "캠핑장", region: "전국", car: true, difficulty: "하", season: "사계절",
    desc: "데크·화장실·전기 완비. 편하게 백패킹 감성만 즐기기 좋음.", vibe:["친목"], keyword:["편의","입문","가족"] },
  { name: "가리왕산 자연휴양림", type: "캠핑장", region: "강원 정선", car: true, difficulty: "하", season: "사계절",
    desc: "고지대 데크 사이트. 여름 시원, 시설 좋아 친목캠에 최적.", vibe:["친목"], keyword:["데크","여름","시설"] },
  { name: "소무의도", type: "섬", region: "인천 중구", car: false, difficulty: "하", season: "봄·여름·가을",
    desc: "무의도 연결. 둘레길+한적한 노지. 당일~1박 가볍게.", vibe:["솔캠","친목"], keyword:["둘레길","한적","입문"] },
];

// 할인 / 블랙프라이데이 정보 (예시 캘린더 — 매년 유사 패턴)
const DEALS = [
  { period: "1월", title: "겨울 시즌오프", desc: "동계 텐트·침낭 재고소진 할인. 힐레베르그·MSR 동계 라인 노려볼 시즌.", hot:false },
  { period: "3~4월", title: "봄 캠핑 시즌 오픈", desc: "신상 출시 + 이월 특가 공존. 삼계절 텐트 입문 타이밍.", hot:false },
  { period: "6~7월", title: "여름 클리어런스", desc: "네이처하이크 등 가성비 브랜드 상반기 최저가 구간.", hot:false },
  { period: "11월", title: "블랙프라이데이 🔥", desc: "연중 최대 세일. 빅아그네스·MSR·써머레스트 해외직구 최저. 배대지/관세 미리 확인!", hot:true },
  { period: "11월 말", title: "코리안 블프 (11번가·무신사 등)", desc: "국내몰 동시 세일. 제로그램·국산 브랜드 쿠폰 중복 노리기.", hot:true },
  { period: "12월", title: "연말 결산세일", desc: "블프 놓친 재고 추가 인하. 침낭·매트 등 소품 보충 적기.", hot:false },
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
  { name:"준호", tag:"솔캠 · UL 파", stars:5, text:"굴업도 첫 백패킹인데 장비 매칭으로 고른 텐트가 딱이었어요. 짐 무게 확 줄었습니다." },
  { name:"세아", tag:"친목 · 감성캠", stars:5, text:"자차 없이 갈 수 있는 박지 정리가 최고. 대중교통으로 섬백패킹 다녀왔어요!" },
  { name:"도현", tag:"오지 · 헤비", stars:4, text:"블프 캘린더 보고 힐레베르그 세일 타이밍 잡음. 겨울 선자령 든든했습니다." },
];

// 초보 체크리스트
const CHECKLIST = [
  "텐트 (박지 계절에 맞게)", "침낭 (내한온도 확인)", "에어매트 (R값 체크)",
  "백패킹 배낭 (40~60L)", "헤드랜턴 + 예비 배터리", "버너·코펠·연료",
  "식수 & 행동식", "보온 의류(레이어링)", "구급킷·상비약", "쓰레기봉투(흔적 남기지 않기)"
];
