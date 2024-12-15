import { LeaderboardDataType, Page, UserRecord } from './shared';
import { SinglePlayerPage } from './pages/SinglePlayerPage';
import { HomePage } from './pages/HomePage';
import { MultiPlayerPage } from './pages/MultiPlayerPage';

import { usePage } from './hooks/usePage';
import { useEffect, useState } from 'react';
import { sendToDevvit } from './utils';
import { useDevvitListener } from './hooks/useDevvitListener';

const getPage = (
  page: Page,
  {
    usersCount,
    currentUser,
    Leaderboard,
  }: { usersCount: number; currentUser: UserRecord; Leaderboard: LeaderboardDataType }
) => {
  switch (page) {
    case 'home':
      return (
        <HomePage usersCount={usersCount} currentUser={currentUser} Leaderboard={Leaderboard} />
      );
    case 'singleplayerGame':
      return <SinglePlayerPage currentUser={currentUser} />;
    case 'multiplayerGame':
      return <MultiPlayerPage currentUser={currentUser} />;
    default:
      throw new Error(`Unknown page: ${page}`);
  }
};

export const App = () => {
  const [usersCount, setUsersCount] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<UserRecord>({} as UserRecord);
  const [Leaderboard, setLeaderboard] = useState<LeaderboardDataType>({
    singleplayer: [],
    multiplayer: [],
  });
  const page = usePage();
  const initData = useDevvitListener('INIT_RESPONSE');
  const userJoined = useDevvitListener('USER_JOINED');
  const userDisconn = useDevvitListener('USER_DISCONN');
  const userStatsData = useDevvitListener('USER_STATS_UPDATED');
  const leaderboardData = useDevvitListener('LEADERBOARD_UPDATE');

  useEffect(() => {
    sendToDevvit({ type: 'INIT' });
  }, []);

  useEffect(() => {
    if (initData) {
      setUsersCount(initData.activeUsersCount);
      setCurrentUser(initData.userData);
    }

    if (userJoined) {
      setUsersCount(userJoined.activeUsersCount);
    }

    if (userDisconn) {
      setUsersCount(userDisconn.activeUsersCount);
    }

    if (userStatsData) {
      setCurrentUser((data) => ({ ...data, stats: userStatsData.stats }));
    }

    if (leaderboardData) {
      setLeaderboard(leaderboardData);
    }
  }, [initData, userJoined, userDisconn, userStatsData, leaderboardData]);

  return <div className="h-full">{getPage(page, { usersCount, currentUser, Leaderboard })}</div>;
};
