// NOCTIS service worker — cache-first for static assets, network-first for HTML.
const VERSION = 'v14';
const STATIC_CACHE = `noctis-static-${VERSION}`;
const RUNTIME_CACHE = `noctis-runtime-${VERSION}`;

const PRECACHE = [
  '/',
  '/index.html',
  '/services.html',
  '/projects.html',
  '/blog.html',
  '/404.html',
  '/style.css',
  '/fonts/inter.css',
  '/favicon.svg',
  '/manifest.webmanifest',
  '/posts.json',
  '/config.json',
  '/feed.xml',
  '/js/i18n.js',
  '/js/theme.js',
  '/js/nav.js',
  '/js/index.js',
  '/js/blog.js',
  '/js/projects.js',
  '/js/analytics.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => ![STATIC_CACHE, RUNTIME_CACHE].includes(k)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Network-first for HTML so the user sees fresh content when online.
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((m) => m || caches.match('/404.html')))
    );
    return;
  }

  // Cache-first for everything else (images, fonts, JS, CSS).
  event.respondWith(
    caches.match(req).then((cached) =>
      cached || fetch(req).then((res) => {
        if (res.ok && (res.type === 'basic' || res.type === 'default')) {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
    )
  );
});
