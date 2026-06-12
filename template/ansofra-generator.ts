/**
 * ansofra-generator.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of ansofra-generator.sh.
 *
 * In PHP, ansofra-generator.sh used vendor/bin/openapi
 * (zircote/swagger-php) to scan the app/ and src/ folders for
 * @OA annotations and produced two json docs:
 *   ansofra/public/swagger/docs/newdichapp.json      (users area)
 *   ansofra/public/swagger/src/docs/newdichsrc.json  (admins area)
 *
 * Here we use swagger-jsdoc to scan the same folders for
 * JSDoc @openapi comments, and produce the same two json files.
 *
 * Run it with:  npm run ansofra-generator
 * --------------------------------------------------------------
 */
import * as fs from "fs";
import * as path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import { Settings } from "./Schema/Settings";

// ---- USERS AREA DOCS (scans app/) ----
const appOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: Settings.APP_ANNOTATION_TITLE || "Users_Area_Endpoints",
      version: Settings.APP_VERSION || "1.0.0"
    }
  },
  apis: ["./app/**/*.ts"]
};

// ---- ADMINS AREA DOCS (scans src/) ----
const srcOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: Settings.SRC_ANNOTATION_TITLE || "Admins_Area_Endpoints",
      version: Settings.APP_VERSION || "1.0.0"
    }
  },
  apis: ["./src/**/*.ts"]
};

const appSpec = swaggerJsdoc(appOptions);
const srcSpec = swaggerJsdoc(srcOptions);

const appOut = path.join(__dirname, "ansofra", "public", "swagger", "docs", "newdichapp.json");
const srcOut = path.join(__dirname, "ansofra", "public", "swagger", "src", "docs", "newdichsrc.json");

fs.mkdirSync(path.dirname(appOut), { recursive: true });
fs.mkdirSync(path.dirname(srcOut), { recursive: true });

fs.writeFileSync(appOut, JSON.stringify(appSpec, null, 4));
fs.writeFileSync(srcOut, JSON.stringify(srcSpec, null, 4));

console.log("Generated: " + appOut);
console.log("Generated: " + srcOut);
