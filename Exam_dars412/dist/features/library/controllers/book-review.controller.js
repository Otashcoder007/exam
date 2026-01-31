import { Router } from "express";
import { AppDataSource } from "../../../core/data-source.js";
import { BookReview } from "../entities/book-review.entity.js";
import { ReviewDto } from "../dtos/review.dto.js";
import { validateBody } from "../../../core/middlewares/validate.middleware.js";
import { authenticate } from "../../../core/middlewares/auth.middleware.js";
import { ErrorException } from "../../../core/exception/error.exception.js";
export const bookReviewRouter = Router();
/**
 * @swagger
 * /book-reviews:
 *   get:
 *     summary: Get all book reviews
 *     tags: [BookReview]
 *     responses:
 *       200:
 *         description: OK
 */
bookReviewRouter.get("/book-reviews", async (_req, res) => {
    const repo = AppDataSource.getRepository(BookReview);
    res.json({ items: await repo.find() });
});
/**
 * @swagger
 * /books/{bookId}/reviews:
 *   post:
 *     summary: Create book review
 *     tags: [BookReview]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       409:
 *         description: Already reviewed
 */
bookReviewRouter.post("/books/:bookId/reviews", authenticate(), validateBody(ReviewDto), async (req, res, next) => {
    const repo = AppDataSource.getRepository(BookReview);
    // @ts-ignore
    const userId = Number(req.user?.sub);
    const bookId = Number(req.params.bookId);
    const exists = await repo.findOne({ where: { userId, bookId } });
    if (exists)
        return next(new ErrorException(409, "Already reviewed"));
    const review = repo.create({
        userId,
        bookId,
        ...req.body
    });
    await repo.save(review);
    res.status(201).json({ item: review });
});
