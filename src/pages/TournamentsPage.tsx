import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { Trophy, Users, Clock, Flame, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

export const TournamentsPage: React.FC = () => {
  const { user, updateCoins } = useAuth();
  const { playClick, playSixRolled } = useSound();

  const [registered, setRegistered] = useState<Record<string, boolean>>({});

  const handleRegister = (tourneyId: string, fee: number) => {
    if (!user) return;
    if (user.coins < fee) {
      alert(`Insufficient virtual coins! You need ${fee} coins to register for this tournament.`);
      return;
    }

    playClick();
    updateCoins(user.coins - fee);
    setRegistered(prev => ({ ...prev, [tourneyId]: true }));
    playSixRolled();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-royal-gold/15 border border-royal-gold/30 text-royal-gold text-xs font-bold uppercase tracking-wider mb-2">
          <Trophy className="w-3.5 h-3.5" />
          <span>Royal Championship Circuit</span>
        </div>
        <h1 className="font-royal text-2xl sm:text-3xl font-black gold-gradient-text">
          Tournaments & Brackets
        </h1>
        <p className="text-xs text-slate-300 mt-0.5">
          Compete in single-elimination knockout brackets for prestigious royal trophies and massive virtual prizes.
        </p>
      </div>

      {/* Featured Grand Tournament */}
      <div className="relative rounded-3xl overflow-hidden glass-panel-gold p-6 sm:p-8 border border-royal-gold/50 shadow-card-glow">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-royal-gold to-amber-600 p-1 shadow-gold-glow flex items-center justify-center text-3xl">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  ● Registration Open
                </span>
                <span className="text-xs font-mono text-amber-300">Single Elimination Knockout</span>
              </div>
              <h2 className="font-royal text-xl sm:text-2xl font-black text-white mt-1">
                The Maharaja Grand Championship
              </h2>
              <p className="text-xs text-slate-300">
                8 Warriors. 3 Rounds. 1 Supreme Emperor of Ludo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Prize Pool</span>
              <span className="text-xl font-black text-royal-gold font-mono">
                🪙 3,600 Coins
              </span>
            </div>

            <button
              onClick={() => handleRegister('grand_cup', 500)}
              disabled={registered['grand_cup']}
              className={`px-6 py-3 rounded-2xl font-royal font-bold text-xs uppercase tracking-wider transition-all shadow-md ${
                registered['grand_cup']
                  ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'bg-gradient-to-r from-royal-gold to-amber-600 text-royal-dark hover:scale-105 active:scale-95 shadow-gold-glow'
              }`}
            >
              {registered['grand_cup'] ? '✓ Registered' : 'Register (🪙 500)'}
            </button>
          </div>
        </div>

        {/* Visual Bracket Display */}
        <div className="pt-6 border-t border-royal-border/60">
          <h3 className="font-royal text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">
            Official Bracket Tree
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Round 1: Quarterfinals */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Quarterfinals (8)
              </span>

              {[
                { p1: 'King_Maharaja', p2: 'Player_8812', w: 'King_Maharaja' },
                { p1: 'Queen_Maharani', p2: 'Knight_Vikram', w: 'Queen_Maharani' },
                { p1: 'Master_Arjun', p2: 'Ludo_Tiger', w: 'Master_Arjun' },
                { p1: 'Vanguard_8', p2: 'Falcon_9', w: 'Pending' },
              ].map((m, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-royal-border text-xs">
                  <div className={`flex justify-between py-0.5 ${m.w === m.p1 ? 'text-royal-gold font-bold' : 'text-slate-300'}`}>
                    <span>{m.p1}</span>
                    <span>{m.w === m.p1 ? '✓' : ''}</span>
                  </div>
                  <div className={`flex justify-between py-0.5 ${m.w === m.p2 ? 'text-royal-gold font-bold' : 'text-slate-400'}`}>
                    <span>{m.p2}</span>
                    <span>{m.w === m.p2 ? '✓' : ''}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Round 2: Semifinals */}
            <div className="space-y-3 md:mt-8">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
                Semifinals (4)
              </span>

              {[
                { p1: 'King_Maharaja', p2: 'Queen_Maharani', w: 'Pending' },
                { p1: 'Master_Arjun', p2: 'Winner QF4', w: 'Pending' },
              ].map((m, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-purple-500/30 text-xs">
                  <div className="flex justify-between py-1 text-slate-200 font-semibold">
                    <span>{m.p1}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-300 font-semibold">
                    <span>{m.p2}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Round 3: Grand Finale */}
            <div className="space-y-3 md:mt-16">
              <span className="text-xs font-bold text-royal-gold uppercase tracking-wider block flex items-center gap-1">
                <span>Grand Finale</span>
                <Trophy className="w-3.5 h-3.5 text-royal-gold" />
              </span>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-royal-card to-slate-950 border border-royal-gold/60 text-xs shadow-gold-glow text-center">
                <span className="text-[10px] text-amber-300 uppercase font-bold block mb-2">Championship Match</span>
                <div className="font-bold text-white mb-1">Winner SF1</div>
                <div className="text-xs text-royal-gold font-extrabold my-1">VS</div>
                <div className="font-bold text-white mb-3">Winner SF2</div>
                <span className="inline-block px-3 py-1 rounded-full bg-royal-gold/20 text-royal-gold font-black text-xs">
                  👑 Winner: 🪙 2,400 Coins
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

