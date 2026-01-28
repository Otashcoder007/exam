import {Router} from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {AppDataSource} from "../../../core/data-source.js";
import {ErrorException} from "../../../core/exception/error.exception.js";
import {validateBody} from "../../../core/middlewares/validate.middleware.js";
import {authenticate} from "../../../core/middlewares/auth.middleware.js";
import {uploadImage} from "../../../core/middlewares/upload.middleware.js";

import {User} from "../entity/user.entity.js";
import {RegisterDto} from "../dto/register.dto.js";
import {LoginDto} from "../dto/login.dto.js";
import {UpdateUserDto} from "../dto/update-user.dto.js";

export const userRouter = Router();

function signToken(user: User) {
    const secret = process.env.SECRET_KEY as string;
    return jwt.sign(
        {sub: user.id, login: user.login},
        secret,
        {expiresIn: "2h"}
    );
}

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register user (optional avatar upload)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [login, password, firstName, lastName]
 *             properties:
 *               login: { type: string }
 *               password: { type: string }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               avatar: { type: string, format: binary }
 *     responses:
 *       201: { description: Created }
 *       409: { description: Login exists }
 */
userRouter.post(
    "/auth/register",
    uploadImage.single("avatar"),
    validateBody(RegisterDto),
    async (req, res, next) => {
        try {
            const repo = AppDataSource.getRepository(User);
            const dto = req.body as RegisterDto;

            const exists = await repo.findOne({where: {login: dto.login}});
            if (exists) return next(new ErrorException(409, "Login already exists"));

            const avatar = req.file ? `uploads/${req.file.filename}` : null;

            const user = repo.create({
                login: dto.login,
                password: await argon2.hash(dto.password),
                firstName: dto.firstName,
                lastName: dto.lastName,
                avatar: avatar ?? undefined
            });

            const saved = await repo.save(user);
            const token = signToken(saved);

            res.status(201).json({
                token,
                user: {
                    id: saved.id,
                    login: saved.login,
                    firstName: saved.firstName,
                    lastName: saved.lastName,
                    avatar: saved.avatar
                }
            });
        } catch {
            next(new ErrorException(500, "Server error"));
        }
    }
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [login, password]
 *             properties:
 *               login: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: OK }
 *       401: { description: Invalid credentials }
 */
userRouter.post(
    "/auth/login",
    validateBody(LoginDto),
    async (req, res, next) => {
        try {
            const repo = AppDataSource.getRepository(User);
            const dto = req.body as LoginDto;

            const user = await repo.findOne({where: {login: dto.login}});
            if (!user) return next(new ErrorException(401, "Invalid credentials"));

            const ok = await argon2.verify(user.password, dto.password);
            if (!ok) return next(new ErrorException(401, "Invalid credentials"));

            const token = signToken(user);

            res.json({
                token,
                user: {
                    id: user.id,
                    login: user.login,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatar: user.avatar
                }
            });
        } catch {
            next(new ErrorException(500, "Server error"));
        }
    }
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK }
 *       401: { description: Unauthorized }
 */
userRouter.get("/auth/me", authenticate(), async (req, res, next) => {
    try {
        // @ts-ignore
        const payload = req.user;
        const userId = Number(payload?.sub || payload?.id);
        if (!userId) return next(new ErrorException(401, "Unauthorized"));

        const repo = AppDataSource.getRepository(User);
        const user = await repo.findOneBy({id: userId});
        if (!user) return next(new ErrorException(404, "User not found"));

        res.json({
            user: {
                id: user.id,
                login: user.login,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar
            }
        });
    } catch {
        next(new ErrorException(500, "Server error"));
    }
});

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update my profile (optional avatar upload)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               avatar: { type: string, format: binary }
 *     responses:
 *       200: { description: OK }
 *       401: { description: Unauthorized }
 */
userRouter.put(
    "/users/me",
    authenticate(),
    uploadImage.single("avatar"),
    validateBody(UpdateUserDto),
    async (req, res, next) => {
        try {
            // @ts-ignore
            const payload = req.user;
            const userId = Number(payload?.sub || payload?.id);
            if (!userId) return next(new ErrorException(401, "Unauthorized"));

            const repo = AppDataSource.getRepository(User);
            const user = await repo.findOneBy({id: userId});
            if (!user) return next(new ErrorException(404, "User not found"));

            const avatar = req.file ? `uploads/${req.file.filename}` : user.avatar;

            repo.merge(user, {
                ...(req.body as UpdateUserDto),
                avatar
            });

            const updated = await repo.save(user);

            res.json({
                user: {
                    id: updated.id,
                    login: updated.login,
                    firstName: updated.firstName,
                    lastName: updated.lastName,
                    avatar: updated.avatar
                }
            });
        } catch {
            next(new ErrorException(500, "Server error"));
        }
    }
);

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Soft delete my user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Deleted }
 *       401: { description: Unauthorized }
 */
userRouter.delete("/users/me", authenticate(), async (req, res, next) => {
    try {
        // @ts-ignore
        const payload = req.user;
        const userId = Number(payload?.sub || payload?.id);
        if (!userId) return next(new ErrorException(401, "Unauthorized"));

        const repo = AppDataSource.getRepository(User);
        const user = await repo.findOneBy({id: userId});
        if (!user) return next(new ErrorException(404, "User not found"));

        await repo.softDelete(userId);
        res.json({message: "Deleted"});
    } catch {
        next(new ErrorException(500, "Server error"));
    }
});
