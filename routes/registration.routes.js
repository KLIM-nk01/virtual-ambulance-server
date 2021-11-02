const express = require("express");
const router = express.Router();
const registrationControllers = require("../controllers/registration");

const upload = require("../middleware/multer");

router.post(
    "/user",
    upload.single("photo"),
    registrationControllers.registrationUserPost
);

module.exports = router;
