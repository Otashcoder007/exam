import {Router} from "express";
import {Author} from "../entities/author.entity.js";

export const authorRouter = Router();

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags: [Author]
 *     responses:
 *       200:
 *         description: OK
 */
authorRouter.get("/authors", async (_req, res) => {
    const authors = await Author.find();
    res.json({items: authors});
});

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create author
 *     tags: [Author]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName]
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               middleName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
authorRouter.post("/authors", async (req, res) => {
    const author = Author.create(req.body);
    await author.save();
    res.status(201).json({item: author});
});
