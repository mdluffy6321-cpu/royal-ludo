import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { Gift, Copy, Check, Share2, Users, Coins, Sparkles } from 'lucide-react';

export const ReferralsPage: React.FC = () => {
  const { user } = useAuth();
  const { playClick } = useSound();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referralCode = user?.referralCode || 'ROYAL814';
  const referralLink = `${window.location.origin}/login?refer=${referralCode}`;

  const handleCopyCode = () => {
    playClick();
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    playClick();
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    playClick();
    const text = encodeURIComponent(
      `👑 Play Royal Ludo with me! Use my code *${referralCode}* to get +500 FREE Virtual Coins on signup!\nJoin here: ${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-royal-gold/15 border border-royal-gold/30 text-royal-gold text-xs font-bold uppercase tracking-wider mb-2">
          <Gift className="w-3.5 h-3.5" />
          <span>Royal Ambassador Program</span>
        </div>
        <h1 className="font-royal text-2xl sm:text-3xl font-black gold-gradient-text">
          Invite Friends & Earn Coins
        </h1>
        <p className="text-xs text-slate-300 mt-0.5">
          Share your royal link. When friends register, both of you earn instant demonstration coin bonuses!
        </p>
      </div>

      {/* Main Referral Share Box */}
      <div className="rounded-3xl glass-panel-gold p-6 sm:p-8 border border-royal-gold/40 shadow-card-glow text-center">
        
        {/* Referral Code Block */}
        <div className="max-w-xs mx-auto mb-6">
          <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block mb-1">
            Your Exclusive Referral Code
          </span>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border-2 border-dashed border-royal-gold/60 text-2xl font-black tracking-widest text-royal-gold font-mono flex items-center justify-center gap-3">
            <span>{referralCode}</span>
            <button
              onClick={handleCopyCode}
              title="Copy Referral Code"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-8">
          <button
            onClick={handleCopyLink}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Invite Link'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </button>
        </div>

        {/* Reward Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-royal-border/60 text-left">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-royal-border">
            <span className="text-lg mb-1 block">1️⃣</span>
            <h3 className="font-bold text-xs text-white mb-0.5">Share Your Code</h3>
            <p className="text-[11px] text-slate-400">Send your code or link to your friends or gaming groups.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-royal-border">
            <span className="text-lg mb-1 block">2️⃣</span>
            <h3 className="font-bold text-xs text-white mb-0.5">Friend Registers</h3>
            <p className="text-[11px] text-slate-400">They receive an instant +500 Virtual Coin welcome reward.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-royal-border">
            <span className="text-lg mb-1 block">3️⃣</span>
            <h3 className="font-bold text-xs text-white mb-0.5">You Get Rewarded</h3>
            <p className="text-[11px] text-slate-400">You receive +500 bonus coins credited directly to your passbook!</p>
          </div>
        </div>

      </div>

      {/* Invited Friends List */}
      <div className="rounded-3xl glass-panel p-5 border border-royal-border/80 shadow-card-glow">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-royal-border/60">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-royal-gold" />
            <h2 className="font-royal text-lg font-bold text-white">
              Invited Nobles (3)
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-royal-gold">
            +1,500 Coins Earned
          </span>
        </div>

        <div className="space-y-2">
          {[
            { name: 'Queen_Maharani', tag: '#RL-10002', avatar: '👸', date: '2024-02-15', reward: '+500' },
            { name: 'Knight_Vikram', tag: '#RL-10003', avatar: '⚔️', date: '2024-03-01', reward: '+500' },
            { name: 'Player_7721', tag: '#RL-89120', avatar: '🏹', date: '2024-03-18', reward: '+500' },
          ].map((friend, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/70 border border-royal-border/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
                  {friend.avatar}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{friend.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{friend.tag} • Joined {friend.date}</div>
                </div>
              </div>

              <span className="text-xs font-extrabold text-emerald-400 font-mono">
                {friend.reward} Coins
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

