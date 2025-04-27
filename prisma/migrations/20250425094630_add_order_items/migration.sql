/*
  Warnings:

  - You are about to drop the column `payement_method` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `orders` table. All the data in the column will be lost.
  - The values [Delivered] on the enum `orders_status` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `payment_method` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_product_id_fkey`;

-- DropIndex
DROP INDEX `orders_product_id_fkey` ON `orders`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `payement_method`,
    DROP COLUMN `product_id`,
    ADD COLUMN `notes` VARCHAR(191) NULL,
    ADD COLUMN `payment_id` VARCHAR(191) NULL,
    ADD COLUMN `payment_method` VARCHAR(50) NOT NULL,
    MODIFY `status` ENUM('Pending', 'Processing', 'Ready') NOT NULL DEFAULT 'Pending';

-- CreateTable
CREATE TABLE `order_items` (
    `item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
