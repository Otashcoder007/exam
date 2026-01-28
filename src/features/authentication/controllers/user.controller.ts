import {Request, Response, Router} from "express";
import {UserCreate} from "../dtos/user/user.create.js";
import argon2 from "argon2";
import {validateDto} from "../../../core/middlewares/validate-body.middleware.js";
import {User} from "../entities/user.entity.js";
import {FindOptionsWhere, Like} from "typeorm";
import {upload} from "../../../core/middlewares/upload.middleware.js";
import {authenticate} from "../../../core/middlewares/authenticate.middleware.js";
import {UserLogin} from "../dtos/user/user.login.js";
import jwt from "jsonwebtoken";

export const user = Router();

/**
 * @openapi
 * /users:
 *   post:
 *     summary: create a new user
 *     description: API endpoint for creating a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - login
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 fullName:
 *                   type: string
 *                 login:
 *                   type: string
 *                 image:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 */
user.post(
    "/users",
    upload.single("image"),
    validateDto(UserCreate),
    async (req: Request, res: Response) => {
        let secretKey = process.env.SECRET_KEY;
        let newUser = User.create(req.body);
        newUser.image = req.file?.path;
        let exists = await User.countBy({login: req.body.login});
        if (exists > 0) {
            return res.status(409).json({message: "Username already exists"});
        }
        // yanayam xavfsiz qilish uchun, SECRET_KEY ham qo'shib yuborish mumkin (PEPPER)
        newUser.password = await argon2.hash(newUser.password + secretKey);
        await User.save(newUser);
        delete newUser.password;
        return res.status(201).json(newUser);
    })

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns the list of all users. Can be filtered by search parameter.
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search users by login or full name
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     example: 1
 *                   fullName:
 *                     type: string
 *                   login:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 */
user.get(
    "/users",
    authenticate(),
    async (req: Request, res: Response) => {
        let whereOptions: FindOptionsWhere<User> = {}
        let search = req.query.search;
        if (search) {
            whereOptions.login = Like(`%${search}%`);
        }
        let users = await User.find({
            select: ['id', 'login', 'fullName', 'createdAt', 'updatedAt'],
            where: whereOptions
        });
        return res.status(200).json(users);

    }
)

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Gets access and refresh tokens
 *     description: Generates a new pair of access and refresh tokens based on user's login and password
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Token successfully generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *
 *
 *
 */
user.post(
    "/users/login",
    validateDto(UserLogin),
    async (req: Request, res: Response) => {
        let user = await User.findOneBy({login: req.body.login});
        if (!user) {
            return res.status(401).json({message: "Noto'g'ri ma'lumotlar"});
        }

        let secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            return res.status(500).json({message: "Serverda xatolik yuz berdi"});
        }

        let correctPassword = await argon2.verify(user.password, req.body.password + secretKey);
        if (!correctPassword) {
            return res.status(401).json({message: "Noto'g'ri ma'lumotlar"})
        }

        let payload = {
            id: user.id,
            role: user.role,
        }

        let accessToken = jwt.sign(payload, secretKey, {expiresIn: "3h"});
        let refreshToken = jwt.sign(payload, secretKey, {expiresIn: "30d"});

        return res.status(200).json({accessToken, refreshToken});
    }
)



