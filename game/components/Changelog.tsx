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
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardHeader } from './ui/card';

export default function Changelog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <NotepadText className="h-6 w-6 cursor-pointer hover:text-[#fc6]" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#fc6] underline underline-offset-2">
            Changelogs
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="rounded-md px-4 pb-2">
          <div className="flex max-h-60 flex-col items-center text-sm text-muted-foreground">
            <div className="mr-auto mt-2">
              <p className="font-bold text-[#fc6]">v0.0.1 - INIT</p>
              <p className="-mt-1 text-[10px]">17 December, 2024</p>
            </div>
            <p className="mr-auto">
              This version launches the FallWord game to devvit. The game implements:
            </p>
            <div className="list-disc [&:not(:first-child)]:my-2">
              <li>Two Game Modes - Singleplayer and Multiplayer</li>
              <li>Singleplayer and Multiplayer Leaderboards</li>
              <li>Realtime multilplayer matches</li>
              <li>Realtime opponent state updates</li>
            </div>
            <Card className="mt-4 max-w-72 border-dashed border-[#fc6]">
              <CardHeader className="mr-auto p-4 font-bold text-[#fc6]">
                Updates planned for later verisons
              </CardHeader>
              <CardContent>
                <div className="flex list-disc flex-col flex-wrap [&:not(:first-child)]:my-2">
                  <li>Multiplayer game history</li>
                  <li>Sound effects</li>
                  <li>Game room logic</li>
                  <li>Private matches</li>
                  <li>Spectate matches</li>
                  <li>Better UI/UX</li>
                  <li>Better error handling</li>
                </div>
              </CardContent>
            </Card>
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
