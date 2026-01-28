import {Router} from "express";
import {AppDataSource} from "../../../core/data-source.js";
import {Difficulty} from "../entities/difficulty.entity.js";
import {MetaDto} from "../dtos/meta.dto.js";
import {validateBody} from "../../../core/middlewares/validate.middleware.js";
import {authenticate} from "../../../core/middlewares/auth.middleware.js";
import {ErrorException} from "../../../core/exception/error.exception.js";

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
    res.json({items: await repo.find()});
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
    const item = await repo.findOneBy({id: Number(req.params.id)});
    if (!item) return next(new ErrorException(404, "Difficulty not found"));
    res.json({item});
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
difficultyRouter.post(
    "/difficulties",
    authenticate(),
    validateBody(MetaDto),
    async (req, res) => {
        const repo = AppDataSource.getRepository(Difficulty);
        const item = await repo.save(repo.create(req.body));
        res.status(201).json({item});
    }
);

/**
 * @swagger
 * /difficulties/{id}:
 *   put:
 *     summary: Update difficulty
 *     tags: [Difficulty]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
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
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
difficultyRouter.put(
    "/difficulties/:id",
    authenticate(),
    validateBody(MetaDto),
    async (req, res, next) => {
        const repo = AppDataSource.getRepository(Difficulty);
        const id = Number(req.params.id);

        const item = await repo.findOneBy({id});
        if (!item) return next(new ErrorException(404, "Difficulty not found"));

        repo.merge(item, req.body);
        res.json({item: await repo.save(item)});
    }
);

/**
 * @swagger
 * /difficulties/{id}:
 *   delete:
 *     summary: Soft delete difficulty
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
 *       404:
 *         description: Not found
 */
difficultyRouter.delete(
    "/difficulties/:id",
    authenticate(),
    async (req, res, next) => {
        const repo = AppDataSource.getRepository(Difficulty);
        const id = Number(req.params.id);

        const item = await repo.findOneBy({id});
        if (!item) return next(new ErrorException(404, "Difficulty not found"));

        await repo.softDelete(id);
        res.json({message: "Deleted"});
    }
);