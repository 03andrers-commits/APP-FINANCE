CREATE TABLE `credit_cards` (
	`id` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`brand` enum('visa','mastercard','elo','amex','other') NOT NULL,
	`limit` int NOT NULL,
	`lastFourDigits` varchar(4) NOT NULL,
	`dueDate` int NOT NULL,
	`photoUrl` text,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `credit_cards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `family_members` (
	`id` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`color` varchar(7) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `family_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sync_metadata` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`entityType` enum('card','transaction','member') NOT NULL,
	`entityId` varchar(64) NOT NULL,
	`lastSyncedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastModifiedAt` timestamp NOT NULL,
	CONSTRAINT `sync_metadata_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`cardId` varchar(64) NOT NULL,
	`memberId` varchar(64) NOT NULL,
	`amount` int NOT NULL,
	`description` varchar(255) NOT NULL,
	`category` enum('food','transport','health','entertainment','shopping','utilities','other') NOT NULL,
	`installments` int NOT NULL DEFAULT 1,
	`currentInstallment` int NOT NULL DEFAULT 1,
	`date` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
