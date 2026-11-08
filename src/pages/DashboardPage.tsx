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
  Flame, 
  Trophy, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Gift
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
  const { playClick, playSixRolled } = useSound();
  const { socket, connected } = useSocket();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  // Local state for battles feed
  const [battles, setBattles] = useState<BattleChallenge[]>([
    {
      id: 'b_demo_1',
      creatorId: 'user_queen_2',
      creatorName: 'Queen_Maharani',
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
      creatorName: 'Knight_Vikram',
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
      creatorName: 'Master_Arjun',
      creatorAvatar: '🏹',
      creatorTag: '#RL-10004',
      entryFee: 500,
      prizePool: 950,
      mode: '1v1',
      status: 'open',
      createdAt: new Date().toISOString(),
    },
  ]);

  // Listen for real-time battle updates from server
  React.useEffect(() => {
    if (!socket) return;
    socket.on('BATTLES_UPDATED', (updatedBattles: BattleChallenge[]) => {
      if (updatedBattles && updatedBattles.length > 0) {
        setBattles(updatedBattles);
      }
    });

    socket.on('JOINED_MATCH', ({ roomId, mode }: { roomId: string; mode: GameMode }) => {
      onStartGame(roomId, mode || '1v1');
    });

    return () => {
      socket.off('BATTLES_UPDATED');
      socket.off('JOINED_MATCH');
    };
  }, [socket, onStartGame]);

  // Listen for BroadcastChannel cross-tab events on standalone Vercel
  useEffect(() => {
    if (typeof window === 'undefined' || !window.BroadcastChannel) return;
    const channel = new BroadcastChannel('royal_ludo_arena');

    channel.onmessage = (event) => {
      const data = event.data;
      if (data?.type === 'NEW_BATTLE') {
        setBattles(prev => [data.battle, ...prev.filter(b => b.id !== data.battle.id)]);
      } else if (data?.type === 'ACCEPT_BATTLE') {
        setBattles(prev => prev.filter(b => b.id !== data.battleId));
        if (user && data.battle?.creatorId === user.id) {
          onStartGame(data.roomId, data.mode);
        }
      }
    };

    return () => channel.close();
  }, [user, onStartGame]);

  const handleStartPracticeAI = () => {
    playClick();
    if (!user) return;
    if (socket && connected) {
      socket.emit('CREATE_AI_GAME', { player: user, mode: '1v1' });
      socket.once('GAME_STARTED', ({ roomId }) => {
        onStartGame(roomId, 'ai');
      });
    } else {
      onStartGame(`room_ai_${Date.now()}`, 'ai');
    }
  };

  const handleCreatePrivateRoom = () => {
    playClick();
    if (!user) return;
    if (socket && connected) {
      socket.emit('CREATE_PRIVATE_ROOM', { host: user, mode: 'classic4p', entryFee: 0 });
      socket.once('PRIVATE_ROOM_CREATED', ({ roomCode }) => {
        onOpenLobby(roomCode);
      });
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
      socket.once('PRIVATE_ROOM_JOINED', (room) => {
        setJoinModalOpen(false);
        onOpenLobby(room.roomCode);
      });
    } else {
      setJoinModalOpen(false);
      onOpenLobby(joinCodeInput.trim().toUpperCase());
    }
  };

  const handleAcceptBattle = (battle: BattleChallenge) => {
    if (!user) return;
    if (user.coins < battle.entryFee) {
      alert(`Insufficient virtual coins! You need ${battle.entryFee} coins to accept this challenge.`);
      return;
    }

    playClick();
    // Escrow deduction
    updateCoins(user.coins - battle.entryFee);

    if (socket && connected) {
      socket.emit('ACCEPT_BATTLE_CHALLENGE', { battleId: battle.id, player: user });
    } else {
      // Standalone Vercel cross-tab sync
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
    if (battle && user) {
      updateCoins(user.coins + battle.entryFee); // Refund
    }
    setBattles(prev => prev.filter(b => b.id !== battleId));
    if (socket && user) {
      socket.emit('CANCEL_BATTLE_CHALLENGE', { battleId, userId: user.id });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. Hero Welcome & Account Stats Banner (Imperial Obsidian & Royal Gold) */}
      <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#0B1226] via-[#070B19] to-[#120B20] p-6 sm:p-8 border-2 border-royal-gold/40 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
        {/* Ornate corner gold decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-royal-gold rounded-tl-[30px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-royal-gold rounded-tr-[30px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-royal-gold rounded-bl-[30px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-royal-gold rounded-br-[30px] pointer-events-none" />

        {/* Ambient atmospheric lighting */}
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-royal-gold/15 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-16 left-1/4 w-80 h-80 bg-purple-700/20 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-3xl bg-gradient-to-br from-[#FDE68A] via-[#F59E0B] to-[#78350F] p-[2.5px] shadow-[0_0_25px_rgba(245,158,11,0.45)] flex items-center justify-center">
              <div className="w-full h-full bg-[#070B19] rounded-[22px] flex items-center justify-center text-4xl sm:text-5xl">
                {user?.avatar || '👑'}
              </div>
              <span className="absolute -top-3 -right-3 text-xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-bounce-subtle">
                👑
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-black text-slate-950 bg-gradient-to-r from-royal-gold via-amber-400 to-amber-500 px-3 py-0.5 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.5)]">
                  Noble Sovereign
                </span>
                <span className="text-xs font-mono font-bold text-amber-200/90 bg-slate-900/90 px-2 py-0.5 rounded-md border border-royal-gold/30">
                  {user?.playerTag}
                </span>
              </div>
              <h1 className="font-royal text-2xl sm:text-3xl lg:text-4xl font-black text-white mt-1.5 tracking-wide">
                Welcome, <span className="gold-gradient-text drop-shadow-[0_2px_12px_rgba(245,158,11,0.4)]">{user?.username}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md leading-relaxed">
                Step into the high-stakes royal arena. Stake virtual coins, execute strategic captures, and triumph!
              </p>
            </div>
          </div>

          {/* Quick Balance & Action Chips */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex-1 sm:flex-initial p-3.5 rounded-2xl bg-[#070B19]/90 border border-royal-gold/40 shadow-inner min-w-[140px]">
              <span className="text-[9px] text-amber-300/80 block uppercase font-black tracking-widest">Virtual Treasury</span>
              <span className="text-xl font-black text-amber-300 font-mono flex items-center gap-1.5 mt-0.5">
                <Coins className="w-5 h-5 text-royal-gold" />
                {user?.coins.toLocaleString()}
              </span>
            </div>

            <div className="flex-1 sm:flex-initial p-3.5 rounded-2xl bg-[#070B19]/90 border border-royal-border min-w-[120px]">
              <span className="text-[9px] text-slate-400 block uppercase font-black tracking-widest">Victories</span>
              <span className="text-xl font-black text-emerald-400 font-mono flex items-center gap-1.5 mt-0.5">
                <Trophy className="w-5 h-5 text-emerald-400" />
                {user?.wins} <span className="text-xs text-slate-400 font-normal">({user?.winRate}%)</span>
              </span>
            </div>

            <button
              onClick={openSpinModal}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-[#FDE68A] via-[#F59E0B] to-[#D97706] text-slate-950 font-royal font-black text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950 group-hover:rotate-180 transition-transform duration-500" />
              <span>Daily Spin & Win</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Core Game Modes Hub */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-royal-gold" />
              <h2 className="font-royal text-xl sm:text-2xl font-black gold-gradient-text tracking-wide">
                Royal Battlefields
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Select your preferred high-stakes arena</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: 1v1 Quick Battle */}
          <div 
            onClick={() => setCreateModalOpen(true)}
            className="group relative rounded-[26px] p-5 bg-gradient-to-b from-[#181528] via-[#0E152E] to-[#070B19] border-2 border-royal-gold/40 hover:border-royal-gold shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] cursor-pointer hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-royal-gold/15 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/25 to-amber-900/40 text-royal-gold flex items-center justify-center text-3xl mb-4 border border-royal-gold/40 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              ⚔️
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Quick Showdown
            </div>
            <h3 className="font-royal text-lg font-black text-white group-hover:text-amber-300 transition-colors">
              1v1 Quick Duel
            </h3>
            <p className="text-xs text-slate-300 mt-1 mb-5 leading-relaxed">
              Fast-paced 2-player battle. 15s turn timer. First token home claims the grand purse!
            </p>
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-royal-gold pt-3 border-t border-royal-border/80">
              <span className="group-hover:tracking-widest transition-all">Set Challenge</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Classic 4-Player Ludo */}
          <div 
            onClick={() => {
              playClick();
              setCreateModalOpen(true);
            }}
            className="group relative rounded-[26px] p-5 bg-gradient-to-b from-[#221035] via-[#101736] to-[#070B19] border-2 border-purple-500/40 hover:border-purple-400 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_30px_rgba(124,58,237,0.35)] cursor-pointer hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/15 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/25 to-purple-900/40 text-purple-300 flex items-center justify-center text-3xl mb-4 border border-purple-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-[0_0_15px_rgba(124,58,237,0.25)]">
              👑
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-purple-300 mb-1 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-purple-400" /> Royal Classic
            </div>
            <h3 className="font-royal text-lg font-black text-white group-hover:text-purple-300 transition-colors">
              Classic Royal 4P
            </h3>
            <p className="text-xs text-slate-300 mt-1 mb-5 leading-relaxed">
              Full 4-player imperial showdown. 8 safe stars, captures, and glorious home run!
            </p>
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-purple-400 pt-3 border-t border-purple-900/60">
              <span className="group-hover:tracking-widest transition-all">Enter Arena</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Play with Friends (Private Room) */}
          <div 
            onClick={handleCreatePrivateRoom}
            className="group relative rounded-[26px] p-5 bg-gradient-to-b from-[#0F1E3D] via-[#0D1833] to-[#070B19] border-2 border-blue-500/40 hover:border-blue-400 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_30px_rgba(59,130,246,0.35)] cursor-pointer hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/25 to-blue-900/40 text-blue-300 flex items-center justify-center text-3xl mb-4 border border-blue-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-[0_0_15px_rgba(59,130,246,0.25)]">
              🤝
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-blue-300 mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" /> Private Chamber
            </div>
            <h3 className="font-royal text-lg font-black text-white group-hover:text-blue-300 transition-colors">
              Play With Friends
            </h3>
            <p className="text-xs text-slate-300 mt-1 mb-5 leading-relaxed">
              Create an exclusive room with 6-digit code or WhatsApp link to duel friends!
            </p>
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-blue-400 pt-3 border-t border-blue-900/60">
              <span className="group-hover:tracking-widest transition-all">Create / Join</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 4: Practice vs AI Bot */}
          <div 
            onClick={handleStartPracticeAI}
            className="group relative rounded-[26px] p-5 bg-gradient-to-b from-[#09221C] via-[#0A1A28] to-[#070B19] border-2 border-emerald-500/40 hover:border-emerald-400 shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_0_30px_rgba(16,185,129,0.35)] cursor-pointer hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/25 to-emerald-900/40 text-emerald-300 flex items-center justify-center text-3xl mb-4 border border-emerald-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              🤖
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-1 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-emerald-400" /> Training Grounds
            </div>
            <h3 className="font-royal text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
              Practice vs AI
            </h3>
            <p className="text-xs text-slate-300 mt-1 mb-5 leading-relaxed">
              Test your openings against adaptive AI bots. Zero coin cost, instant play anytime!
            </p>
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-emerald-400 pt-3 border-t border-emerald-900/60">
              <span className="group-hover:tracking-widest transition-all">Play Offline</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* 3. Open Battle Arena Feed (ApnaAddaa / GFLudo Model) */}
      <BattleFeed
        battles={battles}
        onOpenCreateModal={() => setCreateModalOpen(true)}
        onAcceptBattle={handleAcceptBattle}
        onCancelBattle={handleCancelBattle}
      />

      {/* Create Battle Modal */}
      <CreateBattleModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onBattleCreated={(newBattle) => {
          setBattles(prev => [newBattle, ...prev]);
        }}
      />

      {/* Join Private Room Code Modal */}
      {joinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-3xl glass-panel-gold p-6 text-white shadow-2xl border border-royal-gold/40">
            <h3 className="font-royal text-xl font-bold gold-gradient-text mb-2 text-center">
              Join Private Room
            </h3>
            <p className="text-xs text-slate-300 text-center mb-4">
              Enter the 6-character room code given by your friend.
            </p>
            <input
              type="text"
              placeholder="e.g. RL8942"
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
              className="w-full text-center tracking-widest text-lg font-mono font-bold p-3 rounded-xl bg-slate-900 border border-royal-border text-white uppercase mb-4 focus:outline-none focus:border-royal-gold"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setJoinModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinPrivateRoom}
                className="flex-1 py-2.5 rounded-xl bg-royal-gold text-royal-dark font-bold text-xs uppercase"
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

