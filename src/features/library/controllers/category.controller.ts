import {Router} from "express";
import {AppDataSource} from "../../../core/data-source.js";
import {Category} from "../entities/category.entity.js";
import {MetaDto} from "../dtos/meta.dto.js";
import {validateBody} from "../../../core/middlewares/validate.middleware.js";
import {authenticate} from "../../../core/middlewares/auth.middleware.js";
import {ErrorException} from "../../../core/exception/error.exception.js";

export const categoryRouter = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: OK
 */
categoryRouter.get("/categories", async (_req, res) => {
    const repo = AppDataSource.getRepository(Category);
    res.json({items: await repo.find()});
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by id
 *     tags: [Category]
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
categoryRouter.get("/categories/:id", async (req, res, next) => {
    const repo = AppDataSource.getRepository(Category);
    const item = await repo.findOneBy({id: Number(req.params.id)});
    if (!item) return next(new ErrorException(404, "Category not found"));
    res.json({item});
});

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create category
 *     tags: [Category]
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
categoryRouter.post(
    "/categories",
    authenticate(),
    validateBody(MetaDto),
    async (req, res) => {
        const repo = AppDataSource.getRepository(Category);
        const item = await repo.save(repo.create(req.body));
        res.status(201).json({item});
    }
);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Category]
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
categoryRouter.put(
    "/categories/:id",
    authenticate(),
    validateBody(MetaDto),
    async (req, res, next) => {
        const repo = AppDataSource.getRepository(Category);
        const id = Number(req.params.id);

        const item = await repo.findOneBy({id});
        if (!item) return next(new ErrorException(404, "Category not found"));

        repo.merge(item, req.body);
        res.json({item: await repo.save(item)});
    }
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Soft delete category
 *     tags: [Category]
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
categoryRouter.delete(
    "/categories/:id",
    authenticate(),
    async (req, res, next) => {
        const repo = AppDataSource.getRepository(Category);
        const id = Number(req.params.id);

        const item = await repo.findOneBy({id});
        if (!item) return next(new ErrorException(404, "Category not found"));

        await repo.softDelete(id);
        res.json({message: "Deleted"});
    }
);