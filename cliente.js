// ============================================================
// FASE 5: MODAL UNIVERSAL — zConfirm / zAlert / zPrompt
// Disponível GLOBALMENTE no window (acessível de qualquer IIFE)
// ============================================================
(function() {
  if (typeof window === 'undefined') return;

  // Guarda refs nativas ANTES de qualquer override
  const _nativeAlert   = window.alert;
  const _nativeConfirm = window.confirm;
  const _nativePrompt  = window.prompt;

  let _zmodalResolver = null;
  let _zmodalKeyHandler = null;

  function _zmodalOpen(opts) {
    return new Promise(function(resolve) {
      const ov = document.getElementById('ov-zmodal');
      const titulo = document.getElementById('zmodal-titulo');
      const msg = document.getElementById('zmodal-mensagem');
      const inputWrap = document.getElementById('zmodal-input-wrap');
      const input = document.getElementById('zmodal-input');
      const btnOk = document.getElementById('zmodal-btn-confirmar');
      const btnCancel = document.getElementById('zmodal-btn-cancelar');

      if (!ov) {
        // Fallback: se modal não existe (carregamento parcial), usa nativos
        console.warn('zmodal não disponível, usando nativo');
        if (opts.modo === 'alert') { _nativeAlert.call(window, opts.mensagem); resolve(true); }
        else if (opts.modo === 'confirm') { resolve(_nativeConfirm.call(window, opts.mensagem)); }
        else if (opts.modo === 'prompt') { resolve(_nativePrompt.call(window, opts.mensagem, opts.defaultValue || '')); }
        return;
      }

      // Reseta classes de tipo
      ov.classList.remove('zmodal-tipo-info','zmodal-tipo-sucesso','zmodal-tipo-erro','zmodal-tipo-aviso','zmodal-modo-alert');
      ov.classList.add('zmodal-tipo-' + (opts.tipo || 'info'));
      if (opts.modo === 'alert') ov.classList.add('zmodal-modo-alert');

      if (titulo) titulo.textContent = opts.titulo || 'Atenção';
      if (msg) msg.textContent = opts.mensagem || '';

      if (opts.modo === 'prompt' && inputWrap) {
        inputWrap.style.display = 'block';
        if (inputWrap.classList) inputWrap.classList.add('show');
        if (input) {
          input.value = opts.defaultValue || '';
          input.type = opts.inputType || 'text';
          input.placeholder = opts.placeholder || '';
          // ONDA SEC-2.7 UI: melhorias UX quando o input é PIN (password)
          //   - teclado numérico no mobile (inputmode)
          //   - limita a 4 dígitos
          //   - centraliza e espaça as bolinhas pra leitura confortável
          if (opts.inputType === 'password') {
            input.setAttribute('inputmode', 'numeric');
            input.setAttribute('pattern', '[0-9]*');
            input.setAttribute('maxlength', '4');
            input.setAttribute('autocomplete', 'one-time-code');
            input.style.textAlign = 'center';
            input.style.letterSpacing = '0.4em';
            input.style.fontSize = '22px';
            input.style.fontFamily = "'DM Mono', monospace";
          } else {
            // Reset pros prompts de texto normal
            input.removeAttribute('inputmode');
            input.removeAttribute('pattern');
            input.removeAttribute('maxlength');
            input.setAttribute('autocomplete', 'off');
            input.style.textAlign = '';
            input.style.letterSpacing = '';
            input.style.fontSize = '';
            input.style.fontFamily = '';
          }
          setTimeout(function(){ try { input.focus(); input.select(); } catch(_) {} }, 50);
        }
      } else {
        if (inputWrap) {
          inputWrap.style.display = 'none';
          if (inputWrap.classList) inputWrap.classList.remove('show');
        }
      }

      // Customizar labels
      if (btnOk) btnOk.textContent = opts.btnOk || (opts.modo === 'alert' ? 'OK' : (opts.modo === 'prompt' ? 'OK' : 'Confirmar'));
      if (btnCancel) btnCancel.textContent = opts.btnCancel || 'Cancelar';

      // Abre
      ov.classList.add('open');

      _zmodalResolver = function(result) {
        // Captura valor do prompt
        let final = result;
        if (opts.modo === 'prompt' && result === true) {
          final = input ? input.value : '';
        } else if (opts.modo === 'prompt' && result === false) {
          final = null;
        }
        ov.classList.remove('open');
        if (_zmodalKeyHandler) {
          document.removeEventListener('keydown', _zmodalKeyHandler);
          _zmodalKeyHandler = null;
        }
        _zmodalResolver = null;
        resolve(final);
      };

      // Suporte ao teclado: ESC cancela, Enter confirma
      _zmodalKeyHandler = function(e) {
        if (!_zmodalResolver) return;
        if (e.key === 'Escape') {
          e.preventDefault();
          _zmodalResolver(opts.modo === 'alert' ? true : false);
        } else if (e.key === 'Enter' && opts.modo !== 'prompt') {
          e.preventDefault();
          _zmodalResolver(true);
        } else if (e.key === 'Enter' && opts.modo === 'prompt' && e.target && e.target.id === 'zmodal-input') {
          e.preventDefault();
          _zmodalResolver(true);
        }
      };
      document.addEventListener('keydown', _zmodalKeyHandler);
    });
  }

  // Função global do botão (HTML chama via onclick)
  window._zmodalAcao = function(ok) {
    if (_zmodalResolver) _zmodalResolver(ok);
  };

  // ============================================================
  // API pública
  // ============================================================

  // zAlert("Mensagem") — só OK, retorna promise (mas geralmente não se espera retorno)
  // zAlert("Mensagem", "sucesso"|"erro"|"aviso"|"info")
  window.zAlert = function(mensagem, tipo) {
    let titulo = 'Atenção';
    let tipoFinal = tipo || 'info';
    // Detecção automática por conteúdo
    if (!tipo) {
      const m = String(mensagem || '');
      if (/^✓|^✅|sucesso|salvo|exclu/i.test(m)) { tipoFinal = 'sucesso'; titulo = 'Sucesso'; }
      else if (/^⚠|^❌|^🚨|erro|inv[áa]lid|falh/i.test(m)) { tipoFinal = 'erro'; titulo = 'Erro'; }
      else if (/^⚠️|^🚫|aten[çc][ãa]o|cuidado/i.test(m)) { tipoFinal = 'aviso'; titulo = 'Atenção'; }
    }
    // Tipo override define título
    if (tipo === 'sucesso') titulo = 'Sucesso';
    else if (tipo === 'erro') titulo = 'Erro';
    else if (tipo === 'aviso') titulo = 'Atenção';
    else if (tipo === 'info') titulo = 'Atenção';

    return _zmodalOpen({
      modo: 'alert',
      tipo: tipoFinal,
      titulo: titulo,
      mensagem: String(mensagem || '')
    });
  };

  // zConfirm("Pergunta?") — retorna Promise<boolean>
  // zConfirm("Pergunta?", { tipo: 'erro', btnOk: 'Excluir' })
  window.zConfirm = function(mensagem, opts) {
    opts = opts || {};
    const m = String(mensagem || '');
    let tipoFinal = opts.tipo || 'info';
    let titulo = opts.titulo || 'Confirmar';
    // Detecção automática
    if (!opts.tipo) {
      if (/exclu|apag|remov|deletar|cancel/i.test(m)) { tipoFinal = 'erro'; titulo = 'Confirmar'; }
      else if (/⚠|aten[çc][ãa]o/i.test(m)) { tipoFinal = 'aviso'; titulo = 'Atenção'; }
    }
    if (opts.titulo) titulo = opts.titulo;
    return _zmodalOpen({
      modo: 'confirm',
      tipo: tipoFinal,
      titulo: titulo,
      mensagem: m,
      btnOk: opts.btnOk,
      btnCancel: opts.btnCancel
    });
  };

  // zPrompt("Pergunta:", "default") — retorna Promise<string|null>
  window.zPrompt = function(mensagem, defaultValue, opts) {
    opts = opts || {};
    return _zmodalOpen({
      modo: 'prompt',
      tipo: opts.tipo || 'info',
      titulo: opts.titulo || 'Informe',
      mensagem: String(mensagem || ''),
      defaultValue: defaultValue || '',
      placeholder: opts.placeholder || '',
      inputType: opts.inputType || 'text',
      btnOk: opts.btnOk || 'OK',
      btnCancel: opts.btnCancel
    });
  };

  // ============================================================
  // OVERRIDE das funções nativas: alert / confirm / prompt
  // - alert: sempre safe (não precisa de retorno síncrono)
  // - confirm: TRUTHY (Promise sempre é truthy). Avisamos no console.
  // - prompt: idem
  //
  // POLÍTICA: substituímos APENAS alert. Confirm/prompt mantêm nativos
  // pra não quebrar código que faz `if (confirm(...))`. Código novo
  // deve usar `await zConfirm(...)` diretamente.
  // ============================================================
  window.alert = function(msg) {
    try {
      window.zAlert(msg);
    } catch(e) {
      console.warn('zAlert falhou, fallback nativo:', e);
      _nativeAlert.call(window, msg);
    }
  };

  // Não sobrescrevemos window.confirm/prompt porque o código existente
  // usa `if (confirm(...))` que quebraria com Promise.

})();

// ============================================================
// IIFE PRINCIPAL DO PORTAL DO CLIENTE
// SEMANA 4.20 FIX: envolve TODO o código numa IIFE pra evitar
// poluição do escopo global, e EXPÕE funções globais via window.X
// ============================================================
(function() {
  // ===========================================================================
  // CONFIGURAÇÃO SUPABASE
  // ===========================================================================
  const SUPABASE_URL = 'https://evxolmfwblxtmudksmnt.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eG9sbWZ3Ymx4dG11ZGtzbW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MzQxNTgsImV4cCI6MjA5MzMxMDE1OH0.v7uvLbz6NJoa4K0_KT9bKm5-M4mVAZ__77Tbqfef9fA';
  const STORAGE_BUCKET = 'documentos-zello';

  // ONDA SEC-2.7 2026-06-10: lista explícita de colunas seguras pra select
  // em `clientes`. NUNCA inclui pin_hash, pin_hash_v2 ou colunas de senha
  // (senhas, senha_orgao, senha_login, senha_portal, senha_portal_obs).
  //
  // Quando o REVOKE SELECT (pin_hash, pin_hash_v2) for aplicado, qualquer
  // `select=*` em clientes retorna 403. Por isso trocamos pra essa lista.
  // Espelha CLIENTE_COLS_RETORNO da Edge Function auth-pin-cliente.
  const CLIENTES_COLS_SAFE = [
    'id', 'nome', 'cpf_cnpj', 'razao_social', 'nome_fantasia', 'telefone1',
    'telefone2', 'telefone_fixo', 'email', 'email_cadastro', 'email_nf',
    'portal_ativo', 'ativo', 'ultimo_acesso', 'criado_em',
    'endereco', 'numero', 'complemento', 'bairro', 'cidade', 'estado', 'cep',
    'endereco_rua', 'endereco_numero', 'endereco_complemento',
    'endereco_bairro', 'endereco_cep', 'endereco_uf',
    'rg', 'orgao_emissor_rg', 'uf_rg', 'data_nascimento', 'nacionalidade',
    'estado_civil', 'regime_bens', 'profissao',
    'conjuge_nome', 'conjuge_cpf', 'conjuge_rg', 'conjuge_profissao',
    'inscricao_estadual', 'inscricao_municipal', 'cnae', 'atividade_principal',
    'capital_social', 'data_abertura', 'enquadramento',
    'status_funil', 'status_lead', 'origem_lead', 'observacoes_lead',
    'nome_contato', 'municipio_atendido', 'data_captura',
    'data_proposta', 'valor_proposta', 'em_renovacao',
    'proposta_assinada_em', 'proposta_assinada_nome',
    'proposta_assinada_obs', 'proposta_assinada_url',
    'hunter_id', 'grupo_id', 'bandeira'
  ].join(',');

  // ===========================================================================
  // ONDA SEC-2.6 2026-06-10 — Login do cliente via Edge Function (segurança)
  // ===========================================================================
  // Antes desta onda, a comparação de PIN era feita NO NAVEGADOR:
  //   1. cliente.js pegava o pin_hash do banco direto via REST
  //   2. comparava com SHA-256(pin_digitado)
  // Problema: o hash trafegava pro browser (qualquer F12 → Network via).
  // Combinado com SHA-256 sem salt (PIN de 4 dígitos), uma rainbow table
  // reverte o hash em segundos — vulnerabilidade real (SEC-001, SEC-002, SEC-003).
  //
  // Agora: cliente.js chama Edge Function `auth-pin-cliente`. Hash nunca sai
  // do servidor. PIN é validado com PBKDF2-SHA256 600k iter (OWASP 2023).
  // Migração SHA-256 → PBKDF2 acontece transparentemente no 1º login OK.
  //
  // FLAG DE FALLBACK: se algo der errado em produção, troque pra `false` e
  // o sistema volta a usar o fluxo antigo (inseguro, mas funcional) até a
  // correção. Deploy de emergência sem precisar reverter código todo.
  // ===========================================================================
  const USAR_EDGE_FUNCTION = true;

  // Helper pra chamar Edge Function. NÃO confundir com api() (que vai pro
  // /rest/v1 do Supabase). apiFunc() chama /functions/v1/<nome>.
  // Retorna { ok, status, json } sempre, mesmo em erro HTTP — pra que o
  // chamador decida como tratar baseado em motivo.
  async function apiFunc(nomeFuncao, corpo) {
    try {
      const r = await fetch(SUPABASE_URL + '/functions/v1/' + nomeFuncao, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(corpo || {})
      });
      let json = null;
      try { json = await r.json(); } catch(_) { json = {}; }
      return { ok: r.ok, status: r.status, json: json };
    } catch (e) {
      console.error('[apiFunc] erro de rede:', nomeFuncao, e);
      return {
        ok: false,
        status: 0,
        json: { erro: 'Sem conexão. Verifique sua internet e tente novamente.' }
      };
    }
  }

  // ===========================================================================
  // ESTADO GLOBAL
  // ===========================================================================
  const LOGO_URL = 'data:image/png;base64,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';

  const state = {
    token: null,
    uso: null,
    cliente: null,
    propriedade: null,
    leituras: [],
    leiturasOrdenadas: [],   // mais recente primeiro
    ultimaLeitura: null,     // leitura mais recente (qualquer mês)
    leiturasNoMes: null,     // leitura no MÊS de referência selecionado
    mesAtual: null,          // YYYY-MM atual (form)
    documentos: [],          // licenças e documentos do cliente
    fotoBlob: null,
    fotoUrl: null,
    enviando: false,
    chart: null,
    // Sessão do cliente
    viaLogin: false,         // true se acessou via login (sem token na URL)
    usosCliente: [],         // todos os usos do cliente quando logado
    usoSelecionadoId: null   // qual uso está sendo visualizado
  };

  // ===========================================================================
  // API HELPER
  // ===========================================================================
  // ONDA C.2: api() com retry inteligente para falhas transitórias.
  // - Retry só em métodos IDEMPOTENTES (GET, PATCH, DELETE). POST não retenta
  //   pra não criar registros duplicados (ex: 2 leituras do mesmo mês).
  // - Retry só em erros de rede ou HTTP 5xx/429. Não retenta em 4xx (erros de
  //   negócio: 401/403/404/409/etc).
  // - Backoff exponencial: 200ms, 600ms, 1500ms (3 tentativas total).
  // - Contrato externo PRESERVADO: GET retorna o JSON ou LANÇA exception; outros
  //   métodos retornam a Response. Código que chama não muda.

  function _apiEhRetryavel(method, statusOuErro) {
    const m = (method || 'GET').toUpperCase();
    if (m === 'POST') return false;
    if (m !== 'GET' && m !== 'PATCH' && m !== 'DELETE' && m !== 'PUT') return false;
    if (typeof statusOuErro === 'number') {
      return statusOuErro >= 500 || statusOuErro === 429;
    }
    if (statusOuErro && statusOuErro.name) {
      if (statusOuErro.name === 'AbortError') return false;
      return true;
    }
    return false;
  }

  function _apiSleep(ms) {
    return new Promise(function(res){ setTimeout(res, ms); });
  }

  async function api(path, method, body, prefer) {
    method = (method || 'GET').toUpperCase();
    const tentativasMax = _apiEhRetryavel(method, 0) ? 3 : 1;
    const delays = [200, 600, 1500];
    let ultimoErro = null;

    for (let tentativa = 1; tentativa <= tentativasMax; tentativa++) {
      try {
        const opts = {
          method: method,
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Content-Type': 'application/json'
          }
        };
        if (prefer) opts.headers['Prefer'] = prefer;
        if (body) opts.body = JSON.stringify(body);
        const r = await fetch(SUPABASE_URL + '/rest/v1/' + path, opts);

        if (!r.ok && _apiEhRetryavel(method, r.status) && tentativa < tentativasMax) {
          console.warn('[api retry] ' + method + ' ' + path + ' HTTP ' + r.status + ' (tentativa ' + tentativa + '/' + tentativasMax + ')');
          const jitter = Math.floor(Math.random() * 100);
          await _apiSleep(delays[tentativa - 1] + jitter);
          continue;
        }

        if (method === 'GET') {
          if (!r.ok) throw new Error('GET ' + path + ' falhou: ' + r.status);
          return await r.json();
        }
        return r;
      } catch(e) {
        ultimoErro = e;
        if (_apiEhRetryavel(method, e) && tentativa < tentativasMax) {
          console.warn('[api retry] ' + method + ' ' + path + ' erro="' + (e.message || e.name) + '" (tentativa ' + tentativa + '/' + tentativasMax + ')');
          const jitter = Math.floor(Math.random() * 100);
          await _apiSleep(delays[tentativa - 1] + jitter);
          continue;
        }
        // Não-retryável OU esgotou tentativas: PROPAGA exception (contrato original)
        throw e;
      }
    }
    // Não deveria chegar aqui — se chegou, propaga último erro
    throw ultimoErro || new Error('api: esgotou tentativas em ' + path);
  }

  async function uploadFoto(blob, ext) {
    const safeExt = (ext || 'jpg').replace(/[^a-z0-9]/gi, '').toLowerCase() || 'jpg';
    const filename = 'leitura-' + state.uso.id.replace(/-/g, '') + '-' + Date.now() + '.' + safeExt;
    const path = 'leituras/' + filename;
    const r = await fetch(SUPABASE_URL + '/storage/v1/object/' + STORAGE_BUCKET + '/' + path, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Content-Type': blob.type || 'image/jpeg'
      },
      body: blob
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      throw new Error('Upload falhou: ' + r.status + ' ' + txt.substring(0, 200));
    }
    return SUPABASE_URL + '/storage/v1/object/public/' + STORAGE_BUCKET + '/' + path;
  }

  // ===========================================================================
  // UTILS
  // ===========================================================================
  function $(id) { return document.getElementById(id); }
  function setState(s) { document.body.dataset.state = s; window.scrollTo(0, 0); }

  function getTokenFromUrl() {
    // Aceita ?token=xxx ou /cliente/xxx ou hash #xxx (compatibilidade)
    const params = new URLSearchParams(window.location.search);
    let t = params.get('token') || params.get('t');
    if (!t) {
      const m = window.location.pathname.match(/\/cliente[\/]([a-zA-Z0-9-]+)\/?$/);
      if (m) t = m[1];
    }
    if (!t && window.location.hash) {
      t = window.location.hash.replace(/^#/, '');
    }
    return t ? t.trim() : null;
  }

  function isValidUUID(str) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  }

  function getMesAtual() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }

  function fmtMes(yyyymm) {
    if (!yyyymm) return '—';
    const [a, m] = yyyymm.split('-');
    const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    return (meses[parseInt(m, 10) - 1] || m) + ' / ' + a;
  }

  function fmtMesCurto(yyyymm) {
    if (!yyyymm) return '—';
    const [a, m] = yyyymm.split('-');
    const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
    return (meses[parseInt(m, 10) - 1] || m) + '/' + a.substring(2);
  }

  function fmtData(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function fmtNum(n) {
    if (n === null || n === undefined || isNaN(n)) return '0,00';
    return Number(n).toFixed(2).replace('.', ',');
  }

  function getAutorizadoMes(uso) {
    if (!uso) return 0;
    const v = parseFloat(uso.vazao_m3h) || 0;
    const h = parseFloat(uso.horas_uso_dia) || 0;
    const d = parseInt(uso.dias_uso_mes, 10) || 0;
    return v * h * d;
  }

  function diasParaPrazo(dataIso) {
    if (!dataIso) return null;
    const d = new Date(dataIso + 'T00:00:00');
    if (isNaN(d.getTime())) return null;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return Math.ceil((d - hoje) / 86400000);
  }

  function getDataVencimento(uso, propriedade) {
    const data = (uso && uso.data_emissao) || (propriedade && propriedade.data_emissao);
    const prazo = (uso && uso.prazo_anos) || (propriedade && propriedade.prazo_anos);
    if (!data || !prazo) return null;
    const d = new Date(data + 'T00:00:00');
    if (isNaN(d.getTime())) return null;
    d.setFullYear(d.getFullYear() + parseInt(prazo, 10));
    return d;
  }

  function statusOutorga(uso, propriedade) {
    const venc = getDataVencimento(uso, propriedade);
    if (!venc) return { cls: '', txt: 'Status indisponível', dias: null };
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dias = Math.ceil((venc - hoje) / 86400000);
    if (dias < 0) return { cls: 'status-vencido', txt: 'VENCIDA há ' + Math.abs(dias) + ' dias', dias };
    if (dias <= 90) return { cls: 'status-critico', txt: 'CRÍTICO - vence em ' + dias + ' dias', dias };
    if (dias <= 180) return { cls: 'status-aviso', txt: 'Vence em ' + Math.ceil(dias/30) + ' meses', dias };
    return { cls: 'status-em-dia', txt: 'EM DIA · ' + Math.ceil(dias/30) + ' meses restantes', dias };
  }

  // ===========================================================================
  // ERRO HELPER
  // ===========================================================================
  function mostrarErro(emoji, titulo, msg) {
    $('err-emoji').textContent = emoji;
    $('err-title').textContent = titulo;
    $('err-msg').textContent = msg;
    setState('erro');
  }

  // ===========================================================================
  // CARREGAMENTO INICIAL
  // ===========================================================================
  // ===========================================================================
  // SESSÃO DO CLIENTE (login via PIN)
  // ===========================================================================
  const CLI_SESSION_KEY = 'z_cli_session';
  const CLI_SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;  // 7 dias

  async function hashSenha(senha) {
    const enc = new TextEncoder().encode(senha);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf))
      .map(function(b){ return b.toString(16).padStart(2, '0'); })
      .join('');
  }

  function getCliSessao() {
    try {
      const raw = localStorage.getItem(CLI_SESSION_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (!s.expires || Date.now() > s.expires) {
        localStorage.removeItem(CLI_SESSION_KEY);
        return null;
      }
      return s;
    } catch (e) { return null; }
  }

  function setCliSessao(cliente) {
    const s = {
      id: cliente.id,
      nome: cliente.nome,
      cpf_cnpj: cliente.cpf_cnpj,
      expires: Date.now() + CLI_SESSION_DURATION
    };
    localStorage.setItem(CLI_SESSION_KEY, JSON.stringify(s));
  }

  function limparCliSessao() {
    localStorage.removeItem(CLI_SESSION_KEY);
  }

  // Máscara de CPF/CNPJ no input
  function mascaraCpfCnpj(input) {
    let v = (input.value || '').replace(/\D/g, '');
    if (v.length > 14) v = v.slice(0, 14);
    if (v.length <= 11) {
      // CPF
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // CNPJ
      v = v.replace(/^(\d{2})(\d)/, '$1.$2');
      v = v.replace(/^(\d{2}\.\d{3})(\d)/, '$1.$2');
      v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
      v = v.replace(/(\d{4})(\d)/, '$1-$2');
    }
    input.value = v;
  }

  // ONDA 110b: Validação módulo 11 de CPF/CNPJ no portal do cliente.
  // Funções idênticas às do painel admin (painel.js, ~linha 1367) — replicadas
  // aqui pra impedir digitação de CPF/CNPJ inválido no login.
  // Valida CPF pelos dígitos verificadores (true se válido).
  function validarCPF(cpf) {
    var c = (cpf||'').replace(/\D/g,'');
    if (c.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(c)) return false; // 11111111111, 22222222222 etc
    var s = 0;
    for (var i = 0; i < 9; i++) s += parseInt(c[i],10) * (10 - i);
    var d1 = 11 - (s % 11); if (d1 >= 10) d1 = 0;
    if (d1 !== parseInt(c[9],10)) return false;
    s = 0;
    for (var j = 0; j < 10; j++) s += parseInt(c[j],10) * (11 - j);
    var d2 = 11 - (s % 11); if (d2 >= 10) d2 = 0;
    return d2 === parseInt(c[10],10);
  }

  // Valida CNPJ pelos dígitos verificadores (true se válido).
  function validarCNPJ(cnpj) {
    var c = (cnpj||'').replace(/\D/g,'');
    if (c.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(c)) return false;
    var pesos1 = [5,4,3,2,9,8,7,6,5,4,3,2];
    var pesos2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];
    var s = 0;
    for (var i = 0; i < 12; i++) s += parseInt(c[i],10) * pesos1[i];
    var d1 = s % 11; d1 = d1 < 2 ? 0 : 11 - d1;
    if (d1 !== parseInt(c[12],10)) return false;
    s = 0;
    for (var j = 0; j < 13; j++) s += parseInt(c[j],10) * pesos2[j];
    var d2 = s % 11; d2 = d2 < 2 ? 0 : 11 - d2;
    return d2 === parseInt(c[13],10);
  }

  // Atalho que valida automaticamente CPF ou CNPJ pelo tamanho
  function validarDocumento(doc) {
    var d = (doc||'').replace(/\D/g,'');
    if (d.length === 11) return validarCPF(d);
    if (d.length === 14) return validarCNPJ(d);
    return false;
  }

  // Submete o formulário de login do cliente (CPF + PIN)
  // SEMANA 4.19: PIN agora é 4 dígitos. Auto-cadastro no 1º acesso: se cliente
  // existe mas não tem PIN, o PIN digitado vira o PIN dele.
  async function doLoginCliente(ev) {
    if (ev) ev.preventDefault();
    const cpf = (document.getElementById('login-cli-cpf').value || '').replace(/\D/g, '');
    const pin = (document.getElementById('login-cli-pin').value || '').trim();
    const erroEl = document.getElementById('login-cli-erro');
    const btn = document.getElementById('login-cli-btn');

    // ONDA 110b: validação completa de CPF/CNPJ (módulo 11) — antes só checava o tamanho
    if (!cpf) {
      erroEl.textContent = 'Digite seu CPF ou CNPJ.';
      erroEl.style.display = 'block';
      return false;
    }
    if (cpf.length !== 11 && cpf.length !== 14) {
      erroEl.textContent = 'CPF deve ter 11 dígitos e CNPJ 14 dígitos. Confira o número.';
      erroEl.style.display = 'block';
      return false;
    }
    if (!validarDocumento(cpf)) {
      erroEl.textContent = (cpf.length === 11 ? 'CPF' : 'CNPJ') + ' inválido — confira os números (o dígito verificador não confere).';
      erroEl.style.display = 'block';
      return false;
    }
    if (!/^\d{4}$/.test(pin)) {
      erroEl.textContent = 'PIN deve ter 4 dígitos numéricos.';
      erroEl.style.display = 'block';
      return false;
    }

    erroEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Entrando...';

    try {
      // ============================================================
      // ONDA SEC-2.6: rota via Edge Function (segurança)
      // ============================================================
      if (USAR_EDGE_FUNCTION) {
        const r = await apiFunc('auth-pin-cliente', {
          acao: 'validar',
          cpf_cnpj: cpf,
          pin: pin
        });
        const j = r.json || {};

        // CASO 1: login bem-sucedido (PIN bcrypt OK ou migração SHA-256 → PBKDF2)
        if (r.ok && j.ok && j.cliente) {
          setCliSessao(j.cliente);
          // ultimo_acesso já é atualizado pela Edge Function — não precisamos chamar de novo
          // verifica LGPD (não bloqueia)
          verificarAceiteLgpd(j.cliente.id).catch(function(e){ console.warn('lgpd check:', e); });
          init();
          return false;
        }

        // CASO 2: cliente sem PIN ainda — precisa OTP por email pro 1º acesso
        // OBS: Edge Function retorna HTTP 200 (não 401) pra esse caso, com
        //      { ok: false, motivo: 'precisa_otp' }. Por isso não checamos r.ok aqui.
        if (j.motivo === 'precisa_otp') {
          // Guarda contexto pra próximas telas
          state._otpCtx = {
            cliente_id: j.cliente_id,
            tem_email: !!j.tem_email,
            email_mascarado: j.email_mascarado || null,
            cpf_original: cpf,
            pin_desejado: pin // o cliente já digitou um PIN, vai virar o novo
          };
          if (!j.tem_email) {
            // Cliente sem email cadastrado: não dá pra fazer OTP por email.
            // Pede pra contatar a Zello.
            erroEl.textContent = 'Primeiro acesso: você ainda não tem email cadastrado conosco. Entre em contato com a Zello pra fazermos o cadastro.';
            erroEl.style.display = 'block';
            return false;
          }
          // Abre tela "Vamos enviar código pro seu email"
          _abrirTelaOtpConfirmacao();
          return false;
        }

        // CASO 3: erros conhecidos (credenciais, portal inativo, etc)
        if (j.erro) {
          erroEl.textContent = j.erro;
        } else if (j.motivo === 'credenciais') {
          erroEl.textContent = 'CPF/CNPJ ou PIN incorretos.';
        } else if (j.motivo === 'portal_inativo') {
          erroEl.textContent = 'Acesso ao portal desativado. Entre em contato com a Zello.';
        } else {
          erroEl.textContent = 'Erro ao validar credenciais. Tente novamente.';
        }
        erroEl.style.display = 'block';
        return false;
      }

      // ============================================================
      // FALLBACK: fluxo antigo (inseguro, só ativado se flag = false)
      // Mantido pra emergência — vide comentário da flag USAR_EDGE_FUNCTION.
      // ============================================================
      const hash = await hashSenha(pin);

      // Tenta encontrar o cliente em diferentes formatos de CPF/CNPJ.
      function formatosCpfCnpj(d) {
        const formatos = new Set();
        formatos.add(d); // Cru: "08572791655"
        if (d.length === 11) {
          // CPF: 000.000.000-00
          formatos.add(d.substr(0,3)+'.'+d.substr(3,3)+'.'+d.substr(6,3)+'-'+d.substr(9,2));
        } else if (d.length === 14) {
          // CNPJ: 00.000.000/0000-00
          formatos.add(d.substr(0,2)+'.'+d.substr(2,3)+'.'+d.substr(5,3)+'/'+d.substr(8,4)+'-'+d.substr(12,2));
        }
        return Array.from(formatos);
      }

      let cliente = null;
      const formatos = formatosCpfCnpj(cpf);
      for (let i = 0; i < formatos.length && !cliente; i++) {
        const list = await api('clientes?cpf_cnpj=eq.' + encodeURIComponent(formatos[i]) + '&select=*');
        if (list && list[0]) cliente = list[0];
      }

      if (!cliente) {
        erroEl.textContent = 'CPF/CNPJ não cadastrado. Entre em contato com a Zello.';
        erroEl.style.display = 'block';
        return false;
      }
      // ONDA F1: só bloqueia se cliente JÁ TINHA PIN e foi desativado depois.
      // Cliente em 1º acesso (sem PIN) NUNCA é bloqueado por portal_ativo,
      // mesmo que esteja false (cenário de cliente importado).
      if (cliente.portal_ativo === false && cliente.pin_hash) {
        erroEl.textContent = 'Acesso ao portal desativado. Entre em contato com a Zello.';
        erroEl.style.display = 'block';
        return false;
      }

      // SEMANA 4.19: AUTO-CADASTRO DE PIN NO 1º ACESSO
      // Se cliente existe mas NÃO tem pin_hash, o PIN digitado vira o PIN dele.
      if (!cliente.pin_hash) {
        // Confirma a criação
        const okCriar = window.confirm(
          '🔐 Primeiro acesso detectado!\n\n' +
          'Vamos cadastrar o PIN "' + pin + '" como seu PIN de acesso.\n\n' +
          '⚠ IMPORTANTE: Memorize este PIN. Você vai precisar dele nos próximos acessos.\n\n' +
          'Quer confirmar?'
        );
        if (!okCriar) {
          erroEl.textContent = 'Cadastro do PIN cancelado.';
          erroEl.style.display = 'block';
          return false;
        }
        // Salva o PIN
        try {
          const r = await api('clientes?id=eq.' + cliente.id, 'PATCH', {
            pin_hash: hash,
            portal_ativo: true
          }, 'return=minimal');
          if (!r || (r.status && r.status >= 400)) {
            throw new Error('Falha ao salvar PIN');
          }
          cliente.pin_hash = hash;
          cliente.portal_ativo = true;
          // Continua o login normalmente abaixo
        } catch(e) {
          console.error('Erro auto-cadastro PIN:', e);
          erroEl.textContent = 'Erro ao cadastrar PIN: ' + (e.message || 'tente novamente');
          erroEl.style.display = 'block';
          return false;
        }
      } else {
        // Cliente JÁ tem PIN — valida
        if (cliente.pin_hash !== hash) {
          erroEl.textContent = 'CPF/CNPJ ou PIN incorretos.';
          erroEl.style.display = 'block';
          return false;
        }
      }

      setCliSessao(cliente);
      // Atualiza ultimo_acesso (não bloqueia)
      api('clientes?id=eq.' + cliente.id, 'PATCH', { ultimo_acesso: new Date().toISOString() }, 'return=minimal').catch(function(){});

      // ONDA 111 (LGPD): verifica se cliente já aceitou o termo. Se não, mostra modal.
      // Não bloqueia o init() — o modal sobrepõe a tela depois.
      verificarAceiteLgpd(cliente.id).catch(function(e){ console.warn('lgpd check:', e); });

      // Recarrega o portal já no modo logado
      init();
      return false;
    } catch (e) {
      erroEl.textContent = 'Erro: ' + (e.message || 'tente novamente');
      erroEl.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Entrar';
    }
    return false;
  }

  // ============================================================
  // ONDA SEC-2.6: telas e funções de OTP (1º acesso)
  // ============================================================
  // Fluxo:
  //   1. Cliente tenta logar sem ter PIN → backend retorna "precisa_otp"
  //   2. _abrirTelaOtpConfirmacao() → mostra email mascarado, botão "Enviar código"
  //   3. _enviarOtp() → chama auth-otp-cliente, vai pra tela de código
  //   4. _abrirTelaOtpCodigo() → form com código (6 dig) + PIN (4 dig)
  //   5. _validarOtpEDefinirPin() → chama auth-otp-cliente, faz login automático

  function _otpEsconderTodas() {
    var ids = ['app-login', 'otp-confirmacao', 'otp-codigo'];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el) el.style.display = 'none';
    }
  }

  function _abrirTelaOtpConfirmacao() {
    if (!state._otpCtx) { console.warn('[otp] contexto perdido'); voltarParaLogin(); return; }
    _otpEsconderTodas();
    var el = document.getElementById('otp-confirmacao');
    if (!el) {
      // Fallback se o HTML não estiver atualizado: mostra alert simples
      alert('Vamos enviar um código de acesso pro email ' + state._otpCtx.email_mascarado + '. Clique OK pra continuar.');
      _enviarOtp();
      return;
    }
    el.style.display = '';
    var emailEl = document.getElementById('otp-conf-email');
    if (emailEl) emailEl.textContent = state._otpCtx.email_mascarado || '(seu email)';
    var erroEl = document.getElementById('otp-conf-erro');
    if (erroEl) erroEl.style.display = 'none';
  }

  async function _enviarOtp() {
    if (!state._otpCtx) { voltarParaLogin(); return; }
    var btnEl = document.getElementById('otp-conf-btn');
    var erroEl = document.getElementById('otp-conf-erro');
    if (btnEl) { btnEl.disabled = true; btnEl.textContent = 'Enviando...'; }
    if (erroEl) erroEl.style.display = 'none';

    const r = await apiFunc('auth-otp-cliente', {
      acao: 'enviar',
      cliente_id: state._otpCtx.cliente_id
    });
    const j = r.json || {};

    if (btnEl) { btnEl.disabled = false; btnEl.textContent = 'Enviar código por email'; }

    if (r.ok && j.ok) {
      // Atualiza email_mascarado (pode vir mais preciso do servidor)
      if (j.email_mascarado) state._otpCtx.email_mascarado = j.email_mascarado;
      _abrirTelaOtpCodigo();
      return;
    }
    // Erros conhecidos
    var msg = j.erro || 'Erro ao enviar o código. Tente novamente.';
    if (j.motivo === 'rate_limit') msg = 'Aguarde 1 minuto antes de pedir outro código.';
    if (j.motivo === 'rate_limit_hora') msg = 'Muitas tentativas. Aguarde 1 hora ou entre em contato com a Zello.';
    if (j.motivo === 'sem_email') msg = 'Você ainda não tem email cadastrado. Entre em contato com a Zello.';
    if (j.motivo === 'ja_tem_pin') msg = 'Você já tem PIN cadastrado. Volte e use o login normal.';
    if (erroEl) {
      erroEl.textContent = msg;
      erroEl.style.display = 'block';
    } else {
      alert(msg);
    }
  }

  function _abrirTelaOtpCodigo() {
    if (!state._otpCtx) { voltarParaLogin(); return; }
    _otpEsconderTodas();
    var el = document.getElementById('otp-codigo');
    if (!el) {
      // Fallback
      var codigo = window.prompt('Digite o código de 6 dígitos que enviamos pra seu email:');
      if (!codigo) { voltarParaLogin(); return; }
      var pin = window.prompt('Crie um PIN de 4 dígitos pra próximos acessos:');
      if (!pin) { voltarParaLogin(); return; }
      _validarOtpEDefinirPin(codigo, pin);
      return;
    }
    el.style.display = '';
    var emailEl = document.getElementById('otp-cod-email');
    if (emailEl) emailEl.textContent = state._otpCtx.email_mascarado || '(seu email)';
    var inputCod = document.getElementById('otp-cod-codigo');
    if (inputCod) { inputCod.value = ''; inputCod.focus(); }
    var inputPin = document.getElementById('otp-cod-pin');
    if (inputPin) inputPin.value = state._otpCtx.pin_desejado || '';
    var erroEl = document.getElementById('otp-cod-erro');
    if (erroEl) erroEl.style.display = 'none';
  }

  async function _validarOtpEDefinirPin(codigoArg, pinArg) {
    if (!state._otpCtx) { voltarParaLogin(); return; }
    var codigo = (codigoArg || (document.getElementById('otp-cod-codigo') || {}).value || '').replace(/\D/g, '');
    var pin = (pinArg || (document.getElementById('otp-cod-pin') || {}).value || '').trim();
    var erroEl = document.getElementById('otp-cod-erro');
    var btnEl = document.getElementById('otp-cod-btn');

    if (!/^\d{6}$/.test(codigo)) {
      if (erroEl) { erroEl.textContent = 'O código tem 6 dígitos.'; erroEl.style.display = 'block'; }
      else alert('O código tem 6 dígitos.');
      return false;
    }
    if (!/^\d{4}$/.test(pin)) {
      if (erroEl) { erroEl.textContent = 'O PIN tem 4 dígitos.'; erroEl.style.display = 'block'; }
      else alert('O PIN tem 4 dígitos.');
      return false;
    }

    if (btnEl) { btnEl.disabled = true; btnEl.textContent = 'Validando...'; }
    if (erroEl) erroEl.style.display = 'none';

    const r = await apiFunc('auth-otp-cliente', {
      acao: 'validar_e_definir',
      cliente_id: state._otpCtx.cliente_id,
      codigo: codigo,
      novo_pin: pin
    });
    const j = r.json || {};

    if (btnEl) { btnEl.disabled = false; btnEl.textContent = 'Confirmar e entrar'; }

    if (r.ok && j.ok && j.cliente) {
      // Login automático
      state._otpCtx = null;
      setCliSessao(j.cliente);
      verificarAceiteLgpd(j.cliente.id).catch(function(e){ console.warn('lgpd check:', e); });
      _otpEsconderTodas();
      init();
      return false;
    }

    var msg = j.erro || 'Não foi possível validar.';
    if (j.motivo === 'codigo_invalido' && typeof j.tentativas_restantes === 'number') {
      if (j.tentativas_restantes > 0) {
        msg = 'Código incorreto. ' + j.tentativas_restantes + ' tentativa(s) restante(s).';
      } else {
        msg = 'Código incorreto. Solicite um novo código.';
      }
    }
    if (j.motivo === 'codigo_expirado') msg = 'Código expirado ou inválido. Solicite um novo.';
    if (j.motivo === 'ja_tem_pin') msg = 'Você já tem PIN cadastrado. Volte e use o login normal.';

    if (erroEl) { erroEl.textContent = msg; erroEl.style.display = 'block'; }
    else alert(msg);
    return false;
  }

  function voltarParaLogin() {
    state._otpCtx = null;
    _otpEsconderTodas();
    var el = document.getElementById('app-login');
    if (el) el.style.display = '';
  }

  // Expor pro HTML
  window._enviarOtp = _enviarOtp;
  window._validarOtpEDefinirPin = _validarOtpEDefinirPin;
  window._abrirTelaOtpCodigo = _abrirTelaOtpCodigo;
  window.voltarParaLogin = voltarParaLogin;

  function doLogoutCliente() {
    if (!confirm('Sair da sua conta?')) return;
    limparCliSessao();
    location.reload();
  }

  // Trocar PIN: cliente faz sozinho enquanto está logado
  // ONDA SEC-2.7 (UI 2026-06-13): usa zPrompt com inputType='password'
  //   pra que os dígitos do PIN não apareçam na tela (eram visíveis com prompt() nativo).
  //   Também troca alert()/confirm() nativos por zAlert/zConfirm pra consistência visual.
  async function abrirTrocarPin() {
    const sess = getCliSessao();
    if (!sess) { await zAlert('Você precisa estar logado pra trocar o PIN.', 'aviso'); return; }

    const opcoesPin = {
      titulo: 'Trocar PIN',
      inputType: 'password',
      placeholder: '••••',
      btnOk: 'Continuar'
    };

    const pinAtual = await zPrompt('Digite seu PIN atual (4 dígitos):', '', opcoesPin);
    if (pinAtual === null) return; // cancelou
    if (!/^\d{4}$/.test(pinAtual)) {
      await zAlert('PIN deve ter exatamente 4 dígitos numéricos.', 'erro');
      return;
    }

    const pinNovo = await zPrompt('Agora digite o NOVO PIN (4 dígitos):', '', opcoesPin);
    if (pinNovo === null) return;
    if (!/^\d{4}$/.test(pinNovo)) {
      await zAlert('PIN deve ter exatamente 4 dígitos numéricos.', 'erro');
      return;
    }
    if (pinNovo === '0000' || pinNovo === '1234' || pinNovo === '1111' || pinNovo === '9999') {
      const okFraco = await zConfirm(
        'Este PIN é muito simples e fácil de adivinhar.\n\nTem certeza que quer usar mesmo assim?',
        { tipo: 'aviso', titulo: 'PIN fraco', btnOk: 'Sim, usar mesmo assim', btnCancel: 'Escolher outro' }
      );
      if (!okFraco) return;
    }

    const conf = await zPrompt('Confirme o NOVO PIN (digite de novo):', '', {
      ...opcoesPin,
      btnOk: 'Confirmar troca'
    });
    if (conf === null) return;
    if (conf !== pinNovo) {
      await zAlert('A confirmação não bate com o PIN novo. Tente de novo.', 'erro');
      return;
    }

    // ONDA SEC-2.7 2026-06-10: rota via Edge Function.
    // Antes: lia pin_hash via REST e comparava no browser (SEC-002).
    // Agora: hash nunca sai do servidor. Edge Function valida PIN atual
    //        e grava PIN novo em pin_hash_v2 (PBKDF2 600k iter).
    try {
      if (USAR_EDGE_FUNCTION) {
        const r = await apiFunc('auth-pin-cliente', {
          acao: 'trocar_pin',
          cliente_id: sess.id,
          pin_atual: pinAtual,
          pin_novo: pinNovo
        });
        const j = r.json || {};

        if (r.ok && j.ok) {
          await zAlert('✅ PIN alterado com sucesso!\n\nNa próxima vez que você fizer login, use o PIN novo.', 'sucesso');
          return;
        }
        // Erros conhecidos da Edge Function
        if (j.motivo === 'pin_atual_incorreto') {
          await zAlert('❌ PIN atual incorreto.\n\nVerifique o PIN que você está usando hoje pra logar.', 'erro');
          return;
        }
        if (j.motivo === 'pin_igual') {
          await zAlert('⚠️ O PIN novo precisa ser diferente do atual.', 'aviso');
          return;
        }
        if (j.motivo === 'sem_pin_atual') {
          await zAlert('Você ainda não tem PIN cadastrado. Saia e faça primeiro acesso pelo email.', 'aviso');
          return;
        }
        if (j.motivo === 'portal_inativo') {
          await zAlert('Acesso ao portal desativado. Entre em contato com a Zello.', 'erro');
          return;
        }
        await zAlert(j.erro || 'Erro ao alterar PIN. Tente novamente.', 'erro');
        return;
      }

      // FALLBACK: fluxo antigo (inseguro, só se USAR_EDGE_FUNCTION=false)
      const hashAtual = await hashSenha(pinAtual);
      const list = await api('clientes?id=eq.' + sess.id + '&select=pin_hash');
      if (!list || !list[0] || list[0].pin_hash !== hashAtual) {
        await zAlert('❌ PIN atual incorreto.', 'erro');
        return;
      }
      const hashNovo = await hashSenha(pinNovo);
      const r = await api('clientes?id=eq.' + sess.id, 'PATCH', { pin_hash: hashNovo }, 'return=minimal');
      if (r && r.ok) {
        await zAlert('✅ PIN alterado com sucesso!\n\nNa próxima vez que você fizer login, use o PIN novo.', 'sucesso');
      } else {
        await zAlert('Erro ao alterar PIN. Tente novamente.', 'erro');
      }
    } catch (e) {
      await zAlert('Erro: ' + (e.message || e), 'erro');
    }
  }

  async function init() {
    setState('loading');

    // === MODO 0: UPLOAD DE DOCUMENTOS DO PROJETO (Fase 2) ===
    const params = new URLSearchParams(window.location.search);
    const uploadToken = params.get('upload');
    if (uploadToken) {
      await carregarUploadPorToken(uploadToken.trim());
      return;
    }

    const token = getTokenFromUrl();

    // === MODO 1: TOKEN NA URL ===
    if (token) {
      if (!isValidUUID(token)) {
        mostrarErro('⚠️', 'Código inválido', 'O código de acesso recebido não está em um formato válido. Solicite um novo link.');
        return;
      }
      state.token = token;
      state.viaLogin = false;
      await carregarPortalPorToken(token);
      return;
    }

    // === MODO 2: SEM TOKEN, VERIFICAR SESSÃO DE LOGIN ===
    const sess = getCliSessao();
    if (sess) {
      state.viaLogin = true;
      await carregarPortalPorCliente(sess.id);
      return;
    }

    // === MODO 3: SEM TOKEN E SEM SESSÃO → MOSTRAR LOGIN ===
    setState('login');
    setTimeout(function(){
      const el = document.getElementById('login-cli-cpf');
      if (el) el.focus();
    }, 100);
  }

  // Carrega o portal a partir de um token (uso específico)
  async function carregarPortalPorToken(token) {
    try {
      const usos = await api('usos?token=eq.' + encodeURIComponent(token) + '&select=*');
      if (!usos || usos.length === 0) {
        mostrarErro('🔒', 'Acesso não localizado', 'Este link não está cadastrado em nosso sistema. Pode ser que o cadastro tenha sido removido ou o link esteja errado.');
        return;
      }
      state.uso = usos[0];

      if (state.uso.ativo === false) {
        mostrarErro('⏸️', 'Ponto inativo', 'Este ponto de captação está marcado como inativo. Entre em contato com a Zello Ambiental.');
        return;
      }

      await finalizarCarregamentoPortal();

      // ONDA A.2: também verifica termo LGPD quando o cliente entra por token.
      // Não bloqueia o portal — o modal aparece sobreposto e tem botão "Mais tarde".
      if (state.uso && state.uso.cliente_id) {
        verificarAceiteLgpd(state.uso.cliente_id).catch(function(e){ console.warn('lgpd check (token):', e); });
      }
    } catch (e) {
      console.error(e);
      mostrarErro('🌐', 'Erro de conexão', 'Não foi possível carregar seus dados. Verifique sua internet e tente novamente.');
    }
  }

  // Carrega o portal a partir de um cliente_id (login via PIN)
  // SEMANA 4.19 FIX: Aceita usos sem `ativo` definido (NULL conta como ativo).
  // E se o cliente tem projeto mas não tem usos, mostra tela de upload de docs.
  // SEMANA 4.21 FIX: Valida que o cliente AINDA existe no banco. Se foi excluído
  // (sessão fantasma), limpa o localStorage e manda pro login.
  async function carregarPortalPorCliente(clienteId) {
    try {
      // SEMANA 4.21: PRIMEIRO valida que o cliente ainda existe no banco
      const clienteCheck = await api('clientes?id=eq.' + clienteId + '&select=id,nome,ativo,portal_ativo');
      if (!clienteCheck || clienteCheck.length === 0) {
        console.warn('[portal] Sessão fantasma detectada: cliente_id=' + clienteId + ' não existe mais no banco. Limpando sessão.');
        limparCliSessao();
        setState('login');
        setTimeout(function(){
          const el = document.getElementById('login-cli-cpf');
          if (el) el.focus();
          // Avisa o usuário
          const erroEl = document.getElementById('login-cli-erro');
          if (erroEl) {
            erroEl.textContent = '⚠️ Sua sessão expirou ou seu cadastro foi atualizado. Faça login novamente.';
            erroEl.style.display = 'block';
          }
        }, 100);
        return;
      }
      // Se cliente foi desativado (ativo=false ou portal_ativo=false), também limpa sessão
      if (clienteCheck[0].ativo === false || clienteCheck[0].portal_ativo === false) {
        console.warn('[portal] Cliente desativado. Limpando sessão.');
        limparCliSessao();
        mostrarErro('🚫', 'Acesso desativado', 'Seu acesso ao portal foi desativado. Entre em contato com a Zello Ambiental.');
        return;
      }

      // FIX: filtra só usos EXPLICITAMENTE inativos (ativo=false)
      // Antes filtrava ativo=eq.true que NÃO pega registros com ativo=null
      // v58: grupo econômico — qualquer CNPJ do grupo vê TUDO do grupo.
      var idsGrupo = [clienteId];
      var mapaEmpresas = {};
      var mapaDoc = {};
      try {
        var infoCli = await api('clientes?id=eq.' + clienteId + '&select=grupo_id,nome,cpf_cnpj');
        if (infoCli && infoCli[0]) {
          mapaEmpresas[clienteId] = infoCli[0].nome || '';
          mapaDoc[clienteId] = infoCli[0].cpf_cnpj || '';
          var gid = infoCli[0].grupo_id;
          if (gid) {
            var irmaos = await api('clientes?grupo_id=eq.' + gid + '&or=(ativo.eq.true,ativo.is.null)&select=id,nome,cpf_cnpj');
            if (irmaos && irmaos.length) {
              idsGrupo = [];
              irmaos.forEach(function(c){ idsGrupo.push(c.id); mapaEmpresas[c.id] = c.nome || ''; mapaDoc[c.id] = c.cpf_cnpj || ''; });
              if (idsGrupo.indexOf(clienteId) === -1) idsGrupo.push(clienteId);
            }
          }
        }
      } catch (e) { console.warn('[portal] lookup de grupo falhou, usando só o cliente:', e); }
      state.gruposEmpresasNomes = mapaEmpresas;
      state.gruposEmpresasDoc = mapaDoc;

      var _filtroCli = (idsGrupo.length > 1) ? 'cliente_id=in.(' + idsGrupo.join(',') + ')' : 'cliente_id=eq.' + clienteId;
      const usos = await api('usos?' + _filtroCli + '&or=(ativo.eq.true,ativo.is.null)&select=*');
      console.log('[portal] grupo=' + idsGrupo.length + ' empresa(s), usos encontrados:', (usos||[]).length);

      // BUSCA TAMBÉM projetos do grupo (pra mostrar opção de upload se tiver)
      let projetos = [];
      try {
        projetos = await api('projetos?' + _filtroCli + '&status=eq.em_andamento&select=*&order=criado_em.desc');
        console.log('[portal] projetos em andamento:', (projetos||[]).length);
      } catch(e) { console.warn('Erro buscando projetos:', e); }

      // CENÁRIO 1: tem usos cadastrados → fluxo normal de portal (leituras + outorgas)
      if (usos && usos.length > 0) {
        state.usosCliente = usos;
        // v59: carrega as propriedades do grupo (pra aba Outorgas agrupar por unidade)
        try {
          var _pids = [];
          usos.forEach(function(u){ if (u.propriedade_id && _pids.indexOf(u.propriedade_id) === -1) _pids.push(u.propriedade_id); });
          var _mapaProps = {};
          if (_pids.length) {
            var _propsGrupo = await api('propriedades?id=in.(' + _pids.join(',') + ')&select=*');
            (_propsGrupo || []).forEach(function(pp){ _mapaProps[pp.id] = pp; });
          }
          state.propriedadesGrupo = _mapaProps;
        } catch (e) { console.warn('[portal] props do grupo falhou:', e); state.propriedadesGrupo = {}; }
        state.projetosCliente = projetos || [];
        // Se selecionou um uso antes (via seletor), respeita; senão usa o primeiro
        const usoIdEscolhido = state.usoSelecionadoId || usos[0].id;
        state.uso = usos.find(function(u){ return u.id === usoIdEscolhido; }) || usos[0];
        state.usoSelecionadoId = state.uso.id;
        await finalizarCarregamentoPortal();
        return;
      }

      // CENÁRIO 2: tem projetos ativos mas não tem usos → mostra link de upload
      if (projetos && projetos.length > 0) {
        const proj = projetos[0];
        if (proj.upload_token) {
          // Auto-redireciona pra tela de upload
          state.token = null;
          await carregarUploadPorToken(proj.upload_token);
          return;
        }
        // Sem upload_token — mostra mensagem informativa
        mostrarErro('📋', 'Projeto em andamento',
          'Você tem um projeto em andamento (' + (proj.nome || '—') + ').\n\n' +
          'Os pontos de captação ainda estão sendo cadastrados pela equipe.\n' +
          'Entre em contato pra receber o link de envio de documentos.');
        return;
      }

      // CENÁRIO 3: nada cadastrado mesmo
      mostrarErro('⚠️', 'Sem pontos cadastrados',
        'Não encontramos pontos de captação cadastrados em sua conta.\n\n' +
        'Se acabou de contratar a Zello, aguarde o cadastro dos pontos.\n' +
        'Se já é cliente, entre em contato pra verificar.');
    } catch (e) {
      console.error('[portal] erro carregarPortalPorCliente:', e);
      mostrarErro('🌐', 'Erro de conexão', 'Não foi possível carregar seus dados. Verifique sua internet e tente novamente.');
    }
  }

  async function finalizarCarregamentoPortal() {
    // Busca cliente, propriedade, leituras e documentos em paralelo
    const filtrosDocs = ['cliente_id=eq.' + state.uso.cliente_id];
    if (state.uso.propriedade_id) filtrosDocs.push('propriedade_id=eq.' + state.uso.propriedade_id);
    filtrosDocs.push('uso_id=eq.' + state.uso.id);
    const orFilter = 'or=(' + filtrosDocs.map(function(f){return f.replace('=', '.');}).join(',') + ')';

    const [clientes, props, leituras, docsResult] = await Promise.all([
      api('clientes?id=eq.' + state.uso.cliente_id + '&select=' + CLIENTES_COLS_SAFE),
      state.uso.propriedade_id ? api('propriedades?id=eq.' + state.uso.propriedade_id + '&select=*') : Promise.resolve([]),
      api('leituras?uso_id=eq.' + state.uso.id + '&select=*&order=mes_referencia.desc&limit=24'),
      api('documentos?' + orFilter + '&visivel_cliente=eq.true&select=*&order=data_vencimento.asc').catch(function(){ return []; })
    ]);

    state.cliente = (clientes && clientes[0]) || null;
    state.propriedade = (props && props[0]) || null;
    state.leituras = leituras || [];
    state.documentos = (docsResult || []).filter(function(d){ return d.ativo !== false; });
    state.leiturasOrdenadas = state.leituras.slice().sort(function(a,b){
      return (b.mes_referencia || '').localeCompare(a.mes_referencia || '');
    });
    state.ultimaLeitura = state.leiturasOrdenadas[0] || null;

    if (!state.cliente) {
      mostrarErro('⚠️', 'Cliente não encontrado', 'Não conseguimos localizar os dados do cliente.');
      return;
    }

    renderHeader();
    renderLeituraTab();
    renderOutorgasTab();
    renderDocumentosTab();
    renderHistoricoTab();

    // v63: na 1ª carga, abre em Outorgas (login) ou Leitura (token). Trocar de ponto
    // não reabre a aba — só a primeira entrada define a aba inicial.
    if (!state._jaAbriuAba) {
      state._jaAbriuAba = true;
      var _abaIni = state.viaLogin ? 'outorgas' : 'leitura';
      // v67: se não há leitura aplicável, não abre na Leitura (que estará escondida)
      if (_abaIni === 'leitura' && !_clienteRequerLeitura()) _abaIni = 'outorgas';
      try { trocarTab(_abaIni); } catch (_) {}
    }

    setState('portal');
  }

  // Trocar uso (chamado quando cliente logado tem múltiplos usos)
  function trocarUso(usoId) {
    state.usoSelecionadoId = usoId;
    setState('loading');
    carregarPortalPorCliente(state.cliente.id);
  }

  // ===========================================================================
  // RENDER: HEADER (cliente)
  // ===========================================================================
  // v67: um cliente "requer leitura" se ao menos um ponto tem hidrômetro E
  // relatório de vazão marcado (mesma regra do painel). Se nenhum requer, some a aba Leitura.
  function _clienteRequerLeitura() {
    var lista = (state.usosCliente && state.usosCliente.length) ? state.usosCliente : (state.uso ? [state.uso] : []);
    return lista.some(function(u){ return u && u.possui_hidrometro === true && u.requer_relatorio_vazao === true; });
  }

  function renderHeader() {
    $('cli-nome').textContent = (state.cliente && state.cliente.nome) || '—';
    const propNome = state.propriedade ? state.propriedade.nome : '';
    const propLoc = state.propriedade && state.propriedade.cidade
      ? state.propriedade.cidade + (state.propriedade.estado ? '/' + state.propriedade.estado : '')
      : '';
    $('cli-prop').textContent = [propNome, propLoc].filter(Boolean).join(' · ') || '—';
    const desc = state.uso.descricao || 'Ponto de captação';
    const serie = state.uso.numero_serie ? ' · Hidrômetro ' + state.uso.numero_serie : '';
    $('cli-ponto').textContent = '📍 ' + desc + serie;
    // v69/v70: logado o portal é multi-ponto (abre em Outorgas e o ponto é escolhido
    // dentro da Leitura), então some a linha do ponto E da propriedade no topo,
    // deixando só o nome do cliente. No acesso por link (token, um ponto só) permanecem.
    var _elPonto = document.getElementById('cli-ponto');
    var _elProp = document.getElementById('cli-prop');
    if (_elPonto) _elPonto.style.display = state.viaLogin ? 'none' : '';
    if (_elProp) _elProp.style.display = state.viaLogin ? 'none' : '';

    // Seletor de uso: só quando logado E há múltiplos usos.
    // v64: pode existir em vários lugares (Leitura, Documentos) — usa CLASSE.
    var _seletorWraps = document.querySelectorAll('.cli-seletor-uso');
    if (state.viaLogin && state.usosCliente && state.usosCliente.length > 1) {
      var _propsSel = state.propriedadesGrupo || {};
      var _opts = state.usosCliente.map(function(u){
        var _prop = _propsSel[u.propriedade_id];
        var _pref = (_prop && _prop.nome) ? _prop.nome + ' · ' : '';
        return '<option value="' + u.id + '"' + (u.id === state.uso.id ? ' selected' : '') + '>'
          + _pref + (u.descricao || 'Ponto') + (u.numero_serie ? ' (' + u.numero_serie + ')' : '')
          + '</option>';
      }).join('');
      document.querySelectorAll('.cli-uso-select').forEach(function(sel){ sel.innerHTML = _opts; sel.value = state.uso.id; });
      _seletorWraps.forEach(function(w){ w.style.display = 'block'; });
    } else {
      _seletorWraps.forEach(function(w){ w.style.display = 'none'; });
    }

    // Botões de ação (Acessar conta completa / Trocar PIN / Sair)
    const acoes = $('cli-acoes');
    // v66: botão "Criar nova senha" na aba Meus Dados só aparece logado por PIN
    var _novaSenhaWrap = document.getElementById('lgpd-nova-senha-wrap');
    if (_novaSenhaWrap) _novaSenhaWrap.style.display = state.viaLogin ? 'block' : 'none';
    // v67: esconde a aba Leitura quando nenhum ponto do cliente requer leitura
    var _btnLeitura = document.querySelector('.tab[data-tab="leitura"]');
    if (_btnLeitura) _btnLeitura.style.display = _clienteRequerLeitura() ? '' : 'none';
    if (state.viaLogin) {
      // Logado: botões "Trocar PIN" e "Sair"
      acoes.innerHTML =
        '<button class="btn btn-secondary btn-sm" onclick="abrirTrocarPin()" style="font-size:12px;padding:6px 12px;">🔑 Trocar PIN</button>'
        + '<button class="btn btn-secondary btn-sm" onclick="doLogoutCliente()" style="font-size:12px;padding:6px 12px;">↪ Sair da conta</button>';
      acoes.style.display = 'flex';
    } else if (state.cliente) {
      // Veio por token: oferece acesso à conta completa.
      // ONDA SEC-2.7: antes checava state.cliente.pin_hash (vulnerável,
      // exposto via REST). Agora não temos mais essa info no front, então
      // sempre oferece — clique vai pra tela de login, que sabe decidir
      // (PIN existente vs 1º acesso via OTP).
      acoes.innerHTML = '<button class="btn btn-secondary btn-sm" onclick="setState(\'login\')" style="font-size:12px;padding:6px 12px;">🔐 Acessar conta completa</button>';
      acoes.style.display = 'flex';
    } else {
      acoes.style.display = 'none';
    }
  }

  // ===========================================================================
  // RENDER: LEITURA
  // ===========================================================================
  function renderLeituraTab() {
    state.mesAtual = getMesAtual();
    $('mes-ref').value = state.mesAtual;
    // Permite escolher mês anterior também (se cliente esqueceu mês passado)
    $('mes-ref').max = state.mesAtual;

    // FIX 2026-05-29: mostra a foto do hidrômetro (cadastrada pelo admin no painel)
    // como referência visual pro cliente saber QUAL hidrômetro ler. Aparece só se
    // o ponto tem foto cadastrada (campo foto_equipamento_url da tabela usos).
    const boxFoto = $('foto-ref-equipamento');
    const imgFoto = $('foto-ref-img');
    const linkFoto = $('foto-ref-link');
    if (boxFoto && imgFoto && linkFoto) {
      const fotoUrl = state.uso && state.uso.foto_equipamento_url;
      if (fotoUrl) {
        imgFoto.src = fotoUrl;
        linkFoto.href = fotoUrl;
        boxFoto.style.display = 'block';
      } else {
        imgFoto.src = '';
        linkFoto.href = '#';
        boxFoto.style.display = 'none';
      }
    }

    atualizarLeituraAnterior();
    atualizarConsumo();
  }

  function atualizarLeituraAnterior() {
    const mesSelecionado = $('mes-ref').value || getMesAtual();

    // Verifica se já existe leitura pra esse mês
    state.leiturasNoMes = state.leiturasOrdenadas.find(function(l){
      return l.mes_referencia === mesSelecionado;
    }) || null;

    // Verifica leitura imediatamente anterior ao mês selecionado
    const anteriores = state.leiturasOrdenadas.filter(function(l){
      return (l.mes_referencia || '') < mesSelecionado;
    });
    const leituraAnt = anteriores[0] || null;
    // v71: primeira leitura do ponto = marco zero (não há consumo a calcular ainda)
    state.ehLeituraInicial = (anteriores.length === 0);

    // Se há leitura no mês, preenche os campos com valores existentes (modo edição)
    if (state.leiturasNoMes) {
      $('leitura-anterior').value = state.leiturasNoMes.leitura_anterior || 0;
      $('leitura-atual').value = state.leiturasNoMes.leitura_atual || '';
      $('observacao').value = state.leiturasNoMes.observacao || '';
      $('aviso-duplicada').style.display = 'flex';
      $('btn-enviar-texto').textContent = '🔄 Substituir leitura';
    } else {
      $('leitura-anterior').value = leituraAnt ? (leituraAnt.leitura_atual || 0) : 0;
      $('leitura-atual').value = '';
      $('aviso-duplicada').style.display = 'none';
      $('btn-enviar-texto').textContent = '📤 Enviar leitura';
    }

    // FIX 2026-05-28 (#1): trava do dia 15 — feedback visual.
    // Se o mês selecionado é o corrente E hoje passou do dia 15, mostra aviso
    // e desabilita o botão (o envio também é bloqueado em enviarLeitura).
    const DIA_LIMITE_LEITURA = 15;
    const avisoPrazo = $('aviso-prazo');
    const btnEnviar = $('btn-enviar');
    const prazoEncerrado = (mesSelecionado === getMesAtual()) && (new Date().getDate() > DIA_LIMITE_LEITURA);
    if (avisoPrazo) avisoPrazo.style.display = prazoEncerrado ? 'flex' : 'none';
    if (btnEnviar) {
      btnEnviar.disabled = prazoEncerrado;
      btnEnviar.style.opacity = prazoEncerrado ? '0.5' : '';
      btnEnviar.style.cursor = prazoEncerrado ? 'not-allowed' : '';
    }

    atualizarConsumo();
  }

  function atualizarConsumo() {
    const ant = parseFloat($('leitura-anterior').value) || 0;
    const atu = parseFloat($('leitura-atual').value);
    const display = $('consumo-display');
    const elValor = $('consumo-valor');
    const elInfo = $('consumo-info');

    if (isNaN(atu) || atu === '') {
      elValor.textContent = '0,00';
      elInfo.textContent = 'Informe a leitura atual';
      display.classList.remove('acima');
      return;
    }

    // v71: primeira leitura = marco zero. Não calcula consumo nem alerta de vazão.
    if (state.ehLeituraInicial) {
      elValor.textContent = fmtNum(atu);
      elInfo.innerHTML = '<span style="color:#1E40AF;font-weight:600;">📍 Leitura inicial (marco zero)</span><br><span style="font-size:11px;color:#64748b;">Não há consumo a calcular ainda — a vazão passa a ser medida a partir da próxima leitura.</span>';
      display.classList.remove('acima');
      return;
    }

    if (atu < ant) {
      elValor.textContent = '?';
      elInfo.innerHTML = '<span style="color:var(--red);font-weight:600;">⚠️ Leitura atual menor que a anterior</span>';
      display.classList.remove('acima');
      return;
    }

    const consumo = atu - ant;
    elValor.textContent = fmtNum(consumo);

    const aut = getAutorizadoMes(state.uso);
    if (aut > 0) {
      const pct = (consumo / aut * 100);
      if (consumo > aut) {
        elInfo.innerHTML = '<strong>' + pct.toFixed(0) + '%</strong> do autorizado · ⚠️ Acima do limite (' + fmtNum(aut) + ' m³)';
        display.classList.add('acima');
      } else {
        elInfo.textContent = pct.toFixed(0) + '% do autorizado (limite: ' + fmtNum(aut) + ' m³)';
        display.classList.remove('acima');
      }
    } else {
      elInfo.textContent = 'Calculado automaticamente';
      display.classList.remove('acima');
    }
  }

  // ===========================================================================
  // RENDER: OUTORGA
  // ===========================================================================
  // ===========================================================================
  // RENDER: DOCUMENTOS (licenças e certificados do cliente)
  // ===========================================================================

  // Tipos de documentos com cores e ícones (precisa bater com o painel admin)
  const TIPOS_DOC = {
    OUTORGA:    { label: 'Outorga (DAEE/ANA)',          icone: '💧', cor: '#1565C0', bg: '#E3F2FD' },
    CAR:        { label: 'CAR — Cadastro Ambiental',    icone: '🌳', cor: '#2E7D32', bg: '#E8F5E9' },
    CETESB:     { label: 'CETESB',                      icone: '🏭', cor: '#E65100', bg: '#FFF3E0' },
    DCAA:       { label: 'DCAA',                        icone: '📄', cor: '#6A1B9A', bg: '#F3E5F5' },
    CADRI:      { label: 'CADRI',                       icone: '♻️', cor: '#558B2F', bg: '#F1F8E9' },
    PREFEITURA: { label: 'Alvará da Prefeitura',        icone: '🏛️', cor: '#5D4037', bg: '#EFEBE9' },
    CCIR:       { label: 'CCIR — INCRA',                icone: '📋', cor: '#00695C', bg: '#E0F2F1' },
    ITR:        { label: 'ITR — Receita Federal',       icone: '💰', cor: '#827717', bg: '#F9FBE7' },
    BOMBEIROS:  { label: 'AVCB — Bombeiros',            icone: '🔥', cor: '#C62828', bg: '#FFEBEE' },
    IPHAN:      { label: 'IPHAN',                       icone: '🏺', cor: '#4527A0', bg: '#EDE7F6' },
    DAEE:       { label: 'Documento DAEE',              icone: '🌊', cor: '#0277BD', bg: '#E1F5FE' },
    ANA:        { label: 'Documento ANA',               icone: '💦', cor: '#01579B', bg: '#E0F7FA' },
    IBAMA:      { label: 'Licença IBAMA',               icone: '🦜', cor: '#33691E', bg: '#DCEDC8' },
    OUTRO:      { label: 'Outro documento',             icone: '📎', cor: '#455A64', bg: '#ECEFF1' }
  };

  function getTipoDocCli(id) {
    return TIPOS_DOC[id] || TIPOS_DOC.OUTRO;
  }

  function statusDocCli(doc) {
    if (!doc.data_vencimento) {
      return { txt: 'Sem prazo', cor: '#6b7280', bg: '#f3f4f6', dias: null, severidade: 0 };
    }
    const venc = new Date(doc.data_vencimento + 'T00:00:00');
    if (isNaN(venc.getTime())) return { txt: 'Sem prazo', cor: '#6b7280', bg: '#f3f4f6', dias: null, severidade: 0 };
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    const dias = Math.ceil((venc - hoje) / 86400000);
    if (dias < 0)    return { txt: 'Vencido há ' + Math.abs(dias) + ' dias', cor: '#C62828', bg: '#FFEBEE', dias, severidade: 4 };
    if (dias <= 30)  return { txt: 'Vence em ' + dias + ' dias',  cor: '#C62828', bg: '#FFEBEE', dias, severidade: 3 };
    if (dias <= 90)  return { txt: 'Vence em ' + dias + ' dias',  cor: '#E65100', bg: '#FFF3E0', dias, severidade: 2 };
    if (dias <= 180) return { txt: 'Vence em ' + Math.ceil(dias/30) + ' meses',  cor: '#F57F17', bg: '#FFF8E1', dias, severidade: 1 };
    return { txt: 'Em dia · ' + Math.ceil(dias/30) + ' meses', cor: '#2E7D32', bg: '#E8F5E9', dias, severidade: 0 };
  }

  function escapeHtmlCli(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  }

  function renderDocumentosTab() {
    const u = state.uso;
    const p = state.propriedade;

    // Card de resumo do uso (vazão autorizada, hidrômetro)
    const aut = getAutorizadoMes(u);
    const infoUso = [];
    if (aut > 0) infoUso.push({ label: 'Vazão autorizada', valor: fmtNum(aut) + ' m³/mês', full: true });
    if (u.numero_serie) infoUso.push({ label: 'Hidrômetro', valor: u.numero_serie });
    if (u.tipo_outorga) infoUso.push({ label: 'Tipo de uso', valor: u.tipo_outorga });

    if (infoUso.length) {
      $('docs-resumo-card').style.display = 'block';
      $('docs-info-uso').innerHTML = infoUso.map(function(it){
        return '<div class="outorga-stat' + (it.full ? ' full' : '') + '">'
          + '<div class="outorga-stat-label">' + it.label + '</div>'
          + '<div class="outorga-stat-valor">' + escapeHtmlCli(it.valor) + '</div>'
          + '</div>';
      }).join('');
    } else {
      $('docs-resumo-card').style.display = 'none';
    }

    // Reúne lista de documentos: tabela `documentos` + outorga "antiga" do uso (se ainda existir)
    let listaDocs = (state.documentos || []).slice();

    // Compatibilidade: se o uso tem outorga_pdf_url e NÃO existe um documento OUTORGA no banco vinculado a esse uso, cria um virtual
    const temOutorgaCadastrada = listaDocs.some(function(d){
      return d.tipo === 'OUTORGA' && (d.uso_id === u.id || d.propriedade_id === u.propriedade_id);
    });
    if (!temOutorgaCadastrada && (u.outorga_pdf_url || u.portaria || u.processo)) {
      const venc = getDataVencimento(u, p);
      listaDocs.push({
        id: 'virtual-outorga',
        tipo: 'OUTORGA',
        titulo: 'Outorga' + (u.portaria ? ' — ' + u.portaria : ''),
        numero: u.portaria || null,
        orgao: 'SP Águas',  // ONDA F7: DAEE foi renomeado pra SP Águas em 2024
        processo: u.processo || (p && p.processo) || null,
        data_emissao: u.data_emissao || (p && p.data_emissao) || null,
        data_vencimento: venc ? venc.toISOString().split('T')[0] : null,
        arquivo_url: u.outorga_pdf_url || null,
        observacao: null,
        _virtual: true
      });
    }

    // Ordena: por severidade (vencidos primeiro), depois por data de vencimento
    listaDocs.sort(function(a, b){
      const sa = statusDocCli(a), sb = statusDocCli(b);
      if (sb.severidade !== sa.severidade) return sb.severidade - sa.severidade;
      const da = sa.dias === null ? 99999 : sa.dias;
      const db = sb.dias === null ? 99999 : sb.dias;
      return da - db;
    });

    const wrap = $('docs-lista-wrap');
    if (!listaDocs.length) {
      wrap.innerHTML = '<div class="card" style="text-align:center;padding:40px 20px;color:var(--text-muted);">'
        + '<div style="font-size:42px;margin-bottom:10px;opacity:0.4;">📁</div>'
        + '<div style="font-weight:600;margin-bottom:6px;">Nenhum documento cadastrado ainda</div>'
        + '<div style="font-size:12px;">Seus documentos e licenças aparecerão aqui assim que forem registrados pela Zello.</div>'
        + '</div>';
      return;
    }

    wrap.innerHTML = listaDocs.map(function(d){ return renderCardDocCli(d); }).join('');
  }

  function renderCardDocCli(d) {
    const tipo = getTipoDocCli(d.tipo);
    const status = statusDocCli(d);

    const meta = [];
    if (d.numero) meta.push('Nº ' + escapeHtmlCli(d.numero));
    if (d.orgao) meta.push(escapeHtmlCli(d.orgao));
    if (d.processo) meta.push('Proc. ' + escapeHtmlCli(d.processo));
    if (d.data_emissao) meta.push('Emissão: ' + fmtData(d.data_emissao));
    if (d.data_vencimento) meta.push('Vence: ' + fmtData(d.data_vencimento));

    const titulo = escapeHtmlCli(d.titulo || tipo.label);

    // Botão / link do arquivo
    let arquivoBtn = '';
    if (d.arquivo_url) {
      arquivoBtn =
        '<a href="' + d.arquivo_url + '" target="_blank" rel="noopener" class="outorga-pdf-btn" style="margin-top:12px;background:linear-gradient(135deg,' + tipo.bg + ' 0%,#fff 100%);border-color:' + tipo.cor + ';color:' + tipo.cor + ';">'
        + '<span class="outorga-pdf-icon">📄</span>'
        + '<span class="outorga-pdf-text">'
        +   '<div class="outorga-pdf-titulo">Visualizar documento</div>'
        +   '<div class="outorga-pdf-sub">Clique para abrir</div>'
        + '</span>'
        + '<span style="font-size:20px;">→</span>'
        + '</a>';
    } else {
      arquivoBtn =
        '<div class="pdf-indisponivel" style="margin-top:12px;font-size:12px;padding:12px;">'
        + '📄 Arquivo ainda não disponível.'
        + '</div>';
    }

    return '<div class="card" style="border-left:4px solid ' + tipo.cor + ';margin-bottom:12px;">'
      + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;">'
      +   '<span style="background:' + tipo.bg + ';color:' + tipo.cor + ';padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700;">' + tipo.icone + ' ' + tipo.label + '</span>'
      +   '<span style="background:' + status.bg + ';color:' + status.cor + ';padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700;">' + status.txt + '</span>'
      + '</div>'
      + '<div style="font-weight:700;font-size:15px;line-height:1.3;margin-bottom:6px;">' + titulo + '</div>'
      + (meta.length ? '<div style="font-size:11px;color:var(--text-muted);font-family:DM Mono, monospace;line-height:1.6;">' + meta.join(' · ') + '</div>' : '')
      + (d.observacao ? '<div style="font-size:12px;color:var(--text);margin-top:8px;padding:8px 10px;background:var(--bg);border-radius:6px;line-height:1.4;">' + escapeHtmlCli(d.observacao) + '</div>' : '')
      + arquivoBtn
      + '</div>';
  }

  // ===========================================================================
  // RENDER: HISTÓRICO
  // ===========================================================================
  // Visualizador de foto (consulta privada, somente leitura)
  function abrirFotoLeitura(url) {
    if (!url) return;
    var ov = document.getElementById('foto-lightbox');
    var img = document.getElementById('foto-lightbox-img');
    if (!ov || !img) { window.open(url, '_blank'); return; }
    img.src = url;
    ov.style.display = 'flex';
  }
  function fecharFotoLeitura() {
    var ov = document.getElementById('foto-lightbox');
    var img = document.getElementById('foto-lightbox-img');
    if (ov) ov.style.display = 'none';
    if (img) img.src = '';
  }
  window.abrirFotoLeitura = abrirFotoLeitura;
  window.fecharFotoLeitura = fecharFotoLeitura;

  // v59: aba Outorgas — todas as licenças do grupo econômico, agrupadas por empresa/unidade
  function renderOutorgasTab() {
    var wrap = document.getElementById('tab-outorgas-conteudo');
    if (!wrap) return;
    var usos = (state.usosCliente || []).slice();
    var props = state.propriedadesGrupo || {};
    var empresas = state.gruposEmpresasNomes || {};
    var multiEmp = Object.keys(empresas).length > 1;
    if (!usos.length) { wrap.innerHTML = '<div class="outorga-vazio">Nenhuma outorga disponível ainda.</div>'; return; }

    var porEmpresa = {};
    usos.forEach(function(u){
      var cid = u.cliente_id || '_';
      var pid = u.propriedade_id || '_';
      if (!porEmpresa[cid]) porEmpresa[cid] = {};
      if (!porEmpresa[cid][pid]) porEmpresa[cid][pid] = [];
      porEmpresa[cid][pid].push(u);
    });

    var cids = Object.keys(porEmpresa).sort(function(a, b){
      return String(empresas[a] || '').localeCompare(String(empresas[b] || ''), 'pt-BR');
    });

    var html = '';
    cids.forEach(function(cid){
      if (multiEmp) {
        var _doc = (state.gruposEmpresasDoc || {})[cid] || '';
        var _dig = String(_doc).replace(/\D/g, '');
        var _badge = '', _docLinha = '';
        if (_dig.length === 14) {
          _badge = ' <span style="font-size:10px;font-weight:800;padding:2px 7px;border-radius:6px;background:#DBEAFE;color:#1E40AF;">PJ</span>';
          _docLinha = 'CNPJ ' + escapeHtmlCli(_doc);
        } else if (_dig.length === 11) {
          _badge = ' <span style="font-size:10px;font-weight:800;padding:2px 7px;border-radius:6px;background:#DCFCE7;color:#166534;">PF</span>';
          _docLinha = 'CPF ' + escapeHtmlCli(_doc);
        }
        html += '<div class="outorga-empresa-header">'
          + '<div>🏢 ' + escapeHtmlCli(empresas[cid] || 'Empresa') + _badge + '</div>'
          + (_docLinha ? '<div style="font-size:12.5px;font-weight:700;color:#1e293b;margin-top:3px;letter-spacing:0.2px;">' + _docLinha + '</div>' : '')
          + '</div>';
      }
      var pids = Object.keys(porEmpresa[cid]).sort(function(a, b){
        return String((props[a] && props[a].nome) || '').localeCompare(String((props[b] && props[b].nome) || ''), 'pt-BR');
      });
      pids.forEach(function(pid){
        var prop = props[pid] || {};
        var cidadeProp = prop.cidade ? prop.cidade + (prop.estado ? '/' + prop.estado : '') : '';
        html += '<div class="outorga-prop-header">📍 ' + escapeHtmlCli(prop.nome || 'Propriedade')
          + (cidadeProp ? ' <span class="muted">· ' + escapeHtmlCli(cidadeProp) + '</span>' : '') + '</div>';
        porEmpresa[cid][pid].forEach(function(u){
          var temPdf = u.outorga_pdf_url && String(u.outorga_pdf_url).trim();
          var aut = getAutorizadoMes(u);
          var sub = [];
          if (u.requerimento) sub.push('Req. ' + escapeHtmlCli(u.requerimento));
          if (aut > 0) sub.push('Vazão ' + fmtNum(aut) + ' m³/mês');
          if (u.numero_serie) sub.push('Hidrômetro ' + escapeHtmlCli(u.numero_serie));
          html += '<div class="outorga-card">'
            + '<div>'
            +   '<div class="outorga-card-titulo">' + escapeHtmlCli(u.descricao || 'Ponto') + '</div>'
            +   (sub.length ? '<div class="outorga-card-sub">' + sub.join(' · ') + '</div>' : '')
            + '</div>'
            + (temPdf
                ? '<a href="' + escapeHtmlCli(u.outorga_pdf_url) + '" target="_blank" rel="noopener" class="outorga-btn-pdf">📄 Abrir outorga</a>'
                : '<span class="outorga-sem-pdf">Outorga não anexada</span>')
            + '</div>';
        });
      });
    });
    wrap.innerHTML = html || '<div class="outorga-vazio">Nenhuma outorga disponível ainda.</div>';
  }

  function renderHistoricoTab() {
    const lista = $('historico-lista');
    if (!state.leiturasOrdenadas.length) {
      lista.innerHTML = '<div class="hist-vazio"><div class="hist-vazio-emoji">📊</div><div>Nenhuma leitura registrada ainda.</div><div style="margin-top:6px;font-size:11px;">Após enviar sua primeira leitura, ela aparecerá aqui.</div></div>';
      $('historico-stats').style.display = 'none';
      $('historico-grafico-wrap').style.display = 'none';
      return;
    }

    // Stats — a leitura inicial (marco zero) não conta como consumo
    const paraMedia = state.leiturasOrdenadas.filter(function(l){ return !l.leitura_inicial; });
    const total = paraMedia.reduce(function(s,l){ return s + (parseFloat(l.consumo_m3) || 0); }, 0);
    const media = paraMedia.length ? (total / paraMedia.length) : 0;
    $('hist-total').textContent = fmtNum(total) + ' m³';
    $('hist-media').textContent = fmtNum(media) + ' m³';
    $('historico-stats').style.display = 'block';

    // Lista (mais recente primeiro, máx 12)
    const aut = getAutorizadoMes(state.uso);
    const itens = state.leiturasOrdenadas.slice(0, 12);
    lista.innerHTML = itens.map(function(l){
      const inicial = !!l.leitura_inicial;
      const consumo = parseFloat(l.consumo_m3) || 0;
      const acima = !inicial && aut > 0 && consumo > aut;
      const fu = (l.foto_url && String(l.foto_url).trim()) ? String(l.foto_url).trim() : '';
      const fuAttr = fu.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      const linkFoto = fu
        ? '<button type="button" class="hist-foto-link" data-fotourl="' + fuAttr + '" onclick="abrirFotoLeitura(this.dataset.fotourl)">📷 Ver foto enviada</button>'
        : '';
      const obs = (l.observacao && String(l.observacao).trim()) ? String(l.observacao).trim() : '';
      const obsHtml = obs
        ? '<div class="hist-obs"><span class="hist-obs-label">💬 Observação</span>' + escapeHtmlCli(obs) + '</div>'
        : '';
      return '<div class="historico-item">'
        + '<div class="hist-linha">'
        +   '<div>'
        +     '<div class="hist-mes">' + fmtMes(l.mes_referencia) + '</div>'
        +     '<div class="hist-data">Enviado em ' + fmtData(l.enviado_em) + '</div>'
        +     linkFoto
        +   '</div>'
        +   '<div class="hist-consumo' + (acima ? ' hist-acima' : '') + '">'
        +     (inicial ? '📍 Inicial' : fmtNum(consumo) + ' m³')
        +     (acima ? ' ⚠️' : '')
        +   '</div>'
        + '</div>'
        + obsHtml
        + '</div>';
    }).join('');

    // Gráfico (últimos 12 meses na ordem cronológica)
    renderGraficoHistorico();
  }

  function renderGraficoHistorico() {
    const wrap = $('historico-grafico-wrap');
    if (!state.leiturasOrdenadas.length || typeof Chart === 'undefined') {
      wrap.style.display = 'none';
      return;
    }
    wrap.style.display = 'block';

    // Pega últimos 12 meses, ordem crescente pra plotar
    const dadosCronologico = state.leiturasOrdenadas.slice(0, 12).slice().reverse();
    const labels = dadosCronologico.map(function(l){ return fmtMesCurto(l.mes_referencia); });
    const valores = dadosCronologico.map(function(l){ return parseFloat(l.consumo_m3) || 0; });
    const aut = getAutorizadoMes(state.uso);

    const ctx = $('historico-chart');
    if (state.chart) { state.chart.destroy(); state.chart = null; }

    state.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Consumo',
            data: valores,
            backgroundColor: valores.map(function(v){
              return aut > 0 && v > aut ? 'rgba(198,40,40,0.7)' : 'rgba(21,101,192,0.7)';
            }),
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(c){ return fmtNum(c.parsed.y) + ' m³'; }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { callback: function(v){ return v + ' m³'; }, font: { size: 10 } },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: { ticks: { font: { size: 9 } }, grid: { display: false } }
        }
      }
    });
  }

  // ===========================================================================
  // TABS
  // ===========================================================================
  function trocarTab(tab) {
    document.querySelectorAll('.tab').forEach(function(t){ t.classList.remove('active'); });
    document.querySelectorAll('.tab-content').forEach(function(c){ c.classList.remove('active'); });
    document.querySelector('.tab[data-tab="' + tab + '"]').classList.add('active');
    $('tab-' + tab).classList.add('active');
  }

  // ===========================================================================
  // FOTO
  // ===========================================================================
  function setupFotoUpload() {
    $('foto-input').addEventListener('change', async function(e){
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      // Validação
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione uma imagem (JPG ou PNG).');
        e.target.value = '';
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        alert('A imagem é muito grande (máx 15 MB). Por favor, escolha uma menor ou tire uma foto em qualidade média.');
        e.target.value = '';
        return;
      }

      // Comprime a imagem se for grande (>1.5MB) ou tem dimensões > 1600px
      // Isso é crucial para celular: fotos saem com 4-8 MB facilmente
      let processedFile = file;
      try {
        if (file.size > 1.5 * 1024 * 1024) {
          $('foto-upload-area').querySelector('.foto-upload-text').textContent = 'Otimizando imagem...';
          processedFile = await comprimirImagem(file, 1600, 0.82);
        }
      } catch (err) {
        console.warn('Falha ao comprimir, usando original:', err);
        processedFile = file;
      }

      state.fotoBlob = processedFile;

      // Preview
      const reader = new FileReader();
      reader.onload = function(ev){
        $('foto-preview').src = ev.target.result;
        $('foto-preview-wrap').classList.add('active');
        $('foto-upload-area').style.display = 'none';
      };
      reader.onerror = function(){
        alert('Não foi possível visualizar a imagem. Tente novamente com outra foto.');
        e.target.value = '';
        state.fotoBlob = null;
      };
      reader.readAsDataURL(processedFile);
    });
  }

  // Comprime uma imagem mantendo proporção
  function comprimirImagem(file, maxLado, qualidade) {
    return new Promise(function(resolve, reject){
      const reader = new FileReader();
      reader.onload = function(e){
        const img = new Image();
        img.onload = function(){
          let w = img.width, h = img.height;
          if (w > maxLado || h > maxLado) {
            if (w > h) {
              h = Math.round(h * maxLado / w);
              w = maxLado;
            } else {
              w = Math.round(w * maxLado / h);
              h = maxLado;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          canvas.toBlob(function(blob){
            if (!blob) return reject(new Error('toBlob retornou null'));
            // Reembala como File pra preservar o nome
            const out = new File([blob], (file.name || 'foto').replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
            resolve(out);
          }, 'image/jpeg', qualidade);
        };
        img.onerror = function(){ reject(new Error('Falha ao decodificar imagem')); };
        img.src = e.target.result;
      };
      reader.onerror = function(){ reject(new Error('Falha ao ler arquivo')); };
      reader.readAsDataURL(file);
    });
  }

  function removerFoto() {
    state.fotoBlob = null;
    state.fotoUrl = null;
    $('foto-input').value = '';
    $('foto-preview').src = '';
    $('foto-preview-wrap').classList.remove('active');
    $('foto-upload-area').style.display = 'flex';
    // Restaura texto original
    const txtEl = $('foto-upload-area').querySelector('.foto-upload-text');
    if (txtEl) txtEl.textContent = 'Tire uma foto do hidrômetro';
  }

  // ===========================================================================
  // ENVIAR LEITURA
  // ===========================================================================
  async function enviarLeitura() {
    if (state.enviando) return;

    const mes = $('mes-ref').value;
    const lAnt = parseFloat($('leitura-anterior').value) || 0;
    const lAtu = parseFloat($('leitura-atual').value);
    const obs = $('observacao').value.trim();

    // Validações
    if (!mes) {
      alert('Selecione o mês de referência.');
      return;
    }
    if (mes > getMesAtual()) {
      alert('Não é possível registrar leituras de meses futuros.');
      return;
    }
    // FIX 2026-05-28 (#1): trava do dia 15. O painel admin promete que após o dia 15
    // o cliente não consegue mais enviar a leitura DO MÊS CORRENTE pelo link.
    // Implementado aqui pra o sistema cumprir o que promete.
    // Meses anteriores (atraso) continuam permitidos — regularização legítima.
    const DIA_LIMITE_LEITURA = 15;
    const hojeData = new Date();
    if (mes === getMesAtual() && hojeData.getDate() > DIA_LIMITE_LEITURA) {
      alert('⏰ O prazo para enviar a leitura de ' + fmtMes(mes) + ' encerrou no dia ' + DIA_LIMITE_LEITURA + '.\n\n' +
            'Não é mais possível registrar a leitura deste mês pelo link.\n\n' +
            'Entre em contato com a Zello Ambiental — se necessário, o registro pode ser feito manualmente pela nossa equipe.');
      return;
    }
    if (isNaN(lAtu) || lAtu === '') {
      alert('Informe a leitura atual do hidrômetro.');
      $('leitura-atual').focus();
      return;
    }
    if (lAtu < lAnt) {
      alert('A leitura atual (' + fmtNum(lAtu) + ' m³) está menor que a anterior (' + fmtNum(lAnt) + ' m³).\n\nIsso só seria possível se o hidrômetro tivesse sido trocado. Confira o número e tente novamente. Se realmente o hidrômetro foi trocado, entre em contato com a Zello.');
      return;
    }

    // v71: primeira leitura = marco zero → consumo 0 e sem checagem de vazão
    const ehInicial = !!state.ehLeituraInicial;
    const consumo = ehInicial ? 0 : (lAtu - lAnt);
    const aut = getAutorizadoMes(state.uso);
    const acimaVazao = !ehInicial && aut > 0 && consumo > aut;

    // Confirmações
    if (state.leiturasNoMes) {
      const ok = await confirmar(
        '🔄 Substituir leitura existente',
        'Já existe uma leitura cadastrada para ' + fmtMes(mes) + ' (' + fmtNum(state.leiturasNoMes.consumo_m3) + ' m³).\n\nDeseja substituí-la pela nova leitura (' + fmtNum(consumo) + ' m³)?'
      );
      if (!ok) return;
    } else if (acimaVazao) {
      const ok = await confirmar(
        '⚠️ Consumo acima do autorizado',
        'O consumo de ' + fmtNum(consumo) + ' m³ está acima do limite autorizado de ' + fmtNum(aut) + ' m³ por mês.\n\nDeseja confirmar mesmo assim?'
      );
      if (!ok) return;
    }

    state.enviando = true;
    const btn = $('btn-enviar');
    const txt = $('btn-enviar-texto');
    btn.disabled = true;
    txt.innerHTML = '<span style="display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:8px;vertical-align:middle;"></span> Enviando...';

    try {
      // Upload da foto (se tiver)
      let fotoUrl = null;
      if (state.fotoBlob) {
        try {
          txt.innerHTML = '<span style="display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:8px;vertical-align:middle;"></span> Enviando foto...';
          const ext = (state.fotoBlob.name || '').split('.').pop() || 'jpg';
          fotoUrl = await uploadFoto(state.fotoBlob, ext);
        } catch (e) {
          console.error('Erro no upload da foto:', e);
          const continuar = confirm('Não conseguimos enviar a foto.\n\nDeseja enviar a leitura SEM a foto?');
          if (!continuar) {
            throw new Error('Cancelado pelo usuário');
          }
        }
      }

      txt.innerHTML = '<span style="display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:8px;vertical-align:middle;"></span> Enviando leitura...';

      const payload = {
        uso_id: state.uso.id,
        cliente_id: state.uso.cliente_id,
        mes_referencia: mes,
        leitura_anterior: lAnt,
        leitura_atual: lAtu,
        consumo_m3: consumo,
        leitura_inicial: ehInicial,
        alerta_vazao: acimaVazao,
        observacao: obs || null,
        enviado_em: new Date().toISOString()
      };
      // FIX: a coluna de foto na tabela `leituras` chama-se `foto_url`.
      // (Antes usava `foto_equipamento_url`, que é coluna da tabela `usos` —
      // o INSERT falhava e a foto do hidrômetro era descartada em silêncio.)
      if (fotoUrl) payload.foto_url = fotoUrl;

      let r;
      if (state.leiturasNoMes) {
        // Atualiza
        r = await api('leituras?id=eq.' + state.leiturasNoMes.id, 'PATCH', payload, 'return=minimal');
      } else {
        // Insere
        r = await api('leituras', 'POST', payload, 'return=minimal');
      }

      if (!r.ok) {
        let txtErro = '';
        try { txtErro = await r.text(); } catch (e) {}
        // Trata caso especial: constraint UNIQUE pegou
        if (txtErro.indexOf('leituras_uso_mes_unique') >= 0 || txtErro.toLowerCase().indexOf('duplicate') >= 0) {
          alert('⚠️ Já existe uma leitura para este mês registrada por outra fonte.\n\nRecarregue a página para ver a leitura atualizada.');
          throw new Error('Constraint duplicata');
        }
        // Rede de segurança: se a coluna de foto não existir no banco, tenta sem ela
        const colunaFoto = (txtErro.indexOf('foto_url') >= 0)
          || (txtErro.toLowerCase().indexOf('column') >= 0 && fotoUrl);
        if (colunaFoto && fotoUrl) {
          delete payload.foto_url;
          if (state.leiturasNoMes) {
            r = await api('leituras?id=eq.' + state.leiturasNoMes.id, 'PATCH', payload, 'return=minimal');
          } else {
            r = await api('leituras', 'POST', payload, 'return=minimal');
          }
          if (!r.ok) {
            let txtErro2 = '';
            try { txtErro2 = await r.text(); } catch (e) {}
            throw new Error('Erro ao salvar: ' + txtErro2.substring(0, 200));
          }
          // Avisa que foto não foi salva (banco não suporta) mas a leitura foi
          console.warn('Foto não foi salva: coluna foto_url não existe na tabela leituras.');
        } else {
          throw new Error('Erro ao salvar: ' + txtErro.substring(0, 200));
        }
      }

      // Sucesso!
      $('sucesso-resumo').innerHTML =
        '<div style="font-size:11px;font-weight:500;color:var(--text-muted);margin-bottom:4px;">' + fmtMes(mes) + '</div>'
        + (ehInicial
            ? '📍 Leitura inicial registrada (' + fmtNum(lAtu) + ' m³)<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Marco zero — o consumo será calculado a partir da próxima leitura.</div>'
            : 'Consumo: ' + fmtNum(consumo) + ' m³')
        + (fotoUrl
            ? '<div style="margin-top:14px;">'
              + '<div style="font-size:11px;color:var(--text-muted);margin-bottom:6px;">📷 Foto enviada</div>'
              + '<img src="' + fotoUrl + '" alt="Foto da leitura enviada" onclick="abrirFotoLeitura(this.src)" '
              + 'style="max-width:150px;max-height:150px;border-radius:8px;border:1px solid var(--border,#e2e8f0);cursor:zoom-in;object-fit:cover;">'
              + '</div>'
            : '');

      setState('sucesso');

    } catch (e) {
      console.error(e);
      if (e.message !== 'Cancelado pelo usuário' && e.message !== 'Constraint duplicata') {
        alert('Erro ao enviar a leitura.\n\n' + (e.message || 'Tente novamente em alguns instantes.'));
      }
    } finally {
      state.enviando = false;
      btn.disabled = false;
      txt.textContent = state.leiturasNoMes ? '🔄 Substituir leitura' : '📤 Enviar leitura';
    }
  }

  function voltarPortal() {
    // Limpa formulário
    state.fotoBlob = null;
    state.fotoUrl = null;
    $('foto-input').value = '';
    $('foto-preview-wrap').classList.remove('active');
    $('foto-upload-area').style.display = 'flex';
    $('observacao').value = '';

    // Recarrega dados da API
    init();
  }

  // ===========================================================================
  // MODAL DE CONFIRMAÇÃO
  // ===========================================================================
  function confirmar(titulo, msg) {
    return new Promise(function(resolve){
      $('modal-titulo').textContent = titulo;
      $('modal-mensagem').textContent = msg;
      $('modal-confirmar').classList.remove('hidden');

      const btn = $('modal-confirmar-btn');
      function onOk() {
        cleanup();
        resolve(true);
      }
      function onCancel() {
        cleanup();
        resolve(false);
      }
      function cleanup() {
        btn.removeEventListener('click', onOk);
        $('modal-confirmar').classList.add('hidden');
      }
      btn.addEventListener('click', onOk);
      window._modalCancel = onCancel;
    });
  }
  function fecharModal() {
    $('modal-confirmar').classList.add('hidden');
    if (window._modalCancel) window._modalCancel();
  }


  // ===========================================================================
  // UPLOAD DE DOCUMENTOS DO PROJETO (Fase 2)
  // ===========================================================================
  let _uploadProjeto = null;
  let _uploadDocsExistentes = [];
  // ONDA 104: guardam dados pra gerar a procuração pré-preenchida
  let _uploadCliente = null;
  let _uploadConfigZello = null;
  // ONDA 109: propriedade do projeto — usada pra cidade da procuração
  let _uploadPropriedade = null;

  async function carregarUploadPorToken(token) {
    if (!token || token.length < 8) {
      mostrarErro('⚠', 'Link inválido', 'O link de upload está incompleto. Solicite um novo link.');
      return;
    }
    try {
      const r = await api('projetos?upload_token=eq.' + encodeURIComponent(token) + '&select=*');
      if (!r || !r.length) {
        mostrarErro('🔒', 'Link inválido', 'Este link não é válido ou foi revogado. Entre em contato com a Zello Ambiental.');
        return;
      }
      const proj = r[0];
      if (proj.status === 'cancelado') {
        mostrarErro('🚫', 'Projeto cancelado', 'Este projeto foi cancelado. Entre em contato com a Zello Ambiental.');
        return;
      }
      _uploadProjeto = proj;

      // ONDA 104: amplia campos do cliente pra montar a procuração
      let cli = null, prop = null, respLegal = null;
      try {
        const cR = await api('clientes?id=eq.' + proj.cliente_id + '&select=nome,razao_social,cpf_cnpj,telefone1,email,endereco,endereco_rua,numero,endereco_numero,bairro,endereco_bairro,cidade,estado,endereco_uf,cep,endereco_cep');
        cli = cR && cR[0];
        // Anexa o responsável legal principal (se houver) — usado na procuração
        // pra empresas. Lê da tabela `contatos` (sistema que já existe).
        if (cli) {
          try {
            const rL = await api('contatos?cliente_id=eq.' + proj.cliente_id + '&papel=eq.responsavel_legal&ativo=eq.true&select=nome,cpf_cnpj&order=principal.desc.nullslast&limit=1');
            respLegal = rL && rL[0];
            if (respLegal) {
              cli.resp_legal_nome = respLegal.nome;
              cli.resp_legal_cpf = respLegal.cpf_cnpj;
            }
          } catch(e) { /* sem resp legal, segue normal */ }
        }
        _uploadCliente = cli;
      } catch(e) {}
      try {
        // ONDA 109: traz também o `estado` pra montar local de assinatura "Cidade/UF"
        const pR = await api('propriedades?id=eq.' + proj.propriedade_id + '&select=nome,cidade,estado');
        prop = pR && pR[0];
        _uploadPropriedade = prop;
      } catch(e) {}

      // ONDA 104: busca config da Zello (outorgado da procuração)
      try {
        const cZ = await api('config_contratado?select=*&limit=1');
        _uploadConfigZello = (cZ && cZ[0]) || null;
      } catch(e) {}

      // POST-ONDA 4: nomes das etapas vêm do banco (config_etapas_projeto),
      // pra nunca ficarem desatualizados em relação ao painel admin.
      let ETAPAS = ['📋 Checklist','📥 Iniciar Projeto','🔍 Em Análise','📰 Publicação e Pagamento'];
      try {
        const etR = await api('config_etapas_projeto?ativo=eq.true&select=numero,nome,icone&order=numero.asc');
        if (etR && etR.length) {
          ETAPAS = etR.map(function(e){ return (e.icone ? e.icone + ' ' : '') + e.nome; });
        }
      } catch(e) {}
      $('upload-cliente-nome').textContent = (cli && cli.nome) || '(cliente)';
      $('upload-projeto-info').textContent = '📍 ' + ((prop && prop.nome) || '—') + (prop && prop.cidade ? ' (' + prop.cidade + ')' : '') + ' · ' + (proj.nome || '');
      $('upload-etapa-atual').textContent = 'Etapa atual: ' + (ETAPAS[(proj.etapa_atual||1) - 1] || '—');

      // Carrega documentos já enviados via este token
      await recarregarListaDocsUpload();

      // FASE 3A: carrega templates da etapa atual e renderiza checklist
      await recarregarChecklistDocs();

      setState('upload');
      setupUploadHandlers();

      // ONDA A.2: verifica termo LGPD também no acesso por token de upload.
      // Modal não-bloqueante (cliente pode adiar).
      if (proj && proj.cliente_id) {
        verificarAceiteLgpd(proj.cliente_id).catch(function(e){ console.warn('lgpd check (upload):', e); });
      }
    } catch(e) {
      console.error('carregarUploadPorToken:', e);
      mostrarErro('⚠', 'Erro ao carregar', 'Não foi possível abrir o link agora. Tente novamente em alguns minutos.');
    }
  }

  // === FASE 3A: Checklist de documentos solicitados ===
  let _uploadTemplates = [];

  async function recarregarChecklistDocs() {
    if (!_uploadProjeto) { _uploadTemplates = []; return; }
    try {
      _uploadTemplates = await api('documento_template?etapa=eq.' + _uploadProjeto.etapa_atual + '&ativo=eq.true&order=ordem.asc&select=*') || [];
      // v72: se o painel selecionou documentos específicos pra este projeto,
      // mostra só os selecionados (null/vazio = todos, comportamento antigo)
      var _selDocs = _uploadProjeto.docs_solicitados;
      if (Array.isArray(_selDocs) && _selDocs.length) {
        _uploadTemplates = _uploadTemplates.filter(function(t){ return _selDocs.indexOf(t.id) !== -1; });
      }
    } catch(e) {
      _uploadTemplates = [];
    }
    renderChecklistDocs();
  }

  function renderChecklistDocs() {
    const wrap = $('upload-checklist-wrap');
    const cont = $('upload-checklist-lista');
    if (!wrap || !cont) return;

    if (!_uploadTemplates.length) {
      wrap.style.display = 'none';
      return;
    }
    wrap.style.display = '';

    // Mapeia template_id → doc enviado (se houver)
    const enviadosPorTemplate = {};
    _uploadDocsExistentes.forEach(function(d) {
      if (d.template_id) enviadosPorTemplate[d.template_id] = d;
    });

    cont.innerHTML = _uploadTemplates.map(function(t) {
      const env = enviadosPorTemplate[t.id];
      const feito = !!env;
      const obrig = t.obrigatorio;

      // ONDA 104d: detecta categoria do item opcional (rural vs urbano)
      // pela descrição — pra mostrar tags coloridas diferentes que ajudam
      // o cliente a entender o que se aplica ao caso dele.
      // ONDA 106: também olha o título (não só a descrição), e regex expandido
      // pra reconhecer DCAA / agropecuária / agricultura → RURAL.
      const textoBusca = (String(t.titulo || '') + ' ' + String(t.descricao || '')).toLowerCase();
      const ehRural = !obrig && /im[oó]vel rural|\brural\b|dcaa|agropecu[aá]ria|agricultura|incra|ccir|nirf|itr/i.test(textoBusca);
      const ehUrbano = !obrig && /im[oó]vel urbano|\burbano\b|alvar[aá]|inscri[çc][aã]o municipal|iptu/i.test(textoBusca);

      const cls = feito ? 'feito' : (obrig ? '' : 'opcional');
      const ic = feito ? '✓' : (obrig ? '📥' : '○');

      // Tags coloridas:
      // - OBRIGATÓRIO  → vermelho (como já era)
      // - OPCIONAL ÁREA RURAL  → verde (cor de terra/campo)
      // - OPCIONAL ÁREA URBANA → azul (cor de cidade/asfalto)
      // - OPCIONAL (sem categoria) → cinza neutro
      let tag = '';
      if (feito) {
        tag = '';
      } else if (obrig) {
        tag = '<span class="obrig-tag">OBRIGATÓRIO</span>';
      } else if (ehRural) {
        tag = '<span class="opc-tag opc-rural">OPCIONAL ÁREA RURAL</span>';
      } else if (ehUrbano) {
        tag = '<span class="opc-tag opc-urbano">OPCIONAL ÁREA URBANA</span>';
      } else {
        tag = '<span class="opc-tag opc-neutro">OPCIONAL</span>';
      }

      const statusLine = feito
        ? (ehTexto
            ? '<div class="checklist-status">✓ informado: <b>' + escapeHtml(String(env.observacao || '')) + '</b></div>'
            : '<div class="checklist-status">✓ enviado em ' + new Date(env.created_at).toLocaleDateString('pt-BR') + '</div>')
        : '';

      // ONDA 104: se o item for a procuração, oferecer botão "Baixar procuração pronta"
      // ANTES do botão de enviar — assim o cliente baixa, assina e devolve.
      const ehProcuracao = /procura[çc][aã]o|autoriza[çc][aã]o.*zello/i.test(t.titulo || '');
      const ehTexto = (t.tipo_resposta === 'texto');
      const btnProcuracao = (ehProcuracao && !feito)
        ? '<button class="checklist-btn" onclick="event.stopPropagation();baixarProcuracao()" style="background:#DBEAFE;color:#1E40AF;border:1px solid #93C5FD;margin-right:6px;" title="Gera a procuração pré-preenchida com seus dados (PDF)">📄 Baixar pronta</button>' +
          '<button class="checklist-btn" onclick="event.stopPropagation();baixarProcuracaoWord()" style="background:#EEF2FF;color:#3730A3;border:1px solid #C7D2FE;margin-right:6px;" title="Versão editável em Word">📝 Word</button>'
        : '';

      let btn;
      if (ehTexto) {
        const emEdicao = feito && _editTexto[t.id];
        if (feito && !emEdicao) {
          btn = '<button class="checklist-btn feito" onclick="event.stopPropagation();corrigirRespostaTexto(\'' + t.id + '\')">Corrigir</button>';
        } else {
          const ph = /e-?mail/i.test(t.titulo || '') ? 'seuemail@exemplo.com'
                   : (/cpf/i.test(t.titulo || '') ? 'CPF 000.000.000-00 · RG 00.000.000-0' : 'Digite aqui…');
          const valAtual = emEdicao ? String(env.observacao || '').replace(/"/g, '&quot;') : '';
          btn = '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;" onclick="event.stopPropagation()">' +
            '<input type="text" id="txtresp-' + t.id + '" value="' + valAtual + '" placeholder="' + ph + '" maxlength="160" style="border:1px solid #CBD5E1;border-radius:8px;padding:7px 10px;font-size:13px;width:230px;" onkeydown="if(event.key===\'Enter\'){event.preventDefault();enviarRespostaTexto(\'' + t.id + '\');}">' +
            '<button class="checklist-btn" onclick="enviarRespostaTexto(\'' + t.id + '\')">' + (emEdicao ? '✔ Atualizar' : '✔ Enviar') + '</button>' +
          '</div>';
        }
      } else {
        btn = feito
          ? '<button class="checklist-btn feito" onclick="reuploadTemplate(\'' + t.id + '\')">Re-enviar</button>'
          : '<button class="checklist-btn" onclick="uploadDocTemplate(\'' + t.id + '\')">📤 Enviar</button>';
      }
      return '<div class="checklist-item ' + cls + '">' +
        '<div class="checklist-ic">' + ic + '</div>' +
        '<div class="checklist-body">' +
          '<div class="checklist-titulo">' + escapeHtml(t.titulo) + tag + '</div>' +
          (t.descricao ? '<div class="checklist-desc">' + escapeHtml(t.descricao) + '</div>' : '') +
          statusLine +
        '</div>' +
        btnProcuracao +
        btn +
      '</div>';
    }).join('');
  }

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function uploadDocTemplate(templateId) {
    // Cria um input file temporário vinculado ao template
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.multiple = true;  // POST-ONDA 4: permite enviar vários arquivos de uma vez
    inp.accept = 'application/pdf,image/*,.doc,.docx,.xls,.xlsx';
    inp.style.display = 'none';
    document.body.appendChild(inp);
    inp.onchange = async function() {
      const files = inp.files;
      if (files && files.length) await processarUploadFiles(files, templateId);
      document.body.removeChild(inp);
    };
    inp.click();
  }

  function reuploadTemplate(templateId) {
    if (!confirm('Re-enviar este documento? O envio anterior será substituído.')) return;
    uploadDocTemplate(templateId);
  }

  // v74: respostas DIGITADAS (e-mail, CPF/RG…) — salvas em documentos.observacao
  let _editTexto = {};

  function corrigirRespostaTexto(templateId) {
    _editTexto[templateId] = true;
    renderChecklistDocs();
    setTimeout(function(){ var i = $('txtresp-' + templateId); if (i){ i.focus(); i.select(); } }, 50);
  }

  async function enviarRespostaTexto(templateId) {
    const t = (_uploadTemplates || []).find(function(x){ return x.id === templateId; });
    const inp = $('txtresp-' + templateId);
    const valor = (inp && inp.value || '').trim();
    if (!valor) { alert('Digite a informação antes de enviar. 😉'); return; }
    if (t && /e-?mail/i.test(t.titulo || '') && valor.indexOf('@') === -1) {
      alert('Esse e-mail não parece completo — confere se tem o @ 😉');
      return;
    }
    try {
      const ant = _uploadDocsExistentes.find(function(d){ return d.template_id === templateId; });
      if (ant) {
        await api('documentos?id=eq.' + ant.id, 'PATCH', { observacao: valor }, 'return=minimal');
      } else {
        await api('documentos', 'POST', {
          projeto_id: _uploadProjeto.id,
          cliente_id: _uploadProjeto.cliente_id,
          propriedade_id: _uploadProjeto.propriedade_id,
          template_id: templateId,
          tipo: 'outro',
          titulo: (t && t.titulo) || 'Informação',
          observacao: valor,
          ativo: true
        }, 'return=minimal');
      }
      try {
        await api('projeto_historico', 'POST', {
          projeto_id: _uploadProjeto.id,
          acao: 'resposta_cliente',
          para_valor: ((t && t.titulo) || 'Informação') + ': ' + valor.slice(0, 80),
          criado_por: 'cliente (portal)'
        }, 'return=minimal');
      } catch(eH) { /* histórico é opcional */ }
      delete _editTexto[templateId];
      await recarregarListaDocsUpload();
      renderChecklistDocs();
    } catch(e) {
      alert('Não consegui salvar agora. Tenta de novo em instantes.');
      console.error('enviarRespostaTexto:', e);
    }
  }

  // ============================================================
  // ONDA 104c: GERADOR DE PROCURAÇÃO PRÉ-PREENCHIDA
  // ============================================================
  // - Espaçamento maior entre linhas (leading 6.8mm)
  // - Espaço extra acima da linha de assinatura
  // - Inclui responsável legal SE estiver cadastrado (pra PJ)
  // - Sem endereço da Zello
  // - Órgãos: DAEE (= SP Águas), CETESB, CATI, IBAMA, SEMIL
  // ============================================================
  // v73: órgãos da procuração — usa a seleção feita no painel
  // (projetos.procuracao_orgaos); sem seleção, mantém a lista padrão completa.
  function _orgaosProcuracaoTexto() {
    const NOMES = {
      'SP ÁGUAS': 'SP ÁGUAS (Agência de Águas do Estado de São Paulo)',
      'DAEE': 'SP ÁGUAS (Agência de Águas do Estado de São Paulo)',
      'CETESB': 'CETESB (Companhia Ambiental do Estado de São Paulo)',
      'CATI': 'CATI (Coordenadoria de Assistência Técnica Integral)',
      'IBAMA': 'IBAMA (Instituto Brasileiro do Meio Ambiente e dos Recursos Naturais Renováveis)',
      'SEMIL': 'SEMIL (Secretaria de Meio Ambiente, Infraestrutura e Logística)',
      'ANA': 'ANA (Agência Nacional de Águas e Saneamento Básico)',
      'VIGILÂNCIA SANITÁRIA': 'VIGILÂNCIA SANITÁRIA',
      'PREFEITURA MUNICIPAL': 'PREFEITURA MUNICIPAL'
    };
    const padrao = ['SP ÁGUAS', 'CETESB', 'CATI', 'IBAMA', 'SEMIL'];
    const sel = (_uploadProjeto && Array.isArray(_uploadProjeto.procuracao_orgaos) && _uploadProjeto.procuracao_orgaos.length)
      ? _uploadProjeto.procuracao_orgaos : padrao;
    return sel.map(function(o){
      const up = String(o).toUpperCase();
      for (var k in NOMES) { if (up.indexOf(k) !== -1) return NOMES[k]; }
      return up;
    }).join(', ');
  }

  // v74: dados da procuração compartilhados entre PDF e Word
  function _procDados() {
    const cli = _uploadCliente;
    if (!cli) {
      alert('Não foi possível carregar seus dados. Recarregue a página e tente novamente.');
      return null;
    }

    // Dados do OUTORGANTE (cliente)
    const nome = (cli.razao_social || cli.nome || '').trim();
    const cpfCnpj = (cli.cpf_cnpj || '').trim();
    const rua = (cli.endereco || cli.endereco_rua || '').trim();
    const numero = (cli.numero || cli.endereco_numero || '').trim();
    const bairro = (cli.bairro || cli.endereco_bairro || '').trim();
    const cidade = (cli.cidade || '').trim();
    const uf = (cli.estado || cli.endereco_uf || '').trim();
    const cep = (cli.cep || cli.endereco_cep || '').trim();

    // Responsável legal (só se cadastrado — caso de PJ)
    const respLegalNome = (cli.resp_legal_nome || '').trim();
    const respLegalCpf = (cli.resp_legal_cpf || '').trim();
    const temRespLegal = !!(respLegalNome && respLegalCpf);

    const enderecoCompleto = [
      rua + (numero ? ', ' + numero : ''),
      bairro,
      cidade + (uf ? '/' + uf : ''),
      cep ? 'CEP ' + cep : ''
    ].filter(function(p){ return p && p.trim() && p.trim() !== ','; }).join(' - ');

    // Detecta se outorgante é PJ ou PF (CNPJ = 14 dígitos, CPF = 11)
    const ehPJ = cpfCnpj.replace(/\D/g,'').length === 14;
    const labelDoc = ehPJ ? 'CNPJ' : 'CPF';
    const labelTipo = ehPJ
      ? 'pessoa jurídica de direito privado, inscrita no CNPJ sob o nº '
      : 'inscrito(a) no CPF sob o nº ';

    // Verifica o que falta
    // ONDA 104g: endereço removido — não vai mais na procuração
    const faltam = [];
    if (!nome) faltam.push('Nome / Razão Social');
    if (!cpfCnpj) faltam.push(labelDoc);

    if (faltam.length) {
      const msg = 'Alguns dados não estão cadastrados ainda:\n\n• ' + faltam.join('\n• ') +
        '\n\nVocê pode:\n1) Cancelar e pedir pra Zello atualizar seu cadastro\n2) Baixar a procuração com lacunas (___) pra preencher à mão\n\nDeseja baixar em branco?';
      if (!confirm(msg)) return null;
    }

    function ouLinha(v, n) {
      const s = v ? String(v).trim() : '';
      return s || '_'.repeat(n || 25);
    }

    // Aplica máscara em CPF (000.000.000-00) se vier só com dígitos
    function mascararCpf(v) {
      if (!v) return v;
      const num = String(v).replace(/\D/g,'');
      if (num.length === 11) {
        return num.slice(0,3) + '.' + num.slice(3,6) + '.' + num.slice(6,9) + '-' + num.slice(9);
      }
      return v;  // já tem máscara ou tamanho inesperado, mantém
    }

    // Aplica máscara em CNPJ (00.000.000/0000-00) se vier só com dígitos
    function mascararCnpj(v) {
      if (!v) return v;
      const num = String(v).replace(/\D/g,'');
      if (num.length === 14) {
        return num.slice(0,2) + '.' + num.slice(2,5) + '.' + num.slice(5,8) + '/' + num.slice(8,12) + '-' + num.slice(12);
      }
      return v;
    }
    function mascararDoc(v) {
      const num = String(v||'').replace(/\D/g,'');
      if (num.length === 11) return mascararCpf(v);
      if (num.length === 14) return mascararCnpj(v);
      return v;
    }

    // Dados do OUTORGADO (Zello + Eng. Guilherme) — SEM endereço (pediu pra tirar)
    const z = _uploadConfigZello || {};
    const engNome = ((z.resp_legal || 'GUILHERME MONTANARI OLIVEIRA').split(',')[0] || '').trim().toUpperCase();
    const engRg = z.rg || '14.288.261 SSP/MG';
    const engCpf = z.cpf || '085.727.916-55';
    const engCrea = z.crea || '5069519852';
    const empNome = (z.razao_social || 'Guilherme Montanari Oliveira Serviços de Engenharia').toUpperCase();
    const empCnpj = z.cnpj || '51.574.260/0001-01';

    // Data: hoje, formato extenso BR
    const hoje = new Date();
    const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    // ONDA 109: cidade vem da PROPRIEDADE do projeto (local do imóvel).
    // Fallback: cidade cadastrada do cliente. Último recurso: Ribeirão Preto.
    const prop = _uploadPropriedade || {};
    const cidadeData = (prop.cidade && prop.cidade.trim()) || cidade || 'Ribeirão Preto';
    const ufDaProp = (prop.estado && prop.estado.trim()) || '';
    const ufDaCidade = ufDaProp || uf || 'SP';
    const ufData = '/' + ufDaCidade;
    const dataExtenso = cidadeData + ufData + ', ' + hoje.getDate() + ' de ' + meses[hoje.getMonth()] + ' de ' + hoje.getFullYear() + '.';

    // Monta o texto — UM PARÁGRAFO ÚNICO
    // ONDA 104g: aplica máscara nos documentos (antes vinha 08572791655 sem máscara)
    const nomeOut = ouLinha(nome.toUpperCase(), 40);
    const docOut = ouLinha(mascararDoc(cpfCnpj), 20);
    const respCpfMasc = mascararCpf(respLegalCpf);

    // Identificação do outorgante — com ou sem responsável legal
    // ONDA 104g: endereço REMOVIDO da procuração (CNPJ/CPF já identifica
    // suficientemente o outorgante; evita lacuna feia quando endereço falta)
    let identOutorgante;
    if (ehPJ && temRespLegal) {
      identOutorgante =
        nomeOut + ', ' + labelTipo + docOut +
        ', neste ato representada por ' + respLegalNome.toUpperCase() +
        ', inscrito no CPF sob o nº ' + respCpfMasc + ',';
    } else {
      identOutorgante = nomeOut + ', ' + labelTipo + docOut + ',';
    }

    const paragrafoUnico =
      'Pelo presente instrumento particular de mandato ' + identOutorgante + ' ' +
      'nomeia e constitui seus bastantes procuradores o Sr. ' + engNome + ', ' +
      'portador da identidade RG nº ' + engRg + ', inscrito no CPF sob o nº ' + engCpf + ', ' +
      'inscrito no CREA sob o nº ' + engCrea + ', e a pessoa jurídica ' + empNome + ', ' +
      'inscrita no CNPJ sob o nº ' + empCnpj + ' ' +
      '(doravante denominada ZELLO AMBIENTAL), ' +
      'a quem confere poderes para representar-lhe junto a quaisquer órgãos ambientais competentes — incluindo, ' +
      'mas não se limitando a, ' + _orgaosProcuracaoTexto() + ' e demais órgãos federais, estaduais e municipais — ' +
      'para tratar de processos de regularização ambiental, podendo assinar os papéis e documentos necessários, ' +
      'dar entrada em processos, dar vistas em processos e registrá-los fotograficamente, retirar processos para ' +
      'obtenção de fotocópias, obter cópia de mídias digitais, apresentar e retirar documentos, concordar, ' +
      'discordar, aceitar, prestar informações, requerer outorgas, dispensas, licenças e autorizações ambientais, ' +
      'representar a outorgante em vistorias técnicas, receber notificações e intimações, e tudo o mais que ' +
      'necessário for para o fiel cumprimento deste mandato, ratificando todos os poderes outorgados, podendo ' +
      'praticar atos administrativos, pelo prazo de 02 (dois) anos. Ficando expressamente vedado aos outorgados ' +
      'assumir, reconhecer e confessar dívida em nome da outorgante.';

    
    return {
      nome: nome,
      cpfCnpj: cpfCnpj,
      labelDoc: labelDoc,
      paragrafoUnico: paragrafoUnico,
      dataExtenso: dataExtenso,
      nomeAssin: nome ? nome.toUpperCase() : '(NOME DO OUTORGANTE)',
      docAssin: cpfCnpj ? (labelDoc + ' nº ' + mascararDoc(cpfCnpj)) : '',
      respAssin: (ehPJ && temRespLegal) ? ('Por: ' + respLegalNome + ' — CPF ' + mascararCpf(respLegalCpf)) : ''
    };
  }

  function baixarProcuracao() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('Biblioteca de PDF não carregou. Recarregue a página.');
      return;
    }
    const d = _procDados();
    if (!d) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const W = 210, H = 297;
    const M = 22;
    const innerW = W - 2*M;
    let y = M;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('PROCURAÇÃO', W/2, y, { align: 'center' });
    y += 20;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const lineHeightFactor = 1.6;
    doc.setLineHeightFactor(lineHeightFactor);
    const fontSizeMm = 11 * 0.3528;
    const leadingMm = fontSizeMm * lineHeightFactor;
    const linhas = doc.splitTextToSize(d.paragrafoUnico, innerW);
    doc.text(linhas, M, y, { align: 'justify', maxWidth: innerW, lineHeightFactor: lineHeightFactor });
    y += linhas.length * leadingMm + 20;

    doc.text(d.dataExtenso, M, y);
    y += 55;

    doc.setLineWidth(0.4);
    doc.line(M + 15, y, M + innerW - 15, y);
    y += 5.5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(d.nomeAssin, W/2, y, { align: 'center' });
    if (d.docAssin) {
      y += 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text(d.docAssin, W/2, y, { align: 'center' });
    }
    if (d.respAssin) {
      y += 4.5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.text(d.respAssin, W/2, y, { align: 'center' });
    }

    const nomeArq = 'Procuracao_Zello_' + (d.nome ? d.nome.replace(/[^a-zA-Z0-9]+/g,'_').substr(0,40) : 'em_branco') + '.pdf';
    doc.save(nomeArq);
  }

  // v74: versão EDITÁVEL em Word (.doc) — mesmo conteúdo do PDF
  function baixarProcuracaoWord() {
    const d = _procDados();
    if (!d) return;
    const esc = escapeHtml;
    const html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>Procuração</title>' +
      '<style>@page{size:A4;margin:2.2cm;} body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;line-height:1.6;color:#000;} h1{text-align:center;font-size:16pt;letter-spacing:1px;margin:0 0 28pt 0;} p.j{text-align:justify;margin:0 0 14pt 0;} .data{margin:24pt 0 70pt 0;} .ass{text-align:center;} .linha{border-top:1px solid #000;width:70%;margin:0 auto 6pt auto;}</style></head><body>' +
      '<h1>PROCURAÇÃO</h1>' +
      '<p class="j">' + esc(d.paragrafoUnico) + '</p>' +
      '<p class="data">' + esc(d.dataExtenso) + '</p>' +
      '<div class="ass"><div class="linha"></div><b>' + esc(d.nomeAssin) + '</b>' +
      (d.docAssin ? '<br><span style="font-size:9.5pt;">' + esc(d.docAssin) + '</span>' : '') +
      (d.respAssin ? '<br><i style="font-size:9pt;">' + esc(d.respAssin) + '</i>' : '') +
      '</div></body></html>';
    const blob = new Blob(['\ufeff' + html], { type: 'application/msword' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Procuracao_Zello_' + (d.nome ? d.nome.replace(/[^a-zA-Z0-9]+/g,'_').substr(0,40) : 'em_branco') + '.doc';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ try { URL.revokeObjectURL(a.href); } catch(e){} }, 4000);
  }

  async function recarregarListaDocsUpload() {
    if (!_uploadProjeto) return;
    try {
      _uploadDocsExistentes = await api('documentos?projeto_id=eq.' + _uploadProjeto.id + '&ativo=eq.true&order=created_at.desc&select=*') || [];
    } catch(e) {
      _uploadDocsExistentes = [];
    }
    renderListaDocsUpload();
  }

  function renderListaDocsUpload() {
    const cont = $('upload-docs-lista');
    if (!cont) return;
    if (!_uploadDocsExistentes.length) {
      cont.innerHTML = '<div class="upload-empty">Nenhum documento enviado ainda.<br/>Toque na área acima para começar.</div>';
      return;
    }
    cont.innerHTML = _uploadDocsExistentes.map(function(d) {
      const dt = d.created_at ? new Date(d.created_at).toLocaleString('pt-BR', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '';
      return '<div class="upload-doc">' +
        '<div class="upload-doc-icon">✓</div>' +
        '<div class="upload-doc-body">' +
          '<div class="upload-doc-nome">' + (d.titulo || d.arquivo_nome || '(arquivo)') + '</div>' +
          '<div class="upload-doc-meta">' + (!d.arquivo_url && d.observacao ? escapeHtml(String(d.observacao)) + ' · ' + dt : 'enviado em ' + dt) + '</div>' +
        '</div>' +
        (d.arquivo_url ? '<a class="upload-doc-link" href="' + d.arquivo_url + '" target="_blank">Ver</a>' : '') +
      '</div>';
    }).join('');
  }

  function setupUploadHandlers() {
    const area = $('upload-area');
    const input = $('upload-input');
    if (!area || !input) return;

    // Click area abre seletor
    area.onclick = function(){ input.click(); };

    // Drag and drop
    area.ondragover = function(e){ e.preventDefault(); area.classList.add('drag-over'); };
    area.ondragleave = function(){ area.classList.remove('drag-over'); };
    area.ondrop = function(e){
      e.preventDefault();
      area.classList.remove('drag-over');
      const files = e.dataTransfer.files;
      if (files && files.length) processarUploadFiles(files);
    };

    // Input change
    input.onchange = function(e){
      const files = e.target.files;
      if (files && files.length) processarUploadFiles(files);
      input.value = '';
    };
  }

  // ONDA 108: comprime imagens grandes antes de subir (>2MB)
  // Reduz pra 1600px de largura mantendo proporção, qualidade JPEG 0.82.
  // Resolve travamento ao subir várias fotos do celular (que vêm 5-10MB cada).
  async function comprimirImagemSeGrande(file) {
    if (!file.type.startsWith('image/')) return file;
    if (file.size <= 2 * 1024 * 1024) return file;  // <=2MB passa direto
    if (file.type === 'image/gif') return file;  // GIF mantém

    try {
      const img = await new Promise(function(resolve, reject) {
        const i = new Image();
        i.onload = function() { resolve(i); };
        i.onerror = reject;
        i.src = URL.createObjectURL(file);
      });

      const MAX_W = 1600;
      let w = img.naturalWidth, h = img.naturalHeight;
      if (w > MAX_W) {
        h = Math.round(h * (MAX_W / w));
        w = MAX_W;
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);

      const blob = await new Promise(function(resolve) {
        canvas.toBlob(resolve, 'image/jpeg', 0.82);
      });

      // Libera memória da img
      URL.revokeObjectURL(img.src);
      img.src = '';

      // Cria um File-like com nome
      const nomeBase = file.name.replace(/\.[^.]+$/, '');
      return new File([blob], nomeBase + '.jpg', { type: 'image/jpeg' });
    } catch(e) {
      console.warn('Falha ao comprimir, usando original:', e);
      return file;
    }
  }

  async function processarUploadFiles(files, templateId) {
    if (!_uploadProjeto) return;
    const prog = $('upload-progress');
    const progFill = $('upload-progress-fill');
    const progText = $('upload-progress-text');

    // Se for upload vinculado a template e já existe doc anterior, marca pra arquivar
    let docAnteriorId = null;
    if (templateId) {
      const ant = _uploadDocsExistentes.find(function(d){ return d.template_id === templateId; });
      if (ant) docAnteriorId = ant.id;
    }

    // Se templateId, lookup do título do template
    let tituloTemplate = null;
    if (templateId) {
      const t = (_uploadTemplates || []).find(function(x){ return x.id === templateId; });
      if (t) tituloTemplate = t.titulo;
    }

    prog.classList.add('active');
    let okCount = 0, errCount = 0;
    const erros = [];

    // ONDA 108: converte FileList → Array (pra log/debug mais fácil)
    const arr = Array.from(files);
    console.log('[upload] iniciando ' + arr.length + ' arquivo(s)');

    for (let i = 0; i < arr.length; i++) {
      let f = arr[i];
      progText.textContent = 'Enviando ' + (i+1) + '/' + arr.length + ': ' + f.name;
      progFill.style.width = ((i / arr.length) * 100) + '%';

      // Limite de tamanho: 10MB
      if (f.size > 10 * 1024 * 1024) {
        errCount++;
        erros.push(f.name + ' (>10MB)');
        console.warn('[upload] ' + f.name + ' acima de 10MB, ignorado');
        continue;
      }

      // ONDA 108: comprime fotos grandes ANTES de subir (>2MB)
      try {
        const tamanhoOriginal = f.size;
        f = await comprimirImagemSeGrande(f);
        if (f.size < tamanhoOriginal) {
          console.log('[upload] ' + f.name + ' comprimido: ' +
            Math.round(tamanhoOriginal/1024) + 'KB → ' + Math.round(f.size/1024) + 'KB');
        }
      } catch(e) {
        console.warn('[upload] falha ao comprimir, segue com original:', e);
      }

      try {
        // 1. Upload pro Storage
        const ext = (f.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g,'');
        const safeNome = f.name.replace(/[^\w.-]/g, '_').substring(0, 80);
        const path = 'projetos/' + _uploadProjeto.id.replace(/-/g,'') + '/' + Date.now() + '_' + safeNome;
        const upR = await fetch(SUPABASE_URL + '/storage/v1/object/' + STORAGE_BUCKET + '/' + path, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Content-Type': f.type || 'application/octet-stream'
          },
          body: f
        });
        if (!upR.ok) throw new Error('Storage HTTP ' + upR.status);
        const arquivoUrl = SUPABASE_URL + '/storage/v1/object/public/' + STORAGE_BUCKET + '/' + path;

        // 2. Cria registro na tabela documentos
        await api('documentos', 'POST', {
          projeto_id: _uploadProjeto.id,
          cliente_id: _uploadProjeto.cliente_id,
          propriedade_id: _uploadProjeto.propriedade_id,
          template_id: templateId || null,
          tipo: 'outro',
          titulo: tituloTemplate || f.name,
          observacao: 'Enviado pelo cliente via portal' + (tituloTemplate ? ' (' + tituloTemplate + ')' : ''),
          arquivo_url: arquivoUrl,
          arquivo_nome: f.name,
          visivel_cliente: true,  // v65: documento enviado pelo cliente aparece pra ele na aba Documentos
          ativo: true
        }, 'return=minimal');

        // 2b. Se re-upload, desativa o anterior (não exclui pra manter rastreio)
        if (docAnteriorId) {
          try {
            await api('documentos?id=eq.' + docAnteriorId, 'PATCH', { ativo: false }, 'return=minimal');
          } catch(e) { /* ignora */ }
        }

        // 3. Histórico do projeto
        try {
          await api('projeto_historico', 'POST', {
            projeto_id: _uploadProjeto.id,
            acao: 'upload_cliente',
            para_valor: f.name,
            criado_por: 'cliente (portal)'
          }, 'return=minimal');
        } catch(e) { /* ignora */ }

        okCount++;
        progFill.style.width = (((i+1) / arr.length) * 100) + '%';
        console.log('[upload] ✓ ' + f.name);
      } catch(e) {
        console.error('[upload] ✗ ' + f.name + ':', e);
        errCount++;
        erros.push(f.name + ' (' + (e.message || 'erro') + ')');
      }

      // ONDA 108: libera referência do arquivo pra ajudar o GC do navegador.
      // Sem isso, com muitas fotos grandes do celular, a memória estoura.
      arr[i] = null;
      f = null;
    }

    console.log('[upload] finalizado: ' + okCount + ' ok, ' + errCount + ' erros');
    progText.textContent = '✓ ' + okCount + ' enviado(s)' + (errCount ? ' · ⚠ ' + errCount + ' falha(s): ' + erros.slice(0,3).join(', ') : '');
    setTimeout(function(){
      prog.classList.remove('active');
      progFill.style.width = '0%';
    }, errCount > 0 ? 6000 : 3000);

    await recarregarListaDocsUpload();
    // FASE 3A: atualiza checklist
    if (typeof recarregarChecklistDocs === 'function') await recarregarChecklistDocs();
  }

  // ===========================================================================
  // EVENTOS
  // ===========================================================================
  // ===========================================================================
  // FASE 3B: Listener uppercase para campos .upper
  // ===========================================================================
  function instalarListenerUpperCliente() {
    document.addEventListener('input', function(e) {
      const el = e.target;
      if (!el || !el.classList) return;
      if (!el.classList.contains('upper')) return;
      if (el.type === 'email' || el.type === 'url' || el.type === 'password') return;
      const v = el.value;
      if (!v) return;
      const up = v.toUpperCase();
      if (v !== up) {
        const start = el.selectionStart;
        const end = el.selectionEnd;
        el.value = up;
        try { el.setSelectionRange(start, end); } catch(_) {}
      }
    }, true);
  }
  instalarListenerUpperCliente();

  // ONDA C.3: Detector de offline — banner no topo quando a rede cai.
  // Usa navigator.onLine + eventos online/offline nativos.
  // Limitação: detecta queda de rede no dispositivo, não se o Supabase caiu.
  let _ocultarBannerTimer = null;

  function _atualizarBannerOffline(evento) {
    const banner = document.getElementById('banner-offline');
    const msg = document.getElementById('banner-offline-msg');
    if (!banner || !msg) return;

    if (_ocultarBannerTimer) {
      clearTimeout(_ocultarBannerTimer);
      _ocultarBannerTimer = null;
    }

    if (!navigator.onLine) {
      banner.style.background = '#DC2626'; // vermelho
      msg.textContent = '⚠ Sem conexão — verifique sua internet';
      banner.style.display = 'block';
    } else if (evento === 'online') {
      banner.style.background = '#16A34A'; // verde
      msg.textContent = '✓ Conexão restabelecida';
      banner.style.display = 'block';
      _ocultarBannerTimer = setTimeout(function() {
        banner.style.display = 'none';
      }, 3000);
    } else {
      banner.style.display = 'none';
    }
  }

  function _ativarDetectorOffline() {
    _atualizarBannerOffline(null);
    window.addEventListener('online', function() { _atualizarBannerOffline('online'); });
    window.addEventListener('offline', function() { _atualizarBannerOffline('offline'); });
  }

  document.addEventListener('DOMContentLoaded', function(){
    _ativarDetectorOffline();   // ONDA C.3: ativa banner de offline
    setupFotoUpload();
    $('mes-ref').addEventListener('change', atualizarLeituraAnterior);
    $('leitura-atual').addEventListener('input', atualizarConsumo);
    $('leitura-anterior').addEventListener('input', atualizarConsumo);

    init();
  });

  // ===========================================================================
  // ONDA 111: LGPD — Termo de aceite, exportação e exclusão de dados
  // ===========================================================================
  var LGPD_VERSAO_ATUAL = '1.0';  // bumpar quando alterar a política

  // Verifica se cliente já aceitou a versão atual do termo. Se não, mostra modal.
  async function verificarAceiteLgpd(clienteId) {
    if (!clienteId) return;
    try {
      const consents = await api(
        'consentimentos_lgpd?cliente_id=eq.' + clienteId
        + '&tipo=eq.aceite_termo&versao_termo=eq.' + LGPD_VERSAO_ATUAL
        + '&select=id&limit=1'
      );
      if (consents && consents.length) return;  // já aceitou esta versão, ok
      // Não aceitou — abre modal depois que o init terminar
      setTimeout(function(){ mostrarModalLgpd(); }, 800);
    } catch(e) {
      console.warn('Erro verificando LGPD:', e);
    }
  }

  function mostrarModalLgpd() {
    const m = document.getElementById('modal-lgpd-aceite');
    if (!m) return;
    m.classList.remove('hidden');
    const cb = document.getElementById('lgpd-checkbox');
    const btn = document.getElementById('btn-aceitar-lgpd');
    if (cb && btn) {
      cb.checked = false;
      btn.disabled = true;
      cb.onchange = function(){ btn.disabled = !cb.checked; };
    }
  }

  function fecharModalLgpd() {
    const m = document.getElementById('modal-lgpd-aceite');
    if (m) m.classList.add('hidden');
  }

  // ONDA A.2: "Mais tarde" — fecha modal sem registrar nada. Cliente verá de
  // novo no próximo acesso. Diferente de recusarLgpd() (que desloga o cliente).
  function adiarLgpd() {
    fecharModalLgpd();
  }

  // ONDA A.2: descobre cliente_id de qualquer modo de acesso (login PIN, token de
  // leitura, token de upload). Antes só pegava da sessão (login PIN), o que fazia
  // o "Aceitar" virar no-op quando entrava por token.
  function _lgpdGetClienteId() {
    const sess = getCliSessao();
    if (sess && sess.id) return sess.id;
    if (state && state.cliente && state.cliente.id) return state.cliente.id;
    if (state && state.uso && state.uso.cliente_id) return state.uso.cliente_id;
    if (typeof _uploadProjeto !== 'undefined' && _uploadProjeto && _uploadProjeto.cliente_id) {
      return _uploadProjeto.cliente_id;
    }
    return null;
  }

  // Cliente aceitou — registra evidência no banco
  async function aceitarLgpd() {
    // ONDA A.2: aceita também acesso por token (não só sessão de login PIN)
    const clienteId = _lgpdGetClienteId();
    if (!clienteId) { fecharModalLgpd(); return; }

    const btn = document.getElementById('btn-aceitar-lgpd');
    if (btn) { btn.disabled = true; btn.textContent = 'Salvando...'; }

    try {
      // Pega IP do cliente (sem dependência externa, via header do Supabase)
      // Se não conseguir, fica null mesmo — registro continua válido.
      let ip = null;
      try {
        const ipR = await fetch('https://api.ipify.org?format=json');
        const ipJ = await ipR.json();
        ip = ipJ && ipJ.ip ? String(ipJ.ip).substring(0, 45) : null;
      } catch(e) { /* sem ip, segue */ }

      await api('consentimentos_lgpd', 'POST', {
        cliente_id: clienteId,
        tipo: 'aceite_termo',
        versao_termo: LGPD_VERSAO_ATUAL,
        ip: ip,
        user_agent: (navigator.userAgent || '').substring(0, 500),
        observacao: 'Aceite registrado via portal do cliente.',
        status: 'registrado'
      }, 'return=minimal');
      fecharModalLgpd();
      // ONDA A.1: era toastSuccess (não existia no portal cliente), trocado por zAlert.
      zAlert('✓ Obrigado! Seu consentimento foi registrado.', 'sucesso');
    } catch(e) {
      console.error('Erro ao registrar aceite LGPD:', e);
      zAlert('Erro ao salvar. Tente novamente em alguns segundos.', 'erro');
      if (btn) { btn.disabled = false; btn.textContent = 'Aceitar e continuar'; }
    }
  }

  // Cliente não concorda — explica que sem aceite não pode usar o portal e desloga
  async function recusarLgpd() {
    const ok = window.confirm(
      'Sem o seu aceite, não podemos disponibilizar o portal.\n\n' +
      'Você pode sair agora e voltar quando quiser.\n\n' +
      'Para dúvidas, entre em contato:\n' +
      '📧 contato@zelloambiental.com.br\n' +
      '📱 (16) 98142-7633\n\n' +
      'Deseja sair do portal?'
    );
    if (!ok) return;
    limparCliSessao();
    location.reload();
  }

  // LGPD: cliente baixa todos os dados que temos sobre ele (direito à portabilidade)
  async function baixarMeusDadosLgpd() {
    const sess = getCliSessao();
    if (!sess || !sess.id) { alert('Sessão expirada. Faça login novamente.'); return; }

    if (!window.confirm('Vamos gerar um arquivo JSON com todos os seus dados que temos. Continuar?')) return;

    try {
      // Busca todos os dados relacionados ao cliente
      const cid = sess.id;
      const [cliente, propriedades, usos, contatos, documentos, leituras, historico, consentimentos] = await Promise.all([
        api('clientes?id=eq.' + cid + '&select=' + CLIENTES_COLS_SAFE).catch(function(){ return []; }),
        api('propriedades?cliente_id=eq.' + cid + '&select=*').catch(function(){ return []; }),
        api('usos?cliente_id=eq.' + cid + '&select=*').catch(function(){ return []; }),
        api('contatos?cliente_id=eq.' + cid + '&select=*').catch(function(){ return []; }),
        api('documentos?cliente_id=eq.' + cid + '&select=*').catch(function(){ return []; }),
        api('leituras?cliente_id=eq.' + cid + '&select=*').catch(function(){ return []; }),
        api('historico_contatos?cliente_id=eq.' + cid + '&select=*').catch(function(){ return []; }),
        api('consentimentos_lgpd?cliente_id=eq.' + cid + '&select=*').catch(function(){ return []; })
      ]);

      const pacote = {
        gerado_em: new Date().toISOString(),
        gerado_por: 'Portal Zello Ambiental — Solicitação LGPD do titular',
        versao_politica_privacidade: LGPD_VERSAO_ATUAL,
        cliente: (cliente && cliente[0]) || null,
        propriedades: propriedades || [],
        usos_outorgas: usos || [],
        contatos: contatos || [],
        documentos: documentos || [],
        leituras: leituras || [],
        historico_de_contatos: historico || [],
        registros_lgpd: consentimentos || []
      };

      // Remove campos sensíveis internos (não retorna pin_hash mesmo na portabilidade)
      if (pacote.cliente) {
        delete pacote.cliente.pin_hash;
      }

      // Registra que baixou
      await api('consentimentos_lgpd', 'POST', {
        cliente_id: cid,
        tipo: 'dados_baixados',
        versao_termo: LGPD_VERSAO_ATUAL,
        observacao: 'Cliente exportou seus dados via portal.',
        status: 'processado'
      }, 'return=minimal').catch(function(){});

      // Dispara download
      const blob = new Blob([JSON.stringify(pacote, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const nomeArquivo = 'meus_dados_zello_' + (new Date().toISOString().slice(0,10)) + '.json';
      a.download = nomeArquivo;
      document.body.appendChild(a);
      a.click();
      setTimeout(function(){ document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);

      // ONDA A.1: era toastSuccess (não existia no portal cliente), trocado por zAlert.
      zAlert('✓ Arquivo baixado: ' + nomeArquivo, 'sucesso');
    } catch(e) {
      console.error('Erro ao baixar dados LGPD:', e);
      zAlert('Erro ao gerar arquivo. Tente novamente ou entre em contato:\ncontato@zelloambiental.com.br', 'erro');
    }
  }

  // LGPD: cliente solicita exclusão. Não apaga direto — cria pedido pendente.
  async function solicitarExclusaoLgpd() {
    const sess = getCliSessao();
    if (!sess || !sess.id) { alert('Sessão expirada. Faça login novamente.'); return; }

    const motivo = window.prompt(
      'Solicitação de exclusão de dados\n\n' +
      'Sua solicitação será analisada pela Zello em até 15 dias úteis.\n' +
      'Atenção: contratos em andamento e obrigações legais (retenção fiscal, ' +
      'processos públicos) podem impedir a exclusão total — neste caso, ' +
      'faremos a anonimização ou aguardaremos o prazo legal.\n\n' +
      'Por favor, descreva o motivo da solicitação (opcional):'
    );
    if (motivo === null) return;  // cancelou

    if (!window.confirm(
      '⚠️ Confirma o pedido de exclusão dos seus dados?\n\n' +
      'Você receberá um retorno em até 15 dias úteis pelo telefone ou e-mail cadastrado.'
    )) return;

    try {
      await api('consentimentos_lgpd', 'POST', {
        cliente_id: sess.id,
        tipo: 'solicitacao_exclusao',
        versao_termo: LGPD_VERSAO_ATUAL,
        observacao: 'Pedido pelo portal. Motivo informado: ' + (motivo || '(não informado)'),
        status: 'pendente'
      }, 'return=minimal');

      alert(
        '✓ Solicitação registrada com sucesso!\n\n' +
        'A Zello vai analisar seu pedido e retornar em até 15 dias úteis pelo ' +
        'seu telefone ou e-mail cadastrado.\n\n' +
        'Se precisar de retorno mais rápido:\n' +
        '📧 contato@zelloambiental.com.br\n' +
        '📱 (16) 98142-7633'
      );
    } catch(e) {
      console.error('Erro ao solicitar exclusão LGPD:', e);
      alert('Erro ao registrar pedido. Tente novamente ou entre em contato:\ncontato@zelloambiental.com.br');
    }
  }

  // ===========================================================================
  // SEMANA 4.20 FIX: Exporta pro window TUDO que o HTML chama via onclick
  // (essas funções estão dentro da IIFE e precisam virar globais)
  // ===========================================================================
  window.doLoginCliente = doLoginCliente;
  window.doLogoutCliente = doLogoutCliente;
  window.abrirTrocarPin = abrirTrocarPin;

  // v66: recolhe/expande as demais opções da aba Meus Dados
  function _toggleLgpdMais() {
    var box = document.getElementById('lgpd-mais');
    var seta = document.getElementById('lgpd-mais-seta');
    if (!box) return;
    var aberto = box.style.display !== 'none';
    box.style.display = aberto ? 'none' : 'block';
    if (seta) seta.textContent = aberto ? '▾' : '▴';
  }
  window._toggleLgpdMais = _toggleLgpdMais;
  window.enviarLeitura = enviarLeitura;
  window.fecharModal = fecharModal;
  window.mascaraCpfCnpj = mascaraCpfCnpj;
  window.removerFoto = removerFoto;
  window.trocarTab = trocarTab;
  window.trocarUso = trocarUso;
  window.voltarPortal = voltarPortal;
  window.uploadDocTemplate = uploadDocTemplate;
  window.reuploadTemplate = reuploadTemplate;
  window.baixarProcuracao = baixarProcuracao;
  window.setState = setState;  // referenciado em onclick="setState('login')"
  // ONDA 111 (LGPD)
  window.aceitarLgpd = aceitarLgpd;
  window.recusarLgpd = recusarLgpd;
  window.adiarLgpd = adiarLgpd;  // ONDA A.2: botão "Mais tarde"
  window.baixarMeusDadosLgpd = baixarMeusDadosLgpd;
  window.solicitarExclusaoLgpd = solicitarExclusaoLgpd;

})();
// ============================================================
// FIM DA IIFE PRINCIPAL DO PORTAL
// ============================================================
