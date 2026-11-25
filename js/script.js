/* =========================================================================
   LANDING PAGE — ADVOGADA | CARTÃO DE VISITA DIGITAL (NFC)
   -------------------------------------------------------------------------
   TUDO O QUE VOCÊ PRECISA EDITAR ESTÁ NO BLOCO "CONFIG" ABAIXO.
   Não é necessário mexer em nenhuma outra parte do arquivo.
   ========================================================================= */

const CONFIG = {

  /* ---------------------------------------------------------------------
     1) NÚMERO DO WHATSAPP
     Formato internacional, somente números:
     55 (Brasil) + DDD + número.  Ex.: 5511987654321
     --------------------------------------------------------------------- */
  numeroWhatsApp: '5549991192594',

  /* ---------------------------------------------------------------------
     2) MENSAGENS DO WHATSAPP  ←←← EDITE AQUI
     Cada botão da página dispara uma mensagem diferente.
     Troque o texto entre aspas à vontade.
     Para quebrar linha dentro da mensagem, use \n
     --------------------------------------------------------------------- */
  mensagens: {
    padrao:    'Olá! Vim pelo seu cartão digital e gostaria de mais informações.',
    topo:      'Olá! Vim pelo seu cartão digital e gostaria de falar com a Dra. Jaqueline Vitória.',
    hero:      'Olá, Dra. Jaqueline Vitória! Vim pelo seu cartão digital e gostaria de tirar uma dúvida jurídica.',
    areas:     'Olá! Minha demanda não está na lista de áreas do site. Posso explicar meu caso?',
    lista:     'Olá! Gostaria de falar com a Dra. Jaqueline Vitória sobre um atendimento.',
    agendar:   'Olá! Gostaria de agendar uma conversa para analisar o meu caso.',
    flutuante: 'Olá! Vim pelo seu cartão digital e gostaria de atendimento.'
  },

  /* ---------------------------------------------------------------------
     3) DADOS DE CONTATO EXIBIDOS NA PÁGINA
     São preenchidos automaticamente no HTML.
     --------------------------------------------------------------------- */
  dados: {
    nome:     'Jaqueline Vitória',
    oab:      'SC 77.565 ',
    whatsapp: '(49) 9956-0862',
    telefone: '(00) 0000-0000',
    email:    'jaquelinealvesvitoria@outlook.com',
    endereco: 'Rua lages, nº 316, sala A  —  Centro, Curitibanos/SC',
    horario:  'Segunda a sexta, 09h–18h'
  },

  /* ---------------------------------------------------------------------
     4) LINKS DAS REDES SOCIAIS
     Deixe uma string vazia ('') para esconder o botão.
     --------------------------------------------------------------------- */
  redes: {
    instagram: 'https://www.instagram.com/jaquelinevitoriadvocacia/',
  },

  /* ---------------------------------------------------------------------
     5) CARTÃO DE CONTATO (botão "Salvar contato" / arquivo .vcf)
     --------------------------------------------------------------------- */
  cartaoContato: {
    nome:      'Dra. Jaqueline Vitória',
    cargo:     'Advogada — OAB/SC 77.565',
    escritorio:'Jaqueline Vitória Advocacia',
    site:      'https://[seudominio].adv.br'
  }

};

/* =========================================================================
   A PARTIR DAQUI É O FUNCIONAMENTO DA PÁGINA.
   Você não precisa alterar nada abaixo desta linha.
   ========================================================================= */


/* -------------------------------------------------------------------------
   WHATSAPP — métodos separados
   ------------------------------------------------------------------------- */

/**
 * Remove tudo o que não for número do telefone.
 * @param {string} numero
 * @returns {string}
 */
function limparNumero(numero) {
  return String(numero || '').replace(/\D/g, '');
}

/**
 * Devolve o texto da mensagem correspondente a uma chave de CONFIG.mensagens.
 * Se a chave não existir, usa a mensagem padrão.
 * @param {string} chave
 * @returns {string}
 */
function montarMensagem(chave) {
  const mensagens = CONFIG.mensagens || {};
  return mensagens[chave] || mensagens.padrao || '';
}

/**
 * Monta a URL do WhatsApp já com a mensagem codificada.
 * @param {string} chave
 * @returns {string}
 */
function gerarLinkWhatsApp(chave) {
  const numero = limparNumero(CONFIG.numeroWhatsApp);
  const texto = encodeURIComponent(montarMensagem(chave));
  return 'https://wa.me/' + numero + (texto ? '?text=' + texto : '');
}

/**
 * Abre o WhatsApp em uma nova aba com a mensagem pronta.
 * @param {string} chave
 */
function enviarWhatsApp(chave) {
  const numero = limparNumero(CONFIG.numeroWhatsApp);

  if (numero.length < 12) {
    console.warn('[WhatsApp] Configure CONFIG.numeroWhatsApp no formato 55DDDNUMERO.');
  }

  window.open(gerarLinkWhatsApp(chave), '_blank', 'noopener');
}


/* -------------------------------------------------------------------------
   SALVAR CONTATO (.vcf)
   ------------------------------------------------------------------------- */

/**
 * Monta o conteúdo do cartão de contato no padrão vCard 3.0.
 * @returns {string}
 */
function gerarVCard() {
  const c = CONFIG.cartaoContato;
  const d = CONFIG.dados;

  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:' + c.nome,
    'TITLE:' + c.cargo,
    'ORG:' + c.escritorio,
    'TEL;TYPE=CELL:+' + limparNumero(CONFIG.numeroWhatsApp),
    'TEL;TYPE=WORK:' + d.telefone,
    'EMAIL;TYPE=WORK:' + d.email,
    'ADR;TYPE=WORK:;;' + d.endereco,
    'URL:' + c.site,
    'END:VCARD'
  ].join('\n');
}

/**
 * Gera e baixa o arquivo .vcf com os dados do cartão.
 */
function salvarContato() {
  const arquivo = new Blob([gerarVCard()], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(arquivo);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'contato.vcf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}


/* -------------------------------------------------------------------------
   PREENCHIMENTO DOS DADOS NO HTML
   ------------------------------------------------------------------------- */

/**
 * Escreve os valores de CONFIG.dados nos elementos [data-campo]
 * e monta os links de telefone, e-mail, endereço e redes sociais.
 */
function preencherDados() {
  const d = CONFIG.dados;

  document.querySelectorAll('[data-campo]').forEach(function (el) {
    const chave = el.getAttribute('data-campo');
    if (d[chave]) el.textContent = d[chave];
  });

  const destinos = {
    telefone:  'tel:+' + limparNumero('55' + d.telefone),
    email:     'mailto:' + d.email,
    endereco:  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(d.endereco),
    instagram: CONFIG.redes.instagram,
    linkedin:  CONFIG.redes.linkedin
  };

  document.querySelectorAll('[data-link]').forEach(function (el) {
    const chave = el.getAttribute('data-link');
    const destino = destinos[chave];

    if (destino) {
      el.setAttribute('href', destino);
    } else {
      el.remove();
    }
  });
}


/* -------------------------------------------------------------------------
   INTERAÇÕES DA PÁGINA
   ------------------------------------------------------------------------- */

/** Liga todos os botões [data-whatsapp] ao método enviarWhatsApp(). */
function ativarBotoesWhatsApp() {
  document.querySelectorAll('[data-whatsapp]').forEach(function (botao) {
    botao.addEventListener('click', function () {
      enviarWhatsApp(botao.getAttribute('data-whatsapp'));
    });
  });

  const btnContato = document.getElementById('btnSalvarContato');
  if (btnContato) btnContato.addEventListener('click', salvarContato);
}

/** Abre e fecha o menu no mobile. */
function ativarMenu() {
  const botao = document.getElementById('btnMenu');
  const nav = document.getElementById('nav');
  if (!botao || !nav) return;

  botao.addEventListener('click', function () {
    const aberto = nav.classList.toggle('aberto');
    botao.setAttribute('aria-expanded', String(aberto));
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('aberto');
      botao.setAttribute('aria-expanded', 'false');
    });
  });
}

/** Revela os blocos conforme entram na tela. */
function ativarRevelacao() {
  const alvos = document.querySelectorAll('.revelar');
  if (!alvos.length) return;

  if (!('IntersectionObserver' in window)) {
    alvos.forEach(function (el) { el.classList.add('visivel'); });
    return;
  }

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  alvos.forEach(function (el) { observador.observe(el); });
}

/** Mostra o botão flutuante depois que o usuário rola a página. */
function ativarBotaoFlutuante() {
  const botao = document.getElementById('btnFlutuante');
  if (!botao) return;

  const alternar = function () {
    botao.classList.toggle('visivel', window.scrollY > 420);
  };

  alternar();
  window.addEventListener('scroll', alternar, { passive: true });
}

/** Atualiza o ano do rodapé. */
function ativarAno() {
  const ano = document.getElementById('ano');
  if (ano) ano.textContent = String(new Date().getFullYear());
}


/* -------------------------------------------------------------------------
   INICIALIZAÇÃO
   ------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  preencherDados();
  ativarBotoesWhatsApp();
  ativarMenu();
  ativarRevelacao();
  ativarBotaoFlutuante();
  ativarAno();
});
