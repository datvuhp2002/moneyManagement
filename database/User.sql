/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- CREATE TABLE `User` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
--   `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
--   `phone` int DEFAULT NULL,
--   `note` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
--   `role_id` int NOT NULL DEFAULT '1',
--   `avatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
--   `refresh_token` longtext COLLATE utf8mb4_unicode_ci,
--   `status` int NOT NULL DEFAULT '1',
--   `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
--   `updatedAt` datetime(3) DEFAULT NULL,
--   `deletedAt` datetime(3) DEFAULT NULL,
--   `deleteMark` tinyint(1) NOT NULL DEFAULT '0',
--   PRIMARY KEY (`id`),
--   UNIQUE KEY `User_email_key` (`email`),
--   KEY `User_role_id_fkey` (`role_id`),
--   CONSTRAINT `User_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
-- ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `User` (`id`, `username`, `email`, `password`, `name`, `note`, `role_id`, `avatar`, `refresh_token`, `status`, `createdAt`, `updatedAt`, `deletedAt`, `deleteMark`) VALUES
(1, 'admin', 'admin@gmail.com', '$2b$10$wbWQ9RqidfeA8rMF8jVw7OdDYlpM0xSjxUPsxnfxxUwrEvvqPSqRG', NULL, NULL, 2, NULL, NULL, 1, '2024-03-04 15:34:38.446', '2024-03-04 15:34:38.446', NULL, 0);
INSERT INTO `User` (`id`, `username`, `email`, `password`, `name`, `note`, `role_id`, `avatar`, `refresh_token`, `status`, `createdAt`, `updatedAt`, `deletedAt`, `deleteMark`) VALUES
(2, 'user', 'user@gmail.com', '$2b$10$yPbr0FYJYKt7UElSBg/TaePmzUAU.vdHcGAG8oyYGLFEyShGHp3xu', NULL, NULL, 1, NULL, NULL, 1, '2024-03-04 15:34:48.331', '2024-03-04 15:34:48.331', NULL, 0);


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;