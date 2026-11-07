import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSound } from '../../context/SoundContext';
import { useSocket } from '../../context/SocketContext';
import { X, Swords, Coins, ShieldCheck, Flame, Users } from 'lucide-react';
import { GameMode } from '../../types';

interface CreateBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBattleCreated: (battle: any) => void;
}

const PRESET_CHIPS = [50, 100, 250, 500, 1000, 2500];

export const CreateBattleModal: React.FC<CreateBattleModalProps> = ({ isOpen, onClose, onBattleCreated }) => {
  const { user, updateCoins } = useAuth();
  const { playClick, playSixRolled } = useSound();
  const { socket } = useSocket();

  const [stake, setStake] = useState<number>(100);
  const [mode, setMode] = useState<GameMode>('1v1');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  // 1v1 prize is 2 * stake - 5% arena fee
  const prizePool = mode === '1v1' ? Math.round(stake * 2 * 0.95) : Math.round(stake * 4 * 0.90);

  const handleSetBattle = () => {
    if (!user) return;
    if (user.coins < stake) {
      alert(`Insufficient virtual coins! You have ${user.coins} coins, but need ${stake} coins to create this battle.`);
      return;
    }

    playClick();
    setLoading(true);

    const newBattle = {
      id: `battle_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      creatorId: user.id,
      creatorName: user.username,
      creatorAvatar: user.avatar,
      creatorTag: user.playerTag,
      entryFee: stake,
      prizePool,
      mode,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    // Deduct stake escrow
    updateCoins(user.coins - stake);

    if (socket) {
      socket.emit('CREATE_BATTLE_CHALLENGE', newBattle);
    }

    playSixRolled();
    setLoading(false);
    onBattleCreated(newBattle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl glass-panel-gold p-6 text-white shadow-2xl border border-royal-gold/40">
        
        {/* Close Button */}
        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Swords className="w-3.5 h-3.5" />
            <span>Open Arena Challenge</span>
          </div>
          <h2 className="font-royal text-2xl font-black gold-gradient-text">
            Set a Ludo Battle
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Create an open challenge for any player online to accept.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Select Game Battle Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                playClick();
                setMode('1v1');
              }}
              className={`p-3 rounded-2xl flex items-center gap-3 border transition-all text-left ${
                mode === '1v1'
                  ? 'bg-amber-950/60 border-royal-gold shadow-gold-glow text-white'
                  : 'bg-slate-900/60 border-royal-border text-slate-400 hover:text-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
                ⚔️
              </div>
              <div>
                <div className="text-sm font-bold text-white">1v1 Quick Duel</div>
                <div className="text-[11px] text-amber-400/90 font-medium">Fast 2-Player</div>
              </div>
            </button>

            <button
              onClick={() => {
                playClick();
                setMode('classic4p');
              }}
              className={`p-3 rounded-2xl flex items-center gap-3 border transition-all text-left ${
                mode === 'classic4p'
                  ? 'bg-purple-950/60 border-purple-400 shadow-purple-glow text-white'
                  : 'bg-slate-900/60 border-royal-border text-slate-400 hover:text-white'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-lg">
                👑
              </div>
              <div>
                <div className="text-sm font-bold text-white">Classic 4-Player</div>
                <div className="text-[11px] text-purple-300/90 font-medium">Grand 4-Way</div>
              </div>
            </button>
          </div>
        </div>

        {/* Stake Chips Selection */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Select Virtual Coin Stake
            </label>
            <span className="text-xs text-amber-400 font-mono">
              Balance: {user?.coins.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {PRESET_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  playClick();
                  setStake(chip);
                }}
                className={`py-2 px-3 rounded-xl font-mono text-sm font-bold transition-all border ${
                  stake === chip
                    ? 'bg-gradient-to-r from-royal-gold to-amber-600 text-royal-dark border-amber-300 shadow-gold-glow scale-105'
                    : 'bg-slate-900/80 border-slate-700/80 text-slate-200 hover:border-slate-500'
                }`}
              >
                🪙 {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-royal-border mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Entry Stake (Escrow):</span>
            <span className="font-mono text-slate-200">{stake} Virtual Coins</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Arena Platform Fee:</span>
            <span className="font-mono text-emerald-400">Low 5%</span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-royal-gold uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Winner Takes:
            </span>
            <span className="text-lg font-black text-royal-gold font-mono">
              🪙 {prizePool.toLocaleString()} Coins
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSetBattle}
          disabled={loading || (user ? user.coins < stake : true)}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-royal-gold via-amber-500 to-amber-600 text-royal-dark font-royal font-extrabold text-sm uppercase tracking-wider shadow-gold-glow hover:opacity-95 active:scale-95 transition-all disabled:opacity-50"
        >
          {user && user.coins < stake ? 'Insufficient Virtual Coins' : 'Set Battle Challenge'}
        </button>
      </div>
    </div>
  );
};

