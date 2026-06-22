CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`template_id` integer NOT NULL,
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
