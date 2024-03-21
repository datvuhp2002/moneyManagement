/*
  Warnings:

  - You are about to drop the column `exchange_rate` on the `Currency` table. All the data in the column will be lost.
  - The values [Transfer] on the enum `Transaction_transactionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `is_default` on the `Wallet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Currency` DROP COLUMN `exchange_rate`;

-- AlterTable
ALTER TABLE `Transaction` MODIFY `transactionType` ENUM('Revenue', 'Expense') NOT NULL;

-- AlterTable
ALTER TABLE `Wallet` DROP COLUMN `is_default`;
