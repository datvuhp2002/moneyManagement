/*
  Warnings:

  - You are about to drop the column `Day` on the `Statistics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Statistics` DROP COLUMN `Day`,
    ADD COLUMN `day` INTEGER NULL;
