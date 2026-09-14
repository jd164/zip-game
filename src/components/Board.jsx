import React, { useRef } from 'react';
import Cell from './Cell';

export default function Board({
  puzzle,
  currentPath,
  hintCell,
  onCellInteract,
  isDragging,
  setIsDragging
}) {
  const boardRef = useRef(null);

  if (!puzzle) return null;

  const { size, numbersMap, wallsSet } = puzzle;
  const totalCells = size * size;
  const pathMap = new Map();
  currentPath.forEach((cell, idx) => {
    pathMap.set(`${cell.r},${cell.c}`, idx);
  });

  const headCell = currentPath.length > 0 ? currentPath[currentPath.length - 1] : null;

  // Handle pointer / touch dragging
  const handlePointerDown = (r, c, e) => {
    e.preventDefault();
    setIsDragging(true);
    onCellInteract(r, c);
  };

  const handlePointerEnter = (r, c) => {
    if (isDragging) {
      onCellInteract(r, c);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    if (!touch) return;

    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!elem) return;

    const cellElem = elem.closest('[data-row]');
    if (cellElem) {
      const r = parseInt(cellElem.getAttribute('data-row'), 10);
      const c = parseInt(cellElem.getAttribute('data-col'), 10);
      if (!isNaN(r) && !isNaN(c)) {
        onCellInteract(r, c);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Generate SVG path line points for the connecting ribbon
  const renderPathConnectors = () => {
    if (currentPath.length < 2) return null;

    const cellSizePercent = 100 / size;
    const halfCell = cellSizePercent / 2;

    const points = currentPath.map(cell => {
      const x = cell.c * cellSizePercent + halfCell;
      const y = cell.r * cellSizePercent + halfCell;
      return `${x},${y}`;
    });

    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-15"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke="#0a66c2"
          strokeWidth={size >= 7 ? "4" : "5"}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.8"
        />
      </svg>
    );
  };

  const gridStyle = {
    gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`
  };

  return (
    <div
      ref={boardRef}
      onPointerUp={() => setIsDragging(false)}
      onPointerLeave={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full max-w-[420px] mx-auto aspect-square bg-white rounded-2xl shadow-xl p-2.5 sm:p-3 border border-slate-200/80 touch-none-all select-none overflow-hidden transition-all duration-300"
    >
      {/* Grid cells container */}
      <div
        className="grid w-full h-full rounded-xl overflow-hidden border-2 border-slate-900 bg-white relative"
        style={gridStyle}
      >
        {renderPathConnectors()}

        {Array.from({ length: size }).map((_, r) =>
          Array.from({ length: size }).map((_, c) => {
            const key = `${r},${c}`;
            const number = numbersMap[key];
            const pathIndex = pathMap.has(key) ? pathMap.get(key) : -1;
            const isHead = headCell && headCell.r === r && headCell.c === c;
            const isHint = hintCell && hintCell.r === r && hintCell.c === c;

            return (
              <Cell
                key={key}
                r={r}
                c={c}
                size={size}
                number={number}
                pathIndex={pathIndex}
                isHead={isHead}
                isHint={isHint}
                totalPathLength={currentPath.length}
                totalCells={totalCells}
                wallsSet={wallsSet}
                onPointerDown={handlePointerDown}
                onPointerEnter={handlePointerEnter}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
