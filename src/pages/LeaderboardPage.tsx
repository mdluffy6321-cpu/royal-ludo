import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { LeaderboardEntry } from '../types';
import { Trophy, Medal, Award, Flame, Coins } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const { playClick } = useSound();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('weekly');

  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      userId: 'u1',
      username: 'King Maharaja',
      playerTag: '#RL-10001',
      avatar: '👑',
      matchesPlayed: 48,
      wins: 36,
      winRate: 75.0,
      coinsWon: 42000,
    },
    {
      rank: 2,
      userId: 'u2',
      username: 'Queen Maharani',
      playerTag: '#RL-10002',
      avatar: '👸',
      matchesPlayed: 35,
      wins: 24,
      winRate: 68.5,
      coinsWon: 28500,
    },
    {
      rank: 3,
      userId: 'u3',
      username: 'Knight Vikram',
      playerTag: '#RL-10003',
      avatar: '⚔️',
      matchesPlayed: 22,
      wins: 14,
      winRate: 63.6,
      coinsWon: 19200,
    },
    {
      rank: 4,
      userId: 'u4',
      username: 'Master Arjun',
      playerTag: '#RL-10004',
      avatar: '🏹',
      matchesPlayed: 18,
      wins: 9,
      winRate: 50.0,
      coinsWon: 12400,
    },
    {
      rank: 5,
      userId: 'u5',
      username: 'Royal_Falcon',
      playerTag: '#RL-10089',
      avatar: '🦅',
      matchesPlayed: 15,
      wins: 8,
      winRate: 53.3,
      coinsWon: 9800,
    },
    {
      rank: 6,
      userId: 'u6',
      username: 'Tiger_Sahab',
      playerTag: '#RL-10112',
      avatar: '🐅',
      matchesPlayed: 14,
      wins: 7,
      winRate: 50.0,
      coinsWon: 7400,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-royal-gold/15 border border-royal-gold/30 text-royal-gold text-xs font-bold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Royal Hall of Fame</span>
          </div>
          <h1 className="font-royal text-2xl sm:text-3xl font-black gold-gradient-text">
            Leaderboard Rankings
          </h1>
          <p className="text-xs text-slate-300">
            Recognizing the supreme Ludo champions of the arena.
          </p>
        </div>

        {/* Timeframe Switcher */}
        <div className="flex rounded-xl bg-slate-900/90 p-1 border border-royal-border text-xs font-semibold">
          {[
            { id: 'daily', label: 'Daily' },
            { id: 'weekly', label: 'Weekly' },
            { id: 'monthly', label: 'Monthly' },
            { id: 'all', label: 'All-Time' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playClick();
                setTimeframe(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${timeframe === tab.id
                  ? 'bg-royal-gold text-royal-dark font-bold'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium (1st, 2nd, 3rd) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-2xl mx-auto pt-6 pb-2">

        {/* 2nd Place Silver */}
        <div className="text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-800 border-2 border-slate-400 mx-auto flex items-center justify-center text-2xl shadow-lg relative mb-2">
            {leaderboardData[1].avatar}
            <span className="absolute -top-3 text-base">🥈</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-white truncate max-w-[100px] mx-auto">
            {leaderboardData[1].username}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {leaderboardData[1].wins} Wins
          </div>
          <div className="h-20 sm:h-24 rounded-t-2xl bg-gradient-to-t from-slate-900 to-slate-800 border-t-2 border-slate-400 mt-2 flex items-center justify-center text-xl font-black text-slate-400 font-mono">
            #2
          </div>
        </div>

        {/* 1st Place Gold (Tallest) */}
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-600 to-royal-gold p-1 mx-auto flex items-center justify-center text-3xl sm:text-4xl shadow-gold-glow relative mb-2">
            <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
              {leaderboardData[0].avatar}
            </div>
            <span className="absolute -top-4 text-2xl animate-bounce-subtle">👑</span>
          </div>
          <div className="text-xs sm:text-base font-black text-royal-gold truncate max-w-[120px] mx-auto">
            {leaderboardData[0].username}
          </div>
          <div className="text-[11px] text-amber-300 font-mono font-bold">
            {leaderboardData[0].wins} Wins ({leaderboardData[0].winRate}%)
          </div>
          <div className="h-28 sm:h-36 rounded-t-2xl bg-gradient-to-t from-amber-950 to-royal-card border-t-2 border-royal-gold mt-2 flex flex-col items-center justify-center shadow-gold-glow">
            <span className="text-2xl sm:text-3xl font-black text-royal-gold font-mono">#1</span>
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Supreme Champion</span>
          </div>
        </div>

        {/* 3rd Place Bronze */}
        <div className="text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-800 border-2 border-amber-700 mx-auto flex items-center justify-center text-2xl shadow-lg relative mb-2">
            {leaderboardData[2].avatar}
            <span className="absolute -top-3 text-base">🥉</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-white truncate max-w-[100px] mx-auto">
            {leaderboardData[2].username}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {leaderboardData[2].wins} Wins
          </div>
          <div className="h-16 sm:h-20 rounded-t-2xl bg-gradient-to-t from-slate-900 to-slate-800 border-t-2 border-amber-700 mt-2 flex items-center justify-center text-xl font-black text-amber-700 font-mono">
            #3
          </div>
        </div>

      </div>

      {/* Rankings Table */}
      <div className="rounded-3xl glass-panel p-4 sm:p-6 border border-royal-border/80 shadow-card-glow overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-royal-border/80 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-3 px-2">Rank</th>
              <th className="py-3 px-3">Warrior</th>
              <th className="py-3 px-2 text-center">Matches</th>
              <th className="py-3 px-2 text-center">Victories</th>
              <th className="py-3 px-2 text-center">Win %</th>
              <th className="py-3 px-3 text-right">Coins Won</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {leaderboardData.map((row) => {
              const isMe = row.userId === user?.id;
              return (
                <tr
                  key={row.userId}
                  className={`transition-colors ${isMe ? 'bg-royal-gold/10 text-royal-gold' : 'hover:bg-slate-800/40 text-slate-200'
                    }`}
                >
                  <td className="py-3 px-2 font-mono font-bold">
                    {row.rank <= 3 ? ['🥇', '🥈', '🥉'][row.rank - 1] : `#${row.rank}`}
                  </td>
                  <td className="py-3 px-3 flex items-center gap-2">
                    <span className="text-lg">{row.avatar}</span>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1">
                        <span>{row.username}</span>
                        {isMe && <span className="text-[10px] bg-royal-gold text-royal-dark px-1.5 rounded font-black">YOU</span>}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{row.playerTag}</div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center font-mono">{row.matchesPlayed}</td>
                  <td className="py-3 px-2 text-center font-mono text-emerald-400 font-bold">{row.wins}</td>
                  <td className="py-3 px-2 text-center font-mono">{row.winRate}%</td>
                  <td className="py-3 px-3 text-right font-mono font-extrabold text-royal-gold">
                    🪙 {row.coinsWon.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

