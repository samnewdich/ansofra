/**
 * Cache/Index.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Cache/Index.php (namespace NewdichCache).
 *
 * The caching toolbox of the framework (Redis):
 *   - setCache()        save a value
 *   - setExpireCache()  save a value that expires after X seconds
 *   - setIncrease()     increase a counter
 *   - setDecrease()     decrease a counter
 *   - getCache()        read a value
 *   - setExpire()       give an existing key an expiry time
 * --------------------------------------------------------------
 */
import { Setup } from "./Setup";

const pretty = (data: any): string => JSON.stringify(data, null, 4);

export class Index {
  private conRedis() {
    const newSetup = new Setup();
    return newSetup.connect();
  }

  public async setCache(key: string, dataToCache: string): Promise<string> {
    try {
      await this.conRedis().set(key, dataToCache);
      return pretty({ status: "success", response: "successfully cached" });
    } catch (e: any) {
      return pretty({ status: "failed", response: e.message });
    }
  }

  public async setExpireCache(key: string, dataToCache: string, time: number): Promise<string> {
    try {
      time = Math.trunc(Number(time));
      await this.conRedis().setex(key, time, dataToCache);
      return pretty({ status: "success", response: "successfully cached with expiration time" });
    } catch (e: any) {
      return pretty({ status: "failed", response: e.message });
    }
  }

  public async setIncrease(key: string): Promise<string> {
    try {
      await this.conRedis().incr(key);
      const arrayOut = {
        message: "successfully increased",
        value: await this.conRedis().get(key)
      };
      return pretty({ status: "success", response: arrayOut });
    } catch (e: any) {
      return pretty({ status: "failed", response: e.message });
    }
  }

  public async setDecrease(key: string): Promise<string> {
    try {
      await this.conRedis().decr(key);
      const arrayOut = {
        message: "successfully decreased",
        value: await this.conRedis().get(key)
      };
      return pretty({ status: "success", response: arrayOut });
    } catch (e: any) {
      return pretty({ status: "failed", response: e.message });
    }
  }

  public async getCache(key: string): Promise<string> {
    try {
      const dataretrieved = await this.conRedis().get(key);
      return pretty({ status: "success", response: dataretrieved });
    } catch (e: any) {
      return pretty({ status: "failed", response: e.message });
    }
  }

  public async setExpire(key: string, window: number): Promise<string> {
    try {
      window = Math.trunc(Number(window));
      await this.conRedis().expire(key, window);
      return pretty({ status: "success", response: "successfully expired" });
    } catch (e: any) {
      return pretty({ status: "failed", response: e.message });
    }
  }
}
