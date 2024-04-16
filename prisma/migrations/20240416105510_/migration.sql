-- DropIndex
DROP INDEX `Study_user_id_fkey` ON `Study`;

-- AlterTable
ALTER TABLE `Study` MODIFY `user_id` VARCHAR(191) NOT NULL;
