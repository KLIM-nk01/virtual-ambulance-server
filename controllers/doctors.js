const Doctor = require("../models/Doctor");

exports.allDoctorsDataGet = async (req, res) => {
    try {
        const doctors = await Doctor.find().populate({
            path: "userData",
        }).populate({
            path: "workTime"
        });
        res.status(200).json(doctors);
    } catch (e) {
        console.log(e);
        res.send({ message: e });
    }
};

