import { Router } from 'express';
import { db } from '../db/database.js';

export const leaderboardRouter = Router();

leaderboardRouter.get('/', (req, res) => {
  const timeframe = req.query.timeframe || 'weekly';

  const rows = db.prepare(`
    SELECT id, username, playerTag, avatar, totalMatches, wins, winRate, winCoins
    FROM users
    WHERE status = 'active'
    ORDER BY wins DESC, winCoins DESC
    LIMIT 20
  `).all() as any[];

  const leaderboard = rows.map((r, idx) => ({
    rank: idx + 1,
    userId: r.id,
    username: r.username,
    playerTag: r.playerTag,
    avatar: r.avatar,
    matchesPlayed: r.totalMatches,
    wins: r.wins,
    winRate: r.winRate,
    coinsWon: r.winCoins,
  }));

  res.json({ success: true, leaderboard });
});

