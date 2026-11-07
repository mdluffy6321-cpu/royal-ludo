import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db/database.js';
import { RoomManager } from './rooms/RoomManager.js';
import { registerSocketHandlers } from './sockets/gameHandler.js';
import { authRouter } from './routes/authRoutes.js';
import { walletRouter } from './routes/walletRoutes.js';
import { leaderboardRouter } from './routes/leaderboardRoutes.js';
import { tournamentRouter } from './routes/tournamentRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize Persistent Database
initDatabase();

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Initialize Room & Game Matchmaker
const roomManager = new RoomManager(io);

// Register Socket.IO Event Handlers
registerSocketHandlers(io, roomManager);

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/tournaments', tournamentRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Royal Ludo Gaming Platform',
    timestamp: new Date().toISOString(),
    openBattles: roomManager.getOpenBattles().length,
  });
});

// Serve frontend static files if built
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}


server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`👑 ROYAL LUDO GAMING PLATFORM SERVER RUNNING`);
  console.log(`🚀 Port: http://localhost:${PORT}`);
  console.log(`🎲 Authoritative Engine: Online & Ready`);
  console.log(`==================================================\n`);
});
