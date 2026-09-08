/**
 * Service worker LisEng (TanStack Start).
 * Стратегии:
 *  - навигация и /api — только сеть (network-first с offline-страницей для навигации);
 *  - статика (js/css/шрифты/картинки) — stale-while-revalidate.
 * Версию поднимать при изменении логики кэширования.
 */
const VERSION = 'liseng-v2';
const STATIC_CACHE = `${VERSION}-static`;

const isDev =
  self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(['/favicon.ico', '/logo.svg', '/manifest.webmanifest']),
    ),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

const STATIC_RE = /\.(js|css|woff2?|ttf|png|jpe?g|webp|svg|gif|ico)$/;

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || isDev) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // API и auth — всегда сеть
  if (url.pathname.startsWith('/api/')) return;

  // Статика: stale-while-revalidate
  if (STATIC_RE.test(url.pathname)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      }),
    );
    return;
  }

  // Навигация: сеть, при офлайне — последняя закэшированная копия
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match('/');
        }),
    );
  }
});
