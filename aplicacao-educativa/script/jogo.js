/**
 * Jogo Educativo: ESCOLHA A PALAVRA CORRETA
 * Alfabetização infantil — associação imagem × palavra
 */

(function () {
  'use strict';

  const dadosDoJogo = [
    { id: 1, imagem: 'vaca.svg',   palavra: 'VACA',   opcoes: ['VALA', 'VELA', 'VACA'] },
    { id: 2, imagem: 'gato.svg',   palavra: 'GATO',   opcoes: ['GOTA', 'GATO', 'GUTO'] },
    { id: 3, imagem: 'bolo.svg',   palavra: 'BOLO',   opcoes: ['BOLA', 'BOLO', 'BALO'] },
    { id: 4, imagem: 'bola.svg',   palavra: 'BOLA',   opcoes: ['BOLO', 'BALA', 'BOLA'] },
    { id: 5, imagem: 'abelha.svg', palavra: 'ABELHA', opcoes: ['ABELA', 'ABELHA', 'AVEIA'] },
    { id: 6, imagem: 'cama.svg',   palavra: 'CAMA',   opcoes: ['COMA', 'CALA', 'CAMA'] },
    { id: 7, imagem: 'botao.svg',  palavra: 'BOTÃO',  opcoes: ['BOTAM', 'BOTÃO', 'BOTIM'] },
    { id: 8, imagem: 'sino.svg',   palavra: 'SINO',   opcoes: ['CINO', 'SINO', 'SIMO'] },
    { id: 9, imagem: 'boneca.svg', palavra: 'BONECA', opcoes: ['BONETA', 'BONECA', 'BOLHA'] },
  ];

  const caminhoImagens = '../assets/imagens/';

  const estado = {
    pontuacao: 0,
    total: dadosDoJogo.length,
    respondidas: new Set(),
    audioAtivo: true,
  };

  const areaJogo = document.getElementById('area-jogo');
  const placarAcertos = document.getElementById('placar-acertos');
  const placarTotal = document.getElementById('placar-total');
  const botaoAudio = document.getElementById('botao-audio');
  const estadoAudio = document.getElementById('estado-audio');
  const telaFinal = document.getElementById('tela-final');
  const finalAcertos = document.getElementById('final-acertos');
  const mensagemFinal = document.getElementById('mensagem-final');
  const tituloFinal = document.getElementById('titulo-final');
  const estrelas = document.getElementById('estrelas');
  const recorde = document.getElementById('recorde');
  const botaoReiniciar = document.getElementById('botao-reiniciar');

  function embaralhar(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  function falar(palavra) {
    if (!estado.audioAtivo) return;
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(palavra);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.8;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  }

  function tocarSom(tipo) {
    if (!estado.audioAtivo) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (tipo === 'acerto') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      // silencia
    }
  }

  function criarCaminhoImagem(nomeArquivo) {
    return new URL(`${caminhoImagens}${nomeArquivo}`, document.baseURI).href;
  }

  function renderizarJogo() {
    areaJogo.innerHTML = '';

    dadosDoJogo.forEach((item, indice) => {
      const opcoesEmbaralhadas = embaralhar(item.opcoes);

      const cartao = document.createElement('article');
      cartao.className = 'cartao';
      cartao.setAttribute('aria-label', `Exercício ${indice + 1} de ${estado.total}`);

      cartao.innerHTML = `
        <span class="cartao-numero" aria-hidden="true">${indice + 1}</span>
        <div class="cartao-imagem">
          <img
            src="${criarCaminhoImagem(item.imagem)}"
            alt="Ilustração de ${item.palavra.toLowerCase()}"
          />
        </div>
        <div class="cartao-opcoes" role="group" aria-label="Escolha a palavra correta">
          ${opcoesEmbaralhadas.map(opcao => `
            <button
              type="button"
              class="botao-palavra"
              data-palavra="${opcao}"
              data-correta="${item.palavra}"
              data-id="${item.id}"
              aria-label="Opção: ${opcao}"
            >${opcao}</button>
          `).join('')}
        </div>
      `;

      const img = cartao.querySelector('img');
      img.onerror = function () {
        this.outerHTML = '<div style="font-size:5rem">📷</div>';
      };

      areaJogo.appendChild(cartao);
    });

    placarTotal.textContent = estado.total;
    placarAcertos.textContent = estado.pontuacao;
  }

  function verificarResposta(botaoClicado) {
    const idCartao = botaoClicado.dataset.id;
    const palavraSelecionada = botaoClicado.dataset.palavra;
    const palavraCorreta = botaoClicado.dataset.correta;

    if (estado.respondidas.has(idCartao)) return;
    estado.respondidas.add(idCartao);

    const cartao = botaoClicado.closest('.cartao');
    const botoes = cartao.querySelectorAll('.botao-palavra');
    botoes.forEach(b => b.disabled = true);

    if (palavraSelecionada === palavraCorreta) {
      botaoClicado.classList.add('acerto');
      estado.pontuacao++;
      tocarSom('acerto');
      falar('Muito bem! ' + palavraCorreta);
      placarAcertos.textContent = estado.pontuacao;
    } else {
      botaoClicado.classList.add('erro');
      tocarSom('erro');
      falar('Ops! Tente novamente');

      botoes.forEach(b => {
        if (b.dataset.palavra === palavraCorreta) {
          b.classList.add('revelar-correta');
        }
      });
    }

    if (estado.respondidas.size === estado.total) {
      setTimeout(mostrarTelaFinal, 1200);
    }
  }

  function mostrarTelaFinal() {
    finalAcertos.textContent = estado.pontuacao;

    if (estado.pontuacao === 9) {
      tituloFinal.textContent = '🌟 Incrível!';
      mensagemFinal.textContent = 'Você acertou TUDO! Você é um(a) verdadeiro(a) campeão(ã) da leitura!';
      estrelas.textContent = '⭐⭐⭐';
    } else if (estado.pontuacao >= 7) {
      tituloFinal.textContent = '👏 Parabéns!';
      mensagemFinal.textContent = 'Mandou muito bem! Continue praticando!';
      estrelas.textContent = '⭐⭐';
    } else if (estado.pontuacao >= 5) {
      tituloFinal.textContent = '💪 Bom trabalho!';
      mensagemFinal.textContent = 'Você está aprendendo! Tente de novo para melhorar!';
      estrelas.textContent = '⭐';
    } else {
      tituloFinal.textContent = '🌈 Continue tentando!';
      mensagemFinal.textContent = 'Não desista! A prática leva à perfeição!';
      estrelas.textContent = '💜';
    }

    try {
      const recordeAnterior = parseInt(localStorage.getItem('recorde-jogo') || '0', 10);
      if (estado.pontuacao > recordeAnterior) {
        localStorage.setItem('recorde-jogo', estado.pontuacao);
        recorde.textContent = '🎉 Novo recorde pessoal!';
      } else {
        recorde.textContent = `Seu melhor: ${recordeAnterior}/9`;
      }
    } catch (e) {
      recorde.textContent = '';
    }

    telaFinal.hidden = false;
  }

  function reiniciarJogo() {
    estado.pontuacao = 0;
    estado.respondidas.clear();
    telaFinal.hidden = true;
    window.speechSynthesis.cancel();
    renderizarJogo();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  areaJogo.addEventListener('click', function (e) {
    if (e.target.classList.contains('botao-palavra')) {
      verificarResposta(e.target);
    }
  });

  areaJogo.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('botao-palavra')) {
      e.preventDefault();
      verificarResposta(e.target);
    }
  });

  botaoAudio.addEventListener('click', function () {
    estado.audioAtivo = !estado.audioAtivo;
    estadoAudio.textContent = estado.audioAtivo ? 'ON' : 'OFF';
    botaoAudio.setAttribute('aria-pressed', estado.audioAtivo);
    botaoAudio.setAttribute('aria-label', estado.audioAtivo ? 'Desativar som' : 'Ativar som');
    if (!estado.audioAtivo) window.speechSynthesis.cancel();
  });

  botaoReiniciar.addEventListener('click', reiniciarJogo);

  renderizarJogo();

  setTimeout(() => falar('Bem-vindo ao jogo! Olhe a imagem e escolha a palavra correta.'), 800);
})();

