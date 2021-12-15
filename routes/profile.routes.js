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

router.put(
    "/addDate",
    userAuthMiddleware,
    profileControllers.profileDoctorAddDatePut
);
router.delete(
    "/deleteDate/:idDate",
    userAuthMiddleware,
    profileControllers.profileDoctorDeleteDataDelete
);
router.put(
    "/addAppointment",
    userAuthMiddleware,
    profileControllers.profilePatientAddAppointmentPut
);

router.delete(
    "/deleteAppointment/:idDate",
    userAuthMiddleware,
    profileControllers.profilePatientDeleteAppointmentDelete
);

module.exports = router;
