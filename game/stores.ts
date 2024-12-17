import { create } from 'zustand';
import { QuestionType } from './questions_prod';

export type MultiplayerQuestion = QuestionType & {
  timeInSeconds: number;
};

export type UserState = {
  userId: string | undefined;
  username: string;
  userQuestions: MultiplayerQuestion[];
  userLevel: number;
  gameStatus: 'waiting' | 'in-progress' | 'finished';
  gameResult: 'won' | 'lost' | 'tie' | null;
  score: number;
  timeTaken: number;
  matchId: string | undefined;
};

export type OpponentState = {
  opponentUsername: string;
  opponentLevel: number;
  opponentGameStatus: 'waiting' | 'in-progress' | 'finished';
  opponentGameResult: 'won' | 'lost' | 'tie' | null;
  opponentScore: number;
  opponentTimeTaken: number;
  opponentId: string | undefined;
  matchId: string | undefined;
};

export type multiplayerGameState = {
  user: UserState;
  opponent: OpponentState;
};

type Actions = {
  updateUserState: (data: Partial<UserState>) => void;
  updateOpponentState: (data: Partial<OpponentState>) => void;
  reset: () => void;
};

const initialState: multiplayerGameState = {
  user: {
    userId: undefined,
    username: '',
    userQuestions: [],
    userLevel: 1,
    gameStatus: 'waiting',
    gameResult: null,
    score: 0,
    timeTaken: 0,
    matchId: undefined,
  },
  opponent: {
    opponentUsername: '',
    opponentLevel: 1,
    opponentGameStatus: 'waiting',
    opponentGameResult: null,
    opponentScore: 0,
    opponentTimeTaken: 0,
    opponentId: undefined,
    matchId: undefined,
  },
};

const useGameStore = create<multiplayerGameState & Actions>((set) => ({
  ...initialState,
  updateUserState: (data: Partial<UserState>) =>
    set((state) => ({
      ...state,
      user: {
        ...state.user,
        ...data,
      },
    })),
  updateOpponentState: (data: Partial<OpponentState>) =>
    set((state) => ({
      ...state,
      opponent: {
        ...state.opponent,
        ...data,
      },
    })),
  reset: () => set(initialState),
}));

export default useGameStore;
