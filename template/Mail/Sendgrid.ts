/**
 * Mail/Sendgrid.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Mail/Sendgrid.php (namespace NewdichMail).
 * Sends email through the SendGrid HTTP API (uses fetch instead
 * of PHP cURL).
 * --------------------------------------------------------------
 */
import { Settings } from "../Schema/Settings";

const pretty = (data: any): string => JSON.stringify(data, null, 4);

export class Sendgrid {
  private sendgridApiKey = Settings.SENDGRID_API_KEY;
  private customEmail = Settings.SENDGRID_CUSTOMIZED_DOMAIN_EMAIL;
  private api = Settings.SENDGRID_MAILING_ENDPOINT;

  public async send(recipient: string, recipientName: string, subject: string, content: string): Promise<string> {
    const data = {
      personalizations: [
        {
          to: [{ email: recipient }],
          subject: subject
        }
      ],
      from: {
        email: this.customEmail,
        name: recipientName
      },
      content: [
        {
          type: "text/html",
          value: content
        }
      ]
    };

    try {
      const response = await fetch(this.api, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.sendgridApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const httpCode = response.status;
      const responseText = await response.text();

      if (httpCode >= 200 && httpCode < 300) {
        return pretty({ status: "success", response: "Email sent successfully" });
      } else {
        return pretty({ status: "failed", response: "Failed to send email " + responseText });
      }
    } catch (e: any) {
      return pretty({ status: "failed", response: "Failed to send email " + e.message });
    }
  }
}
