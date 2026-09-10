/**
 * Service worker LisEng (TanStack Start).
 * Стратегии:
 *  - навигация — network-first, при офлайне последняя закэшированная копия
 *    или офлайн-страница /offline.html;
 *  - каталог глаголов (/api/verbs?includeExamples=true без includeProgress) —
 *    cache-first (каталог инертный и user-агностичен);
 *  - остальные /api — только сеть;
 *  - статика (js/css/шрифты/картинки) — stale-while-revalidate.
 * Версию поднимать при изменении логики кэширования.
 */
const VERSION = 'liseng-v3';
const STATIC_CACHE = `${VERSION}-static`;
const API_CACHE = `${VERSION}-api`;

const isDev =
  self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

// App shell: только статичные ресурсы. '/' НЕ прекэшируем —
// для незалогиненного это редирект на /login, застрял бы в кэше.
const PRECACHE_URLS = [
  '/offline.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/logo.svg',
  '/icons/android-chrome-192x192.png',
  '/icons/android-chrome-512x512.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
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

/** Инертный каталог глаголов: user-агностичен, безопасен для cache-first. */
function isVerbCatalogRequest(url) {
  return (
    url.pathname === '/api/verbs' &&
    url.searchParams.get('includeExamples') === 'true' &&
    !url.searchParams.get('includeProgress')
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || isDev) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Каталог глаголов: cache-first, в фоне обновляем
  if (isVerbCatalogRequest(url)) {
    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
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

  // Остальные API и auth — всегда сеть
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

  // Навигация: сеть, при офлайне — последняя закэшированная копия, затем офлайн-страница
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
          return cached || caches.match('/offline.html');
        }),
    );
  }
});

self.addEventListener('push', (event) => {
  let title = 'LisEng';
  let body = 'Сегодня есть план занятий';
  try {
    const data = event.data ? event.data.json() : {};
    title = data.title || title;
    body = data.body || body;
  } catch {
    if (event.data) body = event.data.text();
  }
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icons/android-chrome-192x192.png',
      badge: '/icons/android-chrome-192x192.png',
      data: { url: '/' },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
