CREATE TABLE `atrq_results` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`user_id` text NOT NULL,
	`overall_score` real NOT NULL,
	`risk_profile` text NOT NULL,
	`time_horizon` real NOT NULL,
	`financial_capacity` real NOT NULL,
	`loss_tolerance` real NOT NULL,
	`risk_experience` real NOT NULL,
	`last_updated` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `goals` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`user_id` text NOT NULL,
	`total_assets` real NOT NULL,
	`target_progress` real NOT NULL,
	`monthly_income` real NOT NULL,
	`risk_score` real NOT NULL,
	`assets_change` real NOT NULL,
	`income_change` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `monitoring_fields` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`user_id` text NOT NULL,
	`field_name` text NOT NULL,
	`is_enabled` integer DEFAULT true,
	`threshold` real,
	`alert_level` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portfolio_breaches` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`portfolio_id` text NOT NULL,
	`monitoring_field_id` text NOT NULL,
	`breach_condition` text NOT NULL,
	`breach_value` real NOT NULL,
	`status` text DEFAULT 'Pending' NOT NULL,
	`detected_at` integer DEFAULT CURRENT_TIMESTAMP,
	`resolved_at` integer
);
--> statement-breakpoint
CREATE TABLE `portfolios` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`value` real NOT NULL,
	`performance` real NOT NULL,
	`risk_level` text NOT NULL,
	`last_updated` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `suitability_rules` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`is_active` integer DEFAULT true,
	`conditions` text NOT NULL,
	`actions` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);