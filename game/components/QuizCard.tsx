import { QuestionType } from '../questions';
import { isVowel } from '../utils';
import { Card } from './ui/card';

type QuizCardType = {
  question: QuestionType;
};

export default function QuizCard({ question }: QuizCardType) {
  const letters = question.answer.split('');
  return (
    <Card>
      <div className="flex gap-2">
        {letters.map((letter, idx) => {
          return <AlphabetSlot key={letter + idx} letter={letter} />;
        })}
      </div>
    </Card>
  );
}
function AlphabetSlot({ letter }: { letter: string }) {
  const vowel = isVowel(letter);
  const space = letter == ' ';

  return (
    <>
      <div className="text-white">
        {space ? (
          <div className="w-5" />
        ) : vowel ? (
          <div className="flex h-14 w-14 items-center justify-center border-b-2 border-white text-2xl font-semibold">
            {letter}
          </div>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center border-b-2 border-white text-2xl font-semibold"></div>
        )}
      </div>
    </>
  );
}
