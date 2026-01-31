import { Router } from "express";
import { AppDataSource } from "../../../../core/data-source.js";
import { Course } from "../../entities/course/course.entity.js";
import { CourseDto } from "../../dtos/course.dto.js";
import { uploadImage } from "../../../../core/middlewares/upload.middleware.js";
import { authenticate } from "../../../../core/middlewares/auth.middleware.js";
import { validateBody } from "../../../../core/middlewares/validate.middleware.js";
import { ErrorException } from "../../../../core/exception/error.exception.js";
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
courseRouter.post("/courses", authenticate(), uploadImage.single("cover"), // the cover of course's video
validateBody(CourseDto), async (req, res) => {
    const repo = AppDataSource.getRepository(Course);
    const cover = req.file ? req.file.path : undefined;
    const course = repo.create({
        ...req.body,
        cover
    });
    await repo.save(course);
    res.status(201).json({ item: course });
});
/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update course (optional cover upload)
 *     tags: [Course]
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
 *     responses:
 *       200: { description: OK }
 *       401: { description: Unauthorized }
 *       404: { description: Not found }
 */
courseRouter.put("/courses/:id", authenticate(), uploadImage.single("cover"), async (req, res, next) => {
    try {
        const repo = AppDataSource.getRepository(Course);
        const id = Number(req.params.id);
        const course = await repo.findOneBy({ id });
        if (!course)
            return next(new ErrorException(404, "Course not found"));
        if (req.body.title !== undefined)
            course.title = req.body.title;
        if (req.body.description !== undefined)
            course.description = req.body.description;
        if (req.body.authorId !== undefined)
            course.authorId = Number(req.body.authorId);
        if (req.body.categoryId !== undefined)
            course.categoryId = Number(req.body.categoryId);
        if (req.body.difficultyId !== undefined)
            course.difficultyId = Number(req.body.difficultyId);
        if (req.body.languageId !== undefined)
            course.languageId = Number(req.body.languageId);
        if (req.file) {
            course.cover = req.file.path;
        }
        const updated = await repo.save(course);
        res.json({ item: updated });
    }
    catch {
        next(new ErrorException(500, "Server error"));
    }
});
