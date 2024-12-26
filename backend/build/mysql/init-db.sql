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
('ScarletWitch', 'hashed_password10', 'scarlet@avengers.com', 'token10', 1),
('DoctorStrange', 'hashed_password9', 'strange@avengers.com', 'token9', 1),
('BlackPanther', 'hashed_password8', 'panther@avengers.com', 'token8', 1),
('SpiderMan', 'hashed_password7', 'spidey@avengers.com', 'token7', 1),
('CaptainAmerica', 'hashed_password2', 'cap@avengers.com', 'token2', 1),
('IronMan', 'hashed_password1', 'ironman@avengers.com', 'token1', 1),
('Thor', 'hashed_password4', 'thor@avengers.com', 'token4', 1),
('BlackWidow', 'hashed_password3', 'widow@avengers.com', 'token3', 1),
('Hulk', 'hashed_password5', 'hulk@avengers.com', 'token5', 1),
('Groot', 'hashed_password6', 'groot@avengers.com', 'token6', 1);

INSERT INTO posts (user_id, post_path)
VALUES
(1, 'http://localhost:8000/assets/groot_1.JPEG'),
(1, 'http://localhost:8000/assets/groot_2.JPEG'),
(1, 'http://localhost:8000/assets/groot_3.JPEG'),
(2, 'http://localhost:8000/assets/hulk_1.JPEG'),
(2, 'http://localhost:8000/assets/hulk_2.JPEG'),
(2, 'http://localhost:8000/assets/hulk_3.JPEG'),
(3, 'http://localhost:8000/assets/widow_1.JPEG'),
(3, 'http://localhost:8000/assets/widow_2.JPEG'),
(3, 'http://localhost:8000/assets/widow_3.JPEG'),
(4, 'http://localhost:8000/assets/thor_1.JPEG'),
(4, 'http://localhost:8000/assets/thor_2.JPEG'),
(4, 'http://localhost:8000/assets/thor_3.JPEG'),
(5, 'http://localhost:8000/assets/iron_1.JPEG'),
(5, 'http://localhost:8000/assets/iron_2.JPEG'),
(5, 'http://localhost:8000/assets/iron_3.JPEG'),
(6, 'http://localhost:8000/assets/captain_1.JPEG'),
(6, 'http://localhost:8000/assets/captain_2.JPEG'),
(6, 'http://localhost:8000/assets/captain_3.JPEG'),
(7, 'http://localhost:8000/assets/spidey_1.JPEG'),
(7, 'http://localhost:8000/assets/spidey_2.JPEG'),
(7, 'http://localhost:8000/assets/spidey_3.JPEG'),
(8, 'http://localhost:8000/assets/panther_1.JPEG'),
(8, 'http://localhost:8000/assets/panther_2.JPEG'),
(8, 'http://localhost:8000/assets/panther_3.JPEG'),
(9, 'http://localhost:8000/assets/strange_1.JPEG'),
(9, 'http://localhost:8000/assets/strange_2.JPEG'),
(9, 'http://localhost:8000/assets/strange_3.JPEG'),
(10, 'http://localhost:8000/assets/scarlet_1.JPEG'),
(10, 'http://localhost:8000/assets/scarlet_2.JPEG'),
(10, 'http://localhost:8000/assets/scarlet_3.JPEG');



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
-- Scarlet Witch comments
(10, 9, 'Stephen, don’t think I didn’t notice that spell trick!'),
(10, 4, 'Thor, you and I should combine powers sometime.'),
(10, 1, 'Tony, you might be a genius, but magic beats tech.'),

-- Doctor Strange comments
(9, 25, 'Wanda, your control over chaos is remarkable.'),
(9, 6, 'Thor, even the gods could use magic lessons.'),
(9, 2, 'Captain Rogers, time is always on your side.'),

-- Black Panther (T’Challa) comments
(8, 23, 'Doctor Strange, I appreciate your wisdom.'),
(8, 16, 'Groot, your strength is inspiring.'),
(8, 1, 'Tony, perhaps Vibranium could improve your suit.'),

-- Spider-Man (Peter Parker) comments
(7, 15, 'Hulk, remind me not to make you angry!'),
(7, 3, 'Natasha, how do you stay so cool under pressure?'),
(7, 1, 'Mr. Stark, you’re still the best mentor ever!'),

-- Captain America (Steve Rogers) comments
(6, 18, 'Groot, you’re a hero in any language.'),
(6, 4, 'Thor, Asgard never looked better.'),
(6, 1, 'Classic Stark, always showing off.'),

-- Iron Man (Tony Stark) comments
(5, 24, 'Looks like Wakanda is thriving. T’Challa, I might visit soon.'),
(5, 7, 'Hey, Spider-kid, nice swing! You’re getting there.'),
(5, 2, 'Not bad, Cap. You sure you don’t want to upgrade that shield?'),

-- Thor comments
(4, 22, 'Ah, Wakanda! A land worthy of its king.'),
(4, 5, 'Hulk, you are truly mighty, friend.'),
(4, 2, 'Captain Rogers, your leadership is unmatched.'),

-- Black Widow (Natasha Romanoff) comments
(3, 19, 'Groot, you’ve got charm!'),
(3, 9, 'Doctor Strange, that magic is impressive.'),
(3, 6, 'Nice hammer, Thor. But stealth is still better.'),

-- Hulk (Bruce Banner) comments
(2, 14, 'Thor, try not to break everything next time.'),
(2, 8, 'T’Challa, great suit. Let’s compare notes sometime.'),
(2, 1, 'Iron Man, you make good tech, but can it smash?'),

-- Groot comments
(1, 26, 'I am Groot! (Translation: Wanda, your magic is strong.)'),
(1, 12, 'I am Groot! (Translation: Thor, I like the lightning.)'),
(1, 3, 'I am Groot! (Translation: Natasha, you’re amazing.)');
