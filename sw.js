/* 팀아온다 서비스워커 — 오프라인에서도 장비·박지·체크리스트 열람 가능
   ⚠️ 배포 시 index.html의 ?v=N 을 올릴 때 아래 CACHE 버전도 같이 올릴 것 */
const CACHE = 'aonda-v27';
const CORE = [
  '.', 'index.html',
  'data.js?v=27', 'app.js?v=27',
  'manifest.json',
  'assets/hero.jpg',
  'assets/icon-192.png', 'assets/icon-512.png',
  'assets/spots/ridge.jpg', 'assets/spots/island.jpg', 'assets/spots/deck.jpg',
  'assets/spots/meadow.jpg', 'assets/spots/snow.jpg', 'assets/spots/sunrise.jpg',
  'assets/spots/galaxy.jpg', 'assets/spots/grass.jpg',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;                  // 후기 POST 등은 손대지 않음
  const url = new URL(req.url);
  if (req.mode === 'navigate') {                     // 페이지 진입: 네트워크 우선(항상 최신) → 오프라인이면 캐시
    e.respondWith(
      fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; })
        .catch(() => caches.match(req).then(r => r || caches.match('index.html')))
    );
    return;
  }
  if (url.origin === location.origin) {              // 내 리소스: 캐시 우선 + 백그라운드 갱신 (?v= 버전으로 신선도 보장)
    e.respondWith(
      caches.match(req).then(hit => {
        const net = fetch(req).then(r => {
          if (r.ok) { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
          return r;
        }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }
  // 외부(Supabase·지도 타일·CDN): 네트워크 우선(항상 최신 후기) → 오프라인이면 캐시
  e.respondWith(
    fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; })
      .catch(() => caches.match(req))
  );
});
