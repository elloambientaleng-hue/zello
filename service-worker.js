/* ============================================================
   ZELLO AMBIENTAL — Service Worker
   v174 — KILL SWITCH ÚNICO (2026-05-26)

   ATENÇÃO: Esta versão NÃO faz cache. Em vez disso, apaga TODOS os
   caches antigos e se auto-desregistra na 1ª oportunidade. Serve só
   pra destravar usuários presos em versões antigas (cache do SW).

   Próxima versão (v175+) vai voltar a cachear normalmente.
   ============================================================ */

console.log('[Zello SW v174 KILL SWITCH] iniciando — vai apagar caches antigos');

// 1. Ao instalar: assume controle imediatamente, sem esperar
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

// 2. Ao ativar: APAGA TODOS os caches + desregistra a si mesmo
self.addEventListener('activate', function(event) {
  event.waitUntil(
    (async function() {
      // Limpa TODOS os caches (zello-v158, v159, ..., v173)
      const keys = await caches.keys();
      await Promise.all(keys.map(function(k) {
        console.log('[Zello SW] apagando cache:', k);
        return caches.delete(k);
      }));

      // Toma controle de todas as abas abertas
      await self.clients.claim();

      // Manda mensagem pra cada aba forçar reload
      const allClients = await self.clients.matchAll({ type: 'window' });
      allClients.forEach(function(client) {
        try { client.navigate(client.url); } catch(e) { /* alguns navegadores bloqueiam */ }
      });

      // Auto-desregistra após 1s pra dar tempo do reload acontecer
      setTimeout(function() {
        self.registration.unregister().then(function() {
          console.log('[Zello SW v174] desregistrado com sucesso.');
        });
      }, 1000);
    })()
  );
});

// 3. Fetch: SEMPRE busca da rede, NUNCA do cache
self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});
