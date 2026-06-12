/**
 * ansofra/index.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of ansofra/index.php.
 *
 * THE ENTERING POINT OF THE FRAMEWORK.
 *
 * In PHP:
 *   - Apache sent every request to ansofra/index.php (.htaccess)
 *   - it loaded vendor/autoload.php + boostrap.php
 *   - it parsed the URL and handed it to route/index.php
 *
 * In TypeScript:
 *   - we start a Node.js HTTP server
 *   - bootstrap.ts loads the .env (imported via Settings)
 *   - every request URL is parsed and handed to route/index.ts
 *
 * Run it with:
 *   npm run dev    (development - auto reload)
 *   npm start      (production  - after npm run build)
 * --------------------------------------------------------------
 */
import * as http from "http";
import "../bootstrap"; // load .env first (like require boostrap.php)
import { Settings } from "../Schema/Settings";
import { route } from "../route/index";

const server = http.createServer(async (req, res) => {
  try {
    // $url = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`).pathname;
    await route(url, req, res);
  } catch (e: any) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ status: "failed", response: e.message }, null, 4));
  }
});

const port = Settings.SERVER_PORT;
server.listen(port, () => {
  console.log("==========================================================");
  console.log("  ANSOFRA FRAMEWORK (TypeScript) ");
  console.log(`  App: ${Settings.APP_NAME}  v${Settings.APP_VERSION}  [${Settings.APP_ENV}]`);
  console.log(`  Server running at: http://localhost:${port}${Settings.ROOT_DIRECTORY === "/" ? "" : Settings.ROOT_DIRECTORY}`);
  console.log(`  Users area:  http://localhost:${port}${Settings.ROOT_DIRECTORY === "/" ? "" : Settings.ROOT_DIRECTORY}/api`);
  console.log(`  Admin area:  http://localhost:${port}${Settings.ROOT_DIRECTORY === "/" ? "" : Settings.ROOT_DIRECTORY}/apiadmin`);
  console.log("==========================================================");
});
