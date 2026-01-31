import {Router} from "express";
import {AppDataSource} from "../../../core/data-source.js";
import {Language} from "../entities/language.entity.js";
import {MetaDto} from "../dtos/meta.dto.js";
import {validateBody} from "../../../core/middlewares/validate.middleware.js";
import {authenticate} from "../../../core/middlewares/auth.middleware.js";
import {ErrorException} from "../../../core/exception/error.exception.js";
import {Book} from "../entities/book/book.entity.js";
import {Course} from "../entities/course/course.entity.js";
import {LangDto} from "../dtos/lang.dto.js";


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
    res.json({items: await repo.find()});
});

/**
 * @swagger
 * /languages/{id}:
 *   get:
 *     summary: Get language by id
 *     tags: [Language]
 *     parameters:
 *       - in: path
 *         lang: id
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
    const item = await repo.findOneBy({id: Number(req.params.id)});
    if (!item) return next(new ErrorException(404, "Language not found"));
    res.json({item});
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
 *             required: [lang, langCode]
 *             properties:
 *               lang:
 *                 type: string
 *               langCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
languageRouter.post(
    "/languages",
    authenticate(),
    validateBody(LangDto),
    async (req, res) => {
        const repo = AppDataSource.getRepository(Language);
        const item = await repo.save(repo.create(req.body));
        res.status(201).json({item});
    }
);

/**
 * @swagger
 * /languages/{id}:
 *   delete:
 *     summary: Hard delete language (move books/courses to default languageId=1)
 *     tags: [Language]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         lang: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Deleted
 *       400:
 *         description: Cannot delete default language
 *       404:
 *         description: Not found
 */
languageRouter.delete(
    "/languages/:id",
    authenticate(),
    async (req, res, next) => {
        const id = Number(req.params.id);

        if (id === 1)
            return next(new ErrorException(400, "Default language cannot be deleted"));

        const languageRepo = AppDataSource.getRepository(Language);
        const bookRepo = AppDataSource.getRepository(Book);
        const courseRepo = AppDataSource.getRepository(Course);

        const item = await languageRepo.findOneBy({id});
        if (!item) return next(new ErrorException(404, "Language not found"));

        const defaultLanguage = await languageRepo.findOneBy({id: 1});
        if (!defaultLanguage)
            return next(new ErrorException(500, "Default language (id=1) not found"));

        await bookRepo.update({languageId: id}, {languageId: 1});
        await courseRepo.update({languageId: id}, {languageId: 1});
        await languageRepo.delete(id);

        res.json({message: "Deleted"});
    }
);
