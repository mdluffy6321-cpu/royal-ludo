export type LudoColor = 'red' | 'green' | 'yellow' | 'blue';

export type GameMode = '1v1' | 'classic4p' | 'private' | 'ai';

export type GameStatus = 'waiting' | 'in_progress' | 'completed' | 'abandoned';

export interface TokenPiece {
  id: string;          // e.g. 'red_0', 'green_2'
  color: LudoColor;
  index: number;       // 0, 1, 2, 3
  stepCount: number;   // -1 = in yard, 0 = start position, 51 = before home path, 52-56 = home path, 57 = Home reached!
  position: number;    // Global cell index on perimeter (0..51) or special offset
  isYard: boolean;
  isHome: boolean;
  isSafe: boolean;
}

export interface Player {
  id: string;
  socketId?: string;
  username: string;
  playerTag: string;
  avatar: string;
  color: LudoColor;
  isReady: boolean;
  isBot: boolean;
  isOnline: boolean;
  tokens: TokenPiece[];
  tokensHome: number;
  rank?: number;
  timeouts: number;
}

export interface GameRoomState {
  roomId: string;
  roomCode: string;
  mode: GameMode;
  entryFee: number;
  prizePool: number;
  status: GameStatus;
  maxPlayers: number;
  players: Player[];
  currentTurnColor: LudoColor;
  diceValue: number | null;
  diceRolling: boolean;
  turnTimeout: number; // seconds left
  consecutiveSixes: number;
  validTokenIds: string[];
  winner: Player | null;
  createdAt: number;
  spectatorsCount: number;
  lastActivity: number;
}

