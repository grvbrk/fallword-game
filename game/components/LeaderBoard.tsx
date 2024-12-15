import { Trophy } from 'lucide-react';
import { DialogHeader, Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { LeaderboardDataType } from '../shared';

export default function LeaderBoard({ leaderboard }: { leaderboard: LeaderboardDataType }) {
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
              <div className="flex w-full items-center justify-evenly gap-4">
                <h4 className="m-4 w-24 text-center text-sm font-medium">Rank</h4>
                <h4 className="m-4 w-40 text-center text-sm font-medium">Player</h4>
                <h4 className="m-4 w-24 text-center text-sm font-medium">Games</h4>
                <h4 className="m-4 w-24 text-center text-sm font-medium">Wins</h4>
              </div>
              <ScrollArea className="h-60 rounded-md">
                <div className="p-4">
                  {leaderboard.singleplayer.map((user, idx) => (
                    <div className="flex flex-wrap items-center justify-evenly gap-4" key={idx}>
                      <div className="max-w-24 text-sm">{idx + 1}</div>
                      <div className="max-w-24 truncate text-sm">{user.member} name</div>
                      <div className="max-w-24 text-sm">Games Data</div>
                      <div className="max-w-24 text-sm">{user.score}</div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
          <TabsContent value="multiplayer" className="select-none">
            <Card>
              <div className="flex w-full items-center justify-evenly gap-4">
                <h4 className="m-4 w-24 text-center text-sm font-medium">Rank</h4>
                <h4 className="m-4 w-40 text-center text-sm font-medium">Player</h4>
                <h4 className="m-4 w-24 text-center text-sm font-medium">Games</h4>
                <h4 className="m-4 w-24 text-center text-sm font-medium">Wins</h4>
              </div>
              <ScrollArea className="h-60 rounded-md">
                <div className="p-4">
                  {/* <div className="flex flex-wrap items-center justify-evenly gap-4">
                    <div className="max-w-24 text-sm">{1}</div>
                    <div className="max-w-24 truncate text-sm">{'user.member'} name</div>
                    <div className="max-w-24 text-sm">Games Data</div>
                    <div className="max-w-24 text-sm">{898}</div>
                    <Separator className="my-2" />
                  </div> */}
                  {leaderboard.multiplayer.map((user, idx) => (
                    <div className="flex flex-wrap items-center justify-evenly gap-4" key={idx}>
                      <div className="max-w-24 text-sm">{idx + 1}</div>
                      <div className="max-w-24 truncate text-sm">{user.member} name</div>
                      <div className="max-w-24 text-sm">Games Data</div>
                      <div className="max-w-24 text-sm">{user.score}</div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
