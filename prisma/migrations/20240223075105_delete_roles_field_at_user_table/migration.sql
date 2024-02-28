/*
  Warnings:

  - You are about to drop the column `roles` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `CategoriesGroup` MODIFY `deleteMark` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Category` MODIFY `deleteMark` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Currency` MODIFY `deleteMark` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `MonthlyBudget` MODIFY `deleteMark` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Transaction` MODIFY `deleteMark` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `roles`,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `deleteMark` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Wallet` MODIFY `deleteMark` BOOLEAN NOT NULL DEFAULT false;
