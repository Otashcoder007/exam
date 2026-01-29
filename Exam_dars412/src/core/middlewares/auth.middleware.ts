import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {ErrorException} from "../exception/error.exception.js";
import {Roles} from "../constants/roles.js";

type JwtPayload = {
    id: number;
    role: Roles;
    iat?: number;
    exp?: number;
};

export function authenticate() {
    return (req: Request, _res: Response, next: NextFunction) => {
        const header = req.headers.authorization;

        if (!header) {
            return next(new ErrorException(401, "Unauthorized"));
        }

        const [type, token] = header.split(" ");

        if (type !== "Bearer" || !token) {
            return next(new ErrorException(401, "Unauthorized"));
        }

        const secret = process.env.SECRET_KEY;
        if (!secret) {
            return next(new ErrorException(500, "SECRET_KEY is missing"));
        }

        try {
            const payload = jwt.verify(token, secret) as JwtPayload;

            if (!payload?.id || !payload?.role) {
                return next(new ErrorException(401, "Unauthorized"));
            }

            // @ts-ignore
            req.user = payload;

            next();
        } catch {
            return next(new ErrorException(401, "Unauthorized"));
        }
    };
}
