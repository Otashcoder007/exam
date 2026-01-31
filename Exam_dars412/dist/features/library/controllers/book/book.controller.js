import { Router } from "express";
import { Book } from "../../entities/book/book.entity.js";
import { uploadBookAssets } from "../../../../core/middlewares/upload.middleware.js";
import { authenticate } from "../../../../core/middlewares/auth.middleware.js";
import { BookDto } from "../../dtos/book.dto.js";
import { validateBody } from "../../../../core/middlewares/validate.middleware.js";
import { ErrorException } from "../../../../core/exception/error.exception.js";
export const bookRouter = Router();
/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Book]
 *     responses:
 *       200:
 *         description: OK
 */
bookRouter.get("/books", async (_req, res) => {
    const books = await Book.find();
    res.json({ items: books });
});
/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, authorId, categoryId, difficultyId, languageId]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               authorId:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               difficultyId:
 *                 type: integer
 *               languageId:
 *                 type: integer
 *               cover:
 *                 type: string
 *                 format: binary
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
bookRouter.post("/books", authenticate(), uploadBookAssets.fields([
    { name: "cover", maxCount: 1 },
    { name: "file", maxCount: 1 }
]), validateBody(BookDto), async (req, res) => {
    const files = req.files;
    const book = Book.create({
        ...req.body,
        cover: files?.cover?.[0]?.path,
        file: files?.file?.[0]?.path,
        fileMimeType: files?.file?.[0]?.mimetype,
        fileSize: files?.file?.[0]?.size
    });
    await book.save();
    res.status(201).json({ item: book });
});
/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update book (optional cover + file upload)
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               authorId: { type: integer }
 *               categoryId: { type: integer }
 *               difficultyId: { type: integer }
 *               languageId: { type: integer }
 *               cover: { type: string, format: binary }
 *               file: { type: string, format: binary }
 *     responses:
 *       200: { description: OK }
 *       401: { description: Unauthorized }
 *       404: { description: Not found }
 */
bookRouter.put("/books/:id", authenticate(), uploadBookAssets.fields([
    { name: "cover", maxCount: 1 },
    { name: "file", maxCount: 1 }
]), async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const book = await Book.findOneBy({ id });
        if (!book)
            return next(new ErrorException(404, "Book not found"));
        const files = req.files;
        const newCover = files?.cover?.[0]?.path;
        const newFile = files?.file?.[0]?.path;
        if (req.body.title !== undefined)
            book.title = req.body.title;
        if (req.body.description !== undefined)
            book.description = req.body.description;
        if (req.body.authorId !== undefined)
            book.authorId = Number(req.body.authorId);
        if (req.body.categoryId !== undefined)
            book.categoryId = Number(req.body.categoryId);
        if (req.body.difficultyId !== undefined)
            book.difficultyId = Number(req.body.difficultyId);
        if (req.body.languageId !== undefined)
            book.languageId = Number(req.body.languageId);
        if (newCover)
            book.cover = newCover;
        if (newFile) {
            book.file = newFile;
            book.fileMimeType = files?.file?.[0]?.mimetype;
            book.fileSize = files?.file?.[0]?.size;
        }
        await book.save();
        res.json({ item: book });
    }
    catch {
        next(new ErrorException(500, "Server error"));
    }
});
