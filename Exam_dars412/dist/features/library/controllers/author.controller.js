import { Router } from "express";
import { AppDataSource } from "../../../core/data-source.js";
import { Author } from "../entities/author.entity.js";
import { authenticate } from "../../../core/middlewares/auth.middleware.js";
import { ErrorException } from "../../../core/exception/error.exception.js";
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
    const repo = AppDataSource.getRepository(Author);
    res.json({ items: await repo.find() });
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
 *               firstName: { type: string }
 *               lastName: { type: string }
 *     responses:
 *       201:
 *         description: Created
 */
authorRouter.post("/authors", async (req, res) => {
    const repo = AppDataSource.getRepository(Author);
    const author = repo.create(req.body);
    await repo.save(author);
    res.status(201).json({ item: author });
});
/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Hard delete author (CASCADE delete books/courses)
 *     tags: [Author]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
authorRouter.delete("/authors/:id", authenticate(), async (req, res, next) => {
    const repo = AppDataSource.getRepository(Author);
    const id = Number(req.params.id);
    const author = await repo.findOneBy({ id });
    if (!author)
        return next(new ErrorException(404, "Author not found"));
    await repo.delete(id);
    res.json({ message: "Deleted" });
});
