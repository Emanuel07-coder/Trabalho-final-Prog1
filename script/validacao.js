/**
 * Validação do Formulário de Contato
 * Combina validação HTML5 + JavaScript para máxima robustez
 */

(function () {
  'use strict';

  // ============================================
  // ELEMENTOS DO DOM
  // ============================================
  const form = document.getElementById('formulario');
  const campos = {
    nome: document.getElementById('nome'),
    email: document.getElementById('email'),
    data: document.getElementById('data'),
    numero: document.getElementById('numero'),
    assunto: document.querySelectorAll('input[name="assunto"]'),
    mensagem: document.getElementById('mensagem'),
  };
  const erros = {
    nome: document.getElementById('erro-nome'),
    email: document.getElementById('erro-email'),
    data: document.getElementById('erro-data'),
    numero: document.getElementById('erro-numero'),
    assunto: document.getElementById('erro-assunto'),
    mensagem: document.getElementById('erro-mensagem'),
  };
  const contador = document.getElementById('contador-mensagem');
  const mensagemSucesso = document.getElementById('sucesso');
  const spanAno = document.getElementById('ano-atual');

  // ============================================
  // FUNÇÕES DE VALIDAÇÃO
  // ============================================

  function mostrarErro(campo, msg) {
    erros[campo].textContent = '⚠️ ' + msg;
    if (campos[campo] && campos[campo].style) {
      campos[campo].style.borderColor = 'var(--cor-erro)';
    }
  }

  function limparErro(campo) {
    erros[campo].textContent = '';
    if (campos[campo] && campos[campo].style) {
      campos[campo].style.borderColor = '';
    }
  }

  function validarNome() {
    const valor = campos.nome.value.trim();
    if (valor.length === 0) {
      mostrarErro('nome', 'Por favor, informe seu nome.');
      return false;
    }
    if (valor.length < 3) {
      mostrarErro('nome', 'O nome deve ter pelo menos 3 caracteres.');
      return false;
    }
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(valor)) {
      mostrarErro('nome', 'Use apenas letras e espaços.');
      return false;
    }
    limparErro('nome');
    return true;
  }

  function validarEmail() {
    const valor = campos.email.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (valor.length === 0) {
      mostrarErro('email', 'Por favor, informe seu e-mail.');
      return false;
    }
    if (!regex.test(valor)) {
      mostrarErro('email', 'E-mail inválido. Use o formato: nome@exemplo.com');
      return false;
    }
    limparErro('email');
    return true;
  }

  function validarData() {
    const valor = campos.data.value;
    if (!valor) {
      mostrarErro('data', 'Por favor, informe sua data de nascimento.');
      return false;
    }
    const dataNasc = new Date(valor);
    const hoje = new Date();
    if (dataNasc > hoje) {
      mostrarErro('data', 'A data não pode ser no futuro.');
      return false;
    }

    const idade = hoje.getFullYear() - dataNasc.getFullYear();
    if (idade < 10 || idade > 120) {
      mostrarErro('data', 'Idade deve estar entre 10 e 120 anos.');
      return false;
    }
    limparErro('data');
    return true;
  }

  function validarNumero() {
    const valor = parseInt(campos.numero.value, 10);
    if (isNaN(valor)) {
      mostrarErro('numero', 'Por favor, informe sua idade.');
      return false;
    }
    if (valor < 10 || valor > 120) {
      mostrarErro('numero', 'Idade deve estar entre 10 e 120 anos.');
      return false;
    }
    limparErro('numero');
    return true;
  }

  function validarAssunto() {
    const selecionado = Array.from(campos.assunto).some(r => r.checked);
    if (!selecionado) {
      mostrarErro('assunto', 'Por favor, selecione um assunto.');
      return false;
    }
    limparErro('assunto');
    return true;
  }

  function validarMensagem() {
    const valor = campos.mensagem.value.trim();
    if (valor.length === 0) {
      mostrarErro('mensagem', 'Por favor, escreva uma mensagem.');
      return false;
    }
    if (valor.length < 10) {
      mostrarErro('mensagem', 'A mensagem deve ter pelo menos 10 caracteres.');
      return false;
    }
    if (valor.length > 500) {
      mostrarErro('mensagem', 'A mensagem deve ter no máximo 500 caracteres.');
      return false;
    }
    limparErro('mensagem');
    return true;
  }

  // ============================================
  // HELPERS
  // ============================================

  function atualizarContador() {
    const len = campos.mensagem.value.length;
    contador.textContent = `${len}/500 caracteres`;
    contador.style.color = len > 450 ? 'var(--cor-erro)' : 'var(--cor-texto-claro)';
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================

  campos.nome.addEventListener('blur', validarNome);
  campos.email.addEventListener('blur', validarEmail);
  campos.data.addEventListener('blur', validarData);
  campos.numero.addEventListener('blur', validarNumero);
  campos.mensagem.addEventListener('blur', validarMensagem);
  campos.mensagem.addEventListener('input', atualizarContador);

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const valido =
      validarNome() &
      validarEmail() &
      validarData() &
      validarNumero() &
      validarAssunto() &
      validarMensagem();

    if (valido) {
      const dados = {
        nome: campos.nome.value.trim(),
        email: campos.email.value.trim(),
        data: campos.data.value,
        numero: campos.numero.value,
        assunto: Array.from(campos.assunto).find(r => r.checked)?.value,
        mensagem: campos.mensagem.value.trim(),
      };

      console.log('📨 Dados do formulário:', dados);

      mensagemSucesso.hidden = false;
      form.reset();
      atualizarContador();

      setTimeout(() => {
        mensagemSucesso.hidden = true;
      }, 5000);

      mensagemSucesso.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      const primeiroErro = form.querySelector('.mensagem-erro:not(:empty)');
      if (primeiroErro) {
        const idCampo = primeiroErro.id.replace('erro-', '');
        const campo = document.getElementById(idCampo);
        if (campo) campo.focus();
      }
    }
  });

  // Ano atual no rodapé
  if (spanAno) spanAno.textContent = new Date().getFullYear();
})();

