// import { createContext, useContext, useState, useCallback } from 'react';
// import { sendToDevvit } from '../utils';
// import { QuestionType } from '../questions';

// type MultiplayerGameState = {
//   user: {
//     userLives: number;
//     userQuestions: QuestionType[];
//     userLevel: number;
//     guessedLetters: string[];
//     gameStatus: 'waiting' | 'in-progress' | 'won' | 'lost';
//   };
//   // opponent: {
//   //   opponentLives: number;
//   //   opponentLevel: number;
//   //   opponentGameStatus: 'waiting' | 'in-progress' | 'won' | 'lost';
//   // };
// };

// type MultiplayerGameContextType = {
//   gameState: MultiplayerGameState;
//   updateGameState: (updates: Partial<MultiplayerGameState>) => void;
//   sendGameUpdate: (updateType: string, payload: any) => void;
// };

// const MultiplayerGameContext = createContext<MultiplayerGameContextType | null>(null);

// export function MultiplayerGameProvider({
//   children,
//   currentUser,
//   opponent,
// }: {
//   children: React.ReactNode;
//   currentUser: any;
//   opponent: any;
// }) {
//   const [gameState, setGameState] = useState<MultiplayerGameState>({
//     user: {
//       userLives: 5,
//       userQuestions: [],
//       userLevel: 1,
//       guessedLetters: [],
//       gameStatus: 'waiting',
//     },
//     // opponent: {
//     //   opponentLives: 5,
//     //   opponentLevel: 1,
//     //   opponentGameStatus: 'waiting',
//     // },
//   });

//   const updateGameState = useCallback((updates: Partial<MultiplayerGameState>) => {
//     setGameState((prev) => ({
//       ...prev,
//       ...updates,
//     }));
//   }, []);

//   const sendGameUpdate = useCallback(
//     (updateType: string, payload: any) => {
//       sendToDevvit({
//         type: updateType,
//         userId: currentUser.id,
//         opponentId: opponent.id,
//         ...payload,
//       });
//     },
//     [currentUser, opponent]
//   );

//   return (
//     <MultiplayerGameContext.Provider
//       value={{
//         gameState,
//         updateGameState,
//         sendGameUpdate,
//       }}
//     >
//       {children}
//     </MultiplayerGameContext.Provider>
//   );
// }

// export const useMultiplayerGame = () => {
//   const context = useContext(MultiplayerGameContext);
//   if (context === null) {
//     throw new Error('useMultiplayerGame must be used within a MultiplayerGameProvider');
//   }
//   return context;
// };
