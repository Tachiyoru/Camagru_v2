CREATE DATABASE IF NOT EXISTS mydb;

USE mydb;

CREATE TABLE IF NOT EXISTS users (
	id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(50) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	is_log TINYINT(1) DEFAULT 0,
	is_active TINYINT(1) DEFAULT 0,
	notify TINYINT(1) DEFAULT 1,
	user_token VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	post_path VARCHAR(255) NOT NULL,
	description TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	post_id INT,
	comment TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes (
	id INT AUTO_INCREMENT PRIMARY KEY,
	user_id INT NOT NULL,
	post_id INT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

INSERT INTO users (username, password, email, user_token, is_active)
VALUES
('Groot', 'hashed_password6', 'groot@avengers.com', 'token6', 1),
('Hulk', 'hashed_password5', 'hulk@avengers.com', 'token5', 1),
('BlackWidow', 'hashed_password3', 'widow@avengers.com', 'token3', 1),
('Thor', 'hashed_password4', 'thor@avengers.com', 'token4', 1),
('IronMan', 'hashed_password1', 'ironman@avengers.com', 'token1', 1),
('CaptainAmerica', 'hashed_password2', 'cap@avengers.com', 'token2', 1),
('SpiderMan', 'hashed_password7', 'spidey@avengers.com', 'token7', 1),
('BlackPanther', 'hashed_password8', 'panther@avengers.com', 'token8', 1),
('DoctorStrange', 'hashed_password9', 'strange@avengers.com', 'token9', 1),
('ScarletWitch', 'hashed_password10', 'scarlet@avengers.com', 'token10', 1);

INSERT INTO posts (user_id, post_path)
VALUES
(10, 'http://localhost:8000/assets/scarlet_3.JPEG'),
(10, 'http://localhost:8000/assets/scarlet_2.JPEG'),
(10, 'http://localhost:8000/assets/scarlet_1.JPEG'),
(9, 'http://localhost:8000/assets/strange_3.JPEG'),
(9, 'http://localhost:8000/assets/strange_2.JPEG'),
(9, 'http://localhost:8000/assets/strange_1.JPEG'),
(8, 'http://localhost:8000/assets/panther_3.JPEG'),
(8, 'http://localhost:8000/assets/panther_2.JPEG'),
(8, 'http://localhost:8000/assets/panther_1.JPEG'),
(7, 'http://localhost:8000/assets/spidey_3.JPEG'),
(7, 'http://localhost:8000/assets/spidey_2.JPEG'),
(7, 'http://localhost:8000/assets/spidey_1.JPEG'),
(6, 'http://localhost:8000/assets/captain_3.JPEG'),
(6, 'http://localhost:8000/assets/captain_2.JPEG'),
(6, 'http://localhost:8000/assets/captain_1.JPEG'),
(5, 'http://localhost:8000/assets/iron_3.JPEG'),
(5, 'http://localhost:8000/assets/iron_2.JPEG'),
(5, 'http://localhost:8000/assets/iron_1.JPEG'),
(4, 'http://localhost:8000/assets/thor_3.JPEG'),
(4, 'http://localhost:8000/assets/thor_2.JPEG'),
(4, 'http://localhost:8000/assets/thor_1.JPEG'),
(3, 'http://localhost:8000/assets/widow_3.JPEG'),
(3, 'http://localhost:8000/assets/widow_2.JPEG'),
(3, 'http://localhost:8000/assets/widow_1.JPEG'),
(2, 'http://localhost:8000/assets/hulk_3.JPEG'),
(2, 'http://localhost:8000/assets/hulk_2.JPEG'),
(2, 'http://localhost:8000/assets/hulk_1.JPEG'),
(1, 'http://localhost:8000/assets/groot_3.JPEG'),
(1, 'http://localhost:8000/assets/groot_2.JPEG'),
(1, 'http://localhost:8000/assets/groot_1.JPEG');


INSERT INTO likes (user_id, post_id)
VALUES
(1, 1),
(2, 2),
(3, 4),
(4, 4),
(5, 4),
(6, 5),
(1, 5),
(7, 6),
(8, 6),
(9, 6),
(10, 7),
(2, 7),
(3, 8),
(4, 9),
(5, 9),
(6, 10),
(7, 10),
(8, 10),
(9, 11),
(10, 11),
(1, 12),
(2, 12),
(3, 13),
(4, 13),
(5, 13),
(6, 14),
(7, 14),
(8, 14),
(9, 15),
(10, 15),
(1, 16),
(2, 17),
(3, 17),
(4, 18),
(5, 19),
(6, 20),
(7, 21),
(8, 22),
(9, 23),
(10, 24),
(1, 25),
(2, 26),
(3, 27),
(4, 28),
(5, 29),
(6, 30);


INSERT INTO comments (user_id, post_id, comment)
VALUES
-- Scarlet Witch's posts
(9, 1, 'Nice chaos, Wanda! Did you forget to clean up after reality again?'),
(5, 2, 'Wanda, this is why I always say "stick to the manual." Oh wait, you don’t use one.'),
(4, 3, 'Magic again? I bet Mjolnir could do that too, just saying.'),

-- Doctor Strange's posts
(10, 4, 'Stephen, why do your selfies always have portals in them?'),
(5, 5, 'You might be a doctor, but that lighting could use a Stark touch.'),
(7, 6, 'Wow, Doc! Is that your cape or a sentient fashion statement?'),

-- Black Panther's posts
(7, 7, 'TChalla, is that vibranium or just really shiny Wakandan bling?'),
(4, 8, 'Wakanda forever! But wheres my invite to the palace, brother?'),
(5, 9, 'That tech is cool, but I could make it fly. Call me.'),

-- Spider-Man's posts
(6, 10, 'Kid, I hope youre not skipping school for this web-slinging photo shoot.'),
(3, 11, 'Peter, do you ever take a picture without the mask?'),
(2, 12, 'Hulk like Spider-Man. But Hulk not fit in tight suit.'),

-- Captain Americas posts
(5, 13, 'Steve, still using that vintage shield, huh? Want me to upgrade it?'),
(4, 14, 'Cap, if you throw that shield again, at least aim for the bad guys, not my drink!'),
(3, 15, 'Nice pose, Captain. Is that your “freedom” stance?'),

-- Iron Mans posts
(6, 16, 'Tony, stop showing off. Even Hulk cant count that many zeros in your bank.'),
(7, 17, 'Stark, does that suit come in “friendly neighborhood” size?'),
(9, 18, 'Impressive. But does it bend time and space? Thought not.'),

-- Thors posts
(5, 19, 'Thor, do all Asgardians take selfies with lightning, or is it just you?'),
(6, 20, 'Mjolnirs looking good, but how about sharing that power with Hulk?'),
(7, 21, 'Thor, can Spidey borrow some thunder for a school project?'),

-- Black Widows posts
(7, 22, 'Nat, how do you always look so cool even when saving the world?'),
(5, 23, 'Widow, nice stealth skills, but those heels cant be standard issue.'),
(9, 24, 'Fascinating. Do spies always have such dramatic lighting?'),

-- Hulks posts
(5, 25, 'Hulk smash camera again? Good thing Stark tech is durable.'),
(7, 26, 'Hulk, do you ever take selfies that dont involve breaking something?'),
(3, 27, 'Hulk, youre looking green as ever. Is that the new aesthetic?'),

-- Groots posts
(2, 28, 'Groot, Hulk understand. "Hulk smash" is same as "I am Groot."'),
(5, 29, 'Groot, Im designing a treehouse inspired by you. Interested?'),
(7, 30, 'I am Groot too, buddy. Wait... did I say that right?');
