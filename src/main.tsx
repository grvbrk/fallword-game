import { Devvit, useAsync, useChannel, useState } from '@devvit/public-api';
import { sendMessageToWebview, wait } from './utils/utils.js';
import {
  ConnStatus,
  MatchmakingMessage,
  RealtimeUserMessage,
  REDIS_KEYS,
  UserData,
  UserRecord,
  UserStats,
  WebviewToBlockMessage,
} from '../game/shared.js';
import { WEBVIEW_ID } from './constants.js';
import { Preview } from './components/Preview.js';
import { getLeaderboardsData } from './core/leaderboard.js';

Devvit.addSettings([
  {
    name: 'matchmaking_url',
    label: 'matchmaking url secret ',
    type: 'string',
    isSecret: true,
    scope: 'app',
  },
]);

Devvit.configure({
  redditAPI: true,
  redis: true,
  realtime: true,
  http: true,
});

function generateId(): string {
  let id = '';
  const asciiZero = '0'.charCodeAt(0);
  for (let i = 0; i < 4; i++) {
    id += String.fromCharCode(Math.floor(Math.random() * 26) + asciiZero);
  }
  return id;
}

Devvit.addMenuItem({
  label: 'FallWord',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'FallWord',
      subredditName: subreddit.name,
      preview: <Preview />,
    });
    ui.showToast({ text: 'Post created!' });
    ui.navigateTo(post.url);
  },
});

Devvit.addCustomPostType({
  name: 'FallWord Post',
  height: 'tall',
  render: (context) => {
    const currentSessionId = generateId();
    const redis = context.redis;
    const [launched, setLaunched] = useState(false);
    const [userList, setUserList] = useState<Record<string, UserRecord>>({});
    const [currentMultiplayerGameId, setCurrentMultiplayerGameId] = useState<string | null>(null);
    const { data: currentUser } = useAsync<UserData | null>(async () => {
      const user = await context.reddit.getCurrentUser();
      if (!user) return null;
      const avatar = await context.reddit.getSnoovatarUrl(user.username);
      return {
        sessionId: currentSessionId,
        userId: user.id,
        name: user.username,
        lastSeen: Date.now(),
        avatar: avatar ?? '',
      };
    });

    // user channel is used to show the "online users" in the webview across users.
    // manages userList
    const userChannel = useChannel<RealtimeUserMessage>({
      name: 'events',
      onMessage: ({ user, status }) => {
        if (
          !currentUser ||
          user.sessionId == currentSessionId ||
          user.userId == currentUser.userId
        ) {
          return;
        } else if (status === ConnStatus.Conn) {
          if (!(user.userId in userList)) {
            userList[user.userId] = user;
            setUserList(userList);

            sendMessageToWebview(context, {
              type: 'USER_JOINED',
              payload: {
                activeUsersCount: Object.keys(userList).length,
              },
            });
          }
        } else if (status === ConnStatus.Disconn) {
          if (user.userId in userList) {
            delete userList[user.userId];
            setUserList(userList);

            sendMessageToWebview(context, {
              type: 'USER_DISCONN',
              payload: {
                activeUsersCount: Object.keys(userList).length,
              },
            });
          }
        }
      },
    });

    // Matchmaking channel only to be used for in progress multiplayer games
    const matchmakingChannel = useChannel<MatchmakingMessage>({
      name: 'matchmaking',
      onMessage: ({ type, data }) => {
        if (!currentUser) return;

        switch (type) {
          case 'GAME_UPDATES':
            console.log(
              'GAME_UPDATES triggered',
              currentUser,
              data.sessionId,
              currentSessionId,
              data.currentUserUsername,
              currentUser.name,
              currentMultiplayerGameId,
              data.matchId
            );
            if (
              !currentUser ||
              data.sessionId === currentSessionId ||
              data.currentUserUsername === currentUser.name ||
              !currentMultiplayerGameId ||
              currentMultiplayerGameId !== data.matchId
            ) {
              return;
            }

            console.log('OPPONENT_GAME_UPDATES_REQUEST triggered');

            sendMessageToWebview(context, {
              type: 'OPPONENT_GAME_UPDATES_RESPONSE',
              payload: {
                matchId: data.matchId,
                opponentUsername: data.currentUserUsername,
                opponentLevel: data.currentUserLevel,
                opponentGameStatus: data.currentUserGameStatus,
                opponentGameResult: data.currentUserGameResult,
                opponentScore: data.currentUserScore,
                opponentTimeTaken: data.currentUserTimeTaken,
              },
            });

            break;
        }
      },
    });

    userChannel.subscribe();
    matchmakingChannel.subscribe();

    return (
      <vstack height="100%" width="100%" alignment="center middle">
        {launched ? (
          <webview
            id={WEBVIEW_ID}
            url="index.html"
            width={'100%'}
            height={'100%'}
            onMessage={async (event) => {
              const data = event as unknown as WebviewToBlockMessage;

              switch (data.type) {
                case 'INIT':
                  if (!currentUser) return;
                  userList[currentUser.userId] = currentUser;
                  setUserList(userList);
                  await userChannel.send({
                    user: currentUser,
                    status: ConnStatus.Conn,
                  });

                  const user = await redis.hGet(REDIS_KEYS.USER_LIST, currentUser.userId);
                  if (!user) {
                    // User doesn't exist (First time playing)
                    await Promise.all([
                      // Add user base data
                      redis.hSet(REDIS_KEYS.USER_LIST, {
                        [currentUser.userId]: JSON.stringify({
                          name: currentUser.name,
                          userId: currentUser.userId,
                          avatar: currentUser.avatar,
                        }),
                      }),

                      // Add user stats
                      redis.hSet(REDIS_KEYS.USER_STATS, {
                        [currentUser.userId]: JSON.stringify({
                          singleplayermatches: 0,
                          singleplayerwins: 0,
                          singleplayerlosses: 0,
                          multiplayermatches: 0,
                          multiplayerwins: 0,
                          multiplayerlosses: 0,
                        }),
                      }),

                      // Add user to singleplayer leaderboard
                      redis.zAdd(REDIS_KEYS.LEADERBOARD_SINGLEPLAYER, {
                        score: 0,
                        member: currentUser.userId,
                      }),

                      // Add user to multiplayer leaderboard
                      redis.zAdd(REDIS_KEYS.LEADERBOARD_MULTIPLAYER, {
                        score: 0,
                        member: currentUser.userId,
                      }),
                    ]);

                    // Get singleplayer and multiplayer ranks
                    const [singleplayerRank, multiplayerRank] = await Promise.all([
                      redis.zRank(REDIS_KEYS.LEADERBOARD_SINGLEPLAYER, currentUser.userId),
                      redis.zRank(REDIS_KEYS.LEADERBOARD_MULTIPLAYER, currentUser.userId),
                    ]);

                    sendMessageToWebview(context, {
                      type: 'INIT_RESPONSE',
                      payload: {
                        userData: {
                          ...currentUser,
                          singleplayermatches: 0,
                          singleplayerwins: 0,
                          singleplayerlosses: 0,
                          singleplayerrank: singleplayerRank,
                          multiplayermatches: 0,
                          multiplayerwins: 0,
                          multiplayerlosses: 0,
                          multiplayerrank: multiplayerRank,
                        },
                        activeUsersCount: Object.keys(userList).length,
                      },
                    });
                  } else {
                    // User exists
                    const userStats = JSON.parse(
                      (await redis.hGet(REDIS_KEYS.USER_STATS, currentUser.userId)) as string
                    ) as UserStats;

                    const [singleplayerRank, multiplayerRank] = await Promise.all([
                      redis.zRank(REDIS_KEYS.LEADERBOARD_SINGLEPLAYER, currentUser.userId),
                      redis.zRank(REDIS_KEYS.LEADERBOARD_MULTIPLAYER, currentUser.userId),
                    ]);

                    const userData = {
                      ...currentUser,
                      ...userStats,
                      singleplayerrank: singleplayerRank,
                      multiplayerrank: multiplayerRank,
                    } as UserRecord;

                    sendMessageToWebview(context, {
                      type: 'INIT_RESPONSE',
                      payload: {
                        userData: userData,
                        activeUsersCount: Object.keys(userList).length,
                      },
                    });
                  }

                  sendMessageToWebview(context, {
                    type: 'LEADERBOARD_UPDATE',
                    payload: await getLeaderboardsData(redis),
                  });
                  break;

                case 'USER_OFFLINE':
                  if (!currentUser) return;
                  delete userList[currentUser.userId];
                  setUserList(userList);
                  await userChannel.send({
                    user: currentUser,
                    status: ConnStatus.Disconn,
                  });
                  break;

                case 'FIND_OPPONENT_REQUEST':
                  if (!currentUser) return;

                  // Custom response to test and design webview ui.
                  // To be used only for testing multiplayer
                  //aggressive
                  // setCurrentMultiplayerGameId('123');
                  // if (currentUser.userId === 't2_eh5q9bbq') {
                  //   // await wait(2);
                  //   sendMessageToWebview(context, {
                  //     type: 'FIND_OPPONENT_RESPONSE',
                  //     payload: {
                  //       matchId: '123',
                  //       foundOpponent: true,
                  //       opponentId: 't2_6fgnqav8',
                  //       opponentUsername: 'badsinn',
                  //     },
                  //   });
                  // }

                  // // badsinn
                  // if (currentUser.userId === 't2_6fgnqav8') {
                  //   // await wait(3);
                  //   sendMessageToWebview(context, {
                  //     type: 'FIND_OPPONENT_RESPONSE',
                  //     payload: {
                  //       matchId: '123',
                  //       foundOpponent: true,
                  //       opponentId: 't2_eh5q9bbq',
                  //       opponentUsername: 'aggressive',
                  //     },
                  //   });
                  // }

                  const matchmaking_url = await context.settings.get('matchmaking_url');
                  try {
                    const response = await fetch(matchmaking_url as string, {
                      method: 'POST',
                      body: JSON.stringify({
                        userId: currentUser.userId,
                      }),
                    });

                    if (response.status !== 200) {
                      sendMessageToWebview(context, {
                        type: 'FIND_OPPONENT_RESPONSE',
                        payload: {
                          foundOpponent: false,
                          matchId: undefined,
                          opponentId: undefined,
                          opponentUsername: undefined,
                        },
                      });

                      break;
                    }

                    const resData = await response.json();
                    console.log('MATCHMAKING RESPONSE', resData);
                    if (resData.status === 'no_match') {
                      sendMessageToWebview(context, {
                        type: 'FIND_OPPONENT_RESPONSE',
                        payload: {
                          foundOpponent: false,
                          matchId: undefined,
                          opponentId: undefined,
                          opponentUsername: undefined,
                        },
                      });
                    } else {
                      sendMessageToWebview(context, {
                        type: 'FIND_OPPONENT_RESPONSE',
                        payload: {
                          foundOpponent: true,
                          matchId: resData.matchId,
                          opponentId: resData.opponentId,
                          opponentUsername: undefined,
                        },
                      });
                    }
                  } catch (error) {
                    console.log('ERROR MATCHMAKING USER', error);
                    sendMessageToWebview(context, {
                      type: 'FIND_OPPONENT_RESPONSE',
                      payload: {
                        foundOpponent: false,
                        matchId: undefined,
                        opponentId: undefined,
                        opponentUsername: undefined,
                      },
                    });
                  }

                  break;

                case 'UPDATE_USER_STATS_SINGLEPLAYER':
                  // This case updates only single player leaderboard and user stats
                  if (!currentUser) return;

                  const { win, lose } = data.payload;
                  const [userStats, userExistsInSingleLboard] = await Promise.all([
                    await redis.hGet(REDIS_KEYS.USER_STATS, currentUser.userId),
                    await redis.zScore(REDIS_KEYS.LEADERBOARD_SINGLEPLAYER, currentUser.userId),
                  ]);

                  if (!userStats || userExistsInSingleLboard === undefined) {
                    return;
                  }

                  const stats = JSON.parse(userStats) as UserStats;
                  stats.singleplayermatches = stats.singleplayermatches! + 1;
                  if (win === 'true') {
                    stats.singleplayerwins = stats.singleplayerwins! + 1;
                    // Increase the player's score by 1 if they win
                    await redis.zIncrBy(
                      REDIS_KEYS.LEADERBOARD_SINGLEPLAYER,
                      currentUser.userId,
                      -1
                    );
                  }
                  if (lose === 'true') {
                    // No change in the leaderboard if the player loses
                    stats.singleplayerlosses = stats.singleplayerlosses! + 1;
                  }

                  // Fetch and update ranks
                  const [singleplayerRank, multiplayerRank] = await Promise.all([
                    redis.zRank(REDIS_KEYS.LEADERBOARD_SINGLEPLAYER, currentUser.userId),
                    redis.zRank(REDIS_KEYS.LEADERBOARD_MULTIPLAYER, currentUser.userId),
                  ]);

                  stats.singleplayerrank = singleplayerRank;
                  stats.multiplayerrank = multiplayerRank;

                  await redis.hSet(REDIS_KEYS.USER_STATS, {
                    [currentUser.userId]: JSON.stringify(stats),
                  });

                  // TODO
                  // Do we need two separate webview calls?
                  // Can we add just one call which updates both leaderboard and currentUser state?
                  sendMessageToWebview(context, {
                    type: 'USER_STATS_UPDATED',
                    payload: {
                      userId: currentUser.userId,
                      stats: stats,
                    },
                  });
                  sendMessageToWebview(context, {
                    type: 'LEADERBOARD_UPDATE',
                    payload: await getLeaderboardsData(redis),
                  });
                  break;

                case 'OPPONENT_GAME_UPDATES_REQUEST':
                  // Case triggered only when there's a multiplayer game in progress
                  // Hence there must be a currentMultiplayerGameId present
                  if (!currentUser) return;
                  const {
                    matchId,
                    currentUserId,
                    currentUserUsername,
                    currentUserLevel,
                    currentUserGameStatus,
                    currentUserGameResult,
                    currentUserScore,
                    currentUserTimeTaken,
                  } = data.payload;

                  await matchmakingChannel.send({
                    type: 'GAME_UPDATES',
                    data: {
                      sessionId: currentSessionId,
                      matchId,
                      currentUserId,
                      currentUserUsername,
                      currentUserLevel,
                      currentUserGameStatus,
                      currentUserGameResult,
                      currentUserScore,
                      currentUserTimeTaken,
                    },
                  });
                  break;

                case 'GAME_OVER_MULTIPLAYER':
                  if (!currentUser) return;
                  const {
                    matchId: gameId,
                    winningUserId,
                    winningUsername,
                    loserUserId,
                    loserUsername,
                  } = data.payload;

                  const [
                    winningUserStatsData,
                    losingUserStatsData,
                    winningUserInLeaderboard,
                    loserUserInLeaderboard,
                  ] = await Promise.all([
                    await redis.hGet(REDIS_KEYS.USER_STATS, winningUserId),
                    await redis.hGet(REDIS_KEYS.USER_STATS, loserUserId),
                    await redis.zScore(REDIS_KEYS.LEADERBOARD_SINGLEPLAYER, winningUserId),
                    await redis.zScore(REDIS_KEYS.LEADERBOARD_SINGLEPLAYER, loserUserId),
                  ]);

                  if (
                    !winningUserStatsData ||
                    !losingUserStatsData ||
                    winningUserInLeaderboard === undefined ||
                    loserUserInLeaderboard === undefined
                  ) {
                    return;
                  }

                  const winningUserStats = JSON.parse(winningUserStatsData) as UserStats;
                  const losingUserStats = JSON.parse(losingUserStatsData) as UserStats;

                  // winning user stats update
                  winningUserStats.multiplayermatches = winningUserStats.multiplayermatches! + 1;
                  winningUserStats.multiplayerwins = winningUserStats.multiplayerwins! + 1;
                  await redis.zIncrBy(REDIS_KEYS.LEADERBOARD_MULTIPLAYER, winningUserId, -1);

                  //losing user stats update
                  losingUserStats.multiplayermatches = losingUserStats.multiplayermatches! + 1;
                  losingUserStats.multiplayerlosses = losingUserStats.multiplayerlosses! + 1;

                  const [winningUserRank, losingUserRank] = await Promise.all([
                    redis.zRank(REDIS_KEYS.LEADERBOARD_MULTIPLAYER, winningUserId),
                    redis.zRank(REDIS_KEYS.LEADERBOARD_MULTIPLAYER, loserUserId),
                  ]);

                  // winning user rank update
                  winningUserStats.multiplayerrank = winningUserRank;
                  // losing user rank update
                  losingUserStats.multiplayerrank = losingUserRank;

                  await Promise.all([
                    await redis.hSet(REDIS_KEYS.USER_STATS, {
                      [winningUserId]: JSON.stringify(winningUserStats),
                    }),
                    await redis.hSet(REDIS_KEYS.USER_STATS, {
                      [loserUserId]: JSON.stringify(losingUserStats),
                    }),
                  ]);

                  sendMessageToWebview(context, {
                    type: 'USER_STATS_UPDATED',
                    payload: {
                      userId: winningUserId,
                      stats: winningUserStats,
                    },
                  });
                  sendMessageToWebview(context, {
                    type: 'LEADERBOARD_UPDATE',
                    payload: await getLeaderboardsData(redis),
                  });

                  break;
                default:
                  console.error('Unknown message type', data);
                  break;
              }
            }}
          />
        ) : (
          <button
            onPress={() => {
              setLaunched(true);
            }}
          >
            Launch Game
          </button>
        )}
      </vstack>
    );
  },
});

export default Devvit;
