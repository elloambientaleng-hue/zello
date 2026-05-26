/* ============================================================
   ZELLO AMBIENTAL — Service Worker
   v175 — pós-killswitch: volta a cachear normal, mas sem
   bloquear atualizações futuras.

   Estratégia: network-first (busca do servidor; se falhar, cache).
   Isso evita usuários ficarem presos em versões antigas como
   aconteceu na v173.
   ============================================================ */

const CACHE_VERSION = 'zello-v175';
const CACHE_NAME = CACHE_VERSION;

const ARQUIVOS_ESSENCIAIS = [
  '/painel.html',
  '/cliente.html',
  '/manifest-painel.json',
  '/icon-144.png',
  '/icon-192.png',
  '/icon-384.png',
  '/icon-512.png',
];

// Install: pré-cacheia só o mínimo
self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ARQUIVOS_ESSENCIAIS).catch(function(){ /* ignora */ });
    })
  );
});

// Activate: limpa caches velhos + assume controle imediato
self.addEventListener('activate', function(event) {
  event.waitUntil(
    (async function() {
      const keys = await caches.keys();
      await Promise.all(keys.filter(function(k){ return k !== CACHE_NAME; })
        .map(function(k){ return caches.delete(k); }));
      await self.clients.claim();
    })()
  );
});

// Fetch: network-first com fallback pro cache
// Isso garante que atualizações novas SEMPRE sejam pegas do servidor
// (o cache só serve em caso de offline ou erro de rede)
self.addEventListener('fetch', function(event) {
  // Só GET. POST/PUT/DELETE vai direto pra rede.
  if (event.request.method !== 'GET') return;
  // Ignora extensões e chrome:// etc
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then(function(resp) {
        // Se foi bem-sucedida e é do mesmo origin, atualiza o cache
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const respClone = resp.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, respClone).catch(function(){});
          });
        }
        return resp;
      })
      .catch(function() {
        // Rede falhou → tenta cache
        return caches.match(event.request).then(function(cached) {
          return cached || new Response('Offline', { status: 503 });
        });
      })
  );
});
