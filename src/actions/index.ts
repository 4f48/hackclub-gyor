import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { drizzle } from "drizzle-orm/d1";
import { db } from "@/lib/db";
import { member } from "@/lib/schema";
import { mail } from "@/lib/mail";
import { now } from "@internationalized/date";

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
      try {
        const { rowsAffected } = await db.insert(member).values({
          birthday: new Date(input.birthday),
          discord: input.discord,
          email: input.email,
          name: input.name,
          school: input.school,
        });
        if (rowsAffected === 1) {
          const payload = {
            embeds: [
              {
                title: "Új klubtag",
                fields: [
                  {
                    name: "Név",
                    value: input.name,
                    inline: true,
                  },
                  {
                    name: "E-mail cím",
                    value: input.email,
                    inline: true,
                  },
                  {
                    name: "Discord",
                    value: input.discord,
                    inline: true,
                  },
                  {
                    name: "Iskola",
                    value: input.school,
                    inline: true,
                  },
                  {
                    name: "Születésnap",
                    value: input.birthday,
                    inline: true,
                  },
                ],
                color: 0x00ff00,
                timestamp: now("Europe/Budapest").toAbsoluteString(),
              },
            ],
            username: "Orpheo",
            avatarURL:
              "https://rawr.hackclub.com/dinosaur_sealing_letters_with_wax.png",
          };
          await fetch(import.meta.env.DISCORD_WEBHOOK_URL, {
            method: "post",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          });
        }
      } catch (err) {
        console.error(err);
        return new Response("something went wronk", { status: 500 });
      }
    },
  }),
};
