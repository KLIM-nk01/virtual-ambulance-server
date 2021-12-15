const express = require("express");
const userAuthMiddleware = require("../middleware/auth.middleware");
const medCentersControllers = require("../controllers/medCenters");
const upload = require("../middleware/multer");

const router = express.Router();

router.get("/", medCentersControllers.medCentersGet);

router.get("/:idMedCenter", medCentersControllers.medCenterGet);

router.post(
    "/createNew",
    userAuthMiddleware,
    upload.single("photo"),
    medCentersControllers.medCentersCreateNewPost
);

router.delete(
    "/deleteMedCenter/:idMedCenter",
    userAuthMiddleware,
    medCentersControllers.deleteMedCentersCreateNewDelete
);

router.patch(
    "/editMedCenter",
    userAuthMiddleware,
    upload.single("photo"),
    medCentersControllers.editMedCenterCreateNewPatch
);

module.exports = router;
