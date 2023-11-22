import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { guilds } from ".";

export const users = sqliteTable("users", {
  userId: text("user_id").primaryKey().notNull(),
  guildId: text("guild_id")
    .notNull()
    .references(() => guilds.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  rank: int("rank").notNull().default(0),
  xp: int("xp").notNull().default(0),
  createdAt: int("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).notNull(),
});
