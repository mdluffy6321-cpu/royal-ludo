import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSound } from '../../context/SoundContext';
import { useSocket } from '../../context/SocketContext';
import { 
  Coins, 
  Volume2, 
  VolumeX, 
  Bell, 
  UserCheck, 
  LogOut, 
  ShieldAlert, 
  Menu, 
  X,
  Sparkles,
} from 'lucide-react';

interface TopNavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openSpinModal: () => void;
  unreadCount?: number;
  openNotifications?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  openSpinModal,
  unreadCount = 2,
  openNotifications = () => {}
}) => {
  const { user, logout } = useAuth();
  const { isMuted, toggleMute, playClick } = useSound();
  const { connected, onlineCount } = useSocket();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    playClick();
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#DDD6CB]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-9 h-9 rounded-xl bg-[#000000] flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
              👑
            </div>
            <div>
              <div className="text-[15px] font-black tracking-tight text-[#000000] leading-none uppercase">
                Royal Ludo
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-red-400'}`} />
                <span className="text-[10px] text-[#6E6962] font-medium">{onlineCount} online</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5">
            {[
              { id: 'dashboard', label: 'Lobby' },
              { id: 'tournaments', label: 'Tournaments' },
              { id: 'leaderboard', label: 'Leaderboard' },
              { id: 'wallet', label: 'Wallet' },
              { id: 'referrals', label: 'Invite & Earn' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.08em] transition-all ${
                  currentTab === item.id
                    ? 'bg-[#000000] text-[#F7F4ED]'
                    : 'text-[#6E6962] hover:text-[#000000] hover:bg-[#F7F4ED]'
                }`}
              >
                {item.label}
              </button>
            ))}
            {user?.role === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.08em] transition-all ${
                  currentTab === 'admin'
                    ? 'bg-[#000000] text-[#F7F4ED]'
                    : 'text-[#6E6962] hover:text-[#000000] hover:bg-[#F7F4ED]'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin
              </button>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">

            {/* Coin Chip */}
            <div
              onClick={openSpinModal}
              title="Daily Spin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] cursor-pointer hover:border-[#000000] transition-all"
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-black text-[#000000] font-mono">
                {user ? user.coins.toLocaleString() : '0'}
              </span>
            </div>

            {/* Bell */}
            <button
              onClick={() => { playClick(); openNotifications(); }}
              className="relative p-2 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-[#6E6962] hover:text-[#000000] hover:border-[#000000] transition-all"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#000000] text-[#F7F4ED] font-bold text-[8px] flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Mute */}
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-[#6E6962] hover:text-[#000000] hover:border-[#000000] transition-all"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => { playClick(); setProfileOpen(!profileOpen); }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] hover:border-[#000000] transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-[#000000] flex items-center justify-center text-sm">
                    {user.avatar || '👑'}
                  </div>
                  <span className="hidden sm:block text-xs font-semibold text-[#000000] truncate max-w-[90px]">
                    {user.username.replace(/_/g, ' ')}
                  </span>
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-[#FFFFFF] border border-[#DDD6CB] rounded-2xl shadow-lg p-1.5 z-50"
                    onMouseLeave={() => setProfileOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-[#DDD6CB]">
                      <p className="text-[10px] text-[#6E6962] uppercase tracking-widest">Signed in as</p>
                      <p className="text-sm font-bold text-[#000000] truncate">{user.username.replace(/_/g, ' ')}</p>
                      <p className="text-[10px] text-[#6E6962] font-mono">{user.playerTag}</p>
                    </div>
                    <div className="py-1">
                      {[
                        { id: 'profile', label: 'My Profile & Stats', icon: UserCheck },
                        { id: 'wallet', label: 'Coin Passbook', icon: Coins },
                        { id: 'rules', label: 'Rules & Fair Play', icon: Sparkles },
                      ].map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => { handleNavClick(id); setProfileOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#000000] hover:bg-[#F7F4ED] rounded-xl"
                        >
                          <Icon className="w-3.5 h-3.5 text-[#6E6962]" />
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="pt-1 border-t border-[#DDD6CB]">
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="px-4 py-2 rounded-full bg-[#000000] text-[#F7F4ED] font-bold text-xs uppercase tracking-[0.08em] hover:opacity-80 transition-all"
              >
                Login
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-[#6E6962]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DDD6CB] bg-[#FFFFFF] px-4 py-3 space-y-1">
          {[
            { id: 'dashboard', label: 'Lobby', icon: '🏠' },
            { id: 'tournaments', label: 'Tournaments', icon: '🏆' },
            { id: 'leaderboard', label: 'Leaderboard', icon: '🥇' },
            { id: 'wallet', label: 'Wallet', icon: '💰' },
            { id: 'referrals', label: 'Invite & Earn', icon: '🎁' },
            { id: 'profile', label: 'Profile', icon: '👤' },
            { id: 'rules', label: 'Rules', icon: '📜' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                currentTab === item.id
                  ? 'bg-[#000000] text-[#F7F4ED]'
                  : 'text-[#6E6962] hover:bg-[#F7F4ED]'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
