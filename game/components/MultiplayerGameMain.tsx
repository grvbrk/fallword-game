import { Heart, MoveLeft } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { isVowel } from '../utils';
import AlphabetList from './AlphabetList';
import { AlphabetSlot } from './AlphabetSlot';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import useGameStore from '../stores';
import Confetti from 'react-confetti';
import Timer from './Timer';
import { Button } from './ui/button';
import { useSetPage } from '../hooks/usePage';

export default function MultiplayerGameMain() {
  const { user, updateUserState, reset } = useGameStore();
  const setPage = useSetPage();

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
      } else {
        // Final level completed
        const newUserState = {
          ...user,
          userLevel: currentLevel,
          score: user.score + (isLevelWon ? 1 : 0),
          gameStatus: (isLevelWon && 'finished') as 'waiting' | 'in-progress' | 'finished',
          isGameOver: true,
          timeTaken: user.timeTaken + timeTakenInCurrentLevel,
        };
        updateUserState(newUserState);
      }
    }
  }, [isLevelOver]);

  function handleTimeEnd() {
    setLives(0);
  }

  if (user.isGameOver) {
    return null;
    // return (
    // <div className="flex h-full items-center justify-center">
    //   <Card className="bg-[#fc6] text-black">
    //     <CardHeader>
    //       <CardTitle>Game Over</CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <p>Final Score: {user.score}</p>
    //       <p>Game Status: {user.gameStatus}</p>
    //       <p>Time Taken: {user.timeTaken} seconds</p>
    //     </CardContent>
    //     <CardFooter className="flex w-[350px] items-center justify-center gap-4 border-none p-4 shadow-none">
    //       <Button
    //         className="bg-black text-[#fc6] hover:bg-black hover:text-[#fc6]"
    //         onClick={() => {
    //           reset();
    //           setPage('home');
    //         }}
    //       >
    //         <MoveLeft />
    //         Return to Main Menu
    //       </Button>
    //     </CardFooter>
    //   </Card>
    // </div>
    // );
  }

  return (
    <div className="z-50 flex h-[550px] flex-col items-center">
      {isLevelWon && (
        <>
          <Confetti recycle={false} />
        </>
      )}
      <div className="relative flex w-[420px] items-center justify-between px-2 py-4 text-[#fc6]">
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
      <Card className="w-[420px] bg-[#fc6]">
        <CardHeader className="flex items-center justify-center p-6 text-slate-900">
          <CardTitle
            className="max-h-20 overflow-y-auto text-center text-xl"
            style={{ wordWrap: 'break-word' }}
          >
            {user.userQuestions[currentLevel - 1].question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 text-2xl text-slate-900">
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
      <Card className="w-[420px] border-none p-4 shadow-none">
        <AlphabetList
          isGameOver={user.isGameOver}
          setGuessedLetters={setGuessedLetters}
          guessedLetters={guessedLetters}
          answerLetters={answerLetters}
        />
      </Card>
    </div>
  );
}
