/**
 * bootstrap.ts
 * --------------------------------------------------------------
 * This is the TypeScript equivalent of boostrap.php in the
 * Ansofra PHP framework.
 *
 * In PHP, boostrap.php loaded the .env file with Dotenv and
 * defined all the values as PHP constants (define()).
 *
 * Here we load the .env file with the dotenv package and export
 * all the values as typed constants. Every other part of the
 * framework reads its configuration from Schema/Settings.ts,
 * which in turn reads from here.
 * --------------------------------------------------------------
 */
import * as path from "path";
import * as fs from "fs";
import * as dotenv from "dotenv";

// look for .env next to this file (dev) or one level up (compiled dist/)
const envCandidates = [
  path.join(__dirname, ".env"),
  path.join(__dirname, "..", ".env"),
  path.join(process.cwd(), ".env")
];
for (const candidate of envCandidates) {
  if (fs.existsSync(candidate)) {
    dotenv.config({ path: candidate });
    break;
  }
}

const env = (key: string, fallback = ""): string =>
  process.env[key] !== undefined ? String(process.env[key]) : fallback;

export const DOC_ROOT = env("DOC_ROOT");
export const ROOT_DIRECTORY = env("ROOT_DIRECTORY", "/ansofra");
export const APP_ENV = env("APP_ENV", "development");
export const APP_VERSION = env("APP_VERSION", "2.1.0");
export const APP_NAME = env("APP_NAME");
export const APP_URL = env("APP_URL");
export const APP_TITLE = env("APP_TITLE");
export const APP_DESCRIPTION = env("APP_DESCRIPTION");
export const APP_SMTP = env("APP_SMTP");
export const APP_PORT = env("APP_PORT");
export const APP_OTP_EMAIL = env("APP_OTP_EMAIL");
export const APP_OTP_EMAIL_PASSWORD = env("APP_OTP_EMAIL_PASSWORD");
export const APP_SENDING_EMAIL = env("APP_SENDING_EMAIL");
export const APP_SENDING_EMAIL_PASSWORD = env("APP_SENDING_EMAIL_PASSWORD");
export const APP_ANNOTATION_TITLE = env("APP_ANNOTATION_TITLE");
export const SRC_ANNOTATION_TITLE = env("SRC_ANNOTATION_TITLE");

export const SERVER_PORT = parseInt(env("SERVER_PORT", "8080"), 10);

export const SERVER = env("SERVER", "localhost");
export const SERVER_USER = env("SERVER_USER");
export const SERVER_DB = env("SERVER_DB");
export const SERVER_PASS = env("SERVER_PASS");
export const DOMAIN_NAME = env("DOMAIN_NAME");

export const AUTH_KEY = env("AUTH_KEY");
export const JWT_KEY = env("JWT_KEY", "access_token");
export const JWT_EXPIRY = parseInt(env("JWT_EXPIRY", "900"), 10);
export const JWT_SECURE_LEVEL = env("JWT_SECURE_LEVEL", "false").toLowerCase() === "true";
export const JWT_SAMESITE = env("JWT_SAMESITE", "Strict");
export const JWT_HASH_ALGORITHM = env("JWT_HASH_ALGORITHM", "HS256");

export const REDIS_SERVER_IP = env("REDIS_SERVER_IP", "127.0.0.1");
export const REDIS_SERVER_PORT = parseInt(env("REDIS_SERVER_PORT", "6379"), 10);
export const REDIS_AUTH_PASSWORD = env("REDIS_AUTH_PASSWORD");

export const UPLOAD_DIRECTORY = env("UPLOAD_DIRECTORY", "/public/uploads/");
export const MAX_UPLOAD_SIZE = parseInt(env("MAX_UPLOAD_SIZE", "2"), 10);

export const SENDGRID_API_KEY = env("SENDGRID_API_KEY");
export const SENDGRID_CUSTOMIZED_DOMAIN_EMAIL = env("SENDGRID_CUSTOMIZED_DOMAIN_EMAIL");
export const SENDGRID_MAILING_ENDPOINT = env("SENDGRID_MAILING_ENDPOINT");

export const MAILGUN_API_KEY = env("MAILGUN_API_KEY");
export const MAILGUN_CUSTOMIZED_DOMAIN_EMAIL = env("MAILGUN_CUSTOMIZED_DOMAIN_EMAIL");
export const MAILGUN_VERIFIED_DOMAIN = env("MAILGUN_VERIFIED_DOMAIN");
export const MAILGUN_MAILING_ENDPOINT = env("MAILGUN_MAILING_ENDPOINT");

export const MAILERSEND_API_KEY = env("MAILERSEND_API_KEY");
export const MAILERSEND_CUSTOMIZED_DOMAIN_EMAIL = env("MAILERSEND_CUSTOMIZED_DOMAIN_EMAIL");
export const MAILERSEND_VERIFIED_DOMAIN = env("MAILERSEND_VERIFIED_DOMAIN");
export const MAILERSEND_MAILING_ENDPOINT = env("MAILERSEND_MAILING_ENDPOINT");

export const PAYSTACK_SECRET_KEY = env("PAYSTACK_SECRET_KEY");
export const PAYSTACK_PUBLIC_KEY = env("PAYSTACK_PUBLIC_KEY");
export const PAYSTACK_VERIFICATION_LINK = env("PAYSTACK_VERIFICATION_LINK");
export const PAYSTACK_GENERATE_RESERVED_LINK = env("PAYSTACK_GENERATE_RESERVED_LINK");

export const EXCHANGERATE_APIKEY = env("EXCHANGERATE_APIKEY");
export const EXCHANGERATE_LINK = env("EXCHANGERATE_LINK");

export const MARCHANT_CODE = env("MARCHANT_CODE");
