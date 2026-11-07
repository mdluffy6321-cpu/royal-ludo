import React from 'react';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { useSound } from '../../context/SoundContext';
import { Users, ExternalLink, Sparkles } from 'lucide-react';

export const DemoSwitcherBanner: React.FC = () => {
  const { user, loginAsDemo } = useAuth();
  const { playClick } = useSound();

  return (
    <aside aria-label="Demo Testing Bar" className="bg-gradient-to-r from-purple-950 via-slate-900 to-amber-950 border-b border-royal-gold/25 px-3 py-1.5 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-semibold text-royal-gold uppercase tracking-wider text-[11px] bg-royal-gold/15 px-2 py-0.5 rounded border border-royal-gold/30">
            <Sparkles className="w-3 h-3 text-royal-gold" />
            Testing Bar
          </span>
          <span className="hidden sm:inline text-slate-400">
            Active: <strong className="text-white">{user?.username}</strong> ({user?.playerTag})
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 hidden md:inline">Instant Switch:</span>
          {DEMO_USERS.map((demo, idx) => (
            <button
              key={demo.id}
              onClick={() => {
                playClick();
                loginAsDemo(idx);
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                user?.id === demo.id
                  ? 'bg-royal-gold text-royal-dark font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
              title={`Switch active player to ${demo.username}`}
            >
              {demo.avatar} {demo.username.split('_')[0]}
            </button>
          ))}

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 transition-colors ml-1"
            title="Open another browser window as Player 2 to test live 1v1 multiplayer"
          >
            <span>Open 2nd Window</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
};

