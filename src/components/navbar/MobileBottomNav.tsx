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
    { id: 'tournaments', label: 'Tourneys', icon: Trophy },
    { id: 'leaderboard', label: 'Ranks', icon: Swords },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t border-[#DDD6CB] px-2 py-1">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { playClick(); setCurrentTab(item.id); }}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                isActive ? 'text-[#000000]' : 'text-[#6E6962]'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-[#000000]' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#F7F4ED]' : ''}`} />
              </div>
              <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
