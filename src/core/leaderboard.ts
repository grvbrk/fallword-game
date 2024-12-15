import { REDIS_KEYS } from "@/shared.js";
import { RedisClient } from "@devvit/public-api";

export async function getLeaderboardsData (redis: RedisClient){
   const [singleplayerLeaderboard, multiplayerLeaderboard] = await Promise.all([
                      await redis.zRange(REDIS_KEYS.LEADERBOARD_SINGLEPLAYER, 0, -1),
                      await redis.zRange(REDIS_KEYS.LEADERBORD_MULTIPLAYER, 0, -1),
                    ]);

    return {
        singleplayer: singleplayerLeaderboard,
        multiplayer: multiplayerLeaderboard,
    }
}