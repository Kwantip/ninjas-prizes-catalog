import express from 'express'

import cors from 'cors'

import bodyParser from 'body-parser'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import { getPrizeCategories, getPrizeCategory, createPrizeCategory, getPrizeItems, getPrizeItem, createPrizeItem } from './database.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    res.send("Hello World!")
})

// Prize Category API endpoints
app.get("/prize-categories", async (req, res) => {
    const prizeCategories = await getPrizeCategories()
    res.send(prizeCategories)
})

app.get("/prize-categories/:id", async (req, res) => {
    const id = req.params.id
    const prizeCategory = await getPrizeCategory(id)
    res.send(prizeCategory)
})

app.post("/prize-categories", async (req, res) => {
    const { name, price_quantity, price_coin_type, image, description } = req.body
    const prizeCategory = await createPrizeCategory( name, price_quantity, price_coin_type, image, description)
    res.status(201).send(prizeCategory)
})

// Prize Item API endpoints
app.get("/prize-items", async (req, res) => {
    const prizeItems = await getPrizeItems()
    res.send(prizeItems)
})

app.get("/prize-items/:id", async (req, res) => {
    const id = req.params.id
    const prizeItem = await getPrizeItem(id)
    res.send(prizeItem)
})

app.post("/prize-items", async (req, res) => {
    const { name, description, url, image, isInStock, prize_category_id } = req.body
    const prizeItem = await createPrizeItem(name, description, url, image, isInStock, prize_category_id)
    res.status(201).send(prizeItem)
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Ninja Prize Catalog API",
            version: "0.1.0",
            description: "CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Code Ninjas",
                url: "https://www.codeninjas.com/ca-cerritos",
            },
        },
        servers: [
            {
                url: "http://localhost:8080",
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
);

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})