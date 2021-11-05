const express = require("express");
const router = express.Router();
const userAuthController = require("../controllers/userAuth");
const userAuthMiddleware = require("../middleware/auth.middleware");

router.get("/", userAuthMiddleware, userAuthController.userAuthGet);

module.exports = router;
