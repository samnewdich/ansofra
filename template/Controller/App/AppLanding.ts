/**
 * Controller/App/AppLanding.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Controller/App/AppLanding.php.
 * Serves the swagger documentation page of the USERS AREA (/api).
 * --------------------------------------------------------------
 */
import { IncomingMessage, ServerResponse } from "http";
import * as path from "path";
import { sendFile } from "../../route/helpers";

export async function AppLanding(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const candidates = [
    path.join(__dirname, "..", "..", "ansofra", "public", "swagger", "index.html"),
    path.join(__dirname, "..", "..", "..", "ansofra", "public", "swagger", "index.html"),
    path.join(process.cwd(), "ansofra", "public", "swagger", "index.html")
  ];
  const fs = require("fs");
  const target = candidates.find((p: string) => fs.existsSync(p)) ?? candidates[0];
  sendFile(res, target);
}
