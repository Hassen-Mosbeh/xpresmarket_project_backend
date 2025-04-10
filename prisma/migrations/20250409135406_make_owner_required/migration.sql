/*
  Warnings:

  - Made the column `ownerId` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `product_ownerId_fkey`;

-- DropIndex
DROP INDEX `product_ownerId_fkey` ON `product`;

-- AlterTable
ALTER TABLE `product` MODIFY `ownerId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
