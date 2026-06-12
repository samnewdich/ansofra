ANSOFRA FRAMEWORK - TYPESCRIPT EDITION
======================================
This is the TypeScript/Node.js version of the Ansofra PHP framework.
It follows the exact same structure, naming and philosophy as the
PHP version, so if you know one, you know both.

FOLDER STRUCTURE (same as the PHP version)
------------------------------------------
ansofra/            -> the entering point + the public folder (the only
                       folder that should be exposed in production)
  index.ts          -> THE ENTERING POINT (was ansofra/index.php)
  public/           -> static files: css, js, images, uploads, swagger, 404
route/              -> route/index.ts: register every endpoint here
Controller/         -> thin controllers
  App/              -> controllers of the USERS AREA  (/api/...)
  Src/              -> controllers of the ADMINS AREA (/apiadmin/...)
app/                -> business logic of the USERS AREA
  Command/          -> logic that WRITES data (register, update...)
  Query/            -> logic that READS data (login, get...)
src/                -> business logic of the ADMINS AREA
  Command/          -> admin logic that WRITES data
  Query/            -> admin logic that READS data
Schema/             -> database layer
  Settings.ts       -> exposes every .env value (was Settings.php)
  Platform.ts       -> YOUR TABLES are designed here (was Platform.php)
  Dealer.ts         -> MySQL connections (was Dealer.php)
  Migration.ts      -> the mini-ORM: save, getSpecific, edit, remove...
  RunMigration.ts   -> auto creates all tables in Platform.ts
Dto/                -> AnsofraDto.ts: every incoming request is wrapped here
Middleware/         -> Index.ts: getIp, hashData, verifyHash, cleanData, otp...
Auth/               -> Authentication.ts (login -> JWT cookie)
                       Authorization.ts (verify JWT cookie)
Cache/              -> Redis caching + RateLimit
Mail/               -> Index.ts (SMTP/nodemailer), Sendgrid.ts, Mailgun.ts,
                       Mailersend.ts
Files/              -> Upload.ts, Download.ts
apis/               -> third-party API integrations (CurrencyConverter...)
bootstrap.ts        -> loads .env (was boostrap.php)
ansofra-generator.ts-> generates swagger docs (was ansofra-generator.sh)

HOW TO START
------------
1. npm install
2. cp .env.example .env       (then edit the values)
3. npm run migrate            (creates your database tables)
4. npm run dev                (starts the server: http://localhost:8080)

HOW TO BUILD FOR PRODUCTION
---------------------------
1. npm run build              (compiles TypeScript into dist/)
2. npm start                  (runs the compiled server)

HOW TO GENERATE API DOCUMENTATION
---------------------------------
npm run ansofra-generator     (writes the swagger json files into
                               ansofra/public/swagger/)
Then open http://localhost:8080/api to view the docs.

NOTES
-----
- Don't forget to change the values in the .env to meet your data.
- In production only expose ansofra/public as static; keep .env safe.
- The flow of every request is always:
    route -> Controller -> Dto -> app|src (Command/Query) -> Schema/Migration -> response
