import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { UserCheck, Trophy, Flame, Coins, ShieldCheck, Check } from 'lucide-react';

const AVATARS = ['👑', '👸', '⚔️', '🏹', '🦅', '🐅', '🧙‍♂️', '🦁', '🔥', '💎'];

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { playClick, playSixRolled } = useSound();

  const [username, setUsername] = useState(user?.username ? user.username.replace(/_/g, ' ') : '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '👑');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    if (!username.trim()) return;
    playClick();
    updateProfile({
      username: username.trim().replace(/_/g, ' '),
      avatar: selectedAvatar,
    });
    setSavedSuccess(true);
    playSixRolled();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#000000] tracking-tight">
          Warrior Profile
        </h1>
        <p className="text-xs text-[#6E6962] mt-0.5">
          Manage your arena identity, avatars, and review combat statistics.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#DDD6CB] p-6 sm:p-8">
        
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-6 border-b border-[#DDD6CB]">
          {/* Avatar Preview */}
          <div className="relative w-24 h-24 rounded-3xl bg-[#F7F4ED] border-2 border-[#DDD6CB] flex items-center justify-center text-5xl">
            {selectedAvatar}
            <span className="absolute -top-2 -right-2 text-xl">👑</span>
          </div>

          <div className="text-center sm:text-left flex-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-0.5 rounded-full bg-[#F7F4ED] text-[#000000] border border-[#DDD6CB]">
              Registered Player
            </span>
            <h2 className="text-2xl font-black text-[#000000] mt-1">
              {user?.username ? user.username.replace(/_/g, ' ') : 'King Maharaja'}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#6E6962] mt-1 font-mono">
              <span className="text-[#000000] font-bold">{user?.playerTag}</span>
              <span>•</span>
              <span>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Avatar Selection Picker */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-[0.08em] text-[#6E6962] mb-3">
            Choose Royal Avatar
          </label>
          <div className="flex flex-wrap gap-2.5">
            {AVATARS.map((av) => (
              <button
                key={av}
                onClick={() => {
                  playClick();
                  setSelectedAvatar(av);
                }}
                className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition-all ${
                  selectedAvatar === av
                    ? 'bg-[#000000] text-white scale-110 shadow-sm'
                    : 'bg-[#F7F4ED] border border-[#DDD6CB] hover:border-[#000000]'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {/* Username Input */}
        <div className="max-w-sm mb-6">
          <label className="block text-xs font-bold uppercase tracking-[0.08em] text-[#6E6962] mb-2">
            Warrior Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2.5 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-[#000000] text-sm font-semibold focus:outline-none focus:border-[#000000]"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-full bg-[#000000] text-[#F7F4ED] font-bold text-xs uppercase tracking-[0.08em] hover:opacity-85 flex items-center gap-1.5 transition-all"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : null}
          <span>{savedSuccess ? 'Profile Saved!' : 'Save Changes'}</span>
        </button>

      </div>

      {/* Account Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-[#FFFFFF] border border-[#DDD6CB] p-4 text-center">
          <span className="text-[10px] text-[#6E6962] block uppercase font-bold tracking-wider">Total Matches</span>
          <div className="text-2xl font-black text-[#000000] font-mono mt-1">
            {user?.totalMatches || 0}
          </div>
        </div>

        <div className="rounded-2xl bg-[#FFFFFF] border border-[#DDD6CB] p-4 text-center">
          <span className="text-[10px] text-emerald-600 block uppercase font-bold tracking-wider">Total Victories</span>
          <div className="text-2xl font-black text-emerald-600 font-mono mt-1">
            {user?.wins || 0}
          </div>
        </div>

        <div className="rounded-2xl bg-[#FFFFFF] border border-[#DDD6CB] p-4 text-center">
          <span className="text-[10px] text-red-500 block uppercase font-bold tracking-wider">Defeats</span>
          <div className="text-2xl font-black text-red-500 font-mono mt-1">
            {user?.losses || 0}
          </div>
        </div>

        <div className="rounded-2xl bg-[#FFFFFF] border border-[#DDD6CB] p-4 text-center">
          <span className="text-[10px] text-[#000000] block uppercase font-bold tracking-wider">Win Percentage</span>
          <div className="text-2xl font-black text-[#000000] font-mono mt-1">
            {user?.winRate || 0}%
          </div>
        </div>
      </div>

      {/* Royal Badges & Achievements */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#DDD6CB] p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#DDD6CB]">
          <Trophy className="w-4 h-4 text-[#000000]" />
          <h2 className="text-base font-black text-[#000000]">
            Honors & Achievements
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: 'Maharaja Champion', desc: 'Won 25+ matches in the Royal Arena', icon: '👑', unlocked: true },
            { title: 'Lightning Striker', desc: 'Won a 1v1 battle under 5 minutes', icon: '⚡', unlocked: true },
            { title: 'Token Hunter', desc: 'Captured 3+ opponent tokens in one game', icon: '🎯', unlocked: true },
            { title: 'Sixer Monarch', desc: 'Rolled two consecutive 6s in combat', icon: '🎲', unlocked: true },
            { title: 'Grand Ambassador', desc: 'Invited 3+ warriors via referral link', icon: '🤝', unlocked: true },
            { title: 'Iron Bastion', desc: 'Complete match without losing a token', icon: '🛡️', unlocked: false },
          ].map((badge, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                badge.unlocked
                  ? 'bg-[#F7F4ED] border-[#DDD6CB]'
                  : 'bg-[#FFFFFF] border-[#DDD6CB] opacity-40'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#DDD6CB] flex items-center justify-center text-xl shrink-0">
                {badge.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold text-[#000000] truncate">{badge.title}</span>
                  {badge.unlocked ? (
                    <span className="text-[9px] text-[#000000] font-black bg-[#FFFFFF] border border-[#DDD6CB] px-1.5 py-0.5 rounded-full">EARNED</span>
                  ) : (
                    <span className="text-[9px] text-[#6E6962] font-bold bg-[#FFFFFF] px-1.5 py-0.5 rounded-full">LOCKED</span>
                  )}
                </div>
                <p className="text-[11px] text-[#6E6962] leading-snug">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Match History Logs */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#DDD6CB] p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#DDD6CB]">
          <Flame className="w-4 h-4 text-[#000000]" />
          <h2 className="text-base font-black text-[#000000]">
            Recent Match History
          </h2>
        </div>

        <div className="space-y-2">
          {[
            { opponent: 'Queen Maharani', oppAvatar: '👸', mode: '1v1 Quick Duel', result: 'WIN', prize: '+190', date: '2 hours ago' },
            { opponent: 'Knight Vikram', oppAvatar: '⚔️', mode: '1v1 Quick Duel', result: 'WIN', prize: '+475', date: 'Yesterday' },
            { opponent: 'Master Arjun', oppAvatar: '🏹', mode: '1v1 Quick Duel', result: 'LOSS', prize: '-250', date: 'Yesterday' },
            { opponent: 'Ludo Tiger', oppAvatar: '🐅', mode: 'Classic 4P Battle', result: 'WIN', prize: '+950', date: '2 days ago' },
          ].map((m, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#F7F4ED] border border-[#DDD6CB] text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{m.oppAvatar}</span>
                <div>
                  <div className="font-bold text-[#000000] flex items-center gap-2">
                    <span>vs {m.opponent}</span>
                    <span className="text-[10px] text-[#6E6962] font-normal">({m.mode})</span>
                  </div>
                  <div className="text-[10px] text-[#6E6962]">{m.date}</div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-black text-[10px] px-2.5 py-0.5 rounded-full inline-block mb-0.5 ${
                    m.result === 'WIN'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-red-50 text-red-600 border border-red-300'
                  }`}
                >
                  {m.result}
                </span>
                <span className="block font-mono text-[11px] font-bold text-[#000000]">
                  🪙 {m.prize}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
