// Puzzle Solver for Zip game
// Key representation for walls: "r1,c1|r2,c2" where r1,c1 <= r2,c2
export function getWallKey(r1, c1, r2, c2) {
  if (r1 < r2 || (r1 === r2 && c1 <= c2)) {
    return `${r1},${c1}|${r2},${c2}`;
  }
  return `${r2},${c2}|${r1},${c1}`;
}

export function areCellsBlockedByWall(r1, c1, r2, c2, wallsSet) {
  if (!wallsSet || wallsSet.size === 0) return false;
  return wallsSet.has(getWallKey(r1, c1, r2, c2));
}

/**
 * Solves the Zip puzzle and counts valid Hamiltonian paths satisfying the constraints.
 * @param {number} size - Grid size (N)
 * @param {Object} numbersMap - Map from "r,c" -> number (e.g. { "0,0": 1, "4,4": 5 })
 * @param {Set<string>} wallsSet - Set of wall keys
 * @param {number} maxSolutionsToFind - Stops search early once this number of solutions is reached
 * @param {number} maxSteps - Step limit to avoid long freezes on large grids
 * @returns {{ count: number, sampleSolution: Array<{r: number, c: number}> | null }}
 */
export function solveZipPuzzle(size, numbersMap, wallsSet, maxSolutionsToFind = 2, maxSteps = 15000) {
  const totalCells = size * size;
  
  let startR = -1;
  let startC = -1;
  let maxNumber = 1;

  for (const [key, num] of Object.entries(numbersMap)) {
    if (num === 1) {
      const [r, c] = key.split(',').map(Number);
      startR = r;
      startC = c;
    }
    if (num > maxNumber) {
      maxNumber = num;
    }
  }

  if (startR === -1) {
    return { count: 0, sampleSolution: null };
  }

  const visited = Array.from({ length: size }, () => Array(size).fill(false));
  const path = [];
  let solutionCount = 0;
  let sampleSolution = null;
  let steps = 0;

  const directions = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 }
  ];

  function getAvailableNeighbors(r, c) {
    const list = [];
    for (const { dr, dc } of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited[nr][nc]) {
        if (!areCellsBlockedByWall(r, c, nr, nc, wallsSet)) {
          list.push({ r: nr, c: nc });
        }
      }
    }
    return list;
  }

  function dfs(currR, currC, nextExpectedNumber) {
    if (solutionCount >= maxSolutionsToFind || steps > maxSteps) return;
    steps++;

    visited[currR][currC] = true;
    path.push({ r: currR, c: currC });

    if (path.length === totalCells) {
      const cellNum = numbersMap[`${currR},${currC}`];
      if (!cellNum || cellNum === maxNumber) {
        solutionCount++;
        if (!sampleSolution) {
          sampleSolution = [...path];
        }
      }
      visited[currR][currC] = false;
      path.pop();
      return;
    }

    const neighbors = getAvailableNeighbors(currR, currC);

    // Warnsdorff's heuristic: try neighbors with fewer available exits first
    neighbors.sort((a, b) => {
      return getAvailableNeighbors(a.r, a.c).length - getAvailableNeighbors(b.r, b.c).length;
    });

    for (const next of neighbors) {
      const key = `${next.r},${next.c}`;
      const targetNum = numbersMap[key];

      if (targetNum !== undefined) {
        if (targetNum === nextExpectedNumber) {
          dfs(next.r, next.c, nextExpectedNumber + 1);
        }
      } else {
        dfs(next.r, next.c, nextExpectedNumber);
      }

      if (solutionCount >= maxSolutionsToFind || steps > maxSteps) break;
    }

    visited[currR][currC] = false;
    path.pop();
  }

  dfs(startR, startC, 2);

  return {
    count: solutionCount,
    sampleSolution,
    steps
  };
}
