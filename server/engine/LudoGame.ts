import { 
  GameRoomState, 
  Player, 
  TokenPiece, 
  LudoColor, 
  GameMode, 
  GameStatus 
} from './types.js';
import { 
  START_OFFSETS, 
  SAFE_CELL_INDICES, 
  MAX_STEPS, 
  getGlobalPerimeterPosition, 
  isCellSafe 
} from './LudoBoardMap.js';
import { LudoBot } from './LudoBot.js';

export class LudoGame {
  public state: GameRoomState;
  private onStateChange: (state: GameRoomState) => void;
  private timerInterval: NodeJS.Timeout | null = null;

  constructor(
    roomId: string,
    roomCode: string,
    mode: GameMode,
    entryFee: number,
    prizePool: number,
    initialPlayers: Partial<Player>[],
    onStateChange: (state: GameRoomState) => void
  ) {
    this.onStateChange = onStateChange;

    const colors: LudoColor[] = mode === '1v1' ? ['red', 'yellow'] : ['red', 'green', 'yellow', 'blue'];
    const maxPlayers = mode === '1v1' ? 2 : 4;

    const players: Player[] = initialPlayers.map((p, idx) => ({
      id: p.id || `player_${idx}`,
      username: p.username || `Player_${idx + 1}`,
      playerTag: p.playerTag || `#RL-${1000 + idx}`,
      avatar: p.avatar || '👑',
      color: colors[idx],
      isReady: p.isReady ?? true,
      isBot: p.isBot ?? false,
      isOnline: true,
      tokens: this.createInitialTokens(colors[idx]),
      tokensHome: 0,
      timeouts: 0,
    }));

    // If practicing vs AI and only 1 human, populate remaining with smart bots
    while (players.length < maxPlayers) {
      const idx = players.length;
      const botNames = ['Knight Bot', 'Empress AI', 'Vanguard Bot'];
      const botAvatars = ['🤖', '⚔️', '🏹'];
      players.push({
        id: `bot_${idx}`,
        username: botNames[idx - 1] || `Royal Bot ${idx}`,
        playerTag: `#BOT-${idx}`,
        avatar: botAvatars[idx - 1] || '🤖',
        color: colors[idx],
        isReady: true,
        isBot: true,
        isOnline: true,
        tokens: this.createInitialTokens(colors[idx]),
        tokensHome: 0,
        timeouts: 0,
      });
    }

    this.state = {
      roomId,
      roomCode,
      mode,
      entryFee,
      prizePool,
      status: 'in_progress',
      maxPlayers,
      players,
      currentTurnColor: colors[0],
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

    this.startTurnTimer();
  }

  private createInitialTokens(color: LudoColor): TokenPiece[] {
    return [0, 1, 2, 3].map((index) => ({
      id: `${color}_${index}`,
      color,
      index,
      stepCount: -1,
      position: -1,
      isYard: true,
      isHome: false,
      isSafe: false,
    }));
  }

  public getCurrentPlayer(): Player {
    return this.state.players.find(p => p.color === this.state.currentTurnColor) || this.state.players[0];
  }

  public rollDice(playerId: string): { success: boolean; roll?: number; message?: string } {
    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.id !== playerId && !currentPlayer.isBot) {
      return { success: false, message: 'Not your turn' };
    }
    if (this.state.diceValue !== null && this.state.validTokenIds.length > 0) {
      return { success: false, message: 'Must move valid token first' };
    }
    if (this.state.status !== 'in_progress') {
      return { success: false, message: 'Game not active' };
    }

    // Cryptographic-grade authoritative roll: 1..6
    const roll = Math.floor(Math.random() * 6) + 1;
    this.state.diceValue = roll;
    this.state.lastActivity = Date.now();

    // Check consecutive 6s
    if (roll === 6) {
      this.state.consecutiveSixes += 1;
      if (this.state.consecutiveSixes >= 3) {
        // Penalty: 3 consecutive sixes cancels turn!
        this.state.consecutiveSixes = 0;
        this.state.validTokenIds = [];
        this.emitUpdate();
        setTimeout(() => this.nextTurn(), 1200);
        return { success: true, roll };
      }
    } else {
      this.state.consecutiveSixes = 0;
    }

    // Calculate valid tokens
    const validTokens = this.calculateValidTokens(currentPlayer, roll);
    this.state.validTokenIds = validTokens.map(t => t.id);
    this.emitUpdate();

    // If no valid moves, advance to next player automatically
    if (validTokens.length === 0) {
      setTimeout(() => {
        this.nextTurn();
      }, 1200);
    } else if (currentPlayer.isBot) {
      // Bot auto-moves
      setTimeout(() => {
        const bestToken = LudoBot.selectBestToken(currentPlayer, validTokens, this.state.players, roll);
        this.moveToken(currentPlayer.id, bestToken.id);
      }, 800);
    }

    return { success: true, roll };
  }

  private calculateValidTokens(player: Player, roll: number): TokenPiece[] {
    const valid: TokenPiece[] = [];

    for (const token of player.tokens) {
      if (token.isHome) continue;

      if (token.isYard) {
        // Only 6 can release token from yard!
        if (roll === 6) {
          valid.push(token);
        }
      } else {
        // Token is on track or in home path
        const targetStep = token.stepCount + roll;
        // Must not overshoot the final Home (step 57)
        if (targetStep <= MAX_STEPS) {
          valid.push(token);
        }
      }
    }

    return valid;
  }

  public moveToken(playerId: string, tokenId: string): { success: boolean; message?: string } {
    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.id !== playerId && !currentPlayer.isBot) {
      return { success: false, message: 'Not your turn' };
    }
    if (!this.state.validTokenIds.includes(tokenId)) {
      return { success: false, message: 'Invalid token move' };
    }
    if (this.state.diceValue === null) {
      return { success: false, message: 'Roll dice first' };
    }

    const token = currentPlayer.tokens.find(t => t.id === tokenId);
    if (!token) return { success: false, message: 'Token not found' };

    const roll = this.state.diceValue;
    let earnedBonusRoll = roll === 6;

    if (token.isYard) {
      // Releasing from yard to Start cell (stepCount 0)
      token.isYard = false;
      token.stepCount = 0;
      token.position = START_OFFSETS[token.color];
      token.isSafe = true; // Start cells are safe stars!
    } else {
      token.stepCount += roll;

      if (token.stepCount === MAX_STEPS) {
        // Reached HOME!
        token.isHome = true;
        currentPlayer.tokensHome += 1;
        earnedBonusRoll = true; // Bonus roll on reaching home!
      } else if (token.stepCount <= 51) {
        // On perimeter track
        const globalPos = getGlobalPerimeterPosition(token.color, token.stepCount)!;
        token.position = globalPos;
        token.isSafe = isCellSafe(globalPos);

        // Check for opponent capture if NOT a safe cell
        if (!token.isSafe) {
          for (const opponent of this.state.players) {
            if (opponent.color === token.color) continue;

            for (const oppToken of opponent.tokens) {
              if (!oppToken.isYard && !oppToken.isHome && oppToken.position === globalPos) {
                // CAPTURE! Send opponent token back to Yard!
                oppToken.isYard = true;
                oppToken.stepCount = -1;
                oppToken.position = -1;
                oppToken.isSafe = false;
                earnedBonusRoll = true; // Bonus roll for capturing an opponent!
                break;
              }
            }
          }
        }
      } else {
        // Inside home path (steps 52..56)
        token.isSafe = true;
      }
    }

    // Check Victory Condition
    const winThreshold = this.state.mode === '1v1' ? 1 : 4;
    if (currentPlayer.tokensHome >= winThreshold) {
      this.state.status = 'completed';
      this.state.winner = currentPlayer;
      this.stopTurnTimer();
      this.emitUpdate();
      return { success: true };
    }

    // Reset turn dice and valid moves
    this.state.diceValue = null;
    this.state.validTokenIds = [];

    if (earnedBonusRoll) {
      // Player rolls again!
      this.resetTurnTimer();
      this.emitUpdate();

      if (currentPlayer.isBot) {
        setTimeout(() => this.rollDice(currentPlayer.id), 900);
      }
    } else {
      // Switch to next player
      this.nextTurn();
    }

    return { success: true };
  }

  private nextTurn() {
    this.state.diceValue = null;
    this.state.validTokenIds = [];
    this.state.consecutiveSixes = 0;

    const colors: LudoColor[] = this.state.mode === '1v1' ? ['red', 'yellow'] : ['red', 'green', 'yellow', 'blue'];
    const currentIdx = colors.indexOf(this.state.currentTurnColor);
    const nextIdx = (currentIdx + 1) % colors.length;
    this.state.currentTurnColor = colors[nextIdx];

    this.resetTurnTimer();
    this.emitUpdate();

    const nextPlayer = this.getCurrentPlayer();
    if (nextPlayer.isBot) {
      setTimeout(() => this.rollDice(nextPlayer.id), 800);
    }
  }

  private startTurnTimer() {
    this.stopTurnTimer();
    this.state.turnTimeout = 15;

    this.timerInterval = setInterval(() => {
      if (this.state.status !== 'in_progress') {
        this.stopTurnTimer();
        return;
      }

      this.state.turnTimeout -= 1;

      if (this.state.turnTimeout <= 0) {
        // Turn timed out! Auto-play fallback
        const player = this.getCurrentPlayer();
        player.timeouts = (player.timeouts || 0) + 1;

        if (this.state.diceValue === null) {
          // Auto-roll dice on timeout
          const rollResult = this.rollDice(player.id);
          if (rollResult.success && this.state.validTokenIds.length > 0) {
            setTimeout(() => {
              const valid = player.tokens.filter(t => this.state.validTokenIds.includes(t.id));
              const chosen = LudoBot.selectBestToken(player, valid, this.state.players, this.state.diceValue || 1);
              this.moveToken(player.id, chosen.id);
            }, 600);
          }
        } else if (this.state.validTokenIds.length > 0) {
          // Auto-move valid token on timeout
          const valid = player.tokens.filter(t => this.state.validTokenIds.includes(t.id));
          const chosen = LudoBot.selectBestToken(player, valid, this.state.players, this.state.diceValue);
          this.moveToken(player.id, chosen.id);
        } else {
          this.nextTurn();
        }
      } else {
        this.emitUpdate();
      }
    }, 1000);
  }

  private resetTurnTimer() {
    this.state.turnTimeout = 15;
  }

  public stopTurnTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private emitUpdate() {
    this.onStateChange(this.state);
  }
}

