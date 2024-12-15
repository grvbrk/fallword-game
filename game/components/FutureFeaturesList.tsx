// TODO

import { NotepadText } from 'lucide-react';
import { Button } from './ui/button';
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

export default function FutureFeaturesList() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <NotepadText className="h-6 w-6 cursor-pointer text-[#fc6]" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#fc6] underline underline-offset-2">
            Changelogs
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
