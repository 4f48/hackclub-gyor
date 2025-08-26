import { db } from "@/lib/db";
import { resend } from "@/lib/mail";
import { member } from "@/lib/schema";
import { now } from "@internationalized/date";
import { ActionError, defineAction } from "astro:actions";
import { DISCORD_WEBHOOK_URL, TURNSTILE_SECRET_KEY } from "astro:env/server";
import { z } from "astro:schema";

export default defineAction({
	accept: "form",
	input: z.object({
		name: z.string(),
		email: z.string().email(),
		school: z.string(),
		birthday: z.string().date(),
		"cf-turnstile-response": z.string(),
	}),
	handler: async (input, { clientAddress }) => {
		try {
			const validate: { success: boolean } = await (
				await fetch(
					"https://challenges.cloudflare.com/turnstile/v0/siteverify",
					{
						body: JSON.stringify({
							secret: TURNSTILE_SECRET_KEY,
							response: input["cf-turnstile-response"],
							remoteip: clientAddress,
						}),
						headers: {
							"content-type": "application/json",
						},
						method: "post",
					}
				)
			).json();
			if (!validate.success)
				throw new ActionError({
					code: "BAD_REQUEST",
					message: "captcha verification failed",
				});

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
              <style>
                @font-face {
                  font-family: 'JetBrains Mono';
                  font-style: normal;
                  font-weight: 100 800;
                  font-display: swap;
                  src: url(https://fonts.gstatic.com/s/jetbrainsmono/v23/tDbV2o-flEEny0FZhsfKu5WU4xD7OwE.woff2) format('woff2');
                  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                }
                @font-face {
                  font-family: 'JetBrains Mono';
                  font-style: italic;
                  font-weight: 100 800;
                  font-display: swap;
                  src: url(https://fonts.gstatic.com/s/jetbrainsmono/v23/tDbX2o-flEEny0FZhsfKu5WU4xD-CwOnSA.woff2) format('woff2');
                  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
                }

                /* Force background colors using !important and multiple selectors */
                html,
                body,
                table,
                td {
                  background-color: black !important;
                  color: white !important;
                }

                body {
                  font-family:
                    "JetBrains Mono", "Courier New", monospace !important;
                  font-optical-sizing: auto;
                  font-style: normal;
                  margin: 0 !important;
                  padding: 20px !important;
                  background-color: black !important;
                  color: white !important;
                }

                h1 {
                  color: #00ff00 !important;
                  font-weight: 800;
                  font-size: 1.5rem;
                  line-height: 2rem;
                  margin-bottom: 15px;
                  font-family:
                    "JetBrains Mono", "Courier New", monospace !important;
                }

                p {
                  text-align: justify;
                  color: white !important;
                  font-family:
                    "JetBrains Mono", "Courier New", monospace !important;
                }

                a {
                  color: #00ff00 !important;
                  padding-left: 0.25rem;
                  padding-right: 0.25rem;
                  text-decoration: none;
                  font-family:
                    "JetBrains Mono", "Courier New", monospace !important;
                }

                a:hover {
                  color: black !important;
                  background-color: #00ff00 !important;
                }

                /* Additional email client specific overrides */
                [data-ogsc] body {
                  background-color: black !important;
                }

                /* Gmail specific */
                u + .body {
                  background-color: black !important;
                }
              </style>
            </head>
            <body>
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="background-color: black !important;"
              >
                <tr>
                  <td
                    style="background-color: black !important; padding: 20px;"
                  >
                    <h1>Hack Club Győr</h1>
                    <p>Kedves ${input.name}!</p>
                    <p>
                      Megkaptuk a jelentkezésedet a győri Hack Club közösségébe.
                      Ahhoz, hogy teljeskörű klubtag lehess, be kell lépj
                      Discord szerverünkre. Az alábbi linkre kattintva
                      összekapcsolhatod a jelentkezésed Discord fiókoddal.
                    </p>
                    <a href="${generateOauthLink(id)}"
                      >Discord bejelentkezés &gt;</a
                    >
                  </td>
                </tr>
              </table>
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
