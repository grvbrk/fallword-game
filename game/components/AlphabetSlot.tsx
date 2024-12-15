import { isVowel, cn } from '../utils';

export function AlphabetSlot({ letter, guessed }: { letter: string; guessed: boolean }) {
  const vowel = isVowel(letter);
  const space = letter == ' ';

  return (
    <>
      {space ? (
        <div className="w-5" />
      ) : vowel ? (
        <div className="flex h-10 w-10 items-center justify-center border-b-2 font-semibold">
          {letter}
        </div>
      ) : (
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center border-b-2 font-semibold',
            guessed && 'text-green-600'
          )}
        >
          {guessed && letter}
        </div>
      )}
    </>
  );
}
