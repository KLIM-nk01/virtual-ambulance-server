const express = require("express");

const router = express.Router();
const registrationControllers = require("../controllers/registration");

router.post("/user", registrationControllers.registrationUser_post);

module.exports = router;
