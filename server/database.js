import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

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

export async function createPrizeCategory(name, priceQuantity, priceCoinType, image, description, isVisible) {
    const [result] = await pool.query(`
        INSERT INTO prize_categories (name, price_quantity, price_coin_type, image, description, is_visible)
        VALUES (?, ?, ?, ?, ?)
        `, [name, priceQuantity, priceCoinType, image, description, isVisible])
    const id = result.insertId
    return getPrizeCategory(id)
}

export async function updatePrizeCategory(id, name, priceQuantity, priceCoinType, image, description, isVisible) {
    const [result] = await pool.query(`
        UPDATE prize_categories
        SET name = ?, price_quantity = ?, price_coin_type = ?, image = ?, description = ?, is_visible = ?
        WHERE id = ?
        `, [name, priceQuantity, priceCoinType, image, description, isVisible, id])
    
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

export async function getPrizeItem(id) {
    const [result] = await pool.query(`
        SELECT * FROM prize_items
        WHERE id = ?
        `, [id])
    return result
}

export async function createPrizeItem(name, image, stockAmount, prizeCategoryId) {
    const [result] = await pool.query(`
        INSERT INTO prize_items (name, image, stock_amount, prize_category_id)
        VALUES (?, ?, ?, ?, ?, ?)
        `, [name, description, url, image, stockAmount, prizeCategoryId])
    const id = result.insertId
    return getPrizeItem(id)
}

export async function updatePrizeItem(name, image, stockAmount, prizeCategoryId) {
    const [result] = await pool.query(`
        UPDATE prize_items
        SET name = ?, image = ?, stock_amount = ?, prize_category_id = ?
        WHERE id = ?
        `, [name, image, stockAmount, prizeCategoryId, id])
    
    return 'update success'
}

export async function deletePrizeItem(id) {
    // const [category] = getPrizeCategory(id)
    // if (category)
    // {
        const [result] = await pool.query(`
        DELETE FROM prize_items
        WHERE id = ?
        `, [id])
        return 'delete success'
    // }
    // return 'prize category does not exist'
}

// Colors API
export async function getColors() {
    const [rows] = await pool.query("SELECT * FROM colors")
    return rows
}

export async function getColor(id) {
    const [result] = await pool.query(`
        SELECT * FROM colors
        WHERE id = ?
        `, [id])
    return result
}

export async function createColor(name, isAvailable) {
    const [result] = await pool.query(`
        INSERT INTO colors (name, is_available)
        VALUES (?, ?)
        `, [name, isAvailable])
    const id = result.insertId
    return getColor(id)
}

export async function updateColor(name, isAvailable) {
    const [result] = await pool.query(`
        UPDATE colors
        SET name = ?, is_available = ?
        WHERE id = ?
        `, [name, isAvailable])
    
    return 'update success'
}

export async function deleteColor(id) {
    const [result] = await pool.query(`
    DELETE FROM colors
    WHERE id = ?
    `, [id])
    return 'delete success'
}


// Orders API