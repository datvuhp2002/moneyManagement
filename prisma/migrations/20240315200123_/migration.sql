/*
  Warnings:

  - You are about to alter the column `expense` on the `Statistics` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `revenue` on the `Statistics` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `bill` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `Statistics` MODIFY `expense` INTEGER NULL,
    MODIFY `revenue` INTEGER NULL;

-- AlterTable
ALTER TABLE `Transaction` MODIFY `bill` INTEGER NOT NULL;
