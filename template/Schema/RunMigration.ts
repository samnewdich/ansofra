/**
 * Auto-Migration Script for Ansofra Framework (TypeScript)
 * --------------------------------------------------------------
 * TypeScript equivalent of Schema/RunMigration.php.
 *
 * This assumes you have set SERVER, SERVER_USER, SERVER_DB,
 * SERVER_PASS in the .env file.
 * Automatically creates tables defined in Schema/Platform.ts.
 *
 * IMPORTANT:
 * - Only set createDatabase to true when you want to create database
 * - Change createDatabase to false after first successful run
 * - In production: protect or remove this route after initial setup
 *
 * USAGE
 *  - From terminal:  npm run migrate
 *  - In Development: open http://localhost:8080/ansofra/apiadmin/run_migration
 *  - In Production:  open http://yourdomain.com/apiadmin/run_migration
 * --------------------------------------------------------------
 */
import { Migration } from "./Migration";
import { Platform } from "./Platform";
import { Settings } from "./Settings";

const createDatabase = false; // Set to false after first run!
const verbose = true;         // show more details

export async function runMigration(): Promise<string> {
  const out: string[] = [];
  const dbName = Settings.SERVER_DB;

  if (!dbName) {
    return "ERROR: SERVER_DB is not set in .env / Settings.ts\n";
  }

  if (createDatabase) {
    out.push(`Attempting to create database: ${dbName} ...<br>`);
    const dbMigration = new Migration();
    try {
      const dbResult = await dbMigration.createDB(dbName);
      out.push(dbResult + "<br>");
    } catch (e: any) {
      out.push("→ EXCEPTION: " + e.message + "<hr/>");
    }
  } else {
    out.push("Database creation skipped (already done or disabled).<hr>");
  }

  /**
   * Reflection over Platform - find every XXX_TABLE_COLUMNS constant
   * and its matching XXX_TABLE constant (same trick as the PHP
   * ReflectionClass version).
   */
  const constants = Object.getOwnPropertyNames(Platform).filter(
    (n) => !["length", "name", "prototype"].includes(n)
  );

  interface TableToMigrate {
    table: string;
    columns: string[];
    constName: string;
  }
  const tablesToMigrate: TableToMigrate[] = [];

  for (const constName of constants) {
    if (!constName.endsWith("_TABLE_COLUMNS")) {
      continue;
    }

    // Get corresponding table name constant
    const tableConstName = constName.replace("_TABLE_COLUMNS", "_TABLE");

    if (!(tableConstName in Platform)) {
      if (verbose) out.push(`[SKIP] Missing matching table constant: ${tableConstName} <br>`);
      continue;
    }

    const tableName = (Platform as any)[tableConstName];
    const value = (Platform as any)[constName];

    // Safety checks
    if (typeof tableName !== "string" || tableName.trim() === "") {
      if (verbose) out.push(`[SKIP] Invalid/empty table name for ${constName} → '${tableName}' <br>`);
      continue;
    }

    if (!Array.isArray(value) || value.length === 0) {
      if (verbose) out.push(`[SKIP] Empty or invalid columns for table '${tableName}' <br>`);
      continue;
    }

    // Store the pair
    tablesToMigrate.push({ table: tableName, columns: value, constName });
  }

  if (tablesToMigrate.length === 0) {
    return out.join("\n") + "No valid tables found to migrate. <br>";
  }

  out.push(`Found ${tablesToMigrate.length} tables to create/migrate.<br>`);
  out.push("=".repeat(60) + "<br><br>");

  for (const item of tablesToMigrate) {
    out.push(`Processing table: ${item.table} <br>`);
    out.push(`  → From constant: ${item.constName} <br>`);
    out.push(`  → Columns: ${item.columns.length}<br>`);

    try {
      const migration = new Migration(item.columns, item.table);
      const result = await migration.createTB();
      out.push(result);
    } catch (e: any) {
      out.push("→ EXCEPTION: " + e.message + "<hr/>");
    }

    out.push("-".repeat(60) + "<hr/>");
  }

  out.push("Migration finished.\n");
  return out.join("\n");
}

/** OR if you prefer manual migration:
 *
 * const dbName = Settings.SERVER_DB;
 * const usersTable = Platform.USERS_TABLE;
 * const usersTableColumns = Platform.USERS_TABLE_COLUMNS;
 *
 * // NOTE: YOU CAN COMMENT OR REMOVE ANY MIGRATION YOU DON'T NEED
 *
 * // Create DB (NB: comment it out if you already created DB)
 * const newMigration = new Migration();
 * console.log(await newMigration.createDB(dbName));
 *
 * // create table (NB: comment it out if you already created the table)
 * const tblMigration = new Migration(usersTableColumns, usersTable);
 * console.log(await tblMigration.createTB());
 */

// Allow running directly from terminal: npm run migrate
if (require.main === module) {
  runMigration()
    .then((res) => {
      console.log(res.replace(/<br\s*\/?>/g, "\n").replace(/<hr\s*\/?>/g, "\n" + "-".repeat(60) + "\n"));
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
