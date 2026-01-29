import multer from "multer";
import {ErrorException} from "../exception/error.exception.js";

const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (_, file, cb) => {
        const ext = file.originalname.split(".").pop();
        cb(null, `${Date.now()}-${Math.random()}.${ext}`);
    },
});

const allowedImages = ["image/jpeg", "image/png", "image/webp"];
const allowedBooks = ["application/pdf", "application/epub+zip"];

export const bookAssetsFilter = (
    _req: any,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    if (file.fieldname === "cover" && !allowedImages.includes(file.mimetype)) {
        return cb(new ErrorException(401, "Invalid cover type"));
    }
    if (file.fieldname === "file" && !allowedBooks.includes(file.mimetype)) {
        return cb(new ErrorException(401, "Invalid book file type"));
    }
    cb(null, true);
};

export const uploadBookAssets = multer({storage, fileFilter: bookAssetsFilter});
export const uploadImage = multer({storage});
