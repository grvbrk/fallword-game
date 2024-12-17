import { useEffect } from 'react';
import { useDevvitListener } from '../hooks/useDevvitListener';
import useGameStore from '../stores';
import { Card, CardHeader, CardContent } from './ui/card';
import { motion } from 'framer-motion';
import { EthernetPort, Tally5, Hourglass, Gauge } from 'lucide-react';

export default function OpponentUpdatesTracker({
  opponentGameResult,
  setOpponentGameResult,
}: {
  opponentGameResult: 'won' | 'lost' | 'tie' | null;
  setOpponentGameResult: React.Dispatch<React.SetStateAction<'won' | 'lost' | 'tie' | null>>;
}) {
  const { user, opponent, updateOpponentState } = useGameStore();

  const opponentGameUpdate = useDevvitListener('OPPONENT_GAME_UPDATES_RESPONSE');

  useEffect(() => {
    if (opponentGameUpdate) {
      if (opponentGameUpdate.opponentGameStatus === 'finished' && user.gameStatus === 'finished') {
        if (user.score < opponentGameUpdate.opponentScore) {
          setOpponentGameResult('won');
        } else if (user.timeTaken > opponentGameUpdate.opponentTimeTaken) {
          setOpponentGameResult('won');
        } else if (
          user.score === opponentGameUpdate.opponentScore &&
          user.timeTaken === opponentGameUpdate.opponentTimeTaken
        ) {
          setOpponentGameResult('tie');
        } else {
          setOpponentGameResult('lost');
        }
      }
      console.log('game updates recieved from', opponentGameUpdate.opponentUsername);
      console.log(opponentGameUpdate);
      updateOpponentState(opponentGameUpdate);
    }
  }, [opponentGameUpdate, user.gameStatus]);

  return (
    <motion.div
      className="z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {opponentGameResult != null && opponentGameResult}
      {/* lost   */}
      <Card className="mx-5 border-none bg-[#fc6] shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)]">
        <CardContent className="flex flex-col p-4 text-black">
          <div className="flex w-[130px] items-center justify-between gap-4 text-center text-sm md:w-full">
            <div className="flex w-full items-center justify-start gap-1 font-bold">
              <EthernetPort className="h-3 w-3" />
              <p>Status</p>
            </div>
            <p className="w-full truncate text-right">{opponent.opponentGameStatus}</p>
          </div>
          <div className="flex items-center justify-between gap-4 text-center text-sm">
            <div className="flex w-full items-center justify-start gap-1 font-bold">
              <Tally5 className="h-3 w-3" />
              <p>Score</p>
            </div>
            <p className="w-full text-right">{opponent.opponentScore}</p>
          </div>
          <div className="flex items-center justify-between gap-4 text-center text-sm">
            <div className="flex w-full items-center justify-start gap-1 font-bold">
              <Hourglass className="h-3 w-3" />
              <p>Time</p>
            </div>
            <p className="w-full text-right">{opponent.opponentTimeTaken}s</p>
          </div>
          <div className="flex items-center justify-between gap-4 text-center text-sm">
            <div className="flex w-full items-center justify-start gap-1 font-bold">
              <Gauge className="h-3 w-3" />
              <p>Level</p>
            </div>
            <p className="w-full text-right">{opponent.opponentLevel}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="relative flex w-[150px] border-none shadow-none">
        <CardHeader className="transition-all duration-300 ease-out hover:scale-[0.95] hover:blur-sm">
          <img src={'/default_snoovatar.png'} alt="Snooavtar main" />
        </CardHeader>
      </Card>
    </motion.div>
  );
}
