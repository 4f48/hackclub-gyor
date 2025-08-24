DROP INDEX "member_email_unique";--> statement-breakpoint
DROP INDEX "member_discord_unique";--> statement-breakpoint
ALTER TABLE `member` ALTER COLUMN "discord" TO "discord" text;--> statement-breakpoint
CREATE UNIQUE INDEX `member_email_unique` ON `member` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `member_discord_unique` ON `member` (`discord`);