/**
 * apis/CurrencyConverter.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of apis/CurrencyConverter.php (namespace NewdichApis).
 *
 * The "apis" folder is where you keep integrations with EXTERNAL
 * third-party APIs (currency conversion, payments, sms, etc).
 *
 * This api uses https://www.exchangerate-api.com/ for currency conversion.
 * --------------------------------------------------------------
 */
import { AnsofraDto } from "../Dto/AnsofraDto";
import { Settings } from "../Schema/Settings";

const pretty = (data: any): string => JSON.stringify(data, null, 4);

export class CurrencyConverter {
  private dto: AnsofraDto;
  private ExchangeRateApiKey = Settings.EXCHANGERATE_APIKEY;
  private ExchangeRateApiLink = Settings.EXCHANGERATE_LINK;

  constructor(dto: AnsofraDto) {
    this.dto = dto;
  }

  public async process(): Promise<string> {
    // This is the api key you get from https://www.exchangerate-api.com/
    const yourExchangeRateApiKey = this.ExchangeRateApiKey;

    // currency pair to convert, must be like this USD_NGN
    let currencyPair = this.dto.currency_pair;
    currencyPair = currencyPair.toUpperCase().replace(/_/g, "/");

    const url = `${this.ExchangeRateApiLink}${yourExchangeRateApiKey}/pair/${currencyPair}`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch(url, { signal: controller.signal, redirect: "follow" });
      clearTimeout(timeout);

      const body = await response.text();
      return pretty({ status: "success", response: body });
    } catch (e: any) {
      return pretty({ status: "failed", response: "Fetch Error: " + e.message });
    }
  }
}
