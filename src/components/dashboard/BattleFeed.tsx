import React, { useState } from 'react';
import { BattleChallenge } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSound } from '../../context/SoundContext';
import { Swords, Plus, Trash2, ArrowRight } from 'lucide-react';

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
    <div className="bg-[#FFFFFF] border border-[#DDD6CB] rounded-3xl p-4 sm:p-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#DDD6CB]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#000000] tracking-tight">
              Battle Arena
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] bg-[#F7F4ED] text-[#000000] border border-[#DDD6CB] px-2.5 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <p className="text-xs text-[#6E6962] mt-0.5">
            Join open challenges or set your own battle.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Filter Pills */}
          <div className="flex rounded-full bg-[#F7F4ED] border border-[#DDD6CB] p-1 text-xs font-bold">
            <button
              onClick={() => {
                playClick();
                setFilter('all');
              }}
              className={`px-3 py-1 rounded-full transition-all ${
                filter === 'all' ? 'bg-[#000000] text-[#F7F4ED]' : 'text-[#6E6962] hover:text-[#000000]'
              }`}
            >
              All ({battles.length})
            </button>
            <button
              onClick={() => {
                playClick();
                setFilter('mine');
              }}
              className={`px-3 py-1 rounded-full transition-all ${
                filter === 'mine' ? 'bg-[#000000] text-[#F7F4ED]' : 'text-[#6E6962] hover:text-[#000000]'
              }`}
            >
              My Challenges
            </button>
            <button
              onClick={() => {
                playClick();
                setFilter('high');
              }}
              className={`px-3 py-1 rounded-full transition-all ${
                filter === 'high' ? 'bg-[#000000] text-[#F7F4ED]' : 'text-[#6E6962] hover:text-[#000000]'
              }`}
            >
              500+
            </button>
          </div>

          {/* Set Battle Button */}
          <button
            onClick={() => {
              playClick();
              onOpenCreateModal();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#000000] text-[#F7F4ED] font-bold text-xs uppercase tracking-[0.08em] hover:opacity-85 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Set Battle</span>
          </button>
        </div>
      </div>

      {/* Battles List */}
      {filteredBattles.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-[#F7F4ED] border border-dashed border-[#DDD6CB]">
          <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] border border-[#DDD6CB] text-[#000000] flex items-center justify-center mx-auto mb-3 text-2xl">
            ⚔️
          </div>
          <h3 className="text-base font-bold text-[#000000] mb-1">
            No Active Battles in this category
          </h3>
          <p className="text-xs text-[#6E6962] max-w-sm mx-auto mb-4">
            Be the first to challenge the arena. Click "Set Battle" to create an open room.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="px-5 py-2.5 rounded-full bg-[#000000] text-[#F7F4ED] font-bold text-xs uppercase tracking-[0.08em] hover:opacity-85"
          >
            Set First Battle
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
                    ? 'bg-[#F7F4ED] border-[#000000]'
                    : 'bg-[#FFFFFF] border-[#DDD6CB] hover:border-[#000000]'
                }`}
              >
                {/* Top Badge info */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-0.5 rounded-full bg-[#F7F4ED] text-[#000000] border border-[#DDD6CB]">
                    {battle.mode === '1v1' ? '1v1 Duel' : '4-Player'}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#000000] bg-[#F7F4ED] px-2 py-0.5 rounded-full border border-[#DDD6CB]">
                    <span>Win: 🪙 {battle.prizePool}</span>
                  </div>
                </div>

                {/* Creator Profile */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#F7F4ED] border border-[#DDD6CB] flex items-center justify-center text-lg">
                      {battle.creatorAvatar || '👑'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#000000] truncate max-w-[130px]">
                        {battle.creatorName.replace(/_/g, ' ')}
                      </div>
                      <div className="text-[10px] text-[#6E6962] font-mono">
                        {battle.creatorTag}
                      </div>
                    </div>
                  </div>

                  {/* Stake display */}
                  <div className="text-right">
                    <span className="text-[9px] text-[#6E6962] block uppercase font-bold tracking-wider">Stake</span>
                    <span className="text-base font-black text-[#000000] font-mono">
                      🪙 {battle.entryFee}
                    </span>
                  </div>
                </div>

                {/* Action button */}
                {isMyBattle ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 text-center py-2 px-3 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-[11px] font-medium text-[#6E6962] flex items-center justify-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#000000] animate-pulse"></span>
                      <span>Waiting for Opponent...</span>
                    </div>
                    <button
                      onClick={() => {
                        playClick();
                        onCancelBattle(battle.id);
                      }}
                      title="Cancel Battle and refund coins"
                      className="p-2 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-red-500 hover:text-white hover:bg-red-500 transition-colors"
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
                    className="w-full py-2.5 rounded-full bg-[#000000] hover:opacity-85 text-[#F7F4ED] font-bold text-xs uppercase tracking-[0.08em] flex items-center justify-center gap-2 transition-all"
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
