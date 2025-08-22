import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { drizzle } from "drizzle-orm/d1";
import { db } from "@/lib/db";
import { member } from "@/lib/schema";
import { mail } from "@/lib/mail";

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
    handler: async (input) => {
      await db.insert(member).values({
        birthday: new Date(input.birthday),
        discord: input.discord,
        email: input.email,
        name: input.name,
        school: input.school,
      });
    },
  }),
};
