import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const member = sqliteTable("member", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  discord: text("discord").unique(),
  school: text("school").notNull(),
  birthday: int("birthday", { mode: "timestamp" }).notNull(),
});
