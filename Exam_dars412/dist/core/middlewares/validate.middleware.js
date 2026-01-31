import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
export function validateBody(dto) {
    return async (req, res, next) => {
        try {
            // ✅ 1) Check DTO import
            if (!dto) {
                return res.status(500).json({
                    message: "DTO is undefined (bad import path / wrong export name)",
                });
            }
            // ✅ 2) Show what body looks like
            // (Swagger multipart sometimes sends body as empty object until multer runs)
            // console.log("BODY:", req.body);
            const obj = plainToInstance(dto, req.body);
            // ✅ 3) If this is undefined, dto import is wrong
            if (!obj) {
                return res.status(500).json({
                    message: "plainToInstance returned undefined (DTO import broken)",
                });
            }
            const errors = await validate(obj, {
                whitelist: true,
                forbidNonWhitelisted: true,
            });
            if (errors.length) {
                return res.status(400).json({
                    message: "Validation Error",
                    errors: errors.map((err) => ({
                        field: err.property,
                        constraints: err.constraints,
                    })),
                });
            }
            req.body = obj;
            next();
        }
        catch (e) {
            return res.status(500).json({
                message: "Validation middleware error",
                error: e?.message ?? String(e),
            });
        }
    };
}
