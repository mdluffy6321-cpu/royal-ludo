import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { UserCheck, Trophy, Flame, Coins, ShieldCheck, Check } from 'lucide-react';

const AVATARS = ['👑', '👸', '⚔️', '🏹', '🦅', '🐅', '🧙‍♂️', '🦁', '🔥', '💎'];

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { playClick, playSixRolled } = useSound();

  const [username, setUsername] = useState(user?.username || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '👑');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    if (!username.trim()) return;
    playClick();
    updateProfile({
      username: username.trim(),
      avatar: selectedAvatar,
    });
    setSavedSuccess(true);
    playSixRolled();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="font-royal text-2xl sm:text-3xl font-black gold-gradient-text">
          Noble Warrior Profile
        </h1>
        <p className="text-xs text-slate-300 mt-0.5">
          Manage your arena identity, avatars, and review combat statistics.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="rounded-3xl glass-panel-gold p-6 sm:p-8 border border-royal-gold/40 shadow-card-glow">
        
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-6 border-b border-royal-border/60">
          {/* Avatar Preview */}
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-600 to-royal-gold p-1 shadow-gold-glow flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center text-5xl">
              {selectedAvatar}
            </div>
            <span className="absolute -top-2 -right-2 text-xl">👑</span>
          </div>

          <div className="text-center sm:text-left flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-royal-gold/20 text-royal-gold border border-royal-gold/30">
              Registered Player
            </span>
            <h2 className="font-royal text-2xl font-black text-white mt-1">
              {user?.username}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 mt-1 font-mono">
              <span className="text-royal-gold">{user?.playerTag}</span>
              <span>•</span>
              <span>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Avatar Selection Picker */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
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
                    ? 'bg-amber-500/20 border-2 border-royal-gold shadow-gold-glow scale-110'
                    : 'bg-slate-900/80 border border-slate-700/80 hover:bg-slate-800'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {/* Username Input */}
        <div className="max-w-sm mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Warrior Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-royal-border text-white text-sm font-semibold focus:outline-none focus:border-royal-gold"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-royal-gold to-amber-600 text-royal-dark font-royal font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-90 flex items-center gap-1.5"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-950" /> : null}
          <span>{savedSuccess ? 'Profile Saved!' : 'Save Changes'}</span>
        </button>

      </div>

      {/* Account Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl glass-panel p-4 border border-royal-border/80 text-center">
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Matches</span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {user?.totalMatches || 0}
          </div>
        </div>

        <div className="rounded-2xl glass-panel p-4 border border-emerald-500/30 text-center">
          <span className="text-[10px] text-emerald-400 block uppercase font-bold">Total Victories</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {user?.wins || 0}
          </div>
        </div>

        <div className="rounded-2xl glass-panel p-4 border border-red-500/30 text-center">
          <span className="text-[10px] text-red-400 block uppercase font-bold">Defeats</span>
          <div className="text-2xl font-black text-red-400 font-mono mt-1">
            {user?.losses || 0}
          </div>
        </div>

        <div className="rounded-2xl glass-panel p-4 border border-royal-gold/30 text-center">
          <span className="text-[10px] text-royal-gold block uppercase font-bold">Win Percentage</span>
          <div className="text-2xl font-black text-royal-gold font-mono mt-1">
            {user?.winRate || 0}%
          </div>
        </div>
      </div>

      {/* Royal Badges & Achievements */}
      <div className="rounded-3xl glass-panel p-5 sm:p-6 border border-royal-border/80 shadow-card-glow">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-royal-border/60">
          <Trophy className="w-4 h-4 text-royal-gold" />
          <h2 className="font-royal text-lg font-bold text-white">
            Honors & Unlockable Badges
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
                  ? 'bg-amber-950/25 border-royal-gold/50 shadow-sm'
                  : 'bg-slate-900/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                {badge.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold text-white truncate">{badge.title}</span>
                  {badge.unlocked ? (
                    <span className="text-[10px] text-royal-gold font-bold bg-royal-gold/15 px-1.5 py-0.5 rounded">UNLOCKED</span>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-bold bg-slate-800 px-1.5 py-0.5 rounded">LOCKED</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Match History Logs */}
      <div className="rounded-3xl glass-panel p-5 sm:p-6 border border-royal-border/80 shadow-card-glow">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-royal-border/60">
          <Flame className="w-4 h-4 text-amber-500" />
          <h2 className="font-royal text-lg font-bold text-white">
            Recent Match History
          </h2>
        </div>

        <div className="space-y-2">
          {[
            { opponent: 'Queen_Maharani', oppAvatar: '👸', mode: '1v1 Quick Duel', result: 'WIN', prize: '+190', date: '2 hours ago' },
            { opponent: 'Knight_Vikram', oppAvatar: '⚔️', mode: '1v1 Quick Duel', result: 'WIN', prize: '+475', date: 'Yesterday' },
            { opponent: 'Master_Arjun', oppAvatar: '🏹', mode: '1v1 Quick Duel', result: 'LOSS', prize: '-250', date: 'Yesterday' },
            { opponent: 'Ludo_Tiger', oppAvatar: '🐅', mode: 'Classic 4P Battle', result: 'WIN', prize: '+950', date: '2 days ago' },
          ].map((m, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-royal-border/50 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{m.oppAvatar}</span>
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>vs {m.opponent}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({m.mode})</span>
                  </div>
                  <div className="text-[10px] text-slate-500">{m.date}</div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-black text-xs px-2 py-0.5 rounded-full inline-block mb-0.5 ${
                    m.result === 'WIN'
                      ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/40'
                      : 'bg-red-950/70 text-red-400 border border-red-500/40'
                  }`}
                >
                  {m.result}
                </span>
                <span className="block font-mono text-[11px] font-bold text-royal-gold">
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

