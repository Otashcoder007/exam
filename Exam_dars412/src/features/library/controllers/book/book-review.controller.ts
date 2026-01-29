import {Router} from "express";
import {AppDataSource} from "../../../../core/data-source.js";
import {BookReview} from "../../entities/book/book-review.entity.js";
import {ReviewDto} from "../../dtos/review.dto.js";
import {validateBody} from "../../../../core/middlewares/validate.middleware.js";
import {authenticate} from "../../../../core/middlewares/auth.middleware.js";
import {ErrorException} from "../../../../core/exception/error.exception.js";

export const bookReviewRouter = Router();
