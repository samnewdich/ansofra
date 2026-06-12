#!/usr/bin/env node
/**
 * ansofra CLI
 * ----------------------------------------------------------------
 * The command users run after: npm install -g ansofra (or npx ansofra)
 *
 *   ansofra new <project-name>   -> creates a new Ansofra project
 *   ansofra -v | --version       -> shows the version
 *   ansofra help                 -> shows help
 * ----------------------------------------------------------------
 */
const fs = require("fs");
const path = require("path");

const TEMPLATE_DIR = path.join(__dirname, "..", "template");
const pkg = require(path.join(__dirname, "..", "package.json"));

const args = process.argv.slice(2);
const command = args[0];

const log = (msg) => console.log(msg);

function banner() {
  log("==========================================================");
  log("   ANSOFRA FRAMEWORK - (by Newdich Technology)  v" + pkg.version);
  log("   Build software fast, your way.");
  log("==========================================================");
}

function help() {
  banner();
  log("");
  log("Usage:");
  log("  ansofra new <project-name>   Create a new Ansofra project");
  log("  ansofra --version            Show version");
  log("  ansofra help                 Show this help");
  log("");
  log("Example:");
  log("  npx ansofra new myapp");
  log("  cd myapp");
  log("  npm install");
  log("  cp .env.example .env");
  log("  npm run dev");
}

/** Recursively copy a folder */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function newProject(name) {
  if (!name) {
    log("ERROR: please give your project a name.");
    log("Usage: ansofra new <project-name>");
    process.exit(1);
  }

  // only allow safe folder names
  if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
    log("ERROR: project name can only contain letters, numbers, dots, dashes and underscores.");
    process.exit(1);
  }

  const target = path.resolve(process.cwd(), name);

  if (fs.existsSync(target)) {
    log(`ERROR: the folder "${name}" already exists here. Choose another name.`);
    process.exit(1);
  }

  banner();
  log("");
  log(`Creating a new Ansofra project in: ${target}`);
  log("");

  // 1. copy the whole template
  copyDir(TEMPLATE_DIR, target);

  // 2. npm strips .gitignore from published packages,
  //    so the template ships it as "gitignore" - rename it back.
  const gi = path.join(target, "gitignore");
  if (fs.existsSync(gi)) {
    fs.renameSync(gi, path.join(target, ".gitignore"));
  }

  // 3. personalize the new project's package.json
  const projPkgPath = path.join(target, "package.json");
  const projPkg = JSON.parse(fs.readFileSync(projPkgPath, "utf8"));
  projPkg.name = name.toLowerCase();
  projPkg.version = "1.0.0";
  projPkg.description = "A software built with the Ansofra Framework (TypeScript)";
  fs.writeFileSync(projPkgPath, JSON.stringify(projPkg, null, 2));

  log("Done! Your Ansofra project is ready.");
  log("");
  log("Next steps:");
  log(`  cd ${name}`);
  log("  npm install            (install the dependencies)");
  log("  cp .env.example .env   (then edit your settings)");
  log("  npm run migrate        (create your database tables)");
  log("  npm run dev            (start the server)");
  log("");
  log("Happy building with Ansofra!");
}

switch (command) {
  case "new":
    newProject(args[1]);
    break;
  case "-v":
  case "--version":
    log("ansofra v" + pkg.version);
    break;
  case "help":
  case "-h":
  case "--help":
  case undefined:
    help();
    break;
  default:
    log(`Unknown command: ${command}`);
    help();
    process.exit(1);
}
