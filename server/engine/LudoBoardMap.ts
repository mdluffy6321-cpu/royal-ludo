import { LudoColor } from './types.js';

export const START_OFFSETS: Record<LudoColor, number> = {
  red: 0,
  blue: 13,
  yellow: 26,
  green: 39,
};

// 8 Safe cells on perimeter (0..51)
export const SAFE_CELL_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

// Exact step counts:
// stepCount: -1 => Yard
// stepCount: 0 => Start cell (Safe)
// stepCount: 1..50 => Perimeter track
// stepCount: 51 => Turning cell into home path
// stepCount: 52..56 => 5 Home column cells
// stepCount: 57 => Center Home! (Token reached goal)
export const MAX_STEPS = 57;

export function getGlobalPerimeterPosition(color: LudoColor, stepCount: number): number | null {
  if (stepCount < 0 || stepCount > 51) return null;
  return (START_OFFSETS[color] + stepCount) % 52;
}

export function isCellSafe(globalPos: number): boolean {
  return SAFE_CELL_INDICES.includes(globalPos);
}

