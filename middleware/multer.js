const multer = require("multer");
const moment = require("moment");
const uniqid = require("uniqid");
const config = require("config");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/Assets/userPhoto");
    },
    filename: (req, file, cb, next) => {
            const uniqFileName = `${uniqid()}-${file.originalname}`;
            const filePath = `http://localhost:3000/Assets/userPhoto/${uniqFileName}`;
            cb(null, uniqFileName);
            req.body.photo = filePath;
        
    },
});

module.exports = multer({
    storage: storage,
});
