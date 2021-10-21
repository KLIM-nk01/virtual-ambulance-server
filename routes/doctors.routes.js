const express = require("express");

const router = express.Router();

const doctorsController = require("../controllers/doctors");

router.get("/doctors", doctorsController.allDoctorsData_get);

module.exports = router;
