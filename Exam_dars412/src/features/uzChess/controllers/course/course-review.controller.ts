import {Router} from "express";
import {authenticate} from "../../../../core/middlewares/auth.middleware.js";
import {ErrorException} from "../../../../core/exception/error.exception.js";
import {AppDataSource} from "../../../../core/data-source.js";
import {CourseReview} from "../../entities/course/course-review.entity.js";

export const courseReviewRouter = Router();

/**
 * @swagger
 * /courses/{courseId}/reviews:
 *   post:
 *     summary: Create course review
 *     tags: [CourseReview]
 *     security:
 *       - bearerAuth: []
 */
courseReviewRouter.post(
    "/courses/:courseId/reviews",
    authenticate(),
    async (req, res, next) => {
        try {
            // @ts-ignore
            const payload = req.user;
            const userId = Number(payload?.id);
            const courseId = Number(req.params.courseId);

            if (!userId) return next(new ErrorException(401, "Unauthorized"));

            const repo = AppDataSource.getRepository(CourseReview);

            const review = repo.create({
                rating: Number(req.body.rating),
                comment: req.body.comment,
                userId,
                courseId,
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
 * /course-reviews/{id}:
 *   delete:
 *     summary: Delete course review (hard delete)
 *     tags: [CourseReview]
 *     security:
 *       - bearerAuth: []
 */
courseReviewRouter.delete(
    "/course-reviews/:id",
    authenticate(),
    async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const repo = AppDataSource.getRepository(CourseReview);

            const review = await repo.findOneBy({id});
            if (!review) return next(new ErrorException(404, "Review not found"));

            await repo.delete(id);
            res.json({message: "Deleted"});
        } catch {
            next(new ErrorException(500, "Server error"));
        }
    }
);
