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
    const result = await registerUser(phone, username.replace(/_/g, ' '), referralCode);
    setLoading(false);
    if (result.success) {
      playSixRolled();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#FFFFFF] border border-[#DDD6CB] p-6 text-[#000000] shadow-xl">
        
        {/* Close Button */}
        <button
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-[#6E6962] hover:text-[#000000] hover:border-[#000000] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#000000] mx-auto mb-3 flex items-center justify-center text-2xl text-white">
            👑
          </div>
          <h2 className="text-2xl font-black text-[#000000] tracking-tight">
            Royal Ludo
          </h2>
          <p className="text-xs text-[#6E6962] mt-1">
            {mode === 'login' ? 'Sign in to access your warrior account' : 'Join the arena and claim +500 free bonus coins!'}
          </p>
        </div>

        {/* Quick Demo Switcher Strip */}
        <div className="p-3 rounded-2xl bg-[#F7F4ED] border border-[#DDD6CB] mb-5">
          <span className="text-[10px] text-[#000000] uppercase font-bold tracking-[0.08em] block mb-2 text-center">
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
                className="py-1.5 px-2.5 rounded-xl bg-[#FFFFFF] hover:border-[#000000] border border-[#DDD6CB] text-left flex items-center gap-2 transition-all"
              >
                <span className="text-base">{demo.avatar}</span>
                <div className="truncate">
                  <div className="text-xs font-bold text-[#000000] truncate">{demo.username.replace(/_/g, ' ').split(' ')[0]}</div>
                  <div className="text-[9px] text-[#6E6962] font-mono">{demo.role === 'admin' ? 'Admin' : 'Warrior'}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-full bg-[#F7F4ED] border border-[#DDD6CB] p-1 mb-4">
          <button
            onClick={() => {
              playClick();
              setMode('login');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all ${
              mode === 'login' ? 'bg-[#000000] text-[#F7F4ED]' : 'text-[#6E6962] hover:text-[#000000]'
            }`}
          >
            Sign In with Mobile
          </button>
          <button
            onClick={() => {
              playClick();
              setMode('register');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all ${
              mode === 'register' ? 'bg-[#000000] text-[#F7F4ED]' : 'text-[#6E6962] hover:text-[#000000]'
            }`}
          >
            New Warrior
          </button>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3 mb-6">
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-[#6E6962] uppercase tracking-[0.08em] mb-1">
                Choose Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#6E6962] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. King Maharaja"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-sm text-[#000000] focus:outline-none focus:border-[#000000]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-[#6E6962] uppercase tracking-[0.08em] mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#6E6962] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full pl-9 pr-3 py-2.5 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-sm text-[#000000] font-mono focus:outline-none focus:border-[#000000]"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-[#6E6962] uppercase tracking-[0.08em] mb-1">
                Referral Code (Optional)
              </label>
              <div className="relative">
                <Gift className="w-4 h-4 text-[#6E6962] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. ROYAL814"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full pl-9 pr-3 py-2.5 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-sm text-[#000000] font-mono uppercase focus:outline-none focus:border-[#000000]"
                />
              </div>
              {incomingReferral && (
                <span className="text-[10px] text-emerald-600 block mt-1 font-semibold">
                  ✓ Referral code applied from link (+500 Bonus Coins!)
                </span>
              )}
            </div>
          )}

          {mode === 'login' && otpSent && (
            <div>
              <label className="block text-[11px] font-bold text-[#6E6962] uppercase tracking-[0.08em] mb-1">
                Enter OTP (Demo: 1234)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6E6962] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-full bg-[#F7F4ED] border border-[#DDD6CB] text-sm text-[#000000] font-mono tracking-widest focus:outline-none focus:border-[#000000]"
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
              className="w-full py-3 rounded-full bg-[#000000] text-[#F7F4ED] font-bold text-xs uppercase tracking-[0.08em] hover:opacity-85 transition-opacity"
            >
              Send OTP
            </button>
          ) : (
            <button
              onClick={handleVerifyLogin}
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#000000] text-[#F7F4ED] font-bold text-xs uppercase tracking-[0.08em] hover:opacity-85 transition-opacity"
            >
              Verify & Enter Arena
            </button>
          )
        ) : (
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#000000] text-[#F7F4ED] font-bold text-xs uppercase tracking-[0.08em] hover:opacity-85 transition-opacity"
          >
            Claim Bonus & Register
          </button>
        )}

      </div>
    </div>
  );
};
