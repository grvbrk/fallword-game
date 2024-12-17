import { useState, useEffect } from 'react';
import { isVowel, alphabet, cn } from '../utils';
import NeoButton from './ui/neo-button';

export default function AlphabetList({
  isGameOver,
  guessedLetters,
  setGuessedLetters,
  answerLetters,
}: {
  isGameOver: boolean;
  guessedLetters: string[];
  setGuessedLetters: React.Dispatch<React.SetStateAction<string[]>>;
  answerLetters: string[];
}) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      if (isGameOver || isVowel(key) || guessedLetters.includes(key)) {
        return;
      }
      if (alphabet.includes(key)) {
        setActiveKey(key);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (isGameOver) return;

      const key = event.key.toUpperCase();
      if (!isVowel(key) && alphabet.includes(key)) {
        setGuessedLetters((prev) => (prev.includes(key) ? prev : [...prev, key]));
      }
      setActiveKey(null);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [alphabet, isGameOver]);

  return (
    <div className="flex max-w-2xl flex-wrap justify-center gap-2">
      {alphabet.map((letter) => {
        return (
          <NeoButton
            key={letter}
            className={cn(
              `h-8 w-8 rounded-xl text-base font-semibold text-slate-900 shadow-light md:h-9 md:w-9 md:text-lg`,
              isVowel(letter) && 'bg-black text-white',
              activeKey === letter
                ? 'translate-x-boxShadowX translate-y-boxShadowY shadow-none'
                : '',
              guessedLetters.includes(letter) && answerLetters.includes(letter)
                ? 'bg-green-500'
                : guessedLetters.includes(letter) && !answerLetters.includes(letter)
                  ? 'bg-red-500'
                  : ''
            )}
            disabled={isVowel(letter) || guessedLetters.includes(letter) || isGameOver}
            onMouseDown={() => {
              if (isGameOver) {
                return;
              }
              setActiveKey(letter);
            }}
            onMouseUp={() => {
              if (isGameOver) return;
              setGuessedLetters((prev) => {
                return prev.includes(letter) ? prev : [...prev, letter];
              });
              setActiveKey(null);
            }}
          >
            {letter}
          </NeoButton>
        );
      })}
    </div>
  );
}
