import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSound } from '../../context/SoundContext';
import { X, Sparkles, Coins, Gift, CheckCircle, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WHEEL_SEGMENTS = [
  { coins: 100, label: '100 Coins', color: '#EF4444' },
  { coins: 250, label: '250 Coins', color: '#3B82F6' },
  { coins: 50, label: '50 Coins', color: '#10B981' },
  { coins: 500, label: '500 Coins', color: '#F59E0B' },
  { coins: 150, label: '150 Coins', color: '#8B5CF6' },
  { coins: 75, label: '75 Coins', color: '#EC4899' },
  { coins: 1000, label: '👑 1,000!', color: '#FBBF24' },
  { coins: 200, label: '200 Coins', color: '#06B6D4' },
];

const STREAK_DAYS = [
  { day: 1, coins: 50, claimed: true },
  { day: 2, coins: 100, claimed: true },
  { day: 3, coins: 150, claimed: false, current: true },
  { day: 4, coins: 250, claimed: false },
  { day: 5, coins: 400, claimed: false },
  { day: 6, coins: 600, claimed: false },
  { day: 7, coins: 1000, claimed: false, bonus: '👑 Mystery Box' },
];

export const DailyRewardsModal: React.FC<DailyRewardsModalProps> = ({ isOpen, onClose }) => {
  const { user, updateCoins } = useAuth();
  const { playClick, playSixRolled, playVictory } = useSound();

  const [activeTab, setActiveTab] = useState<'wheel' | 'streak'>('wheel');
  const [spinning, setSpinning] = useState(false);
  const [spinRotation, setSpinRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<number | null>(null);
  const [streakClaimed, setStreakClaimed] = useState(false);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (spinning || wonPrize !== null) return;
    playClick();
    setSpinning(true);

    // Pick random segment (0..7)
    const prizeIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const selected = WHEEL_SEGMENTS[prizeIndex];

    // Compute extra full turns (5-8 turns) + target angle
    const degreesPerSegment = 360 / WHEEL_SEGMENTS.length;
    const targetOffset = 360 - (prizeIndex * degreesPerSegment + degreesPerSegment / 2);
    const extraSpins = 360 * 5;
    const finalRotation = spinRotation + extraSpins + targetOffset;

    setSpinRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      setWonPrize(selected.coins);
      if (user) {
        updateCoins(user.coins + selected.coins, user.bonusCoins + selected.coins);
      }
      playVictory();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 4000);
  };

  const handleClaimStreak = () => {
    if (streakClaimed || !user) return;
    playClick();
    setStreakClaimed(true);
    const reward = STREAK_DAYS[2].coins;
    updateCoins(user.coins + reward, user.bonusCoins + reward);
    playSixRolled();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel-gold p-6 text-white shadow-2xl border border-royal-gold/40">
        
        {/* Close button */}
        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-royal-gold/15 border border-royal-gold/30 text-royal-gold text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Royal Daily Rewards</span>
          </div>
          <h2 className="font-royal text-2xl font-black gold-gradient-text">
            Free Virtual Coins
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Claim your daily bonus rewards to play non-stop in the arena!
          </p>
        </div>

        {/* Tabs: Spin Wheel vs 7-Day Streak */}
        <div className="flex rounded-xl bg-slate-900/80 p-1 border border-royal-border mb-6">
          <button
            onClick={() => {
              playClick();
              setActiveTab('wheel');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'wheel'
                ? 'bg-gradient-to-r from-royal-gold to-amber-600 text-royal-dark shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Lucky Spin Wheel</span>
          </button>
          <button
            onClick={() => {
              playClick();
              setActiveTab('streak');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'streak'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>7-Day Login Streak</span>
          </button>
        </div>

        {/* Tab 1: Spin Wheel */}
        {activeTab === 'wheel' && (
          <div className="flex flex-col items-center">
            
            {/* The Wheel */}
            <div className="relative w-64 h-64 my-2">
              {/* Pointer indicator */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-3 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.8)]" />

              {/* Wheel Body */}
              <div 
                className="w-full h-full rounded-full border-4 border-amber-500 shadow-gold-glow relative overflow-hidden transition-transform duration-[4000ms] ease-out"
                style={{
                  transform: `rotate(${spinRotation}deg)`,
                  background: 'conic-gradient(#EF4444 0% 12.5%, #3B82F6 12.5% 25%, #10B981 25% 37.5%, #F59E0B 37.5% 50%, #8B5CF6 50% 62.5%, #EC4899 62.5% 75%, #FBBF24 75% 87.5%, #06B6D4 87.5% 100%)'
                }}
              >
                {/* Center hub */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-royal-dark border-4 border-royal-gold shadow-lg flex items-center justify-center text-lg z-10 font-royal font-black text-royal-gold">
                    👑
                  </div>
                </div>
              </div>
            </div>

            {/* Spin result / trigger button */}
            {wonPrize !== null ? (
              <div className="mt-4 text-center animate-in zoom-in-95 duration-200">
                <div className="text-sm font-semibold text-emerald-400 flex items-center justify-center gap-1.5 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Congratulations!</span>
                </div>
                <div className="text-2xl font-black text-royal-gold font-royal flex items-center justify-center gap-2">
                  <Coins className="w-6 h-6" />
                  <span>+{wonPrize} Virtual Coins Added!</span>
                </div>
                <button
                  onClick={onClose}
                  className="mt-3 px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
                >
                  Awesome, Close
                </button>
              </div>
            ) : (
              <button
                onClick={handleSpin}
                disabled={spinning}
                className="mt-4 px-8 py-3 rounded-2xl bg-gradient-to-r from-royal-gold via-amber-500 to-amber-600 text-royal-dark font-royal font-extrabold text-sm uppercase tracking-wider shadow-gold-glow hover:scale-105 active:scale-95 transition-all disabled:opacity-60"
              >
                {spinning ? 'Rolling the Wheel...' : 'Spin the Wheel (Free)'}
              </button>
            )}
          </div>
        )}

        {/* Tab 2: 7-Day Login Streak */}
        {activeTab === 'streak' && (
          <div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {STREAK_DAYS.slice(0, 4).map((item) => (
                <div
                  key={item.day}
                  className={`p-2.5 rounded-xl text-center border transition-all ${
                    item.claimed
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : item.current
                      ? 'bg-amber-950/60 border-amber-400 shadow-gold-glow scale-105'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-bold block uppercase text-slate-400">Day {item.day}</span>
                  <div className="my-1 text-base">
                    {item.claimed ? '✅' : '🪙'}
                  </div>
                  <span className="text-xs font-extrabold text-royal-gold">+{item.coins}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {STREAK_DAYS.slice(4).map((item) => (
                <div
                  key={item.day}
                  className={`p-2.5 rounded-xl text-center border ${
                    item.day === 7
                      ? 'bg-gradient-to-br from-amber-950 to-purple-950 border-amber-500/60 col-span-1 shadow-gold-glow'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-bold block uppercase text-amber-300">Day {item.day}</span>
                  <div className="my-1 text-base">
                    {item.day === 7 ? '🎁' : '🪙'}
                  </div>
                  <span className="text-xs font-extrabold text-royal-gold">+{item.coins}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleClaimStreak}
                disabled={streakClaimed}
                className={`w-full py-3 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all ${
                  streakClaimed
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 cursor-default'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-glow hover:scale-[1.02]'
                }`}
              >
                {streakClaimed ? 'Day 3 Bonus Claimed!' : 'Claim Day 3 (+150 Coins)'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

