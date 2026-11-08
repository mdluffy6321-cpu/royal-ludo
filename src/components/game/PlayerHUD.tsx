import React from 'react';
import { Player, LudoColor } from '../../types';
import { Crown, Bot, Wifi } from 'lucide-react';

interface PlayerHUDProps {
  player: Player;
  isCurrentTurn: boolean;
  timeLeft: number;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const PlayerHUD: React.FC<PlayerHUDProps> = ({ player, isCurrentTurn, timeLeft, position }) => {
  const colorBorders = {
    red: 'border-ludo-red text-ludo-red',
    green: 'border-ludo-green text-ludo-green',
    yellow: 'border-ludo-yellow text-ludo-yellow',
    blue: 'border-ludo-blue text-ludo-blue',
  }[player.color];

  const colorBg = {
    red: 'bg-red-950/40',
    green: 'bg-green-950/40',
    yellow: 'bg-amber-950/40',
    blue: 'bg-blue-950/40',
  }[player.color];

  // Timer color
  const timerColor = timeLeft > 8 ? 'text-emerald-400' : timeLeft > 4 ? 'text-amber-400' : 'text-red-400 animate-pulse';

  return (
    <div
      className={`relative p-2.5 sm:p-3 rounded-2xl border transition-all ${
        isCurrentTurn
          ? `glass-panel-gold ${colorBorders} shadow-card-glow scale-105 z-10`
          : 'glass-panel border-royal-border/60 opacity-80'
      } ${colorBg}`}
    >
      <div className="flex items-center gap-2.5">
        
        {/* Avatar with Turn Ring */}
        <div className="relative">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xl shadow">
            {player.avatar || '👑'}
          </div>

          {/* Color marker tag */}
          <span 
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
              player.color === 'red' ? 'bg-red-500' :
              player.color === 'green' ? 'bg-emerald-500' :
              player.color === 'yellow' ? 'bg-amber-400' : 'bg-blue-500'
            }`} 
          />
        </div>

        {/* Player Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[90px] sm:max-w-[110px]">
              {player.username.replace(/_/g, ' ')}
            </span>
            {player.isBot && (
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1 rounded flex items-center gap-0.5">
                <Bot className="w-2.5 h-2.5" /> Bot
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
            <span className="font-mono text-royal-gold text-[10px]">{player.playerTag}</span>
            <span className="font-semibold text-slate-300">
              Home: <strong className="text-royal-gold">{player.tokensHome || 0}/4</strong>
            </span>
          </div>
        </div>

        {/* Turn Countdown Timer */}
        {isCurrentTurn && (
          <div className="flex flex-col items-center justify-center pl-1 border-l border-slate-700/60">
            <span className={`text-sm sm:text-base font-black font-mono leading-none ${timerColor}`}>
              {timeLeft}s
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
              Turn
            </span>
          </div>
        )}

      </div>
    </div>
  );
};

