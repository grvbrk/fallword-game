import { createContext, useContext, useState } from 'react';

export type GameSettingsType = {
  difficulty: 'easy' | 'medium' | 'hard';
  timer: boolean;
  gameTimeInSeconds: number;
  timeTakenInSeconds: number;
  isGameOver: boolean;
  startingLives: number;
  livesRemaining: number;
  currentStreak: number;
  mode: 'singleplayer' | 'multiplayer';
};

type GameSettingsContextType = {
  gameSettings: GameSettingsType;
  setGameSettings: React.Dispatch<React.SetStateAction<GameSettingsType>>;
};

const GameSettingsContext = createContext<GameSettingsContextType | null>(null);

export default function GameSettingsProvider({ children }: { children: React.ReactNode }) {
  const [gameSettings, setGameSettings] = useState<GameSettingsType>({
    timer: false,
    difficulty: 'easy',
    gameTimeInSeconds: 60,
    timeTakenInSeconds: 0,
    isGameOver: false,
    startingLives: 5,
    livesRemaining: 5,
    currentStreak: 0,
    mode: 'singleplayer',
  });

  return (
    <GameSettingsContext.Provider value={{ gameSettings, setGameSettings }}>
      {children}
    </GameSettingsContext.Provider>
  );
}

export const useGameSettings = () => {
  const context = useContext(GameSettingsContext);
  if (context === null) {
    throw new Error('useGameSettings must be used within a GameSettingsProvider');
  }
  return { gameSettings: context.gameSettings, setGameSettings: context.setGameSettings };
};
