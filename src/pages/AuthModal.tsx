import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useSound } from '../context/SoundContext';
import { X, Phone, Lock, Gift, User, Sparkles, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithPhone, registerUser, loginAsDemo, incomingReferral } = useAuth();
  const { playClick, playSixRolled } = useSound();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('1234');
  const [referralCode, setReferralCode] = useState(incomingReferral || '');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (!phone.trim() || phone.trim().length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    playClick();
    setOtpSent(true);
  };

  const handleVerifyLogin = async () => {
    setLoading(true);
    playClick();
    const result = await loginWithPhone(phone, otp);
    setLoading(false);
    if (result.success) {
      playSixRolled();
      onClose();
    }
  };

  const handleRegister = async () => {
    if (!phone.trim() || !username.trim()) {
      alert('Please enter both mobile number and username');
      return;
    }
    setLoading(true);
    playClick();
    const result = await registerUser(phone, username, referralCode);
    setLoading(false);
    if (result.success) {
      playSixRolled();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl glass-panel-gold p-6 text-white shadow-2xl border border-royal-gold/40">
        
        {/* Close Button */}
        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-royal-gold to-amber-600 p-1 mx-auto mb-3 shadow-gold-glow flex items-center justify-center text-3xl">
            👑
          </div>
          <h2 className="font-royal text-2xl font-black gold-gradient-text">
            Royal Ludo Arena
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {mode === 'login' ? 'Sign in to access your warrior account' : 'Join the noble realm and claim +500 free bonus coins!'}
          </p>
        </div>

        {/* Quick Demo Switcher Strip */}
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-royal-border/80 mb-5">
          <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider block mb-2 text-center">
            ⚡ Quick 1-Click Demo Login
          </span>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_USERS.map((demo, idx) => (
              <button
                key={demo.id}
                onClick={() => {
                  playClick();
                  loginAsDemo(idx);
                  playSixRolled();
                  onClose();
                }}
                className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left flex items-center gap-1.5 transition-colors"
              >
                <span className="text-base">{demo.avatar}</span>
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">{demo.username.split('_')[0]}</div>
                  <div className="text-[9px] text-amber-400 font-mono">{demo.role === 'admin' ? '👑 Admin' : 'Warrior'}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-slate-900/80 p-1 border border-royal-border mb-4">
          <button
            onClick={() => {
              playClick();
              setMode('login');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'login' ? 'bg-royal-gold text-royal-dark font-extrabold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In with Mobile
          </button>
          <button
            onClick={() => {
              playClick();
              setMode('register');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'register' ? 'bg-royal-gold text-royal-dark font-extrabold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            New Warrior Registration
          </button>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3 mb-6">
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Choose Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Maharaja_Ludo"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-royal-border text-sm text-white focus:outline-none focus:border-royal-gold"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-royal-border text-sm text-white font-mono focus:outline-none focus:border-royal-gold"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Referral Code (Optional)
              </label>
              <div className="relative">
                <Gift className="w-4 h-4 text-royal-gold absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. ROYAL814"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-royal-border text-sm text-royal-gold font-mono uppercase focus:outline-none focus:border-royal-gold"
                />
              </div>
              {incomingReferral && (
                <span className="text-[10px] text-emerald-400 block mt-1 font-semibold">
                  ✓ Referral code applied from link (+500 Bonus Coins!)
                </span>
              )}
            </div>
          )}

          {mode === 'login' && otpSent && (
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Enter OTP (Demo: 1234)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-royal-border text-sm text-white font-mono tracking-widest focus:outline-none focus:border-royal-gold"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        {mode === 'login' ? (
          !otpSent ? (
            <button
              onClick={handleSendOtp}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-royal-gold to-amber-600 text-royal-dark font-royal font-black text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-95"
            >
              Send OTP
            </button>
          ) : (
            <button
              onClick={handleVerifyLogin}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-royal font-black text-xs uppercase tracking-wider shadow-md hover:opacity-95"
            >
              Verify & Enter Realm
            </button>
          )
        ) : (
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-royal-gold to-amber-600 text-royal-dark font-royal font-black text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-95"
          >
            Claim Bonus & Register
          </button>
        )}

      </div>
    </div>
  );
};

