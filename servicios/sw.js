/* ============================================================
   Service Worker — Mi Negocio (PWA)
   Estrategia: cache-first (precarga de la "app shell").
   La aplicación se guarda en la caché la primera vez que se
   abre, de modo que a partir de entonces funciona totalmente
   sin conexión, incluso abriéndola desde el icono del móvil.
   ============================================================ */

const CACHE_NOMBRE = 'mi-negocio-v1';

// Archivos que componen la "app shell" y que se precargan.
const ARCHIVOS_APP = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  // Fuente externa: se cachea para no depender de internet.
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;900&display=swap'
];

// 1) Instalación: se abre la caché y se guardan los archivos de la app.
self.addEventListener('install', evento => {
  evento.waitUntil(
    caches.open(CACHE_NOMBRE).then(cache => cache.addAll(ARCHIVOS_APP))
  );
  self.skipWaiting();
});

// 2) Activación: se eliminan versiones de caché antiguas.
self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys().then(claves =>
      Promise.all(
        claves.filter(c => c !== CACHE_NOMBRE).map(c => caches.delete(c))
      )
    )
  );
  self.clients.claim();
});

// 3) Peticiones: primero se busca en la caché; si no está, se va a la red.
self.addEventListener('fetch', evento => {
  evento.respondWith(
    caches.match(evento.request).then(respuesta =>
      respuesta || fetch(evento.request)
    )
  );
});
