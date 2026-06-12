/**
 * Schema/Dealer.ts
 * --------------------------------------------------------------
 * TypeScript equivalent of Schema/Dealer.php (namespace NewdichSchema).
 *
 * In PHP, Dealer.php created two PDO connections:
 *   $connnewdich   -> when you already have the database
 *   $connnewdichdb -> when you don't have a database yet
 *                     (used to CREATE DATABASE)
 *
 * Here we use mysql2/promise pools instead of PDO, but keep the
 * same idea and the same two connections.
 * --------------------------------------------------------------
 */
import mysql, { Pool } from "mysql2/promise";
import { Settings } from "./Settings";

const ileos = Settings.SERVER;        // host
const ileone = Settings.SERVER_USER;  // user
const ilekokoro = Settings.SERVER_PASS; // password
const iledb = Settings.SERVER_DB;     // database

// when you already have db
export const connnewdich: Pool = mysql.createPool({
  host: ileos,
  user: ileone,
  password: ilekokoro,
  database: iledb,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true
});

// when you don't have db (used by Migration.createDB)
export const connnewdichdb: Pool = mysql.createPool({
  host: ileos,
  user: ileone,
  password: ilekokoro,
  waitForConnections: true,
  connectionLimit: 2,
  namedPlaceholders: true
});
