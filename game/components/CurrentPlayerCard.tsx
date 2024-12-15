import { Award, ChartNoAxesCombined, Star, Swords } from 'lucide-react';
import { UserRecord } from '../shared';
import { Card, CardContent, CardHeader } from './ui/card';
import { useGameSettings } from '../hooks/useGameConfig';

export default function CurrentPlayerCard({ currentUser }: { currentUser: UserRecord }) {
  const { gameSettings } = useGameSettings();
  console.log(currentUser);

  return (
    <Card className="relative mb-8 flex w-[500px] border-none shadow-none">
      <CardHeader className="group relative w-2/5 select-none">
        <img
          src={'/default_snoovatar.png'}
          alt="Snooavtar main"
          className="transition-all duration-300 ease-out group-hover:scale-[0.95] group-hover:opacity-50 group-hover:blur-sm"
        />
        <div className="absolute inset-0 flex items-center justify-center truncate text-[#fc6] opacity-0 transition-all duration-300 ease-out group-hover:scale-[1.05] group-hover:opacity-100">
          {currentUser.name ?? null}
        </div>
      </CardHeader>

      <Card className="w-3/5 border border-none bg-[#fc6] py-6 shadow-none">
        {/* <CardHeader className="flex flex-row items-center justify-between px-4 py-2 text-black">
          <CardTitle className="text-sm font-medium">
            {'u/' + (currentUser.name ?? 'grvbrk')}
          </CardTitle>
        </CardHeader> */}
        <CardContent className="flex flex-col items-center justify-center gap-4 p-0 text-black">
          <div className="grid h-full w-full grid-cols-2 gap-2 px-6">
            <div className="flex items-center gap-1">
              <Star className="h-10 w-10" strokeWidth={1.5} />
              <div className="text-left">
                <div className="text-xl font-bold">
                  {Math.min(
                    currentUser.multiplayerrank === undefined ? 0 : currentUser.multiplayerrank + 1,
                    currentUser.singleplayerrank === undefined
                      ? 0
                      : currentUser.singleplayerrank + 1
                  )}
                </div>
                <p className="text-xs text-black/80">Rank</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ChartNoAxesCombined className="h-10 w-10" strokeWidth={1.5} />
              <div className="text-left">
                <div className="text-xl font-bold">{gameSettings.currentStreak}</div>
                <p className="text-xs text-black/80">Current Streak</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Swords className="h-10 w-10" strokeWidth={1.5} />
              <div className="text-left">
                <div className="text-xl font-bold">
                  {(currentUser.singleplayermatches ?? 0) + (currentUser.multiplayermatches ?? 0)}
                </div>
                <p className="text-xs text-black/80">Total Games</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Award className="h-10 w-10" strokeWidth={1.5} />
              <div className="text-left">
                <div className="text-xl font-bold">
                  {(currentUser.singleplayerwins ?? 0) + (currentUser.multiplayerwins ?? 0)}
                </div>
                <p className="text-xs text-black/80">Total Wins</p>
              </div>
            </div>
          </div>

          <div className="grid h-full w-full grid-cols-2 place-items-center">
            {/* Singleplay stats */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex flex-col items-center">
                <div className="text-xl font-bold">
                  {currentUser.singleplayerrank != undefined
                    ? currentUser.singleplayerrank + 1
                    : 'NA'}
                </div>
                <p className="flex flex-wrap text-xs text-black/80">Singleplayer Rank</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-lg font-bold">{currentUser.singleplayermatches ?? 'NA'}</div>
                  <p className="text-xs text-black/80">Games</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-lg font-bold">{currentUser.singleplayerwins ?? 'NA'}</div>
                  <p className="text-xs text-black/80">Wins</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-lg font-bold">{currentUser.singleplayerlosses ?? 'NA'}</div>
                  <p className="text-xs text-black/80">Losses</p>
                </div>
              </div>
            </div>

            {/* Multiplayer stats  */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex flex-col items-center">
                <div className="text-xl font-bold">
                  {currentUser.multiplayerrank != undefined
                    ? currentUser.multiplayerrank + 1
                    : 'NA'}
                </div>
                <p className="flex flex-wrap text-xs text-black/80">Multiplayer Rank</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-lg font-bold">{currentUser.multiplayermatches ?? 'NA'}</div>
                  <p className="text-xs text-black/80">Games</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-lg font-bold">{currentUser.multiplayerwins ?? 'NA'}</div>
                  <p className="text-xs text-black/80">Wins</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-lg font-bold">{currentUser.multiplayerlosses ?? 'NA'}</div>
                  <p className="text-xs text-black/80">Losses</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Card>
  );
}
