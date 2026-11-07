import { Server, Socket } from 'socket.io';
import { RoomManager } from '../rooms/RoomManager.js';

let onlineUsers = new Map<string, { socketId: string; username: string }>();

export function registerSocketHandlers(io: Server, roomManager: RoomManager) {
  io.on('connection', (socket: Socket) => {
    const userId = socket.handshake.auth.userId as string || socket.id;
    const username = socket.handshake.auth.username as string || 'Warrior';

    onlineUsers.set(socket.id, { socketId: socket.id, username });
    io.emit('ONLINE_COUNT_UPDATE', Math.max(142, onlineUsers.size + 140));

    // Send current open battles to newly connected player
    socket.emit('BATTLES_UPDATED', roomManager.getOpenBattles());

    // User online check-in
    socket.on('USER_ONLINE', (userData) => {
      if (userData?.userId) {
        onlineUsers.set(socket.id, { socketId: socket.id, username: userData.username });
      }
    });

    // Request open battles
    socket.on('GET_BATTLES', () => {
      socket.emit('BATTLES_UPDATED', roomManager.getOpenBattles());
    });

    // Create Battle
    socket.on('CREATE_BATTLE_CHALLENGE', (battleData) => {
      const battle = roomManager.createBattle(battleData);
      socket.emit('BATTLE_CREATED', battle);
    });

    // Cancel Battle
    socket.on('CANCEL_BATTLE_CHALLENGE', ({ battleId, userId }) => {
      const ok = roomManager.cancelBattle(battleId, userId);
      socket.emit('BATTLE_CANCELLED', { success: ok, battleId });
    });

    // Accept Battle
    socket.on('ACCEPT_BATTLE_CHALLENGE', ({ battleId, player }) => {
      const match = roomManager.acceptBattle(battleId, player);
      if (match) {
        socket.join(match.roomId);
        io.emit('BATTLE_ACCEPTED', { battleId, match });
        socket.emit('JOINED_MATCH', match);
      }
    });

    // Create AI Game
    socket.on('CREATE_AI_GAME', ({ player, mode }) => {
      const match = roomManager.createAIGame(player, mode);
      socket.join(match.roomId);
      const game = roomManager.getGame(match.roomId);
      socket.emit('GAME_STARTED', { roomId: match.roomId, roomCode: match.roomCode, state: game?.state });
    });

    // Create Private Room
    socket.on('CREATE_PRIVATE_ROOM', ({ host, mode, entryFee }) => {
      const room = roomManager.createPrivateRoom(host, mode, entryFee);
      socket.join(room.roomId);
      socket.emit('PRIVATE_ROOM_CREATED', room);
    });

    // Join Private Room
    socket.on('JOIN_PRIVATE_ROOM', ({ roomCode, player }) => {
      const result = roomManager.joinPrivateRoom(roomCode, player);
      if (result.success && result.room) {
        socket.join(result.room.roomId);
        socket.emit('PRIVATE_ROOM_JOINED', result.room);
      } else {
        socket.emit('ROOM_ERROR', result.message);
      }
    });

    // Start Private Room Game
    socket.on('START_PRIVATE_GAME', ({ roomCode }) => {
      const result = roomManager.startPrivateGame(roomCode);
      if (!result.success) {
        socket.emit('ROOM_ERROR', result.message);
      }
    });

    // Join Live Game Room
    socket.on('JOIN_GAME_ROOM', ({ roomId }) => {
      socket.join(roomId);
      const game = roomManager.getGame(roomId);
      if (game) {
        socket.emit('GAME_STATE_UPDATE', game.state);
      }
    });

    // Authoritative Dice Roll
    socket.on('ROLL_DICE', ({ roomId, playerId }) => {
      const game = roomManager.getGame(roomId);
      if (game) {
        game.rollDice(playerId);
      }
    });

    // Authoritative Token Move
    socket.on('MOVE_TOKEN', ({ roomId, playerId, tokenId }) => {
      const game = roomManager.getGame(roomId);
      if (game) {
        game.moveToken(playerId, tokenId);
      }
    });

    // Quick In-game Emoji Reaction
    socket.on('SEND_REACTION', ({ roomId, emoji, senderName }) => {
      io.to(roomId).emit('EMOJI_REACTION', { emoji, senderName });
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(socket.id);
      io.emit('ONLINE_COUNT_UPDATE', Math.max(142, onlineUsers.size + 140));
    });
  });
}

