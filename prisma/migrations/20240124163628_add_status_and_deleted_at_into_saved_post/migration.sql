-- AlterTable
ALTER TABLE `SavedPost` ADD COLUMN `DeletedAt` DATETIME(3) NULL,
    ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1;
