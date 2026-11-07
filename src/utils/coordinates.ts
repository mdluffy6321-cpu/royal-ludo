import { LudoColor } from '../types';

export interface GridCoord {
  x: number; // 0..14
  y: number; // 0..14
}

// 52 Perimeter track coordinates (x, y) starting from Red Start at index 0
export const TRACK_COORDINATES: GridCoord[] = [
  /* 0 - Red Start */  { x: 1, y: 8 },
  /* 1 */              { x: 2, y: 8 },
  /* 2 */              { x: 3, y: 8 },
  /* 3 */              { x: 4, y: 8 },
  /* 4 */              { x: 5, y: 8 },
  /* 5 */              { x: 6, y: 9 },
  /* 6 */              { x: 6, y: 10 },
  /* 7 */              { x: 6, y: 11 },
  /* 8 - Safe Star */  { x: 6, y: 12 },
  /* 9 */              { x: 6, y: 13 },
  /* 10 */             { x: 6, y: 14 },
  /* 11 */             { x: 7, y: 14 },
  /* 12 */             { x: 8, y: 14 },
  /* 13 - Blue Start */{ x: 8, y: 13 },
  /* 14 */             { x: 8, y: 12 },
  /* 15 */             { x: 8, y: 11 },
  /* 16 */             { x: 8, y: 10 },
  /* 17 */             { x: 8, y: 9 },
  /* 18 */             { x: 9, y: 8 },
  /* 19 */             { x: 10, y: 8 },
  /* 20 */             { x: 11, y: 8 },
  /* 21 - Safe Star */ { x: 12, y: 8 },
  /* 22 */             { x: 13, y: 8 },
  /* 23 */             { x: 14, y: 8 },
  /* 24 */             { x: 14, y: 7 },
  /* 25 */             { x: 14, y: 6 },
  /* 26 - Yellow Start*/{ x: 13, y: 6 },
  /* 27 */             { x: 12, y: 6 },
  /* 28 */             { x: 11, y: 6 },
  /* 29 */             { x: 10, y: 6 },
  /* 30 */             { x: 9, y: 6 },
  /* 31 */             { x: 8, y: 5 },
  /* 32 */             { x: 8, y: 4 },
  /* 33 */             { x: 8, y: 3 },
  /* 34 - Safe Star */ { x: 8, y: 2 },
  /* 35 */             { x: 8, y: 1 },
  /* 36 */             { x: 8, y: 0 },
  /* 37 */             { x: 7, y: 0 },
  /* 38 */             { x: 6, y: 0 },
  /* 39 - Green Start*/{ x: 6, y: 1 },
  /* 40 */             { x: 6, y: 2 },
  /* 41 */             { x: 6, y: 3 },
  /* 42 */             { x: 6, y: 4 },
  /* 43 */             { x: 6, y: 5 },
  /* 44 */             { x: 5, y: 6 },
  /* 45 */             { x: 4, y: 6 },
  /* 46 */             { x: 3, y: 6 },
  /* 47 - Safe Star */ { x: 2, y: 6 },
  /* 48 */             { x: 1, y: 6 },
  /* 49 */             { x: 0, y: 6 },
  /* 50 */             { x: 0, y: 7 },
  /* 51 */             { x: 0, y: 8 },
];

export const START_OFFSETS: Record<LudoColor, number> = {
  red: 0,
  blue: 13,
  yellow: 26,
  green: 39,
};

// 8 Safe Cell Indices on the 52 perimeter track
export const SAFE_CELL_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

// 5 Home Column Steps for each color (stepCount 52..56)
export const HOME_COLUMNS: Record<LudoColor, GridCoord[]> = {
  red: [
    { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 },
  ],
  blue: [
    { x: 7, y: 13 }, { x: 7, y: 12 }, { x: 7, y: 11 }, { x: 7, y: 10 }, { x: 7, y: 9 },
  ],
  yellow: [
    { x: 13, y: 7 }, { x: 12, y: 7 }, { x: 11, y: 7 }, { x: 10, y: 7 }, { x: 9, y: 7 },
  ],
  green: [
    { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 },
  ],
};

// Final Home Center coordinate (stepCount 57)
export const HOME_CENTER: Record<LudoColor, GridCoord> = {
  red: { x: 6, y: 7 },
  blue: { x: 7, y: 8 },
  yellow: { x: 8, y: 7 },
  green: { x: 7, y: 6 },
};

// 4 Yard Token Positions inside base for each color
export const YARD_POSITIONS: Record<LudoColor, GridCoord[]> = {
  green: [
    { x: 1.5, y: 1.5 }, { x: 3.5, y: 1.5 },
    { x: 1.5, y: 3.5 }, { x: 3.5, y: 3.5 },
  ],
  yellow: [
    { x: 10.5, y: 1.5 }, { x: 12.5, y: 1.5 },
    { x: 10.5, y: 3.5 }, { x: 12.5, y: 3.5 },
  ],
  red: [
    { x: 1.5, y: 10.5 }, { x: 3.5, y: 10.5 },
    { x: 1.5, y: 12.5 }, { x: 3.5, y: 12.5 },
  ],
  blue: [
    { x: 10.5, y: 10.5 }, { x: 12.5, y: 10.5 },
    { x: 10.5, y: 12.5 }, { x: 12.5, y: 12.5 },
  ],
};

/**
 * Returns exact (x,y) grid coordinates for any token given its color, yard state, and stepCount (0..57)
 */
export function getTokenCoordinates(color: LudoColor, index: number, stepCount: number, isYard: boolean): GridCoord {
  if (isYard || stepCount < 0) {
    return YARD_POSITIONS[color][index];
  }
  if (stepCount === 57) {
    return HOME_CENTER[color];
  }
  if (stepCount >= 52) {
    const homeIndex = stepCount - 52;
    return HOME_COLUMNS[color][homeIndex];
  }
  // Perimeter step:
  const globalPos = (START_OFFSETS[color] + stepCount) % 52;
  return TRACK_COORDINATES[globalPos];
}

