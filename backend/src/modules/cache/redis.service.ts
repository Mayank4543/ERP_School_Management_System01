import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(private readonly configService: ConfigService) {
    const redisConfig: any = {
      host: this.configService.get<string>('redis.host'),
      port: this.configService.get<number>('redis.port'),
      db: this.configService.get<number>('redis.db'),
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    };

    // Add password if provided
    const password = this.configService.get<string>('redis.password');
    if (password) {
      redisConfig.password = password;
    }

    // Add username if provided (for Redis 6+ ACL)
    const username = this.configService.get<string>('redis.username');
    if (username) {
      redisConfig.username = username;
    }

    this.client = new Redis(redisConfig);

    this.client.on('connect', () => {
      this.logger.log('Redis connected successfully');
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis connection error:', err);
    });
  }

  onModuleDestroy() {
    this.client.disconnect();
  }

  // Get value from cache
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Error getting key ${key}: ${error.message}`);
      return null;
    }
  }

  // Set value in cache with TTL
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      const cacheTtl = ttl || this.configService.get<number>('redis.ttl');
      
      if (cacheTtl) {
        await this.client.setex(key, cacheTtl, serialized);
      } else {
        await this.client.set(key, serialized);
      }
    } catch (error) {
      this.logger.error(`Error setting key ${key}: ${error.message}`);
    }
  }

  // Delete key from cache
  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key ${key}: ${error.message}`);
    }
  }

  // Delete multiple keys matching pattern
  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      this.logger.error(`Error deleting pattern ${pattern}: ${error.message}`);
    }
  }

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Error checking key ${key}: ${error.message}`);
      return false;
    }
  }

  // Set expiry time for a key
  async expire(key: string, ttl: number): Promise<void> {
    try {
      await this.client.expire(key, ttl);
    } catch (error) {
      this.logger.error(`Error setting expiry for key ${key}: ${error.message}`);
    }
  }

  // Get multiple keys
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const values = await this.client.mget(...keys);
      return values.map((value) => (value ? JSON.parse(value) : null));
    } catch (error) {
      this.logger.error(`Error getting multiple keys: ${error.message}`);
      return keys.map(() => null);
    }
  }

  // Set multiple keys
  async mset(keyValues: Record<string, any>): Promise<void> {
    try {
      const pipeline = this.client.pipeline();
      Object.entries(keyValues).forEach(([key, value]) => {
        pipeline.set(key, JSON.stringify(value));
      });
      await pipeline.exec();
    } catch (error) {
      this.logger.error(`Error setting multiple keys: ${error.message}`);
    }
  }

  // Increment counter
  async incr(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      this.logger.error(`Error incrementing key ${key}: ${error.message}`);
      return 0;
    }
  }

  // Decrement counter
  async decr(key: string): Promise<number> {
    try {
      return await this.client.decr(key);
    } catch (error) {
      this.logger.error(`Error decrementing key ${key}: ${error.message}`);
      return 0;
    }
  }

  // Hash operations
  async hset(key: string, field: string, value: any): Promise<void> {
    try {
      await this.client.hset(key, field, JSON.stringify(value));
    } catch (error) {
      this.logger.error(`Error setting hash ${key}.${field}: ${error.message}`);
    }
  }

  async hget<T>(key: string, field: string): Promise<T | null> {
    try {
      const value = await this.client.hget(key, field);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error(`Error getting hash ${key}.${field}: ${error.message}`);
      return null;
    }
  }

  async hgetall<T>(key: string): Promise<Record<string, T>> {
    try {
      const data = await this.client.hgetall(key);
      const result: Record<string, T> = {};
      Object.entries(data).forEach(([field, value]) => {
        result[field] = JSON.parse(value);
      });
      return result;
    } catch (error) {
      this.logger.error(`Error getting all hash ${key}: ${error.message}`);
      return {};
    }
  }

  // List operations
  async lpush(key: string, ...values: any[]): Promise<number> {
    try {
      const serialized = values.map((v) => JSON.stringify(v));
      return await this.client.lpush(key, ...serialized);
    } catch (error) {
      this.logger.error(`Error pushing to list ${key}: ${error.message}`);
      return 0;
    }
  }

  async lrange<T>(key: string, start: number, stop: number): Promise<T[]> {
    try {
      const values = await this.client.lrange(key, start, stop);
      return values.map((v) => JSON.parse(v));
    } catch (error) {
      this.logger.error(`Error getting list range ${key}: ${error.message}`);
      return [];
    }
  }

  // Set operations
  async sadd(key: string, ...members: any[]): Promise<number> {
    try {
      const serialized = members.map((m) => JSON.stringify(m));
      return await this.client.sadd(key, ...serialized);
    } catch (error) {
      this.logger.error(`Error adding to set ${key}: ${error.message}`);
      return 0;
    }
  }

  async smembers<T>(key: string): Promise<T[]> {
    try {
      const members = await this.client.smembers(key);
      return members.map((m) => JSON.parse(m));
    } catch (error) {
      this.logger.error(`Error getting set members ${key}: ${error.message}`);
      return [];
    }
  }

  // Pub/Sub operations
  async publish(channel: string, message: any): Promise<number> {
    try {
      return await this.client.publish(channel, JSON.stringify(message));
    } catch (error) {
      this.logger.error(`Error publishing to ${channel}: ${error.message}`);
      return 0;
    }
  }

  // Get raw Redis client for advanced operations
  getClient(): Redis {
    return this.client;
  }

  // Clear all cache
  async flushAll(): Promise<void> {
    try {
      await this.client.flushall();
      this.logger.log('All cache cleared');
    } catch (error) {
      this.logger.error(`Error flushing cache: ${error.message}`);
    }
  }
}
