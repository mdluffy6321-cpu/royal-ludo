import React from 'react';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { useSound } from '../../context/SoundContext';
import { ExternalLink } from 'lucide-react';

export const DemoSwitcherBanner: React.FC = () => {
  const { user, loginAsDemo } = useAuth();
  const { playClick } = useSound();

  return (
    <aside aria-label="Demo Testing Bar" className="bg-[#F7F4ED] border-b border-[#DDD6CB] px-3 py-1.5 text-xs text-[#6E6962]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-black text-[10px] uppercase tracking-[0.1em] bg-[#000000] text-[#F7F4ED] px-2 py-0.5 rounded-full">
            Testing Bar
          </span>
          <span className="hidden sm:inline">
            Active: <strong className="text-[#000000]">{user?.username.replace(/_/g, ' ')}</strong>
            <span className="ml-1 text-[#6E6962]">({user?.playerTag})</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-[#6E6962] hidden md:inline">Instant Switch:</span>
          {DEMO_USERS.map((demo, idx) => (
            <button
              key={demo.id}
              onClick={() => { playClick(); loginAsDemo(idx); }}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                user?.id === demo.id
                  ? 'bg-[#000000] text-[#F7F4ED]'
                  : 'bg-[#FFFFFF] text-[#6E6962] border border-[#DDD6CB] hover:border-[#000000] hover:text-[#000000]'
              }`}
              title={`Switch to ${demo.username.replace(/_/g, ' ')}`}
            >
              {demo.avatar} {demo.username.replace(/_/g, ' ').split(' ')[0]}
            </button>
          ))}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-[#6E6962] hover:text-[#000000] bg-[#FFFFFF] border border-[#DDD6CB] hover:border-[#000000] px-2 py-0.5 rounded-full transition-colors ml-1"
          >
            <span>Open 2nd Window</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
};
