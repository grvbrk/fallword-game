import { motion } from 'framer-motion';
import useGameStore from '../stores';
import { CardContent } from './ui/card';
import { EthernetPort, Gauge, Hourglass, Tally5 } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '../utils';

export default function UserUpatesTracker({
  userGameResult,
  setUserGameResult,
}: {
  userGameResult: 'won' | 'lost' | 'tie' | null;
  setUserGameResult: React.Dispatch<React.SetStateAction<'won' | 'lost' | 'tie' | null>>;
}) {
  const { gameStatus, score, timeTaken, userLevel } = useGameStore((state) => state.user);

  const { opponentGameStatus, opponentScore, opponentTimeTaken } = useGameStore(
    (state) => state.opponent
  );

  useEffect(() => {
    if (opponentGameStatus === 'finished' && gameStatus === 'finished') {
      if (score > opponentScore) {
        setUserGameResult('won');
      } else if (timeTaken < opponentTimeTaken) {
        setUserGameResult('won');
      } else if (score === opponentScore && timeTaken === opponentTimeTaken) {
        setUserGameResult('tie');
      } else {
        setUserGameResult('lost');
      }
    }
  }, [opponentGameStatus, gameStatus]);

  return (
    <motion.div
      className="z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        layout
        className={cn(
          'mx-5 rounded-xl border-none bg-[#fc6] text-black shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)]',
          userGameResult === 'won'
            ? 'bg-[green] text-white'
            : userGameResult === 'lost' && 'bg-[red] text-white'
        )}
      >
        <CardContent className="flex flex-col p-4">
          <div className="flex w-[130px] items-center justify-between gap-4 text-center text-sm md:w-full">
            <div className="flex w-full items-center justify-start gap-1 font-bold">
              <EthernetPort className="h-3 w-3" />
              <p>Status</p>
            </div>
            <p className="w-full truncate text-right">{gameStatus}</p>
          </div>
          <div className="flex items-center justify-between gap-4 text-center text-sm">
            <div className="flex w-full items-center justify-start gap-1 font-bold">
              <Tally5 className="h-3 w-3" />
              <p>Score</p>
            </div>
            <p className="w-full text-right">{score}</p>
          </div>
          <div className="flex items-center justify-between gap-4 text-center text-sm">
            <div className="flex w-full items-center justify-start gap-1 font-bold">
              <Hourglass className="h-3 w-3" />
              <p>Time</p>
            </div>
            <p className="w-full text-right">{timeTaken}s</p>
          </div>
          <div className="flex items-center justify-between gap-4 text-center text-sm">
            <div className="flex w-full items-center justify-start gap-1 font-bold">
              <Gauge className="h-3 w-3" />
              <p>Level</p>
            </div>
            <p className="w-full text-right">{userLevel}</p>
          </div>
        </CardContent>
      </motion.div>
      <motion.div
        layout
        className={cn(
          'relative flex w-[150px] border-none p-6 shadow-none',
          userGameResult === 'won' && 'w-[200px]'
        )}
      >
        {userGameResult === 'won' && (
          <div className="absolute inset-0 z-10 animate-pulse rounded-xl bg-[#fc6]/70 blur-2xl" />
        )}
        {/* <div className="z-20 transition-all duration-300 ease-out hover:scale-[0.95] hover:blur-sm"> */}
        <img src={'/default_snoovatar.png'} alt="Snooavtar main" className="z-20" />
        {/* </div> */}
      </motion.div>
    </motion.div>
  );
}
