import { Router } from "express";
export const uploadsRouter = Router();
/**
 * @swagger
 * /uploads/{file}:
 *   get:
 *     summary: Get uploaded file
 *     tags: [Uploads]
 *     parameters:
 *       - in: path
 *         name: file
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File returned
 *       404:
 *         description: File not found
 */
uploadsRouter.get("/uploads/:file", (req, res) => {
    res.sendFile(req.params.file, {
        root: "./uploads"
    });
});
