import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  loginWithPhone: (phone: string, otp: string) => Promise<{ success: boolean; message?: string }>;
  registerUser: (phone: string, username: string, referralCode?: string) => Promise<{ success: boolean; message?: string }>;
  loginAsDemo: (demoIndex: number) => void;
  logout: () => void;
  updateCoins: (coins: number, bonusCoins?: number, winCoins?: number) => void;
  updateProfile: (updated: Partial<User>) => void;
  incomingReferral: string | null;
  setIncomingReferral: (code: string | null) => void;
}

export const DEMO_USERS: User[] = [
  {
    id: 'user_king_1',
    phone: '9876543210',
    username: 'King_Maharaja',
    playerTag: '#RL-10001',
    avatar: '👑',
    referralCode: 'ROYAL814',
    coins: 5000,
    bonusCoins: 1200,
    winCoins: 3800,
    totalMatches: 48,
    wins: 36,
    losses: 12,
    winRate: 75,
    role: 'admin',
    createdAt: '2024-01-10T10:00:00.000Z',
    status: 'active',
  },
  {
    id: 'user_queen_2',
    phone: '9876543211',
    username: 'Queen_Maharani',
    playerTag: '#RL-10002',
    avatar: '👸',
    referralCode: 'QUEEN288',
    referredBy: 'ROYAL814',
    coins: 3500,
    bonusCoins: 800,
    winCoins: 2700,
    totalMatches: 35,
    wins: 24,
    losses: 11,
    winRate: 68,
    role: 'player',
    createdAt: '2024-02-15T12:00:00.000Z',
    status: 'active',
  },
  {
    id: 'user_knight_3',
    phone: '9876543212',
    username: 'Knight_Vikram',
    playerTag: '#RL-10003',
    avatar: '⚔️',
    referralCode: 'KNIGHT99',
    referredBy: 'ROYAL814',
    coins: 2200,
    bonusCoins: 400,
    winCoins: 1800,
    totalMatches: 22,
    wins: 14,
    losses: 8,
    winRate: 63,
    role: 'player',
    createdAt: '2024-03-01T14:00:00.000Z',
    status: 'active',
  },
  {
    id: 'user_bishop_4',
    phone: '9876543213',
    username: 'Master_Arjun',
    playerTag: '#RL-10004',
    avatar: '🏹',
    referralCode: 'ARJUN777',
    coins: 1500,
    bonusCoins: 500,
    winCoins: 1000,
    totalMatches: 18,
    wins: 9,
    losses: 9,
    winRate: 50,
    role: 'player',
    createdAt: '2024-03-12T16:00:00.000Z',
    status: 'active',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [incomingReferral, setIncomingReferral] = useState<string | null>(null);

  useEffect(() => {
    // Check referral query param or url path
    const urlParams = new URLSearchParams(window.location.search);
    const referParam = urlParams.get('refer') || urlParams.get('ref');
    if (referParam) {
      setIncomingReferral(referParam);
      localStorage.setItem('royal_ludo_referral', referParam);
    } else {
      const savedRefer = localStorage.getItem('royal_ludo_referral');
      if (savedRefer) setIncomingReferral(savedRefer);
    }

    // Check stored user session
    const storedUser = localStorage.getItem('royal_ludo_user');
    const storedToken = localStorage.getItem('royal_ludo_token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        setUser(DEMO_USERS[0]);
        setToken('token_demo_0');
      }
    } else {
      // Default to King Maharaja for initial demo experience
      setUser(DEMO_USERS[0]);
      setToken('token_demo_0');
      localStorage.setItem('royal_ludo_user', JSON.stringify(DEMO_USERS[0]));
      localStorage.setItem('royal_ludo_token', 'token_demo_0');
    }
    setLoading(false);
  }, []);

  const loginWithPhone = async (phone: string, otp: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('royal_ludo_user', JSON.stringify(data.user));
        localStorage.setItem('royal_ludo_token', data.token);
        setLoading(false);
        return { success: true };
      } else {
        // Fallback for offline demo mode
        const existing = DEMO_USERS.find(u => u.phone === phone);
        const loggedUser = existing || {
          id: `user_${Date.now()}`,
          phone,
          username: `Player_${phone.slice(-4)}`,
          playerTag: `#RL-${Math.floor(10000 + Math.random() * 90000)}`,
          avatar: '🎲',
          referralCode: `REF${Math.floor(1000 + Math.random() * 9000)}`,
          coins: 2000,
          bonusCoins: 500,
          winCoins: 1500,
          totalMatches: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
          role: 'player',
          createdAt: new Date().toISOString(),
          status: 'active',
        } as User;

        setUser(loggedUser);
        setToken(`token_${loggedUser.id}`);
        localStorage.setItem('royal_ludo_user', JSON.stringify(loggedUser));
        localStorage.setItem('royal_ludo_token', `token_${loggedUser.id}`);
        setLoading(false);
        return { success: true };
      }
    } catch {
      // Simulated graceful fallback
      const loggedUser = DEMO_USERS[0];
      setUser(loggedUser);
      setToken('token_demo_0');
      setLoading(false);
      return { success: true };
    }
  };

  const registerUser = async (phone: string, username: string, referralCode?: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    const newUser: User = {
      id: `user_${Date.now()}`,
      phone,
      username: username.trim() || `Player_${phone.slice(-4)}`,
      playerTag: `#RL-${Math.floor(10000 + Math.random() * 90000)}`,
      avatar: '👑',
      referralCode: `ROYAL${Math.floor(1000 + Math.random() * 9000)}`,
      referredBy: referralCode || incomingReferral || undefined,
      coins: referralCode || incomingReferral ? 2500 : 2000, // 500 coin referral bonus!
      bonusCoins: referralCode || incomingReferral ? 1000 : 500,
      winCoins: 0,
      totalMatches: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      role: 'player',
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    setUser(newUser);
    setToken(`token_${newUser.id}`);
    localStorage.setItem('royal_ludo_user', JSON.stringify(newUser));
    localStorage.setItem('royal_ludo_token', `token_${newUser.id}`);
    setLoading(false);
    return { success: true };
  };

  const loginAsDemo = (demoIndex: number) => {
    const demo = DEMO_USERS[demoIndex % DEMO_USERS.length];
    setUser(demo);
    setToken(`token_demo_${demoIndex}`);
    localStorage.setItem('royal_ludo_user', JSON.stringify(demo));
    localStorage.setItem('royal_ludo_token', `token_demo_${demoIndex}`);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('royal_ludo_user');
    localStorage.removeItem('royal_ludo_token');
  };

  const updateCoins = (coins: number, bonusCoins?: number, winCoins?: number) => {
    if (!user) return;
    const updated: User = {
      ...user,
      coins,
      bonusCoins: bonusCoins !== undefined ? bonusCoins : user.bonusCoins,
      winCoins: winCoins !== undefined ? winCoins : user.winCoins,
    };
    setUser(updated);
    localStorage.setItem('royal_ludo_user', JSON.stringify(updated));
  };

  const updateProfile = (updatedProps: Partial<User>) => {
    if (!user) return;
    const updated: User = { ...user, ...updatedProps };
    setUser(updated);
    localStorage.setItem('royal_ludo_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginWithPhone,
        registerUser,
        loginAsDemo,
        logout,
        updateCoins,
        updateProfile,
        incomingReferral,
        setIncomingReferral,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

