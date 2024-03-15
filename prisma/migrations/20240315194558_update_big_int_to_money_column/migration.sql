-- AlterTable
ALTER TABLE `Statistics` MODIFY `expense` BIGINT NULL,
    MODIFY `revenue` BIGINT NULL;

-- AlterTable
ALTER TABLE `Transaction` MODIFY `bill` BIGINT NOT NULL;
