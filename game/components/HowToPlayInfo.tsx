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

export function HowToPlayInfo() {
  const [howToPlayKey, setHowToPlayKey] = useState<boolean>(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            `flex w-44 cursor-pointer select-none items-center justify-center gap-2 rounded-base border border-black bg-white py-2 text-black shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] transition-all dark:shadow-dark`,
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
          {/* <DialogDescription>General game info</DialogDescription> */}
        </DialogHeader>
        <div className="flex max-h-60 flex-col items-center overflow-y-auto text-sm text-muted-foreground">
          <p className="mr-auto">The game offers:</p>

          <ul className="list-disc [&:not(:first-child)]:mt-2">
            <li>2 Game Modes: Single Player and Multiplayer</li>
            <li>3 Difficulty Levels: Easy, Medium, Hard</li>
            <li>1 Optional Timer</li>
          </ul>
          <p className="[&:not(:first-child)]:mt-2">
            You will be presented with a random question based on the chosen difficulty level. Your
            task is to guess the correct answer/word/phrase (within the time limit, if the timer is
            enabled).
          </p>
          <p className="[&:not(:first-child)]:mt-2">
            After each round, you can play again or return to the main menu. You can play as many
            rounds as you want since the game has a large pool of questions for all difficulty
            levels.
          </p>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
