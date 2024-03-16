/*
  Warnings:

  - You are about to drop the column `day` on the `Statistics` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `Statistics` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Statistics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Statistics` DROP COLUMN `day`,
    DROP COLUMN `month`,
    DROP COLUMN `year`,
    ADD COLUMN `recordDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
