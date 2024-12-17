// import { REDIS_KEYS } from '@/shared.js';
// import { Devvit } from '@devvit/public-api';
// import { sendMessageToWebview } from 'src/utils/utils.js';

// Devvit.addSchedulerJob({
//   name: 'matchmaking-scheduler',
//   onRun: async (_, context) => {
//     const redis = context.redis;

//     try {
//       const matchmakingCount = await redis.zCard(REDIS_KEYS.MATCHMAKER);

//       if (matchmakingCount >= 2) {
//         // Retrieve the top 2 players (sorted by score i.e., entry time)
//         const players = await redis.zRange(REDIS_KEYS.MATCHMAKER, 0, -1);

//         if (players.length >= 2) {
//           const [player1, player2] = players;

//           sendMessageToWebview(context, {
//             type: 'FIND_OPPONENT_RESPONSE',
//             payload: {
//               matchId: '123',
//               foundOpponent: true,
//               opponentId: 't2_6fgnqav8',
//               opponentUsername: 'badsinn',
//             },
//           });

//           // Remove the matched players from the sortedSet
//           await redis.zRem(REDIS_KEYS.MATCHMAKER, player1, player2);
//         }
//       } else {
//         console.log('Not enough players in matchmaking. Waiting for more...');
//       }
//     } catch (error) {
//       console.error('Error running matchmaking scheduler:', error);
//     }
//   },
// });
