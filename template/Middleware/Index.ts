/**
 * Middleware/Index.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Middleware/Index.php (namespace NewdichMiddleware).
 *
 * Helpers used everywhere in the framework:
 *   - getIp()       get the client's IP address
 *   - hashData()    hash a value with bcrypt (passwords)
 *   - verifyHash()  verify a value against a bcrypt hash
 *   - cleanData()   sanitize incoming string data
 *   - otp()         generate a 6 digit one-time-password
 *   - marchantCode() generate a 10 digit merchant code
 *   - apiHeaders()  read host / content-type / api key from headers
 * --------------------------------------------------------------
 */
import { IncomingMessage } from "http";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";

const pretty = (data: any): string => JSON.stringify(data, null, 4);

export class Index {
  constructor() {}

  public getIp(req: IncomingMessage): string {
    const clientIp = req.headers["client-ip"];
    const forwarded = req.headers["x-forwarded-for"];

    if (clientIp && String(clientIp) !== "") {
      return String(clientIp);
    } else if (forwarded && String(forwarded) !== "") {
      return String(forwarded).split(",")[0].trim();
    } else {
      return req.socket.remoteAddress ?? "";
    }
  }

  public hashData(data: string): string {
    const hash = bcrypt.hashSync(data, 10); // bcrypt, like PASSWORD_BCRYPT in PHP
    return hash;
  }

  public verifyHash(data: string, hash: string): boolean {
    return bcrypt.compareSync(data, hash); // returns a boolean
  }

  public cleanData(data: any): string {
    if (data === null || data === undefined) return "";
    return String(data)
      .trim()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;"); // same as trim(htmlspecialchars($data))
  }

  public otp(req?: IncomingMessage): string {
    const seed = String(Math.floor(Date.now() / 1000)) + (req ? this.getIp(req) : "");
    const hash = crypto.createHash("md5").update(seed).digest("hex");
    const num = String(parseInt(hash.substring(0, 12), 16));
    return num.substring(0, 6);
  }

  public marchantCode(req?: IncomingMessage): string {
    const seed = String(Math.floor(Date.now() / 1000)) + (req ? this.getIp(req) : "");
    const hash = crypto.createHash("md5").update(seed).digest("hex");
    const num = String(parseInt(hash.substring(0, 14), 16));
    return num.substring(0, 10);
  }

  public apiHeaders(req: IncomingMessage): string {
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      headers[key.toLowerCase()] = Array.isArray(value) ? value[0] : String(value ?? "");
    }

    const host = headers["host"] ?? "";
    const contentType = headers["content-type"] ?? "";
    const authorization = headers["authorization"] ?? headers["x-api-key"] ?? headers["api-key"] ?? "";

    let label = "";
    let apiKey = "";
    if (authorization) {
      const matches = authorization.match(/^(Bearer|ApiKey|Token|SecretKey)\s+(\S+)$/i);
      if (matches) {
        label = matches[1];
        apiKey = matches[2];
      } else {
        apiKey = authorization;
      }
    }

    if (host && contentType && apiKey) {
      return pretty({
        status: "success",
        response: { host, contentType, apiKey, label }
      });
    }

    return pretty({
      status: "failed",
      response: "Could not retrieve headers info"
    });
  }
}
