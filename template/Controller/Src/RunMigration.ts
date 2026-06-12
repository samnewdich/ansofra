/**
 * Controller/Src/RunMigration.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Controller/Src/RunMigration.php.
 * Runs the auto migration when you visit:
 *   /apiadmin/run_migration
 * --------------------------------------------------------------
 */
import { IncomingMessage, ServerResponse } from "http";
import { runMigration } from "../../Schema/RunMigration";

export async function RunMigrationController(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const output = await runMigration();
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(output);
}
