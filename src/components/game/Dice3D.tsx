import React, { useState, useEffect } from 'react';
import { LudoColor } from '../../types';
import { useSound } from '../../context/SoundContext';

interface Dice3DProps {
  value: number | null;
  rolling: boolean;
  canRoll: boolean;
  color: LudoColor;
  onRoll: () => void;
}

export const Dice3D: React.FC<Dice3DProps> = ({ value, rolling, canRoll, color, onRoll }) => {
  const { playDiceRoll, playClick } = useSound();
  const [displayValue, setDisplayValue] = useState<number>(value || 6);

  useEffect(() => {
    if (rolling) {
      playDiceRoll();
      // Fast jitter interval
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 70);
      return () => clearInterval(interval);
    } else if (value !== null) {
      setDisplayValue(value);
    }
  }, [rolling, value]);

  const colorStyles = {
    red: 'border-ludo-red shadow-red-glow text-ludo-red bg-red-950/40',
    green: 'border-ludo-green shadow-green-glow text-ludo-green bg-green-950/40',
    yellow: 'border-ludo-yellow shadow-yellow-glow text-ludo-yellow bg-amber-950/40',
    blue: 'border-ludo-blue shadow-blue-glow text-ludo-blue bg-blue-950/40',
  }[color];

  const dotColor = {
    red: 'bg-red-500',
    green: 'bg-emerald-500',
    yellow: 'bg-amber-400',
    blue: 'bg-blue-500',
  }[color];

  const renderDots = (num: number) => {
    switch (num) {
      case 1:
        return (
          <div className="flex items-center justify-center w-full h-full">
            <span className={`w-4 h-4 rounded-full ${dotColor} shadow`} />
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col justify-between w-full h-full p-2">
            <span className={`w-3.5 h-3.5 rounded-full ${dotColor} self-start shadow`} />
            <span className={`w-3.5 h-3.5 rounded-full ${dotColor} self-end shadow`} />
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col justify-between w-full h-full p-2">
            <span className={`w-3 h-3 rounded-full ${dotColor} self-start shadow`} />
            <span className={`w-3 h-3 rounded-full ${dotColor} self-center shadow`} />
            <span className={`w-3 h-3 rounded-full ${dotColor} self-end shadow`} />
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col justify-between w-full h-full p-2">
            <div className="flex justify-between">
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow`} />
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow`} />
            </div>
            <div className="flex justify-between">
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow`} />
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow`} />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col justify-between w-full h-full p-2">
            <div className="flex justify-between">
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow`} />
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow`} />
            </div>
            <div className="flex justify-center">
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow`} />
            </div>
            <div className="flex justify-between">
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow`} />
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow`} />
            </div>
          </div>
        );
      case 6:
      default:
        return (
          <div className="flex justify-between w-full h-full p-2">
            <div className="flex flex-col justify-between">
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow`} />
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow`} />
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow`} />
            </div>
            <div className="flex flex-col justify-between">
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow`} />
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow`} />
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow`} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => {
          if (canRoll && !rolling) {
            playClick();
            onRoll();
          }
        }}
        disabled={!canRoll || rolling}
        className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 p-1 transition-all select-none ${
          canRoll && !rolling
            ? 'scale-105 animate-bounce-subtle cursor-pointer hover:scale-110 active:scale-95'
            : 'opacity-70 cursor-not-allowed'
        } ${colorStyles}`}
      >
        {/* Glowing border outline */}
        <div className="w-full h-full rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-center relative overflow-hidden shadow-inner">
          {renderDots(displayValue)}

          {/* Dice face gradient gloss */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 pointer-events-none" />
        </div>

        {/* Pulse ring when it's your turn to roll */}
        {canRoll && !rolling && (
          <span className="absolute -inset-1 rounded-3xl border-2 border-royal-gold/60 animate-ping pointer-events-none" />
        )}
      </button>

      {/* Helper label */}
      <div className="mt-2 text-center">
        {canRoll && !rolling ? (
          <span className="text-xs font-black uppercase tracking-wider text-royal-gold bg-royal-gold/15 px-2.5 py-0.5 rounded-full border border-royal-gold/30 animate-pulse">
            Roll Dice!
          </span>
        ) : rolling ? (
          <span className="text-xs font-bold text-amber-300">Rolling...</span>
        ) : (
          <span className="text-[11px] text-slate-400 font-medium">Wait for turn</span>
        )}
      </div>
    </div>
  );
};

