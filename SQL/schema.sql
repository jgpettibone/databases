DROP DATABASE IF EXISTS `chat`;

CREATE DATABASE chat;

USE chat;

-- CREATE TABLE messages (
--  /* Describe your table here.*/
--  MessageID int NOT NULL PRIMARY KEY,
--  Message varchar(255)
-- );

-- CREATE TABLE users (
--  /* Describe your table here.*/
--  UserID int NOT NULL PRIMARY KEY,
--  Username varchar(20)
-- );

-- CREATE TABLE rooms (
--  /* Describe your table here.*/
--  RoomID int NOT NULL PRIMARY KEY,
--  Roomname varchar(255)
-- );

-- /* You can also create more tables, if you need them... */

-- /*  Execute this file from the command line by typing:
--  *    mysql < schema.sql
--  *  to create the database and the tables.*/


-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'messages'
-- 
-- ---

DROP TABLE IF EXISTS `messages`;
    
CREATE TABLE `messages` (
  `id` TINYINT NULL AUTO_INCREMENT DEFAULT NULL,
  `text` VARCHAR(255) NULL DEFAULT NULL,
  `id_rooms` TINYINT NULL DEFAULT NULL,
  `id_users` TINYINT NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'users'
-- 
-- ---

DROP TABLE IF EXISTS `users`;
    
CREATE TABLE `users` (
  `id` TINYINT NULL AUTO_INCREMENT DEFAULT NULL,
  `username` VARCHAR(40) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'rooms'
-- 
-- ---

DROP TABLE IF EXISTS `rooms`;
    
CREATE TABLE `rooms` (
  `id` TINYINT NULL AUTO_INCREMENT DEFAULT NULL,
  `roomname` VARCHAR(40) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `messages` ADD FOREIGN KEY (id_rooms) REFERENCES `rooms` (`id`);
ALTER TABLE `messages` ADD FOREIGN KEY (id_users) REFERENCES `users` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `messages` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `rooms` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `messages` (`id`,`text`,`id_rooms`,`id_users`) VALUES
-- ('','','','');
-- INSERT INTO `users` (`id`,`username`) VALUES
-- ('','');
-- INSERT INTO `rooms` (`id`,`roomname`) VALUES
-- ('','');

