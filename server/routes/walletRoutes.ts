import { Router } from 'express';
import { db } from '../db/database.js';

export const walletRouter = Router();

// Get Passbook Ledger
walletRouter.get('/transactions/:userId', (req, res) => {
  const { userId } = req.params;
  const transactions = db.prepare(`
    SELECT * FROM transactions WHERE userId = ? ORDER BY createdAt DESC LIMIT 50
  `).all(userId);

  res.json({ success: true, transactions });
});

// Claim Daily Spin Reward
walletRouter.post('/claim-spin', (req, res) => {
  const { userId, rewardCoins } = req.body;
  if (!userId || !rewardCoins) {
    return res.status(400).json({ success: false, message: 'Invalid payload' });
  }

  db.prepare(`
    UPDATE users SET coins = coins + ?, bonusCoins = bonusCoins + ? WHERE id = ?
  `).run(rewardCoins, rewardCoins, userId);

  const txId = `tx_${Date.now()}`;
  db.prepare(`
    INSERT INTO transactions (id, userId, type, amount, balanceAfter, description, createdAt)
    VALUES (?, ?, 'spin_reward', ?, (SELECT coins FROM users WHERE id = ?), 'Lucky Wheel Daily Spin Reward', ?)
  `).run(txId, userId, rewardCoins, userId, new Date().toISOString());

  const user = db.prepare('SELECT coins, bonusCoins, winCoins FROM users WHERE id = ?').get(userId);
  res.json({ success: true, coins: (user as any)?.coins });
});

