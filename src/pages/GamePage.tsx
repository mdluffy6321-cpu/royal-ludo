import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { useSocket } from '../context/SocketContext';
import { GameMode, GameRoomState, Player, TokenPiece, LudoColor } from '../types';
import { LudoBoard } from '../components/game/LudoBoard';
import { Dice3D } from '../components/game/Dice3D';
import { PlayerHUD } from '../components/game/PlayerHUD';
import { VictoryModal } from '../components/game/VictoryModal';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface GamePageProps {
  roomId: string;
  gameMode: GameMode;
  onExitGame: () => void;
}

export const GamePage: React.FC<GamePageProps> = ({ roomId, gameMode, onExitGame }) => {
  const { user, updateCoins } = useAuth();
  const { playClick, playDiceRoll, playTokenStep, playCapture, playTimerTick, playSixRolled } = useSound();
  const { socket, connected } = useSocket();

  const [gameState, setGameState] = useState<GameRoomState>(() => {
    const is1v1 = gameMode === '1v1' || gameMode === 'ai';
    const p1: Player = {
      id: user?.id || 'p1',
      username: user?.username ? user.username.replace(/_/g, ' ') : 'King Maharaja',
      playerTag: user?.playerTag || '#RL-10001',
      avatar: user?.avatar || '👑',
      color: 'red',
      isReady: true,
      isBot: false,
      isOnline: true,
      tokens: [0, 1, 2, 3].map(i => ({
        id: `red_${i}`,
        color: 'red' as LudoColor,
        index: i,
        stepCount: -1,
        position: -1,
        isYard: true,
        isHome: false,
        isSafe: false,
      })),
      tokensHome: 0,
      timeouts: 0,
    };

    const p2: Player = {
      id: 'bot_queen',
      username: gameMode === 'ai' ? 'Knight Bot' : 'Queen Maharani',
      playerTag: gameMode === 'ai' ? '#BOT-1' : '#RL-10002',
      avatar: gameMode === 'ai' ? '🤖' : '👸',
      color: 'yellow',
      isReady: true,
      isBot: gameMode === 'ai',
      isOnline: true,
      tokens: [0, 1, 2, 3].map(i => ({
        id: `yellow_${i}`,
        color: 'yellow' as LudoColor,
        index: i,
        stepCount: -1,
        position: -1,
        isYard: true,
        isHome: false,
        isSafe: false,
      })),
      tokensHome: 0,
      timeouts: 0,
    };

    const players = [p1, p2];

    return {
      roomId,
      roomCode: 'RL8921',
      mode: gameMode,
      entryFee: 100,
      prizePool: 190,
      status: 'in_progress',
      maxPlayers: is1v1 ? 2 : 4,
      players,
      currentTurnColor: 'red',
      diceValue: null,
      diceRolling: false,
      turnTimeout: 15,
      consecutiveSixes: 0,
      validTokenIds: [],
      winner: null,
      createdAt: Date.now(),
      spectatorsCount: 0,
      lastActivity: Date.now(),
    };
  });

  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const [confirmExitOpen, setConfirmExitOpen] = useState(false);

  useEffect(() => {
    if (socket && connected) {
      socket.emit('JOIN_GAME_ROOM', { roomId });

      socket.on('GAME_STATE_UPDATE', (updatedState: GameRoomState) => {
        setGameState(updatedState);
      });

      socket.on('EMOJI_REACTION', ({ emoji }: { emoji: string }) => {
        setActiveReaction(emoji);
        setTimeout(() => setActiveReaction(null), 2500);
      });

      return () => {
        socket.off('GAME_STATE_UPDATE');
        socket.off('EMOJI_REACTION');
      };
    } else if (typeof window !== 'undefined' && window.BroadcastChannel) {
      const channel = new BroadcastChannel(`royal_game_${roomId}`);
      channel.onmessage = (event) => {
        const data = event.data;
        if (data?.type === 'SYNC_STATE' && data.state) {
          setGameState(data.state);
        } else if (data?.type === 'EMOJI') {
          setActiveReaction(data.emoji);
          setTimeout(() => setActiveReaction(null), 2500);
        }
      };
      return () => channel.close();
    }
  }, [socket, connected, roomId]);

  useEffect(() => {
    if (connected || gameState.status !== 'in_progress') return;

    const timer = setInterval(() => {
      setGameState((prev: GameRoomState) => {
        if (prev.turnTimeout <= 1) {
          const colors: LudoColor[] = prev.mode === '1v1' ? ['red', 'yellow'] : ['red', 'green', 'yellow', 'blue'];
          const nextIdx = (colors.indexOf(prev.currentTurnColor) + 1) % colors.length;
          return {
            ...prev,
            currentTurnColor: colors[nextIdx],
            turnTimeout: 15,
            diceValue: null,
            validTokenIds: [],
          };
        }
        return { ...prev, turnTimeout: prev.turnTimeout - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [connected, gameState.status, gameState.currentTurnColor]);

  useEffect(() => {
    if (gameState.turnTimeout <= 5 && gameState.turnTimeout > 0 && gameState.status === 'in_progress') {
      playTimerTick();
    }
  }, [gameState.turnTimeout, gameState.status, playTimerTick]);

  const currentPlayer = gameState.players.find((p: Player) => p.color === gameState.currentTurnColor) || gameState.players[0];
  const isMyTurn = currentPlayer.id === user?.id;
  const canRoll = isMyTurn && gameState.diceValue === null && !gameState.diceRolling && gameState.status === 'in_progress';

  useEffect(() => {
    if (connected || gameState.status !== 'in_progress') return;
    if (currentPlayer.id === user?.id) return;

    const botRollTimer = setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      playDiceRoll();

      setGameState((prev: GameRoomState) => {
        const bot = prev.players.find((p: Player) => p.color === prev.currentTurnColor);
        if (!bot) return prev;

        const validTokens = bot.tokens.filter((t: TokenPiece) => 
          (t.isYard && roll === 6) || (!t.isYard && t.stepCount + roll <= 57)
        );

        if (validTokens.length === 0) {
          setTimeout(() => {
            setGameState((pState: GameRoomState) => {
              const colors: LudoColor[] = pState.mode === '1v1' ? ['red', 'yellow'] : ['red', 'green', 'yellow', 'blue'];
              const nextIdx = (colors.indexOf(pState.currentTurnColor) + 1) % colors.length;
              return {
                ...pState,
                diceValue: null,
                validTokenIds: [],
                currentTurnColor: colors[nextIdx],
                turnTimeout: 15,
              };
            });
          }, 1000);

          return { ...prev, diceValue: roll, validTokenIds: [] };
        }

        const chosenToken = validTokens.find(t => t.isYard) || validTokens[0];

        setTimeout(() => {
          playTokenStep();
          setGameState((pState: GameRoomState) => {
            const currentBot = pState.players.find((p: Player) => p.color === pState.currentTurnColor)!;
            const targetToken = currentBot.tokens.find((t: TokenPiece) => t.id === chosenToken.id)!;

            if (targetToken.isYard) {
              targetToken.isYard = false;
              targetToken.stepCount = 0;
              targetToken.isSafe = true;
            } else {
              targetToken.stepCount += roll;
              if (targetToken.stepCount === 57) {
                targetToken.isHome = true;
                currentBot.tokensHome += 1;
              }
            }

            const isWinner = currentBot.tokensHome >= (pState.mode === '1v1' ? 1 : 4);
            const extraRoll = roll === 6;

            const colors: LudoColor[] = pState.mode === '1v1' ? ['red', 'yellow'] : ['red', 'green', 'yellow', 'blue'];
            const nextIdx = (colors.indexOf(pState.currentTurnColor) + 1) % colors.length;

            return {
              ...pState,
              diceValue: null,
              validTokenIds: [],
              turnTimeout: 15,
              status: isWinner ? 'completed' : 'in_progress',
              winner: isWinner ? currentBot : null,
              currentTurnColor: extraRoll ? pState.currentTurnColor : colors[nextIdx],
            };
          });
        }, 1200);

        return { ...prev, diceValue: roll, validTokenIds: validTokens.map(t => t.id) };
      });
    }, 1000);

    return () => clearTimeout(botRollTimer);
  }, [connected, gameState.status, gameState.currentTurnColor, currentPlayer.id, user?.id, playDiceRoll, playTokenStep]);

  const handleRollDice = () => {
    if (!canRoll || !user) return;
    playDiceRoll();

    if (socket && connected) {
      socket.emit('ROLL_DICE', { roomId, playerId: user.id });
    } else {
      const roll = Math.floor(Math.random() * 6) + 1;
      const valid = currentPlayer.tokens.filter((t: TokenPiece) => (t.isYard && roll === 6) || (!t.isYard && t.stepCount + roll <= 57));
      
      const nextState: GameRoomState = {
        ...gameState,
        diceValue: roll,
        validTokenIds: valid.map((t: TokenPiece) => t.id),
      };

      setGameState(nextState);

      if (typeof window !== 'undefined' && window.BroadcastChannel) {
        const channel = new BroadcastChannel(`royal_game_${roomId}`);
        channel.postMessage({ type: 'SYNC_STATE', state: nextState });
        channel.close();
      }

      if (valid.length === 0) {
        setTimeout(() => {
          setGameState((prev: GameRoomState) => {
            const colors: LudoColor[] = prev.mode === '1v1' ? ['red', 'yellow'] : ['red', 'green', 'yellow', 'blue'];
            const nextIdx = (colors.indexOf(prev.currentTurnColor) + 1) % colors.length;
            const updated = {
              ...prev,
              diceValue: null,
              validTokenIds: [],
              currentTurnColor: colors[nextIdx],
              turnTimeout: 15,
            };
            if (typeof window !== 'undefined' && window.BroadcastChannel) {
              const channel = new BroadcastChannel(`royal_game_${roomId}`);
              channel.postMessage({ type: 'SYNC_STATE', state: updated });
              channel.close();
            }
            return updated;
          });
        }, 1200);
      }
    }
  };

  const handleSelectToken = (tokenId: string) => {
    if (!isMyTurn || !user) return;
    playTokenStep();

    if (socket && connected) {
      socket.emit('MOVE_TOKEN', { roomId, playerId: user.id, tokenId });
    } else {
      setGameState((prev: GameRoomState) => {
        const roll = prev.diceValue || 6;
        const player = prev.players.find((p: Player) => p.id === user.id)!;
        const token = player.tokens.find((t: TokenPiece) => t.id === tokenId)!;

        if (token.isYard) {
          token.isYard = false;
          token.stepCount = 0;
          token.isSafe = true;
        } else {
          token.stepCount += roll;
          if (token.stepCount === 57) {
            token.isHome = true;
            player.tokensHome += 1;
          }
        }

        const isWinner = player.tokensHome >= (prev.mode === '1v1' ? 1 : 4);
        if (isWinner && user) {
          updateCoins(user.coins + prev.prizePool, undefined, (user.winCoins || 0) + prev.prizePool);
        }

        const extraRoll = roll === 6;
        const colors: LudoColor[] = prev.mode === '1v1' ? ['red', 'yellow'] : ['red', 'green', 'yellow', 'blue'];
        const nextIdx = (colors.indexOf(prev.currentTurnColor) + 1) % colors.length;

        const updated: GameRoomState = {
          ...prev,
          diceValue: null,
          validTokenIds: [],
          turnTimeout: 15,
          status: isWinner ? 'completed' : 'in_progress',
          winner: isWinner ? player : null,
          currentTurnColor: extraRoll ? prev.currentTurnColor : colors[nextIdx],
        };

        if (typeof window !== 'undefined' && window.BroadcastChannel) {
          const channel = new BroadcastChannel(`royal_game_${roomId}`);
          channel.postMessage({ type: 'SYNC_STATE', state: updated });
          channel.close();
        }

        return updated;
      });
    }
  };

  const handleSendReaction = (emoji: string) => {
    playClick();
    setActiveReaction(emoji);
    setTimeout(() => setActiveReaction(null), 2500);

    if (socket && connected && user) {
      socket.emit('SEND_REACTION', { roomId, emoji, senderName: user.username });
    } else if (typeof window !== 'undefined' && window.BroadcastChannel) {
      const channel = new BroadcastChannel(`royal_game_${roomId}`);
      channel.postMessage({ type: 'EMOJI', emoji });
      channel.close();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 min-h-[calc(100vh-5rem)] flex flex-col justify-between">

      {/* Top Game Bar */}
      <div className="flex items-center justify-between mb-3 px-2">
        <button
          onClick={() => setConfirmExitOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#DDD6CB] text-xs font-semibold text-[#6E6962] hover:text-[#000000] hover:border-[#000000] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Leave Match</span>
        </button>

        {/* Prize Pool Display */}
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFFFF] border border-[#DDD6CB] text-[#000000] text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Prize: 🪙 {gameState.prizePool} Coins</span>
        </div>

        {/* Room Mode Tag */}
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#6E6962] font-mono bg-[#FFFFFF] px-3 py-1 rounded-full border border-[#DDD6CB]">
          Room: {gameState.roomCode}
        </div>
      </div>

      {/* Main Board Arena */}
      <div className="relative flex flex-col items-center justify-center my-auto">

        {/* Floating Emoji Animation */}
        {activeReaction && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 text-6xl animate-bounce pointer-events-none drop-shadow-2xl">
            {activeReaction}
          </div>
        )}

        {/* Top Player HUDs */}
        <div className="w-full max-w-[540px] grid grid-cols-2 gap-2 mb-2">
          {gameState.players[1] && (
            <PlayerHUD
              player={gameState.players[1]}
              isCurrentTurn={gameState.currentTurnColor === gameState.players[1].color}
              timeLeft={gameState.turnTimeout}
              position="top-right"
            />
          )}
          {gameState.players[2] ? (
            <PlayerHUD
              player={gameState.players[2]}
              isCurrentTurn={gameState.currentTurnColor === gameState.players[2].color}
              timeLeft={gameState.turnTimeout}
              position="top-left"
            />
          ) : (
            <div />
          )}
        </div>

        {/* SVG Board Container */}
        <div className="relative w-full max-w-[540px]">
          <LudoBoard
            players={gameState.players}
            currentTurnColor={gameState.currentTurnColor}
            diceValue={gameState.diceValue}
            validTokenIds={gameState.validTokenIds}
            onSelectToken={handleSelectToken}
          />
        </div>

        {/* Bottom Player HUDs */}
        <div className="w-full max-w-[540px] grid grid-cols-2 gap-2 mt-2">
          {gameState.players[0] && (
            <PlayerHUD
              player={gameState.players[0]}
              isCurrentTurn={gameState.currentTurnColor === gameState.players[0].color}
              timeLeft={gameState.turnTimeout}
              position="bottom-left"
            />
          )}
          {gameState.players[3] ? (
            <PlayerHUD
              player={gameState.players[3]}
              isCurrentTurn={gameState.currentTurnColor === gameState.players[3].color}
              timeLeft={gameState.turnTimeout}
              position="bottom-right"
            />
          ) : (
            <div />
          )}
        </div>

      </div>

      {/* Bottom Controls Bar: 3D Dice Roller & Emoji Reactions */}
      <div className="mt-4 pt-3 border-t border-[#DDD6CB] flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto w-full">

        {/* Quick Emoji Reaction Pill Bar */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#FFFFFF] border border-[#DDD6CB]">
          {['👑', '🔥', '👏', '😱', '🤣', '💀'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleSendReaction(emoji)}
              className="p-1 text-lg hover:scale-125 transition-transform active:scale-95"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* 3D Dice Roller Component */}
        <div className="flex items-center gap-4">
          <Dice3D
            value={gameState.diceValue}
            rolling={gameState.diceRolling}
            canRoll={canRoll}
            color={gameState.currentTurnColor}
            onRoll={handleRollDice}
          />
        </div>

      </div>

      {/* Victory Modal */}
      <VictoryModal
        winner={gameState.winner}
        prizePool={gameState.prizePool}
        isCurrentUserWinner={gameState.winner?.id === user?.id}
        onPlayAgain={() => {
          setGameState((prev: GameRoomState) => ({
            ...prev,
            status: 'in_progress',
            winner: null,
            diceValue: null,
            validTokenIds: [],
          }));
        }}
        onBackToLobby={onExitGame}
      />

      {/* Exit Confirmation Dialog */}
      {confirmExitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#FFFFFF] border border-[#DDD6CB] p-6 text-center text-[#000000] shadow-xl">
            <h3 className="text-xl font-black text-[#000000] mb-2">
              Resign Battle?
            </h3>
            <p className="text-xs text-[#6E6962] mb-5">
              Leaving the active match will forfeit the battle and award victory to your opponent.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmExitOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-[#F7F4ED] text-xs font-bold text-[#6E6962] hover:border-[#000000] border border-[#DDD6CB] transition-all"
              >
                Keep Playing
              </button>
              <button
                onClick={() => {
                  setConfirmExitOpen(false);
                  onExitGame();
                }}
                className="flex-1 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-[0.08em] transition-all"
              >
                Forfeit & Exit
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
