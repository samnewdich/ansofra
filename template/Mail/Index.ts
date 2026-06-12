/**
 * Mail/Index.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Mail/Index.php (namespace NewdichMail).
 *
 * Sends mail via your own SMTP server (uses nodemailer, the
 * Node.js equivalent of PHPMailer):
 *   - sendOtp()   send OTP emails (uses the OTP email account)
 *   - sendMail()  send normal emails (uses the sending email account)
 * --------------------------------------------------------------
 */
import * as nodemailer from "nodemailer";
import { Settings } from "../Schema/Settings";

const pretty = (data: any): string => JSON.stringify(data, null, 4);

export class Index {
  private host = Settings.APP_SMTP;
  private otpmail = Settings.APP_OTP_EMAIL;
  private otpmailpass = Settings.APP_OTP_EMAIL_PASSWORD;
  private mailport = Settings.APP_PORT;
  private appname = Settings.APP_NAME;
  private mailaddr = Settings.APP_SENDING_EMAIL;
  private mailaddrpass = Settings.APP_SENDING_EMAIL_PASSWORD;

  public async sendOtp(subject: string, body: string, recipient: string): Promise<string> {
    try {
      const transporter = nodemailer.createTransport({
        host: this.host,
        port: Number(this.mailport),
        secure: false, // STARTTLS, like PHPMailer::ENCRYPTION_STARTTLS
        auth: {
          user: this.otpmail,
          pass: this.otpmailpass
        }
      });

      await transporter.sendMail({
        from: `"${this.appname}" <${this.otpmail}>`,
        to: recipient,
        subject: subject,
        html: body
      });

      return pretty({ status: "success", response: `OTP was delivered to ${recipient}` });
    } catch (e: any) {
      return pretty({ status: "failed", response: `OTP failed to deliver ${e.message}` });
    }
  }

  public async sendMail(subject: string, body: string, recipient: string): Promise<string> {
    try {
      const transporter = nodemailer.createTransport({
        host: this.host,
        port: Number(this.mailport),
        secure: false, // STARTTLS
        auth: {
          user: this.mailaddr,
          pass: this.mailaddrpass
        }
      });

      await transporter.sendMail({
        from: `"${this.appname}" <${this.mailaddr}>`,
        to: recipient,
        subject: subject,
        html: body
      });

      return pretty({ status: "success", response: `Mail was delivered to ${recipient}` });
    } catch (e: any) {
      return pretty({ status: "failed", response: `Mail failed to deliver ${e.message}` });
    }
  }
}
