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
    const [rows] = await pool.query("SELECT * FROM prize_categories")
    return rows
}

export async function getPrizeCategory(id) {
    const [result] = await pool.query(`
        SELECT * FROM prize_categories
        WHERE id = ?
        `, [id])
    return result
}

export async function createPrizeCategory(name, priceQuantity, priceCoinType, image, description) {
    const [result] = await pool.query(`
        INSERT INTO prize_categories (name, price_quantity, price_coin_type, image, description)
        VALUES (?, ?, ?, ?, ?)
        `, [name, priceQuantity, priceCoinType, image, description])
    const id = result.insertId
    return getPrizeCategory(id)
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

export async function createPrizeItem(name, description, url, image, isInStock, prizeCategoryId) {
    const [result] = await pool.query(`
        INSERT INTO prize_items (name, description, url, image, isInStock, prize_category_id)
        VALUES (?, ?, ?, ?, ?, ?)
        `, [name, description, url, image, isInStock, prizeCategoryId])
    const id = result.insertId
    return getPrizeItem(id)
}

const result = await getPrizeItem(3)
console.log(result)