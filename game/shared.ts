export type Page = 'home' | 'singleplayerGame' | 'multiplayerGame';

export const REDIS_KEYS = {
  // TODO: Should we store user Stats in their keys in the userlist?
  USER_LIST: 'fallword:user_list', // List of all users
  USER_STATS: 'fallword:user_stats', // Stats of all users
  LEADERBOARD_SINGLEPLAYER: 'fallword:leaderboard_singleplayer',
  LEADERBOARD_MULTIPLAYER: 'fallword:leaderboard_multiplayer',
  MATCHMAKER: 'fallword:matchmaker',
};

export const REDIS_TTL = {
  PROD: 60 * 60 * 24 * 7, // 7 days
  DEV: 300, // 5 minutes
};

export type RequestBodyType = {
  userId: string;
};

// interface MatchResponse {
//   status: 'matched' | 'no_match';
//   userId: string;
//   opponentId?: string;
//   matchId?: string;
// }

export type ResponseBodyType = {
  status: 'matched' | 'no_match';
  opponentId?: string;
  matchId?: string;
};

export type UserStats = {
  singleplayermatches?: number;
  singleplayerwins?: number;
  singleplayerlosses?: number;
  singleplayerrank?: number;
  multiplayermatches?: number;
  multiplayerwins?: number;
  multiplayerlosses?: number;
  multiplayerrank?: number;
};

export type UserData = {
  sessionId: string;
  userId: string;
  name: string;
  lastSeen: number;
  avatar?: string;
};

export type UserRecord = UserData & UserStats;

export type LeaderboardDataType = {
  singleplayer: { username: string; score: number; matches: number }[];
  multiplayer: { username: string; score: number; matches: number }[];
};

export enum ConnStatus {
  Disconn,
  Conn,
}

export type RealtimeUserMessage = {
  user: UserRecord;
  status: ConnStatus;
};

export type MatchRequest = {
  userId: string;
  username: string;
  timestamp: number;
  status: 'pending' | 'matched' | 'rejected';
};

export type MatchmakingMessage = {
  type: 'GAME_UPDATES';
  data: {
    sessionId: string;
    matchId: string;
    currentUserId: string;
    currentUserUsername: string;
    currentUserLevel: number;
    currentUserGameStatus: 'waiting' | 'in-progress' | 'finished';
    currentUserGameResult: 'won' | 'lost' | 'tie' | null;
    currentUserScore: number;
    currentUserTimeTaken: number;
  };
};

export type WebviewToBlockMessage =
  | { type: 'INIT' }
  | {
      type: 'USER_OFFLINE';
    }
  | {
      type: 'FIND_OPPONENT_REQUEST';
    }
  | {
      type: 'UPDATE_USER_STATS_SINGLEPLAYER';
      payload: {
        win: string;
        lose: string;
      };
    }
  | {
      type: 'OPPONENT_GAME_UPDATES_REQUEST';
      payload: {
        matchId: string;
        currentUserId: string;
        currentUserUsername: string;
        currentUserLevel: number;
        currentUserGameStatus: 'waiting' | 'in-progress' | 'finished';
        currentUserGameResult: 'won' | 'lost' | 'tie' | null;
        currentUserScore: number;
        currentUserTimeTaken: number;
      };
    }
  | {
      type: 'GAME_OVER_MULTIPLAYER';
      payload: {
        matchId: string;
        winningUserId: string;
        winningUsername: string;
        loserUserId: string;
        loserUsername: string;
      };
    };

export type BlocksToWebviewMessage =
  | {
      type: 'INIT_RESPONSE';
      payload: {
        // postId: string;
        userData: UserRecord;
        activeUsersCount: number;
      };
    }
  | {
      type: 'USER_JOINED';
      payload: { activeUsersCount: number };
    }
  | {
      type: 'USER_DISCONN';
      payload: { activeUsersCount: number };
    }
  | {
      type: 'FIND_OPPONENT_RESPONSE';
      payload: {
        foundOpponent: boolean;
        matchId?: string;
        opponentId?: string;
        opponentUsername?: string;
      };
    }
  | {
      type: 'USER_STATS_UPDATED';
      payload: {
        userId: string;
        stats: UserStats;
      };
    }
  | {
      type: 'LEADERBOARD_UPDATE';
      payload: LeaderboardDataType;
    }
  | {
      type: 'OPPONENT_GAME_UPDATES_RESPONSE';
      payload: {
        matchId: string;
        opponentUsername: string;
        opponentLevel: number;
        opponentGameStatus: 'waiting' | 'in-progress' | 'finished';
        opponentGameResult: 'won' | 'lost' | 'tie' | null;
        opponentScore: number;
        opponentTimeTaken: number;
      };
    };

export type DevvitMessage = {
  type: 'devvit-message';
  data: { message: BlocksToWebviewMessage };
};
