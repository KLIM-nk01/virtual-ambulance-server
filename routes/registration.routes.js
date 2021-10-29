const express = require("express");
const router = express.Router();
const registrationControllers = require("../controllers/registration");
const multer = require("multer");

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/userPhoto");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: fileStorage });

router.post(
    "/user",
    upload.single("photo"),
    registrationControllers.registrationUserPost
);

module.exports = router;
