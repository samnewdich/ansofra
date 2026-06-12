/**
 * Cache/RateLimit.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Cache/RateLimit.php (namespace NewdichCache).
 *
 * Limits how many requests an IP can make within a time window.
 * Example: new RateLimit(10, 60, ip) -> max 10 requests per minute.
 * --------------------------------------------------------------
 */
import { ServerResponse } from "http";
import { Index } from "./Index";

export class RateLimit {
  private limit: number;
  private window: number;
  private ip: string;

  constructor(limit: number, window: number, ip: string) {
    this.limit = limit;
    this.window = window;
    this.ip = ip;
  }

  /**
   * Returns true if the request is allowed,
   * otherwise writes "Too many requests" to the response and returns false.
   */
  public async process(res: ServerResponse): Promise<boolean> {
    const key = "rate:" + this.ip;

    const newIndex = new Index();
    const result = JSON.parse(await newIndex.setIncrease(key));
    const count = Number(result?.response?.value ?? 0);

    if (count === 1) {
      await newIndex.setExpire(key, this.window);
    }

    if (count > this.limit) {
      res.statusCode = 429;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          status: false,
          message: "Too many requests"
        })
      );
      return false;
    }
    return true;
  }
}
