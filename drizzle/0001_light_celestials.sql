PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_events` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`template_id` integer DEFAULT 1 NOT NULL,
	`templates` text,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`price` integer NOT NULL,
	`location` text,
	`banner_url` text,
	`theme_color` text DEFAULT '#FFFFFF',
	`partner_id` text DEFAULT '0100010000060004',
	`biller_code` text DEFAULT '01',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_events`("id", "name", "description", "template_id", "templates", "start_date", "end_date", "price", "location", "banner_url", "theme_color", "partner_id", "biller_code", "created_at", "updated_at") SELECT "id", "name", "description", "template_id", "templates", "start_date", "end_date", "price", "location", "banner_url", "theme_color", "partner_id", "biller_code", "created_at", "updated_at" FROM `events`;--> statement-breakpoint
DROP TABLE `events`;--> statement-breakpoint
ALTER TABLE `__new_events` RENAME TO `events`;--> statement-breakpoint
PRAGMA foreign_keys=ON;