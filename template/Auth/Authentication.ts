/**
 * Auth/Authentication.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Auth/Authentication.php (namespace NewdichAuth).
 *
 * Creates a JWT token after a successful login and sets it as
 * an HttpOnly cookie - exactly like the PHP version did with
 * firebase/php-jwt + setcookie().
 * --------------------------------------------------------------
 */
import { ServerResponse } from "http";
import * as jwt from "jsonwebtoken";
import { Settings } from "../Schema/Settings";

const pretty = (data: any): string => JSON.stringify(data, null, 4);

export class Authentication {
  private jwtSecret = Settings.AUTH_KEY;
  private jwtKey = Settings.JWT_KEY;
  private jwtExpiry = Settings.JWT_EXPIRY;
  private jwtSecureLevel = Settings.JWT_SECURE_LEVEL;
  private jwtSameSite = Settings.JWT_SAMESITE;
  private jwthash = Settings.JWT_HASH_ALGORITHM as jwt.Algorithm;
  private domain = Settings.DOMAIN_NAME;
  private rootdir = Settings.ROOT_DIRECTORY;

  public auth(res: ServerResponse, email: string, role: string): string {
    if (email !== "" && role !== "") {
      // NOW authorize with jwtSecret
      const now = Math.floor(Date.now() / 1000);
      const authPayload = {
        iss: this.domain,
        aud: this.domain,
        iat: now,
        exp: now + Number(this.jwtExpiry),
        user_id: email.trim(),
        role: role.trim()
      };
      const authhash = jwt.sign(authPayload, this.jwtSecret, { algorithm: this.jwthash });

      // set it into cookie (HttpOnly, like the PHP setcookie call)
      const cookieParts = [
        `${this.jwtKey}=${authhash}`,
        `Max-Age=${Number(this.jwtExpiry)}`,
        `Path=${this.rootdir || "/"}`,
        "HttpOnly",
        `SameSite=${this.jwtSameSite}`
      ];
      if (this.domain) cookieParts.splice(3, 0, `Domain=${this.domain}`); // must be empty if domain is ip address
      if (this.jwtSecureLevel) cookieParts.push("Secure");

      res.setHeader("Set-Cookie", cookieParts.join("; "));

      return pretty({ status: "success", response: authhash });
    } else {
      // you can modify to add any role you want during authentication
      return pretty({ status: "failed", response: "user_id not provided" });
    }
  }
}
