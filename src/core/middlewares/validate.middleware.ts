import {NextFunction, Request, Response} from "express";
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";

export function validateBody(dto: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const obj = plainToInstance(dto, req.body);
        const errors = await validate(obj, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (errors.length) {
            return res.status(400).json(errors);
        }

        req.body = obj;
        next();
    };
}
