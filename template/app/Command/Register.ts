/**
 * app/Command/Register.ts
 * --------------------------------------------------------------
 * EXAMPLE COMMAND (business logic that WRITES data).
 *
 * In Ansofra, the "app" folder holds the business logic of the
 * USERS AREA, split CQRS-style into:
 *    app/Query    -> classes that READ data
 *    app/Command  -> classes that WRITE data (this one)
 *
 * This Register example:
 *   1. validates the dto data
 *   2. hashes the password
 *   3. saves the user with saveUnique() so the same email
 *      can never register twice
 *
 * @openapi
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users Area]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fullname:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration successful or failed (check status field)
 */
import { AnsofraDto } from "../../Dto/AnsofraDto";
import { Index as Middleware } from "../../Middleware/Index";
import { Migration } from "../../Schema/Migration";
import { Platform } from "../../Schema/Platform";

const pretty = (data: any): string => JSON.stringify(data, null, 4);

export class Register {
  private dto: AnsofraDto;
  private middleware: Middleware;

  constructor(dto: AnsofraDto, middleware: Middleware) {
    this.dto = dto;
    this.middleware = middleware;
  }

  public async process(): Promise<string> {
    const email = this.middleware.cleanData(this.dto.email);
    const password = String(this.dto.password ?? "");
    const fullname = this.middleware.cleanData(this.dto.fullname);
    const phone = this.middleware.cleanData(this.dto.phone);

    if (email === "" || password === "") {
      return pretty({ status: "failed", response: "email and password are required" });
    }

    const usersTable = new Migration(Platform.USERS_TABLE_COLUMNS, Platform.USERS_TABLE);

    // saveUnique -> the same email can never register twice
    return await usersTable.saveUnique("email", email, {
      email: email,
      password: this.middleware.hashData(password),
      fullname: fullname,
      phone: phone,
      status: "active",
      date_created: new Date().toISOString()
    });
  }
}
