import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { TopNavbar } from './components/navbar/TopNavbar';
import { MobileBottomNav } from './components/navbar/MobileBottomNav';
import { DemoSwitcherBanner } from './components/common/DemoSwitcherBanner';
import { DailyRewardsModal } from './components/dashboard/DailyRewardsModal';
import { DashboardPage } from './pages/DashboardPage';
import { GamePage } from './pages/GamePage';
import { LobbyPage } from './pages/LobbyPage';
import { WalletPage } from './pages/WalletPage';
import { TournamentsPage } from './pages/TournamentsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ReferralsPage } from './pages/ReferralsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { RulesPage } from './pages/RulesPage';
import { LandingPage } from './pages/LandingPage';
import { AuthModal } from './pages/AuthModal';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';
import { GameMode, AppNotification } from './types';

export const App: React.FC = () => {
  const { user } = useAuth();

  // Show cosmos landing by default; switch to dashboard once user enters app
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [activeGame, setActiveGame] = useState<{ roomId: string; mode: GameMode } | null>(null);
  const [activeLobbyCode, setActiveLobbyCode] = useState<string | null>(null);
  const [spinModalOpen, setSpinModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'n1',
      title: '⚔️ Battle Challenge Awaiting',
      message: 'Queen_Maharani set a 100 Coin challenge in the Battle Arena!',
      type: 'match',
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'n2',
      title: '🎁 Daily Spin Bonus Ready',
      message: 'Your free daily wheel spin and streak rewards are waiting to be claimed!',
      type: 'reward',
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'n3',
      title: '🏆 The Maharaja Grand Championship',
      message: 'Registration is live! Compete for the 3,600 coin prize pool.',
      type: 'tournament',
      read: true,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ]);

  // Check URL parameters for direct room joining or referrals
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setActiveLobbyCode(roomParam.toUpperCase());
    }

    const path = window.location.pathname;
    if (path.startsWith('/login/') || path.startsWith('/register/')) {
      const code = path.split('/')[2];
      if (code) {
        localStorage.setItem('royal_ludo_referral', code);
        setAuthModalOpen(true);
      }
    }
  }, []);

  const handleStartGame = (roomId: string, mode: GameMode) => {
    setActiveLobbyCode(null);
    setActiveGame({ roomId, mode });
  };

  const handleExitGame = () => {
    setActiveGame(null);
    setCurrentTab('dashboard');
  };

  const handleOpenLobby = (roomCode: string) => {
    setActiveGame(null);
    setActiveLobbyCode(roomCode);
  };

  const handleBackToDashboard = () => {
    setActiveLobbyCode(null);
    setCurrentTab('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F7F4ED] text-[#000000]">
      
      {/* 1. Testing Bar for Demo Multi-Account Switcher */}
      {currentTab !== 'landing' && <DemoSwitcherBanner />}

      {/* 2. Top Navigation Bar (Hidden only during full-screen gameplay if preferred, or persistent) */}
      {!activeGame && currentTab !== 'landing' && (
        <TopNavbar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setActiveGame(null);
            setActiveLobbyCode(null);
            setCurrentTab(tab);
          }}
          openSpinModal={() => setSpinModalOpen(true)}
          unreadCount={notifications.filter(n => !n.read).length}
          openNotifications={() => setNotificationsOpen(true)}
        />
      )}

      {/* 3. Main View Render */}
      <main className="flex-1 pb-20 md:pb-6">
        {activeGame ? (
          <GamePage
            roomId={activeGame.roomId}
            gameMode={activeGame.mode}
            onExitGame={handleExitGame}
          />
        ) : activeLobbyCode ? (
          <LobbyPage
            roomCode={activeLobbyCode}
            onStartGame={handleStartGame}
            onBackToDashboard={handleBackToDashboard}
          />
        ) : currentTab === 'landing' ? (
          <LandingPage
            onEnterApp={() => setCurrentTab('dashboard')}
            openAuthModal={() => setAuthModalOpen(true)}
          />
        ) : currentTab === 'wallet' ? (
          <WalletPage openSpinModal={() => setSpinModalOpen(true)} />
        ) : currentTab === 'tournaments' ? (
          <TournamentsPage />
        ) : currentTab === 'leaderboard' ? (
          <LeaderboardPage />
        ) : currentTab === 'referrals' ? (
          <ReferralsPage />
        ) : currentTab === 'profile' ? (
          <ProfilePage />
        ) : currentTab === 'admin' ? (
          <AdminDashboardPage />
        ) : currentTab === 'rules' ? (
          <RulesPage />
        ) : (
          <DashboardPage
            onStartGame={handleStartGame}
            onOpenLobby={handleOpenLobby}
            setCurrentTab={setCurrentTab}
            openSpinModal={() => setSpinModalOpen(true)}
          />
        )}
      </main>

      {/* 4. Mobile Bottom Navigation (Visible on phones when not in match) */}
      {!activeGame && !activeLobbyCode && currentTab !== 'landing' && (
        <MobileBottomNav
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setActiveGame(null);
            setActiveLobbyCode(null);
            setCurrentTab(tab);
          }}
        />
      )}

      {/* 5. Daily Rewards Lucky Spin Modal */}
      <DailyRewardsModal
        isOpen={spinModalOpen}
        onClose={() => setSpinModalOpen(false)}
      />

      {/* 6. User Login & Registration Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* 7. In-App Notifications Drawer */}
      <NotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }}
        onNotificationClick={(notif) => {
          setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
          setNotificationsOpen(false);
          if (notif.type === 'reward') setSpinModalOpen(true);
          else if (notif.type === 'tournament') setCurrentTab('tournaments');
          else if (notif.type === 'match') setCurrentTab('dashboard');
        }}
      />

    </div>
  );
};

