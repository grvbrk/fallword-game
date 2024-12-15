import {create} from "zustand"
import { QuestionType } from "./questions";

type MultiplayerQuestion = QuestionType & {
  timeInSeconds: number
}

type UserState = {
  username : string;
  userQuestions: MultiplayerQuestion[];
  userLevel: number;
  gameStatus: 'waiting' | 'in-progress' | 'won' | 'lost';
  isGameOver: boolean
  score: number
  timeTaken: number
}

type OpponentState = {
  opponentUsername: string;
  opponentLives: number;
  opponentLevel: number;
  opponentGameStatus: 'waiting' | 'in-progress' | 'won' | 'lost';
}

type multiplayerGameState = {
  user: UserState;
  opponent: OpponentState,
}

type Actions = {
updateUserState: (data: Partial<UserState>) => void;
  updateOpponentState: (data: Partial<OpponentState>) => void;
  reset: () => void;
}

const initialState: multiplayerGameState = {
  user: {
    username: "",
    userQuestions: [],
    userLevel: 1,
    gameStatus: 'waiting',
    isGameOver: false,
    score: 0,
    timeTaken: 0

  },
  opponent: {
    opponentUsername: "",
    opponentLives: 5,
    opponentLevel: 1,
    opponentGameStatus: 'waiting',
  },
}

const useGameStore = create<multiplayerGameState & Actions>((set) => ({
  ...initialState,
  updateUserState: (data: Partial<UserState>) => set((state) => ({
    ...state,
    user: {
      ...state.user,
      ...data,
    }
  })),
  updateOpponentState: (data: Partial<OpponentState>) => set((state) => ({
    ...state,
    opponent: {
      ...state.opponent,
      ...data,
    }
  })),
  reset: () => set(initialState),
}))

export default useGameStore