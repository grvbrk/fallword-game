import { Trophy } from 'lucide-react';
import { DialogHeader, Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { LeaderboardDataType, UserRecord } from '../shared';

export default function LeaderBoard({
  leaderboard,
  currentUser,
}: {
  leaderboard: LeaderboardDataType;
  currentUser: UserRecord;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Trophy className="h-6 w-6 cursor-pointer hover:text-[#fc6]" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#fc6]">Leaderboard</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="singleplayer" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="singleplayer">SinglePlayer</TabsTrigger>
            <TabsTrigger value="multiplayer">Multiplayer</TabsTrigger>
          </TabsList>
          <TabsContent value="singleplayer" className="select-none">
            <Card>
              <div className="grid w-full grid-cols-4 place-items-center gap-4 p-4 text-center text-sm font-medium">
                <h4>Rank</h4>
                <h4>Player</h4>
                <h4>Games</h4>
                <h4>Wins</h4>
              </div>
              <ScrollArea className="h-60 rounded-md p-4">
                {leaderboard.singleplayer.map((user, idx) => (
                  <div
                    className="grid w-full grid-cols-4 place-items-center gap-4 text-center text-sm"
                    key={idx}
                  >
                    <div className="w-full truncate">{idx + 1}</div>
                    <div className="w-full truncate">{'u/' + user.member}</div>
                    <div className="w-full truncate">{currentUser.singleplayermatches}</div>
                    <div className="w-full truncate">{user.score}</div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </ScrollArea>
            </Card>
          </TabsContent>
          <TabsContent value="multiplayer" className="select-none">
            <Card>
              <div className="grid w-full grid-cols-4 place-items-center gap-4 p-4 text-center text-sm font-medium">
                <h4>Rank</h4>
                <h4>Player</h4>
                <h4>Games</h4>
                <h4>Wins</h4>
              </div>
              <ScrollArea className="h-60 rounded-md p-4">
                {leaderboard.multiplayer.map((user, idx) => (
                  <div
                    className="grid w-full grid-cols-4 place-items-center gap-4 text-center text-sm"
                    key={idx}
                  >
                    <div className="w-full truncate">{idx + 1}</div>
                    <div className="w-full truncate">{'u/' + user.member}</div>
                    <div className="w-full truncate">{currentUser.multiplayermatches}</div>
                    <div className="w-full truncate">{user.score}</div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
