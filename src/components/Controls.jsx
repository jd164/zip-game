import React from 'react';
import { RotateCcw, Lightbulb, RefreshCw } from './Icons';

export default function Controls({
  onUndo,
  onHint,
  onReset,
  canUndo,
  progressText,
  fillPercentage
}) {
  return (
    <div className="w-full max-w-[420px] mx-auto space-y-3 select-none">
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 px-1">
          <span>Progresso</span>
          <span>{progressText}</span>
        </div>
        <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-[#0a66c2] transition-all duration-300 rounded-full"
            style={{ width: `${fillPercentage}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`
            flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-semibold text-sm sm:text-base shadow-sm
            transition-all duration-150 active:scale-95 border
            ${canUndo
              ? 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-slate-100'
              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'}
          `}
          title="Desfazer último movimento"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Desfazer</span>
        </button>

        <button
          onClick={onHint}
          className="
            flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-semibold text-sm sm:text-base shadow-sm
            bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 active:scale-95 transition-all duration-150
          "
          title="Destacar próxima célula correta"
        >
          <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span>Dica</span>
        </button>

        <button
          onClick={onReset}
          className="
            flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-semibold text-sm sm:text-base shadow-sm
            bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition-all duration-150
          "
          title="Recomeçar puzzle atual"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
          <span>Reiniciar</span>
        </button>
      </div>
    </div>
  );
}
