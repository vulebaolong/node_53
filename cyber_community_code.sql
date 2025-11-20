
SELECT VERSION()

-- TABLE

-- Users
CREATE TABLE `Users` (
--  Khi hoàn chỉnh
--  `id` INT PRIMARY KEY AUTO_INCREMENT;

	`user_id` INT,
	`fullName` VARCHAR(255),
	`email` VARCHAR(255),
	`age` INT,
	`avatar` VARCHAR(255)
)

-- Đổi tên table
RENAME TABLE `UsersNameNew` TO `Users`

-- Xoá table
DROP TABLE `Users`

-- ALTER TABLE --------
-- Sử dụng khi table đã tồn tại

-- thêm cột vào bảng Users
ALTER TABLE `Users`
ADD `password` VARCHAR(255);

-- đổi tên cột
ALTER TABLE `Users`
RENAME COLUMN `user_id` TO `id`


-- PRIMARY KEY:
--		Sự kết hợp giữa NOT NULL và UNIQUE
-- 		Một bảng chỉ có 1 PRIMARY KEY
--		PRIMARY KEY có thể gồm nhiều cột (PRIMARY KEY COMPOSIT)
ALTER TABLE `Users`
MODIFY `id` INT PRIMARY KEY AUTO_INCREMENT;


-- Xoá cột
ALTER TABLE `Users`
DROP COLUMN `age`

CREATE TABLE `Foods` (
	`id` INT PRIMARY KEY AUTO_INCREMENT,

	`name` VARCHAR(255),
	`description` VARCHAR(255) DEFAULT "Chưa có thông tin"
)


INSERT INTO `Foods` (`name`, `description`) VALUES
					("Su kem", "Bánh được làm từ kem"),
					("gỏi gà", "Gỏi được làm từ gà"),
					("gỏi vịt", "Gỏi được làm từ vịt"),
					("gỏi cá", "Gỏi được làm từ cá"),
					("gỏi heo", "Gỏi được làm từ heo");

INSERT INTO `Users` (`fullName`, `email`) VALUES
					("Nguyen Van A", "a@gmail.com"),
					("Nguyen Van B", "b@gmail.com"),
					("Nguyen Van C", "c@gmail.com"),
					("Nguyen Van D", "d@gmail.com"),
					("Nguyen Van E", "e@gmail.com")	
					
				
-- Query: lấy dữ liệu

SELECT * FROM `Users`

SELECT `fullName` FROM `Users`

SELECT `fullName` AS "họ và tên" FROM `Users`

SELECT * 
FROM `Users`
WHERE `id` = 2
					
					
CREATE TABLE `Orders` (
	`id` INT PRIMARY KEY AUTO_INCREMENT,
	
	`userId` INT,
	`foodId` INT,
	
	FOREIGN KEY (`userId`) REFERENCES `Users`(`id`),
	FOREIGN KEY (`foodId`) REFERENCES `Foods`(`id`)
)

-- Người dùng mua hàng
-- Ai là người mua hàng?
-- Họ mua món gì?
INSERT INTO `Orders` (`userId`, `foodId`) VALUES
					(1, 2),
					(3, 2),
					(2, 5),
					(1, 3),
					(3, 1)
					
					
-- n - n (MANY to MANY)
-- 1 record của bảng A có thể nối với nhiều record bên bảng B, và ngược lại

-- 1 - n (ONE to MANY)
-- 1 record của bảng A có thể nối với nhiều record bên bảng B (không có ngược)

-- 1 - 1 (ONE to ONE)
-- 1 record của bảng A chỉ được nối với 1 record của bảng B


-- INNER JOIN
-- Tham chiếu và bao gồm thêm dữ liệu
SELECT *
FROM `Orders`
INNER JOIN `Users` ON `Orders`.`userId` = `Users`.`id`
INNER JOIN `Foods` ON `Orders`.`foodId` = `Foods`.`id`

-- LEFT/RIGHT JOIN
-- LEFT và RIGHT: muốn lấy bên nào làm mốc thì chọn LEFT HOẶC RIGHT
-- bảng làm mốc sẽ lấy hết kể cả so sánh không bằng

-- LEFT
SELECT *
FROM `Orders`
LEFT JOIN `Users` ON `Orders`.`userId` = `Users`.`id`

-- RIGHT
SELECT *
FROM `Orders`
RIGHT JOIN `Users` ON `Orders`.`userId` = `Users`.`id`

-- CROSS JOIN
-- trả về kết quả của cả 2 bảng
SELECT *
FROM `Orders`
CROSS JOIN `Users`

-- GROUP BY: nhóm các hàng có cùng giá trị
-- sử dụng chung với COUNT(), MAX(), MIN(), SUM(), AVG()

-- lỗi: Query 1 ERROR at Line 143: : Column 'id' in group statement is ambiguous
SELECT *
FROM `Orders`
INNER JOIN `Users` ON `Orders`.`userId` = `Users`.`id`
GROUP BY `id`


-- lỗi: Query 1 ERROR at Line 152: : Expression #1 of SELECT list is not in GROUP BY clause and contains nonaggregated column 'cyber_community.Orders.id' which is not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by
SELECT *
FROM `Orders`
INNER JOIN `Users` ON `Orders`.`userId` = `Users`.`id`
GROUP BY `Users`.`id`

-- thành công
SELECT `userId`, `Users`.`id`, `fullName`, `email`
FROM `Orders`
INNER JOIN `Users` ON `Orders`.`userId` = `Users`.`id`
GROUP BY `Users`.`id`

-- COUNT()
SELECT `userId`, `Users`.`id`, `fullName`, `email`, COUNT(`Users`.`id`) AS "Số Lượng"
FROM `Orders`
INNER JOIN `Users` ON `Orders`.`userId` = `Users`.`id`
GROUP BY `Users`.`id`

-- Sắp xếp
-- ORDER BY
-- DESC: giảm dần
SELECT `userId`, `Users`.`id`, `fullName`, `email`, COUNT(`Users`.`id`) AS "Số Lượng"
FROM `Orders`
INNER JOIN `Users` ON `Orders`.`userId` = `Users`.`id`
GROUP BY `Users`.`id`
ORDER BY `Số Lượng` DESC

-- ASC: tăng dần
SELECT `userId`, `Users`.`id`, `fullName`, `email`, COUNT(`Users`.`id`) AS "Số Lượng"
FROM `Orders`
INNER JOIN `Users` ON `Orders`.`userId` = `Users`.`id`
GROUP BY `Users`.`id`
ORDER BY `Số Lượng` ASC


-- Giải bài tập
-- Tìm 5 người đã like nhà hàng nhiều nhất
-- Tìm 5 người đã order food nhiều nhất
SELECT `userId`, `Users`.`id`, `fullName`, `email`, COUNT(`Users`.`id`) AS "Số Lượng"
FROM `Orders`
INNER JOIN `Users` ON `Orders`.`userId` = `Users`.`id`
GROUP BY `Users`.`id`
ORDER BY `Số Lượng` DESC
LIMIT 2

-- Tìm người dùng không hoạt động trong hệ thống (không đặt hàng, không like, không đánh giá nhà hàng).
SELECT *
FROM `Users`
LEFT JOIN `Orders` ON `Users`.`id` = `Orders`.`userId`
LEFT JOIN `Likes` ON `Users`.`id` = `Likes`.`userId`
LEFT JOIN `RateRes` ON `Users`.`id` = `RateRes`.`userId`
WHERE `Orders`.`id` IS NULL AND `Likes`.`id` IS NULL AND `RateRes`.`id` IS NULL



-- TEAMPLATE TABLE
CREATE TABLE
	IF NOT EXISTS `TABLE_TEMPLATE` (
		-- `id` bây giờ thường được nâng cấp lên UUIDv7
		`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
		-- 
		-- 
		-- `deletedBy` INT NOT NULL DEFAULT 0,
		-- `deletedAt` TIMESTAMP NULL DEFAULT NULL,
		`isDeleted` TINYINT (1) NOT NULL DEFAULT 0,
		`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	);

-- Users
CREATE TABLE
	IF NOT EXISTS `Users` (
		-- `id` bây giờ thường được nâng cấp lên UUIDv7
		`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
		-- 
		`email` VARCHAR(255) NOT NULL UNIQUE,
		`fullName` VARCHAR(255),
		`avatar` VARCHAR(255),
		`password` VARCHAR(255),
		`googleId` VARCHAR(255),
		-- 
		`isDeleted` TINYINT (1) NOT NULL DEFAULT 0,
		`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	);

CREATE TABLE
	IF NOT EXISTS `Articles` (
		-- `id` bây giờ thường được nâng cấp lên UUIDv7
		`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
		-- 
		`title` VARCHAR(255),
		`content` TEXT,
		`imageUrl` VARCHAR(255),
		`views` INT NOT NULL DEFAULT 0,
		`userId` INT NOT NULL,
		FOREIGN KEY (`userId`)  REFERENCES  `Users` (`id`),
		-- 
		`isDeleted` TINYINT (1) NOT NULL DEFAULT 0,
		`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	);

CREATE TABLE
	IF NOT EXISTS `Foods` (
		`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
		-- 
		`name` VARCHAR(255),
		`description` VARCHAR(255),
		-- 
		`isDeleted` TINYINT (1) NOT NULL DEFAULT 0,
		`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	);

CREATE TABLE
	IF NOT EXISTS `Orders` (
		`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
		-- 
		`userId` INT,
		`foodId` INT,
		FOREIGN KEY (`userId`) REFERENCES `Users` (`id`),
		FOREIGN KEY (`foodId`) REFERENCES `Foods` (`id`),
		-- 
		`isDeleted` TINYINT (1) NOT NULL DEFAULT 0,
		`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	);

-- Đảm bảo có 3 user có cột id là: 1, 2, 3
INSERT INTO
	`Articles` (
		`content`,
		`imageUrl`,
		`views`,
		`userId`,
		`createdAt`,
		`updatedAt`
	)
VALUES
	(
		'Content about learning NextJS...',
		'https://picsum.photos/seed/1/600/400',
		15,
		1,
		'2024-01-01 08:00:00',
		'2024-01-01 08:00:00'
	),
	(
		'Content about mastering React Query...',
		'https://picsum.photos/seed/2/600/400',
		32,
		2,
		'2024-01-02 09:00:00',
		'2024-01-02 09:00:00'
	),
	(
		'Content about JavaScript tips...',
		'https://picsum.photos/seed/3/600/400',
		45,
		1,
		'2024-01-03 10:00:00',
		'2024-01-03 10:00:00'
	),
	(
		'Comparison content...',
		'https://picsum.photos/seed/4/600/400',
		27,
		3,
		'2024-01-04 11:00:00',
		'2024-01-04 11:00:00'
	),
	(
		'Content about TypeScript...',
		'https://picsum.photos/seed/5/600/400',
		12,
		2,
		'2024-01-05 12:00:00',
		'2024-01-05 12:00:00'
	),
	(
		'Content about SQL joins...',
		'https://picsum.photos/seed/6/600/400',
		8,
		3,
		'2024-01-06 13:00:00',
		'2024-01-06 13:00:00'
	),
	(
		'Extensions content...',
		'https://picsum.photos/seed/7/600/400',
		60,
		1,
		'2024-01-07 14:00:00',
		'2024-01-07 14:00:00'
	),
	(
		'Content about React optimization...',
		'https://picsum.photos/seed/8/600/400',
		33,
		2,
		'2024-01-08 15:00:00',
		'2024-01-08 15:00:00'
	),
	(
		'Content about API design...',
		'https://picsum.photos/seed/9/600/400',
		18,
		3,
		'2024-01-09 16:00:00',
		'2024-01-09 16:00:00'
	),
	(
		'Predictions about web development...',
		'https://picsum.photos/seed/10/600/400',
		21,
		1,
		'2024-01-10 17:00:00',
		'2024-01-10 17:00:00'
	);

