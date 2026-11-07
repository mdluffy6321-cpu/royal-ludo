import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'royal_ludo.db');
export const db = new Database(dbPath);

// Enable Write-Ahead Logging (WAL) for superior concurrency and reliability
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      phone TEXT UNIQUE,
      username TEXT NOT NULL,
      playerTag TEXT UNIQUE NOT NULL,
      avatar TEXT NOT NULL DEFAULT '👑',
      referralCode TEXT UNIQUE NOT NULL,
      referredBy TEXT,
      coins INTEGER NOT NULL DEFAULT 2000,
      bonusCoins INTEGER NOT NULL DEFAULT 500,
      winCoins INTEGER NOT NULL DEFAULT 0,
      totalMatches INTEGER NOT NULL DEFAULT 0,
      wins INTEGER NOT NULL DEFAULT 0,
      losses INTEGER NOT NULL DEFAULT 0,
      winRate REAL NOT NULL DEFAULT 0.0,
      role TEXT NOT NULL DEFAULT 'player',
      status TEXT NOT NULL DEFAULT 'active',
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      roomCode TEXT NOT NULL,
      mode TEXT NOT NULL,
      entryFee INTEGER NOT NULL,
      prizePool INTEGER NOT NULL,
      winnerId TEXT,
      status TEXT NOT NULL,
      startedAt TEXT NOT NULL,
      endedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS match_participants (
      id TEXT PRIMARY KEY,
      matchId TEXT NOT NULL,
      userId TEXT NOT NULL,
      color TEXT NOT NULL,
      tokensHome INTEGER NOT NULL DEFAULT 0,
      rank INTEGER,
      FOREIGN KEY (matchId) REFERENCES matches(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      type TEXT NOT NULL,
      amount INTEGER NOT NULL,
      balanceAfter INTEGER NOT NULL,
      description TEXT NOT NULL,
      referenceId TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS tournaments (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      banner TEXT,
      entryFee INTEGER NOT NULL,
      prizePool INTEGER NOT NULL,
      maxParticipants INTEGER NOT NULL,
      currentParticipants INTEGER NOT NULL DEFAULT 0,
      startTime TEXT NOT NULL,
      status TEXT NOT NULL,
      winnerId TEXT
    );
  `);

  // Seed initial demo users if not present
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM users');
  const result = countStmt.get() as { count: number };
  if (result.count === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (id, phone, username, playerTag, avatar, referralCode, referredBy, coins, bonusCoins, winCoins, totalMatches, wins, losses, winRate, role, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run('user_king_1', '9876543210', 'King_Maharaja', '#RL-10001', '👑', 'ROYAL814', null, 5000, 1200, 3800, 48, 36, 12, 75.0, 'admin', 'active', '2024-01-10T10:00:00.000Z');
    insertUser.run('user_queen_2', '9876543211', 'Queen_Maharani', '#RL-10002', '👸', 'QUEEN288', 'ROYAL814', 3500, 800, 2700, 35, 24, 11, 68.5, 'player', 'active', '2024-02-15T12:00:00.000Z');
    insertUser.run('user_knight_3', '9876543212', 'Knight_Vikram', '#RL-10003', '⚔️', 'KNIGHT99', 'ROYAL814', 2200, 400, 1800, 22, 14, 8, 63.6, 'player', 'active', '2024-03-01T14:00:00.000Z');
    insertUser.run('user_bishop_4', '9876543213', 'Master_Arjun', '#RL-10004', '🏹', 'ARJUN777', null, 1500, 500, 1000, 18, 9, 9, 50.0, 'player', 'active', '2024-03-12T16:00:00.000Z');

    console.log('✅ SQLite persistent database initialized and seeded with 4 royal demo accounts!');
  }
}

