import { REDIS_KEYS } from '@/shared.js';
import { Devvit } from '@devvit/public-api';

// TODO: Not tested. Need to manually test the creation and deletion of posts, keys etc

// Scheduler creates a game automatically every month
// Deletes all previous game data (keys) from Redis
// New keys will be set as soon as people start playing
Devvit.addSchedulerJob({
  name: 'create_monthly_game',
  onRun: async (_, context) => {
    const now = new Date();
    const monthName = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();

    const currentSubreddit = await context.reddit.getCurrentSubreddit();

    // Create a new post for the monthly game
    const post = await context.reddit.submitPost({
      subredditName: currentSubreddit.name,
      title: `FallWord Game - ${monthName}, ${year}`,
      text: "Welcome to this month's Fallword game! Good luck and have fun!",
    });

    // Delete all previous keys (reset redis)
    for (const key of Object.values(REDIS_KEYS)) {
      await context.redis.del(key);
    }

    // Set expiry for the new keys
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const secondsUntilEndOfMonth = Math.floor((lastDayOfMonth.getTime() - now.getTime()) / 1000);

    for (const key of Object.values(REDIS_KEYS)) {
      await context.redis.expire(key, secondsUntilEndOfMonth);
    }
  },
});

// PostSubmit trigger for when someone creates a post mid-month
// Calculates the time til the end of the month and adds this to the expiry of all keys
// Scheduler anyway will delete the keys
Devvit.addTrigger({
  event: 'PostSubmit',
  onEvent: async (event, context) => {
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const secondsUntilEndOfMonth = Math.floor((lastDayOfMonth.getTime() - now.getTime()) / 1000);

    try {
      for (const key of Object.values(REDIS_KEYS)) {
        await context.redis.expire(key, secondsUntilEndOfMonth);
      }
      console.log(`Expiry set on all Redis keys until ${lastDayOfMonth.toISOString()}`);
    } catch (error) {
      console.error('Error setting expiry on Redis keys:', error);
    }
  },
});

// When someone installs the app on their subreddit, this trigger will schedule the scheduler above
Devvit.addTrigger({
  event: 'AppInstall',
  onEvent: async (_, context) => {
    try {
      const jobId = await context.scheduler.runJob({
        name: 'create_monthly_game',
        cron: '0 0 1 * *', // Run at 00:00 on the first day of every month
      });
      await context.redis.set('monthly_game_job_id', jobId);
      console.log('Monthly game creation job scheduled successfully');
    } catch (e) {
      console.error('Error scheduling monthly game creation job:', e);
    }
  },
});

export default Devvit;
