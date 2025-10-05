CREATE DATABASE ninja_prize_catalog;
USE ninja_prize_catalog;

CREATE TABLE prize_categories (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    price_quantity INT NOT NULL,
    price_coin_type VARCHAR(50) NOT NULL,
    image VARCHAR(255),
    description VARCHAR(255) NOT NULL
);

INSERT INTO prize_categories (name, price_quantity, price_coin_type, image, description)
VALUES ('Sanrio Keychains', 1, 'Gold', 'SanrioKeychains-2.jpg', 'Very cute keychains of Sanrio characters'); 

CREATE TABLE prize_items (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    url VARCHAR(255),
    image VARCHAR(255),
    isInStock BOOLEAN NOT NULL,
    prize_category_id INT NOT NULL,
    FOREIGN KEY (prize_category_id) REFERENCES prize_categories(id)
);

INSERT INTO prize_items (name, description, url, image, isInStock, prize_category_id)
VALUES ('Hello Kitty', 'keychain of Hello Kitty', '', 'SanrioKeychains-2.jpg', FALSE, 1);

CREATE TABLE colors (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    is_available BOOLEAN NOT NULL
);

CREATE TABLE ninjas (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_initial VARCHAR(255) NOT NULL,
    impact_username VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE prize_orders (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    color VARCHAR(50) NOT NULL,
    notes VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    created_at VARCHAR(255),
    updated_at VARCHAR(255),
    status_changed_at VARCHAR(255),
    prize_item_id INT NOT NULL,
    ninja_id INT NOT NULL UNIQUE,
    color_id INT NOT NULL,
    FOREIGN KEY (prize_item_id) REFERENCES prize_items(id),
    FOREIGN KEY (ninja_id) REFERENCES ninjas(id),
    FOREIGN KEY (color_id) REFERENCES colors(id)
);

CREATE TABLE leaderboard_entries (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    score INT NOT NULL,
	ninja_id INT NOT NULL UNIQUE,
    FOREIGN KEY (ninja_id) REFERENCES ninjas(id)
);

CREATE TABLE ninja_actions (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    price_quantity INT NOT NULL,
    price_coin_type VARCHAR(50) NOT NULL,
    isGood BOOLEAN NOT NULL,
    hasMultiplier BOOLEAN NOT NULL,
	ninja_id INT NOT NULL UNIQUE,
    FOREIGN KEY (ninja_id) REFERENCES ninjas(id)
);

