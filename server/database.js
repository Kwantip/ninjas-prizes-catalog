import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()


// Ninja API
export async function getNinjas() {
    const [rows] = await pool.query(`
        SELECT * FROM ninjas 
        ORDER BY last_name, first_name`)
    return rows
}

async function getNinja(id) {
    const [result] = await pool.query(`
        SELECT * FROM ninjas 
        WHERE id = ?
        `, [id])
    return result
}

async function getNinjaByName(firstName, lastName) {
    const [rows] = await pool.query(`
        SELECT * FROM ninjas 
        WHERE first_name = ? AND last_name = ?
        `, [firstName, lastName])
    return rows
}

export async function createNinja(firstName, lastName) {
    const [result] = await pool.query(`
        INSERT INTO ninjas (first_name, last_name)
        VALUES (?, ?)
        `, [firstName, lastName])
    const id = result.insertId
    return getNinja(id)
}


// Prize Category API
export async function getPrizeCategories() {
    const [rows] = await pool.query(`
        SELECT * FROM prize_categories 
        ORDER BY price_coin_type, price_quantity ASC`)
    return rows
}

export async function getPrizeCategory(id) {
    const [result] = await pool.query(`
        SELECT * FROM prize_categories
        WHERE id = ?
        `, [id])
    return result
}

async function getPrizeCategoryByName(name) {
    const [result] = await pool.query(`
        SELECT * FROM prize_categories
        WHERE name = ?
        `, [name])
    return result
}

export async function createPrizeCategory(name, priceQuantity, priceCoinType, image, description, isVisible, isOrderable) {
    const [result] = await pool.query(`
        INSERT INTO prize_categories (name, price_quantity, price_coin_type, image, description, is_visible, is_orderable)
        VALUES (?, ?, ?, ?, ?)
        `, [name, priceQuantity, priceCoinType, image, description, isVisible, isOrderable])
    const id = result.insertId
    return getPrizeCategory(id)
}

export async function updatePrizeCategory(id, name, priceQuantity, priceCoinType, image, description, isVisible, isOrderable) {
    const [result] = await pool.query(`
        UPDATE prize_categories
        SET name = ?, price_quantity = ?, price_coin_type = ?, image = ?, description = ?, is_visible = ?, is_orderable = ?
        WHERE id = ?
        `, [name, priceQuantity, priceCoinType, image, description, isVisible, isOrderable, id])
    
    return 'update success'
}

export async function deletePrizeCategory(id) {
    // const [category] = getPrizeCategory(id)
    // if (category)
    // {
    const [result] = await pool.query(`
        DELETE FROM prize_categories
        WHERE id = ?
        `, [id])
    return 'delete success'
    // }
    // return 'prize category does not exist'
}


// Prize Item API
export async function getPrizeItems() {
    const [rows] = await pool.query("SELECT * FROM prize_items")
    return rows
}

export async function getPrizeItemsByColumn(isOrderable) {
    const [rows] = await pool.query(`
        SELECT prize_items.id, prize_items.name
        FROM prize_categories
        INNER JOIN prize_items
            ON prize_items.prize_category_id=prize_categories.id
        WHERE is_orderable = ?;
        `, [isOrderable])
    return rows
}

export async function getPrizeItem(id) {
    const [result] = await pool.query(`
        SELECT * FROM prize_items
        WHERE id = ?
        `, [id])
    return result
}

async function getPrizeItemByName(name) {
    const [result] = await pool.query(`
        SELECT * FROM prize_items
        WHERE name = ?
        `, [name])
    return result
}

export async function createPrizeItem(name, image, isVisible, prizeCategoryId) {
    const [result] = await pool.query(`
        INSERT INTO prize_items (name, image, is_visible, prize_category_id)
        VALUES (?, ?, ?, ?)
        `, [name, image, isVisible, prizeCategoryId])
    const id = result.insertId
    return getPrizeItem(id)
}

export async function updatePrizeItem(id, name, image, isVisible, prizeCategoryId) {
    const [result] = await pool.query(`
        UPDATE prize_items
        SET name = ?, image = ?, is_visible = ?, prize_category_id = ?
        WHERE id = ?
        `, [name, image, isVisible, prizeCategoryId, id])
    
    return 'update success'
}

export async function deletePrizeItem(id) {
    const [result] = await pool.query(`
        DELETE FROM prize_items
        WHERE id = ?
        `, [id])
    return 'delete success'
    // return 'prize item does not exist'
}

// Colors API
export async function getColors() {
    const [rows] = await pool.query("SELECT * FROM filament_colors")
    return rows
}

export async function getColor(id) {
    const [result] = await pool.query(`
        SELECT * FROM filament_colors
        WHERE id = ?
        `, [id])
    return result
}

async function getColorByName(name) {
    const [result] = await pool.query(`
        SELECT * FROM filament_colors
        WHERE name = ?
        `, [name])
    return result
}

export async function getColorsByAvailibility(isAvailable) {
    const [rows] = await pool.query(`
        SELECT * FROM filament_colors
        WHERE is_available = ?
        `, [isAvailable])
    return rows
}

export async function createColor(name, isAvailable) {
    const [result] = await pool.query(`
        INSERT INTO filament_colors (name, is_available)
        VALUES (?, ?)
        `, [name, isAvailable])
    const id = result.insertId
    return getColor(id)
}

export async function updateColor(id, name, isAvailable) {
    const [result] = await pool.query(`
        UPDATE filament_colors
        SET name = ?, is_available = ?
        WHERE id = ?
        `, [name, isAvailable, id])
    
    return 'update success'
}

export async function updateColorByAvailibility(id, isAvailable) {
    const [result] = await pool.query(`
        UPDATE filament_colors
        SET is_available = ?
        WHERE id = ?
        `, [isAvailable, id])

    return 'update success'
}

export async function deleteColor(id) {
    const [result] = await pool.query(`
        DELETE FROM filament_colors
        WHERE id = ?
        `, [id])
    return 'delete success'
}


// Orders API
export async function getOrders() {
    const [rows] = await pool.query(`
        SELECT orders.id, ninjas.first_name, ninjas.last_name, prize_items.name AS print_name, orders.link_to_item, filament_colors.name AS color, orders.status, orders.created_at, orders.updated_at, orders.status_changed_at
        FROM Orders
        INNER JOIN prize_items
	        ON orders.prize_item_id=prize_items.id
        INNER JOIN ninjas
            ON orders.ninja_id=ninjas.id
        INNER JOIN filament_colors
            ON orders.color_id=filament_colors.id;
    `)
    return rows
}

export async function getOrder(id) {
    const [result] = await pool.query(`
        SELECT * FROM orders
        WHERE id = ?
        `, [id])
    return result
}

export async function createOrder(linkToItem, notes, prizeItemName, ninjaFirstName, ninjaLastName, colorName) {
    // look up Prize Item by name
    let prizeItem = await getPrizeItemByName(prizeItemName)

    if (prizeItem.length == 0)
    {
        // look up Prize Category by name
        const prizeCategory = await getPrizeCategoryByName("Custom Prints")

        // create Prize Item
        prizeItem = await createPrizeItem(prizeItemName, "", 0, prizeCategory[0].id)
    }

    // look up Ninja by first and last name
    let ninja = await getNinjaByName(ninjaFirstName, ninjaLastName)
    if (ninja.length === 0)
    {
        ninja = await createNinja(ninjaFirstName, ninjaLastName)
    }

    // look up Color by name
    const color = await getColorByName(colorName)
    
    const [result] = await pool.query(`
        INSERT INTO orders (link_to_item, notes, status, prize_item_id, ninja_id, color_id)
        VALUES (?, ?, ?, ?, ?, ?)
        `, [linkToItem, notes, "PENDING", prizeItem[0].id, ninja[0].id, color[0].id])
    const id = result.insertId
    return getOrder(id)
}

export async function updateOrder(id, linkToItem, notes, status, prizeItemId, ninjaId, colorId) {
    const [result] = await pool.query(`
        UPDATE orders
        SET link_to_item = ?, notes = ?, status = ?, prize_item_id = ?, ninja_id = ?, color_id = ?
        WHERE id = ?
        `, [linkToItem, notes, status, prizeItemId, ninjaId, colorId, id])
    
    return 'update success'
}

export async function updateOrderByStatus(id, status) {
    const [result] = await pool.query(`
        UPDATE orders
        SET status = ?
        WHERE id = ?
        `, [status, id])
    
    return 'update success'
}

export async function deleteOrder(id) {
    const [result] = await pool.query(`
        DELETE FROM orders
        WHERE id = ?
        `, [id])
    return 'delete success'
    // return 'order does not exist'
}