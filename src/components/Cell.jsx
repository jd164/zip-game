import React from 'react';
import { areCellsBlockedByWall } from '../utils/puzzleSolver';

export default function Cell({
  r,
  c,
  size,
  number,
  pathIndex,
  isHead,
  isHint,
  totalPathLength,
  totalCells,
  wallsSet,
  onPointerDown,
  onPointerEnter
}) {
  // Check walls around this cell
  const hasWallTop = r > 0 && areCellsBlockedByWall(r, c, r - 1, c, wallsSet);
  const hasWallBottom = r < size - 1 && areCellsBlockedByWall(r, c, r + 1, c, wallsSet);
  const hasWallLeft = c > 0 && areCellsBlockedByWall(r, c, r, c - 1, wallsSet);
  const hasWallRight = c < size - 1 && areCellsBlockedByWall(r, c, r, c + 1, wallsSet);

  const isInPath = pathIndex !== -1;

  // Calculate dynamic color gradient along path (LinkedIn blue tones)
  // Earlier cells are soft vibrant blue (#2563eb / #3b82f6), head cell is deep electric royal blue (#0a66c2 / #1d4ed8)
  let cellBgStyle = {};
  if (isInPath) {
    const ratio = totalPathLength > 1 ? pathIndex / (totalPathLength - 1) : 1;
    // Interpolate opacity or lightness
    const opacity = 0.28 + ratio * 0.72; // from 0.28 to 1.0
    cellBgStyle = {
      backgroundColor: `rgba(10, 102, 194, ${opacity})`,
    };
  }

  return (
    <div
      data-row={r}
      data-col={c}
      onPointerDown={(e) => onPointerDown(r, c, e)}
      onPointerEnter={() => onPointerEnter(r, c)}
      className={`
        relative aspect-square flex items-center justify-center select-none transition-all duration-150
        border border-slate-200/90 cursor-pointer
        ${isInPath ? 'text-white' : 'bg-white hover:bg-slate-50'}
        ${isHint ? 'glow-hint z-20 !bg-amber-100/90' : ''}
        ${isHead ? 'z-10' : ''}
      `}
      style={cellBgStyle}
    >
      {/* Wall overlays with crisp heavy thickness */}
      {hasWallTop && (
        <div className="absolute top-0 left-0 right-0 h-[4px] bg-slate-900 z-30 pointer-events-none rounded-t" />
      )}
      {hasWallBottom && (
        <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-slate-900 z-30 pointer-events-none rounded-b" />
      )}
      {hasWallLeft && (
        <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-slate-900 z-30 pointer-events-none rounded-l" />
      )}
      {hasWallRight && (
        <div className="absolute top-0 bottom-0 right-0 w-[4px] bg-slate-900 z-30 pointer-events-none rounded-r" />
      )}

      {/* Head indicator glow */}
      {isHead && (
        <div className="absolute inset-1 rounded-full border-2 border-white/90 animate-ping opacity-30 pointer-events-none" />
      )}

      {/* Number Badge or Small Path Dot */}
      {number !== undefined ? (
        <div
          className={`
            w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base md:text-lg shadow-md
            transition-transform duration-200 z-20
            ${isInPath ? 'bg-slate-900 text-white scale-105 ring-2 ring-white/90' : 'bg-slate-900 text-white'}
            ${isHint ? 'ring-4 ring-amber-400 animate-bounce' : ''}
          `}
        >
          {number}
        </div>
      ) : isInPath ? (
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/70 shadow-sm z-10 transition-transform" />
      ) : null}
    </div>
  );
}
