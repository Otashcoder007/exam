import {Router} from "express";
import {authenticate} from "../../../../core/middlewares/auth.middleware.js";
import {ErrorException} from "../../../../core/exception/error.exception.js";
import {AppDataSource} from "../../../../core/data-source.js";
import {BookReview} from "../../entities/book/book-review.entity.js";


export const bookReviewRouter = Router();

/**
 * @swagger
 * /books/{bookId}/reviews:
 *   post:
 *     summary: Create book review
 *     tags: [BookReview]
 *     security:
 *       - bearerAuth: []
 */
bookReviewRouter.post(
    "/books/:bookId/reviews",
    authenticate(),
    async (req, res, next) => {
        try {
            // @ts-ignore
            const payload = req.user;
            const userId = Number(payload?.id);
            const bookId = Number(req.params.bookId);

            if (!userId) return next(new ErrorException(401, "Unauthorized"));

            const repo = AppDataSource.getRepository(BookReview);

            const review = repo.create({
                rating: Number(req.body.rating),
                comment: req.body.comment,
                userId,
                bookId,
            });

            await repo.save(review);
            res.status(201).json({item: review});
        } catch {
            next(new ErrorException(500, "Server error"));
        }
    }
);

/**
 * @swagger
 * /book-reviews/{id}:
 *   delete:
 *     summary: Delete book review (hard delete)
 *     tags: [BookReview]
 *     security:
 *       - bearerAuth: []
 */
bookReviewRouter.delete(
    "/book-reviews/:id",
    authenticate(),
    async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const repo = AppDataSource.getRepository(BookReview);

            const review = await repo.findOneBy({id});
            if (!review) return next(new ErrorException(404, "Review not found"));

            await repo.delete(id);
            res.json({message: "Deleted"});
        } catch {
            next(new ErrorException(500, "Server error"));
        }
    }
);
