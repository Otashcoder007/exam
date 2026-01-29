import {NextFunction, Request, Response} from "express";
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";

export function validateBody(dto: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const obj = plainToInstance(dto, req.body);
        const errors = await validate(obj, {whitelist: true, forbidNonWhitelisted: true,});

        if (errors.length) {
            return res.status(400).json({
                message: "Validation Error",
                errors: errors.map(err => ({field: err.property, constraints: err.constraints}))
            });
        }

        req.body = obj;
        next();
    };
}
