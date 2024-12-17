import { ScrollText } from 'lucide-react';
import { Button } from './ui/button';
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogTitle,
} from './ui/dialog';
import { useState } from 'react';
import { cn } from '../utils';
import { ScrollArea } from './ui/scroll-area';

export function HowToPlayInfo() {
  const [howToPlayKey, setHowToPlayKey] = useState<boolean>(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            `flex w-44 cursor-pointer select-none items-center justify-center gap-2 rounded-base border border-black bg-white py-2 font-base text-black shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] transition-all dark:shadow-dark`,
            howToPlayKey ? 'translate-x-boxShadowX translate-y-boxShadowY shadow-none' : ''
          )}
          onMouseDown={() => {
            setHowToPlayKey(true);
          }}
          onMouseUp={() => {
            setHowToPlayKey(false);
          }}
        >
          How to Play?
          <ScrollText size={19} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#fc6] underline underline-offset-2">
            How to Play
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="rounded-md px-4 pb-2">
          <div className="flex max-h-60 flex-col items-center text-sm text-muted-foreground">
            <p className="mr-auto">
              FallWord is a quiz based game where you have to guess the correct answers to
              questions. The answer can be a phrase, a word, or just a letter. We hate vowels here
              hence we show all the vowels in the answer right at the start!
            </p>
            <p className="mr-auto mt-1">
              FallWord has two game modes - SinglePlayer and Multiplayer.
            </p>
            <p className="my-2 mr-auto font-bold text-[#fc6]">Singleplayer</p>
            <p className="mr-auto">
              In singleplayer mode, you will be presented with a random question based on your
              chosen difficulty level. Your task is to guess the correct answer/word/phrase (within
              the time limit, if the timer is enabled). Difficulty levels - easy, medium, hard. Time
              - 60 seconds.
            </p>
            <p className="my-2 mr-auto font-bold text-[#fc6]">Multiplayer</p>
            <p className="mr-auto">
              In multiplayer mode, you will be paired with another online player. You and your
              opponent will have to climb through 5 levels of questions. The levels descriptions are
              as follows:
            </p>
            <ul className="list-disc [&:not(:first-child)]:my-2">
              <li>Level 1: Easy, 60 seconds</li>
              <li>Level 2: Easy, 60 seconds</li>
              <li>Level 3: Medium, 45 seconds</li>
              <li>Level 4: Medium, 45 seconds</li>
              <li>Level 5: Hard, 30 seconds</li>
            </ul>
            <p className="mr-auto">
              After each level, based on whether you guessed the answer correctly or not, you will
              get a score (+1 for correct, 0 for wrong and timeout). All 5 levels will be played
              irrespective of whether you win or lose.
            </p>

            <p className="mr-auto mt-1">
              After the game ends, you and your opponent scores will be tallied up. Person with the
              highest score and with the lowest time taken will win.
            </p>
            <p className="my-2 mr-auto font-bold text-[#fc6]">Leaderboard</p>
            <p className="mr-auto">
              Singleplayer and Multiplayer leaderboard will be updated after every singleplayer or
              multiplayer game. Incase, the leaderboard doesn't reflect the last game score,{' '}
              <span className="font-bold">please refresh the page.</span>
            </p>
          </div>
        </ScrollArea>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="border border-[#fc6] bg-black text-[#fc6]"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
