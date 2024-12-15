export type QuestionType = {
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

export const questionsList: QuestionType[] = [
  {
    question: 'Which country is known as the Land of Rising Sun?',
    answer: 'JAPAN',
    difficulty: 'easy',
  },
  {
    question: 'Which country has the Taj Mahal?',
    answer: 'INDIA',
    difficulty: 'easy',
  },
  {
    question: 'Which country is home to the kangaroo?',
    answer: 'AUSTRALIA',
    difficulty: 'medium',
  },
  {
    question: 'Which country is known for the Great Wall?',
    answer: 'CHINA',
    difficulty: 'medium',
  },
  {
    question: 'Which country has the Eiffel Tower?',
    answer: 'FRANCE',
    difficulty: 'hard',
  },
];
