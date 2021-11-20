const MedCenter = require("../models/MedCenter");
const SERVER_ERROR = require("../constants/constants").ERRORS_MESSAGE;

exports.medCentersGet = async (req, res) => {
    try {
        const medCenters = await MedCenter.find().populate({
            path: "medStaff",
            populate: {
                path: "userData",
            },
        });

        res.status(200).json(medCenters);
    } catch (e) {
        console.log(e);
        res.send({ message: SERVER_ERROR });
    }
};
