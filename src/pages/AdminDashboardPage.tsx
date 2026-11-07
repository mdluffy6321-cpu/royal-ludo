import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { ShieldAlert, Users, Swords, Coins, Search, UserX, UserCheck, Plus, Radio, AlertCircle } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { playClick, playSixRolled } = useSound();

  const [searchQuery, setSearchQuery] = useState('');
  const [userList, setUserList] = useState(DEMO_USERS);
  const [announcementText, setAnnouncementText] = useState('');
  const [broadcastedMsg, setBroadcastedMsg] = useState<string | null>(null);

  // Guard: Admin only
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-20 p-6 rounded-3xl glass-panel text-center border border-red-500/40">
        <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h2 className="font-royal text-xl font-bold text-white mb-2">Access Restricted</h2>
        <p className="text-xs text-slate-300">
          This administrator control center requires Super Admin authorization.
        </p>
      </div>
    );
  }

  const filteredUsers = userList.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      u.playerTag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = (userId: string) => {
    playClick();
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleGrantCoins = (userId: string, amount: number) => {
    playClick();
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, coins: u.coins + amount };
        }
        return u;
      })
    );
    playSixRolled();
  };

  const handleBroadcast = () => {
    if (!announcementText.trim()) return;
    playClick();
    setBroadcastedMsg(announcementText.trim());
    setAnnouncementText('');
    playSixRolled();
    setTimeout(() => setBroadcastedMsg(null), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
            <span>Super Administrator Control Room</span>
          </div>
          <h1 className="font-royal text-2xl sm:text-3xl font-black gold-gradient-text">
            Royal Platform Administration
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Monitor game rooms, manage warrior accounts, configure balances, and audit live matches.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300">
          Super Admin: {user.username}
        </span>
      </div>

      {/* Broadcast Banner Feedback */}
      {broadcastedMsg && (
        <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-900 to-amber-900 border border-royal-gold/60 text-white text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-royal-gold animate-pulse" />
            <span><strong>Global Announcement Broadcasted:</strong> {broadcastedMsg}</span>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-royal-border/80">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Warriors</span>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
            1,384
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block">● 342 Active Today</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-royal-border/80">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Matches Run</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-1">
            4,218
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">99.98% Completion Rate</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-royal-border/80">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Active Game Rooms</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-1">
            8 Live
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block">0 Unresolved Disputes</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-royal-border/80">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Virtual Coin Supply</span>
          <div className="text-2xl sm:text-3xl font-black text-royal-gold font-mono mt-1">
            485,000
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Demonstration Economy</span>
        </div>
      </div>

      {/* Broadcast Announcement Bar */}
      <div className="rounded-2xl glass-panel p-4 border border-royal-border/80 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-royal-gold shrink-0">
          <Radio className="w-4 h-4 text-amber-400" />
          <span>System Broadcast:</span>
        </div>
        <input
          type="text"
          placeholder="Type platform-wide alert message..."
          value={announcementText}
          onChange={(e) => setAnnouncementText(e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-royal-gold"
        />
        <button
          onClick={handleBroadcast}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-royal-gold text-royal-dark font-bold text-xs uppercase tracking-wider shrink-0"
        >
          Broadcast
        </button>
      </div>

      {/* User Management Section */}
      <div className="rounded-3xl glass-panel p-5 border border-royal-border/80 shadow-card-glow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-royal-border/60">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-royal-gold" />
            <h2 className="font-royal text-lg font-bold text-white">
              Warrior Management
            </h2>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user, tag, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-royal-gold"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Player</th>
                <th className="py-2.5 px-3">Phone</th>
                <th className="py-2.5 px-3">Coins</th>
                <th className="py-2.5 px-3">Win %</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30 text-slate-200">
                  <td className="py-3 px-3 flex items-center gap-2">
                    <span className="text-base">{u.avatar}</span>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1">
                        <span>{u.username}</span>
                        {u.role === 'admin' && (
                          <span className="text-[9px] bg-purple-600 text-white px-1 rounded uppercase font-extrabold">ADMIN</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{u.playerTag}</div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono">{u.phone}</td>
                  <td className="py-3 px-3 font-mono font-bold text-royal-gold">
                    🪙 {u.coins.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {u.winRate}% ({u.wins}/{u.totalMatches})
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        u.status === 'active'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-950/60 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleGrantCoins(u.id, 1000)}
                        title="Grant +1,000 Demo Coins"
                        className="px-2 py-1 rounded-lg bg-amber-500/20 text-royal-gold hover:bg-amber-500/30 border border-amber-500/30 text-[10px] font-bold"
                      >
                        +1K Coins
                      </button>
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        title={u.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                        className={`p-1.5 rounded-lg border text-xs ${
                          u.status === 'active'
                            ? 'bg-red-950/50 text-red-400 border-red-500/30 hover:bg-red-900/50'
                            : 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/50'
                        }`}
                      >
                        {u.status === 'active' ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

