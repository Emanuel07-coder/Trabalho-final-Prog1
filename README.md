# 🎨 Webfólio + Jogo "Pinte a Palavra Correta"

## 🚀 Rodar localmente
1. Mantenha a estrutura de pastas.
2. Abra `index.html` no navegador (ou use **Live Server** no VS Code).

## 🌐 Publicar no GitHub Pages
1. Crie um repositório.
2. Envie todos os arquivos mantendo as pastas.
3. Em **Settings → Pages**:
   - Source: branch `main`
   - Folder: `/ (root)`
4. Aguarde 1-2 minutos.

## 📁 Estrutura de pastas
- `index.html` — página do webfólio
- `css/global.css` — estilos da home
- `js/validacao.js` — validação do formulário

- `aplicacao-educativa/index.html` — página do jogo
- `aplicacao-educativa/css/style.css` — estilos do jogo
- `aplicacao-educativa/js/jogo.js` — lógica do jogo

- `assets/` — ícone, foto e imagens SVG

## ✨ Funcionalidades
- Formulário com validação (HTML + JS)
- Jogo "Pinte a Palavra Correta" com:
  - placar de acertos
  - feedback visual (acerto/erro)
  - áudio via Web Speech API
  - recorde via `localStorage`
  - tela final motivacional
- Responsivo
- Sem dependências externas

