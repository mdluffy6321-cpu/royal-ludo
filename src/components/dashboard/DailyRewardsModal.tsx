import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSound } from '../../context/SoundContext';
import { X, Sparkles, Coins, Gift, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WHEEL_SEGMENTS = [
  { coins: 100, label: '100 Coins', color: '#4A87D6' },
  { coins: 250, label: '250 Coins', color: '#D4A7D7' },
  { coins: 50, label: '50 Coins', color: '#B7B39B' },
  { coins: 500, label: '500 Coins', color: '#E3C0BD' },
  { coins: 150, label: '150 Coins', color: '#4A87D6' },
  { coins: 75, label: '75 Coins', color: '#D4A7D7' },
  { coins: 1000, label: '👑 1,000!', color: '#B7B39B' },
  { coins: 200, label: '200 Coins', color: '#E3C0BD' },
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

    const prizeIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const selected = WHEEL_SEGMENTS[prizeIndex];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#FFFFFF] border border-[#DDD6CB] p-6 text-[#000000] shadow-xl">
        
        {/* Close button */}
        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-[#6E6962] hover:text-[#000000] hover:border-[#000000] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-[#000000] text-xs font-bold uppercase tracking-[0.08em] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Rewards</span>
          </div>
          <h2 className="text-2xl font-black text-[#000000] tracking-tight">
            Free Virtual Coins
          </h2>
          <p className="text-xs text-[#6E6962] mt-1">
            Claim your daily bonus rewards to play non-stop in the arena!
          </p>
        </div>

        {/* Tabs: Spin Wheel vs 7-Day Streak */}
        <div className="flex rounded-full bg-[#F7F4ED] border border-[#DDD6CB] p-1 mb-6">
          <button
            onClick={() => {
              playClick();
              setActiveTab('wheel');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'wheel'
                ? 'bg-[#000000] text-[#F7F4ED]'
                : 'text-[#6E6962] hover:text-[#000000]'
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
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-bold transition-all ${
              activeTab === 'streak'
                ? 'bg-[#000000] text-[#F7F4ED]'
                : 'text-[#6E6962] hover:text-[#000000]'
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
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-3 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-[#000000]" />

              <div 
                className="w-full h-full rounded-full border-4 border-[#000000] relative overflow-hidden transition-transform duration-[4000ms] ease-out shadow-md"
                style={{
                  transform: `rotate(${spinRotation}deg)`,
                  background: 'conic-gradient(#4A87D6 0% 12.5%, #D4A7D7 12.5% 25%, #B7B39B 25% 37.5%, #E3C0BD 37.5% 50%, #4A87D6 50% 62.5%, #D4A7D7 62.5% 75%, #B7B39B 75% 87.5%, #E3C0BD 87.5% 100%)'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-[#FFFFFF] border-4 border-[#000000] shadow flex items-center justify-center text-lg z-10 font-black text-[#000000]">
                    👑
                  </div>
                </div>
              </div>
            </div>

            {/* Spin result / trigger button */}
            {wonPrize !== null ? (
              <div className="mt-4 text-center animate-in zoom-in-95 duration-200">
                <div className="text-sm font-semibold text-emerald-600 flex items-center justify-center gap-1.5 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Congratulations!</span>
                </div>
                <div className="text-2xl font-black text-[#000000] flex items-center justify-center gap-2">
                  <Coins className="w-6 h-6 text-amber-500" />
                  <span>+{wonPrize} Virtual Coins Added!</span>
                </div>
                <button
                  onClick={onClose}
                  className="mt-3 px-6 py-2 rounded-full bg-[#000000] text-xs font-bold text-[#F7F4ED] hover:opacity-85 transition-opacity"
                >
                  Awesome, Close
                </button>
              </div>
            ) : (
              <button
                onClick={handleSpin}
                disabled={spinning}
                className="mt-4 px-8 py-3 rounded-full bg-[#000000] text-[#F7F4ED] font-bold text-sm uppercase tracking-[0.08em] hover:opacity-85 active:scale-95 transition-all disabled:opacity-50"
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
                  className={`p-2.5 rounded-2xl text-center border transition-all ${
                    item.claimed
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : item.current
                      ? 'bg-[#F7F4ED] border-[#000000] scale-105'
                      : 'bg-[#FFFFFF] border-[#DDD6CB] text-[#6E6962]'
                  }`}
                >
                  <span className="text-[10px] font-bold block uppercase text-[#6E6962]">Day {item.day}</span>
                  <div className="my-1 text-base">
                    {item.claimed ? '✅' : '🪙'}
                  </div>
                  <span className="text-xs font-black text-[#000000]">+{item.coins}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {STREAK_DAYS.slice(4).map((item) => (
                <div
                  key={item.day}
                  className={`p-2.5 rounded-2xl text-center border ${
                    item.day === 7
                      ? 'bg-[#F7F4ED] border-[#000000] col-span-1'
                      : 'bg-[#FFFFFF] border-[#DDD6CB] text-[#6E6962]'
                  }`}
                >
                  <span className="text-[10px] font-bold block uppercase text-[#000000]">Day {item.day}</span>
                  <div className="my-1 text-base">
                    {item.day === 7 ? '🎁' : '🪙'}
                  </div>
                  <span className="text-xs font-black text-[#000000]">+{item.coins}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleClaimStreak}
                disabled={streakClaimed}
                className={`w-full py-3 rounded-full font-bold text-sm uppercase tracking-[0.08em] transition-all ${
                  streakClaimed
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default'
                    : 'bg-[#000000] text-[#F7F4ED] hover:opacity-85'
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
