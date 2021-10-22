const express = require("express");

const router = express.Router();
const registrationControllers = require("../controllers/registration");
// const upload = require("../middleware/multer");
const multer = require("multer");
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../public/userPhoto");
    },
    filename: (req, file, cd) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: fileStorage });

router.post("/user", upload.single("uploaded_file"), (req, res) => {
    try {
        console.log(req.file);
    } catch (e) {
        console.log(e);
        res.send({ message: "Server error" });
    }
});

module.exports = router;
