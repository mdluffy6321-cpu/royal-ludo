import React, { useState } from 'react';
import { BattleChallenge } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSound } from '../../context/SoundContext';
import { Swords, Plus, Shield, Flame, Trash2, ArrowRight } from 'lucide-react';

interface BattleFeedProps {
  battles: BattleChallenge[];
  onOpenCreateModal: () => void;
  onAcceptBattle: (battle: BattleChallenge) => void;
  onCancelBattle: (battleId: string) => void;
}

export const BattleFeed: React.FC<BattleFeedProps> = ({
  battles,
  onOpenCreateModal,
  onAcceptBattle,
  onCancelBattle,
}) => {
  const { user } = useAuth();
  const { playClick } = useSound();
  const [filter, setFilter] = useState<'all' | 'mine' | 'high'>('all');

  const filteredBattles = battles.filter((b) => {
    if (filter === 'mine') return b.creatorId === user?.id;
    if (filter === 'high') return b.entryFee >= 500;
    return true;
  });

  return (
    <div className="rounded-3xl glass-panel p-4 sm:p-6 border border-royal-border/80 shadow-card-glow">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-royal-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-royal text-xl sm:text-2xl font-black gold-gradient-text">
              Battle Arena
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded-full animate-pulse">
              ● Live
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Join open challenges or set your own battle for other warriors to accept.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Filter Pills */}
          <div className="flex rounded-xl bg-slate-900/80 p-1 border border-royal-border text-xs font-semibold">
            <button
              onClick={() => {
                playClick();
                setFilter('all');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-royal-gold text-royal-dark font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({battles.length})
            </button>
            <button
              onClick={() => {
                playClick();
                setFilter('mine');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'mine' ? 'bg-royal-gold text-royal-dark font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              My Challenges
            </button>
            <button
              onClick={() => {
                playClick();
                setFilter('high');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'high' ? 'bg-royal-gold text-royal-dark font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              🔥 500+
            </button>
          </div>

          {/* Set Battle Button */}
          <button
            onClick={() => {
              playClick();
              onOpenCreateModal();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-royal-gold to-amber-600 text-royal-dark font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Set Battle</span>
          </button>
        </div>
      </div>

      {/* Battles List */}
      {filteredBattles.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-royal-gold flex items-center justify-center mx-auto mb-3 text-2xl">
            ⚔️
          </div>
          <h3 className="font-royal text-lg font-bold text-white mb-1">
            No Active Battles in this category
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Be the first to challenge the arena! Click "Set Battle" to create an open room.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-royal-gold text-royal-dark font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-90"
          >
            Set First Battle (+50 Coins)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredBattles.map((battle) => {
            const isMyBattle = battle.creatorId === user?.id;
            return (
              <div
                key={battle.id}
                className={`relative rounded-2xl p-4 border transition-all ${
                  isMyBattle
                    ? 'bg-amber-950/20 border-royal-gold/60 shadow-gold-glow'
                    : 'bg-slate-900/80 border-royal-border hover:border-slate-600'
                }`}
              >
                {/* Top Badge info */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {battle.mode === '1v1' ? '⚔️ 1v1 Battle' : '👑 4-Player'}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-royal-gold">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Win: 🪙 {battle.prizePool}</span>
                  </div>
                </div>

                {/* Creator Profile */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-royal-purple to-slate-800 border border-purple-500/40 flex items-center justify-center text-lg">
                      {battle.creatorAvatar || '👑'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white truncate max-w-[120px]">
                        {battle.creatorName}
                      </div>
                      <div className="text-[10px] text-amber-400 font-mono">
                        {battle.creatorTag}
                      </div>
                    </div>
                  </div>

                  {/* Stake display */}
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Stake</span>
                    <span className="text-base font-extrabold text-white font-mono">
                      🪙 {battle.entryFee}
                    </span>
                  </div>
                </div>

                {/* Action button: Accept vs Cancel */}
                {isMyBattle ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 text-center py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] font-semibold text-amber-300 flex items-center justify-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                      <span>Waiting Opponent...</span>
                    </div>
                    <button
                      onClick={() => {
                        playClick();
                        onCancelBattle(battle.id);
                      }}
                      title="Cancel Battle and refund coins"
                      className="p-2 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400 hover:text-white hover:bg-red-900 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      playClick();
                      onAcceptBattle(battle);
                    }}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <span>Accept Challenge</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

