import { drizzle } from "drizzle-orm/bun-sqlite";
// eslint-disable-next-line import/no-unresolved
import { Database } from "bun:sqlite";

const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite);
