import React from 'react';
import { Volume2, VolumeX, PlusCircle, BarChart2 } from './Icons';
import Timer from './Timer';

export default function Header({
  size,
  setSize,
  difficulty,
  setDifficulty,
  isMuted,
  toggleMute,
  seconds,
  isRunning,
  setSeconds,
  puzzleId,
  totalNumbers,
  onNewGame,
  onShowStats
}) {
  return (
    <header className="w-full max-w-[440px] mx-auto space-y-3">
      {/* Top row: Brand + Puzzle Info + Timer + Sound */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#0a66c2] text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-blue-500/20 font-heading">
            Z
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-extrabold text-slate-900 leading-none font-heading tracking-tight">
                Zip
              </h1>
              {puzzleId && (
                <span className="px-1.5 py-0.5 rounded-md bg-slate-200/90 text-slate-700 font-mono text-[10px] font-bold">
                  #{puzzleId}
                </span>
              )}
            </div>
            <p className="text-[11px] font-medium text-slate-500 tracking-wide mt-0.5">
              {totalNumbers ? `Ligar de 1 até ${totalNumbers}` : 'Puzzle Diário de Caminho'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Timer seconds={seconds} isRunning={isRunning} setSeconds={setSeconds} />

          <button
            type="button"
            onClick={onShowStats}
            className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-[#0a66c2] hover:bg-blue-50 active:scale-95 shadow-sm transition-all cursor-pointer"
            title="Ver estatisticas globais"
            aria-label="Estatisticas"
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:scale-95 shadow-sm transition-all cursor-pointer"
            title={isMuted ? "Ativar som" : "Desativar som"}
            aria-label="Som"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#0a66c2]" />}
          </button>
        </div>
      </div>

      {/* Second row: Size & Difficulty pills + New Game button */}
      <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-200/80">
        {/* Size Selector */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-bold text-slate-700 shadow-inner">
          {[5, 6, 7].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`
                px-2.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer font-bold text-xs
                ${size === s ? 'bg-[#0a66c2] text-white shadow-md font-extrabold' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/40'}
              `}
            >
              {s}×{s}
            </button>
          ))}
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-bold text-slate-700 shadow-inner">
          {[
            { id: 'easy', label: 'Fácil' },
            { id: 'medium', label: 'Médio' },
            { id: 'hard', label: 'Difícil' }
          ].map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDifficulty(d.id)}
              className={`
                px-2 py-1.5 rounded-lg transition-all duration-150 cursor-pointer font-bold text-xs
                ${difficulty === d.id ? 'bg-slate-900 text-white shadow-md font-extrabold' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/40'}
              `}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* New Puzzle Button */}
        <button
          type="button"
          onClick={onNewGame}
          className="py-1.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-700 active:scale-95 shadow-sm transition-all cursor-pointer shrink-0"
          title="Gerar novo puzzle aleatório"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Novo</span>
        </button>
      </div>
    </header>
  );
}
