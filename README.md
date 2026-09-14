# 🧩 Zip Game — Jogo Diário de Conexão de Pontos

Uma recriação moderna e elegante do jogo **"Zip" do LinkedIn** desenvolvida em **React**, **Vite** e **Tailwind CSS**.

🎮 **[Jogar Online (Live Demo)](https://jd164.github.io/zip-game/)**

O objetivo é traçar um caminho contínuo e único que conecte todos os pontos numerados na ordem correta, contornando barreiras e preenchendo **100% das células** do tabuleiro.

---

## 🎮 Regras do Jogo

1. **Ordem Numérica**: Começa no número `1` e passa por todos os números em ordem estrita (`1 → 2 → 3 → ... → N`).
2. **Preenchimento Total**: **Todas** as células da grelha devem ser visitadas. Nenhuma célula pode ficar vazia.
3. **Caminho Único**: O caminho não se pode cruzar a si mesmo nem passar pela mesma célula mais de uma vez.
4. **Movimentos Válidos**: Apenas movimentos ortogonais entre células adjacentes (Cima, Baixo, Esquerda, Direita). Diagonais não são permitidas.
5. **Barreiras / Paredes**: Linhas pretas grossas entre células são paredes intransponíveis.
6. **Destino Final**: Só é possível entrar no último número após ter preenchido todas as outras células do tabuleiro.

---

## ✨ Funcionalidades Principais

- 📐 **Dimensões Configuráveis**: Tabuleiros **5×5**, **6×6** e **7×7**.
- 🎯 **Níveis de Dificuldade**:
  - **Fácil**: Mais números de referência e menos barreiras.
  - **Médio**: Equilíbrio desafiante entre números e paredes.
  - **Difícil**: Menos números guias e posicionamento estratégico de obstáculos.
- 🎲 **Gerador Procedural Infinito**: Puzzles gerados instantaneamente com base em caminhos Hamiltonianos (Heurística de Warnsdorff), garantindo que todo puzzle gerado tem solução válida.
- 📊 **Estatísticas Globais**:
  - Total de vitórias e taxa de sucesso.
  - Sequência diária (*Streak*) e recorde máximo.
  - Tempo médio de resolução.
  - Melhores tempos (*High Scores*) discriminados por tamanho e dificuldade.
  - Distribuição gráfica de vitórias.
  - Persistência automática em `localStorage`.
- 💡 **Sistema de Dicas Inteligente**: Ajuda a avançar ou indica onde o caminho divergiu da solução.
- ↩️ **Desfazer / Retrocesso Fluido**: Suporte a botão de desfazer (*Undo*) ou simplesmente arrastar de volta pelo caminho para recuar.
- 🔊 **Efeitos Sonoros Sintetizados**: Áudio imersivo e procedural via Web Audio API (passos com tom ascendente, checkpoints, colisões em paredes, vitória e desfazer), com opção de silenciar.
- 📱 **Multiplataforma e Responsivo**: Jogabilidade tátil fluida em telemóveis e tablets (*drag/touch*), bem como no computador (*mouse drag/click*).
- 🎉 **Comemoração de Vitória**: Modal com estatísticas da partida, tempo decorrido, partilha de resultado para a área de transferência e explosão de confettis.

---

## 🛠️ Tecnologias Utilizadas

- **[React 18](https://react.dev/)** — Biblioteca UI para componentes reativos.
- **[Vite](https://vitejs.dev/)** — Build tool ultra-rápido para desenvolvimento frontend.
- **[Tailwind CSS](https://tailwindcss.com/)** — Framework de estilos utilitários.
- **[Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)** — Efeitos visuais de celebração.
- **Web Audio API** — Geração de som em tempo real sem dependência de ficheiros externos.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- Gestor de pacotes `npm` ou `yarn`

### Passos de Instalação

1. Clone ou descarregue o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd zip_game
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra no navegador o endereço indicado (normalmente `http://localhost:5173`).

### Scripts Disponíveis

- `npm run dev` — Inicia o servidor local de desenvolvimento com Hot Module Replacement (HMR).
- `npm run build` — Compila a aplicação para produção na pasta `dist/`.
- `npm run preview` — Executa localmente o bundle de produção compilado.

---

## 📂 Estrutura do Projeto

```text
zip_game/
├── index.html              # Entrada HTML principal
├── package.json            # Dependências e scripts
├── tailwind.config.js      # Configuração do Tailwind CSS
├── vite.config.js          # Configuração do Vite
└── src/
    ├── main.jsx            # Ponto de entrada React
    ├── index.css           # Estilos globais e fontes
    ├── App.jsx             # Componente raiz e gestão de estado global
    ├── components/
    │   ├── Board.jsx       # Renderização do tabuleiro e eventos de arrasto/toque
    │   ├── Cell.jsx        # Célula individual, paredes e números
    │   ├── Controls.jsx    # Botões de Desfazer, Dica, Reiniciar e barra de progresso
    │   ├── Header.jsx      # Seletor de tamanho, dificuldade, temporizador e estatísticas
    │   ├── HowToPlay.jsx   # Secção expansível com instruções do jogo
    │   ├── Icons.jsx       # Conjunto de ícones SVG vetorizados
    │   ├── StatsModal.jsx  # Modal com painel completo de estatísticas globais
    │   ├── Timer.jsx       # Temporizador da partida
    │   └── WinModal.jsx    # Modal de vitória com partilha e confetes
    └── utils/
        ├── audio.js            # Sintetizador de áudio Web Audio API
        ├── gameLogic.js        # Validação de regras e movimentos
        ├── puzzleGenerator.js  # Gerador de caminhos Hamiltonianos e barreiras
        └── stats.js            # Gestão e persistência de estatísticas no localStorage
```

---

## 📄 Licença

Este projeto é disponibilizado para fins educacionais e de entretenimento.
