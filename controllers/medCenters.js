const MedCenter = require("../models/MedCenter");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const constants = require("../constants/constants");

exports.medCentersGet = async (req, res) => {
    try {
        const medCenters = await MedCenter.find().populate({
            path: "medStaff",
            populate: {
                path: "userData"
            }
        });

        res.status(200).json(medCenters);
    } catch (e) {
        console.log(e);
        res.send({ message: constants.ERRORS_MESSAGE.SERVER_ERROR });
    }
};

