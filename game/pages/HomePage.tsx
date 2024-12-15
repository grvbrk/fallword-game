import { useSetPage } from '../hooks/usePage';
import Snowfall from '../components/Snowfall';
import NeoButton from '../components/ui/neo-button';
import { cn } from '../utils';
import { useState } from 'react';
import { useGameSettings } from '../hooks/useGameConfig';
import { MoveRight } from 'lucide-react';
import { LeaderboardDataType, UserRecord } from '../shared';
import { HowToPlayInfo } from '../components/HowToPlayInfo';
import { SettingsButton } from '../components/SettingsButton';
import Changelog from '../components/Changelog';
import ActiveUsers from '../components/ActiveUsers';
import CurrentPlayerCard from '../components/CurrentPlayerCard';
import LeaderBoard from '../components/LeaderBoard';

export const HomePage = ({
  usersCount,
  currentUser,
  Leaderboard,
}: {
  usersCount: number;
  currentUser: UserRecord;
  Leaderboard: LeaderboardDataType;
}) => {
  const setPage = useSetPage();
  const { gameSettings } = useGameSettings();
  const [activeKey, setActiveKey] = useState<boolean>(false);

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url("/bg1.png")`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      <Snowfall />
      <div className="z-50 flex w-[550px] items-center justify-end gap-4">
        <ActiveUsers userCount={usersCount} />
        <Changelog />
        <SettingsButton />
        <LeaderBoard leaderboard={Leaderboard} currentUser={currentUser} />
      </div>

      <div className="z-50 mb-5 flex select-none flex-col items-center font-game3">
        <p className="text-7xl">FallWord</p>
        <p className="m-0 text-[#fc6]">Pssst... We hate vowels!</p>
      </div>

      <CurrentPlayerCard currentUser={currentUser} />

      <div className="z-50 flex gap-8">
        <HowToPlayInfo />
        <NeoButton
          className={cn(
            `flex w-40 select-none gap-2 border-black bg-[#fc6] py-2 text-base text-slate-900 shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] transition-all`,
            activeKey ? 'translate-x-boxShadowX translate-y-boxShadowY shadow-none' : ''
          )}
          onMouseDown={() => {
            setActiveKey(true);
          }}
          onMouseUp={() => {
            setActiveKey(false);
            if (gameSettings.mode === 'singleplayer') {
              setPage('singleplayerGame');
            }
            if (gameSettings.mode === 'multiplayer') {
              setPage('multiplayerGame');
            }
          }}
        >
          Start Game
          <MoveRight size={20} />
        </NeoButton>
      </div>
    </div>
  );
};
