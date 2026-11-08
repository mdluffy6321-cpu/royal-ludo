import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { LeaderboardEntry } from '../types';
import { Trophy } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const { playClick } = useSound();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('weekly');

  const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, userId: 'u1', username: 'King Maharaja', playerTag: '#RL-10001', avatar: '👑', matchesPlayed: 48, wins: 36, winRate: 75.0, coinsWon: 42000 },
    { rank: 2, userId: 'u2', username: 'Queen Maharani', playerTag: '#RL-10002', avatar: '👸', matchesPlayed: 35, wins: 24, winRate: 68.5, coinsWon: 28500 },
    { rank: 3, userId: 'u3', username: 'Knight Vikram', playerTag: '#RL-10003', avatar: '⚔️', matchesPlayed: 22, wins: 14, winRate: 63.6, coinsWon: 19200 },
    { rank: 4, userId: 'u4', username: 'Master Arjun', playerTag: '#RL-10004', avatar: '🏹', matchesPlayed: 18, wins: 9, winRate: 50.0, coinsWon: 12400 },
    { rank: 5, userId: 'u5', username: 'Royal Falcon', playerTag: '#RL-10089', avatar: '🦅', matchesPlayed: 15, wins: 8, winRate: 53.3, coinsWon: 9800 },
    { rank: 6, userId: 'u6', username: 'Tiger Sahab', playerTag: '#RL-10112', avatar: '🐅', matchesPlayed: 14, wins: 7, winRate: 50.0, coinsWon: 7400 },
  ];

  const podiumOrder = [leaderboardData[1], leaderboardData[0], leaderboardData[2]];
  const podiumHeights = ['h-24', 'h-36', 'h-16'];
  const podiumMedals = ['🥈', '👑', '🥉'];
  const podiumLabels = ['2nd Place', 'Champion', '3rd Place'];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#000000] tracking-tight">Leaderboard</h1>
          <p className="text-sm text-[#6E6962] mt-1">The supreme Ludo champions of the arena.</p>
        </div>

        <div className="flex rounded-full bg-[#FFFFFF] border border-[#DDD6CB] p-1 text-xs font-bold">
          {(['daily', 'weekly', 'monthly', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { playClick(); setTimeframe(tab); }}
              className={`px-3.5 py-1.5 rounded-full capitalize transition-all ${
                timeframe === tab ? 'bg-[#000000] text-[#F7F4ED]' : 'text-[#6E6962] hover:text-[#000000]'
              }`}
            >
              {tab === 'all' ? 'All-Time' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Podium */}
      <div className="bg-[#000000] rounded-3xl p-6 sm:p-8">
        <div className="flex items-end justify-center gap-4 sm:gap-8 max-w-lg mx-auto">
          {podiumOrder.map((entry, i) => (
            <div key={entry.userId} className="flex flex-col items-center flex-1">
              <div className="text-2xl mb-1">{entry.avatar}</div>
              <div className="text-xs font-black text-[#F7F4ED] text-center truncate w-full">{entry.username}</div>
              <div className="text-[10px] text-[#F7F4ED]/50 font-mono mb-2">{entry.wins}W</div>
              <div className={`w-full ${podiumHeights[i]} rounded-t-2xl flex flex-col items-center justify-end pb-3 ${
                i === 1 ? 'bg-[#F7F4ED]/20 border-t-2 border-[#F7F4ED]/40' : 'bg-[#F7F4ED]/10 border-t border-[#F7F4ED]/20'
              }`}>
                <span className="text-xl">{podiumMedals[i]}</span>
                <span className="text-[9px] text-[#F7F4ED]/60 uppercase tracking-widest font-bold mt-0.5">{podiumLabels[i]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-[#FFFFFF] border border-[#DDD6CB] rounded-3xl p-4 sm:p-6 overflow-x-auto">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#DDD6CB]">
          <Trophy className="w-4 h-4 text-[#6E6962]" />
          <h2 className="text-base font-black text-[#000000]">Full Rankings</h2>
        </div>
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-[#DDD6CB] text-[11px] text-[#6E6962] uppercase tracking-wider font-bold">
              <th className="py-3 px-2">Rank</th>
              <th className="py-3 px-3">Player</th>
              <th className="py-3 px-2 text-center">Matches</th>
              <th className="py-3 px-2 text-center">Wins</th>
              <th className="py-3 px-2 text-center">Win %</th>
              <th className="py-3 px-3 text-right">Coins Won</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((row) => {
              const isMe = row.userId === user?.id;
              return (
                <tr
                  key={row.userId}
                  className={`border-b border-[#DDD6CB] transition-colors ${
                    isMe ? 'bg-[#F7F4ED]' : 'hover:bg-[#F7F4ED]/50'
                  }`}
                >
                  <td className="py-3 px-2 font-mono font-bold text-[#000000]">
                    {row.rank <= 3 ? ['🥇', '🥈', '🥉'][row.rank - 1] : `#${row.rank}`}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{row.avatar}</span>
                      <div>
                        <div className="font-bold text-[#000000] flex items-center gap-1.5">
                          {row.username}
                          {isMe && (
                            <span className="text-[9px] bg-[#000000] text-[#F7F4ED] px-1.5 py-0.5 rounded-full font-black">YOU</span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#6E6962] font-mono">{row.playerTag}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center font-mono text-[#6E6962]">{row.matchesPlayed}</td>
                  <td className="py-3 px-2 text-center font-mono font-bold text-emerald-600">{row.wins}</td>
                  <td className="py-3 px-2 text-center font-mono text-[#6E6962]">{row.winRate}%</td>
                  <td className="py-3 px-3 text-right font-mono font-extrabold text-amber-600">
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
