const express = require("express");
const router = express.Router();
const userAuthMiddleware = require("../middleware/auth.middleware");
const profileControllers = require("../controllers/profile");

router.get(
    "/patient",
    userAuthMiddleware,
    profileControllers.profilePatientGet
);
router.get("/doctor", userAuthMiddleware, profileControllers.profileDoctorGet);

module.exports = router;
