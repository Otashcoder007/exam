import { Router } from "express";
import { AppDataSource } from "../../../core/data-source.js";
import { Course } from "../entities/course.entity.js";
import { CourseDto } from "../dtos/course.dto.js";
import { uploadImage } from "../../../core/middlewares/upload.middleware.js";
import { authenticate } from "../../../core/middlewares/auth.middleware.js";
import { validateBody } from "../../../core/middlewares/validate.middleware.js";
export const courseRouter = Router();
/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Course]
 *     responses:
 *       200:
 *         description: OK
 */
courseRouter.get("/courses", async (_req, res) => {
    const repo = AppDataSource.getRepository(Course);
    res.json({ items: await repo.find() });
});
/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create course (optional cover upload)
 *     tags: [Course]
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
 *     responses:
 *       201:
 *         description: Created
 */
courseRouter.post("/courses", authenticate(), uploadImage.single("cover"), validateBody(CourseDto), async (req, res) => {
    const repo = AppDataSource.getRepository(Course);
    const cover = req.file ? req.file.path : undefined;
    const course = repo.create({
        ...req.body,
        cover
    });
    await repo.save(course);
    res.status(201).json({ item: course });
});
