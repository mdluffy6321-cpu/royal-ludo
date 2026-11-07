# 👑 ROYAL LUDO — Professional Online Multiplayer Gaming Platform

A production-quality, real-time multiplayer online Ludo gaming platform with full server-authoritative game physics, interactive 15×15 SVG board engine, open challenge battle arena (inspired by ApnaAddaa and GFLudo), tournament brackets, virtual passbook, and role-guarded super-admin dashboard.

---

## 🌟 Key Architecture & Highlights

1. **Authoritative Game Engine (Zero Client Trust)**
   - All RNG dice rolls (1..6) and token validations execute authoritatively on the Node.js / Socket.IO server.
   - Traditional standard rules implemented:
     - **6** required to release tokens from the Yard.
     - **8 Safe Star cells** on the 52-step perimeter track.
     - **Token Captures:** Capturing opponent tokens sends them back to their yard and grants a **Bonus Roll**.
     - **Bonus Rolls:** Rolling a 6, capturing an opponent, or landing a token Home awards another roll.
     - **Penalty:** 3 consecutive 6s automatically forfeits the turn.
     - **Exact Roll:** Exact number required to enter the center Home slot.
     - **15-Second Turn Timer:** Circular countdown with audio ticks and smart Bot auto-play fallback.

2. **Battle Arena (Open Challenge Board)**
   - Direct inspiration from the **ApnaAddaa** & **GFLudo** battle models.
   - Players create challenges with preset virtual coin stakes (🪙 50, 100, 250, 500, 1000).
   - Live challenge board allows any online warrior to click **"Accept Challenge"** to instantly enter a live match with escrow locking.

3. **Multiplayer Game Modes**
   - **1v1 Quick Duel:** High-speed 2-player battle. First token home claims the escrow prize pool!
   - **Classic Royal 4P:** Traditional 4-player Ludo with complete 4-token home run.
   - **Play with Friends (Private Room):** Generates 6-character room codes (e.g. `RL8921`) and direct WhatsApp invite links with a pre-game waiting lobby.
   - **Practice vs AI:** Free single-player mode against an intelligent heuristic bot.

4. **100% Compliant Demonstration Economy**
   - Virtual coins are **strictly demonstration points** with no real-money wagering, deposits, or fiat conversions.
   - Features Daily Lucky Spin Wheel (10 to 1,000 coins) and a 7-Day Login Streak progressive reward system.
   - Full Passbook ledger with filterable credit and debit transaction history.

5. **Super-Admin Backoffice (`/admin`)**
   - Role-based authorization protecting administrative routes.
   - Platform KPIs: Total users, active matches, completion rate, virtual coin circulation.
   - User Management: Search players by phone/tag, grant demo coins, and suspend/activate accounts.
   - System Broadcast: Global alert banner for all connected players.

6. **Procedural Web Audio Engine**
   - Procedural Web Audio API synthesizer for dice rattling, token stepping, captures, and victory fanfares.
   - Zero external audio files required — 100% reliable across all modern browsers with an instant mute/unmute toggle.

---

## 🚀 Quick Start & Running the Platform

### Option A: Single-Command Production Mode (Recommended)
This runs the full-stack server and serves the compiled frontend on **port 3001**:
```bash
# 1. Build frontend bundle (already completed)
npm run build

# 2. Start the full-stack server
npm start
```
Then open your browser at:
👉 **`http://localhost:3001`**

---

### Option B: Development Mode (Hot Reload)
To run Vite with hot-module reloading and the backend concurrently:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API & WebSockets: `http://localhost:3001`

---

## 👥 Instant Multi-Account Testing Guide

To test real-time multiplayer across multiple accounts on a single machine:

1. Open **`http://localhost:3001`** in your browser.
2. Notice the **Testing Bar** at the top of the page.
3. Click **"Open 2nd Window"** or open an Incognito window.
4. In Window 1, keep active as **King Raja** (Player 1).
5. In Window 2, click **"Queen"** on the Testing Bar to switch to **Queen Maharani** (Player 2).
6. In Window 1, click **"Set Battle"** in the Battle Arena (e.g. 100 Coins).
7. In Window 2, you will immediately see the challenge appear live. Click **"Accept Challenge"**.
8. Both windows will instantly load into the live authoritative game room. Roll the dice and watch moves synchronize in real-time!

---

## 📁 Repository Directory Structure

```
LUDO ARENA/
├── package.json               # Dependencies and scripts
├── vite.config.ts             # Vite configuration with WebSocket proxy
├── tailwind.config.js         # Royal gaming theme colors & glassmorphism
├── server/                    # Backend Node.js / Express / Socket.IO
│   ├── index.ts               # Server entry point & static file server
│   ├── db/
│   │   └── database.ts        # SQLite persistent database with WAL mode
│   ├── engine/                # Authoritative Game Engine
│   │   ├── LudoGame.ts        # Turn state machine, rules, timer, victory
│   │   ├── LudoBoardMap.ts    # 52 perimeter steps, 8 safe stars, home tracks
│   │   ├── LudoBot.ts         # Heuristic AI bot
│   │   └── types.ts           # Game types & interfaces
│   ├── rooms/
│   │   └── RoomManager.ts     # Matchmaking queue, challenges, private codes
│   ├── sockets/
│   │   └── gameHandler.ts     # Socket.IO events (ROLL_DICE, MOVE_TOKEN, etc.)
│   └── routes/                # REST API endpoints (Auth, Wallet, Admin, etc.)
└── src/                       # Frontend React 18 + TypeScript + Tailwind
    ├── App.tsx                # Master router and screen coordinator
    ├── components/
    │   ├── navbar/            # Top Navbar, Coin Chip & Mobile Bottom Nav
    │   ├── game/              # 15x15 SVG Board, 3D Tumbling Dice, Player HUD
    │   ├── dashboard/         # Battle Feed, Set Battle Modal, Spin Wheel
    │   └── common/            # Demo Multi-Account Switcher Bar
    ├── context/               # Auth, Socket.IO & Procedural Audio Contexts
    ├── pages/                 # Dashboard, Game, Lobby, Wallet, Tournaments, etc.
    └── utils/                 # Audio synthesizer & coordinate calculators
```

---

## 🛡️ Fair Play & Compliance Note
*Royal Ludo is strictly an entertainment and skill-based demonstration gaming platform. No real money wagering, deposits, or withdrawals are supported or enabled.*

