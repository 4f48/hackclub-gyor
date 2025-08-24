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
      const id = crypto.randomUUID();
      await db.insert(member).values({
        id,
        name: input.name,
        email: input.email,
        school: input.school,
        birthday: new Date(input.birthday),
      });
      const { error } = await resend.emails.send({
        from: "Hack Club Győr <noreply@mail.hackclubgyor.com>",
        to: input.email,
        subject: "Regisztráció befejezése",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossorigin
              />
              <link
                href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
                rel="stylesheet"
              />
              <style>
                body {
                  font-family: "JetBrains Mono", monospace;
                  font-optical-sizing: auto;
                  font-style: normal;

                  background-color: black;
                  color: white;
                }
                h1 {
                  color: #00ff00;
                  font-weight: 800;
                  font-size: 1.5rem;
                  line-height: 2rem;
                  margin-bottom: 15px;
                }
                p {
                  text-align: justify;
                }
                a {
                  color: #00ff00;
                  padding-left: 0.25rem;
                  padding-right: 0.25rem;
                  text-decoration: none;
                }
                a:hover {
                  color: black;
                  background-color: #00ff00;
                }
              </style>
            </head>
            <body>
              <h1>Hack Club Győr</h1>
              <p>Kedves ${input.name}!</p>
              <p>
                Megkaptuk a jelentkezésedet a győri Hack Club közösségébe.
                Ahhoz, hogy teljeskörű klubtag lehess, be kell lépj Discord
                szerverünkre. Az alábbi linkre kattintva összekapcsolhatod a
                jelentkezésed Discord fiókoddal.
              </p>
              <a href="${generateOauthLink(id)}">Discord bejelentkezés &gt;</a>
            </body>
          </html>
        `,
      });
      if (error) {
        console.error(error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "failed to send email",
        });
      }
      // await sendNotification({ ...input });
      return { email: input.email };
    } catch (err) {
      console.error(err);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "something went wronk",
      });
    }
  },
});

function generateOauthLink(id: string): string {
  return `https://discord.com/oauth2/authorize?client_id=1408448318488449084&response_type=code&redirect_uri=https%3A%2F%2Fhackclubgyor.com%2Fdiscord%2Fcallback&scope=identify+guilds.join&state=${id}`;
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
