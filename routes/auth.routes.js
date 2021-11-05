const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.post("/user", authController.authPost);

module.exports = router;
