const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.post("/userAuth", authController.auth_post);

module.exports = router;
