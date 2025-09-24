import express from 'express'

import { getPrizeItems, getPrizeItem, createPrizeItem } from './database.js'

const app = express()
app.use(express.json())

app.get('/', async (req, res) => {
    res.send("Hello World!")
})

app.get("/prizeItems", async (req, res) => {
    const prizeItems = await getPrizeItems()
    res.send(prizeItems)
})

app.get("/prizeItems/:id", async (req, res) => {
    const id = req.params.id
    const prizeItem = await getPrizeItem(id)
    res.send(prizeItem)
})

app.post("/prizeItems", async (req, res) => {
    const { name, description, url, image, isInStock } = req.body
    const prizeItem = await createPrizeItem(name, description, url, image, isInStock)
    res.status(201).send(prizeItem)
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})