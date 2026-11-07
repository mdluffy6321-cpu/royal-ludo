import { Player, TokenPiece, LudoColor } from './types.js';
import { getGlobalPerimeterPosition, isCellSafe, MAX_STEPS } from './LudoBoardMap.js';

export class LudoBot {
  /**
   * Intelligently selects the best token to move given valid token candidates
   */
  public static selectBestToken(
    botPlayer: Player,
    validTokens: TokenPiece[],
    allPlayers: Player[],
    diceRoll: number
  ): TokenPiece {
    if (validTokens.length === 1) {
      return validTokens[0];
    }

    // 1. Can we reach Home (step 57)? Immediate top priority!
    const homeReachingToken = validTokens.find(t => t.stepCount + diceRoll === MAX_STEPS);
    if (homeReachingToken) return homeReachingToken;

    // 2. Can we capture an opponent? High priority!
    for (const token of validTokens) {
      const nextStep = token.isYard ? 0 : token.stepCount + diceRoll;
      const nextGlobalPos = getGlobalPerimeterPosition(botPlayer.color, nextStep);

      if (nextGlobalPos !== null && !isCellSafe(nextGlobalPos)) {
        // Check if any opponent is sitting at nextGlobalPos
        for (const opp of allPlayers) {
          if (opp.color === botPlayer.color) continue;
          const oppToken = opp.tokens.find(ot => !ot.isYard && !ot.isHome && ot.position === nextGlobalPos);
          if (oppToken) {
            return token; // Capture!
          }
        }
      }
    }

    // 3. If we rolled a 6 and have tokens in yard, release one!
    if (diceRoll === 6) {
      const yardToken = validTokens.find(t => t.isYard);
      if (yardToken) return yardToken;
    }

    // 4. Prefer moving the token that is furthest advanced without overshooting
    const sortedTokens = [...validTokens].sort((a, b) => b.stepCount - a.stepCount);
    return sortedTokens[0];
  }
}

