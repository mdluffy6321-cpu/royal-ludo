export type LudoColor = 'red' | 'green' | 'yellow' | 'blue';

export type GameMode = '1v1' | 'classic4p' | 'private' | 'ai';

export type GameStatus = 'waiting' | 'in_progress' | 'completed' | 'abandoned';

export interface User {
  id: string;
  phone: string;
  username: string;
  playerTag: string; // e.g. #RL-84920
  avatar: string;
  referralCode: string;
  referredBy?: string;
  coins: number;        // Available non-monetary virtual balance
  bonusCoins: number;   // Daily and quest virtual coins
  winCoins: number;     // Coins earned from victories
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;      // %
  role: 'player' | 'admin';
  createdAt: string;
  status: 'active' | 'suspended';
}

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
  username: string;
  playerTag: string;
  avatar: string;
  color: LudoColor;
  isReady: boolean;
  isBot: boolean;
  isOnline: boolean;
  tokens: TokenPiece[];
  tokensHome: number;
  rank?: number;       // 1st, 2nd, 3rd, 4th
  timeouts?: number;
}

export interface GameRoom {
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
  turnTimeout: number; // seconds left (e.g. 15)
  consecutiveSixes: number;
  validTokenIds: string[];
  winner: Player | null;
  createdAt: number;
  spectatorsCount: number;
}

export type GameRoomState = GameRoom;

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

export interface CoinTransaction {
  id: string;
  userId: string;
  type: 'bonus' | 'spin_reward' | 'match_entry' | 'match_win' | 'referral_bonus' | 'admin_grant';
  amount: number;      // positive for credit, negative for debit
  balanceAfter: number;
  description: string;
  referenceId?: string;
  createdAt: string;
}

export interface Tournament {
  id: string;
  title: string;
  banner: string;
  entryFee: number;
  prizePool: number;
  maxParticipants: number;
  currentParticipants: number;
  startTime: string;
  status: 'upcoming' | 'registration_open' | 'live' | 'finished';
  rounds: TournamentRound[];
  winner?: {
    userId: string;
    username: string;
    avatar: string;
  };
}

export interface TournamentRound {
  roundNumber: number;
  name: string; // 'Quarterfinals' | 'Semifinals' | 'Grand Finals'
  matches: {
    matchId: string;
    player1?: string;
    player2?: string;
    winner?: string;
  }[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  playerTag: string;
  matchesPlayed: number;
  wins: number;
  winRate: number;
  coinsWon: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'match' | 'reward' | 'tournament' | 'system' | 'social';
  link?: string;
  read: boolean;
  createdAt: string;
}
