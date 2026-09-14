import React, { useEffect } from 'react';
import { Clock } from './Icons';

export default function Timer({ seconds, isRunning, setSeconds }) {
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, setSeconds]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/90 text-slate-800 rounded-full font-mono font-semibold text-sm shadow-sm border border-slate-200/80">
      <Clock className="w-4 h-4 text-slate-500" />
      <span>{formatTime(seconds)}</span>
    </div>
  );
}
