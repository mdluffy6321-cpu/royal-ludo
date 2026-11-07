import { Server } from 'socket.io';
import { LudoGame } from '../engine/LudoGame.js';
import { GameMode, GameRoomState, Player } from '../engine/types.js';
import { db } from '../db/database.js';

export interface BattleChallenge {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorTag: string;
  entryFee: number;
  prizePool: number;
  mode: GameMode;
  status: 'open' | 'accepted' | 'playing' | 'completed';
  opponentId?: string;
  opponentName?: string;
  opponentAvatar?: string;
  roomId?: string;
  createdAt: string;
}

export class RoomManager {
  private io: Server;
  public games: Map<string, LudoGame> = new Map();
  public battles: Map<string, BattleChallenge> = new Map();
  public privateRooms: Map<string, {
    roomId: string;
    roomCode: string;
    hostId: string;
    mode: GameMode;
    entryFee: number;
    prizePool: number;
    players: Partial<Player>[];
    status: 'lobby' | 'playing' | 'completed';
  }> = new Map();

  constructor(io: Server) {
    this.io = io;
    this.seedInitialBattles();
  }

  private seedInitialBattles() {
    // Add two initial friendly arena challenges so the lobby is lively right away
    const initial1: BattleChallenge = {
      id: 'battle_seed_1',
      creatorId: 'user_queen_2',
      creatorName: 'Queen_Maharani',
      creatorAvatar: '👸',
      creatorTag: '#RL-10002',
      entryFee: 100,
      prizePool: 190,
      mode: '1v1',
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    const initial2: BattleChallenge = {
      id: 'battle_seed_2',
      creatorId: 'user_knight_3',
      creatorName: 'Knight_Vikram',
      creatorAvatar: '⚔️',
      creatorTag: '#RL-10003',
      entryFee: 250,
      prizePool: 475,
      mode: '1v1',
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    this.battles.set(initial1.id, initial1);
    this.battles.set(initial2.id, initial2);
  }

  public getOpenBattles(): BattleChallenge[] {
    return Array.from(this.battles.values()).filter(b => b.status === 'open');
  }

  public createBattle(battle: BattleChallenge): BattleChallenge {
    this.battles.set(battle.id, battle);
    this.io.emit('BATTLES_UPDATED', this.getOpenBattles());
    return battle;
  }

  public cancelBattle(battleId: string, userId: string): boolean {
    const battle = this.battles.get(battleId);
    if (battle && battle.creatorId === userId && battle.status === 'open') {
      this.battles.delete(battleId);
      this.io.emit('BATTLES_UPDATED', this.getOpenBattles());
      return true;
    }
    return false;
  }

  public acceptBattle(battleId: string, opponent: { id: string; username: string; avatar: string; playerTag: string }): { roomId: string; roomCode: string } | null {
    const battle = this.battles.get(battleId);
    if (!battle || battle.status !== 'open') return null;

    battle.status = 'playing';
    battle.opponentId = opponent.id;
    battle.opponentName = opponent.username;
    battle.opponentAvatar = opponent.avatar;

    const roomId = `room_${battle.id}`;
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    battle.roomId = roomId;

    // Initialize Authoritative Game
    const game = new LudoGame(
      roomId,
      roomCode,
      battle.mode,
      battle.entryFee,
      battle.prizePool,
      [
        { id: battle.creatorId, username: battle.creatorName, avatar: battle.creatorAvatar, playerTag: battle.creatorTag },
        { id: opponent.id, username: opponent.username, avatar: opponent.avatar, playerTag: opponent.playerTag },
      ],
      (state) => this.broadcastGameState(roomId, state)
    );

    this.games.set(roomId, game);
    this.battles.delete(battleId);
    this.io.emit('BATTLES_UPDATED', this.getOpenBattles());

    return { roomId, roomCode };
  }

  public createPrivateRoom(host: Partial<Player>, mode: GameMode = 'classic4p', entryFee: number = 0): { roomId: string; roomCode: string } {
    const roomId = `room_priv_${Date.now()}`;
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    this.privateRooms.set(roomCode, {
      roomId,
      roomCode,
      hostId: host.id || 'host',
      mode,
      entryFee,
      prizePool: entryFee * (mode === '1v1' ? 2 : 4),
      players: [{ ...host, isReady: true }],
      status: 'lobby',
    });

    return { roomId, roomCode };
  }

  public joinPrivateRoom(roomCode: string, player: Partial<Player>): { success: boolean; room?: any; message?: string } {
    const room = this.privateRooms.get(roomCode.toUpperCase());
    if (!room) return { success: false, message: 'Room code not found' };
    if (room.status !== 'lobby') return { success: false, message: 'Game already in progress' };

    const max = room.mode === '1v1' ? 2 : 4;
    if (room.players.length >= max) return { success: false, message: 'Room is full' };

    if (!room.players.find(p => p.id === player.id)) {
      room.players.push({ ...player, isReady: true });
    }

    this.io.to(room.roomId).emit('LOBBY_UPDATED', room);
    return { success: true, room };
  }

  public startPrivateGame(roomCode: string): { success: boolean; roomId?: string; message?: string } {
    const room = this.privateRooms.get(roomCode.toUpperCase());
    if (!room) return { success: false, message: 'Room not found' };

    room.status = 'playing';

    const game = new LudoGame(
      room.roomId,
      room.roomCode,
      room.mode,
      room.entryFee,
      room.prizePool,
      room.players,
      (state) => this.broadcastGameState(room.roomId, state)
    );

    this.games.set(room.roomId, game);
    this.io.to(room.roomId).emit('GAME_STARTED', { roomId: room.roomId, roomCode: room.roomCode });
    return { success: true, roomId: room.roomId };
  }

  public createAIGame(player: Partial<Player>, mode: GameMode = '1v1'): { roomId: string; roomCode: string } {
    const roomId = `room_ai_${Date.now()}`;
    const roomCode = 'SOLO_AI';

    const game = new LudoGame(
      roomId,
      roomCode,
      mode,
      0,
      100, // Fun practice prize!
      [player],
      (state) => this.broadcastGameState(roomId, state)
    );

    this.games.set(roomId, game);
    return { roomId, roomCode };
  }

  public getGame(roomId: string): LudoGame | undefined {
    return this.games.get(roomId);
  }

  private broadcastGameState(roomId: string, state: GameRoomState) {
    this.io.to(roomId).emit('GAME_STATE_UPDATE', state);

    if (state.status === 'completed' && state.winner) {
      this.settleMatchResult(state);
    }
  }

  private settleMatchResult(state: GameRoomState) {
    try {
      const winner = state.winner;
      if (!winner || winner.isBot) return;

      // Update winner balance and stats in persistent SQLite
      const updateUser = db.prepare(`
        UPDATE users
        SET coins = coins + ?,
            winCoins = winCoins + ?,
            totalMatches = totalMatches + 1,
            wins = wins + 1,
            winRate = ROUND(((wins + 1.0) / (totalMatches + 1.0)) * 100, 1)
        WHERE id = ?
      `);
      updateUser.run(state.prizePool, state.prizePool, winner.id);

      // Record transaction
      const insertTx = db.prepare(`
        INSERT INTO transactions (id, userId, type, amount, balanceAfter, description, referenceId, createdAt)
        VALUES (?, ?, 'match_win', ?, (SELECT coins FROM users WHERE id = ?), ?, ?, ?)
      `);
      insertTx.run(
        `tx_${Date.now()}`,
        winner.id,
        state.prizePool,
        winner.id,
        `Victory Prize - ${state.mode.toUpperCase()} Battle`,
        state.roomId,
        new Date().toISOString()
      );

      // Record match log
      const insertMatch = db.prepare(`
        INSERT INTO matches (id, roomCode, mode, entryFee, prizePool, winnerId, status, startedAt, endedAt)
        VALUES (?, ?, ?, ?, ?, ?, 'completed', ?, ?)
      `);
      insertMatch.run(
        state.roomId,
        state.roomCode,
        state.mode,
        state.entryFee,
        state.prizePool,
        winner.id,
        new Date(state.createdAt).toISOString(),
        new Date().toISOString()
      );

      console.log(`🏆 Match settled: Winner ${winner.username} awarded ${state.prizePool} virtual coins!`);
    } catch (err) {
      console.error('Error settling match result in DB:', err);
    }
  }
}

