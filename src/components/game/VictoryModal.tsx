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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-3xl bg-[#FFFFFF] border border-[#DDD6CB] p-6 text-center text-[#000000] shadow-2xl">
        
        {/* Crown & Trophy Icon */}
        <div className="relative w-20 h-20 mx-auto mb-3">
          <div className="w-full h-full rounded-3xl bg-[#F7F4ED] border border-[#DDD6CB] shadow flex items-center justify-center text-4xl">
            🏆
          </div>
          <span className="absolute -top-3 -right-2 text-2xl">✨</span>
        </div>

        {/* Title */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-[#000000] text-xs font-bold uppercase tracking-[0.08em] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Match Concluded</span>
          </div>
          <h2 className="text-3xl font-black text-[#000000] tracking-tight">
            {isCurrentUserWinner ? 'Victory!' : `${winner.username.replace(/_/g, ' ')} Wins!`}
          </h2>
          <p className="text-xs text-[#6E6962] mt-1">
            {isCurrentUserWinner
              ? 'You conquered the arena and claimed the purse!'
              : 'Better luck next battle! Train and rise again.'}
          </p>
        </div>

        {/* Winner Card */}
        <div className="p-4 rounded-2xl bg-[#F7F4ED] border border-[#DDD6CB] mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] border border-[#DDD6CB] flex items-center justify-center text-2xl">
              {winner.avatar || '👑'}
            </div>
            <div className="text-left">
              <div className="text-base font-bold text-[#000000]">{winner.username.replace(/_/g, ' ')}</div>
              <div className="text-xs text-[#6E6962] font-mono">{winner.playerTag}</div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#DDD6CB] flex items-center justify-between text-xs">
            <span className="text-[#6E6962]">Prize Awarded:</span>
            <span className="text-base font-black text-[#000000] font-mono flex items-center gap-1">
              <Coins className="w-4 h-4 text-amber-500" />
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
            className="w-full sm:flex-1 py-3 rounded-full bg-[#000000] text-[#F7F4ED] font-bold text-xs uppercase tracking-[0.08em] hover:opacity-85 transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Rematch</span>
          </button>

          <button
            onClick={() => {
              playClick();
              onBackToLobby();
            }}
            className="w-full sm:flex-1 py-3 rounded-full bg-[#F7F4ED] hover:border-[#000000] text-[#000000] font-bold text-xs uppercase tracking-[0.08em] transition-all flex items-center justify-center gap-1.5 border border-[#DDD6CB]"
          >
            <Home className="w-4 h-4" />
            <span>Back to Lobby</span>
          </button>
        </div>

      </div>
    </div>
  );
};
