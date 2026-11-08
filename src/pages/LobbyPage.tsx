import React, { useState, useEffect } from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { useSocket } from '../context/SocketContext';
import { Player, GameMode } from '../types';
import { Copy, Check, Share2, Users, ArrowLeft, Bot } from 'lucide-react';

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
      username: user?.username ? user.username.replace(/_/g, ' ') : 'King Maharaja',
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
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#DDD6CB] text-xs font-semibold text-[#6E6962] hover:text-[#000000] hover:border-[#000000] mb-6 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Lobby</span>
      </button>

      {/* Main Room Card */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#DDD6CB] p-6 sm:p-8 text-center">

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-[#000000] text-xs font-bold uppercase tracking-[0.08em] mb-2">
          <Users className="w-3.5 h-3.5" />
          <span>Private Match Lobby</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#000000] tracking-tight mb-1">
          Waiting for Warriors
        </h1>
        <p className="text-xs text-[#6E6962] mb-6">
          Share this 6-character room code with your friends to join your private match.
        </p>

        {/* Room Code Display Box */}
        <div className="max-w-xs mx-auto p-4 rounded-2xl bg-[#F7F4ED] border-2 border-dashed border-[#DDD6CB] mb-6">
          <span className="text-[10px] uppercase font-bold text-[#6E6962] block mb-1">Room Code</span>
          <div className="text-3xl font-black tracking-widest text-[#000000] font-mono select-all">
            {roomCode}
          </div>
        </div>

        {/* Action Buttons: Copy Code & Share WhatsApp */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <button
            onClick={handleCopyCode}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#F7F4ED] hover:border-[#000000] text-xs font-bold text-[#000000] flex items-center justify-center gap-2 border border-[#DDD6CB] transition-all uppercase tracking-[0.08em]"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Code Copied!' : 'Copy Room Code'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#000000] hover:opacity-85 text-[#F7F4ED] text-xs font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-[0.08em]"
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
                className={`p-4 rounded-2xl border text-center transition-all ${
                  player
                    ? 'bg-[#F7F4ED] border-[#DDD6CB]'
                    : 'bg-[#FFFFFF] border-dashed border-[#DDD6CB] text-[#6E6962]'
                }`}
              >
                {player ? (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-[#FFFFFF] border border-[#DDD6CB] flex items-center justify-center text-2xl mx-auto mb-2">
                      {player.avatar || '👑'}
                    </div>
                    <div className="text-xs font-bold text-[#000000] truncate">{player.username?.replace(/_/g, ' ') || 'Player'}</div>
                    <div className="text-[10px] text-[#6E6962] font-mono mt-0.5">{player.playerTag}</div>
                    <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full">
                      ✓ Ready
                    </span>
                  </>
                ) : (
                  <div className="py-4">
                    <div className="w-10 h-10 rounded-xl border border-dashed border-[#DDD6CB] flex items-center justify-center text-[#6E6962] mx-auto mb-2 text-sm font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-[11px] font-medium text-[#6E6962] block mb-2">Empty Slot</span>
                    <button
                      onClick={handleAddBot}
                      className="px-2.5 py-1 rounded-full bg-[#F7F4ED] hover:border-[#000000] border border-[#DDD6CB] text-[10px] font-semibold text-[#000000] flex items-center justify-center gap-1 mx-auto transition-all"
                    >
                      <Bot className="w-3 h-3" /> +Add Bot
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Start Game Button */}
        <button
          onClick={handleStartGame}
          disabled={players.length < 2}
          className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-[#000000] text-[#F7F4ED] font-bold text-sm uppercase tracking-[0.08em] hover:opacity-85 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {players.length < 2 ? 'Need at least 2 players to start' : 'Launch Royal Battle'}
        </button>

      </div>
    </div>
  );
};
