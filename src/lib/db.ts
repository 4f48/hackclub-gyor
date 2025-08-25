import * as schema from "@/lib/schema";
import { TURSO_DATABASE_URL, TURSO_TOKEN } from "astro:env/server";
import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle({
	connection: {
		url: TURSO_DATABASE_URL,
		authToken: TURSO_TOKEN,
	},
	schema,
});
