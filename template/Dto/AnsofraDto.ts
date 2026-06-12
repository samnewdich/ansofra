/**
 * Dto/AnsofraDto.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Dto/AnsofraDto.php (namespace NewdichDto).
 *
 * DTO = Data Transfer Object.
 * Every request body coming into a controller is wrapped into
 * this object. Declare every field your app will ever receive
 * here. Any field not present in the incoming request becomes ''
 * (empty string) - exactly like the PHP version.
 *
 * Add more fields as your project grows.
 * --------------------------------------------------------------
 */
export class AnsofraDto {
  public email = "";
  public password = "";
  public fullname = "";
  public username = "";
  public phone = "";
  public country = "";
  public region = "";
  public city = "";
  public address = "";
  public zip_code = "";
  public date_created = "";
  public last_seen = "";
  public picture = "";
  public role = "";
  public database_name = "";
  public marchant_code = "";
  public my_code = "";
  public agent_code = "";
  public currency = "";
  public currency_pair = "";
  public status = "";
  public approval_status = "";
  public amount = "";
  public reference = "";
  public admins_id = "";
  public users_id = "";
  public conditioner = "";
  public offset = "";
  public limit = "";
  public start_date = "";
  public end_date = "";

  public package_name = "";
  public price = "";
  public plan_type = "";
  public business_name = "";
  public package_id = "";
  public state = "";
  public refer_code = "";
  public refer_by = "";
  public discount = "";
  public quantity = "";
  public duration = "";
  public plans_id = "";

  public bank_name = "";
  public account_name = "";
  public account_number = "";
  public account_type = "";
  public bank = "";
  public id_type = "";
  public id_number = "";
  public kyc_document = "";
  public otp = "";
  public commision_rate = "";

  // payment table
  public gateway = "";
  public date_paid = "";
  public date_requested = "";
  public plan = "";
  public ip = "";
  public expires_at = "";
  public date_completed = "";
  public date_started = "";
  public transaction_id = "";
  public payment_id = "";
  public fee = "";
  public fee_rate = "";

  public invoice = "";
  public bank_details = "";
  public current_time = "";

  constructor(inData: Record<string, any> | null | undefined) {
    const data = inData ?? {};
    const allProp = Object.keys(this);
    for (const k of allProp) {
      (this as any)[k] = data[k] !== undefined && data[k] !== null ? data[k] : "";
    }
  }
}
