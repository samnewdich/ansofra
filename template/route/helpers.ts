/**
 * route/helpers.ts
 * --------------------------------------------------------------
 * Small helpers used by the router and the controllers.
 * (In PHP these jobs were done by file_get_contents("php://input"),
 * echo, require_once of html files, etc.)
 * --------------------------------------------------------------
 */
import { IncomingMessage, ServerResponse } from "http";
import * as fs from "fs";
import * as path from "path";

/** Read the raw JSON body of a request (like file_get_contents("php://input")) */
export function readJsonBody(req: IncomingMessage): Promise<Record<string, any> | null> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : null);
      } catch {
        resolve(null);
      }
    });
    req.on("error", () => resolve(null));
  });
}

/** Send a JSON string back to the client (like echo json_encode(...)) */
export function sendJson(res: ServerResponse, json: string, statusCode = 200): void {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(json);
}

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".txt": "text/plain"
};

/** Serve a static file (like require_once of an html file in PHP) */
export function sendFile(res: ServerResponse, filePath: string, statusCode = 200): void {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain");
    res.end("404 - File Not Found");
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.statusCode = statusCode;
  res.setHeader("Content-Type", MIME_TYPES[ext] ?? "application/octet-stream");
  fs.createReadStream(filePath).pipe(res);
}

/** Try to serve a static file from the public folder; returns true if served */
export function tryServePublic(res: ServerResponse, publicDir: string, urlPath: string): boolean {
  // protect against path traversal & block sensitive files (.env etc - the .htaccess job)
  const safePath = path.normalize(urlPath).replace(/^(\.\.([/\\]|$))+/, "");
  const base = path.basename(safePath);
  if (/^\.env/.test(base) || /\.(ini|log|sh|bak|sql|yml|yaml)$/.test(base) || /^(package\.json|package-lock\.json|tsconfig\.json)$/.test(base)) {
    return false;
  }
  const fullPath = path.join(publicDir, safePath);
  if (!fullPath.startsWith(publicDir)) return false;

  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    sendFile(res, fullPath);
    return true;
  }
  // serve folder index.html
  const indexPath = path.join(fullPath, "index.html");
  if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
    sendFile(res, indexPath);
    return true;
  }
  return false;
}
