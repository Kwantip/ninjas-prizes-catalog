CREATE DATABASE ninja_prize_catalog_app;
USE ninja_prize_catalog_app;

-- Ninja Info
CREATE TABLE ninjas (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL
);

-- Example of adding a new Ninja
INSERT INTO ninjas (first_name, last_name)
VALUES ('test', 'ninja'); 

-- Prize Category
CREATE TABLE prize_categories (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    price_quantity INT NOT NULL,
    price_coin_type VARCHAR(50) NOT NULL,
    image VARCHAR(255),
    description VARCHAR(255) NOT NULL,
    is_visible BOOLEAN NOT NULL
);

-- Example of adding a new Prize Category
INSERT INTO prize_categories (name, price_quantity, price_coin_type, image, description, is_visible)
VALUES ('Sanrio Keychains', 1, 'Gold', 'SanrioKeychains-2.jpg', 'Very cute keychains of Sanrio characters', TRUE); 

-- Example of editing an existing Prize Category
UPDATE prize_categories
SET name = 'test edit', price_quantity = 1, price_coin_type = 'Silver', image = '', description = 'editing category from mysql', is_visible=TRUE
WHERE id = 4;

-- Prize Item
CREATE TABLE prize_items (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    image VARCHAR(255),
    stock_amount INT NOT NULL, /* TODO: maybe remove */
    prize_category_id INT NOT NULL,
    FOREIGN KEY (prize_category_id) REFERENCES prize_categories(id)
);

-- Example of adding a new Prize Item
INSERT INTO prize_items (name, image, stock_amount, prize_category_id)
VALUES ('Hello Kitty', 'SanrioKeychains-2.jpg', 5, 1);

-- Filament colors
CREATE TABLE filament_colors (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    is_available BOOLEAN NOT NULL
);

-- Example of adding a new Filament Color
INSERT INTO filament_colors (name, is_available)
VALUES ('blue', TRUE);

-- Print Orders
CREATE TABLE orders (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    link_to_item VARCHAR(255),
    notes VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    prize_item_id INT, /* custom prints would use NULL value */
    ninja_id INT NOT NULL UNIQUE,
    color_id INT NOT NULL,
    FOREIGN KEY (prize_item_id) REFERENCES prize_items(id),
    FOREIGN KEY (ninja_id) REFERENCES ninjas(id),
    FOREIGN KEY (color_id) REFERENCES filament_colors(id)
);

-- Example of adding a new Order
INSERT INTO orders (notes, link_to_item, status, prize_item_id, ninja_id, color_id)
VALUES ('test order creation', '', 'PENDING', 1, 1, 1); 

-- History of Order modifications
CREATE TABLE order_history (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    previous_status VARCHAR(50) NOT NULL,
    new_status VARCHAR(50) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(50),
    order_id INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Game of the Month
CREATE TABLE game_of_the_month_entries (
	name VARCHAR(50) NOT NULL PRIMARY KEY,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    link_to_game VARCHAR(255) UNIQUE
);

-- Game of the Month Leaderboard items
CREATE TABLE leaderboard_entries (
	ninja_id INT NOT NULL PRIMARY KEY,
    score INT NOT NULL,
    FOREIGN KEY (ninja_id) REFERENCES ninjas(id)
);

-- Steps to archive Game of the Month Leaderboard for the previous month, then clear Game of the Month Leaderboard for current month
-- Create an archive table with the same structure
CREATE TABLE archive_your_table_name LIKE your_table_name;
-- Insert data from the original table into the archive table
INSERT INTO archive_your_table_name SELECT * FROM your_table_name;
-- Now you can clear the original table (e.g., using TRUNCATE TABLE)
TRUNCATE TABLE your_table_name;


-- Classroom rules
CREATE TABLE ninja_actions (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    price_quantity INT NOT NULL,
    price_coin_type VARCHAR(50) NOT NULL,
    is_good BOOLEAN NOT NULL,
    has_multiplier BOOLEAN NOT NULL
);

