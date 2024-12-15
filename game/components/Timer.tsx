import { useEffect } from 'react';
import { Clock4 } from 'lucide-react';

export default function Timer({
  timeRemaining,
  setTimeRemaining,
  handleTimeEnd,
  isGameOver,
}: {
  timeRemaining: number;
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>;
  handleTimeEnd: () => void;
  isGameOver: boolean;
}) {
  useEffect(() => {
    if (isGameOver) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          handleTimeEnd();
          clearInterval(intervalId);
          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isGameOver]);

  return (
    <div className="flex items-center justify-center gap-2">
      <Clock4 className="h-5 w-5" /> {formatTime(timeRemaining)}
    </div>
  );
}

function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
