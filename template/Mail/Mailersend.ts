/**
 * Mail/Mailersend.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Mail/Mailersend.php (namespace NewdichMail).
 * Sends email through the MailerSend HTTP API.
 * --------------------------------------------------------------
 */
import { Settings } from "../Schema/Settings";

const pretty = (data: any): string => JSON.stringify(data, null, 4);

export class Mailersend {
  private apiKey: string = Settings.MAILERSEND_API_KEY;
  private endpoint: string = Settings.MAILERSEND_MAILING_ENDPOINT;
  private mailersendmail: string = Settings.MAILERSEND_CUSTOMIZED_DOMAIN_EMAIL;
  private appname: string = Settings.APP_NAME;

  public async send(recipient: string, recipientName: string, subject: string, content: string): Promise<string> {
    const payload = {
      from: {
        email: this.mailersendmail,
        name: this.appname
      },
      to: [
        {
          email: recipient,
          name: recipientName
        }
      ],
      subject: subject,
      html: content
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);

      const httpCode = response.status;
      let body: any = null;
      try {
        body = await response.json();
      } catch {
        body = null;
      }

      return pretty({
        status: httpCode >= 200 && httpCode < 300 ? "success" : "failed",
        http_code: httpCode,
        response: body
      });
    } catch (e: any) {
      return pretty({ status: "error", response: e.message });
    }
  }
}
