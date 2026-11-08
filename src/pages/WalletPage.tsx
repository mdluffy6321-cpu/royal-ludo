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
      description: 'Victory Prize — 1v1 Battle Arena #RL-901',
      referenceId: 'room_b_1',
      createdAt: '2024-03-22T18:45:00.000Z',
    },
    {
      id: 'tx_4',
      userId: user?.id || 'u1',
      type: 'match_entry',
      amount: -500,
      balanceAfter: (user?.coins || 5000) - 1450,
      description: 'Battle Entry Escrow — 1v1 Match',
      referenceId: 'room_b_1',
      createdAt: '2024-03-22T18:30:00.000Z',
    },
    {
      id: 'tx_5',
      userId: user?.id || 'u1',
      type: 'referral_bonus',
      amount: 500,
      balanceAfter: (user?.coins || 5000) - 1950,
      description: 'Referral Reward — Friend Queen Maharani joined',
      createdAt: '2024-03-23T11:00:00.000Z',
    },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#000000] tracking-tight">Coin Passbook</h1>
        <p className="text-sm text-[#6E6962] mt-1">Track your demo coins, bonuses, and match rewards.</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#000000] rounded-3xl p-5 text-[#F7F4ED]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-[0.1em] text-[#F7F4ED]/50">Total Available</span>
            <div className="w-8 h-8 rounded-xl bg-[#F7F4ED]/10 flex items-center justify-center">
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#F7F4ED] font-mono">{user?.coins.toLocaleString() || 0}</div>
          <span className="text-[10px] text-[#F7F4ED]/40 mt-1 block">Usable across all game battles</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#DDD6CB] rounded-3xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-[0.1em] text-[#6E6962]">Bonus & Rewards</span>
            <div className="w-8 h-8 rounded-xl bg-[#D4A7D7]/20 flex items-center justify-center">
              <Gift className="w-4 h-4 text-[#9B6DA5]" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#000000] font-mono">{user?.bonusCoins.toLocaleString() || 0}</div>
          <span className="text-[10px] text-[#6E6962] mt-1 block">From daily spins & streaks</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#DDD6CB] rounded-3xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-[0.1em] text-[#6E6962]">Victory Earnings</span>
            <div className="w-8 h-8 rounded-xl bg-[#B7B39B]/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#7A7664]" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#000000] font-mono">{user?.winCoins.toLocaleString() || 0}</div>
          <span className="text-[10px] text-[#6E6962] mt-1 block">Claimed through victories</span>
        </div>
      </div>

      {/* Daily Reward Strip */}
      <div className="bg-[#FFFFFF] border border-[#DDD6CB] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F7F4ED] border border-[#DDD6CB] flex items-center justify-center text-xl">🎡</div>
          <div>
            <div className="text-sm font-black text-[#000000]">Daily Lucky Spin & Streak</div>
            <div className="text-xs text-[#6E6962]">Free virtual coins every 24 hours</div>
          </div>
        </div>
        <button
          onClick={() => { playClick(); openSpinModal(); }}
          className="px-6 py-2.5 rounded-full bg-[#000000] text-[#F7F4ED] font-black text-xs uppercase tracking-[0.08em] hover:opacity-80 transition-all"
        >
          Claim Daily Coins
        </button>
      </div>

      {/* Transaction History */}
      <div className="bg-[#FFFFFF] border border-[#DDD6CB] rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#DDD6CB]">
          <History className="w-4 h-4 text-[#6E6962]" />
          <h2 className="text-base font-black text-[#000000]">Coin Ledger History</h2>
        </div>
        <div className="space-y-2">
          {transactions.map((tx) => {
            const isCredit = tx.amount > 0;
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F7F4ED] border border-[#DDD6CB] hover:border-[#000000] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isCredit
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-600'
                      : 'bg-red-50 border border-red-200 text-red-500'
                  }`}>
                    {isCredit ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-[#000000]">{tx.description}</div>
                    <div className="text-[10px] text-[#6E6962]">
                      {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm sm:text-base font-extrabold font-mono block ${isCredit ? 'text-emerald-600' : 'text-red-500'}`}>
                    {isCredit ? `+${tx.amount.toLocaleString()}` : `${tx.amount.toLocaleString()}`}
                  </span>
                  <span className="text-[10px] text-[#6E6962] font-mono">Bal: {tx.balanceAfter.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compliance */}
      <div className="p-4 rounded-2xl bg-[#F7F4ED] border border-[#DDD6CB] text-[11px] text-[#6E6962] flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[#000000] shrink-0 mt-0.5" />
        <span>
          <strong className="text-[#000000]">Fair Play & Compliance:</strong> Royal Ludo virtual coins are demonstration points with no real monetary value. Non-purchasable, non-transferable, and cannot be redeemed for fiat currency. Fully compliant with applicable online gaming guidelines.
        </span>
      </div>
    </div>
  );
};
