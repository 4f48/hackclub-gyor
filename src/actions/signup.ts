import { db } from "@/lib/db";
import { resend } from "@/lib/mail";
import { member } from "@/lib/schema";
import { now } from "@internationalized/date";
import { ActionError, defineAction } from "astro:actions";
import { DISCORD_WEBHOOK_URL } from "astro:env/server";
import { z } from "astro:schema";

export default defineAction({
  accept: "form",
  input: z.object({
    name: z.string(),
    email: z.string().email(),
    school: z.string(),
    birthday: z.string().date(),
  }),
  handler: async (input) => {
    try {
      const { rowsAffected } = await db.insert(member).values({
        birthday: new Date(input.birthday),
        email: input.email,
        name: input.name,
        school: input.school,
      });
      if (rowsAffected === 1) {
        const { error } = await resend.emails.send({
          from: "Hack Club Győr <noreply.hackclubgyor.com>",
          to: input.email,
          subject: "Regisztráció befejezése",
          text: generateOauthLink(),
        });
        if (error)
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "failed to send email",
          });
        // await sendNotification({ ...input });
        return { email: input.email };
      } else {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "failed to register user",
        });
      }
    } catch (err) {
      console.error(err);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "something went wronk",
      });
    }
  },
});

function generateOauthLink(): string {
  const buf = new Uint8Array(32);
  crypto.getRandomValues(buf);
  const state = Array.from(buf)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return `https://discord.com/oauth2/authorize?client_id=1408448318488449084&response_type=code&redirect_uri=https%3A%2F%2Fhackclubgyor.com%2Fdiscord%2Fcallback&scope=email+guilds.join&state=${state}`;
}

function sendNotification({
  name,
  email,
  school,
  birthday,
}: {
  name: string;
  email: string;
  school: string;
  birthday: string;
}): Promise<Response> {
  const payload = {
    embeds: [
      {
        title: "Új jelentkezés",
        fields: [
          {
            name: "Név",
            value: name,
            inline: true,
          },
          {
            name: "E-mail cím",
            value: email,
            inline: true,
          },
          {
            name: "Iskola",
            value: school,
            inline: true,
          },
          {
            name: "Születésnap",
            value: birthday,
            inline: true,
          },
        ],
        color: 0x00ff00,
        timestamp: now("Europe/Budapest").toAbsoluteString(),
      },
    ],
    username: "Orpheus",
    avatarURL:
      "https://rawr.hackclub.com/dinosaur_sealing_letters_with_wax.png",
  };
  return fetch(DISCORD_WEBHOOK_URL, {
    method: "post",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}
