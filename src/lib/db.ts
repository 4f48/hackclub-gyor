import { drizzle } from "drizzle-orm/libsql";
import * as schema from "@/lib/schema";
import { TURSO_DATABASE_URL, TURSO_TOKEN } from "astro:env/server";

export const db = drizzle({
  connection: {
    url: TURSO_DATABASE_URL,
    authToken: TURSO_TOKEN,
  },
  schema,
});
