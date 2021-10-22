const express = require("express")

const router = express.Router();

const medCentersControllers = require("../controllers/medCenters")

router.get("/", medCentersControllers.medCenters_get),


module.exports = router;