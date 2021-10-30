const MedCenter = require("../models/MedCenter");
const Doctor = require("../models/Doctor");

exports.medCentersGet = async (req, res) => {
    try {
        const medCenters = await MedCenter.find();
            
        res.status(200).json(medCenters);
    } catch (e) {
        console.log(e);
        res.send({ message: e });
    }
};

exports.medCentersGet = async (req, res) => {
    try {
        const medCenters = await MedCenter.find();
        res.status(200).json(medCenters);
    } catch (e) {
        console.log(e);
        res.send({ message: e });
    }
}