import { getWallKey, areCellsBlockedByWall } from './puzzleSolver.js';

/**
 * Generates a random Hamiltonian Path on an N x N grid using Warnsdorff's heuristic DFS.
 */
export function generateHamiltonianPath(size) {
  const totalCells = size * size;
  const maxAttempts = 250;

  const directions = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 }
  ];

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const visited = Array.from({ length: size }, () => Array(size).fill(false));
    const path = [];

    // Choose random starting cell
    const startR = Math.floor(Math.random() * size);
    const startC = Math.floor(Math.random() * size);

    let currR = startR;
    let currC = startC;

    visited[currR][currC] = true;
    path.push({ r: currR, c: currC });

    let stuck = false;

    while (path.length < totalCells) {
      // Find unvisited neighbors
      const neighbors = [];
      for (const { dr, dc } of directions) {
        const nr = currR + dr;
        const nc = currC + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited[nr][nc]) {
          neighbors.push({ r: nr, c: nc });
        }
      }

      if (neighbors.length === 0) {
        stuck = true;
        break;
      }

      // Warnsdorff's heuristic: calculate unvisited neighbor count
      const neighborDegrees = neighbors.map(nb => {
        let deg = 0;
        for (const { dr, dc } of directions) {
          const nnr = nb.r + dr;
          const nnc = nb.c + dc;
          if (nnr >= 0 && nnr < size && nnc >= 0 && nnc < size && !visited[nnr][nnc]) {
            deg++;
          }
        }
        return { ...nb, deg };
      });

      // Sort by smallest available degree first, breaking ties randomly
      neighborDegrees.sort((a, b) => {
        if (a.deg === b.deg) {
          return Math.random() - 0.5;
        }
        return a.deg - b.deg;
      });

      const next = neighborDegrees[0];
      currR = next.r;
      currC = next.c;
      visited[currR][currC] = true;
      path.push({ r: currR, c: currC });
    }

    if (!stuck && path.length === totalCells) {
      return path;
    }
  }

  // Diverse randomized serpentine fallback
  const fallbackPath = [];
  const startCorner = Math.floor(Math.random() * 4); // 0: TL, 1: TR, 2: BL, 3: BR
  const horizontal = Math.random() > 0.5;

  if (horizontal) {
    for (let r = 0; r < size; r++) {
      const actualR = startCorner >= 2 ? size - 1 - r : r;
      const cols = [];
      for (let c = 0; c < size; c++) {
        cols.push(startCorner % 2 === 1 ? size - 1 - c : c);
      }
      if (r % 2 === 1) cols.reverse();
      for (const c of cols) {
        fallbackPath.push({ r: actualR, c });
      }
    }
  } else {
    for (let c = 0; c < size; c++) {
      const actualC = startCorner % 2 === 1 ? size - 1 - c : c;
      const rows = [];
      for (let r = 0; r < size; r++) {
        rows.push(startCorner >= 2 ? size - 1 - r : r);
      }
      if (c % 2 === 1) rows.reverse();
      for (const r of rows) {
        fallbackPath.push({ r, c: actualC });
      }
    }
  }
  return fallbackPath;
}

/**
 * Generates a full Zip puzzle config.
 * @param {Object} options
 * @param {number} options.size - 5, 6, or 7
 * @param {'easy'|'medium'|'hard'} options.difficulty
 * @param {number} options.seed - optional puzzle seed identifier
 */
export function generateZipPuzzle({ size = 6, difficulty = 'medium', seed = null } = {}) {
  const totalCells = size * size;
  const puzzleId = seed || Math.floor(100 + Math.random() * 900);

  // Determine number of checkpoints (targetCount) and wall count
  let targetCount;
  let targetWallCount;

  if (size === 5) {
    targetCount = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 7 : 5;
    targetWallCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 7 : 10;
  } else if (size === 6) {
    targetCount = difficulty === 'easy' ? 12 : difficulty === 'medium' ? 9 : 7;
    targetWallCount = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 11 : 16;
  } else {
    // 7x7 (49 cells)
    targetCount = difficulty === 'easy' ? 16 : difficulty === 'medium' ? 12 : 9;
    targetWallCount = difficulty === 'easy' ? 9 : difficulty === 'medium' ? 16 : 22;
  }

  // Generate a guaranteed valid Hamiltonian path
  const path = generateHamiltonianPath(size);

  // Quick lookup of index in path
  const posInPath = new Map();
  path.forEach((p, idx) => {
    posInPath.set(`${p.r},${p.c}`, idx);
  });

  // 1. Assign Numbers (1 at index 0, targetCount at index totalCells - 1)
  const selectedIndices = [0];
  const numIntermediates = targetCount - 2;
  const segment = (totalCells - 1) / (targetCount - 1);

  for (let k = 1; k <= numIntermediates; k++) {
    const ideal = Math.round(k * segment);
    let bestIdx = ideal;
    let minDiff = 999;
    
    // Find closest available index around ideal to avoid duplicate numbers
    for (let offset = 0; offset <= 3; offset++) {
      for (const sign of [-1, 1]) {
        const candidate = ideal + offset * sign;
        if (candidate > 0 && candidate < totalCells - 1 && !selectedIndices.includes(candidate)) {
          bestIdx = candidate;
          minDiff = offset;
          break;
        }
      }
      if (minDiff < 999) break;
    }

    if (!selectedIndices.includes(bestIdx)) {
      selectedIndices.push(bestIdx);
    }
  }

  selectedIndices.push(totalCells - 1);
  selectedIndices.sort((a, b) => a - b);

  const numbersMap = {};
  selectedIndices.forEach((pathIdx, numOrder) => {
    const cell = path[pathIdx];
    numbersMap[`${cell.r},${cell.c}`] = numOrder + 1;
  });

  // 2. Candidate walls (internal grid edges NOT crossed by consecutive steps in path)
  const candidateWalls = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Right neighbor
      if (c + 1 < size) {
        const idx1 = posInPath.get(`${r},${c}`);
        const idx2 = posInPath.get(`${r},${c + 1}`);
        if (Math.abs(idx1 - idx2) !== 1) {
          candidateWalls.push({ r1: r, c1: c, r2: r, c2: c + 1 });
        }
      }
      // Bottom neighbor
      if (r + 1 < size) {
        const idx1 = posInPath.get(`${r},${c}`);
        const idx2 = posInPath.get(`${r + 1},${c}`);
        if (Math.abs(idx1 - idx2) !== 1) {
          candidateWalls.push({ r1: r, c1: c, r2: r + 1, c2: c });
        }
      }
    }
  }

  // Shuffle candidate walls randomly
  candidateWalls.sort(() => Math.random() - 0.5);

  const wallsSet = new Set();
  const wallsArray = [];

  const numWalls = Math.min(targetWallCount, candidateWalls.length);
  for (let i = 0; i < numWalls; i++) {
    const w = candidateWalls[i];
    const key = getWallKey(w.r1, w.c1, w.r2, w.c2);
    if (!wallsSet.has(key)) {
      wallsSet.add(key);
      wallsArray.push(w);
    }
  }

  return {
    id: puzzleId,
    size,
    difficulty,
    numbersMap,
    wallsArray,
    wallsSet,
    solutionPath: path,
    isUnique: true,
    totalNumbers: selectedIndices.length,
    maxNumber: selectedIndices.length
  };
}
