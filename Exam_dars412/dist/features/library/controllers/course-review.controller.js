import { Router } from "express";
import { AppDataSource } from "../../../core/data-source.js";
import { CourseReview } from "../entities/course-review.entity.js";
import { ReviewDto } from "../dtos/review.dto.js";
import { validateBody } from "../../../core/middlewares/validate.middleware.js";
import { authenticate } from "../../../core/middlewares/auth.middleware.js";
import { ErrorException } from "../../../core/exception/error.exception.js";
export const courseReviewRouter = Router();
/**
 * @swagger
 * /course-reviews:
 *   get:
 *     summary: Get all course reviews
 *     tags: [CourseReview]
 *     responses:
 *       200:
 *         description: OK
 */
courseReviewRouter.get("/course-reviews", async (_req, res) => {
    const repo = AppDataSource.getRepository(CourseReview);
    res.json({ items: await repo.find() });
});
/**
 * @swagger
 * /courses/{courseId}/reviews:
 *   post:
 *     summary: Create course review
 *     tags: [CourseReview]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
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
courseReviewRouter.post("/courses/:courseId/reviews", authenticate(), validateBody(ReviewDto), async (req, res, next) => {
    const repo = AppDataSource.getRepository(CourseReview);
    // @ts-ignore
    const userId = Number(req.user?.sub);
    const courseId = Number(req.params.courseId);
    const exists = await repo.findOne({ where: { userId, courseId } });
    if (exists)
        return next(new ErrorException(409, "Already reviewed"));
    const review = repo.create({
        userId,
        courseId,
        ...req.body
    });
    await repo.save(review);
    res.status(201).json({ item: review });
});
