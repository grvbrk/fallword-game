import { useEffect, useState } from 'react';
import { generateMultiplayerQuestions, sendToDevvit } from '../utils';
import { useDevvitListener } from '../hooks/useDevvitListener';
import FadeLoader from 'react-spinners/FadeLoader';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import MultiplayerGameMain from '../components/MultiplayerGameMain';
import useGameStore from '../stores';
import { UserRecord } from '../shared';
import { EthernetPort, Gauge, Hourglass, MoveLeft, Tally5 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useSetPage } from '../hooks/usePage';
import OpponentUpdatesTracker from '../components/OpponentUpdatesTracker';
import Snowfall from '../components/Snowfall';
import UserUpdatesTracker from '../components/UserUpdatesTracker';
import { motion } from 'framer-motion';

export const MultiPlayerPage = ({ currentUser }: { currentUser: UserRecord }) => {
  const [opponentFound, setOpponentFound] = useState<boolean>(false);
  const [userGameResult, setUserGameResult] = useState<'won' | 'lost' | 'tie' | null>(null);

  const [opponentGameResult, setOpponentGameResult] = useState<'won' | 'lost' | 'tie' | null>(null);

  const opponentData = useDevvitListener('FIND_OPPONENT_RESPONSE');
  const updateUserState = useGameStore((state) => state.updateUserState);
  const updateOpponentState = useGameStore((state) => state.updateOpponentState);
  const user = useGameStore((state) => state.user);
  const opponent = useGameStore((state) => state.opponent);
  const reset = useGameStore((state) => state.reset);
  const setPage = useSetPage();

  useEffect(() => {
    sendToDevvit({ type: 'FIND_OPPONENT_REQUEST' });
  }, []);

  useEffect(() => {
    if (userGameResult === 'won' && opponentGameResult === 'lost') {
      sendToDevvit({
        type: 'GAME_OVER_MULTIPLAYER',
        payload: {
          matchId: user.matchId!,
          winningUserId: user.userId!,
          winningUsername: user.username,
          loserUserId: opponent.opponentId!,
          loserUsername: opponent.opponentUsername,
        },
      });
    }
  }, [userGameResult, opponentGameResult]);

  // Uncomment this when using npm run dev
  // useEffect(() => {
  //   if (opponentData && opponentData.foundOpponent) {
  //     updateUserState({
  //       userId: currentUser.userId,
  //       username: currentUser.name,
  //       userQuestions: generateMultiplayerQuestions(),
  //       userLevel: 1,
  //       gameStatus: 'waiting',
  //       gameResult: undefined,
  //       score: 0,
  //       timeTaken: 0,
  //       matchId: opponentData.matchId,
  //     });
  //     updateOpponentState({
  //       opponentUsername: opponentData.opponentUsername,
  //       opponentLevel: 1,
  //       opponentGameStatus: 'waiting',
  //       opponentGameResult: undefined,
  //       opponentScore: 0,
  //       opponentTimeTaken: 0,
  //       opponentId: opponentData.opponentId,
  //       matchId: opponentData.matchId,
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
      gameResult: undefined,
      score: 0,
      timeTaken: 0,
    });
    updateOpponentState({
      opponentUsername: opponentData?.opponentUsername,
      opponentLevel: 1,
      opponentGameStatus: 'finished',
      opponentGameResult: undefined,
      opponentScore: 0,
      opponentTimeTaken: 0,
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
        <div className="flex max-w-[700px] flex-col md:w-[900px]">
          <div className="flex items-center justify-center">
            <UserUpdatesTracker
              userGameResult={userGameResult}
              setUserGameResult={setUserGameResult}
            />
            <div className="z-50 flex flex-col pt-16">
              <MultiplayerGameMain />
            </div>
            <OpponentUpdatesTracker
              opponentGameResult={opponentGameResult}
              setOpponentGameResult={setOpponentGameResult}
            />
          </div>
          {user.gameStatus === 'finished' && opponent.opponentGameStatus === 'finished' ? (
            <motion.div
              className="z-50 flex h-full w-full items-center justify-center"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                className="w-52 bg-[#fc6]"
                onClick={() => {
                  reset();
                  setPage('home');
                }}
              >
                <MoveLeft />
                Return to Main Menu
              </Button>
            </motion.div>
          ) : null}
        </div>
      ) : (
        <FindingOppLoading opponentData={opponentData} />
      )}
    </div>
  );
};

function FindingOppLoading({
  opponentData,
}: {
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
  const { gameStatus, score, timeTaken, userLevel } = useGameStore((state) => state.user);

  return (
    <Card className="border-none shadow-none">
      <CardContent className="relative mt-6 grid gap-6">
        <div className="flex items-center">
          <motion.div
            className="z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="mx-5 border-none bg-[#fc6] shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)]">
              <CardContent className="flex w-44 flex-col px-4 py-2 text-black">
                <div className="flex items-center justify-between text-center">
                  <div className="flex w-full items-center justify-start gap-1 font-bold">
                    <EthernetPort className="h-3 w-3" />
                    <p>Status</p>
                  </div>
                  <p className="w-full text-right text-sm">{gameStatus}</p>
                </div>
                <div className="flex items-center justify-between text-center">
                  <div className="flex w-full items-center justify-start gap-1 font-bold">
                    <Tally5 className="h-3 w-3" />
                    <p>Score</p>
                  </div>
                  <p className="w-full text-right text-sm">{score}</p>
                </div>
                <div className="flex items-center justify-between text-center">
                  <div className="flex w-full items-center justify-start gap-1 font-bold">
                    <Hourglass className="h-3 w-3" />
                    <p>Time</p>
                  </div>
                  <p className="w-full text-right text-sm">{timeTaken}s</p>
                </div>
                <div className="flex items-center justify-between text-center">
                  <div className="flex w-full items-center justify-start gap-1 font-bold">
                    <Gauge className="h-3 w-3" />
                    <p>Level</p>
                  </div>
                  <p className="w-full text-right text-sm">{userLevel}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="relative flex w-[150px] flex-col overflow-hidden border-none shadow-none">
              <CardHeader className="transition-all duration-300 ease-out hover:scale-[0.95] hover:blur-sm">
                <img src={'/default_snoovatar.png'} alt="Snooavtar main" />
              </CardHeader>
            </Card>
          </motion.div>
          <div className="px-8 text-4xl">VS</div>
          <div className="z-50 flex flex-col items-center justify-self-center">
            {opponentData === undefined ? (
              <>
                <motion.div
                  className="ml-10 px-10"
                  initial={{ opacity: 0, y: -25 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FadeLoader color="#fc6" />
                </motion.div>
              </>
            ) : (
              <motion.div
                className="px-10"
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Opponent not found
              </motion.div>
            )}
          </div>
        </div>
        {opponentData != undefined && (
          <motion.div
            className="absolute bottom-0 z-50 flex w-full justify-center"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              className="w-52 bg-[#fc6]"
              onClick={() => {
                setPage('home');
              }}
            >
              <MoveLeft />
              Return to Main Menu
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
