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
      <div className="max-w-md mx-auto my-20 p-6 rounded-3xl bg-[#FFFFFF] border border-[#DDD6CB] text-center">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#000000] mb-2">Access Restricted</h2>
        <p className="text-xs text-[#6E6962]">
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#DDD6CB] text-[#000000] text-xs font-bold uppercase tracking-[0.08em] mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-[#000000]" />
            <span>Administrator Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#000000] tracking-tight">
            Platform Administration
          </h1>
          <p className="text-xs text-[#6E6962] mt-0.5">
            Monitor game rooms, manage warrior accounts, configure balances, and audit live matches.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3.5 py-1.5 rounded-full bg-[#000000] text-[#F7F4ED]">
          Admin: {user.username.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Broadcast Banner Feedback */}
      {broadcastedMsg && (
        <div className="p-3.5 rounded-2xl bg-[#000000] text-[#F7F4ED] text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span><strong>Global Announcement Broadcasted:</strong> {broadcastedMsg}</span>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-3xl bg-[#FFFFFF] border border-[#DDD6CB]">
          <span className="text-[10px] text-[#6E6962] block uppercase font-bold tracking-wider">Total Warriors</span>
          <div className="text-2xl sm:text-3xl font-black text-[#000000] font-mono mt-1">
            1,384
          </div>
          <span className="text-[10px] text-emerald-600 mt-1 block">● 342 Active Today</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-[#FFFFFF] border border-[#DDD6CB]">
          <span className="text-[10px] text-[#6E6962] block uppercase font-bold tracking-wider">Total Matches Run</span>
          <div className="text-2xl sm:text-3xl font-black text-[#000000] font-mono mt-1">
            4,218
          </div>
          <span className="text-[10px] text-[#6E6962] mt-1 block">99.98% Completion Rate</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-[#FFFFFF] border border-[#DDD6CB]">
          <span className="text-[10px] text-[#6E6962] block uppercase font-bold tracking-wider">Active Game Rooms</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono mt-1">
            8 Live
          </div>
          <span className="text-[10px] text-emerald-600 mt-1 block">0 Unresolved Disputes</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-[#FFFFFF] border border-[#DDD6CB]">
          <span className="text-[10px] text-[#6E6962] block uppercase font-bold tracking-wider">Virtual Coin Supply</span>
          <div className="text-2xl sm:text-3xl font-black text-[#000000] font-mono mt-1">
            485,000
          </div>
          <span className="text-[10px] text-[#6E6962] mt-1 block">Demonstration Economy</span>
        </div>
      </div>

      {/* Broadcast Announcement Bar */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#DDD6CB] p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#000000] shrink-0">
          <Radio className="w-4 h-4 text-[#000000]" />
          <span>System Broadcast:</span>
        </div>
        <input
          type="text"
          placeholder="Type platform-wide alert message..."
          value={announcementText}
          onChange={(e) => setAnnouncementText(e.target.value)}
          className="w-full px-4 py-2 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-xs text-[#000000] focus:outline-none focus:border-[#000000]"
        />
        <button
          onClick={handleBroadcast}
          className="w-full sm:w-auto px-5 py-2 rounded-full bg-[#000000] text-[#F7F4ED] font-bold text-xs uppercase tracking-[0.08em] shrink-0 hover:opacity-85 transition-opacity"
        >
          Broadcast
        </button>
      </div>

      {/* User Management Section */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#DDD6CB] p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#DDD6CB]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#000000]" />
            <h2 className="text-base font-black text-[#000000]">
              Warrior Management
            </h2>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#6E6962] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user, tag, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-xs text-[#000000] focus:outline-none focus:border-[#000000]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#DDD6CB] text-[10px] text-[#6E6962] uppercase tracking-wider font-bold">
                <th className="py-2.5 px-3">Player</th>
                <th className="py-2.5 px-3">Phone</th>
                <th className="py-2.5 px-3">Coins</th>
                <th className="py-2.5 px-3">Win %</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD6CB] font-medium">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#F7F4ED]/60 text-[#000000]">
                  <td className="py-3 px-3 flex items-center gap-2">
                    <span className="text-base">{u.avatar}</span>
                    <div>
                      <div className="font-bold text-[#000000] flex items-center gap-1">
                        <span>{u.username.replace(/_/g, ' ')}</span>
                        {u.role === 'admin' && (
                          <span className="text-[9px] bg-[#000000] text-[#F7F4ED] px-1.5 py-0.2 rounded-full uppercase font-black">ADMIN</span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#6E6962] font-mono">{u.playerTag}</div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[#6E6962]">{u.phone}</td>
                  <td className="py-3 px-3 font-mono font-bold text-[#000000]">
                    🪙 {u.coins.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono text-[#6E6962]">
                    {u.winRate}% ({u.wins}/{u.totalMatches})
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        u.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-red-50 text-red-600 border border-red-300'
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
                        className="px-2.5 py-1 rounded-full bg-[#F7F4ED] hover:bg-[#DDD6CB] text-[#000000] border border-[#DDD6CB] text-[10px] font-bold"
                      >
                        +1K Coins
                      </button>
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        title={u.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                        className={`p-1.5 rounded-full border text-xs ${
                          u.status === 'active'
                            ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
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
