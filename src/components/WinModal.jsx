import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, Share2, ArrowRight, CheckCircle2 } from './Icons';
import { sound } from '../utils/audio';

export default function WinModal({
  isOpen,
  timeInSeconds,
  puzzleSize,
  difficulty,
  onPlayNext,
  onClose
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      sound.playWin();

      // Confetti burst
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#0a66c2', '#388fe5', '#f59e0b', '#10b981', '#6366f1']
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#0a66c2', '#388fe5', '#f59e0b', '#10b981', '#6366f1']
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const mins = Math.floor(timeInSeconds / 60);
  const secs = timeInSeconds % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const handleShare = () => {
    const text = `🧩 Resolvi o puzzle Zip (${puzzleSize}x${puzzleSize} • ${difficulty.toUpperCase()}) em ${timeFormatted}! Joga também!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-5 animate-scale-in relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-200">
          <Trophy className="w-9 h-9 text-amber-900" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 font-heading">
            Excelente Trabalho!
          </h2>
          <p className="text-sm text-slate-500">
            Completaste o caminho com sucesso!
          </p>
        </div>

        {/* Stats card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 grid grid-cols-2 gap-3 text-center">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tempo</span>
            <div className="flex items-center justify-center gap-1 font-mono font-bold text-lg text-slate-800">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>{timeFormatted}</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Grelha</span>
            <div className="font-bold text-lg text-slate-800">
              {puzzleSize}×{puzzleSize} <span className="text-xs font-normal text-slate-500">({difficulty})</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onPlayNext}
            className="
              w-full py-3.5 px-4 rounded-xl font-bold text-white bg-[#0a66c2] hover:bg-[#004182] active:scale-95
              shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all duration-150
            "
          >
            <span>Próximo Puzzle</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleShare}
            className="
              w-full py-3 px-4 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95
              flex items-center justify-center gap-2 transition-all duration-150 border border-slate-200
            "
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copiado para a área de transferência!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-600" />
                <span>Partilhar Resultado</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
