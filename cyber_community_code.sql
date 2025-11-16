
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
					







