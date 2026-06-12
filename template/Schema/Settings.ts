/**
 * Schema/Settings.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Schema/Settings.php (namespace NewdichSchema).
 *
 * In PHP this class exposed all the constants defined in
 * boostrap.php as class constants (Settings::APP_NAME etc).
 * Here it does exactly the same with static readonly members,
 * so everywhere in the framework you use:
 *
 *      import { Settings } from "../Schema/Settings";
 *      Settings.APP_NAME
 * --------------------------------------------------------------
 */
import * as bootstrap from "../bootstrap";

export class Settings {
  public static readonly DOC_ROOT = bootstrap.DOC_ROOT;
  public static readonly ROOT_DIRECTORY = bootstrap.ROOT_DIRECTORY;
  public static readonly APP_ENV = bootstrap.APP_ENV;
  public static readonly APP_VERSION = bootstrap.APP_VERSION;
  public static readonly APP_NAME = bootstrap.APP_NAME;
  public static readonly APP_URL = bootstrap.APP_URL;
  public static readonly APP_TITLE = bootstrap.APP_TITLE;
  public static readonly APP_DESCRIPTION = bootstrap.APP_DESCRIPTION;
  public static readonly APP_SMTP = bootstrap.APP_SMTP;
  public static readonly APP_PORT = bootstrap.APP_PORT;
  public static readonly APP_OTP_EMAIL = bootstrap.APP_OTP_EMAIL;
  public static readonly APP_OTP_EMAIL_PASSWORD = bootstrap.APP_OTP_EMAIL_PASSWORD;
  public static readonly APP_SENDING_EMAIL = bootstrap.APP_SENDING_EMAIL;
  public static readonly APP_SENDING_EMAIL_PASSWORD = bootstrap.APP_SENDING_EMAIL_PASSWORD;

  // the port the built-in Node server listens on
  public static readonly SERVER_PORT = bootstrap.SERVER_PORT;

  // FOR MAILING VIA SENDGRID
  public static readonly SENDGRID_API_KEY = bootstrap.SENDGRID_API_KEY;
  public static readonly SENDGRID_CUSTOMIZED_DOMAIN_EMAIL = bootstrap.SENDGRID_CUSTOMIZED_DOMAIN_EMAIL;
  public static readonly SENDGRID_MAILING_ENDPOINT = bootstrap.SENDGRID_MAILING_ENDPOINT;

  // FOR MAILING VIA MAILGUN
  public static readonly MAILGUN_API_KEY = bootstrap.MAILGUN_API_KEY;
  public static readonly MAILGUN_CUSTOMIZED_DOMAIN_EMAIL = bootstrap.MAILGUN_CUSTOMIZED_DOMAIN_EMAIL;
  public static readonly MAILGUN_VERIFIED_DOMAIN = bootstrap.MAILGUN_VERIFIED_DOMAIN;
  public static readonly MAILGUN_MAILING_ENDPOINT = bootstrap.MAILGUN_MAILING_ENDPOINT;

  // for mailersend
  public static readonly MAILERSEND_API_KEY = bootstrap.MAILERSEND_API_KEY;
  public static readonly MAILERSEND_CUSTOMIZED_DOMAIN_EMAIL = bootstrap.MAILERSEND_CUSTOMIZED_DOMAIN_EMAIL;
  public static readonly MAILERSEND_VERIFIED_DOMAIN = bootstrap.MAILERSEND_VERIFIED_DOMAIN;
  public static readonly MAILERSEND_MAILING_ENDPOINT = bootstrap.MAILERSEND_MAILING_ENDPOINT;

  // for annotations (swagger docs)
  public static readonly APP_ANNOTATION_TITLE = bootstrap.APP_ANNOTATION_TITLE;
  public static readonly SRC_ANNOTATION_TITLE = bootstrap.SRC_ANNOTATION_TITLE;

  // set server configuration (MySQL)
  public static readonly SERVER = bootstrap.SERVER;
  public static readonly SERVER_USER = bootstrap.SERVER_USER;
  public static readonly SERVER_DB = bootstrap.SERVER_DB;
  public static readonly SERVER_PASS = bootstrap.SERVER_PASS;

  // other configuration
  public static readonly DOMAIN_NAME = bootstrap.DOMAIN_NAME;

  // JWT Configuration
  public static readonly AUTH_KEY = bootstrap.AUTH_KEY;
  public static readonly JWT_KEY = bootstrap.JWT_KEY;
  public static readonly JWT_EXPIRY = bootstrap.JWT_EXPIRY;
  public static readonly JWT_SECURE_LEVEL = bootstrap.JWT_SECURE_LEVEL;
  public static readonly JWT_SAMESITE = bootstrap.JWT_SAMESITE;
  public static readonly JWT_HASH_ALGORITHM = bootstrap.JWT_HASH_ALGORITHM;

  // for redis caching
  public static readonly REDIS_SERVER_IP = bootstrap.REDIS_SERVER_IP;
  public static readonly REDIS_SERVER_PORT = bootstrap.REDIS_SERVER_PORT;
  public static readonly REDIS_AUTH_PASSWORD = bootstrap.REDIS_AUTH_PASSWORD;

  // for file and uploading
  public static readonly UPLOAD_DIRECTORY = bootstrap.UPLOAD_DIRECTORY;
  public static readonly MAX_UPLOAD_SIZE = bootstrap.MAX_UPLOAD_SIZE;

  // for paystack
  public static readonly PAYSTACK_SECRET_KEY = bootstrap.PAYSTACK_SECRET_KEY;
  public static readonly PAYSTACK_PUBLIC_KEY = bootstrap.PAYSTACK_PUBLIC_KEY;
  public static readonly PAYSTACK_VERIFICATION_LINK = bootstrap.PAYSTACK_VERIFICATION_LINK;
  public static readonly PAYSTACK_GENERATE_RESERVED_LINK = bootstrap.PAYSTACK_GENERATE_RESERVED_LINK;

  // for exchangerateapi
  public static readonly EXCHANGERATE_APIKEY = bootstrap.EXCHANGERATE_APIKEY;
  public static readonly EXCHANGERATE_LINK = bootstrap.EXCHANGERATE_LINK;

  public static readonly MARCHANT_CODE = bootstrap.MARCHANT_CODE;
}
