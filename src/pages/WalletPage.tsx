import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { CoinTransaction } from '../types';
import { Coins, Sparkles, ArrowDownRight, ArrowUpRight, ShieldCheck, Gift, History } from 'lucide-react';

interface WalletPageProps {
  openSpinModal: () => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({ openSpinModal }) => {
  const { user } = useAuth();
  const { playClick } = useSound();

  const [transactions] = useState<CoinTransaction[]>([
    {
      id: 'tx_1',
      userId: user?.id || 'u1',
      type: 'bonus',
      amount: 1000,
      balanceAfter: user?.coins || 5000,
      description: 'Welcome Sign-up Bonus & Royal Grant',
      createdAt: '2024-03-20T10:15:00.000Z',
    },
    {
      id: 'tx_2',
      userId: user?.id || 'u1',
      type: 'spin_reward',
      amount: 250,
      balanceAfter: (user?.coins || 5000) - 750,
      description: 'Lucky Spin Wheel Daily Reward',
      createdAt: '2024-03-21T14:30:00.000Z',
    },
    {
      id: 'tx_3',
      userId: user?.id || 'u1',
      type: 'match_win',
      amount: 950,
      balanceAfter: (user?.coins || 5000) - 500,
      description: 'Victory Prize - 1v1 Battle Arena #RL-901',
      referenceId: 'room_b_1',
      createdAt: '2024-03-22T18:45:00.000Z',
    },
    {
      id: 'tx_4',
      userId: user?.id || 'u1',
      type: 'match_entry',
      amount: -500,
      balanceAfter: (user?.coins || 5000) - 1450,
      description: 'Battle Entry Escrow - 1v1 Match',
      referenceId: 'room_b_1',
      createdAt: '2024-03-22T18:30:00.000Z',
    },
    {
      id: 'tx_5',
      userId: user?.id || 'u1',
      type: 'referral_bonus',
      amount: 500,
      balanceAfter: (user?.coins || 5000) - 1950,
      description: 'Referral Reward - Friend Queen_Maharani joined',
      createdAt: '2024-03-23T11:00:00.000Z',
    },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="font-royal text-2xl sm:text-3xl font-black gold-gradient-text">
          Virtual Coin Passbook
        </h1>
        <p className="text-xs text-slate-300 mt-0.5">
          Track demonstration coins, daily bonuses, and match victory rewards.
        </p>
      </div>

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Available Balance */}
        <div className="rounded-3xl glass-panel-gold p-5 border border-royal-gold/40 shadow-card-glow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
              Total Available
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-royal-gold flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-royal-gold font-mono">
            {user?.coins.toLocaleString() || 0}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Usable across all game battles
          </span>
        </div>

        {/* Bonus Coins */}
        <div className="rounded-3xl glass-panel p-5 border border-purple-500/30 shadow-card-glow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
              Bonus & Rewards
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-purple-300 font-mono">
            {user?.bonusCoins.toLocaleString() || 0}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Earned from daily spins & streak
          </span>
        </div>

        {/* Won Coins */}
        <div className="rounded-3xl glass-panel p-5 border border-emerald-500/30 shadow-card-glow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
              Victory Earnings
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {user?.winCoins.toLocaleString() || 0}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Claimed through arena victories
          </span>
        </div>

      </div>

      {/* Daily Reward Claim Strip */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-950/60 via-purple-950/40 to-slate-900 border border-royal-gold/40 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-royal-gold/20 text-royal-gold flex items-center justify-center text-xl">
            🎡
          </div>
          <div>
            <div className="text-sm font-bold text-white">Daily Lucky Spin & Streak Claim</div>
            <div className="text-xs text-slate-300">Free virtual coins available every 24 hours</div>
          </div>
        </div>

        <button
          onClick={() => {
            playClick();
            openSpinModal();
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-royal-gold to-amber-600 text-royal-dark font-royal font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-90"
        >
          Claim Daily Coins
        </button>
      </div>

      {/* Passbook Transaction History Table */}
      <div className="rounded-3xl glass-panel p-5 border border-royal-border/80 shadow-card-glow">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-royal-border/60">
          <History className="w-4 h-4 text-royal-gold" />
          <h2 className="font-royal text-lg font-bold text-white">
            Coin Ledger History
          </h2>
        </div>

        <div className="space-y-2.5">
          {transactions.map((tx) => {
            const isCredit = tx.amount > 0;
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/70 border border-royal-border/50 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isCredit
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400'
                        : 'bg-red-950/60 border border-red-500/40 text-red-400'
                    }`}
                  >
                    {isCredit ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-white">
                      {tx.description}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-sm sm:text-base font-extrabold font-mono block ${
                      isCredit ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {isCredit ? `+${tx.amount.toLocaleString()}` : `${tx.amount.toLocaleString()}`}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Bal: {tx.balanceAfter.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compliance Notice */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          <strong>Fair Play & Legal Compliance:</strong> Royal Ludo virtual coins are demonstration points with no real monetary value. They are strictly non-purchasable, non-transferable, and cannot be redeemed for fiat currency. The platform complies with all applicable online gaming and skill-based demonstration guidelines.
        </span>
      </div>

    </div>
  );
};

