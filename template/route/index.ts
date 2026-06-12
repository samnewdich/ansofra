/**
 * route/index.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of route/index.php (namespace NewdichRoute).
 *
 * THIS IS WHERE YOU REGISTER EVERY ENDPOINT OF YOUR SOFTWARE.
 *
 * let apis request go to apis controller
 * let app request go to app controller (Controller/App)  -> USERS AREA
 * let src request go to src controller (Controller/Src)  -> ADMINS AREA
 *
 * The root directory of the project is set in the .env file
 * (ROOT_DIRECTORY).
 * rootDir can be "" (empty = /) and it can be something like /vtu
 * For example, let's say you have one server/host and you have many
 * projects in it: ecommerce, vtu, fintech.
 * - for ecommerce, the root directory is /ecommerce
 * - for vtu, the root directory is /vtu
 * - for fintech, the root directory is /fintech
 * - and if it is only one project you have, the root directory is /
 *
 * usersArea = rootDir + "/api"       -> the area that users can access
 * adminArea = rootDir + "/apiadmin"  -> the area that only admin can access
 * --------------------------------------------------------------
 */
import { IncomingMessage, ServerResponse } from "http";
import * as path from "path";
import { Settings } from "../Schema/Settings";
import { sendFile, tryServePublic } from "./helpers";

// Controllers (App = users area, Src = admins area)
import { AppLanding } from "../Controller/App/AppLanding";
import { RegisterController } from "../Controller/App/RegisterController";
import { AuthenticationExample } from "../Controller/App/AuthenticationExample";
import { AuthorizationExample } from "../Controller/App/AuthorizationExample";
import { UploadExampleController } from "../Controller/App/UploadExampleController";
import { RunMigrationController } from "../Controller/Src/RunMigration";

// works both in dev (route/) and after npm run build (dist/route/)
import * as fs from "fs";
const PUBLIC_DIR = [
  path.join(__dirname, "..", "ansofra", "public"),
  path.join(__dirname, "..", "..", "ansofra", "public"),
  path.join(process.cwd(), "ansofra", "public")
].find((p) => fs.existsSync(p)) ?? path.join(__dirname, "..", "ansofra", "public");

export async function route(url: string, req: IncomingMessage, res: ServerResponse): Promise<void> {
  const docRoot = Settings.DOC_ROOT;
  const rootDir = Settings.ROOT_DIRECTORY === "/" ? "" : Settings.ROOT_DIRECTORY; // the root directory of the project
  // set it in the .env file

  const usersArea = docRoot + rootDir + "/api";       // the area that users can access
  // let's say your root directory is / . Then the usersArea will be /api
  // if your root directory is /ecommerce, your usersArea will be /ecommerce/api
  const adminArea = docRoot + rootDir + "/apiadmin";  // the area that only admin can access
  // let's say your root directory is /, your adminArea will be /apiadmin
  // if your root directory is /ecommerce, your adminArea will be /ecommerce/apiadmin

  /* ----------------------------------------------------------
   * LANDING PAGE
   * ---------------------------------------------------------- */
  if (
    url === rootDir ||
    url === rootDir + "/" ||
    url === rootDir + "/index.html" ||
    url === rootDir + "/index.php" ||
    url === "" ||
    url === "/"
  ) {
    sendFile(res, path.join(PUBLIC_DIR, "index.html"));
    return;
  }

  /* ----------------------------------------------------------
   * USERS AREA LANDING (swagger docs of /api)
   * ---------------------------------------------------------- */
  else if (url === usersArea || url === usersArea + "/") {
    await AppLanding(req, res);
    return;
  }

  /* ----------------------------------------------------------
   * ADMIN AREA - RUN MIGRATION
   * ---------------------------------------------------------- */
  else if (url === adminArea + "/run_migration") {
    await RunMigrationController(req, res);
    return;
  }

  /* ----------------------------------------------------------
   * /api ENDPOINTS (USERS AREA)
   * Register every new endpoint of your software here,
   * exactly like the elseif blocks in route/index.php
   * ---------------------------------------------------------- */

  // register normal user
  else if (url === usersArea + "/register" || url === usersArea + "/register" + "/") {
    await RegisterController(req, res);
    return;
  }

  // login normal user (login + JWT authentication example)
  else if (url === usersArea + "/login" || url === usersArea + "/login" + "/") {
    await AuthenticationExample(req, res);
    return;
  }

  // check who is logged in (JWT authorization example)
  else if (url === usersArea + "/whoami" || url === usersArea + "/whoami" + "/") {
    await AuthorizationExample(req, res);
    return;
  }

  // upload files example
  else if (url === usersArea + "/upload" || url === usersArea + "/upload" + "/") {
    await UploadExampleController(req, res);
    return;
  }

  /* ----------------------------------------------------------
   * SWAGGER UI ASSETS (/swagger/dist/*)
   * The PHP version shipped swagger-ui inside ansofra/public/swagger/dist.
   * Here we serve the same files straight from the swagger-ui-dist package.
   * ---------------------------------------------------------- */
  else if ((rootDir && url.startsWith(rootDir) ? url.slice(rootDir.length) : url).startsWith("/swagger/dist/")) {
    const rel = (rootDir && url.startsWith(rootDir) ? url.slice(rootDir.length) : url).replace("/swagger/dist/", "");
    try {
      const distDir = path.dirname(require.resolve("swagger-ui-dist/package.json"));
      sendFile(res, path.join(distDir, rel));
    } catch {
      sendFile(res, path.join(PUBLIC_DIR, "error", "404.html"), 404);
    }
    return;
  }

  /* ----------------------------------------------------------
   * STATIC FILES (ansofra/public/*) - css, js, images, swagger...
   * In PHP, Apache served these directly; here we serve them
   * from the same router.
   * ---------------------------------------------------------- */
  else if (tryServePublic(res, PUBLIC_DIR, rootDir && url.startsWith(rootDir) ? url.slice(rootDir.length) : url)) {
    return;
  }

  /* ----------------------------------------------------------
   * 404 - NOT FOUND
   * ---------------------------------------------------------- */
  else {
    sendFile(res, path.join(PUBLIC_DIR, "error", "404.html"), 404);
    return;
  }
}
