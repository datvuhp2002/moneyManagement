-- AlterTable
ALTER TABLE `Category` ADD COLUMN `symbol` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Currency` ADD COLUMN `symbol` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Statistics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` INTEGER NULL,
    `month` INTEGER NULL,
    `Day` INTEGER NULL,
    `expense` INTEGER NULL,
    `revenue` INTEGER NULL,
    `user_id` INTEGER NOT NULL,
    `wallet_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `deletedAt` DATETIME(3) NULL,
    `deleteMark` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Statistics` ADD CONSTRAINT `Statistics_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Statistics` ADD CONSTRAINT `Statistics_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
