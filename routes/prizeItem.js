/**
 * @swagger
 * components:
 *   schemas:
 *     PrizeItem:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - stockCount
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the prize item
 *         name:
 *           type: string
 *           description: The name of the prize
 *         description:
 *           type: string
 *           description: The details about the prize
 *         URL:
 *           type: string
 *           format: link
 *           description: The link to the prize
 *         image:
 *           type: string
 *           format: file path
 *           description: The file path to the image file
 *         stockCount:
 *           type: integer
 *           description: The amount of the prize in stock
 *       example:
 *         id: 1
 *         name: Pokemon Card
 *         description: Trading card of a pokemon
 *         URL: "https://www.pokemon.com/us/pokemon-tcg"
 *         image: "squirtle.png"
 *         stockCount: 5
 */


/**
 * @swagger
 * tags:
 *   name: PrizeItem
 *   description: The prize item managing API
 * /prizeItems:
 *   get:
 *     summary: Lists all the prize items
 *     tags: [PrizeItem]
 *     responses:
 *       200:
 *         description: The list of the prize items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PrizeItem'
 *   post:
 *     summary: Create a new prize
 *     tags: [PrizeItem]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrizeItem'
 *     responses:
 *       200:
 *         description: The created prize.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PrizeItem'
 *       500:
 *         description: Some server error
 * /prizeItems/{id}:
 *   get:
 *     summary: Get the prize item by id
 *     tags: [PrizeItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The prize item id
 *     responses:
 *       200:
 *         description: The prize response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PrizeItem'
 *       404:
 *         description: The prize was not found
 *   put:
 *    summary: Update the prize item by the id
 *    tags: [PrizeItem]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The prize item id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/PrizeItem'
 *    responses:
 *      200:
 *        description: The prize was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PrizeItem'
 *      404:
 *        description: The prize was not found
 *      500:
 *        description: Some error happened
 *   delete:
 *     summary: Remove the prize item by id
 *     tags: [PrizeItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The prize item id
 *
 *     responses:
 *       200:
 *         description: The prize was deleted
 *       404:
 *         description: The prize was not found
 */

