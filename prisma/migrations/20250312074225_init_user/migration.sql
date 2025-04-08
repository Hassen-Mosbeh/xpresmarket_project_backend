-- CreateTable
CREATE TABLE `category` (
    `category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(255) NOT NULL,
    `descp_category` TEXT NULL,

    UNIQUE INDEX `category_category_name_key`(`category_name`),
    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `status` BOOLEAN NULL DEFAULT true,
    `image` VARCHAR(255) NULL,
    `category_id` INTEGER NULL,

    INDEX `category_id`(`category_id`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `adresse` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `company_name` VARCHAR(191) NOT NULL,
    `company_adresse` VARCHAR(191) NOT NULL,
    `company_tel` INTEGER NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON DELETE SET NULL ON UPDATE NO ACTION;
