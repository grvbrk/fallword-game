import { useEffect, useState } from 'react';
import { generateMultiplayerQuestions, sendToDevvit } from '../utils';
import { useDevvitListener } from '../hooks/useDevvitListener';
import SquareLoader from 'react-spinners/SquareLoader';
import { Card, CardContent } from '../components/ui/card';
import MultiplayerGameMain from '../components/MultiplayerGameMain';
import useGameStore from '../stores';
import { UserRecord } from '../shared';
import { MoveLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useSetPage } from '../hooks/usePage';
import OpponentUpdatesTracker from '../components/OpponentUpdatesTracker';
import Snowfall from '../components/Snowfall';
import UserUpdatesTracker from '../components/UserUpdatesTracker';

export const MultiPlayerPage = ({ currentUser }: { currentUser: UserRecord }) => {
  const [opponentFound, setOpponentFound] = useState<boolean>(false);
  const opponentData = useDevvitListener('FIND_OPPONENT_RESPONSE');
  const updateUserState = useGameStore((state) => state.updateUserState);
  const updateOpponentState = useGameStore((state) => state.updateOpponentState);

  useEffect(() => {
    sendToDevvit({ type: 'FIND_OPPONENT_REQUEST' });
  }, []);

  // Uncomment this when using npm run dev
  // useEffect(() => {
  //   if (opponentData && opponentData.foundOpponent) {
  //     updateUserState({
  //       username: currentUser.name,
  //       userQuestions: generateMultiplayerQuestions(),
  //       userLevel: 1,
  //       gameStatus: 'waiting',
  //       isGameOver: false,
  //       score: 0,
  //       timeTaken: 0,
  //     });
  //     updateOpponentState({
  //       opponentUsername: opponentData?.opponentId,
  //       opponentLives: 5,
  //       opponentLevel: 1,
  //       opponentGameStatus: 'waiting',
  //     });
  //     setOpponentFound(true);
  //   } else {
  //     setOpponentFound(false);
  //   }
  // }, [opponentData]);

  // Uncomment this when using npm run vite

  useEffect(() => {
    updateUserState({
      username: currentUser.name,
      userQuestions: generateMultiplayerQuestions(),
      userLevel: 1,
      gameStatus: 'waiting',
      isGameOver: false,
      score: 0,
      timeTaken: 0,
    });
    updateOpponentState({
      opponentUsername: opponentData?.opponentUsername,
      opponentLives: 5,
      opponentLevel: 1,
      opponentGameStatus: 'waiting',
    });
    setOpponentFound(true);
  }, []);

  return (
    <div
      className="flex h-full flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat text-white"
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
      {opponentFound ? (
        <div className="flex items-center justify-center gap-10">
          <UserUpdatesTracker />
          <div className="z-50 flex h-[550px] flex-col items-center pt-16">
            <MultiplayerGameMain />
          </div>
          <OpponentUpdatesTracker />
        </div>
      ) : (
        <FindingOppLoading currentUser={currentUser} opponentData={opponentData} />
      )}
    </div>
  );
};

function FindingOppLoading({
  currentUser,
  opponentData,
}: {
  currentUser: UserRecord;
  opponentData:
    | {
        foundOpponent: boolean;
        postId?: string;
        opponentId?: string;
        opponentUsername?: string;
      }
    | undefined;
}) {
  const setPage = useSetPage();

  return (
    <Card className="border-none">
      <CardContent className="mt-6 grid gap-6">
        {opponentData === undefined ? (
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              {/* TODO: Add Reddit user Avatar here */}
              {/* <Avatar>
              <AvatarFallback>OM</AvatarFallback>
            </Avatar> */}
              <div>
                <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                <p className="text-sm text-muted-foreground">wins: 0</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div>
                <h1>VS</h1>
              </div>
              <SquareLoader size={15} color="white" />
            </div>
          </div>
        ) : (
          <div>
            <h1>Opponent Not Found!</h1>
            <Button
              className="bg-[#fc6]"
              onClick={() => {
                setPage('home');
              }}
            >
              <MoveLeft />
              Return to Main Menu
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
