import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure the uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Store files in 'uploads/' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Rename the file to avoid conflicts
    }
});



export const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
