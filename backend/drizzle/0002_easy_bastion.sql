CREATE TABLE `ticket_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` integer NOT NULL,
	`max_price` integer,
	`status` text DEFAULT 'available',
	`order` integer DEFAULT 0,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` integer NOT NULL,
	`normal_price` integer,
	`stock` integer DEFAULT 100,
	`is_available` integer DEFAULT 1,
	`order` integer DEFAULT 0,
	FOREIGN KEY (`category_id`) REFERENCES `ticket_categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `events` ADD `location_address` text;--> statement-breakpoint
ALTER TABLE `events` ADD `location_url` text;--> statement-breakpoint
ALTER TABLE `events` ADD `banner_urls` text;--> statement-breakpoint
ALTER TABLE `events` ADD `socials` text;