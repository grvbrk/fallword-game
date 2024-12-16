import { UserRecord, WebviewToBlockMessage } from './shared';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { questionsList } from './questions';

export const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sendToDevvit(event: WebviewToBlockMessage) {
  window.parent?.postMessage(event, '*');
}

export const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

export function isVowel(char: string): boolean {
  return VOWELS.has(char.toUpperCase());
}

export function generateRandomQuestion(difficulty: 'easy' | 'medium' | 'hard') {
  const filteredList = questionsList.filter((q) => q.difficulty === difficulty);
  return filteredList[Math.floor(Math.random() * filteredList.length)];
}

export function generateMultiplayerQuestions() {
  const easyQuestions = questionsList.filter((q) => q.difficulty === 'easy');
  const mediumQuestions = questionsList.filter((q) => q.difficulty === 'medium');
  const hardQuestions = questionsList.filter((q) => q.difficulty === 'hard');

  if (easyQuestions.length < 2 || mediumQuestions.length < 2 || hardQuestions.length < 1) {
    throw new Error('Not enough questions of each difficulty level');
  }

  function shuffleArray<T>(array: T[]): T[] {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  const shuffledEasy = shuffleArray(easyQuestions).map((q) => {
    return {
      ...q,
      timeInSeconds: 60,
    };
  });
  const shuffledMedium = shuffleArray(mediumQuestions).map((q) => {
    return {
      ...q,
      timeInSeconds: 45,
    };
  });
  const shuffledHard = shuffleArray(hardQuestions).map((q) => {
    return {
      ...q,
      timeInSeconds: 30,
    };
  });

  return [shuffledEasy[0], shuffledEasy[1], shuffledMedium[0], shuffledMedium[1], shuffledHard[0]];
}

export function calculateWinPercentages(currentUser: UserRecord) {
  const roundToTwoDecimals = (num: number) => Math.round(num * 100) / 100;

  const totalMatches =
    (currentUser.singleplayermatches ?? 0) + (currentUser.multiplayermatches ?? 0);
  const totalWins = (currentUser.singleplayerwins ?? 0) + (currentUser.multiplayerwins ?? 0);

  let overallWinPercentage: number;
  if (totalMatches > 0) {
    overallWinPercentage = roundToTwoDecimals((totalWins / totalMatches) * 100);
  } else {
    overallWinPercentage = 0;
  }

  return overallWinPercentage;
}
