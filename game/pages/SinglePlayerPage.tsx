import { useEffect, useMemo, useState } from 'react';
import { generateRandomQuestion, isVowel, sendToDevvit } from '../utils';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Award, ChartNoAxesCombined, Clock4, Heart, MoveLeft, RotateCcw } from 'lucide-react';
import { useGameSettings } from '../hooks/useGameConfig';
import { Button } from '../components/ui/button';
import { useSetPage } from '../hooks/usePage';
import Timer from '../components/Timer';
import Confetti from 'react-confetti';
import AlphabetList from '../components/AlphabetList';
import { AlphabetSlot } from '../components/AlphabetSlot';
import Snowfall from '../components/Snowfall';
import { UserRecord } from '../shared';
import { motion } from 'framer-motion';

export const SinglePlayerPage = ({ currentUser }: { currentUser: UserRecord }) => {
  const { gameSettings, setGameSettings } = useGameSettings();
  const setPage = useSetPage();
  const [question, setQuestion] = useState(
    useMemo(() => generateRandomQuestion(gameSettings.difficulty), [gameSettings.difficulty])
  );

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [lives, setLives] = useState<number>(gameSettings.startingLives);
  const [timeRemaining, setTimeRemaining] = useState<number>(gameSettings.gameTimeInSeconds);

  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1] ?? null;

  const answerLetters = useMemo(() => question.answer.split(''), [question.answer]);

  const uniqueAnswerLetters = useMemo(() => {
    return [
      ...new Set(question.answer.split('').filter((letter) => letter !== ' ' && !isVowel(letter))),
    ];
  }, [question.answer]);

  let isGameWon = useMemo(
    () => uniqueAnswerLetters.every((letter) => guessedLetters.includes(letter)),
    [uniqueAnswerLetters, guessedLetters]
  );

  let isGameLost = useMemo(() => lives === 0, [lives]);
  let isGameOver = useMemo(() => isGameLost || isGameWon, [isGameLost, isGameWon]);

  useEffect(() => {
    if (
      lastGuessedLetter &&
      !answerLetters.includes(lastGuessedLetter) &&
      guessedLetters.includes(lastGuessedLetter)
    ) {
      setLives((prev) => {
        return prev - 1;
      });
    }
  }, [lastGuessedLetter, guessedLetters, answerLetters]);

  useEffect(() => {
    if (isGameOver) {
      if (isGameWon) {
        setGameSettings((prev) => {
          return {
            ...prev,
            currentStreak: prev.currentStreak + 1,
          };
        });
        sendToDevvit({
          type: 'UPDATE_USER_STATS_SINGLEPLAYER',
          payload: {
            win: 'true',
            lose: 'false',
          },
        });

        console.log('ran won');
      } else {
        setGameSettings((prev) => {
          return {
            ...prev,
            currentStreak: 0,
          };
        });
        sendToDevvit({
          type: 'UPDATE_USER_STATS_SINGLEPLAYER',
          payload: {
            win: 'false',
            lose: 'true',
          },
        });

        console.log('ran lose');
      }

      setGameSettings((prevSettings) => ({ ...prevSettings, isGameOver: true }));
    }
  }, [isGameOver, setGameSettings]);

  function handleTimeEnd() {
    setLives(0);
  }

  return (
    <div
      className="relative flex h-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat text-slate-900"
      style={{
        backgroundImage: `url("/bg1.png")`,
      }}
    >
      {isGameWon && <Confetti className="absolute inset-0" recycle={false} numberOfPieces={600} />}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />
      <Snowfall />
      <div className="z-50 flex h-[550px] flex-col items-center pt-16">
        <motion.div
          className="relative flex w-[550px] items-center justify-between px-2 py-4 text-[#fc6]"
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center">
            {Array.from({ length: gameSettings.startingLives }, (_, index) => {
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

          <div className={`flex items-center justify-center gap-2`}>
            <ChartNoAxesCombined className="h-5 w-5" /> {gameSettings.currentStreak}
          </div>

          <div className={`flex items-center justify-center gap-2`}>
            <Award className="h-5 w-5" /> {currentUser.singleplayerwins ?? 0}
          </div>

          <div className="pr-2">
            {gameSettings.timer ? (
              <Timer
                timeRemaining={timeRemaining}
                setTimeRemaining={setTimeRemaining}
                isGameOver={isGameOver}
                handleTimeEnd={handleTimeEnd}
              />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Clock4 className="h-5 w-5" /> NA
              </div>
            )}
          </div>
        </motion.div>
        <Card className="w-[550px] bg-[#fc6]">
          <CardHeader className="flex items-center justify-center p-6 text-slate-900">
            <CardTitle
              className="max-h-20 overflow-y-auto text-center text-xl"
              style={{ wordWrap: 'break-word' }}
            >
              {question.question}
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
        <Card className="w-[550px] border-none p-4 shadow-none">
          <AlphabetList
            isGameOver={isGameOver}
            setGuessedLetters={setGuessedLetters}
            guessedLetters={guessedLetters}
            answerLetters={answerLetters}
          />
        </Card>

        {gameSettings.isGameOver && (
          <motion.div initial={{ opacity: 0, y: -25 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="flex w-[350px] items-center justify-center gap-4 border-none p-4 shadow-none">
              <Button
                className="bg-[#fc6]"
                onClick={() => {
                  setGameSettings((prev) => {
                    return {
                      ...prev,
                      difficulty: gameSettings.difficulty,
                      timer: gameSettings.timer,
                      gameTimeInSeconds: gameSettings.gameTimeInSeconds,
                      timeTakenInSeconds: 0,
                      isGameOver: false,
                      startingLives: 5,
                      livesRemaining: 5,
                    };
                  });
                  setPage('home');
                }}
              >
                <MoveLeft />
                Return to Main Menu
              </Button>
              <Button
                className="bg-[#fc6]"
                onClick={() => {
                  setGameSettings((prev) => {
                    return {
                      ...prev,
                      difficulty: gameSettings.difficulty,
                      timer: gameSettings.timer,
                      gameTimeInSeconds: gameSettings.gameTimeInSeconds,
                      timeTakenInSeconds: 0,
                      isGameOver: false,
                      startingLives: 5,
                      livesRemaining: 5,
                    };
                  });

                  setQuestion(generateRandomQuestion(gameSettings.difficulty));
                  setGuessedLetters([]);
                  setLives(5);
                  setTimeRemaining(gameSettings.gameTimeInSeconds);
                }}
              >
                Play Again!
                <RotateCcw />
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};
