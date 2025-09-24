import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

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

export async function createPrizeItem(name, description, url, image, isInStock) {
    const [result] = await pool.query(`
        INSERT INTO prize_items (name, description, url, image, isInStock)
        VALUES (?, ?, ?, ?, ?)
        `, [name, description, url, image, isInStock])
    const id = result.insertId
    return getPrizeItem(id)
}

const result = await getPrizeItem(3)
console.log(result)