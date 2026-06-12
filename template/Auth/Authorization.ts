/**
 * Auth/Authorization.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Auth/Authorization.php (namespace NewdichAuth).
 *
 * Reads the JWT token from the request cookie, verifies it and
 * gives back the user_id and role of the logged-in user.
 *
 * Use this in any controller / endpoint that should only be
 * accessible by a logged-in user.
 * --------------------------------------------------------------
 */
import { IncomingMessage } from "http";
import * as jwt from "jsonwebtoken";
import { Settings } from "../Schema/Settings";

const pretty = (data: any): string => JSON.stringify(data, null, 4);

export class Authorization {
  private user_id: string | undefined;
  private role: string | undefined;
  private authStatus: string = "failed";
  private authResponse: any;
  private jwtSecret = Settings.AUTH_KEY;
  private jwtKey = Settings.JWT_KEY;
  private jwthash = Settings.JWT_HASH_ALGORITHM as jwt.Algorithm;

  constructor(req: IncomingMessage) {
    const cookies = this.parseCookies(req.headers.cookie ?? "");

    if (!(this.jwtKey in cookies)) {
      this.authStatus = "failed";
      this.authResponse = "No Cookie found";
    }

    const authenticatedKey = cookies[this.jwtKey] ?? null;
    if (!authenticatedKey) {
      this.authStatus = "failed";
      this.authResponse = this.jwtKey + " not found in cookie";
      return;
    }

    try {
      const decodeToken = jwt.verify(authenticatedKey, this.jwtSecret, {
        algorithms: [this.jwthash]
      }) as jwt.JwtPayload;

      this.user_id = decodeToken.user_id;
      this.role = decodeToken.role;
      this.authStatus = "success";
      this.authResponse = {
        user_id: this.user_id,
        role: this.role
      };
    } catch (e: any) {
      if (e instanceof jwt.TokenExpiredError) {
        this.authStatus = "failed";
        this.authResponse = "Authorization token has expired, please relogin";
      } else {
        this.authStatus = "failed";
        this.authResponse = e.message;
      }
    }
  }

  private parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    cookieHeader.split(";").forEach((pair) => {
      const idx = pair.indexOf("=");
      if (idx > -1) {
        cookies[pair.substring(0, idx).trim()] = decodeURIComponent(pair.substring(idx + 1).trim());
      }
    });
    return cookies;
  }

  public authorize(): string {
    // returns an encoded object of {"status":"failed or success", "response":"user id or error response"}
    return pretty({ status: this.authStatus, response: this.authResponse });
  }
}
