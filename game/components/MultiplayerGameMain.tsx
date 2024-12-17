import { Heart } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { isVowel, sendToDevvit } from '../utils';
import AlphabetList from './AlphabetList';
import { AlphabetSlot } from './AlphabetSlot';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import useGameStore from '../stores';
import Confetti from 'react-confetti';
import Timer from './Timer';

export default function MultiplayerGameMain() {
  const { user, updateUserState } = useGameStore();

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [lives, setLives] = useState<number>(5);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);

  const currentLevel = Math.min(user.userLevel, user.userQuestions.length);

  const answerLetters = useMemo(
    () => user.userQuestions[currentLevel - 1].answer.split(''),
    [user.userQuestions[currentLevel - 1].answer]
  );

  const uniqueAnswerLetters = useMemo(() => {
    return [
      ...new Set(
        user.userQuestions[currentLevel - 1].answer
          .split('')
          .filter((letter) => letter !== ' ' && !isVowel(letter))
      ),
    ];
  }, [user.userQuestions[currentLevel - 1].answer]);

  let isLevelWon = useMemo(
    () => uniqueAnswerLetters.every((letter) => guessedLetters.includes(letter)),
    [uniqueAnswerLetters, guessedLetters]
  );

  let isLevelLost = useMemo(() => lives === 0, [lives]);

  const isLevelOver = useMemo(
    () => isLevelLost || isLevelWon || timeRemaining <= 0,
    [isLevelLost, isLevelWon, timeRemaining]
  );

  useEffect(() => {
    if (
      guessedLetters.length > 0 &&
      !answerLetters.includes(guessedLetters[guessedLetters.length - 1]) &&
      guessedLetters.some((letter) => !answerLetters.includes(letter))
    ) {
      setLives((prev) => Math.max(0, prev - 1));
    }
  }, [guessedLetters, answerLetters]);

  useEffect(() => {
    if (isLevelOver) {
      const timeTakenInCurrentLevel = Math.max(
        0,
        user.userQuestions[currentLevel - 1].timeInSeconds - timeRemaining
      );
      if (currentLevel < 5) {
        // Not the final level, always progress
        const newUserState = {
          ...user,
          userLevel: currentLevel + 1,
          score: user.score + (isLevelWon ? 1 : 0),
          gameStatus: 'in-progress' as 'waiting' | 'in-progress' | 'finished',
          timeTaken: user.timeTaken + timeTakenInCurrentLevel,
        };
        updateUserState(newUserState);
        // Reset game state for next level
        setGuessedLetters([]);
        setLives(5);
        setTimeRemaining(user.userQuestions[currentLevel].timeInSeconds);
        const updatedUser = useGameStore.getState().user;
        sendToDevvit({
          type: 'OPPONENT_GAME_UPDATES_REQUEST',
          payload: {
            matchId: updatedUser.matchId as string,
            currentUserId: updatedUser.userId as string,
            currentUserUsername: updatedUser.username,
            currentUserLevel: updatedUser.userLevel,
            currentUserGameStatus: updatedUser.gameStatus,
            currentUserGameResult: updatedUser.gameResult,
            currentUserScore: updatedUser.score,
            currentUserTimeTaken: updatedUser.timeTaken,
          },
        });
      } else {
        // Final level completed
        const newUserState = {
          ...user,
          userLevel: currentLevel,
          score: user.score + (isLevelWon ? 1 : 0),
          gameStatus: (isLevelWon && 'finished') as 'waiting' | 'in-progress' | 'finished',
          timeTaken: user.timeTaken + timeTakenInCurrentLevel,
        };
        updateUserState(newUserState);
        const updatedUser = useGameStore.getState().user;
        sendToDevvit({
          type: 'OPPONENT_GAME_UPDATES_REQUEST',
          payload: {
            matchId: updatedUser.matchId as string,
            currentUserId: updatedUser.userId as string,
            currentUserUsername: updatedUser.username,
            currentUserLevel: updatedUser.userLevel,
            currentUserGameStatus: updatedUser.gameStatus,
            currentUserGameResult: updatedUser.gameResult,
            currentUserScore: updatedUser.score,
            currentUserTimeTaken: updatedUser.timeTaken,
          },
        });
      }
    }
  }, [isLevelOver]);

  function handleTimeEnd() {
    setLives(0);
  }

  if (user.gameStatus === 'finished') {
    return null;
  }

  return (
    <div className="z-50 flex h-[550px] flex-col items-center">
      {isLevelWon && (
        <>
          <Confetti recycle={false} />
        </>
      )}
      <div className="relative flex w-full items-center justify-between px-2 py-4 text-[#fc6]">
        <div className="flex items-center justify-center">
          {Array.from({ length: 5 }, (_, index) => {
            const isFilled = index < lives;
            return (
              <Heart
                key={index}
                size={22}
                fill={isFilled ? '#fc6' : 'black'}
                className="text-black"
              />
            );
          })}
        </div>

        <div className="pr-2">
          <Timer
            timeRemaining={timeRemaining}
            setTimeRemaining={setTimeRemaining}
            isGameOver={isLevelOver}
            handleTimeEnd={handleTimeEnd}
          />
        </div>
      </div>
      <Card className="max-w-72 border-none bg-[#fc6] md:w-full">
        <CardHeader className="flex items-center justify-center text-slate-900">
          <CardTitle
            className="max-h-24 overflow-y-auto text-center text-lg md:text-xl"
            style={{ wordWrap: 'break-word' }}
          >
            {user.userQuestions[currentLevel - 1].question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-2 text-lg text-slate-900 md:text-2xl">
            {answerLetters.map((letter, idx) => {
              return (
                <AlphabetSlot
                  key={letter + idx}
                  letter={letter}
                  guessed={guessedLetters.includes(letter)}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
      <Card className="max-w-72 border-none p-4 shadow-none md:w-full">
        <AlphabetList
          isGameOver={(user.gameStatus as 'waiting' | 'in-progress' | 'finished') === 'finished'}
          setGuessedLetters={setGuessedLetters}
          guessedLetters={guessedLetters}
          answerLetters={answerLetters}
        />
      </Card>
    </div>
  );
}
