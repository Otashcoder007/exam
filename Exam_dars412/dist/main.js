import "reflect-metadata";
import express from "express";
import "dotenv/config";
import morgan from "morgan";
import { AppDataSource } from "./core/data-source.js";
import { setupSwagger } from "./core/swagger.js";
import { ErrorException } from "./core/exception/error.exception.js";
import { isInstance } from "class-validator";
import { userRouter } from "./features/auth/controllers/user.controller.js";
import { authorRouter } from "./features/library/controllers/author.controller.js";
import { categoryRouter } from "./features/library/controllers/category.controller.js";
import { difficultyRouter } from "./features/library/controllers/difficulty.controller.js";
import { languageRouter } from "./features/library/controllers/language.controller.js";
import { bookRouter } from "./features/library/controllers/book/book.controller.js";
import { bookReviewRouter } from "./features/library/controllers/book/book-review.controller.js";
import { courseRouter } from "./features/library/controllers/course/course.controller.js";
import { courseReviewRouter } from "./features/library/controllers/course/course-review.controller.js";
await AppDataSource.initialize();
const app = express();
app.use("/uploads", express.static("./uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(userRouter);
app.use(authorRouter);
app.use(categoryRouter);
app.use(difficultyRouter);
app.use(languageRouter);
app.use(bookRouter);
app.use(bookReviewRouter);
app.use(courseRouter);
app.use(courseReviewRouter);
setupSwagger(app);
app.use((err, req, res, next) => {
    if (isInstance(err, ErrorException)) {
        const exc = err;
        return res.status(exc.statusCode).json({ message: exc.message });
    }
    next(err);
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running and listening... you can use swagger in http://localhost:${PORT}/docs/`);
});
