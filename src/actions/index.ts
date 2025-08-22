import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/lib/schema";

export const server = {
  signup: defineAction({
    accept: "form",
    input: z.object({
      name: z.string(),
      email: z.string().email(),
      discord: z.string(),
      school: z.string(),
      birthday: z.string().date(),
    }),
    handler: async ({ birthday, discord, email, name, school }, { locals }) => {
      const db = drizzle(locals.runtime.env.MEMBERS, { schema });
      await db.insert(schema.member).values({
        birthday: new Date(birthday),
        discord,
        email,
        name,
        school,
      });
    },
  }),
};
