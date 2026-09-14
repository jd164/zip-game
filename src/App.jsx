import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Board from './components/Board';
import Controls from './components/Controls';
import HowToPlay from './components/HowToPlay';
import WinModal from './components/WinModal';
import StatsModal from './components/StatsModal';
import { generateZipPuzzle } from './utils/puzzleGenerator.js';
import { validateMove, checkWinCondition } from './utils/gameLogic.js';
import { sound } from './utils/audio.js';
import { recordWin } from './utils/stats.js';

export default function App() {
  const [size, setSize] = useState(6);
  const [difficulty, setDifficulty] = useState('medium');
  const [puzzle, setPuzzle] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [isWon, setIsWon] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hintCell, setHintCell] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showStats, setShowStats] = useState(false);

  // Initialize new puzzle
  const initPuzzle = useCallback((newSize = size, newDiff = difficulty) => {
    const newPuzzle = generateZipPuzzle({ size: newSize, difficulty: newDiff });
    setPuzzle(newPuzzle);

    // Find start cell (number 1)
    let startCell = { r: 0, c: 0 };
    for (const [key, num] of Object.entries(newPuzzle.numbersMap)) {
      if (num === 1) {
        const [r, c] = key.split(',').map(Number);
        startCell = { r, c };
        break;
      }
    }

    setCurrentPath([startCell]);
    setUndoStack([]);
    setIsWon(false);
    setSeconds(0);
    setIsRunning(true);
    setHintCell(null);
    setToastMessage(null);
  }, [size, difficulty]);

  // Load initial puzzle on mount
  useEffect(() => {
    initPuzzle(size, difficulty);
  }, []); // Run on initial mount

  const handleSizeChange = (newSize) => {
    setSize(newSize);
    initPuzzle(newSize, difficulty);
  };

  const handleDifficultyChange = (newDiff) => {
    setDifficulty(newDiff);
    initPuzzle(size, newDiff);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 2800);
  };

  // Handle cell interaction (clicking or dragging into cell)
  const handleCellInteract = (targetR, targetC) => {
    if (!puzzle || isWon) return;

    // Clear active hint when player moves
    if (hintCell) {
      setHintCell(null);
    }

    const validation = validateMove({
      targetR,
      targetC,
      currentPath,
      numbersMap: puzzle.numbersMap,
      wallsSet: puzzle.wallsSet,
      size: puzzle.size,
      totalNumbers: puzzle.totalNumbers
    });

    if (!validation.valid) {
      if (validation.reason === 'blocked_by_wall') {
        sound.playWallBump();
        showToast('Barreira! Não podes atravessar paredes.');
      } else if (validation.message) {
        sound.playWallBump();
        showToast(validation.message);
      }
      return;
    }

    if (validation.isBacktrack) {
      // Player dragged onto a cell already in path: backtrack
      const newPath = currentPath.slice(0, validation.backtrackIndex + 1);
      if (newPath.length < currentPath.length) {
        setUndoStack(prev => [...prev, currentPath]);
        setCurrentPath(newPath);
        sound.playUndo();
      }
      return;
    }

    // Step forward onto new valid neighbor
    const newPath = [...currentPath, { r: targetR, c: targetC }];
    setUndoStack(prev => [...prev, currentPath]);
    setCurrentPath(newPath);

    // Audio feedback
    const targetKey = `${targetR},${targetC}`;
    if (puzzle.numbersMap[targetKey] !== undefined) {
      sound.playCheckpoint();
    } else {
      sound.playStep(newPath.length);
    }

    // Check win condition
    if (checkWinCondition(newPath, puzzle)) {
      setIsWon(true);
      setIsRunning(false);
      recordWin(puzzle.size, difficulty, seconds);
    }
  };

  // Undo button action
  const handleUndo = () => {
    if (currentPath.length <= 1 || isWon) return;

    if (undoStack.length > 0) {
      const prevPath = undoStack[undoStack.length - 1];
      setUndoStack(prev => prev.slice(0, prev.length - 1));
      setCurrentPath(prevPath);
    } else {
      setCurrentPath(prev => prev.slice(0, prev.length - 1));
    }
    setHintCell(null);
    sound.playUndo();
  };

  // Hint button action
  const handleHint = () => {
    if (!puzzle || isWon) return;

    // Check if current path matches prefix of canonical solution
    let isMatchingPrefix = true;
    for (let i = 0; i < currentPath.length; i++) {
      const p = currentPath[i];
      const sol = puzzle.solutionPath[i];
      if (!sol || p.r !== sol.r || p.c !== sol.c) {
        isMatchingPrefix = false;
        break;
      }
    }

    if (isMatchingPrefix && currentPath.length < puzzle.solutionPath.length) {
      // Hint next step along canonical path
      const nextStep = puzzle.solutionPath[currentPath.length];
      setHintCell(nextStep);
      sound.playHint();
    } else {
      // Diverged from canonical path: suggest undoing to last matching cell
      let firstDivergeIdx = 0;
      while (
        firstDivergeIdx < currentPath.length &&
        firstDivergeIdx < puzzle.solutionPath.length &&
        currentPath[firstDivergeIdx].r === puzzle.solutionPath[firstDivergeIdx].r &&
        currentPath[firstDivergeIdx].c === puzzle.solutionPath[firstDivergeIdx].c
      ) {
        firstDivergeIdx++;
      }

      const backtrackTarget = puzzle.solutionPath[firstDivergeIdx] || currentPath[0];
      setHintCell(backtrackTarget);
      sound.playHint();
    }
  };

  const handleReset = () => {
    if (!puzzle) return;
    let startCell = { r: 0, c: 0 };
    for (const [key, num] of Object.entries(puzzle.numbersMap)) {
      if (num === 1) {
        const [r, c] = key.split(',').map(Number);
        startCell = { r, c };
        break;
      }
    }
    setCurrentPath([startCell]);
    setUndoStack([]);
    setIsWon(false);
    setHintCell(null);
    setSeconds(0);
    setIsRunning(true);
    setToastMessage(null);
    sound.playUndo();
  };

  const totalCells = size * size;
  const progressText = `${currentPath.length} / ${totalCells} células`;
  const fillPercentage = Math.round((currentPath.length / totalCells) * 100);

  return (
    <div className="min-h-screen bg-[#f3f2ef] flex flex-col items-center justify-start p-3 sm:p-5 md:p-6 select-none font-sans relative">
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 z-50 max-w-sm px-4 py-2.5 bg-slate-900/90 backdrop-blur-md text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-xl border border-slate-700/80 animate-fade-in flex items-center gap-2 text-center">
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="w-full max-w-[440px] flex flex-col gap-3.5 my-auto">
        <Header
          size={size}
          setSize={handleSizeChange}
          difficulty={difficulty}
          setDifficulty={handleDifficultyChange}
          isMuted={isMuted}
          toggleMute={toggleMute}
          seconds={seconds}
          isRunning={isRunning}
          setSeconds={setSeconds}
          puzzleId={puzzle?.id}
          totalNumbers={puzzle?.totalNumbers}
          onNewGame={() => initPuzzle(size, difficulty)}
          onShowStats={() => setShowStats(true)}
        />

        <Board
          puzzle={puzzle}
          currentPath={currentPath}
          hintCell={hintCell}
          onCellInteract={handleCellInteract}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />

        <Controls
          onUndo={handleUndo}
          onHint={handleHint}
          onReset={handleReset}
          canUndo={currentPath.length > 1 && !isWon}
          progressText={progressText}
          fillPercentage={fillPercentage}
        />

        <HowToPlay />
      </div>

      <WinModal
        isOpen={isWon}
        timeInSeconds={seconds}
        puzzleSize={size}
        difficulty={difficulty}
        onPlayNext={() => initPuzzle(size, difficulty)}
        onClose={() => setIsWon(false)}
      />

      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />
    </div>
  );
}
