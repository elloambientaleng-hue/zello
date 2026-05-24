/* ============================================================
   ZELLO AMBIENTAL — Sentry Init (Onda C.1)
   Captura erros JavaScript em produção pra você ter visibilidade
   antes do cliente reclamar.

   COMO USAR:
   1. Crie projeto "Browser JavaScript" em sentry.io
   2. Cole o DSN em SENTRY_DSN abaixo
   3. Deploy normal (Vercel) — pronto

   PRIVACIDADE / LGPD:
   - NÃO envia: CPF, nome, e-mail, conteúdo de forms, valores
     monetários, dados de cliente
   - ENVIA: stack trace do erro, URL (sem query string), navegador,
     papel do usuário (admin/hunter/projetos/cliente — sem identificar
     a pessoa), versão do app
   - O hook beforeSend abaixo sanitiza o payload antes de mandar
   ============================================================ */

(function() {
  'use strict';

  // ====== CONFIGURAÇÃO ======
  // DSN do projeto Sentry "zello" (conta zello-3u.sentry.io)
  // Tecnicamente público (vai pro frontend), mas se vazar muito, pode rotacionar
  // em Sentry → Settings → Client Keys (DSN)
  var SENTRY_DSN = 'https://82b9a1453aef3dcf7b3c97b0dd74293e@o4511445115404288.ingest.us.sentry.io/4511445126086656';

  // Detecta se é painel ou portal (a tag 'app' diferencia no Sentry)
  // Verifica hostname primeiro (preciso e funciona na raiz), depois pathname
  // como fallback. Em localhost, default = painel.
  var APP_TAG = (function() {
    var host = (location.hostname || '').toLowerCase();
    if (host.indexOf('portal') >= 0) return 'portal';
    if (host.indexOf('painel') >= 0) return 'painel';
    var p = (location.pathname || '').toLowerCase();
    if (p.indexOf('cliente') >= 0 || p.indexOf('portal') >= 0) return 'portal';
    if (p.indexOf('painel') >= 0) return 'painel';
    return 'painel'; // default
  })();

  // Versão da app — lê primeiro de <meta name="zello-app-version">
  // (presente no <head>, sempre disponível). Fallback: lê do ?v= dos scripts.
  var APP_VERSION = (function() {
    try {
      var meta = document.querySelector('meta[name="zello-app-version"]');
      if (meta && meta.content) return meta.content;
    } catch(e){}
    try {
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].src || '';
        var m = src.match(/(?:painel|cliente)\.js\?v=([^&"]+)/);
        if (m) return m[1];
      }
    } catch(e){}
    return 'desconhecida';
  })();

  // Se DSN não foi configurado, não carrega Sentry (modo dev)
  if (!SENTRY_DSN || SENTRY_DSN === '__COLAR_DSN_AQUI__') {
    console.warn('[Sentry] DSN não configurado — Sentry desativado. App=' + APP_TAG + ' v=' + APP_VERSION);
    return;
  }

  // Carrega o SDK do Sentry via CDN (loader oficial)
  // NOTA: sem `integrity` por simplicidade. Endurecer com SRI fica pra Onda D.
  var script = document.createElement('script');
  script.src = 'https://browser.sentry-cdn.com/7.119.0/bundle.tracing.min.js';
  script.crossOrigin = 'anonymous';
  script.onload = function() {
    if (!window.Sentry) return;

    try {
      window.Sentry.init({
        dsn: SENTRY_DSN,
        release: APP_TAG + '@' + APP_VERSION,
        environment: (location.hostname.indexOf('localhost') >= 0) ? 'dev' : 'prod',

        // Sampling: 100% dos erros (volume baixo), 0% de performance traces
        // (perf trace ajuda mas inflaciona quota; ativar só se precisar)
        sampleRate: 1.0,
        tracesSampleRate: 0,

        // Ignora ruídos comuns que não são bugs nossos
        ignoreErrors: [
          'ResizeObserver loop limit exceeded',     // Chrome bug benigno
          'ResizeObserver loop completed',           // idem
          'Non-Error promise rejection captured',    // ruído de extensões
          'Network request failed',                  // já tratado no api()
          'NetworkError when attempting to fetch',   // idem
          'Failed to fetch',                         // idem
          /^Script error\.?$/,                       // cross-origin sem CORS (extensões)
          /AbortError/,                              // navegação cancelada
        ],

        // Ignora erros de extensões de navegador
        denyUrls: [
          /extensions\//i,
          /^chrome:\/\//i,
          /^chrome-extension:\/\//i,
          /^moz-extension:\/\//i,
          /^safari-extension:\/\//i,
        ],

        // SANITIZAÇÃO LGPD: remove dados pessoais antes de enviar
        beforeSend: function(event, hint) {
          try {
            // 1. Remove query string da URL (pode ter token, cpf, etc)
            if (event.request && event.request.url) {
              event.request.url = event.request.url.split('?')[0];
            }
            // 2. Remove cookies e headers sensíveis
            if (event.request) {
              delete event.request.cookies;
              if (event.request.headers) {
                delete event.request.headers.Authorization;
                delete event.request.headers.apikey;
                delete event.request.headers['x-supabase-api-version'];
              }
            }
            // 3. Sanitiza a mensagem de erro (remove CPFs, e-mails, tokens-uuid)
            if (event.message) {
              event.message = _sanitizarTexto(event.message);
            }
            if (event.exception && event.exception.values) {
              event.exception.values.forEach(function(ex) {
                if (ex.value) ex.value = _sanitizarTexto(ex.value);
              });
            }
            // 4. Sanitiza breadcrumbs (cliques/navegação antes do erro)
            if (event.breadcrumbs) {
              event.breadcrumbs.forEach(function(b) {
                if (b.message) b.message = _sanitizarTexto(b.message);
                if (b.data && b.data.url) b.data.url = String(b.data.url).split('?')[0];
              });
            }
          } catch(e) {
            // Se a sanitização falhar por algum motivo, derruba o evento
            // em vez de mandar dado não-sanitizado
            return null;
          }
          return event;
        },
      });

      // Adiciona contexto sobre QUAL usuário (sem identificar a pessoa)
      // Lê papel da sessão local — só quem é, não quem.
      try {
        var sess = JSON.parse(localStorage.getItem('z_admin_session') || 'null');
        var cliSess = JSON.parse(localStorage.getItem('z_cli_session') || 'null');
        var papel = 'anonimo';
        if (sess && sess.papel) papel = sess.papel;
        else if (cliSess && cliSess.id) papel = 'cliente';

        window.Sentry.setTag('app', APP_TAG);
        window.Sentry.setTag('papel', papel);
        window.Sentry.setTag('app_version', APP_VERSION);
      } catch(e) {
        window.Sentry.setTag('app', APP_TAG);
        window.Sentry.setTag('app_version', APP_VERSION);
      }

      console.log('[Sentry] OK — capturando erros (' + APP_TAG + ' v=' + APP_VERSION + ')');
    } catch(e) {
      console.warn('[Sentry] init falhou:', e);
    }
  };
  script.onerror = function() {
    console.warn('[Sentry] CDN bloqueada (ad-blocker?) — Sentry desativado');
  };
  document.head.appendChild(script);

  // ====== Helpers internos ======
  function _sanitizarTexto(s) {
    if (typeof s !== 'string') return s;
    return s
      // CPF (3 formatos)
      .replace(/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g, '[CPF]')
      // CNPJ
      .replace(/\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g, '[CNPJ]')
      // E-mail
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/gi, '[EMAIL]')
      // UUID (token de acesso de cliente)
      .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '[UUID]')
      // Telefone BR (11 dígitos, com ou sem máscara)
      .replace(/\(\d{2}\)\s*\d{4,5}-?\d{4}/g, '[TEL]');
  }

})();
