import { REDIS_KEYS, UserData, UserStats } from '@/shared.js';
import { RedisClient } from '@devvit/public-api';

export async function getLeaderboardsData(redis: RedisClient) {
  // Fetch all usernames in the leaderboards
  const [singleplayerUsernames, multiplayerUsernames] = await Promise.all([
    redis.zRange(REDIS_KEYS.LEADERBOARD_SINGLEPLAYER, 0, -1),
    redis.zRange(REDIS_KEYS.LEADERBOARD_MULTIPLAYER, 0, -1),
  ]);

  // Manual sorting because {reverse: true, by : "score"} is not working
  singleplayerUsernames.sort((a, b) => b.score - a.score);
  multiplayerUsernames.sort((a, b) => b.score - a.score);

  // Fetch scores and stats for singleplayer leaderboard
  const singleplayerLeaderboard = await Promise.all(
    singleplayerUsernames.map(async (user) => {
      const [score, userStats, userData] = await Promise.all([
        redis.zScore(REDIS_KEYS.LEADERBOARD_SINGLEPLAYER, user.member),
        redis.hGet(REDIS_KEYS.USER_STATS, user.member),
        redis.hGet(REDIS_KEYS.USER_LIST, user.member),
      ]);

      const stats: UserStats = userStats ? JSON.parse(userStats) : {};
      const data: UserData = userData ? JSON.parse(userData) : {};

      return {
        username: data.name,
        score: score || 0,
        matches: stats.singleplayermatches || 0,
      };
    })
  );

  // Fetch scores and stats for multiplayer leaderboard
  const multiplayerLeaderboard = await Promise.all(
    multiplayerUsernames.map(async (user) => {
      const [score, userStats, userData] = await Promise.all([
        redis.zScore(REDIS_KEYS.LEADERBOARD_MULTIPLAYER, user.member),
        redis.hGet(REDIS_KEYS.USER_STATS, user.member),
        redis.hGet(REDIS_KEYS.USER_LIST, user.member),
      ]);

      const stats: UserStats = userStats ? JSON.parse(userStats) : {};
      const data: UserData = userData ? JSON.parse(userData) : {};
      return {
        username: data.name,
        score: score || 0,
        matches: stats.multiplayermatches || 0,
      };
    })
  );

  return {
    singleplayer: singleplayerLeaderboard,
    multiplayer: multiplayerLeaderboard,
  };
}
