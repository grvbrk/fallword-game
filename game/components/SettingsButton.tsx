import { ChevronLeft, ChevronRight, SettingsIcon } from 'lucide-react';
import { useGameSettings, GameSettingsType } from '../hooks/useGameConfig';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

type NavigationButtonProps = {
  options: string[];
  currentIndex: number;
  onChange: (newIndex: number) => void;
  label: string;
  disabled?: boolean;
};

export function SettingsButton() {
  const { gameSettings, setGameSettings } = useGameSettings();

  const difficulties: GameSettingsType['difficulty'][] = ['easy', 'medium', 'hard'];
  const modes: GameSettingsType['mode'][] = ['singleplayer', 'multiplayer'];

  const difficultyIndex = difficulties.indexOf(gameSettings.difficulty);
  const modeIndex = modes.indexOf(gameSettings.mode);
  const timerIndex = gameSettings.timer ? 0 : 1;

  function handleDifficultyChange(index: number) {
    setGameSettings((prev) => ({
      ...prev,
      difficulty: difficulties[index],
    }));
  }

  function handleModeChange(index: number) {
    setGameSettings((prev) => ({
      ...prev,
      mode: modes[index],
    }));
  }

  function handleTimerChange(index: number) {
    setGameSettings((prev) => ({
      ...prev,
      timer: index === 0,
    }));
  }

  const isMultiplayerMode = gameSettings.mode === 'multiplayer';

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <div className="gap flex items-center justify-center gap-1">
            <SettingsIcon className="h-6 w-6 cursor-pointer hover:text-[#fc6]" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="mr-5 w-80 bg-[#fc6] p-4 shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)]">
          <NavigationButton
            options={['Easy', 'Medium', 'Hard']}
            currentIndex={difficultyIndex}
            onChange={handleDifficultyChange}
            label="Difficulty"
            disabled={isMultiplayerMode}
          />

          <NavigationButton
            options={['Singleplayer', 'Multiplayer']}
            currentIndex={modeIndex}
            onChange={handleModeChange}
            label="Mode"
          />

          <NavigationButton
            options={['On', 'Off']}
            currentIndex={timerIndex}
            onChange={handleTimerChange}
            label="Timer"
            disabled={isMultiplayerMode}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function NavigationButton({
  options,
  currentIndex,
  onChange,
  label,
  disabled = false,
}: NavigationButtonProps) {
  const handlePrevious = () => {
    if (disabled) return;
    onChange(currentIndex === 0 ? options.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    if (disabled) return;
    onChange((currentIndex + 1) % options.length);
  };

  return (
    <div
      className={`flex items-center justify-between px-2 ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
    >
      <span className={`font-medium ${disabled ? 'text-gray-500' : 'text-black'}`}>{label}</span>
      <div className="flex items-center justify-center gap-4">
        <ChevronLeft
          className={`h-5 w-5 ${disabled ? 'cursor-not-allowed text-gray-500' : 'cursor-pointer text-black'}`}
          onClick={handlePrevious}
        />
        <span
          className={`w-24 text-center font-medium ${disabled ? 'text-gray-500' : 'text-black'}`}
        >
          {options[currentIndex]}
        </span>
        <ChevronRight
          className={`h-5 w-5 ${disabled ? 'cursor-not-allowed text-gray-500' : 'cursor-pointer text-black'}`}
          onClick={handleNext}
        />
      </div>
    </div>
  );
}
