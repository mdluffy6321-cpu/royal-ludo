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
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 70);
      return () => clearInterval(interval);
    } else if (value !== null) {
      setDisplayValue(value);
    }
  }, [rolling, value]);

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
            <span className={`w-4 h-4 rounded-full ${dotColor} shadow-sm`} />
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col justify-between w-full h-full p-2">
            <span className={`w-3.5 h-3.5 rounded-full ${dotColor} self-start shadow-sm`} />
            <span className={`w-3.5 h-3.5 rounded-full ${dotColor} self-end shadow-sm`} />
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col justify-between w-full h-full p-2">
            <span className={`w-3 h-3 rounded-full ${dotColor} self-start shadow-sm`} />
            <span className={`w-3 h-3 rounded-full ${dotColor} self-center shadow-sm`} />
            <span className={`w-3 h-3 rounded-full ${dotColor} self-end shadow-sm`} />
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col justify-between w-full h-full p-2">
            <div className="flex justify-between">
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow-sm`} />
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow-sm`} />
            </div>
            <div className="flex justify-between">
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow-sm`} />
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow-sm`} />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col justify-between w-full h-full p-2">
            <div className="flex justify-between">
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow-sm`} />
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow-sm`} />
            </div>
            <div className="flex justify-center">
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow-sm`} />
            </div>
            <div className="flex justify-between">
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow-sm`} />
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow-sm`} />
            </div>
          </div>
        );
      case 6:
      default:
        return (
          <div className="flex justify-between w-full h-full p-2">
            <div className="flex flex-col justify-between">
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow-sm`} />
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow-sm`} />
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow-sm`} />
            </div>
            <div className="flex flex-col justify-between">
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow-sm`} />
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow-sm`} />
              <span className={`w-3 h-3 rounded-full ${dotColor} shadow-sm`} />
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
            ? 'scale-105 border-[#000000] cursor-pointer hover:scale-110 active:scale-95 shadow-md'
            : 'opacity-70 border-[#DDD6CB] cursor-not-allowed'
        } bg-[#FFFFFF]`}
      >
        <div className="w-full h-full rounded-xl bg-[#FFFFFF] border border-[#DDD6CB] flex items-center justify-center relative overflow-hidden shadow-inner">
          {renderDots(displayValue)}
        </div>

        {canRoll && !rolling && (
          <span className="absolute -inset-1 rounded-3xl border-2 border-[#000000] animate-ping pointer-events-none" />
        )}
      </button>

      {/* Helper label */}
      <div className="mt-2 text-center">
        {canRoll && !rolling ? (
          <span className="text-xs font-black uppercase tracking-[0.08em] text-[#F7F4ED] bg-[#000000] px-3 py-1 rounded-full shadow-sm animate-pulse">
            Roll Dice!
          </span>
        ) : rolling ? (
          <span className="text-xs font-bold text-[#000000]">Rolling...</span>
        ) : (
          <span className="text-[11px] text-[#6E6962] font-medium">Wait for turn</span>
        )}
      </div>
    </div>
  );
};
