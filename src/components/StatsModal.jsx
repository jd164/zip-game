import React from 'react';
import { loadStats, formatTime, avgTime } from '../utils/stats';
import { Trophy, Clock, BarChart2, X, Flame, Target, CheckCircle2 } from './Icons';

// Mini horizontal bar component
function StatBar({ value, max, color = 'bg-[#0a66c2]' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// Stat card tile
function StatTile({ icon, label, value, sub }) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex flex-col items-center gap-1 text-center">
      <div className="text-slate-400 mb-0.5">{icon}</div>
      <div className="font-bold text-xl text-slate-900 font-mono leading-none">{value}</div>
      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider leading-tight">{label}</div>
      {sub && <div className="text-[10px] text-slate-400">{sub}</div>}
    </div>
  );
}

const DIFF_LABELS = { easy: 'Facil', medium: 'Medio', hard: 'Dificil' };
const DIFF_COLORS = { easy: 'bg-emerald-500', medium: 'bg-amber-500', hard: 'bg-rose-500' };
const SIZE_COLORS = { 5: 'bg-violet-500', 6: 'bg-[#0a66c2]', 7: 'bg-cyan-500' };

export default function StatsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const stats = loadStats();
  const winRate = stats.totalGames > 0 ? Math.round((stats.totalWins / stats.totalGames) * 100) : 0;
  const avg = avgTime(stats);
  const maxWinByDiff = Math.max(1, ...[stats.winsByDifficulty?.easy || 0, stats.winsByDifficulty?.medium || 0, stats.winsByDifficulty?.hard || 0]);
  const maxWinBySize = Math.max(1, ...[stats.winsBySize?.[5] || 0, stats.winsBySize?.[6] || 0, stats.winsBySize?.[7] || 0]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-5 relative overflow-hidden" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0a66c2] to-blue-400 flex items-center justify-center shadow-md shadow-blue-200">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 leading-none font-heading">Estatisticas</h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">O teu historial de jogo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all active:scale-95 cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main stat tiles */}
        <div className="grid grid-cols-2 gap-2.5">
          <StatTile
            icon={<Trophy className="w-4 h-4 text-amber-500 mx-auto" />}
            label="Vitorias"
            value={stats.totalWins}
          />
          <StatTile
            icon={<Target className="w-4 h-4 text-[#0a66c2] mx-auto" />}
            label="Taxa de vitoria"
            value={`${winRate}%`}
            sub={`${stats.totalGames} jogos`}
          />
          <StatTile
            icon={<Flame className="w-4 h-4 text-orange-500 mx-auto" />}
            label="Sequencia atual"
            value={stats.currentStreak}
            sub={`Max: ${stats.bestStreak}`}
          />
          <StatTile
            icon={<Clock className="w-4 h-4 text-violet-500 mx-auto" />}
            label="Tempo medio"
            value={avg !== null ? formatTime(avg) : '--:--'}
          />
        </div>

        {/* Best times per combination */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Melhores Tempos</div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-2">
            {[5, 6, 7].flatMap(s =>
              ['easy', 'medium', 'hard'].map(d => {
                const key = `${s}_${d}`;
                const best = stats.bestTimes?.[key];
                if (best === undefined) return null;
                return (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-block w-2 h-2 rounded-full ${SIZE_COLORS[s]}`} />
                      <span className="font-semibold text-slate-700">{s}x{s}</span>
                      <span className="text-slate-400">-</span>
                      <span className="text-slate-500">{DIFF_LABELS[d]}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 font-bold font-mono">
                      <CheckCircle2 className="w-3 h-3" />
                      {formatTime(best)}
                    </div>
                  </div>
                );
              })
            ).filter(Boolean)}
            {(!stats.bestTimes || Object.keys(stats.bestTimes).length === 0) && (
              <p className="text-xs text-slate-400 text-center py-1">Ainda sem tempos registados. Joga e ganha!</p>
            )}
          </div>
        </div>

        {/* Wins by difficulty bar chart */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Vitorias por Dificuldade</div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-2.5">
            {['easy', 'medium', 'hard'].map(d => {
              const count = stats.winsByDifficulty?.[d] || 0;
              return (
                <div key={d} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{DIFF_LABELS[d]}</span>
                    <span className="font-mono font-bold text-slate-600">{count}</span>
                  </div>
                  <StatBar value={count} max={maxWinByDiff} color={DIFF_COLORS[d]} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Wins by size bar chart */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Vitorias por Tamanho</div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 space-y-2.5">
            {[5, 6, 7].map(s => {
              const count = stats.winsBySize?.[s] || 0;
              return (
                <div key={s} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{s}x{s}</span>
                    <span className="font-mono font-bold text-slate-600">{count}</span>
                  </div>
                  <StatBar value={count} max={maxWinBySize} color={SIZE_COLORS[s]} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Clear stats */}
        <button
          onClick={() => {
            if (window.confirm('Tens a certeza que queres apagar todas as estatisticas?')) {
              localStorage.removeItem('zip_game_stats');
              onClose();
            }
          }}
          className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
        >
          Apagar estatisticas
        </button>
      </div>
    </div>
  );
}
