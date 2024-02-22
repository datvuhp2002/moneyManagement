/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommentLesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CommentPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quiz` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SavedPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserDictionary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vocabulary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CommentLesson` DROP FOREIGN KEY `CommentLesson_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `CommentLesson` DROP FOREIGN KEY `CommentLesson_lesson_id_fkey`;

-- DropForeignKey
ALTER TABLE `CommentPost` DROP FOREIGN KEY `CommentPost_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `CommentPost` DROP FOREIGN KEY `CommentPost_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `Lesson` DROP FOREIGN KEY `Lesson_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `PostTag` DROP FOREIGN KEY `PostTag_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `PostTag` DROP FOREIGN KEY `PostTag_tag_id_fkey`;

-- DropForeignKey
ALTER TABLE `Quiz` DROP FOREIGN KEY `Quiz_lesson_id_fkey`;

-- DropForeignKey
ALTER TABLE `SavedPost` DROP FOREIGN KEY `SavedPost_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `SavedPost` DROP FOREIGN KEY `SavedPost_post_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserDictionary` DROP FOREIGN KEY `UserDictionary_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserDictionary` DROP FOREIGN KEY `UserDictionary_vocabulary_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserProgress` DROP FOREIGN KEY `UserProgress_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserProgress` DROP FOREIGN KEY `UserProgress_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserProgress` DROP FOREIGN KEY `UserProgress_lesson_id_fkey`;

-- DropForeignKey
ALTER TABLE `UserProgress` DROP FOREIGN KEY `UserProgress_quiz_id_fkey`;

-- DropForeignKey
ALTER TABLE `Vocabulary` DROP FOREIGN KEY `Vocabulary_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `Vocabulary` DROP FOREIGN KEY `Vocabulary_lesson_id_fkey`;

-- DropTable
DROP TABLE `Category`;

-- DropTable
DROP TABLE `CommentLesson`;

-- DropTable
DROP TABLE `CommentPost`;

-- DropTable
DROP TABLE `Course`;

-- DropTable
DROP TABLE `Lesson`;

-- DropTable
DROP TABLE `Post`;

-- DropTable
DROP TABLE `PostTag`;

-- DropTable
DROP TABLE `Quiz`;

-- DropTable
DROP TABLE `SavedPost`;

-- DropTable
DROP TABLE `Tag`;

-- DropTable
DROP TABLE `UserDictionary`;

-- DropTable
DROP TABLE `UserProgress`;

-- DropTable
DROP TABLE `Vocabulary`;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `deletedAt` DATETIME(3) NULL,
    `deleteMark` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
