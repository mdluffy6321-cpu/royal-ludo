import { Router } from 'express';
import { db } from '../db/database.js';

export const authRouter = Router();

// Verify OTP / Quick Login
authRouter.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone number required' });
  }

  // Find user or register
  const selectStmt = db.prepare('SELECT * FROM users WHERE phone = ?');
  let user = selectStmt.get(phone) as any;

  if (!user) {
    // Auto-create user
    const id = `user_${Date.now()}`;
    const playerTag = `#RL-${Math.floor(10000 + Math.random() * 90000)}`;
    const referralCode = `ROYAL${Math.floor(1000 + Math.random() * 9000)}`;
    const username = `Player_${phone.slice(-4)}`;

    const insertStmt = db.prepare(`
      INSERT INTO users (id, phone, username, playerTag, avatar, referralCode, coins, bonusCoins, winCoins, totalMatches, wins, losses, winRate, role, status, createdAt)
      VALUES (?, ?, ?, ?, '👑', ?, 2000, 500, 1500, 0, 0, 0, 0.0, 'player', 'active', ?)
    `);

    insertStmt.run(id, phone, username, playerTag, referralCode, new Date().toISOString());
    user = selectStmt.get(phone);
  }

  res.json({
    success: true,
    token: `token_${user.id}`,
    user,
  });
});

// Register with Referral
authRouter.post('/register', (req, res) => {
  const { phone, username, referralCode } = req.body;
  if (!phone || !username) {
    return res.status(400).json({ success: false, message: 'Phone and username required' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
  if (existing) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  const id = `user_${Date.now()}`;
  const playerTag = `#RL-${Math.floor(10000 + Math.random() * 90000)}`;
  const myReferralCode = `ROYAL${Math.floor(1000 + Math.random() * 9000)}`;
  const welcomeCoins = referralCode ? 2500 : 2000;
  const bonusCoins = referralCode ? 1000 : 500;

  const insertStmt = db.prepare(`
    INSERT INTO users (id, phone, username, playerTag, avatar, referralCode, referredBy, coins, bonusCoins, winCoins, totalMatches, wins, losses, winRate, role, status, createdAt)
    VALUES (?, ?, ?, ?, '👑', ?, ?, ?, ?, 0, 0, 0, 0, 0.0, 'player', 'active', ?)
  `);

  insertStmt.run(id, phone, username, playerTag, myReferralCode, referralCode || null, welcomeCoins, bonusCoins, new Date().toISOString());

  // Record welcome bonus transaction
  const insertTx = db.prepare(`
    INSERT INTO transactions (id, userId, type, amount, balanceAfter, description, createdAt)
    VALUES (?, ?, 'bonus', ?, ?, 'Welcome Bonus & Referral Credit', ?)
  `);
  insertTx.run(`tx_${Date.now()}`, id, welcomeCoins, welcomeCoins, new Date().toISOString());

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

  res.json({
    success: true,
    token: `token_${id}`,
    user,
  });
});

// Get User Profile
authRouter.get('/profile/:userId', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, user });
});

// Update User Profile
authRouter.post('/update-profile', (req, res) => {
  const { userId, username, avatar } = req.body;
  const updateStmt = db.prepare(`
    UPDATE users SET username = COALESCE(?, username), avatar = COALESCE(?, avatar)
    WHERE id = ?
  `);
  updateStmt.run(username || null, avatar || null, userId);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  res.json({ success: true, user });
});

