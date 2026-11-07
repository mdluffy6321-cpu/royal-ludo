import React from 'react';
import { LudoColor, Player, TokenPiece } from '../../types';
import { 
  TRACK_COORDINATES, 
  SAFE_CELL_INDICES, 
  HOME_COLUMNS, 
  START_OFFSETS, 
  getTokenCoordinates 
} from '../../utils/coordinates';
import { useSound } from '../../context/SoundContext';

interface LudoBoardProps {
  players: Player[];
  currentTurnColor: LudoColor;
  diceValue: number | null;
  validTokenIds: string[];
  onSelectToken: (tokenId: string) => void;
}

export const LudoBoard: React.FC<LudoBoardProps> = ({
  players,
  currentTurnColor,
  diceValue,
  validTokenIds,
  onSelectToken,
}) => {
  const { playClick } = useSound();

  // Helper for rendering SVG Star
  const renderStar = (cx: number, cy: number, size = 0.35, color = '#F59E0B') => (
    <g transform={`translate(${cx}, ${cy})`}>
      <polygon
        points={`0,${-size} ${size * 0.29},${-size * 0.29} ${size},${-size * 0.2} ${size * 0.45},${size * 0.25} ${size * 0.65},${size * 0.85} 0,${size * 0.45} ${-size * 0.65},${size * 0.85} ${-size * 0.45},${size * 0.25} ${-size},${-size * 0.2} ${-size * 0.29},${-size * 0.29}`}
        fill={color}
        stroke="#78350F"
        strokeWidth="0.04"
        filter="drop-shadow(0 0 0.1px rgba(245, 158, 11, 0.8))"
      />
    </g>
  );

  return (
    <div className="relative w-full max-w-[540px] aspect-square mx-auto p-1.5 sm:p-2 rounded-3xl bg-gradient-to-br from-slate-900 via-royal-card to-slate-950 border-2 border-royal-border/90 shadow-2xl select-none">
      
      {/* SVG 15x15 Ludo Board */}
      <svg
        viewBox="0 0 15 15"
        className="w-full h-full rounded-2xl overflow-hidden drop-shadow-md"
        style={{ shapeRendering: 'geometricPrecision' }}
      >
        <defs>
          {/* Quadrant Gradients */}
          <linearGradient id="greenGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="yellowGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
          <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          {/* Token Gradient Effects */}
          <radialGradient id="tokenRed" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FCA5A5" />
            <stop offset="60%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </radialGradient>
          <radialGradient id="tokenGreen" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="60%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064E3B" />
          </radialGradient>
          <radialGradient id="tokenYellow" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="60%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </radialGradient>
          <radialGradient id="tokenBlue" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="60%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </radialGradient>
        </defs>

        {/* Board Background */}
        <rect x="0" y="0" width="15" height="15" fill="#0C1222" />

        {/* ================= 4 YARD BASES ================= */}
        {/* Green Base (Top-Left 0..6, 0..6) */}
        <rect x="0" y="0" width="6" height="6" fill="url(#greenGrad)" stroke="#0C1222" strokeWidth="0.08" />
        <rect x="1" y="1" width="4" height="4" rx="0.5" fill="#070B19" />
        <circle cx="2" cy="2" r="0.65" fill="#10B981" fillOpacity="0.3" stroke="#10B981" strokeWidth="0.06" />
        <circle cx="4" cy="2" r="0.65" fill="#10B981" fillOpacity="0.3" stroke="#10B981" strokeWidth="0.06" />
        <circle cx="2" cy="4" r="0.65" fill="#10B981" fillOpacity="0.3" stroke="#10B981" strokeWidth="0.06" />
        <circle cx="4" cy="4" r="0.65" fill="#10B981" fillOpacity="0.3" stroke="#10B981" strokeWidth="0.06" />

        {/* Yellow Base (Top-Right 9..15, 0..6) */}
        <rect x="9" y="0" width="6" height="6" fill="url(#yellowGrad)" stroke="#0C1222" strokeWidth="0.08" />
        <rect x="10" y="1" width="4" height="4" rx="0.5" fill="#070B19" />
        <circle cx="11" cy="2" r="0.65" fill="#F59E0B" fillOpacity="0.3" stroke="#F59E0B" strokeWidth="0.06" />
        <circle cx="13" cy="2" r="0.65" fill="#F59E0B" fillOpacity="0.3" stroke="#F59E0B" strokeWidth="0.06" />
        <circle cx="11" cy="4" r="0.65" fill="#F59E0B" fillOpacity="0.3" stroke="#F59E0B" strokeWidth="0.06" />
        <circle cx="13" cy="4" r="0.65" fill="#F59E0B" fillOpacity="0.3" stroke="#F59E0B" strokeWidth="0.06" />

        {/* Red Base (Bottom-Left 0..6, 9..15) */}
        <rect x="0" y="9" width="6" height="6" fill="url(#redGrad)" stroke="#0C1222" strokeWidth="0.08" />
        <rect x="1" y="10" width="4" height="4" rx="0.5" fill="#070B19" />
        <circle cx="2" cy="11" r="0.65" fill="#EF4444" fillOpacity="0.3" stroke="#EF4444" strokeWidth="0.06" />
        <circle cx="4" cy="11" r="0.65" fill="#EF4444" fillOpacity="0.3" stroke="#EF4444" strokeWidth="0.06" />
        <circle cx="2" cy="13" r="0.65" fill="#EF4444" fillOpacity="0.3" stroke="#EF4444" strokeWidth="0.06" />
        <circle cx="4" cy="13" r="0.65" fill="#EF4444" fillOpacity="0.3" stroke="#EF4444" strokeWidth="0.06" />

        {/* Blue Base (Bottom-Right 9..15, 9..15) */}
        <rect x="9" y="9" width="6" height="6" fill="url(#blueGrad)" stroke="#0C1222" strokeWidth="0.08" />
        <rect x="10" y="10" width="4" height="4" rx="0.5" fill="#070B19" />
        <circle cx="11" cy="11" r="0.65" fill="#3B82F6" fillOpacity="0.3" stroke="#3B82F6" strokeWidth="0.06" />
        <circle cx="13" cy="11" r="0.65" fill="#3B82F6" fillOpacity="0.3" stroke="#3B82F6" strokeWidth="0.06" />
        <circle cx="11" cy="13" r="0.65" fill="#3B82F6" fillOpacity="0.3" stroke="#3B82F6" strokeWidth="0.06" />
        <circle cx="13" cy="13" r="0.65" fill="#3B82F6" fillOpacity="0.3" stroke="#3B82F6" strokeWidth="0.06" />

        {/* ================= 52 TRACK PERIMETER CELLS ================= */}
        {TRACK_COORDINATES.map((cell, idx) => {
          let fill = '#111827';
          let stroke = '#1F2937';

          // Starting Cells
          if (idx === 0) fill = '#DC2626'; // Red Start
          else if (idx === 13) fill = '#2563EB'; // Blue Start
          else if (idx === 26) fill = '#D97706'; // Yellow Start
          else if (idx === 39) fill = '#059669'; // Green Start

          return (
            <g key={`track_${idx}`}>
              <rect
                x={cell.x}
                y={cell.y}
                width="1"
                height="1"
                fill={fill}
                stroke={stroke}
                strokeWidth="0.04"
              />
              {/* Render Safe Stars on Safe Cells */}
              {SAFE_CELL_INDICES.includes(idx) && renderStar(cell.x + 0.5, cell.y + 0.5)}
            </g>
          );
        })}

        {/* ================= 4 HOME COLUMNS ================= */}
        {/* Red Home Column */}
        {HOME_COLUMNS.red.map((cell, idx) => (
          <rect
            key={`red_home_${idx}`}
            x={cell.x}
            y={cell.y}
            width="1"
            height="1"
            fill="#EF4444"
            fillOpacity={0.85}
            stroke="#991B1B"
            strokeWidth="0.04"
          />
        ))}

        {/* Blue Home Column */}
        {HOME_COLUMNS.blue.map((cell, idx) => (
          <rect
            key={`blue_home_${idx}`}
            x={cell.x}
            y={cell.y}
            width="1"
            height="1"
            fill="#3B82F6"
            fillOpacity={0.85}
            stroke="#1E40AF"
            strokeWidth="0.04"
          />
        ))}

        {/* Yellow Home Column */}
        {HOME_COLUMNS.yellow.map((cell, idx) => (
          <rect
            key={`yellow_home_${idx}`}
            x={cell.x}
            y={cell.y}
            width="1"
            height="1"
            fill="#F59E0B"
            fillOpacity={0.85}
            stroke="#B45309"
            strokeWidth="0.04"
          />
        ))}

        {/* Green Home Column */}
        {HOME_COLUMNS.green.map((cell, idx) => (
          <rect
            key={`green_home_${idx}`}
            x={cell.x}
            y={cell.y}
            width="1"
            height="1"
            fill="#10B981"
            fillOpacity={0.85}
            stroke="#065F46"
            strokeWidth="0.04"
          />
        ))}

        {/* ================= CENTER HOME (6..9, 6..9) ================= */}
        <polygon points="6,6 9,6 7.5,7.5" fill="#10B981" stroke="#047857" strokeWidth="0.04" />
        <polygon points="9,6 9,9 7.5,7.5" fill="#F59E0B" stroke="#B45309" strokeWidth="0.04" />
        <polygon points="9,9 6,9 7.5,7.5" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="0.04" />
        <polygon points="6,9 6,6 7.5,7.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="0.04" />

        {/* Center Crown Emblem */}
        <circle cx="7.5" cy="7.5" r="0.65" fill="#070B19" stroke="#F59E0B" strokeWidth="0.06" />
        <text
          x="7.5"
          y="7.7"
          textAnchor="middle"
          fontSize="0.55"
          fill="#F59E0B"
          fontWeight="bold"
        >
          👑
        </text>

        {/* ================= TOKEN PIECES ================= */}
        {players.map((player) =>
          player.tokens.map((token) => {
            const coord = getTokenCoordinates(token.color, token.index, token.stepCount, token.isYard);
            const isValid = validTokenIds.includes(token.id);

            // Determine gradient fill
            const tokenGrad = {
              red: 'url(#tokenRed)',
              green: 'url(#tokenGreen)',
              yellow: 'url(#tokenYellow)',
              blue: 'url(#tokenBlue)',
            }[token.color];

            const strokeColor = {
              red: '#7F1D1D',
              green: '#064E3B',
              yellow: '#78350F',
              blue: '#1E3A8A',
            }[token.color];

            const cx = coord.x + 0.5;
            const cy = coord.y + 0.5;

            return (
              <g
                key={token.id}
                onClick={() => {
                  if (isValid) {
                    playClick();
                    onSelectToken(token.id);
                  }
                }}
                className={`transition-transform duration-200 ${
                  isValid ? 'cursor-pointer hover:scale-125' : ''
                }`}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              >
                {/* Glow ring if valid move */}
                {isValid && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="0.52"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="0.08"
                    className="animate-pulse"
                  />
                )}

                {/* Token Shadow */}
                <ellipse cx={cx + 0.04} cy={cy + 0.08} rx="0.38" ry="0.25" fill="#000000" fillOpacity="0.45" />

                {/* Token Outer Base */}
                <circle cx={cx} cy={cy} r="0.38" fill={tokenGrad} stroke={strokeColor} strokeWidth="0.04" />

                {/* Token Inner Crown / Ridge */}
                <circle cx={cx} cy={cy - 0.04} r="0.22" fill="#FFFFFF" fillOpacity="0.25" />
                <circle cx={cx} cy={cy} r="0.12" fill="#FFFFFF" fillOpacity="0.7" />
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
};

