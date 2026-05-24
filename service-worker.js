/* ============================================================
   ZELLO AMBIENTAL — Service Worker
   POST-ONDA 4 (Bloco 4): versionamento de cache + auto-update

   COMO ATUALIZAR O SISTEMA:
   Sempre que subir uma versão nova do painel.js / painel.html,
   incremente o número em CACHE_VERSION abaixo (ex: v18 -> v19).
   Isso força todos os navegadores a baixarem os arquivos novos
   automaticamente — ninguém precisa limpar cache na mão.
   ============================================================ */

const CACHE_VERSION = 'zello-v135';   // <<< INCREMENTE A CADA DEPLOY
const CACHE_NAME = CACHE_VERSION;

// Arquivos que ficam em cache para funcionar offline
const ARQUIVOS_CACHE = [
  '/',
  '/painel.html',
  '/painel.js',
  '/sentry-init.js',
  '/manifest-painel.json',
  '/icon-144.png',
  '/icon-192.png',
  '/icon-384.png',
  '/icon-512.png',
  '/timbrado.js',
  '/cliente.html',
  '/cliente.js',
  '/doe.html',
];

// ----- INSTALAÇÃO: baixa os arquivos para o cache novo -----
self.addEventListener('install', function(event) {
  console.log('[SW] Instalando ' + CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // addAll falha tudo se um arquivo falhar; usamos add individual tolerante
      return Promise.all(
        ARQUIVOS_CACHE.map(function(url) {
          return cache.add(url).catch(function(e) {
            console.warn('[SW] Não cacheou ' + url, e);
          });
        })
      );
    })
  );
  // NÃO chama skipWaiting aqui — espera a mensagem do painel.js
  // (assim o usuário só atualiza quando a página estiver pronta)
});

// ----- ATIVAÇÃO: apaga caches de versões antigas -----
self.addEventListener('activate', function(event) {
  console.log('[SW] Ativando ' + CACHE_VERSION);
  event.waitUntil(
    caches.keys().then(function(nomes) {
      return Promise.all(
        nomes.map(function(nome) {
          if (nome !== CACHE_NAME) {
            console.log('[SW] Removendo cache antigo: ' + nome);
            return caches.delete(nome);
          }
        })
      );
    }).then(function() {
      // Assume o controle de todas as abas abertas imediatamente
      return self.clients.claim();
    })
  );
});

// ----- MENSAGEM: o painel.js pede pra ativar a versão nova -----
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Recebido SKIP_WAITING — ativando versão nova');
    self.skipWaiting();
  }
});

// ----- FETCH: estratégia "network-first" para HTML/JS -----
// HTML e JS sempre tentam a rede primeiro (pra pegar versão nova).
// Se a rede falhar (offline), usa o cache. Outros arquivos: cache-first.
self.addEventListener('fetch', function(event) {
  const req = event.request;
  // Só lida com GET
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // FIX: só intercepta requisições do PRÓPRIO site (mesma origem).
  // Chamadas a outras origens — em especial a API do Supabase — devem
  // passar direto pra rede. Antes, o cache-first do bloco "else" guardava
  // respostas da API e servia dados DESATUALIZADOS (clientes/projetos
  // editados não apareciam até limpar o cache).
  if (url.origin !== self.location.origin) return;

  const ehHtmlOuJs = url.pathname.endsWith('.html') ||
                     url.pathname.endsWith('.js') ||
                     url.pathname === '/';

  if (ehHtmlOuJs) {
    // network-first: tenta rede, cai pro cache se offline
    event.respondWith(
      fetch(req).then(function(resp) {
        // Atualiza o cache com a versão fresca
        const respClone = resp.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(req, respClone).catch(function(){});
        });
        return resp;
      }).catch(function() {
        // Offline: usa o cache
        return caches.match(req).then(function(c) {
          return c || caches.match('/painel.html');
        });
      })
    );
  } else {
    // cache-first para imagens, ícones, etc.
    event.respondWith(
      caches.match(req).then(function(c) {
        return c || fetch(req);
      })
    );
  }
});
