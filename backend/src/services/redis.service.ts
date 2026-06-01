import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

class RedisService {
  private client: Redis | null = null;
  private isConnected = false;

  constructor() {
    if (process.env.NODE_ENV === 'test') {
      return; // Skip Redis in tests
    }

    try {
      this.client = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 1,
        showFriendlyErrorStack: true,
        retryStrategy: (times) => {
          // Retry connection up to 3 times before staying disconnected
          if (times > 3) {
            console.warn('Redis connection failed: Max retries reached. Caching is disabled.');
            this.isConnected = false;
            return null; // stop retrying
          }
          return Math.min(times * 100, 2000);
        },
      });

      this.client.on('connect', () => {
        console.log('Redis connected successfully');
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        // Log errors but don't crash
        console.warn('Redis Client Error:', err.message);
        this.isConnected = false;
      });
    } catch (error) {
      console.warn('Redis Initialization Error:', error);
      this.client = null;
      this.isConnected = false;
    }
  }

  /**
   * Get cached item
   */
  public async get<T>(key: string): Promise<T | null> {
    if (!this.client || !this.isConnected) return null;
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error getting key "${key}" from Redis:`, error);
      return null;
    }
  }

  /**
   * Set cached item with TTL (Time to Live)
   */
  public async set(key: string, value: unknown, ttlSeconds = 300): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;
    try {
      const dataStr = JSON.stringify(value);
      await this.client.set(key, dataStr, 'EX', ttlSeconds);
      return true;
    } catch (error) {
      console.error(`Error setting key "${key}" in Redis:`, error);
      return false;
    }
  }

  /**
   * Delete cached item
   */
  public async del(key: string): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error(`Error deleting key "${key}" from Redis:`, error);
      return false;
    }
  }

  /**
   * Delete cached items matching a pattern (wildcard)
   */
  public async delPattern(pattern: string): Promise<boolean> {
    if (!this.client || !this.isConnected) return false;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
      return true;
    } catch (error) {
      console.error(`Error deleting pattern "${pattern}" from Redis:`, error);
      return false;
    }
  }
}

export const redisService = new RedisService();
export default redisService;
