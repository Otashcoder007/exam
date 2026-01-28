import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {Roles} from "../constants/roles.js";


export function authenticate(...roles: Roles[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.headers.authorization) {
            return res.status(401).json({message: "Ro'yxatdan o'tmagansiz"});
        }

        // let [_, token] = req.headers.authorization.split(" ");
        let token = req.headers.authorization.split(" ").pop();

        if (!token) {
            return res.status(401).json({message: "Ro'yxatdan o'tmagansiz"});
        }

        let secretKey = process.env.SECRET_KEY;

        if (!secretKey) {
            return res.status(500).json({message: "Something went wrong"});
        }

        try {
            let user = jwt.verify(token, secretKey) as jwt.JwtPayload;
            // @ts-ignore
            req.user = user;

            if (roles.length != 0 && !roles.includes(user.role)) {
                return res.status(403).json({message: "Ruxsat yo'q"});
            }

            next();
        } catch (exc) {
            return res.status(401).json({message: "Ro'yxatdan o'tmagansiz"});
        }
    }
}