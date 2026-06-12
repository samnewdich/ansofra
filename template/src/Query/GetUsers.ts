/**
 * src/Query/GetUsers.ts
 * --------------------------------------------------------------
 * EXAMPLE ADMIN QUERY (ADMINS AREA business logic that READS data).
 *
 * In Ansofra, the "src" folder holds the business logic of the
 * ADMINS AREA, split CQRS-style into:
 *    src/Query    -> classes that READ data (this one)
 *    src/Command  -> classes that WRITE data
 *
 * @openapi
 * /apiadmin/getusers:
 *   post:
 *     summary: Admin - get all registered users (paginated)
 *     tags: [Admins Area]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               offset:
 *                 type: integer
 *               limit:
 *                 type: integer
 *     responses:
 *       200:
 *         description: List of users
 */
import { AnsofraDto } from "../../Dto/AnsofraDto";
import { Index as Middleware } from "../../Middleware/Index";
import { Migration } from "../../Schema/Migration";
import { Platform } from "../../Schema/Platform";

export class GetUsers {
  private dto: AnsofraDto;
  private middleware: Middleware;

  constructor(dto: AnsofraDto, middleware: Middleware) {
    this.dto = dto;
    this.middleware = middleware;
  }

  public async process(): Promise<string> {
    const offset = Number(this.dto.offset || 0);
    const limit = Number(this.dto.limit || 20);

    const usersTable = new Migration(Platform.USERS_TABLE_COLUMNS, Platform.USERS_TABLE);
    // never select the password column
    return await usersTable.getSpecific(
      {},
      ["users_id", "email", "fullname", "phone", "username", "status", "date_created", "last_seen"],
      offset,
      limit
    );
  }
}
