/* ============================================================
   ZELLO AMBIENTAL — Service Worker
   v176 — fix: ignora requests cross-origin (cdnjs, fonts, etc).
   Antes interceptava TUDO e quebrava a CSP do próprio SW,
   bloqueando o leitor DOE (que carrega PDF.js de cdnjs).

   Estratégia: network-first SÓ pra recursos do nosso domínio.
   Recursos externos (CDNs, fontes) passam direto pelo browser
   sem o SW atrapalhar.
   ============================================================ */

const CACHE_VERSION = 'zello-v177';
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
// IMPORTANTE v176: só intercepta requests do MESMO ORIGEM.
// Cross-origin (cdnjs, fontes, Supabase, etc) passam direto pelo browser
// — se o SW interceptar, ele faz fetch() e a CSP do próprio worker pode
// bloquear (foi o caso do bug do leitor DOE com pdf.min.js da Cloudflare).
self.addEventListener('fetch', function(event) {
  // Só GET. POST/PUT/DELETE vai direto pra rede.
  if (event.request.method !== 'GET') return;
  // Ignora extensões e chrome:// etc
  if (!event.request.url.startsWith('http')) return;

  // ====================================================
  // FIX v176: SÓ intercepta requests do nosso domínio
  // ====================================================
  // Cross-origin passa direto pelo browser (sem cache, sem proxy do SW).
  // Isso é importante porque:
  //   1. CDNs (cdnjs) bloqueiam CORS pra fetch via SW
  //   2. Supabase tem suas próprias políticas
  //   3. Fontes Google funcionam melhor sem proxy
  var reqUrl;
  try { reqUrl = new URL(event.request.url); } catch(e) { return; }
  if (reqUrl.origin !== self.location.origin) {
    // Cross-origin → NÃO intercepta. Deixa o browser tratar normalmente.
    return;
  }

  // Same-origin → network-first com fallback no cache
  event.respondWith(
    fetch(event.request)
      .then(function(resp) {
        if (resp && resp.status === 200 && resp.type === 'basic') {
          const respClone = resp.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, respClone).catch(function(){});
          });
        }
        return resp;
      })
      .catch(function() {
        return caches.match(event.request).then(function(cached) {
          return cached || new Response('Offline', { status: 503 });
        });
      })
  );
});
