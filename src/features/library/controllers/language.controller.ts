import { Router } from "express";
import { AppDataSource } from "../../../core/data-source.js";
import { Language } from "../entities/language.entity.js";
import { MetaDto } from "../dtos/meta.dto.js";
import { validateBody } from "../../../core/middlewares/validate.middleware.js";
import { authenticate } from "../../../core/middlewares/auth.middleware.js";
import { ErrorException } from "../../../core/exception/error.exception.js";

export const languageRouter = Router();

/**
 * @swagger
 * /languages:
 *   get:
 *     summary: Get all languages
 *     tags: [Language]
 *     responses:
 *       200:
 *         description: OK
 */
languageRouter.get("/languages", async (_req, res) => {
    const repo = AppDataSource.getRepository(Language);
    res.json({ items: await repo.find() });
});

/**
 * @swagger
 * /languages/{id}:
 *   get:
 *     summary: Get language by id
 *     tags: [Language]
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
languageRouter.get("/languages/:id", async (req, res, next) => {
    const repo = AppDataSource.getRepository(Language);
    const item = await repo.findOneBy({ id: Number(req.params.id) });
    if (!item) return next(new ErrorException(404, "Language not found"));
    res.json({ item });
});

/**
 * @swagger
 * /languages:
 *   post:
 *     summary: Create language
 *     tags: [Language]
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
languageRouter.post(
    "/languages",
    authenticate(),
    validateBody(MetaDto),
    async (req, res) => {
        const repo = AppDataSource.getRepository(Language);
        const item = await repo.save(repo.create(req.body));
        res.status(201).json({ item });
    }
);

/**
 * @swagger
 * /languages/{id}:
 *   put:
 *     summary: Update language
 *     tags: [Language]
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
languageRouter.put(
    "/languages/:id",
    authenticate(),
    validateBody(MetaDto),
    async (req, res, next) => {
        const repo = AppDataSource.getRepository(Language);
        const id = Number(req.params.id);

        const item = await repo.findOneBy({ id });
        if (!item) return next(new ErrorException(404, "Language not found"));

        repo.merge(item, req.body);
        res.json({ item: await repo.save(item) });
    }
);

/**
 * @swagger
 * /languages/{id}:
 *   delete:
 *     summary: Soft delete language
 *     tags: [Language]
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
languageRouter.delete(
    "/languages/:id",
    authenticate(),
    async (req, res, next) => {
        const repo = AppDataSource.getRepository(Language);
        const id = Number(req.params.id);

        const item = await repo.findOneBy({ id });
        if (!item) return next(new ErrorException(404, "Language not found"));

        await repo.softDelete(id);
        res.json({ message: "Deleted" });
    }
);