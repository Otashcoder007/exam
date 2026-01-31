import { Router } from "express";
import { AppDataSource } from "../../../core/data-source.js";
import { Category } from "../entities/category.entity.js";
import { MetaDto } from "../dtos/meta.dto.js";
import { validateBody } from "../../../core/middlewares/validate.middleware.js";
import { authenticate } from "../../../core/middlewares/auth.middleware.js";
import { ErrorException } from "../../../core/exception/error.exception.js";
import { Course } from "../entities/course/course.entity.js";
import { Book } from "../entities/book/book.entity.js";
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
    res.json({ items: await repo.find() });
});
/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by id (gets one category)
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
    const item = await repo.findOneBy({ id: Number(req.params.id) });
    if (!item)
        return next(new ErrorException(404, "Category not found"));
    res.json({ item });
});
/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
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
categoryRouter.post("/categories", authenticate(), validateBody(MetaDto), async (req, res) => {
    const repo = AppDataSource.getRepository(Category);
    const item = await repo.save(repo.create(req.body));
    res.status(201).json({ item });
});
/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Hard delete category (setting book&course default categoryId={1})
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
 *       400:
 *         description: Cannot delete default category
 *       404:
 *         description: Not found
 */
categoryRouter.delete("/categories/:id", authenticate(), async (req, res, next) => {
    const id = Number(req.params.id);
    if (id === 1)
        return next(new ErrorException(400, "Default category cannot be deleted"));
    const categoryRepo = AppDataSource.getRepository(Category);
    const bookRepo = AppDataSource.getRepository(Book);
    const courseRepo = AppDataSource.getRepository(Course);
    const item = await categoryRepo.findOneBy({ id });
    if (!item)
        return next(new ErrorException(404, "Category not found"));
    const defaultCategory = await categoryRepo.findOneBy({ id: 1 });
    if (!defaultCategory)
        return next(new ErrorException(500, "Default category (id=1) not found"));
    await bookRepo.update({ categoryId: id }, { categoryId: 1 });
    await courseRepo.update({ categoryId: id }, { categoryId: 1 });
    await categoryRepo.delete(id);
    res.json({ message: "Deleted" });
});
