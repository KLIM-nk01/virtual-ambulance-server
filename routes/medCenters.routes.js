const express = require("express")

const router = express.Router();

const medCentersController = require("../controllers/medCenters")

router.get("/", medCentersController.medCenters_get),


module.exports = router;