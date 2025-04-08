/*
  Warnings:

  - You are about to drop the column `adresse` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `adresse`,
    ADD COLUMN `company_email` VARCHAR(255) NULL;
