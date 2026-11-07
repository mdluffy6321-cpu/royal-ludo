import React from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { Crown, Swords, Trophy, ShieldCheck, Zap, Users, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  openAuthModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, openAuthModal }) => {
  const { loginAsDemo } = useAuth();
  const { playClick, playSixRolled } = useSound();

  const handleInstantPlay = () => {
    playClick();
    loginAsDemo(0);
    playSixRolled();
    onEnterApp();
  };

  return (
    <div className="space-y-16 py-10">
      
      {/* 1. Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-royal-gold/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-royal-gold/15 border border-royal-gold/30 text-royal-gold text-xs font-bold uppercase tracking-widest mb-6 animate-pulse">
            <Crown className="w-4 h-4" />
            <span>The Sovereign Online Gaming Platform</span>
          </div>

          <h1 className="font-royal text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none mb-6">
            WELCOME TO <br />
            <span className="gold-gradient-text uppercase">ROYAL LUDO</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed font-light max-w-2xl mx-auto">
            Experience the next generation of online multiplayer Ludo. Featuring authentic server-authoritative physics, live battle arenas, knockout tournament brackets, and seamless in-browser gameplay.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleInstantPlay}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-royal-gold via-amber-500 to-amber-600 text-royal-dark font-royal font-black text-sm uppercase tracking-wider shadow-gold-glow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Instant Play Demo</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              onClick={() => {
                playClick();
                openAuthModal();
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm uppercase tracking-wider border border-royal-border transition-colors flex items-center justify-center gap-2"
            >
              <span>Warrior Sign In / Sign Up</span>
            </button>
          </div>

          {/* Value Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% In-Browser WebSockets
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-royal-gold" /> Server Authoritative RNG
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400" /> Non-Monetary Demonstration Coins
            </span>
          </div>
        </div>

      </section>

      {/* 2. Platform Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-royal text-2xl sm:text-4xl font-black gold-gradient-text mb-3">
            Built for Elite Performance
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Engineered from the ground up to surpass legacy battle portals with uninterrupted real-time responsiveness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl glass-panel p-6 border border-royal-border/80 shadow-card-glow hover:border-royal-gold/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-royal-gold flex items-center justify-center text-2xl mb-4">
              ⚔️
            </div>
            <h3 className="font-royal text-lg font-bold text-white mb-2">Live Battle Arena</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Open challenge marketplace inspired by ApnaAddaa and GFLudo. Set your entry stake or accept pending challenges with instant coin escrow locking.
            </p>
          </div>

          <div className="rounded-3xl glass-panel p-6 border border-royal-border/80 shadow-card-glow hover:border-purple-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-2xl mb-4">
              🎲
            </div>
            <h3 className="font-royal text-lg font-bold text-white mb-2">Integrated Game Engine</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              No need to switch between external apps. Play full 15x15 Ludo with genuine safe star cells, captures, exact home rolls, and 3D animated dice directly in the browser.
            </p>
          </div>

          <div className="rounded-3xl glass-panel p-6 border border-royal-border/80 shadow-card-glow hover:border-emerald-500/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-2xl mb-4">
              🛡️
            </div>
            <h3 className="font-royal text-lg font-bold text-white mb-2">Authoritative Security</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Eliminates screenshot manipulation and false dispute claims. All dice rolls, token positions, and match results are verified by the backend server.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

