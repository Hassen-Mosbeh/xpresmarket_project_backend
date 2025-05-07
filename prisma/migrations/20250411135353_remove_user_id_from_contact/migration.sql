/*
  Warnings:

  - You are about to drop the column `user_id` on the `contact` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `contact` DROP FOREIGN KEY `Contact_user_id_fkey`;

-- DropIndex
DROP INDEX `Contact_user_id_fkey` ON `contact`;

-- AlterTable
ALTER TABLE `contact` DROP COLUMN `user_id`;

-- CreateIndex
CREATE UNIQUE INDEX `Contact_email_key` ON `Contact`(`email`);
