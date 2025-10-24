import express from 'express'

import cors from 'cors'

import bodyParser from 'body-parser'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import { getNinjas, getPrizeCategories, getPrizeCategory, createPrizeCategory, updatePrizeCategory, deletePrizeCategory, getPrizeItems, getPrizeItemsByColumn, getPrizeItem, createPrizeItem, getColors, getColor, getColorsByAvailibility, createColor, updateColor, updateColorByAvailibility, deleteColor, getOrders, getOrder, createOrder, updateOrder, updateOrderByStatus,deleteOrder } from './database.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    res.send("Hello World!")
})

// Ninjas API
app.get("/ninjas", async (req, res) => {
    const ninjas = await getNinjas()
    res.send(ninjas)
})


// Prize Category API endpoints
app.get("/prize-categories", async (req, res) => {
    const prizeCategories = await getPrizeCategories()
    res.send(prizeCategories)
})

app.get("/prize-categories/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    const prizeCategory = await getPrizeCategory(id)
    res.send(prizeCategory)
})

app.post("/prize-categories", async (req, res) => {
    const { name, price_quantity, price_coin_type, image, description, is_visible, is_orderable } = req.body
    const prizeCategory = await createPrizeCategory(name, price_quantity, price_coin_type, image, description)
    res.status(201).send(prizeCategory)
})

app.put("/prize-categories/:id", async (req, res) => {
    const id = req.params.id
    const { name, price_quantity, price_coin_type, image, description, is_visible, is_orderable } = req.body

    const message = await updatePrizeCategory(id, name, price_quantity, price_coin_type, image, description, is_visible, is_orderable)
    res.status(200).send(message)
})

app.delete("/prize-categories/:id", async (req, res) => {
    const id = req.params.id
    const message = await deletePrizeCategory(id)
    res.status(201).send(message)
})

// Prize Item API endpoints
app.get("/prize-items", async (req, res) => {
    const isOrderable = req.query.isOrderable;
    const columnName = req.query.select; //select from a column field
    let prizeItems;

    if (columnName)
    {
        prizeItems = await getPrizeItemsByColumn(isOrderable)
    }
    else
    {
        prizeItems = await getPrizeItems()
    }

    res.send(prizeItems)
})

// get prizeItems by orderable
// use join in database with prize category
// where prize_categories.is_orderable = TRUE

// change endpoint to "/prize-categories/:categoryId/prize-items"
// app.get("/prize-items/:id", async (req, res) => {
//     const categoryId = req.params.categoryId
//     const prizeItem = await getPrizeItemByCategory(categoryId)
//     res.send(prizeItem)
// })

app.get("/prize-items/:id", async (req, res) => {
    const id = req.params.id
    const prizeItem = await getPrizeItem(id)
    res.send(prizeItem)
})

// change endpoint to "/prize-categories/:id/prize-items"
app.post("/prize-items", async (req, res) => {
    // const categoryId = req.params
    const { name, image, is_visible, prize_category_id } = req.body
    const prizeItem = await createPrizeItem(name, image, is_visible, prize_category_id)
    res.status(201).send(prizeItem)
})

// Colors API endpoints
app.get("/filament-colors", async (req, res) => {
    const isAvailable = req.query.isAvailable;
    let colors;

    if (isAvailable)
    {
        colors = await getColorsByAvailibility(isAvailable)
    }
    else
    {
        colors = await getColors()
    }
    res.send(colors)
})

app.get("/filament-colors/:id", async (req, res) => {
    const id = req.params.id
    const color = await getColor(id)
    res.send(color)
})

app.post("/filament-colors", async (req, res) => {
    const { name, is_available } = req.body
    const color = await createColor(name, is_available)
    res.status(201).send(color)
})

app.put("/filament-colors/:id", async (req, res) => {
    const id = req.params.id
    const { name, is_available } = req.body

    const message = await updateColor(id, name, is_available)
    res.status(200).send(message)
})

app.patch("/filament-colors/:id", async (req, res) => {
    const id = req.params.id
    const { is_available } = req.body

    const message = await updateColorByAvailibility(id, is_available)
    res.status(200).send(message)
})


// Orders API endpoints
app.get("/orders", async (req, res) => {
    let orders = await getOrders()

    if (req.query.exclude_status)
    {
        orders = orders.filter((item) => item.status != req.query.exclude_status)
    }

    if (req.query.status)
    {
        // add getOrdersByStatus()
        let statusList = req.query.status
        console.log(statusList.length)
        if (typeof statusList === "string")
        {   
            orders = orders.filter((item) => item.status === statusList)
        }
        else
        {
            orders = orders.filter((item) => statusList.includes(item.status))
        }
    }
    else if (req.query.search)
    {
        // add getOrdersBySearch()
        let searchValue = req.query.search.toLowerCase()
        orders = orders.filter((item) => item.first_name.toLowerCase().includes(searchValue) || (item.first_name + " " + item.last_name).toLowerCase().includes(searchValue) || item.print_name.toLowerCase().includes(searchValue) || item.id.toString().includes(searchValue))
    }
    res.send(orders)
})

app.get("/orders/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    const order = await getOrder(id)
    res.send(order)
})

app.post("/orders", async (req, res) => {
    const { first_name, last_name, print_name, link_to_item, color, notes } = req.body
    const order = await createOrder(link_to_item, notes, print_name, first_name, last_name, color)
    res.status(201).send(order)
})

app.put("/orders/:id", async (req, res) => {
    const id = req.params.id
    const { link_to_item, notes, status, prize_item_id, ninja_id, color_id } = req.body

    const message = await updateOrder(id, link_to_item, notes, status, prize_item_id, ninja_id, color_id)
    res.status(200).send(message)
})

app.patch("/orders/:id", async (req, res) => {
    const id = req.params.id
    const { status } = req.body

    const message = await updateOrderByStatus(id, status)
    res.status(200).send(message)
})

app.delete("/orders/:id", async (req, res) => {
    const id = req.params.id
    const message = await deleteOrder(id)
    res.status(201).send(message)
})


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send({message: 'Something broke!', error: err.message})
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