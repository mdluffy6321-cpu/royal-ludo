import React, { useState } from 'react';
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
  const { socket } = useSocket();

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

  const handleStartPracticeAI = () => {
    playClick();
    if (!user) return;
    if (socket) {
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
    if (socket) {
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
    if (socket) {
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

    if (socket) {
      socket.emit('ACCEPT_BATTLE_CHALLENGE', { battleId: battle.id, player: user });
    } else {
      // Offline fallback
      onStartGame(`room_${battle.id}`, battle.mode);
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
      
      {/* 1. Hero Welcome & Account Stats Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel-gold p-6 sm:p-8 border border-royal-gold/40 shadow-card-glow">
        {/* Decorative backdrop glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-royal-gold/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-royal-purple/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-royal-gold via-amber-600 to-royal-dark p-1 shadow-gold-glow flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-3xl sm:text-4xl">
                {user?.avatar || '👑'}
              </div>
              <span className="absolute -top-2 -right-2 text-base animate-bounce-subtle">
                👑
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-extrabold text-royal-gold bg-royal-gold/20 px-2.5 py-0.5 rounded-full border border-royal-gold/30">
                  Noble Warrior
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {user?.playerTag}
                </span>
              </div>
              <h1 className="font-royal text-2xl sm:text-3xl lg:text-4xl font-black text-white mt-1">
                Welcome, <span className="gold-gradient-text">{user?.username}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
                Enter the grand battle arena, challenge noble opponents, and claim royal glory!
              </p>
            </div>
          </div>

          {/* Quick Balance & Action Chips */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex-1 sm:flex-initial p-3 rounded-2xl bg-slate-950/70 border border-royal-border min-w-[130px]">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Virtual Balance</span>
              <span className="text-lg font-black text-royal-gold font-mono flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-royal-gold" />
                {user?.coins.toLocaleString()}
              </span>
            </div>

            <div className="flex-1 sm:flex-initial p-3 rounded-2xl bg-slate-950/70 border border-royal-border min-w-[110px]">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Victories</span>
              <span className="text-lg font-black text-emerald-400 font-mono flex items-center gap-1">
                <Trophy className="w-4 h-4 text-emerald-400" />
                {user?.wins} <span className="text-xs text-slate-400 font-normal">({user?.winRate}%)</span>
              </span>
            </div>

            <button
              onClick={openSpinModal}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gradient-to-r from-royal-gold via-amber-500 to-amber-600 text-royal-dark font-royal font-black text-xs uppercase tracking-wider shadow-gold-glow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-royal-dark" />
              <span>Daily Spin & Win</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Core Game Modes Hub */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-royal text-xl sm:text-2xl font-black gold-gradient-text">
              Game Modes
            </h2>
            <p className="text-xs text-slate-400">Choose your preferred royal battlefield</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: 1v1 Quick Battle */}
          <div 
            onClick={() => setCreateModalOpen(true)}
            className="group relative rounded-3xl p-5 bg-gradient-to-br from-amber-950/40 via-royal-card to-slate-900 border border-royal-gold/40 hover:border-royal-gold shadow-card-glow cursor-pointer hover:-translate-y-1 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-royal-gold/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-royal-gold flex items-center justify-center text-2xl mb-4 border border-amber-500/30 group-hover:rotate-6 transition-transform">
              ⚔️
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> High Voltage
            </div>
            <h3 className="font-royal text-lg font-black text-white group-hover:text-royal-gold transition-colors">
              1v1 Quick Duel
            </h3>
            <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
              Fast 2-player battle. 15-second timer. 1st token home takes the prize pool!
            </p>
            <div className="flex items-center justify-between text-xs font-bold text-royal-gold pt-2 border-t border-slate-800">
              <span>Set Battle</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Classic 4-Player Ludo */}
          <div 
            onClick={() => {
              playClick();
              setCreateModalOpen(true);
            }}
            className="group relative rounded-3xl p-5 bg-gradient-to-br from-purple-950/40 via-royal-card to-slate-900 border border-purple-500/40 hover:border-purple-400 shadow-card-glow cursor-pointer hover:-translate-y-1 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-2xl mb-4 border border-purple-500/30 group-hover:rotate-6 transition-transform">
              👑
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" /> Traditional Rules
            </div>
            <h3 className="font-royal text-lg font-black text-white group-hover:text-purple-300 transition-colors">
              Classic Royal 4P
            </h3>
            <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
              Full 4-player royal showdown. Safe stars, token captures, and complete home run!
            </p>
            <div className="flex items-center justify-between text-xs font-bold text-purple-400 pt-2 border-t border-slate-800">
              <span>Enter Arena</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Play with Friends (Private Room) */}
          <div 
            onClick={handleCreatePrivateRoom}
            className="group relative rounded-3xl p-5 bg-gradient-to-br from-blue-950/40 via-royal-card to-slate-900 border border-blue-500/40 hover:border-blue-400 shadow-card-glow cursor-pointer hover:-translate-y-1 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center text-2xl mb-4 border border-blue-500/30 group-hover:rotate-6 transition-transform">
              🤝
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-300 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Private Room
            </div>
            <h3 className="font-royal text-lg font-black text-white group-hover:text-blue-300 transition-colors">
              Play With Friends
            </h3>
            <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
              Create a private room with a 6-digit code or share link to play together!
            </p>
            <div className="flex items-center justify-between text-xs font-bold text-blue-400 pt-2 border-t border-slate-800">
              <span>Create / Join</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Practice vs AI Bot */}
          <div 
            onClick={handleStartPracticeAI}
            className="group relative rounded-3xl p-5 bg-gradient-to-br from-emerald-950/40 via-royal-card to-slate-900 border border-emerald-500/40 hover:border-emerald-400 shadow-card-glow cursor-pointer hover:-translate-y-1 transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-2xl mb-4 border border-emerald-500/30 group-hover:rotate-6 transition-transform">
              🤖
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 mb-1 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> Solo & Practice
            </div>
            <h3 className="font-royal text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
              Practice vs AI
            </h3>
            <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
              Sharpen your strategies against smart AI bots. No coins required, 100% free!
            </p>
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400 pt-2 border-t border-slate-800">
              <span>Play Offline</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

