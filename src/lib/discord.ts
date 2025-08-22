import { WebhookClient } from "discord.js";

export const webhookClient = new WebhookClient({
  url: import.meta.env.DISCORD_WEBHOOK_URL,
});
