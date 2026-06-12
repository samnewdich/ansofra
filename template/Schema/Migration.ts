/**
 * Schema/Migration.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Schema/Migration.php (namespace NewdichSchema).
 *
 * This is the heart of the framework's database layer (a mini ORM).
 * It can:
 *   - createDB()        create the database
 *   - createTB()        create a table from Platform.ts definitions
 *   - save()            insert a row
 *   - saveUnique()      insert a row only if a unique column value
 *                       does not already exist
 *   - saveUniqueMulti() insert only if a COMBINATION of columns
 *                       does not already exist
 *   - getSpecific()     select rows (with where, operators,
 *                       pagination, ordering, column selection)
 *   - count()           count rows
 *   - edit()            update rows
 *   - remove()          delete one row
 *   - removeTable()     drop the table
 *
 * Every method returns a JSON string of the shape:
 *   { "status": "success" | "failed", "response": ... }
 * exactly like the PHP version (which used json_encode).
 * --------------------------------------------------------------
 */
import { Pool, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { connnewdich, connnewdichdb } from "./Dealer";

type KeyValue = Record<string, any>;

const pretty = (data: any): string => JSON.stringify(data, null, 4);

export class Migration {
  private table: string;
  private columns: string[];
  private conn: Pool;
  private conndb: Pool;

  constructor(columns: string[] | null = null, table: string | null = null) {
    this.table = table ?? "";
    this.columns = columns ?? [];
    this.conn = connnewdich;
    this.conndb = connnewdichdb;
  }

  public async createDB(dbname: string): Promise<string> {
    dbname = dbname.replace(/[^a-zA-Z0-9_]/g, "");

    const sql = `CREATE DATABASE IF NOT EXISTS \`${dbname}\`
                 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`;

    await this.conndb.query(sql);
    return `Database ${dbname} successfully created`;
  }

  public async createTB(): Promise<string> {
    const columns = this.columns.filter(Boolean);

    if (columns.length === 0) {
      throw new Error("No columns supplied");
    }

    const columnsSQL = columns.join(",\n");

    const sql = `
      CREATE TABLE IF NOT EXISTS \`${this.table}\` (
        ${columnsSQL}
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `;

    await this.conn.query(sql);
    return `Table ${this.table} was created successfully`;
  }

  public async getTableColumns(pool: Pool, table: string): Promise<string[]> {
    // sanitize table name
    table = table.replace(/[^a-zA-Z0-9_]/g, "");
    const [rows] = await pool.query<RowDataPacket[]>(`DESCRIBE \`${table}\``);
    return rows.map((r) => r.Field as string);
  }

  public async saveUnique(uniqueCol: string, uniqueValue: any, rowsInKeyValue: KeyValue): Promise<string> {
    try {
      if (!rowsInKeyValue || Object.keys(rowsInKeyValue).length === 0) {
        return pretty({ status: "failed", response: "No data supplied" });
      }

      // get table columns
      const columns = await this.getTableColumns(this.conn, this.table);

      // VALIDATE UNIQUE COLUMN
      if (!columns.includes(uniqueCol)) {
        return pretty({ status: "failed", response: "Invalid unique column" });
      }

      // FILTER ONLY ALLOWED COLUMNS
      const data: KeyValue = {};
      for (const [col, val] of Object.entries(rowsInKeyValue)) {
        if (columns.includes(col)) data[col] = val;
      }

      if (Object.keys(data).length === 0) {
        return pretty({ status: "failed", response: "No valid columns supplied" });
      }

      const table = this.table;

      // DUPLICATE CHECK
      const [checkRows] = await this.conn.query<RowDataPacket[]>(
        `SELECT 1 FROM \`${table}\` WHERE \`${uniqueCol}\` = ? LIMIT 1`,
        [uniqueValue]
      );

      if (checkRows.length > 0) {
        return pretty({ status: "failed", response: "duplicate entry" });
      }

      // BUILD INSERT
      const cols = Object.keys(data);
      const placeholders = cols.map(() => "?");

      const sql = `INSERT INTO \`${table}\` (\`${cols.join("`,`")}\`)
                   VALUES (${placeholders.join(",")})`;

      const [result] = await this.conn.query<ResultSetHeader>(sql, Object.values(data));

      return pretty({
        status: "success",
        response: "saved successfully",
        id: result.insertId
      });
    } catch (e: any) {
      return pretty({ status: "failed", response: e.message || e.code || String(e) });
    }
  }

  public async saveUniqueMulti(uniqueCol: string[], uniqueValue: any[], rowsInKeyValue: KeyValue): Promise<string> {
    try {
      if (!rowsInKeyValue || Object.keys(rowsInKeyValue).length === 0) {
        return pretty({ status: "failed", response: "No data supplied" });
      }

      // Columns in table
      const columns = await this.getTableColumns(this.conn, this.table);

      // Validate unique columns
      for (const col of uniqueCol) {
        if (!columns.includes(col)) {
          return pretty({ status: "failed", response: `Invalid unique column: ${col}` });
        }
      }

      // Validate unique values count
      if (uniqueCol.length !== uniqueValue.length) {
        return pretty({ status: "failed", response: "Unique columns and values count mismatch" });
      }

      // Filter only allowed columns
      const data: KeyValue = {};
      for (const [col, val] of Object.entries(rowsInKeyValue)) {
        if (columns.includes(col)) data[col] = val;
      }

      if (Object.keys(data).length === 0) {
        return pretty({ status: "failed", response: "No valid columns supplied" });
      }

      const table = this.table;

      // BUILD DUPLICATE CHECK
      const where = uniqueCol.map((col) => `\`${col}\` = ?`);
      const sqlCheck = `SELECT 1 FROM \`${table}\` WHERE ${where.join(" AND ")} LIMIT 1`;
      const [checkRows] = await this.conn.query<RowDataPacket[]>(sqlCheck, uniqueValue);

      if (checkRows.length > 0) {
        return pretty({ status: "failed", response: "duplicate entry" });
      }

      // BUILD INSERT
      const cols = Object.keys(data);
      const placeholders = cols.map(() => "?");

      const sqlInsert = `INSERT INTO \`${table}\` (\`${cols.join("`,`")}\`)
                         VALUES (${placeholders.join(",")})`;

      const [result] = await this.conn.query<ResultSetHeader>(sqlInsert, Object.values(data));

      return pretty({
        status: "success",
        response: "saved successfully",
        id: result.insertId
      });
    } catch (e: any) {
      return pretty({ status: "failed", response: e.message || e.code || String(e) });
    }
  }

  public async save(rowsInKeyValue: KeyValue): Promise<string> {
    try {
      if (!rowsInKeyValue || Object.keys(rowsInKeyValue).length === 0) {
        return pretty({ status: "failed", response: "No data supplied" });
      }

      // get table columns
      const columns = await this.getTableColumns(this.conn, this.table);

      // FILTER ONLY ALLOWED COLUMNS
      const data: KeyValue = {};
      for (const [col, val] of Object.entries(rowsInKeyValue)) {
        if (columns.includes(col)) data[col] = val;
      }

      if (Object.keys(data).length === 0) {
        return pretty({ status: "failed", response: "No valid columns supplied" });
      }

      const table = this.table;

      // BUILD INSERT
      const cols = Object.keys(data);
      const placeholders = cols.map(() => "?");

      const sql = `INSERT INTO \`${table}\` (\`${cols.join("`,`")}\`)
                   VALUES (${placeholders.join(",")})`;

      await this.conn.query(sql, Object.values(data));

      return pretty({ status: "success", response: "saved successfully" });
    } catch (e: any) {
      return pretty({ status: "failed", response: e.message || e.code || String(e) });
    }
  }

  public async getSpecific(
    where: KeyValue = {},
    columnsToSelect: string[] = [],
    offset = 0,
    limit = 20,
    orderBy: string | null = null,
    orderDir: string = "DESC"
  ): Promise<string> {
    try {
      const table = this.table;

      // Get allowed columns
      const allowedColumns = await this.getTableColumns(this.conn, table);

      /* ---------------------------
       * SELECT COLUMNS
       * --------------------------- */
      let select: string;
      if (columnsToSelect.length === 0) {
        select = "*";
      } else {
        const validColumns = columnsToSelect.filter((c) => allowedColumns.includes(c));
        if (validColumns.length === 0) {
          return pretty({ status: "failed", response: "Invalid columns selected" });
        }
        select = "`" + validColumns.join("`,`") + "`";
      }

      let sql = `SELECT ${select} FROM \`${table}\``;
      const binds: any[] = [];

      /* ---------------------------
       * WHERE CONDITIONS (supports operators)
       * supports keys like: "expires_at >=" => value
       * --------------------------- */
      if (Object.keys(where).length > 0) {
        const conditions: string[] = [];

        for (const [col, val] of Object.entries(where)) {
          const match = col.match(/^(.+)\s(>=|<=|>|<|!=)$/);
          if (match) {
            const column = match[1];
            const operator = match[2];

            if (!allowedColumns.includes(column)) continue;

            conditions.push(`\`${column}\` ${operator} ?`);
            binds.push(val);
          } else {
            if (!allowedColumns.includes(col)) continue;

            conditions.push(`\`${col}\` = ?`);
            binds.push(val);
          }
        }

        if (conditions.length > 0) {
          sql += " WHERE " + conditions.join(" AND ");
        }
      }

      /* ---------------------------
       * ORDER BY (SAFE)
       * --------------------------- */
      if (orderBy !== null && allowedColumns.includes(orderBy)) {
        orderDir = orderDir.toUpperCase() === "ASC" ? "ASC" : "DESC";
        sql += ` ORDER BY \`${orderBy}\` ${orderDir}`;
      } else {
        // fallback: try common id pattern
        const fallbackId = `${table}_id`;
        if (allowedColumns.includes(fallbackId)) {
          sql += ` ORDER BY \`${fallbackId}\` DESC`;
        }
      }

      /* ---------------------------
       * PAGINATION
       * --------------------------- */
      offset = Math.max(0, Math.trunc(offset));
      limit = Math.max(1, Math.trunc(limit));

      sql += ` LIMIT ${offset}, ${limit}`;

      /* ---------------------------
       * EXECUTE
       * --------------------------- */
      const [rows] = await this.conn.query<RowDataPacket[]>(sql, binds);

      return pretty({
        status: "success",
        count: rows.length,
        response: rows
      });
    } catch (e: any) {
      return pretty({ status: "failed", response: e.message || e.code || String(e) });
    }
  }

  public async count(where: KeyValue = {}): Promise<string> {
    try {
      const table = this.table;

      let sql = `SELECT COUNT(\`${table}_id\`) AS total FROM \`${table}\``;
      const binds: any[] = [];

      if (Object.keys(where).length > 0) {
        const conditions: string[] = [];
        for (const [col, val] of Object.entries(where)) {
          conditions.push(`\`${col}\` = ?`);
          binds.push(val);
        }
        sql += " WHERE " + conditions.join(" AND ");
      }

      const [rows] = await this.conn.query<RowDataPacket[]>(sql, binds);
      const total = Number(rows[0]?.total ?? 0);

      return pretty({ status: "success", response: total });
    } catch (e: any) {
      return pretty({ status: "failed", response: e.message || e.code || String(e) });
    }
  }

  public async remove(where: KeyValue): Promise<string> {
    try {
      const table = this.table;
      const conditions: string[] = [];
      const binds: any[] = [];

      for (const [col, val] of Object.entries(where)) {
        conditions.push(`\`${col}\` = ?`);
        binds.push(val);
      }

      const sql = `DELETE FROM \`${table}\` WHERE ${conditions.join(" AND ")} LIMIT 1`;
      const [result] = await this.conn.query<ResultSetHeader>(sql, binds);

      return pretty({
        status: "success",
        response: "successfully deleted row " + result.affectedRows
      });
    } catch (e: any) {
      return pretty({ status: "failed", response: e.message || e.code || String(e) });
    }
  }

  public async edit(data: KeyValue, where: KeyValue, limitOne = false): Promise<string> {
    try {
      const table = this.table;

      const set: string[] = [];
      const binds: any[] = [];

      for (const [col, val] of Object.entries(data)) {
        set.push(`\`${col}\` = ?`);
        binds.push(val);
      }

      const conditions: string[] = [];
      for (const [col, val] of Object.entries(where)) {
        conditions.push(`\`${col}\` = ?`);
        binds.push(val);
      }

      let sql = `UPDATE \`${table}\` SET ${set.join(",")}
                 WHERE ${conditions.join(" AND ")}`;

      // Optional single-row mode
      if (limitOne) {
        sql += " LIMIT 1";
      }

      const [result] = await this.conn.query<ResultSetHeader>(sql, binds);

      return pretty({ status: "success", response: result.affectedRows });
    } catch (e: any) {
      return pretty({ status: "failed", response: e.message || e.code || String(e) });
    }
  }

  public async removeTable(): Promise<boolean> {
    try {
      const table = this.table.replace(/[^a-zA-Z0-9_]/g, "");
      await this.conn.query(`DROP TABLE IF EXISTS \`${table}\``);
      return true;
    } catch (e: any) {
      console.error(e.message);
      return false;
    }
  }
}
