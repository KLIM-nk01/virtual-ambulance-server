const express = require("express");
const router = express.Router();
const doctorsControllers = require("../controllers/doctors");

router.get("/doctors", doctorsControllers.allDoctorsData_get);

module.exports = router;
