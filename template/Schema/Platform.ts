/**
 * Schema/Platform.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Schema/Platform.php (namespace NewdichSchema).
 *
 * This is where you DESIGN YOUR DATABASE.
 * Every table is described by two constants:
 *
 *    XXX_TABLE          -> the table name (string)
 *    XXX_TABLE_COLUMNS  -> the table columns (array of SQL column
 *                          definitions, exactly like the PHP version)
 *
 * The auto migration (Schema/RunMigration.ts) scans this class,
 * finds every pair of XXX_TABLE / XXX_TABLE_COLUMNS and creates
 * the tables automatically.
 *
 * You can have as many tables as you want - just follow the
 * naming pattern.
 * --------------------------------------------------------------
 */
export class Platform {
  public static readonly USERS_TABLE = "users";
  public static readonly USERS_TABLE_COLUMNS: string[] = [
    "users_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
    "email VARCHAR(255) NOT NULL",
    "fullname VARCHAR(255)",
    "password VARCHAR(255)",
    "phone VARCHAR(255)",
    "username VARCHAR(255)",
    "account_type VARCHAR(255)",
    "picture TEXT",
    "refer_code VARCHAR(255)",
    "refer_by VARCHAR(255)",
    "status VARCHAR(255)",
    "date_created VARCHAR(255)",
    "last_seen VARCHAR(255)"
  ];

  // you can have as many tables as you want
  public static readonly ADMINS_TABLE = "admins";
  public static readonly ADMINS_TABLE_COLUMNS: string[] = [
    "admins_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
    "email VARCHAR(255) NOT NULL",
    "fullname VARCHAR(255) NOT NULL",
    "password VARCHAR(255) NOT NULL",
    "country VARCHAR(255) NOT NULL",
    "region VARCHAR(255)",
    "city VARCHAR(255)",
    "address VARCHAR(255)",
    "zip_code VARCHAR(255)",
    "phone VARCHAR(255)",
    "date_created VARCHAR(255)",
    "last_seen VARCHAR(255)",
    "picture TEXT",
    "username VARCHAR(255)",
    "role VARCHAR(255) NOT NULL"
  ];

  public static readonly PAYMENT_TABLE = "payment";
  public static readonly PAYMENT_TABLE_COLUMNS: string[] = [
    "payment_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
    "email VARCHAR(255)",
    "amount VARCHAR(255)",
    "currency VARCHAR(255)",
    "status VARCHAR(255)",
    "transaction_id VARCHAR(255)",
    "reference VARCHAR(255)",
    "gateway VARCHAR(255)",
    "fee VARCHAR(255)",
    "date_started VARCHAR(255)",
    "date_completed VARCHAR(255)"
  ];

  public static readonly PLANS_TABLE = "plans";
  public static readonly PLANS_TABLE_COLUMNS: string[] = [
    "plans_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY",
    "plan VARCHAR(255) NOT NULL",
    "duration VARCHAR(255) NOT NULL",
    "quantity VARCHAR(255)",
    "price VARCHAR(255) NOT NULL",
    "currency VARCHAR(255) NOT NULL",
    "discount VARCHAR(255)"
  ];
}
