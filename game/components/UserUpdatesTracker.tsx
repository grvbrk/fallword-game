import useGameStore from '../stores';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function UserUpatesTracker() {
  const { username, gameStatus, isGameOver, score, timeTaken, userLevel } = useGameStore(
    (state) => state.user
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="mx-5 border-none bg-[#fc6] shadow-none">
        <CardHeader className="py-2 text-black">
          <CardTitle className="text-sm font-medium">{username ?? 'grvbrk'}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col py-2 text-left text-black">
          <p>Game Status: {gameStatus}</p>
          <p>{isGameOver ? 'Game Over' : 'Game In Progress'}</p>
          <p>Score: {score}</p>
          <p>Time Taken: {timeTaken}</p>
          <p>Level: {userLevel}</p>
        </CardContent>
      </Card>
      <Card className="relative flex w-[150px] flex-col overflow-hidden border-none shadow-none">
        <CardHeader className="transition-all duration-300 ease-out hover:scale-[0.95] hover:blur-sm">
          <img src={'/default_snoovatar.png'} alt="Snooavtar main" />
        </CardHeader>
      </Card>
    </div>
  );
}
