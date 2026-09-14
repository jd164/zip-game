import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Grid, ShieldAlert, Sparkles } from './Icons';

export default function HowToPlay() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-[420px] mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#0a66c2]" />
          <span className="text-sm sm:text-base">Como Jogar (Regras)</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 space-y-3.5 text-xs sm:text-sm text-slate-600 border-t border-slate-100 animate-fade-in">
          {/* Rule 1 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              1-2-3
            </div>
            <div>
              <p className="font-semibold text-slate-800">Conecta os números em ordem</p>
              <p className="text-slate-500 leading-snug">Começa no número 1 e visita todos os números marcados na ordem exata (1 → 2 → 3 → ...).</p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0a66c2] flex items-center justify-center shrink-0 shadow-sm">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Preenche toda a grelha</p>
              <p className="text-slate-500 leading-snug">Traça um único caminho contínuo. Nenhuma célula da grelha pode ficar em branco.</p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Respeita as paredes e caminhos</p>
              <p className="text-slate-500 leading-snug">Não podes cruzar linhas pretas grossas (barreiras), nem passar duas vezes pela mesma célula.</p>
            </div>
          </div>

          {/* Tips */}
          <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100 text-blue-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              <strong>Dica de controlo:</strong> Arrasta o rato ou dedo sobre as células. Se arrastares para trás, o caminho recua automaticamente!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
