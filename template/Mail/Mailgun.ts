/**
 * Mail/Mailgun.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Mail/Mailgun.php (namespace NewdichMail).
 * Sends email through the Mailgun HTTP API.
 * --------------------------------------------------------------
 */
import { Settings } from "../Schema/Settings";

const pretty = (data: any): string => JSON.stringify(data, null, 4);

export class Mailgun {
  private apiKey: string = Settings.MAILGUN_API_KEY;
  private customEmail = Settings.MAILGUN_CUSTOMIZED_DOMAIN_EMAIL;
  private api = Settings.MAILGUN_MAILING_ENDPOINT;
  private appName = Settings.APP_NAME;

  public async send(recipient: string, recipientName: string, subject: string, content: string): Promise<string> {
    try {
      const form = new URLSearchParams();
      form.append("from", `${this.appName} ${this.customEmail}`);
      form.append("to", recipient);
      form.append("subject", subject);
      form.append("html", content);

      const response = await fetch(this.api, {
        method: "POST",
        headers: {
          Authorization: "Basic " + Buffer.from(`api:${this.apiKey}`).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: form.toString()
      });

      const httpCode = response.status;
      const responseText = await response.text();

      if (httpCode >= 400) {
        return pretty({ status: "failed", response: "Mailgun error: " + responseText });
      }

      return pretty({ status: "success", response: "Email delivered" });
    } catch (e: any) {
      return pretty({ status: "failed", response: e.message });
    }
  }
}
