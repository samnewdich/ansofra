/**
 * Cache/Setup.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Cache/Setup.php (namespace NewdichCache).
 *
 * Connects to the Redis server using the credentials from the
 * .env file (via Settings).
 * --------------------------------------------------------------
 */
import Redis from "ioredis";
import { Settings } from "../Schema/Settings";

export class Setup {
  private redisServerIp = Settings.REDIS_SERVER_IP;
  private redisServerPort = Settings.REDIS_SERVER_PORT;
  private redisServerPassword = Settings.REDIS_AUTH_PASSWORD;

  private static client: Redis | null = null;

  public connect(): Redis {
    if (!Setup.client) {
      Setup.client = new Redis({
        host: this.redisServerIp,
        port: this.redisServerPort,
        password: this.redisServerPassword || undefined,
        lazyConnect: true,
        maxRetriesPerRequest: 1
      });
    }
    return Setup.client;
  }
}
