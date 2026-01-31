import { Router } from "express";
import { AppDataSource } from "../../../core/data-source.js";
import { Difficulty } from "../entities/difficulty.entity.js";
import { MetaDto } from "../dtos/meta.dto.js";
import { validateBody } from "../../../core/middlewares/validate.middleware.js";
import { authenticate } from "../../../core/middlewares/auth.middleware.js";
import { ErrorException } from "../../../core/exception/error.exception.js";
import { Book } from "../entities/book/book.entity.js";
import { Course } from "../entities/course/course.entity.js";
export const difficultyRouter = Router();
/**
 * @swagger
 * /difficulties:
 *   get:
 *     summary: Get all difficulties
 *     tags: [Difficulty]
 *     responses:
 *       200:
 *         description: OK
 */
difficultyRouter.get("/difficulties", async (_req, res) => {
    const repo = AppDataSource.getRepository(Difficulty);
    res.json({ items: await repo.find() });
});
/**
 * @swagger
 * /difficulties/{id}:
 *   get:
 *     summary: Get difficulty by id
 *     tags: [Difficulty]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
difficultyRouter.get("/difficulties/:id", async (req, res, next) => {
    const repo = AppDataSource.getRepository(Difficulty);
    const item = await repo.findOneBy({ id: Number(req.params.id) });
    if (!item)
        return next(new ErrorException(404, "Difficulty not found"));
    res.json({ item });
});
/**
 * @swagger
 * /difficulties:
 *   post:
 *     summary: Create difficulty
 *     tags: [Difficulty]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
difficultyRouter.post("/difficulties", authenticate(), validateBody(MetaDto), async (req, res) => {
    const repo = AppDataSource.getRepository(Difficulty);
    const item = await repo.save(repo.create(req.body));
    res.status(201).json({ item });
});
/**
 * @swagger
 * /difficulties/{id}:
 *   delete:
 *     summary: Hard delete difficulty (move books/courses to default difficultyId={1})
 *     tags: [Difficulty]
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
 *       400:
 *         description: Cannot delete default difficulty
 *       404:
 *         description: Not found
 */
difficultyRouter.delete("/difficulties/:id", authenticate(), async (req, res, next) => {
    const id = Number(req.params.id);
    if (id === 1)
        return next(new ErrorException(400, "Default difficulty cannot be deleted"));
    const difficultyRepo = AppDataSource.getRepository(Difficulty);
    const bookRepo = AppDataSource.getRepository(Book);
    const courseRepo = AppDataSource.getRepository(Course);
    const item = await difficultyRepo.findOneBy({ id });
    if (!item)
        return next(new ErrorException(404, "Difficulty not found"));
    const defaultDifficulty = await difficultyRepo.findOneBy({ id: 1 });
    if (!defaultDifficulty)
        return next(new ErrorException(500, "Default difficulty (id=1) not found"));
    await bookRepo.update({ difficultyId: id }, { difficultyId: 1 });
    await courseRepo.update({ difficultyId: id }, { difficultyId: 1 });
    await difficultyRepo.delete(id);
    res.json({ message: "Deleted" });
});
