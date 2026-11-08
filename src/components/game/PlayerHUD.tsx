import React from 'react';
import { Player, LudoColor } from '../../types';
import { Bot } from 'lucide-react';

interface PlayerHUDProps {
  player: Player;
  isCurrentTurn: boolean;
  timeLeft: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const PlayerHUD: React.FC<PlayerHUDProps> = ({ player, isCurrentTurn, timeLeft }) => {
  const colorDot = {
    red: 'bg-red-500',
    green: 'bg-emerald-500',
    yellow: 'bg-amber-400',
    blue: 'bg-blue-500',
  }[player.color];

  // Timer color
  const timerColor = timeLeft > 8 ? 'text-[#000000]' : timeLeft > 4 ? 'text-amber-600' : 'text-red-500 animate-pulse';

  return (
    <div
      className={`relative p-2.5 sm:p-3 rounded-2xl border transition-all ${
        isCurrentTurn
          ? 'bg-[#FFFFFF] border-[#000000] shadow-md scale-105 z-10'
          : 'bg-[#FFFFFF] border-[#DDD6CB] opacity-85'
      }`}
    >
      <div className="flex items-center gap-2.5">
        
        {/* Avatar with Turn Ring */}
        <div className="relative">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#F7F4ED] border border-[#DDD6CB] flex items-center justify-center text-xl">
            {player.avatar || '👑'}
          </div>

          {/* Color marker tag */}
          <span 
            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${colorDot}`} 
          />
        </div>

        {/* Player Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-bold text-[#000000] truncate max-w-[90px] sm:max-w-[110px]">
              {player.username.replace(/_/g, ' ')}
            </span>
            {player.isBot && (
              <span className="text-[10px] bg-[#F7F4ED] text-[#6E6962] border border-[#DDD6CB] px-1 rounded flex items-center gap-0.5">
                <Bot className="w-2.5 h-2.5" /> Bot
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#6E6962] mt-0.5">
            <span className="font-mono text-[#000000] text-[10px]">{player.playerTag}</span>
            <span className="font-semibold text-[#000000]">
              Home: <strong>{player.tokensHome || 0}/4</strong>
            </span>
          </div>
        </div>

        {/* Turn Countdown Timer */}
        {isCurrentTurn && (
          <div className="flex flex-col items-center justify-center pl-1 border-l border-[#DDD6CB]">
            <span className={`text-sm sm:text-base font-black font-mono leading-none ${timerColor}`}>
              {timeLeft}s
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#6E6962] font-semibold">
              Turn
            </span>
          </div>
        )}

      </div>
    </div>
  );
};
