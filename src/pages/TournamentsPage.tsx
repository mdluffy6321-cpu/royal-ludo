import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { Trophy } from 'lucide-react';

export const TournamentsPage: React.FC = () => {
  const { user, updateCoins } = useAuth();
  const { playClick, playSixRolled } = useSound();
  const [registered, setRegistered] = useState<Record<string, boolean>>({});

  const handleRegister = (tourneyId: string, fee: number) => {
    if (!user) return;
    if (user.coins < fee) {
      alert(`You need ${fee} coins. You have ${user.coins}.`);
      return;
    }
    playClick();
    updateCoins(user.coins - fee);
    setRegistered(prev => ({ ...prev, [tourneyId]: true }));
    playSixRolled();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#000000] tracking-tight">Tournaments</h1>
        <p className="text-sm text-[#6E6962] mt-1">Compete in knockout brackets for virtual trophies and prizes.</p>
      </div>

      {/* Featured Tournament */}
      <div className="bg-[#000000] rounded-3xl p-6 sm:p-8 text-[#F7F4ED]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F7F4ED]/10 border border-[#F7F4ED]/20 flex items-center justify-center text-3xl">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.1em] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  ● Registration Open
                </span>
                <span className="text-[10px] text-[#F7F4ED]/50 font-mono">Single Elimination</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#F7F4ED] tracking-tight">
                The Maharaja Grand Championship
              </h2>
              <p className="text-sm text-[#F7F4ED]/60 mt-1">8 Warriors · 3 Rounds · 1 Supreme Champion</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <div className="text-[10px] text-[#F7F4ED]/50 uppercase tracking-widest font-bold">Prize Pool</div>
              <div className="text-xl font-black text-amber-400 font-mono">🪙 3,600</div>
            </div>
            <button
              onClick={() => handleRegister('grand_cup', 500)}
              disabled={registered['grand_cup']}
              className={`px-6 py-3 rounded-full font-black text-xs uppercase tracking-[0.08em] transition-all ${
                registered['grand_cup']
                  ? 'bg-[#F7F4ED]/10 text-emerald-400 border border-emerald-500/30 cursor-default'
                  : 'bg-[#F7F4ED] text-[#000000] hover:bg-[#DDD6CB]'
              }`}
            >
              {registered['grand_cup'] ? '✓ Registered' : 'Register (🪙 500)'}
            </button>
          </div>
        </div>

        {/* Bracket */}
        <div className="border-t border-[#F7F4ED]/10 pt-6">
          <h3 className="text-xs font-black text-[#F7F4ED]/50 uppercase tracking-[0.1em] mb-4">Bracket Tree</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Quarterfinals */}
            <div className="space-y-2">
              <span className="text-xs font-black text-[#4A87D6] uppercase tracking-[0.08em]">Quarterfinals (8)</span>
              {[
                { p1: 'King Maharaja', p2: 'Player 8812', w: 'King Maharaja' },
                { p1: 'Queen Maharani', p2: 'Knight Vikram', w: 'Queen Maharani' },
                { p1: 'Master Arjun', p2: 'Ludo Tiger', w: 'Master Arjun' },
                { p1: 'Vanguard 8', p2: 'Falcon 9', w: 'Pending' },
              ].map((m, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[#F7F4ED]/5 border border-[#F7F4ED]/10 text-xs">
                  <div className={`py-0.5 ${m.w === m.p1 ? 'text-[#F7F4ED] font-bold' : 'text-[#F7F4ED]/40'}`}>{m.p1} {m.w === m.p1 && '✓'}</div>
                  <div className={`py-0.5 ${m.w === m.p2 ? 'text-[#F7F4ED] font-bold' : 'text-[#F7F4ED]/40'}`}>{m.p2} {m.w === m.p2 && '✓'}</div>
                </div>
              ))}
            </div>

            {/* Semifinals */}
            <div className="space-y-2 md:mt-8">
              <span className="text-xs font-black text-[#D4A7D7] uppercase tracking-[0.08em]">Semifinals (4)</span>
              {[
                { p1: 'King Maharaja', p2: 'Queen Maharani' },
                { p1: 'Master Arjun', p2: 'Winner QF4' },
              ].map((m, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#F7F4ED]/5 border border-[#D4A7D7]/20 text-xs">
                  <div className="py-1 text-[#F7F4ED]/80 font-semibold">{m.p1}</div>
                  <div className="py-1 text-[#F7F4ED]/80 font-semibold">{m.p2}</div>
                </div>
              ))}
            </div>

            {/* Grand Finale */}
            <div className="space-y-2 md:mt-20">
              <span className="text-xs font-black text-amber-400 uppercase tracking-[0.08em] flex items-center gap-1">
                Grand Finale <Trophy className="w-3.5 h-3.5" />
              </span>
              <div className="p-4 rounded-2xl bg-[#F7F4ED]/5 border border-amber-400/30 text-center text-xs">
                <div className="text-[10px] text-amber-400 uppercase font-bold mb-2">Championship Match</div>
                <div className="font-bold text-[#F7F4ED] mb-1">Winner SF1</div>
                <div className="text-amber-400 font-extrabold my-1">VS</div>
                <div className="font-bold text-[#F7F4ED] mb-3">Winner SF2</div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-400/20 text-amber-400 font-black text-xs">
                  👑 Winner: 🪙 2,400
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};
