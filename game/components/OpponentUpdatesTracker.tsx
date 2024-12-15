import { useEffect } from 'react';
import { useDevvitListener } from '../hooks/useDevvitListener';
import useGameStore from '../stores';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

export default function OpponentUpdatesTracker() {
  const { opponent, updateOpponentState } = useGameStore();

  const opponentLifeLostUpdate = useDevvitListener('OPPONENT_LIFE_LOST');
  const opponentGameOverUpdate = useDevvitListener('GAME_OVER');

  useEffect(() => {
    if (opponentLifeLostUpdate) {
      updateOpponentState({
        opponentLives: opponentLifeLostUpdate.livesRemaining,
        opponentGameStatus: 'in-progress',
      });
    }
  }, [opponentLifeLostUpdate]);

  useEffect(() => {
    if (opponentGameOverUpdate) {
      updateOpponentState({
        opponentGameStatus: opponentGameOverUpdate.status,
      });
    }
  }, [opponentGameOverUpdate]);

  return (
    <div className="flex flex-col">
      <Card className="mx-5 border-none bg-[#fc6] shadow-none">
        <CardHeader className="text-black">
          <CardTitle className="text-sm font-medium">grvbrk</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 p-0 text-black"></CardContent>
      </Card>
      <Card className="relative flex w-[150px] flex-col overflow-hidden border-none shadow-none">
        <CardHeader className="transition-all duration-300 ease-out hover:scale-[0.95] hover:blur-sm">
          <img src={'/default_snoovatar.png'} alt="Snooavtar main" />
        </CardHeader>
      </Card>
    </div>
  );
}
