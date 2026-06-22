CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'vendor',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE `events` ADD `event_type` text DEFAULT 'internal';--> statement-breakpoint
ALTER TABLE `events` ADD `external_url` text;--> statement-breakpoint
ALTER TABLE `events` ADD `user_id` text REFERENCES users(id);