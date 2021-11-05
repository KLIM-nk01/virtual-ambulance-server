const express = require("express");
const router = express.Router();
const doctorsControllers = require("../controllers/doctors");

router.get("/", doctorsControllers.allDoctorsDataGet);

module.exports = router;
