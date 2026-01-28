import multer from "multer";
import fs from "fs";


function getFileType(mime: string): string {
    switch (mime) {
        case "image/jpeg":
        case "image/png":
        case "image/gif":
            return "image";
        case "application/pdf":
            return "document";
        default:
            return "file";
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let subFolder: string = getFileType(file.mimetype);
        let destination: string = `./uploads/${subFolder}`;
        if (!fs.existsSync("./uploads")) {
            fs.mkdirSync("./uploads");
        }
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination);
        }
        cb(null, destination);
    },
    filename: (req, file, cb) => {
        let extension = file.originalname.split(".").pop();
        let prefix = getFileType(file.mimetype);
        let fileName = `${prefix}_${Date.now()}.${extension}`;
        cb(null, fileName);
    }
})

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        return cb(null, true);
    } else {
        cb(new Error("File type not allowed"));
    }
}

export const upload = multer({storage, fileFilter, limits: {fileSize: 1024 * 1024 * 6}});