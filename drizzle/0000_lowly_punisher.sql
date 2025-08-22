CREATE TABLE `member` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`discord` text NOT NULL,
	`school` text NOT NULL,
	`birthday` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `member_email_unique` ON `member` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `member_discord_unique` ON `member` (`discord`);