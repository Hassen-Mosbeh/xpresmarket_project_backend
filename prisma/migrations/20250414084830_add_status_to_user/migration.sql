-- AlterTable
ALTER TABLE `user` ADD COLUMN `status` ENUM('active', 'inactive', 'deleted') NOT NULL DEFAULT 'active';
