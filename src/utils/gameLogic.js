import { areCellsBlockedByWall } from './puzzleSolver.js';

/**
 * Checks if two cells are orthogonally adjacent.
 */
export function areNeighbors(r1, c1, r2, c2) {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
}

/**
 * Calculates current progress of visited numbers in path.
 */
export function getVisitedNumbers(path, numbersMap) {
  const visited = [];
  path.forEach((cell, idx) => {
    const key = `${cell.r},${cell.c}`;
    if (numbersMap[key] !== undefined) {
      visited.push({
        number: numbersMap[key],
        pathIndex: idx,
        r: cell.r,
        c: cell.c
      });
    }
  });
  return visited;
}

/**
 * Finds the next expected number to be visited.
 */
export function getNextExpectedNumber(path, numbersMap) {
  const visited = getVisitedNumbers(path, numbersMap);
  if (visited.length === 0) return 1;
  return visited[visited.length - 1].number + 1;
}

/**
 * Validates whether a move to (targetR, targetC) is permitted.
 * @returns {{ valid: boolean, isBacktrack: boolean, backtrackIndex?: number, reason?: string, message?: string }}
 */
export function validateMove({
  targetR,
  targetC,
  currentPath,
  numbersMap,
  wallsSet,
  size,
  totalNumbers
}) {
  const totalCells = size * size;

  // 1. Boundary check
  if (targetR < 0 || targetR >= size || targetC < 0 || targetC >= size) {
    return { valid: false, reason: 'out_of_bounds' };
  }

  // If path is empty, can only start on cell with number 1
  if (currentPath.length === 0) {
    const cellNum = numbersMap[`${targetR},${targetC}`];
    if (cellNum === 1) {
      return { valid: true, isBacktrack: false };
    }
    return { valid: false, reason: 'must_start_at_1' };
  }

  const head = currentPath[currentPath.length - 1];

  // If clicking/dragging on the same head cell, ignore
  if (head.r === targetR && head.c === targetC) {
    return { valid: false, reason: 'same_cell' };
  }

  // 2. Check for Backtrack (if target cell is already in path)
  const existingIndex = currentPath.findIndex(p => p.r === targetR && p.c === targetC);
  if (existingIndex !== -1) {
    return {
      valid: true,
      isBacktrack: true,
      backtrackIndex: existingIndex
    };
  }

  // 3. Adjacency check
  if (!areNeighbors(head.r, head.c, targetR, targetC)) {
    return { valid: false, reason: 'not_adjacent' };
  }

  // 4. Wall check
  if (areCellsBlockedByWall(head.r, head.c, targetR, targetC, wallsSet)) {
    return { valid: false, reason: 'blocked_by_wall' };
  }

  // 5. Number sequence check
  const targetNum = numbersMap[`${targetR},${targetC}`];
  if (targetNum !== undefined) {
    const nextExpected = getNextExpectedNumber(currentPath, numbersMap);

    if (targetNum !== nextExpected) {
      return {
        valid: false,
        reason: 'wrong_number_order',
        message: `Tens de visitar o número ${nextExpected} primeiro!`
      };
    }

    // SPECIAL RULE: If entering the FINAL number, all other cells must already be filled!
    if (targetNum === totalNumbers && currentPath.length < totalCells - 1) {
      const remainingCells = (totalCells - 1) - currentPath.length;
      return {
        valid: false,
        reason: 'final_number_premature',
        message: `Faltam preencher ${remainingCells} célula(s) antes de terminar no número final (${totalNumbers})!`
      };
    }
  }

  return { valid: true, isBacktrack: false };
}

/**
 * Checks if the current path represents a full winning solution.
 */
export function checkWinCondition(path, puzzle) {
  if (!puzzle || !path) return false;
  const totalCells = puzzle.size * puzzle.size;
  if (path.length !== totalCells) return false;

  const visitedNumbers = getVisitedNumbers(path, puzzle.numbersMap);
  if (visitedNumbers.length !== puzzle.totalNumbers) return false;

  // Verify they were visited strictly 1, 2, 3, ... N
  for (let i = 0; i < visitedNumbers.length; i++) {
    if (visitedNumbers[i].number !== i + 1) return false;
  }

  return true;
}
