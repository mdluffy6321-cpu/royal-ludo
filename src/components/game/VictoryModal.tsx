import React, { useEffect } from 'react';
import { Player } from '../../types';
import { useSound } from '../../context/SoundContext';
import { Trophy, Coins, RotateCcw, Home, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VictoryModalProps {
  winner: Player | null;
  prizePool: number;
  isCurrentUserWinner: boolean;
  onPlayAgain: () => void;
  onBackToLobby: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  prizePool,
  isCurrentUserWinner,
  onPlayAgain,
  onBackToLobby,
}) => {
  const { playVictory, playClick } = useSound();

  useEffect(() => {
    if (winner) {
      playVictory();
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
      });
    }
  }, [winner]);

  if (!winner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-3xl glass-panel-gold p-6 text-center text-white shadow-2xl border border-royal-gold">
        
        {/* Crown & Trophy Icon */}
        <div className="relative w-20 h-20 mx-auto mb-3">
          <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-royal-gold to-amber-600 p-1 shadow-gold-glow animate-bounce-subtle flex items-center justify-center text-4xl">
            🏆
          </div>
          <span className="absolute -top-3 -right-2 text-2xl animate-spin-slow">✨</span>
        </div>

        {/* Title */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-royal-gold/20 border border-royal-gold/40 text-royal-gold text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Match Concluded</span>
          </div>
          <h2 className="font-royal text-3xl font-black gold-gradient-text">
            {isCurrentUserWinner ? 'Glorious Victory!' : `${winner.username} Wins!`}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {isCurrentUserWinner
              ? 'You conquered the Royal Arena and claimed the realm!'
              : 'Better luck next battle warrior! Train and rise again.'}
          </p>
        </div>

        {/* Winner Card */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-royal-border/80 mb-6 shadow-inner">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border-2 border-royal-gold flex items-center justify-center text-2xl shadow-gold-glow">
              {winner.avatar || '👑'}
            </div>
            <div className="text-left">
              <div className="text-base font-bold text-white">{winner.username}</div>
              <div className="text-xs text-royal-gold font-mono">{winner.playerTag}</div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Escrow Prize Awarded:</span>
            <span className="text-base font-black text-royal-gold font-mono flex items-center gap-1">
              <Coins className="w-4 h-4" />
              <span>+{prizePool.toLocaleString()} Coins</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={() => {
              playClick();
              onPlayAgain();
            }}
            className="w-full sm:flex-1 py-3 rounded-2xl bg-gradient-to-r from-royal-gold via-amber-500 to-amber-600 text-royal-dark font-royal font-extrabold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Rematch</span>
          </button>

          <button
            onClick={() => {
              playClick();
              onBackToLobby();
            }}
            className="w-full sm:flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <Home className="w-4 h-4" />
            <span>Back to Lobby</span>
          </button>
        </div>

      </div>
    </div>
  );
};

