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

    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      const channel = new BroadcastChannel('royal_ludo_arena');
      channel.postMessage({ type: 'NEW_BATTLE', battle: newBattle });
      channel.close();
    }

    playSixRolled();
    setLoading(false);
    onBattleCreated(newBattle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#FFFFFF] border border-[#DDD6CB] p-6 text-[#000000] shadow-xl">
        
        {/* Close Button */}
        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-[#6E6962] hover:text-[#000000] hover:border-[#000000] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-[#000000] text-xs font-bold uppercase tracking-[0.08em] mb-2">
            <Swords className="w-3.5 h-3.5" />
            <span>Open Arena Challenge</span>
          </div>
          <h2 className="text-2xl font-black text-[#000000] tracking-tight">
            Set a Ludo Battle
          </h2>
          <p className="text-xs text-[#6E6962] mt-1">
            Create an open challenge for any player online to accept.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-[#6E6962] uppercase tracking-[0.08em] mb-2">
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
                  ? 'bg-[#F7F4ED] border-[#000000]'
                  : 'bg-[#FFFFFF] border-[#DDD6CB] text-[#6E6962] hover:border-[#000000]'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#4A87D6]/10 border border-[#4A87D6]/30 text-lg flex items-center justify-center">
                ⚔️
              </div>
              <div>
                <div className="text-sm font-bold text-[#000000]">1v1 Duel</div>
                <div className="text-[11px] text-[#6E6962]">Fast 2-Player</div>
              </div>
            </button>

            <button
              onClick={() => {
                playClick();
                setMode('classic4p');
              }}
              className={`p-3 rounded-2xl flex items-center gap-3 border transition-all text-left ${
                mode === 'classic4p'
                  ? 'bg-[#F7F4ED] border-[#000000]'
                  : 'bg-[#FFFFFF] border-[#DDD6CB] text-[#6E6962] hover:border-[#000000]'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#D4A7D7]/20 border border-[#D4A7D7]/40 text-lg flex items-center justify-center">
                👑
              </div>
              <div>
                <div className="text-sm font-bold text-[#000000]">Classic 4P</div>
                <div className="text-[11px] text-[#6E6962]">Grand 4-Way</div>
              </div>
            </button>
          </div>
        </div>

        {/* Stake Chips Selection */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-[#6E6962] uppercase tracking-[0.08em]">
              Select Virtual Coin Stake
            </label>
            <span className="text-xs text-[#000000] font-mono font-bold">
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
                className={`py-2 px-3 rounded-full font-mono text-sm font-bold transition-all border ${
                  stake === chip
                    ? 'bg-[#000000] text-[#F7F4ED] border-[#000000]'
                    : 'bg-[#F7F4ED] border-[#DDD6CB] text-[#000000] hover:border-[#000000]'
                }`}
              >
                🪙 {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-3.5 rounded-2xl bg-[#F7F4ED] border border-[#DDD6CB] mb-6">
          <div className="flex items-center justify-between text-xs text-[#6E6962] mb-1.5">
            <span>Entry Stake (Escrow):</span>
            <span className="font-mono text-[#000000] font-bold">{stake} Virtual Coins</span>
          </div>
          <div className="flex items-center justify-between text-xs text-[#6E6962] mb-2">
            <span>Arena Platform Fee:</span>
            <span className="font-mono text-emerald-600 font-bold">Low 5%</span>
          </div>
          <div className="pt-2 border-t border-[#DDD6CB] flex items-center justify-between">
            <span className="text-xs font-bold text-[#000000] uppercase tracking-[0.08em]">
              Winner Takes:
            </span>
            <span className="text-base font-black text-[#000000] font-mono">
              🪙 {prizePool.toLocaleString()} Coins
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSetBattle}
          disabled={loading || (user ? user.coins < stake : true)}
          className="w-full py-3.5 rounded-full bg-[#000000] text-[#F7F4ED] font-bold text-xs uppercase tracking-[0.08em] hover:opacity-85 active:scale-95 transition-all disabled:opacity-40"
        >
          {user && user.coins < stake ? 'Insufficient Virtual Coins' : 'Set Battle Challenge'}
        </button>
      </div>
    </div>
  );
};
