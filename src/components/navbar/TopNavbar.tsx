import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
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
  Trophy,
  Users
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
  const { user, loginAsDemo, logout } = useAuth();
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
    <header className="sticky top-0 z-50 bg-[#070B19]/90 backdrop-blur-xl border-b border-royal-gold/25 shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
      {/* Golden accent hairline */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-royal-gold to-transparent opacity-75" />
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer select-none group" onClick={() => handleNavClick('dashboard')}>
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FDE68A] via-[#F59E0B] to-[#78350F] p-[2px] shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-[#070B19] rounded-[14px] flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform">
                👑
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-royal-gold rounded-full blur-[2px] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-royal text-lg sm:text-2xl font-black tracking-wider gold-gradient-text uppercase drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]">
                  Royal Ludo
                </span>
                <span className="text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-royal-gold/25 to-amber-600/25 text-amber-300 border border-royal-gold/50 shadow-inner">
                  Imperial
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 shadow-[0_0_8px_#34D399] animate-pulse' : 'bg-red-400'}`}></span>
                <span className="font-medium tracking-tight text-slate-300">{onlineCount} Warriors in Arena</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {[
              { id: 'dashboard', label: 'Arena Lobby', icon: '🏰' },
              { id: 'battles', label: 'Live Battles', icon: '⚔️' },
              { id: 'tournaments', label: 'Tournaments', icon: '🏆' },
              { id: 'leaderboard', label: 'Hall of Fame', icon: '🥇' },
              { id: 'wallet', label: 'Treasury', icon: '💰' },
              { id: 'referrals', label: 'Invite & Earn', icon: '🎁' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  currentTab === item.id
                    ? 'bg-gradient-to-r from-royal-gold/20 via-amber-500/15 to-transparent text-royal-gold border border-royal-gold/50 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}

            {user?.role === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  currentTab === 'admin'
                    ? 'bg-purple-600 text-white shadow-purple-glow'
                    : 'bg-royal-purple/50 text-purple-200 border border-purple-500/40 hover:bg-royal-purple'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-purple-300" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Right Action Bar: Coins, Sound, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Sovereign Coins Balance Chip */}
            <div 
              onClick={openSpinModal}
              title="Click to claim Daily Free Spin Bonus"
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-950/80 via-[#141C36] to-slate-900 border border-royal-gold/50 cursor-pointer hover:border-royal-gold transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] group"
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-royal-gold to-amber-600 flex items-center justify-center text-slate-950 shadow-sm group-hover:rotate-12 transition-transform font-bold">
                <Coins className="w-4 h-4 text-slate-950" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-amber-300/80 uppercase font-black tracking-widest leading-none">Coins</span>
                <span className="text-sm font-black text-amber-300 font-mono leading-tight tracking-wide">
                  {user ? (user.coins).toLocaleString() : '0'}
                </span>
              </div>
              <span className="hidden sm:inline-block text-[9px] font-black bg-gradient-to-r from-royal-gold to-amber-500 text-slate-950 px-2 py-0.5 rounded-full shadow-gold-glow animate-pulse">
                SPIN
              </span>
            </div>

            {/* Notifications Bell */}
            <button
              onClick={() => {
                playClick();
                openNotifications();
              }}
              title="Notifications"
              className="relative p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-royal-gold transition-colors"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-royal-gold transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* User Profile Avatar & Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    playClick();
                    setProfileOpen(!profileOpen);
                  }}
                  className="flex items-center gap-2 p-1 pr-2 rounded-xl bg-slate-800/80 border border-royal-border hover:border-royal-gold/50 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-royal-purple to-slate-800 flex items-center justify-center text-base border border-purple-500/30">
                    {user.avatar || '👑'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[110px]">
                      {user.username.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono leading-none">
                      {user.playerTag}
                    </span>
                  </div>
                </button>

                {/* Profile Popup Menu */}
                {profileOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel-gold p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setProfileOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-royal-border/80">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{user.username.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-amber-400 font-mono">{user.playerTag}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          handleNavClick('profile');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700/50 rounded-lg"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-royal-gold" />
                        <span>My Profile & Stats</span>
                      </button>
                      <button
                        onClick={() => {
                          handleNavClick('wallet');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700/50 rounded-lg"
                      >
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span>Virtual Coin Passbook</span>
                      </button>
                      <button
                        onClick={() => {
                          handleNavClick('rules');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700/50 rounded-lg"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>Fair Play & Rules</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-royal-border/80">
                      <button
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-950/40 rounded-lg"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-royal-gold to-amber-600 text-royal-dark font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-gold-glow"
              >
                Login
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-royal-border bg-royal-dark/98 px-4 py-3 space-y-2">
          {[
            { id: 'dashboard', label: 'Main Lobby', icon: '🏰' },
            { id: 'battles', label: 'Battle Arena (Open Challenges)', icon: '⚔️' },
            { id: 'tournaments', label: 'Royal Tournaments', icon: '🏆' },
            { id: 'leaderboard', label: 'Leaderboard Rankings', icon: '🥇' },
            { id: 'wallet', label: 'Virtual Coin Passbook', icon: '💰' },
            { id: 'referrals', label: 'Invite Friends & Earn', icon: '🎁' },
            { id: 'profile', label: 'Player Profile', icon: '👤' },
            { id: 'rules', label: 'Rules & Fair Play', icon: '📜' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                currentTab === item.id
                  ? 'bg-royal-gold/20 text-royal-gold border border-royal-gold/40'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          {user?.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-purple-900/40 text-purple-300 border border-purple-500/40"
            >
              <ShieldAlert className="w-5 h-5 text-purple-400" />
              <span>Super Admin Dashboard</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

