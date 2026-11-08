import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { useSocket } from '../context/SocketContext';
import { BattleChallenge, GameMode } from '../types';
import { BattleFeed } from '../components/dashboard/BattleFeed';
import { CreateBattleModal } from '../components/dashboard/CreateBattleModal';
import { 
  Swords, 
  Crown, 
  Users, 
  Bot, 
  Sparkles, 
  Coins, 
  Trophy, 
  ArrowRight,
  Zap,
  X
} from 'lucide-react';

interface DashboardPageProps {
  onStartGame: (roomId: string, mode: GameMode) => void;
  onOpenLobby: (roomCode: string) => void;
  setCurrentTab: (tab: string) => void;
  openSpinModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onStartGame,
  onOpenLobby,
  setCurrentTab,
  openSpinModal,
}) => {
  const { user, updateCoins } = useAuth();
  const { playClick } = useSound();
  const { socket, connected } = useSocket();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const [battles, setBattles] = useState<BattleChallenge[]>([
    {
      id: 'b_demo_1',
      creatorId: 'user_queen_2',
      creatorName: 'Queen Maharani',
      creatorAvatar: '👸',
      creatorTag: '#RL-10002',
      entryFee: 100,
      prizePool: 190,
      mode: '1v1',
      status: 'open',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'b_demo_2',
      creatorId: 'user_knight_3',
      creatorName: 'Knight Vikram',
      creatorAvatar: '⚔️',
      creatorTag: '#RL-10003',
      entryFee: 250,
      prizePool: 475,
      mode: '1v1',
      status: 'open',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'b_demo_3',
      creatorId: 'user_bishop_4',
      creatorName: 'Master Arjun',
      creatorAvatar: '🏹',
      creatorTag: '#RL-10004',
      entryFee: 500,
      prizePool: 950,
      mode: '1v1',
      status: 'open',
      createdAt: new Date().toISOString(),
    },
  ]);

  React.useEffect(() => {
    if (!socket) return;
    socket.on('BATTLES_UPDATED', (updatedBattles: BattleChallenge[]) => {
      if (updatedBattles && updatedBattles.length > 0) setBattles(updatedBattles);
    });
    socket.on('JOINED_MATCH', ({ roomId, mode }: { roomId: string; mode: GameMode }) => {
      onStartGame(roomId, mode || '1v1');
    });
    return () => {
      socket.off('BATTLES_UPDATED');
      socket.off('JOINED_MATCH');
    };
  }, [socket, onStartGame]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.BroadcastChannel) return;
    const channel = new BroadcastChannel('royal_ludo_arena');
    channel.onmessage = (event) => {
      const data = event.data;
      if (data?.type === 'NEW_BATTLE') {
        setBattles(prev => [data.battle, ...prev.filter(b => b.id !== data.battle.id)]);
      } else if (data?.type === 'ACCEPT_BATTLE') {
        setBattles(prev => prev.filter(b => b.id !== data.battleId));
        if (user && data.battle?.creatorId === user.id) onStartGame(data.roomId, data.mode);
      }
    };
    return () => channel.close();
  }, [user, onStartGame]);

  const handleStartQuick1v1 = () => {
    playClick();
    if (!user) return;
    if (socket && connected) {
      socket.emit('FIND_MATCH', { mode: '1v1', player: user });
      socket.once('MATCH_FOUND', ({ roomId }: { roomId: string }) => onStartGame(roomId, '1v1'));
    } else {
      onStartGame(`room_1v1_${Date.now()}`, '1v1');
    }
  };

  const handleStartPracticeAI = () => {
    playClick();
    if (!user) return;
    if (socket && connected) {
      socket.emit('CREATE_AI_GAME', { player: user, mode: '1v1' });
      socket.once('GAME_STARTED', ({ roomId }) => onStartGame(roomId, 'ai'));
    } else {
      onStartGame(`room_ai_${Date.now()}`, 'ai');
    }
  };

  const handleCreatePrivateRoom = () => {
    playClick();
    if (!user) return;
    if (socket && connected) {
      socket.emit('CREATE_PRIVATE_ROOM', { host: user, mode: 'classic4p', entryFee: 0 });
      socket.once('PRIVATE_ROOM_CREATED', ({ roomCode }) => onOpenLobby(roomCode));
    } else {
      const demoCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      onOpenLobby(demoCode);
    }
  };

  const handleJoinPrivateRoom = () => {
    if (!joinCodeInput.trim() || !user) return;
    playClick();
    if (socket && connected) {
      socket.emit('JOIN_PRIVATE_ROOM', { roomCode: joinCodeInput.trim().toUpperCase(), player: user });
      socket.once('PRIVATE_ROOM_JOINED', (room) => { setJoinModalOpen(false); onOpenLobby(room.roomCode); });
    } else {
      setJoinModalOpen(false);
      onOpenLobby(joinCodeInput.trim().toUpperCase());
    }
  };

  const handleAcceptBattle = (battle: BattleChallenge) => {
    if (!user) return;
    if (user.coins < battle.entryFee) {
      alert(`Need ${battle.entryFee} coins. You have ${user.coins}.`);
      return;
    }
    playClick();
    updateCoins(user.coins - battle.entryFee);
    if (socket && connected) {
      socket.emit('ACCEPT_BATTLE_CHALLENGE', { battleId: battle.id, player: user });
    } else {
      const roomId = battle.roomId || `room_${battle.id}`;
      if (typeof window !== 'undefined' && window.BroadcastChannel) {
        const channel = new BroadcastChannel('royal_ludo_arena');
        channel.postMessage({ type: 'ACCEPT_BATTLE', battleId: battle.id, roomId, mode: battle.mode, opponent: user });
        channel.close();
      }
      onStartGame(roomId, battle.mode);
    }
  };

  const handleCancelBattle = (battleId: string) => {
    const battle = battles.find(b => b.id === battleId);
    if (battle && user) updateCoins(user.coins + battle.entryFee);
    setBattles(prev => prev.filter(b => b.id !== battleId));
    if (socket && user) socket.emit('CANCEL_BATTLE_CHALLENGE', { battleId, userId: user.id });
  };

  const gameModes = [
    {
      emoji: '⚔️',
      tag: 'Quick Showdown',
      title: '1v1 Quick Duel',
      desc: 'Fast-paced 2-player battle. 15s turn timer. First token home claims the grand purse!',
      cta: 'Play Now',
      accentBg: 'bg-[#4A87D6]/10',
      accentBorder: 'border-[#4A87D6]/30',
      accentText: 'text-[#4A87D6]',
      onClick: handleStartQuick1v1,
    },
    {
      emoji: '👑',
      tag: 'Royal Classic',
      title: 'Classic Royal 4P',
      desc: 'Full 4-player imperial showdown. 8 safe stars, captures, and glorious home run!',
      cta: 'Enter Arena',
      accentBg: 'bg-[#D4A7D7]/10',
      accentBorder: 'border-[#D4A7D7]/30',
      accentText: 'text-[#9B6DA5]',
      onClick: () => { playClick(); onStartGame(`room_4p_${Date.now()}`, 'classic4p'); },
    },
    {
      emoji: '🤝',
      tag: 'Private Chamber',
      title: 'Play With Friends',
      desc: 'Create an exclusive room with 6-digit code or WhatsApp link to duel friends!',
      cta: 'Create / Join',
      accentBg: 'bg-[#B7B39B]/10',
      accentBorder: 'border-[#B7B39B]/40',
      accentText: 'text-[#7A7664]',
      onClick: handleCreatePrivateRoom,
    },
    {
      emoji: '🤖',
      tag: 'Training Grounds',
      title: 'Practice vs AI',
      desc: 'Test your openings against adaptive AI bots. Zero coin cost, instant play anytime!',
      cta: 'Play Offline',
      accentBg: 'bg-[#E3C0BD]/10',
      accentBorder: 'border-[#E3C0BD]/40',
      accentText: 'text-[#A0706C]',
      onClick: handleStartPracticeAI,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Hero Welcome Card */}
      <div className="bg-[#000000] rounded-3xl p-6 sm:p-8 text-[#F7F4ED]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F7F4ED]/10 border border-[#F7F4ED]/20 flex items-center justify-center text-3xl shrink-0">
              {user?.avatar || '👑'}
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.1em] text-[#F7F4ED]/50 mb-1">
                Noble Sovereign · {user?.playerTag}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F7F4ED] leading-none">
                Welcome, {user?.username ? user.username.replace(/_/g, ' ') : 'King Maharaja'}
              </h1>
              <p className="text-sm text-[#F7F4ED]/60 mt-1.5 max-w-md">
                Step into the high-stakes arena. Stake coins, execute captures, and triumph!
              </p>
            </div>
          </div>

          {/* Stats + CTA */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex-1 sm:flex-initial p-4 rounded-2xl bg-[#F7F4ED]/8 border border-[#F7F4ED]/10 min-w-[130px]">
              <div className="text-[10px] text-[#F7F4ED]/50 uppercase tracking-widest font-bold">Treasury</div>
              <div className="text-xl font-black text-[#F7F4ED] font-mono flex items-center gap-1 mt-0.5">
                <Coins className="w-4 h-4 text-amber-400" />
                {user?.coins.toLocaleString()}
              </div>
            </div>
            <div className="flex-1 sm:flex-initial p-4 rounded-2xl bg-[#F7F4ED]/8 border border-[#F7F4ED]/10 min-w-[110px]">
              <div className="text-[10px] text-[#F7F4ED]/50 uppercase tracking-widest font-bold">Victories</div>
              <div className="text-xl font-black text-[#F7F4ED] font-mono flex items-center gap-1 mt-0.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                {user?.wins} <span className="text-xs text-[#F7F4ED]/40 font-normal">({user?.winRate}%)</span>
              </div>
            </div>
            <button
              onClick={openSpinModal}
              className="px-6 py-4 rounded-2xl bg-[#F7F4ED] text-[#000000] font-black text-xs uppercase tracking-[0.08em] hover:bg-[#DDD6CB] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Daily Spin & Win
            </button>
          </div>
        </div>
      </div>

      {/* Game Modes */}
      <div>
        <div className="mb-5">
          <h2 className="text-xl font-black text-[#000000] tracking-tight">Game Modes</h2>
          <p className="text-sm text-[#6E6962] mt-0.5">Choose your arena</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gameModes.map((mode) => (
            <div
              key={mode.title}
              onClick={mode.onClick}
              className="group bg-[#FFFFFF] border border-[#DDD6CB] rounded-2xl p-5 cursor-pointer hover:border-[#000000] hover:-translate-y-1 transition-all duration-200"
            >
              <div className={`w-12 h-12 rounded-xl ${mode.accentBg} border ${mode.accentBorder} flex items-center justify-center text-2xl mb-4`}>
                {mode.emoji}
              </div>
              <div className={`text-[10px] font-black uppercase tracking-[0.1em] ${mode.accentText} mb-1`}>
                {mode.tag}
              </div>
              <h3 className="text-base font-black text-[#000000] group-hover:text-[#000000]">
                {mode.title}
              </h3>
              <p className="text-xs text-[#6E6962] mt-1 mb-5 leading-relaxed">
                {mode.desc}
              </p>
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.08em] text-[#000000] pt-3 border-t border-[#DDD6CB]">
                <span>{mode.cta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Battle Feed */}
      <BattleFeed
        battles={battles}
        onOpenCreateModal={() => setCreateModalOpen(true)}
        onAcceptBattle={handleAcceptBattle}
        onCancelBattle={handleCancelBattle}
      />

      <CreateBattleModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onBattleCreated={(newBattle) => setBattles(prev => [newBattle, ...prev])}
      />

      {/* Join Room Modal */}
      {joinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="relative w-full max-w-sm bg-[#FFFFFF] border border-[#DDD6CB] rounded-3xl p-6 shadow-xl">
            <button
              onClick={() => setJoinModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-[#F7F4ED] border border-[#DDD6CB]"
            >
              <X className="w-4 h-4 text-[#6E6962]" />
            </button>
            <h3 className="text-lg font-black text-[#000000] mb-1">Join Private Room</h3>
            <p className="text-xs text-[#6E6962] mb-4">Enter the 6-character room code from your friend.</p>
            <input
              type="text"
              placeholder="e.g. RL8942"
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
              className="w-full text-center tracking-widest text-lg font-mono font-bold p-3 rounded-xl bg-[#F7F4ED] border border-[#DDD6CB] text-[#000000] uppercase mb-4 focus:outline-none focus:border-[#000000]"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setJoinModalOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-xs font-bold text-[#6E6962]"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinPrivateRoom}
                className="flex-1 py-2.5 rounded-full bg-[#000000] text-[#F7F4ED] font-bold text-xs uppercase tracking-[0.08em]"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
