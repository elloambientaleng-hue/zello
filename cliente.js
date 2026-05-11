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
  // ===========================================================================
  // CONFIGURAÇÃO SUPABASE
  // ===========================================================================
  const SUPABASE_URL = 'https://evxolmfwblxtmudksmnt.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eG9sbWZ3Ymx4dG11ZGtzbW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MzQxNTgsImV4cCI6MjA5MzMxMDE1OH0.v7uvLbz6NJoa4K0_KT9bKm5-M4mVAZ__77Tbqfef9fA';
  const STORAGE_BUCKET = 'documentos-zello';

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
  async function api(path, method, body, prefer) {
    method = method || 'GET';
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
    if (method === 'GET') {
      if (!r.ok) throw new Error('GET ' + path + ' falhou: ' + r.status);
      return await r.json();
    }
    return r;
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

  // Submete o formulário de login do cliente (CPF + PIN)
  async function doLoginCliente(ev) {
    if (ev) ev.preventDefault();
    const cpf = (document.getElementById('login-cli-cpf').value || '').replace(/\D/g, '');
    const pin = (document.getElementById('login-cli-pin').value || '').trim();
    const erroEl = document.getElementById('login-cli-erro');
    const btn = document.getElementById('login-cli-btn');

    if (!cpf || cpf.length < 11) {
      erroEl.textContent = 'CPF/CNPJ inválido.';
      erroEl.style.display = 'block';
      return false;
    }
    if (!/^\d{6}$/.test(pin)) {
      erroEl.textContent = 'PIN deve ter 6 dígitos numéricos.';
      erroEl.style.display = 'block';
      return false;
    }

    erroEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Entrando...';

    try {
      const hash = await hashSenha(pin);

      // Tenta encontrar o cliente em diferentes formatos de CPF/CNPJ.
      // Isso é necessário porque o cadastro pode salvar com ou sem formatação
      // (ex: "085.727.916-55" vs "08572791655").
      // Estratégia: monta os formatos possíveis e tenta cada um.
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
        erroEl.textContent = 'CPF/CNPJ ou PIN incorretos.';
        erroEl.style.display = 'block';
        return false;
      }
      if (cliente.portal_ativo === false) {
        erroEl.textContent = 'Acesso ao portal desativado. Entre em contato com a Zello.';
        erroEl.style.display = 'block';
        return false;
      }
      if (!cliente.pin_hash) {
        erroEl.textContent = 'PIN ainda não definido. Entre em contato com a Zello para receber seu PIN.';
        erroEl.style.display = 'block';
        return false;
      }
      if (cliente.pin_hash !== hash) {
        erroEl.textContent = 'CPF/CNPJ ou PIN incorretos.';
        erroEl.style.display = 'block';
        return false;
      }

      setCliSessao(cliente);
      // Atualiza ultimo_acesso (não bloqueia)
      api('clientes?id=eq.' + cliente.id, 'PATCH', { ultimo_acesso: new Date().toISOString() }, 'return=minimal').catch(function(){});

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

  function doLogoutCliente() {
    if (!confirm('Sair da sua conta?')) return;
    limparCliSessao();
    location.reload();
  }

  // Trocar PIN: cliente faz sozinho enquanto está logado
  async function abrirTrocarPin() {
    const sess = getCliSessao();
    if (!sess) { alert('Você precisa estar logado para trocar o PIN.'); return; }

    const pinAtual = prompt('PIN atual (6 dígitos):');
    if (!pinAtual) return;
    if (!/^\d{6}$/.test(pinAtual)) { alert('PIN deve ter 6 dígitos numéricos.'); return; }

    const pinNovo = prompt('Novo PIN (6 dígitos):');
    if (!pinNovo) return;
    if (!/^\d{6}$/.test(pinNovo)) { alert('PIN deve ter 6 dígitos numéricos.'); return; }
    if (pinNovo === '000000' || pinNovo === '123456' || pinNovo === '111111') {
      if (!confirm('⚠️ Este PIN é muito simples e fácil de adivinhar. Tem certeza que quer usar este PIN?')) return;
    }

    const conf = prompt('Confirme o novo PIN:');
    if (conf !== pinNovo) { alert('A confirmação não bate com o novo PIN.'); return; }

    try {
      // Verifica se PIN atual está correto
      const hashAtual = await hashSenha(pinAtual);
      const list = await api('clientes?id=eq.' + sess.id + '&select=pin_hash');
      if (!list || !list[0] || list[0].pin_hash !== hashAtual) {
        alert('❌ PIN atual incorreto.');
        return;
      }
      // Atualiza
      const hashNovo = await hashSenha(pinNovo);
      const r = await api('clientes?id=eq.' + sess.id, 'PATCH', { pin_hash: hashNovo }, 'return=minimal');
      if (r && r.ok) {
        alert('✅ PIN alterado com sucesso!\n\nNa próxima vez que você fizer login, use o PIN novo.');
      } else {
        alert('Erro ao alterar PIN. Tente novamente.');
      }
    } catch (e) {
      alert('Erro: ' + (e.message || e));
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
    } catch (e) {
      console.error(e);
      mostrarErro('🌐', 'Erro de conexão', 'Não foi possível carregar seus dados. Verifique sua internet e tente novamente.');
    }
  }

  // Carrega o portal a partir de um cliente_id (login via PIN)
  // Quando o cliente tem múltiplos usos, mostra todos e o cliente escolhe
  async function carregarPortalPorCliente(clienteId) {
    try {
      // Busca todos os usos ATIVOS desse cliente
      const usos = await api('usos?cliente_id=eq.' + clienteId + '&ativo=eq.true&select=*');
      if (!usos || usos.length === 0) {
        mostrarErro('⚠️', 'Sem pontos cadastrados', 'Não encontramos pontos de captação cadastrados em sua conta. Entre em contato com a Zello.');
        return;
      }

      state.usosCliente = usos;
      // Se selecionou um uso antes (via seletor), respeita; senão usa o primeiro
      const usoIdEscolhido = state.usoSelecionadoId || usos[0].id;
      state.uso = usos.find(function(u){ return u.id === usoIdEscolhido; }) || usos[0];
      state.usoSelecionadoId = state.uso.id;

      await finalizarCarregamentoPortal();
    } catch (e) {
      console.error(e);
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
      api('clientes?id=eq.' + state.uso.cliente_id + '&select=*'),
      state.uso.propriedade_id ? api('propriedades?id=eq.' + state.uso.propriedade_id + '&select=*') : Promise.resolve([]),
      api('leituras?uso_id=eq.' + state.uso.id + '&select=*&order=mes_referencia.desc&limit=24'),
      api('documentos?' + orFilter + '&select=*&order=data_vencimento.asc').catch(function(){ return []; })
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
    renderDocumentosTab();
    renderHistoricoTab();

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

    // Seletor de uso: só quando logado E há múltiplos usos
    const seletorWrap = $('cli-seletor-uso');
    const select = $('cli-uso-select');
    if (state.viaLogin && state.usosCliente && state.usosCliente.length > 1) {
      select.innerHTML = state.usosCliente.map(function(u){
        return '<option value="' + u.id + '"' + (u.id === state.uso.id ? ' selected' : '') + '>'
          + (u.descricao || 'Ponto') + (u.numero_serie ? ' (' + u.numero_serie + ')' : '')
          + '</option>';
      }).join('');
      seletorWrap.style.display = 'block';
    } else {
      seletorWrap.style.display = 'none';
    }

    // Botões de ação (Acessar conta completa / Trocar PIN / Sair)
    const acoes = $('cli-acoes');
    if (state.viaLogin) {
      // Logado: botões "Trocar PIN" e "Sair"
      acoes.innerHTML =
        '<button class="btn btn-secondary btn-sm" onclick="abrirTrocarPin()" style="font-size:12px;padding:6px 12px;">🔑 Trocar PIN</button>'
        + '<button class="btn btn-secondary btn-sm" onclick="doLogoutCliente()" style="font-size:12px;padding:6px 12px;">↪ Sair da conta</button>';
      acoes.style.display = 'flex';
    } else if (state.cliente && state.cliente.pin_hash) {
      // Veio por token mas tem PIN configurado: oferece login
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
        orgao: 'DAEE',
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
  function renderHistoricoTab() {
    const lista = $('historico-lista');
    if (!state.leiturasOrdenadas.length) {
      lista.innerHTML = '<div class="hist-vazio"><div class="hist-vazio-emoji">📊</div><div>Nenhuma leitura registrada ainda.</div><div style="margin-top:6px;font-size:11px;">Após enviar sua primeira leitura, ela aparecerá aqui.</div></div>';
      $('historico-stats').style.display = 'none';
      $('historico-grafico-wrap').style.display = 'none';
      return;
    }

    // Stats
    const total = state.leiturasOrdenadas.reduce(function(s,l){ return s + (parseFloat(l.consumo_m3) || 0); }, 0);
    const media = total / state.leiturasOrdenadas.length;
    $('hist-total').textContent = fmtNum(total) + ' m³';
    $('hist-media').textContent = fmtNum(media) + ' m³';
    $('historico-stats').style.display = 'block';

    // Lista (mais recente primeiro, máx 12)
    const aut = getAutorizadoMes(state.uso);
    const itens = state.leiturasOrdenadas.slice(0, 12);
    lista.innerHTML = itens.map(function(l){
      const consumo = parseFloat(l.consumo_m3) || 0;
      const acima = aut > 0 && consumo > aut;
      return '<div class="historico-item">'
        + '<div>'
        +   '<div class="hist-mes">' + fmtMes(l.mes_referencia) + '</div>'
        +   '<div class="hist-data">Enviado em ' + fmtData(l.enviado_em) + '</div>'
        + '</div>'
        + '<div class="hist-consumo' + (acima ? ' hist-acima' : '') + '">'
        +   fmtNum(consumo) + ' m³'
        +   (acima ? ' ⚠️' : '')
        + '</div>'
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
    if (isNaN(lAtu) || lAtu === '') {
      alert('Informe a leitura atual do hidrômetro.');
      $('leitura-atual').focus();
      return;
    }
    if (lAtu < lAnt) {
      alert('A leitura atual (' + fmtNum(lAtu) + ' m³) está menor que a anterior (' + fmtNum(lAnt) + ' m³).\n\nIsso só seria possível se o hidrômetro tivesse sido trocado. Confira o número e tente novamente. Se realmente o hidrômetro foi trocado, entre em contato com a Zello.');
      return;
    }

    const consumo = lAtu - lAnt;
    const aut = getAutorizadoMes(state.uso);

    // Confirmações
    if (state.leiturasNoMes) {
      const ok = await confirmar(
        '🔄 Substituir leitura existente',
        'Já existe uma leitura cadastrada para ' + fmtMes(mes) + ' (' + fmtNum(state.leiturasNoMes.consumo_m3) + ' m³).\n\nDeseja substituí-la pela nova leitura (' + fmtNum(consumo) + ' m³)?'
      );
      if (!ok) return;
    } else if (aut > 0 && consumo > aut) {
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
        observacao: obs || null,
        enviado_em: new Date().toISOString()
      };
      if (fotoUrl) payload.foto_equipamento_url = fotoUrl;

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
        // Se a coluna foto não existe ainda no banco (ambiente antigo), tenta sem ela
        const colunaFoto = (txtErro.indexOf('foto_equipamento_url') >= 0)
          || (txtErro.toLowerCase().indexOf('column') >= 0 && fotoUrl);
        if (colunaFoto && fotoUrl) {
          delete payload.foto_equipamento_url;
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
          console.warn('Foto não foi salva: coluna foto_equipamento_url ainda não existe na tabela leituras.');
        } else {
          throw new Error('Erro ao salvar: ' + txtErro.substring(0, 200));
        }
      }

      // Sucesso!
      $('sucesso-resumo').innerHTML =
        '<div style="font-size:11px;font-weight:500;color:var(--text-muted);margin-bottom:4px;">' + fmtMes(mes) + '</div>'
        + 'Consumo: ' + fmtNum(consumo) + ' m³';

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

      // Busca cliente e propriedade
      let cli = null, prop = null;
      try {
        const cR = await api('clientes?id=eq.' + proj.cliente_id + '&select=nome,telefone1');
        cli = cR && cR[0];
      } catch(e) {}
      try {
        const pR = await api('propriedades?id=eq.' + proj.propriedade_id + '&select=nome,cidade');
        prop = pR && pR[0];
      } catch(e) {}

      const ETAPAS = ['📋 Vistoria técnica','📥 Protocolo DAEE','🔍 Análise / Exigências','📰 Publicação'];
      $('upload-cliente-nome').textContent = (cli && cli.nome) || '(cliente)';
      $('upload-projeto-info').textContent = '📍 ' + ((prop && prop.nome) || '—') + (prop && prop.cidade ? ' (' + prop.cidade + ')' : '') + ' · ' + (proj.nome || '');
      $('upload-etapa-atual').textContent = 'Etapa atual: ' + (ETAPAS[(proj.etapa_atual||1) - 1] || '—');

      // Carrega documentos já enviados via este token
      await recarregarListaDocsUpload();

      // FASE 3A: carrega templates da etapa atual e renderiza checklist
      await recarregarChecklistDocs();

      setState('upload');
      setupUploadHandlers();
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
      const cls = feito ? 'feito' : (obrig ? '' : 'opcional');
      const ic = feito ? '✓' : (obrig ? '📥' : '○');
      const tagObrig = obrig && !feito ? '<span class="obrig-tag">OBRIGATÓRIO</span>' : '';
      const statusLine = feito
        ? '<div class="checklist-status">✓ enviado em ' + new Date(env.created_at).toLocaleDateString('pt-BR') + '</div>'
        : '';
      const btn = feito
        ? '<button class="checklist-btn feito" onclick="reuploadTemplate(\'' + t.id + '\')">Re-enviar</button>'
        : '<button class="checklist-btn" onclick="uploadDocTemplate(\'' + t.id + '\')">📤 Enviar</button>';
      return '<div class="checklist-item ' + cls + '">' +
        '<div class="checklist-ic">' + ic + '</div>' +
        '<div class="checklist-body">' +
          '<div class="checklist-titulo">' + escapeHtml(t.titulo) + tagObrig + '</div>' +
          (t.descricao ? '<div class="checklist-desc">' + escapeHtml(t.descricao) + '</div>' : '') +
          statusLine +
        '</div>' +
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
          '<div class="upload-doc-meta">enviado em ' + dt + '</div>' +
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

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      progText.textContent = 'Enviando ' + (i+1) + '/' + files.length + ': ' + f.name;
      progFill.style.width = ((i / files.length) * 100) + '%';

      // Limite de tamanho: 10MB
      if (f.size > 10 * 1024 * 1024) {
        errCount++;
        continue;
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
        progFill.style.width = (((i+1) / files.length) * 100) + '%';
      } catch(e) {
        console.error('Erro upload:', e);
        errCount++;
      }
    }

    progText.textContent = '✓ ' + okCount + ' enviado(s)' + (errCount ? ' · ⚠ ' + errCount + ' falha(s)' : '');
    setTimeout(function(){
      prog.classList.remove('active');
      progFill.style.width = '0%';
    }, 3000);

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

  document.addEventListener('DOMContentLoaded', function(){
    setupFotoUpload();
    $('mes-ref').addEventListener('change', atualizarLeituraAnterior);
    $('leitura-atual').addEventListener('input', atualizarConsumo);
    $('leitura-anterior').addEventListener('input', atualizarConsumo);

    init();
  });
