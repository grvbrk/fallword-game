import { isVowel, cn } from '../utils';

export function AlphabetSlot({ letter, guessed }: { letter: string; guessed: boolean }) {
  const vowel = isVowel(letter);
  const space = letter == ' ';

  return (
    <>
      {space ? (
        <div className="w-5" />
      ) : vowel ? (
        <div className="flex h-5 w-5 items-center justify-center border-b-2 font-semibold md:h-10 md:w-10">
          {letter}
        </div>
      ) : (
        <div
          className={cn(
            'flex h-5 w-5 items-center justify-center border-b-2 font-semibold md:h-10 md:w-10',
            guessed && 'text-green-600'
          )}
        >
          {guessed && letter}
        </div>
      )}
    </>
  );
}
