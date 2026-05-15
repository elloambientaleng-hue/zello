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
  const EMPRESA = { nome: 'Zello Ambiental', eng: 'Eng. Guilherme Montanari', crea: 'CREA 5069519852', tel: '(16) 98142-7633', email: 'contato@zelloambiental.com.br' };
  const LOGO_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAABsCAYAAACPZlfNAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAd8UlEQVR4nO2de7DlVXXnP/vx+/3O+9zT9/b7ATTdPJs3KAEUEAIoURFF1CFK1AQxIZWKY6bKSqJTSXQmU0kmElMxkxjzIGZ0GCOKJAgxCEgUBDE+QEAEmn7f13n9XnvvNX+c263thckMKe8D77fqVnVVn3t+67c+Z+3f2mutfa4SEVa0fKQX24AV/f9pBdgy0wqwZaYVYMtMK8CWmVaALTOtAFtmWgG2zLQCbJlpBdgy0wqwZaYVYMtMK8CWmVaALTP9xAH76de+bln3k36igF37nz8oF1559WKb8e/STwyw6278mOxNHV0vNLeftmyjzC62AT9uqfqR8uZffQ9SrdHprMfGVdasX7PYZr1gvagjTNWOkFe+5e3YyjjDwlCGCB8sxx5/3GKb9oL1ogZ24RVXsf7I40nLiFISCm9Zv2ELtXp9sU17wXrRArvoml+VTVtPYGpQQtJETAVMjFjNtm3bFtu8F6wXJbCXv/UG2bz9ZFzUIGp02D/bQ1cSJtatJc0yPMs253jxAXv5235FNh59MikJqViGpaO5qkVWDFmzdhX1RhUX/GKb+YL1ogJ25lXvki3HnEFJE1Mdp1QRtpow1Z1kfKJBsxWDKpncv2+xTX3BetEAO+rCK2TbSWcg8RjONOimHq8seShoNGNWr22Rl13KYsj05ORim/uC9aIAtvXlr5IzzrsIU1tFQYzYKjlgE0tZZoy1K0yMNxA3IFLCnl3PLrbJL1jLHtiq439Kzr/kCloTm+hmgaEP5CI0Wy1KX1CrWcbHm8TGExswOvD9J7+32Ga/YC1rYNGmHfK6N72TqLaOmUEgaY0hkSEPGSYOOJ+yfu04E2NNiuGQqo3pTU+x/6EH1GLb/kK1rIG98/pfpj2xhV6qIarjlEFFGl2B2cEU6zdM0G43SCKLywt0EB779iPz3ueq6967bPL8ZQvshv9yo0TVOrv29lFxB1NpMCxyvHZECdSalrXrOhgd8KUj0ob+zCz33H33Ye+z7fTzpdYc4y2/9L5lAW3ZAVPtDfLq93xA+iGi1BXq7RYoxzDt0hyrU4acoEu2H7MFFwaIz3FlTtXGzEzN8sjnP3fYcji26Ug2HXsKs3nMq976a0se2rICplqb5aQ3vJmJHWcyY9sUlTpFmKFaHZAkjkF/monVbbYcsZE0m8VGnigJ+HKIhMCtf/+5ee+59czzGNY3UMSboHIEO376nUsa2rIC1j7xZHacdQ77Bzm18fVM545ap0U36+JCzlinQaUSozXoyOIl0O/NEGvPzscf4ZFbbjosulYdfZKMbTyK2RDTXruVgYtYv/kY6tvPW7LQlg0wte5Y+bnrrifkwlh1DPEgGPb2Ukyjw/qNmxjvtImMoSw9eanwYmk12qgi5yMffP+89zz15ZcR11uICFElIU6qKBvxkpeeuwh3+P+mZQPsF9//AXrDnEatiSoE7wQdVZGoSrUzgRhLVjjiOCY2ES4vME7QZcl//9BvIbueOSy6kq1nyRkXvJKh87hQEiURyhrS3DO+eh3NY1+yJKNsWQB7/e/8vvhalVIZfCmIg0qtjjea9uo1OGXx2oKxDAcZ4hx1azFFyl98+A+YeuCr8/Zd17z7Pcx6Qw6UoaTVbjPIcmqtMaa7BaefuTSjbMkDO/MdvyirjzqaHEMRFEpb6q0mM/0+zVVj6MhQFBk6ijEmosxyOpWEuOhz3+238P0vfHYerLPfdIO01x1BKhpBE0URhS+wSUwpmqAiOhObUa1jllyULWlgW17xGnnJ+RfTTR39tKTebqOimEFeUOk0CRoi7Uh0YNCdJRv0GavFlLP7eOALn+XeP71xHqztP32NnPGKy9kz08UkFbz3aK3JihwdR/TSnKjWYZAJR594+mLc9v9VSxZYtP10ufiKK+mXgo1qrFq1hkE/J/ceU4+x1QjnM4bdKTr1iFYELQs26/IPn7qJf/7oh+fBslvPkcvf9HaGEqOSCs6P+mLD4ZBWu0G/P8RGVZwYnETsOOVMlNqwpKJsyQJ753t/DV9rUam1GfZzfOZptzt4CyoxmESRZl1qkSKb3k9LO6LhAW75iz/m25/6q3mwVp18sbzxHTeQqipDsdikjnMB0CRRRK/XA60QZQlYlE4QLKilNVi2JIFd8iu/KVmcYJpt0tSzfmI9RVZSZimtsSazgyl63Uk2rF1F1SrqSujtepK/vvG/8eTtt8yDNX7CeXLpa99MbXwdw6CIqw2mez2Sag0VFOJh2B9gjAEV4dAEDE4EJCyGC55XSw7YEee/Rk47/wJcXMHbBGsrDLoZlSgmL1KmpvfRaiS0EkV/327KwYDu3l18/A9/lwP33zMP1urTLpVXXf3zNNcfgbIx1lr6/T61Rpt+WmAwKAfd6S7WRAgaHzSCxQeorBpbBC88v5ZUvNc2nijv+I3fZDYrUXGdvBRqOsJLThJFVHSMNZ7I5xTpgLY2fPfrD3PHn/8p0jt8n6UmNsrqo07mkqt+jurEBgKWyZkutZai1axzoNenWqmgiQhFRr/bw+qYPMw9spQhoLngwvMWwxXPqyUF7I3XX0dtYjX7Uo+NK5S+xCtNqYT901OsW9Mh7R/A5I4JLdzyd3/L4/98L0TzF4qTz7uMU152Gaa+hqlMiCJNUmsiIpRlSWw0Vht0ENI0o8hyTDVCRAgCEhmUFjZv3rgInnh+LZkl8bjXXC2bTziBycGQZquDSx2WmEGakwOdteM8u+spKgrU7Cx//Nu/zWO3fUpJuktJd+eh6FKrj5bL3vUbcsyZ51Mf38RU6hBbpZ87omqDUqDX69FpNwjpgHKYMZjtY5QCH1AYAA5+adrXvn7/ovjj+bQkIkwdcbS89/f/gF2DHiZp48uA6+fYxOBRVJt19s3uZ/2GtXz33ru54+N/xg9DOii75Sy5/Npfpj6xkag5xhPP7qUzsZ6p7oDOqjVM9nuI84x3VtGd3EeiY/qzXWanZ4lMPLcni2EOlojna1+cn8QsppZEhL3x56/DRTVsc4yo3mKmlyGiCNmQhgm4qb1Ew1luu+kv+cKHP6CeC9YxF7xZrr3hP1GdOILS1sm8ptEcI8syWvU6vd4skbHU63UG/T6RsSgXKPpD0m4fYy1OAlprjNJoL+iwpLZgwBIAdtwrr5Qtx5xM4WP6qWayF9gz3afVGQOf0cpm8Y/9K3d85Pd46pb5+yu1+jTZ8cZfl9MufSNdquRBI8oQguBdQZ4OsKpkVS1BFyl+0KNmY3wOk/tnGc4OaDeaFN4RlMZ7QZxgy0BVR4dda+Lohpx0zqmLSnHRl8Q3vO0dzOqYJGlT8SV798xw5Pp17P7eo6xvRtx7y6f5+m1/rfj998373YkzL5eLrv0l2uuOxCQRaZoiRiMCwXtEhFo1wbsCX5QYBbG1hDIw6GV0Z4cYH/ASkNigbYTFYIKjkVjccHjY9TZv3cypJ52yUK55Ti1qhL36F98ramwcHzfYu3+SPd97knWxRu3bSWM4xc1/8gcjWD8iVT1Str/i7XLhZW+iPb4W5wpmZmbI8xytNUopEI3REVZHuMLjyoBWFhFFf3bA7EyPoihQscbhEWIQQ/Alzg3A93n6ycMHdmqtmM7qhBPPPWrRomzRIiw+6jh5/41/zN7CUwQoBn0mKpbKYJrHvv4At9/8t0j/qXmw9JYz5BU/+wus23gcqRjy3KEiMMZgrUVbi3OO0gWstQTvQTTWGvDQ6/fn4JbYOAIEMRqNJThBicNKiStmefLxbx127eN3HI1KSk79qR0L5aZ5WrQIe+01byO3MQ7Dvl27qYSCNjm3/92f8Y9/+SH1XLDWnXelvPqa6xjbsI1CVymCxkQJ1WqVOB5leXle4lxAicYoS/CgtUUFxWCQ0u32yfMSLQqtLLl3CAoRBQ5iAmP1CF/O0uvuOez6x524FVMriZrC+Em1RYmyRQG2ase58tLzL2JYeGb27qUpjumnH+ePPvR+vvuV2+YvgWtOlLPf9uty3iVvwEdjFBKT5Tn1epU8z8myjDRNSdMU7z2RTYjjGKUM1saIKIbDjF63T1GUGGMxxuCcI6DQ1kBQWAQrHuNz9jzzBNL/QTbaOU5J5gZEdUWhUk4557SFddqcFmVJfPcNv0LuFN39M5jZaXq7d/G5j38UmZwfVc3jLpELX389lfGNzOSWSmxxLiMxgXw4TWxjlFIYE6G1xcYVlFKUpWc09aEo8pIsTSlzh8GgtUZ8wONRJkLEoKQk1qBczqC3n0e//fBhdrzswrMoQ0atWafWaTBhGgvlrsO04BG2dsfLZOOWo9jzzG6yqVme/Nr9/P3vvU89F6xjL3irXPgz/4HaxFF4PYanguiEOKrgXEYUa5wrKMsSP5cVOudI0xw39wxLh6PoKwuPPZiQBEEpRRxXQAxKBBVyKtYRSU7enyE98O3D7Dn73NNRVjHT75O5kkxyjn/D8Qu+LC44sCvfcjVBweTO3dx1y2e55xMfmQcqXrdDTr38ejn1vMsIyRiFJBRBQBmKwlF6N2o0+oBS5hCAEYyAYVRmSntDXOERD2bu/zXCaOTKQxC0aGqVKlZSlO+i/YAvfe7Th9lzxfWny96pXXjx1JpjYGOc8mw/butCue2QFhSYPnKrnHH2mTz80APcdds/8PRDD817TfvIc+T8S9/ICaddwN7pjCIovC/RUqBUCQS8GAqJyH2MqFHUiMioOuLBe8G7gHMOrfWhH6NAK4XWCi2CDp56rcLsgT1UbU6nJtx/751Aesges1nJEcdsYNPWDZTimDwwjfdCpZZgnqPo/OPWgl7x3PPP49ldT3PrZ/43ux68H+k/flh0bTz5NXLh5W+ls+4EJruBZns1ymcY6WKkSyQDUB6HJpUGmdQJEo1ABQghEELAez/3b/BzYwBaH0z9DbHVRFZjtDCY2ceWtW0iGXLfXZ9j3/ceRmTXIbsufOXxNNbWyVyKjhRxpULwUJYlNjFsPmvjgi6LCwvsJWfxsY9+hGf/5XYl7ocq7O3NcsL5b5Uzzr2MQrfpZpa40qHfS9FKMJRYyVGSgZSEuZkLT4ILihDCqC3iQUSh0Gg9ygRFBKMEozQKQYlHxAMBTUGnaXHDA+x8/Bs8+eAt6odhrXtpU856+el469gzsxvRQrVaQURG7RilOeHEhf3OjwXNEnd/9zGeuvuuwxuN0QY54eLL2XbsmRShRtB1fLBkaU4lqaJUjlAiBLwHLx7RHqUVSoHRBo0GFKAIMHqeiUKAJDKjJTP4uU20x2jQSkAFrPTZ/fQ3efjO+XXKq6/9GXzFoRNN1VQpQk4+2I/GUY0TNIb169cvjPPmtKDA/vIP508ynXr56wnxKlKqVJrjTM1mBAnU61VcKNFegTKIKEQrtDBKHHSB1prEWhBBwtxzLCjkh77WYRRlAQkepYUkijBG4cuCcpjy1FPf4OHP/Ok8u979X6+QztY2felilCKqROTDkjRLUUqo2AQbLFEU/eiv/li1qMXfEy58rWw68RWo6jqy3DMzOUml2sRGMcMiH0WKjjFEo6hg7jkUgTE5mIMJh0YYLY1ajSJLDmaNhEPNSGstkVXkecaunU+zZ+cj7PnnP58/FXz9ubL9vK0MdA9btfTTAYnRaAXoHCQgPkIxt01YQC1aaaq6cbtsO/EsypDQ75cEDLVaDR9KsmyIKAGt8EHwohFjsXFCFBviSBFHkESjJmMQNQdl5ECtNcYqjFVgRreotJAoj3Upg31P8tjXv8Te+/5xnl1XvfNcOfHsYylsn2AcPjiMMSRRheCFdJiPPhhaI+KJkp+ACFOrNstFV1xHLx/H2/hQ9CgPRgxKRptbowTvUqJGlUYjIU4sEPC+xCkBEYogdDodutMzo7KT1jQaDWa7XWxkEIQgjnqk0XmPyWce4a6bPvicYfHK68+Wcy47mR6z9PyQikmgKGhEVUKqGM44gk8wNgGjCIWj8PmC+m5RgK0/9mSCXYWOOoRQglIE7wk+oE1EnFTwIZDnKe2xBlHFEicaE42ywFGDEoIaLZF79+1jfNUqbFIQG8v+fQeoVav4vMAoz5qxKvuffYIH7rqNfQ/Nb/nHRyq56trLOe3lO9g92E1zIiGhQl4UJKaCFFAMS1yhUMQoHRMUeDUa815ILQqwY485GbRBFIdKRQFAazyC+AJtDJV6hUanBQa0FVAKCQGRubELEYzRozHrbIYQAnlpWTXeQZcKg8GWXZ742r3c+9mPIYNn5sHadFZLfvm9b6PWSXAmZe26cQ509yFaSGyCVhFpVjLo57hS0Gq0WfciGHjxP8NqW14ijcYaRFmKvAQ0IYBCE0UGUYG8zLCJZc3GtcTVGBsbRI8GcoLSiIoQbQhKE1cSvC9J05R6rYIRB2WffGY3UTHJ/Xfewr3/6y+eE9Zprz1e3v7ua5AopdbSmAR27nyaOI5pN9qkwwKXQZ56sjwgWLT5wWfcmIiF/pOUCx5hmzZtJ80MuppQFg7tNUppggi5KxGtqDWrNMeb1FpViqIYVS9ECKOQHCUSKqC0UPqCNB+yYd1G+lNTGJdTtZ6QPsXf/Mn/QGYfnQcqOkrJpVeey6uveRmRLag7w2y6n9RljE90EKWYnerRqneYmeyRZw4JowapGIt4Dzqg0egFnr1fcGAbNm4nzw3VZgVlhjgJWGPxwVMUJbWxFms2rqXaqDMsU5RWBKUQb0CPMkEAo/VoXQyBTqvNcOoADROoWs9dn7+Zx774CcWH/+O86x997lp532/dgNT6BNNjetil2WrQm5ql0Wpioohut0+t2mLQzciHHu8UxhiUtgiBoAIgo7PUC7wkLjiwRnOCvq9T+gBGo8XgvYCCWqPOqtVt6s0K3gSKssSaGNCjykYQmNsgI3O9rgJMKGhFnnTyaT7x8T8i7P7Oc3rxTe+5TN76S69n6PbRn55iYsMYNROzf3ov4xPjDNKSYphTr7WZPtClLMA7hVIalGa0pwsoHUCNNuNFmi2o/xYcmNIxka0zLHKYK8imaYqtWibWjNMab1NISVF44kpEOddC0aJHziIgwY16WBKoKc9YzfDNr36Vez7550i2ax6s489fJ1ddewVbdowTkj6m4umYFsPhkDxkNDpNusOU2FSoJFUmD3TxhVDkHmMStDKgBBcCgscoT1CChIIfGaz6sWvhgc0tISKCMZYggoks2hrG102QS44ooVKv0M8yjIlwzpHEVUrvSAyU3hEbsL6kqjPuu+1WHr7zc88J652//iq5/C0vR5o9FAOG4oiimIAhiMZGVUqvUCZmmHrSfkZRBJTXh5KKoIWizEiSiKIoSGJL6UsiU+PeL9+3oP5b+LReSlw5JG5UKBm1QjDQ7rRQVkFQBAElgtaKII5arcbMvgN0mg3IUmo6YJUQ0klu+uiN9PfvRLLDs8BNp9XkdVdfypqj21DJCZHHGHClMMhSRsusQSlLWQaKzFGmAVcAEqGMRc3tD41VqACiAtVahXw4oFaroTPNE/fMn0L+cWrBgQ36k/gIYl0lKz0hQJLEjK9ejTKjJJAgeA5uShU+L1jVahJ5h1aBqvH0pvbyxVs+Rffx+WfCTnnNNrn6+tdRHwMTOZyAdwHvR0ur0g6J/Gj2owhkaSBPHT4HTYRWFqX0qDwWKXKXY2JDZC1Zf0Cr0WY428f33UK7b+H3Ybt3PU6lEgg+J5QOZcBWYxqdJj6EUUXejhiMqvEJRgLaeeqRIQoZ+cxe/unzN/P0lz8zD9bF7zpbXnn1BTQ3JAzo0yuGOECCoUg93isqlRqRTSicp98ryIceKTVaxVgTY4xFlOBkZJ+oAHrUDDXGQqmp2ybf+Mo3Ftp9Cw9s587HqFUD3mUYY9DWEFciTKQp8YgKKGtAj6rtVhtMAOUd5bBPXTluvfkmnvnSp+fB+tn3XyRnXXAk1Gbo5tOoKMZLgkgVdDxKzZXgipJhv6A7nVFkDrxCa0tk4kORJVpQBrwOqHhkT1aWjDVXM5jOaUbjfOPWZxf8ZMuCA+tNPk2/vw+NJ4lilIKkluBCCYZDoEYj15oiy4mspZkkNKzmni9+gV0/MrtY3aLk+g+9Trbt2EJU9eTlAGOh9AUmjsiDowyeuFbB2pi0nzOcyaHQGIkwymKUHSUYYTR9pQzY2GAiRVakRElCtdKkOz1k3fhm7r/34ee5wx+vFhyYzO5Ujzz6MMGNushBHHElIncFSZKM+luMpnWt0ri8oFmpUaZD9j77DF/9zKfnvedrf+ESWhvGGOQlaU8Yq44TBU2kBG9SSjMkNyWpD2S54HJNVMZUqRKreNSOQR2arIIABIL2BBUQLYhSWBtTDD35IPBPf/OVRTk3tij9sGcf/VdM2UVlswRXEkUJLgTiSoLW9tAUrlbQbDbp9btUK5qbbvw9pDg8K7v2dy+T8S01auMxUUURRRF5frBnBeJL4jhCW8MgHdIbDPEBlLGjGqYyc27QoyJzJIgNOO0ofUGWDxnvdMj7GflsypEbj+LuO+5+7htbAC0KMDnwffX4V+9gIk5pWEtvJsVWqjg0eQrNuEVNK7TLRo1C7bnzi7cgkw8fBuviK4+QTZvbNBpCWu7D0cOZAV4VBEZTU7GpEPJA2htQZDne55QUlLZEYshLjzUJQSuChYEbkquMZruK9wURmkZUIyqgbRt0d0/y4K3fWrRTmYvWcZ7e/QSPP/wvFLMHGG9WCUXOcDikXm8yGKQUWUbFWlzaw4aCb372k4f9/pHHKHnVFZeAcqAcgicQRuMBqNEXokiEChGhNEipUQEwFmXN6LC7CHElIRDIyozcpbQ6DYyBPXt30Rkbo1Gp05/sUZEKDdvkox/+q0Xx10EtGrDe7NPqW996iLK7j2ce/TqrW1XccICOLFGlSlxtggidiuHBL92OzDx92Kf6vEvPxycxQcUQqqMfSUCqKKmBJCgq5IXGlQbvLBIqKKmhqaOlhgSDNoE0m6XeiLFGyIZ96rUa7Vobn3kkBXLDeHMtN//dZyh3yaKeeV7UA33lzHfVg1++naic5bGH7ueItatxxRATG9KixCqNKQY8+D8P/1SffNE62XHOyewbTOL1wQPkP+hLHXSpF6EoCkrnRpmfUig1ep1So2q7x4H1RLEiigxFlqMKaEQNwlBRM03qusVXvvQA3/2nha1qPJcW/chsue9BpVZtl5+59l0MDuwmboyRuSEEUBKYeuoxJDvcUS+9+Az2lweoTCQUbhalwqFRbQDRo7E4L4GiTEEbTAR+jqnMVf+tVXhf0G436PVmiKKY1WMT9KcHBKVY3VyDKWPu+fJ93P03X1t0WLAEDqUDyNRj6vOfvIlnHvkmCSmNRLG63aSC4oG77jzstfVtSsY3tyiinIEfEOYGQlHhBym4FlwocaEk4AnKjTJAM3rCgZ+LMMFJOWqGKk2sIqIQ0UrajFdXMZzMuO/Of1kysGAJRNhB+Z0PKjW2Ta7+wG+wesvRTM8eYGt7jIfv+MRhzjrhtNXoGkyMj7F7/y6qOgYZ3cZogNQQgsYFoXABdDyaBWE0u6gODs0ohSjBqpgsLWlV2yinyHueRtTkwM5Z7vvS/Xz79u8vGViwhIAByMzocMQl7/uQ/NSZF7Hrie8Ah5/aP+6k4wmqZHJqD0lkwcPBhUIx+soHRPBB47xgrD10qmVUQbGog0ujF+pJm+ACqozwmaeVjDG9u8ttf387ux6YXVKwYIksiT+qL3zsRm79xMdomPl/mG3T5qOJbJWajnDDIZHSo+eVHyUV3nviOMa5USX94NCn1aNzZAQhNqMqCmVAFRZTVoh8jcg3ePgr3+Gj7/tbtRRhAaiFnvr592jzCevk2l+7kswewMYlzXadqZke2iSjwq7RDNKU1liH/fv3j8bRCo+1ljiuoFGjQ+t5QWwj6tU26YyQ6CrPfP9ZPv3Jz1A8vrhp+7+lJbUk/luqNzpYX6NTW8sw20cvH1CNEopCCDhsHJGoiDXtcXoHZshLRy2pUhSOdGaAVorExFSiKhIC2cyQp759gDtuu4vhY4Xig4t9h/+2lhWwR776HTW2rSJHbl/LSads47gTt45aI2HU7JRSIa6k4tuYrIYuSopBoF7rMFaPkBDwZWD/s3u59+57ePQfppd0ND2XlhUwgJnHs8OcvPUl4zIxvob1GzdQbzUxkaUpjmbYzLpOGw08u3MX99x3H1++ef731y83Latn2IqWaJa4oufXCrBlphVgy0wrwJaZVoAtM60AW2ZaAbbMtAJsmWkF2DLTCrBlphVgy0wrwJaZVoAtM60AW2b6P1MrWThpjlmrAAAAAElFTkSuQmCC';
  let SUPABASE_URL = localStorage.getItem('z_url') || 'https://evxolmfwblxtmudksmnt.supabase.co';
  let SUPABASE_KEY = localStorage.getItem('z_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eG9sbWZ3Ymx4dG11ZGtzbW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MzQxNTgsImV4cCI6MjA5MzMxMDE1OH0.v7uvLbz6NJoa4K0_KT9bKm5-M4mVAZ__77Tbqfef9fA';
  let CLIENTE_URL = localStorage.getItem('z_cliurl') || 'https://zello-zeta.vercel.app/cliente';

  // SEMANA 4.19 FIX: Helper pra normalizar a URL do cliente (com .html se necessário)
  // O portal Vercel está em /cliente.html. Sem .html dá erro de rota.
  function getClienteUrl() {
    let url = CLIENTE_URL || 'https://zello-zeta.vercel.app/cliente';
    // Remove barra final se houver
    url = url.replace(/\/$/, '');
    // Se já termina com .html, OK. Senão, adiciona.
    if (!/\.html?$/i.test(url)) {
      url += '.html';
    }
    return url;
  }

  // ===========================================================
  // AUTENTICAÇÃO (LOGIN ADMIN)
  // ===========================================================
  const SESSION_KEY = 'z_admin_session';
  const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;  // 7 dias
  let _adminLogado = null;  // Objeto do admin logado

  // Calcula SHA-256 hex de uma string (Web Crypto API)
  async function hashSenha(senha) {
    const enc = new TextEncoder().encode(senha);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // ============================================================
  // FASE 14.1: Sistema multi-usuário (admin + hunters + projetos)
  // ============================================================
  // Configuração de cores (UI)
  const CORES_TIMES = {
    azul:     { hex: '#2196F3', emoji: '🔵', nome: 'Azul',     papel: 'hunter' },
    vermelho: { hex: '#E53935', emoji: '🔴', nome: 'Vermelho', papel: 'hunter' },
    verde:    { hex: '#43A047', emoji: '🟢', nome: 'Verde',    papel: 'hunter' },
    amarelo:  { hex: '#FBC02D', emoji: '🟡', nome: 'Amarelo',  papel: 'hunter' },
    rosa:     { hex: '#EC407A', emoji: '🩷', nome: 'Rosa',     papel: 'hunter' },
    roxo:     { hex: '#8E24AA', emoji: '🟣', nome: 'Roxo',     papel: 'hunter' },
    laranja:  { hex: '#F57C00', emoji: '🟠', nome: 'Laranja',  papel: 'hunter' },
    marrom:   { hex: '#6D4C41', emoji: '🟤', nome: 'Marrom',   papel: 'hunter' },
    preto:    { hex: '#212121', emoji: '⚫', nome: 'Preto',    papel: 'projetos' },
    branco:   { hex: '#F5F5F5', emoji: '⚪', nome: 'Branco',   papel: 'projetos' },
    cinza:    { hex: '#757575', emoji: '⚙️', nome: 'Cinza',    papel: 'projetos' }
  };

  let _corLoginSelecionada = null;  // pra fluxo PIN

  // Verifica se há sessão válida no localStorage
  function getSessao() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (!s.expires || Date.now() > s.expires) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return s;
    } catch (e) { return null; }
  }

  // FASE 14.1: setSessao genérico (admin OU hunter/projetos)
  function setSessao(usuario) {
    const s = {
      id: usuario.id,
      nome: usuario.nome,
      papel: usuario.papel || 'admin',     // default admin pra compatibilidade
      cor: usuario.cor || null,
      email: usuario.email || null,
      expires: Date.now() + SESSION_DURATION
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    _adminLogado = s;
  }

  function limparSessao() {
    localStorage.removeItem(SESSION_KEY);
    _adminLogado = null;
  }

  // Verifica sessão ao carregar; mostra login se inválida
  async function verificarLogin() {
    const sess = getSessao();
    if (sess) {
      _adminLogado = sess;
      mostrarPainel();
      // SEMANA 2: verifica AGORA se está ativo + inicia verificação periódica
      if (typeof iniciarVerificacaoSessao === 'function') {
        iniciarVerificacaoSessao();
        // Verifica imediatamente também (sem esperar 5 min)
        setTimeout(function(){ if (typeof verificarSessaoAtiva === 'function') verificarSessaoAtiva(); }, 2000);
        // SEMANA 2: inicializa sino de notificações
        if (typeof inicializarSino === 'function') setTimeout(inicializarSino, 1000);
      // SEMANA 3.3: mostra onboarding na 1ª vez (hunter)
      if (typeof verificarMostrarOnboarding === 'function') setTimeout(verificarMostrarOnboarding, 2500);
      }
      return true;
    }
    mostrarLogin();
    return false;
  }

  function mostrarLogin() {
    document.getElementById('login-screen').style.display = 'flex';
    // Mostra tela 1 (escolha de times) por padrão
    voltarTelaTimes();
  }

  function mostrarPainel() {
    document.getElementById('login-screen').style.display = 'none';
    // Mostra info do usuário logado no rodapé do sidebar (se elemento existir)
    const elInfo = document.getElementById('admin-info');
    if (elInfo && _adminLogado) {
      const cor = _adminLogado.cor ? (CORES_TIMES[_adminLogado.cor] || null) : null;
      const prefixo = cor ? cor.emoji + ' ' : '👤 ';
      elInfo.textContent = prefixo + (_adminLogado.nome || _adminLogado.email || 'Usuário');
    }
    const elConta = document.getElementById('cfg-minha-conta');
    if (elConta && _adminLogado) {
      const papelLabel = _adminLogado.papel === 'hunter' ? 'Hunter' :
                         _adminLogado.papel === 'projetos' ? 'Equipe Projetos' : 'Admin';
      elConta.innerHTML = '<strong>' + escapeHtml(_adminLogado.nome || '—') + '</strong><br/>'
        + '<span style="font-size:11px;color:var(--text-muted);">' + papelLabel
        + (_adminLogado.cor ? ' · ' + (CORES_TIMES[_adminLogado.cor] || {}).nome : '')
        + '</span>'
        + (_adminLogado.email ? '<br/><span style="font-family:monospace;font-size:11px;">' + escapeHtml(_adminLogado.email) + '</span>' : '');
    }

    // FASE 14.2: aplica visibilidade do menu lateral conforme papel
    aplicarPermissoesPapel();

    // FASE 14.2: admin verifica auto-liberação de leads inativos (executa em background)
    setTimeout(function(){ verificarAutoLiberacao(); }, 2000);
  }

  // FASE 14.2: Esconde/mostra menus, telas e botões conforme papel do usuário logado
  function aplicarPermissoesPapel() {
    const sess = getSessao();
    const papel = (sess && sess.papel) || 'admin';

    // 1. Menu lateral: esconde itens que não pertencem ao papel
    document.querySelectorAll('aside.sidebar [data-roles]').forEach(function(el){
      const roles = (el.getAttribute('data-roles') || '').split(',').map(function(s){ return s.trim(); });
      if (roles.indexOf(papel) === -1) {
        el.style.display = 'none';
      } else {
        el.style.display = '';
      }
    });

    // 2. Label "Prospecção" muda pra "Meus Leads" pro hunter
    const lblProsp = document.getElementById('lbl-prospeccao');
    if (lblProsp) {
      lblProsp.textContent = (papel === 'hunter') ? 'Meus Leads' : 'Prospecção';
    }

    // 3. Dashboards: hunter vê dash-hunter, admin/projetos vê dash-operacional
    const dashHunter = document.getElementById('dash-hunter');
    const dashOper = document.getElementById('dash-operacional');
    if (dashHunter && dashOper) {
      if (papel === 'hunter') {
        dashHunter.style.display = '';
        dashOper.style.display = 'none';
      } else {
        dashHunter.style.display = 'none';
        dashOper.style.display = '';
      }
    }

    // 4. Ajusta tela padrão se a atual não for permitida pro papel
    const pageAtiva = document.querySelector('.page.active');
    if (pageAtiva) {
      const idAtiva = pageAtiva.id.replace('page-', '');
      const itemMenu = document.querySelector('aside.sidebar [data-page="' + idAtiva + '"]');
      if (itemMenu && itemMenu.style.display === 'none') {
        // Página atual não é permitida pro papel — vai pro dashboard
        navTo('dashboard');
      }
    }
  }

  // FASE 14.2: helpers de papel (usados pra mostrar/esconder UI dinamicamente)
  function souAdmin() {
    const s = getSessao();
    return s && s.papel === 'admin';
  }
  function souHunter() {
    const s = getSessao();
    return s && s.papel === 'hunter';
  }
  function souProjetos() {
    const s = getSessao();
    return s && s.papel === 'projetos';
  }

  // FASE 14.1: navegação entre as 3 telas de login
  function voltarTelaTimes() {
    const t1 = document.getElementById('login-tela-times');
    const t2 = document.getElementById('login-tela-pin');
    const t3 = document.getElementById('login-tela-admin');
    if (t1) t1.style.display = 'block';
    if (t2) t2.style.display = 'none';
    if (t3) t3.style.display = 'none';
    // Limpa campos de erro
    const e1 = document.getElementById('login-pin-erro'); if (e1) e1.style.display = 'none';
    const e2 = document.getElementById('login-erro'); if (e2) e2.style.display = 'none';
    _corLoginSelecionada = null;
  }

  function mostrarLoginAdmin() {
    document.getElementById('login-tela-times').style.display = 'none';
    document.getElementById('login-tela-pin').style.display = 'none';
    document.getElementById('login-tela-admin').style.display = 'block';
    setTimeout(function(){
      const el = document.getElementById('login-email');
      if (el) el.focus();
    }, 100);
  }

  // FASE 14.1: hunter/projetos clicou na cor — abre tela do PIN
  function abrirLoginPin(cor, nome) {
    _corLoginSelecionada = cor;
    const info = CORES_TIMES[cor] || { hex: '#999', emoji: '?', nome: nome };
    document.getElementById('login-tela-times').style.display = 'none';
    document.getElementById('login-tela-pin').style.display = 'block';
    document.getElementById('login-tela-admin').style.display = 'none';

    const badge = document.getElementById('login-pin-cor-badge');
    if (badge) {
      badge.style.background = info.hex;
      badge.textContent = info.emoji;
    }
    const lbl = document.getElementById('login-pin-cor-nome');
    if (lbl) lbl.textContent = 'Time ' + info.nome;

    const inp = document.getElementById('login-pin-input');
    if (inp) { inp.value = ''; setTimeout(function(){ inp.focus(); }, 100); }
    const err = document.getElementById('login-pin-erro');
    if (err) err.style.display = 'none';
  }

  // FASE 14.1: valida PIN do hunter/projetos
  // SEMANA 2: Rate limit PIN — protege contra brute force
  // Bloqueia uma cor após 5 tentativas erradas consecutivas por 15 minutos.
  // Estado persistente no localStorage (sobrevive a refresh).
  const PIN_MAX_TENTATIVAS = 5;
  const PIN_BLOQUEIO_MIN = 15;  // minutos

  function getPinBloqueio(cor) {
    try {
      const raw = localStorage.getItem('z_pin_block_' + cor);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      // Se expirou, remove
      if (obj.bloqueadoAte && Date.now() > obj.bloqueadoAte) {
        localStorage.removeItem('z_pin_block_' + cor);
        return null;
      }
      return obj;
    } catch (e) { return null; }
  }

  function setPinBloqueio(cor, obj) {
    try { localStorage.setItem('z_pin_block_' + cor, JSON.stringify(obj)); } catch (e) {}
  }

  function registrarTentativaPin(cor, sucesso) {
    if (sucesso) {
      // Reseta contador no sucesso
      try { localStorage.removeItem('z_pin_block_' + cor); } catch (e) {}
      return null;
    }
    let info = getPinBloqueio(cor) || { tentativas: 0, bloqueadoAte: null };
    info.tentativas = (info.tentativas || 0) + 1;
    if (info.tentativas >= PIN_MAX_TENTATIVAS) {
      info.bloqueadoAte = Date.now() + PIN_BLOQUEIO_MIN * 60 * 1000;
      info.tentativas = 0;   // zera pra próximo ciclo
    }
    setPinBloqueio(cor, info);
    return info;
  }

  function formatarTempoBloqueio(timestamp) {
    const restanteMs = timestamp - Date.now();
    if (restanteMs <= 0) return '0 min';
    const min = Math.ceil(restanteMs / 60000);
    return min + ' min';
  }

  async function doLoginPin(ev) {
    if (ev) ev.preventDefault();
    const cor = _corLoginSelecionada;
    if (!cor) { voltarTelaTimes(); return false; }

    const pin = (document.getElementById('login-pin-input').value || '').trim();
    const erroEl = document.getElementById('login-pin-erro');
    const btn = document.getElementById('login-pin-btn');

    // SEMANA 2: Verifica bloqueio antes de tentar
    const bloqueio = getPinBloqueio(cor);
    if (bloqueio && bloqueio.bloqueadoAte && Date.now() < bloqueio.bloqueadoAte) {
      const restante = formatarTempoBloqueio(bloqueio.bloqueadoAte);
      erroEl.textContent = '🔒 Time bloqueado por ' + restante + ' (muitas tentativas). Tente mais tarde.';
      erroEl.style.display = 'block';
      return false;
    }

    if (!pin || !/^[0-9]{6}$/.test(pin)) {
      erroEl.textContent = 'PIN deve ter 6 dígitos numéricos.';
      erroEl.style.display = 'block';
      return false;
    }

    erroEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Entrando...';

    try {
      const hash = await hashSenha(pin);
      // Busca usuário ativo com essa cor
      const r = await fetch(SUPABASE_URL + '/rest/v1/usuarios?cor=eq.' + encodeURIComponent(cor) + '&ativo=eq.true&select=*', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (!r.ok) throw new Error('Falha de comunicação. Verifique sua conexão.');
      const list = await r.json();
      const usr = list && list[0];

      if (!usr) {
        erroEl.textContent = 'Time ainda não cadastrado. Fale com o admin.';
        erroEl.style.display = 'block';
        // SEMANA 2: registra tentativa errada (sem usuário também conta)
        const info = registrarTentativaPin(cor, false);
        if (info && info.bloqueadoAte) {
          erroEl.textContent = '🔒 Time bloqueado por 15 minutos (muitas tentativas).';
        } else if (info) {
          const restantes = PIN_MAX_TENTATIVAS - info.tentativas;
          erroEl.textContent += ' (Restam ' + restantes + ' tentativa' + (restantes > 1 ? 's' : '') + ')';
        }
        return false;
      }
      if (usr.pin_hash !== hash) {
        // SEMANA 2: registra tentativa errada
        const info = registrarTentativaPin(cor, false);
        if (info && info.bloqueadoAte) {
          erroEl.textContent = '🔒 Time bloqueado por 15 minutos (muitas tentativas erradas).';
        } else if (info) {
          const restantes = PIN_MAX_TENTATIVAS - info.tentativas;
          erroEl.textContent = 'PIN incorreto. Restam ' + restantes + ' tentativa' + (restantes > 1 ? 's' : '') + '.';
        } else {
          erroEl.textContent = 'PIN incorreto. Esqueceu? Fale com o admin.';
        }
        erroEl.style.display = 'block';
        return false;
      }

      // SEMANA 2: Sucesso — limpa contador de tentativas
      registrarTentativaPin(cor, true);

      // Sucesso! Atualiza ultimo_login (best-effort)
      fetch(SUPABASE_URL + '/rest/v1/usuarios?id=eq.' + usr.id, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ ultimo_login: new Date().toISOString() })
      }).catch(function(){});

      setSessao(usr);
      mostrarPainel();
      // Inicia o painel
      if (typeof carregarDados === 'function') carregarDados();
      if (typeof carregarTodasCidades === 'function') carregarTodasCidades();
      if (typeof carregarConfigEmpresa === 'function') setTimeout(carregarConfigEmpresa, 500);
      if (typeof inicializarDragDropMenu === 'function') setTimeout(inicializarDragDropMenu, 100);
      // SEMANA 2: inicia verificação periódica de sessão
      if (typeof iniciarVerificacaoSessao === 'function') iniciarVerificacaoSessao();
      if (typeof inicializarSino === 'function') setTimeout(inicializarSino, 1000);
      // SEMANA 3.3: mostra onboarding na 1ª vez (hunter)
      if (typeof verificarMostrarOnboarding === 'function') setTimeout(verificarMostrarOnboarding, 2500);
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

  // Submete o formulário de login (admin email + senha)
  async function doLogin(ev) {
    if (ev) ev.preventDefault();
    const email = (document.getElementById('login-email').value || '').trim().toLowerCase();
    const senha = document.getElementById('login-senha').value || '';
    const erroEl = document.getElementById('login-erro');
    const btn = document.getElementById('login-btn');

    if (!email || !senha) {
      erroEl.textContent = 'Preencha e-mail e senha.';
      erroEl.style.display = 'block';
      return false;
    }

    erroEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Entrando...';

    try {
      const hash = await hashSenha(senha);

      // FASE 14.1: Busca em `usuarios` (admin) primeiro
      let admin = null;
      try {
        const r = await fetch(SUPABASE_URL + '/rest/v1/usuarios?email=eq.' + encodeURIComponent(email) + '&papel=eq.admin&ativo=eq.true&select=*', {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
        });
        if (r.ok) {
          const list = await r.json();
          admin = list && list[0];
        }
      } catch(_) { /* tabela usuarios pode ainda não existir; cai no fallback */ }

      // Fallback: tabela `admins` antiga (compatibilidade pré-Fase 14)
      if (!admin) {
        const r2 = await fetch(SUPABASE_URL + '/rest/v1/admins?email=eq.' + encodeURIComponent(email) + '&select=*', {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
        });
        if (!r2.ok) throw new Error('Falha de comunicação. Verifique sua conexão.');
        const list2 = await r2.json();
        admin = list2 && list2[0];
        if (admin) admin.papel = 'admin';  // marca papel pra compatibilidade
      }

      if (!admin) {
        erroEl.textContent = 'E-mail ou senha inválidos.';
        erroEl.style.display = 'block';
        return false;
      }
      if (admin.ativo === false) {
        erroEl.textContent = 'Esta conta está desativada.';
        erroEl.style.display = 'block';
        return false;
      }
      if (admin.senha_hash !== hash) {
        erroEl.textContent = 'E-mail ou senha inválidos.';
        erroEl.style.display = 'block';
        return false;
      }

      // Sucesso! Atualiza ultimo_login (best-effort, não bloqueia)
      // FASE 14.1: tenta usuarios primeiro, depois admins
      const tabela = admin.papel ? 'usuarios' : 'admins';
      const campo = tabela === 'usuarios' ? 'ultimo_login' : 'ultimo_acesso';
      fetch(SUPABASE_URL + '/rest/v1/' + tabela + '?id=eq.' + admin.id, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ [campo]: new Date().toISOString() })
      }).catch(function(){});

      admin.papel = admin.papel || 'admin';   // garante papel
      setSessao(admin);
      mostrarPainel();
      // Inicia o painel com tudo que precisa
      if (typeof carregarDados === 'function') carregarDados();
      if (typeof carregarTodasCidades === 'function') carregarTodasCidades();
      if (typeof carregarConfigEmpresa === 'function') setTimeout(carregarConfigEmpresa, 500);
      if (typeof inicializarDragDropMenu === 'function') setTimeout(inicializarDragDropMenu, 100);
      // SEMANA 2: inicia verificação periódica de sessão
      if (typeof iniciarVerificacaoSessao === 'function') iniciarVerificacaoSessao();
      if (typeof inicializarSino === 'function') setTimeout(inicializarSino, 1000);
      // SEMANA 3.3: mostra onboarding na 1ª vez (hunter)
      if (typeof verificarMostrarOnboarding === 'function') setTimeout(verificarMostrarOnboarding, 2500);
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

  // Logout: limpa sessão e mostra login de novo
  function doLogout() {
    if (!confirm('Sair da sua conta?')) return;
    pararVerificacaoSessao();   // SEMANA 2: para o polling antes de sair
    limparSessao();
    location.reload();
  }

  // ============================================================================
  // SEMANA 2: VERIFICAÇÃO PERIÓDICA DE SESSÃO
  // ============================================================================
  // A cada 5 minutos, checa se o usuário logado ainda está ativo no banco.
  // Se admin desativou o usuário, ele é deslogado em até 5 min (sem precisar
  // esperar os 7 dias do token).
  // ============================================================================

  let _verificacaoSessaoIntervalId = null;
  const VERIFICACAO_SESSAO_MS = 5 * 60 * 1000;   // 5 minutos

  function iniciarVerificacaoSessao() {
    // Para qualquer verificação anterior
    pararVerificacaoSessao();
    // Inicia nova
    _verificacaoSessaoIntervalId = setInterval(verificarSessaoAtiva, VERIFICACAO_SESSAO_MS);
    console.log('[Zello] Verificação periódica de sessão iniciada (a cada 5 min)');
  }

  function pararVerificacaoSessao() {
    if (_verificacaoSessaoIntervalId) {
      clearInterval(_verificacaoSessaoIntervalId);
      _verificacaoSessaoIntervalId = null;
    }
  }

  async function verificarSessaoAtiva() {
    const sess = getSessao();
    if (!sess || !sess.id) return;
    // Não verifica admin do email (ele está em outra tabela)
    if (sess.papel === 'admin' && sess.email) return;

    try {
      const r = await fetch(SUPABASE_URL + '/rest/v1/usuarios?id=eq.' + sess.id + '&select=ativo,papel,cor', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (!r.ok) {
        console.warn('[Sessão] Falha ao verificar (HTTP ' + r.status + ') — mantendo sessão');
        return;
      }
      const list = await r.json();
      const u = list && list[0];

      // Usuário foi DELETADO?
      if (!u) {
        pararVerificacaoSessao();
        alert('🔒 Sua conta foi removida pelo administrador.\n\nEntre em contato com o admin.');
        limparSessao();
        location.reload();
        return;
      }
      // Foi DESATIVADO?
      if (u.ativo === false) {
        pararVerificacaoSessao();
        alert('🔒 Sua conta foi desativada pelo administrador.\n\nEntre em contato com o admin.');
        limparSessao();
        location.reload();
        return;
      }
      // Papel ou cor mudaram? Avisa pra fazer login de novo
      if (u.papel !== sess.papel || u.cor !== sess.cor) {
        pararVerificacaoSessao();
        alert('🔄 Seu papel ou time mudou. Faça login novamente pra atualizar.');
        limparSessao();
        location.reload();
        return;
      }
    } catch (e) {
      console.warn('[Sessão] Erro na verificação:', e);
      // Erro de rede — mantém sessão (best-effort)
    }
  }

  // Trocar senha: usado em Configurações
  async function trocarSenha() {
    if (!_adminLogado) { alert('Você precisa estar logado.'); return; }
    const atual = prompt('Senha atual:');
    if (!atual) return;
    const nova = prompt('Nova senha (mínimo 8 caracteres):');
    if (!nova) return;
    if (nova.length < 8) { alert('A nova senha deve ter pelo menos 8 caracteres.'); return; }
    const conf = prompt('Confirme a nova senha:');
    if (conf !== nova) { alert('A confirmação não bate com a nova senha.'); return; }

    try {
      const hashAtual = await hashSenha(atual);
      // Busca admin pra confirmar senha atual
      const r = await fetch(SUPABASE_URL + '/rest/v1/admins?id=eq.' + _adminLogado.id + '&select=senha_hash', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      const list = await r.json();
      if (!list || !list[0] || list[0].senha_hash !== hashAtual) {
        alert('Senha atual incorreta.');
        return;
      }
      const hashNovo = await hashSenha(nova);
      const rUp = await fetch(SUPABASE_URL + '/rest/v1/admins?id=eq.' + _adminLogado.id, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ senha_hash: hashNovo })
      });
      if (rUp.ok) alert('✅ Senha alterada com sucesso!');
      else alert('Erro ao alterar senha.');
    } catch (e) {
      alert('Erro: ' + (e.message || e));
    }
  }

  // Definir/resetar PIN de um cliente (chamado pelo admin)
  async function definirPinCliente(clienteId) {
    const c = clientes.find(function(x){ return x.id === clienteId; });
    if (!c) { alert('Cliente não encontrado.'); return; }
    const pin = prompt('Definir PIN de 6 dígitos para ' + (c.nome||'') + ':\n\n(O cliente usará este PIN para entrar no portal sem o link de leitura.)\n\nDigite só números, 6 dígitos:');
    if (!pin) return;
    if (!/^\d{6}$/.test(pin)) { alert('O PIN deve ter exatamente 6 dígitos numéricos.'); return; }
    try {
      const hash = await hashSenha(pin);
      const r = await fetch(SUPABASE_URL + '/rest/v1/clientes?id=eq.' + clienteId, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ pin_hash: hash, portal_ativo: true })
      });
      if (r.ok) {
        alert('✅ PIN definido!\n\nInforme ao cliente:\n· CPF/CNPJ: ' + (c.cpf_cnpj||'?') + '\n· PIN: ' + pin + '\n\nEle pode acessar em: ' + getClienteUrl() );
        if (typeof carregarDados === 'function') await carregarDados();
      } else {
        alert('Erro ao salvar PIN.');
      }
    } catch (e) {
      alert('Erro: ' + (e.message || e));
    }
  }

  document.getElementById('cfg-url').value = SUPABASE_URL;
  document.getElementById('cfg-key').value = SUPABASE_KEY;
  document.getElementById('cfg-cli-url').value = CLIENTE_URL;

  function salvarCreds() {
    const url = document.getElementById('cfg-url').value.trim();
    const key = document.getElementById('cfg-key').value.trim();
    const cliUrl = document.getElementById('cfg-cli-url').value.trim();

    if (!url) { alert('⚠️ Informe a URL do Supabase.'); return; }
    if (!key) { alert('⚠️ Informe a Anon Key do Supabase.'); return; }
    if (!cliUrl) { alert('⚠️ Informe a URL do formulário do cliente.'); return; }

    // Validação básica de formato URL
    if (!/^https:\/\/.+\.supabase\.co\/?$/.test(url) && !/^https:\/\/.+/.test(url)) {
      if (!confirm('⚠️ URL do Supabase parece incomum.\nDeve começar com "https://" e geralmente termina em ".supabase.co".\n\nSalvar mesmo assim?')) return;
    }
    // Validação básica de URL do cliente
    if (!/^https?:\/\//.test(cliUrl)) {
      alert('⚠️ A URL do formulário do cliente deve começar com http:// ou https://');
      return;
    }
    // Validação Anon Key (JWT começa com "eyJ")
    if (!/^eyJ/.test(key)) {
      if (!confirm('⚠️ A Anon Key do Supabase normalmente começa com "eyJ".\n\nSalvar mesmo assim?')) return;
    }

    SUPABASE_URL = url.replace(/\/$/, '');  // remove barra final
    SUPABASE_KEY = key;
    CLIENTE_URL = cliUrl;
    localStorage.setItem('z_url', SUPABASE_URL);
    localStorage.setItem('z_key', SUPABASE_KEY);
    localStorage.setItem('z_cliurl', CLIENTE_URL);

    alert('✅ Credenciais salvas!\nO sistema vai testar a conexão agora.');
    testarConexaoConfig();
    carregarDados().catch(function(e){ console.warn('Erro pós-salvarCreds:', e); });
  }

  // =============================================
  // TESTE DE CONEXÃO
  // =============================================
  async function testarConexaoConfig() {
    const el = document.getElementById('cfg-status-conexao');
    const det = document.getElementById('cfg-status-detalhes');
    if (!el) return;

    el.style.background = '#FFF8E1';
    el.innerHTML = '<span style="font-size:18px;">⏳</span><span>Testando conexão com Supabase...</span>';
    det.innerHTML = '';

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      el.style.background = '#FFEBEE';
      el.innerHTML = '<span style="font-size:18px;">❌</span><span style="color:#C62828;font-weight:600;">Credenciais não configuradas</span>';
      det.innerHTML = 'Preencha a URL do Supabase e a Anon Key abaixo, e clique em "Salvar e conectar".';
      return;
    }

    try {
      const t0 = performance.now();
      const r = await fetch(SUPABASE_URL + '/rest/v1/clientes?select=id&limit=1', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      const dt = Math.round(performance.now() - t0);

      if (r.ok) {
        el.style.background = '#E8F5E9';
        el.innerHTML = '<span style="font-size:18px;">✅</span><span style="color:#2E7D32;font-weight:600;">Conectado ao Supabase</span>';
        // Detalhes contagem
        let detalhes = 'Latência: ' + dt + 'ms · URL: ' + SUPABASE_URL + '<br/>';
        // Tentar contar registros
        try {
          const tabelas = ['clientes','propriedades','usos','leituras','contatos','notificacoes'];
          const counts = await Promise.all(tabelas.map(function(t){
            return fetch(SUPABASE_URL + '/rest/v1/' + t + '?select=id', {
              headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'count=exact' }
            }).then(function(rr){
              const cr = rr.headers.get('content-range');
              if (cr) {
                const m = cr.match(/\/(\d+)$/);
                return m ? parseInt(m[1],10) : 0;
              }
              return 0;
            }).catch(function(){ return '?'; });
          }));
          detalhes += 'Registros: ' + tabelas.map(function(t,i){ return t + ': <strong>' + counts[i] + '</strong>'; }).join(' · ');
        } catch(e) {}
        det.innerHTML = detalhes;
      } else if (r.status === 401 || r.status === 403) {
        el.style.background = '#FFEBEE';
        el.innerHTML = '<span style="font-size:18px;">🔒</span><span style="color:#C62828;font-weight:600;">Acesso negado (HTTP ' + r.status + ')</span>';
        det.innerHTML = 'A Anon Key parece inválida, ou as policies RLS não permitem acesso. Verifique a key e rode o SQL <code>zello_rls.sql</code>.';
      } else if (r.status === 404) {
        el.style.background = '#FFEBEE';
        el.innerHTML = '<span style="font-size:18px;">❌</span><span style="color:#C62828;font-weight:600;">Endpoint não encontrado (HTTP 404)</span>';
        det.innerHTML = 'A tabela <code>clientes</code> não existe no banco. Rode o SQL <code>zello_schema.sql</code> primeiro.';
      } else {
        el.style.background = '#FFEBEE';
        el.innerHTML = '<span style="font-size:18px;">❌</span><span style="color:#C62828;font-weight:600;">Erro HTTP ' + r.status + '</span>';
        det.innerHTML = 'Tente novamente ou verifique se a URL está correta.';
      }
    } catch(e) {
      el.style.background = '#FFEBEE';
      el.innerHTML = '<span style="font-size:18px;">📡</span><span style="color:#C62828;font-weight:600;">Falha de rede</span>';
      det.innerHTML = 'Não foi possível alcançar ' + SUPABASE_URL + '. Verifique sua conexão de internet e a URL.<br/>Erro: ' + (e.message || e);
    }
  }

  // =============================================
  // BACKUP / EXPORTAÇÃO COMPLETA
  // =============================================
  async function baixarBackupCompleto() {
    const status = document.getElementById('cfg-backup-status');
    if (!confirm('📦 Baixar backup completo de todos os dados?\n\nIsso vai consultar o Supabase. Pode levar alguns segundos se você tiver muitos registros.')) return;

    status.style.color = '#1565C0';
    status.innerHTML = '⏳ Baixando dados do Supabase...';

    try {
      const tabelas = ['clientes','propriedades','usos','contatos','leituras','notificacoes'];
      const backup = {
        _meta: {
          versao: '1.0',
          gerado_em: new Date().toISOString(),
          empresa: EMPRESA.nome || 'Zello Ambiental',
          supabase_url: SUPABASE_URL
        }
      };

      for (let i = 0; i < tabelas.length; i++) {
        const t = tabelas[i];
        status.innerHTML = '⏳ Baixando ' + t + ' (' + (i+1) + '/' + tabelas.length + ')...';
        const dados = await api(t + '?select=*') || [];
        backup[t] = dados;
      }

      const totalRegs = tabelas.reduce(function(s,t){ return s + (backup[t] || []).length; }, 0);

      // Gera arquivo
      const blob = new Blob([JSON.stringify(backup, null, 2)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const dt = new Date().toISOString().slice(0,16).replace(/[:T]/g,'-');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'zello_backup_' + dt + '.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(function(){ URL.revokeObjectURL(url); a.remove(); }, 100);

      status.style.color = '#2E7D32';
      status.innerHTML = '✅ Backup baixado: <strong>' + totalRegs + ' registros</strong> em ' + tabelas.length + ' tabelas. Guarde o arquivo em local seguro.';
    } catch(e) {
      status.style.color = '#C62828';
      status.innerHTML = '❌ Erro ao gerar backup: ' + (e.message || e);
      console.error('Backup error:', e);
    }
  }

  function restaurarBackup(evento) {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;
    const status = document.getElementById('cfg-backup-status');

    const reader = new FileReader();
    reader.onload = async function(ev) {
      let backup;
      try {
        backup = JSON.parse(ev.target.result);
      } catch(e) {
        status.style.color = '#C62828';
        status.innerHTML = '❌ Arquivo inválido: não é um JSON válido.';
        return;
      }

      if (!backup._meta || !backup.clientes) {
        status.style.color = '#C62828';
        status.innerHTML = '❌ Arquivo não parece ser um backup válido do Zello (faltam metadados).';
        return;
      }

      const tabelas = ['clientes','propriedades','usos','contatos','leituras','notificacoes'];
      const totais = tabelas.map(function(t){ return t + ': ' + (backup[t] || []).length; }).join('\n• ');

      // Dupla confirmação porque é destrutivo
      const c1 = confirm('⚠️ ATENÇÃO!\n\nVai RESTAURAR o backup feito em ' + new Date(backup._meta.gerado_em).toLocaleString('pt-BR') + '.\n\nConteúdo:\n• ' + totais + '\n\nIMPORTANTE: este backup será INSERIDO no banco. Se houver registros com mesmo ID, vai dar erro.\n\nRecomendação: faça um backup ANTES, caso queira voltar.\n\nProsseguir?');
      if (!c1) { evento.target.value = ''; return; }

      const c2 = prompt('Para confirmar, digite RESTAURAR (em maiúsculas):');
      if (c2 !== 'RESTAURAR') {
        status.innerHTML = 'Restauração cancelada.';
        evento.target.value = '';
        return;
      }

      status.style.color = '#1565C0';
      status.innerHTML = '⏳ Restaurando backup...';

      let totalInserido = 0, erros = [];
      // Ordem importante por causa das foreign keys
      for (let i = 0; i < tabelas.length; i++) {
        const t = tabelas[i];
        const regs = backup[t] || [];
        if (!regs.length) continue;
        status.innerHTML = '⏳ Restaurando ' + t + ' (' + regs.length + ' registros)...';
        try {
          // Insere em lotes de 100
          for (let j = 0; j < regs.length; j += 100) {
            const lote = regs.slice(j, j + 100);
            const r = await api(t, 'POST', lote, 'return=minimal');
            if (r && r.ok) totalInserido += lote.length;
            else {
              const txt = r ? await r.text() : 'sem resposta';
              erros.push(t + ': ' + txt.substring(0,100));
              break;
            }
          }
        } catch(e) {
          erros.push(t + ': ' + (e.message || e));
        }
      }

      if (erros.length) {
        status.style.color = '#C62828';
        status.innerHTML = '⚠️ Restauração com ' + erros.length + ' erro(s). Inseridos ' + totalInserido + ' registros.<br/>Erros: ' + erros.join('; ');
      } else {
        status.style.color = '#2E7D32';
        status.innerHTML = '✅ Backup restaurado! ' + totalInserido + ' registros inseridos.';
        await carregarDados();
      }
      evento.target.value = '';
    };
    reader.readAsText(arquivo);
  }

  function limparConfigsLocais() {
    if (!confirm('⚠️ Isso vai apagar TODAS as preferências salvas localmente:\n\n• Credenciais do Supabase\n• Dados do responsável técnico\n• Ordem do menu\n• URL do formulário do cliente\n\nOs DADOS DO BANCO não serão afetados, apenas as configurações deste navegador.\n\nProsseguir?')) return;

    const chaves = ['z_url','z_key','z_cliurl','z_eng_nome','z_eng_crea','z_eng_tel','z_eng_email','z_eng_empresa','z_menu_ordem','z_pend_concluidos'];
    chaves.forEach(function(k){ try { localStorage.removeItem(k); } catch(e) {} });

    alert('✅ Preferências locais limpas. A página vai recarregar.');
    location.reload();
  }

  const hdrs = function() { return { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json' }; };

  async function api(path, method, body, prefer) {
    try {
      method = method || 'GET';
      const opts = { method: method, headers: hdrs() };
      if (prefer) opts.headers['Prefer'] = prefer;
      if (body) opts.body = JSON.stringify(body);
      const r = await fetch(SUPABASE_URL + '/rest/v1/' + path, opts);
      if (method === 'GET') return await r.json();
      return r;
    } catch(e) { console.error('API error:', e); return null; }
  }

  // FASE 8: helper que chama api() e LANÇA erro se r.ok for false.
  // Útil pra operações destrutivas (DELETE/PATCH/POST) onde queremos ter certeza
  // de que deu certo antes de seguir.
  async function apiOk(path, method, body, prefer) {
    const r = await api(path, method, body, prefer);
    if (!r) throw new Error('API: sem resposta (' + method + ' ' + path + ')');
    // Pra GET, api() já retorna .json() — não dá pra checar .ok
    if (method === 'GET' || !method) return r;
    if (!r.ok) {
      let errMsg = 'HTTP ' + r.status;
      try { errMsg += ': ' + await r.text(); } catch(_) {}
      throw new Error(errMsg);
    }
    return r;
  }

  async function uploadFile(bucket, path, file) {
    try {
      // Tentar POST primeiro, se falhar (arquivo existe) tenta PUT (upsert)
      const headers = { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': 'true' };
      const r = await fetch(SUPABASE_URL + '/storage/v1/object/' + bucket + '/' + path, {
        method: 'POST', headers: headers, body: file
      });
      if (r.ok) return SUPABASE_URL + '/storage/v1/object/public/' + bucket + '/' + path;
      // Se falhou, tentar PUT
      const r2 = await fetch(SUPABASE_URL + '/storage/v1/object/' + bucket + '/' + path, {
        method: 'PUT', headers: headers, body: file
      });
      if (r2.ok) return SUPABASE_URL + '/storage/v1/object/public/' + bucket + '/' + path;
      const err = await r2.json().catch(function(){return {};});
      console.error('Upload falhou:', r2.status, err);
      return null;
    } catch(e) { console.error('Upload erro:', e); return null; }
  }

  let clientes = [], propriedades = [], usos = [], leituras = [], contatos = [], documentos = [];
  let leads = [];                      // Fase 1: clientes com status_funil='prospeccao'
  let leadsPool = [];                  // FASE 14.2: leads sem hunter_id (no pool)
  let _usuariosCache = [];             // FASE 14.2: cache de usuários (pra bolinhas de cor)
  let clientesEmProjeto = [];          // Fase 2: clientes com status_funil='em_projeto'
  let historicoContatos = [];          // Fase 1: histórico de contatos do funil
  let configFunil = [];                // FASE 9: colunas do kanban da Prospecção
  let _leadsExpandidos = {};           // FASE 9: {codigo: true} se coluna está expandida
  let _leadsKanbanListenersOk = false; // FASE 9: previne memory leak
  let _leadStatusInicial = 'novo';     // FASE 9: status quando criar lead em coluna específica
  let leadAtualId = null;              // ID do lead aberto no modal "ver lead"
  let projetos = [];                   // Fase 2: projetos ativos (cliente em_projeto)
  let cidadesCache = [];
  let clienteAtualId = null;
  let propAtualId = null;
  let dadosImportLeads = null;         // dados parseados da planilha de prospecção

  function getMes() { const n = new Date(); return n.getFullYear() + '-' + String(n.getMonth()+1).padStart(2,'0'); }

  // =============================================
  // MÁSCARAS E VALIDAÇÕES
  // =============================================
  function mascaraCpfCnpj(input) {
    let v = input.value.replace(/\D/g, '').substring(0, 14);
    if (v.length <= 11) {
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      v = v.replace(/(\d{2})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1.$2');
      v = v.replace(/(\d{3})(\d)/, '$1/$2');
      v = v.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
    input.value = v;

    // SEMANA 4.13: validação visual ao vivo (verde/vermelho/amarelo)
    const limpo = v.replace(/\D/g, '');
    if (limpo.length === 0) {
      input.style.borderColor = '';
    } else if (limpo.length === 11 || limpo.length === 14) {
      input.style.borderColor = validarDocumento(limpo) ? '#2E7D32' : '#C62828';
    } else {
      input.style.borderColor = '#FFC107';   // amarelo (incompleto)
    }
  }

  function mascaraTel(input) {
    let v = input.value.replace(/\D/g, '').substring(0, 11);
    if (v.length > 10) v = '(' + v.substring(0,2) + ') ' + v.substring(2,7) + '-' + v.substring(7);
    else if (v.length > 6) v = '(' + v.substring(0,2) + ') ' + v.substring(2,6) + '-' + v.substring(6);
    else if (v.length > 2) v = '(' + v.substring(0,2) + ') ' + v.substring(2);
    else if (v.length > 0) v = '(' + v;
    input.value = v;
  }

  function formatarPortaria(input) {
    let v = input.value.replace(/[^0-9\/]/g, '');
    input.value = v;
  }

  function validarEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.toLowerCase()); }

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

  // SEMANA 4.13: Formata CPF/CNPJ com máscara
  function formatarDoc(doc) {
    const d = (doc || '').replace(/\D/g, '');
    if (d.length <= 11) {
      // CPF: 000.000.000-00
      return d.replace(/^(\d{0,3})(\d{0,3})?(\d{0,3})?(\d{0,2})?/, function(_, a, b, c, e){
        let r = a;
        if (b) r += '.' + b;
        if (c) r += '.' + c;
        if (e) r += '-' + e;
        return r;
      });
    }
    // CNPJ: 00.000.000/0000-00
    return d.slice(0, 14).replace(/^(\d{0,2})(\d{0,3})?(\d{0,3})?(\d{0,4})?(\d{0,2})?/, function(_, a, b, c, e, f){
      let r = a;
      if (b) r += '.' + b;
      if (c) r += '.' + c;
      if (e) r += '/' + e;
      if (f) r += '-' + f;
      return r;
    });
  }

  // SEMANA 4.13: Instala validação ao vivo num input CPF/CNPJ
  // Mostra: borda neutra (digitando), verde (válido), vermelho (inválido após completar)
  function instalarValidacaoDocLive(inputId, labelStatusId) {
    const inp = document.getElementById(inputId);
    if (!inp) return;
    inp.oninput = function() {
      const old = inp.value;
      const cursor = inp.selectionStart;
      const formatado = formatarDoc(old);
      inp.value = formatado;
      // Restaura cursor (aprox)
      try { inp.setSelectionRange(formatado.length, formatado.length); } catch(_){}

      const limpo = formatado.replace(/\D/g, '');
      const lbl = labelStatusId ? document.getElementById(labelStatusId) : null;
      if (limpo.length === 0) {
        inp.style.borderColor = '';
        if (lbl) { lbl.textContent = ''; lbl.style.color = ''; }
      } else if (limpo.length < 11) {
        inp.style.borderColor = '#FFC107';   // amarelo (incompleto)
        if (lbl) { lbl.textContent = '⏳ digitando...'; lbl.style.color = '#F57C00'; }
      } else if (limpo.length === 11 || limpo.length === 14) {
        if (validarDocumento(limpo)) {
          inp.style.borderColor = '#2E7D32';   // verde
          if (lbl) {
            lbl.textContent = '✓ ' + (limpo.length === 11 ? 'CPF' : 'CNPJ') + ' válido';
            lbl.style.color = '#2E7D32';
          }
        } else {
          inp.style.borderColor = '#C62828';   // vermelho
          if (lbl) {
            lbl.textContent = '✗ ' + (limpo.length === 11 ? 'CPF' : 'CNPJ') + ' inválido (dígito verificador não bate)';
            lbl.style.color = '#C62828';
          }
        }
      } else {
        // Entre 12 e 13 dígitos: incompleto
        inp.style.borderColor = '#FFC107';
        if (lbl) { lbl.textContent = '⏳ digitando CNPJ...'; lbl.style.color = '#F57C00'; }
      }
    };
  }

  function upper(s) { return s ? s.toUpperCase() : s; }

  // FASE 3B Item 4: validação de portaria — formato NNNN/AAAA
  // Aceita também NNN/AAAA, NN/AAAA, etc. (pelo menos 1 dígito antes e 4 depois)
  // Aceita também 'AB-NNN/AAAA' (algumas portarias do DAEE usam prefixos)
  // Retorna { ok: true, valor } ou { ok: false, mensagem }
  function validarPortaria(s) {
    if (!s) return { ok: true, valor: null };  // vazio é OK (campo opcional)
    const v = String(s).trim().toUpperCase();
    if (!v) return { ok: true, valor: null };

    // Regex: número(s) + barra + 4 dígitos (ano)
    // Aceita: "520/2021", "5/2024", "PORT 520/2021" (extrai parte do meio)
    const m = v.match(/(\d+)\s*\/\s*(\d{4})/);
    if (!m) {
      return { ok: false, mensagem: 'Formato inválido. Use NNNN/AAAA (ex: 520/2021). Você digitou: "' + s + '"' };
    }
    const ano = parseInt(m[2], 10);
    const anoAtual = new Date().getFullYear();
    if (ano < 1900 || ano > anoAtual + 5) {
      return { ok: false, mensagem: 'Ano "' + ano + '" parece inválido. Use um ano entre 1900 e ' + (anoAtual + 5) + '.' };
    }
    // Normaliza: NNNN/AAAA (sem espaços ao redor da barra)
    const normalizado = m[1] + '/' + m[2];
    // Se o valor original tinha prefixo (ex: "PORT 520/2021"), preserva o prefixo
    const idx = v.indexOf(m[0]);
    if (idx > 0) {
      const prefixo = v.substring(0, idx).trim();
      return { ok: true, valor: prefixo + ' ' + normalizado };
    }
    return { ok: true, valor: normalizado };
  }

  // =============================================
  // CIDADES
  // =============================================
  async function carregarTodasCidades() {
    if (cidadesCache.length) return;
    // 1ª tentativa: SP + MG (foco principal do usuário) — endpoint mais rápido
    try {
      const r = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/SP,MG/municipios?orderBy=nome');
      if (r.ok) {
        const data = await r.json();
        cidadesCache = data.map(function(c) { return { nome: c.nome.toUpperCase(), estado: c.microrregiao.mesorregiao.UF.sigla }; });
        // 2ª tentativa em background: demais estados
        try {
          const r2 = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome');
          if (r2.ok) {
            const data2 = await r2.json();
            const jaTem = new Set(['SP','MG']);
            const resto = data2.filter(function(c){ return !jaTem.has(c.microrregiao.mesorregiao.UF.sigla); })
              .map(function(c){ return { nome: c.nome.toUpperCase(), estado: c.microrregiao.mesorregiao.UF.sigla }; });
            cidadesCache = cidadesCache.concat(resto);
            console.log('[Zello] Cidades carregadas:', cidadesCache.length);
          }
        } catch(e) { console.warn('[Zello] Falha ao carregar demais estados:', e); }
        return;
      }
    } catch(e) { console.warn('[Zello] Falha IBGE primária:', e); }
    // Fallback offline com lista mínima
    cidadesCache = [
      {nome:'ALTINÓPOLIS',estado:'SP'},{nome:'ARARAQUARA',estado:'SP'},{nome:'ARARAS',estado:'SP'},{nome:'BARRETOS',estado:'SP'},{nome:'BATATAIS',estado:'SP'},{nome:'BAURU',estado:'SP'},{nome:'BEBEDOURO',estado:'SP'},{nome:'BRODOWSKI',estado:'SP'},{nome:'CAMPINAS',estado:'SP'},{nome:'CASA BRANCA',estado:'SP'},{nome:'CRAVINHOS',estado:'SP'},{nome:'FRANCA',estado:'SP'},{nome:'GUARIBA',estado:'SP'},{nome:'GUARULHOS',estado:'SP'},{nome:'JABOTICABAL',estado:'SP'},{nome:'JARDINÓPOLIS',estado:'SP'},{nome:'LIMEIRA',estado:'SP'},{nome:'LUÍS ANTÔNIO',estado:'SP'},{nome:'MONTE ALTO',estado:'SP'},{nome:'ORLÂNDIA',estado:'SP'},{nome:'PIRACICABA',estado:'SP'},{nome:'PONTAL',estado:'SP'},{nome:'PRADÓPOLIS',estado:'SP'},{nome:'RIBEIRÃO PRETO',estado:'SP'},{nome:'SANTA RITA DO PASSA QUATRO',estado:'SP'},{nome:'SÃO CARLOS',estado:'SP'},{nome:'SÃO PAULO',estado:'SP'},{nome:'SÃO SIMÃO',estado:'SP'},{nome:'SERRANA',estado:'SP'},{nome:'SERRA AZUL',estado:'SP'},{nome:'SERTÃOZINHO',estado:'SP'},{nome:'TAQUARITINGA',estado:'SP'},{nome:'VIRADOURO',estado:'SP'},{nome:'BELO HORIZONTE',estado:'MG'},{nome:'UBERLÂNDIA',estado:'MG'},{nome:'UBERABA',estado:'MG'},{nome:'GOIÂNIA',estado:'GO'},{nome:'CURITIBA',estado:'PR'},{nome:'CAMPO GRANDE',estado:'MS'},{nome:'RIO DE JANEIRO',estado:'RJ'},{nome:'SALVADOR',estado:'BA'},{nome:'FORTALEZA',estado:'CE'},{nome:'MANAUS',estado:'AM'},{nome:'BELÉM',estado:'PA'},{nome:'RECIFE',estado:'PE'},{nome:'PORTO ALEGRE',estado:'RS'},{nome:'FLORIANÓPOLIS',estado:'SC'},{nome:'CUIABÁ',estado:'MT'},{nome:'PALMAS',estado:'TO'},{nome:'NATAL',estado:'RN'},{nome:'JOÃO PESSOA',estado:'PB'},{nome:'MACEIÓ',estado:'AL'},{nome:'ARACAJU',estado:'SE'},{nome:'TERESINA',estado:'PI'},{nome:'SÃO LUÍS',estado:'MA'},{nome:'MACAPÁ',estado:'AP'},{nome:'BOA VISTA',estado:'RR'},{nome:'RIO BRANCO',estado:'AC'},{nome:'PORTO VELHO',estado:'RO'}
    ];
    console.warn('[Zello] Usando lista de cidades fallback (sem IBGE).');
  }

  // Remove acentos para busca (ex: "araraquara" acha "Araraquara"; "sao jose" acha "São José")
  function _normTxt(s) {
    return (s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
  }

  // Cache de buscas online por (UF, prefixo) para não bater na API repetidas vezes
  var _cacheBuscaOnline = {};
  var _buscaCidadeTimeout = null;

  // Busca cidades no cache local (resposta imediata)
  function _buscarCidadeLocal(q, ufFiltro) {
    var fonte = cidadesCache;
    if (ufFiltro) fonte = fonte.filter(function(c){ return c.estado === ufFiltro; });
    fonte.forEach(function(c){ if(!c._n) c._n = _normTxt(c.nome); });
    var comeca = fonte.filter(function(c){ return c._n.startsWith(q); });
    var contem = fonte.filter(function(c){ return !c._n.startsWith(q) && c._n.indexOf(q) !== -1; });
    return comeca.concat(contem).slice(0, 30);
  }

  // Busca cidades direto no IBGE pelo estado (fallback online — cobre cidades pequenas
  // que o cache local talvez ainda não tenha carregado)
  async function _buscarCidadeOnline(uf) {
    if (!uf) return [];
    if (_cacheBuscaOnline[uf]) return _cacheBuscaOnline[uf];
    try {
      var r = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/'+uf+'/municipios?orderBy=nome');
      if (!r.ok) return [];
      var data = await r.json();
      var lista = data.map(function(c){ return { nome: c.nome.toUpperCase(), estado: uf, _n: _normTxt(c.nome) }; });
      _cacheBuscaOnline[uf] = lista;
      // Adicionar ao cache global também (sem duplicar)
      var jaTem = {};
      cidadesCache.forEach(function(c){ jaTem[c.estado+'|'+c.nome] = true; });
      lista.forEach(function(c){ if (!jaTem[c.estado+'|'+c.nome]) cidadesCache.push(c); });
      console.log('[Zello] IBGE retornou '+lista.length+' cidades de '+uf);
      return lista;
    } catch(e) { console.warn('[Zello] Falha ao buscar cidades online:', e); return []; }
  }

  function _renderListaCidades(input, list, res, qDigitado) {
    if (!res.length) {
      var html = '<div style="padding:8px 12px;font-size:11px;color:var(--text-muted);">Nenhuma cidade encontrada na lista oficial.</div>';
      // Se houver texto digitado e UF, oferece usar mesmo assim
      if (qDigitado && qDigitado.length >= 2) {
        var ufSel = '';
        if (input.id === 'p-cidade') {
          var s = document.getElementById('p-estado');
          if (s) ufSel = s.value;
        }
        var nomeUpper = qDigitado.toUpperCase().replace(/'/g,"\\'");
        html += '<div class="autocomplete-item" style="background:#FEF3C7;color:#92400E;font-size:11px;font-weight:600;" onmousedown="selecionarCidade(\'' + input.id + '\',\'' + nomeUpper + '\',\'' + ufSel + '\')">✓ Usar "' + qDigitado.toUpperCase() + '" assim mesmo</div>';
      }
      list.innerHTML = html;
      list.style.display = 'block';
      return;
    }
    list.innerHTML = res.map(function(c) {
      return '<div class="autocomplete-item" onmousedown="selecionarCidade(\'' + input.id + '\',\'' + c.nome.replace(/'/g,"\\'") + '\',\'' + c.estado + '\')">' + c.nome + ' <span style="color:var(--text-muted);font-size:10px;">- ' + c.estado + '</span></div>';
    }).join('');
    list.style.display = 'block';
  }

  function buscarCidade(input) {
    var q = _normTxt(input.value).trim();
    var listId = input.id + '-list';
    var list = document.getElementById(listId);
    if (!list || q.length < 2) { if(list) list.style.display = 'none'; return; }

    // Estado selecionado (se houver) — usado para filtrar/buscar
    var ufFiltro = null;
    if (input.id === 'p-cidade') {
      var selUf = document.getElementById('p-estado');
      if (selUf) ufFiltro = selUf.value;
    }

    // 1. Resposta imediata: do cache local
    var resLocal = _buscarCidadeLocal(q, ufFiltro);
    _renderListaCidades(input, list, resLocal, input.value);

    // 2. Em paralelo: complementa com IBGE se há um UF e ainda não buscou online esse UF
    if (ufFiltro) {
      // Loga diagnóstico só na primeira busca — ajuda a debugar lista incompleta
      if (!_cacheBuscaOnline[ufFiltro]) {
        console.log('[Zello] Buscando cidades de ' + ufFiltro + ' no IBGE...');
      }
      if (_buscaCidadeTimeout) clearTimeout(_buscaCidadeTimeout);
      _buscaCidadeTimeout = setTimeout(function(){
        _buscarCidadeOnline(ufFiltro).then(function(lista){
          var qAtual = _normTxt(input.value).trim();
          if (qAtual.length < 2) return;
          // Re-renderiza com cache completo (ignora se usuário já apagou tudo)
          var res = _buscarCidadeLocal(qAtual, ufFiltro);
          _renderListaCidades(input, list, res, input.value);
        });
      }, 150);
    }
  }

  // FASE 12: busca cidade na proposta (assume SP por padrão; suporta digitar UF com formato "CIDADE/UF")
  function buscarCidadeProposta(input) {
    var raw = input.value.trim();
    var q = _normTxt(raw);
    var listId = input.id + '-list';
    var list = document.getElementById(listId);
    if (!list || q.length < 2) { if(list) list.style.display = 'none'; return; }

    // Detecta se usuário digitou "/UF" no final pra mudar de estado
    var ufFiltro = 'SP';
    var mUf = raw.match(/\/([A-Z]{2})\s*$/i);
    if (mUf) {
      ufFiltro = mUf[1].toUpperCase();
    }

    // Resposta imediata do cache local
    var resLocal = _buscarCidadeLocal(q, ufFiltro);
    _renderListaCidades(input, list, resLocal, raw);

    // Em paralelo: complementa via IBGE se ainda não cacheou esse UF
    if (!_cacheBuscaOnline[ufFiltro]) {
      console.log('[Zello] Buscando cidades de ' + ufFiltro + ' no IBGE...');
    }
    if (_buscaCidadeTimeout) clearTimeout(_buscaCidadeTimeout);
    _buscaCidadeTimeout = setTimeout(function(){
      _buscarCidadeOnline(ufFiltro).then(function(){
        var qAtual = _normTxt(input.value).trim();
        if (qAtual.length < 2) return;
        var res = _buscarCidadeLocal(qAtual, ufFiltro);
        _renderListaCidades(input, list, res, input.value);
      });
    }, 150);
  }

  function selecionarCidade(inputId, valor, uf) {
    var el = document.getElementById(inputId);
    if(el) el.value = valor;
    // Se houver um <select> de estado associado (ex: 'p-estado' para 'p-cidade'), seleciona automaticamente
    if (uf && inputId === 'p-cidade') {
      var selUf = document.getElementById('p-estado');
      if (selUf) selUf.value = uf;
    }
    fecharSugestoes(inputId + '-list');
  }
  function fecharSugestoes(listId) { var el = document.getElementById(listId); if(el) el.style.display = 'none'; }
  // =============================================
  // ABRIR CADASTRO NOVO
  // =============================================
  function abrirCadastroCliente() {
    clienteAtualId = null;
    propAtualId = null;
    contatosExtras = [];
    limparFormCliente();
    document.getElementById('tit-cliente').textContent = 'Novo cliente';
    document.getElementById('eid-cliente').value = '';
    // Restaurar texto do botão azul (edição anterior pode tê-lo alterado)
    var _btnCli = document.querySelector('#ov-cliente .btn-blue');
    if (_btnCli) _btnCli.textContent = 'Salvar e continuar →';
    abrirModal('ov-cliente');
  }

  function limparFormCliente() {
    ['c-nome','c-doc','c-tel1','c-email'].forEach(function(id){
      var el = document.getElementById(id); if(el) el.value = '';
    });
    limparResponsaveisLegais();
    var bl = document.getElementById('bloco-resp-legal'); if(bl) bl.style.display='none';
    document.getElementById('contatos-extras').innerHTML = '';
    contatosExtras = [];
  }

  // =============================================
  // CONTATOS EXTRAS
  // =============================================
  function adicionarContatoExtra() {
    var idx = contatosExtras.length;
    contatosExtras.push({});
    var el = document.getElementById('contatos-extras');
    var div = document.createElement('div');
    div.className = 'contato-extra';
    div.id = 'contato-extra-' + idx;
    div.style.cssText = 'background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:8px;position:relative;';
    div.innerHTML =
      '<button onclick="removerContatoExtra('+idx+')" style="position:absolute;top:8px;right:8px;background:#fee2e2;border:none;border-radius:6px;padding:2px 8px;cursor:pointer;font-size:11px;color:#C62828;">✕</button>' +
      '<div class="g2">' +
        '<div class="fg"><label class="fl">Nome</label><input class="fi upper" type="text" id="ce-nome-'+idx+'" placeholder="Nome do contato" /></div>' +
        '<div class="fg"><label class="fl">Papel</label><select class="fi" id="ce-papel-'+idx+'"><option value="conjuge">Cônjuge</option><option value="pai_mae">Pai/Mãe</option><option value="filho_filha">Filho/Filha</option><option value="irmao_irma">Irmão/Irmã</option><option value="gerente">Gerente</option><option value="advogado">Advogado</option><option value="contador">Contador</option><option value="outro">Outro</option></select></div>' +
        '<div class="fg"><label class="fl">Telefone</label><input class="fi" type="tel" id="ce-tel-'+idx+'" placeholder="(16) 99999-0000" maxlength="15" oninput="mascaraTel(this)" /></div>' +
        '<div class="fg"><label class="fl">E-mail</label><input class="fi" type="email" id="ce-email-'+idx+'" placeholder="email@dominio.com" /></div>' +
      '</div>';
    el.appendChild(div);
  }

  function removerContatoExtra(idx) {
    var el = document.getElementById('contato-extra-' + idx);
    if(el) el.remove();
  }

  function coletarContatosExtras() {
    var result = [];
    for(var i=0; i<contatosExtras.length; i++){
      var nome = (document.getElementById('ce-nome-'+i)||{value:''}).value.trim();
      if(!nome) continue;
      result.push({
        nome: nome.toUpperCase(),
        papel: (document.getElementById('ce-papel-'+i)||{value:'outro'}).value,
        telefone: (document.getElementById('ce-tel-'+i)||{value:''}).value.trim()||null,
        email: (document.getElementById('ce-email-'+i)||{value:''}).value.trim()||null
      });
    }
    return result;
  }

  // =============================================
  // RESPONSÁVEL LEGAL (CNPJ)
  // =============================================
  // (Versões duplicadas de detectarTipoCliente / adicionarResponsavelLegal /
  //  limparResponsaveisLegais foram removidas — as versões ativas estão no
  //  bloco "RESPONSÁVEL LEGAL" mais abaixo no arquivo.)

  function coletarResponsaveisLegais() {
    var lista = document.getElementById('lista-resp-legais');
    var result = [];
    for(var i=0; i<lista.children.length; i++){
      var nome = (document.getElementById('resp-legal-nome-'+i)||{value:''}).value.trim();
      if(!nome) continue;
      result.push({
        nome: nome.toUpperCase(),
        cpf: (document.getElementById('resp-legal-cpf-'+i)||{value:''}).value.trim(),
        telefone: (document.getElementById('resp-legal-tel-'+i)||{value:''}).value.trim()||null,
        email: (document.getElementById('resp-legal-email-'+i)||{value:''}).value.trim()||null,
        papel: 'responsavel_legal',
        principal: i === 0
      });
    }
    return result;
  }

  // =============================================
  // ETAPA 1: SALVAR CLIENTE
  // =============================================
  var _savingCliente = false;
  async function salvarClienteESair() {
    if (_savingCliente) return;
    _savingCliente = true;
    try {
      var ok = await _salvarClienteInterno();
      if(ok) { fecharModal('ov-cliente'); await carregarDados(); }
    } finally { _savingCliente = false; }
  }

  async function salvarCliente() {
    if (_savingCliente) return;
    _savingCliente = true;
    try {
      var eid = document.getElementById('eid-cliente').value;
      var ok = await _salvarClienteInterno();
      if(!ok) return;
      if(eid) {
        fecharModal('ov-cliente');
        await carregarDados();
        alert('Cliente atualizado com sucesso!');
      } else {
        fecharModal('ov-cliente');
        await carregarDados();
        _abrirEtapa2();
      }
    } finally { _savingCliente = false; }
  }

  async function _salvarClienteInterno() {
    var nome = document.getElementById('c-nome').value.trim();
    var doc = document.getElementById('c-doc').value.trim();
    var tel = document.getElementById('c-tel1').value.trim();
    var email = document.getElementById('c-email').value.trim();
    if(!nome) { alert('Nome é obrigatório.'); return false; }
    if(!doc) { alert('CPF/CNPJ é obrigatório.'); return false; }
    var isCNPJ = doc.replace(/\D/g,'').length > 11;

    // Validação de dígitos verificadores
    if (!validarDocumento(doc)) {
      alert('⚠️ ' + (isCNPJ?'CNPJ':'CPF') + ' inválido. Confira os dígitos.');
      return false;
    }

    // Validação de email se preenchido
    if (email && !validarEmail(email)) {
      alert('⚠️ E-mail inválido. Confira o formato.');
      return false;
    }

    // Validação de telefone (mínimo 10 dígitos = DDD + 8 ou 9)
    var telDig = (tel||'').replace(/\D/g,'');
    if (tel && telDig.length < 10) {
      alert('⚠️ Telefone incompleto. Use formato (XX) 9XXXX-XXXX.');
      return false;
    }

    var respLegais = coletarResponsaveisLegais();
    if(isCNPJ && respLegais.length === 0) {
      alert('Para empresas, informe ao menos um responsável legal.'); return false;
    }

    // Validar CPF de cada responsável legal
    for (var rli = 0; rli < respLegais.length; rli++) {
      var rl = respLegais[rli];
      if (!rl.cpf || rl.cpf.replace(/\D/g,'').length === 0) {
        alert('⚠️ Responsável legal "' + rl.nome + '" — CPF é obrigatório.');
        return false;
      }
      if (!validarCPF(rl.cpf)) {
        alert('⚠️ CPF do responsável legal "' + rl.nome + '" é inválido.');
        return false;
      }
    }

    var eid = document.getElementById('eid-cliente').value;

    // Validação de CPF/CNPJ duplicado — comparação só por dígitos
    var docDigitos = doc.replace(/\D/g,'');
    var duplicado = clientes.find(function(cc){
      var cdig = (cc.cpf_cnpj||'').replace(/\D/g,'');
      // Em edição, ignorar o próprio cliente
      if (eid && cc.id === eid) return false;
      return cdig && cdig === docDigitos;
    });
    if (duplicado) {
      alert('⚠️ Já existe um cliente cadastrado com este ' + (isCNPJ?'CNPJ':'CPF') + ':\n\n' +
            '• ' + duplicado.nome + '\n' +
            '• Documento: ' + (duplicado.cpf_cnpj||'') + '\n\n' +
            'Não é possível cadastrar o mesmo titular duas vezes. ' +
            'Se desejar adicionar uma nova propriedade ou ponto a este cliente, ' +
            'use o botão "Ver" na lista de clientes.');
      return false;
    }

    var payload = { nome: upper(nome), cpf_cnpj: doc, telefone1: tel||null, email: email||null, ativo: true, status_funil: 'cliente_ativo' };
    var cid;
    if(eid) {
      await api('clientes?id=eq.'+eid, 'PATCH', payload, 'return=minimal');
      cid = eid;
    } else {
      var r = await api('clientes', 'POST', payload, 'return=representation');
      console.log('[Zello] POST clientes status:', r ? r.status : 'null');
      if(!r || !r.ok) {
        var errText = r ? await r.text() : 'sem resposta';
        console.error('[Zello] Erro clientes:', errText);
        alert('Erro ao salvar cliente: ' + errText.substring(0,200)); return false;
      }
      var d = await r.json(); cid = d[0] && d[0].id;
      console.log('[Zello] Cliente salvo, id:', cid);
      if(!cid) { alert('Erro ao obter ID do cliente.'); return false; }
    }
    clienteAtualId = cid;

    // Sempre limpa todos os contatos do cliente antes de re-inserir, em qualquer modo
    // (novo cadastro ou edição). Isso impede duplicatas se o usuário clica salvar duas
    // vezes ou se o fluxo de edição não tiver feito o DELETE corretamente.
    await api('contatos?cliente_id=eq.'+cid, 'DELETE', null, 'return=minimal');

    // Deduplica responsáveis legais por (nome+cpf) e contatos extras por (nome+telefone)
    // antes de gravar — mesmo se o usuário tiver adicionado o mesmo duas vezes na tela.
    var rlVistos = {};
    var rlDedup = [];
    for (var i=0; i<respLegais.length; i++) {
      var rl = respLegais[i];
      var k = (rl.nome||'').trim().toUpperCase() + '|' + (rl.cpf||'').replace(/\D/g,'');
      if (rlVistos[k]) continue;
      rlVistos[k] = true;
      rlDedup.push(rl);
    }
    for (var i2=0; i2<rlDedup.length; i2++) {
      var rl2 = rlDedup[i2];
      await api('contatos', 'POST', { cliente_id: cid, nome: rl2.nome, papel: rl2.papel, telefone: rl2.telefone, email: rl2.email, principal: rl2.principal }, 'return=minimal');
    }

    var extras = coletarContatosExtras();
    var ctVistos = {};
    var ctDedup = [];
    for (var j=0; j<extras.length; j++) {
      var ct = extras[j];
      var k2 = (ct.nome||'').trim().toUpperCase() + '|' + ((ct.telefone||'').replace(/\D/g,'')) + '|' + (ct.papel||'');
      if (ctVistos[k2]) continue;
      ctVistos[k2] = true;
      ctDedup.push(ct);
    }
    for (var j2=0; j2<ctDedup.length; j2++) {
      var ct2 = ctDedup[j2];
      await api('contatos', 'POST', { cliente_id: cid, nome: ct2.nome, papel: ct2.papel, telefone: ct2.telefone, email: ct2.email, principal: false }, 'return=minimal');
    }
    return true;
  }

  // =============================================
  // ETAPA 2: PROPRIEDADE
  // =============================================
  function _abrirEtapa2() {
    document.getElementById('eid-prop').value = '';
    document.getElementById('p-nome').value = '';
    document.getElementById('p-cidade').value = '';
    document.getElementById('p-estado').value = 'SP';
    document.querySelector('#ov-prop .modal-title').textContent = 'Cadastrar propriedade / empreendimento';
    var sub = document.getElementById('prop-sub');
    var cli = clientes.find(function(c){ return c.id === clienteAtualId; });
    if(sub) sub.textContent = 'Etapa 2 de 3' + (cli ? ' — ' + cli.nome : '');
    // Restaurar texto do botão azul (edição anterior pode tê-lo alterado)
    var _btnProp = document.querySelector('#ov-prop .btn-blue');
    if (_btnProp) _btnProp.textContent = 'Salvar e continuar →';
    // Pré-carrega cidades de SP em background (estado padrão)
    _buscarCidadeOnline('SP');
    abrirModal('ov-prop');
  }

  async function salvarPropESair() {
    var ok = await _salvarPropInterno();
    if(ok) { fecharModal('ov-prop'); await carregarDados(); }
  }

  async function adicionarOutraPropriedade() {
    var ok = await _salvarPropInterno();
    if(!ok) return;
    fecharModal('ov-prop');
    setTimeout(function(){ _abrirEtapa2(); }, 150);
  }

  async function salvarPropriedade() {
    var eid = document.getElementById('eid-prop').value;
    var ok = await _salvarPropInterno();
    if(!ok) return;
    if(eid) {
      document.querySelector('#ov-prop .modal-title').textContent = 'Cadastrar propriedade / empreendimento';
      fecharModal('ov-prop');
      await carregarDados();
      verCliente(clienteAtualId);
      alert('Propriedade atualizada com sucesso!');
    } else {
      fecharModal('ov-prop');
      await carregarDados();  // Atualiza contatos para popularSelectResponsavel
      setTimeout(function(){ _abrirEtapa3(); }, 150);
    }
  }

  async function _salvarPropInterno() {
    var nome = document.getElementById('p-nome').value.trim();
    if(!nome) { alert('Nome do empreendimento é obrigatório.'); return false; }
    if(!clienteAtualId) { alert('Erro: reinicie o cadastro.'); return false; }
    var payload = {
      cliente_id: clienteAtualId,
      nome: upper(nome),
      cidade: upper(document.getElementById('p-cidade').value.trim()) || null,
      estado: document.getElementById('p-estado').value,
      ativo: true
    };
    var eid = document.getElementById('eid-prop').value;
    if(eid) {
      await api('propriedades?id=eq.'+eid, 'PATCH', payload, 'return=minimal');
      propAtualId = eid;
    } else {
      var r = await api('propriedades', 'POST', payload, 'return=representation');
      console.log('[Zello] POST propriedades status:', r ? r.status : 'null');
      if(!r || !r.ok) {
        var errText = r ? await r.text() : 'sem resposta';
        console.error('[Zello] Erro propriedades:', errText);
        alert('Erro ao salvar propriedade: ' + errText.substring(0,200)); return false;
      }
      var d = await r.json(); propAtualId = d[0] && d[0].id;
      console.log('[Zello] Propriedade salva, id:', propAtualId);
      if(!propAtualId) { alert('Erro ao obter ID da propriedade.'); return false; }
    }
    return true;
  }

  // =============================================
  // ETAPA 3: PONTO DE CAPTAÇÃO
  // =============================================
  function _abrirEtapa3() {
    limparFormUso();
    var listaEl = document.getElementById('lista-usos-adicionados');
    if(listaEl) listaEl.innerHTML = '';
    popularSelectResponsavel(clienteAtualId, null);
    document.querySelector('#ov-uso .modal-title').textContent = 'Cadastrar ponto de captação';
    var sub = document.getElementById('uso-sub');
    var prop = propriedades.find(function(p){ return p.id === propAtualId; });
    if(sub) sub.textContent = 'Etapa 3 de 3' + (prop ? ' — ' + prop.nome : '');
    // Restaurar texto e ação do botão de salvar (edição anterior pode tê-los alterado)
    var _btnUso = document.getElementById('btn-salvar-uso');
    if (_btnUso) {
      _btnUso.textContent = 'Salvar e finalizar ✓';
      _btnUso.onclick = function() { salvarUso(true); };
    }
    // Mostrar de volta o botão "+ Adicionar outro ponto"
    var _btnAddOutro = document.getElementById('btn-uso-add-outro');
    if (_btnAddOutro) _btnAddOutro.style.display = '';
    abrirModal('ov-uso');
  }



  function cancelarUso() {
    fecharModal('ov-uso');
  }

  function toggleHidroInput(semHidro) {
    var bloco = document.getElementById('u-hidro-block');
    if(bloco) bloco.style.display = semHidro ? 'none' : 'block';
    // SEMANA 4.10: Relatório de Vazão SÓ faz sentido quando TEM hidrômetro
    // Se admin marcar "não tem hidrômetro", esconde e desmarca o relatório
    var blocoRel = document.getElementById('u-bloco-relatorio');
    if (blocoRel) blocoRel.style.display = semHidro ? 'none' : 'block';
    if (semHidro) {
      var chkRel = document.getElementById('u-rel-vazao');
      if (chkRel) chkRel.checked = false;
    }
  }

  // SEMANA 4.11: Helper — um ponto "requer leitura mensal" SÓ se admin marcou
  // explicitamente "Necessário apresentar Relatório de Vazão".
  //
  // Lógica de cobrança:
  //   • TEM hidro + relatório NÃO  → não cobra (admin não quer cobrar)
  //   • TEM hidro + relatório SIM  → COBRA leitura mensal
  //   • NÃO tem hidro              → não cobra (não tem como medir)
  function requerLeitura(u) {
    if (!u) return false;
    // Só cobra se tem hidrômetro E admin marcou relatório
    return u.possui_hidrometro === true && u.requer_relatorio_vazao === true;
  }

  // Calcula volume mensal autorizado (m³/mês) a partir de m³/h × horas/dia × dias/mês
  function calcVazao() {
    var vh = parseFloat((document.getElementById('u-vh')||{}).value) || 0;
    var hd = parseFloat((document.getElementById('u-hd')||{}).value) || 0;
    var dm = parseFloat((document.getElementById('u-dm')||{}).value) || 0;
    var vol = vh * hd * dm;
    var elVc = document.getElementById('u-vc');
    var elVr = document.getElementById('u-vr');
    if (elVc) elVc.textContent = vol.toLocaleString('pt-BR', {maximumFractionDigits: 1});
    if (elVr) elVr.style.display = vol > 0 ? 'block' : 'none';
  }

  // Limita o ano de um input type=date a 4 dígitos (1900-2099). Trunca anos absurdos.
  function validarAno4Digitos(input) {
    var v = input.value || '';
    if (!v) return;
    // formato esperado: YYYY-MM-DD
    var partes = v.split('-');
    if (partes.length !== 3) return;
    // Trunca anos com mais de 4 dígitos (ex: 20245)
    if (partes[0].length > 4) {
      partes[0] = partes[0].slice(0, 4);
      input.value = partes.join('-');
    }
    // Só valida quando o ano está completo (4 dígitos) — não interfere durante a digitação
    if (partes[0].length === 4) {
      var ano = parseInt(partes[0], 10);
      if (ano > 2099 || ano < 1900) {
        alert('Ano deve estar entre 1900 e 2099. Verifique a data.');
        input.value = '';
      }
    }
  }

  function limparFormUso() {
    ['u-desc','u-req','u-portaria','u-processo','u-data-emissao','u-prazo','u-vh','u-hd','u-dm','u-serie'].forEach(function(id){
      var el = document.getElementById(id); if(el) el.value = '';
    });
    var tipo = document.getElementById('u-tipo'); if(tipo) tipo.value = 'outorga';
    var hidro = document.getElementById('u-sem-hidro'); if(hidro) hidro.checked = false;
    // SEMANA 4.7: reseta também o checkbox de relatório
    var relVazao = document.getElementById('u-rel-vazao'); if(relVazao) relVazao.checked = false;
    var resp = document.getElementById('u-responsavel'); if(resp) resp.value = '';
    var foto = document.getElementById('u-foto'); if(foto) foto.value = '';
    var pdf = document.getElementById('u-pdf-outorga'); if(pdf) pdf.value = '';
    var pdfAtual = document.getElementById('u-pdf-atual'); if(pdfAtual) { pdfAtual.style.display='none'; pdfAtual.innerHTML=''; }
    var fotoAtual = document.getElementById('u-foto-atual'); if(fotoAtual) { fotoAtual.style.display='none'; fotoAtual.innerHTML=''; }
    var vc = document.getElementById('u-vc'); if(vc) vc.textContent = '0';
    var vr = document.getElementById('u-vr'); if(vr) vr.style.display='none';
    document.getElementById('eid-uso').value = '';
    toggleHidroInput(false);
  }

  // (Versão duplicada de popularSelectResponsavel removida — a versão ativa
  //  está mais abaixo, com deduplicação por telefone+nome.)

  // Flag global de "salvamento em andamento" — bloqueia duplo clique
  var _salvandoUso = false;

  async function salvarUso(finalizar) {
    // Proteção contra duplo clique: se já está salvando, ignora
    if (_salvandoUso) return;
    _salvandoUso = true;

    // Desabilita visualmente os dois botões enquanto salva
    var _btnSalvar = document.getElementById('btn-salvar-uso');
    var _btnAddOutro = document.getElementById('btn-uso-add-outro');
    var _txtOriginal = _btnSalvar ? _btnSalvar.textContent : '';
    if (_btnSalvar) { _btnSalvar.disabled = true; _btnSalvar.textContent = '⏳ Salvando...'; }
    if (_btnAddOutro) _btnAddOutro.disabled = true;

    // Helper interno pra reabilitar tudo no fim (em qualquer caminho de saída)
    function _reabilitarBotoes() {
      _salvandoUso = false;
      if (_btnSalvar) { _btnSalvar.disabled = false; _btnSalvar.textContent = _txtOriginal || 'Salvar e finalizar ✓'; }
      if (_btnAddOutro) _btnAddOutro.disabled = false;
    }

    try {
    if(!clienteAtualId || !propAtualId) {
      alert('Erro interno: dados do cliente perdidos. Feche e refaça o cadastro.');
      return;
    }
    var desc = document.getElementById('u-desc').value.trim();
    if(!desc) { alert('Descrição do ponto é obrigatória.'); return; }
    var semHidro = document.getElementById('u-sem-hidro').checked;
    // SEMANA 4.7: se sem hidrômetro, pega se precisa de relatório de vazão
    var requerRelVazao = !semHidro ? ((document.getElementById('u-rel-vazao') || {}).checked || false) : false;
    var respSel = document.getElementById('u-responsavel').value;
    var respTel = respSel === 'outro' ? (document.getElementById('u-resp-fone')||{value:''}).value.trim() : respSel;

    // Upload foto
    var fotoUrl = null;
    var fotoInput = document.getElementById('u-foto');
    if(fotoInput && fotoInput.files && fotoInput.files[0]) {
      var fotoExt = fotoInput.files[0].name.split('.').pop() || 'jpg';
      fotoUrl = await uploadFile('documentos-zello','fotos/'+clienteAtualId+'/'+Date.now()+'.'+fotoExt, fotoInput.files[0]);
    }

    // Upload PDF
    var pdfUrl = null;
    var pdfInput = document.getElementById('u-pdf-outorga');
    if(pdfInput && pdfInput.files && pdfInput.files[0]) {
      pdfUrl = await uploadFile('documentos-zello','outorgas/'+clienteAtualId+'/'+Date.now()+'.pdf', pdfInput.files[0]);
    }

    var eid = document.getElementById('eid-uso').value;

    // FASE 3B Item 4: validação de portaria
    var portariaRaw = document.getElementById('u-portaria').value.trim();
    var vPort = validarPortaria(portariaRaw);
    if (!vPort.ok) {
      alert('⚠ Portaria inválida\n\n' + vPort.mensagem);
      document.getElementById('u-portaria').focus();
      return;
    }

    var payload = {
      propriedade_id: propAtualId,
      cliente_id: clienteAtualId,
      descricao: upper(desc),
      tipo_outorga: document.getElementById('u-tipo').value,
      requerimento: upper(document.getElementById('u-req').value.trim())||null,
      portaria: vPort.valor,
      processo: upper(document.getElementById('u-processo').value.trim())||null,
      data_emissao: document.getElementById('u-data-emissao').value||null,
      prazo_anos: parseInt(document.getElementById('u-prazo').value)||null,
      vazao_m3h: parseFloat(document.getElementById('u-vh').value)||null,
      horas_uso_dia: parseFloat(document.getElementById('u-hd').value)||null,
      dias_uso_mes: parseInt(document.getElementById('u-dm').value)||null,
      possui_hidrometro: !semHidro,
      numero_serie: semHidro ? null : (upper(document.getElementById('u-serie').value.trim())||null),
      requer_relatorio_vazao: requerRelVazao,
      responsavel_tel: respTel||null,
      ativo: true
    };
    if(fotoUrl) payload.foto_equipamento_url = fotoUrl;
    if(pdfUrl) payload.outorga_pdf_url = pdfUrl;

    if(eid) {
      await api('usos?id=eq.'+eid, 'PATCH', payload, 'return=minimal');
    } else {
      payload.token = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0;return(c==='x'?r:(r&0x3|0x8)).toString(16);});
      var r = await api('usos', 'POST', payload, 'return=minimal');
      if(!r || !r.ok) {
        var errTxt = r ? await r.text() : 'sem resposta';
        console.error('[Zello] Erro usos POST:', errTxt);
        // Se erro indicar coluna inexistente, remove a coluna do payload e tenta de novo
        // Mensagem típica do PostgREST: "Could not find the 'xxx' column of 'usos' in the schema cache"
        var matchCol = errTxt.match(/'([a-z_]+)' column of/i) ||
                       errTxt.match(/column "([a-z_]+)"/i) ||
                       errTxt.match(/column ([a-z_]+) does not exist/i);
        if (matchCol && matchCol[1] && payload.hasOwnProperty(matchCol[1])) {
          console.warn('[Zello] Coluna inexistente, removendo:', matchCol[1]);
          var colRemovida = matchCol[1];
          delete payload[colRemovida];
          r = await api('usos', 'POST', payload, 'return=minimal');
          if(!r || !r.ok) { alert('Erro ao salvar ponto de captação. ' + (r ? await r.text() : '')); return; }
          // Avisa o usuário sobre colunas críticas que precisam ser criadas no banco
          if (colRemovida === 'outorga_pdf_url' || colRemovida === 'foto_equipamento_url') {
            alert('⚠️ Atenção: o ponto foi salvo, MAS o ' +
                  (colRemovida === 'outorga_pdf_url' ? 'PDF da outorga' : 'foto do equipamento') +
                  ' NÃO foi gravado porque a coluna "' + colRemovida + '" não existe na tabela "usos" do banco.\n\n' +
                  'Para corrigir, execute no Supabase (SQL Editor):\n\n' +
                  'ALTER TABLE usos ADD COLUMN ' + colRemovida + ' TEXT;');
          }
        } else if(errTxt.indexOf('portaria') > -1 || errTxt.indexOf('processo') > -1 || errTxt.indexOf('data_emissao') > -1 || errTxt.indexOf('prazo_anos') > -1 || errTxt.indexOf('tipo_outorga') > -1 || errTxt.indexOf('requerimento') > -1) {
          // Identifica quais colunas faltam para avisar com clareza
          var colsFaltando = [];
          ['portaria','processo','data_emissao','prazo_anos','tipo_outorga','requerimento'].forEach(function(col){
            if (errTxt.indexOf(col) > -1 && payload.hasOwnProperty(col)) {
              colsFaltando.push(col);
              delete payload[col];
            }
          });
          r = await api('usos', 'POST', payload, 'return=minimal');
          if(!r || !r.ok) { alert('Erro ao salvar ponto de captação. ' + (r ? await r.text() : '')); return; }
          // Avisa o usuário que os dados de outorga não foram gravados
          if (colsFaltando.length > 0) {
            var faltandoLabel = colsFaltando.map(function(c){
              var nomes = {'portaria':'Portaria','processo':'Processo SEI','data_emissao':'Data de emissão','prazo_anos':'Prazo (anos)','tipo_outorga':'Tipo de outorga','requerimento':'Requerimento'};
              return nomes[c]||c;
            }).join(', ');
            var sqlFix = colsFaltando.map(function(c){
              var tipos = {'portaria':'TEXT','processo':'TEXT','data_emissao':'DATE','prazo_anos':'INTEGER','tipo_outorga':'TEXT','requerimento':'TEXT'};
              return 'ALTER TABLE usos ADD COLUMN IF NOT EXISTS ' + c + ' ' + (tipos[c]||'TEXT') + ';';
            }).join('\n');
            alert('⚠️ Atenção: o ponto foi salvo, MAS os campos abaixo NÃO foram gravados porque as colunas não existem no banco:\n\n' +
                  '• ' + faltandoLabel + '\n\n' +
                  'Sem isso, a tela "Renovações" não consegue calcular vencimentos.\n\n' +
                  'Execute no Supabase (SQL Editor):\n\n' + sqlFix);
          }
        } else {
          alert('Erro ao salvar ponto de captação: ' + errTxt.substring(0,200)); return;
        }
      }
    }

    if(finalizar) {
      fecharModal('ov-uso');
      await carregarDados();
      verCliente(clienteAtualId);
    } else {
      limparFormUso();
      popularSelectResponsavel(clienteAtualId, null);
    }
    } catch(_e) {
      console.error('[Zello] Erro inesperado em salvarUso:', _e);
      alert('Erro inesperado ao salvar: ' + (_e && _e.message ? _e.message : _e));
    } finally {
      // Garante que os botões voltam ao normal em QUALQUER caminho de saída
      _reabilitarBotoes();
    }
  }

  // (Versões obsoletas de editarCliente / editarPropriedade / editarUso / verCliente
  //  foram removidas — as versões ativas estão mais abaixo.)

  // =============================================
  // RENDERIZAR LISTA DE CLIENTES
  // =============================================
  // (Versões duplicadas de renderClientes, filtrarClientes e limparTodosClientes
  //  foram removidas — as versões ativas estão mais abaixo.)


  // =============================================
  // CARREGAR E RENDERIZAR DADOS
  // =============================================
  // =============================================
  // ACOMPANHAMENTO DE VAZÕES
  // =============================================
  function popularAnoSelect() {
    const s = document.getElementById('acomp-ano');
    if (!s) return;
    const anoAtual = new Date().getFullYear();
    s.innerHTML = '';
    for (let a = anoAtual; a >= anoAtual - 3; a--) {
      const o = document.createElement('option');
      o.value = a; o.textContent = a;
      if (a === anoAtual) o.selected = true;
      s.appendChild(o);
    }
  }

  function popularAcompClientes() {
    const s = document.getElementById('acomp-cli');
    if (!s) return;
    const v = s.value;
    s.innerHTML = '<option value="">Todos os clientes</option>';
    clientes.forEach(function(c) {
      const o = document.createElement('option');
      o.value = c.id; o.textContent = c.nome;
      s.appendChild(o);
    });
    s.value = v;
  }

  async function carregarAcompanhamento() {
    const el = document.getElementById('acomp-conteudo');
    if (!el) return;
    el.innerHTML = '<p style="font-size:12px;color:var(--text-muted)">Carregando dados...</p>';

    const cid = document.getElementById('acomp-cli').value;
    const ano = document.getElementById('acomp-ano').value || new Date().getFullYear();
    const meses = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    const nomeMeses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

    // Filtrar usos relevantes
    let usosVisiveis = usos.filter(function(u) { return u.possui_hidrometro; });
    // Não mostra usos de leads ou clientes em projeto — só de clientes ativos
    const idsAtivos = new Set(clientes.map(function(c){ return c.id; }));
    usosVisiveis = usosVisiveis.filter(function(u){ return idsAtivos.has(u.cliente_id); });
    if (cid) usosVisiveis = usosVisiveis.filter(function(u) { return u.cliente_id === cid; });

    if (!usosVisiveis.length) {
      el.innerHTML = '<div class="card" style="text-align:center;padding:32px;color:var(--text-muted)">Nenhum ponto com hidrômetro encontrado.</div>';
      return;
    }

    // Buscar leituras do ano para todos os pontos
    const url = 'leituras?select=*&uso_id=in.(' + usosVisiveis.map(function(u){return u.id;}).join(',') + ')&mes_referencia=gte.' + ano + '-01&mes_referencia=lte.' + ano + '-12';
    const leiturasAno = await api(url) || [];

    // Agrupar por uso_id e mes
    const dadosPorUso = {};
    leiturasAno.forEach(function(l) {
      if (!dadosPorUso[l.uso_id]) dadosPorUso[l.uso_id] = {};
      dadosPorUso[l.uso_id][l.mes_referencia] = l.consumo_m3 || 0;
    });

    el.innerHTML = usosVisiveis.map(function(u) {
      const c = clientes.find(function(cc){return cc.id===u.cliente_id;});
      const p = propriedades.find(function(pp){return pp.id===u.propriedade_id;});
      const aut = getAutorizadoUso(u);
      const dadosUso = dadosPorUso[u.id] || {};
      const valores = meses.map(function(m) { return dadosUso[ano + '-' + m] || 0; });
      const totalAno = valores.reduce(function(s,v){return s+v;},0);
      const pctAno = aut > 0 ? Math.round(totalAno/(aut*12)*100) : 0;
      const maxVal = Math.max.apply(null, valores.concat([aut, 1]));
      const mesAtual = new Date().getMonth(); // 0-indexed

      // Gerar barras
      const barras = valores.map(function(v, i) {
        const acima = aut > 0 && v > aut;
        const vazio = v === 0;
        const pct = Math.round(v / maxVal * 100);
        const isMesAtual = i === mesAtual && parseInt(ano) === new Date().getFullYear();
        const corBarra = vazio ? '#e5e7eb' : acima ? '#C62828' : '#1565C0';
        const corTexto = acima ? '#C62828' : vazio ? '#9ca3af' : '#374151';
        return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;">' +
          '<div style="font-size:10px;font-weight:' + (acima?'700':'400') + ';color:' + corTexto + ';height:16px;display:flex;align-items:flex-end;">' + (vazio ? '' : v.toFixed(0)) + '</div>' +
          '<div style="width:100%;height:80px;display:flex;align-items:flex-end;position:relative;">' +
            (aut > 0 ? '<div style="position:absolute;bottom:' + Math.round(aut/maxVal*80) + 'px;left:0;right:0;height:1px;background:#E65100;opacity:0.5;"></div>' : '') +
            '<div style="width:100%;height:' + Math.max(pct*80/100, vazio?0:3) + 'px;background:' + corBarra + ';border-radius:3px 3px 0 0;transition:height .3s;"></div>' +
          '</div>' +
          '<div style="font-size:10px;color:' + (isMesAtual?'var(--blue)':'var(--text-muted)') + ';font-weight:' + (isMesAtual?'600':'400') + ';">' + nomeMeses[i] + '</div>' +
        '</div>';
      }).join('');

      return '<div class="card" style="margin-bottom:14px;">' +
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px;">' +
          '<div>' +
            '<div style="font-size:13px;font-weight:600;">' + (c?c.nome:'') + ' — ' + (p?p.nome:'') + '</div>' +
            '<div style="font-size:11px;color:var(--text-muted);margin-top:2px;">💧 ' + u.descricao + (u.numero_serie?' · '+u.numero_serie:'') + (aut>0?' · Autorizado: <strong>'+aut.toFixed(1)+' m³/mês</strong>':'') + '</div>' +
          '</div>' +
          '<div style="display:flex;gap:8px;align-items:center;">' +
            '<div style="text-align:center;background:' + (pctAno>100?'var(--red-light)':'var(--blue-light)') + ';padding:6px 12px;border-radius:8px;">' +
              '<div style="font-size:16px;font-weight:700;color:' + (pctAno>100?'var(--red)':'var(--blue)') + ';">' + pctAno + '%</div>' +
              '<div style="font-size:9px;color:var(--text-muted);">do autorizado ' + ano + '</div>' +
            '</div>' +
            '<div style="text-align:center;background:#f9fafb;padding:6px 12px;border-radius:8px;">' +
              '<div style="font-size:16px;font-weight:700;color:var(--text);">' + totalAno.toFixed(0) + '</div>' +
              '<div style="font-size:9px;color:var(--text-muted);">m³ captados</div>' +
            '</div>' +
            '<button class="btn btn-sm" onclick="lancarLeitura(this.dataset.id)" data-id="' + u.id + '">+ Lançar leitura</button>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:4px;align-items:flex-end;padding:8px 0;">' + barras + '</div>' +
        (aut>0?'<div style="display:flex;align-items:center;gap:6px;margin-top:8px;font-size:10px;color:var(--text-muted);"><div style="width:20px;height:1px;background:#E65100;"></div> Limite da outorga (' + aut.toFixed(1) + ' m³/mês)</div>':'') +
      '</div>';
    }).join('');
  }

  // =============================================
  // LANÇAR LEITURA MANUAL
  // =============================================
  let _lancarUsoId = null;
  let _lancarModo = 'leituras'; // 'leituras' ou 'consumo'

  function lancarModo(modo) {
    _lancarModo = modo;
    const btnL = document.getElementById('lancar-btn-leituras');
    const btnC = document.getElementById('lancar-btn-consumo');
    const blocoL = document.getElementById('lancar-bloco-leituras');
    const blocoC = document.getElementById('lancar-bloco-consumo');
    if (modo === 'leituras') {
      btnL.style.background = '#1565C0'; btnL.style.color = 'white';
      btnC.style.background = '#f9fafb'; btnC.style.color = 'var(--text-muted)';
      blocoL.style.display = 'block'; blocoC.style.display = 'none';
    } else {
      btnC.style.background = '#1565C0'; btnC.style.color = 'white';
      btnL.style.background = '#f9fafb'; btnL.style.color = 'var(--text-muted)';
      blocoC.style.display = 'block'; blocoL.style.display = 'none';
    }
  }

  function lancarLeitura(usoId) {
    _lancarUsoId = String(usoId);
    const u = usos.find(function(uu){ return uu.id === _lancarUsoId; });
    const c = u ? clientes.find(function(cc){ return cc.id === u.cliente_id; }) : null;
    const p = u ? propriedades.find(function(pp){ return pp.id === u.propriedade_id; }) : null;
    if (!u) return;
    document.getElementById('lancar-titulo').textContent = 'Lançar leitura — ' + u.descricao;
    document.getElementById('lancar-sub').textContent = (c?c.nome:'') + (p?' · '+p.nome:'');
    document.getElementById('lancar-mes').value = getMes();
    document.getElementById('lancar-ant').value = '';
    document.getElementById('lancar-atu').value = '';
    document.getElementById('lancar-consumo-direto').value = '';
    document.getElementById('lancar-obs').value = '';
    document.getElementById('lancar-consumo').style.display = 'none';
    document.getElementById('lancar-alerta').style.display = 'none';
    document.getElementById('lancar-alerta-direto').style.display = 'none';
    lancarModo('leituras'); // sempre começa no modo leituras
    abrirModal('ov-lancar');
  }

  function calcLancarConsumo() {
    const ant = parseFloat(document.getElementById('lancar-ant').value) || 0;
    const atu = parseFloat(document.getElementById('lancar-atu').value) || 0;
    const el = document.getElementById('lancar-consumo');
    if (atu > 0) {
      const consumo = atu - ant;
      document.getElementById('lancar-consumo-val').textContent = consumo.toFixed(1);
      el.style.display = 'block';
      const u = usos.find(function(uu){ return uu.id === _lancarUsoId; });
      const aut = u ? getAutorizadoUso(u) : 0;
      document.getElementById('lancar-alerta').style.display = (aut>0&&consumo>aut)?'inline':'none';
    } else {
      el.style.display = 'none';
    }
  }

  function calcLancarConsumoDirecto() {
    const consumo = parseFloat(document.getElementById('lancar-consumo-direto').value) || 0;
    const u = usos.find(function(uu){ return uu.id === _lancarUsoId; });
    const aut = u ? getAutorizadoUso(u) : 0;
    document.getElementById('lancar-alerta-direto').style.display = (aut>0&&consumo>aut)?'block':'none';
  }

  async function confirmarLancarLeitura() {
    const u = usos.find(function(uu){ return uu.id === _lancarUsoId; });
    if (!u) return;
    const mes = document.getElementById('lancar-mes').value;
    if (!mes) { alert('Selecione o mês de referência.'); return; }
    const obs = document.getElementById('lancar-obs').value.trim() || null;
    const aut = getAutorizadoUso(u);
    let lAnt, lAtu, consumo;

    if (_lancarModo === 'leituras') {
      lAnt = parseFloat(document.getElementById('lancar-ant').value) || 0;
      lAtu = parseFloat(document.getElementById('lancar-atu').value);
      if (isNaN(lAtu) || document.getElementById('lancar-atu').value === '') { alert('Informe a leitura atual.'); return; }
      if (lAtu < lAnt) { alert('Leitura atual não pode ser menor que a anterior.'); return; }
      consumo = lAtu - lAnt;
    } else {
      // Modo consumo direto — buscar última leitura para calcular lAnt e lAtu
      consumo = parseFloat(document.getElementById('lancar-consumo-direto').value);
      if (isNaN(consumo) || consumo <= 0) { alert('Informe o consumo do mês.'); return; }
      const ultLeits = await api('leituras?uso_id=eq.'+_lancarUsoId+'&select=leitura_atual,mes_referencia&order=mes_referencia.desc&limit=1') || [];
      lAnt = ultLeits.length ? (ultLeits[0].leitura_atual || 0) : 0;
      lAtu = lAnt + consumo;
    }

    // VALIDAÇÃO: já existe leitura para este ponto neste mês?
    const dup = await api('leituras?uso_id=eq.'+_lancarUsoId+'&mes_referencia=eq.'+mes+'&select=id,consumo_m3&limit=1') || [];
    if (dup.length > 0) {
      // ONDA 2: zConfirm em vez de confirm nativo
      const escolha = await zConfirm(
        '⚠️ Já existe uma leitura cadastrada para este ponto no mês ' + mes + '.\n' +
        'Consumo registrado anteriormente: ' + (dup[0].consumo_m3 || 0).toFixed(1) + ' m³.\n\n' +
        'Cada ponto só pode ter UMA leitura por mês.\n\n' +
        'Substituir a leitura existente?',
        { tipo:'aviso', btnOk:'Substituir', btnCancel:'Manter antiga' }
      );
      if (!escolha) return;
      // Substitui: atualiza ao invés de inserir
      const rUp = await api('leituras?id=eq.'+dup[0].id, 'PATCH', {
        leitura_anterior: lAnt,
        leitura_atual: lAtu,
        consumo_m3: consumo,
        observacao: obs,
        enviado_em: new Date().toISOString()
      }, 'return=minimal');
      if (rUp && rUp.ok) {
        fecharModal('ov-lancar');
        await carregarDados();
        carregarAcompanhamento();
        alert('✅ Leitura SUBSTITUÍDA! ' + u.descricao + ' · ' + mes + ' · ' + consumo.toFixed(1) + ' m³');
      } else {
        var errMsg = '';
        if (rUp) { try { errMsg = await rUp.text(); } catch(e) {} }
        alert('Erro ao substituir leitura.' + (errMsg ? '\n\n' + errMsg.substring(0,200) : ''));
      }
      return;
    }

    if (aut > 0 && consumo > aut) {
      if (!confirm('ATENÇÃO! Consumo de ' + consumo.toFixed(1) + ' m³ está ACIMA do autorizado (' + aut.toFixed(1) + ' m³). Confirmar mesmo assim?')) return;
    }

    const r = await api('leituras', 'POST', {
      uso_id: _lancarUsoId,
      cliente_id: u.cliente_id,
      leitura_anterior: lAnt,
      leitura_atual: lAtu,
      consumo_m3: consumo,
      mes_referencia: mes,
      observacao: obs,
      enviado_em: new Date().toISOString()
    }, 'return=minimal');

    if (r && r.ok) {
      fecharModal('ov-lancar');
      await carregarDados();
      carregarAcompanhamento();
      alert('Leitura lançada! ' + u.descricao + ' · ' + mes + ' · ' + consumo.toFixed(1) + ' m³');
    } else {
      alert('Erro ao salvar leitura. Verifique a conexão.');
    }
  }

  // FASE 8: carregarDados agora roda 11 queries em PARALELO via Promise.allSettled
  // (Antes eram sequenciais, gastavam ~1.1s. Agora ~150ms — 7x mais rápido)
  async function carregarDados() {
    const mesAtual = getMes();

    // Helper: pega valor de Promise.allSettled ou retorna fallback
    function pick(result, fallback) {
      if (result.status === 'fulfilled' && result.value) return result.value;
      if (result.status === 'rejected') console.warn('carregarDados: query falhou', result.reason);
      return fallback;
    }

    const results = await Promise.allSettled([
      api('clientes?select=*&order=nome'),                                         // [0]
      api('propriedades?select=*&order=nome'),                                     // [1]
      api('usos?select=*'),                                                        // [2]
      api('contatos?select=*'),                                                    // [3]
      api('leituras?mes_referencia=eq.' + mesAtual + '&select=*'),                 // [4]
      api('notificacoes?select=*&order=prazo_resposta.asc'),                       // [5]
      api('documentos?select=*&order=data_vencimento.asc'),                        // [6]
      api('projetos?select=*&order=criado_em.desc'),                               // [7]
      api('documento_template?order=etapa.asc,ordem.asc&select=*'),                // [8]
      api('propostas?select=*&order=numero.desc'),                                 // [9]
      api('config_contratado?select=*&limit=1'),                                   // [10]
      api('config_funil?ativo=eq.true&order=ordem.asc&select=*'),                  // [11] FASE 9
      api('config_etapas_projeto?ativo=eq.true&order=numero.asc&select=*'),         // [12] FASE 10
      api('usuarios?select=id,nome,papel,cor,ativo')                                // [13] FASE 14.2
    ]);

    // FASE 14.2: popula cache de usuários (pra renderizar bolinhas de cor)
    _usuariosCache = pick(results[13], []);

    const todosClientes = pick(results[0], []);
    // Separa por status_funil. Default 'cliente_ativo' garante compatibilidade com clientes legados.
    clientes = todosClientes.filter(function(c){ return (c.status_funil || 'cliente_ativo') === 'cliente_ativo'; });
    const todosLeads = todosClientes.filter(function(c){ return c.status_funil === 'prospeccao'; });

    // FASE 14.2: segregação de leads por papel
    const sessAtual = getSessao();
    const papelAtual = (sessAtual && sessAtual.papel) || 'admin';
    const meuId = sessAtual && sessAtual.id;

    if (papelAtual === 'hunter') {
      // Hunter: vê só leads onde hunter_id === meuId
      leads = todosLeads.filter(function(c){ return c.hunter_id === meuId; });
    } else {
      // Admin e projetos: vê todos os leads (admin gerencia, projetos não vê mesmo)
      leads = todosLeads;
    }
    // Pool sempre é os "sem dono" — pra qualquer papel que tenha acesso à tela Pool
    leadsPool = todosLeads.filter(function(c){ return !c.hunter_id; });

    clientesEmProjeto = todosClientes.filter(function(c){ return c.status_funil === 'em_projeto'; });

    propriedades = pick(results[1], []);
    usos = pick(results[2], []);
    contatos = pick(results[3], []);
    leituras = pick(results[4], []);
    notificacoes = pick(results[5], []);
    documentos = pick(results[6], []);
    projetos = pick(results[7], []);
    templatesDoc = pick(results[8], []);
    propostas = pick(results[9], []);
    const cr = pick(results[10], []);
    configContratado = (cr && cr[0]) || null;
    // FASE 9: carrega config_funil ou fallback hardcoded
    const cf = pick(results[11], []);
    if (cf && cf.length) {
      configFunil = cf;
    } else if (!configFunil.length) {
      // Fallback se banco não tem ainda
      configFunil = [
        { codigo:'novo',       nome:'Novo',       icone:'🆕', cor:'#42A5F5', ordem:1 },
        { codigo:'em_contato', nome:'Em contato', icone:'📞', cor:'#FFA726', ordem:2 },
        { codigo:'proposta',   nome:'Proposta',   icone:'📄', cor:'#AB47BC', ordem:3 },
        { codigo:'aguardando', nome:'Aguardando', icone:'⏳', cor:'#FFB300', ordem:4 },
        { codigo:'perdido',    nome:'Perdido',    icone:'❌', cor:'#9E9E9E', ordem:5 }
      ];
    }

    // FASE 10: carrega config_etapas_projeto e atualiza ETAPAS_PROJETO
    const ce = pick(results[12], []);
    if (ce && ce.length) {
      ce.forEach(function(e) {
        const idx = e.numero - 1;
        if (idx >= 0 && idx < ETAPAS_PROJETO.length) {
          ETAPAS_PROJETO[idx].nome = e.nome || ETAPAS_PROJETO[idx].nome;
          ETAPAS_PROJETO[idx].icone = e.icone || ETAPAS_PROJETO[idx].icone;
          ETAPAS_PROJETO[idx].cor = e.cor || null;
          ETAPAS_PROJETO[idx]._id = e.id;
        }
      });
    }

    renderDashboard();
    // ONDA 3 BUG#1: aba Clientes mostra ativos + em_projeto (lista unificada)
    renderClientes(_listaUnificadaAbaClientes());
    renderRenovacoes();
    renderProspeccaoKanban();   // FASE 9
    atualizarTitulosKanbanProjeto();   // FASE 10
    atualizarBadgeNotif();
    atualizarBadgeDocs();
    atualizarBadgeLeads();
    atualizarBadgeProjetos();
    atualizarBadgePool();   // FASE 14.2
    popularSelectsRel();
    popularAcompClientes();
    popularAnoSelect();
    // Gráfico carrega depois para não bloquear a UI
    setTimeout(function() { iniciarGrafico(); }, 0);
  }

  function getAutorizadoUso(u) {
    if (!u) return 0;
    // Estratégia 1 (preferencial): cálculo a partir dos 3 campos manuais
    var calc = (u.vazao_m3h||0) * (u.horas_uso_dia||0) * (u.dias_uso_mes||0);
    if (calc > 0) return calc;
    // Estratégia 2 (fallback): volume diário oficial (DOE) × dias/mês (default 30)
    var volDia = parseFloat(u.volume_diario_m3) || 0;
    if (volDia > 0) {
      var dias = parseInt(u.dias_uso_mes, 10) || 30;
      return volDia * dias;
    }
    return 0;
  }

  function getDiasVencUso(u, prop) {
    // Prioridade: dados do ponto, fallback para propriedade
    const dataEmissao = u.data_emissao || (prop && prop.data_emissao);
    if (!dataEmissao) return null;
    // Prioridade NOVA: prazo_meses (do DOE) > prazo_anos (legado)
    var prazoMeses = null;
    if (u.prazo_meses) prazoMeses = parseInt(u.prazo_meses, 10);
    else if (u.prazo_anos) prazoMeses = parseInt(u.prazo_anos, 10) * 12;
    else if (prop && prop.prazo_anos) prazoMeses = parseInt(prop.prazo_anos, 10) * 12;
    if (!prazoMeses || prazoMeses <= 0) return null;
    const v = new Date(dataEmissao);
    v.setMonth(v.getMonth() + prazoMeses);
    return Math.round((v - new Date()) / (1000*60*60*24));
  }

  // Retorna os dias até o vencimento mais próximo da propriedade.
  // Considera todos os usos (pontos) da propriedade — o que vence primeiro
  // determina o estado da propriedade. Fallback nos campos da própria propriedade
  // (compatibilidade com schema antigo).
  function getDiasVenc(prop) {
    if (!prop) return null;
    var ussDaProp = (typeof usos !== 'undefined' && usos)
      ? usos.filter(function(u){ return u.propriedade_id === prop.id; })
      : [];
    var diasMin = null;
    ussDaProp.forEach(function(u){
      var d = getDiasVencUso(u, prop);
      if (d === null) return;
      if (diasMin === null || d < diasMin) diasMin = d;
    });
    // Fallback: se nenhum uso tem data, usa dados da própria propriedade
    if (diasMin === null && prop.data_emissao && prop.prazo_anos) {
      var v = new Date(prop.data_emissao);
      v.setFullYear(v.getFullYear() + parseInt(prop.prazo_anos,10));
      diasMin = Math.round((v - new Date()) / (1000*60*60*24));
    }
    return diasMin;
  }

  function getCorVenc(dias, renovando) {
    if (renovando) return { fundo:'#E3F2FD', borda:'#1565C0', texto:'#1565C0', label:'EM RENOVAÇÃO' };
    if (dias === null) return null;
    const m = dias / 30;
    if (m <= 2) return { fundo:'#FFEBEE', borda:'#C62828', texto:'#C62828', label:'CRÍTICO - ' + Math.ceil(m) + ' MES(ES)' };
    if (m <= 5) return { fundo:'#FFF3E0', borda:'#E65100', texto:'#E65100', label:'ATENÇÃO - ' + Math.ceil(m) + ' MESES' };
    if (m <= 6) return { fundo:'#FFFDE7', borda:'#F9A825', texto:'#F9A825', label:'AVISO - 6 MESES' };
    return { fundo:'#F1F8E9', borda:'#2E7D32', texto:'#2E7D32', label:'EM DIA' };
  }

  // Helper: classifica urgência por dias até prazo
  function classificarPrazo(dias) {
    if (dias === null || dias === undefined) return { cls: 'cinza', txt: 'sem prazo', sortKey: 9999 };
    if (dias < 0) return { cls: 'vermelho', txt: 'Vencida há ' + Math.abs(dias) + 'd', sortKey: dias };
    if (dias <= 5) return { cls: 'vermelho', txt: dias === 0 ? 'Hoje' : (dias + ' dia(s)'), sortKey: dias };
    if (dias <= 10) return { cls: 'laranja', txt: dias + ' dias', sortKey: dias };
    if (dias <= 20) return { cls: 'amarelo', txt: dias + ' dias', sortKey: dias };
    if (dias <= 60) return { cls: 'cinza', txt: dias + ' dias', sortKey: dias };
    return { cls: 'cinza', txt: Math.ceil(dias/30) + ' meses', sortKey: dias };
  }

  // FASE 14.2: Dashboard do Hunter (cards próprios)
  function renderDashHunter() {
    const sess = getSessao();
    if (!sess) return;

    function setText(id, txt) {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    }

    // Saudação personalizada
    const info = sess.cor ? CORES_TIMES[sess.cor] : null;
    const emoji = info ? info.emoji : '👋';
    const corNome = info ? ' (Time ' + info.nome + ')' : '';
    setText('dash-hunter-titulo', emoji + ' Olá, ' + (sess.nome || 'Hunter') + corNome);

    // Pool disponível (total de leads sem dono)
    setText('dh-pool', (leadsPool || []).length);

    // Meus leads ativos (todos os leads não-perdidos do hunter)
    const meusLeadsAtivos = (leads || []).filter(function(l){ return l.status_lead !== 'perdido'; });
    setText('dh-meus', meusLeadsAtivos.length);
    setText('dh-meus-sub', meusLeadsAtivos.length === 0 ? 'nenhum lead ativo' : 'em andamento');

    // Propostas enviadas (leads em status "proposta" ou "aguardando")
    const propostasEnviadas = (leads || []).filter(function(l){
      return l.status_lead === 'proposta' || l.status_lead === 'aguardando';
    });
    setText('dh-prop', propostasEnviadas.length);

    // Fechamentos do mês (Fase 14.4 vai popular de verdade — por enquanto mostra 0)
    setText('dh-fech', '0');
    setText('dh-fech-sub', 'próximo: R$ 500 (1º)');
  }

  // ============================================================
  // SEMANA 3.2: GRÁFICOS DO DASHBOARD (admin only)
  // ============================================================

  async function renderGraficosDashboard() {
    if (!souAdmin()) return;
    try {
      await Promise.all([
        _renderGraficoEvolucao(),
        _renderGraficoFunil(),
        _renderGraficoHunters(),
        _renderGraficoEtapas()
      ]);
    } catch(e) {
      console.warn('Erro renderGraficosDashboard:', e);
    }
  }

  // Gráfico 1: evolução mensal últimos 6 meses
  async function _renderGraficoEvolucao() {
    const cont = document.getElementById('grafico-evolucao');
    if (!cont) return;
    try {
      // Calcula últimos 6 meses
      const dados = [];
      const hoje = new Date();
      let m = hoje.getMonth() + 1;
      let a = hoje.getFullYear();

      // Volta 5 meses pra começar pelo mês mais antigo
      for (let i = 0; i < 5; i++) {
        m--; if (m < 1) { m = 12; a--; }
      }

      const mesesNome = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

      for (let i = 0; i < 6; i++) {
        const inicio = new Date(a, m - 1, 1).toISOString().slice(0, 10);
        const fim = new Date(a, m, 0).toISOString().slice(0, 10);
        const rP = await fetch(SUPABASE_URL + '/rest/v1/projetos?pago_1=eq.true&pago_1_em=gte.' + inicio + '&pago_1_em=lte.' + fim + '&select=valor_total', {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
        });
        const projs = rP.ok ? await rP.json() : [];
        const receita = projs.reduce(function(s, p){ return s + parseFloat(p.valor_total || 0); }, 0);
        dados.push({
          label: mesesNome[m - 1] + '/' + String(a).slice(-2),
          valor: receita,
          qtd: projs.length
        });
        m++; if (m > 12) { m = 1; a++; }
      }

      const maxValor = Math.max(...dados.map(function(d){ return d.valor; }), 1);

      let html = '<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;align-items:end;height:140px;padding:0 4px;">';
      dados.forEach(function(d){
        const pct = (d.valor / maxValor) * 100;
        const alturaPx = Math.max(pct * 1.2, 4);
        html += '<div style="display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;">' +
          '<div style="font-size:9px;color:var(--text-muted);margin-bottom:3px;">' + (d.qtd > 0 ? 'R$' + (d.valor >= 1000 ? Math.round(d.valor/1000) + 'k' : d.valor) : '') + '</div>' +
          '<div style="width:100%;background:linear-gradient(to top,#1565C0,#42A5F5);height:' + alturaPx + 'px;border-radius:4px 4px 0 0;min-height:4px;" title="' + d.label + ': R$ ' + d.valor.toLocaleString('pt-BR') + ' (' + d.qtd + ' projetos)"></div>' +
        '</div>';
      });
      html += '</div>';
      html += '<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-top:6px;padding:0 4px;">';
      dados.forEach(function(d){
        html += '<div style="font-size:10px;color:var(--text-muted);text-align:center;">' + d.label + '</div>';
      });
      html += '</div>';

      cont.innerHTML = html;
    } catch(e) {
      console.warn('Erro _renderGraficoEvolucao:', e);
      cont.innerHTML = '<div style="color:#D32F2F;text-align:center;font-size:11px;padding:20px;">Erro ao carregar.</div>';
    }
  }

  // Gráfico 2: funil de conversão de leads
  function _renderGraficoFunil() {
    const cont = document.getElementById('grafico-funil');
    if (!cont) return;
    try {
      // Pega leads + clientes (todos os status_funil = prospeccao)
      const todos = (clientes || []).concat(typeof leads !== 'undefined' ? leads : []);
      const leadsAtivos = todos.filter(function(c){ return c.status_funil === 'prospeccao'; });

      // Conta por status (FIX BUG #18: status reais do sistema)
      const novos = leadsAtivos.filter(function(c){ return c.status_lead === 'novo'; }).length;
      const contato = leadsAtivos.filter(function(c){ return c.status_lead === 'em_contato'; }).length;
      const proposta = leadsAtivos.filter(function(c){ return c.status_lead === 'proposta' || c.status_lead === 'aguardando'; }).length;
      const fechados = todos.filter(function(c){ return c.status_funil === 'em_projeto' || c.status_funil === 'cliente_ativo'; }).length;
      const perdidos = leadsAtivos.filter(function(c){ return c.status_lead === 'perdido'; }).length;

      const etapas = [
        { label: '🟢 Novo', valor: novos, cor: '#42A5F5' },
        { label: '🟡 Em contato', valor: contato, cor: '#FFA726' },
        { label: '🔵 Em proposta', valor: proposta, cor: '#1565C0' },
        { label: '✅ Fechados', valor: fechados, cor: '#388E3C' },
        { label: '❌ Perdidos', valor: perdidos, cor: '#E53935' }
      ];

      const maxVal = Math.max(...etapas.map(function(e){ return e.valor; }), 1);
      let html = '<div style="display:flex;flex-direction:column;gap:6px;">';
      etapas.forEach(function(e){
        const pct = (e.valor / maxVal) * 100;
        html += '<div style="display:flex;align-items:center;gap:8px;">' +
          '<div style="width:90px;font-size:11px;color:var(--text);font-weight:500;flex-shrink:0;">' + e.label + '</div>' +
          '<div style="flex:1;background:#F5F5F5;height:18px;border-radius:4px;position:relative;overflow:hidden;">' +
            '<div style="height:100%;width:' + Math.max(pct, 1) + '%;background:' + e.cor + ';border-radius:4px;transition:width 0.3s;"></div>' +
          '</div>' +
          '<div style="font-size:12px;font-weight:700;color:var(--text);min-width:30px;text-align:right;">' + e.valor + '</div>' +
        '</div>';
      });
      html += '</div>';

      cont.innerHTML = html;
    } catch(e) {
      console.warn('Erro _renderGraficoFunil:', e);
      cont.innerHTML = '<div style="color:#D32F2F;text-align:center;font-size:11px;padding:20px;">Erro.</div>';
    }
  }

  // Gráfico 3: top hunters do mês
  async function _renderGraficoHunters() {
    const cont = document.getElementById('grafico-hunters');
    if (!cont) return;
    try {
      const hoje = new Date();
      const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().slice(0, 10);
      const fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).toISOString().slice(0, 10);

      const r = await fetch(SUPABASE_URL + '/rest/v1/projetos?pago_1=eq.true&pago_1_em=gte.' + inicio + '&pago_1_em=lte.' + fim + '&select=hunter_id_origem,valor_total', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      const projs = r.ok ? await r.json() : [];

      // Agrega por hunter
      const agreg = {};
      projs.forEach(function(p){
        if (!p.hunter_id_origem) return;
        if (!agreg[p.hunter_id_origem]) agreg[p.hunter_id_origem] = { qtd: 0, valor: 0 };
        agreg[p.hunter_id_origem].qtd++;
        agreg[p.hunter_id_origem].valor += parseFloat(p.valor_total || 0);
      });

      const hids = Object.keys(agreg);
      if (hids.length === 0) {
        cont.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-muted);font-size:11px;">Nenhum fechamento no mês ainda.</div>';
        return;
      }

      // Ordena por valor
      hids.sort(function(a, b){ return agreg[b].valor - agreg[a].valor; });
      const maxVal = agreg[hids[0]].valor || 1;

      let html = '<div style="display:flex;flex-direction:column;gap:8px;">';
      hids.slice(0, 5).forEach(function(hid, idx){
        const ag = agreg[hid];
        const hunter = (_usuariosCache || []).find(function(u){ return u.id === hid; }) || { nome: '(?)' };
        const corDef = hunter.cor ? CORES_TIMES[hunter.cor] : null;
        const emoji = corDef ? corDef.emoji : '👤';
        const corHex = corDef ? corDef.hex : '#999';
        const pct = (ag.valor / maxVal) * 100;
        const medalha = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : ''));

        html += '<div style="display:flex;align-items:center;gap:8px;">' +
          '<div style="font-size:16px;width:20px;text-align:center;">' + (medalha || (idx + 1) + 'º') + '</div>' +
          '<div style="font-size:16px;">' + emoji + '</div>' +
          '<div style="width:90px;font-size:11px;color:var(--text);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + escapeHtml(hunter.nome) + '</div>' +
          '<div style="flex:1;background:#F5F5F5;height:14px;border-radius:4px;overflow:hidden;">' +
            '<div style="height:100%;width:' + Math.max(pct, 2) + '%;background:' + corHex + ';"></div>' +
          '</div>' +
          '<div style="font-size:11px;font-weight:700;color:var(--text);min-width:60px;text-align:right;">R$ ' + (ag.valor >= 1000 ? Math.round(ag.valor/1000) + 'k' : ag.valor) + '</div>' +
        '</div>';
      });
      html += '</div>';

      cont.innerHTML = html;
    } catch(e) {
      console.warn('Erro _renderGraficoHunters:', e);
      cont.innerHTML = '<div style="color:#D32F2F;text-align:center;font-size:11px;padding:20px;">Erro.</div>';
    }
  }

  // Gráfico 4: projetos por etapa
  function _renderGraficoEtapas() {
    const cont = document.getElementById('grafico-etapas');
    if (!cont) return;
    try {
      const projsAtivos = (projetos || []).filter(function(p){ return p.status === 'em_andamento'; });

      const etapas = [
        { num: 1, label: '1º pgto + Docs', cor: '#1565C0' },
        { num: 2, label: 'Protocolo', cor: '#FFA726' },
        { num: 3, label: 'Em análise', cor: '#7E57C2' },
        { num: 4, label: 'Concluído + 2º pgto', cor: '#388E3C' }
      ];

      etapas.forEach(function(e){
        e.qtd = projsAtivos.filter(function(p){ return (p.etapa_atual || 1) === e.num; }).length;
      });

      const total = projsAtivos.length;
      if (total === 0) {
        cont.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-muted);font-size:11px;">Nenhum projeto em andamento.</div>';
        return;
      }

      let html = '<div style="display:flex;flex-direction:column;gap:6px;">';
      etapas.forEach(function(e){
        const pct = total > 0 ? (e.qtd / total) * 100 : 0;
        html += '<div style="display:flex;align-items:center;gap:8px;">' +
          '<div style="width:140px;font-size:11px;color:var(--text);font-weight:500;">' + e.num + '. ' + e.label + '</div>' +
          '<div style="flex:1;background:#F5F5F5;height:16px;border-radius:4px;overflow:hidden;">' +
            '<div style="height:100%;width:' + Math.max(pct, e.qtd > 0 ? 2 : 0) + '%;background:' + e.cor + ';"></div>' +
          '</div>' +
          '<div style="font-size:12px;font-weight:700;color:var(--text);min-width:30px;text-align:right;">' + e.qtd + '</div>' +
        '</div>';
      });
      html += '<div style="margin-top:8px;padding-top:8px;border-top:1px solid #EEE;font-size:11px;color:var(--text-muted);text-align:center;">Total: <strong>' + total + '</strong> projetos em andamento</div>';
      html += '</div>';

      cont.innerHTML = html;
    } catch(e) {
      console.warn('Erro _renderGraficoEtapas:', e);
      cont.innerHTML = '<div style="color:#D32F2F;text-align:center;font-size:11px;padding:20px;">Erro.</div>';
    }
  }


  // ============================================================
  // SEMANA 3.3: ONBOARDING (tour pra hunter novo)
  // ============================================================

  let _onboardSlideAtual = 1;
  const ONBOARD_TOTAL_SLIDES = 5;

  function verificarMostrarOnboarding() {
    const sess = getSessao();
    if (!sess || sess.papel !== 'hunter') return;   // só hunter por enquanto
    // Verifica se já viu antes
    try {
      const visto = localStorage.getItem('z_onboarding_visto_' + sess.id);
      if (visto === '1') return;
    } catch(e) { return; }

    // Mostra
    _onboardSlideAtual = 1;
    const titulo = document.getElementById('onboard-titulo');
    if (titulo) titulo.textContent = '👋 Bem-vinda(o), ' + (sess.nome || 'Hunter') + '!';
    _onboardingAtualizarUI();
    abrirModal('ov-onboarding');
  }

  function _onboardingAtualizarUI() {
    // Mostra slide atual, esconde outros
    for (let i = 1; i <= ONBOARD_TOTAL_SLIDES; i++) {
      const sl = document.getElementById('onboard-slide-' + i);
      if (sl) sl.style.display = (i === _onboardSlideAtual) ? '' : 'none';
      const dot = document.getElementById('onboard-dot-' + i);
      if (dot) dot.style.background = (i === _onboardSlideAtual) ? '#1565C0' : '#E5E7EB';
    }
    // Botões
    const btnPrev = document.getElementById('onboard-btn-prev');
    const btnNext = document.getElementById('onboard-btn-next');
    if (btnPrev) btnPrev.style.display = (_onboardSlideAtual > 1) ? '' : 'none';
    if (btnNext) {
      btnNext.textContent = (_onboardSlideAtual === ONBOARD_TOTAL_SLIDES) ? '✓ Vamos lá!' : 'Próximo →';
    }
  }

  function onboardingProx() {
    if (_onboardSlideAtual < ONBOARD_TOTAL_SLIDES) {
      _onboardSlideAtual++;
      _onboardingAtualizarUI();
    } else {
      onboardingPular();   // último → finaliza
    }
  }

  function onboardingAnterior() {
    if (_onboardSlideAtual > 1) {
      _onboardSlideAtual--;
      _onboardingAtualizarUI();
    }
  }

  function onboardingPular() {
    // Marca como visto
    const sess = getSessao();
    if (sess) {
      try { localStorage.setItem('z_onboarding_visto_' + sess.id, '1'); } catch(e) {}
    }
    fecharModal('ov-onboarding');
  }


  function renderDashboard() {
    // FASE 14.2: hunter tem dashboard próprio
    if (souHunter()) {
      renderDashHunter();
      return;
    }

    // FASE 3A: card de projetos atrasados
    if (typeof renderCardAtrasadosDashboard === 'function') renderCardAtrasadosDashboard();

    // FASE 14.4: card de comissões a pagar (admin)
    if (typeof atualizarCardComissoesDashboard === 'function') atualizarCardComissoesDashboard();

    // ONDA 3 BUG#15: card de propriedades REVISAR pendentes
    if (typeof renderCardRevisarDashboard === 'function') renderCardRevisarDashboard();

    // SEMANA 3.2: gráficos pra admin
    if (souAdmin()) {
      const dashGraf = document.getElementById('dash-graficos');
      if (dashGraf) dashGraf.style.display = '';
      setTimeout(function(){ if (typeof renderGraficosDashboard === 'function') renderGraficosDashboard(); }, 100);
    } else {
      const dashGraf = document.getElementById('dash-graficos');
      if (dashGraf) dashGraf.style.display = 'none';
    }

    const clientesAtivos = clientes.filter(function(c){ return c.ativo !== false; });

    // FIX BUG: usos com hidrômetro de CLIENTES ATIVOS apenas
    // Antes pegava todos os pontos do banco (leads, em projeto, etc) — bug
    // Agora filtra: ponto → propriedade → cliente_ativo
    const idsClientesAtivos = new Set(clientesAtivos.map(function(c){ return c.id; }));
    const idsPropsClientesAtivos = new Set(
      (propriedades || [])
        .filter(function(p){ return idsClientesAtivos.has(p.cliente_id); })
        .map(function(p){ return p.id; })
    );
    const usosComH = usos.filter(function(u){
      // SEMANA 4.7: cobra leitura se tem hidrômetro OU se admin marcou "relatório de vazão"
      return requerLeitura(u) && idsPropsClientesAtivos.has(u.propriedade_id);
    });
    const usosComL = new Set(leituras.map(function(l) { return l.uso_id; }));
    const hoje = new Date();
    const diaMes = hoje.getDate();

    // Carregar lista de itens "concluídos localmente" para esconder
    let concluidos = {};
    try { concluidos = JSON.parse(localStorage.getItem('z_pend_concluidos') || '{}'); } catch(e) {}

    // ===== Coletar TODAS as pendências em uma lista única =====
    const pendencias = [];

    // 1) Notificações abertas (todas que tenham prazo definido) — só de clientes ativos
    if (notificacoes && notificacoes.length) {
      notificacoes.forEach(function(n){
        if (n.status === 'respondida') return;
        const dias = diasParaPrazo(n.prazo_resposta);
        if (dias === null) return;  // sem prazo, ignora
        const c = clientes.find(function(cc){ return cc.id === n.cliente_id; });
        // FASE 3B: filtra leads e em-projeto do card Pendências
        if (!c) return;
        const statusFunil = c.status_funil || 'cliente_ativo';
        if (statusFunil !== 'cliente_ativo') return;
        const idLocal = 'notif:' + n.id;
        if (concluidos[idLocal]) return;
        pendencias.push({
          id: idLocal,
          tipo: 'notificacao',
          tipoLabel: 'Notificação',
          tipoBadgeCls: 'badge-tipo-notif',
          titulo: (n.orgao || '?') + ' — ' + (n.tipo || ''),
          subtitulo: (c ? c.nome : '?') + (n.processo ? ' · ' + n.processo : ''),
          dias: dias,
          dataRef: n.prazo_resposta,
          acao: function(){ navTo('notificacoes'); },
          rotulo_acao: 'Abrir',
          // ID original para marcar status no banco
          notifId: n.id
        });
      });
    }

    // 2) Outorgas vencendo (apenas de clientes ativos — NÃO leads nem em-projeto)
    propriedades.forEach(function(p){
      // FASE 3B: filtro pra esconder leads e clientes em projeto do card Pendências
      const dono = clientes.find(function(cc){ return cc.id === p.cliente_id; });
      if (!dono) return; // sem dono = sem mostrar (lead provavelmente)
      const statusFunil = dono.status_funil || 'cliente_ativo';
      if (statusFunil !== 'cliente_ativo') return; // pula leads e em-projeto

      const d = getDiasVenc(p);
      if (d === null) return;
      // Mostra apenas se vencendo em ≤ 6 meses ou já vencido
      if (d / 30 > 6) return;
      const c = dono;
      const ussDaProp = usos.filter(function(u){ return u.propriedade_id === p.id; });
      let usoAnc = null, dMin = null;
      ussDaProp.forEach(function(u){
        const dd = getDiasVencUso(u, p);
        if (dd === null) return;
        if (dMin === null || dd < dMin) { dMin = dd; usoAnc = u; }
      });
      const portariaP = (usoAnc && usoAnc.portaria) || p.portaria || '';
      const idLocal = 'outorga:' + p.id;
      if (concluidos[idLocal]) return;
      pendencias.push({
        id: idLocal,
        tipo: 'outorga',
        tipoLabel: 'Renovação',
        tipoBadgeCls: 'badge-tipo-renov',
        titulo: (c ? c.nome : '?') + ' — ' + p.nome,
        subtitulo: 'Outorga · Portaria ' + (portariaP || '—'),
        dias: d,
        dataRef: null,
        acao: function(){ navTo('renovacoes'); },
        rotulo_acao: 'Renovar'
      });
    });

    // 3) Leituras pendentes do mês — mostra a partir do dia 5 do mês
    const usosPendentes = usosComH.filter(function(u){ return !usosComL.has(u.id); });
    if (usosPendentes.length > 0 && diaMes >= 5) {
      // Calcula "dias até dia 15" como prazo
      const dia15 = new Date(hoje.getFullYear(), hoje.getMonth(), 15);
      const diasAtePrazoLeitura = Math.ceil((dia15 - hoje) / 86400000);
      const idLocal = 'leituras:' + getMes();
      if (!concluidos[idLocal]) {
        pendencias.push({
          id: idLocal,
          tipo: 'leituras',
          tipoLabel: 'Leituras',
          tipoBadgeCls: 'badge-tipo-leitura',
          titulo: usosPendentes.length + ' ponto(s) sem leitura',
          subtitulo: 'Mês de referência: ' + getMes(),
          dias: diasAtePrazoLeitura,
          dataRef: null,
          acao: function(){ navTo('alertas'); },
          rotulo_acao: 'Disparar'
        });
      }
    }

    // 4) Leituras acima do limite no mês
    const acimaMes = leituras.filter(function(l){
      const u = usos.find(function(uu){return uu.id===l.uso_id;});
      const aut = u ? getAutorizadoUso(u) : 0;
      return aut > 0 && (l.consumo_m3||0) > aut;
    });
    if (acimaMes.length > 0) {
      const idLocal = 'consumo:' + getMes();
      if (!concluidos[idLocal]) {
        pendencias.push({
          id: idLocal,
          tipo: 'consumo',
          tipoLabel: 'Consumo',
          tipoBadgeCls: 'badge-tipo-consumo',
          titulo: acimaMes.length + ' ponto(s) acima do autorizado',
          subtitulo: 'Mês ' + getMes() + ' · avaliar adequação',
          dias: 0,  // urgente: sempre vermelho (decisão imediata)
          dataRef: null,
          acao: function(){ navTo('leituras'); },
          rotulo_acao: 'Ver'
        });
      }
    }

    // 5) Documentos / Licenças vencendo em ≤90 dias (ou vencidos) — só de clientes ativos
    if (documentos && documentos.length) {
      documentos.forEach(function(d){
        if (d.ativo === false) return;
        if (!d.data_vencimento) return;  // sem prazo, ignora
        const venc = new Date(d.data_vencimento + 'T00:00:00');
        if (isNaN(venc.getTime())) return;
        const hojeMid = new Date(); hojeMid.setHours(0,0,0,0);
        const dias = Math.ceil((venc - hojeMid) / 86400000);
        if (dias > 90) return;  // só pega vencendo em ≤3 meses (e vencidos)

        const idLocal = 'doc:' + d.id;
        if (concluidos[idLocal]) return;
        const c = clientes.find(function(cc){ return cc.id === d.cliente_id; });
        // FASE 3B: filtra leads e em-projeto
        if (!c) return;
        const statusFunil = c.status_funil || 'cliente_ativo';
        if (statusFunil !== 'cliente_ativo') return;
        const tipo = (typeof getTipoDoc === 'function') ? getTipoDoc(d.tipo) : { label: d.tipo, icone:'📄' };
        pendencias.push({
          id: idLocal,
          tipo: 'documento',
          tipoLabel: 'Documento',
          tipoBadgeCls: 'badge-tipo-doc',
          titulo: tipo.icone + ' ' + tipo.label + (d.numero ? ' · Nº ' + d.numero : ''),
          subtitulo: (c ? c.nome : '?') + (d.titulo ? ' · ' + d.titulo : ''),
          dias: dias,
          dataRef: d.data_vencimento,
          acao: function(){ navTo('documentos'); },
          rotulo_acao: 'Abrir'
        });
      });
    }

    // ===== Cards de status =====
    const totalPend = pendencias.length;
    const vencidas = pendencias.filter(function(p){ return p.dias !== null && p.dias < 0; }).length;
    // FASE 13: substituído card "Próximos 7 dias" por "Vencidas" (mais útil, não-redundante)

    // FASE 13 (hotfix): blinda todos os setters de textContent contra null
    function setText(id, txt) {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    }

    setText('m-pend-total', totalPend);
    setText('m-pend-total-sub', totalPend === 0
      ? 'tudo em ordem ✓'
      : 'a resolver');

    // SEMANA 4.11: card "Vencidas" foi removido do dashboard
    // (intuito é nunca deixar vencer — não faz sentido destacar como métrica)

    setText('m-leit-mes', usosComL.size + '/' + usosComH.length);
    const pctLeit = usosComH.length > 0 ? Math.round(usosComL.size / usosComH.length * 100) : 0;
    setText('m-leit-mes-sub', pctLeit + '% recebidas · ' + usosPendentes.length + ' pendente(s)');
    const elBar = document.getElementById('m-leit-bar');
    if (elBar) elBar.style.width = pctLeit + '%';

    setText('m-carteira', clientesAtivos.length);
    setText('m-carteira-sub', clientesAtivos.length + ' cliente(s) · ' + usosComH.length + ' ponto(s) com hidrômetro');

    // ===== Lista única ordenada por urgência (menor prazo primeiro) =====
    pendencias.sort(function(a,b){
      const ka = classificarPrazo(a.dias).sortKey;
      const kb = classificarPrazo(b.dias).sortKey;
      return ka - kb;
    });

    const pendEl = document.getElementById('dash-pendencias-tudo');
    if (!pendencias.length) {
      pendEl.innerHTML = '<div class="dash-empty"><div class="dash-empty-emoji">🎉</div>Tudo em ordem!<br/>Nenhuma pendência no momento.</div>';
      return;
    }

    pendEl.innerHTML = pendencias.map(function(p, i){
      const c = classificarPrazo(p.dias);
      return '<div class="pend-item urg-' + c.cls + '" data-pend-idx="' + i + '" data-pend-id="' + escapeHtml(p.id) + '">'
        +'<input type="checkbox" class="pend-checkbox" title="Marcar como concluído"/>'
        +'<span class="pend-tipo-badge ' + p.tipoBadgeCls + '">' + escapeHtml(p.tipoLabel) + '</span>'
        +'<div class="pend-body">'
          +'<div class="pend-titulo">' + escapeHtml(p.titulo) + '</div>'
          +'<div class="pend-sub">' + escapeHtml(p.subtitulo) + '</div>'
        +'</div>'
        +'<div class="pend-prazo prazo-' + c.cls + '">' + escapeHtml(c.txt) + '</div>'
        +'<button class="pend-acao" data-pend-acao="' + i + '">' + escapeHtml(p.rotulo_acao) + ' →</button>'
      +'</div>';
    }).join('');

    // Bind dos botões de ação
    pendEl.querySelectorAll('button[data-pend-acao]').forEach(function(btn){
      const idx = parseInt(btn.dataset.pendAcao, 10);
      btn.addEventListener('click', function(){
        if (pendencias[idx] && pendencias[idx].acao) pendencias[idx].acao();
      });
    });

    // Bind dos checkboxes — concluir item
    pendEl.querySelectorAll('input.pend-checkbox').forEach(function(cb){
      cb.addEventListener('change', function(e){
        const itemEl = e.target.closest('.pend-item');
        if (!itemEl || !e.target.checked) return;
        const pendId = itemEl.dataset.pendId;
        const idx = parseInt(itemEl.dataset.pendIdx, 10);
        const item = pendencias[idx];
        if (!item) return;

        // Concluir: animação + persistência
        itemEl.classList.add('concluindo');
        setTimeout(function(){
          // Salva o ID em localStorage como concluído
          let conc = {};
          try { conc = JSON.parse(localStorage.getItem('z_pend_concluidos') || '{}'); } catch(_){}
          conc[pendId] = { em: new Date().toISOString() };
          try { localStorage.setItem('z_pend_concluidos', JSON.stringify(conc)); } catch(_){}

          // Para notificações: também atualiza status no banco para "respondida"
          if (item.tipo === 'notificacao' && item.notifId) {
            api('notificacoes?id=eq.' + item.notifId, 'PATCH', { status: 'respondida' }, 'return=minimal').then(function(){
              // Atualiza array local
              const n = (notificacoes || []).find(function(x){ return x.id === item.notifId; });
              if (n) n.status = 'respondida';
            }).catch(function(){});
          }

          // Re-renderiza
          renderDashboard();
        }, 300);
      });
    });
  }

  // ONDA 3 BUG#1: helper — lista unificada pra aba Clientes (ativos + em projeto)
  // Antes: aba Clientes mostrava só status_funil='cliente_ativo'
  // Agora: mostra ativos + em_projeto, com badge visual diferenciando
  // (clientes em prospecção continuam saindo SÓ na aba Prospecção, lá é o lugar deles)
  function _listaUnificadaAbaClientes() {
    const base = (typeof clientes !== 'undefined' ? clientes : []).slice();
    const emProj = (typeof clientesEmProjeto !== 'undefined' ? clientesEmProjeto : []);
    // Concatena sem duplicar (proteção extra)
    const idsBase = new Set(base.map(function(c){ return c.id; }));
    emProj.forEach(function(c){
      if (!idsBase.has(c.id)) base.push(c);
    });
    // Ordena por nome ASC
    base.sort(function(a, b){
      return (a.nome || '').localeCompare(b.nome || '', 'pt-BR');
    });
    return base;
  }

  function renderClientes(lista) {
    const tbody = document.getElementById('tbl-clientes');
    const ativos = lista.filter(function(c){ return c.ativo !== false; });
    if (!ativos.length) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-muted)">Nenhum cliente cadastrado</td></tr>'; return; }
    tbody.innerHTML = ativos.map(function(c) {
      const props = propriedades.filter(function(p){return p.cliente_id===c.id;});
      const ussComH = usos.filter(function(u){return u.cliente_id===c.id && u.possui_hidrometro;});
      // Contato preferencial: principal se houver, senão telefone1 do cliente
      const ctsC = contatos.filter(function(ct){return ct.cliente_id===c.id;});
      const rep = ctsC.find(function(ct){return ct.principal;}) || ctsC.find(function(ct){return ct.papel==='responsavel_legal';});
      const contInfo = rep ? rep.nome + ' (' + rep.papel + ')' : (c.telefone1 || '—');

      // ONDA 3 BUG#1: badge visual pra cliente "em projeto" (diferencia de cliente ativo já com outorga)
      const statusFunil = c.status_funil || 'cliente_ativo';
      let badgeStatus = '';
      if (statusFunil === 'em_projeto') {
        badgeStatus = ' <span class="badge" style="background:#DBEAFE;color:#1E40AF;font-size:9px;font-weight:700;padding:2px 6px;border-radius:8px;margin-left:6px;vertical-align:middle;" title="Cliente tem projeto em andamento (ainda sem outorga publicada)">🏗 EM PROJETO</span>';
      }

      return '<tr>' +
        '<td style="font-weight:500">' + escapeHtml(c.nome) + badgeStatus + '</td>' +
        '<td style="font-size:11px;color:var(--text-muted)">' + escapeHtml(c.cpf_cnpj||'—') + '</td>' +
        '<td style="font-size:11px">' + escapeHtml(contInfo) + '</td>' +
        '<td><span class="badge badge-blue">' + props.length + ' prop.</span></td>' +
        '<td><span class="badge badge-gray">' + ussComH.length + ' hidrôm.</span></td>' +
        '<td><div style="display:flex;gap:3px;">' +
          '<button class="btn btn-sm" onclick="verCliente(\'' + c.id + '\')">Ver</button>' +
          '<button class="btn btn-sm" onclick="editarCliente(\'' + c.id + '\')">✏️</button>' +
          '<button class="btn btn-sm" style="background:#E8F5E9;color:#2E7D32;" onclick="definirPinCliente(\'' + c.id + '\')" title="Definir PIN do portal">🔑</button>' +
          '<button class="btn btn-sm btn-red" onclick="desativarCliente(\'' + c.id + '\',\'' + (c.nome||'').replace(/[\\\\\'"]/g,'') + '\')" title="Desativar">🚫</button>' +
          '<button class="btn btn-sm btn-danger" onclick="excluirCliente(\'' + c.id + '\',\'' + (c.nome||'').replace(/[\\\\\'"]/g,'') + '\')" title="Excluir definitivamente">🗑</button>' +
        '</div></td>' +
        '</tr>';
    }).join('');
  }

  function filtrarClientes(q) {
    // ONDA 3 BUG#1: usa lista unificada (ativos + em projeto)
    const fonte = _listaUnificadaAbaClientes();
    if (!q) { renderClientes(fonte); return; }
    var reNaoDigito = /[^0-9]/g;
    var qNorm = (q||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    var qDig = q.replace(reNaoDigito, '');
    // Acha clientes cujos contatos batem (busca também em contatos)
    var cidsCts = contatos.filter(function(ct){
      var nm = (ct.nome||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
      return nm.includes(qNorm) || (ct.telefone||'').includes(qDig);
    }).map(function(ct){ return ct.cliente_id; });
    renderClientes(fonte.filter(function(c) {
      var nm = (c.nome||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
      var nome = nm.includes(qNorm);
      var doc = qDig.length >= 3 && (c.cpf_cnpj||'').replace(reNaoDigito,'').includes(qDig);
      var tel = qDig.length >= 4 && (c.telefone1||'').includes(qDig);
      var ctMatch = cidsCts.indexOf(c.id) >= 0;
      return nome || doc || tel || ctMatch;
    }));
  }

  async function excluirContato(ctId, cid) {
    if (!confirm('Remover este contato?')) return;
    await api('contatos?id=eq.' + ctId, 'DELETE', null, 'return=minimal');
    await carregarDados();
    verCliente(cid);
  }

  function verCliente(cid) {
    const c = clientes.find(function(cc){return cc.id===cid;}) ||
              (typeof clientesEmProjeto !== 'undefined' ? clientesEmProjeto.find(function(cc){return cc.id===cid;}) : null);
    if (!c) return;
    clienteAtualId = cid;
    // ONDA 3 BUG#1: badge visual no título quando cliente está em projeto
    const statusFunil = c.status_funil || 'cliente_ativo';
    const tit = document.getElementById('tit-ver-cliente');
    if (tit) {
      if (statusFunil === 'em_projeto') {
        tit.innerHTML = escapeHtml(c.nome) + ' <span style="background:#DBEAFE;color:#1E40AF;font-size:10px;font-weight:700;padding:3px 8px;border-radius:8px;margin-left:8px;vertical-align:middle;">🏗 EM PROJETO</span>';
      } else {
        tit.textContent = c.nome;
      }
    }

    // SEMANA 4.8: carrega senhas múltiplas pro estado de edição
    if (typeof _carregarSenhasParaEdicao === 'function') {
      _carregarSenhasParaEdicao('cli', c);
    }
    // Recolhe o bloco
    const blocoCont = document.getElementById('cli-senhas-conteudo');
    if (blocoCont) blocoCont.style.display = 'none';
    const blocoChev = document.getElementById('cli-senhas-chevron');
    if (blocoChev) blocoChev.style.transform = '';

    const cts = contatos.filter(function(ct){return ct.cliente_id===cid;});
    // Detectar duplicatas (mesmo nome + mesmo telefone + mesmo papel) para sinalizar
    const _ctSeen = {};
    cts.forEach(function(ct){
      const k = ((ct.nome||'').trim().toUpperCase()) + '|' + ((ct.telefone||'').replace(/\D/g,'')) + '|' + (ct.papel||'');
      _ctSeen[k] = (_ctSeen[k]||0) + 1;
    });
    let ctHtml = '<div style="font-size:12px;color:var(--text-muted);display:flex;flex-direction:column;gap:6px;">';
    ctHtml += '<div style="display:flex;gap:16px;flex-wrap:wrap;padding-bottom:4px;">';
    ctHtml += '<span>📞 ' + (c.telefone1||'—') + '</span>';
    if (c.email) ctHtml += '<span>✉ ' + c.email + '</span>';
    ctHtml += '</div>';
    cts.forEach(function(ct){
      const k = ((ct.nome||'').trim().toUpperCase()) + '|' + ((ct.telefone||'').replace(/\D/g,'')) + '|' + (ct.papel||'');
      const dup = _ctSeen[k] > 1 ? ' <span style="background:#FFF3E0;color:#E65100;font-size:9px;font-weight:700;padding:1px 5px;border-radius:8px;margin-left:4px;">DUPLICADO</span>' : '';
      ctHtml += '<div style="display:flex;align-items:center;gap:8px;background:#f9fafb;border-radius:8px;padding:6px 10px;">' +
        '<span style="flex:1;">👤 <strong>' + ct.nome + '</strong> (' + ct.papel + ')' + (ct.telefone ? ' · ' + ct.telefone : '') + dup + '</span>' +
        '<button class="btn btn-sm btn-danger" style="padding:2px 8px;font-size:11px;" onclick="excluirContato(\'' + ct.id + '\',\'' + cid + '\')">✕</button>' +
        '</div>';
    });
    ctHtml += '</div>';
    document.getElementById('ver-cliente-contatos').innerHTML = ctHtml;

    const props = propriedades.filter(function(p){return p.cliente_id===cid;});
    if (!props.length) {
      document.getElementById('ver-cliente-props').innerHTML = '<p style="font-size:13px;color:var(--text-muted);padding:20px 0;text-align:center;">Nenhuma propriedade cadastrada ainda.</p>';
    } else {
      document.getElementById('ver-cliente-props').innerHTML = props.map(function(p) {
        const uss = usos.filter(function(u){return u.propriedade_id===p.id;});
        const dias = getDiasVenc(p);
        const cor = getCorVenc(dias, false);
        const vencHtml = cor && dias !== null ? '<span class="tag-v" style="background:'+cor.fundo+';color:'+cor.texto+'">'+cor.label+'</span>' : '';
        const isRevisar = p.nome && p.nome.indexOf('REVISAR') === 0;
        const revisarBadge = isRevisar ? '<span class="badge-revisar" title="Propriedade-placeholder de reimportação. Renomeie e mova os pontos.">⚠ Revisar</span>' : '';
        return '<div class="prop-card">' +
          '<div class="prop-card-header">' +
            '<div>' +
              '<div style="font-size:13px;font-weight:600;">' + escapeHtml(p.nome) + revisarBadge + ' ' + vencHtml + '</div>' +
              '<div style="font-size:11px;color:var(--text-muted);margin-top:2px;">' + escapeHtml(p.cidade||'') + (p.estado?' - '+escapeHtml(p.estado):'') + (p.portaria?' · Port. '+escapeHtml(p.portaria):'') + (p.processo?' · '+escapeHtml(p.processo):'') + '</div>' +
            '</div>' +
            '<div style="display:flex;gap:4px;">' +
              '<button class="btn btn-sm btn-blue" onclick="abrirAddUso(\'' + p.id + '\')">+ Ponto</button>' +
              '<button class="btn btn-sm" onclick="abrirRenomearProp(\'' + p.id + '\')" title="Renomear propriedade">✏️ Nome</button>' +
              '<button class="btn btn-sm" onclick="editarPropriedade(\'' + p.id + '\')" title="Editar dados completos">⚙</button>' +
              '<button class="btn btn-sm btn-danger" onclick="excluirProp(\'' + p.id + '\',\'' + (p.nome||'').replace(/[\\\\\'"]/g,'') + '\')">🗑</button>' +
            '</div>' +
          '</div>' +
          '<div class="prop-card-body">' +
            (uss.length ? uss.map(function(u) {
              const aut = getAutorizadoUso(u);
              const hasH = u.possui_hidrometro;
              const icone = hasH ? '💧' : '🔵';
              const link = hasH ? getClienteUrl() + '?token=' + u.token : null;
              // Lista de todos os telefones do cliente
              const _cts = contatos.filter(function(ct){ return ct.cliente_id === u.cliente_id && ct.telefone; });
              const _cli = clientes.find(function(cc){ return cc.id === u.cliente_id; }) || leads.find(function(cc){ return cc.id === u.cliente_id; });
              const _fones = [];
              if (_cli && _cli.telefone1) _fones.push({nome: _cli.nome.split(' ')[0] + ' (titular)', fone: _cli.telefone1});
              _cts.forEach(function(ct){ _fones.push({nome: ct.nome.split(' ')[0] + ' (' + ct.papel + ')', fone: ct.telefone}); });
              return '<div class="uso-row">' +
                (u.foto_equipamento_url ? 
                  '<a href="' + u.foto_equipamento_url + '" target="_blank"><img src="' + u.foto_equipamento_url + '" style="width:44px;height:44px;border-radius:8px;object-fit:cover;border:1px solid var(--border);flex-shrink:0;" alt="Foto" /></a>' :
                  '<div class="uso-icon" style="background:' + (hasH?'var(--blue-light)':'#f3f4f6') + '">' + icone + '</div>'
                ) +
                '<div style="flex:1;">' +
                  '<div style="font-size:12px;font-weight:500;">' + escapeHtml(u.descricao) + (u.numero_serie?' <span style="font-family:monospace;font-size:11px;color:var(--text-muted)">' + escapeHtml(u.numero_serie) + '</span>':'') + '</div>' +
                  '<div style="font-size:11px;color:var(--text-muted);">' + escapeHtml(u.requerimento||'') + (aut>0?' · Auto: '+aut.toFixed(1)+' m³/mês':'') + '</div>' +
                '</div>' +
                (link ? '<a href="' + link + '" target="_blank" class="btn btn-sm btn-blue" title="Abrir/copiar link de leitura">🔗 Link</a>' : '<span class="badge badge-gray">Sem hidrômetro</span>') +
                (u.outorga_pdf_url ? '<a href="' + u.outorga_pdf_url + '" target="_blank" class="btn btn-sm" style="background:#FFF3E0;color:#E65100;border:1px solid #FFB74D;" title="Abrir PDF da outorga / licença">📄 PDF</a>' : '<span class="btn btn-sm" style="background:#f3f4f6;color:#9ca3af;border:1px dashed #d1d5db;cursor:default;" title="Sem PDF anexado">📄 –</span>') +
                (link ? (u.responsavel_tel ?
                  '<button class="btn btn-sm btn-green" onclick="enviarLinkWpp(\'' + u.id + '\',\'' + u.responsavel_tel + '\')" title="Enviar para responsável fixo">📲 Enviar</button>' :
                  _fones.length <= 1 ?
                    '<button class="btn btn-sm btn-green" onclick="enviarLinkWpp(\'' + u.id + '\',\'' + (_fones[0]?_fones[0].fone:'') + '\')" title="Enviar link por WhatsApp">📲 Enviar</button>' :
                    '<button class="btn btn-sm btn-green" onclick="selecionarContatoWpp(\'' + u.id + '\')" title="Escolher para quem enviar">📲 Enviar ▾</button>'
                ) : '') +
                '<button class="btn btn-sm" onclick="abrirMoverPonto(\'' + u.id + '\')" title="Mover este ponto para outra propriedade">📦</button>' +
                '<button class="btn btn-sm" onclick="editarUso(\'' + u.id + '\')">✏️</button>' +
                '<button class="btn btn-sm btn-danger" onclick="excluirUso(\'' + u.id + '\',\'' + (u.descricao||'').replace(/[\\\\\'"]/g,'') + '\')">🗑</button>' +
              '</div>';
            }).join('') : '<p style="font-size:12px;color:var(--text-muted);padding:8px 0;">Nenhum ponto de captação cadastrado. <button class="btn btn-sm btn-blue" onclick="abrirAddUso(\'' + p.id + '\')">+ Adicionar</button></p>') +
          '</div>' +
        '</div>';
      }).join('');
    }
    abrirModal('ov-ver-cliente');
  }

  // =============================================
  // ENVIO DE LINK DE LEITURA POR WHATSAPP
  // =============================================
  function enviarLinkWpp(usoId, fone) {
    const u = usos.find(function(uu){ return uu.id === usoId; });
    const c = u ? clientes.find(function(cc){ return cc.id === u.cliente_id; }) : null;
    const p = u ? propriedades.find(function(pp){ return pp.id === u.propriedade_id; }) : null;
    if (!fone || !u) { alert('Nenhum telefone disponível para este contato.'); return; }
    const num = fone.replace(/\D/g, '');
    const primeiroNome = c ? c.nome.split(' ')[0] : '';
    const nomePropriedade = p ? p.nome : '';
    const nomePonto = u.descricao || '';
    const nomeEng = EMPRESA.eng || 'Eng. Guilherme Montanari';
    const telEng = EMPRESA.tel || '(16) 98142-7633';
    const linkLeitura = getClienteUrl() + '?token=' + u.token;
    const linhaReq = u.requerimento ? '📋 *Requerimento:* ' + u.requerimento + '\n' : '';
    const linhaSerie = u.numero_serie ? '🔢 *Hidrômetro:* ' + u.numero_serie + '\n' : '';
    const msg = encodeURIComponent(
      'Olá, ' + primeiroNome + '!\n\n' +
      '*Zello Ambiental — Gestão da Água*\n' +
      'Chegou o momento de registrar a leitura mensal do hidrômetro.\n\n' +
      '*Propriedade:* ' + nomePropriedade + '\n' +
      '*Ponto:* ' + nomePonto + '\n' +
      linhaReq +
      linhaSerie + '\n' +
      'Acesse o link para informar a leitura:\n' +
      linkLeitura + '\n\n' +
      'Em caso de dúvidas:\n' +
      nomeEng + ' · ' + telEng
    );
    window.open('https://wa.me/55' + num + '?text=' + msg, '_blank');
  }

  function selecionarContatoWpp(usoId) {
    const u = usos.find(function(uu){ return uu.id === usoId; });
    const c = u ? clientes.find(function(cc){ return cc.id === u.cliente_id; }) : null;
    if (!u || !c) return;
    // Montar lista de todos os telefones
    const cts = contatos.filter(function(ct){ return ct.cliente_id === u.cliente_id && ct.telefone; });
    const fones = [];
    if (c.telefone1) fones.push({ nome: c.nome.split(' ')[0] + ' (titular)', fone: c.telefone1 });
    cts.forEach(function(ct){ fones.push({ nome: ct.nome.split(' ')[0] + ' (' + ct.papel + ')', fone: ct.telefone }); });
    if (!fones.length) { alert('Nenhum telefone cadastrado para este cliente.'); return; }
    // Abrir modal de seleção
    const overlay = document.getElementById('ov-selecionar-contato');
    const lista = document.getElementById('lista-contatos-wpp');
    document.getElementById('tit-selecionar-contato').textContent = 'Enviar link — ' + u.descricao;
    lista.innerHTML = '';
    fones.forEach(function(f) {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.style.cssText = 'width:100%;justify-content:flex-start;margin-bottom:8px;gap:12px;';
      btn.innerHTML = '<span style="font-size:18px;">📲</span><span><strong>' + escapeHtml(f.nome) + '</strong><br/><span style="font-size:11px;color:var(--text-muted);">' + escapeHtml(f.fone) + '</span></span>';
      btn.addEventListener('click', function() {
        enviarLinkWpp(usoId, f.fone);
        fecharModal('ov-selecionar-contato');
      });
      lista.appendChild(btn);
    });
    overlay.classList.add('open');
  }

  function popularSelectResponsavel(cid, valorAtual) {
    const sel = document.getElementById('u-responsavel');
    if (!sel) return;
    sel.innerHTML = '<option value="">— Sem responsável fixo (escolher ao enviar) —</option>';
    const c = clientes.find(function(cc){ return cc.id === cid; });
    // Conjunto para deduplicar telefones (titular + contatos podem repetir)
    const _vistos = {};
    if (c && c.telefone1) {
      const k = c.telefone1.replace(/\D/g,'');
      if (!_vistos[k]) {
        _vistos[k] = true;
        const opt = document.createElement('option');
        opt.value = c.telefone1;
        opt.textContent = c.nome.split(' ')[0] + ' (titular) · ' + c.telefone1;
        sel.appendChild(opt);
      }
    }
    const cts = contatos.filter(function(ct){ return ct.cliente_id === cid && ct.telefone; });
    cts.forEach(function(ct) {
      const k = (ct.telefone||'').replace(/\D/g,'') + '|' + (ct.nome||'').trim().toUpperCase();
      if (_vistos[k]) return;
      _vistos[k] = true;
      const opt = document.createElement('option');
      opt.value = ct.telefone;
      opt.textContent = ct.nome.split(' ')[0] + ' (' + ct.papel + ') · ' + ct.telefone;
      sel.appendChild(opt);
    });
    // Opção para digitar um número avulso
    const optOutro = document.createElement('option');
    optOutro.value = 'outro';
    optOutro.textContent = '✏️ Digitar outro número...';
    sel.appendChild(optOutro);
    if (valorAtual) sel.value = valorAtual;
    sel.onchange = function() {
      var div = document.getElementById('u-responsavel-outro');
      if (div) div.style.display = sel.value === 'outro' ? 'block' : 'none';
    };
  }

  function abrirAddUso(pid) {
    propAtualId = pid;
    fecharModal('ov-ver-cliente');
    const p = propriedades.find(function(pp){return pp.id===pid;});
    document.getElementById('uso-sub').textContent = p ? p.nome : 'Novo ponto';
    document.querySelector('#ov-uso .modal-title').textContent = 'Cadastrar ponto de captação';
    limparFormUso();
    document.getElementById('lista-usos-adicionados').innerHTML = '';
    // Popular select de responsável com contatos do cliente
    if (clienteAtualId) popularSelectResponsavel(clienteAtualId, null);
    // No contexto de cliente existente, ocultar "+ Adicionar outro ponto"
    var btnAdicionar = document.getElementById('btn-uso-add-outro');
    if (btnAdicionar) btnAdicionar.style.display = 'none';
    document.getElementById('btn-salvar-uso').textContent = 'Salvar ponto';
    document.getElementById('btn-salvar-uso').onclick = function() {
      salvarUso(true).then(function() {
        if (clienteAtualId) verCliente(clienteAtualId);
      });
    };
    abrirModal('ov-uso');
  }

  // =============================================
  // ADICIONAR PROPRIEDADE A UM CLIENTE EXISTENTE
  // =============================================
  function abrirAddProp() {
    if (!clienteAtualId) {
      alert('Selecione um cliente primeiro.');
      return;
    }
    fecharModal('ov-ver-cliente');
    // Limpar formulário
    document.getElementById('eid-prop').value = '';
    document.getElementById('p-nome').value = '';
    document.getElementById('p-cidade').value = '';
    document.getElementById('p-estado').value = 'SP';
    // Ajustar título e subtítulo
    document.querySelector('#ov-prop .modal-title').textContent = 'Nova propriedade';
    var cli = clientes.find(function(c){ return c.id === clienteAtualId; });
    var sub = document.getElementById('prop-sub');
    if (sub) sub.textContent = 'Adicionar propriedade' + (cli ? ' — ' + cli.nome : '');
    // Restaurar texto do botão salvar (caso edição anterior tenha alterado)
    var btnSalvar = document.querySelector('#ov-prop .btn-blue');
    if (btnSalvar) btnSalvar.textContent = 'Salvar e continuar →';
    // Pré-carrega cidades de SP em background
    _buscarCidadeOnline('SP');
    abrirModal('ov-prop');
  }

  function editarPropriedade(pid) {
    const p = propriedades.find(function(pp){return pp.id===pid;});
    if (!p) return;
    propAtualId = pid;
    clienteAtualId = p.cliente_id;
    fecharModal('ov-ver-cliente');

    document.getElementById('eid-prop').value = pid;
    document.getElementById('p-nome').value = p.nome || '';
    document.getElementById('p-cidade').value = p.cidade || '';
    document.getElementById('p-estado').value = p.estado || 'SP';
    // (campos p-processo/p-portaria/p-pdf não existem no modal atual — bloco removido
    //  para evitar TypeError que travava o botão "✏️" da propriedade.)

    document.querySelector('#ov-prop .modal-title').textContent = 'Editar propriedade';
    document.getElementById('prop-sub').textContent = 'Editando: ' + p.nome;

    const btnSalvar = document.querySelector('#ov-prop .btn-blue');
    if (btnSalvar) btnSalvar.textContent = 'Salvar alterações';
    // Não sobrescrever onclick — usar eid-prop para detectar modo

    // Pré-carrega cidades do estado da propriedade
    _buscarCidadeOnline(p.estado || 'SP');

    abrirModal('ov-prop');
  }

  // salvarPropEdicao foi incorporada em salvarPropriedade


  function editarCliente(cid) {
    // ONDA 3 BUG#1: também busca em clientesEmProjeto (aba Clientes agora mostra os dois)
    const c = clientes.find(function(cc){return cc.id===cid;}) ||
              (typeof clientesEmProjeto !== 'undefined' ? clientesEmProjeto.find(function(cc){return cc.id===cid;}) : null);
    if (!c) return;
    clienteAtualId = cid;
    limparFormCliente();
    document.getElementById('eid-cliente').value = cid;
    document.getElementById('tit-cliente').textContent = 'Editar cliente';
    document.getElementById('c-nome').value = c.nome||'';
    document.getElementById('c-doc').value = c.cpf_cnpj||'';
    document.getElementById('c-tel1').value = c.telefone1||'';
    document.getElementById('c-email').value = c.email||'';
    // Detectar CNPJ e preencher responsáveis legais
    detectarTipoCliente();
    limparResponsaveisLegais();
    const ctsCliente = contatos.filter(function(ct){ return ct.cliente_id === cid; });
    const respLegaisEditar = ctsCliente.filter(function(ct){ return ct.papel==='responsavel_legal'; });
    respLegaisEditar.forEach(function(rl) {
      adicionarResponsavelLegal();
      const idx2 = document.getElementById('lista-resp-legais').children.length - 1;
      const elNome = document.getElementById('resp-legal-nome-'+idx2); if(elNome) elNome.value = rl.nome||'';
      const elCpf = document.getElementById('resp-legal-cpf-'+idx2); if(elCpf) elCpf.value = rl.cpf||'';
      const elTel = document.getElementById('resp-legal-tel-'+idx2); if(elTel) elTel.value = rl.telefone||'';
      const elEmail = document.getElementById('resp-legal-email-'+idx2); if(elEmail) elEmail.value = rl.email||'';
    });

    // Carregar contatos existentes deste cliente
    // Responsável principal era campo antigo (removido) — contatos extras tratados abaixo

    // Preencher contatos extras (não principais e não responsáveis legais)
    document.getElementById('contatos-extras').innerHTML = '';
    contatosExtras = [];
    // Deduplica antes de mostrar (caso o banco tenha contatos duplicados de cadastros antigos)
    const ctExtrasRaw = ctsCliente.filter(function(ct){ return !ct.principal && ct.papel !== 'responsavel_legal'; });
    const _ctVistos = {};
    const ctExtras = [];
    ctExtrasRaw.forEach(function(ct){
      const k = ((ct.nome||'').trim().toUpperCase()) + '|' + ((ct.telefone||'').replace(/\D/g,'')) + '|' + (ct.papel||'');
      if (_ctVistos[k]) return;
      _ctVistos[k] = true;
      ctExtras.push(ct);
    });
    ctExtras.forEach(function(ct) {
      const idx = contatosExtras.length;
      contatosExtras.push({});
      const el = document.getElementById('contatos-extras');
      const div = document.createElement('div');
      div.className = 'contato-extra';
      div.id = 'contato-extra-' + idx;
      div.innerHTML = '<button class="contato-remove" onclick="removerContatoExtra(' + idx + ')">✕</button>' +
        '<div class="g2">' +
        '<div class="fg"><label class="fl">Nome</label><input class="fi upper" type="text" id="ce-nome-' + idx + '" value="' + (ct.nome||'') + '" placeholder="Nome do contato" /></div>' +
        '<div class="fg"><label class="fl">Papel</label><select class="fi" id="ce-papel-' + idx + '"><option value="conjuge">Cônjuge</option><option value="pai_mae">Pai/Mãe</option><option value="filho_filha">Filho/Filha</option><option value="irmao_irma">Irmão/Irmã</option><option value="gerente">Gerente / Responsável</option><option value="advogado">Advogado</option><option value="contador">Contador</option><option value="intermediador">Intermediador</option><option value="outro">Outro</option></select></div>' +
        '<div class="fg"><label class="fl">Telefone</label><input class="fi" type="tel" id="ce-tel-' + idx + '" value="' + (ct.telefone||'') + '" placeholder="(16) 99999-0000" maxlength="15" oninput="mascaraTel(this)" /></div>' +
        '<div class="fg"><label class="fl">E-mail</label><input class="fi" type="email" id="ce-email-' + idx + '" value="' + (ct.email||'') + '" placeholder="email@dominio.com" /></div>' +
        '</div>';
      el.appendChild(div);
      // Selecionar o papel correto
      const sel = div.querySelector('#ce-papel-' + idx);
      if (sel) sel.value = ct.papel || 'outro';
    });

    // Mudar texto do botão para modo edição (onclick não muda — salvarCliente detecta pelo eid)
    const btnCli = document.querySelector('#ov-cliente .btn-blue');
    if (btnCli) btnCli.textContent = 'Salvar alterações';

    abrirModal('ov-cliente');
  }

  async function editarUso(uid) {
    const u = usos.find(function(uu){return uu.id===uid;});
    if (!u) return;
    propAtualId = u.propriedade_id;
    clienteAtualId = u.cliente_id;
    fecharModal('ov-ver-cliente');
    limparFormUso();
    // Em modo edição, esconder o botão "+ Adicionar outro ponto"
    var _btnAddOutro = document.getElementById('btn-uso-add-outro');
    if (_btnAddOutro) _btnAddOutro.style.display = 'none';
    document.getElementById('eid-uso').value = uid;
    document.getElementById('u-desc').value = u.descricao||'';
    document.getElementById('u-tipo').value = u.tipo_outorga||'outorga';
    document.getElementById('u-req').value = u.requerimento||'';
    document.getElementById('u-portaria').value = u.portaria||'';
    document.getElementById('u-processo').value = u.processo||'';
    document.getElementById('u-data-emissao').value = u.data_emissao||'';
    document.getElementById('u-prazo').value = u.prazo_anos||'';
    document.getElementById('u-vh').value = u.vazao_m3h||'';
    document.getElementById('u-hd').value = u.horas_uso_dia||'';
    document.getElementById('u-dm').value = u.dias_uso_mes||'';
    document.getElementById('u-sem-hidro').checked = !u.possui_hidrometro;
    document.getElementById('u-serie').value = u.numero_serie||'';
    // SEMANA 4.7: popula checkbox de relatório de vazão
    const chkRel = document.getElementById('u-rel-vazao');
    if (chkRel) chkRel.checked = !!u.requer_relatorio_vazao;
    toggleHidroInput(!u.possui_hidrometro);
    calcVazao();

    // Mostrar PDF atual da outorga (se houver)
    const pdfAtualEl = document.getElementById('u-pdf-atual');
    if (pdfAtualEl) {
      if (u.outorga_pdf_url) {
        pdfAtualEl.innerHTML = '📄 <a href="' + u.outorga_pdf_url + '" target="_blank" style="color:#E65100;font-weight:600;">Ver PDF atual</a> <span style="color:var(--text-muted);">— selecione um arquivo acima para substituir</span>';
        pdfAtualEl.style.display = 'block';
      } else {
        pdfAtualEl.style.display = 'none';
      }
    }
    // Mostrar foto atual (se houver)
    const fotoAtualEl = document.getElementById('u-foto-atual');
    if (fotoAtualEl) {
      if (u.foto_equipamento_url) {
        fotoAtualEl.innerHTML = '<a href="' + u.foto_equipamento_url + '" target="_blank"><img src="' + u.foto_equipamento_url + '" style="width:60px;height:60px;border-radius:6px;object-fit:cover;border:1px solid var(--border);vertical-align:middle;" alt="Foto atual"/></a> <span style="color:var(--text-muted);">Foto atual — selecione um arquivo acima para substituir</span>';
        fotoAtualEl.style.display = 'block';
      } else {
        fotoAtualEl.style.display = 'none';
      }
    }

    // Popular select responsável com valor atual
    if (clienteAtualId) popularSelectResponsavel(clienteAtualId, u.responsavel_tel || null);
    document.querySelector('#ov-uso .modal-title').textContent = 'Editar ponto de captação';
    const _btnSalvar = document.getElementById('btn-salvar-uso');
    if (_btnSalvar) {
      _btnSalvar.textContent = 'Salvar alterações';
      _btnSalvar.onclick = function() { salvarUsoEdicao(uid); };
    }
    abrirModal('ov-uso');
  }

  async function salvarUsoEdicao(uid) {
    const desc = document.getElementById('u-desc').value.trim();
    if (!desc) { alert('Descrição é obrigatória.'); return; }
    const semHidro = document.getElementById('u-sem-hidro').checked;
    // SEMANA 4.7: pega se precisa de relatório de vazão
    const requerRelVazao = !semHidro ? ((document.getElementById('u-rel-vazao') || {}).checked || false) : false;

    // SEMANA 4.7b: GUARD anti-desmarque acidental
    // Compara estado atual (banco) com estado novo (form):
    //   - Se ponto ESTAVA gerando pendências (com hidro OU com relatório)
    //   - E AGORA não vai mais gerar (sem hidro E sem relatório)
    //   - Pede confirmação detalhada, especialmente se tem leituras registradas
    try {
      const usoAtual = (usos || []).find(function(x){ return x.id === uid; });
      if (usoAtual) {
        const eraAtivo = (usoAtual.possui_hidrometro === true) || (usoAtual.requer_relatorio_vazao === true);
        const ficouInativo = !(!semHidro) && !requerRelVazao;  // sem hidro E sem relatório
        if (eraAtivo && ficouInativo) {
          // Conta leituras desse ponto
          const qtdLeituras = (leituras || []).filter(function(l){ return l.uso_id === uid; }).length;
          const ultimaLeit = (leituras || [])
            .filter(function(l){ return l.uso_id === uid; })
            .sort(function(a,b){ return (b.mes_referencia||'').localeCompare(a.mes_referencia||''); })[0];

          let msg = '⚠️ ATENÇÃO — Vai desativar a cobrança de leituras deste ponto.\n\n';
          if (qtdLeituras > 0) {
            msg += '📊 Este ponto tem ' + qtdLeituras + ' leitura' + (qtdLeituras > 1 ? 's' : '') + ' registrada' + (qtdLeituras > 1 ? 's' : '');
            if (ultimaLeit && ultimaLeit.mes_referencia) {
              msg += ' (última: ' + ultimaLeit.mes_referencia.slice(0, 7) + ')';
            }
            msg += '.\n\n';
          }
          msg += 'Após salvar, este ponto vai:\n';
          msg += '   ✗ Sair da lista de pendências\n';
          msg += '   ✗ Sair do disparo automático de WhatsApp\n';
          msg += '   ✗ Sair dos alertas de 7 dias sem leitura\n';
          msg += '   ✗ Cliente para de receber lembretes mensais\n\n';
          msg += 'Tem CERTEZA que quer desativar?';

          if (!confirm(msg)) {
            // Restaura visual: marca o checkbox de relatório de novo
            const chkRel = document.getElementById('u-rel-vazao');
            if (chkRel && usoAtual.requer_relatorio_vazao) chkRel.checked = true;
            const chkSem = document.getElementById('u-sem-hidro');
            if (chkSem && usoAtual.possui_hidrometro) {
              chkSem.checked = false;
              toggleHidroInput(false);
            }
            return;
          }
        }
      }
    } catch(e) { console.warn('Guard relatório vazão:', e); }

    // Upload de foto se nova foto foi selecionada
    const fotoInput = document.getElementById('u-foto');
    let fotoUrl = null;
    if (fotoInput && fotoInput.files && fotoInput.files[0]) {
      const fotoFile = fotoInput.files[0];
      const fotoExt = fotoFile.name.split('.').pop() || 'jpg';
      fotoUrl = await uploadFile('documentos-zello', 'fotos/' + clienteAtualId + '/' + Date.now() + '.' + fotoExt, fotoFile);
      if (!fotoUrl) alert('⚠️ Falha ao enviar a foto. Verifique a conexão e tente novamente.');
    }

    // Upload de PDF da outorga se um novo foi selecionado
    const pdfInputE = document.getElementById('u-pdf-outorga');
    let pdfUrlE = null;
    if (pdfInputE && pdfInputE.files && pdfInputE.files[0]) {
      pdfUrlE = await uploadFile('documentos-zello', 'outorgas/' + clienteAtualId + '/' + Date.now() + '.pdf', pdfInputE.files[0]);
      if (!pdfUrlE) alert('⚠️ Falha ao enviar o PDF da outorga. Verifique a conexão e tente novamente.');
    }

    // FASE 3B Item 4: validação de portaria
    var portariaRawE = document.getElementById('u-portaria').value.trim();
    var vPortE = validarPortaria(portariaRawE);
    if (!vPortE.ok) {
      alert('⚠ Portaria inválida\n\n' + vPortE.mensagem);
      document.getElementById('u-portaria').focus();
      return;
    }

    const payload = {
      descricao: upper(desc),
      tipo_outorga: document.getElementById('u-tipo').value,
      requerimento: upper(document.getElementById('u-req').value.trim()) || null,
      portaria: vPortE.valor,
      processo: upper(document.getElementById('u-processo').value.trim()) || null,
      data_emissao: document.getElementById('u-data-emissao').value || null,
      prazo_anos: parseInt(document.getElementById('u-prazo').value) || null,
      vazao_m3h: parseFloat(document.getElementById('u-vh').value) || null,
      horas_uso_dia: parseFloat(document.getElementById('u-hd').value) || null,
      dias_uso_mes: parseInt(document.getElementById('u-dm').value) || null,
      possui_hidrometro: !semHidro,
      numero_serie: semHidro ? null : (upper(document.getElementById('u-serie').value.trim()) || null),
      requer_relatorio_vazao: requerRelVazao,
      responsavel_tel: document.getElementById('u-responsavel').value || null
    };
    if (fotoUrl) payload.foto_equipamento_url = fotoUrl; // só atualiza se nova foto anexada
    if (pdfUrlE) payload.outorga_pdf_url = pdfUrlE;       // só atualiza se novo PDF anexado

    var rEd = await api('usos?id=eq.' + uid, 'PATCH', payload, 'return=minimal');
    if (rEd && !rEd.ok) {
      var errEd = await rEd.text();
      console.error('[Zello] Erro PATCH usos:', errEd);
      // Tenta retry removendo as colunas que faltam
      var colsRem = [];
      ['portaria','processo','data_emissao','prazo_anos','tipo_outorga','requerimento','outorga_pdf_url','foto_equipamento_url'].forEach(function(col){
        if (errEd.indexOf(col) > -1 && payload.hasOwnProperty(col)) {
          colsRem.push(col);
          delete payload[col];
        }
      });
      if (colsRem.length > 0) {
        rEd = await api('usos?id=eq.' + uid, 'PATCH', payload, 'return=minimal');
        if (!rEd || !rEd.ok) { alert('Erro ao atualizar ponto: ' + (rEd ? await rEd.text() : '')); return; }
        var nomes = {'portaria':'Portaria','processo':'Processo SEI','data_emissao':'Data de emissão','prazo_anos':'Prazo (anos)','tipo_outorga':'Tipo de outorga','requerimento':'Requerimento','outorga_pdf_url':'PDF da outorga','foto_equipamento_url':'Foto do equipamento'};
        var labels = colsRem.map(function(c){return nomes[c]||c;}).join(', ');
        var sqlFix2 = colsRem.map(function(c){
          var tipos = {'portaria':'TEXT','processo':'TEXT','data_emissao':'DATE','prazo_anos':'INTEGER','tipo_outorga':'TEXT','requerimento':'TEXT','outorga_pdf_url':'TEXT','foto_equipamento_url':'TEXT'};
          return 'ALTER TABLE usos ADD COLUMN IF NOT EXISTS ' + c + ' ' + (tipos[c]||'TEXT') + ';';
        }).join('\n');
        alert('⚠️ Ponto atualizado, MAS estes campos NÃO foram gravados (colunas não existem):\n\n' +
              '• ' + labels + '\n\n' +
              'Execute no Supabase:\n\n' + sqlFix2);
      } else {
        alert('Erro ao atualizar ponto: ' + errEd.substring(0,200));
        return;
      }
    }

    document.getElementById('eid-uso').value = '';
    document.getElementById('btn-salvar-uso').onclick = function() { salvarUso(true); };
    fecharModal('ov-uso');
    await carregarDados();
    verCliente(clienteAtualId);
    alert('Ponto atualizado!');
  }

  // =============================================
  // RENOVAÇÕES
  // =============================================
  // SEMANA 4.1: filtro ativo na tela de renovações
  let _renovFiltro = 'todas';

  function filtrarRenovacoes(tipo) {
    _renovFiltro = tipo;
    const labels = { 'todas': 'todas as renovações', 'vencidas': 'vencidas', '30': 'vence em até 30 dias', '90': 'vence em até 90 dias', '180': 'vence em até 180 dias' };
    const el = document.getElementById('renov-filtro-label');
    if (el) el.textContent = labels[tipo] || tipo;
    renderRenovacoes();
  }

  function renderRenovacoes() {
    const el = document.getElementById('lista-renovacoes');
    if (!el) return;

    // Renovações só fazem sentido para clientes ativos (não leads em prospecção)
    const idsAtivos = new Set(clientes.map(function(c){ return c.id; }));

    // Considera todas as propriedades cujo getDiasVenc retorna valor
    // (ou seja: tem ao menos 1 uso com data de emissão+prazo, OU campos antigos na propriedade)
    const listaCompleta = propriedades
      .filter(function(p){ return p.ativo !== false && idsAtivos.has(p.cliente_id); })
      .map(function(p) {
        const dias = getDiasVenc(p);
        if (dias === null) return null;
        const ussDaProp = usos.filter(function(u){return u.propriedade_id===p.id;});
        const renovando = ussDaProp.some(function(u){return u.renovacao_em_andamento;});
        let usoAncora = null;
        let diasMin = null;
        ussDaProp.forEach(function(u){
          const d = getDiasVencUso(u, p);
          if (d === null) return;
          if (diasMin === null || d < diasMin) { diasMin = d; usoAncora = u; }
        });
        return { prop: p, dias: dias, renovando: renovando, usoAncora: usoAncora, ussDaProp: ussDaProp };
      })
      .filter(function(x){ return x !== null; })
      .sort(function(a,b){ return a.dias - b.dias; });

    // SEMANA 4.1: atualiza cards de resumo (sempre baseado em listaCompleta)
    const cVencidas = listaCompleta.filter(function(x){ return x.dias < 0; }).length;
    const c30 = listaCompleta.filter(function(x){ return x.dias >= 0 && x.dias <= 30; }).length;
    const c90 = listaCompleta.filter(function(x){ return x.dias > 30 && x.dias <= 90; }).length;
    const c180 = listaCompleta.filter(function(x){ return x.dias > 90 && x.dias <= 180; }).length;
    const setCount = function(id, v){ const e = document.getElementById(id); if (e) e.textContent = v; };
    setCount('renov-count-todas', listaCompleta.length);
    setCount('renov-count-vencidas', cVencidas);
    setCount('renov-count-30', c30);
    setCount('renov-count-90', c90);
    setCount('renov-count-180', c180);

    // SEMANA 4.1: aplica filtro
    let lista = listaCompleta;
    if (_renovFiltro === 'vencidas') lista = listaCompleta.filter(function(x){ return x.dias < 0; });
    else if (_renovFiltro === '30') lista = listaCompleta.filter(function(x){ return x.dias <= 30; });
    else if (_renovFiltro === '90') lista = listaCompleta.filter(function(x){ return x.dias <= 90; });
    else if (_renovFiltro === '180') lista = listaCompleta.filter(function(x){ return x.dias <= 180; });

    const badge = document.getElementById('badge-renov');
    const criticos = listaCompleta.filter(function(x){ return !x.renovando && x.dias/30 <= 6; }).length;
    if (badge) { badge.textContent = criticos; badge.style.display = criticos > 0 ? 'block' : 'none'; }

    // === SEÇÃO DE DIAGNÓSTICO ===
    // Mostra propriedades que estão SEM dados de outorga (data_emissao/prazo_anos)
    // pra ajudar a entender por que algo não aparece.
    const semDados = propriedades.filter(function(p){
      if (p.ativo === false) return false;
      if (!idsAtivos.has(p.cliente_id)) return false;
      return getDiasVenc(p) === null;
    });

    let diagHtml = '';
    if (semDados.length > 0 && _renovFiltro === 'todas') {
      diagHtml = '<div class="card" style="background:#FFFBEB;border:1px solid #FCD34D;margin-bottom:14px;">' +
        '<div style="font-size:12px;font-weight:700;color:#92400E;margin-bottom:8px;">⚠ ' + semDados.length + ' propriedade(s) sem data de outorga cadastrada</div>' +
        '<div style="font-size:11px;color:#78350F;margin-bottom:8px;">Estas propriedades não aparecem no ranking porque nenhum dos pontos tem <strong>Data de emissão</strong> + <strong>Prazo (anos)</strong> preenchidos. Edite o ponto para cadastrar.</div>' +
        '<div style="display:flex;flex-direction:column;gap:4px;">' +
        semDados.map(function(p){
          const c = clientes.find(function(cc){return cc.id===p.cliente_id;});
          const ussP = usos.filter(function(u){return u.propriedade_id===p.id;});
          const usoStr = ussP.map(function(u){
            const temData = !!u.data_emissao;
            const temPrazo = !!u.prazo_anos;
            return u.descricao + ' (' + (temData?'data ✓':'sem data') + ', ' + (temPrazo?'prazo ✓':'sem prazo') + ')';
          }).join(', ') || 'sem pontos cadastrados';
          return '<div style="font-size:11px;background:white;padding:6px 10px;border-radius:4px;display:flex;justify-content:space-between;align-items:center;gap:8px;">' +
            '<span><strong>' + (c?c.nome:'?') + '</strong> · ' + p.nome + '<br><span style="color:#9ca3af;font-size:10px;">' + usoStr + '</span></span>' +
            '<button class="btn btn-sm" onclick="verCliente(\'' + p.cliente_id + '\')">Abrir cliente</button>' +
            '</div>';
        }).join('') +
        '</div>' +
        '</div>';
    }

    if (!lista.length) {
      el.innerHTML = diagHtml + '<div class="card" style="text-align:center;padding:32px;color:var(--text-muted)">Nenhuma renovação encontrada no filtro "' + _renovFiltro + '".</div>';
      return;
    }

    const listaHtml = lista.map(function(x, idx) {
      const p = x.prop;
      const c = clientes.find(function(cc){return cc.id===p.cliente_id;});
      const cor = getCorVenc(x.dias, x.renovando);
      if (!cor) return '';
      const usoBase = x.usoAncora;
      const dataEmBase = (usoBase && usoBase.data_emissao) || p.data_emissao;
      const prazoBase = (usoBase && usoBase.prazo_anos) || p.prazo_anos;
      const venc = new Date(dataEmBase);
      venc.setFullYear(venc.getFullYear() + parseInt(prazoBase,10));
      const portariaBase = (usoBase && usoBase.portaria) || p.portaria || '';
      const processoBase = (usoBase && usoBase.processo) || p.processo || '';
      const uss = x.ussDaProp;
      const usoComPdf = uss.find(function(u){return u.outorga_pdf_url;}) || (usoBase && usoBase.outorga_pdf_url ? usoBase : null);

      // FASE 3B: detecta se já existe projeto em andamento dessa propriedade
      const projAtivo = (typeof projetos !== 'undefined' ? projetos : []).find(function(pp){
        return pp.propriedade_id === p.id && pp.status === 'em_andamento';
      });

      // SEMANA 4.1: telefone pra botão WhatsApp
      const tel = c && (c.telefone1 || c.telefone2 || '');
      const telLimpo = tel ? String(tel).replace(/\D/g, '') : '';
      const linkWa = telLimpo ? 'https://wa.me/55' + telLimpo + '?text=' + encodeURIComponent('Olá ' + (c ? c.nome : '') + '! Aqui é a Zello Ambiental. A outorga DAEE da sua propriedade "' + p.nome + '" está se aproximando do vencimento (' + venc.toLocaleDateString('pt-BR') + '). Podemos conversar sobre a renovação?') : '';

      return '<div style="background:'+cor.fundo+';border-left:4px solid '+cor.borda+';border-radius:0 10px 10px 0;padding:14px 16px;margin-bottom:10px;display:flex;align-items:center;gap:14px;">' +
        '<div style="font-size:22px;font-weight:800;color:'+cor.borda+';font-family:monospace;min-width:36px;text-align:center;">' + (idx+1) + '</div>' +
        '<div style="flex:1;">' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">' +
            '<span style="font-size:13px;font-weight:600;">' + (c?c.nome:'') + ' — ' + p.nome + '</span>' +
            '<span style="background:'+cor.borda+';color:white;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;">' + cor.label + '</span>' +
            (projAtivo ? '<span style="background:#1565C0;color:white;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;">EM PROJETO</span>' : '') +
          '</div>' +
          '<div style="font-size:12px;color:var(--text-muted);display:flex;gap:14px;flex-wrap:wrap;">' +
            '<span style="background:rgba(255,255,255,0.6);padding:3px 8px;border-radius:5px;font-weight:600;color:var(--text);">' +
              (portariaBase ? '📋 Port. ' + portariaBase : '📋 (sem portaria)') +
              ' · 📅 ' + (dataEmBase ? new Date(dataEmBase).toLocaleDateString('pt-BR') : '?') +
              ' · ⏱ ' + (prazoBase ? prazoBase + ' anos' : '?') +
            '</span>' +
            (processoBase ? '<span>📁 ' + processoBase + '</span>' : '') +
            '<span>⚠ Vence: <strong style="color:'+cor.texto+'">' + venc.toLocaleDateString('pt-BR') + '</strong> (' + (x.dias < 0 ? 'há ' + Math.abs(x.dias) + ' dias' : 'em ' + x.dias + ' dias') + ')</span>' +
            '<span>💧 ' + uss.length + ' ponto(s)</span>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:6px;flex-direction:column;">' +
          (projAtivo
            ? '<button class="btn btn-sm btn-blue" onclick="verProjeto(\'' + projAtivo.id + '\')">📂 Abrir projeto</button>'
            : '<button class="btn btn-sm btn-amber" onclick="abrirIniciarRenovacao(\'' + p.id + '\')">✏️ Iniciar Renovação</button>'
          ) +
          (linkWa ? '<a href="' + linkWa + '" target="_blank" class="btn btn-sm" style="background:#25D366;color:white;border:none;text-align:center;text-decoration:none;">💬 WhatsApp</a>' : '') +
          (usoComPdf ? '<a href="' + usoComPdf.outorga_pdf_url + '" target="_blank" class="btn btn-sm">📄 PDF</a>' : '') +
        '</div>' +
      '</div>';
    }).join('');
    el.innerHTML = diagHtml + listaHtml;
  }

  async function toggleRenovProp(pid, val) {
    // Atualiza todos os usos desta propriedade
    await api('usos?propriedade_id=eq.' + pid, 'PATCH', {renovacao_em_andamento: val}, 'return=minimal');
    await carregarDados();
  }

  // =============================================
  // EXCLUIR / DESATIVAR
  // =============================================
  async function desativarCliente(cid, nome) {
    if (!confirm('Desativar "' + nome + '"?')) return;
    try {
      const r = await api('clientes?id=eq.' + cid, 'PATCH', {ativo: false}, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));
      await carregarDados();
    } catch(e) {
      console.error('Erro desativarCliente:', e);
      alert('Erro ao desativar cliente: ' + (e.message || e));
    }
  }

  async function excluirCliente(cid, nome) {
    // ONDA 3 BUG#1: bloqueia exclusão de cliente que tem projeto em andamento
    // (antes, podia apagar cliente e deixar projetos órfãos)
    const projsAtivos = (typeof projetos !== 'undefined' ? projetos : [])
      .filter(function(p){ return p.cliente_id === cid && p.status !== 'concluido' && p.status !== 'cancelado'; });
    if (projsAtivos.length > 0) {
      zAlert(
        '⚠ Não é possível excluir "' + nome + '" porque tem ' + projsAtivos.length + ' projeto(s) em andamento.\n\nFinalize ou cancele o(s) projeto(s) primeiro, ou use o botão "🚫 Desativar" se quiser apenas ocultar o cliente.',
        'aviso'
      );
      return;
    }

    if (!(await zConfirm('ATENCAO! Excluir definitivamente "' + nome + '" e todos os seus dados? Esta acao e IRREVERSIVEL.', { tipo:'erro', btnOk:'Excluir' }))) return;
    if (!(await zConfirm('Confirmacao final: excluir "' + nome + '"?', { tipo:'erro', btnOk:'Sim, excluir' }))) return;
    try {
      const r = await api('clientes?id=eq.' + cid, 'DELETE', null, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));
      await carregarDados();
      zAlert('Cliente excluído.', 'sucesso');
    } catch(e) {
      console.error('Erro excluirCliente:', e);
      zAlert('Erro ao excluir cliente: ' + (e.message || e), 'erro');
    }
  }

  async function excluirProp(pid, nome) {
    if (!(await zConfirm('Excluir a propriedade "' + nome + '" e todos os seus pontos? IRREVERSIVEL.', { tipo:'erro', btnOk:'Excluir' }))) return;
    try {
      const r = await api('propriedades?id=eq.' + pid, 'DELETE', null, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));
      await carregarDados();
      if (clienteAtualId) verCliente(clienteAtualId);
    } catch(e) {
      console.error('Erro excluirProp:', e);
      alert('Erro ao excluir propriedade: ' + (e.message || e));
    }
  }

  async function excluirUso(uid, desc) {
    if (!(await zConfirm('Excluir o ponto "' + desc + '"? IRREVERSIVEL.', { tipo:'erro', btnOk:'Excluir' }))) return;
    try {
      const r = await api('usos?id=eq.' + uid, 'DELETE', null, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));
      await carregarDados();
      if (clienteAtualId) verCliente(clienteAtualId);
    } catch(e) {
      console.error('Erro excluirUso:', e);
      alert('Erro ao excluir ponto: ' + (e.message || e));
    }
  }


  // =============================================
  // DISPARO EM MASSA — LEITURA MENSAL
  // =============================================
  // Atualiza o card de Alertas mostrando QUE dia é hoje e qual disparo é o recomendado.
  // Também destaca o botão correto e desativa os outros se passou do dia 15.
  // dia: opcional, defaulta para hoje (usado em testes para simular outros dias)
  function atualizarStatusDisparoDia(diaForcado) {
    const status = document.getElementById('disparo-status-dia');
    if (!status) return;
    const dia = (typeof diaForcado === 'number') ? diaForcado : new Date().getDate();

    // Botões
    const b1 = document.getElementById('btn-disparo-1');
    const b5 = document.getElementById('btn-disparo-5');
    const b10 = document.getElementById('btn-disparo-10');
    [b1,b5,b10].forEach(function(b){ if(b) { b.style.opacity = '0.55'; b.style.outline = ''; b.disabled = false; } });

    let msg, cor;
    if (dia >= 1 && dia <= 3) {
      msg = '📅 Hoje é dia ' + dia + ' — momento ideal para o <strong>1º aviso</strong>.';
      cor = '#1565C0';
      if (b1) { b1.style.opacity = '1'; b1.style.outline = '3px solid #1565C0'; }
    } else if (dia >= 4 && dia <= 7) {
      msg = '📅 Hoje é dia ' + dia + ' — momento ideal para o <strong>lembrete (dia 5)</strong>.';
      cor = '#F9A825';
      if (b5) { b5.style.opacity = '1'; b5.style.outline = '3px solid #F9A825'; }
    } else if (dia >= 8 && dia <= 12) {
      msg = '📅 Hoje é dia ' + dia + ' — momento ideal para o <strong>alerta final (dia 10)</strong>.';
      cor = '#E65100';
      if (b10) { b10.style.opacity = '1'; b10.style.outline = '3px solid #E65100'; }
    } else if (dia >= 13 && dia <= 15) {
      msg = '⚠️ Hoje é dia ' + dia + ' — restam <strong>' + (15-dia) + ' dia(s)</strong> para o fim do prazo. Considere reenviar o alerta final.';
      cor = '#C62828';
      if (b10) { b10.style.opacity = '1'; b10.style.outline = '3px solid #E65100'; }
    } else {
      // Dia 16+: prazo encerrado
      msg = '🔒 Hoje é dia ' + dia + ' — <strong>prazo de leitura encerrado</strong>. Os clientes não conseguem mais enviar leitura deste mês pelo link. Lance manualmente em "Acompanhamento".';
      cor = '#C62828';
      [b1,b5,b10].forEach(function(b){ if(b) { b.style.opacity = '0.4'; b.disabled = true; } });
    }
    status.style.color = cor;
    status.innerHTML = msg;
  }

  async function dispararLeituraTodos(modo, diaForcado) {
    // Bloqueio: depois do dia 15, não dispara nada
    const dia = (typeof diaForcado === 'number') ? diaForcado : new Date().getDate();
    if (dia > 15) {
      alert('🔒 Não é possível disparar leituras após o dia 15.\n\n' +
            'O prazo do mês está encerrado. Os clientes não conseguem mais enviar leitura pelo link.\n\n' +
            'Para registrar uma leitura atrasada, use "Acompanhamento" → "+ Lançar leitura" (manualmente).');
      return;
    }

    // FIX BUG: filtra também por cliente ativo (não dispara pra leads/em projeto)
    const idsClientesAtivosDisparo = new Set(clientes.filter(function(c){ return c.ativo !== false; }).map(function(c){ return c.id; }));
    const idsPropsAtivasDisparo = new Set(
      (propriedades || [])
        .filter(function(p){ return idsClientesAtivosDisparo.has(p.cliente_id); })
        .map(function(p){ return p.id; })
    );
    const usosComH = usos.filter(function(u){
      // SEMANA 4.7: dispara também pra pontos sem hidrômetro mas que precisam de relatório
      return requerLeitura(u) && u.token && idsPropsAtivasDisparo.has(u.propriedade_id);
    });
    const usosComL = new Set(leituras.map(function(l){ return l.uso_id; }));
    const pendentes = usosComH.filter(function(u){ return !usosComL.has(u.id); });

    if (!pendentes.length) { alert('✅ Todos os pontos já enviaram a leitura deste mês!'); return; }

    // Decide tom da mensagem por modo
    const cfg = {
      primeiro:    { titulo: '1º aviso',      icone: '📲', titMsg: 'Gestão da Água',         intro: 'Chegou o momento de registrar a leitura mensal do hidrômetro.' },
      lembrete5:   { titulo: 'Lembrete dia 5', icone: '🔔', titMsg: 'Lembrete de leitura',    intro: 'Sua leitura mensal ainda não foi registrada. Você tem até o dia 15 para enviar.' },
      lembrete10:  { titulo: 'Alerta dia 10',  icone: '⏰', titMsg: 'ATENÇÃO: prazo final',   intro: 'Sua leitura ainda não foi registrada. O prazo encerra no dia 15.' },
      // mantém compat com versão antiga
      lembrete:    { titulo: 'Lembrete',       icone: '⏰', titMsg: 'Lembrete de leitura',    intro: 'Sua leitura mensal ainda não foi registrada.' }
    }[modo] || { titulo: '1º aviso', icone: '📲', titMsg: 'Gestão da Água', intro: 'Chegou o momento de registrar a leitura mensal do hidrômetro.' };

    if (!confirm(cfg.icone + ' Enviar "' + cfg.titulo + '" para ' + pendentes.length + ' ponto(s) pendente(s)?\n\nSerão abertas ' + pendentes.length + ' janelas do WhatsApp em sequência.')) return;

    const status = document.getElementById('disparo-status');
    status.style.display = 'block';
    status.style.color = '#1565C0';
    let enviados = 0, semTel = 0;
    const diasRestantes = 15 - dia;

    pendentes.forEach(function(u, i) {
      const c = clientes.find(function(cc){ return cc.id === u.cliente_id; });
      const p = propriedades.find(function(pp){ return pp.id === u.propriedade_id; });
      if (!c) { semTel++; return; }
      const fone = (u.responsavel_tel || c.telefone1 || '').replace(/\D/g, '');
      if (!fone) { semTel++; return; }
      const req = u.requerimento ? '\n*Requerimento:* ' + u.requerimento : '';
      const ser = u.numero_serie ? '\n*Hidrômetro:* ' + u.numero_serie : '';
      const propNome = p ? p.nome : '';
      const linhaPrazo = diasRestantes > 0
        ? '\nVocê tem até o dia *15* para enviar (' + diasRestantes + ' dia(s) restante(s)).'
        : '\nO prazo encerra *hoje*. Envie agora.';
      const msg = encodeURIComponent(
        'Olá, ' + c.nome.split(' ')[0] + '!\n\n' +
        '*Zello Ambiental — ' + cfg.titMsg + '*\n' +
        cfg.intro + '\n\n' +
        '*Propriedade:* ' + propNome + '\n' +
        '*Ponto:* ' + u.descricao + req + ser + '\n' +
        (modo === 'primeiro' ? '' : linhaPrazo) + '\n\n' +
        'Acesse o link para informar a leitura:\n' +
        getClienteUrl() + '?token=' + u.token + '\n\n' +
        'Em caso de dúvidas:\n' + EMPRESA.eng + ' · ' + EMPRESA.tel
      );
      setTimeout(function() {
        window.open('https://wa.me/55' + fone + '?text=' + msg, '_blank');
        enviados++;
        status.textContent = '📤 Enviando ' + cfg.titulo + '... ' + enviados + ' de ' + pendentes.length;
        if (enviados + semTel >= pendentes.length) {
          status.textContent = '✅ ' + cfg.titulo + ' enviado! ' + enviados + ' mensagem(ns)' + (semTel>0 ? ' · ' + semTel + ' sem telefone' : '') + '.';
          renderAlertas7dias();
        }
      }, i * 700);
    });
  }


  // =============================================
  // NOTIFICAÇÕES DE PROCESSOS
  // =============================================
  let notificacoes = [];
  let _notifFiltro = 'todas';

  async function carregarNotificacoes() {
    try {
      notificacoes = await api('notificacoes?select=*&order=prazo_resposta.asc') || [];
    } catch(e) { notificacoes = []; }
    renderNotificacoes();
    atualizarBadgeNotif();
  }

  function atualizarBadgeNotif() {
    const abertas = notificacoes.filter(function(n){ return n.status !== 'respondida'; });
    const badge = document.getElementById('badge-notif');
    if (badge) {
      badge.textContent = abertas.length > 0 ? abertas.length : '';
      badge.style.display = abertas.length > 0 ? 'inline-flex' : 'none';
      // Badge vermelho se alguma vence em 5 dias (ou já vencida)
      const criticas = abertas.filter(function(n){
        const dias = diasParaPrazo(n.prazo_resposta);
        return dias !== null && dias <= 5;
      });
      badge.style.background = criticas.length > 0 ? 'var(--red)' : 'var(--amber)';
    }
  }

  function diasParaPrazo(prazo) {
    if (!prazo) return null;
    var d = new Date(prazo+'T12:00:00');
    if (isNaN(d.getTime())) return null;
    return Math.round((d - new Date()) / (1000*60*60*24));
  }

  function badgePrazo(dias, status) {
    if (status === 'respondida') return '<span style="background:#E8F5E9;color:#2E7D32;padding:2px 10px;border-radius:20px;font-size:10px;font-weight:600;">✓ Respondida</span>';
    if (dias === null || dias === undefined || isNaN(dias)) return '<span style="background:#F3F4F6;color:#6B7280;padding:2px 10px;border-radius:20px;font-size:10px;font-weight:600;">Sem prazo</span>';
    if (dias < 0) return '<span style="background:#FFEBEE;color:#C62828;padding:2px 10px;border-radius:20px;font-size:10px;font-weight:700;">🔴 Vencida há '+Math.abs(dias)+' dia(s)</span>';
    if (dias <= 5) return '<span style="background:#FFEBEE;color:#C62828;padding:2px 10px;border-radius:20px;font-size:10px;font-weight:700;">🔴 '+dias+' dia(s) restante(s)</span>';
    if (dias <= 10) return '<span style="background:#FFF3E0;color:#E65100;padding:2px 10px;border-radius:20px;font-size:10px;font-weight:700;">🟠 '+dias+' dia(s) restante(s)</span>';
    return '<span style="background:#E8F5E9;color:#2E7D32;padding:2px 10px;border-radius:20px;font-size:10px;font-weight:600;">🟢 '+dias+' dia(s) restante(s)</span>';
  }

  // Filtro de texto para a lista de notificações
  let _notifBuscaTexto = '';
  function buscarNotifs(q) {
    // Normaliza removendo acentos para a busca casar com tudo
    _notifBuscaTexto = (q || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
    renderNotificacoes();
  }

  function filtrarNotifs(filtro) {
    _notifFiltro = filtro;
    ['todas','abertas','em_andamento','respondidas'].forEach(function(f){
      const btn = document.getElementById('notif-filtro-'+f);
      if (btn) {
        btn.style.background = f===filtro?'#1565C0':'';
        btn.style.color = f===filtro?'white':'';
      }
    });
    renderNotificacoes();
  }

  function renderNotificacoes() {
    const el = document.getElementById('lista-notificacoes');
    if (!el) return;

    let lista = notificacoes;
    if (_notifFiltro === 'abertas') lista = lista.filter(function(n){ return n.status !== 'respondida'; });
    if (_notifFiltro === 'em_andamento') lista = lista.filter(function(n){ return n.status === 'em_andamento'; });
    if (_notifFiltro === 'respondidas') lista = lista.filter(function(n){ return n.status === 'respondida'; });

    // Filtro de texto: busca em cliente/órgão/processo/observação
    if (_notifBuscaTexto) {
      const q = _notifBuscaTexto;
      const norm = function(s){ return (s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); };
      lista = lista.filter(function(n){
        const c = clientes.find(function(cc){return cc.id===n.cliente_id;});
        const p = n.propriedade_id ? propriedades.find(function(pp){return pp.id===n.propriedade_id;}) : null;
        return norm(c ? c.nome : '').indexOf(q) >= 0
            || norm(p ? p.nome : '').indexOf(q) >= 0
            || norm(n.orgao).indexOf(q) >= 0
            || norm(n.tipo).indexOf(q) >= 0
            || norm(n.processo).indexOf(q) >= 0
            || norm(n.observacao).indexOf(q) >= 0;
      });
    }

    // Ordena por: 1) status (abertas primeiro), 2) prazo (mais urgente primeiro), null no final
    lista = lista.slice().sort(function(a,b){
      const aResp = a.status === 'respondida';
      const bResp = b.status === 'respondida';
      if (aResp !== bResp) return aResp ? 1 : -1;
      const da = diasParaPrazo(a.prazo_resposta);
      const db = diasParaPrazo(b.prazo_resposta);
      if (da === null && db === null) return 0;
      if (da === null) return 1;
      if (db === null) return -1;
      return da - db;
    });

    // Resumo
    const abertas = notificacoes.filter(function(n){ return n.status !== 'respondida'; }).length;
    const emAndamento = notificacoes.filter(function(n){ return n.status === 'em_andamento'; }).length;
    const criticas = notificacoes.filter(function(n){
      if (n.status === 'respondida') return false;
      const d = diasParaPrazo(n.prazo_resposta);
      return d !== null && d <= 5;
    }).length;
    const vencidas = notificacoes.filter(function(n){
      if (n.status === 'respondida') return false;
      const d = diasParaPrazo(n.prazo_resposta);
      return d !== null && d < 0;
    }).length;
    const resumoEl = document.getElementById('notif-resumo');
    if (resumoEl) {
      const partes = [];
      partes.push('<strong>'+abertas+'</strong> em aberto');
      if (emAndamento > 0) partes.push('<strong>'+emAndamento+'</strong> em andamento');
      if (criticas > 0) partes.push('<span style="color:#C62828;font-weight:700;">'+criticas+' crítica(s)</span>');
      if (vencidas > 0) partes.push('<span style="color:#C62828;font-weight:700;">'+vencidas+' vencida(s)</span>');
      resumoEl.innerHTML = partes.join(' · ');
    }

    if (!lista.length) {
      el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);font-size:13px;">'
        + (_notifBuscaTexto ? 'Nenhuma notificação corresponde à busca.' : 'Nenhuma notificação encontrada.')
        + '</div>';
      return;
    }

    const statusLabel = { aberta: 'Em aberto', em_andamento: 'Em andamento', respondida: 'Respondida' };

    el.innerHTML = lista.map(function(n) {
      const c = clientes.find(function(cc){ return cc.id === n.cliente_id; });
      const p = n.propriedade_id ? propriedades.find(function(pp){ return pp.id === n.propriedade_id; }) : null;
      const dias = diasParaPrazo(n.prazo_resposta);
      const prazoStr = n.prazo_resposta ? new Date(n.prazo_resposta+'T12:00:00').toLocaleDateString('pt-BR') : '—';
      const recebStr = n.data_recebimento ? new Date(n.data_recebimento+'T12:00:00').toLocaleDateString('pt-BR') : '—';
      const borderCor = n.status==='respondida' ? '#A5D6A7'
                      : n.status==='em_andamento' ? '#90CAF9'
                      : (dias !== null && dias <= 5) ? '#FECACA'
                      : (dias !== null && dias <= 10) ? '#FDBA74'
                      : '#BFDBFE';
      const corStatus = n.status==='respondida' ? '#2E7D32' : n.status==='em_andamento' ? '#1565C0' : '#E65100';
      const bgStatus  = n.status==='respondida' ? '#E8F5E9' : n.status==='em_andamento' ? '#E3F2FD' : '#FFF3E0';

      return '<div style="background:white;border:1px solid '+borderCor+';border-left:4px solid '+borderCor+';border-radius:8px;padding:14px 16px;margin-bottom:10px;">'
        +'<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;">'
          +'<div style="flex:1;">'
            +'<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">'
              +'<span style="background:#EFF6FF;color:#1565C0;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:700;">'+(n.orgao||'—')+'</span>'
              +'<span style="font-size:12px;font-weight:600;color:var(--text);">'+escapeHtml(n.tipo||'—')+'</span>'
              +badgePrazo(dias, n.status)
              +'<span style="background:'+bgStatus+';color:'+corStatus+';padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600;">'+escapeHtml(statusLabel[n.status]||n.status)+'</span>'
            +'</div>'
            +'<div style="font-size:12px;font-weight:600;color:#1565C0;margin-bottom:3px;">'+escapeHtml(c?c.nome:'—')+(p?' · '+escapeHtml(p.nome):'')+'</div>'
            +(n.processo?'<div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">📋 '+escapeHtml(n.processo)+'</div>':'')
            +'<div style="font-size:12px;color:var(--text);line-height:1.6;background:#f9fafb;border-radius:6px;padding:8px 10px;margin-top:6px;">'+escapeHtml(n.observacao||'(sem descrição)')+'</div>'
            +'<div style="font-size:10px;color:var(--text-muted);margin-top:8px;">Recebido em '+recebStr+' · Prazo: <strong>'+prazoStr+'</strong></div>'
          +'</div>'
          +'<div style="display:flex;flex-direction:column;gap:6px;min-width:120px;">'
            +(n.status==='aberta' ? '<button class="btn btn-sm" style="background:#E3F2FD;color:#1565C0;border:1px solid #90CAF9;" onclick="marcarStatus(\''+n.id+'\',\'em_andamento\')">▶ Em andamento</button>' : '')
            +(n.status!=='respondida' ? '<button class="btn btn-sm" style="background:#E8F5E9;color:#2E7D32;border:1px solid #A5D6A7;" onclick="marcarStatus(\''+n.id+'\',\'respondida\')">✓ Respondida</button>' : '')
            +'<button class="btn btn-sm" onclick="editarNotif(\''+n.id+'\')">✏️ Editar</button>'
            +'<button class="btn btn-sm btn-danger" onclick="excluirNotif(\''+n.id+'\')">🗑 Excluir</button>'
          +'</div>'
        +'</div>'
      +'</div>';
    }).join('');
  }

  function abrirNovaNotif() {
    document.getElementById('notif-eid').value = '';
    document.getElementById('notif-modal-titulo').textContent = 'Nova notificação';
    // Preencher clientes
    const sel = document.getElementById('notif-cliente');
    sel.innerHTML = '<option value="">Selecionar cliente...</option>' +
      clientes.map(function(c){ return '<option value="'+c.id+'">'+c.nome+'</option>'; }).join('');
    document.getElementById('notif-prop').innerHTML = '<option value="">Todas as propriedades</option>';
    document.getElementById('notif-orgao').value = 'DAEE';
    document.getElementById('notif-tipo').value = 'Complementação de documentos';
    document.getElementById('notif-processo').value = '';
    document.getElementById('notif-obs').value = '';
    document.getElementById('notif-status').value = 'aberta';
    // Data recebimento = hoje
    const hoje = getDataHojeBR();
    document.getElementById('notif-recebimento').value = hoje;
    document.getElementById('notif-prazo').value = '';
    abrirModal('ov-notif');
  }

  function notifPopularProps() {
    const cid = document.getElementById('notif-cliente').value;
    const sel = document.getElementById('notif-prop');
    sel.innerHTML = '<option value="">Todas as propriedades</option>';
    if (!cid) return;
    const props = propriedades.filter(function(p){ return p.cliente_id === cid; });
    props.forEach(function(p){ sel.innerHTML += '<option value="'+escapeHtml(p.id)+'">'+escapeHtml(p.nome)+'</option>'; });
  }

  function editarNotif(nid) {
    const n = notificacoes.find(function(nn){ return nn.id === nid; });
    if (!n) return;
    document.getElementById('notif-eid').value = nid;
    document.getElementById('notif-modal-titulo').textContent = 'Editar notificação';
    const sel = document.getElementById('notif-cliente');
    sel.innerHTML = '<option value="">Selecionar cliente...</option>' +
      clientes.map(function(c){ return '<option value="'+c.id+'">'+c.nome+'</option>'; }).join('');
    sel.value = n.cliente_id || '';
    notifPopularProps();
    document.getElementById('notif-prop').value = n.propriedade_id || '';
    document.getElementById('notif-orgao').value = n.orgao || 'DAEE';
    document.getElementById('notif-tipo').value = n.tipo || '';
    document.getElementById('notif-processo').value = n.processo || '';
    document.getElementById('notif-obs').value = n.observacao || '';
    document.getElementById('notif-status').value = n.status || 'aberta';
    document.getElementById('notif-recebimento').value = n.data_recebimento || '';
    document.getElementById('notif-prazo').value = n.prazo_resposta || '';
    abrirModal('ov-notif');
  }

  async function salvarNotif() {
    const eid = document.getElementById('notif-eid').value;
    const cid = document.getElementById('notif-cliente').value;
    const obs = document.getElementById('notif-obs').value.trim();
    const prazo = document.getElementById('notif-prazo').value;
    const receb = document.getElementById('notif-recebimento').value;
    const processo = document.getElementById('notif-processo').value.trim();
    if (!cid) { alert('Selecione o cliente.'); return; }
    if (!obs) { alert('Preencha as observações.'); return; }
    if (!receb) { alert('Informe a data de recebimento.'); return; }
    if (!prazo) { alert('Informe o prazo para resposta.'); return; }

    // Validação: prazo não pode ser anterior à data de recebimento
    if (prazo < receb) {
      alert('⚠️ O prazo de resposta não pode ser anterior à data de recebimento.');
      return;
    }

    // Validação: data de recebimento não pode ser muito no futuro (>30 dias à frente é provavelmente erro de digitação)
    var hoje = new Date(); hoje.setHours(0,0,0,0);
    var dReceb = new Date(receb+'T12:00:00');
    var diffFuturo = (dReceb - hoje)/(1000*60*60*24);
    if (diffFuturo > 30) {
      if (!confirm('⚠️ A data de recebimento está mais de 30 dias no futuro (' + new Date(receb+'T12:00:00').toLocaleDateString('pt-BR') + '). Confirmar mesmo assim?')) return;
    }

    // Validação: notificação duplicada (mesmo cliente + mesmo processo, ignorando a própria em edição)
    if (processo) {
      var dup = notificacoes.find(function(nn){
        if (eid && nn.id === eid) return false;
        return nn.cliente_id === cid && nn.processo && nn.processo.trim().toLowerCase() === processo.toLowerCase();
      });
      if (dup) {
        var c = clientes.find(function(cc){return cc.id===cid;});
        if (!confirm('⚠️ Já existe uma notificação para "' + (c?c.nome:'este cliente') + '" com o mesmo processo "' + processo + '".\n\nSalvar mesmo assim?')) return;
      }
    }

    const payload = {
      cliente_id: cid,
      propriedade_id: document.getElementById('notif-prop').value || null,
      orgao: document.getElementById('notif-orgao').value,
      tipo: document.getElementById('notif-tipo').value,
      processo: processo || null,
      observacao: obs,
      data_recebimento: receb,
      prazo_resposta: prazo,
      status: document.getElementById('notif-status').value
    };

    let r;
    if (eid) {
      r = await api('notificacoes?id=eq.'+eid, 'PATCH', payload, 'return=minimal');
    } else {
      r = await api('notificacoes', 'POST', payload, 'return=minimal');
    }

    if (r && r.ok) {
      fecharModal('ov-notif');
      await carregarNotificacoes();
    } else {
      var errMsg = '';
      if (r) { try { errMsg = await r.text(); } catch(e) {} }
      console.error('[Zello] Erro salvarNotif:', errMsg);
      alert('Erro ao salvar notificação.' + (errMsg ? '\n\n' + errMsg.substring(0,200) : ''));
    }
  }

  async function marcarStatus(nid, novoStatus) {
    const labels = { aberta: 'em aberto', em_andamento: 'em andamento', respondida: 'respondida' };
    if (!confirm('Marcar esta notificação como ' + (labels[novoStatus] || novoStatus) + '?')) return;
    const r = await api('notificacoes?id=eq.'+nid, 'PATCH', { status: novoStatus }, 'return=minimal');
    if (r && r.ok) {
      await carregarNotificacoes();
    } else {
      alert('Erro ao atualizar status da notificação.');
    }
  }
  // Compatibilidade — mantém funcionando código antigo que chamasse marcarRespondida
  async function marcarRespondida(nid) { return marcarStatus(nid, 'respondida'); }

  async function excluirNotif(nid) {
    if (!confirm('Excluir esta notificação? Esta ação não pode ser desfeita.')) return;
    await api('notificacoes?id=eq.'+nid, 'DELETE', null, 'return=minimal');
    await carregarNotificacoes();
  }

  // =============================================
  // COMUNICADOS
  // =============================================
  // =============================================
  // COMUNICADOS
  // =============================================

  // Templates pré-prontos. {nome}, {empreendimento}, {ponto}, {requerimento}, {portaria} são substituídos por cliente.
  const TEMPLATES_COMUNICADO = {
    lembrete_leitura: {
      titulo: 'Lembrete de leitura mensal',
      msg: 'Olá, {nome}!\n\nGostaríamos de lembrar que ainda não recebemos a leitura mensal do hidrômetro do seu empreendimento *{empreendimento}*.\n\nPedimos a gentileza de enviar o quanto antes pelo link enviado anteriormente. O prazo encerra no *dia 15* deste mês.\n\nQualquer dúvida estamos à disposição.'
    },
    renovacao: {
      titulo: 'Início do processo de renovação de outorga',
      msg: 'Prezado(a) {nome},\n\nA outorga do empreendimento *{empreendimento}* (Portaria {portaria}) está se aproximando do vencimento.\n\nIniciaremos o processo de renovação. Para isso, precisaremos:\n• Documentação atualizada do imóvel\n• Cadastro Ambiental Rural (CAR)\n• Comprovantes de envio mensal de leituras dos últimos 12 meses\n\nEntraremos em contato em breve para alinhamento. Por favor, mantenha esta documentação à mão.'
    },
    vistoria: {
      titulo: 'Aviso de possível vistoria do órgão ambiental',
      msg: 'Prezado(a) {nome},\n\nInformamos que o órgão ambiental pode realizar vistoria no empreendimento *{empreendimento}* nos próximos dias.\n\nRecomendamos:\n• Manter o hidrômetro em local visível e acessível\n• Verificar se a placa de identificação da outorga está visível\n• Manter a área da captação limpa e organizada\n• Ter cópia da outorga e comprovantes de leituras disponíveis\n\nQualquer notificação que receba do órgão, nos avise imediatamente.'
    },
    manutencao_hidrometro: {
      titulo: 'Manutenção / troca de hidrômetro',
      msg: 'Olá, {nome}!\n\nIdentificamos que o hidrômetro do ponto *{ponto}* (empreendimento {empreendimento}) precisa de manutenção ou substituição.\n\nPor favor, entre em contato para agendarmos a vistoria técnica. É importante registrar a leitura final do equipamento atual antes da troca, para manter o histórico contínuo.'
    },
    excesso_consumo: {
      titulo: 'Alerta: consumo acima do autorizado',
      msg: 'Prezado(a) {nome},\n\nIdentificamos que o consumo de água no ponto *{ponto}* do empreendimento *{empreendimento}* superou o volume autorizado pela outorga nos últimos meses.\n\nÉ importante revisar o uso e adequar ao limite autorizado, pois consumos persistentes acima do autorizado podem gerar:\n• Notificação do órgão ambiental\n• Multa\n• Suspensão da outorga\n\nVamos agendar uma reunião técnica para avaliar as alternativas?'
    },
    documentacao: {
      titulo: 'Solicitação de documentação',
      msg: 'Prezado(a) {nome},\n\nPara dar continuidade aos serviços de assessoria ambiental do empreendimento *{empreendimento}*, precisamos dos seguintes documentos atualizados:\n\n• Documento pessoal (CPF/RG ou CNPJ + contrato social)\n• Matrícula atualizada do imóvel\n• CAR (Cadastro Ambiental Rural)\n• ITR (Imposto Territorial Rural) do último ano\n\nPode enviar pelo WhatsApp ou e-mail. Obrigado!'
    },
    boas_festas: {
      titulo: 'Boas festas',
      msg: 'Olá, {nome}!\n\nA equipe da Zello Ambiental deseja a você e sua família boas festas e um ano novo cheio de realizações.\n\nNosso compromisso com a gestão sustentável da água do seu empreendimento continua em 2026. Estamos à disposição.\n\nGrande abraço!'
    },
    reuniao: {
      titulo: 'Convite para reunião técnica',
      msg: 'Prezado(a) {nome},\n\nGostaria de agendar uma reunião técnica para discutirmos as próximas etapas do processo ambiental do empreendimento *{empreendimento}*.\n\nTemos disponibilidade para presencial ou videochamada. Quando seria melhor para você?'
    }
  };

  function aplicarTemplateComunicado(key) {
    if (!key) return;
    const t = TEMPLATES_COMUNICADO[key];
    if (!t) return;
    document.getElementById('com-titulo').value = t.titulo;
    document.getElementById('com-msg').value = t.msg;
    atualizarPreviewComunicado();
  }

  function getDestinatariosComunicado() {
    const tipo = document.getElementById('com-dest').value;
    const ativos = clientes.filter(function(c){ return c.ativo !== false && c.telefone1; });
    if (tipo === 'todos') return ativos;
    if (tipo === 'cliente_unico') {
      const cid = document.getElementById('com-cliente').value;
      return cid ? ativos.filter(function(c){ return c.id === cid; }) : [];
    }
    if (tipo === 'com_hidrometro') {
      const cidsComH = new Set(usos.filter(function(u){ return u.possui_hidrometro; }).map(function(u){ return u.cliente_id; }));
      return ativos.filter(function(c){ return cidsComH.has(c.id); });
    }
    if (tipo === 'sem_leitura_mes') {
      // SEMANA 4.7: inclui pontos com relatório de vazão
      const usosComH = usos.filter(function(u){ return requerLeitura(u); });
      const usosComL = new Set((leituras || []).map(function(l){ return l.uso_id; }));
      const cidsPendentes = new Set(usosComH.filter(function(u){ return !usosComL.has(u.id); }).map(function(u){ return u.cliente_id; }));
      return ativos.filter(function(c){ return cidsPendentes.has(c.id); });
    }
    if (tipo === 'com_outorga_proxima') {
      const cidsVenc = new Set(propriedades.filter(function(p){
        const d = getDiasVenc(p);
        return d !== null && d/30 <= 6;
      }).map(function(p){ return p.cliente_id; }));
      return ativos.filter(function(c){ return cidsVenc.has(c.id); });
    }
    return [];
  }

  function atualizarContagemDestinatarios() {
    const tipo = document.getElementById('com-dest').value;
    const wrap = document.getElementById('com-cliente-wrap');
    const sel = document.getElementById('com-cliente');
    if (tipo === 'cliente_unico') {
      wrap.style.display = '';
      sel.innerHTML = '<option value="">Selecionar...</option>' +
        clientes.filter(function(c){ return c.ativo !== false; })
          .map(function(c){ return '<option value="'+c.id+'">'+c.nome+'</option>'; }).join('');
    } else {
      wrap.style.display = 'none';
    }
    const dests = getDestinatariosComunicado();
    const el = document.getElementById('com-contagem');
    if (!dests.length) {
      el.innerHTML = '<span style="color:#C62828;">⚠ Nenhum destinatário corresponde ao filtro atual.</span>';
    } else {
      el.innerHTML = '📤 Será enviado para <strong>' + dests.length + '</strong> cliente(s).';
    }
    atualizarPreviewComunicado();
  }

  function montarMensagemComunicado(c, titulo, msgBase) {
    // Para usar primeira propriedade/uso quando relevante
    const p = propriedades.find(function(pp){ return pp.cliente_id === c.id; });
    const u = p ? usos.find(function(uu){ return uu.propriedade_id === p.id; }) : null;
    const subs = {
      '{nome}': (c.nome || '').split(' ')[0],
      '{empreendimento}': p ? p.nome : '',
      '{ponto}': u ? (u.descricao || '') : '',
      '{requerimento}': u && u.requerimento ? u.requerimento : '',
      '{portaria}': (u && u.portaria) || (p && p.portaria) || ''
    };
    let texto = msgBase;
    Object.keys(subs).forEach(function(k){ texto = texto.split(k).join(subs[k]); });
    // remove linhas que ficaram com "*  *" (vazio entre asteriscos) ou ficaram só com pontuação
    texto = texto.replace(/\*\s*\*/g, '').replace(/\(\s*\)/g, '');
    return '*' + titulo + '*\n\n' + texto + '\n\n— ' + EMPRESA.nome + '\n' + EMPRESA.eng + ' · ' + EMPRESA.tel;
  }

  function atualizarPreviewComunicado() {
    const titulo = document.getElementById('com-titulo').value.trim();
    const msg = document.getElementById('com-msg').value.trim();
    const el = document.getElementById('com-preview');
    if (!titulo && !msg) {
      el.innerHTML = '<em>O preview aparece aqui conforme você digita.</em>';
      el.style.color = 'var(--text-muted)';
      return;
    }
    const dests = getDestinatariosComunicado();
    const cliente = dests[0] || clientes[0] || { nome: 'João Cliente' };
    const tit = titulo || '(sem título)';
    const corpo = msg || '(sem mensagem)';
    const exemplo = montarMensagemComunicado(cliente, tit, corpo);
    el.style.color = 'var(--text)';
    el.textContent = exemplo + '\n\n— Preview baseado em: ' + (cliente.nome || '');
  }

  function visualizarComunicado() {
    atualizarPreviewComunicado();
    const dests = getDestinatariosComunicado();
    if (!dests.length) {
      alert('⚠ Não há destinatários com este filtro.\n\nVerifique o telefone cadastrado dos clientes ou troque o filtro.');
      return;
    }
    alert('👁 Preview atualizado.\n\n' + dests.length + ' cliente(s) receberão esta mensagem com seu nome substituído.');
  }

  function enviarComunicado() {
    const titulo = document.getElementById('com-titulo').value.trim();
    const msg = document.getElementById('com-msg').value.trim();
    if (!titulo) { alert('Preencha o título.'); return; }
    if (!msg) { alert('Preencha a mensagem.'); return; }

    const dests = getDestinatariosComunicado();
    if (!dests.length) {
      alert('⚠ Nenhum destinatário com este filtro.\n\nVerifique se há clientes cadastrados com telefone, ou troque o tipo de destinatário.');
      return;
    }

    if (!confirm('📤 Enviar comunicado para ' + dests.length + ' cliente(s)?\n\nSerão abertas ' + dests.length + ' janelas do WhatsApp em sequência (uma a cada 0,7s).\n\nLembre-se de permitir popups neste site.')) return;

    const status = document.getElementById('com-status');
    status.style.display = 'block';
    status.style.background = '#E3F2FD';
    status.style.borderColor = '#90CAF9';
    status.style.color = '#1565C0';

    let enviados = 0;
    dests.forEach(function(c, i) {
      const fone = (c.telefone1||'').replace(/\D/g,'');
      const txt = encodeURIComponent(montarMensagemComunicado(c, titulo, msg));
      setTimeout(function() {
        window.open('https://wa.me/55' + fone + '?text=' + txt, '_blank');
        enviados++;
        if (enviados < dests.length) {
          status.innerHTML = '📤 Enviando... <strong>' + enviados + '</strong> de ' + dests.length + ' (' + escapeHtml(c.nome) + ')';
        } else {
          status.style.background = '#E8F5E9';
          status.style.borderColor = '#A5D6A7';
          status.style.color = '#2E7D32';
          status.innerHTML = '✅ <strong>Comunicado enviado!</strong> ' + dests.length + ' janelas do WhatsApp foram abertas. Confirme o envio em cada uma.';
        }
      }, i * 700);
    });
  }

  // =============================================
  // LEITURAS
  // =============================================
  async function carregarLeituras() {
    const mes = document.getElementById('filtro-mes').value || getMes();
    const cid = document.getElementById('filtro-cli').value;
    let url = 'leituras?mes_referencia=eq.' + mes + '&select=*&order=enviado_em.desc';
    if (cid) url += '&cliente_id=eq.' + cid;
    const data = await api(url) || [];
    const tbody = document.getElementById('tbl-leituras');
    const resumoEl = document.getElementById('leituras-resumo');

    if (!data.length) {
      if (resumoEl) resumoEl.innerHTML = 'Nenhuma leitura encontrada para o mês <strong>' + mes + '</strong>.';
      tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:20px;color:var(--text-muted)">Nenhuma leitura encontrada</td></tr>';
      return;
    }

    // Totalizadores
    let totalConsumo = 0, totalAcima = 0, totalAutorizado = 0;
    data.forEach(function(l){
      const u = usos.find(function(uu){return uu.id===l.uso_id;});
      const aut = u ? getAutorizadoUso(u) : 0;
      totalConsumo += (l.consumo_m3 || 0);
      totalAutorizado += aut;
      if (aut > 0 && (l.consumo_m3||0) > aut) totalAcima++;
    });
    if (resumoEl) {
      resumoEl.innerHTML = '📊 <strong>' + data.length + '</strong> leitura(s) · '
        + '<strong>' + totalConsumo.toFixed(1) + ' m³</strong> captados · '
        + (totalAutorizado > 0 ? '<strong>' + totalAutorizado.toFixed(1) + ' m³</strong> autorizados · ' : '')
        + (totalAcima > 0 ? '<span style="color:#C62828;font-weight:700;">' + totalAcima + ' acima do limite ⚠</span>' : '<span style="color:#2E7D32;">todas dentro do limite ✓</span>');
    }

    tbody.innerHTML = data.map(function(l) {
      const c = clientes.find(function(cc){return cc.id===l.cliente_id;});
      const u = usos.find(function(uu){return uu.id===l.uso_id;});
      const p = u ? propriedades.find(function(pp){return pp.id===u.propriedade_id;}) : null;
      const aut = u ? getAutorizadoUso(u) : 0;
      const acima = aut > 0 && (l.consumo_m3||0) > aut;
      const dataStr = l.enviado_em ? new Date(l.enviado_em).toLocaleDateString('pt-BR') : '—';
      const fotoIcon = l.foto_equipamento_url
        ? '<a href="' + l.foto_equipamento_url + '" target="_blank" rel="noopener" title="Ver foto enviada pelo cliente" style="text-decoration:none;margin-left:4px;">📷</a>'
        : '';
      return '<tr>' +
        '<td style="font-size:11px">' + dataStr + fotoIcon + '</td>' +
        '<td style="font-weight:500">' + (c?c.nome:'—') + '</td>' +
        '<td style="font-size:11px">' + (p?p.nome:'—') + '</td>' +
        '<td style="font-size:11px">' + (u?u.descricao:'—') + '</td>' +
        '<td style="font-family:monospace">' + (l.leitura_anterior||0) + '</td>' +
        '<td style="font-family:monospace">' + (l.leitura_atual||0) + '</td>' +
        '<td style="' + (acima?'color:var(--red);font-weight:600':'') + '">' + ((l.consumo_m3||0).toFixed(1)) + (acima?' ⚠':'') + '</td>' +
        '<td>' + (aut>0?aut.toFixed(1):'—') + '</td>' +
        '<td><span class="badge ' + (acima?'badge-late':'badge-ok') + '">' + (acima?'Acima':'Normal') + '</span></td>' +
        '<td><div style="display:flex;gap:3px;">' +
          '<button class="btn btn-sm" onclick="editarLeitura(\''+l.id+'\')" title="Editar">✏️</button>' +
          '<button class="btn btn-sm btn-danger" onclick="excluirLeitura(\''+l.id+'\')" title="Excluir">🗑</button>' +
        '</div></td>' +
        '</tr>';
    }).join('');
  }

  async function editarLeitura(lid) {
    const lAll = await api('leituras?id=eq.' + lid + '&select=*') || [];
    if (!lAll.length) { alert('Leitura não encontrada.'); return; }
    const l = lAll[0];
    const u = usos.find(function(uu){return uu.id===l.uso_id;});
    if (!u) { alert('Ponto da leitura não encontrado.'); return; }

    const novoAtu = prompt('Editar leitura ATUAL para o ponto "' + u.descricao + '" no mês ' + l.mes_referencia + ':\n\n' +
      'Leitura anterior: ' + (l.leitura_anterior || 0) + '\n' +
      'Leitura atual atualmente: ' + (l.leitura_atual || 0) + '\n\n' +
      'Nova leitura atual:', String(l.leitura_atual || 0));
    if (novoAtu === null) return;
    const lAtu = parseFloat(novoAtu);
    if (isNaN(lAtu)) { alert('Valor inválido.'); return; }
    if (lAtu < (l.leitura_anterior || 0)) { alert('A leitura atual não pode ser menor que a anterior (' + (l.leitura_anterior || 0) + ').'); return; }
    const consumo = lAtu - (l.leitura_anterior || 0);

    const r = await api('leituras?id=eq.' + lid, 'PATCH', {
      leitura_atual: lAtu,
      consumo_m3: consumo
    }, 'return=minimal');
    if (r && r.ok) {
      await carregarLeituras();
      alert('✅ Leitura atualizada. Novo consumo: ' + consumo.toFixed(1) + ' m³');
    } else {
      var errMsg = '';
      if (r) { try { errMsg = await r.text(); } catch(e) {} }
      alert('Erro ao atualizar leitura.' + (errMsg ? '\n\n' + errMsg.substring(0,200) : ''));
    }
  }

  async function excluirLeitura(lid) {
    if (!confirm('🗑 Excluir esta leitura?\n\nEsta ação NÃO pode ser desfeita.\n\nProsseguir?')) return;
    const r = await api('leituras?id=eq.' + lid, 'DELETE', null, 'return=minimal');
    if (r && r.ok) {
      await carregarLeituras();
    } else {
      alert('Erro ao excluir leitura.');
    }
  }

  function exportarLeiturasMes() {
    const mes = document.getElementById('filtro-mes').value || getMes();
    if (typeof XLSX === 'undefined') { alert('Aguarde a biblioteca de Excel carregar.'); return; }
    const tbody = document.getElementById('tbl-leituras');
    const tabela = tbody.closest('table');
    if (!tabela || !tbody.rows.length) { alert('Nenhuma leitura para exportar.'); return; }
    // Constrói CSV/XLSX a partir dos dados visíveis (que estão em `data` da última carga)
    // Mais simples: chama carregar leituras e exporta o resultado
    const ws = XLSX.utils.aoa_to_sheet([
      ['Data','Cliente','Propriedade','Ponto','Leit. anterior','Leit. atual','Consumo m³','Autorizado','Status']
    ]);
    const linhas = [];
    Array.from(tbody.rows).forEach(function(tr){
      if (tr.cells.length < 9) return;
      linhas.push(Array.from(tr.cells).slice(0,9).map(function(td){ return td.textContent.trim(); }));
    });
    XLSX.utils.sheet_add_aoa(ws, linhas, {origin: 'A2'});
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leituras ' + mes);
    XLSX.writeFile(wb, 'Zello_Leituras_' + mes + '.xlsx');
  }

  // =============================================
  // RELATÓRIOS (cascata: Cliente → Prop → Uso)
  // =============================================
  function popularSelectsRel() {
    // Preencher ano atual se ainda não preenchido
    const anoInput = document.getElementById('rel-ano');
    if (anoInput && !anoInput.value) anoInput.value = new Date().getFullYear();
    const s = document.getElementById('rel-cliente');
    if (!s) return;
    const v = s.value;
    s.innerHTML = '<option value="">Selecione o cliente</option>';
    clientes.forEach(function(c){ const o = document.createElement('option'); o.value=c.id; o.textContent=c.nome; s.appendChild(o); });
    s.value = v;
    const sf = document.getElementById('filtro-cli');
    if (sf) { const vf=sf.value; sf.innerHTML='<option value="">Todos</option>'; clientes.forEach(function(c){const o=document.createElement('option');o.value=c.id;o.textContent=c.nome;sf.appendChild(o);}); sf.value=vf; }
  }

  function carregarPropRel() {
    const cid = document.getElementById('rel-cliente').value;
    const s = document.getElementById('rel-prop');
    s.innerHTML = '<option value="">Selecione a propriedade</option>';
    document.getElementById('rel-uso').innerHTML = '<option value="">Selecione o ponto</option>';
    if (!cid) return;
    propriedades.filter(function(p){return p.cliente_id===cid;}).forEach(function(p){ const o=document.createElement('option');o.value=p.id;o.textContent=p.nome;s.appendChild(o); });
  }

  function carregarUsoRel() {
    const pid = document.getElementById('rel-prop').value;
    const s = document.getElementById('rel-uso');
    s.innerHTML = '<option value="">Selecione o ponto</option>';
    if (!pid) return;
    usos.filter(function(u){return u.propriedade_id===pid;}).forEach(function(u){ const o=document.createElement('option');o.value=u.id;o.textContent=u.descricao+(u.numero_serie?' ('+u.numero_serie+')':'');s.appendChild(o); });
  }

  async function gerarRelatorio() {
    const cid = document.getElementById('rel-cliente').value;
    const pid = document.getElementById('rel-prop').value;
    const uid = document.getElementById('rel-uso').value;
    const ano = document.getElementById('rel-ano').value || new Date().getFullYear();
    if (!cid||!pid||!uid||!ano) { alert('Selecione cliente, propriedade, ponto e ano.'); return; }
    const c = clientes.find(function(cc){return cc.id===cid;});
    const p = propriedades.find(function(pp){return pp.id===pid;});
    const u = usos.find(function(uu){return uu.id===uid;});
    if (!c || !p || !u) { alert('Erro: dados não encontrados.'); return; }

    const leitsAno = await api('leituras?uso_id=eq.'+uid+'&mes_referencia=gte.'+ano+'-01&mes_referencia=lte.'+ano+'-12&select=*&order=mes_referencia.asc') || [];
    const dadosMeses = ['01','02','03','04','05','06','07','08','09','10','11','12'].map(function(m){
      const found = leitsAno.filter(function(l){return l.mes_referencia===ano+'-'+m;});
      return found.length ? found[0] : null;
    });

    const aut = getAutorizadoUso(u);
    const autAnual = aut * 12;
    const nomeMeses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const totalCap = dadosMeses.reduce(function(s,l){return s+(l?l.consumo_m3||0:0);},0);
    const pct = autAnual > 0 ? Math.round(totalCap/autAnual*100) : 0;
    const mesesComDado = dadosMeses.filter(function(l){return l;}).length;
    const mesesAcima = dadosMeses.filter(function(l){return l&&aut>0&&l.consumo_m3>aut;}).length;
    const mesesSemDado = 12 - mesesComDado;

    // Vencimento — usar dados do USO (etapa 3), com fallback para propriedade
    let vencBadge = '';
    let vencInfo = '';
    let dataEmissaoStr = '';
    let dataVencStr = '';
    const dataEm = u.data_emissao || p.data_emissao;
    const prazoAn = u.prazo_anos || p.prazo_anos;
    if (dataEm && prazoAn) {
      const dEm = new Date(dataEm);
      dataEmissaoStr = dEm.toLocaleDateString('pt-BR');
      const dVenc = new Date(dataEm); dVenc.setFullYear(dVenc.getFullYear()+parseInt(prazoAn,10));
      const dias = Math.round((dVenc-new Date())/(1000*60*60*24));
      dataVencStr = dVenc.toLocaleDateString('pt-BR');
      const cor = dias<0?'#C62828':dias<90?'#E65100':'#15803D';
      const bg = dias<0?'#FFEBEE':dias<90?'#FFF3E0':'#F0FDF4';
      const label = dias<0?'VENCIDA em '+dataVencStr:dias<90?'Vence em '+dataVencStr+' ('+dias+'d)':'Válida até '+dataVencStr;
      vencBadge = '<span style="background:'+bg+';color:'+cor+';padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;">'+label+'</span>';
      vencInfo = label;
    }

    // Mapa dos tipos de outorga
    const tiposOutorga = { outorga: 'Outorga', dispensa: 'Dispensa de Outorga', tamponamento: 'Tamponamento e Desistência' };
    const tipoOutorgaTxt = tiposOutorga[u.tipo_outorga] || u.tipo_outorga || 'Outorga';

    // Responsável pela leitura
    let respLeituraTxt = '—';
    if (u.responsavel_tel) {
      // Busca o nome correspondente ao telefone
      const cli = clientes.find(function(cc){ return cc.id===u.cliente_id; });
      const ctsAll = contatos.filter(function(ct){ return ct.cliente_id===u.cliente_id; });
      let respNome = '';
      if (cli && cli.telefone1 === u.responsavel_tel) respNome = cli.nome + ' (titular)';
      else {
        const ctMatch = ctsAll.find(function(ct){ return ct.telefone === u.responsavel_tel; });
        if (ctMatch) respNome = ctMatch.nome + ' (' + ctMatch.papel + ')';
      }
      respLeituraTxt = (respNome ? respNome + ' · ' : '') + u.responsavel_tel;
    }

    // ============================================
    // GRÁFICO SVG — meses bem visíveis, eixo Y, grid
    // ============================================
    const vals = dadosMeses.map(function(l){return l?l.consumo_m3||0:0;});
    const maxVal = Math.max.apply(null, vals.concat([aut||1, 1]));
    // Arredondar maxVal para escala bonita
    const escalaY = Math.ceil(maxVal * 1.1 / 10) * 10;
    const svgW = 820;
    const svgH = 240;          // altura maior pra caber labels
    const padTop = 18;
    const padBottom = 38;      // mais espaço pra labels dos meses
    const padLeft = 50;        // espaço pro eixo Y
    const padRight = 20;
    const plotW = svgW - padLeft - padRight;
    const plotH = svgH - padTop - padBottom;
    const barUnit = plotW / 12;
    const barW = Math.floor(barUnit * 0.62);

    // Linhas de grade horizontais (4 linhas)
    let grid = '';
    let yLabels = '';
    for (let g = 0; g <= 4; g++) {
      const yVal = (escalaY * g / 4);
      const yPx = padTop + plotH - (yVal / escalaY) * plotH;
      grid += '<line x1="'+padLeft+'" y1="'+yPx+'" x2="'+(svgW-padRight)+'" y2="'+yPx+'" stroke="#e5e7eb" stroke-width="0.8" stroke-dasharray="2,3"/>';
      yLabels += '<text x="'+(padLeft-6)+'" y="'+(yPx+3)+'" text-anchor="end" font-size="9" fill="#6b7280">'+yVal.toFixed(0)+'</text>';
    }

    // Barras
    const svgBars = dadosMeses.map(function(l, i){
      const v = l ? l.consumo_m3||0 : 0;
      const acima = aut > 0 && v > aut;
      const cor = !l ? '#d1d5db' : acima ? '#C62828' : '#1976D2';
      const h = v > 0 ? Math.max(Math.round(v/escalaY * plotH), 3) : 0;
      const x = padLeft + i*barUnit + (barUnit-barW)/2;
      const yBar = padTop + plotH - h;
      let svg = '<g>';
      svg += '<rect x="'+x.toFixed(1)+'" y="'+yBar+'" width="'+barW+'" height="'+h+'" fill="'+cor+'" rx="2"/>';
      // Valor em cima da barra
      if (v > 0) {
        svg += '<text x="'+(x+barW/2).toFixed(1)+'" y="'+(yBar-3)+'" text-anchor="middle" font-size="10" fill="'+cor+'" font-weight="700">'+v.toFixed(0)+'</text>';
      }
      // Nome do mês embaixo (FONTE MAIOR)
      svg += '<text x="'+(x+barW/2).toFixed(1)+'" y="'+(padTop+plotH+15)+'" text-anchor="middle" font-size="11" fill="#374151" font-weight="600">'+nomeMeses[i]+'</text>';
      // Status do mês (Acima/—) embaixo do nome
      if (l) {
        svg += '<text x="'+(x+barW/2).toFixed(1)+'" y="'+(padTop+plotH+27)+'" text-anchor="middle" font-size="8" fill="'+(acima?'#C62828':'#15803D')+'">'+(acima?'⚠':'✓')+'</text>';
      } else {
        svg += '<text x="'+(x+barW/2).toFixed(1)+'" y="'+(padTop+plotH+27)+'" text-anchor="middle" font-size="8" fill="#9ca3af">—</text>';
      }
      svg += '</g>';
      return svg;
    }).join('');

    // Linha do limite (vazão autorizada)
    let limLine = '';
    if (aut > 0 && aut <= escalaY) {
      const yLim = padTop + plotH - (aut/escalaY) * plotH;
      limLine = '<line x1="'+padLeft+'" y1="'+yLim+'" x2="'+(svgW-padRight)+'" y2="'+yLim+'" stroke="#E65100" stroke-width="1.5" stroke-dasharray="6,3"/>'
              + '<text x="'+(svgW-padRight-2)+'" y="'+(yLim-3)+'" text-anchor="end" font-size="9" fill="#E65100" font-weight="700">Limite '+aut.toFixed(0)+' m³/mês</text>';
    }
    // Eixo Y / X (linhas)
    const eixos = '<line x1="'+padLeft+'" y1="'+padTop+'" x2="'+padLeft+'" y2="'+(padTop+plotH)+'" stroke="#374151" stroke-width="1"/>'
                + '<line x1="'+padLeft+'" y1="'+(padTop+plotH)+'" x2="'+(svgW-padRight)+'" y2="'+(padTop+plotH)+'" stroke="#374151" stroke-width="1"/>'
                + '<text x="'+(padLeft-44)+'" y="'+(padTop+plotH/2)+'" font-size="9" fill="#6b7280" transform="rotate(-90 '+(padLeft-44)+' '+(padTop+plotH/2)+')" text-anchor="middle" font-weight="600">m³ / mês</text>';

    const svgGraf = '<svg width="'+svgW+'" height="'+svgH+'" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">'
      + grid + yLabels + eixos + svgBars + limLine + '</svg>';

    // Tabela
    const tRows = dadosMeses.map(function(l,i){
      const cap = l?l.consumo_m3||0:0;
      const pctM = (l&&aut>0)?Math.round(cap/aut*100):null;
      const acima = l&&aut>0&&cap>aut;
      const bgRow = i%2?'#f9fafb':'#ffffff';
      const stCor = !l?'#9ca3af':acima?'#C62828':'#15803D';
      const stTxt = !l?'Sem dado':acima?'Acima':'Normal';
      const pctCor = pctM===null?'#9ca3af':pctM>100?'#C62828':pctM>80?'#E65100':'#15803D';
      return '<tr style="background:'+bgRow+';page-break-inside:avoid;">'
        +'<td style="padding:5px 8px;border:1px solid #e5e7eb;">'+nomeMeses[i]+'/'+ano+'</td>'
        +'<td style="padding:5px 8px;border:1px solid #e5e7eb;font-family:monospace;text-align:right;">'+(l?l.leitura_anterior||0:'—')+'</td>'
        +'<td style="padding:5px 8px;border:1px solid #e5e7eb;font-family:monospace;text-align:right;">'+(l?l.leitura_atual:'—')+'</td>'
        +'<td style="padding:5px 8px;border:1px solid #e5e7eb;font-family:monospace;text-align:right;font-weight:600;">'+(l?cap.toFixed(1):'—')+'</td>'
        +'<td style="padding:5px 8px;border:1px solid #e5e7eb;text-align:right;">'+(aut>0?aut.toFixed(1):'—')+'</td>'
        +'<td style="padding:5px 8px;border:1px solid #e5e7eb;text-align:center;font-weight:700;color:'+pctCor+';">'+(pctM!==null?pctM+'%':'—')+'</td>'
        +'<td style="padding:5px 8px;border:1px solid #e5e7eb;font-weight:600;color:'+stCor+';">'+stTxt+(l&&l.observacao?'<br><span style="font-size:9px;color:#6b7280;font-weight:400;">'+l.observacao+'</span>':'')+'</td>'
        +'</tr>';
    }).join('');

    // Resumo
    const sitGeral = mesesAcima>0?'apresentou extrapolação do limite em '+mesesAcima+' mês(es)':'manteve-se dentro do volume autorizado em todos os meses com registro';
    const resumo = 'No ano de '+ano+', o ponto <strong>'+u.descricao+'</strong> captou <strong>'+totalCap.toFixed(1)+' m³</strong>, equivalente a <strong>'+pct+'%</strong> do volume anual autorizado'+(autAnual>0?' de <strong>'+autAnual.toFixed(1)+' m³</strong>':'')
      +'. Dos 12 meses, <strong>'+mesesComDado+'</strong> possuem leitura registrada'+(mesesSemDado>0?', <strong>'+mesesSemDado+'</strong> sem dado':'')
      +'. O ponto '+sitGeral+'.';

    const nomeArq = c.nome.split(' ')[0]+'_'+u.descricao.replace(/[^a-zA-Z0-9]/g,'_')+(u.requerimento?'_'+u.requerimento:'')+'_'+ano;
    const w = window.open('','_blank');

    w.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<title>${nomeArq}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:11px;color:#111827;background:#fff;padding:0;}
  @media print{
    *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}
    .no-print{display:none!important;}
    body{padding:0;}
    .pagina{page-break-after:always;}
    .pagina:last-child{page-break-after:avoid;}
    tr{page-break-inside:avoid;}
  }
  .pagina{padding:24px 28px;max-width:860px;margin:0 auto;}
  .cab{background:linear-gradient(135deg,#1565C0 0%,#1976D2 60%,#2196F3 100%);padding:16px 20px;border-radius:8px;color:white;margin-bottom:14px;}
  .cab-titulo{font-size:15px;font-weight:700;letter-spacing:.3px;}
  .cab-sub{font-size:10px;opacity:.85;margin-top:3px;}
  .grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:8px;}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;}
  .grid4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;margin-bottom:8px;}
  .card-info{background:#f8faff;border:1px solid #dbeafe;border-radius:6px;padding:8px 10px;}
  .card-label{font-size:8.5px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px;}
  .card-val{font-size:11.5px;font-weight:700;color:#111827;}
  .card-sub{font-size:9.5px;color:#6b7280;margin-top:1px;}
  .card-num{background:#EFF6FF;border:1px solid #BFDBFE;border-radius:6px;padding:8px;text-align:center;}
  .card-num .val{font-size:20px;font-weight:800;color:#1D4ED8;font-family:monospace;}
  .card-num .lab{font-size:9px;color:#6b7280;margin-top:2px;}
  .card-pct-ok{background:#F0FDF4;border:1px solid #BBF7D0;border-radius:6px;padding:8px;text-align:center;}
  .card-pct-ok .val{font-size:20px;font-weight:800;color:#15803D;font-family:monospace;}
  .card-pct-warn{background:#FFEBEE;border:1px solid #FECACA;border-radius:6px;padding:8px;text-align:center;}
  .card-pct-warn .val{font-size:20px;font-weight:800;color:#C62828;font-family:monospace;}
  .card-pct-ok .lab,.card-pct-warn .lab{font-size:9px;color:#6b7280;margin-top:2px;}
  .sec-titulo{font-size:9.5px;font-weight:700;color:#1565C0;text-transform:uppercase;letter-spacing:.06em;margin:10px 0 6px;padding-bottom:3px;border-bottom:1.5px solid #BFDBFE;}
  .vazao-detalhe{background:#F0F9FF;border:1px solid #BFDBFE;border-radius:6px;padding:10px 14px;margin-bottom:8px;font-size:11px;color:#1E3A8A;display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
  .vazao-detalhe .num{font-family:monospace;font-weight:700;font-size:13px;color:#1565C0;}
  .vazao-detalhe .op{color:#6b7280;font-size:13px;font-weight:300;}
  .vazao-detalhe .igual{color:#1565C0;font-weight:700;font-size:13px;}
  .vazao-detalhe .resultado{font-weight:800;font-family:monospace;font-size:14px;color:#1D4ED8;}
  .badge-tipo{display:inline-block;padding:2px 8px;border-radius:12px;font-size:9.5px;font-weight:700;letter-spacing:.03em;}
  .badge-outorga{background:#DBEAFE;color:#1E40AF;}
  .badge-dispensa{background:#FEF3C7;color:#92400E;}
  .badge-tamponamento{background:#F3E8FF;color:#6B21A8;}
  .foto-wrap{margin-bottom:8px;}
  .foto-label{font-size:8.5px;color:#6b7280;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;font-weight:600;}
  .foto-img{width:100%;max-height:200px;object-fit:contain;border-radius:6px;border:1px solid #e5e7eb;background:#f9fafb;display:block;}
  .graf-wrap{background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;margin-bottom:8px;}
  .graf-title{font-size:8.5px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;}
  .pdf-link{display:inline-block;background:#FFF3E0;color:#E65100;border:1px solid #FFB74D;padding:4px 10px;border-radius:4px;text-decoration:none;font-size:10px;font-weight:600;}
  table{width:100%;border-collapse:collapse;font-size:10.5px;}
  thead tr{background:#1565C0;}
  thead th{color:white;padding:6px 8px;text-align:left;font-weight:600;font-size:10px;border:1px solid #1565C0;}
  thead th:nth-child(2),thead th:nth-child(3),thead th:nth-child(4),thead th:nth-child(5){text-align:right;}
  thead th:nth-child(6){text-align:center;}
  .resumo{background:#F0F9FF;border-left:3px solid #1565C0;border-radius:0 6px 6px 0;padding:8px 12px;margin-top:8px;font-size:10.5px;line-height:1.7;color:#374151;}
  .resumo-title{font-size:8.5px;font-weight:700;color:#1565C0;text-transform:uppercase;margin-bottom:4px;}

  /* Página 2 */
  .pag2-cab{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #1565C0;padding-bottom:10px;margin-bottom:18px;}
  .pag2-titulo{font-size:13px;font-weight:700;color:#1565C0;}
  .pag2-sub{font-size:10px;color:#6b7280;margin-top:2px;}
  .decl-box{background:#F8FAFC;border:1px solid #e5e7eb;border-radius:8px;padding:16px 18px;margin-bottom:20px;}
  .decl-title{font-size:9px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;}
  .decl-texto{font-size:11px;color:#374151;line-height:2;}
  .local-data{display:flex;gap:16px;margin-bottom:40px;}
  .campo-linha{flex:1;}
  .campo-linha.pequeno{flex:0 0 160px;}
  .campo-label{font-size:9px;color:#6b7280;margin-bottom:3px;}
  .campo-border{border-bottom:1px solid #374151;padding-bottom:3px;font-size:11px;color:#374151;}
  .assinaturas{display:grid;grid-template-columns:1fr 1fr;gap:50px;margin-top:12px;}
  .ass-bloco{text-align:center;}
  .ass-espaco{height:72px;}
  .ass-linha{border-top:1.5px solid #374151;padding-top:8px;}
  .ass-nome{font-size:11.5px;font-weight:700;}
  .ass-cargo{font-size:10px;color:#6b7280;margin-top:2px;}
  .nota-legal{background:#F8FAFC;border:1px solid #e5e7eb;border-radius:6px;padding:10px 14px;margin-top:24px;font-size:9.5px;color:#374151;line-height:1.7;}
  .rodape{text-align:center;font-size:8.5px;color:#9ca3af;margin-top:12px;border-top:1px solid #f3f4f6;padding-top:8px;}
  .btn-print{display:inline-flex;align-items:center;gap:8px;background:#1565C0;color:white;border:none;border-radius:8px;padding:11px 28px;font-size:13px;font-weight:600;cursor:pointer;margin-top:16px;}
  .btn-print:hover{background:#1976D2;}
</style>
</head>
<body>

<!-- ═══ PÁGINA 1 ═══ -->
<div class="pagina">

  <div class="cab">
    <div class="cab-titulo">Zello Ambiental — Relatório Anual de Vazão ${ano}</div>
    <div class="cab-sub">${EMPRESA.eng} · ${EMPRESA.crea} · ${EMPRESA.tel} · ${EMPRESA.email}</div>
  </div>

  <!-- IDENTIFICAÇÃO (cliente / empreendimento / ponto) -->
  <div class="sec-titulo">Identificação</div>
  <div class="grid3">
    <div class="card-info">
      <div class="card-label">Cliente / Outorgado</div>
      <div class="card-val">${c.nome}</div>
      <div class="card-sub">${c.cpf_cnpj||''}</div>
    </div>
    <div class="card-info">
      <div class="card-label">Empreendimento</div>
      <div class="card-val">${p.nome}</div>
      <div class="card-sub">${p.cidade||''}${p.estado?' - '+p.estado:''}</div>
    </div>
    <div class="card-info">
      <div class="card-label">Ponto de captação</div>
      <div class="card-val">${u.descricao}</div>
      <div class="card-sub">${u.possui_hidrometro===false?'⚠ Sem hidrômetro':(u.numero_serie?'Hidrômetro: '+u.numero_serie:'Hidrômetro: —')}</div>
    </div>
  </div>

  <!-- DADOS DA OUTORGA / LICENÇA (etapa 3 completa) -->
  <div class="sec-titulo">Dados da outorga / licença</div>
  <div class="grid4">
    <div class="card-info">
      <div class="card-label">Tipo</div>
      <div class="card-val"><span class="badge-tipo badge-${u.tipo_outorga||'outorga'}">${tipoOutorgaTxt}</span></div>
    </div>
    <div class="card-info">
      <div class="card-label">Nº Portaria / Licença</div>
      <div class="card-val">${u.portaria||p.portaria||'—'}</div>
    </div>
    <div class="card-info">
      <div class="card-label">Processo / SEI</div>
      <div class="card-val">${u.processo||p.processo||'—'}</div>
    </div>
    <div class="card-info">
      <div class="card-label">Requerimento</div>
      <div class="card-val">${u.requerimento||'—'}</div>
    </div>
    <div class="card-info">
      <div class="card-label">Data de emissão</div>
      <div class="card-val">${dataEmissaoStr||'—'}</div>
    </div>
    <div class="card-info">
      <div class="card-label">Validade (anos)</div>
      <div class="card-val">${prazoAn||'—'}${prazoAn?' anos':''}</div>
    </div>
    <div class="card-info" ${vencInfo?`style="border-color:#FECACA;background:#FFFBEB;"`:''}>
      <div class="card-label">Situação</div>
      <div class="card-val">${vencBadge||'<span style="color:#9ca3af;font-weight:400;">Sem data</span>'}</div>
    </div>
    <div class="card-info">
      <div class="card-label">PDF da outorga</div>
      <div class="card-val">${u.outorga_pdf_url?`<a class="pdf-link" href="${u.outorga_pdf_url}" target="_blank">📄 Abrir PDF</a>`:'<span style="color:#9ca3af;font-weight:400;">Não anexado</span>'}</div>
    </div>
  </div>

  <!-- DETALHAMENTO DA VAZÃO -->
  <div class="sec-titulo">Vazão outorgada (cálculo)</div>
  <div class="vazao-detalhe">
    <div><span class="num">${(u.vazao_m3h||0).toFixed(2)}</span> <span style="font-size:9px;color:#6b7280;">m³/h</span></div>
    <span class="op">×</span>
    <div><span class="num">${u.horas_uso_dia||0}</span> <span style="font-size:9px;color:#6b7280;">h/dia</span></div>
    <span class="op">×</span>
    <div><span class="num">${u.dias_uso_mes||0}</span> <span style="font-size:9px;color:#6b7280;">dias/mês</span></div>
    <span class="igual">=</span>
    <div><span class="resultado">${aut.toFixed(1)}</span> <span style="font-size:10px;color:#6b7280;">m³/mês</span></div>
    <span style="color:#6b7280;">|</span>
    <div><span style="font-size:9px;color:#6b7280;">Anual:</span> <span class="resultado">${autAnual.toFixed(1)}</span> <span style="font-size:9px;color:#6b7280;">m³/ano</span></div>
  </div>

  <!-- OPERACIONAL -->
  <div class="grid2">
    <div class="card-info">
      <div class="card-label">Responsável pela leitura</div>
      <div class="card-val" style="font-size:10.5px;">${respLeituraTxt}</div>
    </div>
    <div class="card-info">
      <div class="card-label">Possui hidrômetro</div>
      <div class="card-val">${u.possui_hidrometro===false?'<span style="color:#E65100;">Não — sem medição</span>':'<span style="color:#15803D;">Sim</span>'+(u.numero_serie?' · '+u.numero_serie:'')}</div>
    </div>
  </div>

  <!-- CONSUMO ANUAL (resumo numérico) -->
  <div class="grid2" style="margin-top:8px;">
    <div class="card-num">
      <div class="val">${totalCap.toFixed(1)}</div>
      <div class="lab">m³ captados em ${ano}</div>
    </div>
    <div class="${pct>100?'card-pct-warn':'card-pct-ok'}">
      <div class="val">${pct}%</div>
      <div class="lab">da outorga anual utilizada</div>
    </div>
  </div>

  ${u.foto_equipamento_url?`<div class="foto-wrap" style="margin-top:8px;">
    <div class="foto-label">Foto do equipamento</div>
    <img class="foto-img" src="${u.foto_equipamento_url}" alt="Foto do hidrômetro"/>
  </div>`:''}

  <div class="graf-wrap">
    <div class="graf-title">Evolução mensal de captação (m³/mês)</div>
    ${svgGraf}
    ${aut>0?`<div style="display:flex;align-items:center;gap:16px;margin-top:6px;font-size:9px;color:#6b7280;flex-wrap:wrap;">
      <span style="display:flex;align-items:center;gap:4px;"><svg width="24" height="6" style="flex-shrink:0"><line x1="0" y1="3" x2="24" y2="3" stroke="#E65100" stroke-width="1.5" stroke-dasharray="4,3"/></svg> Limite outorga: ${aut.toFixed(1)} m³/mês</span>
      <span style="display:flex;align-items:center;gap:4px;"><svg width="10" height="8" style="flex-shrink:0"><rect width="10" height="8" fill="#1976D2" rx="1"/></svg> Dentro do limite</span>
      <span style="display:flex;align-items:center;gap:4px;"><svg width="10" height="8" style="flex-shrink:0"><rect width="10" height="8" fill="#C62828" rx="1"/></svg> Acima do limite</span>
      <span style="display:flex;align-items:center;gap:4px;"><svg width="10" height="8" style="flex-shrink:0"><rect width="10" height="8" fill="#d1d5db" rx="1"/></svg> Sem dado</span>
    </div>`:''}
  </div>

  <table>
    <thead>
      <tr>
        <th>Mês</th>
        <th style="text-align:right;">Leit. ant.</th>
        <th style="text-align:right;">Leit. atual</th>
        <th style="text-align:right;">Captado (m³)</th>
        <th style="text-align:right;">Autorizado (m³)</th>
        <th style="text-align:center;">% utilizado</th>
        <th>Situação</th>
      </tr>
    </thead>
    <tbody>${tRows}</tbody>
  </table>

  <div class="resumo">
    <div class="resumo-title">Resumo de conformidade</div>
    ${resumo}
  </div>

</div>

<!-- ═══ PÁGINA 2 ═══ -->
<div class="pagina">

  <div class="pag2-cab">
    <div>
      <div class="pag2-titulo">Zello Ambiental — Relatório Anual de Vazão ${ano}</div>
      <div class="pag2-sub">${c.nome} · ${u.descricao} · Port. ${u.portaria||p.portaria||'—'}</div>
    </div>
    <div style="font-size:9px;color:#9ca3af;">Gerado em ${new Date().toLocaleDateString('pt-BR')}</div>
  </div>

  <div class="decl-box">
    <div class="decl-title">Declaração de conformidade</div>
    <div class="decl-texto">Declaro que as informações contidas neste relatório são fidedignas aos dados coletados pelo sistema de monitoramento <strong>Zello Ambiental</strong>, referentes ao ano de <strong>${ano}</strong>, para o ponto de captação <strong>${u.descricao}</strong>, empreendimento <strong>${p.nome}</strong>, ${tipoOutorgaTxt.toLowerCase()} <strong>${u.portaria||p.portaria||'—'}</strong>, processo <strong>${u.processo||p.processo||'—'}</strong>${dataEmissaoStr?', emitida em <strong>'+dataEmissaoStr+'</strong>':''}${dataVencStr?' e válida até <strong>'+dataVencStr+'</strong>':''}.</div>
  </div>

  <div class="local-data">
    <div class="campo-linha">
      <div class="campo-label">Local</div>
      <div class="campo-border">${p.cidade||'___________________________'}${p.estado?' - '+p.estado:''}</div>
    </div>
    <div class="campo-linha pequeno">
      <div class="campo-label">Data</div>
      <div class="campo-border">____/____/________</div>
    </div>
  </div>

  <div class="assinaturas">
    <div class="ass-bloco">
      <div class="ass-espaco"></div>
      <div class="ass-linha">
        <div class="ass-nome">${EMPRESA.eng}</div>
        <div class="ass-cargo">${EMPRESA.crea}</div>
        <div class="ass-cargo">Responsável Técnico</div>
      </div>
    </div>
    <div class="ass-bloco">
      <div class="ass-espaco"></div>
      <div class="ass-linha">
        <div class="ass-nome">${c.nome}</div>
        <div class="ass-cargo">${c.cpf_cnpj?((c.cpf_cnpj.replace(/\D/g,'').length>11)?'CNPJ: ':'CPF: ')+c.cpf_cnpj:''}</div>
        <div class="ass-cargo">${(c.cpf_cnpj||'').replace(/\D/g,'').length>11?'Representante Legal / Outorgado':'Titular / Outorgado'}</div>
      </div>
    </div>
  </div>

  <div class="nota-legal">
    <strong>Nota Legal:</strong> Este relatório de vazão atende as Instruções Técnicas do SP Águas e as Portarias DAEE nº 5.578/2018, nº 5.579/2018 e nº 6.987/2018.
  </div>

  <div class="rodape">Documento gerado pelo sistema Zello Ambiental — Gestão Hídrica · ${EMPRESA.eng} · ${EMPRESA.crea} · ${EMPRESA.email}</div>

</div>

<div class="no-print" style="text-align:center;padding:20px;">
  <button class="btn-print" onclick="window.print()">🖨 Imprimir / Salvar PDF</button>
</div>

</body>
</html>`);
    w.document.close();
  }

  async function gerarRelatorioConsolidado() {
    const cid = document.getElementById('rel-cliente').value;
    const ano = document.getElementById('rel-ano').value || new Date().getFullYear();
    if (!cid) { alert('Selecione um cliente para gerar o relatório consolidado.'); return; }
    const c = clientes.find(function(cc){ return cc.id===cid; });
    const usosCliente = usos.filter(function(u){ return u.cliente_id===cid && u.possui_hidrometro; });
    if (!usosCliente.length) { alert('Este cliente não possui pontos com hidrômetro.'); return; }

    const usoIds = usosCliente.map(function(u){return u.id;}).join(',');
    const leitsAno = await api('leituras?uso_id=in.('+usoIds+')&mes_referencia=gte.'+ano+'-01&mes_referencia=lte.'+ano+'-12&select=*') || [];
    const nomeMeses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const totalGeralCap = leitsAno.reduce(function(s,l){return s+(l.consumo_m3||0);},0);

    // ── Construir seções por ponto ──
    const secoes = usosCliente.map(function(u) {
      const p = propriedades.find(function(pp){return pp.id===u.propriedade_id;});
      const aut = getAutorizadoUso(u);
      const dadosMeses = ['01','02','03','04','05','06','07','08','09','10','11','12'].map(function(m){
        const found = leitsAno.filter(function(l){return l.uso_id===u.id&&l.mes_referencia===ano+'-'+m;});
        return found.length?found[0]:null;
      });
      const totalCap = dadosMeses.reduce(function(s,l){return s+(l?l.consumo_m3||0:0);},0);
      const pct = aut>0?Math.round(totalCap/(aut*12)*100):0;
      const mesesAcima = dadosMeses.filter(function(l){return l&&aut>0&&l.consumo_m3>aut;}).length;
      const mesesComDado = dadosMeses.filter(function(l){return l;}).length;
      const sitGeral = mesesAcima>0?'apresentou extrapolação em <strong>'+mesesAcima+' mês(es)</strong>':'manteve-se dentro do volume autorizado';
      const resumoPonto = 'Em '+ano+', captou <strong>'+totalCap.toFixed(1)+' m³</strong> ('+pct+'% do anual autorizado'+(aut>0?' de '+(aut*12).toFixed(1)+' m³':'')+').'+
        ' Registros: <strong>'+mesesComDado+'/12</strong> meses. O ponto '+sitGeral+'.';

      // Gráfico SVG compacto
      const vals = dadosMeses.map(function(l){return l?l.consumo_m3||0:0;});
      const maxVal = Math.max.apply(null,vals.concat([aut||1]));
      const svgW=780; const svgH=100; const barUnit=svgW/12;
      const barW=Math.floor(barUnit*0.65);
      const svgBars = dadosMeses.map(function(l,i){
        const v=l?l.consumo_m3||0:0;
        const h=v>0?Math.max(Math.round(v/maxVal*(svgH-20)),3):0;
        const cor=!l?'#e5e7eb':(aut>0&&v>aut)?'#C62828':'#1976D2';
        const x=i*barUnit+(barUnit-barW)/2;
        return '<g>'
          +'<rect x="'+x.toFixed(1)+'" y="'+(svgH-20-h)+'" width="'+barW+'" height="'+h+'" fill="'+cor+'" rx="2"/>'
          +(v>0?'<text x="'+(x+barW/2).toFixed(1)+'" y="'+(svgH-20-h-3)+'" text-anchor="middle" font-size="7.5" fill="'+cor+'" font-weight="600">'+v.toFixed(0)+'</text>':'')
          +'<text x="'+(x+barW/2).toFixed(1)+'" y="'+(svgH-5)+'" text-anchor="middle" font-size="8" fill="#6b7280">'+nomeMeses[i]+'</text>'
          +'</g>';
      }).join('');
      const yLim=aut>0?svgH-20-Math.round(aut/maxVal*(svgH-20)):-1;
      const limLine=aut>0?'<line x1="0" y1="'+yLim+'" x2="'+svgW+'" y2="'+yLim+'" stroke="#E65100" stroke-width="1" stroke-dasharray="4,3"/><text x="'+svgW+'" y="'+(yLim-2)+'" text-anchor="end" font-size="7.5" fill="#E65100">'+aut.toFixed(0)+' m³</text>':'';
      const svgGraf='<svg width="'+svgW+'" height="'+svgH+'" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">'+svgBars+limLine+'</svg>';

      // Tabela
      const rows = dadosMeses.map(function(l,i){
        const cap=l?l.consumo_m3||0:0;
        const pctM=(l&&aut>0)?Math.round(cap/aut*100):null;
        const acima=l&&aut>0&&cap>aut;
        const bgRow=i%2?'#f9fafb':'#ffffff';
        const stCor=!l?'#9ca3af':acima?'#C62828':'#15803D';
        const pctCor=pctM===null?'#9ca3af':pctM>100?'#C62828':pctM>80?'#E65100':'#15803D';
        return '<tr style="background:'+bgRow+';">'
          +'<td>'+nomeMeses[i]+'/'+ano+'</td>'
          +'<td style="text-align:right;font-family:monospace;">'+(l?l.leitura_anterior||0:'—')+'</td>'
          +'<td style="text-align:right;font-family:monospace;">'+(l?l.leitura_atual:'—')+'</td>'
          +'<td style="text-align:right;font-family:monospace;font-weight:600;">'+(l?cap.toFixed(1):'—')+'</td>'
          +'<td style="text-align:right;">'+(aut>0?aut.toFixed(1):'—')+'</td>'
          +'<td style="text-align:center;font-weight:700;color:'+pctCor+';">'+(pctM!==null?pctM+'%':'—')+'</td>'
          +'<td style="font-weight:600;color:'+stCor+';">'+(!l?'Sem dado':acima?'Acima':'Normal')+'</td>'
          +'</tr>';
      }).join('');

      // Mapa tipos de outorga (mesmo do relatório individual)
      const tiposOutorga = { outorga: 'Outorga', dispensa: 'Dispensa de Outorga', tamponamento: 'Tamponamento e Desistência' };
      const tipoOutorgaTxt = tiposOutorga[u.tipo_outorga] || u.tipo_outorga || 'Outorga';

      // Vencimento da outorga deste ponto
      let vencHtml = '';
      let dataEmStr = '';
      if (u.data_emissao && u.prazo_anos) {
        const dEm = new Date(u.data_emissao);
        dataEmStr = dEm.toLocaleDateString('pt-BR');
        const dVenc = new Date(u.data_emissao);
        dVenc.setFullYear(dVenc.getFullYear() + parseInt(u.prazo_anos,10));
        const dias = Math.round((dVenc - new Date()) / (1000*60*60*24));
        const corV = dias < 0 ? '#C62828' : dias < 90 ? '#E65100' : '#15803D';
        const labelV = dias < 0 ? 'VENCIDA em ' + dVenc.toLocaleDateString('pt-BR') : dias < 90 ? 'Vence em ' + dVenc.toLocaleDateString('pt-BR') + ' (' + dias + 'd)' : 'Válida até ' + dVenc.toLocaleDateString('pt-BR');
        vencHtml = '<span style="color:' + corV + ';font-weight:600;font-size:9.5px;">' + labelV + '</span>';
      }

      const portariaP = u.portaria || (p && p.portaria) || '';
      const processoP = u.processo || (p && p.processo) || '';
      const autAnualP = aut * 12;

      return {html:
        '<div class="ponto-bloco">'
          +'<div class="ponto-header">'
            +'<div style="flex:1;">'
              +'<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">'
                +'<span class="ponto-nome">'+u.descricao+(u.numero_serie?' <span class="ponto-serie">'+u.numero_serie+'</span>':'')+'</span>'
                +'<span class="badge-tipo badge-'+(u.tipo_outorga||'outorga')+'">'+tipoOutorgaTxt+'</span>'
                +(u.outorga_pdf_url?'<a class="pdf-link-mini" href="'+u.outorga_pdf_url+'" target="_blank">📄 PDF</a>':'')
              +'</div>'
              +'<div class="ponto-sub">'+(p?p.nome:'')+(p&&p.cidade?' · '+p.cidade+(p.estado?' - '+p.estado:''):'')+'</div>'
              +'<div class="ponto-meta">'
                +(portariaP?'<span>📋 Port. '+portariaP+'</span>':'')
                +(processoP?'<span>📁 SEI '+processoP+'</span>':'')
                +(u.requerimento?'<span>📑 Req. '+u.requerimento+'</span>':'')
                +(dataEmStr?'<span>📅 Emit. '+dataEmStr+'</span>':'')
                +(u.prazo_anos?'<span>⏱ '+u.prazo_anos+' anos</span>':'')
                +(vencHtml?'<span>'+vencHtml+'</span>':'')
              +'</div>'
              +'<div class="vazao-mini">'
                +'<span class="num">'+(u.vazao_m3h||0).toFixed(2)+'</span> <span class="lab">m³/h</span>'
                +' <span class="op">×</span> '
                +'<span class="num">'+(u.horas_uso_dia||0)+'</span> <span class="lab">h/dia</span>'
                +' <span class="op">×</span> '
                +'<span class="num">'+(u.dias_uso_mes||0)+'</span> <span class="lab">dias/mês</span>'
                +' <span class="igual">=</span> '
                +'<span class="resultado">'+aut.toFixed(1)+'</span> <span class="lab">m³/mês</span>'
                +' <span style="color:#9ca3af;">|</span> '
                +'<span class="lab">Anual:</span> <span class="resultado">'+autAnualP.toFixed(1)+'</span> <span class="lab">m³/ano</span>'
              +'</div>'
            +'</div>'
            +'<div class="ponto-stats">'
              +'<div class="stat-box stat-azul"><div class="stat-val">'+totalCap.toFixed(0)+'</div><div class="stat-lab">m³ no ano</div></div>'
              +'<div class="stat-box '+(pct>100?'stat-vermelho':'stat-verde')+'"><div class="stat-val">'+pct+'%</div><div class="stat-lab">utilizado</div></div>'
            +'</div>'
          +'</div>'
          +'<div class="graf-box">'
            +'<div class="graf-title">Evolução mensal (m³)</div>'
            +svgGraf
          +'</div>'
          +'<table><thead><tr>'
            +'<th>Mês</th><th style="text-align:right">Leit. ant.</th><th style="text-align:right">Leit. atual</th>'
            +'<th style="text-align:right">Captado</th><th style="text-align:right">Autorizado</th>'
            +'<th style="text-align:center">%</th><th>Situação</th>'
          +'</tr></thead><tbody>'+rows+'</tbody></table>'
          +'<div class="resumo-ponto">'+resumoPonto+'</div>'
          +(mesesAcima>0?'<div class="alerta-acima">⚠ '+mesesAcima+' mês(es) com consumo acima do limite autorizado.</div>':'')
        +'</div>'
      };
    }).map(function(s){return s.html;}).join('');

    const nomeArq = c.nome.split(' ')[0]+'_Consolidado_'+ano;
    const w = window.open('','_blank');

    w.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<title>${nomeArq}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:11px;color:#111827;background:#fff;}
  @media print{
    *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}
    .no-print{display:none!important;}
    .ponto-bloco{page-break-inside:avoid;}
    tr{page-break-inside:avoid;}
  }
  .pagina{padding:22px 26px;max-width:880px;margin:0 auto;}
  .cab{background:linear-gradient(135deg,#1565C0,#1976D2,#2196F3);padding:14px 20px;border-radius:8px;color:white;margin-bottom:14px;}
  .cab-titulo{font-size:15px;font-weight:700;}
  .cab-sub{font-size:10px;opacity:.85;margin-top:2px;}
  .cliente-row{display:flex;align-items:center;justify-content:space-between;background:#f0f7ff;border:1px solid #BFDBFE;border-radius:8px;padding:10px 14px;margin-bottom:14px;}
  .cliente-nome{font-size:13px;font-weight:700;color:#1565C0;}
  .cliente-doc{font-size:10px;color:#6b7280;margin-top:2px;}
  .total-geral{text-align:center;}
  .total-geral .val{font-size:22px;font-weight:800;color:#1D4ED8;font-family:monospace;}
  .total-geral .lab{font-size:9px;color:#6b7280;}
  .ponto-bloco{border:1px solid #e5e7eb;border-radius:8px;margin-bottom:12px;overflow:hidden;}
  .ponto-header{display:flex;align-items:center;justify-content:space-between;background:#f8faff;border-bottom:1px solid #e5e7eb;padding:10px 14px;}
  .ponto-nome{font-size:12px;font-weight:700;color:#1565C0;}
  .ponto-serie{font-family:monospace;font-size:10px;color:#6b7280;font-weight:400;}
  .ponto-sub{font-size:10px;color:#6b7280;margin-top:2px;}
  .ponto-meta{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px;font-size:9.5px;color:#6b7280;}
  .ponto-meta span{white-space:nowrap;}
  .badge-tipo{padding:2px 8px;border-radius:10px;font-size:9px;font-weight:700;letter-spacing:.03em;}
  .badge-outorga{background:#DBEAFE;color:#1E40AF;}
  .badge-dispensa{background:#FEF3C7;color:#92400E;}
  .badge-tamponamento{background:#F3E8FF;color:#6B21A8;}
  .pdf-link-mini{background:#FFF3E0;color:#E65100;border:1px solid #FFB74D;padding:1px 6px;border-radius:3px;text-decoration:none;font-size:9px;font-weight:600;}
  .vazao-mini{margin-top:5px;font-size:10px;color:#1E3A8A;background:#F0F9FF;padding:5px 10px;border-radius:4px;display:flex;flex-wrap:wrap;align-items:center;gap:4px;}
  .vazao-mini .num{font-family:monospace;font-weight:700;color:#1565C0;font-size:11px;}
  .vazao-mini .op{color:#9ca3af;font-weight:300;}
  .vazao-mini .igual{color:#1565C0;font-weight:700;}
  .vazao-mini .resultado{font-family:monospace;font-weight:800;color:#1D4ED8;font-size:11px;}
  .vazao-mini .lab{font-size:9px;color:#6b7280;}
  .ponto-stats{display:flex;gap:8px;}
  .stat-box{border-radius:6px;padding:6px 12px;text-align:center;min-width:70px;}
  .stat-azul{background:#EFF6FF;border:1px solid #BFDBFE;}
  .stat-verde{background:#F0FDF4;border:1px solid #BBF7D0;}
  .stat-vermelho{background:#FFEBEE;border:1px solid #FECACA;}
  .stat-val{font-size:16px;font-weight:800;font-family:monospace;}
  .stat-azul .stat-val{color:#1D4ED8;}
  .stat-verde .stat-val{color:#15803D;}
  .stat-vermelho .stat-val{color:#C62828;}
  .stat-lab{font-size:8.5px;color:#6b7280;}
  .graf-box{padding:8px 12px;background:#fafafa;border-bottom:1px solid #f3f4f6;}
  .graf-title{font-size:8px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:5px;letter-spacing:.04em;}
  table{width:100%;border-collapse:collapse;font-size:10px;}
  thead tr{background:#1565C0;}
  thead th{color:white;padding:5px 8px;font-weight:600;font-size:9.5px;border:1px solid #1565C0;}
  tbody td{padding:4px 8px;border:1px solid #f0f0f0;}
  .resumo-ponto{background:#F0F9FF;border-left:3px solid #1565C0;padding:8px 12px;font-size:10.5px;color:#374151;line-height:1.7;}
  .alerta-acima{background:#FFEBEE;padding:6px 12px;font-size:10px;color:#C62828;font-weight:600;}
  .separador{border:none;border-top:2px solid #e5e7eb;margin:14px 0;}

  /* Página assinaturas */
  .pag2-cab{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #1565C0;padding-bottom:10px;margin-bottom:18px;}
  .pag2-titulo{font-size:13px;font-weight:700;color:#1565C0;}
  .pag2-sub{font-size:10px;color:#6b7280;margin-top:2px;}
  .decl-box{background:#F8FAFC;border:1px solid #e5e7eb;border-radius:8px;padding:14px 18px;margin-bottom:20px;}
  .decl-title{font-size:9px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px;}
  .decl-texto{font-size:11px;color:#374151;line-height:2;}
  .local-data{display:flex;gap:16px;margin-bottom:40px;}
  .campo-linha{flex:1;} .campo-linha.pequeno{flex:0 0 160px;}
  .campo-label{font-size:9px;color:#6b7280;margin-bottom:3px;}
  .campo-border{border-bottom:1px solid #374151;padding-bottom:3px;font-size:11px;}
  .assinaturas{display:grid;grid-template-columns:1fr 1fr;gap:50px;margin-top:12px;}
  .ass-bloco{text-align:center;}
  .ass-espaco{height:72px;}
  .ass-linha{border-top:1.5px solid #374151;padding-top:8px;}
  .ass-nome{font-size:11.5px;font-weight:700;}
  .ass-cargo{font-size:10px;color:#6b7280;margin-top:2px;}
  .nota-legal{background:#F8FAFC;border:1px solid #e5e7eb;border-radius:6px;padding:10px 14px;margin-top:20px;font-size:9.5px;color:#374151;line-height:1.7;}
  .rodape{text-align:center;font-size:8.5px;color:#9ca3af;margin-top:10px;border-top:1px solid #f3f4f6;padding-top:8px;}
  .btn-print{display:inline-flex;align-items:center;gap:8px;background:#1565C0;color:white;border:none;border-radius:8px;padding:11px 28px;font-size:13px;font-weight:600;cursor:pointer;margin-top:16px;}
</style>
</head>
<body>

<!-- ═══ PÁGINA 1+ — DADOS ═══ -->
<div class="pagina">
  <div class="cab">
    <div class="cab-titulo">Zello Ambiental — Relatório Consolidado de Vazão ${ano}</div>
    <div class="cab-sub">${EMPRESA.eng} · ${EMPRESA.crea} · ${EMPRESA.tel} · ${EMPRESA.email}</div>
  </div>

  <div class="cliente-row">
    <div>
      <div class="cliente-nome">${c.nome}</div>
      <div class="cliente-doc">${c.cpf_cnpj||''}</div>
    </div>
    <div class="total-geral">
      <div class="val">${totalGeralCap.toFixed(0)}</div>
      <div class="lab">m³ total captado em ${ano}</div>
    </div>
  </div>

  ${secoes}
</div>

<!-- ═══ PÁGINA FINAL — ASSINATURAS ═══ -->
<div class="pagina" style="page-break-before:always;">
  <div class="pag2-cab">
    <div>
      <div class="pag2-titulo">Relatório Consolidado de Vazão ${ano}</div>
      <div class="pag2-sub">${c.nome} · ${usosCliente.length} ponto(s) de captação</div>
    </div>
    <div style="font-size:9px;color:#9ca3af;">Gerado em ${new Date().toLocaleDateString('pt-BR')}</div>
  </div>

  <div class="decl-box">
    <div class="decl-title">Declaração de conformidade</div>
    <div class="decl-texto">Declaro que as informações contidas neste relatório consolidado são fidedignas aos dados coletados pelo sistema de monitoramento <strong>Zello Ambiental</strong>, referentes ao ano de <strong>${ano}</strong>, para os <strong>${usosCliente.length} ponto(s) de captação</strong> do cliente <strong>${c.nome}</strong>, conforme outorgas registradas no sistema.</div>
  </div>

  <div class="local-data">
    <div class="campo-linha">
      <div class="campo-label">Local</div>
      <div class="campo-border">_________________________________</div>
    </div>
    <div class="campo-linha pequeno">
      <div class="campo-label">Data</div>
      <div class="campo-border">____/____/________</div>
    </div>
  </div>

  <div class="assinaturas">
    <div class="ass-bloco">
      <div class="ass-espaco"></div>
      <div class="ass-linha">
        <div class="ass-nome">${EMPRESA.eng}</div>
        <div class="ass-cargo">${EMPRESA.crea}</div>
        <div class="ass-cargo">Responsável Técnico</div>
      </div>
    </div>
    <div class="ass-bloco">
      <div class="ass-espaco"></div>
      <div class="ass-linha">
        <div class="ass-nome">${c.nome}</div>
        <div class="ass-cargo">${c.cpf_cnpj?((c.cpf_cnpj.replace(/\D/g,'').length>11)?'CNPJ: ':'CPF: ')+c.cpf_cnpj:''}</div>
        <div class="ass-cargo">${(c.cpf_cnpj||'').replace(/\D/g,'').length>11?'Representante Legal / Outorgado':'Titular / Outorgado'}</div>
      </div>
    </div>
  </div>

  <div class="nota-legal">
    <strong>Nota Legal:</strong> Este relatório de vazão atende as Instruções Técnicas do SP Águas e as Portarias DAEE nº 5.578/2018, nº 5.579/2018 e nº 6.987/2018.
  </div>
  <div class="rodape">Documento gerado pelo sistema Zello Ambiental · ${EMPRESA.eng} · ${EMPRESA.crea} · ${EMPRESA.email}</div>
</div>

<div class="no-print" style="text-align:center;padding:20px;">
  <button class="btn-print" onclick="window.print()">🖨 Imprimir / Salvar PDF</button>
</div>

</body>
</html>`);
    w.document.close();
  }

  // =============================================
  // ALERTAS
  // =============================================
  function renderAlertasVenc() {
    const el = document.getElementById('alertas-venc');
    if (!el) return;
    const lista = propriedades.filter(function(p){const d=getDiasVenc(p); return d!==null && d/30<=6;});
    if (!lista.length) { el.innerHTML='<p style="font-size:12px;color:var(--text-muted)">Nenhuma outorga com vencimento próximo.</p>'; return; }
    el.innerHTML = lista.map(function(p){
      const c=clientes.find(function(cc){return cc.id===p.cliente_id;});
      const d=getDiasVenc(p); const cor=getCorVenc(d,false);
      // Encontra o uso âncora (vencendo primeiro) para puxar data_emissao + prazo
      const ussDaProp = usos.filter(function(u){return u.propriedade_id===p.id;});
      let usoAnc = null, dMin = null;
      ussDaProp.forEach(function(u){
        const dd = getDiasVencUso(u, p);
        if (dd === null) return;
        if (dMin === null || dd < dMin) { dMin = dd; usoAnc = u; }
      });
      const dataEmBase = (usoAnc && usoAnc.data_emissao) || p.data_emissao;
      const prazoBase = (usoAnc && usoAnc.prazo_anos) || p.prazo_anos;
      const venc = new Date(dataEmBase);
      venc.setFullYear(venc.getFullYear() + parseInt(prazoBase,10));
      const portariaBase = (usoAnc && usoAnc.portaria) || p.portaria || '';
      return '<div class="alert-row"><div class="alert-dot ad-warn">⚠</div><div style="flex:1"><div style="font-size:12px;">'+escapeHtml(c?c.nome:'')+' — '+escapeHtml(p.nome)+'</div><div style="font-size:10px;color:var(--text-hint)">'+escapeHtml(portariaBase)+' · Vence '+venc.toLocaleDateString('pt-BR')+'</div></div><button class="btn btn-sm btn-amber" onclick="toggleRenovProp(\''+p.id+'\',true)">Em renovação</button></div>';
    }).join('');
  }

  function renderAlertas7dias() {
    const el = document.getElementById('alertas-7dias');
    if (!el) return;
    const hoje=new Date(); const dia1=new Date(hoje.getFullYear(),hoje.getMonth(),1);
    const dias=Math.round((hoje-dia1)/(1000*60*60*24));
    if (dias<7) { el.innerHTML='<p style="font-size:12px;color:var(--text-muted)">Menos de 7 dias desde o início do mês.</p>'; return; }
    // FIX BUG: só pega usos de clientes ATIVOS (não leads, não em projeto)
    const idsAtivos7d = new Set(clientes.filter(function(cc){return cc.ativo!==false;}).map(function(cc){return cc.id;}));
    const idsProps7d = new Set((propriedades||[]).filter(function(pp){return idsAtivos7d.has(pp.cliente_id);}).map(function(pp){return pp.id;}));
    const usosComH=usos.filter(function(u){
      // SEMANA 4.7: também alerta pontos com relatório de vazão
      return requerLeitura(u) && idsProps7d.has(u.propriedade_id);
    });
    const usosComL=new Set(leituras.map(function(l){return l.uso_id;}));
    const pend=usosComH.filter(function(u){return !usosComL.has(u.id);});
    if (!pend.length) { el.innerHTML='<p style="font-size:12px;color:var(--text-muted)">Todos enviaram! 🎉</p>'; return; }
    el.innerHTML = pend.map(function(u){
      const c=clientes.find(function(cc){return cc.id===u.cliente_id;});
      const p=propriedades.find(function(pp){return pp.id===u.propriedade_id;});
      if (!c) return '';
      const fone=(c.telefone1||'').replace(/\D/g,'');
      const _req = u.requerimento ? '\n📋 Requerimento: ' + u.requerimento : '';
      const _ser = u.numero_serie ? '\n🔢 Hidrômetro: ' + u.numero_serie : '';
      const msg=encodeURIComponent(
        'Olá, ' + c.nome.split(' ')[0] + '!\n\n' +
        '*Zello Ambiental — Gestão da Água*\n' +
        'Atenção: sua leitura mensal ainda não foi registrada.\n\n' +
        '*Propriedade:* ' + (p?p.nome:'') + '\n' +
        '*Ponto:* ' + (u.descricao||'') + _req + _ser + '\n\n' +
        'Acesse o link para registrar:\n' + getClienteUrl() + '?token=' + u.token + '\n\n' +
        'Em caso de dúvidas: ' + EMPRESA.eng + ' · ' + EMPRESA.tel
      );
      return '<div class="alert-row"><div class="alert-dot ad-danger">!</div><div style="flex:1"><div style="font-size:12px;">'+escapeHtml(c.nome)+' — '+escapeHtml(p?p.nome:'')+' — '+escapeHtml(u.descricao||'')+'</div><div style="font-size:10px;color:var(--text-hint)">'+escapeHtml(c.telefone1||'')+'</div></div><a href="https://wa.me/55'+fone+'?text='+msg+'" target="_blank" class="btn btn-sm btn-green">WhatsApp</a></div>';
    }).join('');
  }




  // =============================================
  // LIMPAR TODOS OS CLIENTES (TEMPORÁRIO — REMOVER APÓS TESTES)
  // =============================================
  async function limparTodosClientes() {
    if (!(await zConfirm('⚠️ ATENÇÃO! Isso vai apagar TODOS os clientes, propriedades, pontos e leituras. Confirma?', { tipo:'erro', btnOk:'Continuar' }))) return;
    if (!(await zConfirm('Tem certeza absoluta? Esta ação NÃO pode ser desfeita!', { tipo:'erro', btnOk:'Sim, apagar tudo' }))) return;
    const tabelas = ['leituras','contatos','notificacoes','usos','propriedades','clientes'];
    let erros = 0;
    for (let i = 0; i < tabelas.length; i++) {
      const t = tabelas[i];
      try {
        const r = await api(t + '?id=neq.00000000-0000-0000-0000-000000000000', 'DELETE', null, 'return=minimal');
        if (!r || !r.ok) erros++;
      } catch(e) { erros++; }
    }
    if (erros === 0) {
      await carregarDados();
      alert('✅ Todos os dados foram removidos.');
    } else {
      alert('⚠️ Alguns dados podem não ter sido removidos. Execute o SQL no Supabase:\n\nTRUNCATE TABLE leituras, contatos, notificacoes, usos, propriedades, clientes CASCADE;');
    }
  }

  // =============================================
  // IMPORTAR COMPLETO VIA EXCEL (Clientes + Propriedades + Pontos)
  // =============================================
  let dadosImport = { clientes: [], propriedades: [], pontos: [] };

  function abrirImportarExcel() {
    dadosImport = { clientes: [], propriedades: [], pontos: [] };
    document.getElementById('import-file').value = '';
    document.getElementById('import-preview').innerHTML = '';
    document.getElementById('btn-confirmar-import').style.display = 'none';
    abrirModal('ov-importar');
  }

  function baixarModeloImport() {
    // Download direto do arquivo hospedado no Supabase (com todas as validações)
    const url = 'https://evxolmfwblxtmudksmnt.supabase.co/storage/v1/object/public/documentos-zello/modelo_importacao_zello_completo%20(1).xlsx';
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo_importacao_zello_completo.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
    if (typeof XLSX === 'undefined') { alert('Aguarde a biblioteca carregar e tente novamente.'); return; }
    const wb = XLSX.utils.book_new();

    // Aba 1 — Clientes
    const wsC = XLSX.utils.aoa_to_sheet([
      ['Nome completo *', 'CPF / CNPJ *', 'Telefone *', 'E-mail', 'Nome do representante', 'Papel do representante', 'Tel. do representante'],
      ['GUILHERME MONTANARI OLIVEIRA', '085.727.916-55', '(16) 98142-7633', 'guilherme@email.com', 'LAIS NEGRÃO', 'conjuge', '(16) 99798-3978'],
      ['FAZENDA ALTO PIRA LTDA', '12.345.678/0001-90', '(16) 93333-0000', '', '', '', '']
    ]);
    wsC['!cols'] = [{wch:35},{wch:22},{wch:18},{wch:30},{wch:30},{wch:22},{wch:18}];
    XLSX.utils.book_append_sheet(wb, wsC, '1_Clientes');

    // Aba 2 — Propriedades
    const wsP = XLSX.utils.aoa_to_sheet([
      ['CPF/CNPJ do cliente *', 'Nome do empreendimento *', 'Cidade *', 'Estado (UF) *', 'Portaria / Licença', 'Processo (SEI)', 'Data de emissão (DD/MM/AAAA)', 'Prazo (anos)', 'Tipo de outorga'],
      ['085.727.916-55', 'FAZENDA BELA VISTA', 'RIBEIRÃO PRETO', 'SP', '2690/2021', '9308460', '02/02/2021', 5, 'Outorga'],
      ['12.345.678/0001-90', 'SITIO SÃO PEDRO', 'SERTÃOZINHO', 'SP', '', '', '', '', 'Dispensa de Outorga']
    ]);
    wsP['!cols'] = [{wch:22},{wch:35},{wch:22},{wch:10},{wch:18},{wch:20},{wch:22},{wch:12},{wch:22}];
    XLSX.utils.book_append_sheet(wb, wsP, '2_Propriedades');

    // Aba 3 — Pontos
    const wsU = XLSX.utils.aoa_to_sheet([
      ['CPF/CNPJ do cliente *', 'Nome do empreendimento *', 'Descrição do ponto *', 'Tipo de outorga *', 'Requerimento', 'Vazão (m³/h)', 'Horas/dia', 'Dias/mês', 'Possui hidrômetro? (S/N)', 'Número de série', 'Responsável pela leitura (telefone)'],
      ['085.727.916-55', 'FAZENDA BELA VISTA', 'POÇO 1', 'Outorga', '20220000294-3BF', 10, 24, 31, 'S', 'D150H024739Z', '(16) 98142-7633'],
      ['12.345.678/0001-90', 'SITIO SÃO PEDRO', 'CAPTAÇÃO RIO', 'Dispensa de Outorga', '', 2, 8, 15, 'N', '', '']
    ]);
    wsU['!cols'] = [{wch:22},{wch:35},{wch:25},{wch:22},{wch:22},{wch:12},{wch:10},{wch:10},{wch:18},{wch:20},{wch:22}];
    XLSX.utils.book_append_sheet(wb, wsU, '3_Pontos');

    // Aba 4 — Papéis válidos
    const wsRef = XLSX.utils.aoa_to_sheet([
      ['Código (usar na coluna F)', 'Descrição'],
      ['conjuge', 'Cônjuge'], ['pai_mae', 'Pai / Mãe'], ['filho_filha', 'Filho / Filha'],
      ['irmao_irma', 'Irmão / Irmã'], ['gerente', 'Gerente / Responsável'],
      ['advogado', 'Advogado'], ['contador', 'Contador'], ['intermediador', 'Intermediador'], ['outro', 'Outro']
    ]);
    wsRef['!cols'] = [{wch:28},{wch:35}];
    XLSX.utils.book_append_sheet(wb, wsRef, 'Papéis válidos');

    XLSX.writeFile(wb, 'modelo_importacao_zello_completo.xlsx');
  }

  function previewImport(input) {
    if (!input.files || !input.files[0]) return;
    if (typeof XLSX === 'undefined') { alert('Aguarde a biblioteca carregar.'); return; }
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        dadosImport = { clientes: [], propriedades: [], pontos: [] };

        function lerAba(nome, fallback) {
          return wb.Sheets[nome] || wb.Sheets[fallback] || null;
        }

        // Ler Clientes
        const wsC = lerAba('1_Clientes', wb.SheetNames[0]);
        if (wsC) {
          const rows = XLSX.utils.sheet_to_json(wsC, { header:1, defval:'', range:2 });
          dadosImport.clientes = rows.filter(function(r){ return String(r[0]||'').trim() && String(r[1]||'').trim(); }).map(function(r){
            return { nome:String(r[0]||'').trim().toUpperCase(), cpf_cnpj:String(r[1]||'').trim(), telefone1:String(r[2]||'').trim()||null, email:String(r[3]||'').trim()||null, rep_nome:String(r[4]||'').trim().toUpperCase()||null, rep_papel:String(r[5]||'').trim()||'outro', rep_tel:String(r[6]||'').trim()||null };
          });
        }

        // Ler Propriedades
        const wsP = lerAba('2_Propriedades', wb.SheetNames[1]);
        if (wsP) {
          const rows = XLSX.utils.sheet_to_json(wsP, { header:1, defval:'', range:2 });
          dadosImport.propriedades = rows.filter(function(r){ return String(r[0]||'').trim() && String(r[1]||'').trim(); }).map(function(r){
            const ds = String(r[6]||'').trim();
            let dataISO = null;
            if (ds && ds.includes('/')) { const p=ds.split('/'); if(p.length===3) dataISO=p[2]+'-'+p[1].padStart(2,'0')+'-'+p[0].padStart(2,'0'); }
            return { cpf_cnpj:String(r[0]||'').trim(), nome:String(r[1]||'').trim().toUpperCase(), cidade:String(r[2]||'').trim().toUpperCase()||null, estado:String(r[3]||'SP').trim().toUpperCase(), portaria:String(r[4]||'').trim()||null, processo:String(r[5]||'').trim()||null, data_emissao:dataISO, prazo_anos:parseInt(r[7])||null };
          });
        }

        // Ler Pontos
        const wsU = lerAba('3_Pontos', wb.SheetNames[2]);
        if (wsU) {
          const rows = XLSX.utils.sheet_to_json(wsU, { header:1, defval:'', range:2 });
          dadosImport.pontos = rows.filter(function(r){ return String(r[0]||'').trim() && String(r[1]||'').trim() && String(r[2]||'').trim(); }).map(function(r){
            const temH = String(r[8]||'S').trim().toUpperCase() !== 'N';
            return { cpf_cnpj:String(r[0]||'').trim(), prop_nome:String(r[1]||'').trim().toUpperCase(), descricao:String(r[2]||'').trim().toUpperCase(), tipo_outorga:String(r[3]||'outorga').trim().toLowerCase().replace('dispensa de outorga','dispensa').replace('tamponamento e desistência','tamponamento')||'outorga', requerimento:String(r[4]||'').trim().toUpperCase()||null, vazao_m3h:parseFloat(r[5])||null, horas_uso_dia:Math.min(parseFloat(r[6])||0,24)||null, dias_uso_mes:Math.min(parseInt(r[7])||0,31)||null, possui_hidrometro:temH, numero_serie:temH?(String(r[9]||'').trim().toUpperCase()||null):null, responsavel_tel:String(r[10]||'').trim()||null };
          });
        }

        const nC=dadosImport.clientes.length, nP=dadosImport.propriedades.length, nU=dadosImport.pontos.length;
        if (!nC && !nP && !nU) { document.getElementById('import-preview').innerHTML='<p style="color:#C62828;font-size:12px;">Nenhum dado válido encontrado. Use o modelo correto.</p>'; return; }

        let html = '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;">'
          +'<div style="background:#E3F2FD;border-radius:8px;padding:10px;text-align:center;"><div style="font-size:20px;font-weight:700;color:#1565C0;">'+nC+'</div><div style="font-size:11px;color:#6b7280;">Clientes</div></div>'
          +'<div style="background:#E8F5E9;border-radius:8px;padding:10px;text-align:center;"><div style="font-size:20px;font-weight:700;color:#2E7D32;">'+nP+'</div><div style="font-size:11px;color:#6b7280;">Propriedades</div></div>'
          +'<div style="background:#FFF3E0;border-radius:8px;padding:10px;text-align:center;"><div style="font-size:20px;font-weight:700;color:#E65100;">'+nU+'</div><div style="font-size:11px;color:#6b7280;">Pontos</div></div>'
          +'</div>';
        if (nC) { html+='<div style="font-size:11px;font-weight:600;color:var(--blue);margin-bottom:4px;">CLIENTES</div><div style="border:1px solid var(--border);border-radius:6px;margin-bottom:10px;">'+dadosImport.clientes.map(function(d,i){return '<div style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:11px;'+(i%2?'background:#f9fafb':'')+'"><strong>'+d.nome+'</strong> · '+d.cpf_cnpj+(d.rep_nome?'<br/><span style="color:var(--text-muted);">👤 '+d.rep_nome+' ('+d.rep_papel+')</span>':'')+'</div>';}).join('')+'</div>'; }
        if (nP) { html+='<div style="font-size:11px;font-weight:600;color:#2E7D32;margin-bottom:4px;">PROPRIEDADES</div><div style="border:1px solid var(--border);border-radius:6px;margin-bottom:10px;">'+dadosImport.propriedades.map(function(d,i){return '<div style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:11px;'+(i%2?'background:#f9fafb':'')+'"><strong>'+d.nome+'</strong> · '+(d.cidade||'')+' - '+d.estado+(d.portaria?'<br/><span style="color:var(--text-muted);">Port. '+d.portaria+(d.processo?' · SEI: '+d.processo:'')+'</span>':'')+'</div>';}).join('')+'</div>'; }
        if (nU) { html+='<div style="font-size:11px;font-weight:600;color:#E65100;margin-bottom:4px;">PONTOS</div><div style="border:1px solid var(--border);border-radius:6px;">'+dadosImport.pontos.map(function(d,i){return '<div style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:11px;'+(i%2?'background:#f9fafb':'')+'"><strong>'+d.descricao+'</strong> · '+d.prop_nome+(d.numero_serie?'<br/><span style="color:var(--text-muted);">Hidrômetro: '+d.numero_serie+'</span>':'')+'</div>';}).join('')+'</div>'; }

        document.getElementById('import-preview').innerHTML = html;
        const btn = document.getElementById('btn-confirmar-import');
        btn.style.display = 'inline-flex';
        btn.textContent = '✓ Importar ' + nC + ' clientes, ' + nP + ' props, ' + nU + ' pontos';
      } catch(ex) {
        document.getElementById('import-preview').innerHTML = '<p style="color:#C62828;font-size:12px;">Erro ao ler: ' + ex.message + '</p>';
      }
    };
    reader.readAsArrayBuffer(input.files[0]);
  }

  async function confirmarImport() {
    const btn = document.getElementById('btn-confirmar-import');
    btn.disabled = true;
    let okC=0, okP=0, okU=0, erros=0;
    const mapCpf = {};    // cpf → cliente_id
    const mapProp = {};   // cpf||propNome → propriedade_id
    const detalhesErros = []; // detalhes de cada erro pra mostrar ao usuário

    // Helper interno: captura mensagem real do erro do Supabase
    async function lerErro(r, contexto) {
      try {
        const txt = await r.text();
        let msg = txt;
        try { const j = JSON.parse(txt); msg = j.message || j.error || j.hint || txt; } catch(_) {}
        return contexto + ': ' + (msg || ('HTTP ' + r.status));
      } catch(_) {
        return contexto + ': HTTP ' + (r ? r.status : '?');
      }
    }

    // 1. Clientes
    document.getElementById('import-preview').innerHTML = '<div style="font-size:12px;padding:8px;">⏳ Importando clientes...</div>';
    for (let i=0; i<dadosImport.clientes.length; i++) {
      const d = dadosImport.clientes[i];
      try {
        const r = await api('clientes','POST',{nome:d.nome,cpf_cnpj:d.cpf_cnpj,telefone1:d.telefone1,email:d.email,ativo:true,status_funil:'cliente_ativo',pin_hash:'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',portal_ativo:true},'return=representation');
        if (r&&r.ok) {
          const cd=await r.json(); const cid=cd[0]&&cd[0].id;
          if (cid) { mapCpf[d.cpf_cnpj]=cid; okC++;
            if (d.rep_nome) await api('contatos','POST',{cliente_id:cid,nome:d.rep_nome,papel:d.rep_papel,telefone:d.rep_tel,principal:true},'return=minimal');
          } else { erros++; detalhesErros.push('Cliente "'+d.nome+'": resposta sem ID'); }
        } else {
          erros++;
          detalhesErros.push(await lerErro(r, 'Cliente "'+d.nome+'" (CPF '+d.cpf_cnpj+')'));
        }
      } catch(e){
        erros++;
        detalhesErros.push('Cliente "'+d.nome+'": '+(e&&e.message||e));
      }
    }

    // 2. Propriedades
    document.getElementById('import-preview').innerHTML = '<div style="font-size:12px;padding:8px;">⏳ Importando propriedades...</div>';
    for (let i=0; i<dadosImport.propriedades.length; i++) {
      const d = dadosImport.propriedades[i];
      const cid = mapCpf[d.cpf_cnpj];
      if (!cid) {
        erros++;
        detalhesErros.push('Propriedade "'+d.nome+'": cliente CPF '+d.cpf_cnpj+' não encontrado (verifique se o CPF na aba Clientes é idêntico)');
        continue;
      }
      try {
        const r = await api('propriedades','POST',{cliente_id:cid,nome:d.nome,cidade:d.cidade,estado:d.estado,portaria:d.portaria,processo:d.processo,data_emissao:d.data_emissao,prazo_anos:d.prazo_anos,ativo:true},'return=representation');
        if (r&&r.ok) {
          const pd=await r.json(); const pid=pd[0]&&pd[0].id;
          if (pid) { mapProp[d.cpf_cnpj+'||'+d.nome]=pid; okP++; }
          else { erros++; detalhesErros.push('Propriedade "'+d.nome+'": resposta sem ID'); }
        } else {
          erros++;
          detalhesErros.push(await lerErro(r, 'Propriedade "'+d.nome+'"'));
        }
      } catch(e){
        erros++;
        detalhesErros.push('Propriedade "'+d.nome+'": '+(e&&e.message||e));
      }
    }

    // 3. Pontos
    document.getElementById('import-preview').innerHTML = '<div style="font-size:12px;padding:8px;">⏳ Importando pontos de captação...</div>';
    for (let i=0; i<dadosImport.pontos.length; i++) {
      const d = dadosImport.pontos[i];
      const cid = mapCpf[d.cpf_cnpj];
      const pid = mapProp[d.cpf_cnpj+'||'+d.prop_nome];
      if (!cid||!pid) {
        erros++;
        detalhesErros.push('Ponto "'+d.descricao+'": cliente ou propriedade não encontrados (CPF '+d.cpf_cnpj+', prop "'+d.prop_nome+'")');
        continue;
      }
      try {
        // Token UUID v4 — usa crypto.randomUUID quando disponível (mais seguro)
        const token = (typeof crypto!=='undefined'&&crypto.randomUUID) ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){const r=Math.random()*16|0;return(c=='x'?r:(r&0x3|0x8)).toString(16);});
        const r = await api('usos','POST',{propriedade_id:pid,cliente_id:cid,descricao:d.descricao,tipo_outorga:d.tipo_outorga,requerimento:d.requerimento,vazao_m3h:d.vazao_m3h,horas_uso_dia:d.horas_uso_dia,dias_uso_mes:d.dias_uso_mes,possui_hidrometro:d.possui_hidrometro,numero_serie:d.numero_serie,responsavel_tel:d.responsavel_tel,token:token,ativo:true},'return=minimal');
        if (r&&r.ok) okU++;
        else {
          erros++;
          detalhesErros.push(await lerErro(r, 'Ponto "'+d.descricao+'"'));
        }
      } catch(e){
        erros++;
        detalhesErros.push('Ponto "'+d.descricao+'": '+(e&&e.message||e));
      }
    }

    btn.disabled=false; btn.textContent='✓ Importar tudo';
    fecharModal('ov-importar');
    await carregarDados();

    // Monta mensagem final com detalhes dos erros (se houver)
    let msg = 'Importação concluída!\n\n✅ Clientes: '+okC+'\n✅ Propriedades: '+okP+'\n✅ Pontos: '+okU;
    if (erros>0) {
      msg += '\n\n❌ '+erros+' erro(s):\n\n';
      // Mostra até 10 erros pra não estourar o alert
      const mostrar = detalhesErros.slice(0, 10);
      msg += mostrar.map(function(e,i){return (i+1)+'. '+e;}).join('\n\n');
      if (detalhesErros.length > 10) msg += '\n\n...e mais '+(detalhesErros.length-10)+' erro(s). Veja o Console (F12) para a lista completa.';
      console.error('Erros completos da importação:', detalhesErros);
    }
    alert(msg);
  }


  // =============================================
  // EXCEL
  // =============================================
  function exportarExcel() {
    if (typeof XLSX === 'undefined') { alert('Aguarde a biblioteca carregar.'); return; }
    const wb = XLSX.utils.book_new();

    // ── Aba Clientes ──
    const wsC = XLSX.utils.json_to_sheet(clientes.map(function(c){
      return {
        Nome: c.nome,
        'CPF/CNPJ': c.cpf_cnpj || '',
        Telefone: c.telefone1 || '',
        Email: c.email || '',
        Ativo: c.ativo === false ? 'Não' : 'Sim'
      };
    }));
    XLSX.utils.book_append_sheet(wb, wsC, 'Clientes');

    // ── Aba Propriedades ──
    const wsP = XLSX.utils.json_to_sheet(propriedades.map(function(p){
      const c = clientes.find(function(cc){return cc.id===p.cliente_id;});
      return {
        Cliente: c ? c.nome : '',
        Empreendimento: p.nome,
        Cidade: p.cidade || '',
        Estado: p.estado || ''
      };
    }));
    XLSX.utils.book_append_sheet(wb, wsP, 'Propriedades');

    // ── Aba Pontos de Captação (com TODOS os campos da etapa 3) ──
    const tipos = { outorga: 'Outorga', dispensa: 'Dispensa', tamponamento: 'Tamponamento' };
    const wsU = XLSX.utils.json_to_sheet(usos.map(function(u){
      const c = clientes.find(function(cc){return cc.id===u.cliente_id;});
      const p = propriedades.find(function(pp){return pp.id===u.propriedade_id;});
      const aut = getAutorizadoUso(u);
      // Calcula vencimento se houver data + prazo
      let vencStr = '';
      if (u.data_emissao && u.prazo_anos) {
        const dV = new Date(u.data_emissao);
        dV.setFullYear(dV.getFullYear() + parseInt(u.prazo_anos,10));
        vencStr = dV.toLocaleDateString('pt-BR');
      }
      const dataEmStr = u.data_emissao ? new Date(u.data_emissao).toLocaleDateString('pt-BR') : '';
      return {
        Cliente: c ? c.nome : '',
        Empreendimento: p ? p.nome : '',
        Ponto: u.descricao,
        Tipo: tipos[u.tipo_outorga] || u.tipo_outorga || '',
        Requerimento: u.requerimento || '',
        Portaria: u.portaria || '',
        Processo: u.processo || '',
        'Data Emissão': dataEmStr,
        'Validade (anos)': u.prazo_anos || '',
        Vencimento: vencStr,
        'Possui Hidrômetro': u.possui_hidrometro ? 'Sim' : 'Não',
        'Número Série': u.numero_serie || '',
        'Vazão m³/h': u.vazao_m3h || '',
        'Horas/Dia': u.horas_uso_dia || '',
        'Dias/Mês': u.dias_uso_mes || '',
        'Autorizado m³/mês': aut > 0 ? aut.toFixed(1) : '',
        'Autorizado m³/ano': aut > 0 ? (aut * 12).toFixed(1) : '',
        'Responsável Tel': u.responsavel_tel || '',
        'PDF Outorga': u.outorga_pdf_url || ''
      };
    }));
    XLSX.utils.book_append_sheet(wb, wsU, 'Pontos de Captacao');

    // ── Aba Contatos ──
    if (contatos && contatos.length) {
      const papeis = { responsavel_legal: 'Responsável Legal', tecnico: 'Técnico', encarregado: 'Encarregado', gerente: 'Gerente', proprietario: 'Proprietário', outro: 'Outro' };
      const wsCt = XLSX.utils.json_to_sheet(contatos.map(function(ct){
        const c = clientes.find(function(cc){return cc.id===ct.cliente_id;});
        return {
          Cliente: c ? c.nome : '',
          Nome: ct.nome,
          'CPF': ct.cpf_cnpj || '',
          Telefone: ct.telefone || '',
          Email: ct.email || '',
          Papel: papeis[ct.papel] || ct.papel || '',
          Principal: ct.principal ? 'Sim' : 'Não'
        };
      }));
      XLSX.utils.book_append_sheet(wb, wsCt, 'Contatos');
    }

    // ── Aba Leituras ──
    if (leituras && leituras.length) {
      const wsL = XLSX.utils.json_to_sheet(leituras.map(function(l){
        const u = usos.find(function(uu){return uu.id===l.uso_id;});
        const c = clientes.find(function(cc){return cc.id===l.cliente_id;});
        const p = u ? propriedades.find(function(pp){return pp.id===u.propriedade_id;}) : null;
        const aut = u ? getAutorizadoUso(u) : 0;
        const acima = aut > 0 && (l.consumo_m3||0) > aut;
        return {
          Cliente: c ? c.nome : '',
          Empreendimento: p ? p.nome : '',
          Ponto: u ? u.descricao : '',
          'Mês Referência': l.mes_referencia || '',
          'Leitura Anterior': l.leitura_anterior || 0,
          'Leitura Atual': l.leitura_atual || 0,
          'Consumo m³': l.consumo_m3 || 0,
          'Autorizado m³': aut > 0 ? aut.toFixed(1) : '',
          'Situação': aut > 0 ? (acima ? 'ACIMA' : 'Normal') : 'Sem limite',
          Observação: l.observacao || '',
          'Enviado em': l.enviado_em ? new Date(l.enviado_em).toLocaleString('pt-BR') : ''
        };
      }));
      XLSX.utils.book_append_sheet(wb, wsL, 'Leituras');
    }

    XLSX.writeFile(wb, 'Zello_Ambiental_' + getDataHojeBR() + '.xlsx');
  }

  // =============================================
  // GRÁFICO
  // =============================================
  async function iniciarGrafico() {
    const ctx = document.getElementById('chartLine');
    if (!ctx) return;

    // Últimos 12 meses
    const n = new Date();
    const mesesRef = [], labels = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(n.getFullYear(), n.getMonth() - i, 1);
      const aaaa = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      mesesRef.push(aaaa + '-' + mm);
      labels.push(d.toLocaleDateString('pt-BR', {month: 'short', year: '2-digit'}));
    }

    // Total captado por mês (soma de todos os clientes)
    const dados = [];
    let totalGeral = 0, mesesComDado = 0;
    try {
      const mesInicio = mesesRef[0];
      const mesFim = mesesRef[mesesRef.length - 1];
      const todasLeits = await api('leituras?mes_referencia=gte.' + mesInicio + '&mes_referencia=lte.' + mesFim + '&select=mes_referencia,consumo_m3') || [];
      mesesRef.forEach(function(mes) {
        const leitsDoMes = todasLeits.filter(function(l) { return l.mes_referencia === mes; });
        if (leitsDoMes.length) {
          const total = leitsDoMes.reduce(function(s, l) { return s + (l.consumo_m3 || 0); }, 0);
          dados.push(parseFloat(total.toFixed(1)));
          totalGeral += total;
          mesesComDado++;
        } else {
          dados.push(null);
        }
      });
    } catch(e) { mesesRef.forEach(function() { dados.push(null); }); }

    // Mostrar total no rodapé
    const infoEl = document.getElementById('dash-chart-info');
    if (infoEl) {
      if (mesesComDado === 0) {
        infoEl.innerHTML = 'Sem dados nos últimos 12 meses.';
      } else {
        const media = totalGeral / mesesComDado;
        infoEl.innerHTML = '<strong>' + totalGeral.toFixed(1) + ' m³</strong> captados nos últimos ' + mesesComDado + ' meses · '
          + 'Média mensal: <strong>' + media.toFixed(1) + ' m³</strong>';
      }
    }

    if (window._chart) { window._chart.destroy(); window._chart = null; }

    if (typeof Chart === 'undefined') return;  // gracefully skip se Chart não carregou

    window._chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Volume captado (m³)',
          data: dados,
          borderColor: '#1565C0',
          backgroundColor: 'rgba(21,101,192,0.10)',
          borderWidth: 2.5,
          pointBackgroundColor: '#1565C0',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.35,
          spanGaps: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(ctx) { return ctx.parsed.y !== null ? ctx.parsed.y.toFixed(1) + ' m³' : 'Sem dado'; }
            }
          }
        },
        scales: {
          y: { beginAtZero: true, min: 0, ticks: { callback: function(v) { return v + ' m³'; }, font: { size: 10 } }, grid: { color: 'rgba(0,0,0,0.04)' } },
          x: { grid: { display: false }, ticks: { font: { size: 10 } } }
        }
      }
    });
  }


  // =============================================================================
  // SEMANA 2: SISTEMA DE NOTIFICAÇÕES (SINO)
  // =============================================================================
  // Mostra um dropdown com pendências relevantes pro papel do usuário.
  // Conteúdo do dropdown depende do papel: admin / hunter / projetos.
  // Atualiza automaticamente a cada 60 segundos.
  // =============================================================================

  let _sinoDropdownAberto = false;
  let _sinoIntervalId = null;
  const SINO_INTERVAL_MS = 60 * 1000;   // 1 minuto

  function inicializarSino() {
    // Esconde sino se não estiver logado
    const wrapper = document.getElementById('sino-wrapper');
    if (!wrapper) return;
    wrapper.style.display = '';
    // Atualiza inicialmente + a cada 60s
    atualizarSinoNotif();
    if (_sinoIntervalId) clearInterval(_sinoIntervalId);
    _sinoIntervalId = setInterval(atualizarSinoNotif, SINO_INTERVAL_MS);
    // Fecha dropdown quando clica fora
    if (!window._sinoListenerAtivo) {
      document.addEventListener('click', function(e){
        const wrap = document.getElementById('sino-wrapper');
        const drop = document.getElementById('sino-dropdown');
        if (!_sinoDropdownAberto || !wrap || !drop) return;
        if (!wrap.contains(e.target)) {
          drop.style.display = 'none';
          _sinoDropdownAberto = false;
        }
      });
      window._sinoListenerAtivo = true;
    }
  }

  // SEMANA 4.9: Estado de "leitura" do sino
  // Guarda assinatura (hash) das notificações que o usuário já viu.
  // Badge só aparece se houver notificação NOVA (não vista antes).
  function _gerarAssinaturaNotif(items) {
    // Concatena ID + título de cada item (estável entre renders)
    return items.map(function(i){ return (i.id || '') + '|' + (i.titulo || ''); }).sort().join('||');
  }

  function _carregarAssinaturaVista() {
    try { return localStorage.getItem('z_sino_visto') || ''; } catch(e) { return ''; }
  }

  function _salvarAssinaturaVista(sig) {
    try { localStorage.setItem('z_sino_visto', sig); } catch(e) {}
  }

  function toggleSinoNotif() {
    const drop = document.getElementById('sino-dropdown');
    if (!drop) return;
    _sinoDropdownAberto = !_sinoDropdownAberto;
    drop.style.display = _sinoDropdownAberto ? 'block' : 'none';
    if (_sinoDropdownAberto) {
      atualizarSinoNotif();
      // SEMANA 4.9: ao abrir, marca as notificações atuais como vistas (badge some)
      const notif = calcularNotificacoes();
      _salvarAssinaturaVista(_gerarAssinaturaNotif(notif.items));
      // Esconde badge imediatamente (não espera próximo render)
      const badge = document.getElementById('sino-badge');
      if (badge) badge.style.display = 'none';
    }
  }

  function calcularNotificacoes() {
    const sess = getSessao();
    if (!sess) return { items: [], total: 0 };

    const items = [];
    const hoje = new Date();
    const hojeDia = getDataHojeBR();

    // ----- NOTIFICAÇÕES PRO ADMIN -----
    if (sess.papel === 'admin') {
      // 1. Comissões pendentes
      const comPend = (window._comissoesCache || [])
        .filter(function(c){ return c.status_pagamento === 'pendente'; });
      if (comPend.length > 0) {
        const total = comPend.reduce(function(s, c){ return s + parseFloat(c.valor_comissao || 0); }, 0);
        items.push({
          icon: '💰',
          titulo: comPend.length + ' comissão' + (comPend.length > 1 ? 'es' : '') + ' pendente' + (comPend.length > 1 ? 's' : ''),
          subtitulo: 'Total: R$ ' + total.toLocaleString('pt-BR'),
          acao: function(){ navTo('comissoes', document.querySelector('.nav-item[data-page="comissoes"]')); },
          cor: '#FFA000'
        });
      }

      // 2. Projetos com pago_1=true MAS hunter_id_origem=null (bug histórico)
      const projSemHunter = (projetos || []).filter(function(p){
        return p.pago_1 === true && !p.hunter_id_origem;
      });
      if (projSemHunter.length > 0) {
        items.push({
          icon: '⚠️',
          titulo: projSemHunter.length + ' projeto' + (projSemHunter.length > 1 ? 's' : '') + ' sem hunter',
          subtitulo: 'Pago 1º marcado mas sem comissão. Clique pra resolver.',
          acao: function(){
            navTo('em-projeto', document.querySelector('.nav-item[data-page="em-projeto"]'));
            setTimeout(function(){ verProjeto(projSemHunter[0].id); }, 300);
          },
          cor: '#D32F2F'
        });
      }

      // 3. Projetos sem valor_total definido
      const projSemValor = (projetos || []).filter(function(p){
        return p.status === 'em_andamento' && (!p.valor_total || p.valor_total < 1);
      });
      if (projSemValor.length > 0) {
        items.push({
          icon: '📄',
          titulo: projSemValor.length + ' projeto' + (projSemValor.length > 1 ? 's' : '') + ' sem valor',
          subtitulo: 'Defina o valor total pra gerar comissão',
          acao: function(){
            navTo('em-projeto', document.querySelector('.nav-item[data-page="em-projeto"]'));
            setTimeout(function(){ verProjeto(projSemValor[0].id); }, 300);
          },
          cor: '#FFA000'
        });
      }

      // 4. Leads no pool (admin pode atribuir / hunters podem pegar)
      const poolCount = (clientes || []).concat(typeof leads !== 'undefined' ? leads : [])
        .filter(function(c){ return c.status_funil === 'prospeccao' && !c.hunter_id; }).length;
      if (poolCount >= 5) {
        items.push({
          icon: '📋',
          titulo: poolCount + ' leads no Pool',
          subtitulo: 'Aguardando hunter pegar',
          acao: function(){ navTo('pool', document.querySelector('.nav-item[data-page="pool"]')); },
          cor: '#1976D2'
        });
      }
    }

    // ----- NOTIFICAÇÕES PRO HUNTER -----
    if (sess.papel === 'hunter') {
      // 1. Comissões próprias pendentes
      const comPend = (window._comissoesCache || [])
        .filter(function(c){ return c.hunter_id === sess.id && c.status_pagamento === 'pendente'; });
      if (comPend.length > 0) {
        const total = comPend.reduce(function(s, c){ return s + parseFloat(c.valor_comissao || 0); }, 0);
        items.push({
          icon: '💰',
          titulo: comPend.length + ' comissão' + (comPend.length > 1 ? 'es' : '') + ' a receber',
          subtitulo: 'Total: R$ ' + total.toLocaleString('pt-BR'),
          acao: function(){ navTo('meus-fechamentos', document.querySelector('.nav-item[data-page="meus-fechamentos"]')); },
          cor: '#388E3C'
        });
      }

      // 2. Leads próprios sem contato há +7 dias
      const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const leadsAbandonados = (clientes || []).concat(typeof leads !== 'undefined' ? leads : [])
        .filter(function(c){
          if (c.hunter_id !== sess.id) return false;
          if (c.status_funil !== 'prospeccao') return false;
          if (c.status_lead === 'perdido' || c.status_lead === 'fechado') return false;
          const ultContato = c.ultima_interacao || c.data_captura;
          if (!ultContato) return false;
          return new Date(ultContato) < seteDiasAtras;
        });
      if (leadsAbandonados.length > 0) {
        items.push({
          icon: '⏰',
          titulo: leadsAbandonados.length + ' lead' + (leadsAbandonados.length > 1 ? 's' : '') + ' sem contato +7 dias',
          subtitulo: 'Considere retomar ou liberar pro pool',
          acao: function(){ navTo('meus-leads', document.querySelector('.nav-item[data-page="meus-leads"]')); },
          cor: '#FFA000'
        });
      }
    }

    // ----- NOTIFICAÇÕES PRO PROJETOS -----
    if (sess.papel === 'projetos') {
      // 1. Projetos aguardando Pago 1º
      const aguardandoP1 = (projetos || []).filter(function(p){
        return p.status === 'em_andamento' && p.etapa_atual === 1 && !p.pago_1;
      });
      if (aguardandoP1.length > 0) {
        items.push({
          icon: '💰',
          titulo: aguardandoP1.length + ' aguardando Pago 1º',
          subtitulo: 'Confirme após cliente pagar',
          acao: function(){ navTo('em-projeto', document.querySelector('.nav-item[data-page="em-projeto"]')); },
          cor: '#1976D2'
        });
      }

      // 2. Projetos aguardando Docs OK
      const aguardandoDocs = (projetos || []).filter(function(p){
        return p.status === 'em_andamento' && p.etapa_atual === 1 && p.pago_1 && !p.docs_ok;
      });
      if (aguardandoDocs.length > 0) {
        items.push({
          icon: '📋',
          titulo: aguardandoDocs.length + ' aguardando Docs',
          subtitulo: 'Confirme quando documentos chegarem',
          acao: function(){ navTo('em-projeto', document.querySelector('.nav-item[data-page="em-projeto"]')); },
          cor: '#FFA000'
        });
      }

      // 3. Projetos prontos pra Pago 2º
      const prontosP2 = (projetos || []).filter(function(p){
        return p.status === 'em_andamento' && p.etapa_atual === 4 && !p.pago_2;
      });
      if (prontosP2.length > 0) {
        items.push({
          icon: '💵',
          titulo: prontosP2.length + ' prontos pra Pago 2º',
          subtitulo: 'Outorga concluída, cobrar 2ª parcela',
          acao: function(){ navTo('em-projeto', document.querySelector('.nav-item[data-page="em-projeto"]')); },
          cor: '#388E3C'
        });
      }
    }

    return { items: items, total: items.length };
  }

  async function atualizarSinoNotif() {
    // Garante que comissoesCache está populado (admin/hunter)
    const sess = getSessao();
    if (sess && (sess.papel === 'admin' || sess.papel === 'hunter')) {
      try {
        const r = await fetch(SUPABASE_URL + '/rest/v1/comissoes?select=id,hunter_id,valor_comissao,status_pagamento', {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
        });
        if (r.ok) window._comissoesCache = await r.json();
      } catch(e) { console.warn('[Sino] Erro buscando comissões:', e); }
    }

    const notif = calcularNotificacoes();
    const badge = document.getElementById('sino-badge');
    const conteudo = document.getElementById('sino-conteudo');
    if (!badge || !conteudo) return;

    // SEMANA 4.9: Badge só aparece se a assinatura mudou (notificação NOVA)
    const sigAtual = _gerarAssinaturaNotif(notif.items);
    const sigVista = _carregarAssinaturaVista();
    const temNova = notif.total > 0 && sigAtual !== sigVista;

    if (temNova) {
      badge.style.display = 'flex';
      badge.textContent = notif.total > 9 ? '9+' : notif.total;
    } else {
      badge.style.display = 'none';
    }

    // Atualiza conteúdo do dropdown
    if (notif.items.length === 0) {
      conteudo.innerHTML = '<div style="padding:32px 14px;text-align:center;color:var(--text-muted);font-size:12px;">' +
        '<div style="font-size:32px;margin-bottom:8px;opacity:0.4;">🔕</div>' +
        'Sem notificações' +
        '</div>';
      return;
    }

    let html = '';
    notif.items.forEach(function(item, idx){
      html += '<div onclick="executarAcaoSino(' + idx + ')" style="padding:10px 14px;border-bottom:1px solid #F0F0F0;cursor:pointer;display:flex;gap:10px;align-items:flex-start;transition:background 0.15s;" onmouseover="this.style.background=\'#F8F8F8\'" onmouseout="this.style.background=\'white\'">' +
        '<div style="font-size:18px;line-height:1;">' + item.icon + '</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:12px;font-weight:600;color:' + (item.cor || 'var(--text)') + ';line-height:1.3;">' + escapeHtml(item.titulo) + '</div>' +
          '<div style="font-size:11px;color:var(--text-muted);margin-top:2px;line-height:1.3;">' + escapeHtml(item.subtitulo || '') + '</div>' +
        '</div>' +
      '</div>';
    });
    conteudo.innerHTML = html;
    // Guarda ações pra serem executadas no click
    window._sinoAcoes = notif.items.map(function(i){ return i.acao; });
  }

  function executarAcaoSino(idx) {
    const acoes = window._sinoAcoes || [];
    if (acoes[idx]) {
      // Fecha dropdown e executa
      const drop = document.getElementById('sino-dropdown');
      if (drop) drop.style.display = 'none';
      _sinoDropdownAberto = false;
      try { acoes[idx](); } catch(e) { console.error('[Sino] Erro na ação:', e); }
    }
  }


  // =============================================
  // BUSCA GLOBAL
  // =============================================
  window._buscaAcoes = [];
  function buscaGlobal(q) {
    const el = document.getElementById('busca-resultados');
    if (!q || q.length < 2) { el.style.display = 'none'; return; }
    const ql = q.toLowerCase();
    const res = [];
    clientes.forEach(function(c) {
      if ((c.nome||'').toLowerCase().includes(ql)||(c.cpf_cnpj||'').includes(ql)) {
        const cid = c.id;
        res.push({tipo:'Cliente',icone:'👤',titulo:c.nome,sub:c.cpf_cnpj||'',acao:function(){fecharBusca();navTo('clientes',document.querySelector('.nav-item[onclick*=clientes]'));setTimeout(function(){verCliente(cid);},400);}});
      }
    });
    // Buscar por nome de contato/responsável legal
    contatos.forEach(function(ct) {
      if ((ct.nome||'').toLowerCase().includes(ql)||(ct.cpf||'').replace(/\D/g,'').includes(ql.replace(/\D/g,''))) {
        const c = clientes.find(function(cc){return cc.id===ct.cliente_id;});
        if (c) {
          const cid = c.id;
          const papelLabel = ct.papel==='responsavel_legal'?'Responsável legal':ct.papel;
          res.push({tipo:'Contato',icone:'👥',titulo:ct.nome,sub:c.nome+' · '+papelLabel,acao:function(){fecharBusca();navTo('clientes',document.querySelector('.nav-item[onclick*=clientes]'));setTimeout(function(){verCliente(cid);},400);}});
        }
      }
    });
    propriedades.forEach(function(p) {
      if ((p.nome||'').toLowerCase().includes(ql)||(p.portaria||'').toLowerCase().includes(ql)) {
        const cid = p.cliente_id;
        res.push({tipo:'Propriedade',icone:'🏡',titulo:p.nome,sub:(clientes.find(function(c){return c.id===cid;})||{}).nome||'',acao:function(){fecharBusca();navTo('clientes',document.querySelector('.nav-item[onclick*=clientes]'));setTimeout(function(){verCliente(cid);},400);}});
      }
    });
    usos.forEach(function(u) {
      if ((u.descricao||'').toLowerCase().includes(ql)||(u.requerimento||'').toLowerCase().includes(ql)||(u.numero_serie||'').toLowerCase().includes(ql)) {
        const cid = u.cliente_id;
        res.push({tipo:'Ponto',icone:'💧',titulo:u.descricao,sub:(clientes.find(function(c){return c.id===cid;})||{}).nome||'',acao:function(){fecharBusca();navTo('clientes',document.querySelector('.nav-item[onclick*=clientes]'));setTimeout(function(){verCliente(cid);},400);}});
      }
    });
    if (notificacoes) {
      notificacoes.forEach(function(n) {
        if ((n.observacao||'').toLowerCase().includes(ql)||(n.processo||'').toLowerCase().includes(ql)||(n.orgao||'').toLowerCase().includes(ql)) {
          res.push({tipo:'Notificação',icone:'🔔',titulo:n.orgao+' — '+n.tipo,sub:(clientes.find(function(c){return c.id===n.cliente_id;})||{}).nome||'',acao:function(){fecharBusca();navTo('notificacoes',document.querySelector('.nav-item[onclick*=notificacoes]'));}});
        }
      });
    }
    if (!res.length) { el.innerHTML='<div style="padding:14px;text-align:center;font-size:12px;color:var(--text-muted);">Nenhum resultado para "'+q+'"</div>'; el.style.display='block'; return; }
    window._buscaAcoes = res.slice(0,8).map(function(r){return r.acao;});
    var html = '';
    for (var bi=0; bi<window._buscaAcoes.length; bi++) {
      var br = res[bi];
      html += '<div onclick="window._buscaAcoes['+bi+']()" style="padding:10px 14px;cursor:pointer;border-bottom:1px solid #f0f0f0;display:flex;gap:10px;align-items:center;" onmouseover="this.style.background=&#39;#f0f4ff&#39;" onmouseout="this.style.background=&#39;&#39;">'
           + '<span style="font-size:18px;">'+br.icone+'</span>'
           + '<div><div style="font-size:12px;font-weight:600;">'+br.titulo+'</div>'
           + '<div style="font-size:10px;color:#6b7280;">'+br.tipo+' · '+br.sub+'</div></div></div>';
    }
    if (res.length>8) html += '<div style="padding:8px;text-align:center;font-size:11px;color:#9ca3af;">+'+(res.length-8)+' resultados</div>';
    el.innerHTML = html;
    el.style.display='block';
  }
  function fecharBusca() {
    const bg=document.getElementById('busca-global'); if(bg) bg.value='';
    const br=document.getElementById('busca-resultados'); if(br) br.style.display='none';
  }
  document.addEventListener('click',function(e){
    const br=document.getElementById('busca-resultados');
    if(br&&!br.contains(e.target)&&e.target.id!=='busca-global') br.style.display='none';
  });

  // =============================================
  // CONFIGURAÇÕES DA EMPRESA
  // =============================================
  function carregarConfigEmpresa() {
    const campos=['nome','crea','tel','email','empresa'];
    campos.forEach(function(c){
      const salvo=localStorage.getItem('z_eng_'+c);
      const el=document.getElementById('cfg-eng-'+c);
      if(el&&salvo) el.value=salvo;
    });
    atualizarEmpresaGlobal();
  }
  function atualizarEmpresaGlobal() {
    const n=localStorage.getItem('z_eng_nome'), cr=localStorage.getItem('z_eng_crea'),
          t=localStorage.getItem('z_eng_tel'), em=localStorage.getItem('z_eng_email'),
          emp=localStorage.getItem('z_eng_empresa');
    if(n) EMPRESA.eng=n; if(cr) EMPRESA.crea=cr; if(t) EMPRESA.tel=t;
    if(em) EMPRESA.email=em; if(emp) EMPRESA.nome=emp;
    const sc=document.querySelector('.sidebar-contact');
    if(sc) sc.innerHTML=EMPRESA.eng+'<br>'+EMPRESA.crea+'<br><a href="tel:'+EMPRESA.tel+'">'+EMPRESA.tel+'</a><br><a href="mailto:'+EMPRESA.email+'">'+EMPRESA.email+'</a>';
  }
  function salvarConfigEmpresa() {
    const campos=['nome','crea','tel','email','empresa'];
    campos.forEach(function(c){
      const el=document.getElementById('cfg-eng-'+c);
      if(el&&el.value.trim()) localStorage.setItem('z_eng_'+c,el.value.trim());
    });
    atualizarEmpresaGlobal();
    alert('✅ Dados do responsável técnico salvos!\nAs alterações são aplicadas imediatamente.');
  }

  // =============================================
  // EXPORTAR EXCEL — TODOS OS CLIENTES
  // =============================================
  async function exportarRelatorioAnualTodos() {
    const ano = document.getElementById('rel-ano').value || new Date().getFullYear();
    if (!confirm('Exportar relatório de TODOS os clientes para '+ano+'?\nIsso pode levar alguns segundos.')) return;
    const leitsAno = await api('leituras?mes_referencia=gte.'+ano+'-01&mes_referencia=lte.'+ano+'-12&select=*') || [];
    const nomeMeses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const wb = XLSX.utils.book_new();
    // Aba Resumo
    const resumoRows = [['Cliente','CPF/CNPJ','Propriedade','Ponto','Portaria','Requerimento','Autorizado m³/mês','Total captado m³','% anual','Meses c/ dado','Meses acima']];
    // FIX BUG: só de clientes ATIVOS (clientes[] já filtra ativos, mas reforça via propriedade)
    const idsAtivosRel = new Set(clientes.filter(function(cc){return cc.ativo!==false;}).map(function(cc){return cc.id;}));
    const idsPropsRel = new Set((propriedades||[]).filter(function(pp){return idsAtivosRel.has(pp.cliente_id);}).map(function(pp){return pp.id;}));
    usos.filter(function(u){return u.possui_hidrometro && idsPropsRel.has(u.propriedade_id);}).forEach(function(u){
      const c=clientes.find(function(cc){return cc.id===u.cliente_id;});
      const p=propriedades.find(function(pp){return pp.id===u.propriedade_id;});
      const aut=getAutorizadoUso(u);
      const lu=leitsAno.filter(function(l){return l.uso_id===u.id;});
      const tot=lu.reduce(function(s,l){return s+(l.consumo_m3||0);},0);
      const pct=aut>0?Math.round(tot/(aut*12)*100):0;
      const ac=lu.filter(function(l){return aut>0&&l.consumo_m3>aut;}).length;
      resumoRows.push([c?c.nome:'',c?c.cpf_cnpj:'',p?p.nome:'',u.descricao,u.portaria||'',u.requerimento||'',aut>0?aut.toFixed(1):'',tot.toFixed(1),pct+'%',lu.length,ac]);
    });
    const wsR=XLSX.utils.aoa_to_sheet(resumoRows);
    wsR['!cols']=[{wch:30},{wch:18},{wch:25},{wch:20},{wch:15},{wch:20},{wch:16},{wch:16},{wch:10},{wch:13},{wch:12}];
    XLSX.utils.book_append_sheet(wb,wsR,'Resumo '+ano);
    // Aba Leituras detalhadas
    const detRows=[['Cliente','Ponto','Mês','Leit. ant.','Leit. atual','Consumo m³','Autorizado','% mês','Situação','Observação']];
    leitsAno.forEach(function(l){
      const u=usos.find(function(uu){return uu.id===l.uso_id;});
      const c=u?clientes.find(function(cc){return cc.id===u.cliente_id;}):null;
      const aut=u?getAutorizadoUso(u):0;
      const pctM=aut>0?Math.round((l.consumo_m3||0)/aut*100):0;
      const mes=l.mes_referencia?nomeMeses[parseInt(l.mes_referencia.split('-')[1])-1]+'/'+l.mes_referencia.split('-')[0]:'';
      detRows.push([c?c.nome:'',u?u.descricao:'',mes,l.leitura_anterior||0,l.leitura_atual||0,l.consumo_m3||0,aut>0?aut.toFixed(1):'',pctM+'%',aut>0&&l.consumo_m3>aut?'Acima':'Normal',l.observacao||'']);
    });
    const wsD=XLSX.utils.aoa_to_sheet(detRows);
    wsD['!cols']=[{wch:30},{wch:20},{wch:10},{wch:12},{wch:12},{wch:12},{wch:12},{wch:8},{wch:8},{wch:30}];
    XLSX.utils.book_append_sheet(wb,wsD,'Leituras '+ano);
    XLSX.writeFile(wb,'Zello_Ambiental_'+ano+'.xlsx');
    alert('✅ Exportado: Zello_Ambiental_'+ano+'.xlsx');
  }


  // =============================================
  // RESPONSÁVEL LEGAL (para empresas/CNPJ)
  // =============================================
  let _numRespLegais = 1;

  function detectarTipoCliente() {
    const doc = document.getElementById('c-doc').value.replace(/\D/g,'');
    const isCNPJ = doc.length > 11;
    const blocoLegal = document.getElementById('bloco-resp-legal');
    const labelContatos = document.getElementById('label-contatos-adicionais');
    if (isCNPJ) {
      blocoLegal.style.display = 'block';
      if (labelContatos) labelContatos.textContent = 'Outros contatos (opcional)';
      // Garantir pelo menos 1 responsável legal
      if (document.getElementById('lista-resp-legais').children.length === 0) {
        adicionarResponsavelLegal();
      }
    } else {
      blocoLegal.style.display = 'none';
      if (labelContatos) labelContatos.innerHTML = 'Contatos adicionais <span style="font-weight:400;font-size:10px;color:#6b7280;">(opcional)</span>';
    }
  }

  function adicionarResponsavelLegal() {
    const lista = document.getElementById('lista-resp-legais');
    const idx = lista.children.length;
    const div = document.createElement('div');
    div.className = 'resp-legal-item';
    div.style.cssText = 'background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:12px;margin-bottom:8px;position:relative;';
    div.innerHTML =
      (idx > 0 ? '<button onclick="this.parentElement.remove()" style="position:absolute;top:8px;right:8px;background:#fee2e2;border:none;border-radius:6px;padding:2px 8px;cursor:pointer;font-size:11px;color:#C62828;">✕</button>' : '') +
      '<div class="g2">' +
        '<div class="fg span2"><label class="fl">Nome completo *</label><input class="fi upper" type="text" id="resp-legal-nome-'+idx+'" placeholder="Nome do responsável legal" /></div>' +
        '<div class="fg"><label class="fl">CPF *</label><input class="fi" type="text" id="resp-legal-cpf-'+idx+'" placeholder="000.000.000-00" maxlength="14" oninput="mascaraCpfCnpj(this)" /></div>' +
        '<div class="fg"><label class="fl">Telefone</label><input class="fi" type="tel" id="resp-legal-tel-'+idx+'" placeholder="(16) 99999-0000" maxlength="15" oninput="mascaraTel(this)" /></div>' +
        '<div class="fg span2"><label class="fl">E-mail</label><input class="fi" type="email" id="resp-legal-email-'+idx+'" placeholder="responsavel@empresa.com" /></div>' +
      '</div>';
    lista.appendChild(div);
    _numRespLegais = lista.children.length;
  }

  // (Versão duplicada de coletarResponsaveisLegais removida — a versão correta
  //  está mais acima e usa as chaves 'telefone' e 'principal' compatíveis com
  //  o salvamento dos contatos.)

  function limparResponsaveisLegais() {
    const lista = document.getElementById('lista-resp-legais');
    if (lista) lista.innerHTML = '';
    _numRespLegais = 1;
  }

  // =============================================
  // DOCUMENTOS / LICENÇAS
  // =============================================

  // Tipos de documentos suportados (extensível)
  const TIPOS_DOC = [
    { id: 'OUTORGA',     label: 'Outorga (DAEE/ANA)',          icone: '💧', cor: '#1565C0', bg: '#E3F2FD' },
    { id: 'CAR',         label: 'CAR — Cadastro Ambiental',    icone: '🌳', cor: '#2E7D32', bg: '#E8F5E9' },
    { id: 'CETESB',      label: 'CETESB — Licença Ambiental',  icone: '🏭', cor: '#E65100', bg: '#FFF3E0' },
    { id: 'DCAA',        label: 'DCAA — Declaração CETESB',    icone: '📄', cor: '#6A1B9A', bg: '#F3E5F5' },
    { id: 'CADRI',       label: 'CADRI — Movimentação Resíduos', icone: '♻️', cor: '#558B2F', bg: '#F1F8E9' },
    { id: 'PREFEITURA',  label: 'Alvará da Prefeitura',         icone: '🏛️', cor: '#5D4037', bg: '#EFEBE9' },
    { id: 'CCIR',        label: 'CCIR — INCRA',                 icone: '📋', cor: '#00695C', bg: '#E0F2F1' },
    { id: 'ITR',         label: 'ITR — Receita Federal',        icone: '💰', cor: '#827717', bg: '#F9FBE7' },
    { id: 'BOMBEIROS',   label: 'AVCB — Bombeiros',             icone: '🔥', cor: '#C62828', bg: '#FFEBEE' },
    { id: 'IPHAN',       label: 'IPHAN — Patrimônio',           icone: '🏺', cor: '#4527A0', bg: '#EDE7F6' },
    { id: 'DAEE',        label: 'Documento DAEE',               icone: '🌊', cor: '#0277BD', bg: '#E1F5FE' },
    { id: 'ANA',         label: 'Documento ANA',                icone: '💦', cor: '#01579B', bg: '#E0F7FA' },
    { id: 'IBAMA',       label: 'Licença IBAMA',                icone: '🦜', cor: '#33691E', bg: '#DCEDC8' },
    { id: 'OUTRO',       label: 'Outro',                        icone: '📎', cor: '#455A64', bg: '#ECEFF1' }
  ];

  // SEMANA 4.18: CHECKLIST DA FICHA CADASTRAL
  // Documentos que o cliente precisa enviar pra iniciar o projeto
  const CHECKLIST_DOCS = [
    // Comuns (sempre obrigatórios)
    { codigo:'CNH_RG_CPF',       label:'CNH ou CPF + RG do responsável legal',                   categoria:'comum', icone:'🪪' },
    { codigo:'CONTRATO_SOCIAL',  label:'Contrato social (CNPJ) ou ata/assembleia/nomeação',      categoria:'comum', icone:'📋' },
    { codigo:'COMPROV_END',      label:'Comprovante de endereço atualizado (energia/água/internet)', categoria:'comum', icone:'🏠' },
    { codigo:'EMAIL_CONTATO',    label:'E-mail para contato',                                    categoria:'comum', icone:'📧' },
    { codigo:'TELEFONES',        label:'Telefones para contato',                                 categoria:'comum', icone:'📞' },
    { codigo:'MATRICULA_IMOVEL', label:'Matrícula do imóvel (≤180 dias), posse ou contrato de locação', categoria:'comum', icone:'📜' },
    // Rural
    { codigo:'ITR',              label:'ITR (Imposto sobre Propriedade Territorial Rural)',      categoria:'rural', icone:'🌾' },
    { codigo:'CCIR',             label:'CCIR (Certificado de Cadastro de Imóvel Rural)',         categoria:'rural', icone:'🌱' },
    { codigo:'CAR',              label:'CAR (Cadastro Ambiental Rural)',                         categoria:'rural', icone:'🌳' },
    { codigo:'DCAA',             label:'DCAA (Declaração de Conformidade de Atividade Agropecuária) – Casa da Agricultura', categoria:'rural', icone:'🚜' },
    // Urbana
    { codigo:'IPTU',             label:'IPTU (Imposto Predial e Territorial Urbano)',            categoria:'urbana', icone:'🏙️' },
    { codigo:'CAD_VS',           label:'Cadastro na Vigilância Sanitária',                       categoria:'urbana', icone:'🏥' }
  ];

  function getDocChecklist(codigo) {
    return CHECKLIST_DOCS.find(function(d){ return d.codigo === codigo; });
  }

  // SEMANA 4.18: Opções pros selects da ficha técnica
  const OPCOES_ENQUADRAMENTO = [
    { value:'', label:'— Selecione —' },
    { value:'ME', label:'ME (Microempresa)' },
    { value:'EPP', label:'EPP (Empresa de Pequeno Porte)' },
    { value:'LUCRO_PRESUMIDO', label:'Lucro Presumido' },
    { value:'LUCRO_REAL', label:'Lucro Real' },
    { value:'MEI', label:'MEI' },
    { value:'OUTRO', label:'Outro' }
  ];

  const OPCOES_AREA_TIPO = [
    { value:'', label:'— Selecione —' },
    { value:'rural', label:'🌱 Rural' },
    { value:'urbana', label:'🏙️ Urbana' },
    { value:'mista', label:'🔀 Mista' }
  ];

  const OPCOES_TIPO_CAPTACAO = [
    { value:'', label:'— Selecione —' },
    { value:'poco', label:'⛲ Poço' },
    { value:'rio', label:'🌊 Rio' },
    { value:'lago', label:'💧 Lago/Lagoa' },
    { value:'nascente', label:'💦 Nascente' },
    { value:'cisterna', label:'🪣 Cisterna' },
    { value:'outro', label:'❓ Outro' }
  ];

  const OPCOES_FINALIDADE = [
    { value:'', label:'— Selecione —' },
    { value:'industrial', label:'🏭 Industrial' },
    { value:'irrigacao', label:'🌾 Irrigação' },
    { value:'dessedentacao', label:'🐄 Dessedentação animal' },
    { value:'consumo_humano', label:'🚰 Consumo humano' },
    { value:'aquicultura', label:'🐟 Aquicultura' },
    { value:'comercial', label:'🏪 Comercial' },
    { value:'paisagismo', label:'🌳 Paisagismo' },
    { value:'outro', label:'❓ Outro' }
  ];

  function getTipoDoc(id) { return TIPOS_DOC.find(function(t){return t.id===id;}) || TIPOS_DOC[TIPOS_DOC.length-1]; }

  let _docsFiltro = 'todos';   // todos | vencidos | vencendo | emdia | semprazo
  let _docEditandoId = null;

  // Calcula status do documento baseado em data_vencimento
  function statusDoc(doc) {
    if (!doc.data_vencimento) {
      return { cls:'doc-status-semprazo', txt:'Sem prazo', cor:'#6b7280', bg:'#f3f4f6', dias:null };
    }
    const venc = new Date(doc.data_vencimento + 'T00:00:00');
    if (isNaN(venc.getTime())) return { cls:'doc-status-semprazo', txt:'Sem prazo', cor:'#6b7280', bg:'#f3f4f6', dias:null };
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    const dias = Math.ceil((venc - hoje) / 86400000);
    if (dias < 0)    return { cls:'doc-status-vencido', txt:'Vencido há '+Math.abs(dias)+' dias', cor:'#C62828', bg:'#FFEBEE', dias };
    if (dias <= 30)  return { cls:'doc-status-critico', txt:'Vence em '+dias+' dias',  cor:'#C62828', bg:'#FFEBEE', dias };
    if (dias <= 90)  return { cls:'doc-status-aviso',   txt:'Vence em '+dias+' dias',  cor:'#E65100', bg:'#FFF3E0', dias };
    if (dias <= 180) return { cls:'doc-status-atento',  txt:'Vence em '+Math.ceil(dias/30)+' meses',  cor:'#F57F17', bg:'#FFF8E1', dias };
    return { cls:'doc-status-emdia', txt:'Em dia · '+Math.ceil(dias/30)+' meses', cor:'#2E7D32', bg:'#E8F5E9', dias };
  }

  // Atualiza badge do menu (qtde vencendo + vencidos)
  function atualizarBadgeDocs() {
    const badge = document.getElementById('badge-docs');
    if (!badge) return;
    const urgentes = (documentos||[]).filter(function(d){
      if (d.ativo === false) return false;
      const s = statusDoc(d);
      return s.dias !== null && s.dias <= 90;  // inclui vencidos (dias < 0)
    });
    if (urgentes.length > 0) {
      badge.textContent = String(urgentes.length);
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }

  // Popula selects de filtros
  function popularDocsSelects() {
    const selCli = document.getElementById('docs-filtro-cli');
    const selTipo = document.getElementById('docs-filtro-tipo');
    if (selCli) {
      const valor = selCli.value;
      selCli.innerHTML = '<option value="">Todos os clientes</option>' +
        clientes.slice().sort(function(a,b){return (a.nome||'').localeCompare(b.nome||'');}).map(function(c){
          return '<option value="'+c.id+'">'+(c.nome||'—')+'</option>';
        }).join('');
      selCli.value = valor;
    }
    if (selTipo) {
      const valor = selTipo.value;
      selTipo.innerHTML = '<option value="">Todos os tipos</option>' +
        TIPOS_DOC.map(function(t){return '<option value="'+t.id+'">'+t.icone+' '+t.label+'</option>';}).join('');
      selTipo.value = valor;
    }
  }

  function filtrarDocs(f) {
    _docsFiltro = f;
    ['todos','vencidos','vencendo','emdia','semprazo'].forEach(function(x){
      const b = document.getElementById('docs-filtro-'+x);
      if (b) { b.style.background = ''; b.style.color = ''; }
    });
    const ativo = document.getElementById('docs-filtro-'+f);
    if (ativo) { ativo.style.background = '#1565C0'; ativo.style.color = 'white'; }
    renderDocumentos();
  }

  // Render principal da lista de documentos
  function renderDocumentos() {
    const lista = document.getElementById('lista-documentos');
    const resumo = document.getElementById('docs-resumo');
    if (!lista) return;

    const buscaEl = document.getElementById('docs-busca');
    const busca = buscaEl ? (buscaEl.value || '').toLowerCase().trim() : '';
    const filtroCliEl = document.getElementById('docs-filtro-cli');
    const filtroTipoEl = document.getElementById('docs-filtro-tipo');
    const filtroCli = filtroCliEl ? filtroCliEl.value : '';
    const filtroTipo = filtroTipoEl ? filtroTipoEl.value : '';

    let docs = (documentos||[]).slice();

    if (filtroCli) docs = docs.filter(function(d){return d.cliente_id===filtroCli;});
    if (filtroTipo) docs = docs.filter(function(d){return d.tipo===filtroTipo;});

    if (_docsFiltro === 'vencidos') {
      docs = docs.filter(function(d){const s=statusDoc(d); return s.dias !== null && s.dias < 0;});
    } else if (_docsFiltro === 'vencendo') {
      docs = docs.filter(function(d){const s=statusDoc(d); return s.dias !== null && s.dias >= 0 && s.dias <= 90;});
    } else if (_docsFiltro === 'emdia') {
      docs = docs.filter(function(d){const s=statusDoc(d); return s.dias !== null && s.dias > 90;});
    } else if (_docsFiltro === 'semprazo') {
      docs = docs.filter(function(d){return !d.data_vencimento;});
    }

    if (busca) {
      docs = docs.filter(function(d){
        const c = clientes.find(function(cc){return cc.id===d.cliente_id;});
        const p = propriedades.find(function(pp){return pp.id===d.propriedade_id;});
        const tipo = getTipoDoc(d.tipo);
        const blob = [
          c?c.nome:'', p?p.nome:'', tipo.label, d.tipo, d.titulo, d.numero, d.orgao, d.processo, d.observacao
        ].filter(Boolean).join(' ').toLowerCase();
        return blob.indexOf(busca) >= 0;
      });
    }

    // Ordena: vencidos/vencendo primeiro
    docs.sort(function(a,b){
      const sa = statusDoc(a), sb = statusDoc(b);
      const da = sa.dias === null ? 99999 : sa.dias;
      const db = sb.dias === null ? 99999 : sb.dias;
      return da - db;
    });

    const total = (documentos||[]).length;
    const vencidos = (documentos||[]).filter(function(d){const s=statusDoc(d); return s.dias!==null && s.dias<0;}).length;
    const vencendo = (documentos||[]).filter(function(d){const s=statusDoc(d); return s.dias!==null && s.dias>=0 && s.dias<=90;}).length;
    if (resumo) {
      resumo.innerHTML = '<strong>'+total+'</strong> documento(s) cadastrado(s) · '
        + (vencidos>0 ? '<span style="color:#C62828;font-weight:600;">'+vencidos+' vencido(s)</span> · ' : '')
        + (vencendo>0 ? '<span style="color:#E65100;font-weight:600;">'+vencendo+' vencendo</span> · ' : '')
        + 'mostrando <strong>'+docs.length+'</strong>';
    }

    if (!docs.length) {
      lista.innerHTML = '<div class="card" style="text-align:center;padding:50px 20px;color:var(--text-muted);">'
        + '<div style="font-size:42px;margin-bottom:10px;opacity:0.4;">📄</div>'
        + '<div style="font-weight:600;margin-bottom:6px;">Nenhum documento encontrado</div>'
        + '<div style="font-size:12px;">' + (total === 0 ? 'Cadastre o primeiro documento clicando em "+ Novo documento"' : 'Tente ajustar os filtros acima') + '</div>'
        + '</div>';
      return;
    }

    lista.innerHTML = docs.map(function(d){ return renderCardDocumento(d); }).join('');
  }

  function renderCardDocumento(d) {
    const tipo = getTipoDoc(d.tipo);
    const c = clientes.find(function(cc){return cc.id===d.cliente_id;});
    const p = propriedades.find(function(pp){return pp.id===d.propriedade_id;});
    const u = usos.find(function(uu){return uu.id===d.uso_id;});
    const status = statusDoc(d);

    const escopo = [];
    if (c) escopo.push('👤 ' + (c.nome||''));
    if (p) escopo.push('🏡 ' + (p.nome||''));
    if (u) escopo.push('💧 ' + (u.descricao||''));

    const meta = [];
    if (d.numero) meta.push('Nº '+d.numero);
    if (d.orgao) meta.push(d.orgao);
    if (d.processo) meta.push('Proc. '+d.processo);
    if (d.data_emissao) meta.push('Emissão: '+formatarDataBrDoc(d.data_emissao));
    if (d.data_vencimento) meta.push('Vence: '+formatarDataBrDoc(d.data_vencimento));

    return '<div class="card" style="padding:14px;margin-bottom:10px;border-left:4px solid '+tipo.cor+';">'
      + '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;">'
      +   '<div style="flex:1;min-width:240px;">'
      +     '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap;">'
      +       '<span style="background:'+tipo.bg+';color:'+tipo.cor+';padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;">'+tipo.icone+' '+tipo.label+'</span>'
      +       '<span style="background:'+status.bg+';color:'+status.cor+';padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;">'+status.txt+'</span>'
      +     '</div>'
      +     '<div style="font-weight:700;font-size:14px;margin-bottom:4px;">'+escapeHtmlDoc(d.titulo || tipo.label)+'</div>'
      +     '<div style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">'+escopo.join(' · ')+'</div>'
      +     (meta.length ? '<div style="font-size:11px;color:var(--text-muted);font-family:monospace;">'+meta.join(' · ')+'</div>' : '')
      +     (d.observacao ? '<div style="font-size:12px;color:var(--text);margin-top:6px;padding:6px 10px;background:#f9fafb;border-radius:6px;">'+escapeHtmlDoc(d.observacao)+'</div>' : '')
      +   '</div>'
      +   '<div style="display:flex;gap:6px;flex-shrink:0;">'
      +     (d.arquivo_url
        ? '<a href="'+d.arquivo_url+'" target="_blank" rel="noopener" class="btn btn-sm" style="background:#FFF3E0;color:#E65100;border:1px solid #FFB74D;text-decoration:none;" title="Abrir arquivo">📄 Abrir</a>'
        : '<span class="btn btn-sm" style="background:#f3f4f6;color:#9ca3af;border:1px dashed #d1d5db;cursor:default;" title="Sem arquivo">📄 –</span>')
      +     '<button class="btn btn-sm" onclick="editarDocumento(\''+d.id+'\')" title="Editar">✏️</button>'
      +     '<button class="btn btn-sm btn-danger" onclick="excluirDocumento(\''+d.id+'\')" title="Excluir">🗑</button>'
      +   '</div>'
      + '</div>'
      + '</div>';
  }

  // Helpers locais (evitam conflito com nomes existentes)
  function escapeHtmlDoc(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  }
  function formatarDataBrDoc(iso) {
    if (!iso) return '—';
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('pt-BR');
  }

  // ===========================================================
  // MODAL DE NOVO/EDITAR DOCUMENTO
  // ===========================================================
  function abrirNovoDocumento(prefill) {
    _docEditandoId = null;
    document.getElementById('doc-modal-titulo').textContent = '+ Novo documento';
    popularSelectsModalDoc();
    document.getElementById('doc-form-tipo').value = (prefill && prefill.tipo) || '';
    document.getElementById('doc-form-cliente').value = (prefill && prefill.cliente_id) || '';
    atualizarSelectsDocsDependentes();
    document.getElementById('doc-form-propriedade').value = (prefill && prefill.propriedade_id) || '';
    atualizarSelectUsosDoc();
    document.getElementById('doc-form-uso').value = (prefill && prefill.uso_id) || '';
    document.getElementById('doc-form-titulo').value = '';
    document.getElementById('doc-form-numero').value = '';
    document.getElementById('doc-form-orgao').value = '';
    document.getElementById('doc-form-processo').value = '';
    document.getElementById('doc-form-emissao').value = '';
    document.getElementById('doc-form-vencimento').value = '';
    document.getElementById('doc-form-obs').value = '';
    document.getElementById('doc-form-arquivo').value = '';
    document.getElementById('doc-form-arquivo-info').innerHTML = '';
    abrirModal('ov-documento');
  }

  function editarDocumento(id) {
    const d = (documentos||[]).find(function(x){return x.id===id;});
    if (!d) { alert('Documento não encontrado.'); return; }
    _docEditandoId = id;
    document.getElementById('doc-modal-titulo').textContent = '✏️ Editar documento';
    popularSelectsModalDoc();
    document.getElementById('doc-form-tipo').value = d.tipo || '';
    document.getElementById('doc-form-cliente').value = d.cliente_id || '';
    atualizarSelectsDocsDependentes();
    document.getElementById('doc-form-propriedade').value = d.propriedade_id || '';
    atualizarSelectUsosDoc();
    document.getElementById('doc-form-uso').value = d.uso_id || '';
    document.getElementById('doc-form-titulo').value = d.titulo || '';
    document.getElementById('doc-form-numero').value = d.numero || '';
    document.getElementById('doc-form-orgao').value = d.orgao || '';
    document.getElementById('doc-form-processo').value = d.processo || '';
    document.getElementById('doc-form-emissao').value = d.data_emissao || '';
    document.getElementById('doc-form-vencimento').value = d.data_vencimento || '';
    document.getElementById('doc-form-obs').value = d.observacao || '';
    document.getElementById('doc-form-arquivo').value = '';
    document.getElementById('doc-form-arquivo-info').innerHTML = d.arquivo_url
      ? '📄 <a href="'+d.arquivo_url+'" target="_blank" rel="noopener" style="color:#E65100;font-weight:600;">Ver arquivo atual</a> <span style="color:var(--text-muted);">— selecione um arquivo acima para substituir</span>'
      : '<span style="color:var(--text-muted);">Sem arquivo anexado</span>';
    abrirModal('ov-documento');
  }

  // Popula selects de Cliente e Tipo no modal
  function popularSelectsModalDoc() {
    const selCli = document.getElementById('doc-form-cliente');
    const selTipo = document.getElementById('doc-form-tipo');
    if (selCli) {
      selCli.innerHTML = '<option value="">— Selecione um cliente —</option>' +
        clientes.slice().sort(function(a,b){return (a.nome||'').localeCompare(b.nome||'');}).map(function(c){
          return '<option value="'+c.id+'">'+(c.nome||'—')+'</option>';
        }).join('');
    }
    if (selTipo) {
      selTipo.innerHTML = '<option value="">— Selecione o tipo —</option>' +
        TIPOS_DOC.map(function(t){return '<option value="'+t.id+'">'+t.icone+' '+t.label+'</option>';}).join('');
    }
  }

  function atualizarSelectsDocsDependentes() {
    const cid = document.getElementById('doc-form-cliente').value;
    const selProp = document.getElementById('doc-form-propriedade');
    selProp.innerHTML = '<option value="">— (opcional) propriedade —</option>';
    if (cid) {
      const props = propriedades.filter(function(p){return p.cliente_id===cid;});
      props.forEach(function(p){
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.nome || '—';
        selProp.appendChild(opt);
      });
    }
    atualizarSelectUsosDoc();
  }

  function atualizarSelectUsosDoc() {
    const cid = document.getElementById('doc-form-cliente').value;
    const pid = document.getElementById('doc-form-propriedade').value;
    const selUso = document.getElementById('doc-form-uso');
    selUso.innerHTML = '<option value="">— (opcional) ponto/uso —</option>';
    if (cid) {
      let arr = usos.filter(function(u){return u.cliente_id===cid;});
      if (pid) arr = arr.filter(function(u){return u.propriedade_id===pid;});
      arr.forEach(function(u){
        const opt = document.createElement('option');
        opt.value = u.id;
        opt.textContent = u.descricao || '—';
        selUso.appendChild(opt);
      });
    }
  }

  async function salvarDocumento() {
    const tipo = document.getElementById('doc-form-tipo').value;
    const cid = document.getElementById('doc-form-cliente').value;
    const pid = document.getElementById('doc-form-propriedade').value;
    const uid = document.getElementById('doc-form-uso').value;
    const titulo = document.getElementById('doc-form-titulo').value.trim();
    const numero = document.getElementById('doc-form-numero').value.trim();
    const orgao = document.getElementById('doc-form-orgao').value.trim();
    const processo = document.getElementById('doc-form-processo').value.trim();
    const emissao = document.getElementById('doc-form-emissao').value;
    const vencimento = document.getElementById('doc-form-vencimento').value;
    const obs = document.getElementById('doc-form-obs').value.trim();
    const fileInput = document.getElementById('doc-form-arquivo');

    if (!tipo) { alert('Selecione o tipo do documento.'); return; }
    if (!cid) { alert('Selecione o cliente.'); return; }
    if (emissao && vencimento && emissao > vencimento) {
      alert('A data de vencimento não pode ser anterior à data de emissão.');
      return;
    }

    const btn = document.getElementById('doc-btn-salvar');
    btn.disabled = true;
    btn.textContent = 'Salvando...';

    try {
      let arquivoUrl = null;
      let arquivoNome = null;

      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        if (file.size > 25 * 1024 * 1024) {
          alert('Arquivo muito grande (máx 25 MB).');
          btn.disabled = false; btn.textContent = '💾 Salvar';
          return;
        }
        btn.textContent = 'Enviando arquivo...';
        const ext = (file.name.split('.').pop() || 'pdf').replace(/[^a-zA-Z0-9]/g,'').toLowerCase() || 'pdf';
        const filename = 'doc-' + tipo.toLowerCase() + '-' + Date.now() + '.' + ext;
        const path = 'documentos/' + filename;
        const r = await fetch(SUPABASE_URL + '/storage/v1/object/documentos-zello/' + path, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': 'Bearer ' + SUPABASE_KEY,
            'Content-Type': file.type || 'application/pdf'
          },
          body: file
        });
        if (!r.ok) {
          const t = await r.text().catch(function(){return '';});
          alert('Falha ao enviar arquivo. ' + t.substring(0,200));
          btn.disabled = false; btn.textContent = '💾 Salvar';
          return;
        }
        arquivoUrl = SUPABASE_URL + '/storage/v1/object/public/documentos-zello/' + path;
        arquivoNome = file.name;
        btn.textContent = 'Salvando...';
      }

      const payload = {
        cliente_id: cid,
        propriedade_id: pid || null,
        uso_id: uid || null,
        tipo: tipo,
        titulo: titulo || null,
        numero: numero || null,
        orgao: orgao || null,
        processo: processo || null,
        data_emissao: emissao || null,
        data_vencimento: vencimento || null,
        observacao: obs || null,
        ativo: true
      };
      if (arquivoUrl) {
        payload.arquivo_url = arquivoUrl;
        payload.arquivo_nome = arquivoNome;
      }

      let r;
      if (_docEditandoId) {
        r = await api('documentos?id=eq.'+_docEditandoId, 'PATCH', payload, 'return=minimal');
      } else {
        r = await api('documentos', 'POST', payload, 'return=minimal');
      }

      if (r && r.ok) {
        fecharModal('ov-documento');
        await carregarDados();
        renderDocumentos();
      } else {
        let txtErro = '';
        if (r) { try { txtErro = await r.text(); } catch(e){} }
        alert('Erro ao salvar documento.' + (txtErro ? '\n\n'+txtErro.substring(0,250) : ''));
      }
    } catch (e) {
      alert('Erro: ' + (e.message || e));
    } finally {
      btn.disabled = false;
      btn.textContent = '💾 Salvar';
    }
  }

  async function excluirDocumento(id) {
    const d = (documentos||[]).find(function(x){return x.id===id;});
    if (!d) return;
    const tipo = getTipoDoc(d.tipo);
    if (!confirm('Excluir este documento?\n\n' + tipo.label + (d.numero ? ' nº '+d.numero : '') + '\n\nEsta ação não pode ser desfeita. O arquivo continuará no Storage, mas o cadastro será removido.')) return;
    const r = await api('documentos?id=eq.'+id, 'DELETE', null, 'return=minimal');
    if (r && r.ok) {
      await carregarDados();
      renderDocumentos();
    } else {
      alert('Erro ao excluir documento.');
    }
  }

  // =============================================
  // NAVEGAÇÃO E MODAIS
  // =============================================
  const navTitles = { dashboard:'Dashboard', clientes:'Clientes', pool:'🟢 Pool de Leads', 'meus-fechamentos':'💰 Meus Fechamentos', comissoes:'💰 Pendências Financeiras', financeiro:'📊 Relatório Financeiro', prospeccao:'Prospecção', 'em-projeto':'Em Projeto', acompanhamento:'Acompanhamento de Vazões', leituras:'Leituras', documentos:'Documentos / Licenças', comunicados:'Comunicados', renovacoes:'Renovações de Outorga', alertas:'Alertas', relatorios:'Relatórios', config:'Configurações', notificacoes:'Notificações de Processos' };

  function navTo(id, el) {
    document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
    document.querySelectorAll('.nav-item').forEach(function(n){n.classList.remove('active');});
    const page = document.getElementById('page-'+id); if (page) page.classList.add('active');
    if (el) el.classList.add('active');
    document.getElementById('topbarTitle').textContent = navTitles[id]||id;
    if (id==='renovacoes') renderRenovacoes();
    if (id==='acompanhamento') carregarAcompanhamento();
    if (id==='alertas') { renderAlertasVenc(); renderAlertas7dias(); atualizarStatusDisparoDia(); }
    if (id==='comunicados') { atualizarContagemDestinatarios(); }
    if (id==='notificacoes') { carregarNotificacoes(); }
    if (id==='leituras') { const n=new Date(); document.getElementById('filtro-mes').value=n.getFullYear()+'-'+String(n.getMonth()+1).padStart(2,'0'); carregarLeituras(); }
    if (id==='documentos') { popularDocsSelects(); renderDocumentos(); }
    if (id==='relatorios') popularSelectsRel();
    if (id==='config') {
      carregarConfigEmpresa(); testarConexaoConfig(); carregarTemplatesDoc(); preencherFormConfigContratado();
      // FASE 14.1: mostra card de gestão de usuários só pro admin
      const cardGestao = document.getElementById('card-gestao-usuarios');
      // SEMANA 2: mesma lógica pro card de config de comissões
      const cardComis = document.getElementById('card-config-comissoes');
      const sess = getSessao();
      const isAdmin = sess && sess.papel === 'admin';
      if (cardGestao) {
        if (isAdmin) {
          cardGestao.style.display = '';
          carregarUsuarios();
        } else {
          cardGestao.style.display = 'none';
        }
      }
      if (cardComis) {
        if (isAdmin) {
          cardComis.style.display = '';
          carregarConfigComissoes();
        } else {
          cardComis.style.display = 'none';
        }
      }
    }
    if (id==='prospeccao') carregarProspeccao();
    if (id==='em-projeto') carregarEmProjeto();
    if (id==='pool') carregarPool();
    if (id==='meus-fechamentos') carregarMeusFechamentos();
    if (id==='comissoes') { inicializarTelaComissoes(); carregarComissoes(); }
    if (id==='financeiro') { carregarRelatorioFinanceiro(); }
  }

  function abrirModal(id) { const el=document.getElementById(id); if(el) el.classList.add('open'); }
  function fecharModal(id) { const el=document.getElementById(id); if(el) el.classList.remove('open'); }
  function fecharSeClicar(e, id) { if(e.target===document.getElementById(id)) fecharModal(id); }

  // =============================================
  // DRAG & DROP DO MENU LATERAL
  // =============================================
  let _menuDraggingEl = null;

  function inicializarDragDropMenu() {
    const aside = document.querySelector('aside.sidebar nav');
    if (!aside) return;

    // Restaura ordem salva
    try {
      const ordemSalva = JSON.parse(localStorage.getItem('z_menu_ordem') || 'null');
      if (Array.isArray(ordemSalva) && ordemSalva.length) {
        aplicarOrdemMenu(ordemSalva);
      }
    } catch(e) { console.warn('[Zello] Falha ao restaurar ordem do menu:', e); }

    // Tornar todos os itens com data-page arrastáveis
    aside.querySelectorAll('.nav-item[data-page]').forEach(function(el){
      el.setAttribute('draggable', 'true');
    });

    aside.addEventListener('dragstart', function(e) {
      const item = e.target.closest('.nav-item[draggable="true"]');
      if (!item) return;
      _menuDraggingEl = item;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', item.dataset.page || '');
    });

    aside.addEventListener('dragend', function() {
      if (_menuDraggingEl) _menuDraggingEl.classList.remove('dragging');
      _menuDraggingEl = null;
      aside.querySelectorAll('.drag-over-top, .drag-over-bottom').forEach(function(el){
        el.classList.remove('drag-over-top','drag-over-bottom');
      });
    });

    aside.addEventListener('dragover', function(e) {
      const target = e.target.closest('.nav-item[draggable="true"]');
      if (!target || target === _menuDraggingEl) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      aside.querySelectorAll('.drag-over-top, .drag-over-bottom').forEach(function(el){
        if (el !== target) el.classList.remove('drag-over-top','drag-over-bottom');
      });
      const rect = target.getBoundingClientRect();
      const meio = rect.top + rect.height / 2;
      if (e.clientY < meio) {
        target.classList.add('drag-over-top');
        target.classList.remove('drag-over-bottom');
      } else {
        target.classList.add('drag-over-bottom');
        target.classList.remove('drag-over-top');
      }
    });

    aside.addEventListener('dragleave', function(e) {
      const target = e.target.closest('.nav-item[draggable="true"]');
      if (target) target.classList.remove('drag-over-top','drag-over-bottom');
    });

    aside.addEventListener('drop', function(e) {
      e.preventDefault();
      const target = e.target.closest('.nav-item[draggable="true"]');
      if (!target || !_menuDraggingEl || target === _menuDraggingEl) return;
      const rect = target.getBoundingClientRect();
      const meio = rect.top + rect.height / 2;
      if (e.clientY < meio) {
        target.parentNode.insertBefore(_menuDraggingEl, target);
      } else {
        target.parentNode.insertBefore(_menuDraggingEl, target.nextSibling);
      }
      target.classList.remove('drag-over-top','drag-over-bottom');
      salvarOrdemMenu();
    });
  }

  function salvarOrdemMenu() {
    const todos = document.querySelectorAll('aside.sidebar nav > *');
    const ordem = [];
    todos.forEach(function(el){
      if (el.classList.contains('nav-item') && el.dataset.page) {
        ordem.push({tipo: 'item', page: el.dataset.page});
      } else if (el.classList.contains('nav-label')) {
        ordem.push({tipo: 'label', txt: el.textContent});
      }
    });
    try { localStorage.setItem('z_menu_ordem', JSON.stringify(ordem)); } catch(e) {}
  }

  function aplicarOrdemMenu(ordem) {
    const nav = document.querySelector('aside.sidebar nav');
    if (!nav) return;
    const itensAtuais = {};
    nav.querySelectorAll('.nav-item[data-page]').forEach(function(el){
      itensAtuais[el.dataset.page] = el;
    });
    const labelsAtuais = [];
    nav.querySelectorAll('.nav-label').forEach(function(el){ labelsAtuais.push(el); });

    const novoFragmento = document.createDocumentFragment();
    const itensUsados = new Set();

    ordem.forEach(function(entry){
      if (entry.tipo === 'item' && itensAtuais[entry.page]) {
        novoFragmento.appendChild(itensAtuais[entry.page]);
        itensUsados.add(entry.page);
      } else if (entry.tipo === 'label') {
        const lab = labelsAtuais.find(function(l){
          return l.textContent.trim() === (entry.txt || '').trim() && !l._usado;
        });
        if (lab) {
          lab._usado = true;
          novoFragmento.appendChild(lab);
        }
      }
    });

    Object.keys(itensAtuais).forEach(function(k){
      if (!itensUsados.has(k)) novoFragmento.appendChild(itensAtuais[k]);
    });
    labelsAtuais.forEach(function(l){ delete l._usado; });

    nav.innerHTML = '';
    nav.appendChild(novoFragmento);
  }

  function resetarOrdemMenu() {
    if (!confirm('Restaurar ordem original do menu?')) return;
    try { localStorage.removeItem('z_menu_ordem'); } catch(e) {}
    location.reload();
  }

  function restaurarPendenciasConcluidas() {
    let conc = {};
    try { conc = JSON.parse(localStorage.getItem('z_pend_concluidos') || '{}'); } catch(e) {}
    const total = Object.keys(conc).length;
    if (total === 0) {
      alert('Nenhuma pendência marcada como concluída no momento.');
      return;
    }
    if (!confirm('🔄 Trazer de volta ' + total + ' pendência(s) marcada(s) como concluída(s)?\n\n(Notificações marcadas como respondidas no banco vão precisar ser reabertas manualmente em Notificações)')) return;
    try { localStorage.removeItem('z_pend_concluidos'); } catch(e) {}
    alert('✅ ' + total + ' pendência(s) restaurada(s) na lista. As que ainda fizerem sentido voltarão a aparecer no Dashboard.');
    if (typeof renderDashboard === 'function') renderDashboard();
  }

  // ============================================================
  // PROSPECÇÃO (FUNIL COMERCIAL — FASE 1)
  // ============================================================
  // Estado interno do filtro
  let _leadFiltroStatus = 'todos';
  let _leadFiltroBusca = '';

  function carregarProspeccao() {
    // FASE 11 FIX: sincroniza filtro de busca com o input visual.
    // Resolve bug: input com texto velho (cache/autofill) mas variável JS vazia
    // → ou o contrário (variável tem filtro mas input está limpo).
    const inp = document.getElementById('busca-leads');
    if (inp) {
      // Usa o valor atual do input como filtro (não força limpar — preserva o que usuário digitou)
      _leadFiltroBusca = inp.value.trim();
    }
    renderProspeccaoKanban();
  }

  function atualizarBadgeLeads() {
    // FASE 11 FIX: simplifica — os botões de filtro foram removidos na Fase 9 (kanban).
    // Só o badge do menu lateral precisa atualizar.
    const total = leads.length;
    const badge = document.getElementById('badge-leads');
    if (badge) badge.textContent = total > 0 ? total : '';
  }

  // ============================================================
  // FASE 9: KANBAN DA PROSPECÇÃO
  // ============================================================
  // (variáveis declaradas no topo: configFunil, _leadsExpandidos, _leadsKanbanListenersOk, _leadStatusInicial)
  const LEADS_POR_COLUNA = 10;

  async function carregarConfigFunil() {
    try {
      configFunil = await api('config_funil?ativo=eq.true&order=ordem.asc&select=*') || [];
    } catch(e) {
      console.error('Erro carregarConfigFunil:', e);
      configFunil = [];
    }
    // Fallback defensivo: se banco retornou vazio, usa defaults hardcoded
    if (!configFunil.length) {
      configFunil = [
        { codigo:'novo',       nome:'Novo',       icone:'🆕', cor:'#42A5F5', ordem:1 },
        { codigo:'em_contato', nome:'Em contato', icone:'📞', cor:'#FFA726', ordem:2 },
        { codigo:'proposta',   nome:'Proposta',   icone:'📄', cor:'#AB47BC', ordem:3 },
        { codigo:'aguardando', nome:'Aguardando', icone:'⏳', cor:'#FFB300', ordem:4 },
        { codigo:'perdido',    nome:'Perdido',    icone:'❌', cor:'#9E9E9E', ordem:5 }
      ];
    }
  }

  function renderProspeccao(filtroStatus, busca) {
    // FASE 9: agora chama o kanban. Filtros antigos foram removidos da UI (apenas busca permanece).
    _leadFiltroBusca = busca || _leadFiltroBusca || '';
    renderProspeccaoKanban();
  }

  // SEMANA 4.14: Apagar TODOS os leads em prospecção (modo teste)
  // - Só admin pode usar
  // - Dupla confirmação (texto + senha)
  // - NÃO apaga clientes "em_projeto" ou "cliente_ativo" — só leads em prospecção
  async function confirmarApagarTodosLeads() {
    if (!souAdmin()) {
      toastError('Apenas admin pode usar este botão.');
      return;
    }

    const qtdLeads = (leads || []).length;
    if (qtdLeads === 0) {
      toastInfo('Não há leads em prospecção pra apagar.');
      return;
    }

    // ONDA 2: zConfirm + zPrompt em vez de nativos
    // 1ª confirmação: explica o que vai acontecer
    const ok1 = await zConfirm(
      '⚠️ APAGAR TODOS OS LEADS EM PROSPECÇÃO?\n\n' +
      '• Vai apagar: ' + qtdLeads + ' lead(s)\n' +
      '• NÃO afeta: clientes "em projeto" ou "ativos"\n' +
      '• NÃO afeta: usuários, configurações, propriedades\n\n' +
      'Esta ação é IRREVERSÍVEL.',
      { tipo:'erro', titulo:'Apagar todos os leads', btnOk:'Continuar', btnCancel:'Cancelar' }
    );
    if (!ok1) return;

    // 2ª confirmação: digite "APAGAR" pra confirmar
    const txt = await zPrompt(
      'Digite APAGAR (em maiúsculas) pra confirmar a exclusão de ' + qtdLeads + ' leads:',
      '',
      { titulo:'⚠️ Última confirmação', placeholder:'APAGAR', btnOk:'Confirmar', tipo:'erro' }
    );
    if (txt !== 'APAGAR') {
      toastInfo('Cancelado. Nenhum lead foi apagado.');
      return;
    }

    // Executa
    try {
      const ids = leads.map(function(l){ return l.id; }).filter(function(id){ return !!id; });
      if (ids.length === 0) return;

      // Apaga em lote — passa lista de IDs no filter
      const filtro = 'id=in.(' + ids.map(function(id){ return encodeURIComponent(id); }).join(',') + ')';
      const r = await fetch(SUPABASE_URL + '/rest/v1/clientes?' + filtro + '&status_funil=eq.prospeccao', {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'return=minimal' }
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);

      toastSuccess('🗑️ ' + qtdLeads + ' lead(s) apagado(s)!', 4500);
      await carregarDados();
      renderProspeccaoKanban();
    } catch(e) {
      console.error('Erro apagar todos:', e);
      toastError('Erro ao apagar: ' + (e.message || ''));
    }
  }

  // Mostra o botão se for admin (chamado no boot)
  function _atualizarBotaoApagarTodos() {
    const btn = document.getElementById('btn-apagar-todos-leads');
    if (!btn) return;
    btn.style.display = souAdmin() ? '' : 'none';
  }

  function renderProspeccaoKanban() {
    const wrapper = document.getElementById('kanban-prospeccao-wrapper');
    if (!wrapper) return;

    // SEMANA 4.14: mostra/esconde botão de apagar todos conforme papel
    _atualizarBotaoApagarTodos();

    // Garante config carregado
    if (!configFunil.length) {
      // Race condition de boot: chama async e re-renderiza depois
      carregarConfigFunil().then(renderProspeccaoKanban);
      return;
    }

    // Filtra leads por busca
    let listaTodos = leads.slice();
    if (_leadFiltroBusca) {
      const q = _leadFiltroBusca.toLowerCase().trim();
      listaTodos = listaTodos.filter(function(l) {
        return (l.nome||'').toLowerCase().indexOf(q) >= 0
          || (l.cpf_cnpj||'').toLowerCase().indexOf(q) >= 0
          || (l.cidade||'').toLowerCase().indexOf(q) >= 0
          || (l.observacoes_lead||'').toLowerCase().indexOf(q) >= 0;
      });
    }

    // Monta colunas
    let html = '';
    configFunil.forEach(function(col) {
      const codigo = col.codigo;
      const cor = col.cor || '#1565C0';
      const icone = col.icone || '';
      const nome = col.nome || codigo;

      // Filtra leads desta coluna
      const leadsCol = listaTodos.filter(function(l) {
        return (l.status_lead || 'novo') === codigo;
      });
      // Ordena: mais novo primeiro
      leadsCol.sort(function(a, b) {
        const da = new Date(a.criado_em || 0);
        const db = new Date(b.criado_em || 0);
        return db - da;
      });

      const total = leadsCol.length;
      const expandido = !!_leadsExpandidos[codigo];
      const mostrar = expandido ? total : Math.min(LEADS_POR_COLUNA, total);
      const visiveis = leadsCol.slice(0, mostrar);

      // FASE 10: Soma das propostas (mais recente) de todos os leads desta coluna
      let somaPropostas = 0;
      leadsCol.forEach(function(l) {
        const propostasDoLead = (typeof propostas !== 'undefined' ? propostas : [])
          .filter(function(p){ return p.cliente_id === l.id; });
        if (propostasDoLead.length) {
          // Proposta mais recente (propostas já vêm ordenadas DESC por número)
          somaPropostas += parseFloat(propostasDoLead[0].valor_total) || 0;
        } else if (l.valor_proposta) {
          // Fallback: valor de proposta cru cadastrado no lead (sem PDF gerado)
          somaPropostas += parseFloat(l.valor_proposta) || 0;
        }
      });
      const somaHtml = somaPropostas > 0
        ? '<div class="kanban-col-soma">💰 ' + fmtMoeda(somaPropostas) + '</div>'
        : '';

      let cardsHtml = '';
      if (!total) {
        cardsHtml = '<div class="kanban-col-empty">Vazio</div>';
      } else {
        cardsHtml = visiveis.map(function(l) {
          return renderCardLead(l, codigo === 'perdido');
        }).join('');
      }

      // Botão "ver mais" se houver leads não exibidos
      let verMaisHtml = '';
      if (total > LEADS_POR_COLUNA) {
        if (expandido) {
          verMaisHtml = '<button class="kanban-col-ver-mais" onclick="toggleVerMaisFunil(\'' + codigo + '\')">▲ Mostrar menos</button>';
        } else {
          verMaisHtml = '<button class="kanban-col-ver-mais" onclick="toggleVerMaisFunil(\'' + codigo + '\')">▼ Ver mais (' + (total - LEADS_POR_COLUNA) + ')</button>';
        }
      }

      html += '<div class="kanban-col" data-funil="' + codigo + '" style="--col-color:' + cor + ';">' +
        '<div class="kanban-col-header">' +
          '<span class="kanban-col-titulo">' + icone + ' ' + escapeHtml(nome) + '</span>' +
          '<span class="kanban-col-count">' + total + '</span>' +
        '</div>' +
        somaHtml +
        '<div class="kanban-col-body" id="col-funil-' + codigo + '">' +
          cardsHtml +
          verMaisHtml +
          '<button class="kanban-col-add-btn" onclick="abrirCadastroLeadComStatus(\'' + codigo + '\')">+ Adicionar lead aqui</button>' +
        '</div>' +
      '</div>';
    });

    wrapper.innerHTML = html;

    // Drag-and-drop setup
    setupDragLeadsKanban();
  }

  function renderCardLead(l, isPerdido) {
    // Conta propriedades e pontos do lead
    const propsLead = propriedades.filter(function(p){ return p.cliente_id === l.id; });
    const cidade = l.cidade || (propsLead[0] && propsLead[0].cidade) || '';

    // Valor da proposta (mais recente)
    const propostasDoLead = (typeof propostas !== 'undefined' ? propostas : [])
      .filter(function(p){ return p.cliente_id === l.id; });
    const propostaMaisRecente = propostasDoLead[0]; // já ordenadas DESC por numero
    const valorTexto = propostaMaisRecente && propostaMaisRecente.valor_total
      ? fmtMoeda(propostaMaisRecente.valor_total)
      : (l.valor_proposta ? fmtMoeda(l.valor_proposta) : '');

    // Última visita: pega historico_contatos mais recente desse lead (se carregado)
    let ultimoContatoStr = '';
    let diasDesdeContato = null;
    if (typeof historicoContatosCache !== 'undefined' && historicoContatosCache[l.id]) {
      const hist = historicoContatosCache[l.id];
      if (hist && hist.length) {
        const ultimo = hist[0];
        const dt = new Date(ultimo.criado_em || ultimo.data_contato);
        if (!isNaN(dt)) {
          diasDesdeContato = Math.floor((Date.now() - dt) / 86400000);
        }
      }
    }
    if (diasDesdeContato === null && l.criado_em) {
      const dt = new Date(l.criado_em);
      if (!isNaN(dt)) diasDesdeContato = Math.floor((Date.now() - dt) / 86400000);
    }
    if (diasDesdeContato !== null) {
      if (diasDesdeContato === 0) ultimoContatoStr = 'hoje';
      else if (diasDesdeContato === 1) ultimoContatoStr = 'ontem';
      else ultimoContatoStr = diasDesdeContato + 'd';
    }

    const obs = l.observacoes_lead || '';
    // SEMANA 4.14: alerta de urgência por inatividade
    // 0-2d = OK (verde), 3-6d = AVISAR (laranja), 7+d = URGENTE (vermelho pulsante)
    const isContatoAntigo = diasDesdeContato !== null && diasDesdeContato >= 30;
    const isUrgente3d = diasDesdeContato !== null && diasDesdeContato >= 3 && diasDesdeContato < 7 && !isPerdido;
    const isUrgenteCritico = diasDesdeContato !== null && diasDesdeContato >= 7 && !isPerdido;

    // FASE 14.2: bolinha de cor do hunter (admin vê, hunter não precisa)
    let bolinhaCor = '';
    if (souAdmin() && l.hunter_id) {
      const hunterDono = (_usuariosCache || []).find(function(u){ return u.id === l.hunter_id; });
      if (hunterDono && hunterDono.cor && CORES_TIMES[hunterDono.cor]) {
        const info = CORES_TIMES[hunterDono.cor];
        bolinhaCor = '<span title="Hunter ' + escapeHtml(info.nome) + '" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + info.hex + ';margin-right:6px;vertical-align:middle;border:1px solid rgba(0,0,0,0.15);"></span>';
      }
    } else if (souAdmin() && !l.hunter_id) {
      // Admin vê pool (sem dono) com bolinha cinza-clara
      bolinhaCor = '<span title="Sem dono (Pool)" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#e5e7eb;margin-right:6px;vertical-align:middle;border:1px dashed #9ca3af;"></span>';
    }

    // SEMANA 4.9: monta metas em grid 2x2 (props + valor / telefone + data)
    const metas = [];
    if (propsLead.length) {
      metas.push('<span class="lead-card-meta">🏡 ' + propsLead.length + (propsLead.length === 1 ? ' prop' : ' props') + '</span>');
    }
    if (valorTexto) {
      metas.push('<span class="lead-card-meta valor">💰 ' + valorTexto + '</span>');
    }
    if (l.telefone1) {
      metas.push('<span class="lead-card-meta">📞 ' + escapeHtml(l.telefone1) + '</span>');
    }
    if (ultimoContatoStr) {
      // SEMANA 4.14: classe visual conforme urgência
      let clsMetaData = '';
      let iconeData = '📅';
      if (isUrgenteCritico) { clsMetaData = 'urgente-critico'; iconeData = '🚨'; }
      else if (isUrgente3d) { clsMetaData = 'urgente'; iconeData = '⚠️'; }
      else if (isContatoAntigo) clsMetaData = 'atrasado';
      metas.push('<span class="lead-card-meta ' + clsMetaData + '" title="Dias sem interação">' + iconeData + ' ' + ultimoContatoStr + '</span>');
    }
    const metasHtml = metas.join('');

    // SEMANA 4.14: badge superior de URGÊNCIA (3+ dias sem contato)
    let badgeUrgencia = '';
    if (isUrgenteCritico) {
      badgeUrgencia = '<div class="lead-card-badge-urg critico" title="' + diasDesdeContato + ' dias sem contato — URGENTE!">🚨 ' + diasDesdeContato + 'd sem contato</div>';
    } else if (isUrgente3d) {
      badgeUrgencia = '<div class="lead-card-badge-urg aviso" title="' + diasDesdeContato + ' dias sem contato">⚠️ ' + diasDesdeContato + 'd sem contato</div>';
    }

    return '<div class="lead-card' + (isPerdido ? ' perdido' : '') +
        (isUrgenteCritico ? ' lead-urg-critico' : (isUrgente3d ? ' lead-urg-aviso' : '')) + '" ' +
      'data-lead-id="' + l.id + '" ' +
      'draggable="true" ' +
      'onclick="verLead(\'' + l.id + '\')">' +
      badgeUrgencia +
      '<div class="lead-card-nome" title="' + escapeHtml(l.nome || '') + '">' + bolinhaCor + escapeHtml(l.nome || '(sem nome)') + '</div>' +
      (cidade ? '<div class="lead-card-cidade">📍 ' + escapeHtml(cidade) + '</div>' : '') +
      (metas.length ? '<div class="lead-card-metas">' + metasHtml + '</div>' : '') +
      (obs ? '<div class="lead-card-obs" title="' + escapeHtml(obs) + '">' + escapeHtml(obs) + '</div>' : '') +
    '</div>';
  }

  function toggleVerMaisFunil(codigo) {
    _leadsExpandidos[codigo] = !_leadsExpandidos[codigo];
    renderProspeccaoKanban();
  }

  // ============================================================
  // DRAG-AND-DROP DE LEADS
  // ============================================================
  let _dragLeadId = null;
  let _dragLeadFromFunil = null;

  function setupDragLeadsKanban() {
    // SEMANA 4.12: usa propriedades (ondragstart/ondrop) em vez de addEventListener.
    // Por que? wrapper.innerHTML = '...' DESTRÓI os elementos antigos com seus listeners,
    // mas a propriedade direta (ondragstart) é idempotente: sobrescreve em vez de duplicar.
    // Isso elimina QUALQUER risco de leak, mesmo em browsers que mantêm refs.
    document.querySelectorAll('#kanban-prospeccao-wrapper .lead-card').forEach(function(card) {
      card.ondragstart = onDragLeadStart;
      card.ondragend = onDragLeadEnd;
    });

    document.querySelectorAll('#kanban-prospeccao-wrapper .kanban-col-body').forEach(function(col) {
      col.ondragover = onDragLeadOver;
      col.ondragleave = onDragLeadLeave;
      col.ondrop = onDropLead;
    });
  }

  function onDragLeadStart(e) {
    _dragLeadId = e.currentTarget.dataset.leadId;
    const colBody = e.currentTarget.closest('.kanban-col');
    _dragLeadFromFunil = colBody ? colBody.dataset.funil : null;
    e.currentTarget.style.opacity = '0.4';
    if (e.dataTransfer) { e.dataTransfer.effectAllowed = 'move'; }
  }

  function onDragLeadEnd(e) {
    e.currentTarget.style.opacity = '1';
  }

  function onDragLeadOver(e) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
    e.currentTarget.style.background = '#E3F2FD';
  }

  function onDragLeadLeave(e) {
    e.currentTarget.style.background = '';
  }

  async function onDropLead(e) {
    e.preventDefault();
    e.currentTarget.style.background = '';
    if (!_dragLeadId) return;
    const colEl = e.currentTarget.closest('.kanban-col');
    if (!colEl) return;
    const novoFunil = colEl.dataset.funil;
    if (!novoFunil || novoFunil === _dragLeadFromFunil) return;

    // FIX BUG #16: confirma se está arrastando pra "Perdido" (ação destrutiva)
    if (novoFunil === 'perdido') {
      const ok = await zConfirm('Marcar este lead como PERDIDO?\n\nUse essa opção quando o cliente não fechou negócio.\n\nVocê pode reverter abrindo o lead e clicando "↩ Reverter".', { tipo:'erro', btnOk:'Sim, perdido' });
      if (!ok) {
        // Volta visualmente recarregando
        renderProspeccaoKanban();
        _dragLeadId = null;
        _dragLeadFromFunil = null;
        return;
      }
    }

    await mudarStatusLead(_dragLeadId, novoFunil);
    _dragLeadId = null;
    _dragLeadFromFunil = null;
  }

  async function mudarStatusLead(leadId, novoStatus) {
    const l = leads.find(function(x){ return x.id === leadId; });
    if (!l) return;
    // Otimista: atualiza local antes do PATCH
    l.status_lead = novoStatus;
    renderProspeccaoKanban();

    try {
      const r = await api('clientes?id=eq.' + leadId, 'PATCH', {
        status_lead: novoStatus
      }, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));
    } catch(e) {
      console.error('Erro mudarStatusLead:', e);
      alert('Erro ao mover lead: ' + (e.message || e));
      // Rollback: recarrega tudo
      await carregarDados();
    }
  }

  // FASE 12: Mover lead pra coluna anterior/seguinte (sem drag)
  async function moverLeadColuna(direcao) {
    if (!leadAtualId) return;
    const l = leads.find(function(x){ return x.id === leadAtualId; });
    if (!l) return;

    // Encontra ordem atual no configFunil
    const atual = l.status_lead || 'novo';
    const idxAtual = configFunil.findIndex(function(c){ return c.codigo === atual; });
    if (idxAtual < 0) {
      alert('Status atual desconhecido: ' + atual);
      return;
    }

    let novoIdx = direcao === 'voltar' ? idxAtual - 1 : idxAtual + 1;
    if (novoIdx < 0) {
      alert('Já está na primeira coluna.');
      return;
    }
    if (novoIdx >= configFunil.length) {
      alert('Já está na última coluna.');
      return;
    }

    const novoStatus = configFunil[novoIdx].codigo;
    const novoNome = configFunil[novoIdx].nome;

    // FIX BUG #10: bloqueia avançar pra 'perdido' silenciosamente
    if (direcao === 'avancar' && novoStatus === 'perdido') {
      alert('Pra marcar como "Perdido", use o botão dedicado ❌ Perdido (em vez de Avançar →).\n\nIsso garante que você documente o motivo.');
      return;
    }

    await mudarStatusLead(leadAtualId, novoStatus);

    // Atualiza subtítulo do modal (status mudou)
    const stLabels = {
      novo: 'Novo', em_contato: 'Em contato', proposta: 'Proposta',
      aguardando: 'Aguardando', perdido: 'Perdido'
    };
    const sub = document.getElementById('ver-lead-sub');
    if (sub) {
      sub.textContent = (l.cpf_cnpj || 'sem CPF/CNPJ') + ' · ' + (stLabels[novoStatus] || novoStatus);
    }

    // Atualiza select de status na aba Dados (se existir)
    const selStatus = document.getElementById('ver-lead-status');
    if (selStatus) selStatus.value = novoStatus;

    // Feedback discreto no botão
    const btnId = direcao === 'voltar' ? 'btn-lead-voltar-col' : 'btn-lead-avancar-col';
    const btn = document.getElementById(btnId);
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '✓ ' + novoNome;
      btn.disabled = true;
      setTimeout(function(){
        btn.textContent = orig;
        btn.disabled = false;
      }, 1500);
    }

    // Atualiza estado dos botões (desabilita se está na primeira/última)
    atualizarBotoesMoverLead();
  }

  // FASE 14.4 ajustes: Marca lead como PERDIDO direto
  // SEMANA 4.16: Toggle do menu "Mais" do lead
  function toggleMenuLeadMais(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('menu-lead-mais');
    if (!menu) return;
    const visivel = menu.style.display === 'block';
    menu.style.display = visivel ? 'none' : 'block';
    if (!visivel) {
      // Fecha ao clicar fora
      setTimeout(function(){
        document.addEventListener('click', _fecharMenuLeadMais, { once: true });
      }, 50);
    }
  }
  function _fecharMenuLeadMais() {
    const menu = document.getElementById('menu-lead-mais');
    if (menu) menu.style.display = 'none';
  }

  async function marcarLeadPerdido() {
    if (!leadAtualId) return;
    const l = leads.find(function(x){ return x.id === leadAtualId; });
    if (!l) return;

    // Já está perdido?
    if (l.status_lead === 'perdido') {
      if (!(await zConfirm('Este lead já está marcado como PERDIDO.\n\nDeseja REVERTER pra "Novo"?', { tipo:'info', btnOk:'Reverter pra Novo' }))) return;
      try {
        await mudarStatusLead(leadAtualId, 'novo');
        fecharModal('ov-ver-lead');
        zAlert('✓ Lead voltou pra "Novo".', 'sucesso');
      } catch(e) { zAlert('Erro: ' + (e.message || ''), 'erro'); }
      return;
    }

    // ONDA 2: zPrompt em vez de prompt nativo
    const motivo = await zPrompt(
      'Por que este lead está sendo marcado como PERDIDO?\n\n(opcional — pode deixar em branco)\n\nExemplos: cliente sem interesse, preço alto, cliente sumiu, concorrente fechou.',
      '',
      { titulo: 'Marcar como perdido', placeholder: 'Motivo (opcional)', btnOk: 'Continuar', tipo:'aviso' }
    );
    if (motivo === null) return;   // cancelou

    if (!(await zConfirm('Marcar este lead como PERDIDO?\n\nLead vai pra coluna "Perdido" do kanban.\nVocê pode reverter depois clicando no mesmo botão.', { tipo:'erro', btnOk:'Sim, perdido' }))) return;

    try {
      // Atualiza obs com motivo (se informado) + muda status
      const novaObs = motivo
        ? ((l.observacoes_lead || '') + '\n\n[PERDIDO em ' + new Date().toLocaleDateString('pt-BR') + ']: ' + motivo).trim()
        : l.observacoes_lead;

      const r = await api('clientes?id=eq.' + leadAtualId, 'PATCH', {
        status_lead: 'perdido',
        observacoes_lead: novaObs
      }, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));

      // Atualiza local
      l.status_lead = 'perdido';
      l.observacoes_lead = novaObs;

      fecharModal('ov-ver-lead');
      zAlert('✓ Lead marcado como PERDIDO.', 'sucesso');
      renderProspeccaoKanban();
    } catch(e) {
      console.error('Erro marcarLeadPerdido:', e);
      zAlert('Erro: ' + (e.message || ''), 'erro');
    }
  }

  // ============================================================
  // FASE 14.4 ajustes: CONTATOS ADICIONAIS DO LEAD
  // ============================================================
  let _contatosLeadCache = [];

  async function carregarContatosAdicionaisLead(cid) {
    if (!cid) return;
    const lista = document.getElementById('lead-contatos-lista');
    const count = document.getElementById('lead-contatos-count');
    if (!lista) return;

    try {
      const r = await fetch(SUPABASE_URL + '/rest/v1/contatos?cliente_id=eq.' + cid + '&select=*&order=principal.desc,nome.asc', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      _contatosLeadCache = await r.json();
      renderContatosAdicionaisLead();
    } catch(e) {
      console.error('Erro carregarContatosAdicionaisLead:', e);
      lista.innerHTML = '<div style="font-size:12px;color:#C62828;padding:8px;">Erro ao carregar: ' + escapeHtml(e.message || '') + '</div>';
    }
  }

  function renderContatosAdicionaisLead() {
    const lista = document.getElementById('lead-contatos-lista');
    const count = document.getElementById('lead-contatos-count');
    if (!lista) return;

    if (count) {
      count.textContent = _contatosLeadCache.length === 0 ? '' : '(' + _contatosLeadCache.length + ')';
    }

    if (_contatosLeadCache.length === 0) {
      lista.innerHTML = '<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:8px;font-style:italic;">Nenhum contato adicional ainda.</div>';
      return;
    }

    lista.innerHTML = _contatosLeadCache.map(function(c){
      const papelBadge = c.papel ? '<span style="background:#E3F2FD;color:#1565C0;padding:2px 6px;border-radius:10px;font-size:10px;font-weight:600;margin-left:6px;">' + escapeHtml(c.papel) + '</span>' : '';
      const principalBadge = c.principal ? '<span style="background:#E8F5E9;color:#2E7D32;padding:2px 6px;border-radius:10px;font-size:10px;font-weight:600;margin-left:6px;">⭐ PRINCIPAL</span>' : '';

      return '<div onclick="editarContatoLead(\'' + escapeHtml(c.id) + '\')" ' +
        'style="background:white;border:1px solid #e5e7eb;border-radius:8px;padding:10px 12px;margin-bottom:6px;cursor:pointer;transition:all 0.15s;" ' +
        'onmouseover="this.style.borderColor=\'#1565C0\';this.style.background=\'#f8fbff\';" ' +
        'onmouseout="this.style.borderColor=\'#e5e7eb\';this.style.background=\'white\';">' +
        '<div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;margin-bottom:4px;">' +
          '<strong style="font-size:13px;color:var(--text);">' + escapeHtml(c.nome || '(sem nome)') + '</strong>' +
          papelBadge + principalBadge +
        '</div>' +
        '<div style="display:flex;gap:14px;font-size:12px;color:var(--text-muted);flex-wrap:wrap;">' +
          (c.telefone ? '<span>📞 ' + escapeHtml(c.telefone) + '</span>' : '') +
          (c.email ? '<span>✉️ ' + escapeHtml(c.email) + '</span>' : '') +
          (!c.telefone && !c.email ? '<span style="font-style:italic;">sem contato cadastrado</span>' : '') +
        '</div>' +
      '</div>';
    }).join('');
  }

  function adicionarContatoLead() {
    if (!leadAtualId) return;
    document.getElementById('contato-lead-id').value = '';
    document.getElementById('contato-lead-modal-titulo').textContent = '+ Adicionar contato';
    document.getElementById('contato-lead-nome').value = '';
    document.getElementById('contato-lead-papel').value = '';
    document.getElementById('contato-lead-tel').value = '';
    document.getElementById('contato-lead-email').value = '';
    document.getElementById('btn-excluir-contato-lead').style.display = 'none';
    const erro = document.getElementById('contato-lead-modal-erro');
    if (erro) erro.style.display = 'none';
    abrirModal('ov-cadastro-contato-lead');
  }

  function editarContatoLead(contatoId) {
    const c = _contatosLeadCache.find(function(x){ return x.id === contatoId; });
    if (!c) return;
    document.getElementById('contato-lead-id').value = c.id;
    document.getElementById('contato-lead-modal-titulo').textContent = '✏️ Editar contato';
    document.getElementById('contato-lead-nome').value = c.nome || '';
    document.getElementById('contato-lead-papel').value = c.papel || '';
    document.getElementById('contato-lead-tel').value = c.telefone || '';
    document.getElementById('contato-lead-email').value = c.email || '';
    document.getElementById('btn-excluir-contato-lead').style.display = '';
    const erro = document.getElementById('contato-lead-modal-erro');
    if (erro) erro.style.display = 'none';
    abrirModal('ov-cadastro-contato-lead');
  }

  async function salvarContatoLead() {
    if (!leadAtualId) return;
    const id = document.getElementById('contato-lead-id').value;
    const nome = (document.getElementById('contato-lead-nome').value || '').trim();
    const papel = document.getElementById('contato-lead-papel').value;
    const tel = (document.getElementById('contato-lead-tel').value || '').trim();
    const email = (document.getElementById('contato-lead-email').value || '').trim();
    const erroEl = document.getElementById('contato-lead-modal-erro');
    const btn = document.getElementById('btn-salvar-contato-lead');

    function showErro(msg) {
      erroEl.textContent = msg;
      erroEl.style.display = 'block';
    }
    erroEl.style.display = 'none';

    if (!nome) return showErro('Nome do contato é obrigatório.');
    if (!tel && !email) return showErro('Informe ao menos 1: telefone ou e-mail.');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showErro('E-mail inválido.');

    btn.disabled = true;
    btn.textContent = '⏳ Salvando...';

    try {
      const payload = {
        cliente_id: leadAtualId,
        nome: nome.toUpperCase(),
        papel: papel || null,
        telefone: tel || null,
        email: email || null,
        principal: false
      };

      let r;
      if (id) {
        r = await fetch(SUPABASE_URL + '/rest/v1/contatos?id=eq.' + id, {
          method: 'PATCH',
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
          body: JSON.stringify(payload)
        });
      } else {
        r = await fetch(SUPABASE_URL + '/rest/v1/contatos', {
          method: 'POST',
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
          body: JSON.stringify(payload)
        });
      }
      if (!r.ok) throw new Error('HTTP ' + r.status);

      fecharModal('ov-cadastro-contato-lead');
      await carregarContatosAdicionaisLead(leadAtualId);
    } catch(e) {
      console.error('Erro salvarContatoLead:', e);
      showErro('Erro: ' + (e.message || ''));
    } finally {
      btn.disabled = false;
      btn.textContent = '💾 Salvar';
    }
  }

  async function excluirContatoLead() {
    const id = document.getElementById('contato-lead-id').value;
    if (!id) return;
    if (!(await zConfirm('Excluir este contato?\n\nEsta ação não pode ser desfeita.', { tipo:'erro', btnOk:'Excluir' }))) return;

    try {
      const r = await fetch(SUPABASE_URL + '/rest/v1/contatos?id=eq.' + id, {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);

      fecharModal('ov-cadastro-contato-lead');
      await carregarContatosAdicionaisLead(leadAtualId);
    } catch(e) {
      console.error('Erro excluirContatoLead:', e);
      alert('Erro: ' + (e.message || ''));
    }
  }

  // FASE 12: Atualiza estado dos botões voltar/avançar (desabilita se está no limite)
  function atualizarBotoesMoverLead() {
    if (!leadAtualId) return;
    const l = leads.find(function(x){ return x.id === leadAtualId; });
    if (!l) return;
    const atual = l.status_lead || 'novo';
    const idxAtual = configFunil.findIndex(function(c){ return c.codigo === atual; });

    const btnVoltar = document.getElementById('btn-lead-voltar-col');
    const btnAvancar = document.getElementById('btn-lead-avancar-col');

    if (btnVoltar) {
      btnVoltar.disabled = (idxAtual <= 0);
      btnVoltar.style.opacity = btnVoltar.disabled ? '0.4' : '1';
    }
    if (btnAvancar) {
      btnAvancar.disabled = (idxAtual >= configFunil.length - 1);
      btnAvancar.style.opacity = btnAvancar.disabled ? '0.4' : '1';
    }
  }

  // ============================================================
  // ADICIONAR LEAD EM COLUNA ESPECÍFICA
  // ============================================================
  // (variável _leadStatusInicial declarada no topo)

  function abrirCadastroLeadComStatus(codigo) {
    _leadStatusInicial = codigo || 'novo';
    abrirCadastroLead();
  }

  // ============================================================
  // PERSONALIZAR COLUNAS DO FUNIL
  // ============================================================
  function abrirPersonalizarFunil() {
    if (!configFunil.length) {
      alert('Colunas ainda não carregadas. Aguarde alguns segundos.');
      return;
    }
    const cont = document.getElementById('config-funil-lista');
    if (!cont) return;

    cont.innerHTML = configFunil.map(function(c, idx) {
      const codigo = c.codigo;
      const cor = c.cor || '#1565C0';
      return '<div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;padding:10px;background:#f8f9fb;border-radius:8px;border-left:4px solid ' + cor + ';">' +
        '<input type="text" class="fi" id="cf-icone-' + codigo + '" value="' + escapeHtml(c.icone||'') + '" maxlength="3" style="width:50px;text-align:center;font-size:18px;" placeholder="🆕" />' +
        '<input type="text" class="fi upper" id="cf-nome-' + codigo + '" value="' + escapeHtml(c.nome||'') + '" maxlength="40" style="flex:1;" placeholder="Nome da coluna" />' +
        '<input type="color" class="fi" id="cf-cor-' + codigo + '" value="' + cor + '" style="width:50px;height:38px;padding:2px;cursor:pointer;" title="Cor da coluna" />' +
        '<span style="font-size:10px;color:var(--text-hint);width:80px;">Código:<br/><code>' + codigo + '</code></span>' +
      '</div>';
    }).join('') +
    '<div style="margin-top:14px;padding:10px;background:#FFF3E0;border-radius:8px;font-size:11px;color:#9C7A00;">' +
      '⚠️ O <strong>código</strong> de cada coluna NÃO pode ser alterado (é usado internamente). ' +
      'Você pode alterar apenas <strong>ícone, nome e cor</strong>. As mudanças afetam todos os usuários do sistema.' +
    '</div>';

    abrirModal('ov-personalizar-funil');
  }

  async function salvarPersonalizacaoFunil() {
    const btn = event && event.target;
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Salvando...'; }

    try {
      const updates = configFunil.map(function(c) {
        const novoIcone = document.getElementById('cf-icone-' + c.codigo).value.trim();
        const novoNome = document.getElementById('cf-nome-' + c.codigo).value.trim();
        const novaCor = document.getElementById('cf-cor-' + c.codigo).value;
        return {
          id: c.id,
          icone: novoIcone || c.icone,
          nome: novoNome || c.nome,
          cor: novaCor || c.cor,
          atualizado_em: new Date().toISOString()
        };
      });

      // Validação: nomes não podem estar todos vazios
      const algumVazio = updates.find(function(u){ return !u.nome; });
      if (algumVazio) {
        alert('Todas as colunas precisam ter um nome.');
        return;
      }

      // PATCH em sequência (5 itens, baixo custo)
      for (let i = 0; i < updates.length; i++) {
        const u = updates[i];
        await api('config_funil?id=eq.' + u.id, 'PATCH', {
          icone: u.icone,
          nome: u.nome,
          cor: u.cor,
          atualizado_em: u.atualizado_em
        }, 'return=minimal');
      }

      await carregarConfigFunil();
      renderProspeccaoKanban();
      fecharModal('ov-personalizar-funil');
      alert('✓ Colunas atualizadas.');
    } catch(e) {
      console.error('Erro salvarPersonalizacaoFunil:', e);
      alert('Erro ao salvar: ' + (e.message || e));
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '💾 Salvar'; }
    }
  }

  // ============================================================
  // FASE 10: PERSONALIZAR ETAPAS DO PROJETO (Em Projeto)
  // ============================================================
  function abrirPersonalizarEtapas() {
    if (!ETAPAS_PROJETO.length) {
      alert('Etapas ainda não carregadas. Aguarde.');
      return;
    }
    const cont = document.getElementById('config-etapas-lista');
    if (!cont) return;

    cont.innerHTML = ETAPAS_PROJETO.map(function(e, idx) {
      const cor = e.cor || '#1565C0';
      return '<div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;padding:10px;background:#f8f9fb;border-radius:8px;border-left:4px solid ' + cor + ';">' +
        '<span style="font-size:11px;font-weight:700;color:var(--text-muted);width:60px;">Etapa ' + e.num + '</span>' +
        '<input type="text" class="fi" id="ce-icone-' + e.num + '" value="' + escapeHtml(e.icone||'') + '" maxlength="3" style="width:50px;text-align:center;font-size:18px;" placeholder="📋" />' +
        '<input type="text" class="fi" id="ce-nome-' + e.num + '" value="' + escapeHtml(e.nome||'') + '" maxlength="60" style="flex:1;" placeholder="Nome da etapa" />' +
      '</div>';
    }).join('') +
    '<div style="margin-top:14px;padding:10px;background:#FFF3E0;border-radius:8px;font-size:11px;color:#9C7A00;">' +
      '⚠️ Apenas <strong>nome e ícone</strong> são editáveis. O <strong>número da etapa</strong> (1-4) é estrutural e ' +
      'não pode ser alterado porque controla o fluxo dos projetos (vistoria → protocolo → análise → publicação).' +
    '</div>';

    abrirModal('ov-personalizar-etapas');
  }

  async function salvarPersonalizacaoEtapas() {
    const btn = event && event.target;
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Salvando...'; }

    try {
      for (let i = 0; i < ETAPAS_PROJETO.length; i++) {
        const e = ETAPAS_PROJETO[i];
        const novoIcone = document.getElementById('ce-icone-' + e.num).value.trim();
        const novoNome = document.getElementById('ce-nome-' + e.num).value.trim();
        if (!novoNome) {
          alert('Etapa ' + e.num + ' precisa de um nome.');
          if (btn) { btn.disabled = false; btn.textContent = '💾 Salvar'; }
          return;
        }
        const payload = {
          icone: novoIcone || e.icone,
          nome: novoNome,
          atualizado_em: new Date().toISOString()
        };
        if (e._id) {
          // Update existente
          await api('config_etapas_projeto?id=eq.' + e._id, 'PATCH', payload, 'return=minimal');
        } else {
          // Cria entrada se não tem (cenário de banco antigo sem seed)
          payload.numero = e.num;
          await api('config_etapas_projeto', 'POST', payload, 'return=minimal');
        }
        // Atualiza ETAPAS_PROJETO local pra refletir imediatamente
        ETAPAS_PROJETO[i].nome = payload.nome;
        ETAPAS_PROJETO[i].icone = payload.icone;
      }

      atualizarTitulosKanbanProjeto();
      fecharModal('ov-personalizar-etapas');
      alert('✓ Etapas atualizadas.');
    } catch(e) {
      console.error('Erro salvarPersonalizacaoEtapas:', e);
      alert('Erro ao salvar: ' + (e.message || e));
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '💾 Salvar'; }
    }
  }

  // Função antiga `filtrarStatusLead` ficou obsoleta (kanban substitui o filtro de status).
  // Mantida pra compatibilidade caso algum onclick antigo ainda chame.
  function filtrarStatusLead(status, btn) {
    // Sem efeito no kanban (status agora é cada coluna). Stub seguro.
  }

  function filtrarLeads(q) {
    _leadFiltroBusca = q || '';
    renderProspeccaoKanban();
  }

  // ============================================================
  // CADASTRO MANUAL DE LEAD
  // ============================================================
  function abrirCadastroLead() {
    document.getElementById('lead-eid').value = '';
    document.getElementById('lead-nome').value = '';
    document.getElementById('lead-doc').value = '';
    document.getElementById('lead-tel').value = '';
    document.getElementById('lead-email').value = '';
    document.getElementById('lead-obs').value = '';
    abrirModal('ov-novo-lead');
    // SEMANA 4.13: ativa auto-save
    setTimeout(function(){
      document.getElementById('lead-nome').focus();
      _instalarAutosaveDraft('ov-novo-lead');
    }, 60);
  }

  async function salvarLead() {
    const btn = document.getElementById('btn-salvar-lead');
    const nome = document.getElementById('lead-nome').value.trim();
    const doc = document.getElementById('lead-doc').value.trim();
    const tel = document.getElementById('lead-tel').value.trim();
    const email = document.getElementById('lead-email').value.trim();
    const obs = document.getElementById('lead-obs').value.trim();

    if (!nome) { alert('Nome é obrigatório.'); return; }
    if (!doc) { alert('CPF ou CNPJ é obrigatório.'); return; }
    const docLimpo = doc.replace(/\D/g,'');
    if (docLimpo.length !== 11 && docLimpo.length !== 14) { alert('CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos.'); return; }
    if (!validarDocumento(docLimpo)) { alert('CPF/CNPJ inválido (dígito verificador não confere).'); return; }

    // Detecta duplicidade — tanto entre clientes ativos quanto leads/em_projeto
    try {
      const existe = await api('clientes?cpf_cnpj=eq.' + encodeURIComponent(doc) + '&select=id,nome,status_funil');
      if (existe && existe.length > 0) {
        const c = existe[0];
        const status = c.status_funil || 'cliente_ativo';
        const stLabel = { prospeccao:'lead', em_projeto:'em projeto', cliente_ativo:'cliente ativo' }[status] || status;
        alert('Já existe um cadastro com este CPF/CNPJ:\n\n' + c.nome + '\n(status: ' + stLabel + ')\n\nNão é possível duplicar.');
        return;
      }
    } catch(e) { /* segue */ }

    btn.disabled = true; btn.textContent = '⏳ Salvando...';
    try {
      // FASE 14.2: define dono conforme papel
      const sessLead = getSessao();
      const huntId = (sessLead && sessLead.papel === 'hunter') ? sessLead.id : null;

      const payload = {
        nome: upper(nome),
        cpf_cnpj: doc,
        telefone1: tel || null,
        email: email || null,
        observacoes_lead: obs || null,
        ativo: true,
        status_funil: 'prospeccao',
        status_lead: _leadStatusInicial || 'novo',   // FASE 9: usa coluna escolhida
        origem_lead: 'manual',
        pin_hash: null,
        portal_ativo: false,
        // FASE 14.2: dono do lead
        hunter_id: huntId,
        data_captura: huntId ? new Date().toISOString() : null
      };
      const r = await api('clientes', 'POST', payload, 'return=representation');
      if (!r || !r.ok) throw new Error('Erro HTTP ' + (r ? r.status : '?'));
      const data = await r.json();
      const novoLead = data && data[0];
      if (!novoLead) throw new Error('Resposta sem dados');

      // FASE 9: reset pra próxima vez voltar a default
      _leadStatusInicial = 'novo';

      // FASE 11 FIX: limpa filtro de busca pra usuário VER o lead novo
      // (cenário: usuário tinha digitado algo, e depois criou lead que não bate com a busca)
      _leadFiltroBusca = '';
      const inpBusca = document.getElementById('busca-leads');
      if (inpBusca) inpBusca.value = '';

      fecharModal('ov-novo-lead');
      _limparDraft('ov-novo-lead');   // SEMANA 4.13: limpa draft
      await carregarDados();
      renderProspeccaoKanban();   // FASE 9: re-renderiza o kanban
      // Abre o lead recém-criado pra usuário começar a editar
      // FASE 13 hotfix: protege contra falha no verLead (ex: lead não populado ainda)
      setTimeout(function(){
        try {
          verLead(novoLead.id);
        } catch(eVer) {
          console.error('Aviso: não foi possível abrir o lead recém-criado:', eVer);
          // Lead JÁ FOI salvo no banco — o erro é só ao tentar abrir o modal.
          // Não mostra erro pro usuário porque o lead está OK; só deixa ele ver no kanban.
        }
      }, 200);
    } catch(e) {
      console.error('Erro salvarLead:', e);
      alert('Erro ao salvar lead: ' + (e.message || e));
    } finally {
      btn.disabled = false; btn.textContent = '💾 Salvar';
    }
  }

  // ============================================================
  // VER / EDITAR LEAD (com 3 abas)
  // ============================================================
  // SEMANA 4.17: Mini-histórico de propostas na aba Dados
  // SEMANA 4.19: Toggle bloco propriedades & pontos no card do lead
  function toggleBlocoLeadProps() {
    const conteudo = document.getElementById('lead-props-conteudo');
    const chevron = document.getElementById('lead-props-chevron');
    if (!conteudo) return;
    const aberto = conteudo.style.display !== 'none';
    conteudo.style.display = aberto ? 'none' : '';
    if (chevron) chevron.style.transform = aberto ? '' : 'rotate(180deg)';
  }

  // SEMANA 4.19: Renderiza propriedades + pontos do lead (dados importados da planilha)
  function _renderPropriedadesPontosLead(lead) {
    const bloco = document.getElementById('bloco-lead-props');
    const status = document.getElementById('lead-props-status');
    const lista = document.getElementById('lead-props-lista');
    if (!bloco || !lista || !lead) return;

    // Busca propriedades + usos vinculados a este cliente/lead
    const propsLead = (typeof propriedades !== 'undefined' ? propriedades : [])
      .filter(function(p){ return p.cliente_id === lead.id; });
    const usosLead = (typeof usos !== 'undefined' ? usos : [])
      .filter(function(u){ return u.cliente_id === lead.id; });

    // Atualiza contador no header
    if (status) {
      if (propsLead.length === 0 && usosLead.length === 0) {
        status.textContent = '(nenhum cadastrado)';
      } else {
        status.textContent = '(' + propsLead.length + ' propriedade' + (propsLead.length !== 1 ? 's' : '') +
          ' · ' + usosLead.length + ' ponto' + (usosLead.length !== 1 ? 's' : '') + ')';
      }
    }

    if (propsLead.length === 0 && usosLead.length === 0) {
      lista.innerHTML = '<div style="padding:14px;text-align:center;color:var(--text-muted);font-size:12px;font-style:italic;">Nenhuma propriedade ou ponto cadastrado ainda.<br/>Importe a planilha modelo pra popular automaticamente.</div>';
      return;
    }

    // Helpers
    function val(v) { return v == null || v === '' ? '—' : escapeHtml(String(v)); }
    function fmtDataPlanilha(s) {
      if (!s) return '—';
      const d = new Date(s + 'T12:00:00');
      return isNaN(d) ? s : d.toLocaleDateString('pt-BR');
    }

    let html = '';
    propsLead.forEach(function(prop){
      const usosProp = usosLead.filter(function(u){ return u.propriedade_id === prop.id; });
      html += '<div style="margin-bottom:14px;padding:12px;background:#FAFAFA;border-radius:8px;border:1px solid #E0E0E0;">';
      // Cabeçalho da propriedade
      html += '<div style="font-size:13px;font-weight:700;color:#E65100;margin-bottom:8px;display:flex;align-items:center;gap:6px;">';
      html += '🏞️ ' + val(prop.nome);
      if (prop.cidade) html += ' <span style="font-size:11px;color:var(--text-muted);font-weight:400;">— ' + val(prop.cidade);
      if (prop.estado || prop.uf) html += '/' + val(prop.estado || prop.uf);
      if (prop.cidade) html += '</span>';
      html += '</div>';
      // Dados da propriedade
      const linhas = [];
      if (prop.area_total_ha || prop.area_hectares) linhas.push('Área total: <strong>' + val(prop.area_total_ha || prop.area_hectares) + ' ha</strong>');
      if (prop.area_irrigada_ha) linhas.push('Área irrigada: <strong>' + val(prop.area_irrigada_ha) + ' ha</strong>');
      if (prop.latitude && prop.longitude) linhas.push('📍 ' + val(prop.latitude) + ' / ' + val(prop.longitude));
      if (linhas.length > 0) {
        html += '<div style="font-size:11px;color:var(--text);line-height:1.7;margin-bottom:8px;">' + linhas.join(' · ') + '</div>';
      }
      // Pontos da propriedade
      if (usosProp.length > 0) {
        usosProp.forEach(function(u){
          html += '<div style="margin-top:8px;padding:10px;background:white;border-radius:6px;border-left:3px solid #1976D2;">';
          html += '<div style="font-size:12px;font-weight:700;color:#1565C0;margin-bottom:6px;">💧 ' + val(u.descricao);
          if (u.tipo) html += ' <span style="font-size:10px;color:var(--text-muted);font-weight:400;text-transform:uppercase;">(' + val(u.tipo) + ')</span>';
          html += '</div>';

          // Grade de informações técnicas
          const infos = [];
          if (u.requerimento) infos.push({ k:'Requerimento', v: u.requerimento });
          if (u.portaria) infos.push({ k:'Portaria', v: u.portaria });
          if (u.processo) infos.push({ k:'Processo', v: u.processo });
          if (u.data_emissao) infos.push({ k:'Data emissão', v: fmtDataPlanilha(u.data_emissao) });
          if (u.prazo_meses || u.prazo_anos) {
            const meses = u.prazo_meses ? u.prazo_meses + ' meses' : (u.prazo_anos + ' anos');
            infos.push({ k:'Prazo', v: meses });
          }
          if (u.tipo_ato) infos.push({ k:'Tipo ato', v: u.tipo_ato });
          if (u.tipo_intervencao) infos.push({ k:'Intervenção', v: u.tipo_intervencao });
          if (u.tipo_captacao) infos.push({ k:'Captação', v: u.tipo_captacao });
          if (u.finalidade || u.finalidade_uso) infos.push({ k:'Finalidade', v: u.finalidade || u.finalidade_uso });
          if (u.corpo_hidrico || u.curso_dagua) infos.push({ k:'Corpo hídrico', v: u.corpo_hidrico || u.curso_dagua });
          if (u.bacia_hidrografica) infos.push({ k:'Bacia', v: u.bacia_hidrografica });
          if (u.latitude && u.longitude) infos.push({ k:'Coordenadas', v: u.latitude + ' / ' + u.longitude });
          else if (u.coordenada_lat && u.coordenada_long) infos.push({ k:'Coordenadas', v: u.coordenada_lat + ' / ' + u.coordenada_long });

          if (infos.length > 0) {
            html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:4px 12px;font-size:11px;color:var(--text);margin-bottom:6px;">';
            infos.forEach(function(info){
              html += '<div><span style="color:var(--text-muted);">' + info.k + ':</span> <strong>' + val(info.v) + '</strong></div>';
            });
            html += '</div>';
          }

          // Vazão (destaque)
          if (u.vazao_m3h || u.horas_uso_dia || u.dias_uso_mes || u.volume_diario_m3) {
            html += '<div style="margin-top:6px;padding:6px 8px;background:#E3F2FD;border-radius:4px;font-size:11px;color:#0d47a1;">';
            html += '⚙️ <strong>Vazão:</strong> ';
            const partes = [];
            if (u.vazao_m3h) partes.push(u.vazao_m3h + ' m³/h');
            if (u.horas_uso_dia) partes.push(u.horas_uso_dia + ' h/dia');
            if (u.dias_uso_mes) partes.push(u.dias_uso_mes + ' dias/mês');
            if (u.volume_diario_m3) partes.push('= ' + u.volume_diario_m3 + ' m³/dia');
            html += partes.join(' × ');
            html += '</div>';
          }

          html += '</div>';  // fim do ponto
        });
      } else {
        html += '<div style="font-size:11px;color:var(--text-muted);font-style:italic;margin-top:4px;">Sem pontos de captação cadastrados.</div>';
      }
      html += '</div>';  // fim da propriedade
    });

    lista.innerHTML = html;
  }

  function _renderMiniHistoricoPropostas(lead) {
    const cont = document.getElementById('ver-lead-mini-hist');
    const lista = document.getElementById('ver-lead-mini-hist-lista');
    if (!cont || !lista || !lead) return;

    const propostasLead = (typeof propostas !== 'undefined' ? propostas : [])
      .filter(function(p){ return p.cliente_id === lead.id; })
      .sort(function(a, b){ return (b.numero || 0) - (a.numero || 0); });

    if (propostasLead.length === 0) {
      cont.style.display = 'none';
      return;
    }
    cont.style.display = '';

    const statusMap = {
      rascunho: { ic:'📝', label:'rascunho', cor:'#E65100' },
      enviada:  { ic:'📤', label:'enviada', cor:'#1565C0' },
      aceita:   { ic:'✅', label:'aceita', cor:'#2E7D32' },
      recusada: { ic:'❌', label:'recusada', cor:'#C62828' },
      vencida:  { ic:'⏰', label:'vencida', cor:'#6b7280' }
    };

    // Mostra até 3 mais recentes; resto "ver mais"
    const exibir = propostasLead.slice(0, 3);
    const resto = propostasLead.length - exibir.length;

    lista.innerHTML = exibir.map(function(p){
      const st = statusMap[p.status] || statusMap.rascunho;
      const data = p.data_emissao ? new Date(p.data_emissao + 'T12:00:00').toLocaleDateString('pt-BR') : '—';
      const valor = 'R$ ' + (parseFloat(p.valor_total) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      return '<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #f0f1f3;">' +
        '<span style="font-size:14px;">' + st.ic + '</span>' +
        '<span style="font-weight:600;color:var(--text);">Nº ' + p.numero + '</span>' +
        '<span style="color:var(--text-muted);">·</span>' +
        '<span style="font-weight:600;color:#2E7D32;">' + valor + '</span>' +
        '<span style="color:var(--text-muted);">·</span>' +
        '<span style="color:' + st.cor + ';font-weight:600;text-transform:lowercase;">' + st.label + '</span>' +
        '<span style="color:var(--text-muted);margin-left:auto;font-size:10.5px;">' + data + '</span>' +
      '</div>';
    }).join('');
    if (resto > 0) {
      lista.innerHTML += '<div style="text-align:center;font-size:10.5px;color:var(--text-muted);margin-top:6px;">+ ' + resto + ' mais</div>';
    }
  }

  // SEMANA 4.17: Renderiza o badge no topo do lead com resumo de propostas
  function _renderBadgeTopoLead(lead) {
    const badge = document.getElementById('ver-lead-badge-topo');
    if (!badge || !lead) return;

    const propostasLead = (typeof propostas !== 'undefined' ? propostas : [])
      .filter(function(p){ return p.cliente_id === lead.id; });

    const cntRascunho = propostasLead.filter(function(p){ return p.status === 'rascunho'; }).length;
    const cntEnviada = propostasLead.filter(function(p){ return p.status === 'enviada'; }).length;
    const jaAssinada = !!lead.proposta_assinada_em;

    if (propostasLead.length === 0 && !jaAssinada) {
      badge.style.display = 'none';
      return;
    }
    badge.style.display = 'flex';

    let html = '<div style="display:flex;align-items:center;gap:10px;flex:1;flex-wrap:wrap;">';
    html += '<span style="font-weight:700;">📄 ' + propostasLead.length + ' proposta' + (propostasLead.length !== 1 ? 's' : '') + '</span>';
    if (cntRascunho > 0) html += '<span style="background:#FFF3E0;color:#E65100;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;">📝 ' + cntRascunho + ' rascunho' + (cntRascunho > 1 ? 's' : '') + '</span>';
    if (cntEnviada > 0) html += '<span style="background:#E3F2FD;color:#1565C0;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;">📤 ' + cntEnviada + ' enviada' + (cntEnviada > 1 ? 's' : '') + '</span>';
    if (jaAssinada) {
      const dataFmt = new Date(lead.proposta_assinada_em + 'T00:00:00').toLocaleDateString('pt-BR');
      html += '<span style="background:#E8F5E9;color:#2E7D32;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:700;">✅ Assinada em ' + dataFmt + '</span>';
    }
    html += '</div>';

    // Botão "Ir pra aba Propostas"
    if (propostasLead.length > 0) {
      html += '<button class="btn btn-sm" onclick="trocarTabLead(\'propostas\')" style="background:white;border:1px solid #BBDEFB;color:#1565C0;font-size:11px;">Ver propostas →</button>';
    }

    badge.innerHTML = html;
  }

  // SEMANA 4.17: Lock após assinar — bloqueia campos que afetam valor da proposta
  function _aplicarLockProposta(lead) {
    if (!lead) return;
    const jaAssinada = !!lead.proposta_assinada_em;

    const camposBlock = ['ver-lead-valor', 'ver-lead-data-proposta', 'ver-lead-doc', 'ver-lead-nome'];
    camposBlock.forEach(function(id){
      const el = document.getElementById(id);
      if (!el) return;
      if (jaAssinada) {
        el.setAttribute('readonly', 'readonly');
        el.style.background = '#f3f4f6';
        el.style.cursor = 'not-allowed';
        el.title = '🔒 Bloqueado: proposta já assinada. Pra alterar, edite os dados da assinatura.';
      } else {
        el.removeAttribute('readonly');
        el.style.background = '';
        el.style.cursor = '';
        el.title = '';
      }
    });

    // Aviso visual no topo do form quando bloqueado
    let aviso = document.getElementById('ver-lead-lock-aviso');
    if (jaAssinada) {
      if (!aviso) {
        aviso = document.createElement('div');
        aviso.id = 'ver-lead-lock-aviso';
        aviso.style.cssText = 'margin-bottom:10px;padding:8px 12px;background:#FFFDE7;border-left:3px solid #FBC02D;border-radius:6px;font-size:11.5px;color:#5D4037;';
        aviso.innerHTML = '🔒 <strong>Lead bloqueado pra edição:</strong> proposta já foi assinada. Pra mudar valor/data/CPF/nome, primeiro edite a assinatura no bloco azul abaixo.';
        // Insere ANTES do primeiro g2
        const formArea = document.getElementById('lead-tab-dados');
        if (formArea && formArea.firstElementChild) {
          formArea.insertBefore(aviso, formArea.firstElementChild);
        }
      } else {
        aviso.style.display = '';
      }
    } else if (aviso) {
      aviso.style.display = 'none';
    }
  }

  function verLead(cid) {
    const l = leads.find(function(x){ return x.id === cid; });
    if (!l) { alert('Lead não encontrado. Recarregue a página.'); return; }
    leadAtualId = cid;

    // FASE 13 hotfix: helpers blindados contra elementos null
    function setText(id, txt) {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    }
    function setVal(id, val) {
      const el = document.getElementById(id);
      if (el) el.value = val;
    }

    setText('ver-lead-titulo', l.nome || '(sem nome)');
    // FASE 11 FIX: stLabels com todos os 5 status atuais
    const stLabels = {
      novo: 'Novo',
      em_contato: 'Em contato',
      proposta: 'Proposta',
      aguardando: 'Aguardando',
      perdido: 'Perdido'
    };
    const subTexto = (l.cpf_cnpj || 'sem CPF/CNPJ') + ' · ' + (stLabels[l.status_lead] || 'Novo');
    setText('ver-lead-sub', subTexto);

    // Aba Dados
    setVal('ver-lead-nome', l.nome || '');
    setVal('ver-lead-doc', l.cpf_cnpj || '');
    setVal('ver-lead-tel', l.telefone1 || '');
    setVal('ver-lead-email', l.email || '');
    setVal('ver-lead-status', l.status_lead || 'novo');
    setVal('ver-lead-origem', l.origem_lead === 'importacao' ? 'Importação (DOE)' : (l.origem_lead === 'manual' ? 'Manual' : '—'));
    setVal('ver-lead-valor', l.valor_proposta != null ? l.valor_proposta : '');
    setVal('ver-lead-data-proposta', l.data_proposta || '');
    setVal('ver-lead-obs', l.observacoes_lead || '');

    // FASE 12.2: Cidade e Propriedade (vêm da tabela `propriedades` se houver, ou de l.cidade)
    const propsLead = propriedades.filter(function(p){ return p.cliente_id === cid; });
    let cidadeAtual = l.cidade || '';
    let propAtual = '';
    if (propsLead.length > 0) {
      // Pega a primeira propriedade (cenário típico do lead)
      const pPri = propsLead[0];
      if (!cidadeAtual && pPri.cidade) cidadeAtual = pPri.cidade;
      // Nome da propriedade só mostra se não for o placeholder REVISAR
      if (pPri.nome && pPri.nome.indexOf('REVISAR') !== 0) {
        propAtual = pPri.nome;
      }
    }
    setVal('ver-lead-cidade', cidadeAtual);
    setVal('ver-lead-propriedade', propAtual);

    // Aba Histórico
    carregarHistoricoContatos(cid);

    // FASE 14.4 ajustes: contatos adicionais do lead
    carregarContatosAdicionaisLead(cid);

    // FASE 4: Atualiza contagem de propostas
    if (typeof propostas !== 'undefined') {
      const cntProp = propostas.filter(function(p){ return p.cliente_id === cid; }).length;
      setText('ver-lead-cnt-propostas', '(' + cntProp + ')');
    }

    // SEMANA 4.17: Renderiza badge no topo + lock + histórico
    _renderBadgeTopoLead(l);
    _aplicarLockProposta(l);
    _renderMiniHistoricoPropostas(l);
    _renderPropriedadesPontosLead(l);   // SEMANA 4.19: dados da planilha

    // Volta sempre pra primeira aba ao abrir
    trocarTabLead('dados');

    // FASE 12: atualiza estado dos botões voltar/avançar
    atualizarBotoesMoverLead();

    // FASE 14.2: aplica permissões nos botões conforme papel
    aplicarPermissoesVerLead(l);

    abrirModal('ov-ver-lead');
  }

  // FASE 14.2: controla visibilidade de botões no modal verLead conforme papel
  function aplicarPermissoesVerLead(lead) {
    const sess = getSessao();
    const papel = (sess && sess.papel) || 'admin';
    const meuId = sess && sess.id;
    const isDono = lead.hunter_id && lead.hunter_id === meuId;

    // Botão Desistir (só hunter dono pode)
    const btnDes = document.getElementById('btn-lead-desistir');
    if (btnDes) btnDes.style.display = (papel === 'hunter' && isDono) ? '' : 'none';

    // Botão Liberar (só admin pode, e só se tem hunter dono)
    const btnLib = document.getElementById('btn-lead-liberar');
    if (btnLib) btnLib.style.display = (papel === 'admin' && lead.hunter_id) ? '' : 'none';

    // Botão Excluir: só admin (hunter só marca "Perdido" via kanban)
    const btnEx = document.getElementById('btn-lead-excluir');
    if (btnEx) btnEx.style.display = (papel === 'admin') ? '' : 'none';

    // FASE 14.4 ajustes: Botão Perdido — admin sempre, hunter só se for dono
    const btnPerd = document.getElementById('btn-lead-perdido');
    if (btnPerd) {
      const podePerder = (papel === 'admin') || (papel === 'hunter' && isDono);
      btnPerd.style.display = podePerder ? '' : 'none';
      // Se já estiver perdido, muda label pra "Reverter"
      btnPerd.textContent = (lead.status_lead === 'perdido') ? '↩ Reverter (estava perdido)' : '❌ Perdido';
    }

    // Info do dono (admin vê quem é)
    const elDono = document.getElementById('ver-lead-dono-info');
    if (elDono) {
      if (papel === 'admin') {
        if (lead.hunter_id) {
          const hunterObj = (_usuariosCache || []).find(function(u){ return u.id === lead.hunter_id; });
          if (hunterObj) {
            const info = hunterObj.cor ? CORES_TIMES[hunterObj.cor] : null;
            const corHtml = info ? '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + info.hex + ';margin-right:4px;vertical-align:middle;"></span>' : '';
            elDono.innerHTML = '👤 Dono: ' + corHtml + ' <strong>' + escapeHtml(hunterObj.nome) + '</strong>' +
              (info ? ' (Time ' + info.nome + ')' : '') +
              (lead.data_captura ? ' · pegou em ' + new Date(lead.data_captura).toLocaleDateString('pt-BR') : '');
          } else {
            elDono.innerHTML = '👤 Dono: <em>hunter desativado</em>';
          }
        } else {
          elDono.innerHTML = '🟢 Lead sem dono (no Pool)';
        }
        elDono.style.display = '';
      } else {
        elDono.style.display = 'none';
      }
    }

    // FASE 14.3: seção de handoff (status da proposta + ações)
    renderHandoffLead(lead);
  }

  // FASE 14.3: Renderiza seção de Handoff (status da proposta + botões)
  function renderHandoffLead(lead) {
    const box = document.getElementById('ver-lead-handoff');
    const statusEl = document.getElementById('ver-lead-handoff-status');
    const acoesEl = document.getElementById('ver-lead-handoff-acoes');
    if (!box || !statusEl || !acoesEl) return;

    const sess = getSessao();
    const papel = (sess && sess.papel) || 'admin';
    const isDono = lead.hunter_id && lead.hunter_id === (sess && sess.id);
    const podeAgir = (papel === 'hunter' && isDono) || papel === 'admin';

    // Hunter sem ser dono ou Projetos: não vê seção
    if (!podeAgir) {
      box.style.display = 'none';
      return;
    }
    box.style.display = '';

    // Estado: tem proposta? Já está assinada?
    const propostasDoLead = (typeof propostas !== 'undefined' ? propostas : [])
      .filter(function(p){ return p.cliente_id === lead.id; });
    const temPropostaEnviada = propostasDoLead.some(function(p){ return p.status === 'enviada'; });
    const jaAssinada = !!lead.proposta_assinada_em;

    let statusHtml = '';
    let acoesHtml = '';

    if (jaAssinada) {
      // Proposta JÁ assinada → mostra info + dica pra ir no Iniciar projeto
      const dataFmt = new Date(lead.proposta_assinada_em + 'T00:00:00').toLocaleDateString('pt-BR');
      statusHtml = '✅ <strong>Proposta assinada em ' + dataFmt + '</strong>';
      if (lead.proposta_assinada_obs) {
        statusHtml += '<br/><em style="color:#0a2744;opacity:0.8;">"' + escapeHtml(lead.proposta_assinada_obs) + '"</em>';
      }
      // SEMANA 4.16: link pra ver arquivo anexado
      if (lead.proposta_assinada_url) {
        statusHtml += '<br/>📎 <a href="' + lead.proposta_assinada_url + '" target="_blank" style="color:#1565C0;font-weight:600;text-decoration:underline;">Ver proposta assinada (' + escapeHtml(lead.proposta_assinada_nome || 'arquivo') + ')</a>';
      }
      // ONDA 3 BUG#3: redireciona pro botão "Iniciar projeto" oficial (em vez de ter botão duplicado)
      statusHtml += '<br/><span style="font-size:11px;color:#1B5E20;font-weight:600;">→ Pronto pra virar projeto. Use o botão "🚀 Iniciar projeto" abaixo.</span>';

      // ONDA 3 BUG#3: removido botão "🚀 Enviar pra Projetos" (caminho duplicado).
      // Mantém apenas botão de editar dados da assinatura (caminho ativo)
      acoesHtml = '<button class="btn" onclick="abrirMarcarAssinada(true)" style="background:white;color:#1565C0;border:1px solid #BBDEFB;">📝 Editar dados da assinatura</button>';
    } else if (temPropostaEnviada) {
      statusHtml = '⏳ <strong>Aguardando assinatura do cliente</strong><br/>' +
        '<span style="font-size:11px;color:#1565C0;">Quando o cliente assinar, clique abaixo pra registrar.</span>';
      acoesHtml = '<button class="btn btn-blue" onclick="abrirMarcarAssinada(false)" style="background:#2E7D32;color:white;font-weight:700;">📝 Anexar proposta assinada</button>';
    } else if (propostasDoLead.length > 0) {
      statusHtml = '📄 <strong>Proposta(s) em rascunho.</strong><br/>' +
        '<span style="font-size:11px;color:#1565C0;">Envie pro cliente (na aba Propostas) antes de marcar como assinada.</span>';
      acoesHtml = '<button class="btn" onclick="trocarTabLead(\'propostas\')" style="background:white;color:#1565C0;border:1px solid #BBDEFB;">Ver propostas →</button>';
    } else {
      statusHtml = '📝 <strong>Nenhuma proposta gerada ainda.</strong><br/>' +
        '<span style="font-size:11px;color:#1565C0;">Comece gerando uma proposta pro cliente.</span>';
      acoesHtml = '<button class="btn btn-blue" onclick="abrirGerarProposta()" style="background:#1565C0;color:white;">📄 Gerar Proposta →</button>';
    }

    statusEl.innerHTML = statusHtml;
    acoesEl.innerHTML = acoesHtml;
  }

  // FASE 14.3: Abre modal pra marcar proposta como assinada
  function abrirMarcarAssinada(editandoExistente) {
    if (!leadAtualId) return;
    const lead = leads.find(function(x){ return x.id === leadAtualId; });
    if (!lead) return;

    // Popula campos
    const hoje = getDataHojeBR();
    const dataInput = document.getElementById('assin-data');
    const obsInput = document.getElementById('assin-obs');
    if (editandoExistente && lead.proposta_assinada_em) {
      if (dataInput) dataInput.value = lead.proposta_assinada_em.slice(0, 10);
      if (obsInput) obsInput.value = lead.proposta_assinada_obs || '';
    } else {
      if (dataInput) dataInput.value = hoje;
      if (obsInput) obsInput.value = '';
    }

    // Reset preview foto
    const inpFoto = document.getElementById('assin-foto');
    if (inpFoto) inpFoto.value = '';
    const prev = document.getElementById('assin-foto-preview');
    if (prev) prev.style.display = 'none';

    // Reset erro
    const erro = document.getElementById('assin-erro');
    if (erro) erro.style.display = 'none';

    // Listener foto
    if (inpFoto) {
      inpFoto.onchange = function(){
        const f = inpFoto.files && inpFoto.files[0];
        if (f) {
          const nomeEl = document.getElementById('assin-foto-nome');
          if (nomeEl) nomeEl.textContent = f.name + ' (' + Math.round(f.size/1024) + ' KB)';
          if (prev) prev.style.display = 'block';
        } else {
          if (prev) prev.style.display = 'none';
        }
      };
    }

    abrirModal('ov-marcar-assinada');
  }

  // FASE 14.3: Confirma assinatura (salva no banco)
  async function confirmarAssinatura() {
    if (!leadAtualId) return;

    const data = document.getElementById('assin-data').value;
    const obs = (document.getElementById('assin-obs').value || '').trim();
    const arquivoInp = document.getElementById('assin-foto');
    const arquivo = arquivoInp && arquivoInp.files && arquivoInp.files[0] || null;
    const erroEl = document.getElementById('assin-erro');
    const btn = document.getElementById('btn-confirmar-assinada');

    function showErro(msg) {
      erroEl.textContent = msg;
      erroEl.style.display = 'block';
    }
    erroEl.style.display = 'none';

    if (!data) return showErro('Data da assinatura é obrigatória.');
    const dataAss = new Date(data + 'T12:00:00');
    if (isNaN(dataAss)) return showErro('Data inválida.');
    // SEMANA 4.19 FIX: compara só DIA, não hora (estava barrando hoje pela manhã)
    const hojeFimDoDia = new Date();
    hojeFimDoDia.setHours(23, 59, 59, 999);
    if (dataAss > hojeFimDoDia) return showErro('Data não pode ser no futuro.');
    if (dataAss < new Date('2020-01-01')) return showErro('Data muito antiga. Use uma data recente.');

    // SEMANA 4.16: arquivo obrigatório se for primeira vez (não tem URL salvo)
    const lead = leads.find(function(x){ return x.id === leadAtualId; });
    const jaTemUrl = !!(lead && lead.proposta_assinada_url);
    if (!arquivo && !jaTemUrl) {
      showErro('📎 Anexar a proposta assinada é obrigatório.');
      arquivoInp.style.outline = '2px solid #C62828';
      return;
    }

    btn.disabled = true;
    btn.textContent = '⏳ Salvando...';

    try {
      const payload = {
        proposta_assinada_em: data,
        proposta_assinada_obs: obs || null,
        status_lead: 'aguardando'
      };

      // SEMANA 4.16: upload do arquivo (se enviado)
      if (arquivo) {
        const ext = (arquivo.name.split('.').pop() || 'pdf').toLowerCase();
        const path = 'propostas_assinadas/' + leadAtualId + '/' + Date.now() + '.' + ext;
        const url = await uploadFile('documentos-zello', path, arquivo);
        if (!url) throw new Error('Falha ao subir o arquivo. Tente arquivo menor que 5MB.');
        payload.proposta_assinada_url = url;
        payload.proposta_assinada_nome = arquivo.name;
      }

      const r = await fetch(SUPABASE_URL + '/rest/v1/clientes?id=eq.' + leadAtualId, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify(payload)
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);

      // SEMANA 4.19 FIX: também cria registro em "documentos" pra aparecer na aba Documentos do cliente
      if (arquivo && payload.proposta_assinada_url) {
        try {
          await api('documentos', 'POST', {
            cliente_id: leadAtualId,
            tipo: 'OUTRO',
            titulo: 'Proposta assinada' + (lead && lead.numero_proposta ? ' nº ' + lead.numero_proposta : ''),
            observacao: 'Proposta assinada em ' + new Date(data + 'T00:00:00').toLocaleDateString('pt-BR') + (obs ? ' · ' + obs : ''),
            arquivo_url: payload.proposta_assinada_url,
            arquivo_nome: payload.proposta_assinada_nome,
            data_emissao: data,
            ativo: true
          }, 'return=minimal');
        } catch(eDoc) { console.warn('Não criou doc:', eDoc); }
      }

      // SEMANA 4.16: se tiver UMA proposta em rascunho, marca como "enviada" automaticamente
      try {
        const propostasDoLead = (typeof propostas !== 'undefined' ? propostas : [])
          .filter(function(p){ return p.cliente_id === leadAtualId; });
        const rascunhos = propostasDoLead.filter(function(p){ return p.status === 'rascunho'; });
        if (rascunhos.length === 1) {
          await api('propostas?id=eq.' + rascunhos[0].id, 'PATCH', {
            status: 'enviada',
            data_envio: data
          }, 'return=minimal');
        }
      } catch(eP) { console.warn('Não auto-marcou proposta como enviada:', eP); }

      fecharModal('ov-marcar-assinada');
      toastSuccess('✅ Proposta assinada anexada com sucesso!', 5000);
      await carregarDados();

      setTimeout(function(){ verLead(leadAtualId); }, 200);
    } catch(e) {
      console.error('Erro confirmarAssinatura:', e);
      showErro('Erro: ' + (e.message || ''));
    } finally {
      btn.disabled = false;
      btn.textContent = '✓ Marcar como assinada';
    }
  }

  // ============================================================
  // ONDA 2 BUG#6: Modal visual de seleção de hunter (substitui prompt nativo numerado)
  // ============================================================
  // Uso: const hunterId = await selecionarHunter({ titulo, mensagem, atualId, permitirNenhum });
  //   retorna: id do hunter escolhido, null se "nenhum", false se cancelou
  function selecionarHunter(opts) {
    opts = opts || {};
    return new Promise(function(resolve) {
      const hunters = (_usuariosCache || []).filter(function(u){ return u.papel === 'hunter' && u.ativo; });
      const atualId = opts.atualId || null;
      const permitirNenhum = opts.permitirNenhum !== false;   // default true

      // Remove modal anterior se houver
      const exist = document.getElementById('ov-sel-hunter');
      if (exist) exist.remove();

      const mod = document.createElement('div');
      mod.id = 'ov-sel-hunter';
      mod.className = 'overlay open';
      mod.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10000;padding:20px;';

      // Botão por hunter
      let huntersHtml = '';
      if (hunters.length === 0) {
        huntersHtml = '<div style="padding:20px;text-align:center;color:#94A3B8;font-size:13px;">Não há hunters cadastrados.</div>';
      } else {
        hunters.forEach(function(h){
          const cor = h.cor ? (CORES_TIMES[h.cor] || {}) : {};
          const ehAtual = atualId && h.id === atualId;
          const corBg = cor.hex || '#94A3B8';
          huntersHtml += '<button data-hunter-id="' + escapeHtml(h.id) + '" ' +
            'style="display:flex;align-items:center;gap:12px;width:100%;padding:12px 14px;background:white;border:2px solid ' + (ehAtual ? corBg : '#E2E8F0') + ';border-radius:8px;cursor:pointer;text-align:left;transition:all 0.15s;font-size:14px;color:#0F172A;" ' +
            'onmouseover="this.style.borderColor=\'' + corBg + '\';this.style.background=\'#F8FAFC\';" ' +
            'onmouseout="this.style.borderColor=\'' + (ehAtual ? corBg : '#E2E8F0') + '\';this.style.background=\'white\';">' +
            '<div style="width:36px;height:36px;border-radius:50%;background:' + corBg + ';display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">' +
              (cor.emoji || '👤') +
            '</div>' +
            '<div style="flex:1;">' +
              '<div style="font-weight:600;">' + escapeHtml(h.nome || '(sem nome)') + '</div>' +
              '<div style="font-size:11px;color:#64748B;">' + (cor.nome || 'sem cor') + (ehAtual ? ' · <strong style="color:' + corBg + ';">ATUAL</strong>' : '') + '</div>' +
            '</div>' +
            (ehAtual ? '<div style="font-size:18px;color:' + corBg + ';">●</div>' : '') +
          '</button>';
        });
      }

      // Botão "Nenhum"
      const nenhumHtml = permitirNenhum ?
        '<button data-hunter-id="__none__" ' +
          'style="display:flex;align-items:center;gap:12px;width:100%;padding:12px 14px;background:#FEF3C7;border:2px solid #FCD34D;border-radius:8px;cursor:pointer;text-align:left;font-size:14px;color:#78350F;margin-top:4px;" ' +
          'onmouseover="this.style.background=\'#FDE68A\';" onmouseout="this.style.background=\'#FEF3C7\';">' +
          '<div style="width:36px;height:36px;border-radius:50%;background:#FCD34D;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">⚠</div>' +
          '<div style="flex:1;"><div style="font-weight:600;">Nenhum hunter</div><div style="font-size:11px;color:#92400E;">Sem comissão</div></div>' +
        '</button>' : '';

      mod.innerHTML =
        '<div style="background:white;border-radius:14px;max-width:480px;width:100%;max-height:90vh;overflow:auto;box-shadow:0 24px 48px rgba(0,0,0,0.2);">' +
          '<div style="padding:18px 20px 12px;border-bottom:1px solid #E2E8F0;">' +
            '<div style="font-size:16px;font-weight:700;color:#0F172A;">' + escapeHtml(opts.titulo || 'Escolher hunter') + '</div>' +
            (opts.mensagem ? '<div style="font-size:12px;color:#64748B;margin-top:4px;">' + escapeHtml(opts.mensagem) + '</div>' : '') +
          '</div>' +
          '<div style="padding:14px 20px;display:flex;flex-direction:column;gap:6px;">' +
            huntersHtml +
            nenhumHtml +
          '</div>' +
          '<div style="padding:10px 20px 16px;display:flex;justify-content:flex-end;border-top:1px solid #F1F5F9;">' +
            '<button id="sel-hunter-cancel" style="background:white;border:1px solid #CBD5E1;border-radius:6px;padding:8px 16px;font-size:13px;cursor:pointer;color:#475569;">Cancelar</button>' +
          '</div>' +
        '</div>';

      document.body.appendChild(mod);

      // Função pra fechar e resolver
      const fechar = function(valor) {
        if (mod && mod.parentNode) mod.parentNode.removeChild(mod);
        resolve(valor);
      };

      // Listeners nos botões de hunter
      const btns = mod.querySelectorAll('button[data-hunter-id]');
      btns.forEach(function(b){
        b.addEventListener('click', function(){
          const id = b.getAttribute('data-hunter-id');
          fechar(id === '__none__' ? null : id);
        });
      });

      // Cancelar
      document.getElementById('sel-hunter-cancel').addEventListener('click', function(){ fechar(false); });

      // ESC fecha
      const escHandler = function(e){
        if (e.key === 'Escape') {
          document.removeEventListener('keydown', escHandler);
          fechar(false);
        }
      };
      document.addEventListener('keydown', escHandler);

      // Click fora fecha
      mod.addEventListener('click', function(e){
        if (e.target === mod) fechar(false);
      });
    });
  }

  // FASE 14.3: Envia lead pra equipe Projetos (vira projeto)
  // ONDA 3 BUG#3: DEPRECADA — caminho oficial é `iniciarProjetoDoLead` que abre modal com dados completos.
  // Mantida só pra retro-compatibilidade caso algum HTML inline antigo ainda chame.
  // Se for chamada, redireciona pro fluxo correto.
  async function enviarParaProjetos() {
    console.warn('[Zello] enviarParaProjetos é DEPRECADA. Use iniciarProjetoDoLead (botão "🚀 Iniciar projeto").');
    if (typeof iniciarProjetoDoLead === 'function') {
      iniciarProjetoDoLead();
      return;
    }
    // Fallback (jamais deveria cair aqui em produção)
    zAlert('Função antiga. Use o botão "🚀 Iniciar projeto" na barra de ações.', 'aviso');
  }

  // ============================================================
  // (BLOCO ABAIXO É CÓDIGO ANTIGO — preservado caso seja necessário rollback rápido.
  //  A função enviarParaProjetos original criava projeto diretamente, sem passar pelo
  //  modal de revisão. Foi substituída pelo modal "ov-iniciar-projeto" que pede:
  //  propriedade, requerimento, responsável, valor, obs.)
  // ============================================================
  async function _enviarParaProjetos_legacy() {
    if (!leadAtualId) return;
    const lead = leads.find(function(x){ return x.id === leadAtualId; });
    if (!lead) return;
    if (!lead.proposta_assinada_em) {
      alert('Marque a proposta como assinada antes de enviar pra Projetos.');
      return;
    }

    // Verifica se tem propriedade cadastrada (precisa pra criar projeto)
    const propsLead = (propriedades || []).filter(function(p){ return p.cliente_id === leadAtualId; });
    if (propsLead.length === 0) {
      alert('⚠ Este lead não tem propriedade cadastrada.\n\nAdicione ao menos 1 propriedade antes de enviar pra Projetos. Use a aba Dados → preencha campo Propriedade.');
      return;
    }

    // REVISÃO BUG: busca valor da proposta — primeiro do campo do lead, depois da proposta mais recente
    let valorTotal = parseFloat(lead.valor_proposta) || 0;
    if (valorTotal <= 0 && typeof propostas !== 'undefined') {
      const propostasDoLead = (propostas || [])
        .filter(function(p){ return p.cliente_id === leadAtualId; })
        .sort(function(a, b){ return new Date(b.criado_em || 0) - new Date(a.criado_em || 0); });
      if (propostasDoLead.length > 0) {
        valorTotal = parseFloat(propostasDoLead[0].valor_total || propostasDoLead[0].valor || 0) || 0;
      }
    }
    if (valorTotal <= 0) {
      alert('⚠ Este lead não tem valor de proposta definido.\n\nNa aba "Dados", preencha o campo "Valor da proposta (R$)" antes de enviar pra Projetos.\n\nIsso é importante pra:\n• Calcular a comissão do hunter\n• Definir o valor da NF');
      return;
    }

    // REVISÃO BUG: determina hunter_id_origem corretamente
    // Se lead já tem hunter_id, usa esse. Se admin é dono, pergunta a quem atribuir.
    const sess = getSessao();
    let hunterIdOrigem = lead.hunter_id || null;

    if (!hunterIdOrigem) {
      // Lead sem hunter — admin pegou? Atribui ao próprio admin (não vai gerar comissão)
      // ou pede pra escolher hunter
      if (sess && sess.papel === 'admin') {
        const hunters = (_usuariosCache || []).filter(function(u){ return u.papel === 'hunter' && u.ativo; });
        if (hunters.length === 0) {
          if (!(await zConfirm('⚠ Atenção: Este lead não tem hunter responsável.\n\nNão há hunters cadastrados. Se enviar agora, NÃO será gerada comissão.\n\nDeseja continuar mesmo assim?', { tipo:'erro', btnOk:'Sim, enviar sem comissão' }))) return;
        } else {
          // ONDA 2 BUG#6: usa modal visual em vez de prompt nativo
          const escolha = await selecionarHunter({
            titulo: 'Hunter responsável pela comissão',
            mensagem: 'Este lead não tem hunter. Quem fica como dono pra fins de comissão?',
            permitirNenhum: true
          });
          if (escolha === false) return;   // cancelou
          hunterIdOrigem = escolha;        // pode ser null ("nenhum") ou id
        }
      }
    }

    if (!(await zConfirm('Enviar este lead pra equipe Projetos?\n\nO QUE ACONTECE:\n• Lead vira PROJETO (valor: R$ ' + valorTotal.toLocaleString('pt-BR') + ')\n• ' + (hunterIdOrigem ? '✅ Comissão será gerada quando "Pago 1º" for marcado' : '⚠ Sem hunter associado — não vai gerar comissão') + '\n• Você não vê mais o cliente em "Meus Leads"\n• Equipe Projetos recebe pra gerar 1º pgto + NF + pedir docs', { tipo:'erro', btnOk:'Enviar pra Projetos' }))) return;

    // FIX BUG #18: lock pra evitar duplo-clique criar 2 projetos
    if (window._enviandoParaProjetos) {
      console.warn('[Zello] Já está enviando pra projetos. Aguarde.');
      return;
    }
    window._enviandoParaProjetos = true;

    const propPrincipal = propsLead[0];

    try {
      // 1. Cria projeto
      const projetoPayload = {
        cliente_id: leadAtualId,
        propriedade_id: propPrincipal.id,
        nome: 'OUTORGA ' + (propPrincipal.nome || lead.nome).toUpperCase(),
        valor_total: valorTotal,
        status: 'em_andamento',
        etapa_atual: 1,
        hunter_id_origem: hunterIdOrigem,
        pago_1: false,
        docs_ok: false,
        pago_2: false,
        criado_em: new Date().toISOString()
      };
      const rProj = await fetch(SUPABASE_URL + '/rest/v1/projetos', {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
        body: JSON.stringify(projetoPayload)
      });
      if (!rProj.ok) {
        const txt = await rProj.text();
        throw new Error('Erro ao criar projeto: ' + (txt.slice(0, 200)));
      }
      const projData = await rProj.json();
      const novoProjeto = projData && projData[0];

      // 2. Move cliente pra status_funil='em_projeto'
      const rCli = await fetch(SUPABASE_URL + '/rest/v1/clientes?id=eq.' + leadAtualId, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ status_funil: 'em_projeto' })
      });
      if (!rCli.ok) throw new Error('Erro ao mover cliente: HTTP ' + rCli.status);

      fecharModal('ov-ver-lead');
      alert('✅ Enviado pra equipe Projetos!\n\nProjeto: ' + projetoPayload.nome + '\nValor: R$ ' + valorTotal.toLocaleString('pt-BR') + '\n' + (hunterIdOrigem ? '✅ Vai gerar comissão quando "Pago 1º" for marcado' : '⚠ Sem hunter — não gera comissão'));
      await carregarDados();
      renderProspeccaoKanban();
    } catch(e) {
      console.error('Erro enviarParaProjetos:', e);
      alert('Erro: ' + (e.message || ''));
    } finally {
      // FIX BUG #18: libera lock
      window._enviandoParaProjetos = false;
    }
  }

  // FASE 14.2: hunter desiste do lead — volta pro pool
  async function desistirDoLead() {
    if (!leadAtualId) return;
    if (!(await zConfirm('Desistir deste lead?\n\nEle voltará pro Pool e qualquer outro hunter poderá pegar.\nVocê NÃO conseguirá ver mais.', { tipo:'erro', btnOk:'Desistir' }))) return;

    const sess = getSessao();
    try {
      // Garante que só o dono pode desistir (segurança extra)
      const r = await fetch(SUPABASE_URL + '/rest/v1/clientes?id=eq.' + leadAtualId + '&hunter_id=eq.' + sess.id, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
        body: JSON.stringify({ hunter_id: null, data_captura: null })
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const upd = await r.json();
      if (!upd || upd.length === 0) {
        throw new Error('Não foi possível liberar (você ainda é o dono?). Recarregue.');
      }

      // Log
      fetch(SUPABASE_URL + '/rest/v1/pool_log', {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ cliente_id: leadAtualId, acao: 'desistiu_hunter', hunter_id: sess.id })
      }).catch(function(){});

      fecharModal('ov-ver-lead');
      alert('✓ Lead voltou pro Pool.');
      await carregarDados();
      renderProspeccaoKanban();
    } catch(e) {
      console.error('Erro desistirDoLead:', e);
      alert('Erro: ' + (e.message || ''));
    }
  }

  // FASE 14.2: admin libera lead de um hunter pro pool
  async function liberarLeadProPool() {
    if (!leadAtualId) return;
    if (!souAdmin()) return;
    const lead = leads.find(function(x){ return x.id === leadAtualId; });
    if (!lead || !lead.hunter_id) return;

    if (!(await zConfirm('Liberar este lead pro Pool?\n\nO hunter atual perde acesso. Qualquer hunter poderá pegar.\n\nIsso costuma ser feito quando um hunter está negligenciando o lead ou saiu da empresa.', { tipo:'erro', btnOk:'Liberar' }))) return;

    const sess = getSessao();
    const huntAntigo = lead.hunter_id;
    try {
      const r = await fetch(SUPABASE_URL + '/rest/v1/clientes?id=eq.' + leadAtualId, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ hunter_id: null, data_captura: null })
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);

      fetch(SUPABASE_URL + '/rest/v1/pool_log', {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ cliente_id: leadAtualId, acao: 'liberado_admin', hunter_id: sess.id, detalhes: 'Hunter anterior: ' + huntAntigo })
      }).catch(function(){});

      fecharModal('ov-ver-lead');
      alert('✓ Lead liberado pro Pool.');
      await carregarDados();
      renderProspeccaoKanban();
    } catch(e) {
      console.error('Erro liberarLead:', e);
      alert('Erro: ' + (e.message || ''));
    }
  }

  // FASE 14.2: ao admin logar, libera leads sem interação há 7+ dias
  // Configurável via config_app (chave 'dias_auto_liberar_pool', default 7)
  let _autoLiberacaoRodada = false;  // evita rodar mais de 1 vez por sessão

  async function verificarAutoLiberacao() {
    if (_autoLiberacaoRodada) return;
    if (!souAdmin()) return;
    _autoLiberacaoRodada = true;

    try {
      // Lê configuração de dias
      let dias = 7;
      try {
        const cfgR = await fetch(SUPABASE_URL + '/rest/v1/config_app?chave=eq.dias_auto_liberar_pool&select=valor', {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
        });
        if (cfgR.ok) {
          const cfg = await cfgR.json();
          if (cfg && cfg[0] && cfg[0].valor) {
            const n = parseInt(cfg[0].valor, 10);
            if (n > 0 && n <= 365) dias = n;
          }
        }
      } catch(_) { /* usa default 7 */ }

      // Calcula data limite
      const limite = new Date();
      limite.setDate(limite.getDate() - dias);
      const limiteISO = limite.toISOString();

      // Busca leads com hunter_id != null, status_funil='prospeccao', data_captura < limite
      // E SEM atualizacao recente (atualizado_em < limite OU null)
      const url = SUPABASE_URL + '/rest/v1/clientes?status_funil=eq.prospeccao' +
        '&hunter_id=not.is.null' +
        '&data_captura=lt.' + encodeURIComponent(limiteISO) +
        '&select=id,nome,hunter_id,data_captura';
      const r = await fetch(url, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (!r.ok) return;
      const leadsInativos = await r.json();

      if (!leadsInativos || leadsInativos.length === 0) {
        console.log('[FASE 14.2] Auto-liberação: nenhum lead inativo há ' + dias + ' dias.');
        return;
      }

      console.log('[FASE 14.2] Auto-liberação: ' + leadsInativos.length + ' lead(s) sem interação há ' + dias + '+ dias serão liberados.');

      // Libera cada um (best-effort, sequencial pra não estourar rate limit)
      let liberados = 0;
      for (const l of leadsInativos) {
        try {
          const r2 = await fetch(SUPABASE_URL + '/rest/v1/clientes?id=eq.' + l.id, {
            method: 'PATCH',
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
            body: JSON.stringify({ hunter_id: null, data_captura: null })
          });
          if (r2.ok) {
            liberados++;
            // Log
            fetch(SUPABASE_URL + '/rest/v1/pool_log', {
              method: 'POST',
              headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
              body: JSON.stringify({ cliente_id: l.id, acao: 'liberado_auto_' + dias + 'd', hunter_id: l.hunter_id, detalhes: 'Inativo há ' + dias + '+ dias' })
            }).catch(function(){});
          }
        } catch(_) { /* segue */ }
      }

      if (liberados > 0) {
        console.log('[FASE 14.2] Auto-liberação: ' + liberados + ' lead(s) liberados.');
        // Recarrega dados em background pra refletir
        setTimeout(function(){ if (typeof carregarDados === 'function') carregarDados(); }, 500);
      }
    } catch(e) {
      console.warn('[FASE 14.2] Erro em verificarAutoLiberacao:', e);
    }
  }

  function trocarTabLead(tabName) {
    document.querySelectorAll('#ov-ver-lead .modal-tab').forEach(function(t){ t.classList.remove('active'); });
    document.querySelectorAll('#ov-ver-lead .modal-tab-content').forEach(function(c){ c.classList.remove('active'); });
    const tab = document.querySelector('#ov-ver-lead .modal-tab[data-tab="' + tabName + '"]');
    if (tab) tab.classList.add('active');
    const map = { dados:'lead-tab-dados', hist:'lead-tab-hist', propostas:'lead-tab-propostas' };
    const cont = document.getElementById(map[tabName] || 'lead-tab-dados');
    if (cont) cont.classList.add('active');
    // FASE 4: ao abrir aba propostas, renderiza lista
    if (tabName === 'propostas' && typeof renderPropostasDoLead === 'function' && leadAtualId) {
      renderPropostasDoLead(leadAtualId);
    }
  }

  async function salvarEdicaoLead() {
    if (!leadAtualId) return;
    const nome = document.getElementById('ver-lead-nome').value.trim();
    const doc = document.getElementById('ver-lead-doc').value.trim();
    const tel = document.getElementById('ver-lead-tel').value.trim();
    const email = document.getElementById('ver-lead-email').value.trim();
    const status = document.getElementById('ver-lead-status').value;
    const valorStr = document.getElementById('ver-lead-valor').value.trim();
    const dataProp = document.getElementById('ver-lead-data-proposta').value || null;
    const obs = document.getElementById('ver-lead-obs').value.trim();
    // FASE 12.2: Cidade + Propriedade vindas da aba Dados
    const cidade = document.getElementById('ver-lead-cidade').value.trim();
    const propNome = document.getElementById('ver-lead-propriedade').value.trim();

    if (!nome) { alert('Nome é obrigatório.'); return; }
    if (!doc) { alert('CPF/CNPJ é obrigatório.'); return; }
    const docLimpo = doc.replace(/\D/g,'');
    if (docLimpo.length !== 11 && docLimpo.length !== 14) { alert('CPF/CNPJ inválido.'); return; }
    if (!validarDocumento(docLimpo)) { alert('CPF/CNPJ inválido (dígito verificador).'); return; }

    // FASE 12.1 FIX: valida status_lead pra evitar HTTP 400 do banco
    const statusValidos = ['novo', 'em_contato', 'proposta', 'aguardando', 'perdido'];
    const statusFinal = statusValidos.indexOf(status) >= 0 ? status : 'novo';

    let valor = null;
    if (valorStr) {
      const v = parseFloat(valorStr.replace(',','.'));
      if (isNaN(v) || v < 0) { alert('Valor da proposta inválido.'); return; }
      valor = v;
    }

    // FIX BUG #15: valida data_proposta — não muito futura (>1 ano) nem muito antiga (<2020)
    if (dataProp) {
      const dp = new Date(dataProp + 'T12:00:00');
      const limMax = new Date(); limMax.setFullYear(limMax.getFullYear() + 1);
      if (dp > limMax) {
        alert('Data da proposta muito futura (mais de 1 ano à frente). Confira.');
        return;
      }
      if (dp < new Date('2020-01-01')) {
        alert('Data da proposta muito antiga (anterior a 2020). Confira.');
        return;
      }
    }

    const payload = {
      nome: upper(nome),
      cpf_cnpj: doc,
      telefone1: tel || null,
      email: email || null,
      cidade: upper(cidade) || null,  // FASE 12.2: salva cidade direto no cliente
      status_lead: statusFinal,
      valor_proposta: valor,
      data_proposta: dataProp,
      observacoes_lead: obs || null
    };

    try {
      // 1. Atualiza o lead
      const r = await api('clientes?id=eq.' + leadAtualId, 'PATCH', payload, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));

      // 2. FASE 12.2: gerencia propriedade simples (cidade + nome)
      await _sincronizarPropriedadeLead(leadAtualId, cidade, propNome);

      await carregarDados();
      renderProspeccaoKanban();
      verLead(leadAtualId);

      // Feedback discreto
      const btn = event && event.target;
      if (btn && btn.tagName === 'BUTTON') {
        const orig = btn.textContent;
        btn.textContent = '✓ Salvo';
        setTimeout(function(){ btn.textContent = orig; }, 1500);
      }
    } catch(e) {
      console.error('Erro salvarEdicaoLead:', e);
      alert('Erro ao salvar: ' + (e.message || e));
    }
  }

  // FASE 12.2: Cria/atualiza/remove propriedade vinculada ao lead conforme dados da aba Dados
  // Cenários:
  //   - Lead sem propriedade, usuário preenche nome+cidade  → CRIA nova propriedade
  //   - Lead sem propriedade, usuário preenche só cidade    → CRIA propriedade com nome '(empreendimento sem nome)'
  //   - Lead sem propriedade, usuário não preenche nada     → não faz nada
  //   - Lead com propriedade existente, usuário edita       → UPDATE da primeira propriedade
  //   - Lead com propriedade, usuário apaga tudo            → não apaga (preserva histórico)
  async function _sincronizarPropriedadeLead(leadId, cidade, propNome) {
    const propsLead = propriedades.filter(function(p){ return p.cliente_id === leadId; });
    const temAlgo = (cidade && cidade.length > 0) || (propNome && propNome.length > 0);

    if (propsLead.length === 0 && !temAlgo) {
      // Lead sem propriedade e usuário não preencheu nada → não faz nada
      return;
    }

    if (propsLead.length === 0 && temAlgo) {
      // Lead sem propriedade e usuário preencheu algo → CRIA nova
      const nomeFinal = propNome ? upper(propNome) : '(empreendimento sem nome)';
      const payloadProp = {
        cliente_id: leadId,
        nome: nomeFinal,
        cidade: cidade ? upper(cidade) : null,
        estado: 'SP',
        ativo: true
      };
      const rp = await api('propriedades', 'POST', payloadProp, 'return=minimal');
      if (!rp || !rp.ok) {
        console.warn('Falha ao criar propriedade do lead (não-crítico):', rp ? rp.status : 'sem resp');
      }
      return;
    }

    if (propsLead.length >= 1) {
      // Lead já tem propriedade → atualiza a PRIMEIRA com novos dados
      const pPri = propsLead[0];
      const payloadProp = {};
      let mudou = false;
      // Nome: só atualiza se usuário digitou algo OU se nome original era placeholder
      if (propNome) {
        if ((pPri.nome || '').toUpperCase() !== upper(propNome)) {
          payloadProp.nome = upper(propNome);
          mudou = true;
        }
      } else if (pPri.nome && pPri.nome.indexOf('REVISAR') === 0) {
        // Era um REVISAR, mantém
      }
      // Cidade: atualiza sempre se houver diferença
      if (cidade && (pPri.cidade || '').toUpperCase() !== upper(cidade)) {
        payloadProp.cidade = upper(cidade);
        mudou = true;
      }
      if (mudou) {
        const rp = await api('propriedades?id=eq.' + pPri.id, 'PATCH', payloadProp, 'return=minimal');
        if (!rp || !rp.ok) {
          console.warn('Falha ao atualizar propriedade do lead (não-crítico):', rp ? rp.status : 'sem resp');
        }
      }
    }
  }

  async function excluirLeadConfirm() {
    if (!leadAtualId) return;
    const l = leads.find(function(x){ return x.id === leadAtualId; });
    if (!l) return;
    const propsLead = propriedades.filter(function(p){ return p.cliente_id === leadAtualId; });
    const usosLead = usos.filter(function(u){ return u.cliente_id === leadAtualId; });
    let warn = '';
    if (propsLead.length || usosLead.length) {
      warn = '\n\n⚠ ATENÇÃO: este lead tem ' + propsLead.length + ' propriedade(s) e ' + usosLead.length + ' ponto(s) de captação vinculados.\n\nEles também serão removidos definitivamente.';
    }
    if (!(await zConfirm('Excluir o lead "' + l.nome + '"?' + warn + '\n\nEsta ação não pode ser desfeita.', { tipo:'erro', btnOk:'Excluir lead' }))) return;

    try {
      // Deleta em ordem: histórico_contatos → usos → propriedades → contatos → cliente
      await api('historico_contatos?cliente_id=eq.' + leadAtualId, 'DELETE', null, 'return=minimal');
      await api('usos?cliente_id=eq.' + leadAtualId, 'DELETE', null, 'return=minimal');
      await api('propriedades?cliente_id=eq.' + leadAtualId, 'DELETE', null, 'return=minimal');
      await api('contatos?cliente_id=eq.' + leadAtualId, 'DELETE', null, 'return=minimal');
      const r = await api('clientes?id=eq.' + leadAtualId, 'DELETE', null, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));
      fecharModal('ov-ver-lead');
      leadAtualId = null;
      await carregarDados();
      renderProspeccaoKanban();
      alert('✓ Lead excluído.');
    } catch(e) {
      console.error('Erro excluirLead:', e);
      alert('Erro ao excluir: ' + (e.message || e));
    }
  }

  // ============================================================
  // HISTÓRICO DE CONTATOS
  // ============================================================
  async function carregarHistoricoContatos(cid) {
    const cont = document.getElementById('ver-lead-hist-lista');
    if (!cont) return;
    cont.innerHTML = '<div class="hist-empty">Carregando...</div>';
    try {
      const data = await api('historico_contatos?cliente_id=eq.' + cid + '&order=data.desc&select=*');
      historicoContatos = data || [];
      document.getElementById('ver-lead-cnt-hist').textContent = '(' + historicoContatos.length + ')';
      if (!historicoContatos.length) {
        cont.innerHTML = '<div class="hist-empty">Nenhum contato registrado ainda.<br/>Use <strong>+ Registrar contato</strong> acima.</div>';
        return;
      }
      const iconeMap = { telefone:'📞', whatsapp:'💬', email:'✉️', visita:'🚗', reuniao:'👥', outro:'🔹' };
      cont.innerHTML = historicoContatos.map(function(h) {
        const dt = h.data ? new Date(h.data) : null;
        const dtStr = dt ? dt.toLocaleString('pt-BR', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '';
        return '<div class="hist-item">' +
          '<div class="hist-icon">' + (iconeMap[h.tipo] || '🔹') + '</div>' +
          '<div class="hist-body">' +
            '<div class="hist-title-row">' +
              '<span class="hist-tipo">' + (h.tipo || 'outro') + '</span>' +
              '<span class="hist-data">' + dtStr + '</span>' +
            '</div>' +
            '<div class="hist-desc">' + (h.descricao || '').replace(/</g,'&lt;') + '</div>' +
            (h.proxima_acao ? '<div class="hist-prox">→ ' + h.proxima_acao.replace(/</g,'&lt;') + '</div>' : '') +
            (h.criado_por ? '<div class="hist-meta">por ' + h.criado_por + '</div>' : '') +
          '</div>' +
          '<div><button class="btn btn-sm btn-danger" onclick="excluirHistoricoContato(\'' + h.id + '\')" title="Excluir registro">🗑</button></div>' +
        '</div>';
      }).join('');
    } catch(e) {
      cont.innerHTML = '<div class="hist-empty" style="color:#C62828;">Erro ao carregar histórico: ' + (e.message||e) + '</div>';
    }
  }

  function abrirRegistrarContato() {
    if (!leadAtualId) return;
    const l = leads.find(function(x){ return x.id === leadAtualId; });
    if (!l) return;
    document.getElementById('reg-contato-cliente-nome').textContent = l.nome;
    document.getElementById('reg-contato-tipo').value = 'telefone';
    document.getElementById('reg-contato-desc').value = '';
    document.getElementById('reg-contato-prox').value = '';
    abrirModal('ov-registrar-contato');
    setTimeout(function(){ document.getElementById('reg-contato-desc').focus(); }, 60);
  }

  async function salvarRegistroContato() {
    if (!leadAtualId) return;
    const tipo = document.getElementById('reg-contato-tipo').value;
    const desc = document.getElementById('reg-contato-desc').value.trim();
    const prox = document.getElementById('reg-contato-prox').value.trim();
    if (!desc) { alert('A descrição é obrigatória.'); return; }

    const sess = getSessao();
    const criadoPor = sess && sess.nome ? sess.nome : (sess && sess.email ? sess.email : 'admin');

    const btn = document.getElementById('btn-salvar-contato');
    btn.disabled = true; btn.textContent = '⏳ Salvando...';
    try {
      const payload = {
        cliente_id: leadAtualId,
        data: new Date().toISOString(),
        tipo: tipo,
        descricao: desc,
        proxima_acao: prox || null,
        criado_por: criadoPor
      };
      const r = await api('historico_contatos', 'POST', payload, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));
      fecharModal('ov-registrar-contato');
      // Avança status do lead se ainda for 'novo'
      const l = leads.find(function(x){ return x.id === leadAtualId; });
      if (l && (l.status_lead || 'novo') === 'novo') {
        try {
          await api('clientes?id=eq.' + leadAtualId, 'PATCH', { status_lead: 'em_contato' }, 'return=minimal');
        } catch(e) { /* ignora */ }
        await carregarDados();
        renderProspeccaoKanban();
      }
      await carregarHistoricoContatos(leadAtualId);
      // Pula pra aba histórico pra mostrar o registro novo
      trocarTabLead('hist');
    } catch(e) {
      console.error('Erro salvarRegistroContato:', e);
      alert('Erro ao salvar contato: ' + (e.message || e));
    } finally {
      btn.disabled = false; btn.textContent = '💾 Salvar';
    }
  }

  async function excluirHistoricoContato(hcid) {
    if (!confirm('Excluir este registro de contato?\n\nEsta ação não pode ser desfeita.')) return;
    try {
      const r = await api('historico_contatos?id=eq.' + hcid, 'DELETE', null, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));
      if (leadAtualId) await carregarHistoricoContatos(leadAtualId);
    } catch(e) {
      alert('Erro ao excluir: ' + (e.message || e));
    }
  }

  // ============================================================
  // RENOMEAR PROPRIEDADE
  // ============================================================
  let _renomearPropId = null;

  function abrirRenomearProp(pid) {
    const p = propriedades.find(function(pp){ return pp.id === pid; });
    if (!p) { alert('Propriedade não encontrada.'); return; }
    _renomearPropId = pid;
    document.getElementById('renomear-prop-atual').textContent = 'Atual: ' + p.nome;
    document.getElementById('renomear-prop-novo').value = p.nome;
    abrirModal('ov-renomear-prop');
    setTimeout(function(){
      const inp = document.getElementById('renomear-prop-novo');
      inp.focus(); inp.select();
    }, 60);
  }

  async function confirmarRenomearPropriedade() {
    if (!_renomearPropId) return;
    const novoNome = document.getElementById('renomear-prop-novo').value.trim();
    if (!novoNome) { alert('Digite um nome.'); return; }

    const btn = document.getElementById('btn-confirmar-renomear');
    btn.disabled = true; btn.textContent = '⏳ Renomeando...';
    try {
      const r = await api('propriedades?id=eq.' + _renomearPropId, 'PATCH', { nome: upper(novoNome) }, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));
      fecharModal('ov-renomear-prop');
      await carregarDados();
      // Refresh dos modais que possam estar abertos
      if (clienteAtualId) verCliente(clienteAtualId);
      if (leadAtualId) verLead(leadAtualId);
      _renomearPropId = null;
    } catch(e) {
      alert('Erro ao renomear: ' + (e.message || e));
    } finally {
      btn.disabled = false; btn.textContent = 'Renomear';
    }
  }

  // ============================================================
  // MOVER PONTO PRA OUTRA PROPRIEDADE
  // ============================================================
  let _moverPontoUsoId = null;

  function abrirMoverPonto(uid) {
    const u = usos.find(function(uu){ return uu.id === uid; });
    if (!u) { alert('Ponto não encontrado.'); return; }
    _moverPontoUsoId = uid;

    const propAtual = propriedades.find(function(p){ return p.id === u.propriedade_id; });
    document.getElementById('mover-ponto-info').textContent =
      'Ponto: ' + (u.descricao || '(sem descrição)') + ' · Atualmente em: ' + (propAtual ? propAtual.nome : '—');

    // Lista propriedades do MESMO cliente (não pode mover entre clientes diferentes)
    const propsCli = propriedades.filter(function(p){ return p.cliente_id === u.cliente_id && p.id !== u.propriedade_id; });
    const sel = document.getElementById('mover-ponto-destino');
    if (!propsCli.length) {
      sel.innerHTML = '<option value="">— Sem outras propriedades disponíveis —</option>';
    } else {
      sel.innerHTML = propsCli.map(function(p){ return '<option value="' + escapeHtml(p.id) + '">' + escapeHtml(p.nome) + '</option>'; }).join('');
    }

    // Avisa se o destino tem ponto com mesma descrição
    sel.onchange = function() {
      const destId = sel.value;
      if (!destId) { document.getElementById('mover-ponto-aviso').style.display = 'none'; return; }
      const destPontos = usos.filter(function(uu){ return uu.propriedade_id === destId && uu.id !== uid; });
      const dup = destPontos.find(function(uu){ return (uu.descricao||'').toUpperCase() === (u.descricao||'').toUpperCase(); });
      const av = document.getElementById('mover-ponto-aviso');
      if (dup) {
        av.innerHTML = '⚠ Atenção: a propriedade de destino já tem um ponto com a mesma descrição (<strong>' + escapeHtml(dup.descricao) + '</strong>). Você pode mover assim mesmo, mas talvez queira renomear um deles depois.';
        av.style.display = 'block';
      } else {
        av.style.display = 'none';
      }
    };
    // Dispara onchange manualmente pra mostrar aviso se já tiver
    if (sel.value) sel.onchange();
    else document.getElementById('mover-ponto-aviso').style.display = 'none';

    abrirModal('ov-mover-ponto');
  }

  async function confirmarMoverPonto() {
    if (!_moverPontoUsoId) return;
    const destId = document.getElementById('mover-ponto-destino').value;
    if (!destId) { alert('Selecione uma propriedade de destino.'); return; }

    const btn = document.getElementById('btn-confirmar-mover');
    btn.disabled = true; btn.textContent = '⏳ Movendo...';
    try {
      const r = await api('usos?id=eq.' + _moverPontoUsoId, 'PATCH', { propriedade_id: destId }, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));
      fecharModal('ov-mover-ponto');
      await carregarDados();
      if (clienteAtualId) verCliente(clienteAtualId);
      if (leadAtualId) verLead(leadAtualId);
      _moverPontoUsoId = null;
    } catch(e) {
      alert('Erro ao mover ponto: ' + (e.message || e));
    } finally {
      btn.disabled = false; btn.textContent = 'Mover';
    }
  }

  // ============================================================
  // IMPORTAÇÃO DE LEADS (PLANILHA UNIFICADA)
  // ============================================================
  function abrirImportarLeads() {
    document.getElementById('import-leads-file').value = '';
    document.getElementById('import-leads-preview').innerHTML = '';
    document.getElementById('btn-confirmar-import-leads').style.display = 'none';
    dadosImportLeads = null;
    abrirModal('ov-importar-leads');
  }

  function baixarModeloImportLeads() {
    if (typeof XLSX === 'undefined') { alert('Biblioteca XLSX não carregada.'); return; }
    const wb = XLSX.utils.book_new();

    // Aba 1: LEIA-ME (instruções)
    const leiame = [
      ['MODELO DE IMPORTAÇÃO — PROSPECÇÃO ZELLO'],
      [''],
      ['Este arquivo tem 3 abas. Não renomeie nem reordene as abas.'],
      [''],
      ['ABA 1_Outorgados — UMA LINHA POR PESSOA/EMPRESA'],
      ['  • Nome (obrigatório)'],
      ['  • CPF/CNPJ (obrigatório, será validado por dígito)'],
      ['  • Telefone, E-mail, Observações (opcionais)'],
      [''],
      ['ABA 2_Propriedades — UMA LINHA POR PROPRIEDADE'],
      ['  • CPF/CNPJ do dono (deve existir na aba Outorgados)'],
      ['  • Nome da propriedade (obrigatório)'],
      ['  • Cidade, Estado, Lat/Lng, Área (opcionais)'],
      [''],
      ['ABA 3_Pontos — UMA LINHA POR PONTO DE CAPTAÇÃO'],
      ['  • CPF/CNPJ do dono e Nome da propriedade (devem casar com abas anteriores)'],
      ['  • Descrição do ponto (obrigatório, ex: POÇO 1, MANANCIAL X)'],
      ['  • Requerimento, Tipo de ato, Tipo de intervenção'],
      ['  • Corpo hídrico, Latitude, Longitude (sexagesimal: 21°10\'37"S)'],
      ['  • Finalidade, Volume diário (m³), Vazão m³/h, h/dia, dias/mês'],
      ['  • Prazo (meses), Data de emissão, Portaria, Processo'],
      [''],
      ['REGRAS DE IMPORTAÇÃO:'],
      ['1. Cada CPF/CNPJ vira 1 lead com status "novo".'],
      ['2. Linhas com CPF/CNPJ inválido são ignoradas.'],
      ['3. CPFs duplicados na mesma planilha viram 1 lead só (consolidação).'],
      ['4. Se um CPF JÁ EXISTE no banco (cliente ativo, lead, ou em projeto):'],
      ['   • Cliente original NÃO é tocado.'],
      ['   • É criada uma propriedade-placeholder "REVISAR — DD/MM/AAAA" no cliente original.'],
      ['   • Todos os pontos novos vão pra essa propriedade.'],
      ['   • Você organiza depois (renomear propriedade + mover pontos).']
    ];
    const ws0 = XLSX.utils.aoa_to_sheet(leiame);
    XLSX.utils.book_append_sheet(wb, ws0, 'LEIA-ME');

    // Aba 2: Outorgados
    const outorgados = [
      ['nome', 'cpf_cnpj', 'telefone', 'email', 'observacoes'],
      ['JOSE DA SILVA', '123.456.789-00', '(16) 99999-0000', 'jose@exemplo.com', 'Indicação do João'],
      ['FAZENDA AGUA AZUL LTDA', '12.345.678/0001-90', '(16) 98888-1111', 'contato@aguaazul.com', '']
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(outorgados);
    XLSX.utils.book_append_sheet(wb, ws1, '1_Outorgados');

    // Aba 3: Propriedades
    const props = [
      ['cpf_cnpj_dono', 'nome_propriedade', 'cidade', 'estado', 'latitude', 'longitude', 'area_total_ha', 'area_irrigada_ha'],
      ['123.456.789-00', 'FAZENDA SAO JOSE', 'Muzambinho', 'MG', '21°10\'37.783"S', '46°31\'12.456"W', '120', '45'],
      ['12.345.678/0001-90', 'SITIO AGUA AZUL', 'Caconde', 'SP', '21°31\'40.000"S', '46°38\'25.000"W', '50', '30']
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(props);
    XLSX.utils.book_append_sheet(wb, ws2, '2_Propriedades');

    // Aba 4: Pontos
    const pontos = [
      ['cpf_cnpj_dono', 'nome_propriedade', 'descricao_ponto', 'requerimento', 'tipo_ato', 'tipo_intervencao', 'corpo_hidrico', 'latitude', 'longitude', 'finalidade', 'volume_diario_m3', 'vazao_m3h', 'horas_uso_dia', 'dias_uso_mes', 'prazo_meses', 'data_emissao', 'portaria', 'processo', 'numero_serie'],
      ['123.456.789-00', 'FAZENDA SAO JOSE', 'POCO 1', '20210027043-PVD', 'OUTORGA DE DIREITO', 'CAPTACAO SUBTERRANEA', 'AQUIFERO BAURU', '21°10\'37.783"S', '46°31\'12.456"W', 'IRRIGACAO', '120', '15', '8', '30', '120', '2024-03-15', 'PORT. DAEE 4567/2024', '12345/2023', 'HM-001234'],
      ['12.345.678/0001-90', 'SITIO AGUA AZUL', 'CAPTACAO RIO', '20220033112-AAA', 'AUTORIZACAO', 'CAPTACAO SUPERFICIAL', 'RIO PARDO', '21°31\'40.000"S', '46°38\'25.000"W', 'DESSEDENTACAO ANIMAL', '8', '2', '4', '30', '60', '2024-06-01', '', '', '']
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(pontos);
    XLSX.utils.book_append_sheet(wb, ws3, '3_Pontos');

    XLSX.writeFile(wb, 'modelo_zello_prospeccao.xlsx');
  }

  async function previewImportLeads(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    if (typeof XLSX === 'undefined') { alert('Biblioteca XLSX não carregada.'); return; }

    const preview = document.getElementById('import-leads-preview');
    preview.innerHTML = '<div style="padding:12px;color:var(--text-muted);font-size:12px;">⏳ Lendo planilha...</div>';

    try {
      const data = await new Promise(function(res, rej) {
        const r = new FileReader();
        r.onload = function(e){ res(e.target.result); };
        r.onerror = function(){ rej(new Error('Falha ao ler arquivo')); };
        r.readAsArrayBuffer(file);
      });
      const wb = XLSX.read(data, { type:'array' });

      // Lê 3 abas (com fallback de nomes)
      const findSheet = function(prefix) {
        const nomes = wb.SheetNames || [];
        for (let i = 0; i < nomes.length; i++) {
          if (nomes[i].toLowerCase().indexOf(prefix.toLowerCase()) >= 0) return nomes[i];
        }
        return null;
      };
      const sOutorgados = findSheet('outorgados') || findSheet('1_');
      const sProps = findSheet('propriedades') || findSheet('2_');
      const sPontos = findSheet('pontos') || findSheet('3_');

      if (!sOutorgados) { preview.innerHTML = '<div style="color:#C62828;">❌ Aba "Outorgados" não encontrada na planilha. Use o modelo.</div>'; return; }

      const outorgados = XLSX.utils.sheet_to_json(wb.Sheets[sOutorgados], { defval:'' });
      const props = sProps ? XLSX.utils.sheet_to_json(wb.Sheets[sProps], { defval:'' }) : [];
      const pontos = sPontos ? XLSX.utils.sheet_to_json(wb.Sheets[sPontos], { defval:'' }) : [];

      // PROCESSAMENTO
      const erros = [];
      const leadsParsed = {}; // chave: cpf_cnpj limpo → lead
      const propsParsed = []; // {cpfDono, nome, cidade, estado, lat, lng, area, ...}
      const pontosParsed = []; // {cpfDono, nomePropriedade, descricao, ...}

      // 1) Outorgados
      outorgados.forEach(function(row, i) {
        const lin = i + 2; // header é linha 1
        const nome = (row.nome || row.Nome || '').toString().trim();
        const docRaw = (row.cpf_cnpj || row.CPF_CNPJ || row.cnpj || row.cpf || '').toString().trim();
        if (!nome && !docRaw) return; // linha vazia
        if (!nome) { erros.push('Outorgados linha ' + lin + ': nome em branco.'); return; }
        if (!docRaw) { erros.push('Outorgados linha ' + lin + ': CPF/CNPJ em branco.'); return; }
        const docLimpo = docRaw.replace(/\D/g,'');
        if (docLimpo.length !== 11 && docLimpo.length !== 14) { erros.push('Outorgados linha ' + lin + ': CPF/CNPJ com tamanho inválido (' + docRaw + ').'); return; }
        if (!validarDocumento(docLimpo)) { erros.push('Outorgados linha ' + lin + ': CPF/CNPJ inválido (dígito) — ' + docRaw); return; }

        // Consolida duplicados na própria planilha
        if (!leadsParsed[docLimpo]) {
          leadsParsed[docLimpo] = {
            cpf_cnpj_limpo: docLimpo,
            cpf_cnpj_fmt: docRaw,
            nome: nome,
            telefone: (row.telefone || row.Telefone || '').toString().trim() || null,
            email: (row.email || row.Email || '').toString().trim() || null,
            observacoes: (row.observacoes || row.Observacoes || '').toString().trim() || null
          };
        }
      });

      // 2) Propriedades
      props.forEach(function(row, i) {
        const lin = i + 2;
        const docRaw = (row.cpf_cnpj_dono || row.cpf_cnpj || '').toString().trim();
        const nomeP = (row.nome_propriedade || row.nome || '').toString().trim();
        if (!docRaw && !nomeP) return;
        if (!docRaw) { erros.push('Propriedades linha ' + lin + ': cpf_cnpj_dono em branco.'); return; }
        if (!nomeP) { erros.push('Propriedades linha ' + lin + ': nome_propriedade em branco.'); return; }
        const docLimpo = docRaw.replace(/\D/g,'');
        if (!leadsParsed[docLimpo]) { erros.push('Propriedades linha ' + lin + ': CPF/CNPJ ' + docRaw + ' não está na aba Outorgados.'); return; }
        propsParsed.push({
          cpfDono: docLimpo,
          nome: nomeP,
          cidade: (row.cidade || '').toString().trim() || null,
          estado: (row.estado || row.uf || 'SP').toString().trim() || 'SP',
          latitude: (row.latitude || row.lat || '').toString().trim() || null,
          longitude: (row.longitude || row.lng || row.long || '').toString().trim() || null
        });
      });

      // 3) Pontos
      pontos.forEach(function(row, i) {
        const lin = i + 2;
        const docRaw = (row.cpf_cnpj_dono || row.cpf_cnpj || '').toString().trim();
        const nomeP = (row.nome_propriedade || '').toString().trim();
        const desc = (row.descricao_ponto || row.descricao || '').toString().trim();
        if (!docRaw && !nomeP && !desc) return;
        if (!docRaw) { erros.push('Pontos linha ' + lin + ': cpf_cnpj_dono em branco.'); return; }
        if (!nomeP) { erros.push('Pontos linha ' + lin + ': nome_propriedade em branco.'); return; }
        if (!desc) { erros.push('Pontos linha ' + lin + ': descricao_ponto em branco.'); return; }
        const docLimpo = docRaw.replace(/\D/g,'');
        if (!leadsParsed[docLimpo]) { erros.push('Pontos linha ' + lin + ': CPF/CNPJ ' + docRaw + ' não está na aba Outorgados.'); return; }
        pontosParsed.push({
          cpfDono: docLimpo,
          nomePropriedade: nomeP,
          descricao: desc,
          requerimento: (row.requerimento||'').toString().trim() || null,
          tipo_ato: (row.tipo_ato||'').toString().trim() || null,
          tipo_intervencao: (row.tipo_intervencao||'').toString().trim() || null,
          corpo_hidrico: (row.corpo_hidrico||'').toString().trim() || null,
          latitude: (row.latitude||'').toString().trim() || null,
          longitude: (row.longitude||'').toString().trim() || null,
          finalidade: (row.finalidade||'').toString().trim() || null,
          volume_diario_m3: row.volume_diario_m3 ? parseFloat(row.volume_diario_m3) : null,
          vazao_m3h: row.vazao_m3h ? parseFloat(row.vazao_m3h) : null,
          horas_uso_dia: row.horas_uso_dia ? parseFloat(row.horas_uso_dia) : null,
          dias_uso_mes: row.dias_uso_mes ? parseInt(row.dias_uso_mes,10) : null,
          prazo_meses: row.prazo_meses ? parseInt(row.prazo_meses,10) : null,
          data_emissao: row.data_emissao ? formatarDataExcel(row.data_emissao) : null,
          portaria: (row.portaria||'').toString().trim() || null,
          processo: (row.processo||'').toString().trim() || null,
          numero_serie: (row.numero_serie||'').toString().trim() || null
        });
      });

      // Detecta CPFs já existentes no banco
      const cpfsLista = Object.keys(leadsParsed);
      const cpfsExistentes = {};
      if (cpfsLista.length) {
        try {
          // Em batches caso muitos CPFs (limit URL)
          const todosClientes = await api('clientes?select=id,nome,cpf_cnpj,status_funil');
          (todosClientes||[]).forEach(function(c) {
            const limpoExist = (c.cpf_cnpj||'').replace(/\D/g,'');
            if (cpfsLista.indexOf(limpoExist) >= 0) {
              cpfsExistentes[limpoExist] = c;
            }
          });
        } catch(e) { /* segue */ }
      }

      const totalLeads = Object.keys(leadsParsed).length;
      const totalProps = propsParsed.length;
      const totalPontos = pontosParsed.length;
      const totalReimport = Object.keys(cpfsExistentes).length;
      const totalNovos = totalLeads - totalReimport;

      dadosImportLeads = { leadsParsed: leadsParsed, propsParsed: propsParsed, pontosParsed: pontosParsed, cpfsExistentes: cpfsExistentes };

      // Render preview
      let html = '<div style="background:#f0f9ff;border:1px solid #93c5fd;border-radius:8px;padding:12px 14px;margin-bottom:12px;font-size:12.5px;">' +
        '<strong style="color:var(--blue);">📋 Resumo:</strong><br/>' +
        '• <strong>' + totalLeads + '</strong> outorgado(s) na planilha<br/>' +
        '• <strong>' + totalNovos + '</strong> serão criados como novos leads<br/>' +
        '• <strong>' + totalReimport + '</strong> já existem no banco (vão pra "REVISAR — hoje")<br/>' +
        '• <strong>' + totalProps + '</strong> propriedade(s) · <strong>' + totalPontos + '</strong> ponto(s) de captação' +
        '</div>';

      if (totalReimport > 0) {
        html += '<div style="background:#FFF3E0;border:1px solid #FFB74D;border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:11.5px;color:#E65100;">' +
          '<strong>⚠ Reimportação detectada:</strong><br/>';
        Object.keys(cpfsExistentes).forEach(function(cpf) {
          const c = cpfsExistentes[cpf];
          const stMap = { prospeccao:'lead', em_projeto:'em projeto', cliente_ativo:'cliente ativo' };
          const st = stMap[c.status_funil || 'cliente_ativo'] || 'cliente';
          html += '• ' + c.nome + ' (' + st + ')<br/>';
        });
        html += '</div>';
      }

      if (erros.length) {
        html += '<div style="background:#FFEBEE;border:1px solid #FECACA;border-radius:8px;padding:10px 12px;margin-bottom:12px;font-size:11.5px;color:#C62828;max-height:160px;overflow-y:auto;">' +
          '<strong>⚠ ' + erros.length + ' problema(s) detectado(s) — linhas serão ignoradas:</strong><br/>' +
          erros.slice(0,30).map(function(e){ return '• ' + e; }).join('<br/>') +
          (erros.length > 30 ? '<br/>... e mais ' + (erros.length-30) + '.' : '') +
          '</div>';
      }

      if (totalLeads === 0) {
        html += '<div style="color:#C62828;font-size:12px;">❌ Nenhum lead válido encontrado. Corrija os erros acima e tente de novo.</div>';
        document.getElementById('btn-confirmar-import-leads').style.display = 'none';
      } else {
        document.getElementById('btn-confirmar-import-leads').style.display = '';
      }

      preview.innerHTML = html;
    } catch(e) {
      preview.innerHTML = '<div style="color:#C62828;font-size:12px;">❌ Erro ao ler planilha: ' + (e.message || e) + '</div>';
      console.error('previewImportLeads:', e);
    }
  }

  function formatarDataExcel(v) {
    if (!v) return null;
    // Excel pode mandar como número serial, string YYYY-MM-DD, ou DD/MM/YYYY
    if (typeof v === 'number') {
      // Número serial Excel
      const d = new Date((v - 25569) * 86400 * 1000);
      return d.toISOString().substring(0,10);
    }
    const s = v.toString().trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.substring(0,10);
    if (/^\d{2}\/\d{2}\/\d{4}/.test(s)) {
      const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
      return m[3] + '-' + m[2] + '-' + m[1];
    }
    return null;
  }

  async function confirmarImportLeads() {
    if (!dadosImportLeads) return;
    const btn = document.getElementById('btn-confirmar-import-leads');
    btn.disabled = true; btn.textContent = '⏳ Importando...';
    const sess = getSessao();
    const criadoPor = sess && sess.nome ? sess.nome : (sess && sess.email ? sess.email : 'admin');

    let okLeads = 0, okProps = 0, okPontos = 0, errosImp = [];
    const cpfParaIdLead = {}; // mapeia cpf_limpo → cliente_id (lead novo OU cliente existente)
    const propIds = {}; // mapeia "cpfLimpo|nomeProp" → propriedade_id

    try {
      // ETAPA 1: Criar/identificar lead pra cada CPF
      const cpfsExistentes = dadosImportLeads.cpfsExistentes;
      const dataHoje = new Date().toLocaleDateString('pt-BR'); // DD/MM/AAAA

      for (const cpf of Object.keys(dadosImportLeads.leadsParsed)) {
        const ld = dadosImportLeads.leadsParsed[cpf];
        if (cpfsExistentes[cpf]) {
          // CPF já existe — não cria novo cliente, mas cria propriedade-placeholder REVISAR
          const cliExistente = cpfsExistentes[cpf];
          cpfParaIdLead[cpf] = cliExistente.id;
          // Cria propriedade REVISAR
          try {
            const rp = await api('propriedades', 'POST', {
              cliente_id: cliExistente.id,
              nome: 'REVISAR — ' + dataHoje,
              cidade: null,
              estado: 'SP',
              ativo: true
            }, 'return=representation');
            if (rp && rp.ok) {
              const dp = await rp.json();
              const propRevisarId = dp[0] && dp[0].id;
              if (propRevisarId) {
                // TODOS os pontos desse CPF caem na propriedade REVISAR
                propIds[cpf + '|__REVISAR__'] = propRevisarId;
                okProps++;
              }
            }
          } catch(e) { errosImp.push('REVISAR ' + ld.nome + ': ' + (e.message||e)); }
        } else {
          // CPF novo — cria como lead
          try {
            const rL = await api('clientes', 'POST', {
              nome: upper(ld.nome),
              cpf_cnpj: ld.cpf_cnpj_fmt,
              telefone1: ld.telefone,
              email: ld.email,
              observacoes_lead: ld.observacoes,
              ativo: true,
              status_funil: 'prospeccao',
              status_lead: 'novo',
              origem_lead: 'importacao',
              pin_hash: null,
              portal_ativo: false
            }, 'return=representation');
            if (!rL || !rL.ok) throw new Error('HTTP ' + (rL?rL.status:'?'));
            const dL = await rL.json();
            const novoId = dL[0] && dL[0].id;
            if (novoId) { cpfParaIdLead[cpf] = novoId; okLeads++; }
          } catch(e) { errosImp.push('Lead ' + ld.nome + ': ' + (e.message||e)); }
        }
      }

      // ETAPA 2: Criar propriedades (só pra leads novos — reimportação já criou REVISAR)
      for (const p of dadosImportLeads.propsParsed) {
        if (cpfsExistentes[p.cpfDono]) continue; // pula reimportação (cai em REVISAR)
        const cid = cpfParaIdLead[p.cpfDono];
        if (!cid) continue;
        try {
          const rP = await api('propriedades', 'POST', {
            cliente_id: cid,
            nome: upper(p.nome),
            cidade: p.cidade,
            estado: p.estado || 'SP',
            latitude: p.latitude || null,         // SEMANA 4.19 FIX: estava sumindo da planilha
            longitude: p.longitude || null,
            ativo: true
          }, 'return=representation');
          if (rP && rP.ok) {
            const dP = await rP.json();
            const pid = dP[0] && dP[0].id;
            if (pid) {
              propIds[p.cpfDono + '|' + p.nome.toUpperCase()] = pid;
              okProps++;
            }
          }
        } catch(e) { errosImp.push('Propriedade ' + p.nome + ': ' + (e.message||e)); }
      }

      // ETAPA 3: Criar pontos
      for (const pt of dadosImportLeads.pontosParsed) {
        const cid = cpfParaIdLead[pt.cpfDono];
        if (!cid) continue;
        // Resolve a propriedade-destino: se reimportação → REVISAR, senão → propriedade nominal
        let pidDestino = null;
        if (cpfsExistentes[pt.cpfDono]) {
          pidDestino = propIds[pt.cpfDono + '|__REVISAR__'];
        } else {
          pidDestino = propIds[pt.cpfDono + '|' + pt.nomePropriedade.toUpperCase()];
        }
        if (!pidDestino) {
          errosImp.push('Ponto ' + pt.descricao + ': propriedade não encontrada (' + pt.nomePropriedade + ')');
          continue;
        }
        try {
          // SEMANA 4.19 FIX: gera token UUID pra cada uso (igual quando criado manual)
          // Sem token, alguns recursos do portal não funcionam (link específico do ponto, etc)
          const tokenUuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
            const r = Math.random()*16|0;
            return (c==='x'?r:(r&0x3|0x8)).toString(16);
          });
          const rU = await api('usos', 'POST', {
            propriedade_id: pidDestino,
            cliente_id: cid,
            descricao: upper(pt.descricao),
            requerimento: pt.requerimento,
            tipo_ato: pt.tipo_ato,
            tipo_intervencao: pt.tipo_intervencao,
            corpo_hidrico: pt.corpo_hidrico,
            latitude: pt.latitude,
            longitude: pt.longitude,
            finalidade: pt.finalidade,
            volume_diario_m3: pt.volume_diario_m3,
            vazao_m3h: pt.vazao_m3h,
            horas_uso_dia: pt.horas_uso_dia,
            dias_uso_mes: pt.dias_uso_mes,
            prazo_meses: pt.prazo_meses,
            data_emissao: pt.data_emissao,
            portaria: pt.portaria,
            processo: pt.processo,
            numero_serie: pt.numero_serie,
            possui_hidrometro: !!pt.numero_serie,
            ativo: true,
            tipo_outorga: 'outorga',
            token: tokenUuid     // FIX: faltava
          }, 'return=minimal');
          if (rU && rU.ok) okPontos++;
          else errosImp.push('Ponto ' + pt.descricao + ': HTTP ' + (rU?rU.status:'?'));
        } catch(e) { errosImp.push('Ponto ' + pt.descricao + ': ' + (e.message||e)); }
      }

      fecharModal('ov-importar-leads');
      await carregarDados();
      navTo('prospeccao', document.querySelector('.nav-item[data-page="prospeccao"]'));

      const msg = '✅ Importação concluída!\n\n' +
        '• ' + okLeads + ' novo(s) lead(s) criado(s)\n' +
        '• ' + okProps + ' propriedade(s) criada(s)\n' +
        '• ' + okPontos + ' ponto(s) de captação criado(s)\n' +
        (errosImp.length ? '\n⚠ ' + errosImp.length + ' erro(s) — verifique o console (F12)' : '');
      alert(msg);
      if (errosImp.length) console.warn('Erros de importação:', errosImp);
    } catch(e) {
      console.error('Erro confirmarImportLeads:', e);
      alert('Erro durante importação: ' + (e.message || e));
    } finally {
      btn.disabled = false; btn.textContent = '✓ Confirmar importação';
    }
  }


  // ============================================================
  // EM PROJETO (FASE 2 — pipeline de execução de outorga)
  // ============================================================
  let projetoAtualId = null;
  let pagamentosProjAtual = [];
  let historicoProjAtual = [];
  let docsProjAtual = [];
  let _projFiltroBusca = '';
  let _projFiltroResp = '';
  let _projVerConcluidos = false;

  // FASE 10: ETAPAS_PROJETO virou `let` pra permitir customização via config_etapas_projeto
  // O campo `col` é estrutural (não-editável). Apenas `nome` e `icone` vêm do banco.
  // FASE 14.3: Renomeadas pra refletir fluxo Hunter→Projetos:
  //   Etapa 1: Pgto1 + Docs (checkboxes ☐ pago_1 ☐ docs_ok)
  //   Etapa 2: Protocolo
  //   Etapa 3: Em análise
  //   Etapa 4: Concluído + Pgto2 (checkbox ☐ pago_2)
  let ETAPAS_PROJETO = [
    { num: 1, nome: 'Pagamento 1 + Documentos', icone: '💰', col: 'data_vistoria' },
    { num: 2, nome: 'Protocolo',                icone: '📥', col: 'data_protocolo' },
    { num: 3, nome: 'Em análise',               icone: '🔍', col: 'data_analise' },
    { num: 4, nome: 'Concluído + Pagamento 2',  icone: '✅', col: 'data_publicacao' }
  ];

  // FASE 10: Carrega nomes/ícones das etapas do banco e mescla com ETAPAS_PROJETO
  async function carregarConfigEtapasProjeto() {
    try {
      const data = await api('config_etapas_projeto?ativo=eq.true&order=numero.asc&select=*');
      if (data && data.length) {
        data.forEach(function(e) {
          const idx = e.numero - 1;
          if (idx >= 0 && idx < ETAPAS_PROJETO.length) {
            // Preserva o `col` (estrutural), atualiza nome e ícone
            ETAPAS_PROJETO[idx].nome = e.nome || ETAPAS_PROJETO[idx].nome;
            ETAPAS_PROJETO[idx].icone = e.icone || ETAPAS_PROJETO[idx].icone;
            ETAPAS_PROJETO[idx].cor = e.cor || null;
            ETAPAS_PROJETO[idx]._id = e.id;
          }
        });
      }
    } catch(e) {
      console.warn('Erro carregarConfigEtapasProjeto (mantém defaults):', e);
    }
    // Atualiza os títulos das colunas do kanban "Em Projeto" no HTML
    atualizarTitulosKanbanProjeto();
  }

  function atualizarTitulosKanbanProjeto() {
    ETAPAS_PROJETO.forEach(function(et) {
      const col = document.querySelector('.kanban-col[data-etapa="' + et.num + '"] .kanban-col-titulo');
      if (col) col.textContent = (et.icone || '') + ' ' + et.nome;
    });
  }

  function fmtBRL(v) {
    if (v == null || isNaN(v)) return 'R$ 0,00';
    return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function fmtData(s) {
    if (!s) return '';
    const d = new Date(s.length > 10 ? s : s + 'T12:00:00');
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('pt-BR');
  }

  function fmtDataHora(s) {
    if (!s) return '';
    const d = new Date(s);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
  }

  function carregarEmProjeto() {
    aplicarFiltrosProjeto();
  }

  function atualizarBadgeProjetos() {
    const ativos = (typeof projetos !== 'undefined' ? projetos : []).filter(function(p){ return p.status === 'em_andamento'; });
    const badge = document.getElementById('badge-projetos');
    if (badge) badge.textContent = ativos.length > 0 ? ativos.length : '';
  }

  function popularSelectRespProjeto() {
    const sel = document.getElementById('filtro-resp-projeto');
    if (!sel) return;
    const v = sel.value;
    sel.innerHTML = '<option value="">Todos responsáveis</option>';

    // SEMANA 4.19: combina equipe técnica (papel='projetos') + responsáveis legados (texto livre antigo)
    const equipeTec = (_usuariosCache || []).filter(function(u){
      return u.papel === 'projetos' && u.ativo;
    }).sort(function(a, b){ return (a.nome || '').localeCompare(b.nome || ''); });

    // Adiciona equipe técnica primeiro
    equipeTec.forEach(function(u){
      const corInfo = u.cor ? (CORES_TIMES[u.cor] || {}) : {};
      const emoji = corInfo.emoji || '👤';
      const o = document.createElement('option');
      o.value = u.nome;
      o.textContent = emoji + ' ' + u.nome;
      sel.appendChild(o);
    });

    // Depois inclui responsáveis legados (digitados manualmente) que NÃO estão na equipe
    const todosResp = Array.from(new Set((typeof projetos !== 'undefined' ? projetos : [])
      .map(function(p){ return p.responsavel; }).filter(Boolean))).sort();
    todosResp.forEach(function(r){
      const jaTem = equipeTec.find(function(u){ return u.nome === r; });
      if (!jaTem) {
        const o = document.createElement('option');
        o.value = r;
        o.textContent = '👤 ' + r + ' (manual)';
        sel.appendChild(o);
      }
    });

    sel.value = v;
  }

  function filtrarProjetos(q) {
    _projFiltroBusca = (q || '').toLowerCase().trim();
    aplicarFiltrosProjeto();
  }

  function aplicarFiltrosProjeto() {
    _projFiltroResp = (document.getElementById('filtro-resp-projeto') || {}).value || '';
    _projVerConcluidos = (document.getElementById('ver-concluidos-projeto') || {}).checked || false;
    popularSelectRespProjeto();
    renderKanban();
  }

  function renderKanban() {
    const todosProjetos = (typeof projetos !== 'undefined' ? projetos : []).slice();

    let listaFiltrada = todosProjetos;

    // Filtro por status
    if (!_projVerConcluidos) {
      listaFiltrada = listaFiltrada.filter(function(p){ return p.status === 'em_andamento'; });
    } else {
      listaFiltrada = listaFiltrada.filter(function(p){
        return p.status === 'em_andamento' || p.status === 'concluido' || p.status === 'suspenso';
      });
    }

    // Filtro responsável
    if (_projFiltroResp) {
      listaFiltrada = listaFiltrada.filter(function(p){ return p.responsavel === _projFiltroResp; });
    }

    // Busca
    if (_projFiltroBusca) {
      listaFiltrada = listaFiltrada.filter(function(p) {
        const cli = (todosClientesUnificado(p.cliente_id) || {}).nome || '';
        const prop = ((typeof propriedades !== 'undefined' ? propriedades : []).find(function(pp){ return pp.id === p.propriedade_id; }) || {}).nome || '';
        const txt = (cli + ' ' + prop + ' ' + (p.requerimento||'') + ' ' + (p.nome||'')).toLowerCase();
        return txt.indexOf(_projFiltroBusca) >= 0;
      });
    }

    // Renderiza cada coluna
    for (let etapa = 1; etapa <= 4; etapa++) {
      const col = document.getElementById('col-etapa-' + etapa);
      const cnt = document.getElementById('cnt-etapa-' + etapa);
      if (!col) continue;
      const itens = listaFiltrada.filter(function(p){ return p.etapa_atual === etapa; });
      if (cnt) cnt.textContent = itens.length;

      if (!itens.length) {
        col.innerHTML = '<div class="kanban-col-empty">Sem projetos nesta etapa</div>';
        continue;
      }

      // Ordena por dias na etapa atual (mais antigos primeiro)
      itens.sort(function(a, b) {
        const da = new Date(a.atualizado_em || a.criado_em);
        const db = new Date(b.atualizado_em || b.criado_em);
        return da - db;
      });

      col.innerHTML = itens.map(function(p) {
        const cli = todosClientesUnificado(p.cliente_id) || { nome: '(?)' };
        const prop = (typeof propriedades !== 'undefined' ? propriedades : []).find(function(pp){ return pp.id === p.propriedade_id; }) || { nome: '(?)' };

        // Calcula dias na etapa atual
        let diasNaEtapa = 0;
        const etapaCol = ETAPAS_PROJETO[etapa - 2]; // data da etapa anterior
        const dataReferencia = etapa === 1
          ? (p.data_inicio || p.criado_em)
          : (etapaCol ? p[etapaCol.col] : null) || p.atualizado_em || p.criado_em;
        if (dataReferencia) {
          const d = new Date(dataReferencia);
          if (!isNaN(d.getTime())) {
            diasNaEtapa = Math.floor((Date.now() - d.getTime()) / (1000*60*60*24));
          }
        }
        const diasClass = diasNaEtapa > 30 ? 'projeto-card-dias-warn' : '';

        const stPgto = p.status_pgto || 'aberto';
        const pgtoLabel = { aberto:'Aberto', parcial:'Parcial', quitado:'Quitado' }[stPgto];

        // SEMANA 4.22b: Mini-progresso visual (somente leitura)
        // Mostra quadradinhos pra ver de relance, mas sem possibilidade de marcar (vai pro detalhe)
        let statusEtapaHtml = '';
        if (etapa === 1) {
          const pago1 = !!p.pago_1;
          const docsOk = !!p.docs_ok;
          // 2 quadradinhos lado a lado, com tooltip
          const quad = function(label, marcado) {
            const cor = marcado ? '#10B981' : '#E2E8F0';
            const corBg = marcado ? '#D1FAE5' : '#F8FAFC';
            const corTexto = marcado ? '#065F46' : '#94A3B8';
            const icone = marcado ? '✓' : '○';
            return '<div title="' + label + (marcado ? ' (concluído)' : ' (pendente)') + '" ' +
                   'style="flex:1;display:flex;align-items:center;justify-content:center;gap:4px;padding:4px 6px;background:' + corBg + ';border:1px solid ' + cor + ';border-radius:5px;font-size:10px;font-weight:600;color:' + corTexto + ';">' +
                   '<span style="font-size:12px;">' + icone + '</span> ' + label + '</div>';
          };
          statusEtapaHtml = '<div class="projeto-card-mini-prog" style="margin:6px 0 4px;display:flex;gap:4px;">' +
            quad('Pago 1º', pago1) +
            quad('Docs', docsOk) +
            '</div>';
        } else if (etapa === 4) {
          const pago2 = !!p.pago_2;
          const cor = pago2 ? '#10B981' : '#E2E8F0';
          const corBg = pago2 ? '#D1FAE5' : '#F8FAFC';
          const corTexto = pago2 ? '#065F46' : '#94A3B8';
          const icone = pago2 ? '✓' : '○';
          statusEtapaHtml = '<div class="projeto-card-mini-prog" style="margin:6px 0 4px;display:flex;">' +
            '<div title="Pago 2º' + (pago2?' (concluído)':' (pendente)') + '" ' +
              'style="flex:1;display:flex;align-items:center;justify-content:center;gap:4px;padding:4px 6px;background:' + corBg + ';border:1px solid ' + cor + ';border-radius:5px;font-size:10px;font-weight:600;color:' + corTexto + ';">' +
              '<span style="font-size:12px;">' + icone + '</span> Pago 2º</div>' +
            '</div>';
        }

        return '<div class="projeto-card" data-projeto-id="' + p.id + '" onclick="verProjeto(\'' + p.id + '\')">' +
          '<div class="projeto-card-cli">' + escapeHtml(cli.nome) + '</div>' +
          '<div class="projeto-card-prop">📍 ' + escapeHtml(prop.nome) + '</div>' +
          (p.requerimento ? '<div class="projeto-card-req">' + escapeHtml(p.requerimento) + '</div>' : '') +
          statusEtapaHtml +
          '<div class="projeto-card-stats">' +
            '<span>💰 ' + fmtBRL(p.valor_total) + ' <span class="pgto-tag pg-' + stPgto + '">' + pgtoLabel + '</span></span>' +
            '<span class="' + diasClass + '">📅 ' + diasNaEtapa + 'd' + (diasNaEtapa > 30 ? ' ⚠' : '') + '</span>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    // FASE 3A: ativa drag-and-drop e renderiza banner de atrasados
    if (typeof setupDragKanban === 'function') setupDragKanban();
    if (typeof renderBannerAtrasados === 'function') renderBannerAtrasados();
  }

  // Busca cliente em todos os arrays (clientes, leads, em projeto)
  // FASE 14.3: Toggle "Pago 1º" no card (etapa 1)
  // REVISÃO: feedback claro sobre comissão (gerada/não gerada e por quê)
  // SEMANA 4.12: Fallback — cria comissão diretamente pelo JS se a trigger SQL falhar.
  // Retorna true se criou, false se não pôde.
  async function _criarComissaoFallback(proj) {
    if (!proj || !proj.hunter_id_origem) return false;

    // Lê config_app pra saber os valores
    let valorMin = 3000;
    let val1_4 = 500, val5_8 = 1000, val9 = 2000;
    try {
      const rCfg = await fetch(SUPABASE_URL + '/rest/v1/config_app?chave=in.(valor_minimo_proposta,comissao_1_a_4,comissao_5_a_8,comissao_9_mais)&select=chave,valor', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (rCfg.ok) {
        const cfgs = await rCfg.json();
        cfgs.forEach(function(c){
          if (c.chave === 'valor_minimo_proposta') valorMin = parseFloat(c.valor) || 3000;
          else if (c.chave === 'comissao_1_a_4') val1_4 = parseFloat(c.valor) || 500;
          else if (c.chave === 'comissao_5_a_8') val5_8 = parseFloat(c.valor) || 1000;
          else if (c.chave === 'comissao_9_mais') val9 = parseFloat(c.valor) || 2000;
        });
      }
    } catch(e) { console.warn('Não conseguiu ler config_app:', e); }

    // Valida valor mínimo
    const valorTotal = parseFloat(proj.valor_total) || 0;
    if (valorTotal < valorMin) return false;

    // Conta quantas comissões esse hunter já tem ATIVAS no mês corrente
    const hoje = new Date();
    const mesRef = hoje.getFullYear() + '-' + String(hoje.getMonth() + 1).padStart(2, '0') + '-01';
    try {
      const rExist = await fetch(SUPABASE_URL + '/rest/v1/comissoes?hunter_id=eq.' + proj.hunter_id_origem + '&mes_referencia=eq.' + mesRef + '&status_pagamento=neq.estornado&select=id', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (!rExist.ok) return false;
      const existentes = await rExist.json();
      const numFech = existentes.length + 1;

      // Determina valor pelo número de fechamento
      let valorCom;
      if (numFech <= 4) valorCom = val1_4;
      else if (numFech <= 8) valorCom = val5_8;
      else valorCom = val9;

      // Cria a comissão
      const payload = {
        projeto_id: proj.id,
        hunter_id: proj.hunter_id_origem,
        cliente_id: proj.cliente_id,
        valor_proposta: valorTotal,
        valor_comissao: valorCom,
        numero_fechamento_mes: numFech,
        mes_referencia: mesRef,
        status_pagamento: 'pendente'
      };
      const r = await fetch(SUPABASE_URL + '/rest/v1/comissoes', {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
        body: JSON.stringify(payload)
      });
      if (!r.ok) {
        console.error('Fallback comissão HTTP ' + r.status);
        return false;
      }
      showToast('💰 Comissão criada (fallback JS): R$ ' + valorCom.toLocaleString('pt-BR') + ' (' + numFech + 'º fechamento)', 'success', 5000);
      return true;
    } catch(e) {
      console.error('Erro fallback comissão:', e);
      return false;
    }
  }

  async function togglePagoUmProjeto(projetoId, marcar, checkboxEl) {
    if (!projetoId) return;
    // FIX BUG #3: proteção duplo-click
    if (checkboxEl && checkboxEl.getAttribute('data-busy') === '1') {
      checkboxEl.checked = !marcar;   // reverte visual
      return;
    }
    if (checkboxEl) {
      checkboxEl.setAttribute('data-busy', '1');
      checkboxEl.disabled = true;
    }
    const proj = projetos.find(function(x){ return x.id === projetoId; });
    if (!proj) {
      if (checkboxEl) { checkboxEl.setAttribute('data-busy', '0'); checkboxEl.disabled = false; }
      return;
    }

    try {
      const hoje = getDataHojeBR();
      const payload = {
        pago_1: marcar,
        pago_1_em: marcar ? hoje : null
      };

      // FIX BUG: Quando marca Pago 1º, registra 50% do valor_total em valor_pago
      // (outorga típica é 50%+50%). Se desmarcar, subtrai.
      const meiaParte = (parseFloat(proj.valor_total) || 0) / 2;
      const valorPagoAtual = parseFloat(proj.valor_pago) || 0;
      if (marcar) {
        payload.valor_pago = Math.min(valorPagoAtual + meiaParte, parseFloat(proj.valor_total) || 0);
        // Define status_pgto: 'parcial' se Pago 2 ainda não, 'quitado' se ambos pagos
        payload.status_pgto = proj.pago_2 ? 'quitado' : 'parcial';
      } else {
        payload.valor_pago = Math.max(valorPagoAtual - meiaParte, 0);
        payload.status_pgto = proj.pago_2 ? 'parcial' : 'aberto';
      }

      const r = await fetch(SUPABASE_URL + '/rest/v1/projetos?id=eq.' + projetoId, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify(payload)
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);

      // FIX BUG: Registra na tabela projeto_pagamentos (auditoria)
      if (marcar && meiaParte > 0) {
        try {
          await api('projeto_pagamentos', 'POST', {
            projeto_id: projetoId,
            valor: meiaParte,
            data_pagamento: hoje,
            tipo: 'pago_1',
            observacao: 'Registrado automaticamente ao marcar Pago 1º'
          }, 'return=minimal');
        } catch(e) { console.warn('Não registrou em projeto_pagamentos (tabela pode não existir):', e); }
      }

      // ONDA 1 BUG#14: Estorno automático de comissão quando DESMARCA pago_1
      if (!marcar) {
        try {
          // Estorna apenas comissões PENDENTES (já pagas não podem ser estornadas — dinheiro já saiu)
          const rEst = await fetch(SUPABASE_URL + '/rest/v1/comissoes?projeto_id=eq.' + projetoId + '&status_pagamento=eq.pendente', {
            method: 'PATCH',
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
            body: JSON.stringify({ status_pagamento: 'estornado' })
          });
          if (rEst.ok) {
            const estornadas = await rEst.json();
            if (estornadas && estornadas.length > 0) {
              const totalEstornado = estornadas.reduce(function(s, c){ return s + parseFloat(c.valor_comissao || 0); }, 0);
              if (typeof showToast === 'function') {
                showToast('↩ Pago 1º desmarcado · Comissão estornada: R$ ' + totalEstornado.toLocaleString('pt-BR'), 'warn', 6000);
              }
            }
          }
          // Atenção: se houver comissão JÁ PAGA, NÃO mexer — só avisar
          const rPagas = await fetch(SUPABASE_URL + '/rest/v1/comissoes?projeto_id=eq.' + projetoId + '&status_pagamento=eq.pago&select=valor_comissao', {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
          });
          if (rPagas.ok) {
            const pagas = await rPagas.json();
            if (pagas && pagas.length > 0) {
              const totalPago = pagas.reduce(function(s, c){ return s + parseFloat(c.valor_comissao || 0); }, 0);
              zAlert('⚠ Atenção: Pago 1º foi desmarcado, MAS há comissão já paga para este projeto (R$ ' + totalPago.toLocaleString('pt-BR') + ').\n\nA comissão paga NÃO foi estornada (o dinheiro já saiu). Se for um erro, ajuste manualmente na aba Comissões.', { tipo:'aviso', titulo:'Comissão já paga' });
            }
          }
        } catch(e) { console.warn('Erro ao estornar comissão:', e); }
      }

      // ONDA 1 BUG#12: registra mudança de pago_1 no histórico do projeto
      try {
        await api('projeto_historico', 'POST', {
          projeto_id: projetoId,
          acao: marcar ? 'pago_1_marcado' : 'pago_1_desmarcado',
          para_valor: marcar ? 'sim' : 'nao',
          observacao: marcar ? ('Pago 1º registrado em ' + hoje) : 'Pago 1º desmarcado (correção)',
          criado_por: getCriadoPor()
        }, 'return=minimal');
      } catch(e) { console.warn('Erro registrando histórico de pago_1:', e); }

      // Atualiza cache local
      proj.pago_1 = payload.pago_1;
      proj.pago_1_em = payload.pago_1_em;
      proj.valor_pago = payload.valor_pago;
      proj.status_pgto = payload.status_pgto;

      // REVISÃO: feedback se comissão foi gerada (trigger SQL)
      if (marcar) {
        // SEMANA 4.12: aguarda trigger SQL, se não criou em 1.5s, cria via JS (fallback)
        setTimeout(async function(){
          try {
            const rC = await fetch(SUPABASE_URL + '/rest/v1/comissoes?projeto_id=eq.' + projetoId + '&select=valor_comissao,status_pagamento,numero_fechamento_mes', {
              headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
            });
            if (rC.ok) {
              const coms = await rC.json();
              const ativa = coms.find(function(c){ return c.status_pagamento !== 'estornado'; });
              if (ativa) {
                // Comissão criada pela trigger
                showToast('💰 Comissão gerada: R$ ' + parseFloat(ativa.valor_comissao || 0).toLocaleString('pt-BR') + ' (' + ativa.numero_fechamento_mes + 'º fechamento do mês)', 'success', 5000);
              } else {
                // SEMANA 4.12: trigger não rodou — tenta criar via JS
                const sucesso = await _criarComissaoFallback(proj);
                if (!sucesso) {
                  // Falhou: diagnóstico
                  let motivo = '';
                  if (!proj.hunter_id_origem) motivo = 'Este projeto não tem hunter associado.';
                  else if (!proj.valor_total || proj.valor_total < 3000) motivo = 'Valor do projeto (R$ ' + (proj.valor_total || 0) + ') está abaixo do mínimo (R$ 3.000).';
                  else motivo = 'Erro ao criar comissão. Verifique config_app no Supabase.';

                  showToast('⚠ Pago 1º registrado, mas comissão NÃO criada: ' + motivo, 'warn', 8000);
                }
              }
            }
          } catch(e) { console.warn('Erro ao verificar comissão:', e); }
        }, 1500);   // Aumentado pra 1.5s pra dar tempo da trigger
      }

      // Re-renderiza
      if (typeof aplicarFiltrosProjeto === 'function') aplicarFiltrosProjeto();
      // Atualiza card no dashboard
      if (typeof atualizarCardComissoesDashboard === 'function') atualizarCardComissoesDashboard();
    } catch(e) {
      console.error('Erro togglePagoUm:', e);
      alert('Erro ao salvar: ' + (e.message || ''));
      carregarDados();
    } finally {
      // FIX BUG #3: libera o checkbox
      if (checkboxEl) {
        checkboxEl.setAttribute('data-busy', '0');
        checkboxEl.disabled = false;
      }
    }
  }

  // FASE 14.3: Toggle "Docs OK" no card (etapa 1)
  async function toggleDocsOkProjeto(projetoId, marcar, checkboxEl) {
    if (!projetoId) return;
    // FIX BUG #3: proteção duplo-click
    if (checkboxEl && checkboxEl.getAttribute('data-busy') === '1') {
      checkboxEl.checked = !marcar;
      return;
    }
    if (checkboxEl) {
      checkboxEl.setAttribute('data-busy', '1');
      checkboxEl.disabled = true;
    }
    try {
      const payload = {
        docs_ok: marcar,
        docs_ok_em: marcar ? getDataHojeBR() : null
      };
      const r = await fetch(SUPABASE_URL + '/rest/v1/projetos?id=eq.' + projetoId, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify(payload)
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const p = projetos.find(function(x){ return x.id === projetoId; });
      if (p) { p.docs_ok = payload.docs_ok; p.docs_ok_em = payload.docs_ok_em; }

      // ONDA 1 BUG#12: registra no histórico do projeto
      try {
        await api('projeto_historico', 'POST', {
          projeto_id: projetoId,
          acao: marcar ? 'docs_ok_marcado' : 'docs_ok_desmarcado',
          para_valor: marcar ? 'sim' : 'nao',
          observacao: marcar ? ('Documentos confirmados em ' + getDataHojeBR()) : 'Documentos OK desmarcado (correção)',
          criado_por: getCriadoPor()
        }, 'return=minimal');
      } catch(e) { console.warn('Erro registrando histórico de docs_ok:', e); }

      if (typeof aplicarFiltrosProjeto === 'function') aplicarFiltrosProjeto();
    } catch(e) {
      console.error('Erro toggleDocsOk:', e);
      alert('Erro ao salvar: ' + (e.message || ''));
      carregarDados();
    } finally {
      if (checkboxEl) {
        checkboxEl.setAttribute('data-busy', '0');
        checkboxEl.disabled = false;
      }
    }
  }

  // FASE 14.3: Toggle "Pago 2º" no card (etapa 4)
  async function togglePagoDoisProjeto(projetoId, marcar, checkboxEl) {
    if (!projetoId) return;
    // FIX BUG #3: proteção duplo-click
    if (checkboxEl && checkboxEl.getAttribute('data-busy') === '1') {
      checkboxEl.checked = !marcar;
      return;
    }
    if (checkboxEl) {
      checkboxEl.setAttribute('data-busy', '1');
      checkboxEl.disabled = true;
    }
    try {
      const hoje = getDataHojeBR();
      const proj = projetos.find(function(x){ return x.id === projetoId; });
      if (!proj) {
        if (checkboxEl) { checkboxEl.setAttribute('data-busy', '0'); checkboxEl.disabled = false; }
        return;
      }
      const payload = {
        pago_2: marcar,
        pago_2_em: marcar ? hoje : null
      };

      // FIX BUG: Pago 2º registra a outra metade do valor
      const meiaParte = (parseFloat(proj.valor_total) || 0) / 2;
      const valorPagoAtual = parseFloat(proj.valor_pago) || 0;
      if (marcar) {
        payload.valor_pago = Math.min(valorPagoAtual + meiaParte, parseFloat(proj.valor_total) || 0);
        payload.status_pgto = 'quitado';
      } else {
        payload.valor_pago = Math.max(valorPagoAtual - meiaParte, 0);
        payload.status_pgto = proj.pago_1 ? 'parcial' : 'aberto';
      }

      const r = await fetch(SUPABASE_URL + '/rest/v1/projetos?id=eq.' + projetoId, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify(payload)
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);

      // FIX BUG: Registra pagamento na tabela auditoria
      if (marcar && meiaParte > 0) {
        try {
          await api('projeto_pagamentos', 'POST', {
            projeto_id: projetoId,
            valor: meiaParte,
            data_pagamento: hoje,
            tipo: 'pago_2',
            observacao: 'Registrado automaticamente ao marcar Pago 2º'
          }, 'return=minimal');
        } catch(e) { console.warn('Não registrou em projeto_pagamentos:', e); }
      }

      proj.pago_2 = payload.pago_2;
      proj.pago_2_em = payload.pago_2_em;
      proj.valor_pago = payload.valor_pago;
      proj.status_pgto = payload.status_pgto;

      // ONDA 1 BUG#12: registra no histórico do projeto
      try {
        await api('projeto_historico', 'POST', {
          projeto_id: projetoId,
          acao: marcar ? 'pago_2_marcado' : 'pago_2_desmarcado',
          para_valor: marcar ? 'sim' : 'nao',
          observacao: marcar ? ('Pago 2º registrado em ' + hoje) : 'Pago 2º desmarcado (correção)',
          criado_por: getCriadoPor()
        }, 'return=minimal');
      } catch(e) { console.warn('Erro registrando histórico de pago_2:', e); }

      if (typeof aplicarFiltrosProjeto === 'function') aplicarFiltrosProjeto();
    } catch(e) {
      console.error('Erro togglePagoDois:', e);
      alert('Erro ao salvar: ' + (e.message || ''));
      carregarDados();
    } finally {
      if (checkboxEl) {
        checkboxEl.setAttribute('data-busy', '0');
        checkboxEl.disabled = false;
      }
    }
  }

  // FASE 14.3: Bloquear avanço da etapa 1 → 2 se faltam checks
  // (Sobrescreve verificação no avançar etapa do projeto)
  function verificarChecksEtapa(projeto, etapaDestino) {
    if (!projeto) return { ok: true };
    // Avançando da etapa 1 (Pgto1+Docs) pra etapa 2 (Protocolo)?
    if (projeto.etapa_atual === 1 && etapaDestino === 2) {
      if (!projeto.pago_1 || !projeto.docs_ok) {
        const falta = [];
        if (!projeto.pago_1) falta.push('☐ Pago 1º');
        if (!projeto.docs_ok) falta.push('☐ Docs OK');
        return {
          ok: false,
          motivo: 'Não pode avançar pra Protocolo ainda.\n\nFalta(m): ' + falta.join(' + ') + '\n\nMarque o(s) checkbox(es) no card primeiro.'
        };
      }
    }
    return { ok: true };
  }

  // ============================================================
  // FASE 14.4: COMISSÕES — Admin gerencia, Hunter visualiza
  // ============================================================
  let _comissoesCache = [];
  let _comissoesFiltradas = [];

  // Inicializa filtros da tela comissões (popula selects)
  function inicializarTelaComissoes() {
    // Popula select de meses (últimos 12)
    const selMes = document.getElementById('filtro-com-mes');
    if (selMes && selMes.options.length <= 1) {
      const hoje = new Date();
      const opts = ['<option value="">Todos os meses</option>'];
      for (let i = 0; i < 12; i++) {
        const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const mesStr = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        const valor = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-01';
        opts.push('<option value="' + valor + '"' + (i === 0 ? ' selected' : '') + '>' + mesStr.charAt(0).toUpperCase() + mesStr.slice(1) + '</option>');
      }
      selMes.innerHTML = opts.join('');
    }

    // Popula select de hunters
    const selH = document.getElementById('filtro-com-hunter');
    if (selH && selH.options.length <= 1) {
      const hunters = (_usuariosCache || []).filter(function(u){ return u.papel === 'hunter'; });
      let html = '<option value="">Todos hunters</option>';
      hunters.forEach(function(u){
        const info = u.cor ? CORES_TIMES[u.cor] : null;
        const emoji = info ? info.emoji : '👤';
        html += '<option value="' + u.id + '">' + emoji + ' ' + escapeHtml(u.nome) + '</option>';
      });
      selH.innerHTML = html;
    }
  }

  // Carrega comissões do banco aplicando filtros
  async function carregarComissoes() {
    const cont = document.getElementById('lista-comissoes');
    if (!cont) return;
    // FIX BUG #4: Segurança — só admin pode ver TODAS as comissões
    if (!souAdmin()) {
      cont.innerHTML = '<div style="font-size:13px;color:#C62828;padding:14px;background:#FFEBEE;border-radius:8px;">⛔ Acesso restrito a administradores.</div>';
      return;
    }
    cont.innerHTML = '<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:40px;">Carregando...</div>';

    try {
      // Constrói query baseada nos filtros
      const filtroMes = document.getElementById('filtro-com-mes').value;
      const filtroStatus = document.getElementById('filtro-com-status').value;
      const filtroHunter = document.getElementById('filtro-com-hunter').value;

      let url = SUPABASE_URL + '/rest/v1/comissoes?select=*&order=mes_referencia.desc,criado_em.desc';
      if (filtroMes) url += '&mes_referencia=eq.' + filtroMes;
      if (filtroStatus) url += '&status_pagamento=eq.' + filtroStatus;
      if (filtroHunter) url += '&hunter_id=eq.' + filtroHunter;

      const r = await fetch(url, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      _comissoesFiltradas = await r.json();

      // FIX BUG #21: também atualiza cache do sino (evita stale por 60s)
      // Quando admin paga uma comissão, sino atualiza imediatamente
      window._comissoesCache = _comissoesFiltradas;
      if (typeof atualizarSinoNotif === 'function') {
        setTimeout(atualizarSinoNotif, 100);
      }

      // Também carrega o total geral pra cards (sem filtros, mês selecionado)
      atualizarResumoComissoes();
      renderListaComissoes();
    } catch(e) {
      console.error('Erro carregarComissoes:', e);
      cont.innerHTML = '<div style="color:#C62828;font-size:13px;padding:14px;background:#FFEBEE;border-radius:8px;">Erro ao carregar: ' + escapeHtml(e.message || '') + '</div>';
    }
  }

  // Atualiza os cards de resumo (pendente/pago/total)
  async function atualizarResumoComissoes() {
    function setText(id, txt) {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    }
    function fmtBRL(v) {
      return 'R$ ' + (parseFloat(v) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    const filtroMes = document.getElementById('filtro-com-mes').value;
    // Usa mês atual se nenhum filtro
    const hoje = new Date();
    const mesRef = filtroMes || (hoje.getFullYear() + '-' + String(hoje.getMonth() + 1).padStart(2, '0') + '-01');

    try {
      const r = await fetch(SUPABASE_URL + '/rest/v1/comissoes?mes_referencia=eq.' + mesRef + '&select=*', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (!r.ok) return;
      const todasMes = await r.json();

      const pendentes = todasMes.filter(function(c){ return c.status_pagamento === 'pendente'; });
      const pagas = todasMes.filter(function(c){ return c.status_pagamento === 'pago'; });
      const ativas = todasMes.filter(function(c){ return c.status_pagamento !== 'estornado'; });

      const vPend = pendentes.reduce(function(s, c){ return s + parseFloat(c.valor_comissao || 0); }, 0);
      const vPagas = pagas.reduce(function(s, c){ return s + parseFloat(c.valor_comissao || 0); }, 0);
      const vTotal = ativas.reduce(function(s, c){ return s + parseFloat(c.valor_comissao || 0); }, 0);

      setText('com-pend-valor', fmtBRL(vPend));
      setText('com-pend-qty', pendentes.length + ' comissões');
      setText('com-pagas-valor', fmtBRL(vPagas));
      setText('com-pagas-qty', pagas.length + ' comissões');
      setText('com-total-valor', fmtBRL(vTotal));
      setText('com-total-qty', ativas.length + ' fechamentos');

      // Top hunter: agrupa por hunter_id
      const porHunter = {};
      ativas.forEach(function(c){
        if (!porHunter[c.hunter_id]) porHunter[c.hunter_id] = 0;
        porHunter[c.hunter_id] += parseFloat(c.valor_comissao || 0);
      });
      let topId = null, topValor = 0;
      Object.keys(porHunter).forEach(function(hid){
        if (porHunter[hid] > topValor) { topId = hid; topValor = porHunter[hid]; }
      });
      if (topId) {
        const huntObj = (_usuariosCache || []).find(function(u){ return u.id === topId; });
        const info = huntObj && huntObj.cor ? CORES_TIMES[huntObj.cor] : null;
        const emoji = info ? info.emoji : '👤';
        setText('com-top-nome', emoji + ' ' + (huntObj ? huntObj.nome : '?'));
        setText('com-top-sub', fmtBRL(topValor));
      } else {
        setText('com-top-nome', '—');
        setText('com-top-sub', 'sem dados');
      }

      // Atualiza badge no dashboard admin
      atualizarCardComissoesDashboard();
    } catch(e) {
      console.warn('Erro atualizarResumoComissoes:', e);
    }
  }

  // Atualiza card "Comissões a pagar" no Dashboard admin
  async function atualizarCardComissoesDashboard() {
    const card = document.getElementById('card-comissoes-pagar');
    if (!card) return;
    if (!souAdmin()) { card.style.display = 'none'; return; }

    try {
      const r = await fetch(SUPABASE_URL + '/rest/v1/comissoes?status_pagamento=eq.pendente&select=valor_comissao', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (!r.ok) return;
      const pendentes = await r.json();
      const total = pendentes.reduce(function(s, c){ return s + parseFloat(c.valor_comissao || 0); }, 0);

      const elVal = document.getElementById('m-comissoes-valor');
      const elSub = document.getElementById('m-comissoes-sub');
      if (elVal) elVal.textContent = 'R$ ' + total.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      if (elSub) elSub.textContent = pendentes.length + ' pendente(s)';

      // Mostra o card só se houver pendências
      card.style.display = pendentes.length > 0 ? '' : 'none';

      // Badge no menu lateral
      const badge = document.getElementById('badge-comissoes');
      if (badge) badge.textContent = pendentes.length > 0 ? pendentes.length : '';
    } catch(e) { console.warn('Erro atualizarCardComissoes:', e); }
  }

  // SEMANA 4.15: Lista comissões agrupadas por MÊS > HUNTER, com checkboxes pra lote
  function renderListaComissoes() {
    const cont = document.getElementById('lista-comissoes');
    if (!cont) return;

    if (_comissoesFiltradas.length === 0) {
      cont.innerHTML = '<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:30px;">📭 Nenhuma comissão encontrada com esses filtros.</div>';
      return;
    }

    // Limpa seleções anteriores
    window._comissoesSelecionadas = window._comissoesSelecionadas || new Set();

    // Agrupa por mês > hunter
    const porMes = {};
    _comissoesFiltradas.forEach(function(c){
      const mes = c.mes_referencia;
      if (!porMes[mes]) porMes[mes] = {};
      const huntKey = c.hunter_id || '_sem_hunter';
      if (!porMes[mes][huntKey]) porMes[mes][huntKey] = [];
      porMes[mes][huntKey].push(c);
    });

    const mesesOrdenados = Object.keys(porMes).sort().reverse();
    let html = '';

    mesesOrdenados.forEach(function(mesKey){
      const mesData = new Date(mesKey + 'T12:00:00');
      const mesLabel = mesData.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      const todasMes = _comissoesFiltradas.filter(function(c){ return c.mes_referencia === mesKey && c.status_pagamento !== 'estornado'; });
      const totalMes = todasMes.reduce(function(s, c){ return s + parseFloat(c.valor_comissao || 0); }, 0);

      // Header do MÊS
      html += '<div style="margin:18px 0 8px;padding:8px 12px;background:#f3f4f6;border-radius:6px;font-size:13px;font-weight:600;color:var(--text);">' +
        '📅 ' + (mesLabel.charAt(0).toUpperCase() + mesLabel.slice(1)) +
        ' · Total: R$ ' + totalMes.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) +
        ' (' + todasMes.length + ' itens)' +
      '</div>';

      // Por hunter dentro do mês
      const huntersOrdenados = Object.keys(porMes[mesKey]).sort(function(a, b){
        const nomeA = (_usuariosCache || []).find(function(u){ return u.id === a; });
        const nomeB = (_usuariosCache || []).find(function(u){ return u.id === b; });
        return (nomeA ? nomeA.nome : 'z').localeCompare(nomeB ? nomeB.nome : 'z');
      });

      huntersOrdenados.forEach(function(huntKey){
        const coms = porMes[mesKey][huntKey];
        const hunterObj = (_usuariosCache || []).find(function(u){ return u.id === huntKey; });
        const cor = hunterObj && hunterObj.cor ? CORES_TIMES[hunterObj.cor] : null;
        const corEmoji = cor ? cor.emoji : '👤';
        const corHex = cor ? cor.hex : '#666';
        const hunterNome = hunterObj ? hunterObj.nome : '(hunter desconhecido)';

        // Pendentes desse hunter neste mês
        const pendentes = coms.filter(function(c){ return c.status_pagamento === 'pendente'; });
        const totalPendentes = pendentes.reduce(function(s, c){ return s + parseFloat(c.valor_comissao || 0); }, 0);
        const totalHunter = coms.filter(function(c){ return c.status_pagamento !== 'estornado'; })
                              .reduce(function(s, c){ return s + parseFloat(c.valor_comissao || 0); }, 0);

        // Header do HUNTER + botão "Pagar TUDO" se houver pendentes
        html += '<div style="margin:10px 0 6px;padding:10px 12px;background:linear-gradient(90deg,' + corHex + '15 0%,white 60%);border-left:4px solid ' + corHex + ';border-radius:6px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">' +
          '<div style="display:flex;align-items:center;gap:10px;flex:1;min-width:200px;">' +
            '<div style="width:32px;height:32px;border-radius:50%;background:' + corHex + ';display:inline-flex;align-items:center;justify-content:center;font-size:16px;">' + corEmoji + '</div>' +
            '<div>' +
              '<div style="font-size:13px;font-weight:700;color:var(--text);">' + escapeHtml(hunterNome) + '</div>' +
              '<div style="font-size:11px;color:var(--text-muted);">' +
                coms.length + ' comissão' + (coms.length > 1 ? 'es' : '') +
                ' · R$ ' + totalHunter.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) +
                (pendentes.length > 0 ? ' · <span style="color:#E65100;font-weight:600;">' + pendentes.length + ' pendente(s) (R$ ' + totalPendentes.toLocaleString('pt-BR') + ')</span>' : '') +
              '</div>' +
            '</div>' +
          '</div>';

        // Botões do header do hunter
        if (pendentes.length > 0) {
          html += '<div style="display:flex;gap:6px;align-items:center;">';
          // Botão "Marcar todas" (selecionar todos os checkboxes pendentes)
          if (pendentes.length > 1) {
            html += '<button class="btn btn-sm" onclick="event.stopPropagation();marcarTodosCheckboxesHunter(\'' + huntKey + '\',\'' + mesKey + '\')" style="background:#1565C0;color:white;border:none;" title="Selecionar todas as pendentes deste hunter">☑️ Marcar todas</button>';
          }
          // Botão "Pagar TUDO do hunter no mês"
          html += '<button class="btn btn-sm" onclick="event.stopPropagation();pagarTodasComissoesHunter(\'' + huntKey + '\',\'' + mesKey + '\')" style="background:#2E7D32;color:white;border:none;font-weight:600;" title="Pagar todas as ' + pendentes.length + ' pendentes de uma vez">💰 Pagar TUDO (R$ ' + totalPendentes.toLocaleString('pt-BR') + ')</button>';
          html += '</div>';
        }
        html += '</div>';

        // Lista de comissões deste hunter
        coms.forEach(function(c){
          // Cliente
          const cli = (clientes || []).find(function(x){ return x.id === c.cliente_id; }) ||
                      (clientesEmProjeto || []).find(function(x){ return x.id === c.cliente_id; }) ||
                      (leads || []).find(function(x){ return x.id === c.cliente_id; });
          const cliNome = cli ? cli.nome : '(cliente removido)';

          // Status badge
          let statusBadge, statusBg;
          if (c.status_pagamento === 'pago') {
            statusBadge = '✅ PAGO';
            statusBg = 'background:#E8F5E9;color:#2E7D32;';
          } else if (c.status_pagamento === 'estornado') {
            statusBadge = '↩ ESTORNADO';
            statusBg = 'background:#FFEBEE;color:#C62828;';
          } else {
            statusBadge = '⏳ PENDENTE';
            statusBg = 'background:#FFF3E0;color:#E65100;';
          }

          // Botões de ação
          let acoesHtml = '';
          if (c.status_pagamento === 'pendente') {
            acoesHtml = '<button class="btn btn-sm" style="background:#2E7D32;color:white;border:none;" onclick="event.stopPropagation();marcarComissaoPaga(\'' + c.id + '\')">✓ Pagar avulsa</button>';
          } else if (c.status_pagamento === 'pago') {
            const dataPagFmt = c.pago_para_hunter_em ? new Date(c.pago_para_hunter_em + 'T12:00:00').toLocaleDateString('pt-BR') : '—';
            acoesHtml = '<span style="font-size:11px;color:var(--text-muted);">Paga em ' + dataPagFmt + '</span> ' +
              (c.comprovante_url ? '<a href="' + c.comprovante_url + '" target="_blank" class="btn btn-sm" style="background:#7B1FA2;color:white;border:none;text-decoration:none;" title="Ver comprovante: ' + escapeHtml(c.comprovante_nome || 'arquivo') + '" onclick="event.stopPropagation()">📎 Comprov.</a> ' : '') +
              (c.nf_url ? '<a href="' + c.nf_url + '" target="_blank" class="btn btn-sm" style="background:#1565C0;color:white;border:none;text-decoration:none;" title="Ver NF: ' + escapeHtml(c.nf_nome || 'arquivo') + '" onclick="event.stopPropagation()">🧾 NF</a> ' : '') +
              '<button class="btn btn-sm" style="background:#1565C0;color:white;border:none;" onclick="event.stopPropagation();gerarReciboComissao(\'' + c.id + '\')" title="Gerar recibo PDF">📑 Recibo</button> ' +
              '<button class="btn btn-sm" onclick="event.stopPropagation();desmarcarComissaoPaga(\'' + c.id + '\')" title="Reverter pagamento">↩ Reverter</button>';
          }
          // SEMANA 4.19: Botão Excluir (modo teste, só admin) — sempre disponível
          acoesHtml += ' <button class="btn btn-sm" style="background:#B71C1C;color:white;border:none;" onclick="event.stopPropagation();excluirComissao(\'' + c.id + '\')" title="Excluir comissão (modo teste — IRREVERSÍVEL)">🗑️</button>';

          // Checkbox (só aparece se pendente)
          const checkbox = c.status_pagamento === 'pendente'
            ? '<input type="checkbox" class="z-com-check" data-com-id="' + c.id + '" data-hunter="' + huntKey + '" data-mes="' + mesKey + '" onchange="atualizarSelecoesComissao()" style="width:18px;height:18px;flex-shrink:0;margin-top:4px;cursor:pointer;" />'
            : '<div style="width:18px;flex-shrink:0;"></div>';

          html += '<div style="display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border:1px solid #e5e7eb;border-radius:8px;margin:0 0 6px 24px;background:white;">' +
            checkbox +
            '<div style="flex:1;min-width:0;">' +
              '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap;margin-bottom:4px;">' +
                '<div>' +
                  '<div style="font-size:13px;font-weight:600;color:var(--text);">' + c.numero_fechamento_mes + 'º fechamento</div>' +
                  '<div style="font-size:11px;color:var(--text-muted);margin-top:2px;">📋 ' + escapeHtml(cliNome) + ' · 💰 Proposta: R$ ' + parseFloat(c.valor_proposta || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</div>' +
                '</div>' +
                '<span style="' + statusBg + 'padding:3px 10px;border-radius:10px;font-size:11px;font-weight:600;white-space:nowrap;">' + statusBadge + '</span>' +
              '</div>' +
              '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;flex-wrap:wrap;gap:8px;">' +
                '<div>' +
                  '<span style="font-size:18px;font-weight:700;color:#2E7D32;">R$ ' + parseFloat(c.valor_comissao || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</span>' +
                  '<span style="font-size:11px;color:var(--text-muted);margin-left:8px;">Pago 1º em ' + (c.pago_em ? new Date(c.pago_em + 'T12:00:00').toLocaleDateString('pt-BR') : '—') + '</span>' +
                '</div>' +
                '<div style="display:flex;gap:6px;align-items:center;">' + acoesHtml + '</div>' +
              '</div>' +
            '</div>' +
          '</div>';
        });
      });
    });

    cont.innerHTML = html;

    // Mostra/esconde barra de ação flutuante
    atualizarSelecoesComissao();
  }

  // SEMANA 4.15: marca/desmarca todos checkboxes do hunter no mês
  function marcarTodosCheckboxesHunter(huntKey, mesKey) {
    const checks = document.querySelectorAll('.z-com-check[data-hunter="' + huntKey + '"][data-mes="' + mesKey + '"]');
    // Se todos já estão marcados, desmarca; senão marca todos
    const todosMarcados = Array.from(checks).every(function(c){ return c.checked; });
    checks.forEach(function(c){ c.checked = !todosMarcados; });
    atualizarSelecoesComissao();
  }

  // SEMANA 4.15: atualiza Set de selecionadas + barra flutuante
  function atualizarSelecoesComissao() {
    const sel = new Set();
    document.querySelectorAll('.z-com-check:checked').forEach(function(c){
      sel.add(c.dataset.comId);
    });
    window._comissoesSelecionadas = sel;

    // Barra flutuante no rodapé quando há seleção
    let barra = document.getElementById('z-com-barra-acao');
    if (sel.size === 0) {
      if (barra) barra.style.display = 'none';
      return;
    }

    // Calcula total das selecionadas
    let total = 0;
    let huntersUnicos = new Set();
    (_comissoesFiltradas || []).forEach(function(c){
      if (sel.has(c.id)) {
        total += parseFloat(c.valor_comissao || 0);
        if (c.hunter_id) huntersUnicos.add(c.hunter_id);
      }
    });

    if (!barra) {
      barra = document.createElement('div');
      barra.id = 'z-com-barra-acao';
      barra.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:white;border:1px solid var(--border);border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,0.18);padding:12px 18px;display:flex;align-items:center;gap:16px;z-index:9999;font-size:13px;';
      document.body.appendChild(barra);
    }
    barra.style.display = 'flex';
    const totalFmt = total.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    const huntersTxt = huntersUnicos.size === 1 ? '1 hunter' : huntersUnicos.size + ' hunters';
    barra.innerHTML =
      '<div><strong>' + sel.size + ' comissão' + (sel.size > 1 ? 'es' : '') + ' selecionada' + (sel.size > 1 ? 's' : '') + '</strong> · ' + huntersTxt + ' · <span style="color:#2E7D32;font-weight:700;">R$ ' + totalFmt + '</span></div>' +
      '<button class="btn btn-sm" onclick="limparSelecaoComissoes()" style="background:white;border:1px solid var(--border);">Limpar seleção</button>' +
      '<button class="btn btn-sm" onclick="pagarComissoesSelecionadas()" style="background:#2E7D32;color:white;border:none;font-weight:600;">💰 Pagar selecionadas</button>';
  }

  function limparSelecaoComissoes() {
    document.querySelectorAll('.z-com-check').forEach(function(c){ c.checked = false; });
    atualizarSelecoesComissao();
  }



  // Marca uma comissão como paga
  // SEMANA 4.4: ID da comissão sendo paga (controle do modal)
  let _pgcomComissaoId = null;

  // Helper: atualiza label do input file quando user escolhe arquivo
  function atualizarLabelComprov(inputId, labelId) {
    const input = document.getElementById(inputId);
    const label = document.getElementById(labelId);
    if (!input || !label) return;
    if (input.files && input.files[0]) {
      const f = input.files[0];
      const tamKb = Math.round(f.size / 1024);
      const tamFmt = tamKb > 1024 ? (tamKb / 1024).toFixed(1) + ' MB' : tamKb + ' KB';
      label.innerHTML = '✓ <strong>' + f.name + '</strong> (' + tamFmt + ')';
      label.style.color = '#2E7D32';
    } else {
      label.style.color = '';
    }
  }

  // SEMANA 4.15: Pagar TODAS as comissões pendentes de um hunter em um mês
  async function pagarTodasComissoesHunter(huntKey, mesKey) {
    if (!souAdmin()) { toastError('Apenas admin pode pagar comissões.'); return; }
    // SEMANA 4.19 FIX: trata _sem_hunter corretamente (hunter_id real é null)
    const pendentes = (_comissoesFiltradas || []).filter(function(c){
      const matchHunter = huntKey === '_sem_hunter' ? !c.hunter_id : c.hunter_id === huntKey;
      return matchHunter && c.mes_referencia === mesKey && c.status_pagamento === 'pendente';
    });
    if (pendentes.length === 0) {
      toastInfo('Não há comissões pendentes pra pagar.');
      return;
    }
    console.log('[pagarTudoHunter] huntKey=' + huntKey + ' mes=' + mesKey + ' encontrei=' + pendentes.length);
    _abrirModalPagamentoLote(pendentes.map(function(c){ return c.id; }));
  }

  // SEMANA 4.15: Pagar comissões selecionadas (via checkbox)
  async function pagarComissoesSelecionadas() {
    if (!souAdmin()) { toastError('Apenas admin pode pagar comissões.'); return; }
    const sel = window._comissoesSelecionadas || new Set();
    const ids = Array.from(sel);
    if (ids.length === 0) {
      toastInfo('Nenhuma comissão selecionada.');
      return;
    }
    // Valida que todas são pendentes
    const ativas = (_comissoesFiltradas || []).filter(function(c){
      return ids.indexOf(c.id) >= 0 && c.status_pagamento === 'pendente';
    });
    if (ativas.length === 0) {
      toastInfo('As comissões selecionadas não estão pendentes.');
      return;
    }
    _abrirModalPagamentoLote(ativas.map(function(c){ return c.id; }));
  }

  // SEMANA 4.15: Abre modal de pagamento configurado pra LOTE de N comissões
  function _abrirModalPagamentoLote(idsComissoes) {
    if (!idsComissoes || idsComissoes.length === 0) return;

    // Guarda lista de IDs (em vez de só 1)
    window._pgcomLoteIds = idsComissoes;
    _pgcomComissaoId = null;   // sinaliza que é LOTE, não avulso

    // Calcula total + dados de exibição
    const coms = (_comissoesFiltradas || []).filter(function(c){ return idsComissoes.indexOf(c.id) >= 0; });
    const total = coms.reduce(function(s, c){ return s + parseFloat(c.valor_comissao || 0); }, 0);
    const huntersUnicos = new Set();
    coms.forEach(function(c){ if (c.hunter_id) huntersUnicos.add(c.hunter_id); });

    // Texto do resumo: se 1 hunter só, mostra nome; senão "N hunters"
    let resumoTxt;
    if (huntersUnicos.size === 1) {
      const hid = Array.from(huntersUnicos)[0];
      const hunter = (_usuariosCache || []).find(function(u){ return u.id === hid; });
      resumoTxt = (hunter ? hunter.nome : '?') + ' · ' + coms.length + ' comissão' + (coms.length > 1 ? 'es' : '') +
        ' · R$ ' + total.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    } else {
      resumoTxt = huntersUnicos.size + ' hunters · ' + coms.length + ' comissões · R$ ' +
        total.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    // Reseta inputs
    const hoje = getDataHojeBR();
    document.getElementById('pgcom-data').value = hoje;
    document.getElementById('pgcom-comprovante').value = '';
    document.getElementById('pgcom-nf').value = '';
    document.getElementById('pgcom-obs').value = '';
    document.getElementById('pgcom-comprov-label').innerHTML = 'PDF, JPG ou PNG · máx ~5MB · obrigatório';
    document.getElementById('pgcom-comprov-label').style.color = '';
    document.getElementById('pgcom-nf-label').innerHTML = 'PDF, JPG, PNG ou XML · UMA NF cobrindo TODAS as comissões · obrigatória';
    document.getElementById('pgcom-nf-label').style.color = '';
    document.getElementById('pgcom-comprovante').style.outline = '';
    document.getElementById('pgcom-nf').style.outline = '';
    document.getElementById('pgcom-status').style.display = 'none';
    const btn = document.getElementById('pgcom-btn-confirmar');
    btn.disabled = false;
    btn.textContent = '✓ Confirmar pagamento (lote)';

    // Atualiza título + resumo do modal pra mostrar é LOTE
    const tituloEl = document.getElementById('pgcom-titulo');
    if (tituloEl) tituloEl.textContent = idsComissoes.length === 1 ? 'Marcar comissão como paga' : 'Pagar comissões em LOTE';
    document.getElementById('pgcom-resumo').textContent = resumoTxt;

    abrirModal('ov-pagar-comissao');
  }

  async function marcarComissaoPaga(comissaoId) {
    if (!comissaoId) return;
    if (!souAdmin()) { alert('Apenas admin pode marcar comissões como pagas.'); return; }

    // Busca comissão pra mostrar info no modal
    const com = (window._comissoesCache || _comissoesFiltradas || []).find(function(c){ return c.id === comissaoId; });
    if (!com) {
      // Busca direto se não está em cache
      try {
        const r = await fetch(SUPABASE_URL + '/rest/v1/comissoes?id=eq.' + comissaoId + '&select=*', {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
        });
        if (r.ok) {
          const list = await r.json();
          if (list[0]) {
            window._comissoesCache = (window._comissoesCache || []).concat(list[0]);
          }
        }
      } catch(e) { console.warn('Erro buscando comissão:', e); }
    }

    // SEMANA 4.4: armazena ID + reseta inputs do modal
    // SEMANA 4.19 FIX: limpa estado de lote residual
    _pgcomComissaoId = comissaoId;
    window._pgcomLoteIds = null;
    const tituloEl = document.getElementById('pgcom-titulo');
    if (tituloEl) tituloEl.textContent = 'Marcar comissão como paga';
    const hoje = getDataHojeBR();
    document.getElementById('pgcom-data').value = hoje;
    document.getElementById('pgcom-comprovante').value = '';
    document.getElementById('pgcom-nf').value = '';
    document.getElementById('pgcom-obs').value = '';
    document.getElementById('pgcom-comprov-label').innerHTML = 'PDF, JPG ou PNG · máx ~5MB · obrigatório';
    document.getElementById('pgcom-comprov-label').style.color = '';
    document.getElementById('pgcom-nf-label').innerHTML = 'PDF, JPG, PNG ou XML · da NFS-e emitida pelo hunter · obrigatória';
    document.getElementById('pgcom-nf-label').style.color = '';
    // SEMANA 4.10: reset visual outline vermelho
    document.getElementById('pgcom-comprovante').style.outline = '';
    document.getElementById('pgcom-nf').style.outline = '';
    document.getElementById('pgcom-status').style.display = 'none';
    document.getElementById('pgcom-btn-confirmar').disabled = false;
    document.getElementById('pgcom-btn-confirmar').textContent = '✓ Confirmar pagamento';

    // Resumo no header
    const comAtual = (window._comissoesCache || _comissoesFiltradas || []).find(function(c){ return c.id === comissaoId; });
    if (comAtual) {
      const hunter = (_usuariosCache || []).find(function(u){ return u.id === comAtual.hunter_id; });
      const valor = parseFloat(comAtual.valor_comissao || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 });
      document.getElementById('pgcom-resumo').textContent = (hunter ? hunter.nome : '?') + ' · R$ ' + valor + ' · ' + comAtual.numero_fechamento_mes + 'º fechamento';
    } else {
      document.getElementById('pgcom-resumo').textContent = 'Comissão de R$ ' + (com ? parseFloat(com.valor_comissao || 0).toLocaleString('pt-BR') : '?');
    }

    abrirModal('ov-pagar-comissao');
  }

  // SEMANA 4.4: confirma pagamento — faz upload + grava no banco
  // SEMANA 4.15: agora suporta LOTE (várias comissões com mesmos anexos)
  async function confirmarPagarComissao() {
    // Determina se é avulso ou lote
    const loteIds = window._pgcomLoteIds || null;
    const isLote = Array.isArray(loteIds) && loteIds.length > 0;
    if (!isLote && !_pgcomComissaoId) return;
    const idsAlvo = isLote ? loteIds : [_pgcomComissaoId];

    const dataInput = document.getElementById('pgcom-data').value.trim();
    const comprovanteFile = document.getElementById('pgcom-comprovante').files[0];
    const nfFile = document.getElementById('pgcom-nf').files[0];
    const obs = document.getElementById('pgcom-obs').value.trim();

    // SEMANA 4.10: VALIDAÇÃO — ambos anexos são OBRIGATÓRIOS
    const inpComprov = document.getElementById('pgcom-comprovante');
    const inpNf = document.getElementById('pgcom-nf');
    const lblComprov = document.getElementById('pgcom-comprov-label');
    const lblNf = document.getElementById('pgcom-nf-label');

    // Reset visual antes da validação
    if (lblComprov) lblComprov.style.color = '';
    if (lblNf) lblNf.style.color = '';
    if (inpComprov) inpComprov.style.outline = '';
    if (inpNf) inpNf.style.outline = '';

    const faltando = [];
    if (!comprovanteFile) {
      faltando.push('Comprovante de pagamento');
      if (lblComprov) { lblComprov.style.color = '#C62828'; lblComprov.innerHTML = '⚠️ Anexo obrigatório!'; }
      if (inpComprov) inpComprov.style.outline = '2px solid #C62828';
    }
    if (!nfFile) {
      faltando.push('Nota Fiscal');
      if (lblNf) { lblNf.style.color = '#C62828'; lblNf.innerHTML = '⚠️ Anexo obrigatório!'; }
      if (inpNf) inpNf.style.outline = '2px solid #C62828';
    }
    if (faltando.length > 0) {
      alert('Anexos obrigatórios faltando:\n\n• ' + faltando.join('\n• ') + '\n\nPra auditoria, ambos são necessários.');
      // Scroll pro primeiro campo faltando
      const primeiro = !comprovanteFile ? inpComprov : inpNf;
      if (primeiro) primeiro.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const hoje = getDataHojeBR();
    const dataPag = dataInput || hoje;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataPag)) {
      alert('Data inválida. Use AAAA-MM-DD.');
      return;
    }

    // FIX BUG #14: valida data
    const dataObj = new Date(dataPag + 'T12:00:00');
    if (isNaN(dataObj.getTime())) { alert('Data inválida.'); return; }
    // SEMANA 4.19 FIX: compara só DIA, não hora
    const hojeFim = new Date();
    hojeFim.setHours(23, 59, 59, 999);
    if (dataObj > hojeFim) { alert('A data não pode ser no futuro.'); return; }
    if (dataObj < new Date('2020-01-01')) { alert('Data muito antiga (anterior a 2020).'); return; }

    const btn = document.getElementById('pgcom-btn-confirmar');
    const statusEl = document.getElementById('pgcom-status');
    btn.disabled = true;
    btn.textContent = '⏳ Salvando...';
    statusEl.style.display = 'block';

    try {
      // SEMANA 4.15: pra LOTE, sobe arquivos UMA vez só (path "lote_" + timestamp)
      // pra AVULSO, mantém path com ID da comissão
      const loteToken = isLote ? ('lote_' + Date.now()) : idsAlvo[0];

      // 1. Upload comprovante (sempre, é obrigatório)
      let comprovUrl = null, comprovNome = null;
      if (comprovanteFile) {
        statusEl.textContent = '⏳ Subindo comprovante...';
        const ext = (comprovanteFile.name.split('.').pop() || 'pdf').toLowerCase();
        const path = 'comissoes/' + loteToken + '/comprovante_' + Date.now() + '.' + ext;
        const url = await uploadFile('documentos-zello', path, comprovanteFile);
        if (!url) throw new Error('Falha ao subir o comprovante. Tente arquivo menor que 5MB.');
        comprovUrl = url;
        comprovNome = comprovanteFile.name;
      }

      // 2. Upload NF (sempre, é obrigatório)
      let nfUrl = null, nfNome = null;
      if (nfFile) {
        statusEl.textContent = '⏳ Subindo nota fiscal...';
        const ext = (nfFile.name.split('.').pop() || 'pdf').toLowerCase();
        const path = 'comissoes/' + loteToken + '/nf_' + Date.now() + '.' + ext;
        const url = await uploadFile('documentos-zello', path, nfFile);
        if (!url) throw new Error('Falha ao subir a NF. Tente arquivo menor que 5MB.');
        nfUrl = url;
        nfNome = nfFile.name;
      }

      // 3. Atualiza comissão(ões) no banco — TODAS recebem os MESMOS anexos
      statusEl.textContent = isLote
        ? '⏳ Atualizando ' + idsAlvo.length + ' comissões...'
        : '⏳ Salvando no banco...';

      const payload = {
        status_pagamento: 'pago',
        pago_para_hunter_em: dataPag
      };
      if (comprovUrl) { payload.comprovante_url = comprovUrl; payload.comprovante_nome = comprovNome; }
      if (nfUrl) { payload.nf_url = nfUrl; payload.nf_nome = nfNome; }
      if (obs) payload.obs_pagamento = obs;
      // SEMANA 4.15: marca todas com o mesmo lote_token pra identificar grupo depois
      if (isLote) payload.lote_pagamento = loteToken;

      // PATCH em lote: id=in.(uuid1,uuid2,uuid3)
      const filtroIds = idsAlvo.map(function(id){ return encodeURIComponent(id); }).join(',');

      // SEMANA 4.19 FIX: tenta primeiro com lote_pagamento; se 400, tenta sem
      async function tentarPatch(payloadEnv) {
        return fetch(SUPABASE_URL + '/rest/v1/comissoes?id=in.(' + filtroIds + ')', {
          method: 'PATCH',
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
          body: JSON.stringify(payloadEnv)
        });
      }

      let r = await tentarPatch(payload);
      if (!r.ok && r.status === 400 && payload.lote_pagamento) {
        // 1ª tentativa: pode ser coluna lote_pagamento ainda não criada — tenta sem ela
        const detalhe = await r.text().catch(function(){return '';});
        if (detalhe.indexOf('lote_pagamento') >= 0) {
          console.warn('[lote] coluna lote_pagamento não existe, tentando sem ela. SQL pendente: migracao_lote_pagamento.sql');
          const payloadSemLote = Object.assign({}, payload);
          delete payloadSemLote.lote_pagamento;
          r = await tentarPatch(payloadSemLote);
        } else {
          throw new Error('HTTP ' + r.status + '\n' + detalhe.substring(0, 200));
        }
      }
      if (!r.ok) {
        let detalhe = '';
        try { detalhe = await r.text(); } catch(_){}
        console.error('Erro PATCH comissoes lote:', r.status, detalhe);
        throw new Error('HTTP ' + r.status + (detalhe ? '\n' + detalhe.substring(0, 200) : ''));
      }

      statusEl.textContent = isLote
        ? '✅ ' + idsAlvo.length + ' comissões pagas!'
        : '✅ Pagamento registrado!';
      statusEl.style.color = '#2E7D32';

      // Aguarda 800ms pra usuário ver feedback, fecha modal
      setTimeout(function(){
        fecharModal('ov-pagar-comissao');
        _pgcomComissaoId = null;
        window._pgcomLoteIds = null;   // limpa estado do lote
        // Limpa seleções da UI
        if (typeof limparSelecaoComissoes === 'function') limparSelecaoComissoes();
        carregarComissoes();
        if (typeof atualizarCardComissoesDashboard === 'function') atualizarCardComissoesDashboard();
        // Toast de sucesso
        if (isLote) {
          showToast('💰 ' + idsAlvo.length + ' comissões pagas em lote!', 'success', 4500);
        } else {
          // SEMANA 4.19: toast no avulso também
          showToast('✓ Comissão paga!', 'success', 3500);
        }
      }, 800);

    } catch(e) {
      console.error('Erro confirmarPagarComissao:', e);
      statusEl.textContent = '❌ ' + (e.message || 'Erro ao salvar');
      statusEl.style.color = '#D32F2F';
      btn.disabled = false;
      btn.textContent = '✓ Confirmar pagamento';
    }
  }

  // Desmarca pagamento (reverte pra pendente)
  // SEMANA 4.19: Excluir comissão (modo teste — admin only, dupla confirmação)
  async function excluirComissao(comissaoId) {
    if (!comissaoId) return;
    if (!souAdmin()) { toastError('Apenas admin pode excluir comissões.'); return; }

    const com = (_comissoesFiltradas || []).find(function(c){ return c.id === comissaoId; });
    if (!com) { toastError('Comissão não encontrada.'); return; }

    const hunter = (_usuariosCache || []).find(function(u){ return u.id === com.hunter_id; });
    const hunterNome = hunter ? hunter.nome : '(sem hunter)';
    const valor = parseFloat(com.valor_comissao || 0).toLocaleString('pt-BR');

    // 1ª confirmação
    const ok = await zConfirm(
      '⚠️ EXCLUIR COMISSÃO?\n\n' +
      'Hunter: ' + hunterNome + '\n' +
      'Valor: R$ ' + valor + '\n' +
      'Status: ' + (com.status_pagamento || 'pendente') + '\n\n' +
      'Esta ação é IRREVERSÍVEL.\n' +
      'Use APENAS pra testes — não exclua comissões reais!\n\n' +
      'Tem certeza?',
      { tipo:'erro', btnOk:'Sim, excluir' }
    );
    if (!ok) return;

    try {
      const r = await fetch(SUPABASE_URL + '/rest/v1/comissoes?id=eq.' + comissaoId, {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'return=minimal' }
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);

      toastSuccess('🗑️ Comissão excluída', 3500);
      await carregarComissoes();
    } catch(e) {
      console.error('Erro excluirComissao:', e);
      toastError('Erro ao excluir: ' + (e.message || ''));
    }
  }

  async function desmarcarComissaoPaga(comissaoId) {
    if (!comissaoId) return;
    if (!souAdmin()) return;
    if (!(await zConfirm('Reverter pagamento desta comissão?\n\nVai voltar pra status "Pendente". Útil se você marcou por engano.', { tipo:'erro', btnOk:'Reverter' }))) return;

    try {
      const r = await fetch(SUPABASE_URL + '/rest/v1/comissoes?id=eq.' + comissaoId, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({
          status_pagamento: 'pendente',
          pago_para_hunter_em: null
        })
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      await carregarComissoes();
    } catch(e) {
      console.error('Erro desmarcarComissaoPaga:', e);
      alert('Erro: ' + (e.message || ''));
    }
  }

  // ============================================================
  // SEMANA 3.1: GERAR RECIBO PDF DA COMISSÃO
  // ============================================================

  // Converte número em texto por extenso (em português)
  function _numeroPorExtenso(n) {
    if (n === 0) return 'zero reais';
    const valor = parseFloat(n) || 0;
    const inteiros = Math.floor(valor);
    const centavos = Math.round((valor - inteiros) * 100);

    const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    const dez_a_dezenove = ['dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
    const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
    const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

    function ate999(num) {
      if (num === 0) return '';
      if (num === 100) return 'cem';
      const c = Math.floor(num / 100);
      const r = num % 100;
      let partes = [];
      if (c > 0) partes.push(centenas[c]);
      if (r >= 10 && r <= 19) {
        partes.push(dez_a_dezenove[r - 10]);
      } else {
        const d = Math.floor(r / 10);
        const u = r % 10;
        if (d > 0) partes.push(dezenas[d]);
        if (u > 0) partes.push(unidades[u]);
      }
      return partes.join(' e ');
    }

    function porExtenso(num) {
      if (num === 0) return '';
      if (num < 1000) return ate999(num);
      if (num < 1000000) {
        const milhares = Math.floor(num / 1000);
        const resto = num % 1000;
        let txt = (milhares === 1 ? 'mil' : ate999(milhares) + ' mil');
        if (resto > 0) txt += (resto < 100 ? ' e ' : ' ') + ate999(resto);
        return txt;
      }
      return num.toLocaleString('pt-BR');   // fallback
    }

    let texto = porExtenso(inteiros);
    texto += inteiros === 1 ? ' real' : ' reais';
    if (centavos > 0) {
      texto += ' e ' + porExtenso(centavos) + (centavos === 1 ? ' centavo' : ' centavos');
    }
    return texto;
  }

  async function gerarReciboComissao(comissaoId) {
    if (!comissaoId) { alert('ID da comissão inválido.'); return; }

    try {
      // 1. Busca comissão
      const rC = await fetch(SUPABASE_URL + '/rest/v1/comissoes?id=eq.' + comissaoId + '&select=*', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (!rC.ok) throw new Error('Erro buscando comissão');
      const comList = await rC.json();
      const com = comList && comList[0];
      if (!com) { alert('Comissão não encontrada.'); return; }

      // 2. Busca dados do hunter
      const rH = await fetch(SUPABASE_URL + '/rest/v1/usuarios?id=eq.' + com.hunter_id + '&select=*', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      const hList = rH.ok ? await rH.json() : [];
      const hunter = hList[0] || { nome: '(?)', email: '' };

      // 3. Busca dados do cliente
      const rCli = await fetch(SUPABASE_URL + '/rest/v1/clientes?id=eq.' + com.cliente_id + '&select=*', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      const cliList = rCli.ok ? await rCli.json() : [];
      const cliente = cliList[0] || { nome: '(?)' };

      // 4. Busca projeto
      let projeto = { nome: '(?)' };
      if (com.projeto_id) {
        const rP = await fetch(SUPABASE_URL + '/rest/v1/projetos?id=eq.' + com.projeto_id + '&select=nome,valor_total,requerimento', {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
        });
        if (rP.ok) {
          const pList = await rP.json();
          if (pList.length > 0) projeto = pList[0];
        }
      }

      // 5. Configurações da empresa (Zello)
      const cfgZello = await _getConfigEmpresa();

      // 6. Formata dados
      const valor = parseFloat(com.valor_comissao) || 0;
      const valorTxt = 'R$ ' + valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const valorExtenso = _numeroPorExtenso(valor);
      const dataPagto = com.pago_para_hunter_em ? new Date(com.pago_para_hunter_em + 'T12:00:00').toLocaleDateString('pt-BR') : '(não pago)';
      const mesRef = com.mes_referencia ? new Date(com.mes_referencia + 'T12:00:00').toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' }) : '';
      const hoje = new Date().toLocaleDateString('pt-BR');

      const status = com.status_pagamento;
      const ehPago = status === 'pago';

      // 7. Abre janela nova com HTML pronto pra imprimir
      const nomeArq = 'recibo_comissao_' + (hunter.nome || 'hunter').replace(/\s+/g, '_').toLowerCase() + '_' + (com.mes_referencia || hoje).replace(/-/g, '');
      const w = window.open('', '_blank');
      if (!w) { alert('Permita pop-ups nesse site pra gerar o recibo.'); return; }

      w.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<title>${nomeArq}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#1F2937;background:#F5F5F5;padding:20px;}
  @media print{
    body{background:white;padding:0;}
    .no-print{display:none!important;}
  }
  .pagina{padding:48px 56px;max-width:780px;margin:0 auto;background:white;box-shadow:0 1px 3px rgba(0,0,0,0.06);border-radius:8px;}
  .header{border-bottom:3px solid #1565C0;padding-bottom:18px;margin-bottom:30px;display:flex;justify-content:space-between;align-items:flex-end;}
  .empresa-info{font-size:11px;color:#6B7280;line-height:1.5;}
  .empresa-info strong{font-size:14px;color:#1F2937;display:block;margin-bottom:4px;}
  .titulo{font-size:24px;font-weight:700;color:#1565C0;letter-spacing:0.5px;}
  .num-recibo{font-size:11px;color:#6B7280;text-align:right;margin-top:2px;}

  .valor-destaque{background:linear-gradient(135deg,#1565C0 0%,#1976D2 100%);color:white;padding:20px 24px;border-radius:8px;margin:28px 0;text-align:center;}
  .valor-destaque .label{font-size:11px;opacity:0.85;font-weight:600;letter-spacing:1px;margin-bottom:4px;}
  .valor-destaque .valor{font-size:36px;font-weight:700;line-height:1.1;}
  .valor-destaque .extenso{font-size:12px;opacity:0.9;margin-top:6px;font-style:italic;}

  .corpo{line-height:1.8;font-size:13px;text-align:justify;margin-bottom:28px;}
  .corpo strong{color:#1F2937;}

  .info-box{background:#F9FAFB;border-left:4px solid #1565C0;padding:14px 18px;margin:14px 0;border-radius:0 6px 6px 0;}
  .info-box .label{font-size:10px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;}
  .info-box .valor-info{font-size:13px;color:#1F2937;font-weight:600;}

  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0;}

  .pagamento-status{display:inline-block;padding:4px 10px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:0.5px;}
  .pagamento-status.pago{background:#D1FAE5;color:#065F46;}
  .pagamento-status.pendente{background:#FEF3C7;color:#92400E;}

  .assinaturas{margin-top:50px;display:grid;grid-template-columns:1fr 1fr;gap:40px;}
  .assinatura{text-align:center;}
  .assinatura .linha{border-top:1px solid #1F2937;margin-bottom:6px;padding-top:6px;}
  .assinatura .nome{font-size:12px;font-weight:700;color:#1F2937;}
  .assinatura .papel{font-size:10px;color:#6B7280;margin-top:2px;}

  .rodape{margin-top:36px;padding-top:14px;border-top:1px solid #E5E7EB;text-align:center;font-size:10px;color:#9CA3AF;line-height:1.5;}

  .btn-print{position:fixed;top:14px;right:14px;background:#1565C0;color:white;border:none;padding:10px 18px;border-radius:6px;cursor:pointer;font-weight:600;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,0.15);}
  .btn-print:hover{background:#1976D2;}
</style>
</head>
<body>

<button class="btn-print no-print" onclick="window.print()">🖨 Imprimir / Salvar PDF</button>

<div class="pagina">
  <div class="header">
    <div>
      <div class="titulo">RECIBO DE COMISSÃO</div>
      <div class="num-recibo">Nº ${com.id.substring(0, 8).toUpperCase()}</div>
    </div>
    <div class="empresa-info">
      <strong>${cfgZello.nome || 'Zello Ambiental Eng. LTDA'}</strong>
      ${cfgZello.cnpj ? 'CNPJ: ' + cfgZello.cnpj + '<br/>' : 'CNPJ: 51.574.260/0001-01<br/>'}
      ${cfgZello.crea ? 'CREA: ' + cfgZello.crea + '<br/>' : 'CREA: 5069519852<br/>'}
      ${cfgZello.endereco ? cfgZello.endereco + '<br/>' : ''}
      ${cfgZello.email ? cfgZello.email : ''}
    </div>
  </div>

  <div class="corpo">
    Eu, <strong>${escapeHtmlPdf(hunter.nome)}</strong>${hunter.email ? ' (' + escapeHtmlPdf(hunter.email) + ')' : ''}, RECEBI de <strong>${escapeHtmlPdf(cfgZello.nome || 'Zello Ambiental Eng. LTDA')}</strong> a importância referente à comissão pelo fechamento do projeto abaixo descrito, conforme política de comissão progressiva mensal acordada.
  </div>

  <div class="valor-destaque">
    <div class="label">VALOR RECEBIDO</div>
    <div class="valor">${valorTxt}</div>
    <div class="extenso">(${valorExtenso})</div>
  </div>

  <div class="info-grid">
    <div class="info-box">
      <div class="label">Cliente</div>
      <div class="valor-info">${escapeHtmlPdf(cliente.nome)}</div>
    </div>
    <div class="info-box">
      <div class="label">Projeto</div>
      <div class="valor-info">${escapeHtmlPdf(projeto.nome)}</div>
    </div>
    <div class="info-box">
      <div class="label">Mês de referência</div>
      <div class="valor-info">${mesRef}</div>
    </div>
    <div class="info-box">
      <div class="label">Nº do fechamento no mês</div>
      <div class="valor-info">${com.numero_fechamento_mes}º fechamento</div>
    </div>
    <div class="info-box">
      <div class="label">Valor da proposta</div>
      <div class="valor-info">R$ ${parseFloat(com.valor_proposta || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    </div>
    <div class="info-box">
      <div class="label">Status do pagamento</div>
      <div class="valor-info">
        <span class="pagamento-status ${ehPago ? 'pago' : 'pendente'}">${ehPago ? '✓ PAGO' : '⏳ PENDENTE'}</span>
        ${ehPago && com.pago_para_hunter_em ? ' em ' + dataPagto : ''}
      </div>
    </div>
  </div>

  <div class="assinaturas">
    <div class="assinatura">
      <div class="linha">&nbsp;</div>
      <div class="nome">${escapeHtmlPdf(hunter.nome)}</div>
      <div class="papel">RECEBEDOR (Hunter)</div>
    </div>
    <div class="assinatura">
      <div class="linha">&nbsp;</div>
      <div class="nome">${escapeHtmlPdf(cfgZello.nome || 'Zello Ambiental Eng. LTDA')}</div>
      <div class="papel">PAGADOR</div>
    </div>
  </div>

  <div class="rodape">
    Documento emitido em ${hoje} · Recibo gerado eletronicamente pelo sistema Zello Ambiental.<br/>
    Em caso de divergência, entre em contato com a administração.
  </div>
</div>

<script>
  // Auto-imprimir após carregar
  window.addEventListener('load', function(){
    setTimeout(function(){ window.print(); }, 250);
  });
</script>

</body>
</html>`);
      w.document.close();

    } catch(e) {
      console.error('Erro gerarReciboComissao:', e);
      alert('Erro ao gerar recibo: ' + (e.message || ''));
    }
  }

  // Helper: escape HTML pra usar em template strings de PDF
  function escapeHtmlPdf(s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"']/g, function(c) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }

  // Helper: busca config da empresa (com cache simples)
  async function _getConfigEmpresa() {
    if (window._cfgEmpresaCache) return window._cfgEmpresaCache;
    try {
      const r = await fetch(SUPABASE_URL + '/rest/v1/config_app?chave=in.(empresa_nome,empresa_cnpj,empresa_crea,empresa_endereco,empresa_email,empresa_tel)&select=chave,valor', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (r.ok) {
        const list = await r.json();
        const cfg = {};
        list.forEach(function(item){
          const key = item.chave.replace('empresa_', '');
          cfg[key] = item.valor;
        });
        window._cfgEmpresaCache = cfg;
        return cfg;
      }
    } catch(e) { console.warn('Erro buscando config empresa:', e); }
    return {};
  }

  // Exporta comissões filtradas em CSV
  function exportarComissoesCsv() {
    if (!_comissoesFiltradas || _comissoesFiltradas.length === 0) {
      alert('Nenhuma comissão pra exportar com esses filtros.');
      return;
    }

    const rows = [
      ['Mês', 'Hunter', 'Cliente', 'Nº Fechamento', 'Valor Proposta', 'Valor Comissão', 'Pago em (1º pgto)', 'Status', 'Pago ao hunter em', 'Comprovante (URL)', 'NF (URL)', 'Observação']
    ];

    _comissoesFiltradas.forEach(function(c){
      const hunterObj = (_usuariosCache || []).find(function(u){ return u.id === c.hunter_id; });
      const hunterNome = hunterObj ? hunterObj.nome : '(removido)';
      const cli = (clientes || []).find(function(x){ return x.id === c.cliente_id; }) ||
                  (clientesEmProjeto || []).find(function(x){ return x.id === c.cliente_id; }) ||
                  (leads || []).find(function(x){ return x.id === c.cliente_id; });
      const cliNome = cli ? cli.nome : '(removido)';
      const mes = c.mes_referencia ? c.mes_referencia.slice(0, 7) : '';

      rows.push([
        mes,
        hunterNome,
        cliNome,
        c.numero_fechamento_mes,
        (parseFloat(c.valor_proposta) || 0).toFixed(2).replace('.', ','),
        (parseFloat(c.valor_comissao) || 0).toFixed(2).replace('.', ','),
        c.pago_em || '',
        c.status_pagamento,
        c.pago_para_hunter_em || '',
        c.comprovante_url || '',
        c.nf_url || '',
        c.obs_pagamento || ''
      ]);
    });

    // Constrói CSV (com BOM pra Excel reconhecer UTF-8)
    const csv = '\uFEFF' + rows.map(function(row){
      return row.map(function(cell){
        const s = String(cell || '');
        if (s.indexOf(';') >= 0 || s.indexOf('"') >= 0 || s.indexOf('\n') >= 0) {
          return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
      }).join(';');
    }).join('\r\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comissoes_zello_' + getDataHojeBR() + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // FASE 14.3 + 14.4: Carrega tela "Meus Fechamentos" do hunter
  // FASE 14.4: agora busca tabela `comissoes` real (não calcula no front)
  async function carregarMeusFechamentos() {
    const sess = getSessao();
    if (!sess || sess.papel !== 'hunter') return;
    const meuId = sess.id;

    function setText(id, txt) {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    }

    const cont = document.getElementById('lista-meus-fechamentos');
    if (!cont) return;

    // Filtra projetos onde hunter_id_origem é o hunter logado
    const meus = (projetos || []).filter(function(p){ return p.hunter_id_origem === meuId; });

    // Busca comissões REAIS do hunter (Fase 14.4)
    let minhasComissoes = [];
    try {
      const r = await fetch(SUPABASE_URL + '/rest/v1/comissoes?hunter_id=eq.' + meuId + '&select=*&order=mes_referencia.desc,numero_fechamento_mes.asc', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (r.ok) minhasComissoes = await r.json();
    } catch(e) { console.warn('[14.4] Erro buscando comissoes:', e); }

    if (meus.length === 0) {
      setText('mf-proximo', 'R$ 500');
      setText('mf-proximo-sub', '1º fechamento do mês');
      setText('mf-acumulado', 'R$ 0');
      setText('mf-acumulado-sub', '0 fechamentos');
      setText('mf-aguardando', '0');
      cont.innerHTML = '<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:40px;">' +
        '📭 Você ainda não enviou nenhum lead pra equipe Projetos.<br/>' +
        '<span style="font-size:11px;">Quando enviar um lead, ele aparece aqui pra você acompanhar.</span>' +
        '</div>';
      return;
    }

    // Calcula estatísticas — usa COMISSÕES REAIS agora
    const hoje = new Date();
    const mesAtualKey = hoje.getFullYear() + '-' + String(hoje.getMonth() + 1).padStart(2, '0') + '-01';

    const comissoesDoMes = minhasComissoes.filter(function(c){
      return c.mes_referencia === mesAtualKey && c.status_pagamento !== 'estornado';
    });

    const nFechado = comissoesDoMes.length;
    const proxN = nFechado + 1;
    let proxValor;
    if (proxN <= 4) proxValor = 500;
    else if (proxN <= 8) proxValor = 1000;
    else proxValor = 2000;

    const acumulado = comissoesDoMes.reduce(function(s, c){ return s + parseFloat(c.valor_comissao || 0); }, 0);
    const aguardandoPago1 = meus.filter(function(p){ return !p.pago_1; });

    setText('mf-proximo', 'R$ ' + proxValor.toLocaleString('pt-BR'));
    setText('mf-proximo-sub', proxN + 'º fechamento do mês');
    setText('mf-acumulado', 'R$ ' + acumulado.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
    setText('mf-acumulado-sub', nFechado + ' fechamento' + (nFechado !== 1 ? 's' : ''));
    setText('mf-aguardando', aguardandoPago1.length);

    // Lista cronológica de TODOS os meus projetos (do mais recente pro mais antigo)
    const ordenados = meus.slice().sort(function(a, b){
      const da = new Date(a.criado_em || 0).getTime();
      const db = new Date(b.criado_em || 0).getTime();
      return db - da;
    });

    cont.innerHTML = ordenados.map(function(p){
      const cli = todosClientesUnificado(p.cliente_id);
      const prop = (propriedades || []).find(function(pp){ return pp.id === p.propriedade_id; });
      const nomeCli = cli ? cli.nome : '(cliente não encontrado)';
      const nomeProp = prop ? prop.nome : '—';
      const valor = p.valor_total ? fmtBRL(p.valor_total) : '—';

      // Busca comissão deste projeto (se houver)
      const comissaoDoProjeto = minhasComissoes.find(function(c){ return c.projeto_id === p.id && c.status_pagamento !== 'estornado'; });

      // Status visual
      let statusBadge, statusInfo;
      if (p.status === 'concluido') {
        statusBadge = '<span style="background:#E8F5E9;color:#2E7D32;padding:3px 8px;border-radius:10px;font-size:11px;font-weight:600;">✅ Concluído</span>';
        statusInfo = '';
      } else if (p.pago_2) {
        statusBadge = '<span style="background:#E8F5E9;color:#2E7D32;padding:3px 8px;border-radius:10px;font-size:11px;font-weight:600;">💰 Pago final</span>';
        statusInfo = '';
      } else if (p.pago_1) {
        const dataFmt = p.pago_1_em ? new Date(p.pago_1_em + 'T00:00:00').toLocaleDateString('pt-BR') : '—';
        statusBadge = '<span style="background:#E3F2FD;color:#1565C0;padding:3px 8px;border-radius:10px;font-size:11px;font-weight:600;">✅ Pago 1º em ' + dataFmt + '</span>';

        // Mostra valor da comissão e status do pagamento
        if (comissaoDoProjeto) {
          const valComissao = parseFloat(comissaoDoProjeto.valor_comissao || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
          if (comissaoDoProjeto.status_pagamento === 'pago') {
            const dataPagFmt = comissaoDoProjeto.pago_para_hunter_em ? new Date(comissaoDoProjeto.pago_para_hunter_em + 'T12:00:00').toLocaleDateString('pt-BR') : '—';
            statusInfo = '<div style="font-size:11px;color:#2E7D32;margin-top:4px;">💰 Comissão R$ ' + valComissao + ' — <strong>PAGA em ' + dataPagFmt + '</strong></div>';
          } else {
            statusInfo = '<div style="font-size:11px;color:#E65100;margin-top:4px;">💰 Comissão R$ ' + valComissao + ' — aguardando pagamento</div>';
          }
        } else {
          statusInfo = '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Sem comissão (valor abaixo do mínimo?)</div>';
        }
      } else {
        statusBadge = '<span style="background:#FFF3E0;color:#E65100;padding:3px 8px;border-radius:10px;font-size:11px;font-weight:600;">⏳ Aguardando 1º pgto</span>';
        statusInfo = '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Equipe Projetos vai cobrar e gerar NF.</div>';
      }

      const etapaLabel = (ETAPAS_PROJETO[p.etapa_atual - 1] || {}).nome || ('Etapa ' + p.etapa_atual);

      return '<div style="display:flex;align-items:flex-start;gap:10px;padding:12px 0;border-bottom:1px solid #f3f4f6;">' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:2px;">' + escapeHtml(nomeCli) + '</div>' +
          '<div style="font-size:11px;color:var(--text-muted);margin-bottom:6px;">📍 ' + escapeHtml(nomeProp) + ' · 💰 ' + valor + ' · ' + escapeHtml(etapaLabel) + '</div>' +
          statusBadge + statusInfo +
        '</div>' +
        '<div style="font-size:11px;color:var(--text-muted);text-align:right;flex-shrink:0;">' +
          (p.criado_em ? new Date(p.criado_em).toLocaleDateString('pt-BR') : '—') +
        '</div>' +
      '</div>';
    }).join('');
  }

  function todosClientesUnificado(cid) {
    if (!cid) return null;
    const todos = [].concat(typeof clientes !== 'undefined' ? clientes : [], typeof leads !== 'undefined' ? leads : [], typeof clientesEmProjeto !== 'undefined' ? clientesEmProjeto : []);
    return todos.find(function(c){ return c.id === cid; }) || null;
  }


  // ============================================================
  // INICIAR PROJETO (a partir de um lead)
  // ============================================================
  // Sobrescreve a função stub da Fase 1
  function iniciarProjetoDoLead() {
    if (!leadAtualId) return;
    const l = (typeof leads !== 'undefined' ? leads : []).find(function(x){ return x.id === leadAtualId; });
    if (!l) { zAlert('Lead não encontrado.', { tipo:'erro' }); return; }

    // ONDA 1 BUG#2: Trava — exige proposta assinada antes de iniciar projeto
    if (!l.proposta_assinada_em) {
      zAlert('⚠ Proposta ainda não foi marcada como assinada.\n\nPara iniciar o projeto:\n1. Gere a proposta (botão "📄 Gerar Proposta")\n2. Envie pro cliente\n3. Quando ele assinar, marque a proposta como assinada (anexe o arquivo)\n4. Aí sim clique em "🚀 Iniciar projeto"', { tipo:'aviso', titulo:'Falta assinar proposta' });
      return;
    }

    const propsLead = (typeof propriedades !== 'undefined' ? propriedades : []).filter(function(p){ return p.cliente_id === leadAtualId; });
    if (!propsLead.length) {
      zAlert('Este lead não tem propriedades cadastradas.\n\nPara iniciar um projeto, você precisa primeiro:\n• Importar uma planilha com as propriedades, OU\n• Adicionar manualmente uma propriedade ao lead', { tipo:'aviso', titulo:'Sem propriedades' });
      return;
    }

    // ONDA 1 BUG#2: Trava — exige valor de proposta (vem do lead OU da proposta mais recente)
    let valorSugerido = parseFloat(l.valor_proposta) || 0;
    if (valorSugerido <= 0 && typeof propostas !== 'undefined') {
      const propostasDoLead = (propostas || [])
        .filter(function(p){ return p.cliente_id === leadAtualId; })
        .sort(function(a, b){ return new Date(b.criado_em || 0) - new Date(a.criado_em || 0); });
      if (propostasDoLead.length > 0) {
        valorSugerido = parseFloat(propostasDoLead[0].valor_total || propostasDoLead[0].valor || 0) || 0;
      }
    }
    if (valorSugerido <= 0) {
      zAlert('⚠ Este lead não tem valor de proposta definido.\n\nNa aba "Dados" do lead, preencha o campo "Valor da proposta (R$)" antes de iniciar o projeto.\n\nIsso é importante pra:\n• Calcular a comissão do hunter\n• Definir o valor da NF do projeto', { tipo:'aviso', titulo:'Falta valor da proposta' });
      return;
    }

    // Popula select de propriedades
    const sel = document.getElementById('iniciar-proj-prop');
    sel.innerHTML = propsLead.map(function(p){
      return '<option value="' + escapeHtml(p.id) + '">' + escapeHtml(p.nome) + (p.cidade ? ' (' + escapeHtml(p.cidade) + ')' : '') + '</option>';
    }).join('');

    document.getElementById('iniciar-proj-cliente').textContent = l.nome;
    // Sugere nome do projeto
    const nomeSugerido = 'OUTORGA ' + (propsLead[0].nome || '').toUpperCase();
    document.getElementById('iniciar-proj-nome').value = nomeSugerido;
    document.getElementById('iniciar-proj-req').value = '';
    document.getElementById('iniciar-proj-resp').value = '';
    // ONDA 1 BUG#2: sugere valor da proposta já no campo (antes vinha vazio)
    document.getElementById('iniciar-proj-valor').value = valorSugerido > 0 ? String(valorSugerido).replace('.', ',') : '';
    document.getElementById('iniciar-proj-obs').value = '';

    abrirModal('ov-iniciar-projeto');
  }

  async function confirmarIniciarProjeto() {
    if (!leadAtualId) return;
    const propId = document.getElementById('iniciar-proj-prop').value;
    const nome = document.getElementById('iniciar-proj-nome').value.trim();
    const req = document.getElementById('iniciar-proj-req').value.trim();
    const resp = document.getElementById('iniciar-proj-resp').value.trim();
    const valorStr = document.getElementById('iniciar-proj-valor').value.trim();
    const obs = document.getElementById('iniciar-proj-obs').value.trim();

    if (!propId) { alert('Selecione uma propriedade.'); return; }
    if (!nome) { alert('Nome do projeto é obrigatório.'); return; }

    let valorTotal = null;
    if (valorStr) {
      const v = parseFloat(valorStr.replace(',', '.'));
      if (isNaN(v) || v < 0) { alert('Valor inválido.'); return; }
      valorTotal = v;
    }

    // FIX BUG #1: Hunter origem — necessário pra trigger criar comissão
    const lead = (typeof leads !== 'undefined' ? leads : []).find(function(x){ return x.id === leadAtualId; });
    let hunterIdOrigem = (lead && lead.hunter_id) || null;

    // Se admin está criando e lead não tem hunter, pergunta qual hunter atribuir
    const sess = getSessao();
    if (!hunterIdOrigem && sess && sess.papel === 'admin') {
      const hunters = (_usuariosCache || []).filter(function(u){ return u.papel === 'hunter' && u.ativo; });
      if (hunters.length > 0) {
        // ONDA 2 BUG#6: usa modal visual em vez de prompt nativo
        const escolha = await selecionarHunter({
          titulo: 'Hunter responsável pela comissão',
          mensagem: 'Quem é o hunter responsável pela comissão deste projeto?',
          permitirNenhum: true
        });
        if (escolha === false) return;   // cancelou
        hunterIdOrigem = escolha;        // null ou id
      }
    }

    // FIX BUG #8: avisa se valor abaixo do mínimo + hunter associado
    if (hunterIdOrigem && (!valorTotal || valorTotal < 3000)) {
      if (!(await zConfirm('⚠ Atenção: valor ' + (valorTotal ? 'R$ ' + valorTotal : 'não definido') + ' está abaixo do mínimo de R$ 3.000.\n\nNESSE caso, NÃO será gerada comissão pro hunter quando "Pago 1º" for marcado.\n\nDeseja continuar mesmo assim?', { tipo:'erro', btnOk:'Sim, continuar' }))) return;
    }

    const criadoPor = (sess && sess.nome) ? sess.nome : (sess && sess.email ? sess.email : 'admin');

    const btn = document.getElementById('btn-iniciar-proj');
    btn.disabled = true; btn.textContent = '⏳ Criando...';

    try {
      // 1. Cria projeto — FIX BUG #1: agora COM hunter_id_origem
      const payload = {
        cliente_id: leadAtualId,
        propriedade_id: propId,
        nome: upper(nome),
        requerimento: req || null,
        responsavel: resp || null,
        observacoes: obs || null,
        etapa_atual: 1,
        data_inicio: getDataHojeBR(),
        status: 'em_andamento',
        valor_total: valorTotal,
        valor_pago: 0,
        status_pgto: 'aberto',
        hunter_id_origem: hunterIdOrigem,   // FIX: trigger precisa disso
        pago_1: false,
        docs_ok: false,
        pago_2: false
      };
      const r = await api('projetos', 'POST', payload, 'return=representation');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));
      const data = await r.json();
      const novoProj = data && data[0];
      if (!novoProj) throw new Error('Resposta sem dados');

      // 2. Muda status_funil do cliente
      // SEMANA 4.19: PIN NÃO é gerado aqui — cliente cria o próprio no 1º acesso ao portal
      await api('clientes?id=eq.' + leadAtualId, 'PATCH', { status_funil: 'em_projeto' }, 'return=minimal');

      // 3. Cria entrada no histórico
      await api('projeto_historico', 'POST', {
        projeto_id: novoProj.id,
        acao: 'projeto_criado',
        para_valor: '1',
        observacao: 'Projeto criado a partir de lead.' + (hunterIdOrigem ? ' Hunter origem: ' + hunterIdOrigem : ' SEM HUNTER (não gera comissão)'),
        criado_por: criadoPor
      }, 'return=minimal');

      fecharModal('ov-iniciar-projeto');
      fecharModal('ov-ver-lead');
      leadAtualId = null;
      await carregarDados();

      // FIX: aviso claro se vai gerar comissão ou não
      let avisoFinal = '';
      if (hunterIdOrigem && valorTotal && valorTotal >= 3000) {
        avisoFinal = '✅ Projeto criado!\n\nQuando equipe Projetos marcar "Pago 1º", a comissão do hunter será gerada automaticamente.';
      } else if (hunterIdOrigem) {
        avisoFinal = '✅ Projeto criado.\n\n⚠ Atenção: valor abaixo do mínimo, NÃO vai gerar comissão.';
      } else {
        avisoFinal = '✅ Projeto criado.\n\n⚠ Sem hunter associado — NÃO vai gerar comissão. Pra corrigir, abra o projeto → "💰 Dados financeiros..." → "👤 Trocar hunter".';
      }

      // SEMANA 4.19: Lembrete sobre portal do cliente
      avisoFinal += '\n\n━━━━━━━━━━━━━━━━━━━\n🔐 PORTAL DO CLIENTE:\n\n' +
        'O cliente vai criar o próprio PIN no 1º acesso ao portal.\n' +
        '📲 Envie pra ele:\n' +
        '• Link: ' + getClienteUrl() + '\n' +
        '• Use "Enviar link Portal" no card do projeto pra mandar via WhatsApp.\n' +
        '━━━━━━━━━━━━━━━━━━━';
      alert(avisoFinal);

      navTo('em-projeto', document.querySelector('.nav-item[data-page="em-projeto"]'));
      // Abre o projeto recém-criado
      setTimeout(function(){ verProjeto(novoProj.id); }, 200);
    } catch(e) {
      console.error('Erro confirmarIniciarProjeto:', e);
      alert('Erro ao criar projeto: ' + (e.message || e));
    } finally {
      btn.disabled = false; btn.textContent = '🚀 Criar projeto';
    }
  }


  // ============================================================
  // VER / EDITAR PROJETO (modal com 5 abas)
  // ============================================================
  // SEMANA 4.19: Popula select de responsável com usuários da equipe técnica
  // Equipe técnica = usuários com papel='projetos' (Preto, Branco, Cinza)
  function _popularSelectResponsavelProjeto(valorAtual) {
    const sel = document.getElementById('ver-proj-resp');
    if (!sel) return;
    const equipeTec = (_usuariosCache || []).filter(function(u){
      return u.papel === 'projetos' && u.ativo;
    });
    // Ordenado por nome
    equipeTec.sort(function(a, b){ return (a.nome || '').localeCompare(b.nome || ''); });

    // Monta options
    let html = '<option value="">— Selecione —</option>';
    equipeTec.forEach(function(u){
      const corInfo = u.cor ? (CORES_TIMES[u.cor] || {}) : {};
      const emoji = corInfo.emoji || '👤';
      const corNome = corInfo.nome || '';
      // Valor = nome do usuário (compatível com campo TEXT atual no banco)
      const opt = document.createElement('option');
      opt.value = u.nome;
      opt.textContent = emoji + ' ' + u.nome + (corNome ? ' (' + corNome + ')' : '');
      // Pra usar querySelector com cor, deixa um data-cor disponível
      opt.setAttribute('data-cor', u.cor || '');
      html += '<option value="' + escapeHtml(u.nome) + '" data-cor="' + (u.cor || '') + '">' +
        emoji + ' ' + escapeHtml(u.nome) + (corNome ? ' (' + corNome + ')' : '') +
        '</option>';
    });

    // Se valor atual não está na lista (responsável antigo digitado), adiciona opção "legada"
    if (valorAtual && !equipeTec.find(function(u){ return u.nome === valorAtual; })) {
      html += '<option value="' + escapeHtml(valorAtual) + '" selected>👤 ' + escapeHtml(valorAtual) + ' (manual)</option>';
    }

    sel.innerHTML = html;
    sel.value = valorAtual || '';
  }

  // SEMANA 4.22: Renderiza checklist da etapa no DETALHE do projeto
  // (movido de fora — antes ficava na lista de cards e era fácil marcar errado)
  function _renderChecklistEtapa(p) {
    const cont = document.getElementById('proj-checklist-conteudo');
    const subt = document.getElementById('proj-checklist-subt');
    if (!cont) return;

    const etapa = p.etapa_atual || 1;
    cont.innerHTML = '';
    if (subt) subt.textContent = '(Etapa ' + etapa + '/4)';

    const mkCheck = function(label, marcado, onChangeFn, descricao) {
      const linha = document.createElement('label');
      linha.style.cssText = 'display:flex;align-items:center;gap:8px;padding:8px 10px;background:white;border:1px solid ' + (marcado?'#10B981':'#E2E8F0') + ';border-radius:6px;cursor:pointer;transition:all 0.15s;';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = marcado;
      cb.style.cssText = 'width:18px;height:18px;cursor:pointer;flex-shrink:0;';
      cb.addEventListener('change', function(e){ onChangeFn(e.target.checked, e.target); });
      linha.appendChild(cb);
      const txt = document.createElement('div');
      txt.style.cssText = 'flex:1;font-size:13px;font-weight:' + (marcado?'600':'500') + ';color:' + (marcado?'#065F46':'var(--text)') + ';';
      txt.innerHTML = (marcado?'✅ ':'') + label + (descricao?'<div style="font-size:11px;font-weight:400;color:var(--text-muted);margin-top:2px;">'+descricao+'</div>':'');
      linha.appendChild(txt);
      return linha;
    };

    if (etapa === 1) {
      cont.appendChild(mkCheck(
        'Pago 1º (50% do valor recebido)',
        !!p.pago_1,
        function(checked, el){ togglePagoUmProjeto(p.id, checked, el); },
        'Marcar quando cliente pagar o 1º (gera comissão do hunter automaticamente)'
      ));
      cont.appendChild(mkCheck(
        'Docs OK (documentação completa)',
        !!p.docs_ok,
        function(checked, el){ toggleDocsOkProjeto(p.id, checked, el); },
        'Marcar quando todos os documentos estiverem em mãos'
      ));
      if (p.pago_1 && p.docs_ok) {
        const ok = document.createElement('div');
        ok.style.cssText = 'margin-top:4px;padding:8px;background:#D1FAE5;border-radius:6px;font-size:12px;font-weight:600;color:#065F46;text-align:center;';
        ok.textContent = '🎉 Pronto pra avançar! Clique em "Avançar etapa" abaixo.';
        cont.appendChild(ok);
      }
    } else if (etapa === 4) {
      cont.appendChild(mkCheck(
        'Pago 2º (50% restante)',
        !!p.pago_2,
        function(checked, el){ togglePagoDoisProjeto(p.id, checked, el); },
        'Marcar quando cliente pagar o final (último pagamento)'
      ));
      if (p.pago_2) {
        const ok = document.createElement('div');
        ok.style.cssText = 'margin-top:4px;padding:8px;background:#D1FAE5;border-radius:6px;font-size:12px;font-weight:600;color:#065F46;text-align:center;';
        ok.textContent = '🎉 Pronto pra publicar! Clique em "Publicar outorga" abaixo.';
        cont.appendChild(ok);
      }
    } else {
      // Etapas 2 e 3 — sem checklist específico, só info
      const info = document.createElement('div');
      info.style.cssText = 'padding:8px;background:white;border-radius:6px;font-size:12px;color:var(--text-muted);text-align:center;font-style:italic;';
      info.textContent = etapa === 2 ?
        '📋 Em Protocolo — aguardando análise do DAEE/CETESB' :
        '📜 Em Análise — aguardando emissão da outorga';
      cont.appendChild(info);
    }
  }

  function verProjeto(pid) {
    const p = (typeof projetos !== 'undefined' ? projetos : []).find(function(x){ return x.id === pid; });
    if (!p) { alert('Projeto não encontrado. Recarregue a página.'); return; }

    // FIX BUG #17: hunter só pode ver projetos onde ele é o hunter_id_origem
    const sess = getSessao();
    if (sess && sess.papel === 'hunter' && p.hunter_id_origem !== sess.id) {
      alert('Você só pode visualizar seus próprios projetos.\n\nAcesse pela tela "Meus Fechamentos".');
      return;
    }

    projetoAtualId = pid;

    const cli = todosClientesUnificado(p.cliente_id) || { nome: '(?)' };
    const prop = (typeof propriedades !== 'undefined' ? propriedades : []).find(function(pp){ return pp.id === p.propriedade_id; }) || { nome: '(?)' };

    document.getElementById('ver-proj-titulo').textContent = p.nome;
    const stLabels = { em_andamento:'em andamento', concluido:'concluído', cancelado:'cancelado', suspenso:'suspenso' };
    document.getElementById('ver-proj-sub').textContent = cli.nome + ' · ' + prop.nome + ' · ' + stLabels[p.status];

    // Aba Resumo
    document.getElementById('ver-proj-nome').value = p.nome || '';
    document.getElementById('ver-proj-cli-prop').value = cli.nome + ' / ' + prop.nome;
    document.getElementById('ver-proj-req').value = p.requerimento || '';
    // SEMANA 4.19: Popula select de responsável com equipe técnica (papel='projetos')
    _popularSelectResponsavelProjeto(p.responsavel);
    document.getElementById('ver-proj-status').value = p.status || 'em_andamento';

    // SEMANA 4.8: carrega senhas múltiplas pro estado de edição (vem do cliente)
    if (typeof _carregarSenhasParaEdicao === 'function') {
      _carregarSenhasParaEdicao('proj', cli);
    }
    // Recolhe o bloco
    const blocoContP = document.getElementById('proj-senhas-conteudo');
    if (blocoContP) blocoContP.style.display = 'none';
    const blocoChevP = document.getElementById('proj-senhas-chevron');
    if (blocoChevP) blocoChevP.style.transform = '';

    document.getElementById('ver-proj-obs').value = p.observacoes || '';

    // SEMANA 4.22: Popula o checklist da etapa no detalhe (mudou da lista pro detalhe)
    _renderChecklistEtapa(p);

    // Mostra/esconde botão "Publicar outorga" (só na etapa 4 e status em_andamento)
    const btnPub = document.getElementById('btn-publicar-outorga');
    btnPub.style.display = (p.etapa_atual === 4 && p.status === 'em_andamento') ? '' : 'none';

    // Mostra/esconde botão "Avançar etapa" (não disponível em concluído/cancelado)
    const btnAv = document.getElementById('btn-avancar-etapa');
    btnAv.style.display = (p.status === 'em_andamento' && p.etapa_atual < 4) ? '' : 'none';

    // Renderiza barra de progresso
    renderEtapasProgresso(p);

    // SEMANA 4.19: Aba Financeiro escondida da barra de abas; admin acessa pelo botão "Abrir"
    // O atalho fica visível só pra admin (papel='projetos' não vê)
    const papelAtual = (sess && sess.papel) || 'admin';
    const blocoFinLink = document.getElementById('bloco-financeiro-link');
    if (blocoFinLink) {
      blocoFinLink.style.display = (papelAtual === 'projetos') ? 'none' : '';
    }
    document.getElementById('ver-proj-valor-total').value = p.valor_total != null ? p.valor_total : '';
    document.getElementById('ver-proj-nf').value = p.nf_numero || '';
    document.getElementById('ver-proj-nf-url').value = p.nf_url || '';
    atualizarCardsFinanceiro(p);

    // SEMANA 4.18: Ficha Técnica + cards de resumo
    _carregarFichaTecnica(p, cli, prop);
    _renderCardsTopoProjeto(p);
    _renderPropriedadesPontosProjeto(p);   // SEMANA 4.19: dados da planilha
    _renderPortalProjetoCli(p);            // SEMANA 4.19: status do PIN do cliente

    // Carrega abas pesadas (Etapas, Docs, Pagamentos, Histórico)
    carregarEtapasTimeline(p);
    carregarDocsProjeto(pid);
    carregarPagamentosProjeto(pid);
    carregarHistoricoProjeto(pid);

    trocarTabProjeto('resumo');
    abrirModal('ov-ver-projeto');
  }

  // ============================================================
  // SEMANA 4.18: FICHA TÉCNICA + CHECKLIST DO CLIENTE
  // ============================================================

  // Popula os 4 selects da ficha técnica (uma vez só)
  function _popularSelectsFicha() {
    function popSel(id, opcoes) {
      const sel = document.getElementById(id);
      if (!sel || sel._populado) return;
      sel.innerHTML = opcoes.map(function(o){
        return '<option value="' + o.value + '">' + o.label + '</option>';
      }).join('');
      sel._populado = true;
    }
    popSel('ft-enquadramento', OPCOES_ENQUADRAMENTO);
    popSel('ft-area-tipo', OPCOES_AREA_TIPO);
    popSel('ft-tipo-captacao', OPCOES_TIPO_CAPTACAO);
    popSel('ft-finalidade', OPCOES_FINALIDADE);
  }

  // Toggle dos blocos rural/urbana conforme área
  function toggleCamposAreaTipo() {
    const sel = document.getElementById('ft-area-tipo');
    const tipo = sel ? sel.value : '';
    const rural = document.getElementById('ft-bloco-rural');
    const urbana = document.getElementById('ft-bloco-urbana');
    if (rural) rural.style.display = (tipo === 'rural' || tipo === 'mista') ? '' : 'none';
    if (urbana) urbana.style.display = (tipo === 'urbana' || tipo === 'mista') ? '' : 'none';
  }

  // Carrega a ficha técnica preenchida com dados de cliente + propriedade + uso
  function _carregarFichaTecnica(p, cli, prop) {
    if (!p) return;
    _popularSelectsFicha();

    function setVal(id, v) {
      const el = document.getElementById(id);
      if (el) {
        if (el.type === 'checkbox') el.checked = !!v;
        else el.value = (v == null ? '' : v);
      }
    }

    // BLOCO 1: Dados do cliente
    setVal('ft-razao-social', cli.nome);
    setVal('ft-nome-fantasia', cli.nome_fantasia);
    setVal('ft-cpf-cnpj', cli.cpf_cnpj || cli.cpf);
    setVal('ft-insc-estadual', cli.inscricao_estadual);
    setVal('ft-insc-municipal', cli.inscricao_municipal);
    setVal('ft-enquadramento', cli.enquadramento || '');
    setVal('ft-end-rua', cli.endereco_rua || cli.endereco);
    setVal('ft-end-numero', cli.endereco_numero);
    setVal('ft-end-bairro', cli.endereco_bairro);
    setVal('ft-end-compl', cli.endereco_complemento);
    setVal('ft-end-cep', cli.endereco_cep);
    setVal('ft-end-cidade', cli.cidade);
    setVal('ft-end-uf', cli.endereco_uf);
    setVal('ft-nome-contato', cli.nome_contato);
    setVal('ft-tel-fixo', cli.telefone_fixo);
    setVal('ft-tel-celular', cli.telefone1 || cli.telefone);
    setVal('ft-email-nf', cli.email_nf || cli.email);
    setVal('ft-email-cadastro', cli.email_cadastro || cli.email);

    // BLOCO 2: Área (vem da propriedade)
    setVal('ft-area-tipo', prop.area_tipo || '');
    setVal('ft-area-ha', prop.area_hectares);
    setVal('ft-nirf', prop.nirf);
    setVal('ft-ccir', prop.ccir);
    setVal('ft-car', prop.car);
    setVal('ft-dcaa', prop.dcaa);
    setVal('ft-iptu', prop.iptu);
    setVal('ft-tem-vs', prop.tem_vigilancia_sanitaria);
    setVal('ft-insc-vs', prop.inscricao_vs);
    toggleCamposAreaTipo();

    // BLOCO 3: Outorga (vem do uso vinculado — busca o primeiro uso da propriedade)
    const usoBloco = document.getElementById('ft-bloco-uso');
    const avisoSemUso = document.getElementById('ft-aviso-sem-uso');
    const usoPropriedade = (typeof usos !== 'undefined' ? usos : [])
      .find(function(u){ return u.propriedade_id === p.propriedade_id; });

    if (!usoPropriedade) {
      if (usoBloco) usoBloco.style.display = 'none';
      if (avisoSemUso) avisoSemUso.style.display = '';
    } else {
      if (usoBloco) usoBloco.style.display = '';
      if (avisoSemUso) avisoSemUso.style.display = 'none';
      // Guarda o ID do uso no DOM pra usar ao salvar
      usoBloco.dataset.usoId = usoPropriedade.id;
      setVal('ft-uso-desc', usoPropriedade.descricao);
      setVal('ft-portaria', usoPropriedade.portaria);
      setVal('ft-processo', usoPropriedade.processo);
      setVal('ft-data-emissao', usoPropriedade.data_emissao);
      setVal('ft-prazo', usoPropriedade.prazo_anos);
      setVal('ft-tipo-captacao', usoPropriedade.tipo_captacao || '');
      setVal('ft-finalidade', usoPropriedade.finalidade_uso || '');
      setVal('ft-curso-dagua', usoPropriedade.curso_dagua);
      setVal('ft-bacia', usoPropriedade.bacia_hidrografica);
      setVal('ft-coord-lat', usoPropriedade.coordenada_lat);
      setVal('ft-coord-long', usoPropriedade.coordenada_long);
      setVal('ft-profundidade', usoPropriedade.profundidade_m);
      setVal('ft-vazao-mh', usoPropriedade.vazao_m3h);
      setVal('ft-horas-dia', usoPropriedade.horas_uso_dia);
      setVal('ft-diametro', usoPropriedade.diametro_hidro_m);
    }
  }

  // Renderiza cards de overview no topo do Resumo
  // SEMANA 4.19: Toggle bloco propriedades & pontos no PROJETO
  function toggleBlocoProjProps() {
    const conteudo = document.getElementById('proj-props-conteudo');
    const chevron = document.getElementById('proj-props-chevron');
    if (!conteudo) return;
    const aberto = conteudo.style.display !== 'none';
    conteudo.style.display = aberto ? 'none' : '';
    if (chevron) chevron.style.transform = aberto ? '' : 'rotate(180deg)';
  }

  // SEMANA 4.19: Renderiza propriedades + pontos do projeto (mesma lógica do lead)
  // SEMANA 4.19: Portal do cliente — cliente cria o PRÓPRIO PIN no 1º acesso
  function _renderPortalProjetoCli(p) {
    const status = document.getElementById('proj-portal-status');
    const info = document.getElementById('proj-portal-info');
    if (!status || !info) return;
    const cli = todosClientesUnificado(p.cliente_id) || {};
    if (cli.pin_hash) {
      status.textContent = '✅ PIN cadastrado';
      status.style.background = '#E8F5E9';
      status.style.color = '#2E7D32';
      info.innerHTML = 'O cliente já criou o PIN dele e acessa normalmente.<br/>CPF/CNPJ: <strong>' + (cli.cpf_cnpj || '?') + '</strong>';
    } else {
      status.textContent = '⏳ Aguardando 1º acesso';
      status.style.background = '#FFF3E0';
      status.style.color = '#E65100';
      info.innerHTML = 'O cliente ainda não criou o PIN.<br/>Envie o link e ele cria no 1º acesso.';
    }
  }

  function enviarLinkPortalCliente() {
    if (!projetoAtualId) return;
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p) return;
    const cli = todosClientesUnificado(p.cliente_id) || {};
    const tel = (cli.telefone1 || cli.telefone || '').replace(/\D/g, '');
    if (!tel) { toastError('Cliente sem telefone cadastrado.'); return; }

    const link = getClienteUrl();
    const msg = 'Olá ' + (cli.nome ? cli.nome.split(' ')[0] : '') + '! 👋\n\n' +
      '🔐 *Portal Zello Ambiental*\n\n' +
      'Pra anexar os documentos do seu projeto, acesse:\n' +
      link + '\n\n' +
      '*No 1º acesso:*\n' +
      '• Use seu CPF/CNPJ: ' + (cli.cpf_cnpj || '') + '\n' +
      '• Crie um PIN de 4 dígitos (memorize, vai precisar nos próximos acessos)\n\n' +
      'Eng. Guilherme Montanari\nZello Ambiental';

    const cleanTel = tel.length === 11 || tel.length === 10 ? '55' + tel : tel;
    window.open('https://wa.me/' + cleanTel + '?text=' + encodeURIComponent(msg), '_blank');
  }

  async function resetarPinCliente() {
    if (!projetoAtualId) return;
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p) return;
    const cli = todosClientesUnificado(p.cliente_id) || {};

    if (!cli.pin_hash) {
      alert('ℹ️ O cliente ainda não tem PIN cadastrado.\n\nPeça pra ele acessar o portal e criar um PIN.');
      return;
    }

    const ok = await zConfirm(
      'Resetar PIN do cliente?\n\n' +
      'O PIN atual deixará de funcionar e o cliente vai precisar criar um novo no próximo acesso ao portal.\n\n' +
      'Cliente: ' + (cli.nome || '?'),
      { tipo: 'aviso', btnOk: 'Sim, resetar' }
    );
    if (!ok) return;

    try {
      const r = await api('clientes?id=eq.' + p.cliente_id, 'PATCH', {
        pin_hash: null
      }, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));

      await carregarDados();
      _renderPortalProjetoCli(projetos.find(function(pp){ return pp.id === projetoAtualId; }));
      toastSuccess('🔄 PIN resetado. Cliente vai criar um novo no próximo acesso.', 5000);
    } catch(e) {
      console.error('Erro resetar PIN:', e);
      alert('Erro: ' + (e.message || e));
    }
  }

  // SEMANA 4.19: Renderiza propriedades + pontos NO MESMO VISUAL da aba Cliente
  // Cada propriedade tem botoes: + Ponto, Renomear, Editar
  // Cada ponto tem botao Editar que abre modal ov-uso (com TODOS os campos:
  //   PDF da outorga, foto do equipamento, numero do hidrometro, relatorio de vazao, etc)
  function _renderPropriedadesPontosProjeto(p) {
    const bloco = document.getElementById('bloco-proj-props');
    const status = document.getElementById('proj-props-status');
    const lista = document.getElementById('proj-props-lista');
    if (!bloco || !lista || !p) return;

    const cid = p.cliente_id;
    const propsCli = (typeof propriedades !== 'undefined' ? propriedades : [])
      .filter(function(pp){ return pp.cliente_id === cid; });
    const usosCli = (typeof usos !== 'undefined' ? usos : [])
      .filter(function(u){ return u.cliente_id === cid; });

    if (status) {
      if (propsCli.length === 0 && usosCli.length === 0) {
        status.textContent = '(nenhum cadastrado)';
      } else {
        status.textContent = '(' + propsCli.length + ' propriedade' + (propsCli.length !== 1 ? 's' : '') +
          ' \u00b7 ' + usosCli.length + ' ponto' + (usosCli.length !== 1 ? 's' : '') + ')';
      }
    }

    if (propsCli.length === 0 && usosCli.length === 0) {
      lista.innerHTML = '<div style="padding:14px;text-align:center;color:var(--text-muted);font-size:12px;">' +
        '<div style="font-style:italic;margin-bottom:8px;">Sem propriedades ou pontos cadastrados.</div>' +
      '</div>';
      return;
    }

    // Visual identico ao modal Cliente
    lista.innerHTML = propsCli.map(function(prop) {
      const usosProp = usosCli.filter(function(u){ return u.propriedade_id === prop.id; });
      const dias = getDiasVenc(prop);
      const cor = getCorVenc(dias, false);
      const vencHtml = cor && dias !== null ? '<span class="tag-v" style="background:'+cor.fundo+';color:'+cor.texto+'">'+cor.label+'</span>' : '';
      const isRevisar = prop.nome && prop.nome.indexOf('REVISAR') === 0;
      const revisarBadge = isRevisar ? '<span class="badge-revisar" title="Renomeie a propriedade e revise os pontos">\u26a0 Revisar</span>' : '';
      const ehDesteProj = prop.id === p.propriedade_id;
      const projBadge = ehDesteProj ? '<span style="font-size:10px;background:#2E7D32;color:white;padding:2px 6px;border-radius:8px;margin-left:6px;">DESTE PROJETO</span>' : '';

      return '<div class="prop-card" style="margin-bottom:10px;' + (ehDesteProj ? 'border:2px solid #2E7D32;' : '') + '">' +
        '<div class="prop-card-header">' +
          '<div>' +
            '<div style="font-size:13px;font-weight:600;">' + escapeHtml(prop.nome) + revisarBadge + ' ' + vencHtml + projBadge + '</div>' +
            '<div style="font-size:11px;color:var(--text-muted);margin-top:2px;">' +
              escapeHtml(prop.cidade||'') + (prop.estado?' - '+escapeHtml(prop.estado):'') +
              (prop.latitude && prop.longitude ? ' \u00b7 \ud83d\udccd ' + escapeHtml(String(prop.latitude)) + ' / ' + escapeHtml(String(prop.longitude)) : '') +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:4px;flex-wrap:wrap;">' +
            '<button class="btn btn-sm btn-blue" onclick="abrirAddUso(\'' + prop.id + '\')">+ Ponto</button>' +
            '<button class="btn btn-sm" onclick="abrirRenomearProp(\'' + prop.id + '\')" title="Renomear">\u270f\ufe0f</button>' +
            '<button class="btn btn-sm" onclick="editarPropriedade(\'' + prop.id + '\')" title="Editar dados">\u2699</button>' +
            // SEMANA 4.22: Excluir propriedade — liberado em TUDO (mas com aviso forte se for a "DESTE PROJETO")
            '<button class="btn btn-sm btn-danger" onclick="excluirPropDoProjeto(\'' + prop.id + '\',\'' + (prop.nome||'').replace(/[\\\\\'\"]/g,'') + '\',' + (ehDesteProj?'true':'false') + ')" title="Excluir esta propriedade (e seus pontos)">\ud83d\uddd1</button>' +
          '</div>' +
        '</div>' +
        '<div class="prop-card-body">' +
          (usosProp.length ? usosProp.map(function(u) {
            const aut = getAutorizadoUso(u);
            const hasH = u.possui_hidrometro;
            const icone = hasH ? '\ud83d\udca7' : '\ud83d\udd35';

            // Indicadores visuais dos dados tecnicos PREENCHIDOS
            const tags = [];
            if (u.portaria) tags.push('<span style="background:#E8F5E9;color:#2E7D32;padding:1px 6px;border-radius:8px;font-size:10px;font-weight:600;" title="Portaria: ' + escapeHtml(u.portaria) + '">\ud83d\udcdc Portaria</span>');
            if (u.pdf_outorga_url) tags.push('<a href="' + u.pdf_outorga_url + '" target="_blank" style="background:#E3F2FD;color:#1565C0;padding:1px 6px;border-radius:8px;font-size:10px;font-weight:600;text-decoration:none;" title="Ver PDF da outorga">\ud83d\udcc4 PDF</a>');
            if (u.foto_equipamento_url) tags.push('<a href="' + u.foto_equipamento_url + '" target="_blank" style="background:#FFF8E1;color:#E65100;padding:1px 6px;border-radius:8px;font-size:10px;font-weight:600;text-decoration:none;" title="Ver foto">\ud83d\udcf7 Foto</a>');
            if (u.numero_serie) tags.push('<span style="background:#F3E5F5;color:#6A1B9A;padding:1px 6px;border-radius:8px;font-size:10px;font-weight:600;" title="Hidrometro: ' + escapeHtml(u.numero_serie) + '">\u2699\ufe0f Hidr</span>');
            if (u.relatorio_vazao) tags.push('<span style="background:#FCE4EC;color:#AD1457;padding:1px 6px;border-radius:8px;font-size:10px;font-weight:600;" title="Relatorio de vazao ATIVO">\ud83d\udcca Rel.Vazao</span>');

            const faltam = [];
            if (!u.portaria) faltam.push('Portaria');
            if (!u.pdf_outorga_url) faltam.push('PDF outorga');
            if (!u.foto_equipamento_url) faltam.push('Foto');
            if (u.possui_hidrometro && !u.numero_serie) faltam.push('N\u00ba hidrometro');

            return '<div class="uso-row">' +
              (u.foto_equipamento_url ?
                '<a href="' + u.foto_equipamento_url + '" target="_blank"><img src="' + u.foto_equipamento_url + '" style="width:44px;height:44px;border-radius:8px;object-fit:cover;border:1px solid var(--border);flex-shrink:0;" alt="Foto" /></a>' :
                '<div class="uso-icon" style="background:' + (hasH?'var(--blue-light)':'#f3f4f6') + '">' + icone + '</div>'
              ) +
              '<div style="flex:1;min-width:0;">' +
                '<div style="font-size:12px;font-weight:500;">' + escapeHtml(u.descricao) +
                  (u.numero_serie?' <span style="font-family:monospace;font-size:11px;color:var(--text-muted)">' + escapeHtml(u.numero_serie) + '</span>':'') +
                '</div>' +
                '<div style="font-size:11px;color:var(--text-muted);">' +
                  escapeHtml(u.requerimento||'') +
                  (aut>0?' \u00b7 Auto: '+aut.toFixed(1)+' m\u00b3/m\u00eas':'') +
                '</div>' +
                (tags.length ? '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;">' + tags.join('') + '</div>' : '') +
                (faltam.length ? '<div style="margin-top:4px;font-size:10px;color:#C62828;">\u26a0 Falta: ' + faltam.join(' \u00b7 ') + '</div>' : '') +
              '</div>' +
              '<div style="display:flex;gap:4px;align-items:flex-start;">' +
                '<button class="btn btn-sm btn-blue" onclick="editarUso(\'' + u.id + '\')" title="Preencher: PDF outorga, foto, hidrometro, vazao...">\u270f\ufe0f Editar</button>' +
                // SEMANA 4.19: Excluir ponto (com confirmação)
                '<button class="btn btn-sm btn-danger" onclick="excluirUsoDoProjeto(\'' + u.id + '\',\'' + (u.descricao||'').replace(/[\\\\\'\"]/g,'') + '\')" title="Excluir este ponto">\ud83d\uddd1</button>' +
              '</div>' +
            '</div>';
          }).join('') : '<div style="padding:8px;font-size:11px;color:var(--text-muted);font-style:italic;text-align:center;">Sem pontos cadastrados. Clique "+ Ponto".</div>') +
        '</div>' +
      '</div>';
    }).join('');
  }

  // SEMANA 4.19: Excluir propriedade direto do card EM PROJETO (com proteção)
  async function excluirPropDoProjeto(propId, propNome, ehDesteProj) {
    if (!projetoAtualId) return;
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p) return;

    // SEMANA 4.22: Permite excluir prop DESTE PROJETO mas com aviso EXTRA-forte
    // Antes tinha proteção total. Agora avisa que vai impactar o projeto.
    if (ehDesteProj || propId === p.propriedade_id) {
      const okAviso = await zConfirm(
        '⚠️ ATENÇÃO MÁXIMA ⚠️\n\n' +
        'Esta é a propriedade PRINCIPAL deste projeto!\n\n' +
        'Se você excluir, o projeto vai ficar SEM propriedade vinculada e poderá quebrar.\n\n' +
        'Tem certeza ABSOLUTA que deseja prosseguir?',
        { tipo: 'perigo', btnOk: 'Entendo o risco, continuar' }
      );
      if (!okAviso) return;
    }

    // Conta pontos vinculados
    const usosVinculados = (typeof usos !== 'undefined' ? usos : [])
      .filter(function(u){ return u.propriedade_id === propId; });

    const ok = await zConfirm(
      'Excluir propriedade?\n\n' +
      '🏞 ' + propNome + '\n' +
      (usosVinculados.length > 0 ?
        '⚠ ' + usosVinculados.length + ' ponto(s) vinculado(s) serão excluídos JUNTO.\n\n' :
        '\n') +
      'Esta ação é irreversível.',
      { tipo: 'perigo', btnOk: 'Sim, excluir tudo' }
    );
    if (!ok) return;

    try {
      // Exclui pontos primeiro (FK)
      for (let i = 0; i < usosVinculados.length; i++) {
        await api('usos?id=eq.' + usosVinculados[i].id, 'DELETE', null, 'return=minimal');
      }
      // Depois a propriedade
      const r = await api('propriedades?id=eq.' + propId, 'DELETE', null, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));

      toastSuccess('✅ Propriedade e ' + usosVinculados.length + ' ponto(s) excluídos.', 5000);
      await carregarDados();
      _renderPropriedadesPontosProjeto(projetos.find(function(pp){ return pp.id === projetoAtualId; }));
    } catch(e) {
      console.error('Erro excluir prop:', e);
      alert('Erro ao excluir: ' + (e.message || e));
    }
  }

  // SEMANA 4.19: Excluir uso (ponto) direto do card EM PROJETO
  async function excluirUsoDoProjeto(usoId, descUso) {
    if (!projetoAtualId) return;

    const ok = await zConfirm(
      'Excluir este ponto de captação?\n\n' +
      '💧 ' + descUso + '\n\n' +
      'Esta ação é irreversível.',
      { tipo: 'perigo', btnOk: 'Sim, excluir' }
    );
    if (!ok) return;

    try {
      const r = await api('usos?id=eq.' + usoId, 'DELETE', null, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));

      toastSuccess('✅ Ponto excluído.', 4000);
      await carregarDados();
      _renderPropriedadesPontosProjeto(projetos.find(function(pp){ return pp.id === projetoAtualId; }));
    } catch(e) {
      console.error('Erro excluir uso:', e);
      alert('Erro ao excluir: ' + (e.message || e));
    }
  }

  function _renderCardsTopoProjeto(p) {
    const cont = document.getElementById('ver-proj-cards-topo');
    if (!cont) return;

    const etapaAtual = p.etapa_atual || 1;
    const etapaInfo = ETAPAS_PROJETO[etapaAtual - 1] || { nome: '?', icone: '?' };
    const valorTotal = parseFloat(p.valor_total) || 0;
    const valorPago = parseFloat(p.valor_pago) || 0;

    // Conta docs anexados
    const docsCount = (typeof _docsProjetoAtual !== 'undefined' && Array.isArray(_docsProjetoAtual))
      ? _docsProjetoAtual.length : 0;

    // Status financeiro
    let statusPgto, statusBg, statusCor;
    if (p.status_pgto === 'quitado') {
      statusPgto = '✅ Quitado'; statusBg = '#E8F5E9'; statusCor = '#2E7D32';
    } else if (p.status_pgto === 'parcial') {
      statusPgto = '🟡 Parcial'; statusBg = '#FFF8E1'; statusCor = '#E65100';
    } else {
      statusPgto = '⏳ Aberto'; statusBg = '#FFEBEE'; statusCor = '#C62828';
    }

    cont.innerHTML =
      // Card 1: Etapa atual
      '<div style="background:linear-gradient(135deg,#E3F2FD 0%,#BBDEFB 100%);border-radius:10px;padding:12px;text-align:center;border-left:4px solid #1565C0;">' +
        '<div style="font-size:24px;">' + etapaInfo.icone + '</div>' +
        '<div style="font-size:10px;color:#0a2744;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;">Etapa ' + etapaAtual + '/4</div>' +
        '<div style="font-size:12px;font-weight:700;color:#0a2744;">' + etapaInfo.nome + '</div>' +
      '</div>' +
      // Card 2: Valor
      '<div style="background:linear-gradient(135deg,#E8F5E9 0%,#C8E6C9 100%);border-radius:10px;padding:12px;text-align:center;border-left:4px solid #2E7D32;">' +
        '<div style="font-size:24px;">💰</div>' +
        '<div style="font-size:10px;color:#1B5E20;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;">Valor total</div>' +
        '<div style="font-size:13px;font-weight:700;color:#1B5E20;">R$ ' + valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</div>' +
        '<div style="font-size:10px;color:' + statusCor + ';font-weight:600;margin-top:2px;background:' + statusBg + ';padding:2px 6px;border-radius:6px;display:inline-block;">' + statusPgto + '</div>' +
      '</div>' +
      // Card 3: Documentos
      '<div style="background:linear-gradient(135deg,#FFF8E1 0%,#FFE082 100%);border-radius:10px;padding:12px;text-align:center;border-left:4px solid #F57C00;">' +
        '<div style="font-size:24px;">📁</div>' +
        '<div style="font-size:10px;color:#E65100;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;">Documentos</div>' +
        '<div style="font-size:13px;font-weight:700;color:#E65100;">' + docsCount + ' anexado' + (docsCount === 1 ? '' : 's') + '</div>' +
      '</div>' +
      // Card 4: Início do projeto
      '<div style="background:linear-gradient(135deg,#F3E5F5 0%,#E1BEE7 100%);border-radius:10px;padding:12px;text-align:center;border-left:4px solid #7B1FA2;">' +
        '<div style="font-size:24px;">📅</div>' +
        '<div style="font-size:10px;color:#4A148C;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px;">Iniciado em</div>' +
        '<div style="font-size:12px;font-weight:700;color:#4A148C;">' + (p.data_inicio ? new Date(p.data_inicio + 'T12:00:00').toLocaleDateString('pt-BR') : '—') + '</div>' +
      '</div>';
  }

  // Salva a ficha técnica (atualiza cliente + propriedade + uso simultaneamente)
  async function salvarFichaTecnica() {
    if (!projetoAtualId) return;
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p) return;

    function valOr(id, fallback) {
      const el = document.getElementById(id);
      if (!el) return fallback;
      if (el.type === 'checkbox') return el.checked;
      const v = (el.value || '').trim();
      return v || fallback;
    }
    function numOr(id) {
      const el = document.getElementById(id);
      if (!el || !el.value) return null;
      const n = parseFloat(el.value);
      return isNaN(n) ? null : n;
    }

    try {
      // 1) Atualiza CLIENTE
      const payloadCli = {
        nome: valOr('ft-razao-social', null),
        nome_fantasia: valOr('ft-nome-fantasia', null),
        cpf_cnpj: valOr('ft-cpf-cnpj', null),
        inscricao_estadual: valOr('ft-insc-estadual', null),
        inscricao_municipal: valOr('ft-insc-municipal', null),
        enquadramento: valOr('ft-enquadramento', null),
        endereco_rua: valOr('ft-end-rua', null),
        endereco_numero: valOr('ft-end-numero', null),
        endereco_bairro: valOr('ft-end-bairro', null),
        endereco_complemento: valOr('ft-end-compl', null),
        endereco_cep: valOr('ft-end-cep', null),
        cidade: valOr('ft-end-cidade', null),
        endereco_uf: valOr('ft-end-uf', null),
        nome_contato: valOr('ft-nome-contato', null),
        telefone_fixo: valOr('ft-tel-fixo', null),
        telefone1: valOr('ft-tel-celular', null),
        email_nf: valOr('ft-email-nf', null),
        email_cadastro: valOr('ft-email-cadastro', null)
      };
      await api('clientes?id=eq.' + p.cliente_id, 'PATCH', payloadCli, 'return=minimal');

      // 2) Atualiza PROPRIEDADE
      if (p.propriedade_id) {
        const payloadProp = {
          area_tipo: valOr('ft-area-tipo', null),
          area_hectares: numOr('ft-area-ha'),
          nirf: valOr('ft-nirf', null),
          ccir: valOr('ft-ccir', null),
          car: valOr('ft-car', null),
          dcaa: valOr('ft-dcaa', false),
          iptu: valOr('ft-iptu', null),
          tem_vigilancia_sanitaria: valOr('ft-tem-vs', false),
          inscricao_vs: valOr('ft-insc-vs', null)
        };
        await api('propriedades?id=eq.' + p.propriedade_id, 'PATCH', payloadProp, 'return=minimal');
      }

      // 3) Atualiza USO (se houver)
      const usoBloco = document.getElementById('ft-bloco-uso');
      const usoId = usoBloco && usoBloco.dataset.usoId;
      if (usoId) {
        const payloadUso = {
          portaria: valOr('ft-portaria', null),
          processo: valOr('ft-processo', null),
          data_emissao: valOr('ft-data-emissao', null),
          prazo_anos: numOr('ft-prazo'),
          tipo_captacao: valOr('ft-tipo-captacao', null),
          finalidade_uso: valOr('ft-finalidade', null),
          curso_dagua: valOr('ft-curso-dagua', null),
          bacia_hidrografica: valOr('ft-bacia', null),
          coordenada_lat: numOr('ft-coord-lat'),
          coordenada_long: numOr('ft-coord-long'),
          profundidade_m: numOr('ft-profundidade'),
          vazao_m3h: numOr('ft-vazao-mh'),
          horas_uso_dia: numOr('ft-horas-dia'),
          diametro_hidro_m: numOr('ft-diametro')
        };
        await api('usos?id=eq.' + usoId, 'PATCH', payloadUso, 'return=minimal');
      }

      toastSuccess('✓ Ficha técnica salva!');
      await carregarDados();
    } catch(e) {
      console.error('Erro salvarFichaTecnica:', e);
      toastError('Erro ao salvar: ' + (e.message || ''));
    }
  }

  // Envia mensagem WhatsApp pro cliente com checklist completo de documentos
  // SEMANA 4.22b: Otimização — gera planilha Excel + auto-copia mensagem
  function enviarChecklistCliente() {
    if (!projetoAtualId) return;
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p) return;
    const cli = todosClientesUnificado(p.cliente_id) || {};

    const tel = (cli.telefone1 || cli.telefone || '').replace(/\D/g, '');
    if (!tel) { toastError('Cliente sem telefone cadastrado.'); return; }

    // SEMANA 4.19 FIX: link de upload com URL correta (.html)
    const linkUpload = getClienteUrl() + '?upload=' + (p.upload_token || '');

    // Decide se mostra docs rurais/urbanos baseado na propriedade
    const prop = (typeof propriedades !== 'undefined' ? propriedades : [])
      .find(function(pp){ return pp.id === p.propriedade_id; }) || {};
    const tipoArea = prop.area_tipo || '';

    let msg = 'Olá ' + (cli.nome ? cli.nome.split(' ')[0] : '') + '! 👋\n\n';
    msg += '*Projeto:* ' + p.nome + '\n\n';
    msg += 'Pra dar início ao seu processo, preciso dos documentos abaixo.\n';
    msg += '📤 *Envie tudo aqui (sem login):*\n' + linkUpload + '\n\n';

    msg += '━━━━━━━━━━━━━━━━━━━━━\n';
    msg += '*📋 DOCUMENTOS COMUNS (obrigatórios):*\n';
    const docsParaPlanilha = [];
    CHECKLIST_DOCS.filter(function(d){ return d.categoria === 'comum'; }).forEach(function(d){
      msg += '☐ ' + d.icone + ' ' + d.label + '\n';
      docsParaPlanilha.push({ cat: 'COMUM (obrigatório)', icone: d.icone, doc: d.label });
    });

    if (tipoArea === 'rural' || tipoArea === 'mista' || !tipoArea) {
      msg += '\n*🌱 ÁREA RURAL:*\n';
      CHECKLIST_DOCS.filter(function(d){ return d.categoria === 'rural'; }).forEach(function(d){
        msg += '☐ ' + d.icone + ' ' + d.label + '\n';
        docsParaPlanilha.push({ cat: '🌱 RURAL', icone: d.icone, doc: d.label });
      });
    }
    if (tipoArea === 'urbana' || tipoArea === 'mista' || !tipoArea) {
      msg += '\n*🏙️ ÁREA URBANA:*\n';
      CHECKLIST_DOCS.filter(function(d){ return d.categoria === 'urbana'; }).forEach(function(d){
        msg += '☐ ' + d.icone + ' ' + d.label + '\n';
        docsParaPlanilha.push({ cat: '🏙️ URBANA', icone: d.icone, doc: d.label });
      });
    }
    msg += '━━━━━━━━━━━━━━━━━━━━━\n\n';
    msg += 'Qualquer dúvida, estou à disposição!\n';
    msg += 'Eng. Guilherme Montanari\n';
    msg += 'Zello Ambiental';

    // SEMANA 4.22b: Modal com 3 ações otimizadas
    _abrirModalEnvioDocs(p, cli, tel, msg, docsParaPlanilha);
  }

  // SEMANA 4.22b: Modal de envio otimizado de docs (whatsapp + planilha + copy)
  function _abrirModalEnvioDocs(projeto, cli, tel, mensagem, docs) {
    // Cria modal dinamicamente
    let mod = document.getElementById('ov-envio-docs');
    if (mod) mod.remove();

    mod = document.createElement('div');
    mod.id = 'ov-envio-docs';
    mod.className = 'ov';
    mod.style.cssText = 'display:flex;';
    mod.innerHTML =
      '<div class="ov-card" style="max-width:560px;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">' +
          '<h3 style="margin:0;font-size:16px;color:#075985;">📤 Enviar Documentos pro Cliente</h3>' +
          '<button class="btn btn-sm" onclick="document.getElementById(\'ov-envio-docs\').remove()">✕</button>' +
        '</div>' +
        '<div style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:8px;padding:12px;margin-bottom:14px;">' +
          '<div style="font-size:12px;font-weight:600;color:#075985;margin-bottom:4px;">Cliente:</div>' +
          '<div style="font-size:13px;color:var(--text);">' + escapeHtml(cli.nome || '') + '</div>' +
          '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">📞 ' + escapeHtml((cli.telefone1 || cli.telefone || '')) + '</div>' +
          '<div style="font-size:11px;color:var(--text-muted);">📋 Projeto: ' + escapeHtml(projeto.nome || '') + '</div>' +
        '</div>' +

        '<div style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px;">' +

          '<button id="btn-envio-tudo" class="btn btn-green" style="display:flex;align-items:center;gap:10px;padding:14px;font-size:14px;font-weight:600;text-align:left;">' +
            '<span style="font-size:22px;">🚀</span>' +
            '<div style="flex:1;">' +
              'Envio completo (recomendado)' +
              '<div style="font-size:11px;font-weight:400;opacity:0.9;margin-top:2px;">Baixa planilha + abre WhatsApp com mensagem · 1 clique</div>' +
            '</div>' +
          '</button>' +

          '<div style="display:flex;gap:8px;">' +
            '<button id="btn-envio-planilha" class="btn" style="flex:1;display:flex;align-items:center;gap:8px;padding:10px;background:#fff7ed;border:1px solid #fdba74;color:#c2410c;">' +
              '<span style="font-size:18px;">📊</span>' +
              '<div style="font-size:12px;font-weight:600;text-align:left;">Só baixar planilha<div style="font-size:10px;font-weight:400;opacity:0.85;margin-top:1px;">Excel com checklist</div></div>' +
            '</button>' +
            '<button id="btn-envio-zap" class="btn" style="flex:1;display:flex;align-items:center;gap:8px;padding:10px;background:#dcfce7;border:1px solid #86efac;color:#15803d;">' +
              '<span style="font-size:18px;">💬</span>' +
              '<div style="font-size:12px;font-weight:600;text-align:left;">Só abrir WhatsApp<div style="font-size:10px;font-weight:400;opacity:0.85;margin-top:1px;">Mensagem pré-pronta</div></div>' +
            '</button>' +
          '</div>' +

          '<button id="btn-envio-copy" class="btn" style="display:flex;align-items:center;gap:8px;padding:10px;background:#f1f5f9;border:1px solid #cbd5e1;color:#475569;">' +
            '<span style="font-size:18px;">📋</span>' +
            '<div style="font-size:12px;font-weight:600;text-align:left;">Copiar mensagem<div style="font-size:10px;font-weight:400;opacity:0.85;margin-top:1px;">Pra colar onde quiser</div></div>' +
          '</button>' +

        '</div>' +

        '<details style="margin-bottom:14px;">' +
          '<summary style="cursor:pointer;padding:8px;background:#F8FAFC;border-radius:6px;font-size:12px;font-weight:600;color:var(--text);">👁 Ver prévia da mensagem (' + docs.length + ' documentos)</summary>' +
          '<pre id="envio-docs-msg-preview" style="margin-top:8px;padding:10px;background:#fafafa;border-radius:6px;font-size:11px;color:#334155;white-space:pre-wrap;word-wrap:break-word;max-height:300px;overflow:auto;font-family:inherit;"></pre>' +
        '</details>' +

        '<div style="text-align:right;">' +
          '<button class="btn" onclick="document.getElementById(\'ov-envio-docs\').remove()">Fechar</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(mod);

    // Popula prévia da mensagem
    document.getElementById('envio-docs-msg-preview').textContent = mensagem;

    // Limpa telefone pro link wa.me
    const cleanTel = tel.length === 11 || tel.length === 10 ? '55' + tel : tel;

    // Função: copia mensagem pro clipboard
    const copiarMsg = function() {
      try {
        navigator.clipboard.writeText(mensagem);
        return true;
      } catch(e) {
        // Fallback antigo
        const ta = document.createElement('textarea');
        ta.value = mensagem;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); return true; }
        catch(e2) { return false; }
        finally { document.body.removeChild(ta); }
      }
    };

    // Função: gera e baixa planilha Excel
    const baixarPlanilha = function() {
      if (typeof XLSX === 'undefined') {
        toastError('Biblioteca de Excel não carregou. Tente recarregar a página.');
        return false;
      }
      // Monta dados pra planilha
      const dadosPlanilha = [
        ['CHECKLIST DE DOCUMENTOS — ZELLO AMBIENTAL'],
        [''],
        ['Cliente:', cli.nome || ''],
        ['CPF/CNPJ:', cli.cpf_cnpj || cli.cpf || ''],
        ['Telefone:', cli.telefone1 || cli.telefone || ''],
        ['Projeto:', projeto.nome || ''],
        ['Data:', new Date().toLocaleDateString('pt-BR')],
        [''],
        ['⬜ Marque conforme for enviando os documentos pelo portal'],
        [''],
        ['STATUS', 'CATEGORIA', 'DOCUMENTO'],
      ];
      docs.forEach(function(d){
        dadosPlanilha.push(['☐', d.cat, d.icone + ' ' + d.doc]);
      });
      dadosPlanilha.push(['']);
      dadosPlanilha.push(['📤 Link de upload (sem login):']);
      dadosPlanilha.push([getClienteUrl() + '?upload=' + (projeto.upload_token || '')]);
      dadosPlanilha.push(['']);
      dadosPlanilha.push(['Eng. Guilherme Montanari · Zello Ambiental']);

      const ws = XLSX.utils.aoa_to_sheet(dadosPlanilha);
      // Largura das colunas
      ws['!cols'] = [{ wch: 8 }, { wch: 22 }, { wch: 70 }];
      // Merge de células do título
      ws['!merges'] = [
        { s: {r:0, c:0}, e: {r:0, c:2} },        // título
        { s: {r:8, c:0}, e: {r:8, c:2} },        // instrução
        { s: {r:dadosPlanilha.length-4, c:0}, e: {r:dadosPlanilha.length-4, c:2} }, // link txt
        { s: {r:dadosPlanilha.length-3, c:0}, e: {r:dadosPlanilha.length-3, c:2} }, // link
        { s: {r:dadosPlanilha.length-1, c:0}, e: {r:dadosPlanilha.length-1, c:2} }  // assinatura
      ];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Documentos');

      const nomeArq = 'docs_' + (cli.nome||'cliente').replace(/[^a-zA-Z0-9]/g,'_').substring(0,30) + '_' + new Date().toISOString().slice(0,10) + '.xlsx';
      try {
        XLSX.writeFile(wb, nomeArq);
        return true;
      } catch(e) {
        console.error('Erro ao salvar planilha:', e);
        toastError('Erro ao gerar planilha: ' + (e.message||e));
        return false;
      }
    };

    // Função: abre WhatsApp
    const abrirZap = function() {
      window.open('https://wa.me/' + cleanTel + '?text=' + encodeURIComponent(mensagem), '_blank');
    };

    // Listeners
    document.getElementById('btn-envio-tudo').addEventListener('click', function(){
      const cOk = copiarMsg();
      const pOk = baixarPlanilha();
      // delay 600ms pro download iniciar antes do popup do WhatsApp
      setTimeout(function(){
        abrirZap();
        let msg = 'Enviado! ';
        if (pOk) msg += '📊 Planilha baixada. ';
        if (cOk) msg += '📋 Mensagem copiada. ';
        msg += '💬 WhatsApp aberto.';
        toastSuccess(msg, 6000);
        // Registra envio (pra histórico futuro)
        _registrarEnvioDocs(projeto.id, 'completo');
      }, 600);
    });

    document.getElementById('btn-envio-planilha').addEventListener('click', function(){
      if (baixarPlanilha()) {
        toastSuccess('📊 Planilha baixada!', 4000);
        _registrarEnvioDocs(projeto.id, 'planilha');
      }
    });

    document.getElementById('btn-envio-zap').addEventListener('click', function(){
      copiarMsg();
      abrirZap();
      toastSuccess('💬 WhatsApp aberto · 📋 Mensagem copiada', 4000);
      _registrarEnvioDocs(projeto.id, 'whatsapp');
    });

    document.getElementById('btn-envio-copy').addEventListener('click', function(){
      if (copiarMsg()) {
        toastSuccess('📋 Mensagem copiada!', 3000);
      } else {
        toastError('Não foi possível copiar. Selecione a prévia abaixo.');
      }
    });
  }

  // SEMANA 4.22b: Registra envio de docs (pro futuro: histórico, métricas)
  async function _registrarEnvioDocs(projetoId, tipo) {
    try {
      const sess = getSessao();
      const labels = {
        completo: 'Envio completo (planilha + WhatsApp)',
        planilha: 'Baixou planilha de docs',
        whatsapp: 'Abriu WhatsApp com checklist'
      };
      await api('projeto_historico', 'POST', {
        projeto_id: projetoId,
        acao: 'envio_docs',
        observacao: labels[tipo] || ('Envio de docs: ' + tipo),
        criado_por: sess ? (sess.nome || sess.email || sess.id) : null
      }, 'return=minimal');
    } catch(e) {
      // Falha silenciosa — não atrapalha o fluxo se o envio não puder ser logado
      console.warn('Não foi possível registrar histórico de envio:', e.message);
    }
  }

  // Gera PDF da ficha cadastral preenchida
  function gerarPdfFichaCadastral() {
    if (!projetoAtualId) return;
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p) return;
    const cli = todosClientesUnificado(p.cliente_id) || {};
    const prop = (typeof propriedades !== 'undefined' ? propriedades : []).find(function(pp){ return pp.id === p.propriedade_id; }) || {};
    const uso = (typeof usos !== 'undefined' ? usos : []).find(function(u){ return u.propriedade_id === p.propriedade_id; }) || {};

    function val(v) { return v == null || v === '' ? '_________________________' : escapeHtml(String(v)); }

    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) { toastError('Permita popups pra gerar o PDF.'); return; }

    const html =
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Ficha Cadastral — ' + escapeHtml(cli.nome || '') + '</title>' +
      '<style>' +
        'body{font-family:Arial,sans-serif;font-size:11px;color:#222;padding:20px;line-height:1.5;}' +
        'h1{font-size:18px;text-align:center;color:#1565C0;margin-bottom:4px;}' +
        'h2{font-size:13px;background:#1565C0;color:white;padding:6px 10px;border-radius:4px;margin:14px 0 8px;}' +
        'table{width:100%;border-collapse:collapse;margin-bottom:8px;}' +
        'td{border:1px solid #ccc;padding:5px 8px;vertical-align:top;}' +
        '.label{background:#f5f5f5;font-weight:600;width:30%;color:#555;}' +
        '.checklist{padding:4px 0;}' +
        '@media print{button{display:none;}}' +
      '</style></head><body>' +
      '<h1>FICHA CADASTRAL — ZELLO AMBIENTAL</h1>' +
      '<div style="text-align:center;font-size:10px;color:#666;margin-bottom:14px;">Projeto: ' + escapeHtml(p.nome) + '</div>' +

      '<h2>1. Dados do cliente</h2>' +
      '<table>' +
        '<tr><td class="label">Razão Social</td><td>' + val(cli.nome) + '</td></tr>' +
        '<tr><td class="label">Nome Fantasia</td><td>' + val(cli.nome_fantasia) + '</td></tr>' +
        '<tr><td class="label">CNPJ / CPF</td><td>' + val(cli.cpf_cnpj || cli.cpf) + '</td></tr>' +
        '<tr><td class="label">Inscrição Estadual</td><td>' + val(cli.inscricao_estadual) + '</td></tr>' +
        '<tr><td class="label">Inscrição Municipal</td><td>' + val(cli.inscricao_municipal) + '</td></tr>' +
        '<tr><td class="label">Enquadramento</td><td>' + val(cli.enquadramento) + '</td></tr>' +
        '<tr><td class="label">Endereço</td><td>' + val((cli.endereco_rua || '') + (cli.endereco_numero ? ', ' + cli.endereco_numero : '') + (cli.endereco_bairro ? ' - ' + cli.endereco_bairro : '')) + '</td></tr>' +
        '<tr><td class="label">CEP</td><td>' + val(cli.endereco_cep) + '</td></tr>' +
        '<tr><td class="label">Cidade / UF</td><td>' + val((cli.cidade || '') + (cli.endereco_uf ? ' / ' + cli.endereco_uf : '')) + '</td></tr>' +
        '<tr><td class="label">Nome de contato</td><td>' + val(cli.nome_contato) + '</td></tr>' +
        '<tr><td class="label">Telefone fixo</td><td>' + val(cli.telefone_fixo) + '</td></tr>' +
        '<tr><td class="label">Telefone celular</td><td>' + val(cli.telefone1 || cli.telefone) + '</td></tr>' +
        '<tr><td class="label">E-mail (NF)</td><td>' + val(cli.email_nf || cli.email) + '</td></tr>' +
        '<tr><td class="label">E-mail (cadastro)</td><td>' + val(cli.email_cadastro || cli.email) + '</td></tr>' +
      '</table>' +

      '<h2>2. Dados da propriedade</h2>' +
      '<table>' +
        '<tr><td class="label">Nome da propriedade</td><td>' + val(prop.nome) + '</td></tr>' +
        '<tr><td class="label">Tipo de área</td><td>' + val(prop.area_tipo) + '</td></tr>' +
        '<tr><td class="label">Área (hectares)</td><td>' + val(prop.area_hectares) + '</td></tr>' +
        (prop.area_tipo === 'rural' || prop.area_tipo === 'mista' ?
          '<tr><td class="label">NIRF</td><td>' + val(prop.nirf) + '</td></tr>' +
          '<tr><td class="label">CCIR</td><td>' + val(prop.ccir) + '</td></tr>' +
          '<tr><td class="label">CAR</td><td>' + val(prop.car) + '</td></tr>' +
          '<tr><td class="label">DCAA</td><td>' + (prop.dcaa ? '✓ Sim' : '✗ Não') + '</td></tr>'
          : '') +
        (prop.area_tipo === 'urbana' || prop.area_tipo === 'mista' ?
          '<tr><td class="label">IPTU</td><td>' + val(prop.iptu) + '</td></tr>' +
          '<tr><td class="label">Vig. Sanitária</td><td>' + (prop.tem_vigilancia_sanitaria ? '✓ Sim — ' + val(prop.inscricao_vs) : '✗ Não') + '</td></tr>'
          : '') +
      '</table>' +

      '<h2>3. Dados técnicos da outorga</h2>' +
      '<table>' +
        '<tr><td class="label">Portaria DAEE</td><td>' + val(uso.portaria) + '</td></tr>' +
        '<tr><td class="label">Processo / SEI</td><td>' + val(uso.processo) + '</td></tr>' +
        '<tr><td class="label">Data emissão / Prazo</td><td>' + val(uso.data_emissao) + (uso.prazo_anos ? ' (' + uso.prazo_anos + ' anos)' : '') + '</td></tr>' +
        '<tr><td class="label">Tipo de captação</td><td>' + val(uso.tipo_captacao) + '</td></tr>' +
        '<tr><td class="label">Finalidade</td><td>' + val(uso.finalidade_uso) + '</td></tr>' +
        '<tr><td class="label">Curso d\'água</td><td>' + val(uso.curso_dagua) + '</td></tr>' +
        '<tr><td class="label">Bacia hidrográfica</td><td>' + val(uso.bacia_hidrografica) + '</td></tr>' +
        '<tr><td class="label">Coordenadas</td><td>Lat ' + val(uso.coordenada_lat) + ' / Long ' + val(uso.coordenada_long) + '</td></tr>' +
        '<tr><td class="label">Vazão outorgada</td><td>' + val(uso.vazao_m3h) + ' m³/h × ' + val(uso.horas_uso_dia) + ' h/dia</td></tr>' +
        '<tr><td class="label">Profundidade</td><td>' + val(uso.profundidade_m) + ' m</td></tr>' +
      '</table>' +

      '<h2>4. Checklist de documentos</h2>' +
      '<div class="checklist"><strong>📋 COMUNS (obrigatórios):</strong></div>' +
      CHECKLIST_DOCS.filter(function(d){ return d.categoria === 'comum'; }).map(function(d){
        return '<div class="checklist">☐ ' + d.icone + ' ' + d.label + '</div>';
      }).join('') +
      (!prop.area_tipo || prop.area_tipo === 'rural' || prop.area_tipo === 'mista' ?
        '<div class="checklist" style="margin-top:8px;"><strong>🌱 ÁREA RURAL:</strong></div>' +
        CHECKLIST_DOCS.filter(function(d){ return d.categoria === 'rural'; }).map(function(d){
          return '<div class="checklist">☐ ' + d.icone + ' ' + d.label + '</div>';
        }).join('') : '') +
      (!prop.area_tipo || prop.area_tipo === 'urbana' || prop.area_tipo === 'mista' ?
        '<div class="checklist" style="margin-top:8px;"><strong>🏙️ ÁREA URBANA:</strong></div>' +
        CHECKLIST_DOCS.filter(function(d){ return d.categoria === 'urbana'; }).map(function(d){
          return '<div class="checklist">☐ ' + d.icone + ' ' + d.label + '</div>';
        }).join('') : '') +

      '<div style="margin-top:30px;padding-top:14px;border-top:1px solid #ccc;font-size:10px;color:#666;">' +
        'Documento gerado em ' + new Date().toLocaleDateString('pt-BR') + ' · Zello Ambiental · Eng. Guilherme Montanari · CREA 5069519852' +
      '</div>' +

      '<div style="text-align:center;margin-top:20px;">' +
        '<button onclick="window.print()" style="background:#1565C0;color:white;border:none;padding:10px 24px;border-radius:6px;font-size:14px;cursor:pointer;">🖨️ Imprimir / Salvar PDF</button>' +
      '</div>' +

      '</body></html>';
    w.document.write(html);
    w.document.close();
  }


  function trocarTabProjeto(tabName) {
    document.querySelectorAll('#ov-ver-projeto .modal-tab').forEach(function(t){ t.classList.remove('active'); });
    document.querySelectorAll('#ov-ver-projeto .modal-tab-content').forEach(function(c){ c.classList.remove('active'); });
    const tab = document.querySelector('#ov-ver-projeto .modal-tab[data-tab="' + tabName + '"]');
    if (tab) tab.classList.add('active');
    const map = { resumo:'proj-tab-resumo', etapas:'proj-tab-etapas', docs:'proj-tab-docs', financeiro:'proj-tab-financeiro', hist:'proj-tab-hist' };
    const c = document.getElementById(map[tabName] || 'proj-tab-resumo');
    if (c) c.classList.add('active');
  }

  function renderEtapasProgresso(p) {
    const cont = document.getElementById('ver-proj-prog-container');
    if (!cont) return;
    const atual = p.etapa_atual;
    let html = '<div class="sec-label" style="margin-top:14px;">Progresso das etapas</div>';
    html += '<div class="etapas-prog">';
    for (let i = 1; i <= 4; i++) {
      const cls = i < atual ? 'feita' : (i === atual ? 'atual' : '');
      html += '<div class="etapa-prog-item">';
      html += '<div class="etapa-prog-bola ' + cls + '">' + (i < atual ? '✓' : i) + '</div>';
      if (i < 4) html += '<div class="etapa-prog-linha ' + (i < atual ? 'feita' : '') + '"></div>';
      html += '</div>';
    }
    html += '</div>';
    html += '<div class="etapa-prog-label">';
    for (let i = 1; i <= 4; i++) {
      const cls = i < atual ? 'feita' : (i === atual ? 'atual' : '');
      html += '<div class="' + cls + '">' + ETAPAS_PROJETO[i-1].nome + '</div>';
    }
    html += '</div>';
    cont.innerHTML = html;
  }

  function carregarEtapasTimeline(p) {
    const cont = document.getElementById('ver-proj-etapas-timeline');
    if (!cont) return;
    let html = '';
    for (let i = 1; i <= 4; i++) {
      const e = ETAPAS_PROJETO[i-1];
      const data = p[e.col];
      const status = i < p.etapa_atual ? 'concluida' : (i === p.etapa_atual ? 'atual' : 'pendente');
      const statusLabel = status === 'concluida' ? '✓ Concluída' : (status === 'atual' ? '⏳ Em andamento' : '⏸ Aguardando');
      const cor = status === 'concluida' ? '#2E7D32' : (status === 'atual' ? '#1565C0' : '#9ca3af');
      html += '<div style="display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);">';
      html += '<div style="font-size:24px;width:36px;text-align:center;">' + e.icone + '</div>';
      html += '<div style="flex:1;">';
      html += '<div style="font-size:13px;font-weight:600;color:' + cor + ';">Etapa ' + i + ': ' + e.nome + '</div>';
      html += '<div style="font-size:11.5px;color:var(--text-muted);margin-top:2px;">' + statusLabel + (data ? ' em ' + fmtData(data) : '') + '</div>';
      html += '</div></div>';
    }
    cont.innerHTML = html;
  }

  async function salvarEdicaoProjeto() {
    if (!projetoAtualId) return;
    const nome = document.getElementById('ver-proj-nome').value.trim();
    const req = document.getElementById('ver-proj-req').value.trim();
    const resp = document.getElementById('ver-proj-resp').value.trim();
    const status = document.getElementById('ver-proj-status').value;
    const obs = document.getElementById('ver-proj-obs').value.trim();

    if (!nome) { alert('Nome do projeto é obrigatório.'); return; }

    try {
      const projAntes = projetos.find(function(pp){ return pp.id === projetoAtualId; }) || {};
      const payload = {
        nome: upper(nome),
        requerimento: req || null,
        responsavel: resp || null,
        status: status,
        observacoes: obs || null,
        atualizado_em: new Date().toISOString()
      };
      const r = await api('projetos?id=eq.' + projetoAtualId, 'PATCH', payload, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));

      // Se mudou status, registra no histórico
      if (projAntes.status && projAntes.status !== status) {
        const sess = getSessao();
        const criadoPor = (sess && sess.nome) ? sess.nome : (sess && sess.email ? sess.email : 'admin');
        await api('projeto_historico', 'POST', {
          projeto_id: projetoAtualId,
          acao: 'status_alterado',
          de_valor: projAntes.status,
          para_valor: status,
          criado_por: criadoPor
        }, 'return=minimal');
      }

      await carregarDados();
      verProjeto(projetoAtualId);
      const btn = event && event.target;
      if (btn && btn.tagName === 'BUTTON') {
        const orig = btn.textContent;
        btn.textContent = '✓ Salvo';
        setTimeout(function(){ btn.textContent = orig; }, 1500);
      }
    } catch(e) {
      console.error('Erro salvarEdicaoProjeto:', e);
      alert('Erro ao salvar: ' + (e.message || e));
    }
  }

  // SEMANA 4.19: Excluir projeto MODO TESTE — força mesmo se tem comissão paga
  // Use APENAS pra testes! Vai deletar comissões também.
  async function excluirProjetoModoTeste() {
    if (!projetoAtualId) return;
    if (!souAdmin()) { toastError('Apenas admin.'); return; }
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p) return;

    // Conta comissões pra mostrar info
    let qtdComs = 0, valorComs = 0;
    try {
      const rC = await fetch(SUPABASE_URL + '/rest/v1/comissoes?projeto_id=eq.' + projetoAtualId + '&select=valor_comissao', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (rC.ok) {
        const coms = await rC.json();
        qtdComs = coms.length;
        valorComs = coms.reduce(function(s,c){ return s + parseFloat(c.valor_comissao || 0); }, 0);
      }
    } catch(e) { /* ignore */ }

    // ONDA 2: zConfirm + zPrompt em vez de nativos
    // 1ª confirmação (dupla)
    const ok1 = await zConfirm(
      '⚠️ EXCLUSÃO FORÇADA (MODO TESTE)\n\n' +
      'Projeto: ' + p.nome + '\n' +
      'Vai apagar TAMBÉM:\n' +
      '• ' + qtdComs + ' comissão(ões) — total R$ ' + valorComs.toLocaleString('pt-BR') + '\n' +
      '• Histórico de pagamentos\n' +
      '• Histórico de etapas\n' +
      '• Vínculo com documentos\n\n' +
      'Esta operação NUNCA deve ser feita em produção!\n' +
      'Use APENAS pra limpar dados de teste.',
      { tipo:'erro', titulo:'Exclusão forçada', btnOk:'Continuar', btnCancel:'Cancelar' }
    );
    if (!ok1) return;

    // 2ª confirmação: digitar EXCLUIR
    const txt = await zPrompt(
      'Digite EXCLUIR (em maiúsculas) pra confirmar:',
      '',
      { titulo:'⚠️ Última confirmação', placeholder:'EXCLUIR', btnOk:'Confirmar', tipo:'erro' }
    );
    if (txt !== 'EXCLUIR') {
      toastInfo('Cancelado.');
      return;
    }

    try {
      // 1. Deleta comissões (TODAS, mesmo pagas — MODO TESTE)
      await fetch(SUPABASE_URL + '/rest/v1/comissoes?projeto_id=eq.' + projetoAtualId, {
        method: 'DELETE',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'return=minimal' }
      }).catch(function(e){ console.warn('Falha deletando comissões:', e); });

      // 2. Deleta projeto_pagamentos
      await api('projeto_pagamentos?projeto_id=eq.' + projetoAtualId, 'DELETE', null, 'return=minimal').catch(function(){});
      // 3. Deleta projeto_historico
      await api('projeto_historico?projeto_id=eq.' + projetoAtualId, 'DELETE', null, 'return=minimal').catch(function(){});
      // 4. Desvincula documentos
      await api('documentos?projeto_id=eq.' + projetoAtualId, 'PATCH', { projeto_id: null }, 'return=minimal').catch(function(){});
      // 5. Deleta projeto
      const r = await api('projetos?id=eq.' + projetoAtualId, 'DELETE', null, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));

      // Volta cliente pra prospecção se não tem outros projetos
      const cliId = p.cliente_id;
      const outrosProj = projetos.filter(function(pp){ return pp.cliente_id === cliId && pp.id !== projetoAtualId; });
      if (!outrosProj.length) {
        await api('clientes?id=eq.' + cliId, 'PATCH', { status_funil: 'prospeccao', status_lead: 'em_contato' }, 'return=minimal').catch(function(){});
      }

      fecharModal('ov-ver-projeto');
      projetoAtualId = null;
      await carregarDados();
      if (typeof renderKanban === 'function') renderKanban();
      if (typeof atualizarCardComissoesDashboard === 'function') atualizarCardComissoesDashboard();
      toastSuccess('🗑️ Projeto excluído (modo teste): ' + qtdComs + ' comissão(ões) também removida(s)', 5000);
    } catch(e) {
      console.error('Erro excluirProjetoModoTeste:', e);
      toastError('Erro: ' + (e.message || ''));
    }
  }

  async function excluirProjetoConfirm() {
    if (!projetoAtualId) return;
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p) return;

    // FIX BUG #12: Verifica se tem comissões pagas — não pode apagar (auditoria)
    let aviso = '';
    try {
      const rC = await fetch(SUPABASE_URL + '/rest/v1/comissoes?projeto_id=eq.' + projetoAtualId + '&select=status_pagamento,valor_comissao', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (rC.ok) {
        const coms = await rC.json();
        const pagas = coms.filter(function(c){ return c.status_pagamento === 'pago'; });
        const pendentes = coms.filter(function(c){ return c.status_pagamento === 'pendente'; });
        if (pagas.length > 0) {
          alert('❌ Não é possível excluir este projeto.\n\nEle tem ' + pagas.length + ' comissão(ões) JÁ PAGA(s) — apagar agora quebraria a auditoria financeira.\n\nAlternativa: marque o status como "cancelado" em vez de excluir.');
          return;
        }
        if (pendentes.length > 0) {
          aviso = '\n\n💰 Há ' + pendentes.length + ' comissão(ões) pendente(s) (R$ ' +
            pendentes.reduce(function(s,c){ return s + parseFloat(c.valor_comissao || 0); }, 0).toLocaleString('pt-BR') +
            ') que serão MARCADAS COMO ESTORNADAS.';
        }
      }
    } catch(e) { console.warn('Erro checando comissoes:', e); }

    if (!(await zConfirm('Excluir o projeto "' + p.nome + '"?\n\nIsso vai apagar:\n• Histórico de etapas\n• Registros de pagamentos\n• Vínculo de documentos' + aviso + '\n\nO cliente NÃO será excluído. Esta ação não pode ser desfeita.', { tipo:'erro', btnOk:'Excluir projeto' }))) return;

    try {
      // FIX BUG #12: Estorna comissões pendentes ANTES de apagar projeto
      await fetch(SUPABASE_URL + '/rest/v1/comissoes?projeto_id=eq.' + projetoAtualId + '&status_pagamento=eq.pendente', {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ status_pagamento: 'estornado' })
      }).catch(function(e){ console.warn('Falha estornando comissões:', e); });

      // Deleta em ordem
      await api('projeto_pagamentos?projeto_id=eq.' + projetoAtualId, 'DELETE', null, 'return=minimal');
      await api('projeto_historico?projeto_id=eq.' + projetoAtualId, 'DELETE', null, 'return=minimal');
      // Documentos: só desvincula (não apaga, podem ser do cliente em geral)
      await api('documentos?projeto_id=eq.' + projetoAtualId, 'PATCH', { projeto_id: null }, 'return=minimal');
      const r = await api('projetos?id=eq.' + projetoAtualId, 'DELETE', null, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));

      // Volta o cliente pro funil de prospecção (não pode ficar sem status válido)
      // Mas só se o cliente NÃO tem outros projetos
      const cliId = p.cliente_id;
      const outrosProj = projetos.filter(function(pp){ return pp.cliente_id === cliId && pp.id !== projetoAtualId; });
      if (!outrosProj.length) {
        await api('clientes?id=eq.' + cliId, 'PATCH', { status_funil: 'prospeccao', status_lead: 'em_contato' }, 'return=minimal');
      }

      fecharModal('ov-ver-projeto');
      projetoAtualId = null;
      await carregarDados();
      renderKanban();
      atualizarCardComissoesDashboard();
      alert('✓ Projeto excluído.');
    } catch(e) {
      console.error('Erro excluirProjeto:', e);
      alert('Erro ao excluir: ' + (e.message || e));
    }
  }


  // ============================================================
  // AVANÇAR ETAPA
  // ============================================================
  function abrirAvancarEtapa() {
    if (!projetoAtualId) return;
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p) return;
    if (p.etapa_atual >= 4) { alert('Projeto já está na etapa final. Use "Publicar outorga" para concluir.'); return; }

    const proxima = p.etapa_atual + 1;

    // FASE 14.3: valida checkboxes obrigatórios antes de avançar
    const check = verificarChecksEtapa(p, proxima);
    if (!check.ok) {
      alert(check.motivo);
      return;
    }

    document.getElementById('avancar-etapa-titulo').textContent = '→ Avançar para Etapa ' + proxima + ': ' + ETAPAS_PROJETO[proxima-1].nome;
    document.getElementById('avancar-etapa-sub').textContent = 'Concluindo: ' + ETAPAS_PROJETO[p.etapa_atual-1].nome;
    document.getElementById('avancar-etapa-data').value = getDataHojeBR();
    document.getElementById('avancar-etapa-obs').value = '';
    abrirModal('ov-avancar-etapa');
  }

  async function confirmarAvancarEtapa() {
    if (!projetoAtualId) return;
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p) return;
    const data = document.getElementById('avancar-etapa-data').value;
    const obs = document.getElementById('avancar-etapa-obs').value.trim();
    if (!data) { alert('Informe a data de conclusão da etapa atual.'); return; }

    const colAtual = ETAPAS_PROJETO[p.etapa_atual - 1].col; // ex: 'data_vistoria'
    const proxima = p.etapa_atual + 1;
    const sess = getSessao();
    const criadoPor = (sess && sess.nome) ? sess.nome : (sess && sess.email ? sess.email : 'admin');

    const btn = document.getElementById('btn-confirmar-avancar');
    btn.disabled = true; btn.textContent = '⏳ Avançando...';

    try {
      // Atualiza projeto
      const payload = {
        etapa_atual: proxima,
        atualizado_em: new Date().toISOString()
      };
      payload[colAtual] = data;
      const r = await api('projetos?id=eq.' + projetoAtualId, 'PATCH', payload, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));

      // Histórico
      await api('projeto_historico', 'POST', {
        projeto_id: projetoAtualId,
        acao: 'etapa_alterada',
        de_valor: String(p.etapa_atual),
        para_valor: String(proxima),
        observacao: obs || null,
        criado_por: criadoPor
      }, 'return=minimal');

      fecharModal('ov-avancar-etapa');
      await carregarDados();
      verProjeto(projetoAtualId);
    } catch(e) {
      console.error('Erro confirmarAvancarEtapa:', e);
      alert('Erro ao avançar etapa: ' + (e.message || e));
    } finally {
      btn.disabled = false; btn.textContent = '→ Avançar';
    }
  }


  // ============================================================
  // PUBLICAR OUTORGA (etapa final → cliente ativo)
  // ============================================================
  function abrirPublicarOutorga() {
    if (!projetoAtualId) return;
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p) return;
    if (p.etapa_atual !== 4) { alert('Só é possível publicar outorga na etapa 4 (Publicação).'); return; }

    const cli = todosClientesUnificado(p.cliente_id) || {};
    const prop = (typeof propriedades !== 'undefined' ? propriedades : []).find(function(pp){ return pp.id === p.propriedade_id; }) || {};
    document.getElementById('publicar-out-sub').textContent = cli.nome + ' · ' + prop.nome;
    document.getElementById('pub-data').value = getDataHojeBR();
    document.getElementById('pub-portaria').value = '';
    document.getElementById('pub-prazo').value = '120';
    document.getElementById('pub-gerar-pin').value = 'sim';
    document.getElementById('pub-enviar-wpp').checked = false;
    abrirModal('ov-publicar-outorga');
  }

  // Hash SHA-256 (mesmo do clientes.js): pra gerar pin_hash
  async function sha256Hex(str) {
    const buf = new TextEncoder().encode(str);
    const h = await crypto.subtle.digest('SHA-256', buf);
    const arr = Array.from(new Uint8Array(h));
    return arr.map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
  }

  async function confirmarPublicarOutorga() {
    if (!projetoAtualId) return;
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p) return;

    const data = document.getElementById('pub-data').value;
    const portariaRaw = document.getElementById('pub-portaria').value.trim();
    const prazoMeses = parseInt(document.getElementById('pub-prazo').value, 10) || 120;
    const gerarPin = document.getElementById('pub-gerar-pin').value === 'sim';
    const enviarWpp = document.getElementById('pub-enviar-wpp').checked;

    if (!data) { alert('Data da publicação é obrigatória.'); return; }
    if (!portariaRaw) { alert('Número da portaria é obrigatório.'); return; }

    // FASE 3B Item 4: validação de portaria
    const vPort = validarPortaria(portariaRaw);
    if (!vPort.ok) {
      alert('⚠ Portaria inválida\n\n' + vPort.mensagem);
      document.getElementById('pub-portaria').focus();
      return;
    }
    const portaria = vPort.valor;

    const sess = getSessao();
    const criadoPor = (sess && sess.nome) ? sess.nome : (sess && sess.email ? sess.email : 'admin');

    const btn = document.getElementById('btn-confirmar-publicar');
    btn.disabled = true; btn.textContent = '⏳ Publicando...';

    try {
      // 1. Atualiza projeto
      await api('projetos?id=eq.' + projetoAtualId, 'PATCH', {
        status: 'concluido',
        data_publicacao: data,
        atualizado_em: new Date().toISOString()
      }, 'return=minimal');

      // 2. Atualiza cliente: status_funil='cliente_ativo' + PIN se solicitado
      const updCli = {
        status_funil: 'cliente_ativo',
        portal_ativo: true
      };
      let pinGerado = null;
      if (gerarPin) {
        // Gera PIN aleatório de 4 dígitos
        pinGerado = String(Math.floor(1000 + Math.random() * 9000));
        updCli.pin_hash = await sha256Hex(pinGerado);
      }
      await api('clientes?id=eq.' + p.cliente_id, 'PATCH', updCli, 'return=minimal');

      // 3. Atualiza pontos (usos) da propriedade com dados da publicação
      const usosProp = (typeof usos !== 'undefined' ? usos : []).filter(function(u){ return u.propriedade_id === p.propriedade_id; });
      for (const u of usosProp) {
        try {
          await api('usos?id=eq.' + u.id, 'PATCH', {
            portaria: portaria,
            data_emissao: data,
            prazo_meses: prazoMeses,
            requerimento: u.requerimento || p.requerimento || null
          }, 'return=minimal');
        } catch(e) { /* segue */ }
      }

      // 4. Histórico
      await api('projeto_historico', 'POST', {
        projeto_id: projetoAtualId,
        acao: 'projeto_concluido',
        para_valor: 'concluido',
        observacao: 'Outorga publicada — Portaria ' + portaria + ' (prazo ' + prazoMeses + ' meses)' + (gerarPin ? '. PIN gerado.' : '.'),
        criado_por: criadoPor
      }, 'return=minimal');

      fecharModal('ov-publicar-outorga');
      fecharModal('ov-ver-projeto');
      projetoAtualId = null;
      await carregarDados();
      renderKanban();

      let msg = '✅ Outorga publicada com sucesso!\n\n• Cliente movido para "Clientes ativos"\n• Pontos atualizados com Portaria ' + portaria;
      if (pinGerado) {
        msg += '\n• PIN gerado: ' + pinGerado + ' (anote!)';
      }
      alert(msg);

      // 5. WhatsApp opcional
      if (enviarWpp && pinGerado) {
        const cli = todosClientesUnificado(p.cliente_id) || {};
        const tel = (cli.telefone1 || '').replace(/\D/g,'');
        if (tel) {
          const cleanTel = tel.length === 11 || tel.length === 10 ? '55' + tel : tel;
          const txt = 'Olá ' + (cli.nome ? cli.nome.split(' ')[0] : '') + '! Sua outorga foi publicada (Portaria ' + portaria + '). Seu PIN de acesso ao portal é: ' + pinGerado + '. Acesse: ' + (typeof CLIENTE_URL !== 'undefined' ? CLIENTE_URL : '');
          window.open('https://wa.me/' + cleanTel + '?text=' + encodeURIComponent(txt), '_blank');
        } else {
          alert('Cliente sem telefone cadastrado. Envie o PIN ' + pinGerado + ' manualmente.');
        }
      }

    } catch(e) {
      console.error('Erro confirmarPublicarOutorga:', e);
      alert('Erro ao publicar: ' + (e.message || e));
    } finally {
      btn.disabled = false; btn.textContent = '✅ Publicar e ativar cliente';
    }
  }


  // ============================================================
  // FINANCEIRO (valor_total + NF + pagamentos)
  // ============================================================
  function atualizarCardsFinanceiro(p) {
    document.getElementById('fin-valor-total').textContent = fmtBRL(p.valor_total);
    document.getElementById('fin-valor-pago').textContent = fmtBRL(p.valor_pago);
    const saldo = (p.valor_total || 0) - (p.valor_pago || 0);
    document.getElementById('fin-saldo').textContent = 'Saldo: ' + fmtBRL(saldo);
    const stPgto = p.status_pgto || 'aberto';
    const stLabel = { aberto:'ABERTO', parcial:'PARCIAL', quitado:'QUITADO' }[stPgto];
    document.getElementById('fin-status-pgto').innerHTML = '<span class="pgto-tag pg-' + stPgto + '">' + stLabel + '</span>';

    // REVISÃO: Seção comissão (admin only)
    renderSecaoComissaoProjeto(p);
  }

  // REVISÃO: Mostra info da comissão + opções de troca de hunter / recalcular
  async function renderSecaoComissaoProjeto(p) {
    const sec = document.getElementById('proj-secao-comissao');
    if (!sec) return;
    if (!souAdmin()) { sec.style.display = 'none'; return; }
    sec.style.display = '';

    const info = document.getElementById('proj-comissao-info');
    if (!info) return;

    // 1. Tem hunter?
    let huntInfo = '<em>Sem hunter associado — não vai gerar comissão.</em>';
    if (p.hunter_id_origem) {
      const huntObj = (_usuariosCache || []).find(function(u){ return u.id === p.hunter_id_origem; });
      if (huntObj) {
        const cor = huntObj.cor ? CORES_TIMES[huntObj.cor] : null;
        const emoji = cor ? cor.emoji : '👤';
        huntInfo = '<strong>Hunter:</strong> ' + emoji + ' ' + escapeHtml(huntObj.nome);
      } else {
        huntInfo = '<em>Hunter não encontrado (excluído?)</em>';
      }
    }

    // 2. Tem comissão registrada?
    let comInfo = '';
    try {
      const r = await fetch(SUPABASE_URL + '/rest/v1/comissoes?projeto_id=eq.' + p.id + '&select=*', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (r.ok) {
        const coms = await r.json();
        if (coms.length === 0) {
          if (p.pago_1) {
            // Pago 1º mas sem comissão → diagnóstico
            let motivo = '';
            if (!p.hunter_id_origem) motivo = 'sem hunter associado';
            else if (!p.valor_total || p.valor_total < 3000) motivo = 'valor R$ ' + (p.valor_total||0) + ' < mínimo R$ 3.000';
            else motivo = 'a trigger SQL pode não estar instalada';
            comInfo = '<br/><strong style="color:#C62828;">⚠ Pago 1º marcado mas sem comissão!</strong><br/><em>Motivo provável: ' + motivo + '</em>';
          } else {
            comInfo = '<br/><em>Comissão será gerada quando "Pago 1º" for marcado.</em>';
          }
        } else {
          const c = coms[0];
          const valor = parseFloat(c.valor_comissao || 0).toLocaleString('pt-BR');
          const status = c.status_pagamento === 'pago' ? '✅ PAGO' : (c.status_pagamento === 'estornado' ? '↩ ESTORNADO' : '⏳ PENDENTE');
          comInfo = '<br/><strong>Comissão:</strong> R$ ' + valor + ' · ' + c.numero_fechamento_mes + 'º do mês · ' + status;
        }
      }
    } catch(e) { console.warn('Erro renderSecaoComissao:', e); }

    info.innerHTML = huntInfo + comInfo;
  }

  // REVISÃO: Admin troca o hunter de um projeto
  async function reatribuirHunterProjeto() {
    if (!projetoAtualId) return;
    if (!souAdmin()) return;
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p) return;

    const hunters = (_usuariosCache || []).filter(function(u){ return u.papel === 'hunter' && u.ativo; });
    if (hunters.length === 0) {
      zAlert('Não há hunters cadastrados.', 'aviso');
      return;
    }

    // ONDA 2 BUG#6: usa modal visual em vez de prompt nativo
    // Marca o hunter atual com indicador visual (ATUAL)
    const escolhido = await selecionarHunter({
      titulo: 'Trocar hunter responsável',
      mensagem: 'Escolha o novo hunter responsável pela comissão deste projeto.',
      atualId: p.hunter_id_origem || null,
      permitirNenhum: true
    });
    if (escolhido === false) return;   // cancelou
    const novoHunterId = escolhido;     // null ou id

    if (novoHunterId === p.hunter_id_origem) {
      zAlert('Hunter não mudou.', 'info');
      return;
    }

    if (!(await zConfirm('Trocar o hunter responsável?\n\nDe: ' + (p.hunter_id_origem ? 'hunter atual' : 'sem hunter') + '\nPara: ' + (novoHunterId ? 'novo hunter' : 'nenhum') + '\n\nSe já existe comissão pendente, ela será ESTORNADA e uma nova será gerada (se aplicável).', { tipo:'erro', btnOk:'Trocar' }))) return;

    try {
      // 1. Estorna comissão existente (se houver, e pendente)
      await fetch(SUPABASE_URL + '/rest/v1/comissoes?projeto_id=eq.' + projetoAtualId + '&status_pagamento=eq.pendente', {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ status_pagamento: 'estornado' })
      });

      // 2. Atualiza hunter no projeto
      const r = await fetch(SUPABASE_URL + '/rest/v1/projetos?id=eq.' + projetoAtualId, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ hunter_id_origem: novoHunterId })
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);

      p.hunter_id_origem = novoHunterId;

      // 3. Se pago_1=true e tem novo hunter, força recriação da comissão
      if (p.pago_1 && novoHunterId) {
        await recalcularComissaoInterno(p.id);
      }

      // FIX BUG #11: registra mudança no histórico do projeto (auditoria)
      try {
        const sess2 = getSessao();
        const huntAntigoNome = p.hunter_id_origem ?
          ((_usuariosCache || []).find(function(u){ return u.id === p.hunter_id_origem; }) || {}).nome || '(?)' :
          '(sem hunter)';
        const huntNovoNome = novoHunterId ?
          ((_usuariosCache || []).find(function(u){ return u.id === novoHunterId; }) || {}).nome || '(?)' :
          '(sem hunter)';
        await api('projeto_historico', 'POST', {
          projeto_id: projetoAtualId,
          acao: 'hunter_alterado',
          observacao: 'Hunter alterado de "' + huntAntigoNome + '" para "' + huntNovoNome + '"' + (p.pago_1 && novoHunterId ? '. Comissão recalculada.' : ''),
          criado_por: (sess2 && sess2.nome) || 'admin'
        }, 'return=minimal');
      } catch(e) { console.warn('Erro registrando histórico:', e); }

      alert('✅ Hunter atualizado!\n\n' + (novoHunterId && p.pago_1 ? 'Comissão recalculada.' : ''));
      // Re-render
      const proj = projetos.find(function(pp){ return pp.id === projetoAtualId; });
      if (proj) renderSecaoComissaoProjeto(proj);
      atualizarCardComissoesDashboard();
    } catch(e) {
      alert('Erro: ' + (e.message || ''));
    }
  }

  // REVISÃO: Recalcular comissão (deletar e disparar trigger de novo)
  async function recalcularComissaoProjeto() {
    if (!projetoAtualId) return;
    if (!souAdmin()) return;
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p) return;

    if (!p.pago_1) {
      alert('Pago 1º não está marcado. Marque o checkbox primeiro pra gerar comissão.');
      return;
    }
    if (!p.hunter_id_origem) {
      alert('Sem hunter associado. Use "Trocar hunter" pra atribuir.');
      return;
    }
    if (!p.valor_total || p.valor_total < 3000) {
      alert('Valor do projeto (R$ ' + (p.valor_total || 0) + ') está abaixo do mínimo (R$ 3.000).\n\nAjuste o "Valor total" na seção acima e salve antes de recalcular.');
      return;
    }

    if (!(await zConfirm('Recalcular comissão?\n\nIsso vai:\n• Apagar comissão pendente (se houver) deste projeto\n• Disparar trigger pra criar nova\n\nÚtil se mudou hunter ou valor.', { tipo:'info', btnOk:'Recalcular' }))) return;

    try {
      await recalcularComissaoInterno(projetoAtualId);
      alert('✅ Comissão recalculada!');
      renderSecaoComissaoProjeto(p);
      atualizarCardComissoesDashboard();
    } catch(e) {
      alert('Erro: ' + (e.message || ''));
    }
  }

  // Auxiliar interno: deleta comissões pendentes do projeto e força re-trigger
  async function recalcularComissaoInterno(projetoId) {
    // 1. Deleta comissões PENDENTES deste projeto (preserva pagas/estornadas)
    const rDel = await fetch(SUPABASE_URL + '/rest/v1/comissoes?projeto_id=eq.' + projetoId + '&status_pagamento=eq.pendente', {
      method: 'DELETE',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
    });
    if (!rDel.ok) console.warn('Erro ao deletar comissão pendente:', rDel.status);

    // 2. Toggle pago_1 (false → true) pra disparar trigger
    // FIX BUG #5: aguarda cada PATCH terminar de verdade
    const r1 = await fetch(SUPABASE_URL + '/rest/v1/projetos?id=eq.' + projetoId, {
      method: 'PATCH',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ pago_1: false })
    });
    if (!r1.ok) throw new Error('Erro ao resetar pago_1: ' + r1.status);

    // Pequeno delay pra garantir consistência
    await new Promise(function(res){ setTimeout(res, 400); });

    const r2 = await fetch(SUPABASE_URL + '/rest/v1/projetos?id=eq.' + projetoId, {
      method: 'PATCH',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ pago_1: true, pago_1_em: getDataHojeBR() })
    });
    if (!r2.ok) throw new Error('Erro ao marcar pago_1: ' + r2.status);

    // Aguarda trigger rodar
    await new Promise(function(res){ setTimeout(res, 800); });

    // Verifica se comissão foi criada
    const rCheck = await fetch(SUPABASE_URL + '/rest/v1/comissoes?projeto_id=eq.' + projetoId + '&status_pagamento=eq.pendente&select=id', {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
    });
    if (rCheck.ok) {
      const coms = await rCheck.json();
      if (coms.length === 0) {
        throw new Error('Trigger não criou comissão. Verifique se a migração SQL foi rodada.');
      }
    }
  }

  async function salvarFinanceiroProjeto() {
    if (!projetoAtualId) return;
    const valorStr = document.getElementById('ver-proj-valor-total').value.trim();
    const nf = document.getElementById('ver-proj-nf').value.trim();
    const nfUrl = document.getElementById('ver-proj-nf-url').value.trim();

    let valor = null;
    if (valorStr) {
      const v = parseFloat(valorStr.replace(',', '.'));
      if (isNaN(v) || v < 0) { alert('Valor total inválido.'); return; }
      valor = v;
    }

    try {
      // Recalcula status_pgto
      const proj = projetos.find(function(pp){ return pp.id === projetoAtualId; });
      const pago = proj.valor_pago || 0;
      let stPgto = 'aberto';
      if (valor != null && valor > 0) {
        if (pago >= valor) stPgto = 'quitado';
        else if (pago > 0) stPgto = 'parcial';
      }
      const r = await api('projetos?id=eq.' + projetoAtualId, 'PATCH', {
        valor_total: valor,
        nf_numero: nf || null,
        nf_url: nfUrl || null,
        status_pgto: stPgto,
        atualizado_em: new Date().toISOString()
      }, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));
      await carregarDados();
      verProjeto(projetoAtualId);
      const btn = event && event.target;
      if (btn && btn.tagName === 'BUTTON') {
        const orig = btn.textContent;
        btn.textContent = '✓ Salvo';
        setTimeout(function(){ btn.textContent = orig; }, 1500);
      }
    } catch(e) {
      console.error('Erro salvarFinanceiroProjeto:', e);
      alert('Erro: ' + (e.message || e));
    }
  }

  async function carregarPagamentosProjeto(pid) {
    try {
      pagamentosProjAtual = await api('projeto_pagamentos?projeto_id=eq.' + pid + '&order=data_prevista.asc.nullslast,data_pago.desc.nullslast') || [];
    } catch(e) { pagamentosProjAtual = []; }
    renderPagamentosProjeto();
  }

  function renderPagamentosProjeto() {
    const cont = document.getElementById('ver-proj-pgtos-lista');
    if (!cont) return;
    if (!pagamentosProjAtual.length) {
      cont.innerHTML = '<div class="hist-empty">Nenhum pagamento registrado.</div>';
      return;
    }
    cont.innerHTML = pagamentosProjAtual.map(function(pg) {
      const pago = !!pg.data_pago;
      const icone = pago ? '✓' : '⏳';
      const cor = pago ? '#2E7D32' : '#E65100';
      const dataStr = pago
        ? ('pago em ' + fmtData(pg.data_pago))
        : (pg.data_prevista ? 'previsto pra ' + fmtData(pg.data_prevista) : 'a receber');
      const linkComp = pg.comprovante_url
        ? '<a href="' + escapeHtml(pg.comprovante_url) + '" target="_blank" class="btn btn-sm" style="background:#E3F2FD;color:#1565C0;margin-right:4px;" title="Ver comprovante">🔗</a>'
        : '';
      return '<div class="hist-item">' +
        '<div class="hist-icon" style="background:' + (pago ? '#E8F5E9' : '#FFF3E0') + ';color:' + cor + ';">' + icone + '</div>' +
        '<div class="hist-body">' +
          '<div class="hist-title-row">' +
            '<span class="hist-tipo">' + fmtBRL(pg.valor) + '</span>' +
            '<span class="hist-data">' + dataStr + '</span>' +
          '</div>' +
          '<div class="hist-desc">' + (pg.forma || '—') + (pg.observacao ? ' · ' + pg.observacao.replace(/</g,'&lt;') : '') + '</div>' +
        '</div>' +
        '<div style="display:flex;gap:4px;align-items:center;">' + linkComp + '<button class="btn btn-sm btn-danger" onclick="excluirPagamento(\'' + pg.id + '\')" title="Excluir">🗑</button></div>' +
      '</div>';
    }).join('');
  }

  function abrirRegistrarPagamento() {
    if (!projetoAtualId) return;
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p) return;
    document.getElementById('reg-pgto-id').value = '';
    document.getElementById('reg-pgto-proj-nome').textContent = p.nome;
    document.getElementById('reg-pgto-valor').value = '';
    document.getElementById('reg-pgto-forma').value = 'PIX';
    document.getElementById('reg-pgto-prevista').value = getDataHojeBR();
    document.getElementById('reg-pgto-data').value = '';
    document.getElementById('reg-pgto-obs').value = '';
    const compEl = document.getElementById('reg-pgto-comprovante');
    if (compEl) compEl.value = '';
    abrirModal('ov-reg-pgto');
  }

  async function salvarRegistroPagamento() {
    if (!projetoAtualId) return;
    const valorStr = document.getElementById('reg-pgto-valor').value.trim();
    const forma = document.getElementById('reg-pgto-forma').value;
    const prev = document.getElementById('reg-pgto-prevista').value || null;
    const data = document.getElementById('reg-pgto-data').value || null;
    const obs = document.getElementById('reg-pgto-obs').value.trim();
    const comprovanteUrlEl = document.getElementById('reg-pgto-comprovante');
    const comprovanteUrl = comprovanteUrlEl ? comprovanteUrlEl.value.trim() : '';

    if (!valorStr) { alert('Valor é obrigatório.'); return; }
    const valor = parseFloat(valorStr.replace(',', '.'));
    if (isNaN(valor) || valor <= 0) { alert('Valor inválido.'); return; }

    const sess = getSessao();
    const criadoPor = (sess && sess.nome) ? sess.nome : (sess && sess.email ? sess.email : 'admin');

    const btn = document.getElementById('btn-salvar-pgto');
    btn.disabled = true; btn.textContent = '⏳ Salvando...';

    try {
      // 1. Cria pagamento
      const r = await api('projeto_pagamentos', 'POST', {
        projeto_id: projetoAtualId,
        data_prevista: prev,
        data_pago: data,
        valor: valor,
        forma: forma,
        observacao: obs || null,
        comprovante_url: comprovanteUrl || null,
        criado_por: criadoPor
      }, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));

      // 2. Recalcula valor_pago do projeto (soma de tudo com data_pago)
      const todosPgs = await api('projeto_pagamentos?projeto_id=eq.' + projetoAtualId);
      const totalPago = (todosPgs || []).filter(function(x){ return x.data_pago; }).reduce(function(acc, x){ return acc + (parseFloat(x.valor) || 0); }, 0);

      // 3. Atualiza projeto + recalcula status_pgto
      const proj = projetos.find(function(pp){ return pp.id === projetoAtualId; });
      const valTotal = proj.valor_total || 0;
      let stPgto = 'aberto';
      if (valTotal > 0) {
        if (totalPago >= valTotal) stPgto = 'quitado';
        else if (totalPago > 0) stPgto = 'parcial';
      } else if (totalPago > 0) {
        stPgto = 'parcial';
      }

      await api('projetos?id=eq.' + projetoAtualId, 'PATCH', {
        valor_pago: totalPago,
        status_pgto: stPgto,
        atualizado_em: new Date().toISOString()
      }, 'return=minimal');

      // 4. Histórico
      await api('projeto_historico', 'POST', {
        projeto_id: projetoAtualId,
        acao: 'pagamento_registrado',
        para_valor: fmtBRL(valor),
        observacao: forma + (obs ? ' · ' + obs : ''),
        criado_por: criadoPor
      }, 'return=minimal');

      fecharModal('ov-reg-pgto');
      await carregarDados();
      verProjeto(projetoAtualId);
    } catch(e) {
      console.error('Erro salvarRegistroPagamento:', e);
      alert('Erro ao salvar: ' + (e.message || e));
    } finally {
      btn.disabled = false; btn.textContent = '💾 Salvar';
    }
  }

  async function excluirPagamento(pgId) {
    if (!confirm('Excluir este registro de pagamento?\n\nO valor pago do projeto será recalculado.')) return;
    try {
      await api('projeto_pagamentos?id=eq.' + pgId, 'DELETE', null, 'return=minimal');

      // Recalcula valor_pago do projeto
      if (projetoAtualId) {
        const todosPgs = await api('projeto_pagamentos?projeto_id=eq.' + projetoAtualId);
        const totalPago = (todosPgs || []).filter(function(x){ return x.data_pago; }).reduce(function(acc, x){ return acc + (parseFloat(x.valor) || 0); }, 0);
        const proj = projetos.find(function(pp){ return pp.id === projetoAtualId; });
        const valTotal = proj.valor_total || 0;
        let stPgto = 'aberto';
        if (valTotal > 0) {
          if (totalPago >= valTotal) stPgto = 'quitado';
          else if (totalPago > 0) stPgto = 'parcial';
        } else if (totalPago > 0) {
          stPgto = 'parcial';
        }
        await api('projetos?id=eq.' + projetoAtualId, 'PATCH', {
          valor_pago: totalPago,
          status_pgto: stPgto,
          atualizado_em: new Date().toISOString()
        }, 'return=minimal');
        await carregarDados();
        verProjeto(projetoAtualId);
      }
    } catch(e) {
      alert('Erro: ' + (e.message || e));
    }
  }


  // ============================================================
  // DOCUMENTOS DO PROJETO
  // ============================================================
  async function carregarDocsProjeto(pid) {
    try {
      docsProjAtual = await api('documentos?projeto_id=eq.' + pid + '&order=created_at.desc') || [];
    } catch(e) { docsProjAtual = []; }
    renderDocsProjeto();
  }

  function renderDocsProjeto() {
    const cont = document.getElementById('ver-proj-docs-lista');
    if (!cont) return;
    document.getElementById('ver-proj-cnt-docs').textContent = '(' + docsProjAtual.length + ')';
    if (!docsProjAtual.length) {
      cont.innerHTML = '<div class="hist-empty">Nenhum documento anexado ao projeto.</div>';
      return;
    }
    const tipoIcone = { laudo:'📋', art:'📝', croqui:'🗺', protocolo:'📥', exigencia:'⚠', outro:'📄' };
    cont.innerHTML = docsProjAtual.map(function(d) {
      const ic = tipoIcone[d.tipo] || '📄';
      return '<div class="hist-item">' +
        '<div class="hist-icon" style="background:#E3F2FD;color:#1565C0;">' + ic + '</div>' +
        '<div class="hist-body">' +
          '<div class="hist-title-row">' +
            '<span class="hist-tipo">' + (d.titulo || d.tipo || 'Documento') + '</span>' +
            '<span class="hist-data">' + (d.created_at ? fmtData(d.created_at) : '') + '</span>' +
          '</div>' +
          (d.observacao ? '<div class="hist-desc">' + d.observacao.replace(/</g,'&lt;') + '</div>' : '') +
        '</div>' +
        '<div style="display:flex;gap:4px;">' +
          (d.arquivo_url ? '<a href="' + d.arquivo_url + '" target="_blank" class="btn btn-sm btn-blue">🔗 Abrir</a>' : '') +
          '<button class="btn btn-sm btn-danger" onclick="excluirDocProjeto(\'' + d.id + '\')" title="Excluir">🗑</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function abrirAddDocProjeto() {
    if (!projetoAtualId) return;
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p) return;
    document.getElementById('add-doc-proj-sub').textContent = p.nome;
    document.getElementById('add-doc-proj-tipo').value = 'laudo';
    document.getElementById('add-doc-proj-titulo').value = '';
    document.getElementById('add-doc-proj-url').value = '';
    document.getElementById('add-doc-proj-obs').value = '';
    abrirModal('ov-add-doc-proj');
  }

  async function salvarDocProjeto() {
    if (!projetoAtualId) return;
    const tipo = document.getElementById('add-doc-proj-tipo').value;
    const titulo = document.getElementById('add-doc-proj-titulo').value.trim();
    const url = document.getElementById('add-doc-proj-url').value.trim();
    const obs = document.getElementById('add-doc-proj-obs').value.trim();
    if (!titulo) { alert('Título é obrigatório.'); return; }
    if (!url) { alert('URL do arquivo é obrigatória.'); return; }

    const sess = getSessao();
    const criadoPor = (sess && sess.nome) ? sess.nome : (sess && sess.email ? sess.email : 'admin');
    const proj = projetos.find(function(pp){ return pp.id === projetoAtualId; });

    const btn = document.getElementById('btn-add-doc-proj');
    btn.disabled = true; btn.textContent = '⏳ Salvando...';

    try {
      const r = await api('documentos', 'POST', {
        projeto_id: projetoAtualId,
        cliente_id: proj.cliente_id,
        propriedade_id: proj.propriedade_id,
        tipo: tipo,
        titulo: titulo,
        observacao: obs || null,
        arquivo_url: url,
        ativo: true
      }, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));

      await api('projeto_historico', 'POST', {
        projeto_id: projetoAtualId,
        acao: 'doc_anexado',
        para_valor: tipo,
        observacao: titulo,
        criado_por: criadoPor
      }, 'return=minimal');

      fecharModal('ov-add-doc-proj');
      await carregarDocsProjeto(projetoAtualId);
      await carregarHistoricoProjeto(projetoAtualId);
    } catch(e) {
      alert('Erro: ' + (e.message || e));
    } finally {
      btn.disabled = false; btn.textContent = '💾 Salvar';
    }
  }

  async function excluirDocProjeto(docId) {
    if (!(await zConfirm('Excluir este documento?\n\nEsta ação não pode ser desfeita.', { tipo:'erro', btnOk:'Excluir' }))) return;
    try {
      await api('documentos?id=eq.' + docId, 'DELETE', null, 'return=minimal');
      if (projetoAtualId) await carregarDocsProjeto(projetoAtualId);
    } catch(e) {
      alert('Erro: ' + (e.message || e));
    }
  }


  // ============================================================
  // LINK DE UPLOAD DO CLIENTE
  // ============================================================
  function copiarLinkUploadCliente() {
    if (!projetoAtualId) return;
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p || !p.upload_token) { alert('Token de upload não encontrado.'); return; }
    const link = getClienteUrl() + '?upload=' + p.upload_token;

    // Tenta clipboard API primeiro
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(function() {
        alert('🔗 Link copiado!\n\n' + link + '\n\nEnvie ao cliente para ele anexar documentos.');
      }, function() {
        prompt('Copie o link abaixo:', link);
      });
    } else {
      prompt('Copie o link abaixo:', link);
    }
  }

  function enviarLinkUploadWhatsApp() {
    if (!projetoAtualId) return;
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p) return;
    const cli = todosClientesUnificado(p.cliente_id) || {};
    const tel = (cli.telefone1 || '').replace(/\D/g,'');
    if (!tel) { toastError('Cliente sem telefone cadastrado.'); return; }

    // SEMANA 4.18: oferece duas opções: link curto OU checklist completo
    if (typeof enviarChecklistCliente === 'function') {
      // Reusa a função melhorada com checklist
      return enviarChecklistCliente();
    }

    // Fallback: link curto (versão antiga)
    const link = getClienteUrl() + '?upload=' + p.upload_token;
    const cleanTel = tel.length === 11 || tel.length === 10 ? '55' + tel : tel;
    const txt = 'Olá ' + (cli.nome ? cli.nome.split(' ')[0] : '') + '! Para o seu projeto de outorga "' + p.nome + '", anexe os documentos solicitados aqui (sem login): ' + link;
    window.open('https://wa.me/' + cleanTel + '?text=' + encodeURIComponent(txt), '_blank');
  }


  // ============================================================
  // HISTÓRICO DO PROJETO (audit log)
  // ============================================================
  async function carregarHistoricoProjeto(pid) {
    try {
      historicoProjAtual = await api('projeto_historico?projeto_id=eq.' + pid + '&order=data.desc') || [];
    } catch(e) { historicoProjAtual = []; }
    renderHistoricoProjeto();
  }

  function renderHistoricoProjeto() {
    const cont = document.getElementById('ver-proj-hist-lista');
    if (!cont) return;
    document.getElementById('ver-proj-cnt-hist').textContent = '(' + historicoProjAtual.length + ')';
    if (!historicoProjAtual.length) {
      cont.innerHTML = '<div class="hist-empty">Sem histórico ainda.</div>';
      return;
    }
    const acaoMap = {
      projeto_criado: { ic:'🚀', t:'Projeto criado', cor:'var(--blue)' },
      etapa_alterada: { ic:'➡', t:'Etapa avançada', cor:'var(--green)' },
      status_alterado: { ic:'🔁', t:'Status alterado', cor:'#E65100' },
      doc_anexado: { ic:'📎', t:'Documento anexado', cor:'var(--blue)' },
      pagamento_registrado: { ic:'💰', t:'Pagamento registrado', cor:'var(--green)' },
      observacao_adicionada: { ic:'✏️', t:'Observação', cor:'var(--text-muted)' },
      projeto_concluido: { ic:'✅', t:'Projeto concluído', cor:'var(--green)' },
      projeto_cancelado: { ic:'🚫', t:'Projeto cancelado', cor:'#C62828' },
      upload_cliente: { ic:'⬆', t:'Upload do cliente', cor:'#1565C0' }
    };

    cont.innerHTML = historicoProjAtual.map(function(h) {
      const a = acaoMap[h.acao] || { ic:'•', t:h.acao, cor:'var(--text-muted)' };
      const dt = fmtDataHora(h.data);
      let detalhe = '';
      if (h.de_valor && h.para_valor) {
        if (h.acao === 'etapa_alterada') {
          detalhe = ETAPAS_PROJETO[parseInt(h.de_valor,10)-1].nome + ' → ' + ETAPAS_PROJETO[parseInt(h.para_valor,10)-1].nome;
        } else {
          detalhe = h.de_valor + ' → ' + h.para_valor;
        }
      } else if (h.para_valor) {
        detalhe = h.para_valor;
      }
      return '<div class="hist-item">' +
        '<div class="hist-icon" style="color:' + a.cor + ';background:rgba(0,0,0,0.05);">' + a.ic + '</div>' +
        '<div class="hist-body">' +
          '<div class="hist-title-row">' +
            '<span class="hist-tipo">' + a.t + '</span>' +
            '<span class="hist-data">' + dt + '</span>' +
          '</div>' +
          (detalhe ? '<div class="hist-desc">' + detalhe + '</div>' : '') +
          (h.observacao ? '<div class="hist-prox">' + h.observacao.replace(/</g,'&lt;') + '</div>' : '') +
          (h.criado_por ? '<div class="hist-meta">por ' + h.criado_por + '</div>' : '') +
        '</div>' +
      '</div>';
    }).join('');
  }


  // ============================================================
  // FASE 3A: Voltar etapa, Templates de docs, Atrasados, Comprovante
  // ============================================================
  let templatesDoc = [];               // cache de documento_template
  let templateAtualId = null;          // ID do template sendo editado
  const LIMITE_ATRASADO_DIAS = 30;

  // -------- helpers --------
  function getCriadoPor() {
    const sess = getSessao();
    return (sess && sess.nome) ? sess.nome : (sess && sess.email ? sess.email : 'admin');
  }


  // ============================================================
  // VOLTAR ETAPA
  // ============================================================
  // ============================================================
  // FASE 3B Item 2: Iniciar Renovação cria projeto na ETAPA 2
  // ============================================================
  async function abrirIniciarRenovacao(propId) {
    const p = propriedades.find(function(x){ return x.id === propId; });
    if (!p) { alert('Propriedade não encontrada.'); return; }
    const c = clientes.find(function(cc){ return cc.id === p.cliente_id; });
    if (!c) { alert('Cliente não encontrado.'); return; }

    // Verifica se já existe projeto em andamento para essa propriedade
    const projAtivo = (typeof projetos !== 'undefined' ? projetos : []).find(function(pp){
      return pp.propriedade_id === propId && pp.status === 'em_andamento';
    });
    if (projAtivo) {
      if (await zConfirm('Esta propriedade já tem um projeto em andamento ("' + projAtivo.nome + '"). Abrir esse projeto?', { tipo:'info', btnOk:'Abrir projeto' })) {
        verProjeto(projAtivo.id);
      }
      return;
    }

    // Confirma criação
    if (!(await zConfirm('Iniciar renovação para "' + c.nome + ' — ' + p.nome + '"?\n\n' +
                 '• Será criado um novo projeto na etapa 2 (Protocolo DAEE)\n' +
                 '• Vistoria será marcada como já concluída (renovação não precisa de nova vistoria)\n' +
                 '• Cliente continua ativo até a publicação da nova outorga\n\n' +
                 'Continuar?', { tipo:'info', btnOk:'Iniciar renovação' }))) {
      return;
    }

    try {
      // Pega dados do uso âncora pra herdar requerimento/responsável
      const ussDaProp = usos.filter(function(u){ return u.propriedade_id === propId; });
      const usoAnc = ussDaProp[0] || {};
      const hoje = getDataHojeBR();

      const nomeProj = 'RENOVAÇÃO ' + (p.nome || '').toUpperCase();
      const payload = {
        cliente_id: c.id,
        propriedade_id: propId,
        nome: nomeProj,
        requerimento: usoAnc.requerimento || null,
        responsavel: null,
        observacoes: 'Projeto de RENOVAÇÃO de outorga vencendo. Vistoria pulada (já há outorga vigente).',
        etapa_atual: 2,            // pula direto pra Protocolo DAEE
        data_inicio: hoje,
        data_vistoria: hoje,       // marca vistoria como concluída hoje
        status: 'em_andamento',
        valor_pago: 0,
        status_pgto: 'aberto'
      };
      const r = await api('projetos', 'POST', payload, 'return=representation');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));
      const data = await r.json();
      const novoProj = data && data[0];
      if (!novoProj) throw new Error('Resposta sem dados');

      // Marca renovação_em_andamento nos usos (compatibilidade com lógica antiga de cor azul)
      try {
        await api('usos?propriedade_id=eq.' + propId, 'PATCH', { renovacao_em_andamento: true }, 'return=minimal');
      } catch(e) { /* ignora */ }

      // Histórico do projeto
      await api('projeto_historico', 'POST', {
        projeto_id: novoProj.id,
        acao: 'projeto_criado',
        para_valor: '2',
        observacao: 'Renovação iniciada a partir da aba Renovações. Vistoria marcada como já concluída.',
        criado_por: getCriadoPor()
      }, 'return=minimal');

      await carregarDados();
      // Vai pra Em Projeto e abre o projeto criado
      navTo('em-projeto', document.querySelector('.nav-item[data-page="em-projeto"]'));
      setTimeout(function(){ verProjeto(novoProj.id); }, 200);
    } catch(e) {
      console.error('Erro abrirIniciarRenovacao:', e);
      alert('Erro ao iniciar renovação: ' + (e.message || e));
    }
  }


  function abrirVoltarEtapa() {
    if (!projetoAtualId) return;
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p) return;
    if (p.etapa_atual <= 1) {
      alert('O projeto já está na etapa inicial. Não há etapa para onde voltar.');
      return;
    }

    document.getElementById('voltar-etapa-titulo').textContent = '← Voltar etapa do projeto';
    document.getElementById('voltar-etapa-sub').textContent = 'Etapa atual: ' + ETAPAS_PROJETO[p.etapa_atual - 1].nome;

    // Popula select com etapas anteriores
    const sel = document.getElementById('voltar-etapa-destino');
    sel.innerHTML = '';
    for (let i = 1; i < p.etapa_atual; i++) {
      const o = document.createElement('option');
      o.value = String(i);
      o.textContent = 'Etapa ' + i + ': ' + ETAPAS_PROJETO[i - 1].nome;
      sel.appendChild(o);
    }
    // Default: etapa imediatamente anterior
    sel.value = String(p.etapa_atual - 1);

    document.getElementById('voltar-etapa-motivo').value = '';
    abrirModal('ov-voltar-etapa');
  }

  async function confirmarVoltarEtapa() {
    if (!projetoAtualId) return;
    const p = projetos.find(function(pp){ return pp.id === projetoAtualId; });
    if (!p) return;

    const destino = parseInt(document.getElementById('voltar-etapa-destino').value, 10);
    const motivo = document.getElementById('voltar-etapa-motivo').value.trim();

    if (!destino || destino < 1 || destino >= p.etapa_atual) {
      alert('Etapa de destino inválida.');
      return;
    }
    if (!motivo) {
      alert('Motivo é obrigatório para voltar etapa (registrado no histórico).');
      return;
    }

    const btn = document.getElementById('btn-confirmar-voltar');
    btn.disabled = true; btn.textContent = '⏳ Voltando...';

    try {
      // Monta payload: etapa nova + zera datas das etapas que vão "deixar de existir"
      const payload = {
        etapa_atual: destino,
        atualizado_em: new Date().toISOString()
      };
      // Zera datas das etapas >= destino (etapa "destino" ainda não foi concluída, então sua data fica null;
      // se destino=2, zera data_protocolo, data_analise, data_publicacao; mantém data_vistoria)
      for (let i = destino; i <= 4; i++) {
        payload[ETAPAS_PROJETO[i - 1].col] = null;
      }
      // Se voltou de "concluído" (improvável aqui mas seguro), reativa
      if (p.status === 'concluido') payload.status = 'em_andamento';

      const r = await api('projetos?id=eq.' + projetoAtualId, 'PATCH', payload, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));

      // Histórico
      await api('projeto_historico', 'POST', {
        projeto_id: projetoAtualId,
        acao: 'etapa_revertida',
        de_valor: String(p.etapa_atual),
        para_valor: String(destino),
        observacao: motivo,
        criado_por: getCriadoPor()
      }, 'return=minimal');

      fecharModal('ov-voltar-etapa');
      await carregarDados();
      verProjeto(projetoAtualId);
    } catch(e) {
      console.error('Erro confirmarVoltarEtapa:', e);
      alert('Erro ao voltar etapa: ' + (e.message || e));
    } finally {
      btn.disabled = false; btn.textContent = '← Confirmar';
    }
  }


  // ============================================================
  // DRAG-AND-DROP NO KANBAN
  // ============================================================
  let _dragProjetoId = null;
  let _dragFromEtapa = null;
  let _kanbanColsListenersOk = false;  // FASE 8: previne re-adicionar listeners nas colunas

  function setupDragKanban() {
    // SEMANA 4.19 FIX: scoped pra #page-em-projeto (antes pegava cards de outras páginas também)
    document.querySelectorAll('#page-em-projeto .projeto-card').forEach(function(card) {
      card.setAttribute('draggable', 'true');
      card.ondragstart = onDragStart;
      card.ondragend = onDragEnd;
    });

    document.querySelectorAll('#page-em-projeto .kanban-col-body').forEach(function(col) {
      col.ondragover = onDragOver;
      col.ondragleave = onDragLeave;
      col.ondrop = onDropCard;
    });
  }

  function onDragStart(e) {
    const pid = this.getAttribute('data-projeto-id');
    if (!pid) return;
    const p = projetos.find(function(pp){ return pp.id === pid; });
    if (!p || p.status !== 'em_andamento') {
      e.preventDefault();
      return;
    }
    _dragProjetoId = pid;
    _dragFromEtapa = p.etapa_atual;
    this.classList.add('dragging');
    try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', pid); } catch(_) {}
  }

  function onDragEnd() {
    this.classList.remove('dragging');
    document.querySelectorAll('.kanban-col').forEach(function(c){ c.classList.remove('drag-over'); });
  }

  function onDragOver(e) {
    e.preventDefault();
    try { e.dataTransfer.dropEffect = 'move'; } catch(_) {}
    const col = this.closest('.kanban-col');
    if (col) col.classList.add('drag-over');
  }

  function onDragLeave(e) {
    const col = this.closest('.kanban-col');
    if (col) col.classList.remove('drag-over');
  }

  async function onDropCard(e) {
    e.preventDefault();
    const col = this.closest('.kanban-col');
    if (col) col.classList.remove('drag-over');

    const pid = _dragProjetoId;
    _dragProjetoId = null;
    if (!pid) return;

    const etapaDestino = parseInt(col.getAttribute('data-etapa'), 10);
    if (!etapaDestino || etapaDestino === _dragFromEtapa) return;

    // SEMANA 4.19: SÓ permite arrastar entre etapas ADJACENTES (+1 ou -1)
    const diff = etapaDestino - _dragFromEtapa;
    if (Math.abs(diff) > 1) {
      toastWarn('⚠ Só pode arrastar pra uma etapa por vez.\n\nDe ' + ETAPAS_PROJETO[_dragFromEtapa-1].nome + ' você pode ir só pra ' +
        (_dragFromEtapa > 1 ? ETAPAS_PROJETO[_dragFromEtapa-2].nome + ' ou ' : '') +
        (_dragFromEtapa < 4 ? ETAPAS_PROJETO[_dragFromEtapa].nome : '') + '.', 6000);
      renderKanban();
      setTimeout(setupDragKanban, 100);
      return;
    }

    const p = projetos.find(function(pp){ return pp.id === pid; });
    if (!p) return;

    // Valida checkboxes da etapa 1 antes de avançar via drag
    if (etapaDestino > _dragFromEtapa) {
      const check = verificarChecksEtapa(p, etapaDestino);
      if (!check.ok) {
        alert(check.motivo);
        renderKanban();
        setTimeout(setupDragKanban, 100);
        return;
      }
    }

    // Abre modal apropriado: avançar ou voltar
    projetoAtualId = pid;
    if (etapaDestino > _dragFromEtapa) {
      // Avançar 1 etapa só
      await avancarParaEtapa(pid, etapaDestino);
    } else {
      // Voltar — força usar modal pra exigir motivo
      verProjeto(pid);
      setTimeout(function() {
        abrirVoltarEtapa();
        const sel = document.getElementById('voltar-etapa-destino');
        if (sel) sel.value = String(etapaDestino);
      }, 300);
    }
  }

  async function avancarParaEtapa(pid, etapaDestino) {
    const p = projetos.find(function(pp){ return pp.id === pid; });
    if (!p) return;
    const hoje = getDataHojeBR();

    try {
      // Marca todas as etapas intermediárias (da atual até destino-1) com hoje
      const payload = { etapa_atual: etapaDestino, atualizado_em: new Date().toISOString() };
      for (let i = p.etapa_atual; i < etapaDestino; i++) {
        payload[ETAPAS_PROJETO[i - 1].col] = hoje;
      }
      const r = await api('projetos?id=eq.' + pid, 'PATCH', payload, 'return=minimal');
      if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));

      // Histórico
      await api('projeto_historico', 'POST', {
        projeto_id: pid,
        acao: 'etapa_alterada',
        de_valor: String(p.etapa_atual),
        para_valor: String(etapaDestino),
        observacao: 'Avanço via drag-and-drop',
        criado_por: getCriadoPor()
      }, 'return=minimal');

      await carregarDados();
    } catch(e) {
      console.error('Erro avancarParaEtapa:', e);
      alert('Erro: ' + (e.message || e));
      renderKanban();
      setTimeout(setupDragKanban, 100);
    }
  }


  // ============================================================
  // PROJETOS ATRASADOS (>30 dias na etapa atual)
  // ============================================================
  function calcularProjetosAtrasados() {
    const lista = [];
    const agora = Date.now();
    (typeof projetos !== 'undefined' ? projetos : []).forEach(function(p) {
      if (p.status !== 'em_andamento') return;
      // Data de referência: data da etapa anterior, ou data_inicio se etapa 1
      let dataRef = null;
      if (p.etapa_atual === 1) {
        dataRef = p.data_inicio || p.criado_em;
      } else {
        const colAnterior = ETAPAS_PROJETO[p.etapa_atual - 2].col;
        dataRef = p[colAnterior] || p.atualizado_em || p.criado_em;
      }
      if (!dataRef) return;
      const d = new Date(dataRef.length > 10 ? dataRef : dataRef + 'T12:00:00');
      if (isNaN(d.getTime())) return;
      const dias = Math.floor((agora - d.getTime()) / (1000*60*60*24));
      if (dias > LIMITE_ATRASADO_DIAS) {
        lista.push({ projeto: p, dias: dias });
      }
    });
    return lista;
  }

  function renderCardAtrasadosDashboard() {
    const card = document.getElementById('card-projetos-atrasados');
    const valEl = document.getElementById('m-proj-atrasados');
    if (!card || !valEl) return;
    const atrasados = calcularProjetosAtrasados();
    if (atrasados.length === 0) {
      card.style.display = 'none';
    } else {
      card.style.display = '';
      valEl.textContent = atrasados.length;
    }
  }

  function renderBannerAtrasados() {
    const banner = document.getElementById('banner-atrasados');
    if (!banner) return;
    const atrasados = calcularProjetosAtrasados();
    if (atrasados.length === 0) {
      banner.style.display = 'none';
      return;
    }
    banner.style.display = '';
    // Ordena por dias desc (mais antigos primeiro)
    atrasados.sort(function(a, b){ return b.dias - a.dias; });

    let html = '<div class="banner-atrasados">';
    html += '<div class="banner-atrasados-titulo">⚠ ' + atrasados.length + ' projeto(s) parado(s) há mais de ' + LIMITE_ATRASADO_DIAS + ' dias</div>';
    html += '<div class="banner-atrasados-lista">';
    atrasados.slice(0, 10).forEach(function(it) {
      const p = it.projeto;
      const cli = todosClientesUnificado(p.cliente_id) || {};
      const prop = (typeof propriedades !== 'undefined' ? propriedades : []).find(function(pp){ return pp.id === p.propriedade_id; }) || {};
      html += '<div class="banner-atrasados-item" onclick="verProjeto(\'' + p.id + '\')">';
      html += '• <strong>' + (cli.nome || '(?)') + '</strong> — ' + (prop.nome || '(?)') + ' — ' + ETAPAS_PROJETO[p.etapa_atual - 1].nome + ' (' + it.dias + ' dias parado)';
      html += '</div>';
    });
    if (atrasados.length > 10) {
      html += '<div style="font-size:11px;color:#E65100;margin-top:6px;font-style:italic;">+ ' + (atrasados.length - 10) + ' projeto(s) atrasado(s) (filtra a lista pra ver tudo)</div>';
    }
    html += '</div></div>';
    banner.innerHTML = html;
  }


  // ============================================================
  // ONDA 3 BUG#15: REVISAR pendentes — visibilidade e ação
  // ============================================================
  // Lista propriedades cujo nome começa com "REVISAR" (placeholders da importação)
  function listarPropsRevisar() {
    return (typeof propriedades !== 'undefined' ? propriedades : [])
      .filter(function(p){ return p.nome && p.nome.indexOf('REVISAR') === 0; });
  }

  // Atualiza o card "Propriedades a revisar" no dashboard
  function renderCardRevisarDashboard() {
    const card = document.getElementById('card-revisar-pendentes');
    const valEl = document.getElementById('m-revisar-qtd');
    if (!card || !valEl) return;
    const lista = listarPropsRevisar();
    if (lista.length === 0) {
      card.style.display = 'none';
    } else {
      card.style.display = '';
      valEl.textContent = lista.length;
    }
  }

  // Abre uma listagem leve em modal com todas as REVISAR pendentes
  // Hunter só vê as de leads dele; admin vê todas
  function abrirListaRevisar() {
    const sess = getSessao();
    const papel = (sess && sess.papel) || 'admin';
    const meuId = sess && sess.id;

    let lista = listarPropsRevisar();
    // Filtra por papel: hunter só vê das suas
    if (papel === 'hunter') {
      const idsMeusLeads = new Set((leads || []).filter(function(l){ return l.hunter_id === meuId; }).map(function(l){ return l.id; }));
      lista = lista.filter(function(p){ return idsMeusLeads.has(p.cliente_id); });
    }

    if (lista.length === 0) {
      zAlert('Não há propriedades pendentes de revisão.', 'info');
      return;
    }

    // Resolve dados auxiliares pra mostrar contexto
    const itens = lista.map(function(p){
      const dono = (typeof leads !== 'undefined' ? leads : []).find(function(c){ return c.id === p.cliente_id; })
                || (typeof clientes !== 'undefined' ? clientes : []).find(function(c){ return c.id === p.cliente_id; })
                || (typeof clientesEmProjeto !== 'undefined' ? clientesEmProjeto : []).find(function(c){ return c.id === p.cliente_id; });
      const qtdPontos = (typeof usos !== 'undefined' ? usos : []).filter(function(u){ return u.propriedade_id === p.id; }).length;
      return {
        prop: p,
        donoNome: dono ? dono.nome : '(cliente não encontrado)',
        donoId: p.cliente_id,
        donoStatusFunil: dono ? (dono.status_funil || 'cliente_ativo') : null,
        qtdPontos: qtdPontos
      };
    });

    // Ordena por data de criação asc (mais antigos primeiro)
    itens.sort(function(a, b){
      const da = new Date(a.prop.criado_em || 0).getTime();
      const db = new Date(b.prop.criado_em || 0).getTime();
      return da - db;
    });

    // Remove modal anterior se houver
    const exist = document.getElementById('ov-lista-revisar');
    if (exist) exist.remove();

    let linhas = '';
    itens.forEach(function(it){
      const stLabel = ({ prospeccao:'lead', em_projeto:'em projeto', cliente_ativo:'cliente ativo' })[it.donoStatusFunil] || (it.donoStatusFunil || 'desconhecido');
      const stCor = ({ prospeccao:'#F59E0B', em_projeto:'#3B82F6', cliente_ativo:'#10B981' })[it.donoStatusFunil] || '#94A3B8';
      const dataCriado = it.prop.criado_em ? new Date(it.prop.criado_em).toLocaleDateString('pt-BR') : '—';
      linhas +=
        '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:white;border:1px solid #E2E8F0;border-radius:8px;margin-bottom:6px;">' +
          '<div style="flex:1;min-width:0;">' +
            '<div style="font-weight:600;font-size:13px;color:#0F172A;">' + escapeHtml(it.prop.nome) + '</div>' +
            '<div style="font-size:11px;color:#64748B;margin-top:2px;">' +
              '👤 ' + escapeHtml(it.donoNome) + ' · ' +
              '<span style="color:' + stCor + ';font-weight:600;">' + stLabel + '</span> · ' +
              it.qtdPontos + ' ponto(s) · ' +
              'desde ' + dataCriado +
            '</div>' +
          '</div>' +
          '<button data-prop-id="' + escapeHtml(it.prop.id) + '" data-cli-id="' + escapeHtml(it.donoId) + '" ' +
            'class="btn btn-sm btn-blue revisar-abrir-btn" style="flex-shrink:0;">Abrir</button>' +
        '</div>';
    });

    const mod = document.createElement('div');
    mod.id = 'ov-lista-revisar';
    mod.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10000;padding:20px;';
    mod.innerHTML =
      '<div style="background:white;border-radius:14px;max-width:680px;width:100%;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 24px 48px rgba(0,0,0,0.2);">' +
        '<div style="padding:16px 20px;border-bottom:1px solid #E2E8F0;display:flex;justify-content:space-between;align-items:center;">' +
          '<div>' +
            '<div style="font-size:16px;font-weight:700;color:#0F172A;">⚠️ Propriedades a revisar (' + itens.length + ')</div>' +
            '<div style="font-size:12px;color:#64748B;margin-top:2px;">Placeholders criados na reimportação — renomeie e ajuste os pontos</div>' +
          '</div>' +
          '<button id="btn-revisar-fechar" style="background:white;border:1px solid #CBD5E1;border-radius:6px;padding:6px 12px;font-size:12px;cursor:pointer;">✕</button>' +
        '</div>' +
        '<div style="padding:14px 20px;overflow-y:auto;flex:1;">' + linhas + '</div>' +
      '</div>';
    document.body.appendChild(mod);

    // Handlers
    document.getElementById('btn-revisar-fechar').addEventListener('click', function(){ mod.remove(); });
    mod.addEventListener('click', function(e){ if (e.target === mod) mod.remove(); });

    const btnsAbrir = mod.querySelectorAll('.revisar-abrir-btn');
    btnsAbrir.forEach(function(b){
      b.addEventListener('click', function(){
        const cliId = b.getAttribute('data-cli-id');
        mod.remove();
        // Abre o lead/cliente correspondente
        const ehLead = (leads || []).some(function(l){ return l.id === cliId; });
        if (ehLead) {
          if (typeof verLead === 'function') verLead(cliId);
        } else {
          if (typeof verCliente === 'function') verCliente(cliId);
        }
      });
    });

    // ESC fecha
    const escHandler = function(e){
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', escHandler);
        const m = document.getElementById('ov-lista-revisar');
        if (m) m.remove();
      }
    };
    document.addEventListener('keydown', escHandler);
  }
  window.abrirListaRevisar = abrirListaRevisar;


  // ============================================================
  // TEMPLATES DE DOCUMENTOS (configuração)
  // ============================================================
  async function carregarTemplatesDoc() {
    try {
      templatesDoc = await api('documento_template?order=etapa.asc,ordem.asc&select=*') || [];
    } catch(e) {
      templatesDoc = [];
    }
    renderTemplatesDoc();
  }

  function renderTemplatesDoc() {
    const cont = document.getElementById('templates-por-etapa');
    if (!cont) return;
    let html = '';
    for (let etapa = 1; etapa <= 4; etapa++) {
      const da_etapa = templatesDoc.filter(function(t){ return t.etapa === etapa; });
      html += '<div class="template-etapa-bloco">';
      html += '<div class="template-etapa-titulo">';
      html += '<span>' + ETAPAS_PROJETO[etapa - 1].icone + ' Etapa ' + etapa + ': ' + ETAPAS_PROJETO[etapa - 1].nome + ' (' + da_etapa.length + ')</span>';
      html += '<button class="btn btn-sm btn-blue" onclick="abrirAddTemplate(' + etapa + ')">+ Adicionar</button>';
      html += '</div>';

      if (!da_etapa.length) {
        html += '<div style="text-align:center;padding:14px;color:var(--text-hint);font-size:11.5px;font-style:italic;">Nenhum documento configurado para esta etapa.</div>';
      } else {
        da_etapa.forEach(function(t, idx) {
          const cls = t.ativo ? '' : ' inativo';
          html += '<div class="template-doc-row' + cls + '">';
          html += '<div class="template-doc-info">';
          html += '<div class="template-doc-titulo-row">';
          html += '<span class="template-doc-titulo-txt">' + escapeHtml(t.titulo) + '</span>';
          html += t.obrigatorio
            ? '<span class="template-doc-obrig-tag">OBRIGATÓRIO</span>'
            : '<span class="template-doc-opc-tag">OPCIONAL</span>';
          if (!t.ativo) html += '<span class="template-doc-opc-tag">INATIVO</span>';
          html += '</div>';
          if (t.descricao) html += '<div class="template-doc-desc">' + escapeHtml(t.descricao) + '</div>';
          html += '</div>';
          html += '<div class="template-doc-acoes">';
          if (idx > 0) html += '<button onclick="subirOrdemTemplate(\'' + t.id + '\')" title="Mover pra cima">↑</button>';
          if (idx < da_etapa.length - 1) html += '<button onclick="descerOrdemTemplate(\'' + t.id + '\')" title="Mover pra baixo">↓</button>';
          html += '<button onclick="abrirEditarTemplate(\'' + t.id + '\')" title="Editar">✏</button>';
          html += '</div>';
          html += '</div>';
        });
      }
      html += '</div>';
    }
    cont.innerHTML = html;
  }

  function abrirAddTemplate(etapa) {
    templateAtualId = null;
    document.getElementById('template-doc-titulo').textContent = '+ Adicionar documento';
    document.getElementById('template-doc-sub').textContent = ETAPAS_PROJETO[etapa - 1].icone + ' Etapa ' + etapa + ': ' + ETAPAS_PROJETO[etapa - 1].nome;
    document.getElementById('template-doc-id').value = '';
    document.getElementById('template-doc-etapa').value = String(etapa);
    document.getElementById('template-doc-titulo-input').value = '';
    document.getElementById('template-doc-descricao').value = '';
    document.getElementById('template-doc-obrig').checked = true;
    document.getElementById('btn-template-excluir').style.display = 'none';
    abrirModal('ov-template-doc');
  }

  function abrirEditarTemplate(tid) {
    const t = templatesDoc.find(function(x){ return x.id === tid; });
    if (!t) return;
    templateAtualId = tid;
    document.getElementById('template-doc-titulo').textContent = '✏ Editar documento';
    document.getElementById('template-doc-sub').textContent = ETAPAS_PROJETO[t.etapa - 1].icone + ' Etapa ' + t.etapa + ': ' + ETAPAS_PROJETO[t.etapa - 1].nome;
    document.getElementById('template-doc-id').value = tid;
    document.getElementById('template-doc-etapa').value = String(t.etapa);
    document.getElementById('template-doc-titulo-input').value = t.titulo || '';
    document.getElementById('template-doc-descricao').value = t.descricao || '';
    document.getElementById('template-doc-obrig').checked = !!t.obrigatorio;
    document.getElementById('btn-template-excluir').style.display = '';
    abrirModal('ov-template-doc');
  }

  async function salvarTemplate() {
    const id = document.getElementById('template-doc-id').value || null;
    const etapa = parseInt(document.getElementById('template-doc-etapa').value, 10);
    const titulo = document.getElementById('template-doc-titulo-input').value.trim();
    const descricao = document.getElementById('template-doc-descricao').value.trim();
    const obrig = document.getElementById('template-doc-obrig').checked;

    if (!titulo) { alert('Título é obrigatório.'); return; }
    if (!etapa || etapa < 1 || etapa > 4) { alert('Etapa inválida.'); return; }

    const btn = document.getElementById('btn-template-salvar');
    btn.disabled = true; btn.textContent = '⏳ Salvando...';

    try {
      if (id) {
        // Update
        await api('documento_template?id=eq.' + id, 'PATCH', {
          titulo: upper(titulo),
          descricao: descricao || null,
          obrigatorio: obrig
        }, 'return=minimal');
      } else {
        // Insert — calcula próxima ordem
        const da_etapa = templatesDoc.filter(function(t){ return t.etapa === etapa; });
        const ordem = da_etapa.length ? Math.max.apply(null, da_etapa.map(function(t){ return t.ordem || 0; })) + 1 : 0;
        await api('documento_template', 'POST', {
          etapa: etapa,
          ordem: ordem,
          titulo: upper(titulo),
          descricao: descricao || null,
          obrigatorio: obrig,
          ativo: true
        }, 'return=minimal');
      }
      fecharModal('ov-template-doc');
      await carregarTemplatesDoc();
    } catch(e) {
      console.error('Erro salvarTemplate:', e);
      alert('Erro ao salvar: ' + (e.message || e));
    } finally {
      btn.disabled = false; btn.textContent = '💾 Salvar';
    }
  }

  async function excluirTemplateAtual() {
    if (!templateAtualId) return;
    if (!confirm('Excluir este documento do template?\n\nDocumentos já enviados pelos clientes vinculados a este template NÃO serão excluídos (apenas perdem o vínculo).')) return;
    try {
      await api('documento_template?id=eq.' + templateAtualId, 'DELETE', null, 'return=minimal');
      fecharModal('ov-template-doc');
      templateAtualId = null;
      await carregarTemplatesDoc();
    } catch(e) {
      console.error('Erro excluirTemplate:', e);
      alert('Erro ao excluir: ' + (e.message || e));
    }
  }

  async function subirOrdemTemplate(tid) {
    const t = templatesDoc.find(function(x){ return x.id === tid; });
    if (!t) return;
    const irmaos = templatesDoc.filter(function(x){ return x.etapa === t.etapa; }).sort(function(a,b){ return (a.ordem||0)-(b.ordem||0); });
    const idx = irmaos.findIndex(function(x){ return x.id === tid; });
    if (idx <= 0) return;
    const acima = irmaos[idx - 1];
    try {
      // Swap ordem
      await api('documento_template?id=eq.' + t.id, 'PATCH', { ordem: acima.ordem }, 'return=minimal');
      await api('documento_template?id=eq.' + acima.id, 'PATCH', { ordem: t.ordem }, 'return=minimal');
      await carregarTemplatesDoc();
    } catch(e) {
      alert('Erro: ' + (e.message || e));
    }
  }

  async function descerOrdemTemplate(tid) {
    const t = templatesDoc.find(function(x){ return x.id === tid; });
    if (!t) return;
    const irmaos = templatesDoc.filter(function(x){ return x.etapa === t.etapa; }).sort(function(a,b){ return (a.ordem||0)-(b.ordem||0); });
    const idx = irmaos.findIndex(function(x){ return x.id === tid; });
    if (idx < 0 || idx >= irmaos.length - 1) return;
    const abaixo = irmaos[idx + 1];
    try {
      await api('documento_template?id=eq.' + t.id, 'PATCH', { ordem: abaixo.ordem }, 'return=minimal');
      await api('documento_template?id=eq.' + abaixo.id, 'PATCH', { ordem: t.ordem }, 'return=minimal');
      await carregarTemplatesDoc();
    } catch(e) {
      alert('Erro: ' + (e.message || e));
    }
  }

  // Util: escape HTML (não confiar em valores de tabela)
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // SEMANA 4.12: Sistema de TOAST — substitui alert() não-críticos
  // Tipos: 'success' (verde), 'error' (vermelho), 'warn' (amarelo), 'info' (azul)
  // duracao: ms (default 3500)
  // acao: { label, fn } — opcional, mostra botão "Desfazer" ou "Ver detalhes"
  function showToast(mensagem, tipo, duracao, acao) {
    tipo = tipo || 'info';
    duracao = duracao || 3500;

    // Container fixo (cria se não existir)
    let cont = document.getElementById('z-toast-cont');
    if (!cont) {
      cont = document.createElement('div');
      cont.id = 'z-toast-cont';
      cont.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000;display:flex;flex-direction:column;gap:8px;pointer-events:none;max-width:380px;';
      document.body.appendChild(cont);
    }

    const cores = {
      success: { bg: '#E8F5E9', border: '#2E7D32', icon: '✅' },
      error:   { bg: '#FFEBEE', border: '#C62828', icon: '❌' },
      warn:    { bg: '#FFF8E1', border: '#F57C00', icon: '⚠️' },
      info:    { bg: '#E3F2FD', border: '#1565C0', icon: 'ℹ️' }
    };
    const cor = cores[tipo] || cores.info;

    const toast = document.createElement('div');
    toast.style.cssText = 'background:white;border-left:5px solid ' + cor.border + ';border-radius:8px;padding:12px 14px;box-shadow:0 4px 16px rgba(0,0,0,0.12);display:flex;gap:10px;align-items:flex-start;pointer-events:auto;animation:zToastIn 0.25s ease-out;font-size:13px;line-height:1.4;color:#222;min-width:280px;';

    const iconEl = document.createElement('div');
    iconEl.textContent = cor.icon;
    iconEl.style.cssText = 'font-size:18px;flex-shrink:0;';
    toast.appendChild(iconEl);

    const corpoEl = document.createElement('div');
    corpoEl.style.cssText = 'flex:1;min-width:0;';
    corpoEl.textContent = mensagem;
    toast.appendChild(corpoEl);

    // Botão de ação opcional (ex: Desfazer)
    if (acao && acao.label && typeof acao.fn === 'function') {
      const btn = document.createElement('button');
      btn.textContent = acao.label;
      btn.style.cssText = 'background:' + cor.border + ';color:white;border:none;border-radius:5px;padding:5px 10px;font-size:12px;font-weight:600;cursor:pointer;flex-shrink:0;';
      btn.onclick = function(){
        try { acao.fn(); } catch(e) { console.error('Toast acao:', e); }
        removerToast();
      };
      toast.appendChild(btn);
    }

    // Botão de fechar
    const fechar = document.createElement('button');
    fechar.innerHTML = '×';
    fechar.style.cssText = 'background:transparent;border:none;color:#999;font-size:18px;cursor:pointer;line-height:1;padding:0 4px;flex-shrink:0;';
    fechar.onclick = removerToast;
    toast.appendChild(fechar);

    cont.appendChild(toast);

    let timerId = setTimeout(removerToast, duracao);
    toast.onmouseenter = function(){ clearTimeout(timerId); };
    toast.onmouseleave = function(){ timerId = setTimeout(removerToast, 1500); };

    function removerToast() {
      if (!toast.parentNode) return;
      toast.style.animation = 'zToastOut 0.2s ease-in';
      setTimeout(function(){
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 200);
    }
  }

  // Atalhos por tipo (mais legíveis)
  function toastSuccess(msg, dur) { showToast(msg, 'success', dur); }
  function toastError(msg, dur) { showToast(msg, 'error', dur || 5000); }
  function toastWarn(msg, dur) { showToast(msg, 'warn', dur || 4500); }
  function toastInfo(msg, dur) { showToast(msg, 'info', dur); }
  // Toast com botão de desfazer
  function toastUndo(msg, undoFn, dur) {
    showToast(msg, 'success', dur || 6000, { label: 'Desfazer', fn: undoFn });
  }

  // Injeta animações CSS uma vez
  if (!document.getElementById('z-toast-styles')) {
    const st = document.createElement('style');
    st.id = 'z-toast-styles';
    st.textContent = '@keyframes zToastIn{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes zToastOut{from{transform:translateX(0);opacity:1}to{transform:translateX(110%);opacity:0}}';
    document.head.appendChild(st);
  }

  // FIX BUG #19: data "hoje" em timezone BR (não UTC)
  // toISOString() retorna UTC — depois das 21h BR, mostra dia seguinte
  // Esta função sempre retorna YYYY-MM-DD do horário local BR.
  function getDataHojeBR() {
    const d = new Date();
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return ano + '-' + mes + '-' + dia;
  }

  // ============================================================
  // SEMANA 4.5: SENHA DO PORTAL DAEE (Em Projeto + Cliente)
  // ============================================================

  // Mostra/esconde a senha (toggle entre password e text)
  function toggleVerSenha(inputId, btnId) {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    if (!input) return;
    if (input.type === 'password') {
      input.type = 'text';
      if (btn) btn.textContent = '🙈';
    } else {
      input.type = 'password';
      if (btn) btn.textContent = '👁️';
    }
  }

  // Copia o conteúdo da senha pro clipboard
  async function copiarSenha(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const txt = input.value;
    if (!txt) { alert('Sem senha pra copiar.'); return; }
    try {
      await navigator.clipboard.writeText(txt);
      // Feedback rápido: muda label do botão por 1s
      const btnIds = ['proj-btn-ver-senha', 'cli-btn-ver-senha'];
      // melhor: feedback no input
      const originalBg = input.style.backgroundColor;
      input.style.backgroundColor = '#C8E6C9';
      setTimeout(function(){ input.style.backgroundColor = originalBg; }, 600);
    } catch(e) {
      // Fallback se navigator.clipboard não funcionar
      input.select();
      try { document.execCommand('copy'); } catch(_){}
      alert('Copiado!');
    }
  }

  // Salva senha do portal a partir do modal de PROJETO (atualiza cliente)
  // ============================================================
  // SEMANA 4.8: SENHAS MÚLTIPLAS (array de objetos {orgao, login, senha})
  // ============================================================

  // Estado local: senhas sendo editadas em cada modal
  // { proj: [{orgao,login,senha}, ...], cli: [...] }
  window._senhasEdicao = window._senhasEdicao || { proj: [], cli: [] };

  // Renderiza a lista de senhas dentro do bloco
  function _renderListaSenhas(prefix) {
    const lista = window._senhasEdicao[prefix] || [];
    const cont = document.getElementById(prefix + '-senhas-lista');
    if (!cont) return;

    if (lista.length === 0) {
      cont.innerHTML = '<div style="font-size:12px;color:#7B1FA2;text-align:center;padding:18px 0;font-style:italic;">Nenhuma senha cadastrada ainda.<br/>Clique em "+ Adicionar senha" pra começar.</div>';
      return;
    }

    let html = '';
    lista.forEach(function(s, idx){
      const idOrgao = prefix + '-senha-orgao-' + idx;
      const idLogin = prefix + '-senha-login-' + idx;
      const idSenha = prefix + '-senha-portal-' + idx;
      const idBtnVer = prefix + '-btn-ver-senha-' + idx;
      const num = lista.length > 1 ? '#' + (idx + 1) + ' · ' : '';

      html += '<div style="background:rgba(255,255,255,0.5);border-radius:6px;padding:10px;margin-bottom:8px;border:1px solid rgba(123,31,162,0.15);">' +
        // Header da entrada (com botão de remover)
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
          '<div style="font-size:10px;font-weight:700;color:#7B1FA2;letter-spacing:0.5px;">' + num + 'CREDENCIAL</div>' +
          '<button class="btn btn-sm" onclick="removerSenha(\'' + prefix + '\',' + idx + ')" title="Remover esta senha" style="background:transparent;color:#D32F2F;border:none;font-size:14px;padding:2px 6px;">🗑️</button>' +
        '</div>' +
        // Órgão
        '<div style="margin-bottom:6px;">' +
          '<label style="font-size:10px;font-weight:600;color:#4A148C;display:block;margin-bottom:2px;">📋 Órgão</label>' +
          '<input type="text" id="' + idOrgao + '" value="' + escapeHtml(s.orgao || '') + '" placeholder="DAEE, IBAMA, CETESB..." onchange="_atualizarSenhaEdicao(\'' + prefix + '\',' + idx + ',\'orgao\',this.value)" style="width:100%;padding:6px 9px;border:1px solid #CE93D8;border-radius:5px;font-size:12px;background:white;"/>' +
        '</div>' +
        // Login
        '<div style="margin-bottom:6px;">' +
          '<label style="font-size:10px;font-weight:600;color:#4A148C;display:block;margin-bottom:2px;">👤 E-mail ou CPF/CNPJ</label>' +
          '<input type="text" id="' + idLogin + '" value="' + escapeHtml(s.login || '') + '" placeholder="login@email.com ou 000.000.000-00" onchange="_atualizarSenhaEdicao(\'' + prefix + '\',' + idx + ',\'login\',this.value)" style="width:100%;padding:6px 9px;border:1px solid #CE93D8;border-radius:5px;font-size:12px;background:white;"/>' +
        '</div>' +
        // Senha
        '<div>' +
          '<label style="font-size:10px;font-weight:600;color:#4A148C;display:block;margin-bottom:2px;">🔑 Senha</label>' +
          '<div style="display:flex;gap:4px;align-items:center;">' +
            '<input type="password" id="' + idSenha + '" value="' + escapeHtml(s.senha || '') + '" placeholder="Senha..." onchange="_atualizarSenhaEdicao(\'' + prefix + '\',' + idx + ',\'senha\',this.value)" style="flex:1;padding:6px 9px;border:1px solid #CE93D8;border-radius:5px;font-size:12px;font-family:monospace;letter-spacing:1px;background:white;"/>' +
            '<button class="btn btn-sm" onclick="toggleVerSenha(\'' + idSenha + '\',\'' + idBtnVer + '\')" id="' + idBtnVer + '" title="Mostrar/ocultar senha" style="background:white;border:1px solid #CE93D8;padding:5px 8px;">👁️</button>' +
            '<button class="btn btn-sm" onclick="copiarSenha(\'' + idSenha + '\')" title="Copiar senha" style="background:white;border:1px solid #CE93D8;padding:5px 8px;">📋</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    });
    cont.innerHTML = html;
  }

  // Atualiza o estado local quando user edita um campo
  function _atualizarSenhaEdicao(prefix, idx, campo, valor) {
    const lista = window._senhasEdicao[prefix];
    if (!lista || !lista[idx]) return;
    lista[idx][campo] = valor;
  }

  // Adiciona nova senha vazia na lista
  function adicionarSenha(prefix) {
    window._senhasEdicao[prefix] = window._senhasEdicao[prefix] || [];
    window._senhasEdicao[prefix].push({ orgao: '', login: '', senha: '' });
    _renderListaSenhas(prefix);
  }

  // Remove senha da lista (com confirmação)
  function removerSenha(prefix, idx) {
    const lista = window._senhasEdicao[prefix];
    if (!lista || !lista[idx]) return;
    const s = lista[idx];
    const temConteudo = (s.orgao || '').trim() || (s.login || '').trim() || (s.senha || '').trim();
    if (temConteudo && !confirm('Remover esta credencial?\n\nÓrgão: ' + (s.orgao || '(vazio)') + '\n\n⚠️ Lembre-se de clicar em "💾 Salvar tudo" pra confirmar a remoção no banco.')) {
      return;
    }
    lista.splice(idx, 1);
    _renderListaSenhas(prefix);
  }

  // Carrega senhas do cliente pro estado local (chamado por verCliente e verProjeto)
  function _carregarSenhasParaEdicao(prefix, cliente) {
    let senhas = [];
    if (cliente && Array.isArray(cliente.senhas) && cliente.senhas.length > 0) {
      // Já está no novo formato JSONB
      senhas = cliente.senhas.map(function(s){
        return { orgao: s.orgao || '', login: s.login || '', senha: s.senha || '' };
      });
    } else if (cliente && cliente.senha_portal) {
      // Migra do formato antigo (1 entrada)
      senhas = [{
        orgao: cliente.senha_orgao || 'DAEE',
        login: cliente.senha_login || '',
        senha: cliente.senha_portal || ''
      }];
    }
    window._senhasEdicao[prefix] = senhas;
    _renderListaSenhas(prefix);
    _atualizarStatusBlocoSenhas(prefix);
  }

  async function salvarSenhaPortalProjeto() {
    if (!projetoAtualId) return;
    const proj = (typeof projetos !== 'undefined' ? projetos : []).find(function(p){ return p.id === projetoAtualId; });
    if (!proj) { alert('Projeto não encontrado.'); return; }
    return _salvarSenhasArray(proj.cliente_id, 'proj');
  }

  async function salvarSenhaPortalCliente() {
    if (!clienteAtualId) { alert('Cliente não selecionado.'); return; }
    return _salvarSenhasArray(clienteAtualId, 'cli');
  }

  // SEMANA 4.8: salva array completo de senhas no campo JSONB `senhas`
  async function _salvarSenhasArray(clienteId, prefix) {
    if (!clienteId) return;

    // Filtra entradas completamente vazias e limpa whitespace
    const todas = (window._senhasEdicao[prefix] || []).map(function(s){
      return {
        orgao: (s.orgao || '').trim(),
        login: (s.login || '').trim(),
        senha: s.senha || ''   // senha pode ter espaços relevantes
      };
    });
    const validas = todas.filter(function(s){ return s.orgao || s.login || s.senha; });

    try {
      const payload = { senhas: validas };
      const r = await fetch(SUPABASE_URL + '/rest/v1/clientes?id=eq.' + clienteId, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify(payload)
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);

      // Atualiza cache local
      const upd = function(arr){
        const c = (arr || []).find(function(x){ return x.id === clienteId; });
        if (c) c.senhas = validas;
      };
      upd(typeof clientes !== 'undefined' ? clientes : []);
      upd(typeof clientesEmProjeto !== 'undefined' ? clientesEmProjeto : []);
      upd(typeof leads !== 'undefined' ? leads : []);

      // Sincroniza estado de edição
      window._senhasEdicao[prefix] = validas.map(function(s){ return Object.assign({}, s); });
      _renderListaSenhas(prefix);
      _atualizarStatusBlocoSenhas(prefix);

      // Feedback visual
      const cont = document.getElementById(prefix + '-senhas-lista');
      if (cont) {
        cont.style.boxShadow = '0 0 0 3px #A5D6A7';
        setTimeout(function(){ cont.style.boxShadow = ''; }, 800);
      }
    } catch(e) {
      console.error('Erro salvar senhas:', e);
      alert('Erro ao salvar senhas: ' + (e.message || ''));
    }
  }

  // SEMANA 4.6: alterna entre recolhido/expandido o bloco de senhas
  function toggleBlocoSenhas(prefix) {
    const conteudo = document.getElementById(prefix + '-senhas-conteudo');
    const chevron = document.getElementById(prefix + '-senhas-chevron');
    if (!conteudo) return;
    const aberto = conteudo.style.display !== 'none';
    conteudo.style.display = aberto ? 'none' : 'block';
    if (chevron) chevron.style.transform = aberto ? '' : 'rotate(180deg)';
  }

  // SEMANA 4.8: status do bloco mostra resumo das senhas
  function _atualizarStatusBlocoSenhas(prefix) {
    let txt = '(clique pra consultar)';
    if (prefix) {
      const lista = (window._senhasEdicao[prefix] || []).filter(function(s){
        return (s.orgao||'').trim() || (s.senha||'').trim();
      });
      if (lista.length === 1) {
        const s = lista[0];
        txt = (s.orgao || '?') + (s.login ? ' · ' + s.login : '');
      } else if (lista.length > 1) {
        const orgaos = lista.map(function(s){ return s.orgao || '?'; }).join(', ');
        txt = lista.length + ' credenciais: ' + orgaos;
      }
    }
    const el = document.getElementById((prefix || 'cli') + '-senhas-status');
    if (el) el.textContent = txt;
  }

  // ============================================================
  // FASE 14.2: POOL DE LEADS (admin + hunter)
  // ============================================================
  let _filtroPool = '';
  let _idLeadAbertoNoPool = null;

  function carregarPool() {
    renderPool();
    atualizarBadgePool();
  }

  function atualizarBadgePool() {
    const badge = document.getElementById('badge-pool');
    if (!badge) return;
    const n = (leadsPool || []).length;
    badge.textContent = n > 0 ? n : '';
  }

  function filtrarPool(q) {
    _filtroPool = (q || '').toLowerCase().trim();
    renderPool();
  }

  function renderPool() {
    const cont = document.getElementById('lista-pool');
    const contador = document.getElementById('pool-contador');
    if (!cont) return;

    // Aplica filtro de busca
    let lista = leadsPool || [];
    if (_filtroPool) {
      lista = lista.filter(function(l){
        const txt = (l.nome || '') + ' ' + (l.cpf_cnpj || '') + ' ' + (l.cidade || '');
        return txt.toLowerCase().indexOf(_filtroPool) !== -1;
      });
    }

    // Ordena: mais recentes primeiro
    lista = lista.slice().sort(function(a, b){
      const da = new Date(a.criado_em || a.data_captura || 0).getTime();
      const db = new Date(b.criado_em || b.data_captura || 0).getTime();
      return db - da;
    });

    if (contador) {
      contador.textContent = lista.length === 0
        ? 'Nenhum lead disponível no pool'
        : lista.length + ' lead(s) disponível(eis)';
    }

    if (lista.length === 0) {
      cont.innerHTML = '<div style="font-size:13px;color:var(--text-muted);text-align:center;padding:40px;grid-column:1/-1;background:#f9fafb;border-radius:10px;">' +
        (leadsPool.length === 0
          ? '🌱 Pool vazio.<br/><span style="font-size:11px;">Aguarde o admin importar leads do DOE ou cadastrar novos.</span>'
          : '🔍 Nenhum lead encontrado com esse filtro.') +
        '</div>';
      return;
    }

    cont.innerHTML = lista.map(function(l){
      const propsCount = (propriedades || []).filter(function(p){ return p.cliente_id === l.id; }).length;
      const origem = l.origem_lead === 'importacao' ? '📥 DOE' : (l.origem_lead === 'manual' ? '✍️ Manual' : '—');
      const dataStr = l.criado_em ? new Date(l.criado_em).toLocaleDateString('pt-BR') : '—';
      const propBadge = propsCount > 0 ? '<span style="background:#E3F2FD;color:#1565C0;padding:2px 6px;border-radius:10px;font-size:10px;font-weight:600;">📍 ' + propsCount + ' prop.</span>' : '';

      return '<div onclick="abrirDetalhesPool(\'' + escapeHtml(l.id) + '\')" ' +
        'style="background:white;border:1.5px solid #C8E6C9;border-radius:10px;padding:14px;cursor:pointer;transition:all 0.15s;box-shadow:0 1px 3px rgba(0,0,0,0.05);" ' +
        'onmouseover="this.style.transform=\'translateY(-2px)\';this.style.boxShadow=\'0 4px 12px rgba(46,125,50,0.15)\';" ' +
        'onmouseout="this.style.transform=\'translateY(0)\';this.style.boxShadow=\'0 1px 3px rgba(0,0,0,0.05)\';">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px;">' +
          '<div style="font-size:13px;font-weight:700;color:var(--text);flex:1;line-height:1.3;">' + escapeHtml(l.nome || '(sem nome)') + '</div>' +
          propBadge +
        '</div>' +
        '<div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">' + escapeHtml(l.cpf_cnpj || 'sem CPF/CNPJ') + '</div>' +
        (l.cidade ? '<div style="font-size:12px;color:var(--text);margin-bottom:4px;">📍 ' + escapeHtml(l.cidade) + (l.estado ? ' / ' + escapeHtml(l.estado) : '') + '</div>' : '') +
        (l.telefone1 ? '<div style="font-size:12px;color:var(--text);margin-bottom:4px;">📞 ' + escapeHtml(l.telefone1) + '</div>' : '') +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:8px;border-top:1px dashed #e5e7eb;font-size:11px;color:var(--text-muted);">' +
          '<span>' + origem + '</span>' +
          '<span>' + dataStr + '</span>' +
        '</div>' +
        '<button class="btn" style="width:100%;margin-top:10px;background:#2E7D32;color:white;font-weight:700;font-size:12px;">🎯 VER DETALHES</button>' +
      '</div>';
    }).join('');
  }

  function abrirDetalhesPool(leadId) {
    const l = (leadsPool || []).find(function(x){ return x.id === leadId; });
    if (!l) { alert('Lead não encontrado. Pode ter sido pego por outro hunter. Recarregue.'); return; }
    _idLeadAbertoNoPool = leadId;

    function setText(id, txt) {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    }

    document.getElementById('pool-detalhes-id').value = leadId;
    setText('pool-det-nome', l.nome || '(sem nome)');
    setText('pool-det-doc', l.cpf_cnpj || '—');
    setText('pool-det-tel', l.telefone1 || '—');
    setText('pool-det-email', l.email || '—');
    setText('pool-det-cidade', (l.cidade || '—') + (l.estado ? ' / ' + l.estado : ''));
    setText('pool-det-origem', l.origem_lead === 'importacao' ? '📥 Importação DOE' : (l.origem_lead === 'manual' ? '✍️ Cadastro manual' : '—'));
    setText('pool-det-obs', l.observacoes_lead || '(sem observações)');

    // Lista propriedades do lead
    const propsLead = (propriedades || []).filter(function(p){ return p.cliente_id === leadId; });
    const propsEl = document.getElementById('pool-det-propriedades');
    if (propsEl) {
      if (propsLead.length === 0) {
        propsEl.innerHTML = '<span style="color:var(--text-muted);">Nenhuma propriedade cadastrada ainda.</span>';
      } else {
        propsEl.innerHTML = propsLead.map(function(p){
          return '<div style="padding:4px 0;border-bottom:1px dashed #e5e7eb;">📍 <strong>' + escapeHtml(p.nome || '—') + '</strong> ' + (p.cidade ? '· ' + escapeHtml(p.cidade) : '') + (p.processo ? ' · ' + escapeHtml(p.processo) : '') + '</div>';
        }).join('');
      }
    }

    abrirModal('ov-pool-detalhes');
  }

  async function pegarLeadDoPool() {
    const leadId = document.getElementById('pool-detalhes-id').value;
    if (!leadId) return;
    const sess = getSessao();
    if (!sess || sess.papel !== 'hunter') {
      alert('Apenas hunters podem pegar leads do pool.');
      return;
    }

    const btn = document.getElementById('btn-pegar-pra-mim');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Pegando...'; }

    try {
      // CRÍTICO: usa IF para evitar race condition
      // Só PATCH se hunter_id IS NULL. Se outro pegou primeiro, retorna 0 linhas alteradas.
      const r = await fetch(SUPABASE_URL + '/rest/v1/clientes?id=eq.' + leadId + '&hunter_id=is.null', {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
        body: JSON.stringify({ hunter_id: sess.id, data_captura: new Date().toISOString() })
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const updated = await r.json();
      if (!updated || updated.length === 0) {
        // Já foi pego por outro
        throw new Error('⚠ Este lead já foi pego por outro hunter. Atualize a lista.');
      }

      // Log na pool_log (best-effort)
      fetch(SUPABASE_URL + '/rest/v1/pool_log', {
        method: 'POST',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ cliente_id: leadId, acao: 'pego_por_hunter', hunter_id: sess.id })
      }).catch(function(){});

      fecharModal('ov-pool-detalhes');
      alert('✅ Lead pego com sucesso!\n\nAgora aparece em "Meus Leads" (Prospecção).');
      await carregarDados();
      renderPool();
      // Navega pra Prospecção pra ver o lead
      navTo('prospeccao');
    } catch(e) {
      console.error('Erro pegarLeadDoPool:', e);
      alert('Erro: ' + (e.message || ''));
      // Recarrega o pool pra ver se ainda existe
      await carregarDados();
      renderPool();
      fecharModal('ov-pool-detalhes');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '🎯 PEGAR PRA MIM'; }
    }
  }

  // ============================================================
  // SEMANA 2: CONFIG DE COMISSÕES (admin only)
  // ============================================================

  // ============================================================
  // SEMANA 2.4: RELATÓRIO FINANCEIRO MENSAL (admin only)
  // ============================================================

  // Estado: mês/ano visualizado (default: atual)
  let _finMesAtual = null;
  let _finAnoAtual = null;
  let _finDadosCache = null;   // cache dos dados calculados

  function _finInicializarMesAtual() {
    if (_finMesAtual === null || _finAnoAtual === null) {
      const hoje = new Date();
      _finMesAtual = hoje.getMonth() + 1;   // 1-12
      _finAnoAtual = hoje.getFullYear();
    }
  }

  function _finFormatarLabel() {
    const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    return meses[_finMesAtual - 1] + '/' + _finAnoAtual;
  }

  function _finFormatarMesISO(mes, ano) {
    const m = mes < 10 ? '0' + mes : mes;
    // mes_referencia na tabela é DATE = primeiro dia do mês (YYYY-MM-01)
    return ano + '-' + m + '-01';
  }

  function financeiroMesAnterior() {
    _finInicializarMesAtual();
    _finMesAtual--;
    if (_finMesAtual < 1) { _finMesAtual = 12; _finAnoAtual--; }
    carregarRelatorioFinanceiro();
  }

  function financeiroProxMes() {
    _finInicializarMesAtual();
    _finMesAtual++;
    if (_finMesAtual > 12) { _finMesAtual = 1; _finAnoAtual++; }
    carregarRelatorioFinanceiro();
  }

  function financeiroMesAtual() {
    const hoje = new Date();
    _finMesAtual = hoje.getMonth() + 1;
    _finAnoAtual = hoje.getFullYear();
    carregarRelatorioFinanceiro();
  }

  async function carregarRelatorioFinanceiro() {
    if (!souAdmin()) {
      const cont = document.getElementById('financeiro-conteudo');
      const loading = document.getElementById('financeiro-loading');
      if (cont) cont.style.display = 'none';
      if (loading) loading.innerHTML = '⛔ Acesso restrito a administradores.';
      return;
    }
    _finInicializarMesAtual();

    // Atualiza label
    const label = document.getElementById('financeiro-mes-label');
    if (label) label.textContent = _finFormatarLabel();

    // Mostra loading
    const loading = document.getElementById('financeiro-loading');
    const cont = document.getElementById('financeiro-conteudo');
    if (loading) loading.style.display = 'block';
    if (cont) cont.style.display = 'none';

    try {
      // Calcula limites do mês
      const inicioMes = new Date(_finAnoAtual, _finMesAtual - 1, 1).toISOString().slice(0, 10);
      const fimMes = new Date(_finAnoAtual, _finMesAtual, 0).toISOString().slice(0, 10);

      // 1. Busca projetos com pago_1 no mês
      const rProj = await fetch(SUPABASE_URL + '/rest/v1/projetos?pago_1=eq.true&pago_1_em=gte.' + inicioMes + '&pago_1_em=lte.' + fimMes + '&select=*', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (!rProj.ok) throw new Error('Erro buscando projetos: HTTP ' + rProj.status);
      const projetosMes = await rProj.json();

      // 2. Busca comissões do mês (pra calcular pagas/pendentes)
      const mesRef = _finFormatarMesISO(_finMesAtual, _finAnoAtual);
      const rCom = await fetch(SUPABASE_URL + '/rest/v1/comissoes?mes_referencia=eq.' + mesRef + '&select=*', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (!rCom.ok) throw new Error('Erro buscando comissões: HTTP ' + rCom.status);
      const comissoesMes = await rCom.json();

      // 3. Busca dados dos hunters (pra mostrar nomes/cores)
      if (!_usuariosCache || _usuariosCache.length === 0) {
        const rU = await fetch(SUPABASE_URL + '/rest/v1/usuarios?select=id,nome,papel,cor,ativo', {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
        });
        if (rU.ok) _usuariosCache = await rU.json();
      }

      // 4. Busca clientes pra mostrar nome
      const cliIds = Array.from(new Set(projetosMes.map(function(p){ return p.cliente_id; }).filter(Boolean)));
      let clientesMap = {};
      if (cliIds.length > 0) {
        const rCli = await fetch(SUPABASE_URL + '/rest/v1/clientes?id=in.(' + cliIds.join(',') + ')&select=id,nome', {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
        });
        if (rCli.ok) {
          const cliList = await rCli.json();
          cliList.forEach(function(c){ clientesMap[c.id] = c.nome; });
        }
      }

      // CALCULOS
      const receitaPrevista = projetosMes.reduce(function(s, p){ return s + parseFloat(p.valor_total || 0); }, 0);
      const receitaRealizada = projetosMes.reduce(function(s, p){ return s + parseFloat(p.valor_pago || 0); }, 0);

      const comPagas = comissoesMes.filter(function(c){ return c.status_pagamento === 'pago'; });
      const comPend = comissoesMes.filter(function(c){ return c.status_pagamento === 'pendente'; });
      const totalComPagas = comPagas.reduce(function(s, c){ return s + parseFloat(c.valor_comissao || 0); }, 0);
      const totalComPend = comPend.reduce(function(s, c){ return s + parseFloat(c.valor_comissao || 0); }, 0);

      const margem = receitaRealizada - totalComPagas;

      // Agrega por hunter
      const huntersAgreg = {};
      projetosMes.forEach(function(p){
        const hid = p.hunter_id_origem;
        if (!hid) return;
        if (!huntersAgreg[hid]) huntersAgreg[hid] = { qtd: 0, valorTotal: 0, valorPago: 0, comissao: 0 };
        huntersAgreg[hid].qtd++;
        huntersAgreg[hid].valorTotal += parseFloat(p.valor_total || 0);
        huntersAgreg[hid].valorPago += parseFloat(p.valor_pago || 0);
      });
      comissoesMes.forEach(function(c){
        const hid = c.hunter_id;
        if (!hid || !huntersAgreg[hid]) {
          if (!huntersAgreg[hid]) huntersAgreg[hid] = { qtd: 0, valorTotal: 0, valorPago: 0, comissao: 0 };
        }
        huntersAgreg[hid].comissao += parseFloat(c.valor_comissao || 0);
      });

      // Salva no cache pra exportação
      _finDadosCache = {
        mes: _finFormatarLabel(),
        mesISO: mesRef,
        receitaPrevista, receitaRealizada,
        totalComPagas, totalComPend,
        margem,
        projetos: projetosMes,
        comissoes: comissoesMes,
        huntersAgreg, clientesMap
      };

      // RENDERIZA
      _finRenderMetricas(_finDadosCache);
      _finRenderHunters(_finDadosCache);
      _finRenderListaProjetos(_finDadosCache);
      await _finRenderComparativo();

      // Mostra
      if (loading) loading.style.display = 'none';
      if (cont) cont.style.display = 'block';
    } catch(e) {
      console.error('Erro carregarRelatorioFinanceiro:', e);
      if (loading) loading.innerHTML = '❌ Erro ao carregar: ' + (e.message || '');
    }
  }

  function _finFmt(v) {
    return 'R$ ' + (parseFloat(v) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function _finRenderMetricas(d) {
    const setEl = function(id, valor) { const el = document.getElementById(id); if (el) el.textContent = valor; };
    setEl('fin-receita-prevista', _finFmt(d.receitaPrevista));
    setEl('fin-receita-prevista-sub', d.projetos.length + ' projeto' + (d.projetos.length !== 1 ? 's' : ''));
    setEl('fin-receita-realizada', _finFmt(d.receitaRealizada));
    setEl('fin-receita-realizada-sub', 'Pagamentos confirmados');
    setEl('fin-com-pagas', _finFmt(d.totalComPagas));
    setEl('fin-com-pagas-sub', d.comissoes.filter(function(c){ return c.status_pagamento === 'pago'; }).length + ' pagamentos');
    setEl('fin-com-pendentes', _finFmt(d.totalComPend));
    setEl('fin-com-pendentes-sub', d.comissoes.filter(function(c){ return c.status_pagamento === 'pendente'; }).length + ' a pagar');

    // FIX: Margem PREVISTA (visão gerencial) - usa Receita Prevista - Comissões Totais (pagas+pendentes)
    // Comissões: incluímos pagas + pendentes (ambas vão sair do caixa)
    const totalComissoes = d.totalComPagas + d.totalComPend;
    const margemPrev = d.receitaPrevista - totalComissoes;
    setEl('fin-margem', _finFmt(margemPrev));
    const pct = d.receitaPrevista > 0 ? (margemPrev / d.receitaPrevista * 100).toFixed(0) : 0;
    setEl('fin-margem-sub', 'Prevista − comissões (' + pct + '%)');
  }

  function _finRenderHunters(d) {
    const cont = document.getElementById('fin-performance-hunters');
    if (!cont) return;
    const hids = Object.keys(d.huntersAgreg);
    if (hids.length === 0) {
      cont.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:12px;">Nenhum fechamento de hunter no mês.</div>';
      return;
    }
    // Ordena por valor total desc
    hids.sort(function(a, b){ return d.huntersAgreg[b].valorTotal - d.huntersAgreg[a].valorTotal; });

    let html = '<div style="display:flex;flex-direction:column;gap:8px;">';
    hids.forEach(function(hid){
      const ag = d.huntersAgreg[hid];
      const hunter = (_usuariosCache || []).find(function(u){ return u.id === hid; }) || { nome: '(?)', cor: null };
      const corDef = hunter.cor ? CORES_TIMES[hunter.cor] : null;
      const emoji = corDef ? corDef.emoji : '👤';
      const corHex = corDef ? corDef.hex : '#999';

      html += '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#FAFAFA;border-radius:8px;border-left:4px solid ' + corHex + ';">' +
        '<div style="font-size:20px;">' + emoji + '</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:13px;font-weight:700;color:var(--text);">' + escapeHtml(hunter.nome) + '</div>' +
          '<div style="font-size:11px;color:var(--text-muted);">' + ag.qtd + ' fechamento' + (ag.qtd !== 1 ? 's' : '') + ' · Valor total: ' + _finFmt(ag.valorTotal) + '</div>' +
        '</div>' +
        '<div style="text-align:right;">' +
          '<div style="font-size:14px;font-weight:700;color:#388E3C;">' + _finFmt(ag.comissao) + '</div>' +
          '<div style="font-size:10px;color:var(--text-muted);">comissão total</div>' +
        '</div>' +
      '</div>';
    });
    html += '</div>';
    cont.innerHTML = html;
  }

  function _finRenderListaProjetos(d) {
    const cont = document.getElementById('fin-lista-projetos');
    if (!cont) return;
    if (d.projetos.length === 0) {
      cont.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:12px;">Nenhum projeto com Pago 1º no mês.</div>';
      return;
    }
    // Ordena por valor desc
    const projOrd = [...d.projetos].sort(function(a, b){ return parseFloat(b.valor_total||0) - parseFloat(a.valor_total||0); });

    let html = '<div style="overflow-x:auto;"><table style="width:100%;font-size:12px;border-collapse:collapse;">' +
      '<thead><tr style="background:#F5F5F5;text-align:left;">' +
        '<th style="padding:8px 10px;font-weight:600;">Cliente</th>' +
        '<th style="padding:8px 10px;font-weight:600;">Projeto</th>' +
        '<th style="padding:8px 10px;font-weight:600;">Hunter</th>' +
        '<th style="padding:8px 10px;font-weight:600;text-align:right;">Valor</th>' +
        '<th style="padding:8px 10px;font-weight:600;text-align:right;">Pago</th>' +
        '<th style="padding:8px 10px;font-weight:600;text-align:center;">Pago 1º em</th>' +
      '</tr></thead><tbody>';

    projOrd.forEach(function(p){
      const cliNome = d.clientesMap[p.cliente_id] || '(?)';
      const hunter = p.hunter_id_origem ? ((_usuariosCache || []).find(function(u){ return u.id === p.hunter_id_origem; })) : null;
      const hnome = hunter ? hunter.nome : '<em style="color:#D32F2F;">sem hunter</em>';
      const cor = hunter && hunter.cor ? CORES_TIMES[hunter.cor] : null;
      const emoji = cor ? cor.emoji : '';

      html += '<tr style="border-bottom:1px solid #EEE;">' +
        '<td style="padding:8px 10px;">' + escapeHtml(cliNome) + '</td>' +
        '<td style="padding:8px 10px;">' + escapeHtml(p.nome || '(?)') + '</td>' +
        '<td style="padding:8px 10px;">' + emoji + ' ' + (hunter ? escapeHtml(hnome) : hnome) + '</td>' +
        '<td style="padding:8px 10px;text-align:right;font-weight:600;">' + _finFmt(p.valor_total) + '</td>' +
        '<td style="padding:8px 10px;text-align:right;color:#2E7D32;">' + _finFmt(p.valor_pago) + '</td>' +
        '<td style="padding:8px 10px;text-align:center;font-size:11px;color:var(--text-muted);">' + (p.pago_1_em ? new Date(p.pago_1_em + 'T12:00:00').toLocaleDateString('pt-BR') : '-') + '</td>' +
      '</tr>';
    });
    html += '</tbody></table></div>';
    cont.innerHTML = html;
  }

  async function _finRenderComparativo() {
    const cont = document.getElementById('fin-comparativo');
    if (!cont) return;
    cont.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:12px;">⏳ Calculando...</div>';

    // Calcula os últimos 3 meses (incluindo o atual)
    const meses = [];
    let m = _finMesAtual;
    let a = _finAnoAtual;
    for (let i = 0; i < 3; i++) {
      meses.unshift({ mes: m, ano: a, mesISO: _finFormatarMesISO(m, a) });
      m--; if (m < 1) { m = 12; a--; }
    }

    try {
      const dados = [];
      for (const periodo of meses) {
        const inicio = new Date(periodo.ano, periodo.mes - 1, 1).toISOString().slice(0, 10);
        const fim = new Date(periodo.ano, periodo.mes, 0).toISOString().slice(0, 10);

        const rP = await fetch(SUPABASE_URL + '/rest/v1/projetos?pago_1=eq.true&pago_1_em=gte.' + inicio + '&pago_1_em=lte.' + fim + '&select=valor_total', {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
        });
        const projs = rP.ok ? await rP.json() : [];
        const receita = projs.reduce(function(s, p){ return s + parseFloat(p.valor_total || 0); }, 0);

        const rC = await fetch(SUPABASE_URL + '/rest/v1/comissoes?mes_referencia=eq.' + periodo.mesISO + '&select=valor_comissao,status_pagamento', {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
        });
        const coms = rC.ok ? await rC.json() : [];
        const comTotal = coms.reduce(function(s, c){ return s + parseFloat(c.valor_comissao || 0); }, 0);

        const mesesNome = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
        dados.push({
          label: mesesNome[periodo.mes - 1] + '/' + String(periodo.ano).slice(-2),
          receita: receita,
          comissao: comTotal,
          qtd: projs.length
        });
      }

      // Render gráfico simples HTML
      const maxValor = Math.max(...dados.map(function(d){ return d.receita; }), 1);

      let html = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">';
      dados.forEach(function(d){
        const pct = (d.receita / maxValor) * 100;
        html += '<div>' +
          '<div style="font-size:11px;color:var(--text-muted);margin-bottom:6px;text-align:center;font-weight:600;">' + d.label + '</div>' +
          '<div style="background:#F0F0F0;border-radius:6px;height:120px;position:relative;display:flex;align-items:flex-end;justify-content:center;">' +
            '<div style="width:60%;background:linear-gradient(to top, #1565C0, #1976D2);height:' + Math.max(pct, 2) + '%;border-radius:6px 6px 0 0;transition:height 0.3s;"></div>' +
          '</div>' +
          '<div style="font-size:13px;font-weight:700;text-align:center;margin-top:6px;color:var(--text);">' + _finFmt(d.receita) + '</div>' +
          '<div style="font-size:10px;color:var(--text-muted);text-align:center;">' + d.qtd + ' projeto' + (d.qtd !== 1 ? 's' : '') + '</div>' +
          '<div style="font-size:10px;color:#E65100;text-align:center;margin-top:2px;">Comissão: ' + _finFmt(d.comissao) + '</div>' +
        '</div>';
      });
      html += '</div>';
      cont.innerHTML = html;
    } catch(e) {
      console.error('Erro _finRenderComparativo:', e);
      cont.innerHTML = '<div style="color:#D32F2F;text-align:center;padding:20px;">Erro ao carregar comparativo.</div>';
    }
  }

  // EXPORTAÇÃO EXCEL/CSV
  function exportarRelatorioFinanceiro() {
    if (!_finDadosCache) { alert('Aguarde os dados carregarem.'); return; }
    const d = _finDadosCache;

    // Monta CSV
    const linhas = [];
    linhas.push('RELATÓRIO FINANCEIRO - ' + d.mes);
    linhas.push('');
    linhas.push('Métrica;Valor');
    linhas.push('Receita prevista;R$ ' + d.receitaPrevista.toFixed(2).replace('.', ','));
    linhas.push('Receita realizada;R$ ' + d.receitaRealizada.toFixed(2).replace('.', ','));
    linhas.push('Comissões pagas;R$ ' + d.totalComPagas.toFixed(2).replace('.', ','));
    linhas.push('Comissões pendentes;R$ ' + d.totalComPend.toFixed(2).replace('.', ','));
    linhas.push('Margem líquida;R$ ' + d.margem.toFixed(2).replace('.', ','));
    linhas.push('');
    linhas.push('PERFORMANCE POR HUNTER');
    linhas.push('Hunter;Fechamentos;Valor Total;Comissão');
    Object.keys(d.huntersAgreg).forEach(function(hid){
      const ag = d.huntersAgreg[hid];
      const hunter = (_usuariosCache || []).find(function(u){ return u.id === hid; }) || { nome: '(?)' };
      linhas.push(
        '"' + hunter.nome + '";' +
        ag.qtd + ';' +
        'R$ ' + ag.valorTotal.toFixed(2).replace('.', ',') + ';' +
        'R$ ' + ag.comissao.toFixed(2).replace('.', ',')
      );
    });
    linhas.push('');
    linhas.push('PROJETOS DO MÊS');
    linhas.push('Cliente;Projeto;Hunter;Valor Total;Valor Pago;Pago 1º em');
    d.projetos.forEach(function(p){
      const cliNome = d.clientesMap[p.cliente_id] || '(?)';
      const hunter = p.hunter_id_origem ? ((_usuariosCache || []).find(function(u){ return u.id === p.hunter_id_origem; })) : null;
      const hnome = hunter ? hunter.nome : 'sem hunter';
      linhas.push(
        '"' + cliNome + '";"' + (p.nome || '?') + '";"' + hnome + '";' +
        'R$ ' + (parseFloat(p.valor_total) || 0).toFixed(2).replace('.', ',') + ';' +
        'R$ ' + (parseFloat(p.valor_pago) || 0).toFixed(2).replace('.', ',') + ';' +
        (p.pago_1_em || '')
      );
    });

    const csv = linhas.join('\n');
    // BOM pra UTF-8 abrir bem no Excel BR
    const bom = '\uFEFF';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Nome de arquivo amigável: YYYY-MM (sem dia)
    const nomeArq = d.mesISO.substring(0, 7);
    link.download = 'relatorio_financeiro_' + nomeArq + '.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function imprimirRelatorioFinanceiro() {
    if (!_finDadosCache) { alert('Aguarde os dados carregarem.'); return; }
    window.print();
  }


  async function carregarConfigComissoes() {
    const status = document.getElementById('cfg-comissoes-status');
    if (status) status.textContent = '⏳ Carregando...';

    try {
      const r = await fetch(SUPABASE_URL + '/rest/v1/config_app?chave=in.(valor_minimo_proposta,comissao_1_a_4,comissao_5_a_8,comissao_9_mais)&select=chave,valor', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const list = await r.json();

      const map = {};
      list.forEach(function(item){ map[item.chave] = parseFloat(item.valor) || 0; });

      const setEl = function(id, val) {
        const el = document.getElementById(id);
        if (el) el.value = val || '';
      };
      setEl('cfg-valor-minimo', map.valor_minimo_proposta || 3000);
      setEl('cfg-comissao-1-4', map.comissao_1_a_4 || 500);
      setEl('cfg-comissao-5-8', map.comissao_5_a_8 || 1000);
      setEl('cfg-comissao-9-mais', map.comissao_9_mais || 2000);

      if (status) {
        status.textContent = '✅ Carregado';
        setTimeout(function(){ status.textContent = ''; }, 3000);
      }
    } catch(e) {
      console.error('Erro carregarConfigComissoes:', e);
      if (status) status.textContent = '❌ Erro: ' + (e.message || '');
    }
  }

  async function salvarConfigComissoes() {
    if (!souAdmin()) { alert('Apenas admin pode mudar isso.'); return; }

    const getVal = function(id, padrao) {
      const el = document.getElementById(id);
      if (!el) return padrao;
      const v = parseFloat(el.value);
      return isNaN(v) || v < 0 ? padrao : v;
    };
    const valorMinimo = getVal('cfg-valor-minimo', 3000);
    const com1 = getVal('cfg-comissao-1-4', 500);
    const com2 = getVal('cfg-comissao-5-8', 1000);
    const com3 = getVal('cfg-comissao-9-mais', 2000);

    // Validações de consistência
    if (com1 <= 0 || com2 <= 0 || com3 <= 0) {
      alert('⚠ Os valores de comissão devem ser maiores que zero.');
      return;
    }
    if (com2 < com1 || com3 < com2) {
      if (!confirm('⚠ Atenção: valores não estão progressivos.\n\n  1º-4º: R$ ' + com1 + '\n  5º-8º: R$ ' + com2 + '\n  9º+:   R$ ' + com3 + '\n\nO normal é que cada faixa pague mais que a anterior. Salvar mesmo assim?')) return;
    }
    if (valorMinimo < 1000) {
      if (!confirm('⚠ Valor mínimo de R$ ' + valorMinimo + ' está muito baixo. Tem certeza?')) return;
    }

    const status = document.getElementById('cfg-comissoes-status');
    if (status) status.textContent = '⏳ Salvando...';

    try {
      // Atualiza cada chave via UPSERT (PATCH com filtro)
      const configs = [
        { chave: 'valor_minimo_proposta', valor: valorMinimo.toString() },
        { chave: 'comissao_1_a_4', valor: com1.toString() },
        { chave: 'comissao_5_a_8', valor: com2.toString() },
        { chave: 'comissao_9_mais', valor: com3.toString() }
      ];

      for (const cfg of configs) {
        // Tenta atualizar
        const rPatch = await fetch(SUPABASE_URL + '/rest/v1/config_app?chave=eq.' + cfg.chave, {
          method: 'PATCH',
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
          body: JSON.stringify({ valor: cfg.valor })
        });
        if (!rPatch.ok) throw new Error('Falha ao atualizar ' + cfg.chave);
        const updated = await rPatch.json();
        // Se PATCH não atualizou nenhuma linha, insere
        if (!updated || updated.length === 0) {
          const rPost = await fetch(SUPABASE_URL + '/rest/v1/config_app', {
            method: 'POST',
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
            body: JSON.stringify(cfg)
          });
          if (!rPost.ok) throw new Error('Falha ao criar ' + cfg.chave);
        }
      }

      if (status) {
        status.textContent = '✅ Salvo com sucesso';
        setTimeout(function(){ status.textContent = ''; }, 4000);
      }
      alert('✅ Valores atualizados!\n\n' +
        '• Valor mínimo: R$ ' + valorMinimo.toLocaleString('pt-BR') + '\n' +
        '• 1º-4º: R$ ' + com1.toLocaleString('pt-BR') + '\n' +
        '• 5º-8º: R$ ' + com2.toLocaleString('pt-BR') + '\n' +
        '• 9º+:   R$ ' + com3.toLocaleString('pt-BR') + '\n\n' +
        'Comissões NOVAS vão usar esses valores.\n' +
        'Comissões existentes não são alteradas automaticamente.');
    } catch(e) {
      console.error('Erro salvarConfigComissoes:', e);
      if (status) status.textContent = '❌ Erro: ' + (e.message || '');
      alert('Erro ao salvar: ' + (e.message || ''));
    }
  }

  // ============================================================
  // FASE 14.1: CRUD DE USUÁRIOS (admin only)
  // ============================================================
  // _usuariosCache declarado no topo (FASE 14.2)

  // Carrega lista de usuários do banco
  async function carregarUsuarios() {
    const cont = document.getElementById('lista-usuarios');
    if (!cont) return;
    cont.innerHTML = '<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:20px;">Carregando...</div>';

    try {
      // FIX BUG #9: seleciona campos específicos (NÃO retorna pin_hash)
      const r = await fetch(SUPABASE_URL + '/rest/v1/usuarios?select=id,nome,email,papel,cor,ativo,criado_em&order=papel.asc,cor.asc', {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      _usuariosCache = await r.json();
      renderListaUsuarios();
    } catch(e) {
      console.error('Erro carregarUsuarios:', e);
      cont.innerHTML = '<div style="color:#C62828;font-size:13px;padding:14px;background:#FFEBEE;border-radius:8px;">Erro ao carregar: ' + escapeHtml(e.message || '') + '<br/><span style="font-size:11px;">Verifique se a migração SQL da Fase 14.1 foi rodada.</span></div>';
    }
  }

  function renderListaUsuarios() {
    const cont = document.getElementById('lista-usuarios');
    if (!cont) return;

    if (_usuariosCache.length === 0) {
      cont.innerHTML = '<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:30px;">Nenhum usuário cadastrado ainda.<br/>Clique em "+ Novo usuário" pra começar.</div>';
      return;
    }

    // Agrupa por papel
    const grupos = { admin: [], hunter: [], projetos: [] };
    _usuariosCache.forEach(function(u){ (grupos[u.papel] || []).push(u); });

    let html = '';

    // Admins
    if (grupos.admin.length > 0) {
      html += '<div style="font-size:11px;font-weight:600;color:var(--text-muted);margin:8px 0 6px;text-transform:uppercase;letter-spacing:0.5px;">👑 Administradores</div>';
      grupos.admin.forEach(function(u){ html += linhaUsuario(u); });
    }

    // Hunters
    if (grupos.hunter.length > 0) {
      html += '<div style="font-size:11px;font-weight:600;color:var(--text-muted);margin:14px 0 6px;text-transform:uppercase;letter-spacing:0.5px;">🎯 Hunters (Comercial)</div>';
      grupos.hunter.forEach(function(u){ html += linhaUsuario(u); });
    }

    // Projetos
    if (grupos.projetos.length > 0) {
      html += '<div style="font-size:11px;font-weight:600;color:var(--text-muted);margin:14px 0 6px;text-transform:uppercase;letter-spacing:0.5px;">🛠️ Equipe Projetos (Técnica)</div>';
      grupos.projetos.forEach(function(u){ html += linhaUsuario(u); });
    }

    cont.innerHTML = html;
  }

  function linhaUsuario(u) {
    const info = u.cor ? (CORES_TIMES[u.cor] || null) : null;
    const corStyle = info ? 'background:' + info.hex + ';color:' + (u.cor === 'amarelo' || u.cor === 'branco' ? '#212121' : 'white') + ';' : 'background:#1565C0;color:white;';
    const emoji = info ? info.emoji : '👑';
    const corLabel = info ? info.nome : (u.email || 'admin');
    const statusBadge = u.ativo === false
      ? '<span style="background:#FFEBEE;color:#C62828;padding:2px 6px;border-radius:10px;font-size:10px;font-weight:600;">DESATIVADO</span>'
      : '<span style="background:#E8F5E9;color:#2E7D32;padding:2px 6px;border-radius:10px;font-size:10px;font-weight:600;">ATIVO</span>';

    let acoes = '';
    if (u.papel !== 'admin') {
      acoes += '<button class="btn btn-sm" onclick="editarUsuario(\'' + u.id + '\')">✏️ Editar</button>';
      acoes += '<button class="btn btn-sm" onclick="resetarPinUsuario(\'' + u.id + '\')" title="Gerar novo PIN">🔑 Resetar PIN</button>';
      if (u.ativo !== false) {
        acoes += '<button class="btn btn-sm btn-red" onclick="desativarUsuario(\'' + u.id + '\')">🚫 Desativar</button>';
      } else {
        acoes += '<button class="btn btn-sm" style="background:#E8F5E9;color:#2E7D32;" onclick="reativarUsuario(\'' + u.id + '\')">✓ Reativar</button>';
      }
    }

    return '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #f3f4f6;">' +
      '<div style="width:36px;height:36px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;' + corStyle + '">' + emoji + '</div>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:13px;font-weight:600;">' + escapeHtml(u.nome || '(sem nome)') + ' ' + statusBadge + '</div>' +
        '<div style="font-size:11px;color:var(--text-muted);">' + escapeHtml(corLabel) + (u.ultimo_login ? ' · último acesso: ' + new Date(u.ultimo_login).toLocaleDateString('pt-BR') : ' · nunca acessou') + '</div>' +
      '</div>' +
      '<div style="display:flex;gap:4px;flex-shrink:0;">' + acoes + '</div>' +
    '</div>';
  }

  // Abre modal de cadastro
  function abrirCadastroUsuario() {
    document.getElementById('usu-id').value = '';
    document.getElementById('usu-modal-titulo').textContent = 'Novo usuário';
    document.getElementById('usu-nome').value = '';
    document.getElementById('usu-papel').value = 'hunter';
    document.getElementById('usu-pin').value = '';
    const erro = document.getElementById('usu-modal-erro');
    if (erro) erro.style.display = 'none';
    atualizarCoresDisponiveis();
    abrirModal('ov-cadastro-usuario');
  }

  // Atualiza dropdown de cores baseado em papel + cores já em uso
  function atualizarCoresDisponiveis() {
    const papel = document.getElementById('usu-papel').value;
    const sel = document.getElementById('usu-cor');
    const idEditando = document.getElementById('usu-id').value;

    // Coleta cores em uso (excluindo o próprio se editando)
    const usadas = {};
    _usuariosCache.forEach(function(u){
      if (u.ativo !== false && u.cor && u.id !== idEditando) usadas[u.cor] = true;
    });

    let html = '';
    Object.keys(CORES_TIMES).forEach(function(cor){
      const info = CORES_TIMES[cor];
      if (info.papel !== papel) return;
      const ocupada = usadas[cor];
      html += '<option value="' + cor + '"' + (ocupada ? ' disabled' : '') + '>' +
        info.emoji + ' ' + info.nome + (ocupada ? ' (em uso)' : '') + '</option>';
    });
    sel.innerHTML = html;
  }

  // Salva usuário (novo ou edição)
  async function salvarUsuario() {
    const id = document.getElementById('usu-id').value;
    const nome = (document.getElementById('usu-nome').value || '').trim();
    const papel = document.getElementById('usu-papel').value;
    const cor = document.getElementById('usu-cor').value;
    const pin = (document.getElementById('usu-pin').value || '').trim();
    const erroEl = document.getElementById('usu-modal-erro');
    const btn = document.getElementById('btn-salvar-usuario');

    function showErro(msg) {
      erroEl.textContent = msg;
      erroEl.style.display = 'block';
    }
    erroEl.style.display = 'none';

    if (!nome) return showErro('Nome obrigatório.');
    if (!papel) return showErro('Papel obrigatório.');
    if (!cor) return showErro('Cor obrigatória.');
    if (!id && !pin) return showErro('PIN obrigatório.');
    if (pin && !/^[0-9]{6}$/.test(pin)) return showErro('PIN deve ter exatamente 6 dígitos numéricos.');

    btn.disabled = true;
    btn.textContent = 'Salvando...';

    try {
      const body = { nome: nome, papel: papel, cor: cor };
      if (pin) body.pin_hash = await hashSenha(pin);

      let r;
      if (id) {
        // Edição (PATCH)
        body.atualizado_em = new Date().toISOString();
        r = await fetch(SUPABASE_URL + '/rest/v1/usuarios?id=eq.' + id, {
          method: 'PATCH',
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
          body: JSON.stringify(body)
        });
      } else {
        // Novo (POST)
        body.ativo = true;
        r = await fetch(SUPABASE_URL + '/rest/v1/usuarios', {
          method: 'POST',
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
          body: JSON.stringify(body)
        });
      }

      if (!r.ok) {
        const txt = await r.text();
        if (txt.indexOf('duplicate') !== -1 || txt.indexOf('unique') !== -1) {
          throw new Error('Cor já em uso por outro usuário ativo. Escolha outra cor.');
        }
        throw new Error('HTTP ' + r.status + ': ' + (txt.slice(0, 120)));
      }

      fecharModal('ov-cadastro-usuario');
      await carregarUsuarios();
      alert(id ? '✓ Usuário atualizado.' : '✓ Usuário cadastrado.\n\n⚠ Anote o PIN: ' + pin);
    } catch(e) {
      console.error('Erro salvarUsuario:', e);
      showErro('Erro: ' + (e.message || 'tente novamente'));
    } finally {
      btn.disabled = false;
      btn.textContent = '💾 Salvar';
    }
  }

  function editarUsuario(id) {
    const u = _usuariosCache.find(function(x){ return x.id === id; });
    if (!u) { alert('Usuário não encontrado. Recarregue a lista.'); return; }

    document.getElementById('usu-id').value = u.id;
    document.getElementById('usu-modal-titulo').textContent = 'Editar usuário';
    document.getElementById('usu-nome').value = u.nome || '';
    document.getElementById('usu-papel').value = u.papel;
    document.getElementById('usu-pin').value = '';  // pin fica em branco — só preenche se quiser trocar
    const inpPin = document.getElementById('usu-pin');
    if (inpPin) inpPin.placeholder = 'Deixe em branco para manter atual';
    const erro = document.getElementById('usu-modal-erro');
    if (erro) erro.style.display = 'none';
    atualizarCoresDisponiveis();
    document.getElementById('usu-cor').value = u.cor || '';
    abrirModal('ov-cadastro-usuario');
  }

  async function resetarPinUsuario(id) {
    const u = _usuariosCache.find(function(x){ return x.id === id; });
    if (!u) return;
    // Gera PIN aleatório de 6 dígitos
    const novoPin = String(Math.floor(100000 + Math.random() * 900000));
    if (!confirm('Gerar NOVO PIN para "' + (u.nome || u.cor) + '"?\n\nO PIN antigo deixará de funcionar.\n\nNovo PIN: ' + novoPin + '\n\n⚠ ANOTE o novo PIN antes de continuar — ele só aparece aqui.')) return;

    try {
      const hash = await hashSenha(novoPin);
      const r = await fetch(SUPABASE_URL + '/rest/v1/usuarios?id=eq.' + id, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ pin_hash: hash, atualizado_em: new Date().toISOString() })
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      alert('✓ PIN resetado.\n\nNovo PIN: ' + novoPin + '\n\n⚠ Anote AGORA — não aparece de novo.');
      await carregarUsuarios();
    } catch(e) {
      console.error('Erro resetarPin:', e);
      alert('Erro: ' + (e.message || ''));
    }
  }

  async function desativarUsuario(id) {
    const u = _usuariosCache.find(function(x){ return x.id === id; });
    if (!u) return;

    // FIX BUG #13: avisa o que vai acontecer com leads/projetos do hunter
    let aviso = '';
    if (u.papel === 'hunter') {
      const leadsDoHunter = (clientes || [])
        .concat(typeof leads !== 'undefined' ? leads : [])
        .filter(function(c){ return c.hunter_id === id; });
      const projetosDoHunter = (projetos || []).filter(function(p){ return p.hunter_id_origem === id; });

      if (leadsDoHunter.length || projetosDoHunter.length) {
        aviso = '\n\n⚠ ATENÇÃO:';
        if (leadsDoHunter.length) {
          aviso += '\n• ' + leadsDoHunter.length + ' lead(s) atribuídos a ele ficarão "presos" (vão pro Pool? Use "Liberar pro Pool" no lead)';
        }
        if (projetosDoHunter.length) {
          aviso += '\n• ' + projetosDoHunter.length + ' projeto(s) com comissão futura — vão continuar associados a ele';
        }
      }
    }

    if (!confirm('Desativar "' + (u.nome || u.cor) + '"?\n\nA pessoa não consegue mais entrar, mas o histórico fica preservado.\nA cor fica liberada pra outro usuário.' + aviso)) return;

    try {
      const r = await fetch(SUPABASE_URL + '/rest/v1/usuarios?id=eq.' + id, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ ativo: false, atualizado_em: new Date().toISOString() })
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      await carregarUsuarios();
    } catch(e) {
      console.error('Erro desativarUsuario:', e);
      alert('Erro: ' + (e.message || ''));
    }
  }

  async function reativarUsuario(id) {
    const u = _usuariosCache.find(function(x){ return x.id === id; });
    if (!u) return;
    if (!confirm('Reativar "' + (u.nome || u.cor) + '"?\n\n⚠ A cor ' + (u.cor || '?') + ' precisa estar livre — se outro usuário ativo já tem essa cor, a reativação vai falhar. Edite a cor primeiro se necessário.')) return;

    try {
      const r = await fetch(SUPABASE_URL + '/rest/v1/usuarios?id=eq.' + id, {
        method: 'PATCH',
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ ativo: true, atualizado_em: new Date().toISOString() })
      });
      if (!r.ok) {
        const txt = await r.text();
        if (txt.indexOf('duplicate') !== -1 || txt.indexOf('unique') !== -1) {
          throw new Error('Cor já em uso por outro usuário. Edite a cor antes.');
        }
        throw new Error('HTTP ' + r.status);
      }
      await carregarUsuarios();
    } catch(e) {
      console.error('Erro reativarUsuario:', e);
      alert('Erro: ' + (e.message || ''));
    }
  }


  // ============================================================
  // FASE 8: HELPERS UTILITÁRIOS
  // ============================================================

  // val(id) → leitura padronizada de input/textarea. Retorna null se vazio.
  // opts:
  //   trim: false (padrão true)
  //   upper: true (aplica toUpperCase)
  //   parseInt: true (retorna inteiro)
  //   parseFloat: true (retorna float)
  //   default: valor padrão se vazio ou inválido
  function val(id, opts) {
    opts = opts || {};
    const el = document.getElementById(id);
    if (!el) return opts.default !== undefined ? opts.default : null;
    let v = el.value;
    if (v == null) return opts.default !== undefined ? opts.default : null;
    if (opts.trim !== false) v = v.trim();
    if (opts.upper) v = v.toUpperCase();
    if (opts.parseInt) {
      const n = parseInt(v, 10);
      return isNaN(n) ? (opts.default !== undefined ? opts.default : null) : n;
    }
    if (opts.parseFloat) {
      const n = parseFloat(v);
      return isNaN(n) ? (opts.default !== undefined ? opts.default : null) : n;
    }
    if (!v) return opts.default !== undefined ? opts.default : null;
    return v;
  }

  // fmtDataBR(s) → formata "YYYY-MM-DD" pra "DD/MM/YYYY" (timezone-safe via T12:00:00)
  function fmtDataBR(s) {
    if (!s) return '';
    try {
      // Aceita também ISO completo (com horário)
      const dataStr = String(s).length === 10 ? s + 'T12:00:00' : s;
      return new Date(dataStr).toLocaleDateString('pt-BR');
    } catch(_) {
      return '';
    }
  }

  // trataErro(contexto, e) → padrão de error handling: log + alert ao usuário
  function trataErro(contexto, e) {
    console.error('Erro ' + contexto + ':', e);
    alert('Erro ao ' + contexto + ': ' + (e && e.message ? e.message : e));
  }


  // ============================================================
  // FASE 4: PROPOSTAS COMERCIAIS
  // ============================================================
  let propostas = [];                  // cache de propostas carregadas
  let configContratado = null;         // cache do config_contratado

  // -------- Helpers --------
  function fmtMoeda(v) {
    if (v == null || isNaN(v)) return 'R$ 0,00';
    return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function parseMoeda(s) {
    if (s == null || s === '') return 0;
    if (typeof s === 'number') return s;
    // Aceita "R$ 1.000,50" ou "1000,50" ou "1000.50"
    var clean = String(s).replace(/R\$\s*/g,'').replace(/\./g,'').replace(',', '.').trim();
    var n = parseFloat(clean);
    return isNaN(n) ? 0 : n;
  }

  // ============================================================
  // CONFIG DO CONTRATADO (dados Zello)
  // ============================================================
  async function carregarConfigContratado() {
    try {
      const r = await api('config_contratado?select=*&limit=1');
      configContratado = (r && r[0]) || null;
    } catch(e) {
      console.error('Erro carregarConfigContratado:', e);
      configContratado = null;
    }
    preencherFormConfigContratado();
  }

  function preencherFormConfigContratado() {
    if (!configContratado) return;
    const c = configContratado;
    const set = function(id, v) { const el = document.getElementById(id); if (el) el.value = v || ''; };
    set('cfg-razao', c.razao_social);
    set('cfg-cnpj', c.cnpj);
    set('cfg-resp', c.resp_legal);
    set('cfg-cpf', c.cpf);
    set('cfg-rg', c.rg);
    set('cfg-crea', c.crea);
    set('cfg-crq', c.crq);
    set('cfg-endereco', c.endereco);
    set('cfg-cidade', c.cidade);
    set('cfg-cep', c.cep);
    set('cfg-telefone', c.telefone);
    set('cfg-email', c.email);
    set('cfg-cidade-emissao', c.cidade_emissao);
  }

  async function salvarConfigContratado() {
    const payload = {
      razao_social: document.getElementById('cfg-razao').value.trim() || null,
      cnpj: document.getElementById('cfg-cnpj').value.trim() || null,
      resp_legal: document.getElementById('cfg-resp').value.trim() || null,
      cpf: document.getElementById('cfg-cpf').value.trim() || null,
      rg: document.getElementById('cfg-rg').value.trim() || null,
      crea: document.getElementById('cfg-crea').value.trim() || null,
      crq: document.getElementById('cfg-crq').value.trim() || null,
      endereco: document.getElementById('cfg-endereco').value.trim() || null,
      cidade: document.getElementById('cfg-cidade').value.trim() || null,
      cep: document.getElementById('cfg-cep').value.trim() || null,
      telefone: document.getElementById('cfg-telefone').value.trim() || null,
      email: document.getElementById('cfg-email').value.trim() || null,
      cidade_emissao: document.getElementById('cfg-cidade-emissao').value.trim() || null,
      atualizado_em: new Date().toISOString()
    };
    try {
      if (configContratado && configContratado.id) {
        await api('config_contratado?id=eq.' + configContratado.id, 'PATCH', payload, 'return=minimal');
      } else {
        await api('config_contratado', 'POST', payload, 'return=minimal');
      }
      await carregarConfigContratado();
      alert('✓ Dados do contratado salvos com sucesso.');
    } catch(e) {
      console.error('Erro salvarConfigContratado:', e);
      alert('Erro ao salvar: ' + (e.message || e));
    }
  }


  // ============================================================
  // CARREGAR PROPOSTAS (chamado em carregarDados)
  // ============================================================
  async function carregarPropostas() {
    try {
      propostas = await api('propostas?select=*&order=numero.desc') || [];
    } catch(e) {
      console.error('Erro carregarPropostas:', e);
      propostas = [];
    }
  }


  // ============================================================
  // RENDER PROPOSTAS NO MODAL DO LEAD
  // ============================================================
  function renderPropostasDoLead(leadId) {
    const cont = document.getElementById('ver-lead-propostas-lista');
    if (!cont) return;
    const lista = propostas.filter(function(p){ return p.cliente_id === leadId; });
    const cntEl = document.getElementById('ver-lead-cnt-propostas');
    if (cntEl) cntEl.textContent = '(' + lista.length + ')';

    if (!lista.length) {
      cont.innerHTML = '<div class="hist-empty">Nenhuma proposta gerada ainda.<br/>Clique em "+ Gerar nova proposta" acima.</div>';
      return;
    }

    const statusMap = {
      rascunho:  { ic:'📝', label:'RASCUNHO',  bg:'#FFF3E0', cor:'#E65100' },
      enviada:   { ic:'📤', label:'ENVIADA',   bg:'#E3F2FD', cor:'#1565C0' },
      aceita:    { ic:'✅', label:'ACEITA',    bg:'#E8F5E9', cor:'#2E7D32' },
      recusada:  { ic:'❌', label:'RECUSADA',  bg:'#FFEBEE', cor:'#C62828' },
      vencida:   { ic:'⏰', label:'VENCIDA',   bg:'#F3F4F6', cor:'#6b7280' }
    };

    cont.innerHTML = lista.map(function(p) {
      const st = statusMap[p.status] || statusMap.rascunho;
      const dataStr = p.data_emissao ? new Date(p.data_emissao + 'T12:00:00').toLocaleDateString('pt-BR') : '';
      // FASE 11: Botões dinâmicos baseados no status
      let botoesAcao = '';
      // Sempre mostra "Gerar PDF" (abre HTML imprimível)
      botoesAcao += '<button class="btn btn-sm" style="background:#E3F2FD;color:#1565C0;border:1px solid #90CAF9;" onclick="event.stopPropagation();gerarPdfProposta(\'' + p.id + '\')" title="Gerar PDF imprimível">🖨️ Gerar PDF</button>';
      // "Enviar p/ cliente": só se ainda não foi enviada
      if (p.status === 'rascunho' || !p.status) {
        botoesAcao += '<button class="btn btn-sm" style="background:#E8F5E9;color:#2E7D32;border:1px solid #A5D6A7;" onclick="event.stopPropagation();enviarPropostaPraCliente(\'' + p.id + '\')" title="Marcar como enviada e abrir WhatsApp">📤 Enviar (WhatsApp)</button>';
      }
      // SEMANA 4.17: enviar por email — sempre disponível
      botoesAcao += '<button class="btn btn-sm" style="background:#FFF8E1;color:#9C7A00;border:1px solid #FFE082;" onclick="event.stopPropagation();enviarPropostaPorEmail(\'' + p.id + '\')" title="Abrir cliente de email com proposta">✉️ Email</button>';
      // Editar (sempre disponível)
      botoesAcao += '<button class="btn btn-sm btn-blue" onclick="event.stopPropagation();editarProposta(\'' + p.id + '\')" title="Editar proposta">✏️</button>';

      return '<div class="hist-item">' +
        '<div class="hist-icon" style="background:' + st.bg + ';color:' + st.cor + ';">' + st.ic + '</div>' +
        '<div class="hist-body">' +
          '<div class="hist-title-row">' +
            '<span class="hist-tipo">Nº ' + p.numero + ' · ' + fmtMoeda(p.valor_total) + '</span>' +
            '<span class="hist-data">' + dataStr + '</span>' +
            '<span style="background:' + st.bg + ';color:' + st.cor + ';font-size:9.5px;font-weight:700;padding:2px 7px;border-radius:9px;">' + st.label + '</span>' +
          '</div>' +
          (p.contratante_local ? '<div class="hist-desc">' + escapeHtml(p.contratante_local) + '</div>' : '') +
        '</div>' +
        '<div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end;">' +
          botoesAcao +
        '</div>' +
      '</div>';
    }).join('');
  }


  // ============================================================
  // ABRIR MODAL DE GERAR/EDITAR PROPOSTA
  // ============================================================
  async function abrirGerarProposta() {
    if (!leadAtualId) { alert('Lead não selecionado.'); return; }
    const l = (typeof leads !== 'undefined' ? leads : []).concat(typeof clientes !== 'undefined' ? clientes : []).find(function(x){ return x.id === leadAtualId; });
    if (!l) { alert('Lead não encontrado.'); return; }

    // Garante que config Zello tá carregado
    if (!configContratado) await carregarConfigContratado();
    if (!configContratado) {
      alert('⚠ Dados do CONTRATADO não configurados.\n\nVá em Configurações → Dados do CONTRATADO antes de gerar propostas.');
      return;
    }

    // Pega próximo número (consulta a sequence)
    let proximoNum = null;
    try {
      // Workaround: como anon talvez não tenha permissão pra chamar nextval direto,
      // pega o último número usado e soma 1.
      const ultimas = await api('propostas?select=numero&order=numero.desc&limit=1');
      const ultimo = (ultimas && ultimas[0]) ? ultimas[0].numero : 26142;
      proximoNum = Math.max(ultimo + 1, 26143);
    } catch(e) {
      proximoNum = 26143;
    }

    document.getElementById('prop-titulo').textContent = '📄 Gerar Proposta Comercial';
    document.getElementById('proposta-sub').textContent = 'Cliente: ' + l.nome;
    document.getElementById('prop-id').value = '';
    document.getElementById('prop-cliente-id').value = leadAtualId;
    document.getElementById('prop-numero').value = proximoNum;
    // SEMANA 4.16: Data — puxa do lead se preenchida, senão hoje
    document.getElementById('prop-data').value = l.data_proposta || getDataHojeBR();
    document.getElementById('prop-cidade-emissao').value = configContratado.cidade_emissao || 'Ribeirão Preto';

    // ============================================================
    // FASE 6: Auto-preencher CONTRATANTE com TODOS os dados do lead
    // ============================================================
    // CPF/CNPJ: prioriza cpf_cnpj (mais recente), fallback pra cpf
    const docCliente = l.cpf_cnpj || l.cpf || '';

    // Cidade + UF (compõe se houver)
    const cidadeCompleta = l.cidade || '';

    // Telefone: prioriza telefone1, fallback pra telefone genérico
    const telefone = l.telefone1 || l.telefone || '';

    // Monta contato completo: nome + telefone + email
    let contatoMontado = (l.nome || '');
    if (telefone) contatoMontado += ' · ' + telefone;
    if (l.email) contatoMontado += ' · ' + l.email;

    // Busca propriedades vinculadas ao lead pra preencher "local do empreendimento"
    let localEmp = '';
    try {
      const propsLead = (typeof propriedades !== 'undefined' ? propriedades : [])
        .filter(function(p){ return p.cliente_id === leadAtualId; });
      if (propsLead.length === 1) {
        // 1 propriedade só: usa o nome dela
        localEmp = propsLead[0].nome || '';
        if (propsLead[0].cidade && propsLead[0].cidade !== cidadeCompleta) {
          localEmp += ' - ' + propsLead[0].cidade;
        }
      } else if (propsLead.length > 1) {
        // Várias: lista os nomes
        localEmp = propsLead.map(function(p){ return p.nome; }).filter(Boolean).join(' / ');
      } else if (l.endereco) {
        // Sem propriedade cadastrada, usa endereço do cliente
        localEmp = l.endereco;
      }
    } catch(e) {
      console.warn('Erro ao buscar propriedades do lead:', e);
    }

    document.getElementById('prop-c-nome').value = l.nome || '';
    document.getElementById('prop-c-cnpj').value = docCliente;
    document.getElementById('prop-c-cidade').value = cidadeCompleta;
    document.getElementById('prop-c-local').value = localEmp;
    document.getElementById('prop-c-contato').value = contatoMontado;

    // CONTRATADO (resumo readonly)
    renderResumoContratado();

    // Conteúdo (templates pré-preenchidos pra economizar digitação)
    document.getElementById('prop-desc-servicos').value = 'Elaboração de processo de regularização ambiental de uso de recursos hídricos junto ao DAEE (Departamento de Águas e Energia Elétrica), incluindo:\n\n1. Vistoria técnica e cadastro do empreendimento;\n2. Elaboração de memorial descritivo e plantas técnicas;\n3. Protocolo do processo junto ao DAEE;\n4. Acompanhamento do processo até a publicação da outorga.';
    document.getElementById('prop-forma-pgto').value = 'O pagamento pelos serviços contratados será realizado pelo CONTRATANTE em 2 (duas) parcelas, por meio de boleto bancário, sendo a primeira devida na assinatura desta proposta e a segunda após a emissão da resposta pela CETESB.';
    document.getElementById('prop-observacao').value = 'As taxas, emolumentos e quaisquer outros custos cobrados pelo órgão ambiental, incluindo a CETESB, serão de inteira responsabilidade do CONTRATANTE, não estando inclusos no valor dos serviços ora contratados.';
    document.getElementById('prop-consideracoes').value = 'Os serviços serão prestados por profissional legalmente habilitado, com experiência comprovada assegurando o atendimento aos princípios da legalidade, eficiência e segurança técnica e jurídica.';

    // Reset lista de serviços — SEMANA 4.16: pré-popula com valor do lead
    const valorLead = parseFloat(l.valor_proposta) || 0;
    _propServicos = [{
      descricao: '',
      valor: valorLead
    }];
    renderListaServicosProposta();

    // Status hide
    document.getElementById('prop-status-wrap').style.display = 'none';
    document.getElementById('btn-prop-excluir').style.display = 'none';

    abrirModal('ov-gerar-proposta');
  }

  function renderResumoContratado() {
    const c = configContratado || {};
    const html = (c.razao_social || '—') + ' · CNPJ ' + (c.cnpj || '—') + '<br/>' +
                 (c.resp_legal || '—') + '<br/>' +
                 'CPF ' + (c.cpf || '—') + ' · CREA ' + (c.crea || '—') + ' · CRQ ' + (c.crq || '—') + '<br/>' +
                 (c.endereco || '—') + ', ' + (c.cidade || '—');
    document.getElementById('prop-contratado-resumo').innerHTML = html;
  }


  // ============================================================
  // EDITAR PROPOSTA EXISTENTE
  // ============================================================
  async function editarProposta(propId) {
    const p = propostas.find(function(x){ return x.id === propId; });
    if (!p) { alert('Proposta não encontrada.'); return; }
    if (!configContratado) await carregarConfigContratado();

    document.getElementById('prop-titulo').textContent = '✏️ Editar Proposta Nº ' + p.numero;
    document.getElementById('proposta-sub').textContent = p.contratante_nome;
    document.getElementById('prop-id').value = propId;
    document.getElementById('prop-cliente-id').value = p.cliente_id || '';
    document.getElementById('prop-numero').value = p.numero;
    document.getElementById('prop-data').value = p.data_emissao || '';
    document.getElementById('prop-cidade-emissao').value = p.cidade_emissao || '';

    document.getElementById('prop-c-nome').value = p.contratante_nome || '';
    document.getElementById('prop-c-cnpj').value = p.contratante_cnpj || '';
    document.getElementById('prop-c-cidade').value = p.contratante_cidade || '';
    document.getElementById('prop-c-local').value = p.contratante_local || '';
    document.getElementById('prop-c-contato').value = p.contratante_contato || '';

    renderResumoContratado();

    document.getElementById('prop-desc-servicos').value = p.descricao_servicos || '';
    document.getElementById('prop-forma-pgto').value = p.forma_pagamento || '';
    document.getElementById('prop-observacao').value = p.observacao || '';
    document.getElementById('prop-consideracoes').value = p.consideracoes_finais || '';

    // Carrega serviços
    try {
      const servs = await api('proposta_servicos?proposta_id=eq.' + propId + '&order=ordem.asc&select=*');
      _propServicos = (servs || []).map(function(s){ return { descricao: s.descricao, valor: parseFloat(s.valor) || 0 }; });
      if (!_propServicos.length) _propServicos = [{ descricao:'', valor:0 }];
    } catch(e) {
      _propServicos = [{ descricao:'', valor:0 }];
    }
    renderListaServicosProposta();

    document.getElementById('prop-status-wrap').style.display = '';
    document.getElementById('prop-status').value = p.status || 'rascunho';
    document.getElementById('btn-prop-excluir').style.display = '';

    abrirModal('ov-gerar-proposta');
  }


  // ============================================================
  // LISTA DE SERVIÇOS DA PROPOSTA (dinâmica)
  // ============================================================
  let _propServicos = [{ descricao:'', valor:0 }];

  function renderListaServicosProposta() {
    const cont = document.getElementById('prop-servicos-lista');
    if (!cont) return;
    let html = '<table style="width:100%;border-collapse:collapse;font-size:12px;">' +
      '<thead><tr style="background:#f3f4f6;">' +
        '<th style="text-align:left;padding:8px;width:50px;">#</th>' +
        '<th style="text-align:left;padding:8px;">Descrição</th>' +
        '<th style="text-align:right;padding:8px;width:140px;">Valor (R$)</th>' +
        '<th style="width:40px;"></th>' +
      '</tr></thead><tbody>';
    _propServicos.forEach(function(s, idx) {
      html += '<tr>' +
        '<td style="padding:6px;color:var(--text-muted);font-weight:600;">' + (idx + 1) + '</td>' +
        '<td style="padding:4px;"><input class="fi upper" type="text" value="' + escapeHtml(s.descricao) + '" oninput="atualizarServicoProposta(' + idx + ',\'descricao\',this.value)" placeholder="Ex: Consulta CETESB" /></td>' +
        '<td style="padding:4px;"><input class="fi" type="number" step="0.01" min="0" value="' + (s.valor || '') + '" oninput="atualizarServicoProposta(' + idx + ',\'valor\',this.value)" style="text-align:right;" /></td>' +
        '<td style="padding:4px;text-align:center;">' +
          (_propServicos.length > 1 ? '<button class="btn btn-sm btn-danger" onclick="removerServicoProposta(' + idx + ')" title="Remover">×</button>' : '') +
        '</td>' +
      '</tr>';
    });
    html += '</tbody></table>';
    cont.innerHTML = html;
    recalcularTotalProposta();
  }

  function atualizarServicoProposta(idx, campo, valor) {
    if (!_propServicos[idx]) return;
    if (campo === 'valor') {
      _propServicos[idx].valor = parseFloat(valor) || 0;
    } else {
      _propServicos[idx].descricao = valor;
    }
    recalcularTotalProposta();
  }

  function addServicoProposta() {
    _propServicos.push({ descricao:'', valor:0 });
    renderListaServicosProposta();
  }

  function removerServicoProposta(idx) {
    if (_propServicos.length <= 1) return;
    _propServicos.splice(idx, 1);
    renderListaServicosProposta();
  }

  function recalcularTotalProposta() {
    const total = _propServicos.reduce(function(acc, s){ return acc + (parseFloat(s.valor) || 0); }, 0);
    const el = document.getElementById('prop-valor-total');
    if (el) el.textContent = fmtMoeda(total);
  }


  // ============================================================
  // SALVAR / GERAR PROPOSTA
  // ============================================================
  function _validarProposta() {
    const nome = document.getElementById('prop-c-nome').value.trim();
    const desc = document.getElementById('prop-desc-servicos').value.trim();
    const forma = document.getElementById('prop-forma-pgto').value.trim();
    if (!nome) { alert('Razão social/Nome do CONTRATANTE é obrigatório.'); return null; }
    if (!desc) { alert('Descrição dos serviços é obrigatória.'); return null; }
    if (!forma) { alert('Forma de pagamento é obrigatória.'); return null; }
    if (!_propServicos.length || _propServicos.every(function(s){ return !s.descricao || !s.valor; })) {
      alert('Adicione pelo menos 1 serviço com descrição e valor.');
      return null;
    }
    const servicosValidos = _propServicos.filter(function(s){ return s.descricao && s.valor > 0; });
    if (!servicosValidos.length) { alert('Nenhum serviço válido foi preenchido.'); return null; }
    const total = servicosValidos.reduce(function(a,s){ return a + s.valor; }, 0);
    if (total <= 0) { alert('Valor total deve ser maior que zero.'); return null; }

    const cId = document.getElementById('prop-cliente-id').value;
    const c = configContratado || {};

    return {
      cliente_id: cId || null,
      contratante_nome: upper(nome),
      contratante_cnpj: document.getElementById('prop-c-cnpj').value.trim() || null,
      contratante_local: upper(document.getElementById('prop-c-local').value.trim()) || null,
      contratante_cidade: upper(document.getElementById('prop-c-cidade').value.trim()) || null,
      contratante_contato: upper(document.getElementById('prop-c-contato').value.trim()) || null,

      contratado_razao: c.razao_social || '',
      contratado_cnpj: c.cnpj || null,
      contratado_resp: c.resp_legal || null,
      contratado_cpf: c.cpf || null,
      contratado_rg: c.rg || null,
      contratado_crea: c.crea || null,
      contratado_crq: c.crq || null,
      contratado_endereco: c.endereco || null,
      contratado_cidade: c.cidade || null,
      contratado_cep: c.cep || null,
      contratado_telefone: c.telefone || null,
      contratado_email: c.email || null,

      descricao_servicos: desc,
      forma_pagamento: forma,
      observacao: document.getElementById('prop-observacao').value.trim() || null,
      consideracoes_finais: document.getElementById('prop-consideracoes').value.trim() || null,

      valor_total: total,
      cidade_emissao: document.getElementById('prop-cidade-emissao').value.trim() || c.cidade_emissao || null,
      data_emissao: document.getElementById('prop-data').value || getDataHojeBR(),

      servicosValidos: servicosValidos
    };
  }

  async function salvarPropostaRascunho() {
    const dados = _validarProposta();
    if (!dados) return;
    const servicos = dados.servicosValidos;
    delete dados.servicosValidos;
    dados.status = 'rascunho';

    const btn = document.getElementById('btn-prop-rascunho');
    btn.disabled = true; btn.textContent = '⏳ Salvando...';

    try {
      let propId = document.getElementById('prop-id').value;
      if (propId) {
        // update
        dados.atualizado_em = new Date().toISOString();
        await api('propostas?id=eq.' + propId, 'PATCH', dados, 'return=minimal');
        // re-cria serviços
        await api('proposta_servicos?proposta_id=eq.' + propId, 'DELETE', null, 'return=minimal');
      } else {
        // insert (sem incluir status no payload pra usar default OU mantém rascunho)
        const sess = getSessao();
        dados.criado_por = (sess && sess.nome) ? sess.nome : (sess && sess.email ? sess.email : 'admin');
        const r = await api('propostas', 'POST', dados, 'return=representation');
        if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));
        const data = await r.json();
        propId = data && data[0] && data[0].id;
        if (!propId) throw new Error('Resposta sem ID');
        document.getElementById('prop-id').value = propId;
      }

      // FASE 6 FIX: bulk insert
      if (servicos.length > 0) {
        const payloadServicos = servicos.map(function(s, i) {
          return {
            proposta_id: propId,
            ordem: i,
            descricao: upper(s.descricao),
            valor: s.valor
          };
        });
        await api('proposta_servicos', 'POST', payloadServicos, 'return=minimal');
      }

      // SEMANA 4.16: sincroniza valor + data de volta no lead/cliente
      // (assim a próxima vez que abrir o lead, já aparece o valor atualizado)
      const clienteId = document.getElementById('prop-cliente-id').value;
      if (clienteId) {
        try {
          await api('clientes?id=eq.' + clienteId, 'PATCH', {
            valor_proposta: dados.valor_total,
            data_proposta: dados.data_emissao
          }, 'return=minimal');
        } catch(eSync) { console.warn('Não sincronizou valor no lead:', eSync); }
      }

      await carregarPropostas();
      await carregarDados();   // SEMANA 4.16: recarrega leads pra refletir o valor atualizado
      fecharModal('ov-gerar-proposta');
      if (leadAtualId) renderPropostasDoLead(leadAtualId);
      toastSuccess('✓ Rascunho salvo!');
    } catch(e) {
      console.error('Erro salvarPropostaRascunho:', e);
      alert('Erro ao salvar: ' + (e.message || e));
    } finally {
      btn.disabled = false; btn.textContent = '💾 Salvar rascunho';
    }
  }

  // ============================================================
  // FASE 11: salvarProposta — salva no banco SEM gerar PDF
  // PDF é gerado on-demand quando clica "🖨️ Gerar PDF" no card da proposta.
  // Auto-mover do lead só acontece quando clica "📤 Enviar p/ cliente".
  // ============================================================
  async function salvarProposta() {
    const dados = _validarProposta();
    if (!dados) return;
    const servicos = dados.servicosValidos;
    delete dados.servicosValidos;

    const btn = document.getElementById('btn-prop-gerar');
    btn.disabled = true; btn.textContent = '⏳ Salvando...';

    try {
      let propId = document.getElementById('prop-id').value;
      let numero = parseInt(document.getElementById('prop-numero').value, 10);

      // Define status: se já existe e estava 'enviada' (etc), mantém. Senão, 'rascunho'.
      if (propId) {
        // Edição: preserva status atual (não força nada)
        delete dados.status;
        delete dados.data_envio;
        dados.atualizado_em = new Date().toISOString();
        await api('propostas?id=eq.' + propId, 'PATCH', dados, 'return=minimal');
        await api('proposta_servicos?proposta_id=eq.' + propId, 'DELETE', null, 'return=minimal');
      } else {
        // Nova proposta: status rascunho até o usuário clicar "Enviar"
        dados.status = 'rascunho';
        const sess = getSessao();
        dados.criado_por = (sess && sess.nome) ? sess.nome : (sess && sess.email ? sess.email : 'admin');
        const r = await api('propostas', 'POST', dados, 'return=representation');
        if (!r || !r.ok) throw new Error('HTTP ' + (r ? r.status : '?'));
        const data = await r.json();
        propId = data && data[0] && data[0].id;
        numero = data && data[0] && data[0].numero;
        if (!propId) throw new Error('Resposta sem ID');
      }

      // Bulk insert dos serviços
      if (servicos.length > 0) {
        const payloadServicos = servicos.map(function(s, i) {
          return {
            proposta_id: propId,
            ordem: i,
            descricao: upper(s.descricao),
            valor: s.valor
          };
        });
        await api('proposta_servicos', 'POST', payloadServicos, 'return=minimal');
      }

      // SEMANA 4.16: sincroniza valor + data no lead/cliente
      const clienteId = document.getElementById('prop-cliente-id').value;
      if (clienteId) {
        try {
          await api('clientes?id=eq.' + clienteId, 'PATCH', {
            valor_proposta: dados.valor_total,
            data_proposta: dados.data_emissao
          }, 'return=minimal');
        } catch(eSync) { console.warn('Não sincronizou valor no lead:', eSync); }
      }

      await carregarPropostas();
      await carregarDados();   // SEMANA 4.16: reflete o valor atualizado no kanban
      fecharModal('ov-gerar-proposta');
      if (leadAtualId) renderPropostasDoLead(leadAtualId);

      toastSuccess('✓ Proposta nº ' + numero + ' salva!', 4500);
    } catch(e) {
      console.error('Erro salvarProposta:', e);
      alert('Erro ao salvar proposta: ' + (e.message || e));
    } finally {
      btn.disabled = false; btn.textContent = '💾 Salvar Proposta';
    }
  }

  // ============================================================
  // FASE 11: gerarPdfProposta — abre HTML imprimível em nova aba
  // ============================================================
  async function gerarPdfProposta(propId) {
    if (!propId) return;
    const prop = (typeof propostas !== 'undefined' ? propostas : []).find(function(p){ return p.id === propId; });
    if (!prop) { alert('Proposta não encontrada.'); return; }

    // Busca serviços
    let servicos = [];
    try {
      servicos = await api('proposta_servicos?proposta_id=eq.' + propId + '&order=ordem.asc&select=*') || [];
    } catch(e) {
      console.error('Erro ao buscar serviços:', e);
      alert('Erro ao buscar serviços da proposta.');
      return;
    }

    // Garante configContratado
    if (!configContratado) await carregarConfigContratado();

    // Monta dados com merge da proposta + config Zello (campos editáveis em prop.algo, fallback em config)
    const dadosCompletos = Object.assign({}, prop);
    // Garante campos do CONTRATADO mesmo se a proposta não os tiver explicitamente
    if (configContratado) {
      dadosCompletos.contratado_razao = prop.contratado_razao || configContratado.razao_social;
      dadosCompletos.contratado_cnpj = prop.contratado_cnpj || configContratado.cnpj;
      dadosCompletos.contratado_resp = prop.contratado_resp || configContratado.resp_legal;
      dadosCompletos.contratado_cpf = prop.contratado_cpf || configContratado.cpf;
      dadosCompletos.contratado_rg = prop.contratado_rg || configContratado.rg;
      dadosCompletos.contratado_crea = prop.contratado_crea || configContratado.crea;
      dadosCompletos.contratado_crq = prop.contratado_crq || configContratado.crq;
      dadosCompletos.contratado_endereco = prop.contratado_endereco || configContratado.endereco;
      dadosCompletos.contratado_cidade = prop.contratado_cidade || configContratado.cidade;
      dadosCompletos.contratado_cep = prop.contratado_cep || configContratado.cep;
      dadosCompletos.contratado_telefone = prop.contratado_telefone || configContratado.telefone;
      dadosCompletos.contratado_email = prop.contratado_email || configContratado.email;
    }

    // Monta HTML completo de página imprimível
    const htmlInterno = montarHtmlProposta(prop.numero, dadosCompletos, servicos);
    const pageHtml = montarPaginaImprimivel(prop.numero, htmlInterno);

    // Abre nova aba
    const novaAba = window.open('', '_blank');
    if (!novaAba) {
      alert('⚠ Pop-up bloqueado.\n\nPermita pop-ups deste site nas configurações do navegador e tente novamente.');
      return;
    }
    novaAba.document.open();
    novaAba.document.write(pageHtml);
    novaAba.document.close();
  }

  // Monta a página HTML completa (com header de impressão + botão imprimir)
  function montarPaginaImprimivel(numero, htmlProposta) {
    return '<!DOCTYPE html>' +
'<html lang="pt-BR">' +
'<head>' +
'<meta charset="UTF-8">' +
'<title>Proposta Nº ' + numero + ' — Zello Ambiental</title>' +
'<style>' +
'  * { box-sizing: border-box; }' +
'  body { margin: 0; padding: 0; background: #e5e7eb; font-family: Helvetica, Arial, sans-serif; }' +
'  .toolbar {' +
'    position: sticky; top: 0; z-index: 100;' +
'    background: #1565C0; color: white;' +
'    padding: 12px 20px;' +
'    display: flex; align-items: center; justify-content: space-between;' +
'    box-shadow: 0 2px 8px rgba(0,0,0,0.2);' +
'  }' +
'  .toolbar-info { font-size: 14px; }' +
'  .toolbar-info strong { font-size: 16px; }' +
'  .toolbar-actions { display: flex; gap: 10px; }' +
'  .btn-print {' +
'    background: white; color: #1565C0;' +
'    border: none; padding: 10px 20px;' +
'    border-radius: 6px; font-weight: 700;' +
'    font-size: 14px; cursor: pointer;' +
'    box-shadow: 0 2px 4px rgba(0,0,0,0.2);' +
'  }' +
'  .btn-print:hover { background: #f3f4f6; }' +
'  .btn-fechar {' +
'    background: transparent; color: white;' +
'    border: 1px solid white; padding: 10px 16px;' +
'    border-radius: 6px; font-size: 13px; cursor: pointer;' +
'  }' +
'  .help {' +
'    background: #FFF9C4; color: #6D5500;' +
'    padding: 10px 20px; font-size: 12px;' +
'    border-bottom: 1px solid #F9A825;' +
'    text-align: center;' +
'  }' +
'  .page-container {' +
'    max-width: 820px; margin: 20px auto;' +
'    background: white;' +
'    box-shadow: 0 4px 20px rgba(0,0,0,0.1);' +
'  }' +
'  @media print {' +
'    .toolbar, .help { display: none !important; }' +
'    body { background: white; }' +
'    .page-container { max-width: 100%; margin: 0; box-shadow: none; }' +
'    @page { size: A4; margin: 1cm; }' +
'  }' +
'</style>' +
'</head>' +
'<body>' +
'<div class="toolbar">' +
'  <div class="toolbar-info">' +
'    <strong>Proposta Nº ' + numero + '</strong>' +
'    <span style="opacity:0.85;margin-left:10px;">Zello Ambiental</span>' +
'  </div>' +
'  <div class="toolbar-actions">' +
'    <button class="btn-fechar" onclick="window.close()">✕ Fechar</button>' +
'    <button class="btn-print" onclick="window.print()">🖨️ Imprimir / Salvar como PDF</button>' +
'  </div>' +
'</div>' +
'<div class="help">' +
'  📋 Clique em <strong>"Imprimir / Salvar como PDF"</strong> acima.' +
'  No dialog do navegador, escolha <strong>"Salvar como PDF"</strong> em vez de uma impressora.' +
'</div>' +
'<div class="page-container">' + htmlProposta + '</div>' +
'</body></html>';
  }

  // ============================================================
  // FASE 11: enviarPropostaPraCliente — marca como enviada, auto-move lead, abre WhatsApp
  // ============================================================
  // SEMANA 4.17: Abre cliente de email com proposta
  // Limitação técnica: mailto: NÃO pode anexar arquivos (segurança do navegador).
  // Solução: copia URL do PDF pro corpo do email + abre mailto + também oferece copiar link.
  async function enviarPropostaPorEmail(propId) {
    if (!propId) return;
    const prop = (typeof propostas !== 'undefined' ? propostas : []).find(function(p){ return p.id === propId; });
    if (!prop) { toastError('Proposta não encontrada.'); return; }

    const cliente = (typeof leads !== 'undefined' ? leads : []).concat(typeof clientes !== 'undefined' ? clientes : []).find(function(c){ return c.id === prop.cliente_id; });
    if (!cliente) { toastError('Cliente da proposta não encontrado.'); return; }

    const email = cliente.email || '';
    if (!email) {
      toastWarn('⚠ Cliente não tem email cadastrado. Edite o lead e adicione um email primeiro.');
      return;
    }

    // Monta corpo do email
    const valor = 'R$ ' + (parseFloat(prop.valor_total) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const assunto = 'Proposta Comercial nº ' + prop.numero + ' - Zello Ambiental';
    const corpo =
      'Olá ' + (cliente.nome || '') + ',\n\n' +
      'Conforme conversado, segue a proposta comercial para os serviços de regularização ambiental.\n\n' +
      '──────────────────────────\n' +
      'Proposta nº: ' + prop.numero + '\n' +
      'Valor total: ' + valor + '\n' +
      'Data de emissão: ' + (prop.data_emissao ? new Date(prop.data_emissao + 'T12:00:00').toLocaleDateString('pt-BR') : '') + '\n' +
      '──────────────────────────\n\n' +
      'O arquivo da proposta segue em anexo.\n\n' +
      'Qualquer dúvida estou à disposição.\n\n' +
      'Atenciosamente,\n' +
      'Eng. Guilherme Montanari\n' +
      'Zello Ambiental\n' +
      'CREA 5069519852';

    // Pergunta como prefere abrir
    const opcao = await _escolherClienteEmail();
    if (!opcao) return;

    // Gera o PDF primeiro (em nova aba) — o usuário arrasta/anexa manualmente
    toastInfo('📄 Abrindo proposta em nova aba — anexe o PDF no email manualmente.', 6000);
    gerarPdfProposta(propId);

    // Aguarda 500ms e abre o cliente de email
    setTimeout(function(){
      if (opcao === 'gmail') {
        const url = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(email) +
          '&su=' + encodeURIComponent(assunto) + '&body=' + encodeURIComponent(corpo);
        window.open(url, '_blank');
      } else if (opcao === 'outlook') {
        const url = 'https://outlook.live.com/mail/0/deeplink/compose?to=' + encodeURIComponent(email) +
          '&subject=' + encodeURIComponent(assunto) + '&body=' + encodeURIComponent(corpo);
        window.open(url, '_blank');
      } else {
        // mailto: padrão (abre cliente nativo)
        window.location.href = 'mailto:' + encodeURIComponent(email) +
          '?subject=' + encodeURIComponent(assunto) + '&body=' + encodeURIComponent(corpo);
      }

      // Marca proposta como enviada se ainda for rascunho
      if (prop.status === 'rascunho' || !prop.status) {
        setTimeout(function(){
          api('propostas?id=eq.' + propId, 'PATCH', {
            status: 'enviada',
            data_envio: new Date().toISOString(),
            atualizado_em: new Date().toISOString()
          }, 'return=minimal').then(function(){
            carregarPropostas().then(function(){
              if (leadAtualId) renderPropostasDoLead(leadAtualId);
              renderProspeccaoKanban();
            });
          }).catch(function(e){ console.warn('Não atualizou status:', e); });
        }, 2000);
      }
    }, 500);
  }

  // SEMANA 4.17: Pergunta qual cliente de email usar (cache em localStorage)
  async function _escolherClienteEmail() {
    // Se admin já escolheu antes, usa o salvo
    const salvo = localStorage.getItem('z_cliente_email');
    if (salvo === 'gmail' || salvo === 'outlook' || salvo === 'mailto') return salvo;

    return new Promise(function(resolve){
      // Cria um modal simples
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10001;display:flex;align-items:center;justify-content:center;';
      overlay.innerHTML =
        '<div style="background:white;border-radius:12px;padding:20px;max-width:380px;box-shadow:0 8px 32px rgba(0,0,0,0.2);">' +
          '<div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:6px;">✉️ Como enviar o email?</div>' +
          '<div style="font-size:12px;color:var(--text-muted);margin-bottom:14px;">Escolha seu cliente de email preferido. Vamos lembrar pra próxima.</div>' +
          '<div style="display:flex;flex-direction:column;gap:8px;">' +
            '<button class="btn" data-op="gmail" style="background:#D44638;color:white;border:none;text-align:left;padding:10px 14px;font-size:13px;font-weight:600;">📧 Gmail (no navegador)</button>' +
            '<button class="btn" data-op="outlook" style="background:#0078D4;color:white;border:none;text-align:left;padding:10px 14px;font-size:13px;font-weight:600;">📧 Outlook.com (no navegador)</button>' +
            '<button class="btn" data-op="mailto" style="background:#1565C0;color:white;border:none;text-align:left;padding:10px 14px;font-size:13px;font-weight:600;">💻 Cliente padrão do sistema</button>' +
            '<button class="btn" data-op="" style="background:#f3f4f6;color:var(--text);border:none;text-align:center;padding:8px;font-size:12px;">Cancelar</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
      overlay.onclick = function(e){
        if (e.target.tagName === 'BUTTON') {
          const op = e.target.getAttribute('data-op');
          document.body.removeChild(overlay);
          if (op) {
            try { localStorage.setItem('z_cliente_email', op); } catch(_){}
            resolve(op);
          } else {
            resolve(null);
          }
        }
      };
    });
  }

  async function enviarPropostaPraCliente(propId) {
    if (!propId) return;
    const prop = (typeof propostas !== 'undefined' ? propostas : []).find(function(p){ return p.id === propId; });
    if (!prop) { alert('Proposta não encontrada.'); return; }

    // Confirma com usuário
    const conf = await zConfirm(
      'Marcar proposta nº ' + prop.numero + ' como ENVIADA?\n\n' +
      'Isso vai:\n' +
      '• Mudar status pra "Enviada" (com data de envio)\n' +
      '• Mover o lead pra coluna "Proposta" do kanban\n' +
      '• Abrir WhatsApp Web pra enviar mensagem',
      { btnOk: 'Sim, marcar como enviada' }
    );
    if (!conf) return;

    try {
      // 1. PATCH proposta: status enviada + data_envio
      await api('propostas?id=eq.' + propId, 'PATCH', {
        status: 'enviada',
        data_envio: new Date().toISOString(),
        atualizado_em: new Date().toISOString()
      }, 'return=minimal');

      // 2. Auto-mover lead pra "proposta" (se ainda estiver em novo/em_contato)
      let leadFoiMovido = false;
      let statusAnterior = null;
      if (prop.cliente_id) {
        const ld = (typeof leads !== 'undefined' ? leads : []).find(function(x){ return x.id === prop.cliente_id; });
        if (ld && (ld.status_lead === 'novo' || ld.status_lead === 'em_contato' || !ld.status_lead)) {
          statusAnterior = ld.status_lead || 'novo';
          await api('clientes?id=eq.' + prop.cliente_id, 'PATCH', { status_lead: 'proposta' }, 'return=minimal');
          ld.status_lead = 'proposta';
          leadFoiMovido = true;
        }
      }

      // 3. Recarrega dados e re-renderiza
      await carregarPropostas();
      if (leadAtualId) renderPropostasDoLead(leadAtualId);
      renderProspeccaoKanban();

      // ONDA 1 BUG#4: toast avisando que o lead foi movido automaticamente de coluna
      if (leadFoiMovido) {
        const labelAnterior = { novo: 'Novo', em_contato: 'Em contato' }[statusAnterior] || statusAnterior;
        if (typeof showToast === 'function') {
          showToast('✓ Lead movido de "' + labelAnterior + '" → "Proposta" no kanban', 'success', 4000);
        }
      }

      // 4. Abre WhatsApp
      const cliente = (typeof leads !== 'undefined' ? leads : []).concat(typeof clientes !== 'undefined' ? clientes : []).find(function(c){ return c.id === prop.cliente_id; });
      if (cliente && cliente.telefone1) {
        const tel = (cliente.telefone1 || '').replace(/\D/g, '');
        const telCompleto = tel.length === 11 ? '55' + tel : (tel.length === 10 ? '55' + tel : tel);
        const mensagem = encodeURIComponent(
          'Olá ' + (cliente.nome || '') + ',\n\n' +
          'Conforme conversado, segue a proposta de número ' + prop.numero + ' para os serviços de regularização ambiental.\n\n' +
          'Valor total: ' + fmtMoeda(prop.valor_total || 0) + '\n\n' +
          'Estou à disposição para esclarecimentos.\n\n' +
          'Eng. Guilherme Montanari\nZello Ambiental'
        );
        window.open('https://wa.me/' + telCompleto + '?text=' + mensagem, '_blank');
      } else {
        alert('✓ Proposta marcada como enviada.\n\n⚠ Cliente não tem telefone cadastrado, abra o WhatsApp manualmente.');
      }
    } catch(e) {
      console.error('Erro enviarPropostaPraCliente:', e);
      alert('Erro ao enviar proposta: ' + (e.message || e));
    }
  }


  // ============================================================
  // GERAÇÃO DO HTML→PDF
  // ============================================================
  function escNL(s) {
    if (s == null) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br/>');
  }

  function montarHtmlProposta(numero, d, servicos) {
    const c = d;  // alias
    const dataStr = c.data_emissao ? new Date(c.data_emissao + 'T12:00:00').toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' }) : '';
    const cidadeEmiss = c.cidade_emissao || 'Ribeirão Preto';

    let linhasServicos = '';
    servicos.forEach(function(s, idx) {
      linhasServicos += '<tr>' +
        '<td style="border:1px solid #999;padding:8px;text-align:center;font-size:11px;width:50px;color:#1a2332;">' + (idx+1) + '</td>' +
        '<td style="border:1px solid #999;padding:8px;font-size:11px;color:#1a2332;">' + escNL(s.descricao) + '</td>' +
        '<td style="border:1px solid #999;padding:8px;text-align:right;font-size:11px;font-family:monospace;width:140px;color:#1a2332;">' + fmtMoeda(s.valor) + '</td>' +
      '</tr>';
    });

    const total = servicos.reduce(function(a,s){ return a + s.valor; }, 0);

    // FASE 6: removido DOCTYPE/html/body (não funciona com innerHTML em div)
    // Estilo INLINE em cada elemento garante que html2canvas renderize corretamente.
    return '<div style="font-family:Helvetica,Arial,sans-serif;color:#1a2332;font-size:11px;line-height:1.5;background:white;padding:30px 40px;width:100%;box-sizing:border-box;">' +

// HEADER
'<div style="display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:14px;border-bottom:3px solid #1565C0;margin-bottom:24px;">' +
  '<div>' +
    '<div style="font-size:28px;font-weight:800;color:#1565C0;letter-spacing:1px;line-height:1;">ZELLO</div>' +
    '<div style="font-size:10px;color:#6b7280;margin-top:2px;">Ambiental</div>' +
  '</div>' +
  '<div style="text-align:right;font-size:10px;color:#4b5563;line-height:1.5;">' +
    '<strong style="color:#1565C0;">' + escNL(c.contratado_resp || 'Eng. Guilherme Montanari') + '</strong><br/>' +
    'Projetos e Consultoria Ambiental<br/>' +
    'CREA: ' + escNL(c.contratado_crea || '5069519852') +
  '</div>' +
'</div>' +

// TÍTULO
'<h1 style="font-size:22px;font-weight:800;text-align:center;color:#1a2332;margin:24px 0 18px;letter-spacing:0.5px;">PROPOSTA Nº ' + numero + '</h1>' +

// CONTRATADO
'<div style="background:#f3f4f6;padding:6px 10px;font-weight:700;font-size:12px;color:#1a2332;border-left:4px solid #1565C0;margin:16px 0 10px;">CONTRATADO: ZELLO AMBIENTAL</div>' +
'<div style="margin-bottom:4px;font-size:11px;color:#1a2332;"><strong style="color:#1565C0;">Razão Social:</strong> ' + escNL(c.contratado_razao) + ', CNPJ: ' + escNL(c.contratado_cnpj || '—') + '.</div>' +
'<div style="margin-bottom:4px;font-size:11px;color:#1a2332;"><strong style="color:#1565C0;">Resp. Legal:</strong> ' + escNL(c.contratado_resp || '—') + '.</div>' +
'<div style="margin-bottom:4px;font-size:11px;color:#1a2332;"><strong style="color:#1565C0;">CPF:</strong> ' + escNL(c.contratado_cpf || '—') +
  ', <strong style="color:#1565C0;">RG:</strong> ' + escNL(c.contratado_rg || '—') +
  ', <strong style="color:#1565C0;">CREA/SP:</strong> ' + escNL(c.contratado_crea || '—') +
  ', <strong style="color:#1565C0;">CRQ:</strong> ' + escNL(c.contratado_crq || '—') + '.</div>' +
'<div style="margin-bottom:4px;font-size:11px;color:#1a2332;"><strong style="color:#1565C0;">Endereço:</strong> ' + escNL(c.contratado_endereco || '—') + '.</div>' +
'<div style="margin-bottom:4px;font-size:11px;color:#1a2332;"><strong style="color:#1565C0;">Cidade:</strong> ' + escNL(c.contratado_cidade || '—') +
  (c.contratado_cep ? ', CEP: ' + escNL(c.contratado_cep) : '') + '.</div>' +
// FASE 12: Telefone e Email em linhas separadas
'<div style="margin-bottom:4px;font-size:11px;color:#1a2332;"><strong style="color:#1565C0;">Telefone:</strong> ' + escNL(c.contratado_telefone || '—') + '</div>' +
'<div style="margin-bottom:4px;font-size:11px;color:#1a2332;"><strong style="color:#1565C0;">E-mail:</strong> ' + escNL(c.contratado_email || '—') + '</div>' +

// CONTRATANTE
'<div style="background:#f3f4f6;padding:6px 10px;font-weight:700;font-size:12px;color:#1a2332;border-left:4px solid #1565C0;margin:16px 0 10px;">CONTRATANTE: ' + escNL(c.contratante_nome) + '</div>' +
(c.contratante_cnpj ? '<div style="margin-bottom:4px;font-size:11px;color:#1a2332;"><strong style="color:#1565C0;">CNPJ/CPF:</strong> ' + escNL(c.contratante_cnpj) + '</div>' : '') +
(c.contratante_local ? '<div style="margin-bottom:4px;font-size:11px;color:#1a2332;"><strong style="color:#1565C0;">Local:</strong> ' + escNL(c.contratante_local) + '</div>' : '') +
(c.contratante_cidade ? '<div style="margin-bottom:4px;font-size:11px;color:#1a2332;"><strong style="color:#1565C0;">Cidade:</strong> ' + escNL(c.contratante_cidade) + '.</div>' : '') +
(c.contratante_contato ? '<div style="margin-bottom:4px;font-size:11px;color:#1a2332;"><strong style="color:#1565C0;">Contato:</strong> ' + escNL(c.contratante_contato) + '</div>' : '') +

// DESCRIÇÃO
'<div style="background:#f3f4f6;padding:6px 10px;font-weight:700;font-size:12px;color:#1a2332;border-left:4px solid #1565C0;margin:16px 0 10px;">DESCRIÇÃO DOS SERVIÇOS</div>' +
'<div style="font-size:11px;text-align:justify;margin:8px 0 14px;line-height:1.6;color:#1a2332;">' + escNL(c.descricao_servicos) + '</div>' +

// VALORES
'<div style="background:#f3f4f6;padding:6px 10px;font-weight:700;font-size:12px;color:#1a2332;border-left:4px solid #1565C0;margin:16px 0 10px;">VALORES E FORMA DE PAGAMENTO</div>' +
'<table style="width:100%;border-collapse:collapse;margin:10px 0;">' +
  '<thead><tr>' +
    '<th style="background:#1565C0;color:white;padding:8px;font-size:11px;border:1px solid #1565C0;width:50px;">ITEM</th>' +
    '<th style="background:#1565C0;color:white;padding:8px;font-size:11px;border:1px solid #1565C0;text-align:left;">DESCRIÇÃO</th>' +
    '<th style="background:#1565C0;color:white;padding:8px;font-size:11px;border:1px solid #1565C0;width:140px;">VALOR</th>' +
  '</tr></thead>' +
  '<tbody>' + linhasServicos +
    '<tr>' +
      '<td style="font-weight:700;background:#f3f4f6;text-align:right;padding:8px;font-size:12px;border:1px solid #999;color:#1a2332;" colspan="2">TOTAL</td>' +
      '<td style="font-weight:700;background:#f3f4f6;text-align:right;padding:8px;font-size:12px;border:1px solid #999;font-family:monospace;color:#1a2332;">' + fmtMoeda(total) + '</td>' +
    '</tr>' +
  '</tbody>' +
'</table>' +
'<div style="font-size:11px;text-align:justify;margin:8px 0 14px;line-height:1.6;color:#1a2332;">' + escNL(c.forma_pagamento) + '</div>' +

// OBSERVAÇÃO
(c.observacao ? '<div style="background:#f3f4f6;padding:6px 10px;font-weight:700;font-size:12px;color:#1a2332;border-left:4px solid #1565C0;margin:16px 0 10px;">OBSERVAÇÃO</div><div style="font-size:11px;text-align:justify;margin:8px 0 14px;line-height:1.6;color:#1a2332;">' + escNL(c.observacao) + '</div>' : '') +

// CONSIDERAÇÕES
(c.consideracoes_finais ? '<div style="background:#f3f4f6;padding:6px 10px;font-weight:700;font-size:12px;color:#1a2332;border-left:4px solid #1565C0;margin:16px 0 10px;">CONSIDERAÇÕES FINAIS</div><div style="font-size:11px;text-align:justify;margin:8px 0 14px;line-height:1.6;color:#1a2332;">' + escNL(c.consideracoes_finais) + '</div>' : '') +

// DATA E ASSINATURAS
'<div style="margin-top:30px;text-align:right;font-size:11px;color:#1a2332;">' + escNL(cidadeEmiss) + ', ' + dataStr + '.</div>' +
'<div style="margin-top:14px;font-size:11px;text-align:justify;color:#1a2332;">E por estarem de acordo com as condições aqui descritas, as partes assinam a presente proposta em vias de igual teor e forma:</div>' +
'<div style="display:flex;justify-content:space-around;margin-top:50px;">' +
  '<div style="width:45%;text-align:center;"><div style="border-top:1px solid #1a2332;padding-top:6px;font-size:11px;font-weight:700;color:#1a2332;">CONTRATADO</div></div>' +
  '<div style="width:45%;text-align:center;"><div style="border-top:1px solid #1a2332;padding-top:6px;font-size:11px;font-weight:700;color:#1a2332;">CONTRATANTE</div></div>' +
'</div>' +

// FOOTER
'<div style="margin-top:30px;padding-top:14px;border-top:1px solid #e5e7eb;font-size:10px;color:#6b7280;text-align:center;">' +
  '📞 ' + escNL(c.contratado_telefone || '(16) 98142-7633') +
  '  ·  ✉ ' + escNL(c.contratado_email || 'contato@zelloambiental.com.br') +
  '  ·  🌐 www.zelloambiental.com.br' +
'</div>' +

'</div>';
  }

  // ============================================================
  // EXCLUIR PROPOSTA
  // ============================================================
  async function excluirPropostaConfirm() {
    const propId = document.getElementById('prop-id').value;
    if (!propId) return;
    const p = propostas.find(function(x){ return x.id === propId; });
    if (!p) return;
    if (!(await zConfirm('Excluir a proposta Nº ' + p.numero + '?\n\nO PDF no Storage NÃO será removido automaticamente.\nO número (' + p.numero + ') não será reutilizado.\n\nEsta ação não pode ser desfeita.', { tipo:'erro', btnOk:'Excluir proposta' }))) return;

    try {
      // Deleta serviços primeiro (FK CASCADE faria, mas explicit é seguro)
      await api('proposta_servicos?proposta_id=eq.' + propId, 'DELETE', null, 'return=minimal');
      await api('propostas?id=eq.' + propId, 'DELETE', null, 'return=minimal');
      await carregarPropostas();
      fecharModal('ov-gerar-proposta');
      if (leadAtualId) renderPropostasDoLead(leadAtualId);
      alert('✓ Proposta excluída.');
    } catch(e) {
      alert('Erro ao excluir: ' + (e.message || e));
    }
  }


  // ============================================================
  // INICIALIZAÇÃO: verifica login antes de carregar tudo
  // ============================================================

  // FASE 3B Item 3: força UPPERCASE em todos os campos .upper (input + textarea)
  // Listener global no document (event delegation). Pega inclusive inputs em modais criados após DOMContentLoaded.
  function instalarListenerUpper() {
    document.addEventListener('input', function(e) {
      const el = e.target;
      if (!el || !el.classList) return;
      if (!el.classList.contains('upper')) return;
      // Não transformar inputs do tipo email, url, password
      if (el.type === 'email' || el.type === 'url' || el.type === 'password') return;
      const v = el.value;
      if (!v) return;
      const up = v.toUpperCase();
      if (v !== up) {
        // Preserva posição do cursor
        const start = el.selectionStart;
        const end = el.selectionEnd;
        el.value = up;
        try { el.setSelectionRange(start, end); } catch(_) {}
      }
    }, true);
  }
  instalarListenerUpper();

  // SEMANA 4.13: Alterna tema dark/light
  function toggleTema() {
    const body = document.body;
    const novoTema = body.classList.toggle('theme-dark') ? 'dark' : 'light';
    try { localStorage.setItem('z_tema', novoTema); } catch(e){}
    const btn = document.getElementById('btn-tema');
    if (btn) btn.textContent = novoTema === 'dark' ? '☀️' : '🌙';
  }

  // Aplica tema salvo no boot
  function aplicarTemaSalvo() {
    try {
      const t = localStorage.getItem('z_tema');
      if (t === 'dark') {
        document.body.classList.add('theme-dark');
        const btn = document.getElementById('btn-tema');
        if (btn) btn.textContent = '☀️';
      }
    } catch(e){}
  }
  aplicarTemaSalvo();

  // SEMANA 4.13: Auto-save de drafts
  // Salva valores de inputs/textareas dentro de um modal a cada mudança no localStorage.
  // Restaura ao reabrir o modal, oferece "Descartar" se houver draft pendente.
  const _DRAFT_PREFIX = 'z_draft_';
  const _DRAFT_TTL = 24 * 60 * 60 * 1000;   // 24h

  function _salvarDraft(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const dados = {};
    modal.querySelectorAll('input, textarea, select').forEach(function(el){
      if (!el.id) return;
      if (el.type === 'file' || el.type === 'password' || el.type === 'hidden') return;
      if (el.type === 'checkbox' || el.type === 'radio') dados[el.id] = el.checked;
      else dados[el.id] = el.value;
    });
    if (Object.keys(dados).length === 0) return;
    try {
      localStorage.setItem(_DRAFT_PREFIX + modalId, JSON.stringify({
        ts: Date.now(),
        dados: dados
      }));
    } catch(e) { console.warn('Draft:', e); }
  }

  function _carregarDraft(modalId) {
    try {
      const raw = localStorage.getItem(_DRAFT_PREFIX + modalId);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || !obj.dados) return null;
      // Expira após 24h
      if (Date.now() - (obj.ts || 0) > _DRAFT_TTL) {
        localStorage.removeItem(_DRAFT_PREFIX + modalId);
        return null;
      }
      return obj.dados;
    } catch(e) { return null; }
  }

  function _limparDraft(modalId) {
    try { localStorage.removeItem(_DRAFT_PREFIX + modalId); } catch(e) {}
  }

  // Ativa auto-save num modal específico
  // - draftAtivo: array de IDs de modais que devem auto-salvar
  // - chame _instalarAutosaveDraft após abrir o modal
  function _instalarAutosaveDraft(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    // Restaura draft (se houver)
    const draft = _carregarDraft(modalId);
    if (draft) {
      const algumPreenchido = Object.values(draft).some(function(v){ return v && v !== false; });
      if (algumPreenchido) {
        showToast('📝 Rascunho recuperado de antes', 'info', 4000, {
          label: 'Descartar',
          fn: function(){
            _limparDraft(modalId);
            // Limpa os campos
            modal.querySelectorAll('input, textarea, select').forEach(function(el){
              if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
              else if (el.type !== 'file' && el.type !== 'hidden') el.value = '';
            });
          }
        });
        Object.entries(draft).forEach(function(pair){
          const el = document.getElementById(pair[0]);
          if (!el) return;
          if (el.type === 'checkbox' || el.type === 'radio') el.checked = !!pair[1];
          else if (el.type !== 'file' && el.type !== 'hidden') el.value = pair[1] || '';
        });
      }
    }
    // Instala listener de mudança (debounce 500ms)
    let timerId = null;
    modal.querySelectorAll('input, textarea, select').forEach(function(el){
      if (el._draftListener) return;
      el._draftListener = true;
      el.addEventListener('input', function(){
        clearTimeout(timerId);
        timerId = setTimeout(function(){ _salvarDraft(modalId); }, 500);
      });
      el.addEventListener('change', function(){
        clearTimeout(timerId);
        timerId = setTimeout(function(){ _salvarDraft(modalId); }, 500);
      });
    });
  }


  // ESC → fecha modal aberto
  // / ou Ctrl+K → foca busca
  // Ctrl+S → salva form aberto (procura primeiro botão de salvar visível)
  // N → novo lead (se estiver na tela de prospecção e nenhum modal aberto)
  function instalarAtalhosTeclado() {
    document.addEventListener('keydown', function(e){
      // Não interfere quando user está digitando em input/textarea
      const tag = (e.target.tagName || '').toUpperCase();
      const tipando = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable;

      // ESC fecha modal aberto (mesmo se estiver tipando)
      if (e.key === 'Escape') {
        const overlay = Array.from(document.querySelectorAll('.overlay')).reverse().find(function(o){
          return o.style.display === 'flex' || (window.getComputedStyle(o).display !== 'none' && o.style.display !== 'none');
        });
        if (overlay) {
          e.preventDefault();
          fecharModal(overlay.id);
          return;
        }
      }

      // Não tipa atalhos quando está digitando
      if (tipando) {
        // Exceção: Ctrl+S sempre funciona pra salvar
        if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          _atalhoSalvar();
        }
        return;
      }

      // /  → foca busca
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const busca = document.querySelector('input[type="search"], input[placeholder*="uscar"]');
        if (busca) { e.preventDefault(); busca.focus(); busca.select(); }
        return;
      }
      // Ctrl+K → foca busca
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        const busca = document.querySelector('input[type="search"], input[placeholder*="uscar"]');
        if (busca) { e.preventDefault(); busca.focus(); busca.select(); }
        return;
      }
      // Ctrl+S
      if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        _atalhoSalvar();
        return;
      }
      // N → novo lead (se na tela de prospecção)
      if (e.key === 'n' || e.key === 'N') {
        const tela = document.querySelector('.page[style*="display: block"]');
        if (tela && tela.id === 'page-leads') {
          const btnNovo = document.getElementById('btn-novo-lead-prospeccao') || document.querySelector('[onclick*="abrirCadastroLead"]');
          if (btnNovo) { e.preventDefault(); btnNovo.click(); }
        }
        return;
      }
    });
  }

  function _atalhoSalvar() {
    // Encontra modal aberto e clica no botão de "salvar" / primário (azul/verde)
    const overlay = Array.from(document.querySelectorAll('.overlay')).reverse().find(function(o){
      return o.style.display === 'flex' || (window.getComputedStyle(o).display !== 'none' && o.style.display !== 'none');
    });
    if (!overlay) return;
    // Procura primeiro botão que parece "salvar/confirmar/criar"
    const btns = overlay.querySelectorAll('button');
    for (let i = 0; i < btns.length; i++) {
      const txt = (btns[i].textContent || '').toLowerCase();
      if (txt.indexOf('salvar') >= 0 || txt.indexOf('confirm') >= 0 ||
          txt.indexOf('criar') >= 0 || txt.indexOf('avançar') >= 0 ||
          txt.indexOf('publicar') >= 0) {
        if (!btns[i].disabled) { btns[i].click(); return; }
      }
    }
  }

  instalarAtalhosTeclado();

  (async function inicializar(){
    const logado = await verificarLogin();
    if (!logado) {
      // Se não está logado, NÃO carrega os dados ainda. O login fará isso.
      return;
    }
    await carregarDados();
    carregarTodasCidades();
    setTimeout(carregarConfigEmpresa, 500);
    setTimeout(inicializarDragDropMenu, 100);
  })();

  // SEMANA 3.4: Registra Service Worker pra PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/service-worker.js')
        .then(function(reg) { console.log('[PWA] Service Worker registrado', reg.scope); })
        .catch(function(err) { console.warn('[PWA] Falha ao registrar SW:', err); });
    });
  }
