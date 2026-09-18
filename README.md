# 🧩 Zip Game — Daily Path Connection Puzzle

A modern, sleek recreation of LinkedIn's **"Zip"** puzzle game, built with **React**, **Vite**, and **Tailwind CSS**.

🎮 **[Play Online (Live Demo)](https://jd164.github.io/zip-game/)**

The objective is to draw a single continuous path connecting all numbered points in ascending order, navigating around obstacles while filling **100% of the grid cells**.

---

## 🎮 Game Rules

1. **Numerical Order**: Start at number `1` and visit every numbered checkpoint in strict sequence (`1 → 2 → 3 → ... → N`).
2. **Complete Coverage**: **Every** cell on the board must be visited. No cell may be left empty.
3. **Single Path**: The path cannot cross over itself or visit any cell more than once.
4. **Valid Moves**: Only orthogonal movements between adjacent cells are allowed (Up, Down, Left, Right). Diagonals are not permitted.
5. **Barriers / Walls**: Thick black borders between cells represent impassable walls.
6. **Final Destination**: You may only enter the final number cell after all other cells on the board have been filled.

---

## ✨ Key Features

- 📐 **Configurable Grid Sizes**: Boards available in **5×5**, **6×6**, and **7×7**.
- 🎯 **Difficulty Levels**:
  - **Easy**: More numbered checkpoints and fewer barriers.
  - **Medium**: A balanced challenge with fewer guides and tactical barriers.
  - **Hard**: Minimal numbered guides with strategically placed obstacles.
- 🎲 **Infinite Procedural Generator**: Instant puzzle generation powered by Hamiltonian paths (Warnsdorff's heuristic), guaranteeing that every generated puzzle has a valid solution.
- 📊 **Comprehensive Statistics**:
  - Total wins and win rate percentage.
  - Daily streak and maximum streak records.
  - Average solve time.
  - Best times (*High Scores*) broken down by grid size and difficulty.
  - Visual win distribution chart.
  - Automatic persistence in `localStorage`.
- 💡 **Smart Hint System**: Provides next-step guidance or alerts you if your current path has diverged from the solution.
- ↩️ **Fluid Undo & Backtracking**: Use the Undo button or simply drag/retrace backward along your path to retract moves.
- 🔊 **Synthesized Sound Effects**: Immersive, procedural audio via the Web Audio API (ascending tones per step, checkpoint chimes, wall bumps, victory fanfare, and undo clicks), with a mute toggle.
- 📱 **Cross-Platform & Fully Responsive**: Smooth touch and drag gameplay on mobile devices and tablets, alongside mouse drag and click controls on desktop.
- 🎉 **Victory Celebration**: Win modal showcasing game statistics, elapsed time, one-click result sharing to the clipboard, and confetti animations.

---

## 🛠️ Built With

- **[React 18](https://react.dev/)** — UI library for reactive components.
- **[Vite](https://vitejs.dev/)** — Ultra-fast frontend development build tool.
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling framework.
- **[Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)** — Celebration visual effects.
- **Web Audio API** — Real-time synthesized audio without external media assets.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn` package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jd164/zip-game.git
   cd zip-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open the URL displayed in your terminal (typically `http://localhost:5173`) in your browser.

### Available Scripts

- `npm run dev` — Starts the local dev server with Hot Module Replacement (HMR).
- `npm run build` — Bundles the application for production in the `dist/` directory.
- `npm run preview` — Previews the production build locally.

---

## 📂 Project Structure

```text
zip-game/
├── index.html              # Main HTML entry point
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.js          # Vite configuration
└── src/
    ├── main.jsx            # React entry point
    ├── index.css           # Global styles and font imports
    ├── App.jsx             # Root component and global state management
    ├── components/
    │   ├── Board.jsx       # Board rendering and drag/touch interactions
    │   ├── Cell.jsx        # Individual cell rendering (walls, numbers, path)
    │   ├── Controls.jsx    # Undo, Hint, Reset buttons and progress bar
    │   ├── Header.jsx      # Size/difficulty selectors, timer, and stats trigger
    │   ├── HowToPlay.jsx   # Collapsible instructions panel
    │   ├── Icons.jsx       # Vector SVG icon set
    │   ├── StatsModal.jsx  # Global player statistics dashboard modal
    │   ├── Timer.jsx       # Match timer
    │   └── WinModal.jsx    # Victory modal with score sharing and confetti
    └── utils/
        ├── audio.js            # Web Audio API sound synthesizer
        ├── gameLogic.js        # Move validation and game rule checks
        ├── puzzleGenerator.js  # Hamiltonian path and obstacle generator
        └── stats.js            # Stats calculation and localStorage persistence
```

---

## 📄 License

This project is open-source and available for educational and entertainment purposes.
