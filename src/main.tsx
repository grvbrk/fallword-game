import { Devvit, useAsync, useChannel, User, useState } from '@devvit/public-api';
import { sendMessageToWebview } from './utils/utils.js';
import {
  ConnStatus,
  MatchmakingMessage,
  RealtimeUserMessage,
  REDIS_KEYS,
  ResponseBodyType,
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
    label: 'Matchmaking url',
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
  name: 'Experience Post',
  height: 'tall',
  render: (context) => {
    const currentSessionId = generateId();
    const redis = context.redis;
    const [launched, setLaunched] = useState(false);
    const [userList, setUserList] = useState<Record<string, UserRecord>>({});
    const { data: currentUser } = useAsync<UserRecord | null>(async () => {
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

    const matchmakingChannel = useChannel<MatchmakingMessage>({
      name: 'matchmaking',
      onMessage: (message) => {
        if (!currentUser) return;

        switch (message.type) {
          case 'MATCH_RESOLVE':
            // Check if this match involves the current user
            if (
              message.payload.requesterUserId === currentUser.userId ||
              message.payload.matchedOpponentId === currentUser.userId
            ) {
              // Determine the opponent based on current user
              const opponentId =
                message.payload.requesterUserId === currentUser.userId
                  ? message.payload.matchedOpponentId
                  : message.payload.requesterUserId;

              const opponentUsername =
                message.payload.requesterUserId === currentUser.userId
                  ? message.payload.matchedOpponentUsername
                  : message.payload.requesterUsername;

              sendMessageToWebview(context, {
                type: 'FIND_OPPONENT_RESPONSE',
                payload: {
                  foundOpponent: true,
                  opponentId: opponentId,
                  opponentUsername: opponentUsername,
                },
              });
            }
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
                          username: currentUser.name,
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
                        member: currentUser.name,
                      }),

                      // Add user to multiplayer leaderboard
                      redis.zAdd(REDIS_KEYS.LEADERBORD_MULTIPLAYER, {
                        score: 0,
                        member: currentUser.name,
                      }),
                    ]);

                    // Get singleplayer and multiplayer ranks
                    const [singleplayerRank, multiplayerRank] = await Promise.all([
                      redis.zRank(REDIS_KEYS.LEADERBOARD_SINGLEPLAYER, currentUser.name),
                      redis.zRank(REDIS_KEYS.LEADERBORD_MULTIPLAYER, currentUser.name),
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
                      redis.zRank(REDIS_KEYS.LEADERBOARD_SINGLEPLAYER, currentUser.name),
                      redis.zRank(REDIS_KEYS.LEADERBORD_MULTIPLAYER, currentUser.name),
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

                  // TODO: Custom response to design webview ui.
                  // sendMessageToWebview(context, {
                  //   type: 'FIND_OPPONENT_RESPONSE',
                  //   payload: {
                  //     foundOpponent: true,
                  //     opponentId: '123',
                  //     opponentUsername: 'random',
                  //   },
                  // });

                  const matchmaking_url = await context.settings.get('matchmaking_api_key');
                  console.log(matchmaking_url);
                  const response = await fetch('matchmaking_url', {
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

                  const resData = (await response.json()) as ResponseBodyType;
                  sendMessageToWebview(context, {
                    type: 'FIND_OPPONENT_RESPONSE',
                    payload: {
                      foundOpponent: true,
                      matchId: resData.matchId,
                      opponentId: resData.opponentId,
                      opponentUsername: undefined,
                    },
                  });

                  break;
                case 'UPDATE_USER_STATS':
                  if (!currentUser) return;
                  const { singleplayer, win, lose } = data.payload;
                  const [userStats, userExistsInSingleLboard, userExistsInMultiLboard] =
                    await Promise.all([
                      await redis.hGet(REDIS_KEYS.USER_STATS, currentUser.userId),
                      await redis.zScore(REDIS_KEYS.LEADERBOARD_SINGLEPLAYER, currentUser.name),
                      await redis.zScore(REDIS_KEYS.LEADERBORD_MULTIPLAYER, currentUser.name),
                    ]);

                  if (
                    !userStats ||
                    userExistsInSingleLboard === undefined ||
                    userExistsInMultiLboard === undefined
                  ) {
                    return;
                  }

                  const stats = JSON.parse(userStats) as UserStats;
                  if (singleplayer) {
                    stats.singleplayermatches = (stats.singleplayermatches || 0) + 1;
                    if (win) {
                      stats.singleplayerwins = (stats.singleplayerwins || 0) + 1;
                      const ok = await redis.zIncrBy(
                        REDIS_KEYS.LEADERBOARD_SINGLEPLAYER,
                        currentUser.name,
                        1
                      );
                    } else if (lose) {
                      stats.singleplayerlosses = (stats.singleplayerlosses || 0) + 1;
                    }
                  } else {
                    stats.multiplayermatches = (stats.multiplayermatches || 0) + 1;
                    if (win) {
                      stats.multiplayerwins = (stats.multiplayerwins || 0) + 1;
                      await redis.zIncrBy(REDIS_KEYS.LEADERBORD_MULTIPLAYER, currentUser.name, 1);
                    } else if (lose) {
                      stats.multiplayerlosses = (stats.multiplayerlosses || 0) + 1;
                    }
                  }

                  await redis.hSet(REDIS_KEYS.USER_STATS, {
                    [currentUser.userId]: JSON.stringify(stats),
                  });

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
