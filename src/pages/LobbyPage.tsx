import React, { useState, useEffect } from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { useSocket } from '../context/SocketContext';
import { Player, GameMode } from '../types';
import { Copy, Check, Share2, Play, Users, ArrowLeft, Bot } from 'lucide-react';

interface LobbyPageProps {
  roomCode: string;
  onStartGame: (roomId: string, mode: GameMode) => void;
  onBackToDashboard: () => void;
}

export const LobbyPage: React.FC<LobbyPageProps> = ({ roomCode, onStartGame, onBackToDashboard }) => {
  const { user } = useAuth();
  const { playClick, playSixRolled } = useSound();
  const { socket, connected } = useSocket();

  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState<Partial<Player>[]>([
    {
      id: user?.id || 'host_1',
      username: user?.username || 'King_Maharaja',
      playerTag: user?.playerTag || '#RL-10001',
      avatar: user?.avatar || '👑',
      isReady: true,
      isBot: false,
    },
  ]);

  // Sync with Server Lobby
  useEffect(() => {
    if (!socket) return;

    socket.on('LOBBY_UPDATED', (roomData) => {
      if (roomData && roomData.players) {
        setPlayers(roomData.players);
      }
    });

    socket.on('GAME_STARTED', ({ roomId }) => {
      onStartGame(roomId, 'classic4p');
    });

    return () => {
      socket.off('LOBBY_UPDATED');
      socket.off('GAME_STARTED');
    };
  }, [socket, onStartGame]);

  const handleCopyCode = () => {
    playClick();
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    playClick();
    const text = encodeURIComponent(
      `👑 Join my Royal Ludo Private Room! Room Code: *${roomCode}*\nPlay now at ${window.location.origin}/?room=${roomCode}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleAddBot = () => {
    if (players.length >= 4) return;
    playClick();
    const botIdx = players.length;
    const botNames = ['Knight Bot', 'Empress AI', 'Vanguard Bot'];
    const botAvatars = ['🤖', '⚔️', '🏹'];

    const newBot = {
      id: `bot_${botIdx}`,
      username: botNames[botIdx - 1] || `Royal Bot ${botIdx}`,
      playerTag: `#BOT-${botIdx}`,
      avatar: botAvatars[botIdx - 1] || '🤖',
      isReady: true,
      isBot: true,
    };
    setPlayers(prev => [...prev, newBot]);
  };

  const handleStartGame = () => {
    playSixRolled();
    if (socket && connected) {
      socket.emit('START_PRIVATE_GAME', { roomCode });
    } else {
      onStartGame(`room_${roomCode}`, 'classic4p');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Back button */}
      <button
        onClick={() => {
          playClick();
          onBackToDashboard();
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-royal-border text-xs font-semibold text-slate-300 hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Lobby</span>
      </button>

      {/* Main Room Card */}
      <div className="rounded-3xl glass-panel-gold p-6 sm:p-8 border border-royal-gold/40 shadow-card-glow text-center">

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-royal-gold/15 border border-royal-gold/30 text-royal-gold text-xs font-bold uppercase tracking-wider mb-2">
          <Users className="w-3.5 h-3.5" />
          <span>Private Match Lobby</span>
        </div>

        <h1 className="font-royal text-2xl sm:text-3xl font-black gold-gradient-text mb-1">
          Waiting for Warriors
        </h1>
        <p className="text-xs text-slate-300 mb-6">
          Share this 6-character room code with your friends to join your private match.
        </p>

        {/* Room Code Display Box */}
        <div className="max-w-xs mx-auto p-4 rounded-2xl bg-slate-950/80 border-2 border-dashed border-royal-gold/60 mb-6 shadow-inner">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Room Code</span>
          <div className="text-3xl font-black tracking-widest text-royal-gold font-mono select-all">
            {roomCode}
          </div>
        </div>

        {/* Action Buttons: Copy Code & Share WhatsApp */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <button
            onClick={handleCopyCode}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Code Copied!' : 'Copy Room Code'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Invite on WhatsApp</span>
          </button>
        </div>

        {/* Player Slots (4 Slots) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[0, 1, 2, 3].map((idx) => {
            const player = players[idx];
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-center transition-all ${player
                    ? 'bg-slate-900/90 border-royal-border shadow-md'
                    : 'bg-slate-950/40 border-dashed border-slate-800 text-slate-500'
                  }`}
              >
                {player ? (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl mx-auto mb-2 shadow">
                      {player.avatar || '👑'}
                    </div>
                    <div className="text-xs font-bold text-white truncate">{player.username?.replace(/_/g, ' ') || 'Player'}</div>
                    <div className="text-[10px] text-amber-400 font-mono mt-0.5">{player.playerTag}</div>
                    <span className="inline-block mt-2 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      ✓ Ready
                    </span>
                  </>
                ) : (
                  <div className="py-4">
                    <div className="w-10 h-10 rounded-xl border border-dashed border-slate-700 flex items-center justify-center text-slate-600 mx-auto mb-2 text-sm font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 block mb-2">Empty Slot</span>
                    <button
                      onClick={handleAddBot}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 flex items-center justify-center gap-1 mx-auto"
                    >
                      <Bot className="w-3 h-3" /> +Add Bot
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Start Game Button (Host only) */}
        <button
          onClick={handleStartGame}
          disabled={players.length < 2}
          className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-gradient-to-r from-royal-gold via-amber-500 to-amber-600 text-royal-dark font-royal font-black text-sm uppercase tracking-wider shadow-gold-glow hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {players.length < 2 ? 'Need at least 2 players to start' : 'Launch Royal Battle'}
        </button>

      </div>
    </div>
  );
};

