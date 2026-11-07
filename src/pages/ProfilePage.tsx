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

    </div>
  );
};

