/**
 * app/Query/Login.ts
 * --------------------------------------------------------------
 * EXAMPLE QUERY (business logic that READS data).
 *
 * In Ansofra, the "app" folder holds the business logic of the
 * USERS AREA, split CQRS-style into:
 *    app/Query    -> classes that READ data (login, get profile...)
 *    app/Command  -> classes that WRITE data (register, update...)
 *
 * This Login example:
 *   1. validates the dto data
 *   2. finds the user in the users table
 *   3. verifies the password hash
 *
 * The matching swagger doc is written as a JSDoc @openapi comment,
 * which replaces the PHP @OA annotations.
 *
 * @openapi
 * /api/login:
 *   post:
 *     summary: Login a user
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
 *     responses:
 *       200:
 *         description: Login successful or failed (check status field)
 */
import { AnsofraDto } from "../../Dto/AnsofraDto";
import { Index as Middleware } from "../../Middleware/Index";
import { Migration } from "../../Schema/Migration";
import { Platform } from "../../Schema/Platform";

const pretty = (data: any): string => JSON.stringify(data, null, 4);

export class Login {
  private dto: AnsofraDto;
  private middleware: Middleware;

  constructor(dto: AnsofraDto, middleware: Middleware) {
    this.dto = dto;
    this.middleware = middleware;
  }

  public async process(): Promise<string> {
    const email = this.middleware.cleanData(this.dto.email);
    const password = String(this.dto.password ?? "");

    if (email === "" || password === "") {
      return pretty({ status: "failed", response: "email and password are required" });
    }

    // read the user from the users table
    const usersTable = new Migration(Platform.USERS_TABLE_COLUMNS, Platform.USERS_TABLE);
    const found = JSON.parse(await usersTable.getSpecific({ email: email }, [], 0, 1));

    if (found.status !== "success" || found.count < 1) {
      return pretty({ status: "failed", response: "user not found" });
    }

    const user = found.response[0];

    // verify the password hash
    if (!this.middleware.verifyHash(password, user.password ?? "")) {
      return pretty({ status: "failed", response: "incorrect password" });
    }

    delete user.password; // never send the password hash back

    return pretty({ status: "success", response: user });
  }
}
