import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';

interface LandingPageProps {
  onEnterApp: () => void;
  openAuthModal: () => void;
}

// Floating tile data — game-themed thumbnails using CSS art
const TILES = [
  { emoji: '🎲', label: 'Roll', color: '#4A87D6', top: '8%',  left: '4%',  rot: '-6deg', anim: 'animate-float' },
  { emoji: '👑', label: 'Royal', color: '#D4A7D7', top: '14%', left: '82%', rot: '8deg',  anim: 'animate-float-delayed' },
  { emoji: '⚔️', label: 'Battle', color: '#E3C0BD', top: '55%', left: '6%',  rot: '4deg',  anim: 'animate-float-slow' },
  { emoji: '🏆', label: 'Win',   color: '#B7B39B', top: '62%', left: '86%', rot: '-5deg', anim: 'animate-float' },
  { emoji: '🪙', label: 'Coins', color: '#D4A7D7', top: '30%', left: '1%',  rot: '7deg',  anim: 'animate-float-delayed' },
  { emoji: '🎯', label: 'Aim',   color: '#4A87D6', top: '35%', left: '90%', rot: '-8deg', anim: 'animate-float-slow' },
  { emoji: '🃏', label: 'Cards', color: '#E3C0BD', top: '75%', left: '20%', rot: '5deg',  anim: 'animate-float' },
  { emoji: '🎮', label: 'Play',  color: '#B7B39B', top: '78%', left: '72%', rot: '-4deg', anim: 'animate-float-delayed' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, openAuthModal }) => {
  const { loginAsDemo } = useAuth();
  const { playClick, playSixRolled } = useSound();

  const handleInstantPlay = () => {
    playClick();
    loginAsDemo(0);
    playSixRolled();
    onEnterApp();
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#F7F4ED', color: '#000000' }}
    >
      {/* ── 1. HERO STAGE ───────────────────────────────────────── */}
      <section className="relative flex-1 flex flex-col items-center justify-center overflow-hidden px-4 py-24 sm:py-36 min-h-[92vh]">

        {/* Floating thumbnail tiles */}
        {TILES.map((t, i) => (
          <div
            key={i}
            className={`absolute hidden sm:flex flex-col items-center justify-center select-none pointer-events-none ${t.anim}`}
            style={{
              top: t.top,
              left: t.left,
              transform: `rotate(${t.rot})`,
              zIndex: 0,
            }}
          >
            <div
              className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-sm"
              style={{ backgroundColor: t.color + '55', border: `1px solid ${t.color}66` }}
            >
              <span className="text-3xl sm:text-4xl">{t.emoji}</span>
              <span className="text-[9px] font-medium tracking-widest uppercase" style={{ color: '#6E6962' }}>{t.label}</span>
            </div>
          </div>
        ))}

        {/* Centre content */}
        <div className="relative z-10 max-w-xl mx-auto text-center space-y-8">

          {/* Eyebrow label */}
          <p
            className="text-xs font-medium uppercase tracking-[0.08em]"
            style={{ color: '#6E6962' }}
          >
            The Sovereign Online Gaming Platform
          </p>

          {/* Hero display heading — cosmos heroDisplay scale */}
          <h1
            className="font-sans font-normal leading-[0.95] tracking-[-0.04em] text-5xl sm:text-7xl"
            style={{ color: '#000000' }}
          >
            Play Ludo.<br />
            <span style={{ color: '#000000', opacity: 0.45 }}>Win Royally.</span>
          </h1>

          {/* Supporting copy */}
          <p
            className="text-base leading-relaxed mx-auto max-w-sm"
            style={{ color: '#6E6962' }}
          >
            Live battle arenas, knockout tournaments, and a 15×15 board — all inside your browser. No download needed.
          </p>

          {/* Primary + Secondary pill actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* Primary — solid black */}
            <button
              onClick={handleInstantPlay}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-medium transition-all hover:opacity-80 active:scale-95 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#000000', color: '#F7F4ED' }}
            >
              Enter the Arena
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Secondary — white ghost */}
            <button
              onClick={() => { playClick(); openAuthModal(); }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-medium transition-all hover:opacity-70 active:scale-95 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#FFFFFF', color: '#000000', border: '1px solid #DDD6CB' }}
            >
              Sign In / Register
            </button>
          </div>

          {/* Quiet trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-5" style={{ color: '#6E6962' }}>
            <span className="flex items-center gap-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-black/40 inline-block" />
              100% In-Browser
            </span>
            <span className="flex items-center gap-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-black/40 inline-block" />
              Server-Authoritative RNG
            </span>
            <span className="flex items-center gap-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-black/40 inline-block" />
              Demo Coins Only
            </span>
          </div>
        </div>

        {/* Large wordmark — sits low, wide, almost air */}
        <div
          className="absolute bottom-6 left-0 right-0 text-center select-none pointer-events-none"
          style={{ color: '#000000', opacity: 0.06 }}
        >
          <span
            className="font-sans font-normal tracking-[-0.05em] uppercase"
            style={{ fontSize: 'clamp(4rem, 15vw, 14rem)', lineHeight: 0.88 }}
          >
            ROYAL LUDO
          </span>
        </div>
      </section>

      {/* ── 2. EDITORIAL STORY CARD ─────────────────────────────── */}
      <section
        className="px-4 sm:px-8 lg:px-16 py-20 sm:py-28"
        style={{ backgroundColor: '#F7F4ED', borderTop: '1px solid #DDD6CB' }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">

          {/* Left — big editorial headline */}
          <div className="md:col-span-1 flex flex-col justify-start pt-2">
            <h2
              className="font-sans font-normal leading-[0.95] tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#000000' }}
            >
              Battle.<br />
              Capture.<br />
              Triumph.
            </h2>
          </div>

          {/* Centre — tall image card (CSS art board preview) */}
          <div className="md:col-span-1 flex justify-center">
            <div
              className="w-full max-w-[260px] rounded-3xl overflow-hidden aspect-[3/4] flex flex-col items-center justify-center gap-4 relative"
              style={{ backgroundColor: '#070B19', border: '1px solid #DDD6CB' }}
            >
              {/* Mini Ludo board preview */}
              <div className="grid grid-cols-5 gap-0.5 p-5">
                {/* Row of coloured cells representing the board */}
                {[
                  ['#EF4444','#F7F4ED','#F7F4ED','#F7F4ED','#10B981'],
                  ['#F7F4ED','#F7F4ED','#F59E0B','#F7F4ED','#F7F4ED'],
                  ['#F7F4ED','#F59E0B','#F7F4ED','#F59E0B','#F7F4ED'],
                  ['#F7F4ED','#F7F4ED','#F59E0B','#F7F4ED','#F7F4ED'],
                  ['#3B82F6','#F7F4ED','#F7F4ED','#F7F4ED','#9333EA'],
                ].map((row, ri) => row.map((c, ci) => (
                  <div
                    key={`${ri}-${ci}`}
                    className="w-8 h-8 rounded-md"
                    style={{ backgroundColor: c, opacity: c === '#F7F4ED' ? 0.12 : 0.9 }}
                  />
                )))}
              </div>
              <div className="text-4xl">👑</div>
              <p
                className="text-xs tracking-widest uppercase font-medium pb-6"
                style={{ color: '#F7F4ED', opacity: 0.5 }}
              >
                Royal Ludo
              </p>
            </div>
          </div>

          {/* Right — short supporting paragraph + feature list */}
          <div className="md:col-span-1 space-y-6 pt-2">
            <p
              className="text-base leading-relaxed"
              style={{ color: '#6E6962' }}
            >
              A fully integrated 15×15 Ludo engine runs directly in your browser. Authentic safe stars, token captures, and an exact home-roll rule — no cheats, no shortcuts.
            </p>
            <ul className="space-y-3">
              {[
                '8 safe-star cells on the perimeter',
                '15-second turn timer with bot takeover',
                '3D animated dice with procedural sound',
                'Cross-tab multiplayer via BroadcastChannel',
              ].map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: '#000000' }}>
                  <span className="mt-1 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[10px]" style={{ backgroundColor: '#000000', color: '#F7F4ED' }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* ── 3. COMPARISON ROW ───────────────────────────────────── */}
      <section
        className="px-4 sm:px-8 lg:px-16 py-20 sm:py-28"
        style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #DDD6CB' }}
      >
        <div className="max-w-6xl mx-auto">

          {/* Centred section headline */}
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className="font-sans font-normal leading-[0.95] tracking-[-0.035em] mb-4"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#000000' }}
            >
              Everything in one arena
            </h2>
            <p className="text-sm max-w-sm mx-auto" style={{ color: '#6E6962' }}>
              Three pillars that make Royal Ludo more than a board game.
            </p>
          </div>

          {/* Three equal comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                color: '#4A87D6',
                emoji: '⚔️',
                title: 'Live Battle Arena',
                body: 'Open challenge marketplace. Set your entry stake, escrow coins, and wait for a challenger — or accept any open duel instantly.',
                label: 'ApnaAddaa-style matchmaking',
              },
              {
                color: '#D4A7D7',
                emoji: '🏆',
                title: 'Knockout Tournaments',
                body: 'Single-elimination brackets. 8 warriors, 3 rounds, one supreme champion. Prize pools drawn from entry fees.',
                label: 'Royal Championship Circuit',
              },
              {
                color: '#4A87D6',
                emoji: '🎁',
                title: 'Daily Rewards & Referrals',
                body: 'Spin the Lucky Wheel every 24 hours. Claim your 7-day streak bonus. Invite friends and earn virtual coins on every referral.',
                label: 'Non-monetary demo coins',
              },
            ].map(card => (
              <div
                key={card.title}
                className="rounded-3xl p-6 flex flex-col gap-4"
                style={{ backgroundColor: '#F7F4ED', border: '1px solid #DDD6CB' }}
              >
                {/* Coloured image-tone accent field */}
                <div
                  className="h-28 rounded-2xl flex items-center justify-center text-5xl"
                  style={{ backgroundColor: card.color + '28' }}
                >
                  {card.emoji}
                </div>

                <div>
                  <h3
                    className="text-xl font-normal tracking-[-0.02em] mb-1"
                    style={{ color: '#000000' }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6E6962' }}>
                    {card.body}
                  </p>
                </div>

                <p
                  className="text-xs font-medium tracking-[0.08em] uppercase mt-auto"
                  style={{ color: '#6E6962' }}
                >
                  {card.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. DARK APP SHELL ───────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-4 sm:px-8 lg:px-16 py-20 sm:py-32"
        style={{ backgroundColor: '#000000' }}
      >
        {/* Top-right chip row */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          {['Arena', 'Leaderboard', 'Treasury'].map(chip => (
            <span
              key={chip}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: '#1a1a1a', color: '#F7F4ED', border: '1px solid #333' }}
            >
              {chip}
            </span>
          ))}
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
            style={{ backgroundColor: '#F59E0B', color: '#000' }}
          >
            👑
          </span>
        </div>

        {/* Mostly empty black workspace — large breathing room */}
        <div className="max-w-6xl mx-auto min-h-[340px] flex flex-col items-center justify-center gap-10 text-center">

          <div className="space-y-5">
            <p
              className="text-xs font-medium tracking-[0.08em] uppercase"
              style={{ color: '#F7F4ED', opacity: 0.4 }}
            >
              Ready when you are
            </p>
            <h2
              className="font-sans font-normal leading-[0.95] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: '#F7F4ED' }}
            >
              Your board awaits.
            </h2>
          </div>

          {/* Primary pill on dark stage */}
          <button
            onClick={handleInstantPlay}
            className="px-10 py-4 rounded-full text-sm font-medium transition-all hover:opacity-80 active:scale-95"
            style={{ backgroundColor: '#F7F4ED', color: '#000000' }}
          >
            Play Instantly — No Account Needed
          </button>

        </div>

        {/* Floating round control near lower edge */}
        <button
          onClick={() => { playClick(); openAuthModal(); }}
          className="absolute bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
          style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#F7F4ED' }}
          title="Sign In"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2a4 4 0 100 8 4 4 0 000-8zM3 15a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer
        className="px-4 sm:px-8 lg:px-16 py-6 flex flex-wrap items-center justify-between gap-4"
        style={{ backgroundColor: '#000000', borderTop: '1px solid #1a1a1a' }}
      >
        <span className="text-xs" style={{ color: '#F7F4ED', opacity: 0.3 }}>
          © 2025 Royal Ludo — Demonstration platform. All coins are virtual and non-redeemable.
        </span>
        <button
          onClick={() => { playClick(); openAuthModal(); }}
          className="text-xs underline"
          style={{ color: '#F7F4ED', opacity: 0.4 }}
        >
          Sign In
        </button>
      </footer>
    </div>
  );
};
