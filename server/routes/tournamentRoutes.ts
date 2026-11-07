import { Router } from 'express';
import { db } from '../db/database.js';

export const tournamentRouter = Router();

const DEFAULT_TOURNAMENTS = [
  {
    id: 'tourney_royal_cup',
    title: 'The Maharaja Grand Championship',
    banner: '👑',
    entryFee: 500,
    prizePool: 3600,
    maxParticipants: 8,
    currentParticipants: 6,
    startTime: 'Today, 8:00 PM IST',
    status: 'registration_open',
    rounds: [
      {
        roundNumber: 1,
        name: 'Quarterfinals (8 Warriors)',
        matches: [
          { matchId: 'm1', player1: 'King_Maharaja', player2: 'Player_8812', winner: 'King_Maharaja' },
          { matchId: 'm2', player1: 'Queen_Maharani', player2: 'Knight_Vikram', winner: 'Queen_Maharani' },
          { matchId: 'm3', player1: 'Master_Arjun', player2: 'Player_3190', winner: 'Master_Arjun' },
          { matchId: 'm4', player1: 'Ludo_Tiger', player2: 'Pending Slot' },
        ],
      },
      {
        roundNumber: 2,
        name: 'Semifinals (4 Warriors)',
        matches: [
          { matchId: 'm5', player1: 'King_Maharaja', player2: 'Queen_Maharani' },
          { matchId: 'm6', player1: 'Master_Arjun', player2: 'TBD' },
        ],
      },
      {
        roundNumber: 3,
        name: 'Grand Finale 🏆',
        matches: [
          { matchId: 'm7', player1: 'Winner SF1', player2: 'Winner SF2' },
        ],
      },
    ],
  },
  {
    id: 'tourney_speed_rush',
    title: 'Imperial Lightning Duel (1v1)',
    banner: '⚡',
    entryFee: 200,
    prizePool: 1500,
    maxParticipants: 8,
    currentParticipants: 8,
    startTime: 'Live Now!',
    status: 'live',
    rounds: [
      {
        roundNumber: 1,
        name: 'Quarterfinals',
        matches: [
          { matchId: 's1', player1: 'Vanguard_8', player2: 'Knight_Vikram', winner: 'Knight_Vikram' },
          { matchId: 's2', player1: 'Queen_Maharani', player2: 'Royal_Falcon', winner: 'Queen_Maharani' },
        ],
      },
      {
        roundNumber: 2,
        name: 'Final Duel',
        matches: [
          { matchId: 's3', player1: 'Knight_Vikram', player2: 'Queen_Maharani' },
        ],
      },
    ],
  },
];

tournamentRouter.get('/', (req, res) => {
  res.json({ success: true, tournaments: DEFAULT_TOURNAMENTS });
});

tournamentRouter.post('/register', (req, res) => {
  const { tournamentId, userId } = req.body;
  res.json({ success: true, message: 'Successfully registered for tournament!' });
});

