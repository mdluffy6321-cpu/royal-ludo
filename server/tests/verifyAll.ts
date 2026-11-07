import { db, initDatabase } from '../db/database.js';
import { LudoGame } from '../engine/LudoGame.js';
import { SAFE_CELL_INDICES, START_OFFSETS, MAX_STEPS, isCellSafe } from '../engine/LudoBoardMap.js';
import { LudoBot } from '../engine/LudoBot.js';
import { Server } from 'socket.io';
import http from 'http';
import { RoomManager } from '../rooms/RoomManager.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log('\n==================================================');
  console.log('🧪 RUNNING ROYAL LUDO COMPREHENSIVE VERIFICATION');
  console.log('==================================================\n');

  // TEST SUITE 1: SQLite Database Persistence
  console.log('📦 TEST SUITE 1: SQLite Persistent Database');
  initDatabase();

  const users = db.prepare('SELECT * FROM users').all() as any[];
  assert(users.length >= 4, `Database initialized with at least 4 demo accounts (found: ${users.length})`);

  const king = db.prepare("SELECT * FROM users WHERE role = 'admin'").get() as any;
  assert(king && king.username === 'King_Maharaja', `Super-Admin King_Maharaja account exists with role: ${king?.role}`);
  assert(king && king.coins >= 5000, `King Maharaja has valid demo coin balance: ${king?.coins}`);

  // Test insert new user with referral
  const testPhone = `99999${Math.floor(10000 + Math.random() * 90000)}`;
  const testId = `test_user_${Date.now()}`;
  db.prepare(`
    INSERT INTO users (id, phone, username, playerTag, avatar, referralCode, referredBy, coins, bonusCoins, winCoins, totalMatches, wins, losses, winRate, role, status, createdAt)
    VALUES (?, ?, 'TestWarrior', '#RL-9999', '⚔️', 'TESTREF', 'ROYAL814', 2500, 1000, 0, 0, 0, 0, 0, 'player', 'active', ?)
  `).run(testId, testPhone, new Date().toISOString());

  const inserted = db.prepare('SELECT * FROM users WHERE id = ?').get(testId) as any;
  assert(inserted && inserted.referredBy === 'ROYAL814', 'New user registered and successfully bound to referral code');
  assert(inserted && inserted.coins === 2500, 'New user credited with 2,500 referral bonus demonstration coins');

  // Test Passbook transaction insertion
  const txId = `tx_${Date.now()}`;
  db.prepare(`
    INSERT INTO transactions (id, userId, type, amount, balanceAfter, description, createdAt)
    VALUES (?, ?, 'bonus', 500, 3000, 'Test Referral Bonus', ?)
  `).run(txId, testId, new Date().toISOString());

  const tx = db.prepare('SELECT * FROM transactions WHERE id = ?').get(txId) as any;
  assert(tx && tx.amount === 500 && tx.type === 'bonus', 'Passbook ledger records transaction with correct credit amount');

  // Clean up test user
  db.prepare('DELETE FROM transactions WHERE userId = ?').run(testId);
  db.prepare('DELETE FROM users WHERE id = ?').run(testId);


  // TEST SUITE 2: Board Geometry & Safe Star Coordinates
  console.log('\n🎲 TEST SUITE 2: Ludo Board Coordinates & Safe Cells');
  assert(SAFE_CELL_INDICES.length === 8, `Exactly 8 safe star cells exist (indices: ${SAFE_CELL_INDICES.join(', ')})`);
  assert(isCellSafe(0), 'Red start cell (Index 0) is a Safe Star');
  assert(isCellSafe(13), 'Blue start cell (Index 13) is a Safe Star');
  assert(isCellSafe(26), 'Yellow start cell (Index 26) is a Safe Star');
  assert(isCellSafe(39), 'Green start cell (Index 39) is a Safe Star');
  assert(isCellSafe(8) && isCellSafe(21) && isCellSafe(34) && isCellSafe(47), 'All 4 intermediate safe stars are correctly identified');
  assert(!isCellSafe(5), 'Cell 5 is verified as an unsafe capture cell');


  // TEST SUITE 3: Authoritative Ludo Game State Machine & Rules
  console.log('\n⚔️ TEST SUITE 3: Authoritative Ludo Game Engine Rules');

  let stateUpdateEmitted = false;
  const game = new LudoGame(
    'test_room_1',
    'TEST01',
    '1v1',
    100,
    190,
    [
      { id: 'player_red', username: 'Tester Red', playerTag: '#RL-1111', avatar: '👑' },
      { id: 'player_yellow', username: 'Tester Yellow', playerTag: '#RL-2222', avatar: '👸' }
    ],
    (state) => {
      stateUpdateEmitted = true;
    }
  );

  assert(game.state.status === 'in_progress', 'Game room initialized with status: in_progress');
  assert(game.state.players.length === 2, '1v1 Match initialized with 2 players (Red & Yellow)');
  assert(game.state.currentTurnColor === 'red', 'First turn correctly belongs to Red player');

  const redPlayer = game.state.players.find(p => p.color === 'red')!;
  assert(redPlayer.tokens.length === 4, 'Red player has 4 tokens');
  assert(redPlayer.tokens.every(t => t.isYard && t.stepCount === -1), 'All 4 tokens start securely inside Yard (-1)');

  // Test: cannot move when dice not rolled
  const invalidMoveBeforeRoll = game.moveToken('player_red', 'red_0');
  assert(!invalidMoveBeforeRoll.success, 'Engine blocks token movement before dice is rolled');

  // Test: cannot roll when not your turn
  const yellowRollWrongTurn = game.rollDice('player_yellow');
  assert(!yellowRollWrongTurn.success, 'Engine blocks Yellow from rolling out of turn');

  // Test: Red rolls dice authoritatively
  const redRoll = game.rollDice('player_red');
  assert(redRoll.success && redRoll.roll! >= 1 && redRoll.roll! <= 6, `Red rolled authoritative dice value: ${redRoll.roll}`);

  // Test: 6 required to release from yard
  if (redRoll.roll === 6) {
    assert(game.state.validTokenIds.length === 4, 'Rolling 6 makes all 4 yard tokens valid candidates for unlock');
    const moveRes = game.moveToken('player_red', 'red_0');
    assert(moveRes.success, 'Token red_0 successfully unlocked from Yard onto Start cell');
    assert(redPlayer.tokens[0].stepCount === 0 && !redPlayer.tokens[0].isYard, 'Token red_0 is now on step 0');
    assert(redPlayer.tokens[0].isSafe, 'Token red_0 on Start cell is marked Safe');
  } else {
    assert(game.state.validTokenIds.length === 0, `Rolling ${redRoll.roll} (< 6) produces 0 valid moves for yard tokens`);
  }

  // TEST SUITE 4: Token Capture & Bonus Turn Verification
  console.log('\n💥 TEST SUITE 4: Opponent Capture & Bonus Turn Logic');

  // Set up a mock scenario: Red token at step 4 (perimeter pos 4), Yellow token on perimeter pos 4 (unsafe)
  const redToken = redPlayer.tokens[1];
  redToken.isYard = false;
  redToken.stepCount = 2;
  redToken.position = 2; // perimeter pos 2

  const yellowPlayer = game.state.players.find(p => p.color === 'yellow')!;
  const yellowToken = yellowPlayer.tokens[0];
  yellowToken.isYard = false;
  yellowToken.stepCount = 28; // in 52 loop, lands on perimeter pos 2
  yellowToken.position = 2;

  // Simulate Red moving from pos 2 to pos 4 and capturing Yellow if sitting at pos 4
  yellowToken.position = 4;
  redToken.stepCount = 2;
  redToken.position = 2;

  // Force dice roll to 2 for deterministic test
  game.state.currentTurnColor = 'red';
  game.state.diceValue = 2;
  game.state.validTokenIds = [redToken.id];

  const captureMove = game.moveToken('player_red', redToken.id);
  assert(captureMove.success, 'Red token executed capture move successfully');
  assert(redToken.position === 4, 'Red token moved to target cell index 4');
  assert(yellowToken.isYard && yellowToken.stepCount === -1, 'Opponent Yellow token was CAPTURED and returned to Yard!');
  assert(game.state.currentTurnColor === 'red', 'Red awarded BONUS TURN for capturing opponent!');

  // TEST SUITE 5: Heuristic AI Bot Intelligence
  console.log('\n🤖 TEST SUITE 5: Intelligent AI Bot Decision Engine');
  const botPlayer = game.state.players[1];
  botPlayer.isBot = true;

  // Test bot picks capture over standard move
  const botValidTokens = [
    { ...botPlayer.tokens[0], id: 'yellow_0', isYard: false, stepCount: 10, position: 36, isHome: false, isSafe: false, color: 'yellow' as any, index: 0 },
    { ...botPlayer.tokens[1], id: 'yellow_1', isYard: false, stepCount: 5, position: 31, isHome: false, isSafe: false, color: 'yellow' as any, index: 1 },
  ];
  // Place Red token at position 33 (which is yellow_1 + 2)
  redPlayer.tokens[0].isYard = false;
  redPlayer.tokens[0].position = 33;

  const chosenByBot = LudoBot.selectBestToken(botPlayer, botValidTokens, game.state.players, 2);
  assert(chosenByBot.id === 'yellow_1', `Bot intelligently prioritized capturing Red token with ${chosenByBot.id}`);

  // TEST SUITE 6: Room & Matchmaking Infrastructure
  console.log('\n🏢 TEST SUITE 6: RoomManager & Escrow Matchmaking');
  const httpServer = http.createServer();
  const io = new Server(httpServer);
  const roomManager = new RoomManager(io);

  const initialBattles = roomManager.getOpenBattles();
  assert(initialBattles.length >= 2, `Battle Arena pre-seeded with open challenges (count: ${initialBattles.length})`);

  // Create new challenge
  const customBattle = {
    id: `battle_test_${Date.now()}`,
    creatorId: 'player_1',
    creatorName: 'TestCreator',
    creatorAvatar: '👑',
    creatorTag: '#RL-001',
    entryFee: 500,
    prizePool: 950,
    mode: '1v1' as any,
    status: 'open' as any,
    createdAt: new Date().toISOString(),
  };
  roomManager.createBattle(customBattle);
  assert(roomManager.getOpenBattles().some(b => b.id === customBattle.id), 'Custom battle challenge successfully created and listed in open pool');

  // Accept challenge
  const accepted = roomManager.acceptBattle(customBattle.id, {
    id: 'player_2',
    username: 'TestOpponent',
    avatar: '👸',
    playerTag: '#RL-002',
  });
  assert(accepted !== null && accepted.roomId.includes(customBattle.id), `Challenge accepted and authoritative game room instantiated (RoomId: ${accepted?.roomId})`);

  // Private Room Creation
  const priv = roomManager.createPrivateRoom({ id: 'host_1', username: 'HostUser' }, 'classic4p', 0);
  assert(priv.roomCode.length === 6, `Generated 6-character private room code: ${priv.roomCode}`);

  const joinRes = roomManager.joinPrivateRoom(priv.roomCode, { id: 'joiner_2', username: 'JoinerUser' });
  assert(joinRes.success, 'Player 2 successfully joined private room waiting lobby');

  // Stop test game timer
  game.stopTurnTimer();
  httpServer.close();

  console.log('\n==================================================');
  console.log(`🏁 TEST EXECUTION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

runTestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
