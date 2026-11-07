import React from 'react';
import { useSound } from '../../context/SoundContext';
import { LayoutDashboard, Swords, Trophy, Wallet, UserCircle } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const { playClick } = useSound();

  const navItems = [
    { id: 'dashboard', label: 'Lobby', icon: LayoutDashboard },
    { id: 'battles', label: 'Battles', icon: Swords },
    { id: 'tournaments', label: 'Tourneys', icon: Trophy },
    { id: 'wallet', label: 'Passbook', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-royal-dark/95 backdrop-blur-lg border-t border-royal-border/80 px-2 py-1 shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                playClick();
                setCurrentTab(item.id);
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-royal-gold font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-royal-gold/15' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-royal-gold stroke-[2.5]' : 'stroke-[1.75]'}`} />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

