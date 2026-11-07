import React, { createContext, useContext, useState } from 'react';
import { sound } from '../utils/audio';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playDiceRoll: () => void;
  playTokenStep: () => void;
  playCapture: () => void;
  playSixRolled: () => void;
  playTokenHome: () => void;
  playVictory: () => void;
  playClick: () => void;
  playTimerTick: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  const toggleMute = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        playDiceRoll: () => sound.playDiceRoll(),
        playTokenStep: () => sound.playTokenStep(),
        playCapture: () => sound.playCapture(),
        playSixRolled: () => sound.playSixRolled(),
        playTokenHome: () => sound.playTokenHome(),
        playVictory: () => sound.playVictory(),
        playClick: () => sound.playClick(),
        playTimerTick: () => sound.playTimerTick(),
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

